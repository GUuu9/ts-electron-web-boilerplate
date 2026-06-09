import { PersistenceViewModel } from './persistence.viewmodel.js';

/**
 * Persistence View
 */
export class PersistenceView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="database"></i> Data Persistence (Encrypted)</h3>
        <input type="text" id="persist-key" placeholder="Key" value="user-settings" />
        <textarea id="persist-value" placeholder="Value (JSON or String)" style="width: 100%; height: 100px; margin-top: 10px;"></textarea>
        <div style="margin-top: 10px;">
          <button id="persist-save-btn">Save</button>
          <button id="persist-load-btn">Load</button>
        </div>
        <pre id="persist-result" style="margin-top: 15px; background: #f4f4f4; padding: 10px; border-radius: 4px;"></pre>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get keyInput() { return document.getElementById('persist-key') as HTMLInputElement; },
      get valueInput() { return document.getElementById('persist-value') as HTMLTextAreaElement; },
      get saveBtn() { return document.getElementById('persist-save-btn'); },
      get loadBtn() { return document.getElementById('persist-load-btn'); },
      get resultArea() { return document.getElementById('persist-result'); }
    };
  }
}

/**
 * Persistence Binder
 */
export class PersistenceBinder {
  constructor(
    private readonly view: PersistenceView,
    private readonly viewModel: PersistenceViewModel
  ) {}

  public bind() {
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const { keyInput, valueInput, resultArea } = this.view.elements;

      if (target.id === 'persist-save-btn') {
        try {
          const key = keyInput.value;
          const value = valueInput.value;
          await this.viewModel.saveData(key, value);
          alert('Data saved successfully!');
        } catch (error) {
          alert('Save failed');
        }
      }

      if (target.id === 'persist-load-btn') {
        try {
          const key = keyInput.value;
          const data = await this.viewModel.loadData(key);
          if (resultArea) {
            resultArea.innerText = data !== null ? data : 'No data found';
          }
        } catch (error) {
          if (resultArea) resultArea.innerText = 'Load failed';
        }
      }
    });
  }
}
