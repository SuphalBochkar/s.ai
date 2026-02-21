/**
 * AI Module — Shared Types
 * ────────────────────────────────────────────────────────────────────────────
 * All type definitions for the AI provider system.
 * Import from the barrel: `import type { AIProvider } from "@/lib/ai";`
 */

// ── Provider Identity ──────────────────────────────────────────────────────

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
  | "aihubmix";

export type ProviderCategory = "paid" | "free" | "trial" | "community";

// ── Configuration Shapes ───────────────────────────────────────────────────

/** Schema for each entry in models.json — pure data, no secrets. */
export type ModelConfig = {
  category: ProviderCategory;
  apiKeyEnv: string;
  baseURL: string;
  defaultModel: string;
  freeModels: string[];
};

/** Runtime-resolved config (API key filled from env). */
export type ResolvedProviderConfig = {
  apiKey: string | undefined;
  baseURL: string;
  defaultModel: string;
  freeModels: string[];
};

/** What consumers see (chat route validation, model selector UI). */
export type ProviderModels = {
  defaultModel: string;
  freeModels: string[];
};
