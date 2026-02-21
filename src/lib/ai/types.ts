/**
 * AI Module — Shared Types
 * ────────────────────────────────────────────────────────────────────────────
 * All type definitions for the AI provider system.
 * Import from the barrel: `import type { AIProvider } from "@/lib/ai";`
 */

// ── Provider Identity ──────────────────────────────────────────────────────

// src/lib/ai/types.ts
export type AIProvider =
  | "openai"
  | "openrouter"
  | "google-ai"
  | "mistral"
  | "nvidia"
  | "huggingface"
  | "groq"
  | "cohere"
  | "cerebras"
  | "github-models"
  | "cloudflare"
  | "sambanova"
  | "hyperbolic"
  | "fireworks"
  | "scaleway"
  | "aihubmix"
  | "replicate"
  | "stability"
  | "runpod"
  | "banana"
  | "together"
  | "deepseek"
  | "nebius"
  | "novita"
  | "ai21"
  | "upstage"
  | "nlpcloud"
  | "alibaba-cloud"
  | "inference-net"
  | "baseten"
  | "modal"
  | "vercel-ai"
  | "google-vertex";

export type ProviderCategory = "paid" | "free" | "trial" | "community" | "infra";
export type ModelCapability = "text" | "code" | "vision" | "audio" | "multimodal" | "embeddings" | "infra";

/**
 * Static configuration shape (committed to repo; no secrets here).
 * Per-provider metadata + lists of model slugs likely to be available.
 */
export type ModelConfig = {
  category: ProviderCategory;
  apiKeyEnv: string;
  baseURL: string;
  defaultModel: string;
  freeModels: string[];
  paidModels: string[];
  /** high-level capabilities this provider commonly supports */
  capabilities?: ModelCapability[];
  /** used by UIs or automated selection */
  recommendedFor?: ModelCapability[];
  supportsStreaming?: boolean;
  /** optional human note */
  notes?: string;
  /** basic rate limits (approx, optional) */
  rateLimits?: {
    requestsPerMinute?: number;
    tokensPerMinute?: number;
  };
};

/** Runtime-resolved shape (reads api key from env). */
export type ResolvedProviderConfig = {
  apiKey?: string;
  baseURL: string;
  defaultModel: string;
  freeModels: string[];
  capabilities?: ModelCapability[];
  recommendedFor?: ModelCapability[];
  supportsStreaming?: boolean;
  notes?: string;
  rateLimits?: { requestsPerMinute?: number; tokensPerMinute?: number } | undefined;
};

/** Minimal set shown to frontends / validation */
export type ProviderModels = { defaultModel: string; freeModels: string[] };