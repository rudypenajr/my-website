import { readLocalIndex, searchLocalIndex, writeLocalIndex } from "../vector-store.mjs";

// Retrieval providers own index persistence and vector search.
// The local provider keeps using the JSON index so Phase 1 stays inspectable.
// Later, Upstash Vector can implement this same shape without changing prompts.

function createLocalJsonRetrievalProvider() {
  return {
    name: "local-json",
    async writeChunks(chunks) {
      return writeLocalIndex(chunks);
    },
    async search({ queryEmbedding, topK }) {
      const index = await readLocalIndex();
      return searchLocalIndex(index, queryEmbedding, topK);
    },
  };
}

function createUpstashVectorRetrievalProvider() {
  return {
    name: "upstash-vector",
    async writeChunks() {
      throw new Error("Upstash Vector indexing is planned for the production indexing MR.");
    },
    async search() {
      throw new Error("Upstash Vector search is planned for the production API MR.");
    },
  };
}

export function getRetrievalProvider(name = "local-json") {
  if (name === "local-json") return createLocalJsonRetrievalProvider();
  if (name === "upstash-vector") return createUpstashVectorRetrievalProvider();

  throw new Error(`Unknown Ask Rudy retrieval provider: ${name}`);
}
