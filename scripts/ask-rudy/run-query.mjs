import { modelProviderName, retrievalProviderName, searchConfig } from "./config.mjs";
import { buildCoffeeChatPrompt, buildRoleMatchPrompt } from "./prompts.mjs";
import { getModelProvider } from "./providers/model-provider.mjs";
import { getRetrievalProvider } from "./providers/retrieval-provider.mjs";

// Shared query pipeline used by both the one-off CLI and the eval runner.
// Keeping this in one place means evals measure the same behavior users run locally.

export async function runAskRudyQuery({
  input,
  mode = "ask",
  modelProviderName: selectedModelProviderName = modelProviderName,
  retrievalProviderName: selectedRetrievalProviderName = retrievalProviderName,
} = {}) {
  const modelProvider = getModelProvider(selectedModelProviderName);
  const retrievalProvider = getRetrievalProvider(selectedRetrievalProviderName);

  // The selected model provider embeds the input; retrieval provider owns search.
  const queryEmbedding = await modelProvider.embedText(input);
  const results = await retrievalProvider.search({
    queryEmbedding,
    topK: searchConfig.topK,
  });

  // Same retrieved chunks, different prompt framing for Coffee Chat vs Role Match.
  const prompt =
    mode === "fit"
      ? buildRoleMatchPrompt({ roleDescription: input, results })
      : buildCoffeeChatPrompt({ question: input, results });

  // The selected model provider generates the final answer from our grounded prompt.
  const answer = await modelProvider.generateAnswer(prompt);

  return {
    answer,
    results,
    mode,
    input,
    providers: {
      model: modelProvider.name,
      retrieval: retrievalProvider.name,
    },
  };
}
