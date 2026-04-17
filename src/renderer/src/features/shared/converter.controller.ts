import { ConverterService } from '../../../../shared/converter.service.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

/**
 * ConverterController
 * 역할: 공통 변환 로직(Shared)을 UI와 연결합니다.
 */
export class ConverterController {
  constructor(
    private readonly logger: UILoggerService,
    private readonly converter: ConverterService
  ) {}

  /**
   * 입력된 숫자나 문자열을 Hex로 변환하여 출력합니다.
   */
  public convertToHex(): void {
    const input = document.getElementById('convert-input') as HTMLInputElement;
    const value = input.value.trim();

    if (!value) {
      this.logger.log('[Converter] Please enter a value.', true);
      return;
    }

    this.logger.log(`[Converter] Input: ${value}`);

    // 숫자인 경우와 문자열인 경우를 구분하여 처리
    if (!isNaN(Number(value)) && value !== '') {
      const hex = this.converter.numberToHex(Number(value));
      this.logger.log(`[Converter] Number to Hex: ${hex}`);
    } else {
      const hex = this.converter.stringToHex(value);
      this.logger.log(`[Converter] String to Hex: ${hex}`);
    }
  }
}
