# Providers

Providers are the AI model backends that power NullClaw's agent. Every provider implements the same vtable interface, making them hot-swappable via configuration. You can switch models, set up fallback chains, or add custom OpenAI-compatible endpoints without changing code.

## Supported Providers

| Provider | Config Key | Notes |
|----------|-----------|-------|
| Anthropic | `anthropic` | Claude models. Direct API access. |
| OpenAI | `openai` | GPT models, o-series reasoning models. |
| Google Gemini | `gemini` | Gemini models via Google AI Studio or Vertex. |
| Ollama | `ollama` | Local models. No API key needed, just a `base_url`. |
| OpenRouter | `openrouter` | Aggregator -- access 200+ models from one API key. |
| Groq | `groq` | Fast inference for Llama, Mixtral, Whisper. |
| Compatible | `compatible` | Any OpenAI-compatible API endpoint. |
| Claude CLI | `claude_cli` | Pipe through the local `claude` CLI binary. |
| Codex CLI | `codex_cli` | Pipe through the local `codex` CLI binary. |
| OpenAI Codex | `openai_codex` | OpenAI Codex API for code generation. |

Additional providers available through OpenRouter or the `compatible` provider: Mistral, xAI (Grok), DeepSeek, Together, Fireworks, Perplexity, Cohere, AWS Bedrock, Venice, and more.

## Configuration

### Basic Provider Setup

Add providers under `models.providers` in your config:

```json
{
  "models": {
    "providers": {
      "anthropic": {
        "api_key": "sk-ant-..."
      },
      "openai": {
        "api_key": "sk-..."
      },
      "ollama": {
        "base_url": "http://localhost:11434"
      }
    }
  }
}
```

### Anthropic

```json
{
  "models": {
    "providers": {
      "anthropic": {
        "api_key": "sk-ant-...",
        "base_url": "https://api.anthropic.com"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "anthropic/claude-sonnet-4-20250514" }
    }
  }
}
```

The `base_url` is optional and defaults to the standard Anthropic API endpoint.

### OpenAI

```json
{
  "models": {
    "providers": {
      "openai": {
        "api_key": "sk-..."
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "openai/gpt-4o" }
    }
  }
}
```

### OpenRouter

OpenRouter provides access to hundreds of models from a single API key. This is the recommended starting point if you want flexibility.

```json
{
  "models": {
    "providers": {
      "openrouter": {
        "api_key": "sk-or-..."
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "openrouter/anthropic/claude-sonnet-4" }
    }
  }
}
```

Model names on OpenRouter follow the format `openrouter/vendor/model-name`.

### Ollama (Local Models)

Run models locally with no API key:

```json
{
  "models": {
    "providers": {
      "ollama": {
        "base_url": "http://localhost:11434"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "ollama/llama3.2" }
    }
  }
}
```

Make sure Ollama is running and has the model pulled (`ollama pull llama3.2`).

### Gemini

```json
{
  "models": {
    "providers": {
      "gemini": {
        "api_key": "AIza..."
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "gemini/gemini-2.5-pro" }
    }
  }
}
```

### Groq

```json
{
  "models": {
    "providers": {
      "groq": {
        "api_key": "gsk_..."
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "groq/llama-3.3-70b-versatile" }
    }
  }
}
```

## OpenAI-Compatible Endpoints

The `compatible` provider works with any API that implements the OpenAI chat completions format. This includes vLLM, LM Studio, LocalAI, text-generation-webui, and many hosted services.

```json
{
  "models": {
    "providers": {
      "compatible": {
        "api_key": "your-key",
        "base_url": "https://your-api.example.com/v1"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "compatible/your-model-name" }
    }
  }
}
```

You can also use the shorthand `custom:` prefix in model names:

```json
{
  "agents": {
    "defaults": {
      "model": { "primary": "custom:https://your-api.com" }
    }
  }
}
```

## Model Selection

Models are specified in the format `provider/model-name`:

```
openrouter/anthropic/claude-sonnet-4
anthropic/claude-sonnet-4-20250514
openai/gpt-4o
ollama/llama3.2
gemini/gemini-2.5-pro
groq/llama-3.3-70b-versatile
compatible/my-custom-model
```

Set the default model in `agents.defaults.model.primary`. Override per-agent in the `agents.list` array.

Browse available models:

```bash
nullclaw models list
nullclaw models info openrouter/anthropic/claude-sonnet-4
```

## Fallback and Reliability

NullClaw supports automatic retries and provider fallback chains. If the primary provider fails (rate limits, downtime, errors), it retries with exponential backoff, then falls through to alternative providers.

```json
{
  "reliability": {
    "provider_retries": 2,
    "retry_backoff_ms": 1000,
    "fallback_providers": [
      "groq/llama-3.3-70b-versatile",
      "ollama/llama3.2"
    ]
  }
}
```

The retry flow:

1. Try the primary provider
2. On failure, retry up to `provider_retries` times with `retry_backoff_ms * attempt` delay
3. If all retries fail, try the first fallback provider (with its own retry cycle)
4. Continue through the fallback list until one succeeds or all fail

The `reliable` provider (internal) orchestrates this logic. The `router` provider handles model-to-provider routing, and `error_classify` categorizes failures to determine if a retry is worthwhile (e.g., don't retry on authentication errors).

## Streaming

All providers support streaming responses via Server-Sent Events (SSE). Streaming is used automatically when the channel supports it (CLI interactive mode, Web channel). The `sse` module handles stream parsing across provider formats.

## Provider Architecture

Internally, providers are managed by several supporting modules:

| Module | Purpose |
|--------|---------|
| `factory.zig` | Provider instantiation from config |
| `router.zig` | Routes model names to provider implementations |
| `reliable.zig` | Retry and fallback logic |
| `sse.zig` | Server-Sent Events stream parser |
| `error_classify.zig` | Categorizes API errors for retry decisions |
| `scrub.zig` | Scrubs sensitive data from logs |
| `api_key.zig` | API key management and validation |
| `helpers.zig` | Shared HTTP and parsing utilities |
| `runtime_bundle.zig` | Bundles provider + config for runtime dispatch |

## Further Reading

- [Configuration](/nullclaw/docs/configuration) -- full config reference
- [Architecture](/nullclaw/docs/architecture) -- how providers fit into the vtable system
- [Security](/nullclaw/docs/security) -- API key encryption
