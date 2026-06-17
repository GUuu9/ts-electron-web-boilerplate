import { RendererRegistry } from './core/di/registry.js';
import { container } from './core/di/container.renderer.js';
import { NavController } from './core/navigation/nav.controller.js';
import { AIRunner } from './core/ai/ai.runner.js';

async function bootstrap() {
  console.log('[Frontend] Initializing MVVM Architecture...');

  const isElectron = !!(window as any).electronAPI;

  // 1. Registry 초기화 (컨테이너 채우기)
  RendererRegistry.init();

  // 2. 컨테이너에서 서비스 가져오기
  const navController = container.get<NavController>('NavController');
  const aiRunner = container.get<AIRunner>('AIRunner');

  navController.init();
  // aiRunner.start();


  if (!isElectron) {
    // 웹 환경에서는 Desktop 전용 기능을 비활성화 처리
    const desktopOnlyIds = [
      'nav-tcp', 'nav-udp', 'nav-os', 'nav-system', 'nav-persistence', 
      'nav-security', 'nav-serial', 'nav-media', 'nav-file', 'nav-logger', 
      'nav-macro', 'nav-vision', 'nav-llm'
    ];
    desktopOnlyIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('disabled');
        el.addEventListener('click', (e) => e.stopImmediatePropagation(), true);
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', bootstrap);
