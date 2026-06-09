import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { screen } from "@nut-tree-fork/nut-js";

/**
 * Vision Server: 화면 캡처 및 Python 연동 이미지 처리 서비스
 */
export class VisionServer {
  constructor() {}

  /**
   * 화면 캡처 후 Python으로 엣지 검출을 수행합니다.
   */
  public async processScreen(): Promise<string> {
    // 임시 파일 경로
    const tmpPath = path.join(os.tmpdir(), 'screenshot.png');
    
    // nut.js의 최신 API 방식에 맞춰 캡처 수행 (screen.capture())
    // 캡처 영역을 명시하지 않으면 전체 화면을 캡처합니다.
    await screen.capture(tmpPath);

    return new Promise((resolve, reject) => {
      // Python 스크립트 실행
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
}
