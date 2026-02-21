/**
 * AI Provider Runtime
 * ────────────────────────────────────────────────────────────────────────────
 * Pure logic — client creation, caching, SDK provider resolution.
 * Model data lives in `models.json`; types live in `types.ts`.
 *
 * Works with both:
 *   - OpenAI SDK        → getAIClient()     (raw chat completions)
 *   - Vercel AI SDK     → getAISDKModel()   (generateText, streamText, etc.)
 */
import OpenAI from "openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { DEFAULT_AI_PROVIDER } from "@/lib/env";
import type {
  AIProvider,
  ModelConfig,
  ProviderModels,
  ResolvedProviderConfig,
} from "./types";
import { modelConfigs } from "./models";

// ── Config Resolution ──────────────────────────────────────────────────────

const configs = modelConfigs as Record<AIProvider, ModelConfig>;

/** Replace `{ENV_VAR}` placeholders in baseURL with process.env values. */
function resolveBaseURL(url: string): string {
  return url.replace(/\{(\w+)\}/g, (_, key: string) => process.env[key] ?? "");
}

/** Resolve a ModelConfig entry into a runtime-ready config. */
function resolveConfig(provider: AIProvider): ResolvedProviderConfig {
  const raw = configs[provider];
  return {
    apiKey: process.env[raw.apiKeyEnv],
    baseURL: resolveBaseURL(raw.baseURL),
    defaultModel: raw.defaultModel,
    freeModels: raw.freeModels,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function isAIProvider(value: string): value is AIProvider {
  return value in configs;
}

export const AI_DEFAULT_PROVIDER: AIProvider =
  DEFAULT_AI_PROVIDER && isAIProvider(DEFAULT_AI_PROVIDER)
    ? DEFAULT_AI_PROVIDER
    : "openrouter";

/** Consumer-facing model lists (used by chat route validation & UI). */
export const AI_PROVIDER_MODELS: Record<AIProvider, ProviderModels> =
  Object.fromEntries(
    Object.entries(configs).map(([provider, config]) => [
      provider,
      { defaultModel: config.defaultModel, freeModels: config.freeModels },
    ]),
  ) as Record<AIProvider, ProviderModels>;

export function getDefaultModel(
  provider: AIProvider = AI_DEFAULT_PROVIDER,
): string {
  return configs[provider].defaultModel;
}

// ── Caches ─────────────────────────────────────────────────────────────────

const openaiClientCache = new Map<string, OpenAI>();
const sdkProviderCache = new Map<
  string,
  ReturnType<typeof createOpenAICompatible>
>();

// ── OpenAI SDK Client (raw access) ─────────────────────────────────────────

/**
 * Get a raw OpenAI SDK client for any provider.
 * Use for: embeddings, images, fine-tuning, or full control.
 *
 * @example
 * ```ts
 * const client = getAIClient("groq");
 * const res = await client.chat.completions.create({
 *   model: getDefaultModel("groq"),
 *   messages: [{ role: "user", content: "Hello" }],
 * });
 * console.log(res.choices[0].message.content);
 * ```
 */
export function getAIClient(
  provider: AIProvider = AI_DEFAULT_PROVIDER,
): OpenAI {
  const cached = openaiClientCache.get(provider);
  if (cached) return cached;

  const config = resolveConfig(provider);
  if (!config.apiKey) {
    throw new Error(
      `Missing API key for provider "${provider}". ` +
        `Set the ${configs[provider].apiKeyEnv} environment variable.`,
    );
  }

  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });

  openaiClientCache.set(provider, client);
  return client;
}

// ── Vercel AI SDK Providers ────────────────────────────────────────────────

export function getAISDKProvider(provider: AIProvider) {
  const cached = sdkProviderCache.get(provider);
  if (cached) return cached;

  const config = resolveConfig(provider);

  // OpenRouter has its own SDK — special case
  if (provider === "openrouter") {
    const p = createOpenRouter({ apiKey: config.apiKey ?? "" });
    sdkProviderCache.set(
      provider,
      p as unknown as ReturnType<typeof createOpenAICompatible>,
    );
    return p;
  }

  // Every other provider uses the openai-compatible adapter
  const p = createOpenAICompatible({
    name: provider,
    baseURL: config.baseURL,
    headers: { Authorization: `Bearer ${config.apiKey ?? ""}` },
  });

  sdkProviderCache.set(provider, p);
  return p;
}

/**
 * Get a Vercel AI SDK `LanguageModel` ready for `generateText`,
 * `streamText`, `ToolLoopAgent`, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { getAISDKModel } from "@/lib/ai";
 *
 * const { text } = await generateText({
 *   model: getAISDKModel("nvidia", "deepseek-ai/deepseek-v3.1-terminus"),
 *   prompt: "Explain quantum computing",
 * });
 * ```
 */
export function getAISDKModel(provider: AIProvider, modelId: string) {
  const p = getAISDKProvider(provider);

  // OpenRouter uses `.chat()`, openai-compatible uses `.chatModel()`
  if ("chat" in p && typeof p.chat === "function") {
    return (p as ReturnType<typeof createOpenRouter>).chat(modelId);
  }

  return (p as ReturnType<typeof createOpenAICompatible>).chatModel(modelId);
}


