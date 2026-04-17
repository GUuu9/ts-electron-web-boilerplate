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
};
