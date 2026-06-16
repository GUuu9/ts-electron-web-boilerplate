import { MacroViewModel } from './macro.viewmodel.js';
import { MacroAction, MacroActionType } from './macro.models.js';
import macroTemplate from './macro.view.html?raw';

/**
 * Macro View
 * 매크로 빌더의 UI 렌더링 및 요소 접근을 담당합니다.
 */
export class MacroView {
  private container: HTMLElement | null = null;
  private viewModel!: MacroViewModel;

  public render(containerId: string): void {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.container.innerHTML = macroTemplate;
    (window as any).lucide?.createIcons();

    // 페이지 진입 시 데이터 초기화 및 화면 표시
    const currentSeq = this.viewModel.init();
    this.updateActionList(currentSeq.actions);
    
    const elements = this.elements;
    if (elements.loopCountInput) {
      elements.loopCountInput.value = currentSeq.loopCount.toString();
    }
  }

  public destroy() {
    this.viewModel.stopMacro();
  }

  public get elements() {
    return {
      actionList: document.getElementById('macro-action-list') as HTMLTableSectionElement | null,
      loopCountInput: document.getElementById('macro-loop-count') as HTMLInputElement | null,
    };
  }

  public highlightAction(index: number) {
    const list = this.elements.actionList;
    if (!list) return;

    const rows = list.querySelectorAll('.action-row');
    rows.forEach((row, i) => {
      if (i === index) row.classList.add('is-running');
      else row.classList.remove('is-running');
    });
  }

  public updateActionList(actions: MacroAction[], currentIndex: number = -1) {
    const list = this.elements.actionList;
    if (!list) return;
    
    list.innerHTML = actions.map((a, i) => `
      <tr class="action-row ${i === currentIndex ? 'is-running' : ''}" data-index="${i}" draggable="true">
        <td class="type-col">
          <span class="action-badge">${a.type.replace('_', ' ')}</span>
          <input type="text" class="desc-input" data-index="${i}" placeholder="Add a note..." value="${a.description || ''}" />
        </td>
        <td class="params-col">
          ${this.renderParams(a, i)}
        </td>
        <td class="delay-col">
          <div class="param-item">
            <input type="number" class="delay-input" data-index="${i}" value="${a.delayBeforeMs || 0}" style="width: 60px;" />
            <span style="font-size: 0.7rem; color: var(--text-dim)">ms</span>
          </div>
        </td>
        <td class="control-col">
          <button class="remove-action-btn" data-index="${i}" title="Remove action">&times;</button>
        </td>
      </tr>
    `).join('');
    (window as any).lucide?.createIcons();
  }

  private renderParams(a: MacroAction, i: number): string {
    switch (a.type) {
      case 'CLICK':
      case 'RIGHT_CLICK':
      case 'DOUBLE_CLICK':
      case 'MOVE':
        return `
          <div class="param-group">
            <div class="param-item"><label>X</label><input type="number" class="param-input" data-key="x" data-index="${i}" value="${a.params.x || 0}" style="width: 60px;" /></div>
            <div class="param-item"><label>Y</label><input type="number" class="param-input" data-key="y" data-index="${i}" value="${a.params.y || 0}" style="width: 60px;" /></div>
            <button class="btn-icon pick-coord-btn" data-index="${i}" title="Pick with F2 key"><i data-lucide="mouse-pointer-2" style="width:14px;height:14px;"></i> <small>F2</small></button>
          </div>
        `;
      case 'DRAG':
        return `
          <div class="param-group">
            <div class="param-item"><label>From</label><input type="number" class="param-input" data-key="x" data-index="${i}" value="${a.params.x || 0}" style="width: 60px;" />, <input type="number" class="param-input" data-key="y" data-index="${i}" value="${a.params.y || 0}" style="width: 60px;" /></div>
            <div class="param-item"><label>To</label><input type="number" class="param-input" data-key="toX" data-index="${i}" value="${a.params.toX || 0}" style="width: 60px;" />, <input type="number" class="param-input" data-key="toY" data-index="${i}" value="${a.params.toY || 0}" style="width: 60px;" /></div>
          </div>
        `;
      case 'SCROLL':
        return `<div class="param-item"><label>Amount</label><input type="number" class="param-input" data-key="scrollAmount" data-index="${i}" value="${a.params.scrollAmount || 0}" style="width: 80px;" /></div>`;
      case 'KEY_INPUT':
        return `<div class="param-item" style="width:100%"><label>Text</label><input type="text" class="param-input" style="flex:1" data-key="text" data-index="${i}" value="${a.params.text || ''}" /></div>`;
      case 'KEY_PRESS':
        return `
          <div class="param-group">
            <div class="param-item"><label>Key</label><input type="text" class="param-input" data-key="key" data-index="${i}" value="${a.params.key || ''}" placeholder="e.g. enter, ctrl+c" /></div>
            <div class="param-item"><label>Duration</label><input type="number" class="param-input" data-key="durationMs" data-index="${i}" value="${a.params.durationMs || 0}" style="width: 70px;" /> <span style="font-size: 0.7rem; color: var(--text-dim)">ms</span></div>
          </div>
        `;
      case 'WAIT':
        return `<div class="param-item"><label>Time</label><input type="number" class="param-input" data-key="durationMs" data-index="${i}" value="${a.params.durationMs || 1000}" style="width: 70px;" /> <span style="font-size: 0.7rem; color: var(--text-dim)">ms</span></div>`;
      case 'IMAGE_SEARCH':
        return `
          <div class="image-search-box">
            <div class="param-group">
              <div class="image-path-container" style="flex:1">
                <i data-lucide="image" style="width:12px;height:12px;"></i>
                <span class="image-path">${a.params.targetImage || 'No image selected'}</span>
              </div>
              <button class="btn btn-outline browse-image-btn" data-index="${i}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Browse</button>
              <button class="btn btn-outline capture-image-btn" data-index="${i}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" title="Capture region">
                <i data-lucide="camera" style="width:12px;height:12px;"></i> Capture
              </button>
              <div class="param-item"><label>Sim</label><input type="number" class="param-input" data-key="similarity" data-index="${i}" value="${a.params.similarity || 0.8}" step="0.1" min="0" max="1" style="width:50px;" /></div>
            </div>
            <div class="param-group">
              <div class="param-item"><label>Timeout</label><input type="number" class="param-input" data-key="timeoutMs" data-index="${i}" value="${a.params.timeoutMs || 5000}" style="width:70px;" /></div>
              <div class="param-item">
                <label>Success</label>
                <select class="param-input" data-key="actionOnSuccess" data-index="${i}">
                  <option value="NONE" ${a.params.actionOnSuccess === 'NONE' ? 'selected' : ''}>None</option>
                  <option value="CLICK" ${a.params.actionOnSuccess === 'CLICK' ? 'selected' : ''}>Click</option>
                  <option value="DOUBLE_CLICK" ${a.params.actionOnSuccess === 'DOUBLE_CLICK' ? 'selected' : ''}>Double Click</option>
                  <option value="MOVE" ${a.params.actionOnSuccess === 'MOVE' ? 'selected' : ''}>Move</option>
                </select>
              </div>
              <div class="param-item">
                <label>Failure</label>
                <select class="param-input" data-key="actionOnFailure" data-index="${i}">
                  <option value="CONTINUE" ${a.params.actionOnFailure === 'CONTINUE' ? 'selected' : ''}>Continue</option>
                  <option value="STOP" ${a.params.actionOnFailure === 'STOP' ? 'selected' : ''}>Stop</option>
                </select>
              </div>
            </div>
          </div>
        `;
      default: return '';
    }
  }
}

/**
 * Macro Binder
 */
export class MacroBinder {
  private boundHandler: (event: Event) => void;

  constructor(
    private readonly view: MacroView,
    private readonly viewModel: MacroViewModel
  ) {
    this.boundHandler = this.handleClick.bind(this);
  }

  public bind() {
    (this.view as any).viewModel = this.viewModel;

    this.viewModel.state.subscribe(() => {
      this.view.highlightAction(this.viewModel.state.currentActionIndex);
    });

    document.addEventListener('click', this.boundHandler);
  }

  public unbind() {
    document.removeEventListener('click', this.boundHandler);
  }

  private async handleClick(event: Event) {
    const target = event.target as HTMLElement;
    
    if (target.id === 'macro-run-btn' || target.closest('#macro-run-btn')) {
      const loopInput = this.view.elements.loopCountInput;
      const loopCount = loopInput ? parseInt(loopInput.value) : 1;
      const seq = { ...this.viewModel.state.currentSequence };
      seq.loopCount = loopCount;
      this.viewModel.setSequence(seq);
      await this.viewModel.runMacro();
    }
    else if (target.id === 'macro-stop-btn' || target.closest('#macro-stop-btn')) this.viewModel.stopMacro();
    else if (target.id === 'macro-save-btn' || target.closest('#macro-save-btn')) await this.viewModel.save();
    else if (target.id === 'macro-load-btn' || target.closest('#macro-load-btn')) {
      const success = await this.viewModel.load();
      if (success) {
        const seq = this.viewModel.state.currentSequence;
        const loopInput = this.view.elements.loopCountInput;
        if (loopInput) loopInput.value = seq.loopCount.toString();
        this.view.updateActionList(seq.actions);
      }
    }
    else if (target.classList.contains('add-action-btn')) {
      const type = target.getAttribute('data-type') as MacroActionType;
      const defaultParams: any = {};
      if (['CLICK', 'RIGHT_CLICK', 'DOUBLE_CLICK', 'MOVE'].includes(type)) {
        defaultParams.x = 0; defaultParams.y = 0;
      } else if (type === 'DRAG') {
        defaultParams.x = 0; defaultParams.y = 0; defaultParams.toX = 100; defaultParams.toY = 100;
      } else if (type === 'SCROLL') {
        defaultParams.scrollAmount = 100;
      } else if (type === 'KEY_INPUT') {
        defaultParams.text = '';
      } else if (type === 'KEY_PRESS') {
        defaultParams.key = 'enter';
      } else if (type === 'WAIT') {
        defaultParams.durationMs = 1000;
      } else if (type === 'IMAGE_SEARCH') {
        defaultParams.targetImage = '';
        defaultParams.similarity = 0.8;
        defaultParams.timeoutMs = 5000;
        defaultParams.actionOnSuccess = 'CLICK';
        defaultParams.actionOnFailure = 'CONTINUE';
      }
      
      this.viewModel.addAction({ type, params: defaultParams, delayBeforeMs: 100 });
      this.view.updateActionList(this.viewModel.state.currentSequence.actions);
    }
    else if (target.classList.contains('remove-action-btn')) {
      const index = parseInt(target.getAttribute('data-index') || '-1');
      if (index !== -1) {
        this.viewModel.removeAction(index);
        this.view.updateActionList(this.viewModel.state.currentSequence.actions);
      }
    }
    else if (target.classList.contains('pick-coord-btn') || target.closest('.pick-coord-btn')) {
      const actualTarget = target.closest('.pick-coord-btn') as HTMLElement;
      const index = parseInt(actualTarget.getAttribute('data-index') || '-1');
      if (index !== -1) {
        document.querySelectorAll('.pick-coord-btn').forEach(b => (b as HTMLElement).classList.remove('active'));
        actualTarget.classList.add('active');
        actualTarget.innerHTML = '<i data-lucide="mouse-pointer-2" style="width:14px;height:14px;"></i> <small>Press F2</small>';
      }
    }
    else if (target.classList.contains('browse-image-btn')) {
      const index = parseInt(target.getAttribute('data-index') || '-1');
      if (index !== -1) {
          const filePath = await this.viewModel.openImageDialog();
          if (filePath) {
              const actions = this.viewModel.getSequence().actions;
              actions[index].params.targetImage = filePath;
              this.view.updateActionList(actions);
          }
      }
    }
    else if (target.classList.contains('capture-image-btn') || target.closest('.capture-image-btn')) {
      const actualTarget = target.closest('.capture-image-btn') as HTMLElement;
      const index = parseInt(actualTarget.getAttribute('data-index') || '-1');
      if (index !== -1) {
        const filePath = await this.viewModel.captureImage(index);
        if (filePath) {
          this.view.updateActionList(this.viewModel.getSequence().actions);
        }
      }
    }
  }
}
