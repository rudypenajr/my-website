import { embedText as embedWithOllama, generateAnswer as generateWithOllama } from "../ollama-provider.mjs";
import {
  cloudflareAccountId,
  cloudflareApiToken,
  cloudflareChatModel,
  cloudflareEmbeddingModel,
  cloudflareMaxOutputTokens,
  embeddingModel,
} from "../config.mjs";

// Model providers own the model calls only:
// - embeddings turn text into vectors
// - generation turns a prompt into a natural-language answer
//
// Retrieval, chunking, rate limits, and persistence stay outside this boundary.

function createOllamaModelProvider() {
  return {
    name: "ollama",
    embeddingModel,
    embedText: embedWithOllama,
    generateAnswer: generateWithOllama,
  };
}

function createCloudflareModelProvider() {
  function requireCloudflareConfig() {
    if (!cloudflareAccountId || !cloudflareApiToken) {
      throw new Error("Cloudflare indexing needs CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN.");
    }
  }

  async function runCloudflareAi(model, body) {
    requireCloudflareConfig();

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/${model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cloudflareApiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json().catch(() => null);
    if (!response.ok || data?.success === false) {
      throw new Error(
        `Cloudflare Workers AI ${model} failed (${response.status}): ${JSON.stringify(data ?? {})}`,
      );
    }

    return data;
  }

  return {
    name: "cloudflare",
    chatModel: cloudflareChatModel,
    embeddingModel: cloudflareEmbeddingModel,
    async embedText(input) {
      const data = await runCloudflareAi(cloudflareEmbeddingModel, { text: [input] });
      const embedding = data?.result?.data?.[0];

      if (!Array.isArray(embedding)) {
        throw new Error("Cloudflare Workers AI returned an embedding response without result.data[0].");
      }

      return embedding;
    },
    async generateAnswer({ system, user }) {
      const data = await runCloudflareAi(cloudflareChatModel, {
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
        max_tokens: cloudflareMaxOutputTokens,
      });
      const content = data?.result?.response ?? data?.result?.text;

      if (!content) {
        throw new Error("Cloudflare Workers AI returned a generation response without text content.");
      }

      return content;
    },
  };
}

export function getModelProvider(name = "ollama") {
  if (name === "ollama") return createOllamaModelProvider();
  if (name === "cloudflare") return createCloudflareModelProvider();

  throw new Error(`Unknown Ask Rudy model provider: ${name}`);
}
