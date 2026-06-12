import { PersistenceViewModel } from './persistence.viewmodel.js';

/**
 * Persistence View
 */
export class PersistenceView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container persistence-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="database"></i> Data Persistence (Encrypted)</h3>
        </header>
        <section class="view-content" style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label>Key</label>
            <input type="text" id="persist-key" placeholder="Key" value="user-settings" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label>Value (JSON or String)</label>
            <textarea id="persist-value" placeholder="Value" style="height: 150px;"></textarea>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button id="persist-save-btn" class="btn btn-primary"><i data-lucide="save"></i> Save</button>
            <button id="persist-load-btn" class="btn btn-outline"><i data-lucide="folder-open"></i> Load</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem;">
            <label>Result</label>
            <pre id="persist-result" style="background: var(--input-bg); border: 1px solid var(--border); padding: 1rem; border-radius: 0.5rem; font-size: 0.85rem; color: var(--text); min-height: 50px;">No data loaded</pre>
          </div>
        </section>
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

      if (target.id === 'persist-save-btn' || target.closest('#persist-save-btn')) {
        try {
          const key = keyInput.value;
          const value = valueInput.value;
          await this.viewModel.saveData(key, value);
          alert('Data saved successfully!');
        } catch (error) {
          alert('Save failed');
        }
      }

      if (target.id === 'persist-load-btn' || target.closest('#persist-load-btn')) {
        try {
          const key = keyInput.value;
          const data = await this.viewModel.loadData(key);
          if (resultArea) {
            resultArea.innerText = data !== null ? data!.toString() : 'No data found';
          }
        } catch (error) {
          if (resultArea) resultArea.innerText = 'Load failed';
        }
      }
    });
  }
}
