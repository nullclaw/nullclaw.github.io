---
title: Providers
description: AI provider setup and configuration for nullclaw
---

# Providers

nullclaw supports **9 core providers** and **88+ compatible service entries**, giving you access to **50+ distinct AI services** out of the box. Any OpenAI-compatible endpoint can be added via the `custom:` prefix.

## Core Providers

| Provider | Registration Name(s) | Notes |
|---|---|---|
| Anthropic | `anthropic`, `anthropic-custom:*` | Anthropic messages API, native tools, vision, streaming |
| OpenAI | `openai` | OpenAI chat completions, tools, vision, streaming |
| OpenRouter | `openrouter` | Default provider, aggregator, tools, vision |
| Ollama | `ollama` | Local inference, vision support |
| Gemini | `gemini`, `google`, `google-gemini` | Google Generative AI, vision |
| Compatible | (all 88+ compat entries + `custom:*`) | OpenAI-compatible API, tools, vision, streaming |
| Claude CLI | `claude-cli` | Shells out to `claude` CLI binary |
| Codex CLI | `codex-cli` | Shells out to `codex` CLI binary |
| OpenAI Codex | `openai-codex` | OpenAI Codex API (responses endpoint), streaming |

Unknown providers automatically fall back to **OpenRouter**.

---

## Quick Setup

Each provider needs an API key (set via environment variable or config file) and optionally a provider name in your config.

### OpenRouter (default)

OpenRouter is the default provider. If nullclaw cannot identify your provider, it falls back here.

```json
{
  "default_provider": "openrouter",
  "default_model": "anthropic/claude-sonnet-4"
}
```

```bash
export OPENROUTER_API_KEY="sk-or-v1-..."
```

### OpenAI

```json
{
  "default_provider": "openai",
  "default_model": "gpt-4o"
}
```

```bash
export OPENAI_API_KEY="sk-..."
```

### Anthropic

```json
{
  "default_provider": "anthropic",
  "default_model": "claude-sonnet-4-20250514"
}
```

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Or use an OAuth token:

```bash
export ANTHROPIC_OAUTH_TOKEN="..."
```

The key resolution order for Anthropic is: `ANTHROPIC_OAUTH_TOKEN` first, then `ANTHROPIC_API_KEY`.

### Gemini

```json
{
  "default_provider": "gemini",
  "default_model": "gemini-2.0-flash"
}
```

```bash
export GEMINI_API_KEY="AIza..."
```

Or use the Google alias:

```bash
export GOOGLE_API_KEY="AIza..."
```

### Ollama

No API key required. Ollama runs locally.

```json
{
  "default_provider": "ollama",
  "default_model": "llama3.3"
}
```

Default URL: `http://localhost:11434`. Override with `base_url` in your config if needed.

### Groq

```json
{
  "default_provider": "groq",
  "default_model": "llama-3.3-70b-versatile"
}
```

```bash
export GROQ_API_KEY="gsk_..."
```

### Mistral

```json
{
  "default_provider": "mistral",
  "default_model": "mistral-large-latest"
}
```

```bash
export MISTRAL_API_KEY="..."
```

### DeepSeek

```json
{
  "default_provider": "deepseek",
  "default_model": "deepseek-chat"
}
```

```bash
export DEEPSEEK_API_KEY="..."
```

Note: The legacy model names `deepseek-v3.2` and `deepseek/deepseek-v3.2` are automatically aliased to `deepseek-chat`.

### xAI (Grok)

```json
{
  "default_provider": "xai",
  "default_model": "grok-3"
}
```

```bash
export XAI_API_KEY="xai-..."
```

The alias `grok` also works as a provider name.

---

## Compatible Services

All compatible services use the OpenAI chat completions API format. They support tools, vision, and streaming.

### Cloud AI

| Name(s) | Display Name | Base URL |
|---|---|---|
| `groq` | Groq | `https://api.groq.com/openai` |
| `mistral` | Mistral | `https://api.mistral.ai/v1` |
| `deepseek` | DeepSeek | `https://api.deepseek.com` |
| `xai`, `grok` | xAI | `https://api.x.ai` |
| `cerebras` | Cerebras | `https://api.cerebras.ai/v1` |
| `perplexity` | Perplexity | `https://api.perplexity.ai` |
| `cohere` | Cohere | `https://api.cohere.com/compatibility` |

### Gateways and Aggregators

| Name(s) | Display Name | Base URL |
|---|---|---|
| `venice` | Venice | `https://api.venice.ai` |
| `vercel`, `vercel-ai` | Vercel AI Gateway | `https://ai-gateway.vercel.sh/v1` |
| `together`, `together-ai` | Together AI | `https://api.together.xyz` |
| `fireworks`, `fireworks-ai` | Fireworks AI | `https://api.fireworks.ai/inference/v1` |
| `huggingface` | Hugging Face | `https://router.huggingface.co/v1` |
| `aihubmix` | AIHubMix | `https://aihubmix.com/v1` |
| `siliconflow` | SiliconFlow | `https://api.siliconflow.cn/v1` |
| `shengsuanyun` | ShengSuanYun | `https://router.shengsuanyun.com/api/v1` |
| `chutes` | Chutes | `https://chutes.ai/api/v1` |
| `synthetic` | Synthetic | `https://api.synthetic.new/openai/v1` |
| `opencode`, `opencode-zen` | OpenCode Zen | `https://opencode.ai/zen/v1` |
| `astrai` | Astrai | `https://as-trai.com/v1` |
| `poe` | Poe | `https://api.poe.com/v1` |

### China Providers (General)

| Name(s) | Display Name | Base URL |
|---|---|---|
| `moonshot`, `kimi` | Moonshot | `https://api.moonshot.cn/v1` |
| `glm`, `zhipu` | GLM | `https://api.z.ai/api/paas/v4` |
| `zai`, `z.ai` | Z.AI | `https://api.z.ai/api/coding/paas/v4` |
| `minimax` | MiniMax | `https://api.minimax.io/v1` |
| `qwen`, `dashscope` | Qwen | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `qianfan`, `baidu` | Qianfan | `https://aip.baidubce.com` |
| `doubao`, `volcengine`, `ark` | Doubao | `https://ark.cn-beijing.volces.com/api/v3` |

### China Providers (CN Endpoints)

| Name(s) | Display Name | Base URL |
|---|---|---|
| `moonshot-cn`, `kimi-cn` | Moonshot | `https://api.moonshot.cn/v1` |
| `glm-cn`, `zhipu-cn`, `bigmodel` | GLM | `https://open.bigmodel.cn/api/paas/v4` |
| `zai-cn`, `z.ai-cn` | Z.AI | `https://open.bigmodel.cn/api/coding/paas/v4` |
| `minimax-cn`, `minimaxi` | MiniMax | `https://api.minimaxi.com/v1` |

### International Variants

| Name(s) | Display Name | Base URL |
|---|---|---|
| `moonshot-intl`, `moonshot-global`, `kimi-intl`, `kimi-global` | Moonshot | `https://api.moonshot.ai/v1` |
| `glm-global`, `zhipu-global` | GLM | `https://api.z.ai/api/paas/v4` |
| `zai-global`, `z.ai-global` | Z.AI | `https://api.z.ai/api/coding/paas/v4` |
| `minimax-intl`, `minimax-io`, `minimax-global` | MiniMax | `https://api.minimax.io/v1` |
| `qwen-intl`, `dashscope-intl` | Qwen | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| `qwen-us`, `dashscope-us` | Qwen | `https://dashscope-us.aliyuncs.com/compatible-mode/v1` |
| `byteplus` | BytePlus | `https://ark.ap-southeast.bytepluses.com/api/v3` |

### Coding-Specific Endpoints

| Name(s) | Display Name | Base URL |
|---|---|---|
| `kimi-code`, `kimi_coding` | Kimi Code | `https://api.kimi.com/coding/v1` |
| `volcengine-plan` | Doubao | `https://ark.cn-beijing.volces.com/api/coding/v3` |
| `byteplus-plan` | BytePlus | `https://ark.ap-southeast.bytepluses.com/api/coding/v3` |
| `qwen-portal` | Qwen Portal | `https://portal.qwen.ai/v1` |

### Infrastructure and Cloud

| Name(s) | Display Name | Base URL |
|---|---|---|
| `bedrock`, `aws-bedrock` | Amazon Bedrock | `https://bedrock-runtime.us-east-1.amazonaws.com` |
| `cloudflare`, `cloudflare-ai` | Cloudflare AI Gateway | `https://gateway.ai.cloudflare.com/v1` |
| `copilot`, `github-copilot` | GitHub Copilot | `https://api.githubcopilot.com` |
| `nvidia`, `nvidia-nim`, `build.nvidia.com` | NVIDIA NIM | `https://integrate.api.nvidia.com/v1` |
| `ovhcloud`, `ovh` | OVHcloud | `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1` |

### Local Servers

| Name(s) | Display Name | Base URL |
|---|---|---|
| `lmstudio`, `lm-studio` | LM Studio | `http://localhost:1234/v1` |
| `vllm` | vLLM | `http://localhost:8000/v1` |
| `llamacpp`, `llama.cpp` | llama.cpp | `http://localhost:8080/v1` |
| `sglang` | SGLang | `http://localhost:30000/v1` |
| `osaurus` | Osaurus | `http://localhost:1337/v1` |
| `litellm` | LiteLLM | `http://localhost:4000` |

---

## Custom Provider Setup

### `custom:` Prefix

Create an OpenAI-compatible provider pointing to any URL:

```json
{
  "default_provider": "custom:https://my-server.example.com/v1"
}
```

The URL is used as the base URL. nullclaw appends `/chat/completions` automatically (unless the URL already ends with `/chat/completions`).

### `anthropic-custom:` Prefix

Create an Anthropic provider with a custom base URL (for proxies, gateways, etc.):

```json
{
  "default_provider": "anthropic-custom:https://my-proxy.example.com"
}
```

---

## API Key Auto-Detection

nullclaw resolves API keys in this order:

1. **Explicit `api_key`** in `models.providers` config
2. **Provider-specific environment variable** (see table below)
3. **Generic fallbacks:** `NULLCLAW_API_KEY`, then `API_KEY`

### Environment Variable Reference

| Provider Name(s) | Environment Variable |
|---|---|
| `anthropic` | `ANTHROPIC_OAUTH_TOKEN`, `ANTHROPIC_API_KEY` |
| `openrouter` | `OPENROUTER_API_KEY` |
| `openai` | `OPENAI_API_KEY` |
| `gemini`, `google`, `google-gemini` | `GEMINI_API_KEY`, `GOOGLE_API_KEY` |
| `groq` | `GROQ_API_KEY` |
| `mistral` | `MISTRAL_API_KEY` |
| `deepseek` | `DEEPSEEK_API_KEY` |
| `xai`, `grok` | `XAI_API_KEY` |
| `cerebras` | _(generic fallback)_ |
| `perplexity` | `PERPLEXITY_API_KEY` |
| `cohere` | `COHERE_API_KEY` |
| `venice` | `VENICE_API_KEY` |
| `together`, `together-ai` | `TOGETHER_API_KEY` |
| `fireworks`, `fireworks-ai` | `FIREWORKS_API_KEY` |
| `vercel`, `vercel-ai` | `VERCEL_API_KEY` |
| `synthetic` | `SYNTHETIC_API_KEY` |
| `opencode`, `opencode-zen` | `OPENCODE_API_KEY` |
| `poe` | `POE_API_KEY` |
| `moonshot`, `kimi` | `MOONSHOT_API_KEY` |
| `glm`, `zhipu` | `ZHIPU_API_KEY` |
| `zai`, `z.ai` | `ZAI_API_KEY` |
| `minimax` | `MINIMAX_API_KEY` |
| `qwen`, `dashscope` | `DASHSCOPE_API_KEY` |
| `qianfan`, `baidu` | `QIANFAN_ACCESS_KEY` |
| `bedrock`, `aws-bedrock` | `AWS_ACCESS_KEY_ID` |
| `cloudflare`, `cloudflare-ai` | `CLOUDFLARE_API_TOKEN` |
| `copilot`, `github-copilot` | `GITHUB_TOKEN` |
| `nvidia`, `nvidia-nim`, `build.nvidia.com` | `NVIDIA_API_KEY` |
| `astrai` | `ASTRAI_API_KEY` |
| `ollama` | _(none required; falls back to `API_KEY`)_ |
| `lmstudio`, `lm-studio` | _(none required; falls back to `API_KEY`)_ |

nullclaw can also auto-detect your provider from the API key prefix:

| Key Prefix | Detected Provider |
|---|---|
| `sk-or-` | OpenRouter |
| `sk-ant-` | Anthropic |
| `sk-` | OpenAI |
| `gsk_` | Compatible (Groq) |
| `xai-` | Compatible (xAI) |
| `pplx-` | Compatible (Perplexity) |
| `AKIA` | Compatible (AWS Bedrock) |
| `AIza` | Gemini |

---

## Features Matrix

| Provider | Tools | Vision | Streaming |
|---|---|---|---|
| Anthropic | Yes | Yes | Yes |
| OpenAI | Yes | Yes | Yes |
| OpenRouter | Yes | Yes | No |
| Gemini | No | Yes | No |
| Ollama | No | Yes | No |
| Compatible | Yes | Yes | Yes |
| Claude CLI | No | No | No |
| Codex CLI | No | No | No |
| OpenAI Codex | No | No | Yes |

**Tools** -- native function calling via the provider's tool-use API.

**Vision** -- sending images (URLs or base64) as multimodal content parts alongside text.

**Streaming** -- SSE-based token streaming for real-time output.

---

## Reliability and Fallback

nullclaw wraps your provider in a multi-layer reliability system. All reliability settings go under the `reliability` key in your config.

### Fallback Providers

When the primary provider fails, nullclaw tries fallback providers in order:

```json
{
  "reliability": {
    "fallback_providers": ["anthropic", "openai"]
  }
}
```

Execution order: **primary** -> **fallback1** -> **fallback2** (each with retries).

### Model Fallbacks

When a specific model fails, try alternative models:

```json
{
  "reliability": {
    "model_fallbacks": [
      { "model": "claude-opus", "fallbacks": ["claude-sonnet", "gpt-4o"] }
    ]
  }
}
```

The model chain is tried in order: `claude-opus` -> `claude-sonnet` -> `gpt-4o`. Each model is tried across all providers (primary + fallbacks) before moving to the next model.

### API Key Rotation

Supply multiple API keys for round-robin rotation on rate-limit errors:

```json
{
  "reliability": {
    "api_keys": ["sk-key-1", "sk-key-2", "sk-key-3"]
  }
}
```

Keys are deduplicated and cycled on 429 (rate-limit) responses.

### Retry Logic

- **Default retries:** 2 per provider (3 total attempts)
- **Exponential backoff:** starts at 500ms (minimum 50ms floor), doubles each retry, capped at 10s
- **Retry-After headers:** respected and capped at 30s. If the server's Retry-After value is smaller than the current backoff, the larger value is used.

### Error Classification

nullclaw classifies errors into three tiers:

| Classification | HTTP Codes | Behavior |
|---|---|---|
| **Non-retryable** | 4xx (except 429, 408) | Skip retries, move to next provider immediately |
| **Rate-limited** | 429, quota errors | Rotate API key if available, then try next provider |
| **Context exhaustion** | Token/context limit errors | Returns `ContextLengthExceeded` -- no retries |

All other errors (5xx, timeouts, connection failures) are retried with backoff.

---

## Model Routing

Route different tasks to different providers and models using hint-based routing:

```json
{
  "model_routes": [
    { "hint": "reasoning", "provider": "anthropic", "model": "claude-opus" },
    { "hint": "fast", "provider": "groq", "model": "llama-3-70b" },
    { "hint": "code", "provider": "deepseek", "model": "deepseek-chat" },
    { "hint": "local", "provider": "ollama", "model": "mistral" }
  ]
}
```

To use a route, set the model to `"hint:<name>"`:

```json
{
  "default_model": "hint:reasoning"
}
```

This resolves to provider `anthropic` with model `claude-opus`. If the hint is not found, the request falls back to the default provider with the literal model string.

Non-hint model names (e.g. `anthropic/claude-sonnet-4`) are passed directly to the default provider without routing.

---

## Reasoning Model Support

nullclaw automatically detects reasoning models and adjusts request parameters accordingly.

### Detected Reasoning Models

Models matching these prefixes are treated as reasoning models:

- `o1*` (e.g. `o1`, `o1-preview`, `o1-mini`)
- `o3*` (e.g. `o3`, `o3-mini`)
- `o4-mini*`
- `gpt-5*` (e.g. `gpt-5`, `gpt-5.2`)
- `codex-mini*`

### Reasoning Model Behavior

For reasoning models, nullclaw automatically:

- **Omits `temperature`** from the request (unless `reasoning_effort` is set to `"none"`)
- **Replaces `max_tokens`** with `max_completion_tokens`
- **Emits `reasoning_effort`** when configured

### Configuration

Set reasoning effort at the top level of your config:

```json
{
  "reasoning_effort": "medium"
}
```

Valid values depend on the provider, but common options are `"low"`, `"medium"`, `"high"`, and `"none"`.

When `reasoning_effort` is `"none"`, temperature is included in the request as usual (the model behaves like a non-reasoning model).

---

## Provider-Specific Notes

### GLM / Zhipu

GLM does not support the responses API fallback. nullclaw automatically disables the `/v1/responses` fallback path for `glm`, `zhipu`, and their CN/global variants.

### MiniMax

MiniMax rejects the `system` role in messages. nullclaw automatically merges system messages into the first user message as `[System: ...]\n\n<user message>` for all MiniMax variants (`minimax`, `minimax-cn`, `minimax-intl`, etc.).

### DeepSeek

The legacy model names `deepseek-v3.2` and `deepseek/deepseek-v3.2` are automatically aliased to `deepseek-chat` when using the DeepSeek provider.

### CLI Providers

`claude-cli` and `codex-cli` shell out to the respective CLI binaries. If the binary is not found on `PATH`, they silently fall back to OpenRouter.
