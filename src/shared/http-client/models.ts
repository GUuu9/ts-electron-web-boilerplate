/**
 * Network 모듈의 공통 데이터 인터페이스 및 모델 정의
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface NetworkConfig {
  baseUrl: string;
  timeout: number;
}
