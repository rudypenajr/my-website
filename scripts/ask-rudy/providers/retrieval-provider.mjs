import { readLocalIndex, searchLocalIndex, writeLocalIndex } from "../vector-store.mjs";
import { upstashVectorNamespace, upstashVectorRestToken, upstashVectorRestUrl } from "../config.mjs";

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
  function requireUpstashConfig() {
    if (!upstashVectorRestUrl || !upstashVectorRestToken) {
      throw new Error("Upstash Vector indexing needs UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN.");
    }
  }

  function endpoint(path) {
    const baseUrl = upstashVectorRestUrl.replace(/\/$/, "");
    const namespace = upstashVectorNamespace ? `/${encodeURIComponent(upstashVectorNamespace)}` : "";
    return `${baseUrl}${path}${namespace}`;
  }

  async function postJson(path, body) {
    requireUpstashConfig();

    const response = await fetch(endpoint(path), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstashVectorRestToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(`Upstash Vector ${path} failed (${response.status}): ${JSON.stringify(data ?? {})}`);
    }

    return data;
  }

  function chunkToVector(chunk) {
    return {
      id: chunk.id,
      vector: chunk.embedding,
      metadata: {
        title: chunk.title,
        path: chunk.path,
        tags: chunk.tags ?? [],
      },
      data: chunk.body,
    };
  }

  return {
    name: "upstash-vector",
    async writeChunks(chunks) {
      const vectors = chunks.map(chunkToVector);
      await postJson("/upsert", vectors);
    },
    async search({ queryEmbedding, topK }) {
      const data = await postJson("/query", {
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        includeData: true,
      });

      const results = data?.result;
      if (!Array.isArray(results)) {
        throw new Error("Upstash Vector returned a query response without a result array.");
      }

      return results.map((result) => ({
        id: result.id,
        title: result.metadata?.title ?? result.id,
        path: result.metadata?.path ?? "upstash-vector",
        tags: result.metadata?.tags ?? [],
        body: result.data ?? "",
        score: result.score,
      }));
    },
  };
}

export function getRetrievalProvider(name = "local-json") {
  if (name === "local-json") return createLocalJsonRetrievalProvider();
  if (name === "upstash-vector") return createUpstashVectorRetrievalProvider();

  throw new Error(`Unknown Ask Rudy retrieval provider: ${name}`);
}
