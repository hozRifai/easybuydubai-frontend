export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3', 10),
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'EasyBuy Dubai Chatbot',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  features: {
    enableMarkdown: import.meta.env.VITE_ENABLE_MARKDOWN !== 'false',
    maxMessageLength: parseInt(import.meta.env.VITE_MAX_MESSAGE_LENGTH || '2000', 10),
    enableSessionPersistence: import.meta.env.VITE_ENABLE_SESSION_PERSISTENCE !== 'false',
  },
} as const;

export const isProduction = config.app.environment === 'production';
export const isDevelopment = config.app.environment === 'development';
