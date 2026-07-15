"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const roles = [
  "Staff Software Engineer",
  "AI Platform Engineer",
  "LLM Systems Builder",
  "Python AI Tooling",
];

const isAskRudyUiEnabled =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ASK_RUDY_ENABLED === "true";

const commands: Record<string, string> = {
  help: [
    "Commands: about, skills, stack, work, projects, current, contact, resume, clear",
    isAskRudyUiEnabled ? "Ask Rudy: ask <question>, fit <role>, sources, lab" : null,
    "Navigation: open about, open skills, open experience, open projects, open current, open contact",
    "Aliases: ls, pwd, now, shiplog, cat resume",
  ]
    .filter(Boolean)
    .join("\n"),
  about:
    "Rudy Pena - Staff Software Engineer in Austin, TX.\nI build applied AI platforms, FastAPI MCP services, Python/Node.js SDKs, and product-grade web experiences.",
  skills:
    "AI platforms, AWS Bedrock AgentCore, Strands Agents, FastAPI MCP, Auth0, Next.js, React, TypeScript, Python, Go, Postgres, OpenSearch.",
  stack:
    "Frontend: Next.js, React, TypeScript\nPlatform: AWS Lambda, API Gateway, WAF, ECR, S3, Aurora/Postgres\nAI: AWS Bedrock AgentCore, Strands Agents, FastAPI MCP, RAG, prompt orchestration",
  work: "Currently: Staff Software Engineer, AI Platform at DTN.\nPreviously: Anaconda, IBM, Bitfusion, Stretch, Sports195.",
  projects:
    "Featured work: Wavves - Music Lab, Time Crisis Wiki, and this portfolio.\nRun: open projects",
  current:
    "Current focus:\n- AI architecture at DTN: AgentCore Runtime, Strands, FastAPI MCP, identity, and runtime boundaries.\n- Music AI product loops: Wavves, STT, song recognition, playlist generation, and evals.\n- Transformer fundamentals: tokenization, self-attention, BERT-style models, and model artifacts.",
  contact: "Start here: linkedin.com/in/rudypenajr\nCode trail: github.com/rudypenajr\nDirect: rudypenajr@gmail.com",
  resume: "Opening resume: /Rudy_Pena_Resume.pdf",
  whoami: "rudy@portfolio - builder of AI platforms, developer tools, and useful little web experiments.",
};

const commandAliases: Record<string, string> = {
  ls: "help",
  pwd: "about",
  now: "current",
  shiplog: "current",
  "cat resume": "resume",
  "open now": "open current",
  "open work": "open experience",
};

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Current", href: "#current" },
  { label: "Contact", href: "#contact" },
];

type Theme = "dark" | "light";

type TerminalLine = {
  text: string;
  command?: boolean;
};

type AskRudyMode = "ask" | "fit";

type AskRudySource = {
  id: string;
  title: string;
  path: string;
  score: number;
  body: string;
  tags?: string[];
};

type AskRudyResult = {
  mode: AskRudyMode;
  input: string;
  answer: string;
  elapsedMs: number;
  sources: AskRudySource[];
};

const askRudyModeMeta: Record<AskRudyMode, { label: string; status: string; inputLabel: string; glyph: string }> = {
  ask: {
    label: "Coffee Chat",
    status: "Conversational mode",
    inputLabel: "Question for Rudy's knowledge base",
    glyph: "☕",
  },
  fit: {
    label: "Role Match",
    status: "Fit analysis mode",
    inputLabel: "Role or need",
    glyph: "👔",
  },
};

const askRudyStarterCommands = [
  {
    label: "Engineer type",
    mode: "ask" as const,
    prompt: "What kind of engineer is Rudy?",
    command: "ask what kind of engineer is rudy?",
  },
  {
    label: "AI projects",
    mode: "ask" as const,
    prompt: "What projects show Rudy's AI experience?",
    command: "ask what projects show rudy's ai experience?",
  },
  {
    label: "Role fit",
    mode: "fit" as const,
    prompt: "We need a product-minded AI platform engineer who can build developer tools",
    command: "fit we need a product-minded AI platform engineer who can build developer tools",
  },
];

const highlights = [
  { value: "10+", label: "Years building software" },
  { value: "LLM", label: "Systems and workflows" },
  { value: "MCP", label: "Tooling and integrations" },
  { value: "Python", label: "AI tooling" },
];

const skills = [
  {
    title: "AI Platforms",
    icon: "{ }",
    items: [
      "AWS Bedrock AgentCore",
      "Strands Agents",
      "FastAPI MCP",
      "LLM workflows",
      "Agent runtime patterns",
      "Prompt systems",
    ],
  },
  {
    title: "ML & Retrieval",
    icon: "∑",
    items: ["Python", "FastAPI", "PyTorch", "Transformers", "Embeddings", "Vector search", "Evals"],
  },
  {
    title: "Cloud Systems",
    icon: "[]",
    items: ["API Gateway v1/v2", "ECS", "Lambda", "S3", "ECR", "Aurora/Postgres", "OpenSearch", "Terraform"],
  },
  {
    title: "Product Engineering",
    icon: "<>",
    items: ["Next.js", "React", "TypeScript", "Node.js APIs", "Auth0", "Design systems", "Tailwind CSS"],
  },
  {
    title: "Developer Tooling",
    icon: "$_",
    items: ["Python SDKs", "Python CLIs", "Node.js tooling", "Roles/permissions", "CI/CD", "GitLab pipelines"],
  },
];

const experience = [
  {
    role: "Staff Software Engineer, AI Platform",
    company: "DTN",
    period: "Mar 2022 - Present",
    current: true,
    bullets: [
      "Designed a secure, identity-aware AI platform on AWS that enables teams to prototype and deploy agent-driven workflows with shared and custom MCP tooling.",
      "Built runtime and deployment patterns for AWS Bedrock AgentCore, Strands-based agents, and FastAPI MCP services using API Gateway, WAF, Lambda authorizers, ECR, S3, Aurora/Postgres, and OpenSearch.",
      "Created Python CLI/SDK tooling to bootstrap agent services, standardize configuration, and reduce time-to-prototype for customer-facing AI use cases.",
      "Delivered product and platform surfaces in Next.js for agent creation, configuration, and interaction across engineering and product teams.",
      "Delivered production AI features with AWS Bedrock Claude and Titan for summarization, analysis, and insight generation in DTN's Grain Intelligence platform.",
    ],
    tags: ["AWS Bedrock AgentCore", "FastAPI MCP", "Python SDKs", "Next.js", "Identity/Auth", "OpenSearch"],
  },
  {
    role: "Software Engineer III",
    company: "Anaconda",
    period: "Mar 2019 - Mar 2022",
    bullets: [
      "Built and shipped core Anaconda.com features with Angular and FastAPI for a developer platform used by millions.",
      "Led the Karma-to-Jest migration and helped raise test coverage from 2% to 60%.",
      "Drove MVP initiatives that grew into a meaningful share of the product portfolio, including partner work with HP, Snowflake, and Microsoft.",
    ],
    tags: ["Angular", "FastAPI", "Jest", "Python", "Product MVPs"],
  },
  {
    role: "Senior UI Developer",
    company: "IBM",
    period: "Aug 2018 - Mar 2019",
    bullets: [
      "Developed a large portion of IBM's internal component library in Angular.",
      "Coordinated work across Austin and India teams to break down epics and deliver MVP scope.",
    ],
    tags: ["Angular", "Component libraries", "Design systems"],
  },
  {
    role: "Software Engineer",
    company: "Bitfusion",
    period: "Sep 2017 - Aug 2018",
    bullets: [
      "Built Go CLI tooling for distributed machine learning workloads with Cobra and Viper.",
      "Developed full-stack features with Go, Node.js, and React for managing ML jobs and clusters.",
    ],
    tags: ["Go", "Node.js", "React", "CLI tooling", "ML workloads"],
  },
];

const projects = [
  {
    name: "Wavves - Music Lab",
    label: "Music AI",
    status: "In Progress",
    description:
      "A music AI lab for concert prep, smart playlists, and song discovery. It combines Setlist.fm, Spotify, FastAPI inference, speech-to-text, query understanding, transformer classifier experiments, and evaluation dashboards to make music intent observable and useful.",
    tags: ["FastAPI", "STT", "Transformer classifier", "Evals", "ML Inference", "Inngest", "Next.js"],
    href: "https://playlist.rudypenajr.com/",
  },
  {
    name: "Time Crisis Wiki",
    label: "Retrieval App",
    status: "In Progress",
    description:
      "A search and retrieval app for Time Crisis episode data, backed by a Go scraper, MongoDB Atlas, OpenAI embeddings, vector search, and a React interface for episode search and AI-assisted exploration.",
    tags: ["Go", "MongoDB Atlas", "Vector Search", "Embeddings", "RAG", "Data Pipeline"],
    href: "https://tc.rudypenajr.com/",
  },
  {
    name: "Personal Portfolio",
    label: "Personal",
    status: "Live",
    description:
      "This site: a Next.js portfolio with themeable design tokens, a terminal-inspired interaction layer, and content shaped around applied AI, developer tooling, and product craft.",
    tags: ["Next.js", "Terminal UI", "Interactive UI", "Design Tokens"],
    href: "https://www.rudypenajr.com/",
  },
];

const currentFocus = [
  {
    title: "AI architecture at DTN",
    status: "Designing",
    description:
      "Designing secure, identity-aware AI platform patterns at DTN: AWS Bedrock AgentCore Runtime, Strands agents, FastAPI MCP services, runtime boundaries, and self-service paths for product teams.",
    stack: ["AWS Bedrock AgentCore", "Strands Agents", "FastAPI MCP", "Identity/Auth", "Agent Runtime"],
  },
  {
    title: "Music AI product loops",
    status: "Building",
    description:
      "Using Wavves - Music Lab to build concert playlist generation, song recognition, speech-to-text, query understanding, eval baselines, and practical ML service boundaries.",
    stack: ["STT", "Deepgram", "FastAPI", "Spotify", "Evals"],
  },
  {
    title: "Transformer fundamentals",
    status: "Studying",
    description:
      "Building intuition for tokenization, self-attention, multi-head attention, BERT-style classifiers, model artifacts, and evaluation loops.",
    stack: ["Tokenization", "Self-attention", "BERT-style models", "Model artifacts", "Evals"],
  },
];

const contactLinks = [
  {
    title: "Professional",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rudypenajr",
    description: "Best place to start for roles, collaborations, and serious engineering conversations.",
  },
  {
    title: "Code",
    label: "GitHub",
    href: "https://github.com/rudypenajr",
    description: "A better window into how I think, tinker, evaluate ideas, and ship outside of work.",
  },
  {
    title: "Direct",
    label: "Email",
    href: "mailto:rudypenajr@gmail.com",
    description: "Useful when direct makes more sense, intentionally lower-key than the main path.",
  },
];

function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -64px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const storedTheme = window.localStorage.getItem("rp-theme");
  if (storedTheme === "dark" || storedTheme === "light") return storedTheme;

  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    document.documentElement.dataset.theme = preferredTheme;
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("rp-theme", nextTheme);
      return nextTheme;
    });
  };

  return { mounted, theme, toggleTheme };
}

function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { mounted, theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.slice(1));

    const updateActiveSection = () => {
      const firstSection = document.getElementById(sectionIds[0]);
      if (!firstSection || window.scrollY < firstSection.offsetTop - 180) {
        setActiveSection("");
        return;
      }

      const currentSection = sectionIds.reduce((current, sectionId) => {
        const element = document.getElementById(sectionId);
        if (!element) return current;

        return element.offsetTop <= window.scrollY + 160 ? sectionId : current;
      }, sectionIds[0]);

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="site-nav__inner">
        <div className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className={activeSection === link.href.slice(1) ? "is-active" : ""}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
          >
            {mounted && theme === "light" ? (
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M20.2 15.9A8.7 8.7 0 0 1 8.1 3.8 8.8 8.8 0 1 0 20.2 15.9Z" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" />
              </svg>
            )}
          </button>

          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" id="mobile-navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      text: isAskRudyUiEnabled
        ? 'rudy@portfolio ~ % type "help" to explore. try: ask what kind of engineer is rudy?'
        : 'rudy@portfolio ~ % type "help" to explore.',
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [askResult, setAskResult] = useState<AskRudyResult | null>(null);
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [labVisible, setLabVisible] = useState(false);
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [askMode, setAskMode] = useState<AskRudyMode>("ask");
  const [askDraft, setAskDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (!isAskRudyUiEnabled) return;

    const openAskRudy = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: AskRudyMode; prompt?: string }>).detail;
      setAskMode(detail?.mode ?? "ask");
      setAskDraft(detail?.prompt ?? "");
      setAskModalOpen(true);
    };

    window.addEventListener("ask-rudy:open", openAskRudy);
    return () => window.removeEventListener("ask-rudy:open", openAskRudy);
  }, []);

  const normalizeCommand = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runCommand = async (rawCommand: string) => {
    const normalizedCommand = normalizeCommand(rawCommand);
    setHistory((currentHistory) => [...currentHistory, rawCommand]);
    setHistoryIndex(null);

    if (normalizedCommand === "clear") {
      setLines([{ text: "terminal cleared. try help when you want the map back." }]);
      setAskResult(null);
      setAskError(null);
      setLabVisible(false);
      setInput("");
      return;
    }

    setLines((current) => [...current, { text: rawCommand, command: true }]);
    setInput("");
    const response = await resolveCommand(rawCommand);
    setLines((current) => [
      ...current,
      { text: typeof response === "string" ? response : "done." },
    ]);
  };

  const runAskRudy = async (mode: AskRudyMode, value: string) => {
    if (!isAskRudyUiEnabled) {
      return "Ask Rudy is a local lab right now. Production support is planned for the guarded Cloudflare/Upstash version.";
    }

    if (!value) {
      setAskModalOpen(true);
      setAskMode(mode);
      return mode === "fit"
        ? 'usage: fit we need an AI platform engineer who can build developer tools'
        : 'usage: ask what kind of engineer is rudy?';
    }

    setAskModalOpen(true);
    setAskMode(mode);
    setAskDraft(value);
    setAskLoading(true);
    setAskResult(null);
    setAskError(null);
    setLabVisible(false);

    try {
      const response = await fetch("/api/ask-rudy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input: value }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Ask Rudy failed.");
      }

      setAskResult(data);
      return mode === "fit"
        ? "role match complete. review the cards below the terminal."
        : "answer ready. review the cards below the terminal.";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ask Rudy failed.";
      setAskError(message);
      return `ask-rudy error: ${message}`;
    } finally {
      setAskLoading(false);
    }
  };

  const resolveCommand = (rawCommand: string) => {
    const normalizedCommand = normalizeCommand(rawCommand);
    const command = commandAliases[normalizedCommand] ?? normalizedCommand;

    if (command === "resume") {
      window.open("/Rudy_Pena_Resume.pdf", "_blank", "noopener,noreferrer");
      return commands.resume;
    }

    if (command.startsWith("open ")) {
      const target = command.replace("open ", "");
      const section = navLinks.find((link) => link.label.toLowerCase() === target);

      if (!section) {
        return `not sure where "${target}" lives yet. try: open projects, open skills, open current, open contact.`;
      }

      scrollToSection(section.href.slice(1));
      return `opening ${section.label.toLowerCase()}...`;
    }

    if (command === "sources") {
      if (!isAskRudyUiEnabled) {
        return "Ask Rudy sources are part of the local lab and are not enabled in production yet.";
      }

      setAskModalOpen(true);
      setLabVisible(true);
      return askResult
        ? "opening latest Ask Rudy sources."
        : 'no Ask Rudy sources yet. try: ask what projects show rudy\'s ai experience?';
    }

    if (command === "lab" || command === "debug retrieval") {
      if (!isAskRudyUiEnabled) {
        return "Ask Rudy lab mode is disabled in production until the hosted provider is wired up.";
      }

      setAskModalOpen(true);
      setLabVisible((visible) => !visible);
      return askResult
        ? "opening Ask Rudy lab details."
        : "lab mode is ready once you run an ask or fit command.";
    }

    if (command.startsWith("ask ")) {
      return runAskRudy("ask", rawCommand.trim().replace(/^ask\s+/i, ""));
    }

    if (command.startsWith("fit ")) {
      return runAskRudy("fit", rawCommand.trim().replace(/^fit\s+/i, ""));
    }

    if (command === "ask" || command === "fit") {
      return command === "fit"
        ? 'usage: fit paste or type a role description after the command.'
        : 'usage: ask type a question after the command.';
    }

    return commands[command] ?? `not found: ${rawCommand}. try "help".`;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rawCommand = input.trim();
    if (!rawCommand) return;
    await runCommand(rawCommand);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!history.length) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHistoryIndex((currentIndex) => {
        const nextIndex = currentIndex === null ? history.length - 1 : Math.max(currentIndex - 1, 0);
        setInput(history[nextIndex]);
        return nextIndex;
      });
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHistoryIndex((currentIndex) => {
        if (currentIndex === null) return null;

        const nextIndex = currentIndex + 1;
        if (nextIndex >= history.length) {
          setInput("");
          return null;
        }

        setInput(history[nextIndex]);
        return nextIndex;
      });
    }
  };

  return (
    <section className="terminal-stack" aria-label="Interactive terminal and Ask Rudy output">
      <div className="terminal-card" onClick={() => inputRef.current?.focus()} aria-label="Interactive terminal">
        <div className="terminal-card__bar" aria-hidden="true">
          <span className="terminal-dot terminal-dot--red" />
          <span className="terminal-dot terminal-dot--yellow" />
          <span className="terminal-dot terminal-dot--green" />
          <span className="terminal-title">rudy@portfolio</span>
        </div>

        <div className="terminal-card__body" ref={scrollRef} aria-live="polite" aria-label="Terminal output">
          {lines.map((line, index) => (
            <div className="terminal-line" key={`${line.text}-${index}`}>
              {line.command && <span className="terminal-prompt" aria-hidden="true">-&gt;</span>}
              <span className={line.command ? "terminal-command" : ""}>{line.text}</span>
            </div>
          ))}
        </div>

        <form className="terminal-input" onSubmit={submit}>
          <span aria-hidden="true">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type a command..."
            aria-label="Terminal command"
            disabled={askLoading}
          />
        </form>
      </div>

      {isAskRudyUiEnabled && (
        <AskRudyModal
          open={askModalOpen}
          mode={askMode}
          draft={askDraft}
          result={askResult}
          loading={askLoading}
          error={askError}
          labVisible={labVisible}
          onClose={() => setAskModalOpen(false)}
          onModeChange={setAskMode}
          onDraftChange={setAskDraft}
          onLabToggle={() => setLabVisible((visible) => !visible)}
          onSubmit={(mode, value) => {
            void runAskRudy(mode, value);
          }}
        />
      )}
    </section>
  );
}

function AskRudyModal({
  open,
  mode,
  draft,
  result,
  loading,
  error,
  labVisible,
  onClose,
  onModeChange,
  onDraftChange,
  onLabToggle,
  onSubmit,
}: {
  open: boolean;
  mode: AskRudyMode;
  draft: string;
  result: AskRudyResult | null;
  loading: boolean;
  error: string | null;
  labVisible: boolean;
  onClose: () => void;
  onModeChange: (mode: AskRudyMode) => void;
  onDraftChange: (draft: string) => void;
  onLabToggle: () => void;
  onSubmit: (mode: AskRudyMode, value: string) => void;
}) {
  if (!open) return null;
  const modeMeta = askRudyModeMeta[mode];

  return (
    <div className="ask-rudy-modal" role="dialog" aria-modal="true" aria-labelledby="ask-rudy-title">
      <div className="ask-rudy-modal__backdrop" onClick={onClose} />
      <section className="ask-rudy-modal__panel">
        <header className="ask-rudy-modal__header">
          <div>
            <span className="ask-rudy-kicker">Local Lab</span>
            <h2 id="ask-rudy-title">Ask Rudy</h2>
            <p>Query the local resume/project knowledge base with Ollama-backed retrieval.</p>
          </div>
          <div className="ask-rudy-header-actions">
            <div className="ask-rudy-mode-badge" data-mode={mode} aria-label={`Current mode: ${modeMeta.label}`}>
              <span className="ask-rudy-mode-badge__glyph" aria-hidden="true">
                {modeMeta.glyph}
              </span>
              <div>
                <strong>{modeMeta.label}</strong>
                <small>{modeMeta.status}</small>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close Ask Rudy">
              Close
            </button>
          </div>
        </header>

        <div className="ask-rudy-compose">
          <div className="ask-rudy-mode-toggle" aria-label="Ask Rudy mode">
            <button
              type="button"
              className={mode === "ask" ? "is-active" : ""}
              onClick={() => onModeChange("ask")}
            >
              Coffee Chat
            </button>
            <button
              type="button"
              className={mode === "fit" ? "is-active" : ""}
              onClick={() => onModeChange("fit")}
            >
              Role Match
            </button>
          </div>

          <label className="ask-rudy-field">
            <span>{modeMeta.inputLabel}</span>
            <textarea
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder={
                mode === "fit"
                  ? "Paste or describe a role..."
                  : "Ask about Rudy's experience, projects, or work style..."
              }
            />
          </label>

          <div className="ask-rudy-compose__actions">
            <div className="ask-rudy-starter-group" aria-label="Starter prompts">
              <span>Try a starter</span>
              <div className="ask-rudy-starters">
                {askRudyStarterCommands.map((starter) => (
                  <button
                    key={starter.command}
                    type="button"
                    onClick={() => {
                      onModeChange(starter.mode);
                      onDraftChange(starter.prompt);
                    }}
                  >
                    {starter.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="ask-rudy-submit-row">
              <button type="button" disabled={!result || loading} onClick={onLabToggle}>
                {labVisible ? "Hide Lab" : "Show Lab"}
              </button>
              <button
                className="ask-rudy-submit"
                type="button"
                disabled={loading || !draft.trim()}
                onClick={() => onSubmit(mode, draft.trim())}
              >
                {loading ? "Thinking..." : mode === "fit" ? "Check Fit" : "Ask"}
              </button>
            </div>
          </div>
        </div>

        <AskRudyCards mode={mode} result={result} loading={loading} error={error} labVisible={labVisible} />
      </section>
    </div>
  );
}

function formatScore(score: number) {
  return Math.max(0, Math.min(1, score));
}

function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);

    if (boldMatch) {
      return <strong key={`${part}-${index}`}>{boldMatch[1]}</strong>;
    }

    return part;
  });
}

function AnswerText({ text }: { text: string }) {
  const lines = text.split("\n").map((line) => line.trim());
  const blocks = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line) continue;

    const unorderedItems = [];
    const orderedItems = [];
    let cursor = index;

    while (cursor < lines.length) {
      const unorderedMatch = lines[cursor].match(/^[-*]\s+(.+)$/);
      if (!unorderedMatch) break;
      unorderedItems.push(unorderedMatch[1]);
      cursor += 1;
    }

    if (unorderedItems.length) {
      blocks.push(
        <ul key={`ul-${index}`}>
          {unorderedItems.map((item) => (
            <li key={item}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
      index = cursor - 1;
      continue;
    }

    while (cursor < lines.length) {
      const orderedMatch = lines[cursor].match(/^\d+\.\s+(.+)$/);
      if (!orderedMatch) break;
      orderedItems.push(orderedMatch[1]);
      cursor += 1;
    }

    if (orderedItems.length) {
      blocks.push(
        <ol key={`ol-${index}`}>
          {orderedItems.map((item) => (
            <li key={item}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>,
      );
      index = cursor - 1;
      continue;
    }

    const headingMatch = line.match(/^\*\*(.+?)\*\*:?\s*$/);

    if (headingMatch) {
      blocks.push(<h4 key={`h4-${index}`}>{headingMatch[1]}</h4>);
      continue;
    }

    blocks.push(<p key={`p-${index}`}>{renderInlineMarkdown(line)}</p>);
  }

  return (
    <div className="ask-rudy-answer-body">
      {blocks}
    </div>
  );
}

function AskRudyCards({
  mode,
  result,
  loading,
  error,
  labVisible,
}: {
  mode: AskRudyMode;
  result: AskRudyResult | null;
  loading: boolean;
  error: string | null;
  labVisible: boolean;
}) {
  if (!result && !loading && !error) return null;

  return (
    <div className="ask-rudy-panel" aria-live="polite">
      {loading && (
        <article className="ask-rudy-card ask-rudy-card--loading" data-mode={mode}>
          <div className="ask-rudy-card__top">
            <span className="ask-rudy-kicker">{askRudyModeMeta[mode].label}</span>
            <span className="ask-rudy-spinner" aria-hidden="true" />
          </div>
          <h3>{mode === "fit" ? "Checking the match..." : "Brewing a grounded answer..."}</h3>
          <p>Embedding the input, searching the local index, and asking Ollama to answer from the best matches.</p>
          <div className="ask-rudy-loading-steps" aria-hidden="true">
            <span>embed</span>
            <span>retrieve</span>
            <span>compose</span>
          </div>
        </article>
      )}

      {error && (
        <article className="ask-rudy-card ask-rudy-card--error">
          <span className="ask-rudy-kicker">Local Lab</span>
          <h3>Ask Rudy is not available yet.</h3>
          <p>{error}</p>
        </article>
      )}

      {result && (
        <>
          <article className="ask-rudy-card ask-rudy-card--answer">
            <div className="ask-rudy-card__top">
              <span className="ask-rudy-kicker">{result.mode === "fit" ? "Role Match" : "Coffee Chat"}</span>
              <small>{result.elapsedMs}ms</small>
            </div>
            <h3>{result.mode === "fit" ? "Fit analysis" : "Answer"}</h3>
            <AnswerText text={result.answer} />
          </article>

          {labVisible && (
            <>
              <div className="ask-rudy-source-grid">
                {result.sources.slice(0, 3).map((source, index) => (
                  <article className="ask-rudy-card ask-rudy-source-card" key={source.id}>
                    <div className="ask-rudy-source-card__meta">
                      <div>
                        <span className="ask-rudy-kicker">Source {index + 1}</span>
                        <h3>{source.title}</h3>
                        <small>{source.path}</small>
                      </div>
                      <div className="ask-rudy-source-card__score">
                        <small>{source.score.toFixed(3)}</small>
                        <span className="ask-rudy-score" aria-label={`Similarity score ${source.score.toFixed(3)}`}>
                          <span style={{ width: `${formatScore(source.score) * 100}%` }} />
                        </span>
                      </div>
                    </div>
                    <p>{source.body}</p>
                    {source.tags?.length ? (
                      <div className="ask-rudy-mini-tags">
                        {source.tags.slice(0, 5).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>

              <article className="ask-rudy-card ask-rudy-lab-card">
                <div className="ask-rudy-card__top">
                  <span className="ask-rudy-kicker">Lab Trace</span>
                  <small>local</small>
                </div>
                <h3>Pipeline trace</h3>
                <div className="ask-rudy-steps">
                  <span>embed input</span>
                  <span>search vectors</span>
                  <span>build prompt</span>
                  <span>generate answer</span>
                </div>
                <dl>
                  <div>
                    <dt>Mode</dt>
                    <dd>{result.mode}</dd>
                  </div>
                  <div>
                    <dt>Sources</dt>
                    <dd>{result.sources.length}</dd>
                  </div>
                  <div>
                    <dt>Input</dt>
                    <dd>{result.input}</dd>
                  </div>
                </dl>
              </article>
            </>
          )}
        </>
      )}
    </div>
  );
}

function SectionHeading({
  label,
  title,
  accent,
}: {
  label: string;
  title: string;
  accent: string;
}) {
  return (
    <div className="section-heading">
      <p>{label}</p>
      <span />
      <h2>
        {title} <strong>{accent}</strong>
      </h2>
    </div>
  );
}

function ExternalArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section id="about" ref={ref} className={`section-shell about-grid reveal ${inView ? "visible" : ""}`}>
      <div>
        <SectionHeading label="About" title="Building systems" accent="developers trust." />
        <div className="copy-stack">
          <p>
            I am a Staff Software Engineer focused on applied AI platforms, ML infrastructure, and the
            developer experience around them. Most of my recent work sits at the intersection of AWS
            Bedrock AgentCore, Strands agents, FastAPI MCP services, LLM workflows, and the Python/Node.js
            SDKs that help teams turn prototypes into useful products.
          </p>
          <p>
            Before the AI platform work, I spent years shipping developer-facing products, component
            libraries, web applications, and infrastructure at DTN, Anaconda, IBM, and Bitfusion.
          </p>
          <p>
            The common thread is pretty simple: I like making complicated work feel approachable for the
            people who have to build on top of it.
          </p>
        </div>
      </div>

      <div className="stat-panel">
        <div className="stat-grid">
          {highlights.map((highlight) => (
            <div className="stat-card" key={highlight.label}>
              <strong>{highlight.value}</strong>
              <span>{highlight.label}</span>
            </div>
          ))}
        </div>
        <div className="callout-strip">
          <span className="callout-icon">RP</span>
          <div>
            <strong>Currently at DTN</strong>
            <p>
              Designing AI platform infrastructure, AWS Bedrock AgentCore workflows, Strands agents,
              FastAPI MCP services, and self-service paths for product teams.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const { ref, inView } = useInView();

  return (
    <section id="skills" ref={ref} className={`section-shell reveal ${inView ? "visible" : ""}`}>
      <SectionHeading label="Skills" title="Tools I use" accent="to build." />

      <div className="skill-grid">
        {skills.map((group) => (
          <article className="surface-card skill-card" key={group.title}>
            <div className="card-heading">
              <span>{group.icon}</span>
              <h3>{group.title}</h3>
            </div>
            <div className="tag-cloud">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  const { ref, inView } = useInView();

  return (
    <section id="experience" ref={ref} className={`section-shell reveal ${inView ? "visible" : ""}`}>
      <SectionHeading label="Experience" title="Roles that shaped" accent="the work." />

      <div className="timeline">
        {experience.map((item) => (
          <article className="timeline-item" key={`${item.company}-${item.role}`}>
            <div className={`timeline-dot ${item.current ? "is-current" : ""}`} />
            <div className="surface-card timeline-card">
              <div className="timeline-card__top">
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.company}</p>
                </div>
                <span>{item.period}</span>
              </div>
              <ul>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="tag-cloud">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { ref, inView } = useInView();

  return (
    <section id="projects" ref={ref} className={`section-shell reveal ${inView ? "visible" : ""}`}>
      <SectionHeading label="Projects" title="Proof through" accent="working projects." />

      <div className="project-grid">
        {projects.map((project) => (
          <article className="surface-card project-card" key={project.name}>
            <div className="project-card__meta">
              <span>{project.label}</span>
              <small>{project.status}</small>
            </div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="tag-cloud">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {project.href && (
              <a href={project.href} target="_blank" rel="noreferrer">
                Visit project
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function CurrentSection() {
  const { ref, inView } = useInView();

  return (
    <section id="current" className="current-band" ref={ref}>
      <div className={`section-shell reveal ${inView ? "visible" : ""}`}>
        <SectionHeading label="Current Focus" title="What I am building and learning" accent="now." />

        <div className="current-grid">
          {currentFocus.map((item) => (
            <article className="surface-card current-card" key={item.title}>
              <div className="current-card__status">
                <span />
                {item.status}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="tag-cloud">
                {item.stack.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { ref, inView } = useInView();

  return (
    <section id="contact" ref={ref} className={`section-shell contact-grid reveal ${inView ? "visible" : ""}`}>
      <div>
        <SectionHeading label="Contact" title="Start the right" accent="conversation." />
        <p className="contact-copy">
          Want to talk applied AI platforms, developer tooling, product engineering, or a role where those
          overlap? LinkedIn is the best place to start. GitHub has more of the technical trail, and email is
          there when direct makes more sense.
        </p>
      </div>

      <div className="contact-card-grid">
        {contactLinks.map((link) => (
          <a
            className="surface-card contact-card"
            href={link.href}
            key={link.title}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
          >
            <span>{link.title}</span>
            <strong>
              {link.label}
              <ExternalArrow />
            </strong>
            <p>{link.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(motionQuery.matches);

    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);

    return () => motionQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setCharacterIndex(roles[roleIndex].length);
      setDeleting(false);
      return;
    }

    const target = roles[roleIndex];

    if (!deleting && characterIndex < target.length) {
      const timer = window.setTimeout(() => setCharacterIndex((index) => index + 1), 56);
      return () => window.clearTimeout(timer);
    }

    if (!deleting && characterIndex === target.length) {
      const timer = window.setTimeout(() => setDeleting(true), 1900);
      return () => window.clearTimeout(timer);
    }

    if (deleting && characterIndex > 0) {
      const timer = window.setTimeout(() => setCharacterIndex((index) => index - 1), 28);
      return () => window.clearTimeout(timer);
    }

    if (deleting && characterIndex === 0) {
      setDeleting(false);
      setRoleIndex((index) => (index + 1) % roles.length);
    }
  }, [characterIndex, deleting, reduceMotion, roleIndex]);

  return (
    <section id="top" className="hero-shell">
      <div className="hero-content">
        <div className="status-pill">
          <span />
          Available for the right opportunity
        </div>
        <p className="eyebrow">howdy, i&apos;m</p>
        <h1>Rudy Pena</h1>
        <p className="role-line">
          {roles[roleIndex].slice(0, characterIndex)}
          {!reduceMotion && <span className="cursor" aria-hidden="true" />}
        </p>
        <p className="hero-copy">
          Staff Software Engineer focused on applied AI systems and ML platform infrastructure.
          At DTN, I build secure workflows with AWS Bedrock AgentCore, Strands agents,
          and FastAPI MCP services. I use Python and Node.js CLI/SDKs to help engineers move
          from prototype to customer-ready agents faster.
        </p>
        <div className="hero-actions">
          {isAskRudyUiEnabled && (
            <button
              className="primary-action"
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("ask-rudy:open", { detail: { mode: "ask" } }));
              }}
            >
              Ask Rudy
            </button>
          )}
          <a className={isAskRudyUiEnabled ? "secondary-action" : "primary-action"} href="#projects">
            View Projects
          </a>
          <a className="secondary-action" href="/Rudy_Pena_Resume.pdf" target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </div>

      <div className="terminal-wrap">
        <p>interactive terminal - try it</p>
        <Terminal />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <CurrentSection />
        <ContactSection />
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Rudy Pena</span>
        <span>Built with Next.js and a suspiciously fun terminal.</span>
      </footer>
    </>
  );
}
