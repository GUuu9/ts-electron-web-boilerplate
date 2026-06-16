import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { screen } from "@nut-tree-fork/nut-js";

const execAsync = promisify(exec);

/**
 * Vision Server: 화면 캡처 및 Python 연동 이미지 처리 서비스
 */
export class VisionServer {
  private readonly tempDir: string;

  constructor() {
    this.tempDir = path.resolve(process.cwd(), 'temp');
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
    console.log(`[Vision] Temporary directory initialized at: ${this.tempDir}`);
  }

  private getPythonPath(): string {
    // 개발 환경과 배포 환경(앱 내부)의 경로 차이를 고려하여 설정
    const isPackaged = !process.env.NODE_ENV || process.env.NODE_ENV === 'production';
    // Windows와 macOS/Linux의 실행 파일 경로 차이
    const pythonExecutable = process.platform === 'win32' ? 'python.exe' : 'python';
    
    if (isPackaged) {
      // 배포된 앱 내부의 venv 경로
      return path.join(process.resourcesPath, 'venv', 'bin', pythonExecutable);
    } else {
      // 개발 환경에서의 venv 경로
      return path.join(process.cwd(), 'venv', process.platform === 'win32' ? 'Scripts' : 'bin', pythonExecutable);
    }
  }

  private getScriptPath(): string {
    const isPackaged = !process.env.NODE_ENV || process.env.NODE_ENV === 'production';
    if (isPackaged) {
      return path.join(process.resourcesPath, 'scripts', 'vision_processor.py');
    }
    return path.join(process.cwd(), 'scripts', 'vision_processor.py');
  }

  /**
   * 주어진 이미지 파일을 Python으로 처리하여 결과를 Base64로 반환합니다.
   */
  public async processImageFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const python = spawn(this.getPythonPath(), [this.getScriptPath(), filePath]);
      let data = '';
      python.stdout.on('data', (d) => data += d);
      python.on('close', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.image);
        } catch (e) {
          reject(e);
        } finally {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      });
    });
  }

  /**
   * 화면의 특정 영역을 인터랙티브하게 캡처합니다.
   * macOS의 screencapture -i 기능을 사용합니다.
   */
  public async captureRegion(): Promise<string | null> {
    const timestamp = Date.now();
    const tmpPath = path.resolve(this.tempDir, `capture_${timestamp}.png`);

    try {
      if (process.platform === 'darwin') {
        // -i: 상호작용 모드 (영역 선택)
        // -r: 화면 캡처 결과물에 그림자 제외 (선택 사항)
        await execAsync(`screencapture -i "${tmpPath}"`);
        
        // 사용자가 취소했을 경우 파일이 생성되지 않음
        if (fs.existsSync(tmpPath)) {
          return tmpPath;
        }
      } else {
        console.warn('[Vision] captureRegion is currently only supported on macOS');
      }
    } catch (e) {
      console.error('[Vision] captureRegion failed:', e);
    }
    
    return null;
  }

  /**
   * 화면 캡처 후 Python으로 엣지 검출을 수행합니다.
   */
  public async processScreen(): Promise<string> {
    const tmpPath = path.resolve(this.tempDir, 'screenshot.png');
    
    try {
      if (process.platform === 'darwin') {
        await execAsync(`screencapture -x "${tmpPath}"`);
      } else {
        await screen.capture(tmpPath);
      }
    } catch (e) {
      console.error('[Vision] processScreen capture failed:', e);
      throw e;
    }

    return new Promise((resolve, reject) => {
      const python = spawn(this.getPythonPath(), [this.getScriptPath(), tmpPath]);
      let data = '';
      python.stdout.on('data', (d) => data += d);
      python.on('close', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.image);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  /**
   * 화면에서 템플릿 이미지를 찾습니다.
   */
  public async findImage(templatePath: string, similarity: number = 0.8): Promise<{ found: boolean, x?: number, y?: number, confidence: number }> {
    const timestamp = Date.now();
    const screenPath = path.resolve(this.tempDir, `screen_${timestamp}.png`);
    const debugPath = path.resolve(this.tempDir, 'debug_screenshot.png');

    try {
      // macOS의 경우 시스템 내장 명령어가 훨씬 확실함
      if (process.platform === 'darwin') {
        await execAsync(`screencapture -x "${screenPath}"`);
      } else {
        await screen.capture(screenPath);
      }

      // 파일 생성 확인
      if (!fs.existsSync(screenPath)) {
        throw new Error(`파일이 생성되지 않았습니다: ${screenPath}`);
      }

      fs.copyFileSync(screenPath, debugPath);
    } catch (e: any) {
      console.error('[Vision] Capture error:', e.message || e);
      return { found: false, confidence: 0 };
    }

    if (!fs.existsSync(templatePath)) {
      console.error(`[Vision] Template not found: ${templatePath}`);
      return { found: false, confidence: 0 };
    }

    return new Promise((resolve) => {
      const python = spawn(this.getPythonPath(), [this.getScriptPath(), 'FIND', screenPath, templatePath, similarity.toString()]);
      let data = '';
      python.stdout.on('data', (d) => data += d);
      python.on('close', () => {
        try {
          if (!data.trim()) {
            resolve({ found: false, confidence: 0 });
            return;
          }
          const result = JSON.parse(data);
          resolve({
            found: !!result.found,
            x: result.x,
            y: result.y,
            confidence: result.confidence || 0
          });
        } catch (e) {
          console.error('[Vision] JSON Parse Error:', data);
          resolve({ found: false, confidence: 0 });
        } finally {
          if (fs.existsSync(screenPath)) fs.unlinkSync(screenPath);
        }
      });
    });
  }
}
