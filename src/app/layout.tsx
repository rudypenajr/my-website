import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rudypenajr.com"),
  title: "Rudy Pena | Staff Software Engineer",
  description:
    "Staff Software Engineer focused on applied AI systems, ML platform infrastructure, Strands agents, FastAPI MCP services, and Python/Node.js CLI SDK development.",
  keywords: [
    "Rudy Pena",
    "Staff Software Engineer",
    "AI Platform Engineer",
    "Applied AI",
    "AWS Bedrock AgentCore",
    "Strands Agents",
    "FastAPI MCP",
    "Python",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Rudy Pena", url: "https://www.rudypenajr.com" }],
  creator: "Rudy Pena",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Rudy Pena | Staff Software Engineer",
    description:
      "Applied AI systems, AWS Bedrock AgentCore, Strands agents, FastAPI MCP services, Next.js, React, Python, and Go.",
    url: "https://www.rudypenajr.com",
    siteName: "rudypenajr.com",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rudy Pena - Staff Software Engineer focused on applied AI platforms",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rudy Pena | Staff Software Engineer",
    description:
      "Applied AI systems, AWS Bedrock AgentCore, Strands agents, FastAPI MCP services, Next.js, React, Python, and Go.",
    images: ["/opengraph-image"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rudy Pena",
  url: "https://www.rudypenajr.com",
  jobTitle: "Staff Software Engineer",
  sameAs: [
    "https://www.linkedin.com/in/rudypenajr",
    "https://github.com/rudypenajr",
    "https://x.com/rudypenajr",
  ],
  knowsAbout: [
    "Applied AI platforms",
    "AWS Bedrock AgentCore",
    "Strands agents",
    "FastAPI MCP services",
    "Python SDKs",
    "Next.js",
    "React",
    "TypeScript",
  ],
};

const themeScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("rp-theme");
    const theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
