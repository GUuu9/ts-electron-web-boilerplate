import type { UILoggerService } from '../../core/ui-logger.service.js';

/**
 * SerialController
 * 역할: 시리얼 통신(SerialPort) 관련 UI 로직을 처리합니다.
 */
export class SerialController {
  private activePort: string | null = null;
  private removeListener: (() => void) | null = null;

  constructor(private readonly logger: UILoggerService) {}

  /**
   * 사용 가능한 시리얼 포트 목록을 새로고침합니다.
   */
  public async refreshPorts(): Promise<void> {
    try {
      const ports = await (window as any).electronAPI.serial.listPorts();
      const select = document.getElementById('serial-port-select') as HTMLSelectElement;
      if (!select) return;

      select.innerHTML = ports.length > 0 
        ? ports.map((p: any) => `<option value="${p.path}">${p.path} ${p.manufacturer ? `(${p.manufacturer})` : ''}</option>`).join('')
        : '<option value="">No ports found</option>';
      
      this.logger.log(`[Serial] Found ${ports.length} ports.`);
    } catch (err: any) {
      this.logger.log(`[Serial] Failed to list ports: ${err.message}`, true);
    }
  }

  /**
   * 시리얼 포트에 연결합니다.
   */
  public async connect(): Promise<void> {
    const pathSelect = document.getElementById('serial-port-select') as HTMLSelectElement;
    const baudSelect = document.getElementById('serial-baud-select') as HTMLSelectElement;
    
    if (!pathSelect.value) {
      this.logger.log('[Serial] Please select a port first.', true);
      return;
    }

    const path = pathSelect.value;
    const baudRate = parseInt(baudSelect.value, 10);

    try {
      const success = await (window as any).electronAPI.serial.openPort(path, baudRate);
      if (success) {
        this.activePort = path;
        this.updateUIStatus(true);
        this.logger.log(`[Serial] Connected to ${path} at ${baudRate} bps.`);

        // 데이터 수신 리스너 등록
        this.removeListener = (window as any).electronAPI.serial.onData(path, (data: Uint8Array) => {
          const text = new TextDecoder().decode(data);
          this.logger.log(`[Serial RX] Received ${data.byteLength} bytes`);
          this.appendLog(`[RX] ${text}`);
        });
      } else {
        this.logger.log(`[Serial] Failed to open port ${path}.`, true);
      }
    } catch (err: any) {
      this.logger.log(`[Serial] Connection error: ${err.message}`, true);
    }
  }

  /**
   * 시리얼 포트 연결을 해제합니다.
   */
  public async disconnect(): Promise<void> {
    if (!this.activePort) return;

    try {
      const success = await (window as any).electronAPI.serial.closePort(this.activePort);
      if (success) {
        if (this.removeListener) this.removeListener();
        this.activePort = null;
        this.updateUIStatus(false);
        this.logger.log('[Serial] Disconnected.');
      }
    } catch (err: any) {
      this.logger.log(`[Serial] Disconnect error: ${err.message}`, true);
    }
  }

  /**
   * 데이터를 전송합니다.
   */
  public async send(): Promise<void> {
    if (!this.activePort) {
      this.logger.log('[Serial] Not connected.', true);
      return;
    }

    const input = document.getElementById('serial-send-input') as HTMLInputElement;
    const data = input.value;
    if (!data) return;

    try {
      // 데이터 뒤에 엔터(\n)를 추가하여 전송
      const success = await (window as any).electronAPI.serial.write(this.activePort, `${data}\r\n`);
      if (success) {
        this.appendLog(`[TX] ${data}`);
        input.value = '';
      }
    } catch (err: any) {
      this.logger.log(`[Serial] Send error: ${err.message}`, true);
    }
  }

  private updateUIStatus(connected: boolean): void {
    const connectBtn = document.getElementById('serial-connect-btn') as HTMLButtonElement;
    const disconnectBtn = document.getElementById('serial-disconnect-btn') as HTMLButtonElement;
    const sendBtn = document.getElementById('serial-send-btn') as HTMLButtonElement;
    const pathSelect = document.getElementById('serial-port-select') as HTMLSelectElement;

    // Connect/Disconnect 버튼은 상태에 따라 숨기거나 보여줌
    if (connectBtn) connectBtn.style.display = connected ? 'none' : 'flex';
    if (disconnectBtn) disconnectBtn.style.display = connected ? 'flex' : 'none';
    
    // 전송 버튼 및 포트 선택은 비활성화 처리
    if (sendBtn) sendBtn.disabled = !connected;
    if (pathSelect) pathSelect.disabled = connected;
  }

  private appendLog(msg: string): void {
    const logArea = document.getElementById('serial-log') as HTMLTextAreaElement;
    if (logArea) {
      logArea.value += `${msg}\n`;
      logArea.scrollTop = logArea.scrollHeight;
    }
  }

  private byteArrayToHexString(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
  }
}
