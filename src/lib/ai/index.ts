/**
 * AI module barrel export
 * ────────────────────────────────────────────────────────────────────────────
 * Import everything from `@/lib/ai`:
 *
 *   import { getAIClient, getAISDKModel, type AIProvider } from "@/lib/ai";
 */

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  AIProvider,
  ModelConfig,
  ProviderCategory,
  ProviderModels,
  ResolvedProviderConfig,
} from "./types";

// ── Runtime ────────────────────────────────────────────────────────────────
export {
  AI_DEFAULT_PROVIDER,
  AI_PROVIDER_MODELS,
  getAIClient,
  getDefaultModel,
  getAISDKModel,
  getAISDKProvider,
} from "./providers";
