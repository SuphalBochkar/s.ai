// ── Type-safe environment variable access ──────────────────────────────────

type RequiredEnvName = "DATABASE_URL" | "NEXTAUTH_SECRET";

type OptionalEnvName =
  // Auth
  | "BETTER_AUTH_SECRET"
  | "BETTER_AUTH_URL"
  // AI provider keys
  | "OPENAI_API_KEY"
  | "OPENROUTER_API_KEY"
  | "GROQ_API_KEY"
  | "CEREBRAS_API_KEY"
  | "COHERE_API_KEY"
  | "GITHUB_MODELS_API_KEY"
  | "GOOGLE_AI_API_KEY"
  | "MISTRAL_API_KEY"
  | "NVIDIA_API_KEY"
  | "HUGGINGFACE_API_KEY"
  | "CLOUDFLARE_API_KEY"
  | "CLOUDFLARE_ACCOUNT_ID"
  | "SAMBANOVA_API_KEY"
  | "HYPERBOLIC_API_KEY"
  | "FIREWORKS_API_KEY"
  | "SCALEWAY_API_KEY"
  | "AIHUBMIX_API_KEY"
  // AI config
  | "DEFAULT_AI_PROVIDER";

function getRequiredEnv(name: RequiredEnvName): string {
  const value = process.env[name];
  if (!value) return "";
  return value;
}

function getOptionalEnv(name: OptionalEnvName): string | undefined {
  return process.env[name];
}

// ── Database ───────────────────────────────────────────────────────────────

export const DATABASE_URL = getRequiredEnv("DATABASE_URL");

// ── Auth ───────────────────────────────────────────────────────────────────

export const NEXTAUTH_SECRET = getRequiredEnv("NEXTAUTH_SECRET");
export const BETTER_AUTH_SECRET = getOptionalEnv("BETTER_AUTH_SECRET");
export const BETTER_AUTH_URL = getOptionalEnv("BETTER_AUTH_URL");

// ── AI Provider Keys ──────────────────────────────────────────────────────

export const OPENAI_API_KEY = getOptionalEnv("OPENAI_API_KEY");
export const OPENROUTER_API_KEY = getOptionalEnv("OPENROUTER_API_KEY");
export const GROQ_API_KEY = getOptionalEnv("GROQ_API_KEY");
export const COHERE_API_KEY = getOptionalEnv("COHERE_API_KEY");
export const CEREBRAS_API_KEY = getOptionalEnv("CEREBRAS_API_KEY");
export const GITHUB_MODELS_API_KEY = getOptionalEnv("GITHUB_MODELS_API_KEY");
export const GOOGLE_AI_API_KEY = getOptionalEnv("GOOGLE_AI_API_KEY");
export const MISTRAL_API_KEY = getOptionalEnv("MISTRAL_API_KEY");
export const NVIDIA_API_KEY = getOptionalEnv("NVIDIA_API_KEY");
export const HUGGINGFACE_API_KEY = getOptionalEnv("HUGGINGFACE_API_KEY");
export const CLOUDFLARE_API_KEY = getOptionalEnv("CLOUDFLARE_API_KEY");
export const CLOUDFLARE_ACCOUNT_ID = getOptionalEnv("CLOUDFLARE_ACCOUNT_ID");
export const SAMBANOVA_API_KEY = getOptionalEnv("SAMBANOVA_API_KEY");
export const HYPERBOLIC_API_KEY = getOptionalEnv("HYPERBOLIC_API_KEY");
export const FIREWORKS_API_KEY = getOptionalEnv("FIREWORKS_API_KEY");
export const SCALEWAY_API_KEY = getOptionalEnv("SCALEWAY_API_KEY");
export const AIHUBMIX_API_KEY = getOptionalEnv("AIHUBMIX_API_KEY");

// ── AI Config ──────────────────────────────────────────────────────────────

export const DEFAULT_AI_PROVIDER = getOptionalEnv("DEFAULT_AI_PROVIDER");
