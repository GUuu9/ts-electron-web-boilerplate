# 🚀 COMMIT_00011 : LLM View UI/UX 전면 개선

LLM 기능의 사용성을 높이기 위해 전반적인 UI/UX를 개선하였습니다. 
특히 LM Studio 및 Open WebUI의 스타일을 참고하여 더 직관적이고 사용하기 편한 환경을 조성하였습니다.

## 🚀 주요 업데이트

### 1. 디자인 시스템 적용 및 스타일 통합
- 프로젝트 전역 디자인 시스템(`styles/partials/`)을 LLM 뷰에 통합하여 일관된 톤앤매너 적용.
- 미니멀리스트 및 Open WebUI 스타일을 참고하여, 집중도 높은 레이아웃 설계.

### 2. 레이아웃 재구성
- **메인 레이아웃**: 1단 중심 레이아웃으로 변경하여 채팅 내용에 집중할 수 있도록 구성.
- **사이드 패널**: VS Code 스타일의 토글형 사이드 패널(`Model Library`)을 구현하여 모델 관리와 채팅 설정을 직관적으로 조작 가능.
- **채팅 영역**: 화면 중앙 고정 폭 적용 및 좌우 말풍선 분리 배치.

### 3. 기능 개선
- **스크롤 향상**: 채팅창 자동 스크롤(최신 메시지 이동) 및 스크롤 상단/하단 이동 버튼 추가.
- **모델 관리**: 'Installed Models' 목록을 컴팩트한 카드 박스 형태의 독립 스크롤 영역으로 재설계.
- **UI 반응성**: 모델명 호버 툴팁 추가 및 삭제 버튼 디자인 개선.

## 🛠 수정된 파일
- `src/renderer/scenes/llm/llm.view.html`
- `src/renderer/scenes/llm/llm.view.ts`
- `src/renderer/styles/partials/llm.css`
- `src/renderer/styles/main.css`
