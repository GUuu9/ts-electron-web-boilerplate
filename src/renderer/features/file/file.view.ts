import { FileViewModel } from './file.viewmodel.js';

/**
 * File View
 */
export class FileView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="file-text"></i> File System</h3>
        <button id="file-open-btn">Open File</button>
        <input type="text" id="file-path" readonly style="width: 100%; margin: 10px 0;" placeholder="No file selected" />
        <textarea id="file-content" style="width: 100%; height: 200px;" placeholder="File content"></textarea>
        <button id="file-save-btn">Save</button>
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

      if (target.id === 'file-open-btn') {
        const result = await this.viewModel.pickAndRead();
        if (result) {
          el.pathInput.value = result.path;
          el.contentInput.value = result.content;
        }
      }

      if (target.id === 'file-save-btn') {
        if (!el.pathInput.value) return alert('No file selected');
        await this.viewModel.saveFile(el.pathInput.value, el.contentInput.value);
        alert('Saved!');
      }
    });
  }
}
