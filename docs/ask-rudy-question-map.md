# Ask Rudy Question Map

This map captures the questions Ask Rudy should answer well as the knowledge base grows.

The production system already works: user questions are embedded, matched against Upstash Vector, and answered by a hosted model with Redis guardrails. The next quality gains come from making the source material explicit and testing the questions visitors are likely to ask.

## How To Use This Map

For each question:

1. Make sure `knowledge/` contains direct evidence.
2. Add or update eval cases in `evals/ask-rudy-cases.json`.
3. Re-index with `npm run ask-rudy:index:prod` after source changes.
4. Test the production API and UI.

Good Ask Rudy answers should:

- Answer the exact question first.
- Cite relevant source chunks.
- Separate current experience from historical experience.
- Say "not shown" when the knowledge base does not support a claim.
- Avoid turning every question into a generic profile summary.

## Priority Questions

These are the first questions to optimize because they represent likely recruiter, collaborator, and curious-visitor behavior.

### Skills

| Question | Expected Answer Shape | Needed Evidence |
| --- | --- | --- |
| Does Rudy know Python? | Yes; mention Python SDKs/CLIs, FastAPI, AI tooling, ML/retrieval interests. | `knowledge/resume.md`, `knowledge/journey/developer-tools.md`, `knowledge/projects/wavves.md` |
| Does Rudy know Go/Golang? | Yes, with historical framing; mention Go CLI tooling and full-stack Go work at Bitfusion. | `knowledge/resume.md`, `knowledge/journey/microservices.md` |
| Does Rudy know TypeScript? | Yes; mention Next.js, React, product surfaces, portfolio work. | `knowledge/resume.md`, `knowledge/projects/portfolio.md` |
| Does Rudy know FastAPI? | Yes; mention FastAPI MCP services, Anaconda FastAPI work, Wavves inference services. | `knowledge/resume.md`, `knowledge/projects/wavves.md`, `knowledge/journey/inference.md` |
| Does Rudy know AWS? | Yes; mention Bedrock AgentCore, API Gateway, Lambda, S3, ECR, Aurora/Postgres, OpenSearch, WAF. | `knowledge/resume.md`, `knowledge/journey/ai-platform.md` |

### AI And ML Systems

| Question | Expected Answer Shape | Needed Evidence |
| --- | --- | --- |
| Does Rudy understand inference? | Yes/partially with precise framing; mention production AI features, FastAPI inference boundaries, Bedrock runtime usage, and model-serving-adjacent work. | `knowledge/journey/inference.md`, `knowledge/projects/wavves.md`, `knowledge/resume.md` |
| Has Rudy built production AI systems? | Yes; mention DTN production AI features, Bedrock Claude/Titan, AgentCore platform patterns, identity-aware runtime boundaries. | `knowledge/journey/ai-platform.md`, `knowledge/resume.md` |
| Has Rudy worked with embeddings and retrieval? | Yes; mention Ask Rudy, Time Crisis Wiki, vector search, evals, source cards. | `knowledge/projects/time-crisis-wiki.md`, `knowledge/projects/portfolio.md` |
| Has Rudy built eval loops? | Yes; mention Wavves eval dashboards, Ask Rudy eval runner, practical miss-driven improvements. | `knowledge/projects/wavves.md`, `knowledge/projects/portfolio.md`, `knowledge/values.md` |
| Does Rudy understand agents? | Yes; mention AWS Bedrock AgentCore, Strands agents, FastAPI MCP services, runtime boundaries, shared/custom MCP tooling. | `knowledge/journey/ai-platform.md`, `knowledge/resume.md` |

### Architecture And Systems

| Question | Expected Answer Shape | Needed Evidence |
| --- | --- | --- |
| Has Rudy built microservices? | Yes, with examples; mention FastAPI services, Node/Go services, API boundaries, deployment patterns, and service-oriented project work. | `knowledge/journey/microservices.md`, `knowledge/resume.md` |
| Has Rudy designed APIs and service boundaries? | Yes; mention FastAPI MCP, Node APIs, API Gateway, service boundaries, developer-facing APIs. | `knowledge/journey/microservices.md`, `knowledge/journey/developer-tools.md` |
| Has Rudy worked with auth and identity? | Yes; mention identity-aware platform design, Auth0, Lambda authorizers, runtime boundaries. | `knowledge/journey/ai-platform.md`, `knowledge/resume.md` |
| Has Rudy worked with data stores? | Yes; mention Aurora/Postgres, OpenSearch, MongoDB Atlas, Upstash Vector, Redis/KV. | `knowledge/journey/microservices.md`, `knowledge/projects/time-crisis-wiki.md`, `knowledge/projects/portfolio.md` |
| Has Rudy operated Kubernetes? | Not shown or limited; mention adjacent cloud/platform work without overstating Kubernetes ownership. | `knowledge/journey/known-gaps.md` |

### Role Fit

| Question | Expected Answer Shape | Needed Evidence |
| --- | --- | --- |
| Is Rudy a fit for an AI platform engineer role? | Strong fit; mention DTN AI platform, Bedrock AgentCore, Strands, FastAPI MCP, developer tooling. | `knowledge/journey/ai-platform.md`, `knowledge/resume.md` |
| Is Rudy a fit for a developer tools role? | Strong fit; mention Python CLI/SDK tooling, product-minded interfaces, component libraries, eval/debug surfaces. | `knowledge/journey/developer-tools.md`, `knowledge/work-style.md` |
| Is Rudy more frontend, backend, or platform? | Nuanced answer; frontend/product foundation plus current platform/AI systems focus. | `knowledge/journey/frontend-to-ai-platform.md`, `knowledge/profile.md` |
| Would Rudy fit a pure research ML role? | Likely not the strongest fit; mention practical AI systems and ML platform work rather than deep research. | `knowledge/journey/known-gaps.md`, `knowledge/values.md` |
| Would Rudy fit a senior Kubernetes SRE role? | Partial/adjacent fit; cloud/platform evidence exists, but Kubernetes production ownership is not shown. | `knowledge/journey/known-gaps.md`, `knowledge/resume.md` |

### Side Projects

| Question | Expected Answer Shape | Needed Evidence |
| --- | --- | --- |
| What is Wavves? | Music AI lab with concert prep, smart playlists, song discovery, STT, query understanding, inference services, evals. | `knowledge/projects/wavves.md` |
| What is Time Crisis Wiki? | Retrieval app for episode data with Go scraper, MongoDB Atlas, OpenAI embeddings, vector search, React UI. | `knowledge/projects/time-crisis-wiki.md` |
| What does this portfolio prove? | Product + retrieval lab: Next.js UI, terminal interaction, Ask Rudy RAG, Cloudflare/Upstash production path. | `knowledge/projects/portfolio.md` |
| What side projects show AI experience? | Wavves, Time Crisis Wiki, Ask Rudy; compare inference, retrieval, evals, and product loops. | all project files |
| What has Rudy learned from these projects? | Practical learning loop: build small systems, inspect misses, add evals, improve from evidence. | `knowledge/work-style.md`, project files |

### Work Style

| Question | Expected Answer Shape | Needed Evidence |
| --- | --- | --- |
| How does Rudy approach ambiguous problems? | Starts with concrete slices, observable behavior, teachable tools, and evidence-driven iteration. | `knowledge/work-style.md`, `knowledge/values.md` |
| What kind of teammate is Rudy? | Product-minded, developer-experience oriented, comfortable across product/platform/API/UI boundaries. | `knowledge/work-style.md`, `knowledge/profile.md` |
| What does Rudy value in AI systems? | Grounded answers, visible evidence, eval loops, honest uncertainty, cost-aware rollout. | `knowledge/values.md`, `knowledge/projects/portfolio.md` |

## Known Gap Questions

These questions should not produce inflated answers.

| Question | Expected Answer Shape |
| --- | --- |
| Does Rudy know BackboneJS? | The retrieved context does not show BackboneJS experience. |
| Does Rudy have Kubernetes production ownership? | Not shown; mention related cloud/platform work only as adjacent evidence. |
| Is Rudy a deep research ML scientist? | Not shown; position him around applied AI systems, tooling, and platform work. |
| Does Rudy have mobile app experience? | Not shown unless future knowledge sources add it. |
| Does Rudy have C++ systems experience? | Not shown unless future knowledge sources add it. |

## Eval Candidates

Add these to `evals/ask-rudy-cases.json` in small batches:

```txt
coffee-python-skill
coffee-golang-skill
coffee-inference
coffee-microservices
coffee-production-ai
coffee-embeddings-retrieval
coffee-side-project-ai
coffee-known-gap-backbone
coffee-known-gap-kubernetes
fit-ai-platform-engineer
fit-developer-tools-engineer
fit-frontend-platform-engineer
fit-kubernetes-sre
```

Each eval should check:

- Direct answer quality.
- Relevant source usage.
- Specificity to the question.
- No overstatement.
- Clear gaps when evidence is thin.

## First Knowledge Files To Add

Start with the files that will improve the most currently weak answers:

```txt
knowledge/journey/inference.md
knowledge/journey/microservices.md
knowledge/journey/ai-platform.md
knowledge/journey/developer-tools.md
knowledge/journey/known-gaps.md
```

Then expand project files:

```txt
knowledge/projects/wavves.md
knowledge/projects/time-crisis-wiki.md
knowledge/projects/portfolio.md
```

## Re-Index Checklist

After changing `knowledge/`:

```bash
npm run ask-rudy:index:prod -- --dry-run
npm run ask-rudy:index:prod
```

Then smoke test:

```bash
curl -s https://www.rudypenajr.com/api/ask-rudy \
  -H "Content-Type: application/json" \
  -d '{"input":"Does Rudy understand inference?","mode":"ask"}'
```

Check:

- `sources` includes the new knowledge file.
- The answer uses the requested term directly.
- Gaps are honest.
- Guardrail counters remain sane.
