import { TcpViewModel } from './tcp.viewmodel.js';

/**
 * TcpView (View)
 */
export class TcpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="server"></i> TCP Server Test</h3>
        <input type="number" id="tcp-port" value="8888" />
        <button id="tcp-start-btn">Start Server</button>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get portInput() { return document.getElementById('tcp-port') as HTMLInputElement; },
      get startBtn() { return document.getElementById('tcp-start-btn'); }
    };
  }
}

/**
 * TcpBinder (Event Mapper)
 */
export class TcpBinder {
  constructor(
    private readonly view: TcpView,
    private readonly viewModel: TcpViewModel
  ) {}

  public bind() {
    // 렌더링 후 요소를 찾아 이벤트를 바인딩하기 위해 위임 패턴을 사용하거나, 
    // 요소가 나타날 때까지 기다리는 대신 클릭 이벤트를 본체에 걸 수도 있습니다.
    // 여기서는 간단하게 요소가 있을 때만 동작하도록 하되, getter를 통해 지연 평가합니다.
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      if (target && target.id === 'tcp-start-btn') {
        const portInput = document.getElementById('tcp-port') as HTMLInputElement;
        const port = parseInt(portInput.value);
        await this.viewModel.startServer(port);
        alert(`TCP Server started on ${port}`);
      }
    });
  }
}
