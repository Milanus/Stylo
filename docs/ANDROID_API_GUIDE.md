# Stylo API - Android Integration Guide

## Base URL

```
https://stylo.app/api
```

## Authentication

### Headers

All API calls require:

```kotlin
"X-API-Key" to "your-api-key"  // Required for all endpoints
"Authorization" to "Bearer $accessToken"  // Optional - for authenticated users
```

### Getting Access Token (Supabase)

```kotlin
// Using Supabase Android SDK
val supabase = createSupabaseClient(
    supabaseUrl = "YOUR_SUPABASE_URL",
    supabaseKey = "YOUR_SUPABASE_ANON_KEY"
) {
    install(Auth)
}

// Login
val result = supabase.auth.signInWith(Email) {
    email = "user@example.com"
    password = "password"
}

// Get access token
val accessToken = supabase.auth.currentSessionOrNull()?.accessToken
```

---

## 1. News API

**Endpoint:** `GET /api/news`

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `locale` | string | `"en"` | Language: `en`, `sk`, `cs`, `de`, `es` |
| `type` | string | null | Filter by type: `feature`, `fix`, `improvement`, `announcement` |
| `limit` | int | 50 | Max number of items |

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "2024-02-04-humanize-response-fix",
      "type": "fix",
      "title": "Humanize Fix for Response Mode",
      "description": "Fixed an issue where...",
      "date": "2024-02-04",
      "version": "1.2.1"
    }
  ],
  "total": 1,
  "locale": "en"
}
```

### Android Implementation (Kotlin + Retrofit)

```kotlin
// Data classes
data class NewsResponse(
    val success: Boolean,
    val data: List<NewsItem>,
    val total: Int,
    val locale: String
)

data class NewsItem(
    val id: String,
    val type: String,  // "feature", "fix", "improvement", "announcement"
    val title: String,
    val description: String,
    val date: String,
    val version: String? = null,
    val link: String? = null
)

// Retrofit interface
interface StyloApi {
    @GET("news")
    suspend fun getNews(
        @Query("locale") locale: String = "en",
        @Query("type") type: String? = null,
        @Query("limit") limit: Int = 50
    ): NewsResponse
}

// Usage
val news = api.getNews(locale = "sk", limit = 10)
```

### Android Implementation (Kotlin + Ktor)

```kotlin
val response: NewsResponse = client.get("${BASE_URL}/news") {
    parameter("locale", "sk")
    parameter("limit", 10)
}.body()
```

---

## 2. Transform API

**Endpoint:** `POST /api/transform`

### Request Body

```json
{
  "text": "Text to transform (1-10000 chars)",
  "transformationType": "grammar",
  "targetLanguage": "en",
  "humanize": true,
  "provider": "openai",
  "model": "gpt-5-nano"
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Yes | Text to transform (1-10,000 chars) |
| `transformationType` | string | Yes* | One of: `grammar`, `formal`, `informal`, `legal`, `summary`, `expand`, `funny`, `teen`, `wholesome`, `response`, `keywords`, `sales-ad` |
| `customPromptId` | string (UUID) | Yes* | ID of custom user prompt (requires auth) |
| `targetLanguage` | string | No | Output language: `en`, `sk`, `cs`, `de`, `es` |
| `humanize` | boolean | No | Make output more human-like (default: true) |
| `provider` | string | No | LLM provider: `openai`, `mistral`, `gemini`, `anthropic` (default: `openai`) |
| `model` | string | No | Model ID, e.g. `gpt-5-nano`, `gemini-2.0-flash` (default: provider's default) |

*Either `transformationType` OR `customPromptId` is required (not both)

### Response

```json
{
  "success": true,
  "data": {
    "originalText": "Input text",
    "transformedText": "Transformed output",
    "transformationType": "grammar",
    "metadata": {
      "tokensUsed": 150,
      "costUsd": 0.000045,
      "processingTimeMs": 1234,
      "model": "gpt-5-nano",
      "provider": "openai"
    },
    "rateLimit": {
      "remaining": 19,
      "resetAt": 1707091200000,
      "limit": 20,
      "isAnonymous": false,
      "tier": "free"
    }
  }
}
```

### Error Responses

| Status | Error |
|--------|-------|
| 400 | Invalid input / validation error / provider not available |
| 401 | Invalid API key or auth required |
| 429 | Rate limit exceeded |
| 500 | Server error |

### Rate Limits

| Tier | Limit | Window |
|------|-------|--------|
| Anonymous | 6 | 1 hour |
| Free (registered) | 20 | 1 hour |
| Paid | 100 | 1 hour |

### Android Implementation (Kotlin + Retrofit)

```kotlin
// Data classes
data class TransformRequest(
    val text: String,
    val transformationType: String? = null,
    val customPromptId: String? = null,
    val targetLanguage: String? = null,
    val humanize: Boolean = true,
    val provider: String? = null,   // "openai", "mistral", "gemini", "anthropic"
    val model: String? = null       // e.g. "gpt-5-nano", "gemini-2.0-flash"
)

data class TransformResponse(
    val success: Boolean,
    val data: TransformData? = null,
    val error: String? = null
)

data class TransformData(
    val originalText: String,
    val transformedText: String,
    val transformationType: String,
    val metadata: TransformMetadata,
    val rateLimit: RateLimitInfo
)

data class TransformMetadata(
    val tokensUsed: Int,
    val costUsd: Double,
    val processingTimeMs: Int,
    val model: String,
    val provider: String
)

data class RateLimitInfo(
    val remaining: Int,
    val resetAt: Long,
    val limit: Int,
    val isAnonymous: Boolean,
    val tier: String
)

// Retrofit interface
interface StyloApi {
    @POST("transform")
    suspend fun transform(
        @Header("X-API-Key") apiKey: String,
        @Header("Authorization") authToken: String? = null,
        @Body request: TransformRequest
    ): TransformResponse
}

// Usage - Anonymous
val response = api.transform(
    apiKey = API_KEY,
    request = TransformRequest(
        text = "Toto je text na opravu.",
        transformationType = "grammar"
    )
)

// Usage - Authenticated
val response = api.transform(
    apiKey = API_KEY,
    authToken = "Bearer $accessToken",
    request = TransformRequest(
        text = "Hello how are you?",
        transformationType = "response",
        humanize = false  // For response type, humanize is skipped
    )
)
```

### Android Implementation (Kotlin + Ktor)

```kotlin
val client = HttpClient(Android) {
    install(ContentNegotiation) {
        json(Json { ignoreUnknownKeys = true })
    }
    defaultRequest {
        header("X-API-Key", API_KEY)
    }
}

suspend fun transform(text: String, type: String): TransformResponse {
    return client.post("${BASE_URL}/transform") {
        contentType(ContentType.Application.Json)
        setBody(TransformRequest(text = text, transformationType = type))
    }.body()
}
```

---

## 3. Rate Limit API

**Endpoint:** `GET /api/rate-limit`

Check current rate limit status without making a transformation.

### Response

```json
{
  "remaining": 15,
  "limit": 20,
  "resetAt": 1707091200000
}
```

### Android Implementation

```kotlin
interface StyloApi {
    @GET("rate-limit")
    suspend fun getRateLimit(
        @Header("X-API-Key") apiKey: String,
        @Header("Authorization") authToken: String? = null
    ): RateLimitResponse
}

data class RateLimitResponse(
    val remaining: Int,
    val limit: Int,
    val resetAt: Long
)
```

---

## 4. Transformation Types API

**Endpoint:** `GET /api/transformation-types`

Get all available transformation types.

### Response

```json
{
  "success": true,
  "data": [
    {
      "slug": "grammar",
      "name": "Grammar",
      "description": "Fix grammatical errors and spelling mistakes",
      "icon": "✓"
    }
  ]
}
```

---

## 5. Models API

**Endpoint:** `GET /api/models`

Get available LLM providers and their models. Only providers with configured API keys are returned.

### Response

```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "provider": "openai",
        "name": "OpenAI",
        "models": [
          { "id": "gpt-5-nano", "name": "gpt-5-nano", "pricing": { "input": 0.05, "output": 0.4 } },
          { "id": "gpt-5-mini", "name": "gpt-5-mini", "pricing": { "input": 0.5, "output": 5.0 } },
          { "id": "gpt-4o-mini", "name": "gpt-4o-mini", "pricing": { "input": 0.15, "output": 0.6 } },
          { "id": "gpt-4o", "name": "gpt-4o", "pricing": { "input": 2.5, "output": 10.0 } }
        ]
      }
    ],
    "defaultProvider": "openai",
    "defaultModel": "gpt-4o-mini"
  }
}
```

### Android Implementation (Kotlin + Retrofit)

```kotlin
data class ModelsResponse(
    val success: Boolean,
    val data: ModelsData
)

data class ModelsData(
    val providers: List<ProviderInfo>,
    val defaultProvider: String?,
    val defaultModel: String?
)

data class ProviderInfo(
    val provider: String,
    val name: String,
    val models: List<ModelInfo>
)

data class ModelInfo(
    val id: String,
    val name: String,
    val pricing: ModelPricing
)

data class ModelPricing(
    val input: Double,
    val output: Double
)

interface StyloApi {
    @GET("models")
    suspend fun getModels(): ModelsResponse
}
```

---

## Complete Android Service Example

```kotlin
class StyloService(
    private val apiKey: String,
    private val supabase: SupabaseClient
) {
    private val client = HttpClient(Android) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    private val baseUrl = "https://stylo.app/api"

    private suspend fun getAuthHeader(): String? {
        return supabase.auth.currentSessionOrNull()?.accessToken?.let {
            "Bearer $it"
        }
    }

    suspend fun getNews(locale: String = "sk", limit: Int = 20): List<NewsItem> {
        val response: NewsResponse = client.get("$baseUrl/news") {
            parameter("locale", locale)
            parameter("limit", limit)
        }.body()
        return response.data
    }

    suspend fun getAvailableModels(): ModelsData {
        val response: ModelsResponse = client.get("$baseUrl/models").body()
        return response.data
    }

    suspend fun transform(
        text: String,
        type: String,
        humanize: Boolean = true,
        provider: String? = null,
        model: String? = null
    ): Result<String> {
        return try {
            val response: TransformResponse = client.post("$baseUrl/transform") {
                header("X-API-Key", apiKey)
                getAuthHeader()?.let { header("Authorization", it) }
                contentType(ContentType.Application.Json)
                setBody(TransformRequest(
                    text = text,
                    transformationType = type,
                    humanize = humanize,
                    provider = provider,
                    model = model
                ))
            }.body()

            if (response.success && response.data != null) {
                Result.success(response.data.transformedText)
            } else {
                Result.failure(Exception(response.error ?: "Unknown error"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getRemainingUsage(): Int {
        val response: RateLimitResponse = client.get("$baseUrl/rate-limit") {
            header("X-API-Key", apiKey)
            getAuthHeader()?.let { header("Authorization", it) }
        }.body()
        return response.remaining
    }
}
```

---

## Dependencies (build.gradle.kts)

```kotlin
// Ktor
implementation("io.ktor:ktor-client-android:2.3.7")
implementation("io.ktor:ktor-client-content-negotiation:2.3.7")
implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.7")

// OR Retrofit
implementation("com.squareup.retrofit2:retrofit:2.9.0")
implementation("com.squareup.retrofit2:converter-gson:2.9.0")

// Supabase (optional - for auth)
implementation("io.github.jan-tennert.supabase:gotrue-kt:2.0.4")
```

---

## Notes

1. **Response Type + Humanize**: When using `transformationType: "response"`, the `humanize` parameter is automatically ignored (response generates replies, not edits text)

2. **Rate Limiting**: Always check `rateLimit.remaining` in transform response to show user their remaining usage

3. **Caching**: News API has 5-minute cache - safe to poll periodically

4. **Error Handling**: Always handle 429 (rate limit) gracefully - show user when they can try again using `resetAt` timestamp

5. **Multi-Provider**: Use `GET /api/models` to discover available providers and models. Pass `provider` and `model` in transform requests. Both are optional - omitting them uses the server default (`gpt-5-nano`).

6. **Provider Unavailable**: If a selected provider's API key is not configured on the server, the transform endpoint returns 400 with `"Selected provider is not available"`. Handle this by falling back to another model or showing a model picker.
