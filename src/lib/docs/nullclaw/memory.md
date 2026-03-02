# Memory System

NullClaw's memory system gives the agent persistent, searchable long-term storage. The default configuration uses SQLite with hybrid search (FTS5 keyword matching + vector cosine similarity) and requires zero external dependencies. For production deployments, you can swap to PostgreSQL, Redis, LanceDB, or other backends without changing agent behavior.

## Overview

Memory is accessed through four tools: `memory_store`, `memory_recall`, `memory_list`, and `memory_forget`. When the agent stores a memory, it is persisted to the configured backend with optional embeddings. When it recalls, the system runs a hybrid search combining keyword relevance (BM25 via FTS5) and semantic similarity (cosine distance on embeddings), then fuses results using configurable strategies.

The memory subsystem is organized into four layers:

- **Engines**: Storage backends (SQLite, Markdown, Redis, PostgreSQL, etc.)
- **Retrieval**: Search and ranking strategies (RRF, MMR, query expansion, etc.)
- **Vector**: Embedding generation and vector storage
- **Lifecycle**: Maintenance operations (cache, hygiene, snapshots, migration)

## Backends

| Backend | Config Value | External Deps | Best For |
|---------|-------------|---------------|----------|
| SQLite | `sqlite` | None (vendored) | Default. Hybrid FTS5 + vector search in a single file. |
| Markdown | `markdown` | None | Human-readable flat files. Good for version control. |
| In-Memory LRU | `memory_lru` | None | Ephemeral sessions. Fast, no persistence. |
| Lucid | `lucid` | None | Lightweight structured memory. |
| None | `none` | None | Disable memory entirely. |
| PostgreSQL | `postgres` | PostgreSQL server | Production deployments with pgvector. |
| Redis | `redis` | Redis server | Fast read-heavy workloads. |
| LanceDB | `lancedb` | LanceDB library | Large-scale vector search. |
| API | `api` | External API | Delegate to a remote memory service. |

### SQLite (Default)

The SQLite backend stores everything in a single database file at `~/.nullclaw/memory.db`. It uses FTS5 virtual tables for keyword search with BM25 scoring and stores embeddings as BLOBs for cosine similarity search. No external process or server needed.

```json
{
  "memory": {
    "backend": "sqlite",
    "embedding_provider": "openai"
  }
}
```

### Markdown

Stores memories as individual markdown files in `~/.nullclaw/memory/`. Each memory is a file with YAML frontmatter (timestamps, tags) and markdown content. This backend is ideal for development and when you want memories to be version-controlled or human-editable.

```json
{
  "memory": {
    "backend": "markdown",
    "embedding_provider": "none"
  }
}
```

The `markdown_only` profile is a convenient preset:

```json
{
  "memory": {
    "profile": "markdown_only"
  }
}
```

### PostgreSQL

For production deployments. Supports pgvector for efficient vector similarity search at scale.

```json
{
  "memory": {
    "backend": "postgres",
    "connection_string": "postgresql://user:pass@localhost:5432/nullclaw",
    "embedding_provider": "openai"
  }
}
```

### Redis

Fast read-heavy workloads with optional persistence.

```json
{
  "memory": {
    "backend": "redis",
    "connection_string": "redis://localhost:6379",
    "embedding_provider": "openai"
  }
}
```

## Hybrid Search

When both keyword and vector search are available, NullClaw fuses results using configurable weights:

```json
{
  "memory": {
    "vector_weight": 0.7,
    "keyword_weight": 0.3
  }
}
```

- **Keyword search** (FTS5): Exact and fuzzy term matching using BM25 scoring. Good for finding specific facts, names, and technical terms.
- **Vector search** (cosine similarity): Semantic matching using embeddings. Good for finding conceptually related information even when the exact words differ.

The default 70/30 vector/keyword split favors semantic relevance while keeping keyword precision. Adjust based on your use case: increase `keyword_weight` for technical documentation lookups, increase `vector_weight` for conversational recall.

### How It Works

1. A query arrives (from `memory_recall` or internal agent context)
2. The query is expanded (optional, via query expansion strategy)
3. FTS5 runs a keyword search with BM25 scoring
4. The query is embedded and compared against stored vectors via cosine similarity
5. Results from both sources are fused using the configured retrieval strategy
6. Top-k results are returned, optionally reranked

## Embedding Providers

Embeddings convert text into dense vectors for semantic search. Configure the provider in `memory.embedding_provider`:

| Provider | Config Value | Notes |
|----------|-------------|-------|
| OpenAI | `openai` | `text-embedding-3-small` by default. Requires API key. |
| Google Gemini | `gemini` | Gemini embedding models. Requires API key. |
| Voyage AI | `voyage` | High-quality embeddings. Requires API key. |
| Ollama | `ollama` | Local embeddings via Ollama. No API key needed. |
| None | `none` | Disable embeddings. Keyword search only. |

```json
{
  "memory": {
    "embedding_provider": "openai"
  }
}
```

When `embedding_provider` is `"none"`, the memory system falls back to pure FTS5 keyword search. This works well and requires no external API calls, but loses semantic matching capability.

## Retrieval Strategies

NullClaw supports multiple strategies for ranking and fusing search results:

| Strategy | Description |
|----------|-------------|
| **RRF** (Reciprocal Rank Fusion) | Default. Merges ranked lists from keyword and vector search using reciprocal rank weighting. Robust general-purpose fusion. |
| **MMR** (Maximal Marginal Relevance) | Balances relevance with diversity. Reduces redundancy in results by penalizing items similar to already-selected results. |
| **Query Expansion** | Expands the search query with related terms before searching. Improves recall for short or ambiguous queries. |
| **Temporal Decay** | Applies a time-based decay to scores, favoring recent memories over old ones. Configurable decay rate. |
| **Adaptive** | Dynamically selects the best strategy based on query characteristics (length, specificity, context). |
| **LLM Reranking** | Uses the language model itself to rerank candidate results for maximum relevance. Most accurate but costs an extra API call. |

These strategies are applied in the retrieval pipeline and can be combined. The default configuration uses RRF fusion, which works well for most use cases.

## Memory Lifecycle

The lifecycle subsystem handles long-term memory maintenance:

### Archival

Memories older than the archival threshold are moved to cold storage. They remain searchable but are deprioritized in results.

```json
{
  "memory": {
    "lifecycle": {
      "archival_threshold_days": 90
    }
  }
}
```

### Purge

Memories older than the purge threshold are permanently deleted.

```json
{
  "memory": {
    "lifecycle": {
      "purge_after_days": 365
    }
  }
}
```

### Cache

The semantic cache stores recent query results to avoid redundant searches and embedding calls.

```json
{
  "memory": {
    "cache": {
      "max_size": 500
    }
  }
}
```

### Snapshots

Export and import the full memory state for backup or migration:

```bash
nullclaw memory export --output snapshot.json
nullclaw memory import --input snapshot.json
```

### Hygiene

Automatic deduplication and cleanup of stale or redundant memories. Runs periodically when enabled.

### Summarizer

Compresses long or repetitive memory entries into concise summaries, preserving key information while reducing storage and search noise.

### Diagnostics

```bash
nullclaw memory
```

Shows memory backend status, entry count, storage size, and index health.

## Configuration Examples

### Minimal (No External Dependencies)

```json
{
  "memory": {
    "backend": "markdown",
    "embedding_provider": "none"
  }
}
```

### Full-Featured SQLite

```json
{
  "memory": {
    "backend": "sqlite",
    "search": { "enabled": true, "provider": "auto" },
    "embedding_provider": "openai",
    "chunking": { "max_tokens": 512 },
    "query": { "max_results": 5 },
    "vector_weight": 0.7,
    "keyword_weight": 0.3,
    "cache": { "max_size": 500 },
    "lifecycle": {
      "archival_threshold_days": 90,
      "purge_after_days": 365
    }
  }
}
```

### Local Embeddings with Ollama

```json
{
  "memory": {
    "backend": "sqlite",
    "embedding_provider": "ollama",
    "vector_weight": 0.6,
    "keyword_weight": 0.4
  }
}
```

### Production PostgreSQL

```json
{
  "memory": {
    "backend": "postgres",
    "connection_string": "postgresql://user:pass@localhost:5432/nullclaw",
    "embedding_provider": "openai",
    "vector_weight": 0.7,
    "keyword_weight": 0.3,
    "cache": { "max_size": 1000 },
    "lifecycle": {
      "archival_threshold_days": 180,
      "purge_after_days": 730
    }
  }
}
```

## Vector Storage

For backends that support it, vector storage can use specialized engines:

| Store | Description |
|-------|-------------|
| Built-in (SQLite) | Embeddings stored as BLOBs in SQLite. Zero dependencies. |
| Qdrant | External vector database for large-scale deployments. |
| pgvector | PostgreSQL extension for vector operations. |

The built-in SQLite vector store handles thousands of memories efficiently. For datasets exceeding tens of thousands of entries, consider Qdrant or pgvector.

## Migration

Import memories from OpenClaw:

```bash
nullclaw migrate openclaw --dry-run    # Preview changes
nullclaw migrate openclaw              # Run migration
```

This imports memory entries, converts formats, and generates embeddings for the new backend.

## Further Reading

- [Tools](/nullclaw/docs/tools) -- memory tools (store, recall, list, forget)
- [Configuration](/nullclaw/docs/configuration) -- full config reference
- [CLI Reference](/nullclaw/docs/cli) -- memory and migration commands
