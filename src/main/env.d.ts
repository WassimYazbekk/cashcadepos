/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOCAL_SERVER_URL: string
  readonly MAIN_VITE_REMOTE_SERVER_URL: string
  readonly MAIN_VITE_REMOTE_SERVER_API_KEY: string
  readonly MAIN_VITE_EXPRESS_SERVER_PORT: string
  readonly MAIN_VITE_DATABASE_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
