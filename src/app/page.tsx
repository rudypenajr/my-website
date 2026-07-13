"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const roles = [
  "Staff Software Engineer",
  "AI Platform Engineer",
  "LLM Systems Builder",
  "Python AI Tooling",
];

const commands: Record<string, string> = {
  help:
    "Commands: about, skills, stack, work, projects, current, contact, resume, clear\nNavigation: open about, open skills, open experience, open projects, open current, open contact\nAliases: ls, pwd, now, shiplog, cat resume",
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
    { text: 'rudy@portfolio ~ % type "help" to explore' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const normalizeCommand = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
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

    return commands[command] ?? `not found: ${rawCommand}. try "help".`;
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rawCommand = input.trim();
    if (!rawCommand) return;

    const normalizedCommand = normalizeCommand(rawCommand);
    setHistory((currentHistory) => [...currentHistory, rawCommand]);
    setHistoryIndex(null);

    if (normalizedCommand === "clear") {
      setLines([{ text: "terminal cleared. try help when you want the map back." }]);
      setInput("");
      return;
    }

    setLines((current) => [
      ...current,
      { text: rawCommand, command: true },
      { text: resolveCommand(rawCommand) },
    ]);
    setInput("");
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
    <section className="terminal-card" onClick={() => inputRef.current?.focus()} aria-label="Interactive terminal">
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
        />
      </form>
    </section>
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
          <a className="primary-action" href="#projects">
            View Projects
          </a>
          <a className="secondary-action" href="#contact">
            Get in Touch
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
