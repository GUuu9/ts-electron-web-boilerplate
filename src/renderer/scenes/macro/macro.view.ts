import { MacroViewModel } from './macro.viewmodel.js';
import { MacroAction, MacroActionType } from './macro.models.js';

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

    this.container.innerHTML = `
      <div class="view-container macro-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="zap"></i> Macro Builder</h3>
          <div class="view-actions">
            <div class="loop-control">
              <label>Loops</label>
              <input type="number" id="macro-loop-count" value="1" min="0" title="0 = Infinite" />
            </div>
            <button id="macro-run-btn" class="btn btn-primary"><i data-lucide="play"></i> Run <small>(F5)</small></button>
            <button id="macro-stop-btn" class="btn btn-danger"><i data-lucide="square"></i> Stop <small>(F6)</small></button>
            <button id="macro-save-btn" class="btn btn-outline"><i data-lucide="save"></i> Save</button>
            <button id="macro-load-btn" class="btn btn-outline"><i data-lucide="folder-open"></i> Load</button>
          </div>
        </header>

        <section class="action-selector">
          <div class="selector-group">
            <span class="selector-label">Mouse</span>
            <div class="add-btns">
              <button class="btn-add add-action-btn" data-type="CLICK">Click</button>
              <button class="btn-add add-action-btn" data-type="RIGHT_CLICK">Right Click</button>
              <button class="btn-add add-action-btn" data-type="DOUBLE_CLICK">Double Click</button>
              <button class="btn-add add-action-btn" data-type="MOVE">Move</button>
              <button class="btn-add add-action-btn" data-type="DRAG">Drag</button>
              <button class="btn-add add-action-btn" data-type="SCROLL">Scroll</button>
            </div>
          </div>
          <div class="selector-group">
            <span class="selector-label">Keyboard</span>
            <div class="add-btns">
              <button class="btn-add add-action-btn" data-type="KEY_INPUT">Type Text</button>
              <button class="btn-add add-action-btn" data-type="KEY_PRESS">Key Press</button>
            </div>
          </div>
          <div class="selector-group">
            <span class="selector-label">Intelligence</span>
            <div class="add-btns">
              <button class="btn-add add-action-btn" data-type="IMAGE_SEARCH">Image Search</button>
              <button class="btn-add add-action-btn" data-type="WAIT">Wait</button>
            </div>
          </div>
        </section>

        <section class="builder-content">
          <table id="macro-action-table">
            <thead>
              <tr>
                <th class="type-col" style="width: 140px;">Action Type</th>
                <th class="params-col">Configuration</th>
                <th class="delay-col" style="width: 120px;">Pre-Delay</th>
                <th class="control-col" style="width: 50px;"></th>
              </tr>
            </thead>
            <tbody id="macro-action-list"></tbody>
          </table>
        </section>
      </div>
    `;
    (window as any).lucide?.createIcons();

    // 페이지 진입 시 데이터 초기화 및 화면 표시
    const currentSeq = this.viewModel.init();
    this.updateActionList(currentSeq.actions);
    
    const elements = this.elements;
    if (elements.loopCountInput) {
      elements.loopCountInput.value = currentSeq.loopCount.toString();
    }
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
  constructor(
    private readonly view: MacroView,
    private readonly viewModel: MacroViewModel
  ) {}

  public bind() {
    // View에 ViewModel 주입 (render 시 init 호출을 위함)
    (this.view as any).viewModel = this.viewModel;

    // 1. 상태 변경 구독 (State -> View)
    this.viewModel.state.subscribe(() => {
      this.view.highlightAction(this.viewModel.state.currentActionIndex);
    });

    let currentPickingIndex = -1;

    // 2. 전역 단축키 이벤트 수신 (Main -> Renderer)
    this.viewModel.onStartShortcut(async () => {
      const loopInput = this.view.elements.loopCountInput;
      const loopCount = loopInput ? parseInt(loopInput.value) : 1;
      const seq = { ...this.viewModel.state.currentSequence };
      seq.loopCount = loopCount;
      this.viewModel.setSequence(seq);
      await this.viewModel.runMacro();
    });

    this.viewModel.onStopShortcut(() => {
      this.viewModel.stopMacro();
    });

    this.viewModel.onPickShortcut(async () => {
      if (currentPickingIndex !== -1) {
        const pos = await this.viewModel.getMousePosition();
        if (pos) {
          const seq = { ...this.viewModel.state.currentSequence };
          seq.actions[currentPickingIndex].params.x = pos.x;
          seq.actions[currentPickingIndex].params.y = pos.y;
          this.viewModel.setSequence(seq);
          this.view.updateActionList(seq.actions);
          currentPickingIndex = -1;
        }
      }
    });

    // 3. 이벤트 바인딩
    let draggedIndex = -1;

    document.addEventListener('dragstart', (e) => {
      const target = (e.target as HTMLElement).closest('.action-row');
      if (target) {
        draggedIndex = parseInt(target.getAttribute('data-index') || '-1');
        e.dataTransfer?.setData('text/plain', draggedIndex.toString());
      }
    });

    document.addEventListener('dragover', (e) => {
      const target = (e.target as HTMLElement).closest('.action-row');
      if (target) {
        e.preventDefault();
        target.classList.add('drag-over');
      }
    });

    document.addEventListener('dragleave', (e) => {
      const target = (e.target as HTMLElement).closest('.action-row');
      if (target) {
        target.classList.remove('drag-over');
      }
    });

    document.addEventListener('drop', (e) => {
      const target = (e.target as HTMLElement).closest('.action-row');
      if (target) {
        e.preventDefault();
        target.classList.remove('drag-over');
        const dropIndex = parseInt(target.getAttribute('data-index') || '-1');
        if (draggedIndex !== -1 && dropIndex !== -1 && draggedIndex !== dropIndex) {
          this.viewModel.reorderAction(draggedIndex, dropIndex);
          this.view.updateActionList(this.viewModel.state.currentSequence.actions);
        }
      }
    });

    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      
      // Button Actions
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
      // Coordinate Picker
      else if (target.classList.contains('pick-coord-btn') || target.closest('.pick-coord-btn')) {
        const actualTarget = target.closest('.pick-coord-btn') as HTMLElement;
        const index = parseInt(actualTarget.getAttribute('data-index') || '-1');
        if (index !== -1) {
          document.querySelectorAll('.pick-coord-btn').forEach(b => (b as HTMLElement).classList.remove('active'));
          actualTarget.classList.add('active');
          actualTarget.innerHTML = '<i data-lucide="mouse-pointer-2" style="width:14px;height:14px;"></i> <small>Press F2</small>';
          currentPickingIndex = index;
        }
      }
      // Image Browse
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
        const val = (target as HTMLInputElement).value;
        (action.params as any)[key] = target.getAttribute('type') === 'number' ? parseFloat(val) : val;
      } else if (target.classList.contains('delay-input')) {
        action.delayBeforeMs = parseInt((target as HTMLInputElement).value);
      } else if (target.classList.contains('desc-input')) {
        action.description = (target as HTMLInputElement).value;
      }
    });
  }
}
