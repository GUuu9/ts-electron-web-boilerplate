# 🌐 다국어(i18n) 설정 및 확장 가이드

이 프로젝트는 **Layered Architecture** 원칙에 따라, 플랫폼(Main/Renderer) 공용으로 사용할 수 있는 다국어 인프라를 구축하였습니다.

## 🏗 아키텍처 구조

1.  **언어 팩 (Language Packs)**: `src/shared/i18n/` 하위에 위치하며, 모든 프로세스에서 참조 가능한 순수 객체 형식입니다.
2.  **번역 서비스 (I18n Service)**: `src/renderer/src/core/ui-settings.service.ts`에서 현재 언어 상태를 관리하고 텍스트를 반환합니다.
3.  **전역 접근**: 렌더러 어디서든 `window.uiSettings.t('key')` 형식을 통해 번역된 텍스트에 접근할 수 있습니다.

---

## 🛠 사용 방법 (How to use)

### 1. 새로운 번역 키 추가하기
`src/shared/i18n/ko.ts` (또는 `en.ts`) 파일에 계층 구조로 키를 추가합니다.

```typescript
// src/shared/i18n/ko.ts
export const ko = {
  common: {
    welcome: '환영합니다',
    // ...
  },
  my_feature: {
    title: '나의 기능',
    description: '이것은 테스트입니다.'
  }
};
```

### 2. UI(HTML/TypeScript)에서 사용하기
`UIRouterService` 등 HTML 템플릿을 생성하는 곳에서 다음과 같이 사용합니다.

```typescript
// 템플릿 문자열 내에서 사용 예시
const html = `
  <h4>${window.uiSettings.t('my_feature.title')}</h4>
  <p>${window.uiSettings.t('my_feature.description')}</p>
`;
```

---

## 🚀 새로운 언어 추가 프로세스

1.  **언어 파일 생성**: `src/shared/i18n/jp.ts`와 같이 새로운 언어 파일을 생성합니다.
2.  **데이터 작성**: 기존 `ko.ts`의 구조를 복사하여 해당 언어로 번역합니다.
3.  **서비스 등록**: `src/renderer/src/core/ui-settings.service.ts`에서 새 파일을 임포트하고 `translations` 객체에 추가합니다.

```typescript
// ui-settings.service.ts
import { jp } from '../../../shared/i18n/jp.js';

// ...
private translations: any = { ko, en, jp };
```

---

## 💡 개발 원칙 및 팁

1.  **계층형 키 구조**: 키는 `도메인.기능.속성` 순서로 명명합니다.
2.  **영구 저장**: 사용자가 선택한 언어 설정은 `PersistenceService`를 통해 **AES-256-GCM으로 암호화**되어 로컬 디스크에 저장되며, 앱 재시작 시 자동으로 복원됩니다.
3.  **언어 변경 시 새로고침**: 언어 변경 시 `window.location.reload()`를 호출하여 전체 UI를 다시 렌더링합니다.
