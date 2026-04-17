import type { UILoggerService } from '../../core/ui-logger.service.js';
import type { NetworkController } from '../network/network.controller.js';
import type { DeviceController } from '../device/device.controller.js';
import { COMMANDS } from './commands.js';

/**
 * TesterController
 * 역할: 시스템 전역 콘솔 명령어(/) 처리 및 도메인별 테스트 위임
 */
export class TesterController {
  constructor(
    private readonly logger: UILoggerService,
    private readonly network?: NetworkController,
    private readonly device?: DeviceController
  ) {}

  /**
   * 하단 입력창의 명령어를 해석하고 실행합니다.
   */
  public handleCommand(): void {
    const input = document.getElementById('log-command') as HTMLInputElement;
    const rawInput = input.value.trim();
    if (!rawInput) return;

    const isCommand = rawInput.startsWith('/');
    const parts = isCommand ? rawInput.slice(1).split(' ') : [];
    const cmdName = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    if (isCommand && COMMANDS[cmdName]) {
      // 명령어 실행 시 필요한 의존성을 함께 전달할 수 있습니다.
      COMMANDS[cmdName].action(this.logger, args);
    } else if (isCommand) {
      this.logger.log(`Unknown command: ${rawInput}`, true);
    } else {
      // 명령어가 아니면 일반 로그로 출력
      this.logger.log(`[User] ${rawInput}`);
    }
    
    input.value = '';
  }

  /**
   * 대시보드 등의 퀵 테스트 버튼에서 호출됩니다.
   * 직접 로직을 수행하지 않고 전용 컨트롤러로 위임합니다.
   */
  public async runTest(serviceType: string): Promise<void> {
    this.logger.log(`[Tester] Delegating ${serviceType} test...`);

    try {
      switch (serviceType) {
        case 'network':
        case 'http':
          if (this.network) await this.network.testHttp();
          break;
        case 'bluetooth':
          if (this.device) await this.device.testBluetooth();
          break;
        case 'usb':
          if (this.device) await this.device.testUsb();
          break;
        case 'media':
          if (this.device) await this.device.testMedia();
          break;
        default:
          this.logger.log(`Test for ${serviceType} should be performed in its own tab.`, true);
      }
    } catch (err: any) {
      this.logger.log(`Delegation Error: ${err.message}`, true);
    }
  }
}
