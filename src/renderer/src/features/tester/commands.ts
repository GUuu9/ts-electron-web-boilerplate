import { UILoggerService } from '../../core/ui-logger.service.js';

export interface Command {
  description: string;
  action: (logger: UILoggerService, args: string[]) => void;
}

export const COMMANDS: Record<string, Command> = {
  clear: {
    description: '로그 창을 초기화합니다.',
    action: (logger) => logger.clear(),
  },
  help: {
    description: '사용 가능한 커맨드 목록을 표시합니다.',
    action: (logger) => {
      logger.log('--- Available Commands ---');
      Object.entries(COMMANDS).forEach(([cmd, info]) => {
        logger.log(`/${cmd} : ${info.description}`);
      });
    },
  },
  'logger-mode': {
    description: '로그 창의 모드(플로팅/도킹)를 전환합니다.',
    action: (logger) => logger.toggleDock(),
  },
};
