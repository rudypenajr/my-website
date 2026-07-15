import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AskRudyMode = "ask" | "fit";

function isLocalLabEnabled() {
  return process.env.ASK_RUDY_LOCAL_ENABLED === "true" && process.env.NODE_ENV !== "production";
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  if (!isLocalLabEnabled()) {
    return jsonError(
      "Ask Rudy local lab is disabled. Set ASK_RUDY_LOCAL_ENABLED=true in local development to use the Ollama-backed route.",
      403,
    );
  }

  const body = await request.json().catch(() => null);
  const input = typeof body?.input === "string" ? body.input.trim() : "";
  const mode: AskRudyMode = body?.mode === "fit" ? "fit" : "ask";

  if (!input) return jsonError("Ask Rudy needs a question or role description.", 400);
  if (input.length > 4000) return jsonError("Ask Rudy input is too long for the local lab route.", 400);

  const startedAt = Date.now();

  try {
    // The local RAG scripts live outside src because they are also used by npm scripts.
    // @ts-ignore - This is a local Node-only .mjs module used by the dev-only route.
    const { runAskRudyQuery } = await import("../../../../scripts/ask-rudy/run-query.mjs");
    const result = await runAskRudyQuery({ input, mode });

    return NextResponse.json({
      mode,
      input,
      answer: result.answer,
      elapsedMs: Date.now() - startedAt,
      sources: result.results.map((source: any) => ({
        id: source.id,
        title: source.title,
        path: source.path,
        score: source.score,
        body: source.body,
        tags: source.tags,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ask Rudy failed.";
    return jsonError(message, 500);
  }
}
