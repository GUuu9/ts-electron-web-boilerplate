import { ipcRenderer } from 'electron';

/**
 * VisionBridge: 렌더러와 통신하기 위한 브릿지 API 규격입니다.
 */
export const visionBridge = {
  processScreen: () => ipcRenderer.invoke('vision:processScreen'),
  findImage: (templatePath: string, similarity: number = 0.8) => 
    ipcRenderer.invoke('vision:findImage', templatePath, similarity),
  processImageFile: (filePath: string) => ipcRenderer.invoke('vision:processImageFile', filePath),
  captureRegion: () => ipcRenderer.invoke('vision:captureRegion'),
};
