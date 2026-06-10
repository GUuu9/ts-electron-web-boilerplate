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
      const python = spawn('python3', ['scripts/vision_processor.py', tmpPath]);
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
      const python = spawn('python3', ['scripts/vision_processor.py', 'FIND', screenPath, templatePath, similarity.toString()]);
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
