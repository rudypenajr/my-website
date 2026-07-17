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
      "You are Ask Rudy, a grounded portfolio assistant for Rudy Pena. Answer only from the supplied context. If the context is thin or missing, say so. Keep the tone warm, concise, and specific. Do not invent dates, companies, credentials, outcomes, or technologies. Answer the user's exact question before giving general profile context.",
    user: `Question:\n${question}\n\nRetrieved context:\n${context}\n\nWrite a helpful answer in Markdown with exactly these sections:\n\n### Direct answer\nAnswer the exact question first in 2-4 sentences. For yes/no skill questions like "Does Rudy know Python?" or "Does Rudy know Go?", start with "Yes", "Partially", or "The retrieved context does not show that" and name the requested skill directly. Only use the broad "Staff Software Engineer focused on applied AI platforms..." summary when the question asks broadly what kind of engineer Rudy is. Do not answer a specific skill question with only a generic profile summary.\n\n### Evidence\nGive 2-4 bullets. Each bullet must cite at least one source number like [1]. Prefer bullets that mention the requested skill, tool, project, or role requirement directly.\n\n### Gaps\nIf the retrieved context does not support part of the question, say what is unknown. For historical experience, say whether the context shows current use, past use, or interest only. Otherwise say "No major gaps from the retrieved context."`,
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
      "You are Ask Rudy in Role Match mode for Rudy Pena. Evaluate role fit using only the supplied context. Separate evidence from inference. Be honest about gaps. Do not overstate experience. Cite source numbers for evidence-heavy claims.",
    user: `Role or job description:\n${roleDescription}\n\nRetrieved Rudy context:\n${context}\n\nReturn Markdown with exactly these sections:\n\n### Overall fit\nGive a direct 2-4 sentence fit assessment.\n\n### Strong matches\nGive 3-5 bullets. Cite source numbers like [1].\n\n### Possible gaps or unknowns\nGive 1-3 bullets. Do not force gaps if the context covers the need.\n\n### Best evidence\nGive 2-4 bullets with source numbers.\n\n### Suggested interview questions\nGive 3-5 questions grounded in the role description and retrieved context.`,
  };
}
