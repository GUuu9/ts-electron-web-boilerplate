import * as os from 'os';
import { app } from 'electron';

/**
 * 시스템 정보 및 앱 리소스 사용량을 측정하는 서비스
 */
export class SystemInfoService {
  /**
   * 현재 시스템 및 프로세스 상태 정보를 반환합니다.
   */
  public getStatus() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = (usedMem / totalMem) * 100;

    return {
      platform: process.platform,
      arch: process.arch,
      cpuModel: os.cpus()[0].model,
      cpuCount: os.cpus().length,
      totalMemory: this.formatBytes(totalMem),
      usedMemory: this.formatBytes(usedMem),
      memoryPercentage: memUsage.toFixed(2),
      uptime: this.formatUptime(process.uptime()),
      appVersion: app.getVersion(),
      nodeVersion: process.version
    };
  }

  private formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let l = 0, n = bytes || 0;
    while(n >= 1024 && ++l){
        n = n / 1024;
    }
    return n.toFixed(2) + ' ' + units[l];
  }

  private formatUptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  }
}
