import { PhaserGame } from './game/PhaserGame.js';

/**
 * Renderer Main Entry Point
 * 앱 시작 시 Phaser 게임을 초기화하고 전역 설정을 수행합니다.
 */
function bootstrap() {
  console.log('🚀 Game Boilerplate Initializing...');

  // 1. Phaser 게임 인스턴스 생성
  const gameApp = new PhaserGame('game-container');

  // 2. 화면 표시 (CSS 애니메이션 연동)
  document.body.classList.add('ready');

  // 전역 접근이 필요한 경우 window 객체에 등록 (디버깅용)
  (window as any).gameApp = gameApp;

  console.log('✅ Game Ready!');
}

// DOM 로드 완료 후 부트스트랩 실행
window.addEventListener('DOMContentLoaded', bootstrap);
