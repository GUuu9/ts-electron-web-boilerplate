# 🚀 COMMIT_00003: DI 구조 리팩토링 및 다국어/방어적 프로그래밍 구현

## 🚀 주요 업데이트
### 1. DI 아키텍처 리팩토링
- **역할 분리**: `Container`를 유일한 저장소(Source of Truth)로, `Registry`를 객체 조립 및 등록을 담당하는 공장(Assembler)으로 역할을 명확히 분리.
- 백엔드(`Main`)와 프론트엔드(`Renderer`) DI 구조를 통일하여 유지보수성 향상.

### 2. 다국어(i18n) 시스템 도입
- `TranslationService` 구현 및 DI 컨테이너 등록.
- 언어 사전 데이터(`locales.ts`) 구조화.
- 다국어 처리 가이드 문서(`docs/I18N_GUIDE.md`) 작성.

### 3. 웹 환경 대응 및 방어적 프로그래밍
- 모든 하드웨어 및 OS 리포지토리(`Serial`, `Os`, `System`, `Persistence`, `Security`, `File`, `Media/Device`)에 `window.electronAPI` 존재 여부를 확인하는 방어 코드 적용 (웹 환경 크래시 방지).
- Phaser 물리 엔진 관련 타입 오류 및 객체 중복 생성 이슈 수정.

## 🛠 수정된 파일
- `src/main/core/di/registry.ts`
- `src/renderer/core/di/registry.ts`
- `src/renderer/core/di/container.renderer.ts`
- `src/shared/i18n/*`
- `src/renderer/features/ai/*`
- `src/renderer/data/**/*.repository.ts`
- `docs/I18N_GUIDE.md`
- `CHANGELOG.md`
