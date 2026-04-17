/**
 * UILoggerService
 * 역할: 애플리케이션 화면 하단의 로그 패널에 텍스트를 출력하고 관리하는 서비스입니다.
 */
export class UILoggerService {
  private logElement: HTMLElement | null = null;

  constructor() {
    this.logElement = document.getElementById('log-panel');
  }

  /**
   * 로그 패널에 새로운 로그 메시지를 추가합니다.
   * @param message 출력할 메시지
   * @param isError 에러 여부 (true일 경우 붉은색으로 출력)
   */
  public log(message: string, isError = false): void {
    if (!this.logElement) return;
    
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    
    // 에러 여부에 따른 텍스트 색상 지정
    logEntry.style.color = isError ? '#ef4444' : '#10b981';
    logEntry.innerText = `[${time}] ${message}`;
    
    this.logElement.appendChild(logEntry);
    
    // 새 로그가 추가될 때 자동으로 최하단으로 스크롤
    this.logElement.scrollTop = this.logElement.scrollHeight;
  }

  /**
   * 로그 패널의 모든 내용을 지우고 초기 상태로 되돌립니다.
   */
  public clear(): void {
    if (this.logElement) this.logElement.innerHTML = '> Ready to test...';
  }
}
