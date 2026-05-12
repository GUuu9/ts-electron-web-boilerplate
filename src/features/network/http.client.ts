import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * HTTP 통신을 담당하는 클라이언트 (Dio와 유사한 역할)
 * 모든 REST API 호출의 공통 설정을 관리합니다.
 */
export class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    const baseURL = (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) 
                    ? process.env.VITE_API_BASE_URL 
                    : 'http://localhost:3000';

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 (예: 토큰 자동 추가)
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // console.log('HTTP Request:', config.url);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터 (예: 에러 공통 처리)
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        // console.error('HTTP Error:', error.response?.status);
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET 요청
   */
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * POST 요청
   */
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * PUT 요청
   */
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * DELETE 요청
   */
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}
