import fs from "node:fs/promises";
import path from "node:path";

import { chunkConfig, knowledgeDir, rootDir } from "./config.mjs";

// This file owns the "documents -> chunks" step of RAG.
// Ollama does not read folders or decide chunk boundaries for us; we turn the
// markdown knowledge base into small, metadata-rich records that can be embedded.

// Recursively find every markdown file under knowledge/.
async function listMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(fullPath);
      if (entry.isFile() && entry.name.endsWith(".md")) return [fullPath];
      return [];
    }),
  );

  return files.flat().sort();
}

// Pull simple YAML-ish metadata out of the top of a markdown file.
// We only need basic key: value pairs here, so we avoid adding a YAML dependency.
function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { metadata: {}, body: raw.trim() };

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { metadata: {}, body: raw.trim() };

  const frontmatter = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();
  const metadata = {};

  for (const line of frontmatter.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    metadata[key] = value;
  }

  return { metadata, body };
}

// Use the first markdown H1 as a fallback title when frontmatter does not provide one.
function titleFromBody(body, fallback) {
  const heading = body.match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim() ?? fallback;
}

// Split markdown around headings first. Heading-based chunks keep related facts
// together better than splitting blindly every N characters.
function splitIntoSections(body) {
  const lines = body.split("\n");
  const sections = [];
  let current = [];

  for (const line of lines) {
    if (/^#{1,3}\s+/.test(line) && current.length) {
      sections.push(current.join("\n").trim());
      current = [line];
      continue;
    }

    current.push(line);
  }

  if (current.length) sections.push(current.join("\n").trim());
  return sections.filter(Boolean);
}

// If a heading section is still too large, split it down by paragraph and add
// overlap for very long paragraphs so nearby context is not completely lost.
function splitLongSection(section, maxCharacters, overlapCharacters) {
  if (section.length <= maxCharacters) return [section];

  const paragraphs = section.split(/\n{2,}/).filter(Boolean);
  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= maxCharacters) {
      current = candidate;
      continue;
    }

    if (current) chunks.push(current);

    if (paragraph.length <= maxCharacters) {
      current = paragraph;
      continue;
    }

    for (let start = 0; start < paragraph.length; start += maxCharacters - overlapCharacters) {
      chunks.push(paragraph.slice(start, start + maxCharacters));
    }
    current = "";
  }

  if (current) chunks.push(current);
  return chunks;
}

// Frontmatter stores tags as a comma-separated string; chunks use an array.
function normalizeTags(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

// Public entry point for indexing. It returns plain text chunks with metadata.
// Embeddings are added later by build-index.mjs via Ollama.
export async function loadKnowledgeChunks() {
  const files = await listMarkdownFiles(knowledgeDir);
  const chunks = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const { metadata, body } = parseFrontmatter(raw);
    const relativePath = path.relative(rootDir, filePath);
    const title = metadata.title ?? titleFromBody(body, path.basename(filePath, ".md"));
    const source = metadata.source ?? "knowledge";
    const tags = normalizeTags(metadata.tags);
    const sections = splitIntoSections(body);

    sections.flatMap((section) =>
      splitLongSection(section, chunkConfig.maxCharacters, chunkConfig.overlapCharacters),
    ).forEach((chunkBody, index) => {
      chunks.push({
        id: `${relativePath}#chunk-${index + 1}`,
        source,
        title,
        body: chunkBody,
        tags,
        path: relativePath,
        visibility: metadata.visibility ?? "public",
      });
    });
  }

  return chunks;
}
