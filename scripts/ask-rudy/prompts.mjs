// This file owns prompt construction.
// Retrieval has already happened before these functions run; each function turns
// the retrieved chunks plus the user's input into instructions for the chat model.

// Coffee Chat mode is the "get to know Rudy" experience. It should be warm and
// conversational, but still grounded in retrieved source chunks.
export function buildCoffeeChatPrompt({ question, results }) {
  // Give each source chunk a number so the model can refer back to evidence.
  const context = results
    .map(
      (result, index) =>
        `[${index + 1}] ${result.title} (${result.path}, score ${result.score.toFixed(3)})\n${result.body}`,
    )
    .join("\n\n---\n\n");

  return {
    system:
      "You are Ask Rudy, a grounded portfolio assistant. Answer only from the supplied context. If the context is thin or missing, say so. Keep the tone warm, concise, and specific. Do not invent dates, companies, credentials, outcomes, or technologies.",
    user: `Question:\n${question}\n\nRetrieved context:\n${context}\n\nAnswer with:\n1. A direct answer.\n2. Evidence bullets with source numbers.\n3. Any uncertainty or gaps.`,
  };
}

// Role Match mode evaluates a job or team need against Rudy's source material.
// The prompt explicitly asks for gaps so the model does not turn everything into hype.
export function buildRoleMatchPrompt({ roleDescription, results }) {
  // Same retrieved chunks, different task framing.
  const context = results
    .map(
      (result, index) =>
        `[${index + 1}] ${result.title} (${result.path}, score ${result.score.toFixed(3)})\n${result.body}`,
    )
    .join("\n\n---\n\n");

  return {
    system:
      "You are Ask Rudy in Role Match mode. Evaluate role fit using only the supplied context. Separate evidence from inference. Be honest about gaps. Do not overstate experience.",
    user: `Role or job description:\n${roleDescription}\n\nRetrieved Rudy context:\n${context}\n\nReturn these sections:\n- Overall fit\n- Strong matches\n- Possible gaps or unknowns\n- Best evidence\n- Suggested interview questions`,
  };
}
