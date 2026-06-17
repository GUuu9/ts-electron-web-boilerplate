# 📝 Commit: COMMIT_00010

## 🚀 주요 업데이트
- **로컬 LLM 추론 시스템 통합**: `llama.cpp` (`llama-server`)를 데스크탑 애플리케이션 내부에 통합하여, 외부 API 의존성 없이 로컬 환경에서 GGUF 모델을 실행할 수 있는 기반을 마련했습니다.
- **모델 관리 기능 (Model Management)**: `models/` 디렉토리를 스캔하여 보유 중인 GGUF 모델 목록을 표시하고, 허깅페이스(Hugging Face) 등에서 직접 모델을 다운로드(Pull)하거나 불필요한 모델을 삭제하는 기능을 추가했습니다.
- **실시간 대화 인터페이스 (Chat UI)**: ChatML 포맷을 활용한 프롬프트 템플릿을 적용하여 로컬 모델과 실시간으로 대화할 수 있는 전용 UI와 비즈니스 로직을 구현했습니다.
- **바이너리 내장 및 경로 관리**: OS별(`darwin`, `win32`, `linux`) `llama-server` 실행 파일을 `bin/` 폴더에서 관리하도록 구조화하고, `LLMManager`를 통해 서버의 생명주기(시작/종료)를 자동 제어합니다.
- **문서화**: 로컬 AI 설정을 위한 상세 가이드(`docs/LLM_GUIDE.md`)를 추가하고 `README.md`를 업데이트했습니다.

## 🛠 수정된 파일
- `README.md`: 로컬 AI 설정 섹션 추가
- `docs/LLM_GUIDE.md`: 로컬 AI 개발 및 바이너리 설정 가이드 추가 (신규)
- `src/main/core/di/registry.ts`: LLM 관련 서비스 DI 등록
- `src/main/preload.ts`: LLM IPC 브릿지 노출
- `src/main/features/llm/`: LLM 서버 제어 및 모델 관리 로직 (신규)
- `src/renderer/core/di/registry.ts`: 렌더러 측 LLM 도메인 서비스 등록
- `src/renderer/core/navigation/nav.controller.ts`: 네비게이션에 AI(LLM) 메뉴 추가
- `src/renderer/index.html`: LLM 관련 스타일 및 리소스 연결
- `src/renderer/main.ts`: LLM 초기화 로직 추가
- `src/renderer/data/ipc/llm/`: LLM 통신 데이터 정의 (신규)
- `src/renderer/domains/llm/`: LLM 비즈니스 로직 (신규)
- `src/renderer/scenes/llm/`: LLM 대화 및 모델 관리 UI (신규)
- `src/shared/llm/`: LLM 관련 공통 모델 및 타입 정의 (신규)
