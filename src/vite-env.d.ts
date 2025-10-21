/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_API_RETRY_ATTEMPTS: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENABLE_MARKDOWN: string;
  readonly VITE_MAX_MESSAGE_LENGTH: string;
  readonly VITE_ENABLE_SESSION_PERSISTENCE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
