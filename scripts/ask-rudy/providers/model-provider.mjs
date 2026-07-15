import { embedText as embedWithOllama, generateAnswer as generateWithOllama } from "../ollama-provider.mjs";

// Model providers own the model calls only:
// - embeddings turn text into vectors
// - generation turns a prompt into a natural-language answer
//
// Retrieval, chunking, rate limits, and persistence stay outside this boundary.

function createOllamaModelProvider() {
  return {
    name: "ollama",
    embedText: embedWithOllama,
    generateAnswer: generateWithOllama,
  };
}

function createCloudflareModelProvider() {
  return {
    name: "cloudflare",
    async embedText() {
      throw new Error("Cloudflare Workers AI embeddings are planned for the production provider MR.");
    },
    async generateAnswer() {
      throw new Error("Cloudflare Workers AI generation is planned for the production provider MR.");
    },
  };
}

export function getModelProvider(name = "ollama") {
  if (name === "ollama") return createOllamaModelProvider();
  if (name === "cloudflare") return createCloudflareModelProvider();

  throw new Error(`Unknown Ask Rudy model provider: ${name}`);
}
