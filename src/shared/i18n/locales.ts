/**
 * 다국어 사전 데이터 정의
 */
export const locales = {
  en: {
    dashboard: 'Core Dashboard',
    ai_view: 'Behavior Tree AI',
    status: 'Ready to test...',
  },
  ko: {
    dashboard: '코어 대시보드',
    ai_view: '행동 트리 AI',
    status: '테스트 준비 완료...',
  }
};

export type Language = keyof typeof locales;
