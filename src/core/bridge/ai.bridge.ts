import { ipcRenderer } from 'electron';

export const aiBridge = {
  ai: {
    // 트리 실행 상태 및 블랙보드 데이터 요청
    getStatus: () => ipcRenderer.invoke('ai-get-status'),
    
    // AI 상태 업데이트 수신
    onStatusUpdate: (callback: (data: any) => void) => {
      ipcRenderer.removeAllListeners('ai-status-update');
      ipcRenderer.on('ai-status-update', (_event, data) => callback(data));
    }
  }
};
