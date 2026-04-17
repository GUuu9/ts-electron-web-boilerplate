/**
 * ConverterService (Shared Logic)
 * 역할: 플랫폼에 독립적인 데이터 변환 로직을 담당합니다.
 */
export class ConverterService {
  /**
   * 숫자를 Hex 문자열로 변환합니다. (예: 255 -> "0xFF")
   */
  public numberToHex(value: number, prefix = true): string {
    const hex = value.toString(16).toUpperCase();
    return prefix ? `0x${hex.padStart(2, '0')}` : hex.padStart(2, '0');
  }

  /**
   * 문자열의 각 문자를 Hex 값으로 변환합니다. (예: "ABC" -> "41 42 43")
   */
  public stringToHex(text: string): string {
    return Array.from(text)
      .map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
  }
}
