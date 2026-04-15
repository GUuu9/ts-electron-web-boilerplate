import { contextBridge, ipcRenderer } from 'electron';

// 렌더러 프로세스(웹 화면)에서 노출될 안전한 API 정의
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  // 여기에 IPC 통신을 위한 메서드들을 추가할 수 있습니다.
});
