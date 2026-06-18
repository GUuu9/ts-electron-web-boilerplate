import { ipcRenderer } from 'electron';
import { LLMSession } from '../../../shared/llm/models.js';

/**
 * LLMBridge: 렌더러와 통신하기 위한 브릿지 API 규격입니다.
 */
export const llmBridge = {
  getModels: () => ipcRenderer.invoke('llm:getModels'),
  generate: (model: string, prompt: string, system?: string) => 
    ipcRenderer.invoke('llm:generate', model, prompt, system),
  abortGenerate: () => ipcRenderer.invoke('llm:abort-generate'),
  pullModel: (modelName: string) => ipcRenderer.invoke('llm:pullModel', modelName),
  removeModel: (modelName: string) => ipcRenderer.invoke('llm:removeModel', modelName),
  selectModel: (modelName: string, n_ctx?: number) => ipcRenderer.invoke('llm:selectModel', modelName, n_ctx),
  getActiveModel: () => ipcRenderer.invoke('llm:getActiveModel'),
  addAllowedPath: (targetPath: string) => ipcRenderer.invoke('llm:addAllowedPath', targetPath),
  resetContext: () => ipcRenderer.invoke('llm:reset-context'),
  
  // 세션 관련
  getSessions: () => ipcRenderer.invoke('llm:getSessions'),
  createSession: (model: string, systemPrompt?: string) => ipcRenderer.invoke('llm:createSession', model, systemPrompt),
  loadSession: (id: string) => ipcRenderer.invoke('llm:loadSession', id),
  saveSession: (session: LLMSession) => ipcRenderer.invoke('llm:saveSession', session),
  deleteSession: (id: string) => ipcRenderer.invoke('llm:deleteSession', id),

  onPullProgress: (callback: (message: string) => void) => {
    const listener = (_: any, message: string) => callback(message);
    ipcRenderer.on('llm:pull-progress', listener);
    return () => ipcRenderer.removeListener('llm:pull-progress', listener);
  },
  onAgentStatus: (callback: (status: string) => void) => {
    const listener = (_: any, status: string) => callback(status);
    ipcRenderer.on('llm:agent-status', listener);
    return () => ipcRenderer.removeListener('llm:agent-status', listener);
  },
  onServerStatus: (callback: (status: 'starting' | 'ready' | 'stopped', modelName?: string) => void) => {
    const listener = (_: any, status: any, modelName: any) => callback(status, modelName);
    ipcRenderer.on('llm:server-status', listener);
    return () => ipcRenderer.removeListener('llm:server-status', listener);
  },
  onGenerateChunk: (callback: (chunk: string) => void) => {
    const listener = (_: any, chunk: string) => callback(chunk);
    ipcRenderer.on('llm:generate-chunk', listener);
    return () => ipcRenderer.removeListener('llm:generate-chunk', listener);
  }
};
