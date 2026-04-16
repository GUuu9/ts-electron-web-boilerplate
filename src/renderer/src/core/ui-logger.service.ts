export class UILoggerService {
  private logElement: HTMLElement | null = null;

  constructor() {
    this.logElement = document.getElementById('log-panel');
  }

  public log(message: string, isError = false): void {
    if (!this.logElement) return;
    
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.style.color = isError ? '#ef4444' : '#10b981';
    logEntry.innerText = `[${time}] ${message}`;
    
    this.logElement.appendChild(logEntry);
    this.logElement.scrollTop = this.logElement.scrollHeight;
  }

  public clear(): void {
    if (this.logElement) this.logElement.innerHTML = '> Ready to test...';
  }
}
