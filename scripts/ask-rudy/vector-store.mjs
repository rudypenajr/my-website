import fs from "node:fs/promises";
import path from "node:path";

import { artifactDir, embeddingModel, localIndexPath } from "./config.mjs";

// This file owns the local vector store for Phase 1.
// It is intentionally simple JSON so the retrieval math is visible while learning.
// Later phases can swap this for Upstash Vector behind the same conceptual shape.

// Save embedded chunks to .ask-rudy/local-index.json.
// The embedding arrays are large generated artifacts, so .ask-rudy/ is gitignored.
export async function writeLocalIndex(chunks) {
  await fs.mkdir(artifactDir, { recursive: true });
  await fs.writeFile(
    localIndexPath,
    JSON.stringify(
      {
        version: 1,
        embeddingModel,
        generatedAt: new Date().toISOString(),
        chunks,
      },
      null,
      2,
    ),
  );
}

// Load the generated local index before answering questions.
// If it is missing, the user needs to run the indexing command first.
export async function readLocalIndex() {
  try {
    const raw = await fs.readFile(localIndexPath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Local Ask Rudy index is missing. Run: npm run ask-rudy:index`);
    }

    throw error;
  }
}

// Cosine similarity measures how close two vectors point in embedding space.
// Higher score means the question embedding is more semantically similar to the
// chunk embedding.
function cosineSimilarity(a, b) {
  let dot = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;

  for (let index = 0; index < Math.min(a.length, b.length); index += 1) {
    dot += a[index] * b[index];
    aMagnitude += a[index] * a[index];
    bMagnitude += b[index] * b[index];
  }

  if (!aMagnitude || !bMagnitude) return 0;
  return dot / (Math.sqrt(aMagnitude) * Math.sqrt(bMagnitude));
}

// Rank all chunks by similarity to the question and keep the best matches.
// This is the local version of what Upstash Vector will do in production.
export function searchLocalIndex(index, queryEmbedding, topK) {
  return index.chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, topK);
}

// Print a repo-relative path in CLI output so command results are easier to read.
export function formatIndexLocation() {
  return path.relative(process.cwd(), localIndexPath);
}
