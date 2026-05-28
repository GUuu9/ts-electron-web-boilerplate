import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { NetworkConfig } from './models.js';

/**
 * HttpClient (Model/Service)
 * API 통신을 담당하는 순수 비즈니스 로직 계층
 */
export class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(config: NetworkConfig = { baseUrl: 'http://localhost:3000', timeout: 10000 }) {
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }
}
