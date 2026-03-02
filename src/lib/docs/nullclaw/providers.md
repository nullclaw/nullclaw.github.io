# Providers

Provider routing is implemented in `src/providers/factory.zig` and `src/providers/runtime_bundle.zig`.

## Core Provider Keys

Core provider keys classified directly in factory logic:

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

`factory.zig` also defines a large compatibility table (89 aliases in current source), mapped to OpenAI-compatible transport with provider-specific flags.

Examples from the table:

- `groq`, `mistral`, `deepseek`, `xai`, `perplexity`, `cohere`
- `venice`, `together`, `fireworks`, `huggingface`, `litellm`
- `qwen`, `moonshot`, `glm`, `z.ai`, `minimax`, regional variants
- local endpoints like `lmstudio`, `vllm`, `llama.cpp`, `sglang`

## Custom Endpoint Pattern

For an arbitrary compatible endpoint, use `custom:` style naming or explicit `base_url` in provider config.

## Provider Selection

Default model/provider path is resolved from:

- `agents.defaults.model.primary`
- provider map in `models.providers`

At runtime, reliable fallback wrappers can be applied through reliability configuration.

## Useful Commands

```bash
nullclaw models list
nullclaw models info <model>
nullclaw models refresh
```

## Troubleshooting

- Unknown provider in `onboard`: check canonical provider key spelling.
- Provider configured but auth failing: run `nullclaw doctor`.
- Model not available on endpoint: verify provider/model pair and endpoint-specific model catalog.
