// src/lib/ai/providers.ts
import OpenAI from "openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import type { AIProvider, ModelCapability, ProviderModels, ResolvedProviderConfig } from "./types";
import { modelConfigs } from "./models";


function resolveBaseURL(url: string): string {
  return url.replace(/\{(\w+)\}/g, (_, key: string) => process.env[key] ?? "");
}

export function resolveConfig(provider: AIProvider): ResolvedProviderConfig {
  const raw = modelConfigs[provider];
  if (!raw) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  return {
    apiKey: process.env[raw.apiKeyEnv],
    baseURL: resolveBaseURL(raw.baseURL),
    defaultModel: raw.defaultModel,
    freeModels: raw.freeModels,
    capabilities: raw.capabilities,
    recommendedFor: raw.recommendedFor,
    supportsStreaming: raw.supportsStreaming,
    notes: raw.notes,
    rateLimits: raw.rateLimits,
  };
}

/** Is this provider key present in our static modelConfigs? */
export function isAIProvider(value: string): value is AIProvider {
  return Object.prototype.hasOwnProperty.call(modelConfigs, value);
}

/** Default provider (override by setting DEFAULT_AI_PROVIDER in env). */
export const AI_DEFAULT_PROVIDER: AIProvider = (() => {
  const env = process.env["DEFAULT_AI_PROVIDER"];
  if (env && isAIProvider(env)) return env;
  return "openrouter";
})();

/** Minimal model lists used by UIs & validation. */
export const AI_PROVIDER_MODELS: Record<string, ProviderModels> = Object.fromEntries(
  Object.entries(modelConfigs).map(([provider, cfg]) => [
    provider,
    { defaultModel: cfg.defaultModel, freeModels: cfg.freeModels || [] },
  ]),
);

/** Get default model string for a provider. */
export function getDefaultModel(provider: AIProvider = AI_DEFAULT_PROVIDER): string {
  return modelConfigs[provider]?.defaultModel ?? "";
}

// ---------- Caches ----------
const openaiClientCache = new Map<string, OpenAI>();
const sdkProviderCache = new Map<string, ReturnType<typeof createOpenAICompatible> | ReturnType<typeof createOpenRouter>>();

/**
 * Create/return an OpenAI SDK client pointed at any provider that supports an
 * OpenAI-compatible HTTP API. Useful for embeddings, images, and low-level ops.
 */
export function getAIClient(provider: AIProvider = AI_DEFAULT_PROVIDER): OpenAI {
  const cached = openaiClientCache.get(provider);
  if (cached) return cached;

  const cfg = resolveConfig(provider);
  if (!cfg.apiKey) {
    throw new Error(
      `Missing API key for provider "${provider}". Please set env ${modelConfigs[provider].apiKeyEnv}`
    );
  }

  const client = new OpenAI({
    apiKey: cfg.apiKey,
    baseURL: cfg.baseURL,
  });

  openaiClientCache.set(provider, client);
  return client;
}

/**
 * Get an SDK provider compatible with the Vercel AI SDK approach.
 * Special-cases: OpenRouter has a native SDK; everything else uses the openai-compatible adapter.
 */
export function getAISDKProvider(provider: AIProvider) {
  const cached = sdkProviderCache.get(provider);
  if (cached) return cached;

  const cfg = resolveConfig(provider);

  if (provider === "openrouter") {
    const p = createOpenRouter({ apiKey: cfg.apiKey ?? "" });
    sdkProviderCache.set(provider, p);
    return p;
  }

  const p = createOpenAICompatible({
    name: provider,
    baseURL: cfg.baseURL,
    headers: { Authorization: `Bearer ${cfg.apiKey ?? ""}` },
  });

  sdkProviderCache.set(provider, p);
  return p;
}

/**
 * Return a LanguageModel object ready for Vercel-style generateText/streamText use.
 * Usage: model: getAISDKModel("openrouter", "openai/gpt-oss-20b:free")
 */
export function getAISDKModel(provider: AIProvider, modelId: string) {
  const sdk = getAISDKProvider(provider);

  // OpenRouter exposes .chat(); the adapter exposes .chatModel
  if ("chat" in sdk && typeof (sdk).chat === "function") {
    return (sdk as unknown as ReturnType<typeof createOpenRouter>).chat(modelId);
  }

  return (sdk as unknown as ReturnType<typeof createOpenAICompatible>).chatModel(modelId);
}

/**
 * Lightweight automatic model selection helper.
 * - capability: the task capability you need (text | code | vision | audio | embeddings)
 * - preferFree: if true prefer free/trial providers first
 * - preferredProviders: optional allowlist (helps for geographic/regulatory reasons)
 *
 * Returns: { provider, model } or null when nothing found.
 */
export function selectModelForTask({
  capability,
  preferFree = true,
  preferredProviders,
}: {
  capability: ModelCapability;
  preferFree?: boolean;
  preferredProviders?: AIProvider[];
}): { provider: AIProvider; model: string } | null {
  // gather candidate providers that list the capability
  const candidates = Object.entries(modelConfigs)
    .filter(([provider, cfg]) => {
      if (preferredProviders && !preferredProviders.includes(provider as AIProvider)) return false;
      const caps = cfg.capabilities ?? [];
      return caps.includes(capability) || (cfg.defaultModel && capability === "text");
    })
    .map(([p, cfg]) => ({ provider: p as AIProvider, cfg }));

  // scoring: prefer free/trial first if requested, then by category order, then by presence of freeModels
  const scored = candidates
    .map(({ provider, cfg }) => {
      const score =
        (preferFree && (cfg.category === "free" || cfg.category === "trial") ? 30 : 0) +
        (cfg.freeModels && cfg.freeModels.length ? 10 : 0) +
        (cfg.category === "paid" ? 1 : 0);
      return { provider, cfg, score };
    })
    .sort((a, b) => b.score - a.score);

  for (const c of scored) {
    // prefer a free model if preferFree and available
    if (preferFree && c.cfg.freeModels && c.cfg.freeModels.length > 0) {
      return { provider: c.provider, model: c.cfg.freeModels[0] };
    }
    // otherwise return default model when present
    if (c.cfg.defaultModel) return { provider: c.provider, model: c.cfg.defaultModel };
  }

  return null;
}