import { ko } from '../../../shared/i18n/ko.js';
import { en } from '../../../shared/i18n/en.js';

export type Language = 'ko' | 'en';
export type Theme = 'dark' | 'light';

/**
 * UISettingsService
 * 역할: 테마(다크/라이트) 및 다국어 설정을 관리합니다.
 */
export class UISettingsService {
  private currentLang: Language = 'ko';
  private currentTheme: Theme = 'dark';
  private translations: any = { ko, en };

  constructor() {}

  /**
   * 설정을 영구 저장소에서 로드하고 적용합니다. (비동기)
   */
  public async init(): Promise<void> {
    if (!window.electronAPI) {
      // 웹 환경에서는 localStorage 사용
      this.currentTheme = (localStorage.getItem('app-theme') as Theme) || 'dark';
      this.currentLang = (localStorage.getItem('app-lang') as Language) || 'ko';
    } else {
      // 데스크탑 환경에서는 암호화 저장소 사용
      this.currentTheme = await window.electronAPI.persistence.get('app-theme') || 'dark';
      this.currentLang = await window.electronAPI.persistence.get('app-lang') || 'ko';
    }

    this.applyTheme(this.currentTheme);
    this.applyLanguage(this.currentLang);
  }

  /**
   * 테마를 변경하고 저장합니다.
   */
  public setTheme(theme: Theme): void {
    this.currentTheme = theme;
    if (window.electronAPI) {
      window.electronAPI.persistence.set('app-theme', theme);
    } else {
      localStorage.setItem('app-theme', theme);
    }
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }

  public toggleTheme(): void {
    this.setTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  /**
   * 언어를 변경하고 저장합니다.
   */
  public setLanguage(lang: Language): void {
    this.currentLang = lang;
    if (window.electronAPI) {
      window.electronAPI.persistence.set('app-lang', lang);
    } else {
      localStorage.setItem('app-lang', lang);
    }
    this.applyLanguage(lang);
  }

  private applyLanguage(lang: Language): void {
    this.currentLang = lang;
  }

  /**
   * 번역된 텍스트를 가져옵니다.
   * 예: t('common.dashboard')
   */
  public t(key: string): string {
    const keys = key.split('.');
    let result = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (result[k]) {
        result = result[k];
      } else {
        return key; // 키를 찾지 못하면 키 그대로 반환
      }
    }
    return result;
  }

  public getCurrentLanguage(): Language {
    return this.currentLang;
  }

  public getCurrentTheme(): Theme {
    return this.currentTheme;
  }
}
