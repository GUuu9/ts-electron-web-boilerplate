import { HttpViewModel } from './http.viewmodel.js';

/**
 * HttpView (View)
 * UI 템플릿과 DOM 요소 접근만을 담당합니다.
 */
export class HttpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container http-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="globe"></i> HTTP Test</h3>
        </header>
        <section class="view-content" style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="url-input" value="https://jsonplaceholder.typicode.com/todos/1" style="flex: 1;" />
            <button id="fetch-btn" class="btn btn-primary"><i data-lucide="download"></i> Fetch Data</button>
          </div>
          <pre id="result-area" style="background: var(--input-bg); border: 1px solid var(--border); padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text); min-height: 100px; overflow-x: auto;"></pre>
        </section>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get urlInput() { return document.getElementById('url-input') as HTMLInputElement; },
      get fetchBtn() { return document.getElementById('fetch-btn'); },
      get resultArea() { return document.getElementById('result-area'); }
    };
  }
}

/**
 * HttpBinder (Event Mapper)
 * UI 요소와 ViewModel의 로직을 연결합니다.
 */
export class HttpBinder {
  constructor(
    private readonly view: HttpView,
    private readonly viewModel: HttpViewModel
  ) {}

  public bind() {
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      if (target.id === 'fetch-btn' || target.closest('#fetch-btn')) {
        const { urlInput, resultArea } = this.view.elements;
        if (resultArea) resultArea.innerText = 'Loading...';
        
        try {
          const data = await this.viewModel.fetchData(urlInput.value);
          if (resultArea) resultArea.innerText = JSON.stringify(data, null, 2);
        } catch (error) {
          if (resultArea) resultArea.innerText = 'Error: ' + (error as any).message;
        }
      }
    });
  }
}
