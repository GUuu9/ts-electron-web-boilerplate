import { FileViewModel } from './file.viewmodel.js';
import fileTemplate from './file.view.html?raw';

/**
 * File View
 */
export class FileView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = fileTemplate;
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
