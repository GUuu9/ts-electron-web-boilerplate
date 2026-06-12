# CSS 스타일 가이드라인

본 프로젝트의 스타일은 유지보수성과 확장성을 위해 모듈화되어 있습니다. 모든 스타일은 `src/renderer/styles/` 내의 파일들을 수정해야 합니다.

## 1. 파일 구조
- `main.css`: 전체 스타일을 불러오는 진입점 (수정 불필요)
- `partials/base.css`: CSS 변수(`:root`), 기본 폰트, 애니메이션, `box-sizing` 설정 등 전역 기초 설정
- `partials/layout.css`: 뷰의 전체 구조 클래스 (`.view-container`, `.view-header`, `.view-content` 등)
- `partials/components.css`: 재사용 가능한 UI 컴포넌트 클래스 (`.btn`, `input`, `.card` 등)
- `partials/scenes.css`: 특정 뷰에서만 사용되는 복잡한 스타일 (매크로 뷰 등)

## 2. 디자인 규칙
- **CSS 변수 사용**: 색상 및 테두리 설정은 반드시 `:root`에 정의된 변수를 사용합니다.
- **표준 레이아웃 준수**: 새로운 뷰 추가 시 반드시 `.view-container > .view-header + .view-content` 구조를 사용합니다.
- **컴포넌트 클래스 활용**: 새로운 요소를 만들기 전, `components.css`에 유사한 요소가 있는지 먼저 확인합니다.
- **레이아웃 안정성**: 모든 요소는 `box-sizing: border-box`로 설정되어 있으므로 `padding`과 `border`를 자유롭게 사용 가능합니다.
- **하드코딩 지양**: HTML 요소에 인라인 스타일(`style="..."`)을 직접 넣지 말고, CSS 클래스를 정의하여 적용하세요.
