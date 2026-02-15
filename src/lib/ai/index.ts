/**
 * AI module barrel export
 * ────────────────────────────────────────────────────────────────────────────
 * Import everything from `@/lib/ai`:
 *
 *   import { getAIClient, getAISDKModel, type AIProvider } from "@/lib/ai";
 */
export {
  type AIProvider,
  AI_DEFAULT_PROVIDER,
  AI_PROVIDER_MODELS,
  getAIClient,
  getDefaultModel,
  getAISDKModel,
  getAISDKProvider,
} from "./providers";
