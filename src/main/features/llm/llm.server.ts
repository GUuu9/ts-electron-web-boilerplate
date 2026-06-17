import axios, { AxiosInstance } from 'axios';
import fs from 'fs';
import path from 'path';
import { 
  LLMGenerateResponse
} from '../../../shared/llm/models.js';

/**
 * LLM Server: llama-server HTTP API와 통신하는 백엔드 서비스
 */
export class LLMServer {
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string = 'http://localhost:8080'; // llama-server 기본 포트
  private readonly modelsDir: string;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
    });
    this.modelsDir = path.join(process.cwd(), 'models');
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
   */
  public async generate(model: string, prompt: string, system?: string): Promise<LLMGenerateResponse> {
    try {
      // 소형 로컬 모델을 위한 ChatML 포맷 적용 (Qwen, Llama 등)
      let formattedPrompt = '';
      if (system) {
        formattedPrompt += `<|im_start|>system\n${system}<|im_end|>\n`;
      } else {
        formattedPrompt += `<|im_start|>system\nYou are a helpful assistant.<|im_end|>\n`;
      }
      formattedPrompt += `<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`;

      // llama-server의 /completion API에 맞춰 매핑
      const requestData = {
        prompt: formattedPrompt,
        n_predict: 512,
        stream: false,
        stop: ['<|im_end|>', '<|im_start|>', '\nuser', '\nassistant', 'user:', 'assistant:'],
        repeat_penalty: 1.1,
        temperature: 0.7
      };

      const response = await this.axiosInstance.post('/completion', requestData);
      let text = response.data.content || '';
      
      // 불필요한 메타 토큰 및 뒷정리 수행
      text = text.replace(/<\|im_end\|>/g, '').replace(/<\|im_start\|>/g, '').trim();
      
      return {
        text: text,
        model: model,
        done: true
      };
    } catch (error: any) {
      console.error('[LLM] Generate request failed:', error);
      throw new Error(`LLM 생성 요청 중 오류가 발생했습니다: ${error.message}`);
    }
  }

  /**
   * GGUF 모델을 직접 다운로드합니다.
   * progressCallback을 통해 다운로드 진척도를 렌더러로 실시간 전송합니다.
   */
  public async pullModel(modelUrlOrName: string, progressCallback: (message: string) => void): Promise<void> {
    let downloadUrl = modelUrlOrName;
    let fileName = '';

    // URL이 아닌 일반 이름이 왔을 때 기본 모델(예: Qwen 0.5B)을 다운로드하도록 매핑
    if (!modelUrlOrName.startsWith('http://') && !modelUrlOrName.startsWith('https://')) {
      if (modelUrlOrName.toLowerCase().includes('qwen')) {
        downloadUrl = 'https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf';
        fileName = 'qwen2.5-coder-0.5b-instruct-q4_k_m.gguf';
      } else {
        // 기본 Fallback 모델
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
    console.log(`[LLM] Downloading model from ${downloadUrl} to ${targetPath}`);

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

      writer.on('finish', () => {
        console.log(`[LLM] Download completed: ${fileName}`);
        resolve();
      });

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
      console.log(`[LLM] Model file deleted: ${modelName}`);
    } else {
      throw new Error(`모델 파일이 존재하지 않습니다: ${modelName}`);
    }
  }
}
