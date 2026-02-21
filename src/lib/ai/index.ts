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
  ModelCapability,
  ModelConfig,
  ProviderCategory,
  ProviderModels,
  ResolvedProviderConfig,
} from "./types";

// ── Data ───────────────────────────────────────────────────────────────────
export { modelConfigs } from "./models";

// ── Runtime ────────────────────────────────────────────────────────────────
export {
  AI_DEFAULT_PROVIDER,
  AI_PROVIDER_MODELS,
  getAIClient,
  getDefaultModel,
  getAISDKModel,
  getAISDKProvider,
} from "./providers";
