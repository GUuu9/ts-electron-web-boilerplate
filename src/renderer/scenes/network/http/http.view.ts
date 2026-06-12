import { HttpViewModel } from './http.viewmodel.js';
import httpTemplate from './http.view.html?raw';

/**
 * HttpView (View)
 * UI 템플릿과 DOM 요소 접근만을 담당합니다.
 */
export class HttpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = httpTemplate;
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
