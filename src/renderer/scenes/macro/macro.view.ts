import { MacroViewModel } from './macro.viewmodel.js';
import { MacroAction, MacroActionType } from './macro.models.js';

/**
 * Macro View
 */
export class MacroView {
  private container: HTMLElement | null = null;

  public render(containerId: string): void {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="macro-view">
        <h3><i data-lucide="zap"></i> Macro Builder</h3>
        <div class="controls">
          <input type="number" id="macro-loop-count" value="1" min="0" placeholder="Loop Count" title="0 = Infinite" />
          <button id="macro-run-btn">Run Macro</button>
          <button id="macro-stop-btn">Stop</button>
          <button id="macro-save-btn">Save Macro</button>
          <button id="macro-load-btn">Load Macro</button>
        </div>
        <div class="builder">
          <table id="macro-action-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Params</th>
                <th>Delay(ms)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="macro-action-list"></tbody>
          </table>
          <div class="add-action-controls">
            <select id="macro-action-type-select">
              <option value="CLICK">Click</option>
              <option value="KEY_INPUT">Key Input</option>
              <option value="WAIT">Wait</option>
            </select>
            <button id="macro-add-action-btn">+</button>
          </div>
        </div>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      actionList: document.getElementById('macro-action-list') as HTMLTableSectionElement | null,
      loopCountInput: document.getElementById('macro-loop-count') as HTMLInputElement | null,
      actionTypeSelect: document.getElementById('macro-action-type-select') as HTMLSelectElement | null
    };
  }

  public updateActionList(actions: MacroAction[]) {
    const list = this.elements.actionList;
    if (!list) return;
    
    list.innerHTML = actions.map((a, i) => `
      <tr class="action-row" data-index="${i}">
        <td>${a.type}</td>
        <td class="params-cell">
          ${a.type === 'CLICK' ? `
            X: <input type="number" class="param-input" data-key="x" data-index="${i}" value="${a.params.x || 0}" />
            Y: <input type="number" class="param-input" data-key="y" data-index="${i}" value="${a.params.y || 0}" />
          ` : a.type === 'KEY_INPUT' ? `
            Text: <input type="text" class="param-input" data-key="text" data-index="${i}" value="${a.params.text || ''}" />
          ` : `
            Img: <span class="image-path" data-index="${i}">${a.params.targetImage || 'Select File...'}</span>
            <button class="browse-image-btn" data-index="${i}">Browse</button>
          `}
        </td>
        <td><input type="number" class="delay-input" data-index="${i}" value="${a.delayBeforeMs || 0}" /></td>
        <td><button class="remove-action-btn" data-index="${i}">X</button></td>
      </tr>
    `).join('');
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
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      
      // Button Actions
      if (target.id === 'macro-run-btn') {
        const loopInput = this.view.elements.loopCountInput;
        const loopCount = loopInput ? parseInt(loopInput.value) : 1;
        const seq = this.viewModel.getSequence();
        seq.loopCount = loopCount;
        this.viewModel.setSequence(seq);
        await this.viewModel.runMacro();
      }
      else if (target.id === 'macro-stop-btn') this.viewModel.stopMacro();
      else if (target.id === 'macro-save-btn') await this.viewModel.save();
      else if (target.id === 'macro-load-btn') await this.viewModel.load('test');
      else if (target.id === 'macro-add-action-btn') {
        const typeSelect = this.view.elements.actionTypeSelect;
        const type = (typeSelect?.value || 'CLICK') as MacroActionType;
        const params = type === 'CLICK' ? { x: 0, y: 0 } : type === 'KEY_INPUT' ? { text: 'a' } : { targetImage: '' };
        this.viewModel.addAction({ type, params });
        this.view.updateActionList(this.viewModel.getSequence().actions);
      }
      else if (target.classList.contains('remove-action-btn')) {
        const index = parseInt(target.getAttribute('data-index') || '-1');
        if (index !== -1) {
          this.viewModel.removeAction(index);
          this.view.updateActionList(this.viewModel.getSequence().actions);
        }
      }
      // Image Browse
      else if (target.classList.contains('browse-image-btn')) {
        const index = parseInt(target.getAttribute('data-index') || '-1');
        if (index !== -1) {
            const filePath = await (window as any).api?.openFileDialog();
            if (filePath) {
                const actions = this.viewModel.getSequence().actions;
                actions[index].params.targetImage = filePath;
                this.view.updateActionList(actions);
            }
        }
      }
    });

    // Parameter and Delay Change Handlers
    document.addEventListener('change', (event) => {
      const target = event.target as HTMLElement;
      const index = parseInt(target.getAttribute('data-index') || '-1');
      if (index === -1) return;

      const actions = this.viewModel.getSequence().actions;
      const action = actions[index];

      if (target.classList.contains('param-input')) {
        const key = target.getAttribute('data-key') as keyof MacroAction['params'];
        (action.params as any)[key] = target.getAttribute('type') === 'number' ? parseInt((target as HTMLInputElement).value) : (target as HTMLInputElement).value;
      } else if (target.classList.contains('delay-input')) {
        action.delayBeforeMs = parseInt((target as HTMLInputElement).value);
      }
    });
  }
}
