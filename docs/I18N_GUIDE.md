# 🌐 다국어 처리(i18n) 개발 가이드

이 문서는 본 프로젝트의 다국어 처리(Internationalization, i18n) 아키텍처 및 구현 방법을 설명합니다. 모든 UI 텍스트는 `TranslationService`를 통해 관리되어야 하며, MVVM 패턴을 준수해야 합니다.

---

## 1. 아키텍처 구조

- **데이터 계층 (`src/shared/i18n/locales.ts`)**: 모든 언어별 텍스트 사전을 정의합니다.
- **서비스 계층 (`src/shared/i18n/i18n.service.ts`)**: 언어 설정 및 번역 키를 통해 텍스트를 반환하는 서비스를 제공합니다.
- **도메인 계층 (ViewModel)**: `TranslationService`를 의존성 주입받아 UI에 필요한 텍스트를 변환하여 제공합니다.

---

## 2. 구현 절차

### 1단계: 사전 데이터 정의 (`locales.ts`)
`src/shared/i18n/locales.ts`에 새로운 언어 키를 추가합니다.

```typescript
export const locales = {
  en: {
    greeting: 'Hello',
  },
  ko: {
    greeting: '안녕하세요',
  }
};
```

### 2단계: ViewModel에 주입 (`*.viewmodel.ts`)
ViewModel 생성자에 `TranslationService`를 주입받아 사용합니다.

```typescript
export class MyViewModel {
  constructor(private readonly i18n: TranslationService) {}

  public getGreeting(): string {
    return this.i18n.t('greeting'); // 자동 번역
  }
}
```

### 3단계: 렌더러 등록 (`registry.ts`)
`RendererRegistry`에서 서비스를 주입하도록 설정합니다.

```typescript
// ViewModel Layer
container.register('MyViewModel', new MyViewModel(container.get('TranslationService')));
```

---

## 💡 개발 가이드라인

1.  **View 로직 금지**: View(View.ts)는 직접 `TranslationService`를 호출해서는 안 됩니다. 반드시 ViewModel에서 변환된 데이터를 전달받으세요.
2.  **런타임 언어 변경**: 언어 변경이 필요한 경우(설정 화면 등) 컨테이너에서 서비스를 가져와 `setLanguage()`를 호출하세요.
    ```typescript
    const i18n = container.get<TranslationService>('TranslationService');
    i18n.setLanguage('en');
    ```
3.  **데이터 무결성**: 추가하는 모든 번역 키는 `locales` 객체의 `ko` 기본 타입과 일치해야 합니다.
