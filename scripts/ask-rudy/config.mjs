import path from "node:path";

// Shared settings for the local Ask Rudy lab.
// This file keeps paths, model names, and tunable retrieval settings in one place
// so the rest of the scripts can focus on their individual RAG pipeline steps.

// Resolve everything from the repo root because these scripts are run through npm.
export const rootDir = process.cwd();

// Source markdown lives in git. Generated embeddings live outside git.
export const knowledgeDir = path.join(rootDir, "knowledge");
export const artifactDir = path.join(rootDir, ".ask-rudy");
export const localIndexPath = path.join(artifactDir, "local-index.json");

// Ollama runs a local HTTP server. The chat model writes answers; the embedding
// model turns text into vectors for semantic search.
export const modelProviderName = process.env.ASK_RUDY_MODEL_PROVIDER ?? "ollama";
export const retrievalProviderName = process.env.ASK_RUDY_RETRIEVAL_PROVIDER ?? "local-json";
export const ollamaHost = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
export const chatModel = process.env.ASK_RUDY_CHAT_MODEL ?? "llama3.2";
export const embeddingModel = process.env.ASK_RUDY_EMBED_MODEL ?? "nomic-embed-text";
export const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
export const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
export const cloudflareEmbeddingModel =
  process.env.ASK_RUDY_CLOUDFLARE_EMBED_MODEL ?? "@cf/baai/bge-base-en-v1.5";
export const upstashVectorRestUrl = process.env.UPSTASH_VECTOR_REST_URL;
export const upstashVectorRestToken = process.env.UPSTASH_VECTOR_REST_TOKEN;
export const upstashVectorNamespace = process.env.ASK_RUDY_UPSTASH_NAMESPACE ?? "";

// Chunking is our responsibility, not Ollama's. These values control how much
// markdown text goes into each searchable unit.
export const chunkConfig = {
  maxCharacters: Number(process.env.ASK_RUDY_CHUNK_CHARS ?? 1200),
  overlapCharacters: Number(process.env.ASK_RUDY_CHUNK_OVERLAP ?? 160),
};

// Retrieval is also our responsibility. topK is how many chunks we pass to the
// chat model as context for a question.
export const searchConfig = {
  topK: Number(process.env.ASK_RUDY_TOP_K ?? 5),
};
