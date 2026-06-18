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
  private currentCtx: number = 2048;
  private readonly modelsDir: string;
  // Race condition 방지: 동시에 두 번 start()가 호출되지 않도록 Mutex 역할
  private isStarting: boolean = false;
  private statusCallback: ((status: 'starting' | 'ready' | 'stopped', modelName?: string) => void) | null = null;

  constructor() {
    this.modelsDir = path.join(process.cwd(), 'models');
    if (!fs.existsSync(this.modelsDir)) {
      fs.mkdirSync(this.modelsDir, { recursive: true });
    }
  }

  /**
   * 서버 상태 변경 콜백을 설정합니다.
   */
  public setStatusCallback(callback: (status: 'starting' | 'ready' | 'stopped', modelName?: string) => void) {
    this.statusCallback = callback;
  }

  /**
   * 상태 변경을 알립니다.
   */
  private notifyStatus(status: 'starting' | 'ready' | 'stopped', modelName?: string) {
    if (this.statusCallback) {
      this.statusCallback(status, modelName);
    }
  }

  public getActiveModel(): string | null {
    return this.currentModel;
  }

  /**
   * llama-server를 구동합니다.
   * 성공 시 true, 실패 시 false를 반환합니다. (throw 대신 boolean 반환으로 안전 처리)
   */
  public async start(modelName?: string, n_ctx: number = 2048): Promise<boolean> {
    console.log(`[LLM DEBUG] start() called. modelName: ${modelName}, currentModel: ${this.currentModel}, n_ctx: ${n_ctx}`);
    
    // Mutex: 이미 구동 중이면 완료될 때까지 대기
    if (this.isStarting) {
      console.log('[LLM] Another start() is already in progress, waiting...');
      for (let i = 0; i < 100; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (!this.isStarting) break;
      }
    }

    let targetModelName = modelName;
    if (!targetModelName) {
      const files = fs.readdirSync(this.modelsDir);
      const ggufFiles = files.filter(f => f.endsWith('.gguf'));
      if (ggufFiles.length > 0) {
        targetModelName = ggufFiles[0];
      }
    }

    // 포트 점유 여부 확인 (LLM 전용 포트 8888 사용)
    const isRunning = await this.checkPort(8888);
    // 모델과 컨텍스트 길이가 모두 같으면 재시작 생략
    if (isRunning && (!targetModelName || targetModelName === this.currentModel) && n_ctx === this.currentCtx) {
      console.log('[LLM] llama-server is already running with requested config.');
      this.notifyStatus('ready', this.currentModel || undefined);
      return true;
    }

    this.isStarting = true;
    this.notifyStatus('starting', targetModelName || undefined);

    try {
      // 1. 기존에 관리 중인 프로세스가 있다면 먼저 안전하게 종료
      await this.stop();

      // 2. 포트 점유 프로세스 강제 종료 (자기 자신 제외 및 8888 포트만 정리)
      await this.forceKillPort(8888);
      
      const binaryPath = this.getBundledBinaryPath();
      let modelPath = '';

      if (targetModelName) {
        modelPath = path.join(this.modelsDir, targetModelName);
      }

      if (!binaryPath) {
        console.error('[LLM] llama-server 바이너리를 찾을 수 없습니다.');
        this.notifyStatus('stopped');
        return false;
      }

      if (!modelPath || !fs.existsSync(modelPath)) {
        console.error(`[LLM] 구동할 모델 파일을 찾을 수 없습니다: ${modelPath}`);
        this.currentModel = null;
        this.notifyStatus('stopped');
        return false;
      }

      this.currentModel = targetModelName || null;
      this.currentCtx = n_ctx;

      // macOS/Linux 실행 권한 부여
      if (process.platform !== 'win32') {
        fs.chmodSync(binaryPath, '755');
      }

      console.log(`[LLM] Starting llama-server on port 8888: ${binaryPath}`);
      console.log(`[LLM] Model: ${modelPath} (ctx: ${n_ctx})`);

      const args = ['-m', modelPath, '--port', '8888', '--host', '0.0.0.0', '-c', n_ctx.toString()];

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
      console.log('[LLM] Waiting for llama-server to listen on port 8888...');
      for (let i = 0; i < 300; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const active = await this.checkPort(8888);
        if (active) {
          console.log('[LLM] llama-server is ready on port 8888.');
          this.notifyStatus('ready', this.currentModel || undefined);
          return true;
        }
      }

      console.error('[LLM] Timeout: llama-server did not bind to port 8888 within 60 seconds.');
      this.notifyStatus('stopped');
      return false;

    } catch (err) {
      console.error('[LLM] Error during start:', err);
      this.notifyStatus('stopped');
      return false;
    } finally {
      this.isStarting = false;
    }
  }

  /**
   * 지정한 모델로 llama-server를 재시작합니다.
   * 성공 여부(boolean)를 반환합니다.
   */
  public async restartWithModel(modelName: string, n_ctx: number = 2048): Promise<boolean> {
    console.log(`[LLM] Restarting llama-server with model: ${modelName}, ctx: ${n_ctx}`);
    return await this.start(modelName, n_ctx);
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
        resolve(true); // 포트 점유 중이자 서버가 응답함 → true
      });
      
      socket.once('error', (err) => {
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
          this.notifyStatus('stopped');
          return;
        }
      }

      // 3초 후에도 살아있으면 SIGKILL
      console.log('[LLM] llama-server did not exit, sending SIGKILL...');
      this.serverProcess.kill('SIGKILL');
      this.serverProcess = null;
    }
    this.currentModel = null;
    this.notifyStatus('stopped');
  }

  // 포트 점유 프로세스 강제 종료 메서드 추가
  private async forceKillPort(port: number): Promise<void> {
    const currentPid = process.pid; // 현재 Electron 프로세스 PID

    if (process.platform === 'win32') {
      try {
        execSync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do (if not "%a"=="${currentPid}" taskkill /f /pid %a)`);
      } catch (e) {
        // console.log('[LLM] No process found on port or failed to kill:', e);
      }
    } else {
      try {
        const pidOutput = execSync(`lsof -t -i:${port}`).toString().trim();
        if (pidOutput) {
          const pids = pidOutput.split('\n');
          for (const pidStr of pids) {
            const pid = parseInt(pidStr, 10);
            // 자기 자신의 PID이거나 유효하지 않은 PID이면 건너뜀
            if (!pid || pid === currentPid) {
              console.log(`[LLM] Skipping kill for current or invalid PID: ${pid}`);
              continue;
            }
            
            console.log(`[LLM] Killing process on port ${port}: ${pid}`);
            try {
              execSync(`kill -9 ${pid}`);
            } catch (err) {
              // 이미 종료된 프로세스일 수 있음
            }
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (e) {
        // 포트에 프로세스가 없으면 lsof가 에러를 낼 수 있음
      }
    }
  }
}
