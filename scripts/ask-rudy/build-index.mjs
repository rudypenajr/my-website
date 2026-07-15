#!/usr/bin/env node
import { embeddingModel, modelProviderName, retrievalProviderName } from "./config.mjs";
import { loadKnowledgeChunks } from "./chunk-knowledge.mjs";
import { formatIndexLocation } from "./vector-store.mjs";
import { getModelProvider } from "./providers/model-provider.mjs";
import { getRetrievalProvider } from "./providers/retrieval-provider.mjs";

// CLI command: npm run ask-rudy:index
// This is the offline indexing step:
// 1. read markdown knowledge files
// 2. split them into chunks
// 3. ask the selected model provider for an embedding vector for each chunk
// 4. save the vector index through the selected retrieval provider

async function main() {
  const modelProvider = getModelProvider(modelProviderName);
  const retrievalProvider = getRetrievalProvider(retrievalProviderName);

  // Our code creates chunks before any model call happens.
  const chunks = await loadKnowledgeChunks();
  console.log(
    `Indexing ${chunks.length} Ask Rudy chunks with ${modelProvider.name}/${embeddingModel} into ${retrievalProvider.name}...`,
  );

  const embeddedChunks = [];
  for (const [index, chunk] of chunks.entries()) {
    // The selected model provider turns this chunk into a numeric vector.
    const embedding = await modelProvider.embedText(`${chunk.title}\n\n${chunk.body}`);
    embeddedChunks.push({ ...chunk, embedding });
    console.log(`  ${index + 1}/${chunks.length} ${chunk.id}`);
  }

  // The saved index is what ask.mjs searches later.
  await retrievalProvider.writeChunks(embeddedChunks);
  const location = retrievalProvider.name === "local-json" ? formatIndexLocation() : retrievalProvider.name;
  console.log(`Wrote ${embeddedChunks.length} chunks to ${location}`);
}

// Keep CLI failures readable instead of showing a huge stack trace for setup issues.
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
