import { VisionViewModel } from './vision.viewmodel.js';
import visionTemplate from './vision.view.html?raw';

/**
 * Vision View
 */
export class VisionView {
  public viewModel!: VisionViewModel;

  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = visionTemplate;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get captureButton() { return document.getElementById('capture-button') as HTMLButtonElement; },
      get statusBadge() { return document.getElementById('vision-status') as HTMLDivElement; },
      get processedImage() { return document.getElementById('processed-image') as HTMLImageElement; },
      get placeholderText() { return document.getElementById('placeholder-text') as HTMLParagraphElement; },
      get saveImageButton() { return document.getElementById('save-image-button') as HTMLButtonElement; },
      
      // Template Matching Elements
      get browseTemplateButton() { return document.getElementById('browse-template') as HTMLButtonElement; },
      get templatePathInput() { return document.getElementById('template-path') as HTMLInputElement; },
      get similaritySlider() { return document.getElementById('similarity-slider') as HTMLInputElement; },
      get showEdgeDetectionCheckbox() { return document.getElementById('show-edge-detection') as HTMLInputElement; },
      get similarityValue() { return document.getElementById('similarity-value') as HTMLSpanElement; },
      get testFindButton() { return document.getElementById('test-find-image') as HTMLButtonElement; },
      get partialCaptureButton() { return document.getElementById('partial-capture-button') as HTMLButtonElement; },
      
      // Results
      get matchResultContainer() { return document.getElementById('match-result-container') as HTMLDivElement; },
      get matchFound() { return document.getElementById('match-found') as HTMLSpanElement; },
      get matchConfidence() { return document.getElementById('match-confidence') as HTMLSpanElement; },
      get matchCoords() { return document.getElementById('match-coords') as HTMLSpanElement; }
    };
  }
}

/**
 * Vision Binder
 */
export class VisionBinder {
  private boundClickHandler: (event: MouseEvent) => void;
  private boundInputHandler: (event: Event) => void;

  constructor(
    private readonly view: VisionView,
    private readonly viewModel: VisionViewModel
  ) {
    this.boundClickHandler = this.handleClick.bind(this);
    this.boundInputHandler = this.handleInput.bind(this);
  }

  public bind(): void {
    this.view.viewModel = this.viewModel;

    // UI -> ViewModel (이벤트 위임 사용)
    document.addEventListener('click', this.boundClickHandler);
    document.addEventListener('input', this.boundInputHandler);

    // ViewModel -> UI
    this.viewModel.state.subscribe(() => {
      this.updateView();
    });
  }

  public unbind(): void {
    document.removeEventListener('click', this.boundClickHandler);
    document.removeEventListener('input', this.boundInputHandler);
  }

  private async handleClick(event: MouseEvent): Promise<void> {
    const target = event.target as HTMLElement;

    // 화면 캡처 및 분석 버튼
    if (target.id === 'capture-button' || target.closest('#capture-button')) {
      await this.viewModel.captureAndProcess();
    }

    // 템플릿 찾아보기 버튼
    if (target.id === 'browse-template' || target.closest('#browse-template')) {
      await this.viewModel.browseTemplate();
    }

    // 이미지 찾기 테스트 버튼
    if (target.id === 'test-find-image' || target.closest('#test-find-image')) {
      const showEdge = this.view.elements.showEdgeDetectionCheckbox.checked;
      await this.viewModel.testFindImage(showEdge);
    }

    // 부분 캡처 버튼
    if (target.id === 'partial-capture-button' || target.closest('#partial-capture-button')) {
      await this.viewModel.partialCapture();
    }

    // 이미지 저장 버튼
    if (target.id === 'save-image-button' || target.closest('#save-image-button')) {
      await this.viewModel.saveProcessedImage();
    }
  }

  private handleInput(event: Event): void {
    const target = event.target as HTMLElement;

    // 유사도 임계값 슬라이더
    if (target.id === 'similarity-slider') {
      const value = parseFloat((target as HTMLInputElement).value);
      this.viewModel.setSimilarity(value);
    }
  }

  private updateView(): void {
    const el = this.view.elements;
    const state = this.viewModel.state;
    
    // Status Badge
    if (el.statusBadge) {
      el.statusBadge.textContent = `상태: ${this.translateStatus(state.status)}`;
      
      if (state.status === 'Success' || state.status === 'Found') {
        el.statusBadge.style.color = '#28a745';
      } else if (state.status === 'Error' || state.status === 'Not Found') {
        el.statusBadge.style.color = '#dc3545';
      } else if (state.status === 'Processing...' || state.status === 'Searching...') {
        el.statusBadge.style.color = '#ffc107';
      } else {
        el.statusBadge.style.color = 'inherit';
      }
    }

    // Processed Image
    if (el.processedImage) {
      if (state.processedImage) {
        const base64Data = state.processedImage.startsWith('data:image/') 
          ? state.processedImage 
          : `data:image/png;base64,${state.processedImage}`;
        el.processedImage.src = base64Data;
        el.processedImage.style.display = 'block';
        if (el.placeholderText) {
          el.placeholderText.style.display = 'none';
        }
      } else {
        el.processedImage.style.display = 'none';
        if (el.placeholderText) {
          el.placeholderText.style.display = 'block';
        }
      }
    }

    // Template Matching State
    if (el.templatePathInput) {
      el.templatePathInput.value = state.templatePath;
    }

    if (el.similarityValue) {
      el.similarityValue.textContent = state.similarity.toFixed(2);
    }

    if (el.similaritySlider) {
      el.similaritySlider.value = state.similarity.toString();
    }

    // Match Results
    if (state.matchResult) {
      if (el.matchResultContainer) el.matchResultContainer.style.display = 'block';
      
      if (el.matchFound) {
        el.matchFound.textContent = state.matchResult.found ? '찾음 (FOUND)' : '못 찾음 (NOT FOUND)';
        el.matchFound.style.color = state.matchResult.found ? '#28a745' : '#dc3545';
        el.matchFound.style.fontWeight = 'bold';
      }

      if (el.matchConfidence) {
        el.matchConfidence.textContent = `${(state.matchResult.confidence * 100).toFixed(1)}%`;
      }

      if (el.matchCoords) {
        el.matchCoords.textContent = state.matchResult.found 
          ? `X: ${state.matchResult.x}, Y: ${state.matchResult.y}` 
          : '-';
      }
    } else {
      if (el.matchResultContainer) el.matchResultContainer.style.display = 'none';
    }
  }

  private translateStatus(status: string): string {
    switch (status) {
      case 'Idle': return '대기 중';
      case 'Processing...': return '처리 중...';
      case 'Searching...': return '검색 중...';
      case 'Success': return '성공';
      case 'Error': return '오류 발생';
      case 'Found': return '이미지 발견';
      case 'Not Found': return '이미지 미발견';
      case 'Template path is empty': return '템플릿 경로가 비어 있습니다.';
      default: return status;
    }
  }
}
