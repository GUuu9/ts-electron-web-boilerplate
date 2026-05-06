/**
 * AI 에이전트들 간에 데이터를 공유하거나 저장하는 공유 메모리입니다.
 */
export class Blackboard {
  private data: Map<string, any> = new Map();

  /**
   * 데이터를 저장합니다.
   */
  public set(key: string, value: any): void {
    this.data.set(key, value);
  }

  /**
   * 데이터를 가져옵니다.
   */
  public get<T>(key: string): T | undefined {
    return this.data.get(key) as T;
  }

  /**
   * 데이터 존재 여부를 확인합니다.
   */
  public has(key: string): boolean {
    return this.data.has(key);
  }
}
