import { ipcMain, type BrowserWindow } from 'electron';
import { CoreFeature } from '../../core/core-feature.js';
import { container } from '../../core/di/container.main.js';
import { createNetworkMonitorTree } from './trees/network-monitor.tree.js';
import { createDeviceManagerTree } from './trees/device-manager.tree.js';
import { createLowActivityTree } from './trees/low-activity.tree.js';
import type { BehaviorTree } from '../../core/ai/tree.js';

export class AICoreFeature implements CoreFeature {
  id = 'ai';
  private trees: { name: string; tree: BehaviorTree }[] = [];

  init() {
    const networkService = container.get<any>('HttpClient');
    const deviceService = container.get<any>('BluetoothService');
    const osService = container.get<any>('OSIntegrationService');
    
    // 트리 인스턴스 생성 및 관리
    // this.trees.push({ name: 'NetworkMonitor', tree: createNetworkMonitorTree(networkService) });
    // this.trees.push({ name: 'DeviceManager', tree: createDeviceManagerTree(deviceService) });
    // this.trees.push({ name: 'LowActivityAI', tree: createLowActivityTree(osService) });
    
    console.log('[AI] Starting AI Engines...');
    
    // AI 트리 실행 (5초 주기)
    setInterval(() => {
      // console.log('[AI Debug] Ticking trees...');
      this.trees.forEach(t => {
        const status = t.tree.tick();
        console.log(`[AI Debug] Tree ${t.name} finished with status: ${status}`);
      });
    }, 5000);
  }

  setupHandlers(mainWindow: BrowserWindow | null) {
    ipcMain.handle('ai-get-status', () => {
      return this.trees.map(t => ({
        name: t.name,
        blackboard: t.tree.getBlackboard().toJSON() // Blackboard 데이터를 JSON으로 변환
      }));
    });

    // 주기적으로 렌더러에 상태 푸시
    setInterval(() => {
      const status = this.trees.map(t => ({
        name: t.name,
        blackboard: t.tree.getBlackboard().toJSON()
      }));
      mainWindow?.webContents.send('ai-status-update', status);
    }, 5000);
  }
}
