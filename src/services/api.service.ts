import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '@config';
import type { ChatRequest, ChatResponse, ErrorResponse } from '@types';

class ApiService {
  private client: AxiosInstance;
  private retryAttempts: number;

  constructor() {
    this.retryAttempts = config.api.retryAttempts;

    this.client = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        const errorMessage = error.response?.data?.error || error.message || 'An error occurred';
        return Promise.reject(new Error(errorMessage));
      }
    );
  }

  /**
   * Send a chat message
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await this.client.post<any>('/api/chat/message', {
          message: request.message,
          session_id: request.sessionId,
          user_info: request.userInfo
        });

        // Transform the response to match our frontend format
        return {
          message: response.data.response,
          sessionId: response.data.session_id,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (axios.isAxiosError(error) && error.response?.status && error.response.status < 500) {
          break;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.retryAttempts - 1) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new Error('Failed to send message');
  }

  /**
   * Get chat history
   */
  async getChatHistory(sessionId: string): Promise<ChatResponse[]> {
    const response = await this.client.get<ChatResponse[]>(`/api/chat/history/${sessionId}`);
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/api/health');
      return true;
    } catch {
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const apiService = new ApiService();
