import { spawn, execSync } from 'child_process';
import net from 'net';
import path from 'path';
import fs from 'fs';

/**
 * LLMServerManager: llama-server 바이너리 프로세스를 관리합니다.
 */
export class LLMServerManager {
  private serverProcess: any = null;
  private currentModel: string | null = null;
  private readonly modelsDir: string;
  // Race condition 방지: 동시에 두 번 start()가 호출되지 않도록 Mutex 역할
  private isStarting: boolean = false;

  constructor() {
    this.modelsDir = path.join(process.cwd(), 'models');
    if (!fs.existsSync(this.modelsDir)) {
      fs.mkdirSync(this.modelsDir, { recursive: true });
    }
  }

  public getActiveModel(): string | null {
    return this.currentModel;
  }

  /**
   * llama-server를 구동합니다.
   * 성공 시 true, 실패 시 false를 반환합니다. (throw 대신 boolean 반환으로 안전 처리)
   */
  public async start(modelName?: string): Promise<boolean> {
    console.log(`[LLM DEBUG] start() called. modelName: ${modelName}, currentModel: ${this.currentModel}`);
    
    // Mutex: 이미 구동 중이면 완료될 때까지 대기
    if (this.isStarting) {
      console.log('[LLM] Another start() is already in progress, waiting...');
      for (let i = 0; i < 100; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (!this.isStarting) break;
      }
    }

    // 추가: 구동 전 8080 포트 점유 프로세스 강제 종료
    await this.forceKillPort(8080);

    const isRunning = await this.checkPort(8080);
    console.log(`[LLM DEBUG] Port 8080 isRunning: ${isRunning}`);
    if (isRunning && (!modelName || modelName === this.currentModel)) {
      console.log('[LLM] llama-server is already running with the requested model.');
      return true;
    }

    this.isStarting = true;
    console.log(`[LLM DEBUG] Setting isStarting = true`);

    try {
      // 포트 점유 프로세스 강제 종료
      await this.forceKillPort(8080);
      
      // 포트가 정리되었는지 최종 확인
      const isStillRunning = await this.checkPort(8080);
      if (isStillRunning) {
        console.log('[LLM] Port 8080 still in use after forceKill, aborting.');
        return false;
      }

      const binaryPath = this.getBundledBinaryPath();
      let modelPath = '';

      if (modelName) {
        modelPath = path.join(this.modelsDir, modelName);
      } else {
        // 자동 선택 로직 변경: 모델 이름이 없을 경우 강제로 첫 번째 것을 선택하지 않음
        // 구동을 원하면 명시적으로 호출하거나, 시스템이 시작할 때만 자동 선택
        const files = fs.readdirSync(this.modelsDir);
        const ggufFiles = files.filter(f => f.endsWith('.gguf'));
        if (ggufFiles.length > 0) {
          // 명시적 선택이 아닐 때만 자동 선택
          if (!modelName) {
            modelPath = path.join(this.modelsDir, ggufFiles[0]);
            this.currentModel = ggufFiles[0];
          }
        }
      }

      if (!binaryPath) {
        console.error('[LLM] llama-server 바이너리를 찾을 수 없습니다.');
        return false;
      }

      if (!modelPath || !fs.existsSync(modelPath)) {
        console.error(`[LLM] 구동할 모델 파일을 찾을 수 없습니다: ${modelPath}`);
        this.currentModel = null;
        return false;
      }

      if (modelName) this.currentModel = modelName;

      // macOS/Linux 실행 권한 부여
      if (process.platform !== 'win32') {
        fs.chmodSync(binaryPath, '755');
      }

      console.log(`[LLM] Starting llama-server: ${binaryPath}`);
      console.log(`[LLM] Model: ${modelPath}`);

      const args = ['-m', modelPath, '--port', '8080', '--host', '0.0.0.0'];

      this.serverProcess = spawn(binaryPath, args, {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      this.serverProcess.stdout?.on('data', (data: any) => {
        console.log(`[llama-server STDOUT] ${data.toString().trim()}`);
      });

      this.serverProcess.stderr?.on('data', (data: any) => {
        console.error(`[llama-server STDERR] ${data.toString().trim()}`);
      });

      this.serverProcess.on('error', (err: any) => {
        console.error(`[llama-server] 프로세스 실행 오류: ${err.message}`);
      });

      this.serverProcess.unref();

      // 포트 바인딩 대기 (최대 60초로 증가)
      console.log('[LLM] Waiting for llama-server to listen on port 8080...');
      for (let i = 0; i < 300; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const active = await this.checkPort(8080);
        if (active) {
          console.log('[LLM] llama-server is ready on port 8080.');
          return true;
        }
      }

      console.error('[LLM] Timeout: llama-server did not bind to port 8080 within 60 seconds.');
      return false;


    } finally {
      this.isStarting = false;
    }
  }

  /**
   * 지정한 모델로 llama-server를 재시작합니다.
   * 성공 여부(boolean)를 반환합니다.
   */
  public async restartWithModel(modelName: string): Promise<boolean> {
    console.log(`[LLM] Restarting llama-server with model: ${modelName}`);
    return await this.start(modelName);
  }

  private getBundledBinaryPath(): string | null {
    const baseDir = path.join(process.cwd(), 'bin', process.platform);
    const fileName = process.platform === 'win32' ? 'llama-server.exe' : 'llama-server';
    const binaryPath = path.join(baseDir, fileName);
    return fs.existsSync(binaryPath) ? binaryPath : null;
  }

  private checkPort(port: number): Promise<boolean> {
    return new Promise(resolve => {
      // 서버가 이미 리스닝 중이라면, net.connect가 성공해야 합니다.
      const socket = net.connect(port, '127.0.0.1');
      
      socket.once('connect', () => {
        socket.end();
        console.log(`[LLM DEBUG] checkPort: Successfully connected to port ${port}`);
        resolve(true); // 포트 점유 중이자 서버가 응답함 → true
      });
      
      socket.once('error', (err) => {
        console.log(`[LLM DEBUG] checkPort: Failed to connect to port ${port}: ${err.message}`);
        resolve(false); // 연결 실패 → 포트 비어있거나 서버 응답 없음 → false
      });
      
      socket.setTimeout(500); // 500ms 타임아웃
      socket.once('timeout', () => {
        socket.destroy();
        resolve(false);
      });
    });
  }

  public async stop() {
    if (this.serverProcess) {
      console.log('[LLM] Sending SIGTERM to llama-server...');
      this.serverProcess.kill('SIGTERM');

      // 3초간 종료 대기
      for (let i = 0; i < 15; i++) {
        try {
          // 프로세스 존재 여부 확인 (0을 보내면 신호를 보내지 않고 존재 여부만 확인)
          process.kill(this.serverProcess.pid, 0);
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (e) {
          // 프로세스가 종료됨
          console.log('[LLM] llama-server exited gracefully.');
          this.serverProcess = null;
          this.currentModel = null;
          return;
        }
      }

      // 3초 후에도 살아있으면 SIGKILL
      console.log('[LLM] llama-server did not exit, sending SIGKILL...');
      this.serverProcess.kill('SIGKILL');
      this.serverProcess = null;
    }
    this.currentModel = null;
  }

  // 포트 점유 프로세스 강제 종료 메서드 추가
  private async forceKillPort(port: number): Promise<void> {
    if (process.platform === 'win32') {
      try {
        execSync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /f /pid %a`);
      } catch (e) {
        console.log('[LLM] No process found on port or failed to kill:', e);
      }
    } else {
      try {
        const pid = execSync(`lsof -t -i:${port}`).toString().trim();
        if (pid) {
          console.log(`[LLM] Killing orphaned process on port ${port}: ${pid}`);
          execSync(`kill -9 ${pid}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (e) {
        // 포트에 프로세스가 없으면 lsof가 에러를 낼 수 있음
      }
    }
  }
}
