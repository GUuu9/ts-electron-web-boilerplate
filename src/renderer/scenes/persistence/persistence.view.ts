import { PersistenceViewModel } from './persistence.viewmodel.js';
import persistenceTemplate from './persistence.view.html?raw';

/**
 * Persistence View
 */
export class PersistenceView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = persistenceTemplate;
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
