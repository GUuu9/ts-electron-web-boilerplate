import axios, { AxiosInstance } from 'axios';
import fs from 'fs';
import path from 'path';
import { 
  LLMGenerateResponse, LLMSession
} from '../../../shared/llm/models.js';
import { AGENT_SYSTEM_PROMPT } from '../../../shared/llm/prompts.js';
import { AgentOrchestrator } from './agent.orchestrator.js';

/**
 * LLM Server: llama-server HTTP API와 통신하는 백엔드 서비스
 */
export class LLMServer {
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string = 'http://localhost:8888'; // llama-server 전용 포트
  private readonly modelsDir: string;
  private orchestrator: AgentOrchestrator | null = null;
  private abortController: AbortController | null = null;
  private lastContext: number[] | null = null;
  private onChunk: ((chunk: string) => void) | null = null;
  private activeSession: LLMSession | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 300000, // 스트리밍을 위해 타임아웃 5분으로 확장
      headers: { 'Content-Type': 'application/json' },
    });
    this.modelsDir = path.join(process.cwd(), 'models');
  }

  /**
   * 활성 세션을 설정합니다.
   */
  public setSession(session: LLMSession | null) {
    this.activeSession = session;
    this.lastContext = session?.context || null;
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
    this.lastContext = null;
    if (this.activeSession) {
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
   * 프롬프트를 기반으로 텍스트를 생성합니다. (llama.cpp /completion 엔드포인트 활용)
   * 에이전트 루프 및 스트리밍이 포함된 버전입니다.
   */
  public async generate(model: string, prompt: string, system?: string): Promise<LLMGenerateResponse> {
    this.abortController = new AbortController();
    let fullResponseText = '';

    // 세션이 있는 경우 메시지 추가 (User)
    if (this.activeSession) {
      this.activeSession.messages.push({ role: 'user', content: prompt });
    }

    try {
      if (!this.orchestrator) {
        const response = await this.generateSimple(model, prompt, system);
        if (this.activeSession) {
          this.activeSession.messages.push({ role: 'assistant', content: response.text });
          this.activeSession.context = this.lastContext || [];
        }
        return response;
      }

      let currentPrompt = prompt;
      let systemPrompt = system || AGENT_SYSTEM_PROMPT;
      
      // 에이전트 루프 (최대 5회)
      if (this.orchestrator) this.orchestrator.resetLastAction();

      for (let i = 0; i < 5; i++) {
        if (this.abortController?.signal.aborted) break;
        console.log(`[Agent] Loop ${i + 1} starting...`);
        
        const response = await this.generateSimple(model, currentPrompt, systemPrompt);
        const text = response.text;

        // 동일한 텍스트 반복 방지
        if (fullResponseText.includes(text) && text.length > 0) {
          console.log('[Agent] Repetitive response detected, ending loop.');
          break;
        }

        fullResponseText += (fullResponseText ? '\n' : '') + text;

        if (this.orchestrator?.isFinalAnswer(text)) {
          console.log('[Agent] Final Answer reached.');
          break;
        }

        const action = this.orchestrator?.parseAction(text);
        if (action) {
          if (this.orchestrator?.isDuplicateAction(action)) {
            console.log('[Agent] Duplicate Action detected, ending loop.');
            if (this.onChunk) this.onChunk('\n[중복된 행동 감지로 중단됨]');
            break;
          }

          if (this.abortController?.signal.aborted) break;
          console.log(`[Agent] Executing Action: ${action.action} on ${action.path}`);
          const observation = await this.orchestrator!.executeAction(action);
          const observationText = this.orchestrator!.formatObservation(observation);
          
          console.log(`[Agent] ${observationText}`);
          if (this.onChunk) this.onChunk(`\n\n${observationText}\n\n`);
          
          // 다음 루프를 위해 컨텍스트 업데이트
          currentPrompt += `\n${text}\n${observationText}`;
        } else {
          // Action이 없으면 답변이 완료된 것으로 간주
          console.log('[Agent] No action found, ending loop.');
          break;
        }
      }

      const finalResponse = {
        text: fullResponseText,
        model: model,
        done: true
      };

      // 세션 메시지 및 컨텍스트 업데이트 (Assistant)
      if (this.activeSession) {
        this.activeSession.messages.push({ role: 'assistant', content: fullResponseText });
        this.activeSession.context = this.lastContext || [];
      }

      return finalResponse;
    } catch (error: any) {
      if (axios.isCancel(error) || error.name === 'AbortError') {
        const abortedText = fullResponseText + '\n[사용자에 의해 중단됨]';
        if (this.activeSession) {
          this.activeSession.messages.push({ role: 'assistant', content: abortedText });
          this.activeSession.context = this.lastContext || [];
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
   * 단순 텍스트 생성 (스트리밍 및 컨텍스트 지원)
   */
  private async generateSimple(model: string, prompt: string, system?: string): Promise<LLMGenerateResponse> {
    try {
      // 소형 로컬 모델을 위한 ChatML 포맷 적용
      let formattedPrompt = '';
      if (!this.lastContext) {
        if (system) {
          formattedPrompt += `<|im_start|>system\n${system}<|im_end|>\n`;
        } else {
          formattedPrompt += `<|im_start|>system\nYou are a helpful assistant.<|im_end|>\n`;
        }
      }
      formattedPrompt += `<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`;

      const requestData = {
        prompt: formattedPrompt,
        n_predict: 4096, // 토큰 제한 확장
        stream: true,    // 스트리밍 활성화
        stop: ['<|im_end|>', '<|im_start|>', '\nuser', '\nassistant', 'user:', 'assistant:', 'Observation:'],
        repeat_penalty: 1.1,
        temperature: 0.2,
        context: this.lastContext || undefined
      };

      const response = await this.axiosInstance.post('/completion', requestData, {
        responseType: 'stream',
        signal: this.abortController?.signal
      });

      let fullText = '';
      
      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          const lines = chunk.toString().split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.content || '';
                fullText += content;
                
                if (this.onChunk) {
                  this.onChunk(content);
                }

                if (data.stop) {
                  this.lastContext = data.context || null;
                }
              } catch (e) {
                // 파싱 실패 무시 (완전한 JSON이 아닐 수 있음)
              }
            }
          }
        });

        response.data.on('end', () => {
          resolve({
            text: fullText.trim(),
            model: model,
            done: true
          });
        });

        response.data.on('error', (err: Error) => {
          reject(err);
        });
      });
    } catch (error: any) {
      console.error('[LLM] Simple Streaming Generate request failed:', error);
      throw error;
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

    const totalLength = parseInt(response.headers['content-length'] || '0', 10);
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
