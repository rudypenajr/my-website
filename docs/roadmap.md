# Website Roadmap

This is the working map for finishing the portfolio redesign. The current site has a strong first shape: full-page portfolio structure, updated resume-informed content, and an interactive terminal that feels worth expanding.

## Current State

- Homepage redesign is implemented in `src/app/page.tsx`.
- Visual system is centralized in `src/app/globals.css` with shadcn-style theme tokens.
- Metadata is updated in `src/app/layout.tsx`.
- Build and lint pass.
- The terminal is the standout interaction and should become a deliberate feature, not just a decorative flourish.

## In Progress / Implemented

### Dark / Light Mode

Status: implemented in the first cleanup pass.

The site now has a theme toggle that preserves the current dark palette and introduces a clean light theme.

Acceptance notes:
- Add `light` token values alongside the existing dark tokens.
- Persist the selected theme in `localStorage`.
- Respect the user system preference on first visit.
- Avoid a washed-out light mode; it should feel intentional, not like inverted dark mode.
- Make sure terminal, cards, nav, forms, and gradients all work in both modes.

## Missing / Follow-Up

### Current Navigation

Status: implemented in the first cleanup pass.

The page has a Current section for active focus and learning themes.

Options:
- Add it to the main nav as `Current`.
- Keep it distinct from Projects by making it temporal and editorial.
- Use terminal commands like `current`, `now`, or `open current` later.

Decision:
- Added a `Current` nav item.
- Changed the section to `Current Focus`.
- Reframed it around active AI architecture work and ML/music learning, not project-card progress.
- Still support it from the terminal later.

## Decisions To Make / Validate

### Contact Section

Status: implemented in the first cleanup pass.

Concern: a public contact form may invite spam or require backend work that is not worth it.

Options:
- Keep a contact section but remove the form.
- Replace the form with direct links only: email, GitHub, LinkedIn.
- Use a protected mailto pattern or obfuscated email display.
- Keep the form visually, but wire it later through a spam-protected provider.
- Replace contact with a "Work with me" section that points people toward LinkedIn/email without collecting input.

Decision:
- Removed the form for now.
- Kept a polished contact area with direct links and no backend surface.
- Promoted LinkedIn as the best professional contact path.

### Section Validation

Review each section for accuracy, completeness, and whether it supports the story we want visitors to leave with.

Sections to validate:
- Hero: title, role rotation, primary message, CTA labels.
- About: current narrative around AI platform work, developer tooling, and product engineering.
- Skills: make sure the categories fully represent AI/LLM platforms, cloud infrastructure, frontend/product UI, and tooling.
- Experience: verify dates, titles, company names, and bullet emphasis.
- Projects: decide what should be public-facing versus internal/high-level.
- Current: validate the AI architecture and ML/music learning themes.
- Contact: validate the new direct-link section language.

Open questions:
- Should the site lead with "Staff Software Engineer" or "AI Platform & Agent Systems"?
- How much DTN/internal work should be described publicly?
- Are public side projects more important than internal platform projects for the Projects section?
- Should older roles beyond Bitfusion appear, or is the shorter timeline cleaner?

Hero validation notes:
- Removed the nav wordmark.
- Changed display name to `Rudy Pena`.
- Replaced narrow implementation typing roles with market-aligned AI platform, LLM systems, and Python tooling language.
- Rewrote hero copy around applied AI systems, ML platform infrastructure, AWS Bedrock AgentCore, FastAPI MCP tooling, and Python/Node.js CLI/SDK enablement.
- Added Strands agent patterns to the hero, metadata, terminal copy, About, Experience, and Current sections so the agent framework layer is clear instead of buried inside generic runtime language.

Skills validation notes:
- Split the skills section into five clearer proof lanes: AI Platforms, ML & Retrieval, Cloud Systems, Product Engineering, and Developer Tooling.
- Separated professional AI platform evidence from the personal ML/retrieval growth lane so AgentCore/FastAPI MCP work and embeddings/evals work both read clearly.
- Added missing signals from local work: Strands Agents, FastAPI, PyTorch, Transformers, embeddings, API Gateway v1/v2, ECS, Terraform, Auth0, roles/permissions, and GitLab pipelines.

Experience validation notes:
- Weighted DTN more heavily because it is the strongest current proof for AI platform, LLM systems, AgentCore, FastAPI MCP, and Python SDK positioning.
- Added Strands-based agents to the DTN runtime/deployment bullet while keeping API Gateway, WAF, ECR, S3, Aurora/Postgres, and OpenSearch as supporting infrastructure proof.
- Sharpened Anaconda around a developer platform used by millions while keeping the test migration and MVP/product proof.
- Kept IBM and Bitfusion concise; Bitfusion remains useful as earlier ML infrastructure evidence.
- Left older roles off the homepage so the timeline stays focused, with the full history reserved for the resume.
- Cleaned up experience tags so they favor concrete technologies or specific domains over vague labels: Identity/Auth, Product MVPs, CLI tooling, and ML workloads.

Projects validation notes:
- Reduced Projects to three stronger artifacts: Wavves - Music Lab, Time Crisis Wiki, and Personal Portfolio.
- Folded the separate Song Finder card into Wavves because Song Finder is a product mode inside the broader music AI lab.
- Reframed Wavves around music AI, FastAPI inference, speech-to-text, query understanding, transformer classifier experiments, and eval dashboards.
- Kept Inngest in the Wavves tags because deterministic workflow orchestration is part of the AI/ML systems story.
- Reframed Time Crisis Wiki as an in-progress retrieval app spanning the Go scraper/data pipeline, MongoDB Atlas, OpenAI embeddings, vector search, React UI, and AI-assisted exploration.
- Kept Personal Portfolio as the taste/polish/interaction proof, especially for the terminal and themeable design direction.

Current validation notes:
- Reframed the first card around AWS Bedrock AgentCore Runtime, Strands agent patterns, FastAPI MCP tooling, identity, runtime boundaries, and self-service paths for product teams.
- Reframed the music card as `Music AI product loops` so song recognition, playlist generation, STT, query understanding, and eval baselines are presented as one learning/product system.

## Terminal Expansion Ideas

The terminal should feel like a small interactive layer that rewards curiosity without taking over the whole portfolio.

Related feature plan:
- See `docs/ask-rudy-roadmap.md` for the retrieval-backed Ask Rudy roadmap: local Ollama lab, Upstash Vector production retrieval, Cloudflare Workers AI capped inference, Upstash Redis cost guardrails, and terminal-driven answer cards.

### Better Command System

Status: complete for the first terminal feature pass.

Add richer commands with aliases and command history.

Possible commands:
- `help`: show command categories.
- `about`: short bio.
- `work`: current and previous roles.
- `skills`: grouped skills.
- `projects`: list featured projects with links.
- `contact`: show direct links.
- `resume`: link or download resume.
- `current` / `now`: current focus and learning themes.
- `stack`: tools and architecture.
- `clear`: clear terminal.

Nice touches:
- Support aliases like `ls`, `whoami`, `pwd`, `cat resume`, `open projects`.
- Add up/down arrow history.

Implemented:
- Added `current`, `resume`, richer `help`, and updated `projects` output.
- Added aliases: `ls`, `pwd`, `now`, `shiplog`, `cat resume`, `open now`, and `open work`.
- Added up/down arrow command history.
- Added a public resume PDF at `/Rudy_Pena_Resume.pdf`.

### Terminal As Navigation

Status: complete for the first terminal feature pass.

Let commands move the page.

Examples:
- `open projects` scrolls to Projects.
- `open skills` scrolls to Skills.
- `open contact` scrolls to Contact.
- `resume` opens/downloads the resume.

This makes the terminal actually useful while keeping the playful feel.

Implemented:
- `open about`, `open skills`, `open experience`, `open projects`, `open current`, and `open contact` scroll to their sections.
- `resume` opens the public resume PDF in a new tab.

### Terminal Modes

Status: deferred.

Add a few themed command groups.

Ideas:
- `tour`: guided walkthrough of the portfolio.
- `story`: prints a short career timeline.
- `system`: shows a fake-but-useful "profile status" card.
- `shiplog`: shows current focus and learning items.
- `easteregg`: one or two small personality moments.

Keep this restrained. The terminal should feel clever, not distracting.

### Terminal UI Polish

Status: deferred.

Potential upgrades:
- Tab completion for known commands.
- Clickable terminal output links.
- Command prompt with current path: `rudy@portfolio ~/site %`.
- Typed output animation for responses.
- Command error suggestions: `Did you mean "projects"?`
- A compact command palette-style help output.
- Mobile-friendly terminal height and scroll behavior.
- Make the terminal content accessible to screen readers.

## Visual System / shadcn Direction

The current CSS already uses token names similar to shadcn (`--background`, `--foreground`, `--card`, `--primary`, etc.). That gives us a clean path to add shadcn later.

Potential next steps:
- Add `components.json`.
- Add shadcn utility setup.
- Move repeated UI into components: Button, Card, Badge, SectionHeading, Terminal.
- Keep the portfolio visually custom, but use shadcn patterns for consistency and easier theme iteration.

Do not add shadcn just for the sake of it. Add it when we are ready to componentize and iterate on the theme.

## Suggested Phases

### Phase 1 - Clean Current Pass

- Add dark/light mode.
- Remove or simplify contact form.
- Validate copy and section content.
- Improve mobile spacing and terminal first impression if needed.

### Phase 2 - Componentize

- Extract major homepage pieces into components.
- Consider shadcn setup and registry/token alignment.
- Create reusable Button, Card, Badge, SectionHeading, and Terminal primitives.

### Phase 3 - Terminal Feature Pass

- Status: mostly complete for the useful first pass.
- Completed: command history, aliases, navigation commands, current/resume/project/contact commands.
- Deferred: richer output formatting, terminal modes, clickable output links, tab completion, and typed output polish.

### Phase 4 - Polish / Launch

- Completed: add generated Open Graph image for rich link previews.
- Completed: add visible resume link/download in the hero and terminal.
- Completed: final accessibility pass for focus states, mobile nav semantics, terminal output announcements, decorative terminal chrome, and reduced-motion handling.
- Completed: final SEO metadata pass with canonical URL, keywords, robots, Twitter card metadata, and Person JSON-LD.
- Completed: confirm deployment behavior with production build.
- Completed: redirect old `/work` and `/projects` routes into the matching homepage sections.

## Next Best Move

Phase 1 and the useful first terminal pass are complete enough to pause here.

Next likely choices:
1. Do a final accessibility pass.
2. Componentize the homepage into reusable pieces.
3. Revisit deferred terminal personality and polish later.
4. Prepare remaining launch items: Open Graph image, resume link checks, SEO metadata, and deployment behavior.
