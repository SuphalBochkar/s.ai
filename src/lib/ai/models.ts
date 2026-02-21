export const modelConfigs = {
  "openai": {
    "category": "paid",
    "apiKeyEnv": "OPENAI_API_KEY",
    "baseURL": "https://api.openai.com/v1",
    "defaultModel": "gpt-4.1-mini",
    "freeModels": []
  },

  "openrouter": {
    "category": "free",
    "apiKeyEnv": "OPENROUTER_API_KEY",
    "baseURL": "https://openrouter.ai/api/v1",
    "defaultModel": "openai/gpt-oss-20b:free",
    "freeModels": [
      "openai/gpt-oss-120b:free",
      "openai/gpt-oss-20b:free",
      "meta-llama/llama-3.1-405b-instruct:free",
      "meta-llama/llama-3.3-70b-instruct:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "google/gemma-3-27b-it:free",
      "google/gemma-3-12b-it:free",
      "google/gemma-3-4b-it:free",
      "google/gemma-3n-e4b-it:free",
      "google/gemma-3n-e2b-it:free",
      "deepseek/deepseek-r1-0528:free",
      "qwen/qwen3-coder:free",
      "qwen/qwen3-4b:free",
      "qwen/qwen3-next-80b-a3b-instruct:free",
      "qwen/qwen-2.5-vl-7b-instruct:free",
      "mistralai/mistral-small-3.1-24b-instruct:free",
      "nvidia/nemotron-3-nano-30b-a3b:free",
      "nvidia/nemotron-nano-12b-v2-vl:free",
      "nvidia/nemotron-nano-9b-v2:free",
      "moonshotai/kimi-k2:free",
      "nousresearch/hermes-3-llama-3.1-405b:free",
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
      "allenai/molmo-2-8b:free"
    ]
  },

  "google-ai": {
    "category": "free",
    "apiKeyEnv": "GOOGLE_AI_API_KEY",
    "baseURL": "https://generativelanguage.googleapis.com/v1beta/openai",
    "defaultModel": "gemini-2.5-flash",
    "freeModels": [
      "gemini-3-flash",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemma-3-27b-it",
      "gemma-3-12b-it",
      "gemma-3-4b-it",
      "gemma-3-1b-it"
    ]
  },

  "mistral": {
    "category": "free",
    "apiKeyEnv": "MISTRAL_API_KEY",
    "baseURL": "https://api.mistral.ai/v1",
    "defaultModel": "mistral-small-latest",
    "freeModels": [
      "mistral-small-latest",
      "mistral-medium-latest",
      "open-mistral-nemo",
      "codestral-latest",
      "mistral-large-latest"
    ]
  },

  "nvidia": {
    "category": "free",
    "apiKeyEnv": "NVIDIA_API_KEY",
    "baseURL": "https://integrate.api.nvidia.com/v1",
    "defaultModel": "deepseek-ai/deepseek-v3.1-terminus",
    "freeModels": [
      "deepseek-ai/deepseek-v3.1-terminus",
      "deepseek-ai/deepseek-r1",
      "meta/llama-3.1-8b-instruct",
      "meta/llama-3.1-70b-instruct",
      "meta/llama-3.1-405b-instruct",
      "meta/llama-3.3-70b-instruct",
      "mistralai/mistral-7b-instruct-v0.3",
      "google/gemma-2-9b-it"
    ]
  },

  "huggingface": {
    "category": "free",
    "apiKeyEnv": "HUGGINGFACE_API_KEY",
    "baseURL": "https://router.huggingface.co/v1",
    "defaultModel": "meta-llama/Meta-Llama-3.1-8B-Instruct",
    "freeModels": [
      "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "mistralai/Mistral-7B-Instruct-v0.3",
      "google/gemma-2-9b-it"
    ]
  },

  "groq": {
    "category": "free",
    "apiKeyEnv": "GROQ_API_KEY",
    "baseURL": "https://api.groq.com/openai/v1",
    "defaultModel": "openai/gpt-oss-20b",
    "freeModels": [
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
      "groq/compound-beta-mini"
    ]
  },

  "cerebras": {
    "category": "free",
    "apiKeyEnv": "CEREBRAS_API_KEY",
    "baseURL": "https://api.cerebras.ai/v1",
    "defaultModel": "gpt-oss-120b",
    "freeModels": [
      "gpt-oss-120b",
      "qwen3-235b-a22b",
      "llama-3.3-70b",
      "qwen3-32b",
      "llama-3.1-8b",
      "z-ai/glm-4.6"
    ]
  },

  "cohere": {
    "category": "free",
    "apiKeyEnv": "COHERE_API_KEY",
    "baseURL": "https://api.cohere.com/v1",
    "defaultModel": "command-a",
    "freeModels": [
      "command-a"
    ]
  },

  "github-models": {
    "category": "free",
    "apiKeyEnv": "GITHUB_MODELS_API_KEY",
    "baseURL": "https://models.github.ai/inference",
    "defaultModel": "gpt-4.1-mini",
    "freeModels": [
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
      "Meta-Llama-3.1-405B-Instruct",
      "Meta-Llama-3.1-8B-Instruct",
      "Llama-3.3-70B-Instruct",
      "Llama-3.2-11B-Vision-Instruct",
      "Llama-3.2-90B-Vision-Instruct",
      "Llama-4-Scout-17B-16E-Instruct",
      "Llama-4-Maverick-17B-128E-Instruct-FP8",
      "DeepSeek-R1",
      "DeepSeek-R1-0528",
      "DeepSeek-V3-0324",
      "Mistral-Small-3.1",
      "Codestral-2501",
      "Phi-4",
      "Phi-4-mini-instruct",
      "Phi-4-mini-reasoning",
      "Phi-4-multimodal-instruct",
      "Phi-4-reasoning",
      "Cohere-command-a",
      "MAI-DS-R1"
    ]
  },

  "cloudflare": {
    "category": "free",
    "apiKeyEnv": "CLOUDFLARE_API_KEY",
    "baseURL": "https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/v1",
    "defaultModel": "@cf/openai/gpt-oss-20b",
    "freeModels": [
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
      "@cf/meta/llama-guard-3-8b"
    ]
  },

  "sambanova": {
    "category": "trial",
    "apiKeyEnv": "SAMBANOVA_API_KEY",
    "baseURL": "https://api.sambanova.ai/v1",
    "defaultModel": "Meta-Llama-3.1-8B-Instruct",
    "freeModels": [
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
      "openai/gpt-oss-120b"
    ]
  },

  "hyperbolic": {
    "category": "trial",
    "apiKeyEnv": "HYPERBOLIC_API_KEY",
    "baseURL": "https://api.hyperbolic.xyz/v1",
    "defaultModel": "openai/gpt-oss-20b",
    "freeModels": [
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
      "mistralai/Pixtral-12B-2409"
    ]
  },

  "fireworks": {
    "category": "trial",
    "apiKeyEnv": "FIREWORKS_API_KEY",
    "baseURL": "https://api.fireworks.ai/inference/v1",
    "defaultModel": "accounts/fireworks/models/llama-v3p1-8b-instruct",
    "freeModels": []
  },

  "scaleway": {
    "category": "trial",
    "apiKeyEnv": "SCALEWAY_API_KEY",
    "baseURL": "https://api.scaleway.ai/v1",
    "defaultModel": "llama-3.3-70b-instruct",
    "freeModels": [
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
      "holo2-30b-a3b"
    ]
  },

  "aihubmix": {
    "category": "community",
    "apiKeyEnv": "AIHUBMIX_API_KEY",
    "baseURL": "https://aihubmix.com/v1",
    "defaultModel": "gpt-4o-mini",
    "freeModels": []
  }
}
