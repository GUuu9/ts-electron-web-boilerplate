import { container } from '@/core/di/index.js';
import { CalcController } from '@/features/calc/calc.controller.js';

// 렌더러의 전역 타입 정의 (TypeScript가 electronAPI를 인식하도록 함)
declare global {
  interface Window {
    electronAPI?: {
      platform: string;
    };
  }
}

function updateUI() {
  const platformInfo = document.getElementById('platform-info');
  const status = document.getElementById('status');

  if (!platformInfo || !status) return;

  const currentPlatform = window.electronAPI ? `Desktop (${window.electronAPI.platform})` : 'Web Browser';
  
  // DI 컨테이너를 통해 컨트롤러 인스턴스 획득
  const calcController = container.get<CalcController>('CalcController');
  
  // 컨트롤러에 요청 전달 (서비스 호출 포함)
  const resultMessage = calcController.handleRequest(currentPlatform);

  platformInfo.innerText = 'DI 시스템 작동 중...';
  status.innerText = resultMessage;
}

// DOM 로드 시 실행
window.addEventListener('DOMContentLoaded', updateUI);
