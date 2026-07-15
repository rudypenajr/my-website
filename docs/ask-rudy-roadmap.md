# Ask Rudy Roadmap

Ask Rudy is the portfolio's retrieval-backed AI feature: a playful terminal interface for exploring Rudy's resume, work, projects, and role fit. The goal is to learn practical LLM systems end to end without creating surprise production cost.

## Product Direction

Ask Rudy should feel native to the redesigned site. The terminal remains the command surface, and cards become the readable output layer.

For the local Phase 1 architecture walkthrough, see `docs/ask-rudy-local-rag-explainer.md`.

Primary modes:
- `ask`: conversational "get to know me" answers grounded in Rudy's resume and project knowledge.
- `fit`: role-match analysis for pasted job descriptions.
- `sources`: show the resume/project chunks used for the latest answer.
- `debug retrieval`: show the top retrieved chunks, similarity scores, model names, latency, and guardrail decisions.
- `lab`: expose the learning view for embeddings, retrieval, prompts, and model behavior.

Visitor-facing outputs should use cards for:
- Answer summary.
- Evidence from source chunks.
- Strong matches.
- Possible gaps or unknowns.
- Relevant projects.
- Suggested interview questions.
- Source and confidence details.

## Stack Decision

### Local Lab

Use local models first so the core learning loop is free and inspectable.

- Ollama for local chat inference.
- Ollama embedding model for local embeddings.
- Local ingestion scripts for chunking and embedding knowledge files.
- Local vector search at first, then optional Upstash dev index once the pipeline works.

Local mode is the interview/demo-friendly version: it can run on Rudy's machine without paid model calls.

### Production

Production should be cheap, capped, and intentionally limited.

- Vercel hosts the Next.js site and API routes.
- Upstash Vector stores resume/project embeddings.
- Cloudflare Workers AI handles capped public model calls.
- Upstash Redis handles rate limits, global usage caps, and kill switches.

No production path should silently fall back to an uncapped paid provider.

## Cost Guardrails

Redis should be the authority for whether a request is allowed to call a hosted model.

Suggested keys:

```txt
ask-rudy:enabled = true | false
ask-rudy:global:daily_calls:YYYY-MM-DD = 0..N
ask-rudy:global:monthly_calls:YYYY-MM = 0..N
ask-rudy:ip:{hash}:daily_calls:YYYY-MM-DD = 0..N
ask-rudy:provider:cloudflare:enabled = true | false
```

Suggested initial caps:

```txt
Global daily model calls: 50
Global monthly model calls: 1000
Per visitor daily calls: 3
Max free-form question length: 800 chars
Max role description length: 4000 chars
Max output tokens: 500-700
```

Before every hosted model call:
1. Check the global kill switch.
2. Check provider-specific enablement.
3. Check global daily cap.
4. Check global monthly cap.
5. Check per-visitor daily cap.
6. Check input length.
7. Increment reserved usage.
8. Call the model.
9. Record success, failure, latency, and model metadata.

If any guardrail blocks the call, return a friendly terminal response and do not retry with another provider.

Example fallback copy:

```txt
ask-rudy is in local-lab mode right now. Try the sample prompts, or reach out to Rudy directly.
```

## Architecture

Keep model and vector providers behind adapters so local and production paths can diverge without rewriting the feature.

MR 1 introduces the boundary without production traffic:

```txt
Model provider:
  ollama      active local implementation
  cloudflare  placeholder for hosted inference MR

Retrieval provider:
  local-json       active local implementation
  upstash-vector   placeholder for hosted retrieval MR
```

Defaults:

```bash
ASK_RUDY_MODEL_PROVIDER=ollama
ASK_RUDY_RETRIEVAL_PROVIDER=local-json
```

```ts
type RuntimeMode = "local" | "production";
type ModelProviderName = "ollama" | "cloudflare";
type RetrievalProviderName = "local-json" | "upstash-vector";

interface ModelProvider {
  embedText(input: string): Promise<number[]>;
  generateAnswer(input: GenerateInput): Promise<string>;
}

interface RetrievalProvider {
  writeChunks(chunks: EmbeddedKnowledgeChunk[]): Promise<void>;
  search(input: SearchInput): Promise<SearchResult[]>;
}
```

Important constraint: a vector index should use one embedding model family and dimension. If the embedding model changes, re-ingest the knowledge base into a new index or namespace.

## Knowledge Base

Start with markdown as the source of truth.

```txt
knowledge/
  resume.md
  profile.md
  work-style.md
  values.md
  projects/
    wavves.md
    time-crisis-wiki.md
    portfolio.md
```

Each chunk should preserve metadata:

```ts
type KnowledgeChunk = {
  id: string;
  source: "resume" | "profile" | "work_style" | "values" | "project";
  title: string;
  body: string;
  tags: string[];
  path: string;
  visibility: "public";
  embedding?: number[];
};
```

Chunking goals:
- Keep chunks semantically complete.
- Preserve source titles and paths for citations.
- Prefer smaller chunks for precise evidence cards.
- Keep enough surrounding context to avoid brittle answers.

## Prompt Modes

### Coffee Chat

Goal: warm, conversational answers for people exploring Rudy's background.

Rules:
- Answer only from retrieved context.
- Mention uncertainty when evidence is thin.
- Keep the tone personal but not salesy.
- Include source cards for the strongest evidence.

### Role Match

Goal: grounded fit analysis for a role, team need, or job description.

Rules:
- Separate evidence from inference.
- Include strong matches and possible gaps.
- Avoid claiming experience that is not present in the source material.
- Suggest useful interview questions.
- Keep output structured so it can render as cards.

## Phases

### Phase 1 - Local RAG Lab

Status: in progress.

Goal: learn the core LLM techniques with no paid model calls.

Tasks:
- Create the initial `knowledge/` markdown files.
- Add a chunking script.
- Add Ollama chat and embedding provider adapters.
- Generate local embeddings.
- Implement local vector search.
- Add a local CLI or script for `ask` and `fit` experiments.
- Record retrieval scores and model latency.

Acceptance:
- A local question retrieves relevant chunks.
- A local answer cites the chunks it used.
- Role Match returns strong matches and gaps without inventing facts.

### Phase 2 - Terminal And Cards Prototype

Status: in progress with a local-only API route and terminal cards.

Goal: make the feature feel native to the redesigned portfolio.

Tasks:
- Add terminal commands for `ask`, `fit`, `sources`, `debug retrieval`, and `lab`.
- Render answer, evidence, and gap cards.
- Add sample prompts for visitors who do not know what to ask.
- Keep existing terminal navigation commands working.

Acceptance:
- The terminal remains useful without AI enabled.
- AI responses render as cards instead of long terminal blobs.
- Debug mode is readable enough to teach retrieval behavior.

### Phase 3 - Upstash Vector Ingestion

Goal: move retrieval storage to the production-shaped vector store.

Tasks:
- Create an Upstash Vector index.
- Add an ingestion script for knowledge chunks.
- Store metadata needed for evidence cards.
- Query top-K chunks from the Next.js API route.
- Add namespace support for dev/prod or embedding-model versions.

Acceptance:
- Production-shaped retrieval works without a hosted chat model.
- The app can show source cards from Upstash metadata.
- Re-ingestion is repeatable and documented.

### Phase 4 - Cloudflare Workers AI Production Beta

Goal: enable real public model calls while staying capped.

Tasks:
- Add Cloudflare Workers AI provider adapter.
- Add environment-based provider selection.
- Add short output limits.
- Add production-safe prompt templates.
- Add a public disabled/capped fallback state.

Acceptance:
- Hosted inference only runs when explicitly enabled.
- The feature works with small public caps.
- No fallback path can call an uncapped paid model.

### Phase 5 - Upstash Redis Guardrails

Goal: make cost control explicit and testable.

Tasks:
- Add Redis-backed kill switch.
- Add global daily and monthly counters.
- Add per-visitor daily limits.
- Add input length checks.
- Add request reservation and completion logging.
- Add admin-friendly docs for resetting counters and disabling the feature.

Acceptance:
- Requests stop before model calls when limits are reached.
- Guardrail decisions are visible in `debug retrieval`.
- The site can be deployed with public AI disabled by default.

### Phase 6 - Evals And Lab Mode

Status: started with a simple local eval runner.

Goal: improve the system with evidence instead of vibes.

Tasks:
- Create factual questions.
- Create role-fit questions.
- Create tricky absence questions like "Does Rudy have Kubernetes production ownership?"
- Score retrieval relevance.
- Score hallucination behavior.
- Track answer usefulness and tone.
- Add a small eval report to the lab mode.

Acceptance:
- Evals catch missing evidence and invented claims.
- Prompt or retrieval changes can be compared before/after.
- Lab mode explains what changed in a way visitors can understand.

## Open Questions

- Which Ollama chat model should be the first local default?
- Which embedding model should be used locally and in production?
- Should production embeddings be generated locally and uploaded, or generated by Cloudflare Workers AI?
- Should `fit paste` open an inline textarea, a modal, or a dedicated section below the terminal?
- Should Ask Rudy live only on the homepage, or eventually have a dedicated `/ask` route?
- Should public production start disabled with sample answers, or enabled with very low caps?

## Non-Goals

- Do not train a custom model before the retrieval-backed version is working.
- Do not host Ollama on a public GPU server for the first production version.
- Do not add an uncapped paid provider fallback.
- Do not let anonymous users submit unlimited job descriptions.
- Do not let the model invent dates, companies, credentials, or outcomes.

## First Implementation Slice

The smallest useful slice is local-only:

1. Add `knowledge/` source files.
2. Add chunking.
3. Add Ollama embeddings.
4. Add local vector search.
5. Add a script that answers one question with sources.

After that works, wire it into the terminal UI and move retrieval storage to Upstash Vector.

## Local Phase 1 Commands

Install and start Ollama outside this repo, then pull the default local models:

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

Build the local vector index:

```bash
npm run ask-rudy:index
```

Run the starter eval set:

```bash
npm run ask-rudy:eval
```

Run one eval case by id:

```bash
npm run ask-rudy:eval -- --only fit-kubernetes-sre
```

Ask a Coffee Chat question:

```bash
npm run ask-rudy:ask -- "What kind of engineer is Rudy?"
```

Run Role Match mode:

```bash
npm run ask-rudy:fit -- "We need a product-minded AI platform engineer who can build developer tools and retrieval workflows."
```

Useful model overrides:

```bash
ASK_RUDY_CHAT_MODEL=qwen2.5:7b npm run ask-rudy:ask -- "What is Rudy strongest at?"
ASK_RUDY_EMBED_MODEL=nomic-embed-text npm run ask-rudy:index
```

Generated local artifacts live in `.ask-rudy/` and are ignored by git.

Enable the local-only website route:

```bash
ASK_RUDY_LOCAL_ENABLED=true npm run dev
```

Then try terminal commands on the homepage:

```txt
ask what kind of engineer is rudy?
fit we need a product-minded AI platform engineer who can build developer tools
sources
lab
```

The website route is intentionally disabled unless `ASK_RUDY_LOCAL_ENABLED=true` and `NODE_ENV` is not `production`.
