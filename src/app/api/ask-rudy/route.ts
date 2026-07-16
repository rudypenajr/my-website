import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AskRudyMode = "ask" | "fit";

function isLocalLabEnabled() {
  return process.env.ASK_RUDY_LOCAL_ENABLED === "true" && process.env.NODE_ENV !== "production";
}

function isProductionAskRudyEnabled() {
  return process.env.ASK_RUDY_PROD_ENABLED === "true";
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const localLabEnabled = isLocalLabEnabled();
  const productionEnabled = isProductionAskRudyEnabled();

  const body = await request.json().catch(() => null);
  const input = typeof body?.input === "string" ? body.input.trim() : "";
  const mode: AskRudyMode = body?.mode === "fit" ? "fit" : "ask";

  if (!localLabEnabled && !productionEnabled) {
    return jsonError(
      "Ask Rudy is disabled. Enable ASK_RUDY_LOCAL_ENABLED=true for local Ollama development or ASK_RUDY_PROD_ENABLED=true for the guarded production route.",
      403,
    );
  }

  if (!input) return jsonError("Ask Rudy needs a question or role description.", 400);

  const maxInputLength = mode === "fit" ? 4000 : 800;
  if (input.length > maxInputLength) {
    return jsonError(`Ask Rudy input is too long for ${mode === "fit" ? "Role Match" : "Coffee Chat"} mode.`, 400);
  }

  const startedAt = Date.now();

  try {
    // The local RAG scripts live outside src because they are also used by npm scripts.
    // @ts-ignore - This is a local Node-only .mjs module used by the dev-only route.
    const { runAskRudyQuery } = await import("../../../../scripts/ask-rudy/run-query.mjs");

    let result;
    let guardrails = null;

    if (productionEnabled) {
      // @ts-ignore - Node-only production guardrail helper shared with scripts.
      const { reserveAskRudyUsage } = await import("../../../../scripts/ask-rudy/guardrails.mjs");
      const guardrailResult: any = await reserveAskRudyUsage({ request });
      guardrails = guardrailResult;

      if (!guardrailResult.allowed) {
        return NextResponse.json(
          {
            error: guardrailResult.message,
            reason: guardrailResult.reason,
          },
          { status: guardrailResult.status },
        );
      }

      result = await runAskRudyQuery({
        input,
        mode,
        modelProviderName: "cloudflare",
        retrievalProviderName: "upstash-vector",
      });
    } else {
      result = await runAskRudyQuery({ input, mode });
    }

    return NextResponse.json({
      mode,
      input,
      answer: result.answer,
      elapsedMs: Date.now() - startedAt,
      providers: result.providers,
      guardrails,
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
