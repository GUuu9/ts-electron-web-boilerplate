import { FileViewModel } from './file.viewmodel.js';

/**
 * File View
 */
export class FileView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container file-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="file-text"></i> File System</h3>
          <div class="view-actions">
            <button id="file-open-btn" class="btn btn-outline"><i data-lucide="folder-open"></i> Open File</button>
            <button id="file-save-btn" class="btn btn-primary"><i data-lucide="save"></i> Save</button>
          </div>
        </header>

        <section class="view-content" style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label>File Path</label>
            <input type="text" id="file-path" readonly placeholder="No file selected" style="width: 100%;" />
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
            <label>Content</label>
            <textarea id="file-content" placeholder="File content" style="width: 100%; height: 400px; font-family: monospace;"></textarea>
          </div>
        </section>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get pathInput() { return document.getElementById('file-path') as HTMLInputElement; },
      get contentInput() { return document.getElementById('file-content') as HTMLTextAreaElement; },
      get openBtn() { return document.getElementById('file-open-btn'); },
      get saveBtn() { return document.getElementById('file-save-btn'); }
    };
  }
}

/**
 * File Binder
 */
export class FileBinder {
  constructor(
    private readonly view: FileView,
    private readonly viewModel: FileViewModel
  ) {}

  public bind() {
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const el = this.view.elements;

      if (target.id === 'file-open-btn' || target.closest('#file-open-btn')) {
        const result = await this.viewModel.pickAndRead();
        if (result) {
          el.pathInput.value = result.path;
          el.contentInput.value = result.content;
        }
      }

      if (target.id === 'file-save-btn' || target.closest('#file-save-btn')) {
        if (!el.pathInput.value) return alert('No file selected');
        await this.viewModel.saveFile(el.pathInput.value, el.contentInput.value);
        alert('Saved!');
      }
    });
  }
}
