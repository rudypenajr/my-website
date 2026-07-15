import { chatModel, embeddingModel, ollamaHost } from "./config.mjs";

// This file is the only local-model adapter for Phase 1.
// Our scripts handle chunking, storage, and retrieval. Ollama only handles:
// 1. embedding text into vectors
// 2. generating the final natural-language answer

// Build a full Ollama URL while allowing OLLAMA_HOST to include or omit a trailing slash.
function ollamaUrl(path) {
  return `${ollamaHost.replace(/\/$/, "")}${path}`;
}

// Shared JSON POST helper for Ollama's local API. The friendly connection error
// is here because most setup issues are "Ollama is not running" or "model not pulled."
async function postJson(path, body) {
  let response;

  try {
    response = await fetch(ollamaUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      `Could not reach Ollama at ${ollamaHost}. Start Ollama, then run: ollama pull ${chatModel} && ollama pull ${embeddingModel}`,
      { cause: error },
    );
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama ${path} failed (${response.status}): ${text}`);
  }

  return response.json();
}

// Convert one string into a numeric vector. We use this both when indexing chunks
// and when embedding a user's question before vector search.
export async function embedText(input) {
  // Newer Ollama versions support /api/embed with an input array/string shape.
  try {
    const data = await postJson("/api/embed", {
      model: embeddingModel,
      input,
    });

    if (Array.isArray(data.embeddings?.[0])) return data.embeddings[0];
  } catch (error) {
    if (!String(error.message).includes("404")) throw error;
  }

  // Older Ollama versions use /api/embeddings. Keeping this fallback makes the
  // local lab a little less sensitive to installed Ollama version.
  const data = await postJson("/api/embeddings", {
    model: embeddingModel,
    prompt: input,
  });

  if (!Array.isArray(data.embedding)) {
    throw new Error("Ollama returned an embedding response without an embedding array.");
  }

  return data.embedding;
}

// Ask the local chat model to write the answer from our generated prompt.
// The prompt already contains retrieved source chunks; the model is not doing
// retrieval by itself.
export async function generateAnswer({ system, user }) {
  const data = await postJson("/api/chat", {
    model: chatModel,
    stream: false,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    options: {
      temperature: 0.2,
      num_predict: 700,
    },
  });

  const content = data.message?.content;
  if (!content) throw new Error("Ollama returned a chat response without message content.");
  return content;
}
