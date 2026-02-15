/**
 * Unified AI Provider Configuration
 * ────────────────────────────────────────────────────────────────────────────
 * Single source of truth for ALL provider configs.
 * Works with both:
 *   - OpenAI SDK        → getAIClient()     (raw chat completions)
 *   - Vercel AI SDK     → getAISDKModel()   (generateText, streamText, etc.)
 */
import OpenAI from "openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import {
  AIHUBMIX_API_KEY,
  CEREBRAS_API_KEY,
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_API_KEY,
  DEFAULT_AI_PROVIDER,
  FIREWORKS_API_KEY,
  COHERE_API_KEY,
  GITHUB_MODELS_API_KEY,
  GOOGLE_AI_API_KEY,
  GROQ_API_KEY,
  HUGGINGFACE_API_KEY,
  HYPERBOLIC_API_KEY,
  MISTRAL_API_KEY,
  NVIDIA_API_KEY,
  OPENAI_API_KEY,
  OPENROUTER_API_KEY,
  SAMBANOVA_API_KEY,
  SCALEWAY_API_KEY,
} from "@/lib/env";

// ── Types ──────────────────────────────────────────────────────────────────

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

type ProviderConfig = {
  apiKey?: string;
  baseURL: string;
  defaultModel: string;
  freeModels: string[];
};

// ── Single source of truth: all provider configs ───────────────────────────

const providerConfigs: Record<AIProvider, ProviderConfig> = {
  // ── Paid (no free tier) ──────────────────────────────────────────────
  openai: {
    apiKey: OPENAI_API_KEY,
    baseURL: "https://api.openai.com/v1",
    defaultModel: "gpt-4.1-mini",
    freeModels: [],
  },

  // ── Free providers ───────────────────────────────────────────────────
  openrouter: {
    apiKey: OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultModel: "openai/gpt-oss-20b:free",
    freeModels: [
      // OpenAI OSS
      "openai/gpt-oss-120b:free",
      "openai/gpt-oss-20b:free",
      // Meta Llama
      "meta-llama/llama-3.1-405b-instruct:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      // Google Gemma
      "google/gemma-3-27b-it:free",
      "google/gemma-3-12b-it:free",
      "google/gemma-3-4b-it:free",
      "google/gemma-3n-e4b-it:free",
      "google/gemma-3n-e2b-it:free",
      // DeepSeek
      "deepseek/deepseek-r1-0528:free",
      // Qwen
      "qwen/qwen3-coder:free",
      "qwen/qwen3-4b:free",
      "qwen/qwen3-next-80b-a3b-instruct:free",
      "qwen/qwen-2.5-vl-7b-instruct:free",
      // Mistral
      "mistralai/mistral-small-3.1-24b-instruct:free",
      // NVIDIA
      "nvidia/nemotron-3-nano-30b-a3b:free",
      "nvidia/nemotron-nano-12b-v2-vl:free",
      "nvidia/nemotron-nano-9b-v2:free",
      // Moonshot
      "moonshotai/kimi-k2:free",
      // NousResearch
      "nousresearch/hermes-3-llama-3.1-405b:free",
      // Others
      "upstage/solar-pro-3:free",
      "z-ai/glm-4.5-air:free",
      "liquid/lfm-2.5-1.2b-instruct:free",
      "liquid/lfm-2.5-1.2b-thinking:free",
      "tngtech/deepseek-r1t-chimera:free",
      "tngtech/deepseek-r1t2-chimera:free",
      "tngtech/tng-r1t-chimera:free",
      "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
      "arcee-ai/trinity-large-preview:free",
      "arcee-ai/trinity-mini:free",
      "allenai/molmo-2-8b:free",
    ],
  },
  "google-ai": {
    apiKey: GOOGLE_AI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.5-flash",
    freeModels: [
      "gemini-3-flash",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemma-3-27b-it",
      "gemma-3-12b-it",
      "gemma-3-4b-it",
      "gemma-3-1b-it",
    ],
  },
  mistral: {
    apiKey: MISTRAL_API_KEY,
    baseURL: "https://api.mistral.ai/v1",
    defaultModel: "mistral-small-latest",
    freeModels: [
      "mistral-small-latest",
      "mistral-medium-latest",
      "open-mistral-nemo",
      "codestral-latest",
      "mistral-large-latest",
    ],
  },
  nvidia: {
    apiKey: NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
    defaultModel: "deepseek-ai/deepseek-v3.1-terminus",
    freeModels: [
      "deepseek-ai/deepseek-v3.1-terminus",
      "deepseek-ai/deepseek-r1",
      "meta/llama-3.1-8b-instruct",
      "meta/llama-3.1-70b-instruct",
      "meta/llama-3.1-405b-instruct",
      "meta/llama-3.3-70b-instruct",
      "mistralai/mistral-7b-instruct-v0.3",
      "google/gemma-2-9b-it",
    ],
  },
  huggingface: {
    apiKey: HUGGINGFACE_API_KEY,
    baseURL: "https://router.huggingface.co/v1",
    defaultModel: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    freeModels: [
      "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "mistralai/Mistral-7B-Instruct-v0.3",
      "google/gemma-2-9b-it",
    ],
  },
  groq: {
    apiKey: GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    defaultModel: "openai/gpt-oss-20b",
    freeModels: [
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "openai/gpt-oss-safeguard-20b",
      "llama-3.1-8b-instant",
      "llama-3.3-70b-versatile",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "meta-llama/llama-4-maverick-17b-128e-instruct",
      "qwen/qwen3-32b",
      "moonshotai/kimi-k2-instruct",
      "moonshotai/kimi-k2-instruct-0905",
      "allam-2-7b",
      "meta-llama/llama-guard-4-12b",
      "groq/compound-beta",
      "groq/compound-beta-mini",
    ],
  },
  cerebras: {
    apiKey: CEREBRAS_API_KEY,
    baseURL: "https://api.cerebras.ai/v1",
    defaultModel: "gpt-oss-120b",
    freeModels: [
      "gpt-oss-120b",
      "qwen3-235b-a22b",
      "llama-3.3-70b",
      "qwen3-32b",
      "llama-3.1-8b",
      "z-ai/glm-4.6",
    ],
  },
  cohere: {
    apiKey: COHERE_API_KEY,
    baseURL: "https://api.cohere.com/v1",
    defaultModel: "command-a",
    freeModels: ["command-a"],
  },
  "github-models": {
    apiKey: GITHUB_MODELS_API_KEY,
    baseURL: "https://models.github.ai/inference",
    defaultModel: "gpt-4.1-mini",
    freeModels: [
      // OpenAI
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-5",
      "gpt-5-mini",
      "gpt-5-nano",
      "o1",
      "o1-mini",
      "o3",
      "o3-mini",
      "o4-mini",
      // Meta Llama
      "Meta-Llama-3.1-405B-Instruct",
      "Meta-Llama-3.1-8B-Instruct",
      "Llama-3.3-70B-Instruct",
      "Llama-3.2-11B-Vision-Instruct",
      "Llama-3.2-90B-Vision-Instruct",
      "Llama-4-Scout-17B-16E-Instruct",
      "Llama-4-Maverick-17B-128E-Instruct-FP8",
      // DeepSeek
      "DeepSeek-R1",
      "DeepSeek-R1-0528",
      "DeepSeek-V3-0324",
      // Mistral
      "Mistral-Small-3.1",
      "Codestral-2501",
      // Phi
      "Phi-4",
      "Phi-4-mini-instruct",
      "Phi-4-mini-reasoning",
      "Phi-4-multimodal-instruct",
      "Phi-4-reasoning",
      // Others
      "Cohere-command-a",
      "MAI-DS-R1",
    ],
  },
  cloudflare: {
    apiKey: CLOUDFLARE_API_KEY,
    baseURL:`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
    defaultModel: "@cf/openai/gpt-oss-20b",
    freeModels: [
      "@cf/openai/gpt-oss-120b",
      "@cf/openai/gpt-oss-20b",
      "@cf/qwen/qwen3-30b-a3b-fp8",
      "@cf/google/gemma-3-12b-it",
      "@cf/mistralai/mistral-small-3.1-24b-instruct",
      "@cf/qwen/qwq-32b",
      "@cf/qwen/qwen2.5-coder-32b-instruct",
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      "@cf/meta/llama-4-scout-17b-16e-instruct",
      "@cf/meta/llama-3.2-11b-vision-instruct",
      "@cf/meta/llama-3.2-3b-instruct",
      "@cf/meta/llama-3.2-1b-instruct",
      "@cf/meta/llama-3.1-8b-instruct-fp8",
      "@cf/meta/llama-3-8b-instruct",
      "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
      "@cf/aisingapore/gemma-sea-lion-v4-27b-it",
      "@cf/ibm-granite/granite-4.0-h-micro",
      "@cf/meta/llama-guard-3-8b",
    ],
  },
  // ── Trial credit providers ──────────────────────────────────────────

  sambanova: {
    apiKey: SAMBANOVA_API_KEY,
    baseURL: "https://api.sambanova.ai/v1",
    defaultModel: "Meta-Llama-3.1-8B-Instruct",
    freeModels: [
      "Meta-Llama-3.1-8B-Instruct",
      "Meta-Llama-3.3-70B-Instruct",
      "Llama-4-Maverick-17B-128E-Instruct",
      "Qwen/Qwen3-235B",
      "Qwen/Qwen3-32B",
      "deepseek-ai/DeepSeek-R1-0528",
      "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
      "deepseek-ai/DeepSeek-V3-0324",
      "deepseek-ai/DeepSeek-V3.1",
      "deepseek-ai/DeepSeek-V3.1-Terminus",
      "deepseek-ai/DeepSeek-V3.2",
      "openai/gpt-oss-120b",
    ],
  },
  hyperbolic: {
    apiKey: HYPERBOLIC_API_KEY,
    baseURL: "https://api.hyperbolic.xyz/v1",
    defaultModel: "openai/gpt-oss-20b",
    freeModels: [
      "openai/gpt-oss-120b",
      "openai/gpt-oss-120b-turbo",
      "openai/gpt-oss-20b",
      "deepseek-ai/deepseek-r1-0528",
      "deepseek-ai/DeepSeek-V3",
      "deepseek-ai/DeepSeek-V3-0324",
      "meta-llama/Meta-Llama-3.1-405B-Instruct",
      "meta-llama/Meta-Llama-3.1-70B-Instruct",
      "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "meta-llama/Llama-3.2-3B-Instruct",
      "meta-llama/Llama-3.3-70B-Instruct",
      "Qwen/QwQ-32B",
      "Qwen/Qwen2.5-72B-Instruct",
      "Qwen/Qwen2.5-Coder-32B-Instruct",
      "Qwen/Qwen2.5-VL-72B-Instruct",
      "Qwen/Qwen2.5-VL-7B-Instruct",
      "qwen/qwen3-235b-a22b",
      "qwen/qwen3-235b-a22b-instruct-2507",
      "qwen/qwen3-coder-480b-a35b-instruct",
      "qwen/qwen3-next-80b-a3b-instruct",
      "qwen/qwen3-next-80b-a3b-thinking",
      "mistralai/Pixtral-12B-2409",
    ],
  },
  fireworks: {
    apiKey: FIREWORKS_API_KEY,
    baseURL: "https://api.fireworks.ai/inference/v1",
    defaultModel: "accounts/fireworks/models/llama-v3p1-8b-instruct",
    freeModels: [],
  },
  scaleway: {
    apiKey: SCALEWAY_API_KEY,
    baseURL: "https://api.scaleway.ai/v1",
    defaultModel: "llama-3.3-70b-instruct",
    freeModels: [
      "llama-3.3-70b-instruct",
      "llama-3.1-8b-instruct",
      "deepseek-r1-distill-llama-70b",
      "gemma-3-27b-instruct",
      "mistral-nemo-instruct-2407",
      "pixtral-12b-2409",
      "gpt-oss-120b",
      "qwen3-235b-a22b-instruct-2507",
      "qwen3-coder-30b-a3b-instruct",
      "mistral-small-3.2-24b-instruct-2506",
      "devstral-2-123b-instruct-2512",
      "holo2-30b-a3b",
    ],
  },

  // ── Community providers ─────────────────────────────────────────────
  aihubmix: {
    apiKey: AIHUBMIX_API_KEY,
    baseURL: "https://aihubmix.com/v1",
    defaultModel: "gpt-4o-mini",
    freeModels: [],
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function isAIProvider(value: string): value is AIProvider {
  return value in providerConfigs;
}

export const AI_DEFAULT_PROVIDER: AIProvider =
  DEFAULT_AI_PROVIDER && isAIProvider(DEFAULT_AI_PROVIDER)
    ? DEFAULT_AI_PROVIDER
    : "openrouter";

export const AI_PROVIDER_MODELS = Object.fromEntries(
  Object.entries(providerConfigs).map(([provider, config]) => [
    provider,
    { defaultModel: config.defaultModel, freeModels: config.freeModels },
  ]),
) as Record<AIProvider, { defaultModel: string; freeModels: string[] }>;

export function getDefaultModel(
  provider: AIProvider = AI_DEFAULT_PROVIDER,
): string {
  return providerConfigs[provider].defaultModel;
}

// ── Caches ────────────────────────────────────────────────────────────────
const openaiClientCache = new Map<string, OpenAI>();
const sdkProviderCache = new Map<
  string,
  ReturnType<typeof createOpenAICompatible>
>();

// ── OpenAI SDK Client (raw access) ────────────────────────────────────────

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

  const config = providerConfigs[provider];
  if (!config.apiKey) {
    throw new Error(
      `Missing API key for provider "${provider}". Set the matching *_API_KEY environment variable.`,
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

  const config = providerConfigs[provider];

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


