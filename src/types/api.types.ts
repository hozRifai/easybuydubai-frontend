export interface ChatRequest {
  message: string;
  sessionId?: string;
  context?: Record<string, unknown>;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    processingTime?: number;
  };
}

export interface ErrorResponse {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}
