import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

/**
 * 하드웨어 제어 및 주요 시스템 동작을 기록하는 서비스
 * 파일로 일반 텍스트 로그를 기록합니다.
 */
export class AuditLogger {
  private logPath: string;

  constructor() {
    // 앱 데이터 경로에 audit.log 파일 생성
    const logDir = app.getPath('userData');
    this.logPath = path.join(logDir, 'audit.log');
  }

  /**
   * 주요 동작을 기록합니다.
   * @param action 동작 내용
   */
  public record(action: string): void {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [ACTION] ${action}\n`;

    try {
      fs.appendFileSync(this.logPath, logLine);
      console.log(`[AUDIT] ${action}`);
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }
}
