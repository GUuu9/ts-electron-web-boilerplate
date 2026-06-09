import { MacroViewModel } from './macro.viewmodel.js';

/**
 * Macro View
 */
export class MacroView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="macro-view">
        <h3><i data-lucide="zap"></i> Macro Builder</h3>
        <div class="controls">
          <button id="macro-run-btn">Run Macro</button>
          <button id="macro-stop-btn">Stop</button>
          <button id="macro-save-btn">Save Macro</button>
          <button id="macro-load-btn">Load Macro</button>
        </div>
        <div id="macro-logs" style="width: 100%; height: 150px; overflow-y: auto; background: #222; color: #0f0; margin-top: 10px; padding: 5px; font-size: 12px;"></div>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get runBtn() { return document.getElementById('macro-run-btn'); },
      get stopBtn() { return document.getElementById('macro-stop-btn'); },
      get saveBtn() { return document.getElementById('macro-save-btn'); },
      get loadBtn() { return document.getElementById('macro-load-btn'); },
      get logContainer() { return document.getElementById('macro-logs'); }
    };
  }
}

/**
 * Macro Binder
 */
export class MacroBinder {
  constructor(
    private readonly view: MacroView,
    private readonly viewModel: MacroViewModel
  ) {}

  public bind() {
    const el = this.view.elements;

    el.runBtn?.addEventListener('click', async () => {
      // 예시 데이터: 실제로는 UI에서 구성된 매크로를 가져옴
      await this.viewModel.runMacro({
        id: 'test',
        name: 'Test Macro',
        loopCount: 1,
        actions: [
          { type: 'CLICK', params: { x: 100, y: 100 }, delayBeforeMs: 500 }
        ]
      });
    });

    el.stopBtn?.addEventListener('click', () => {
      this.viewModel.stopMacro();
    });

    el.saveBtn?.addEventListener('click', async () => {
       // 예시 데이터
       await this.viewModel.save({
        id: 'test',
        name: 'Test Macro',
        loopCount: 1,
        actions: []
      });
    });

    el.loadBtn?.addEventListener('click', async () => {
      const data = await this.viewModel.load('test');
      if (data) console.log('Loaded:', data);
    });
  }
}
