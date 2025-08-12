/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_GA_ID?: string
  readonly VITE_GEMINI_API_KEY?: string
  readonly VITE_SUPPORT_EMAIL?: string
  readonly VITE_APP_ENV?: string
  // Never expose these in frontend:
  // VITE_SUPABASE_SERVICE_ROLE_KEY
  // VITE_STRIPE_SECRET_KEY
  // VITE_OPENAI_API_KEY
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
