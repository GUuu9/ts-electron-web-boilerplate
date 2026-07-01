import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { 
  LLMGenerateResponse, LLMSession, ChatMessage
} from '../../../shared/llm/models.js';
import { AGENT_SYSTEM_PROMPT } from '../../../shared/llm/prompts.js';
import { AgentOrchestrator } from './agent.orchestrator.js';
import { getLlama, LlamaModel, LlamaContext, LlamaChatSession, ChatHistoryItem, Llama } from 'node-llama-cpp';

/**
 * LLM Server: node-llama-cpp 패키지를 활용하여 로컬 LLM을 실행 및 제어하는 서비스
 */
export class LLMServer {
  private readonly modelsDir: string;
  private orchestrator: AgentOrchestrator | null = null;
  private abortController: AbortController | null = null;
  private onChunk: ((chunk: string) => void) | null = null;
  private activeSession: LLMSession | null = null;

  // node-llama-cpp 관련 인스턴스들
  private llama: Llama | null = null;
  private modelInstance: LlamaModel | null = null;
  private contextInstance: LlamaContext | null = null;
  private chatSessionInstance: LlamaChatSession | null = null;
  public currentModelName: string | null = null;
  private currentContextSize: number = 2048;

  constructor() {
    this.modelsDir = path.join(process.cwd(), 'models');
  }

  /**
   * ChatMessage 형식을 node-llama-cpp의 ChatHistoryItem 형식으로 변환합니다.
   */
  private convertToLlamaHistory(messages: ChatMessage[]): ChatHistoryItem[] {
    return messages.map(msg => {
      if (msg.role === 'system') {
        return { type: 'system', text: msg.content };
      } else if (msg.role === 'user') {
        return { type: 'user', text: msg.content };
      } else {
        return { type: 'model', response: [msg.content] };
      }
    });
  }

  /**
   * 활성 세션을 설정합니다.
   */
  public setSession(session: LLMSession | null) {
    this.activeSession = session;
    if (session && this.chatSessionInstance) {
      const history = this.convertToLlamaHistory(session.messages);
      this.chatSessionInstance.setChatHistory(history);
    }
  }

  /**
   * 현재 활성 세션을 가져옵니다.
   */
  public getActiveSession(): LLMSession | null {
    return this.activeSession;
  }

  /**
   * 오케스트레이터를 설정합니다.
   */
  public setOrchestrator(orchestrator: AgentOrchestrator) {
    this.orchestrator = orchestrator;
  }

  /**
   * 텍스트 청크 콜백을 설정합니다.
   */
  public setOnChunk(callback: (chunk: string) => void) {
    this.onChunk = callback;
  }

  /**
   * 컨텍스트를 초기화합니다.
   */
  public resetContext() {
    if (this.chatSessionInstance) {
      this.chatSessionInstance.resetChatHistory();
    }
    if (this.activeSession) {
      this.activeSession.messages = [];
      this.activeSession.context = [];
    }
  }

  /**
   * 생성을 중단합니다.
   */
  public abortGeneration(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      console.log('[LLM] Generation aborted by user.');
    }
  }

  /**
   * 지정한 GGUF 모델을 로드합니다.
   */
  public async loadModel(modelName: string, n_ctx: number = 2048): Promise<boolean> {
    try {
      console.log(`[LLM] Loading model: ${modelName} with context size ${n_ctx}`);
      
      // 기존 리소스 정리
      this.chatSessionInstance = null;
      this.contextInstance = null;
      this.modelInstance = null;
      
      if (!this.llama) {
        this.llama = await getLlama();
      }
      
      const modelPath = path.join(this.modelsDir, modelName);
      if (!fs.existsSync(modelPath)) {
        throw new Error(`Model file not found: ${modelPath}`);
      }
      
      this.modelInstance = await this.llama.loadModel({
        modelPath: modelPath
      });
      
      this.contextInstance = await this.modelInstance.createContext({
        contextSize: n_ctx
      });
      
      // LlamaChatSession 생성
      this.chatSessionInstance = new LlamaChatSession({
        contextSequence: this.contextInstance.getSequence(),
        systemPrompt: this.activeSession?.systemPrompt || AGENT_SYSTEM_PROMPT
      });
      
      // 세션이 있는 경우 히스토리 동기화
      if (this.activeSession) {
        const history = this.convertToLlamaHistory(this.activeSession.messages);
        this.chatSessionInstance.setChatHistory(history);
      }
      
      this.currentModelName = modelName;
      this.currentContextSize = n_ctx;
      
      console.log(`[LLM] Model loaded successfully: ${modelName}`);
      return true;
    } catch (error) {
      console.error('[LLM] Failed to load model:', error);
      return false;
    }
  }

  /**
   * models/ 폴더 내 모든 .gguf 파일을 스캔하여 가져옵니다.
   */
  public async getModels(): Promise<any[]> {
    try {
      if (!fs.existsSync(this.modelsDir)) {
        return [];
      }
      const files = fs.readdirSync(this.modelsDir);
      const ggufFiles = files.filter(f => f.endsWith('.gguf'));
      
      return ggufFiles.map(file => {
        const filePath = path.join(this.modelsDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          modified_at: stats.mtime.toISOString(),
          size: stats.size,
          digest: '',
          details: {
            format: 'gguf',
            family: 'llama',
            families: null,
            parameter_size: 'unknown',
            quantization_level: file.includes('q4') || file.includes('Q4') ? 'Q4' : 'unknown'
          }
        };
      });
    } catch (error) {
      console.error('[LLM] Failed to scan local models folder:', error);
      return [];
    }
  }

  /**
   * 프롬프트를 기반으로 텍스트를 생성합니다. (node-llama-cpp 활용)
   */
  public async generate(model: string, prompt: string, system?: string): Promise<LLMGenerateResponse> {
    this.abortController = new AbortController();
    let fullResponseText = '';

    // 세션이 있는 경우 메시지 추가 (User)
    if (this.activeSession) {
      this.activeSession.messages.push({ role: 'user', content: prompt });
    }

    try {
      // 모델 로드 확인 및 다를 경우 로드
      if (!this.modelInstance || this.currentModelName !== model) {
        const success = await this.loadModel(model, this.currentContextSize);
        if (!success) {
          throw new Error(`Failed to load model: ${model}`);
        }
      }

      // LlamaChatSession 생성 확인
      if (!this.chatSessionInstance && this.contextInstance) {
        this.chatSessionInstance = new LlamaChatSession({
          contextSequence: this.contextInstance.getSequence(),
          systemPrompt: system || AGENT_SYSTEM_PROMPT
        });
        if (this.activeSession) {
          const history = this.convertToLlamaHistory(this.activeSession.messages);
          this.chatSessionInstance.setChatHistory(history);
        }
      }

      if (!this.chatSessionInstance) {
        throw new Error('LlamaChatSession is not initialized.');
      }

      if (!this.orchestrator) {
        // 에이전트 오케스트레이터가 없는 경우 단순 텍스트 생성
        const text = await this.chatSessionInstance.prompt(prompt, {
          signal: this.abortController.signal,
          stopOnAbortSignal: true,
          onTextChunk: (chunk) => {
            if (this.onChunk) {
              this.onChunk(chunk);
            }
          }
        });
        
        fullResponseText = text;
      } else {
        // 에이전트 루프 (최대 5회)
        this.orchestrator.resetLastAction();
        let currentPrompt = prompt;

        for (let i = 0; i < 5; i++) {
          if (this.abortController?.signal.aborted) break;
          console.log(`[Agent] Loop ${i + 1} starting...`);
          
          const text = await this.chatSessionInstance.prompt(currentPrompt, {
            signal: this.abortController.signal,
            stopOnAbortSignal: true,
            onTextChunk: (chunk) => {
              if (this.onChunk) {
                this.onChunk(chunk);
              }
            }
          });

          // 동일한 텍스트 반복 방지
          if (fullResponseText.includes(text) && text.length > 0) {
            console.log('[Agent] Repetitive response detected, ending loop.');
            break;
          }

          fullResponseText += (fullResponseText ? '\n' : '') + text;

          if (this.orchestrator.isFinalAnswer(text)) {
            console.log('[Agent] Final Answer reached.');
            break;
          }

          const action = this.orchestrator.parseAction(text);
          if (action) {
            if (this.orchestrator.isDuplicateAction(action)) {
              console.log('[Agent] Duplicate Action detected, ending loop.');
              if (this.onChunk) this.onChunk('\n[중복된 행동 감지로 중단됨]');
              break;
            }

            if (this.abortController?.signal.aborted) break;
            console.log(`[Agent] Executing Action: ${action.action} on ${action.path}`);
            const observation = await this.orchestrator.executeAction(action);
            const observationText = this.orchestrator.formatObservation(observation);
            
            console.log(`[Agent] ${observationText}`);
            if (this.onChunk) this.onChunk(`\n\n${observationText}\n\n`);
            
            // 다음 루프를 위해 prompt를 Observation으로 설정
            currentPrompt = observationText;
          } else {
            console.log('[Agent] No action found, ending loop.');
            break;
          }
        }
      }

      // 최종 응답을 activeSession에 기록하고 반환
      if (this.activeSession) {
        this.activeSession.messages.push({ role: 'assistant', content: fullResponseText });
        this.activeSession.context = [];
      }

      return {
        text: fullResponseText,
        model: model,
        done: true
      };

    } catch (error: any) {
      if (error.name === 'AbortError' || this.abortController?.signal.aborted) {
        const abortedText = fullResponseText + '\n[사용자에 의해 중단됨]';
        if (this.activeSession) {
          this.activeSession.messages.push({ role: 'assistant', content: abortedText });
          this.activeSession.context = [];
        }
        return { text: abortedText, model, done: true };
      }
      console.error('[LLM Agent] Generate request failed:', error);
      throw new Error(`LLM 에이전트 요청 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      this.abortController = null;
    }
  }

  /**
   * GGUF 모델을 직접 다운로드합니다.
   */
  public async pullModel(modelUrlOrName: string, progressCallback: (message: string) => void): Promise<void> {
    let downloadUrl = modelUrlOrName;
    let fileName = '';

    if (!modelUrlOrName.startsWith('http://') && !modelUrlOrName.startsWith('https://')) {
      if (modelUrlOrName.toLowerCase().includes('qwen')) {
        downloadUrl = 'https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf';
        fileName = 'qwen2.5-coder-0.5b-instruct-q4_k_m.gguf';
      } else {
        downloadUrl = 'https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf';
        fileName = 'qwen2.5-coder-0.5b-instruct-q4_k_m.gguf';
      }
    } else {
      fileName = path.basename(new URL(downloadUrl).pathname);
    }

    if (!fileName.endsWith('.gguf')) {
      fileName += '.gguf';
    }

    const targetPath = path.join(this.modelsDir, fileName);
    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream'
    });

    const contentLength = response.headers['content-length'];
    const totalLength = typeof contentLength === 'string' ? parseInt(contentLength, 10) : (typeof contentLength === 'number' ? contentLength : 0);
    let downloadedBytes = 0;

    const writer = fs.createWriteStream(targetPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk: any) => {
        downloadedBytes += chunk.length;
        if (totalLength > 0) {
          const progressPercent = ((downloadedBytes / totalLength) * 100).toFixed(1);
          const sizeMB = (downloadedBytes / (1024 * 1024)).toFixed(1);
          const totalMB = (totalLength / (1024 * 1024)).toFixed(1);
          progressCallback(`${progressPercent}% (${sizeMB}MB / ${totalMB}MB)`);
        } else {
          const sizeMB = (downloadedBytes / (1024 * 1024)).toFixed(1);
          progressCallback(`다운로드 중... (${sizeMB}MB 수신됨)`);
        }
      });

      writer.on('finish', resolve);
      writer.on('error', (err) => {
        fs.unlink(targetPath, () => {});
        reject(err);
      });
    });
  }

  /**
   * 로컬 모델 파일을 삭제합니다.
   */
  public async removeModel(modelName: string): Promise<void> {
    const filePath = path.join(this.modelsDir, modelName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      throw new Error(`모델 파일이 존재하지 않습니다: ${modelName}`);
    }
  }
}