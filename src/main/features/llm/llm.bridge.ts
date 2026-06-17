import { ipcRenderer } from 'electron';

/**
 * LLMBridge: 렌더러와 통신하기 위한 브릿지 API 규격입니다.
 */
export const llmBridge = {
  getModels: () => ipcRenderer.invoke('llm:getModels'),
  generate: (model: string, prompt: string, system?: string) => 
    ipcRenderer.invoke('llm:generate', model, prompt, system),
  pullModel: (modelName: string) => ipcRenderer.invoke('llm:pullModel', modelName),
  removeModel: (modelName: string) => ipcRenderer.invoke('llm:removeModel', modelName),
  selectModel: (modelName: string) => ipcRenderer.invoke('llm:selectModel', modelName),
  getActiveModel: () => ipcRenderer.invoke('llm:getActiveModel'),
  onPullProgress: (callback: (message: string) => void) => {
    const listener = (_: any, message: string) => callback(message);
    ipcRenderer.on('llm:pull-progress', listener);
    return () => ipcRenderer.removeListener('llm:pull-progress', listener);
  }
};
