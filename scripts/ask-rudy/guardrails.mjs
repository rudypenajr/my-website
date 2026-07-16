import crypto from "node:crypto";
import {
  guardrailConfig,
  prodCloudflareEnabled,
  upstashRedisRestToken,
  upstashRedisRestUrl,
} from "./config.mjs";

// Production guardrails sit in front of hosted model calls.
// If Redis is missing or a safety switch is off, the public API fails closed
// before Cloudflare Workers AI can spend any money.

const REDIS_DAILY_TTL_SECONDS = 60 * 60 * 24 * 2;
const REDIS_MONTHLY_TTL_SECONDS = 60 * 60 * 24 * 45;

function todayParts() {
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const month = day.slice(0, 7);
  return { day, month };
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  return request.headers.get("x-real-ip") ?? "unknown";
}

function hashIp(ip) {
  return crypto
    .createHash("sha256")
    .update(`${guardrailConfig.ipHashSalt}:${ip}`)
    .digest("hex")
    .slice(0, 24);
}

function isFalseySwitch(value) {
  return value === "false" || value === "0" || value === "off";
}

function redisEndpoint() {
  return upstashRedisRestUrl?.replace(/\/$/, "");
}

async function redisCommand(command) {
  if (!upstashRedisRestUrl || !upstashRedisRestToken) {
    throw new Error(
      "Upstash Redis guardrails need UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN.",
    );
  }

  const response = await fetch(redisEndpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${upstashRedisRestToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.error) {
    throw new Error(`Upstash Redis command failed (${response.status}): ${JSON.stringify(data ?? {})}`);
  }

  return data?.result;
}

async function readSwitch(key) {
  const value = await redisCommand(["GET", key]);
  return typeof value === "string" ? value.toLowerCase() : value;
}

async function incrementCounter(key, ttlSeconds) {
  const count = Number(await redisCommand(["INCR", key]));
  if (count === 1) {
    await redisCommand(["EXPIRE", key, ttlSeconds]);
  }
  return count;
}

function blocked(reason, message, status = 429) {
  return {
    allowed: false,
    reason,
    status,
    message,
  };
}

export async function reserveAskRudyUsage({ request }) {
  if (!upstashRedisRestUrl || !upstashRedisRestToken) {
    return blocked(
      "redis-misconfigured",
      "Ask Rudy production guardrails are not configured yet.",
      503,
    );
  }

  if (!prodCloudflareEnabled) {
    return blocked("provider-disabled", "Ask Rudy hosted model calls are currently disabled.", 503);
  }

  try {
    const featureSwitch = await readSwitch("ask-rudy:enabled");
    if (isFalseySwitch(featureSwitch)) {
      return blocked("feature-disabled", "Ask Rudy is temporarily disabled.", 503);
    }

    const cloudflareSwitch = await readSwitch("ask-rudy:provider:cloudflare:enabled");
    if (isFalseySwitch(cloudflareSwitch)) {
      return blocked("provider-disabled", "Ask Rudy hosted model calls are currently disabled.", 503);
    }

    const { day, month } = todayParts();
    const ipHash = hashIp(getClientIp(request));
    const dailyKey = `ask-rudy:global:daily_calls:${day}`;
    const monthlyKey = `ask-rudy:global:monthly_calls:${month}`;
    const ipDailyKey = `ask-rudy:ip:${ipHash}:daily_calls:${day}`;

    const [dailyCount, monthlyCount, ipDailyCount] = await Promise.all([
      incrementCounter(dailyKey, REDIS_DAILY_TTL_SECONDS),
      incrementCounter(monthlyKey, REDIS_MONTHLY_TTL_SECONDS),
      incrementCounter(ipDailyKey, REDIS_DAILY_TTL_SECONDS),
    ]);

    if (dailyCount > guardrailConfig.globalDailyLimit) {
      return blocked("global-daily-limit", "Ask Rudy hit today's global safety cap. Try again tomorrow.");
    }

    if (monthlyCount > guardrailConfig.globalMonthlyLimit) {
      return blocked("global-monthly-limit", "Ask Rudy hit this month's global safety cap.");
    }

    if (ipDailyCount > guardrailConfig.ipDailyLimit) {
      return blocked("ip-daily-limit", "Ask Rudy hit the per-visitor daily safety cap. Try again tomorrow.");
    }

    return {
      allowed: true,
      counters: {
        dailyCount,
        monthlyCount,
        ipDailyCount,
      },
      limits: {
        globalDailyLimit: guardrailConfig.globalDailyLimit,
        globalMonthlyLimit: guardrailConfig.globalMonthlyLimit,
        ipDailyLimit: guardrailConfig.ipDailyLimit,
      },
    };
  } catch (error) {
    return blocked(
      "guardrail-check-failed",
      "Ask Rudy guardrails could not be verified, so the hosted model call was skipped.",
      503,
    );
  }
}
