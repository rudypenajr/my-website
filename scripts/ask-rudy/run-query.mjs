import { searchConfig } from "./config.mjs";
import { embedText, generateAnswer } from "./ollama-provider.mjs";
import { buildCoffeeChatPrompt, buildRoleMatchPrompt } from "./prompts.mjs";
import { readLocalIndex, searchLocalIndex } from "./vector-store.mjs";

// Shared query pipeline used by both the one-off CLI and the eval runner.
// Keeping this in one place means evals measure the same behavior users run locally.

export async function runAskRudyQuery({ input, mode = "ask" }) {
  // Load the generated index from npm run ask-rudy:index.
  const index = await readLocalIndex();

  // Ollama embeds the input; our code uses that vector to search source chunks.
  const queryEmbedding = await embedText(input);
  const results = searchLocalIndex(index, queryEmbedding, searchConfig.topK);

  // Same retrieved chunks, different prompt framing for Coffee Chat vs Role Match.
  const prompt =
    mode === "fit"
      ? buildRoleMatchPrompt({ roleDescription: input, results })
      : buildCoffeeChatPrompt({ question: input, results });

  // Ollama generates the final answer from our prompt and retrieved chunks.
  const answer = await generateAnswer(prompt);

  return {
    answer,
    results,
    mode,
    input,
  };
}
