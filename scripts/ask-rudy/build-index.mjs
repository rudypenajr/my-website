#!/usr/bin/env node
import { embeddingModel } from "./config.mjs";
import { loadKnowledgeChunks } from "./chunk-knowledge.mjs";
import { embedText } from "./ollama-provider.mjs";
import { formatIndexLocation, writeLocalIndex } from "./vector-store.mjs";

// CLI command: npm run ask-rudy:index
// This is the offline indexing step:
// 1. read markdown knowledge files
// 2. split them into chunks
// 3. ask Ollama for an embedding vector for each chunk
// 4. save the local vector index to .ask-rudy/local-index.json

async function main() {
  // Our code creates chunks before any model call happens.
  const chunks = await loadKnowledgeChunks();
  console.log(`Indexing ${chunks.length} Ask Rudy chunks with ${embeddingModel}...`);

  const embeddedChunks = [];
  for (const [index, chunk] of chunks.entries()) {
    // Ollama's embedding model turns this chunk into a numeric vector.
    const embedding = await embedText(`${chunk.title}\n\n${chunk.body}`);
    embeddedChunks.push({ ...chunk, embedding });
    console.log(`  ${index + 1}/${chunks.length} ${chunk.id}`);
  }

  // The saved index is what ask.mjs searches later.
  await writeLocalIndex(embeddedChunks);
  console.log(`Wrote ${embeddedChunks.length} chunks to ${formatIndexLocation()}`);
}

// Keep CLI failures readable instead of showing a huge stack trace for setup issues.
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
