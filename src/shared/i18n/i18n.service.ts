import { locales, type Language } from './locales.js';

/**
 * 다국어 번역을 담당하는 서비스입니다.
 */
export class TranslationService {
  private currentLanguage: Language = 'ko';

  public setLanguage(lang: Language): void {
    this.currentLanguage = lang;
  }

  public t(key: keyof typeof locales['ko']): string {
    return locales[this.currentLanguage][key] || key;
  }
}
