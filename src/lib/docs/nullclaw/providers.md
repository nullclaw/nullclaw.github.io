# Providers

Provider routing is implemented in `src/providers/factory.zig` and runtime wiring in `src/providers/runtime_bundle.zig`.

## Core Provider Keys

- `anthropic`
- `openai`
- `openrouter`
- `ollama`
- `gemini`
- `google` / `google-gemini`
- `claude-cli`
- `codex-cli`
- `openai-codex`

## OpenAI-Compatible Alias Table

`factory.zig` contains a large compatibility table (89 aliases in current source) mapped to OpenAI-compatible transport.

Typical aliases include cloud endpoints (`groq`, `mistral`, `deepseek`, `xai`) and local gateways (`lmstudio`, `vllm`, `llama.cpp`, `sglang`).

## Selection Flow

1. Choose provider credentials in `models.providers`.
2. Set default route in `agents.defaults.model.primary`.
3. Run `doctor` and `models list` to validate connectivity.

## Useful Commands

```bash
nullclaw models list
nullclaw models info <model>
nullclaw models refresh
nullclaw doctor
```

## Common Issues

- Unknown provider key in config: normalize to canonical keys.
- Auth failures: check token field and endpoint base URL.
- Model route valid syntactically but unavailable on provider: refresh model catalog and re-check provider/model pair.
