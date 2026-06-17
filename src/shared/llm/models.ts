/**
 * LLM 모듈의 공통 데이터 인터페이스 및 모델 정의
 */

export interface LLMGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  stream?: boolean;
  options?: Record<string, any>;
  format?: string;
}

export interface LLMGenerateResponse {
  text: string;
  model: string;
  done: boolean;
  created_at?: string;
  response?: string;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface LLMModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface LLMTagsResponse {
  models: LLMModel[];
}
