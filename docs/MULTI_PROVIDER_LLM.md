# Multi-Provider LLM System

Stylo supports 4 LLM providers. Users can select any available model from the dashboard UI. Provider availability depends on configured API keys.

---

## Supported Providers & Models

| Provider | Model ID | Input $/1M | Output $/1M | Default |
|----------|----------|-----------|-------------|---------|
| **OpenAI** | `gpt-5-nano` | $0.05 | $0.40 | Yes |
| OpenAI | `gpt-5-mini` | $0.50 | $5.00 | |
| OpenAI | `gpt-4o-mini` | $0.15 | $0.60 | |
| OpenAI | `gpt-4o` | $2.50 | $10.00 | |
| **Mistral AI** | `mistral-small-latest` | $0.20 | $0.60 | |
| Mistral AI | `mistral-medium-latest` | $2.70 | $8.10 | |
| Mistral AI | `mistral-large-latest` | $3.00 | $9.00 | |
| **Google Gemini** | `gemini-2.0-flash` | $0.10 | $0.40 | |
| Google Gemini | `gemini-2.0-flash-lite` | $0.075 | $0.30 | |
| **Anthropic** | `claude-sonnet-4-5-20250929` | $3.00 | $15.00 | |
| Anthropic | `claude-haiku-4-5-20251001` | $0.80 | $4.00 | |

---

## Environment Variables

```bash
# At least one provider API key is required
OPENAI_API_KEY="sk-..."
MISTRAL_API_KEY="..."
GOOGLE_AI_API_KEY="..."
ANTHROPIC_API_KEY="..."

# Optional - override default provider (defaults to 'openai')
DEFAULT_LLM_PROVIDER="openai"  # openai | mistral | gemini | anthropic
```

Only providers with configured API keys will be available in the UI and API. The server uses lazy initialization - it won't crash if some keys are missing.

---

## Architecture

```
Client (Dashboard)
  |
  |  POST /api/transform { provider: "gemini", model: "gemini-2.0-flash", ... }
  v
API Route (transform/route.ts)
  |
  |  callLLM(systemPrompt, userPrompt, provider, model)
  v
Provider Hub (provider.ts)
  |
  +---> callOpenAI()    --> openai.ts    --> OpenAI SDK
  +---> callMistral()   --> mistral.ts   --> Mistral SDK
  +---> callGemini()    --> gemini.ts    --> Google Generative AI SDK
  +---> callAnthropic() --> anthropic.ts --> Anthropic SDK
  |
  v
Unified LLMResponse { content, usage, costUsd, model, provider }
```

### Key Files

| File | Purpose |
|------|---------|
| `lib/llm/provider.ts` | Central routing hub - `callLLM()`, `getAvailableProviders()` |
| `lib/llm/openai.ts` | OpenAI provider - lazy init, pricing, default: `gpt-5-nano` |
| `lib/llm/mistral.ts` | Mistral provider - lazy init, pricing |
| `lib/llm/gemini.ts` | Gemini provider - lazy init, pricing |
| `lib/llm/anthropic.ts` | Anthropic provider - lazy init, pricing |
| `lib/utils/validation.ts` | Request schema with optional `provider`/`model` fields |
| `app/api/models/route.ts` | GET endpoint returning available providers & models |
| `app/api/transform/route.ts` | Transform endpoint using `callLLM()` |
| `hooks/useAvailableModels.ts` | Client hook for fetching available models |

---

## API Endpoints

### GET /api/models

Returns available providers and their models based on configured API keys. No authentication required.

**Response:**

```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "provider": "openai",
        "name": "OpenAI",
        "models": [
          {
            "id": "gpt-4o-mini",
            "name": "gpt-4o-mini",
            "pricing": { "input": 0.15, "output": 0.6 }
          },
          {
            "id": "gpt-5-nano",
            "name": "gpt-5-nano",
            "pricing": { "input": 0.05, "output": 0.4 }
          }
        ]
      },
      {
        "provider": "gemini",
        "name": "Google Gemini",
        "models": [
          {
            "id": "gemini-2.0-flash",
            "name": "gemini-2.0-flash",
            "pricing": { "input": 0.1, "output": 0.4 }
          }
        ]
      }
    ],
    "defaultProvider": "openai",
    "defaultModel": "gpt-4o-mini"
  }
}
```

### POST /api/transform

Text transformation with optional provider/model selection.

**New fields in request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | string | No | `openai`, `mistral`, `gemini`, `anthropic` |
| `model` | string | No | Model ID (e.g. `gpt-5-nano`, `gemini-2.0-flash`) |

Both fields are optional. When omitted, defaults to `DEFAULT_LLM_PROVIDER` env var (or `openai`) and that provider's default model.

**Example request:**

```json
{
  "text": "Text to transform",
  "transformationType": "grammar",
  "provider": "gemini",
  "model": "gemini-2.0-flash",
  "targetLanguage": "sk",
  "humanize": true
}
```

**Response metadata now includes `provider`:**

```json
{
  "metadata": {
    "tokensUsed": 150,
    "costUsd": 0.000045,
    "processingTimeMs": 800,
    "model": "gemini-2.0-flash",
    "provider": "gemini"
  }
}
```

**Error when provider unavailable (400):**

```json
{
  "error": "Selected provider is not available. Please choose a different model."
}
```

---

## Adding a New Provider

1. Create `lib/llm/{provider}.ts` following the pattern of `mistral.ts`:
   - Lazy client initialization (`get{Provider}Client()`)
   - `DEFAULT_{PROVIDER}_MODEL` constant
   - `{PROVIDER}_MODEL_PRICING` const object
   - `{Provider}ModelName` type
   - `create{Provider}Completion()` function
   - `calculate{Provider}Cost()` function

2. Update `lib/llm/provider.ts`:
   - Add to `LLMProvider` union type
   - Import new module
   - Add `AllModelNames` union
   - Add `case` in `getDefaultModel()`
   - Add `is{Provider}Available()` function
   - Add `case` in `callLLM()` switch
   - Add private `call{Provider}()` function
   - Add to `getAllPricing()` and `getAvailableProviders()`

3. Update `lib/utils/validation.ts`:
   - Add provider name to `z.enum([...])` in `transformTextSchema`

4. Add env var to `.env.example`

5. Add i18n keys if needed

---

## Backward Compatibility

- Requests without `provider`/`model` fields work as before (defaults to OpenAI `gpt-5-nano`)
- The `modelUsed` field in the database `Transformation` table stores the actual model ID used
- Cost tracking works for all providers
- Rate limiting is provider-agnostic (applies the same limits regardless of model)

---

## NPM Dependencies

| Package | Provider |
|---------|----------|
| `openai` | OpenAI |
| `@mistralai/mistralai` | Mistral AI |
| `@google/generative-ai` | Google Gemini |
| `@anthropic-ai/sdk` | Anthropic |
