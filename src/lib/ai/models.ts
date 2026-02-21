// src/lib/ai/models-2.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single source-of-truth for ALL provider + model metadata.
// No secrets here — API keys are resolved at runtime via `apiKeyEnv`.
// BaseURL placeholders like {CLOUDFLARE_ACCOUNT_ID} are resolved at runtime.
// ─────────────────────────────────────────────────────────────────────────────

import type { ModelConfig } from "./types";

export const modelConfigs: Record<string, ModelConfig> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // Paid (no free tier)
  // ═══════════════════════════════════════════════════════════════════════════

  openai: {
    category: "paid",
    apiKeyEnv: "OPENAI_API_KEY",
    baseURL: "https://api.openai.com/v1",
    defaultModel: "gpt-4.1-mini",
    freeModels: [],
    paidModels: [
      "gpt-4.1",
      "gpt-4.1-mini",
      "gpt-4.1-nano",
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4o-realtime-preview",
      "gpt-4o-audio-preview",
      "gpt-4o-mini-audio-preview",
      "gpt-4o-mini-realtime-preview",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
      "o1",
      "o1-mini",
      "o1-preview",
      "o1-pro",
      "o3",
      "o3-mini",
      "o3-pro",
      "o4-mini",
      "gpt-5",
      "gpt-5-mini",
      "text-embedding-3-large",
      "text-embedding-3-small",
    ],
    capabilities: ["text", "code", "embeddings", "multimodal"],
    supportsStreaming: true,
    notes: "Primary paid fallback; highest reliability for embeddings/images.",
  },

  anthropic: {
    category: "paid",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    baseURL: "https://api.anthropic.com/v1",
    defaultModel: "claude-3.5-sonnet",
    freeModels: [],
    paidModels: [
      "claude-3.5-sonnet",
      "claude-3-opus",
      "claude-3-sonnet",
      "claude-3-haiku",
      "claude-2.1",
      "claude-2.0",
      "claude-instant-1.2",
    ],
    capabilities: ["text", "code", "multimodal"],
    supportsStreaming: true,
    notes: "Added as paid provider for Claude models. High-quality reasoning.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Free providers (persistent free tier, no credit expiry)
  // ═══════════════════════════════════════════════════════════════════════════

  openrouter: {
    category: "free",
    apiKeyEnv: "OPENROUTER_API_KEY",
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
      // NVIDIA Nemotron
      "nvidia/nemotron-3-nano-30b-a3b:free",
      "nvidia/nemotron-nano-12b-v2-vl:free",
      "nvidia/nemotron-nano-9b-v2:free",
      // Moonshot
      "moonshotai/kimi-k2:free",
      // NousResearch
      "nousresearch/hermes-3-llama-3.1-405b:free",
      // Other
      "upstage/solar-pro-3:free",
      "z-ai/glm-4.5-air:free",
      "stepfun/step-3.5-flash:free",
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
    paidModels: [
      "anthropic/claude-3.7-sonnet",
      "anthropic/claude-3.5-sonnet",
      "anthropic/claude-sonnet-4.6",
      "anthropic/claude-opus-4.6",
      "openai/gpt-4o",
      "google/gemini-2.5-pro",
      "google/gemini-3.1-pro-preview",
      "meta-llama/llama-3.3-70b-instruct",
      "qwen/qwen3.5-plus-02-15",
      "qwen/qwen3.5-397b-a17b",
      "qwen/qwen3-max-thinking",
      "qwen/qwen3-coder-next",
      "minimax/minimax-m2.5",
      "z-ai/glm-5",
      "sourceful/riverflow-v2-pro",
      "sourceful/riverflow-v2-fast",
    ],
    capabilities: ["text", "code", "multimodal"],
    notes: "Great free option. Quotas vary by day/minute.",
  },

  "google-ai": {
    category: "free",
    apiKeyEnv: "GOOGLE_AI_API_KEY",
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
    paidModels: [
      "gemini-2.5-pro",
      "gemini-2.0-pro-exp",
      "gemini-2.0-flash",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
    ],
    capabilities: ["text", "multimodal", "embeddings"],
    supportsStreaming: true,
    notes: "Data usage policy differs by region (EU/UK/CH/EEA protections).",
    rateLimits: { requestsPerMinute: 30 },
  },

  mistral: {
    category: "free",
    apiKeyEnv: "MISTRAL_API_KEY",
    baseURL: "https://api.mistral.ai/v1",
    defaultModel: "mistral-small-latest",
    freeModels: [
      "mistral-small-latest",
      "mistral-medium-latest",
      "open-mistral-nemo",
      "codestral-latest",
      "mistral-large-latest",
    ],
    paidModels: [
      "mistral-large-2411",
      "mistral-medium-2312",
      "pixtral-large-2411",
      "pixtral-large-latest",
    ],
    capabilities: ["text", "code"],
    supportsStreaming: false,
  },

  nvidia: {
    category: "free",
    apiKeyEnv: "NVIDIA_API_KEY",
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
    paidModels: [
      "nvidia/llama-3.1-nemotron-70b-instruct",
    ],
    capabilities: ["text", "code"],
    supportsStreaming: true,
  },

  huggingface: {
    category: "free",
    apiKeyEnv: "HUGGINGFACE_API_KEY",
    baseURL: "https://router.huggingface.co/v1",
    defaultModel: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    freeModels: [
      "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "mistralai/Mistral-7B-Instruct-v0.3",
      "google/gemma-2-9b-it",
    ],
    paidModels: [
      "meta-llama/Meta-Llama-3.3-70B-Instruct",
    ],
    capabilities: ["text", "vision"],
  },

  groq: {
    category: "free",
    apiKeyEnv: "GROQ_API_KEY",
    baseURL: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    freeModels: [
      // OpenAI OSS via Groq
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "openai/gpt-oss-safeguard-20b",
      // Llama
      "llama-3.1-8b-instant",
      "llama-3.3-70b-versatile",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "meta-llama/llama-4-maverick-17b-128e-instruct",
      // Qwen
      "qwen/qwen3-32b",
      // Moonshot
      "moonshotai/kimi-k2-instruct",
      "moonshotai/kimi-k2-instruct-0905",
      // Other
      "allam-2-7b",
      "meta-llama/llama-guard-4-12b",
      "meta-llama/llama-prompt-guard-2-22m",
      "meta-llama/llama-prompt-guard-2-86m",
      "canopylabs/orpheus-arabic-saudi",
      "canopylabs/orpheus-v1-english",
      // Groq compound (both naming variants preserved)
      "groq/compound-beta",
      "groq/compound-beta-mini",
      "groq/compound",
      "groq/compound-mini",
      // Audio
      "whisper-large-v3",
      "whisper-large-v3-turbo",
    ],
    paidModels: [],
    capabilities: ["text", "code"],
    supportsStreaming: true,
  },

  cerebras: {
    category: "free",
    apiKeyEnv: "CEREBRAS_API_KEY",
    baseURL: "https://api.cerebras.ai/v1",
    defaultModel: "llama-3.3-70b",
    freeModels: [
      "gpt-oss-120b",
      "qwen3-235b-a22b",
      "llama-3.3-70b",
      "qwen3-32b",
      "llama-3.1-8b",
      "z-ai/glm-4.6",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  cohere: {
    category: "free",
    apiKeyEnv: "COHERE_API_KEY",
    baseURL: "https://api.cohere.com/v1",
    defaultModel: "command-a-03-2025",
    freeModels: [
      // Legacy alias kept for backward compat
      "command-a",
      // Current models (all share 1,000 req/month quota)
      "command-a-03-2025",
      "command-a-reasoning-08-2025",
      "command-a-translate-08-2025",
      "command-a-vision-07-2025",
      "command-r-plus-08-2024",
      "command-r-08-2024",
      "command-r7b-12-2024",
      "command-r7b-arabic-02-2025",
      "c4ai-aya-expanse-32b",
      "c4ai-aya-expanse-8b",
      "c4ai-aya-vision-32b",
      "c4ai-aya-vision-8b",
      "tiny-aya-global",
    ],
    paidModels: [],
    capabilities: ["text", "embeddings"],
  },

  "github-models": {
    category: "free",
    apiKeyEnv: "GITHUB_MODELS_API_KEY",
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
      "gpt-5-chat",
      "o1",
      "o1-mini",
      "o1-preview",
      "o3",
      "o3-mini",
      "o4-mini",
      // Embeddings
      "text-embedding-3-large",
      "text-embedding-3-small",
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
      // xAI
      "Grok-3",
      "Grok-3-mini",
      // Mistral
      "Mistral-Small-3.1",
      "Mistral-Medium-3",
      "Codestral-2501",
      "Ministral-3B",
      // Microsoft Phi
      "Phi-4",
      "Phi-4-mini-instruct",
      "Phi-4-mini-reasoning",
      "Phi-4-multimodal-instruct",
      "Phi-4-reasoning",
      // Other
      "AI21-Jamba-1.5-Large",
      "Cohere-command-a",
      "MAI-DS-R1",
    ],
    paidModels: [],
    capabilities: ["text"],
    notes: "Extremely restrictive input/output token limits.",
  },

  cloudflare: {
    category: "free",
    apiKeyEnv: "CLOUDFLARE_API_KEY",
    baseURL: "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
    defaultModel: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    freeModels: [
      // OpenAI OSS
      "@cf/openai/gpt-oss-120b",
      "@cf/openai/gpt-oss-20b",
      // Qwen
      "@cf/qwen/qwen3-30b-a3b-fp8",
      "@cf/qwen/qwq-32b",
      "@cf/qwen/qwen2.5-coder-32b-instruct",
      "@cf/qwen/qwen1.5-7b-chat-awq",
      "@cf/qwen/qwen1.5-14b-chat-awq",
      // Google
      "@cf/google/gemma-3-12b-it",
      // Mistral
      "@cf/mistralai/mistral-small-3.1-24b-instruct",
      "@cf/mistralai/mistral-7b-instruct-v0.2",
      "@cf/mistralai/mistral-7b-instruct-v0.1",
      // Meta Llama
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      "@cf/meta/llama-4-scout-17b-16e-instruct",
      "@cf/meta/llama-3.2-11b-vision-instruct",
      "@cf/meta/llama-3.2-3b-instruct",
      "@cf/meta/llama-3.2-1b-instruct",
      "@cf/meta/llama-3.1-8b-instruct-fp8",
      "@cf/meta/llama-3.1-8b-instruct-awq",
      "@cf/meta/llama-3-8b-instruct",
      "@cf/meta/llama-3-8b-instruct-awq",
      "@cf/meta/llama-2-7b-chat-fp16",
      "@cf/meta/llama-2-7b-chat-int8",
      "@cf/meta/llama-guard-3-8b",
      // DeepSeek
      "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
      // Other
      "@cf/aisingapore/gemma-sea-lion-v4-27b-it",
      "@cf/ibm-granite/granite-4.0-h-micro",
      "@cf/zai-org/glm-4.7-flash",
      "@cf/openchat/openchat-3.5-0106",
      "@cf/microsoft/phi-2",
      "@cf/tinyllama/tinyllama-1.1b-chat-v1.0",
      "@cf/starling-lm/starling-lm-7b-beta",
      "@cf/thebloke/discolm-german-7b-v1-awq",
      "@cf/defog/sqlcoder-7b-2",
      "@cf/tiiuae/falcon-7b-instruct",
    ],
    paidModels: [],
    capabilities: ["text", "vision"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Trial / signup-credit providers
  // ═══════════════════════════════════════════════════════════════════════════

  sambanova: {
    category: "trial",
    apiKeyEnv: "SAMBANOVA_API_KEY",
    baseURL: "https://api.sambanova.ai/v1",
    defaultModel: "Meta-Llama-3.3-70B-Instruct",
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
      "E5-Mistral-7B-Instruct",
      "Whisper-Large-v3",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  hyperbolic: {
    category: "trial",
    apiKeyEnv: "HYPERBOLIC_API_KEY",
    baseURL: "https://api.hyperbolic.xyz/v1",
    defaultModel: "meta-llama/Llama-3.3-70B-Instruct",
    freeModels: [
      // OpenAI OSS
      "openai/gpt-oss-120b",
      "openai/gpt-oss-120b-turbo",
      "openai/gpt-oss-20b",
      // DeepSeek
      "deepseek-ai/deepseek-r1-0528",
      "deepseek-ai/DeepSeek-V3",
      "deepseek-ai/DeepSeek-V3-0324",
      // Llama
      "meta-llama/Meta-Llama-3.1-405B-Instruct",
      "meta-llama/Meta-Llama-3.1-405B-Base",
      "meta-llama/Meta-Llama-3.1-70B-Instruct",
      "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "meta-llama/Llama-3.2-3B-Instruct",
      "meta-llama/Llama-3.3-70B-Instruct",
      // Qwen
      "qwen/qwen3-235b-a22b",
      "qwen/qwen3-235b-a22b-instruct-2507",
      "qwen/qwen3-coder-480b-a35b-instruct",
      "qwen/qwen3-next-80b-a3b-instruct",
      "qwen/qwen3-next-80b-a3b-thinking",
      "Qwen/QwQ-32B",
      "Qwen/Qwen2.5-72B-Instruct",
      "Qwen/Qwen2.5-Coder-32B-Instruct",
      "Qwen/Qwen2.5-VL-72B-Instruct",
      "Qwen/Qwen2.5-VL-7B-Instruct",
      // Mistral
      "mistralai/Pixtral-12B-2409",
    ],
    paidModels: [],
    capabilities: ["text", "code"],
  },

  fireworks: {
    category: "trial",
    apiKeyEnv: "FIREWORKS_API_KEY",
    baseURL: "https://api.fireworks.ai/inference/v1",
    defaultModel: "accounts/fireworks/models/llama-v3p3-70b-instruct",
    freeModels: [
      "accounts/fireworks/models/llama-v3p3-70b-instruct",
      "accounts/fireworks/models/llama-v3p1-8b-instruct",
      "accounts/fireworks/models/deepseek-r1",
      "accounts/fireworks/models/qwen3-235b-a22b",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  scaleway: {
    category: "trial",
    apiKeyEnv: "SCALEWAY_API_KEY",
    baseURL: "https://api.scaleway.ai/v1",
    defaultModel: "llama-3.3-70b-instruct",
    freeModels: [
      "llama-3.3-70b-instruct",
      "llama-3.1-8b-instruct",
      "deepseek-r1-distill-llama-70b",
      "gemma-3-27b-instruct",
      "mistral-nemo-instruct-2407",
      "mistral-small-3.2-24b-instruct-2506",
      "pixtral-12b-2409",
      "gpt-oss-120b",
      "qwen3-235b-a22b-instruct-2507",
      "qwen3-coder-30b-a3b-instruct",
      "qwen3-embedding-8b",
      "devstral-2-123b-instruct-2512",
      "holo2-30b-a3b",
      "voxtral-small-24b-2507",
      "bge-multilingual-gemma2",
      "whisper-large-v3",
    ],
    paidModels: [],
    capabilities: ["text", "vision"],
  },

  nebius: {
    category: "trial",
    apiKeyEnv: "NEBIUS_API_KEY",
    baseURL: "https://api.studio.nebius.ai/v1",
    defaultModel: "meta-llama/Meta-Llama-3.1-70B-Instruct",
    freeModels: [
      "meta-llama/Meta-Llama-3.1-70B-Instruct",
      "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "meta-llama/Llama-3.3-70B-Instruct",
      "Qwen/Qwen2.5-72B-Instruct",
      "Qwen/Qwen2.5-Coder-32B-Instruct",
      "deepseek-ai/DeepSeek-R1",
      "deepseek-ai/DeepSeek-V3",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  novita: {
    category: "trial",
    apiKeyEnv: "NOVITA_API_KEY",
    baseURL: "https://api.novita.ai/v3/openai",
    defaultModel: "meta-llama/llama-3.3-70b-instruct",
    freeModels: [
      "meta-llama/llama-3.3-70b-instruct",
      "meta-llama/llama-3.1-8b-instruct",
      "deepseek/deepseek-r1",
      "deepseek/deepseek-v3",
      "Qwen/Qwen2.5-72B-Instruct",
      "mistralai/mistral-7b-instruct",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  ai21: {
    category: "trial",
    apiKeyEnv: "AI21_API_KEY",
    baseURL: "https://api.ai21.com/studio/v1",
    defaultModel: "jamba-1.5-large",
    freeModels: [
      "jamba-1.5-large",
      "jamba-1.5-mini",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  upstage: {
    category: "trial",
    apiKeyEnv: "UPSTAGE_API_KEY",
    baseURL: "https://api.upstage.ai/v1/solar",
    defaultModel: "solar-pro",
    freeModels: [
      "solar-pro",
      "solar-mini",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  together: {
    category: "trial",
    apiKeyEnv: "TOGETHER_API_KEY",
    baseURL: "https://api.together.xyz/v1",
    defaultModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    freeModels: [
      "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      "meta-llama/Llama-3.3-70B-Instruct",
      "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      "deepseek-ai/DeepSeek-R1",
      "deepseek-ai/DeepSeek-V3",
      "Qwen/Qwen2.5-72B-Instruct-Turbo",
      "Qwen/Qwen2.5-Coder-32B-Instruct",
      "Qwen/Qwen3-32B-Instruct",
      "mistralai/Mixtral-8x22B-Instruct-v0.1",
      "google/gemma-2-27b-it",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  deepseek: {
    category: "trial",
    apiKeyEnv: "DEEPSEEK_API_KEY",
    baseURL: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    freeModels: [
      "deepseek-chat",
      "deepseek-reasoner",
      // Legacy aliases
      "deepseek-r1",
      "deepseek-v3",
      "deepseek-coder",
    ],
    paidModels: [],
    capabilities: ["text", "code"],
  },

  nlpcloud: {
    category: "trial",
    apiKeyEnv: "NLPCLOUD_API_KEY",
    baseURL: "https://api.nlpcloud.io/v1/gpu",
    defaultModel: "finetuned-llama-3-70b",
    freeModels: [
      "finetuned-llama-3-70b",
      "finetuned-llama-3-8b",
      "chatdolphin",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  "alibaba-cloud": {
    category: "trial",
    apiKeyEnv: "ALIBABA_CLOUD_API_KEY",
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen-plus",
    freeModels: [
      "qwen-plus",
      "qwen-turbo",
      "qwen-max",
      "qwen-long",
      "qwen2.5-72b-instruct",
      "qwen2.5-7b-instruct",
      "qwq-32b",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  "inference-net": {
    category: "trial",
    apiKeyEnv: "INFERENCE_NET_API_KEY",
    baseURL: "https://api.inference.net/v1",
    defaultModel: "meta-llama/llama-3.3-70b-instruct/fp-8",
    freeModels: [
      "meta-llama/llama-3.3-70b-instruct/fp-8",
      "meta-llama/llama-3.1-8b-instruct/fp-8",
      "deepseek-ai/deepseek-r1/fp-8",
      "qwen/qwen2.5-72b-instruct/fp-8",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  baseten: {
    category: "trial",
    apiKeyEnv: "BASETEN_API_KEY",
    baseURL: "https://api.baseten.co/v1",
    defaultModel: "",
    freeModels: [],
    paidModels: [],
    capabilities: ["text"],
    notes: "Custom model deployments — configure models after deploy.",
  },

  modal: {
    category: "trial",
    apiKeyEnv: "MODAL_API_KEY",
    baseURL: "https://api.modal.com/v1",
    defaultModel: "",
    freeModels: [],
    paidModels: [],
    capabilities: ["text"],
    notes: "Serverless GPU compute — deploy custom models.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Community / aggregator
  // ═══════════════════════════════════════════════════════════════════════════

  aihubmix: {
    category: "community",
    apiKeyEnv: "AIHUBMIX_API_KEY",
    baseURL: "https://aihubmix.com/v1",
    defaultModel: "gpt-4o-mini",
    freeModels: [],
    paidModels: [
      "gpt-4o",
      "claude-3-5-sonnet-20241022",
      "gemini-1.5-pro",
      "gemini-3.1-pro-preview",
      "gemini-3.1-pro-preview-customtools",
      "gemini-3.1-pro-preview-search",
      "gemini-3-flash-preview",
      "gemini-3-flash-preview-search",
      "claude-sonnet-4-6",
      "claude-sonnet-4-6-think",
      "claude-opus-4-6",
      "claude-opus-4-6-think",
      "claude-opus-4-5",
      "claude-opus-4-5-think",
      "qwen3.5-397b-a17b",
      "qwen3.5-plus",
      "doubao-seed-2-0-pro",
      "doubao-seed-2-0-code-preview",
      "doubao-seed-2-0-lite",
      "doubao-seed-2-0-mini",
      "glm-5",
    ],
    capabilities: ["text"],
    notes: "Community proxy — availability varies.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Specialty (vision, multimodal, infra)
  // ═══════════════════════════════════════════════════════════════════════════

  "google-vertex": {
    category: "free",
    apiKeyEnv: "GOOGLE_VERTEX_API_KEY",
    baseURL: "https://us-central1-aiplatform.googleapis.com/v1",
    defaultModel: "llama-3.1-70b-instruct-maas",
    freeModels: [
      "llama-3.2-90b-vision-instruct-maas",
      "llama-3.1-70b-instruct-maas",
      "llama-3.1-8b-instruct-maas",
    ],
    paidModels: [],
    capabilities: ["text"],
  },

  "vercel-ai": {
    category: "free",
    apiKeyEnv: "VERCEL_AI_API_KEY",
    baseURL: "https://gateway.ai.vercel.app/v1",
    defaultModel: "",
    freeModels: [],
    paidModels: [],
    capabilities: ["text"],
    notes: "Vercel AI Gateway — routes to configured providers.",
  },

  stability: {
    category: "free",
    apiKeyEnv: "STABILITY_API_KEY",
    baseURL: "https://api.stability.ai/v1",
    defaultModel: "stability/stable-diffusion-xl-beta",
    freeModels: [
      "stability/stable-diffusion-xl-beta",
    ],
    paidModels: [],
    capabilities: ["vision"],
    notes: "Image generation (Stable Diffusion family).",
  },

  replicate: {
    category: "free",
    apiKeyEnv: "REPLICATE_API_TOKEN",
    baseURL: "https://api.replicate.com/v1",
    defaultModel: "stability/stable-diffusion-xl-beta",
    freeModels: [],
    paidModels: [],
    capabilities: ["vision", "multimodal"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Infra / hosting stubs (no models — GPU compute platforms)
  // ═══════════════════════════════════════════════════════════════════════════

  runpod: {
    category: "infra",
    apiKeyEnv: "RUNPOD_API_KEY",
    baseURL: "https://api.runpod.io/v1",
    defaultModel: "",
    freeModels: [],
    paidModels: [],
    capabilities: ["infra"],
    notes: "Use to spin up private GPU pods.",
  },

  banana: {
    category: "infra",
    apiKeyEnv: "BANANA_API_KEY",
    baseURL: "https://api.banana.dev",
    defaultModel: "",
    freeModels: [],
    paidModels: [],
    capabilities: ["infra"],
    notes: "Autoscaling inference platform.",
  },
};

