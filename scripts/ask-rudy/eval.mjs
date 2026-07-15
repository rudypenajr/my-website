#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

import { runAskRudyQuery } from "./run-query.mjs";

// CLI command: npm run ask-rudy:eval
// This runner does not grade automatically yet. It gives us a repeatable set of
// prompts, answers, sources, and human-readable checks to inspect after changes.

const defaultEvalPath = path.join(process.cwd(), "evals", "ask-rudy-cases.json");

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    evalPath: defaultEvalPath,
    only: null,
  };

  while (args.length) {
    const arg = args.shift();
    if (arg === "--file") options.evalPath = path.resolve(args.shift() ?? defaultEvalPath);
    if (arg === "--only") options.only = args.shift() ?? null;
  }

  return options;
}

async function loadCases(evalPath) {
  const raw = await fs.readFile(evalPath, "utf8");
  return JSON.parse(raw);
}

function printSources(results) {
  for (const [index, result] of results.entries()) {
    console.log(
      `  ${index + 1}. ${result.title} (${result.path}) score=${result.score.toFixed(3)} id=${result.id}`,
    );
  }
}

function printChecks(checks = []) {
  if (!checks.length) return;

  console.log("\nHuman checks:");
  for (const check of checks) {
    console.log(`  - ${check}`);
  }
}

async function main() {
  const { evalPath, only } = parseArgs(process.argv.slice(2));
  const cases = (await loadCases(evalPath)).filter((testCase) => !only || testCase.id === only);

  if (!cases.length) {
    console.error(`No eval cases found${only ? ` for id "${only}"` : ""}.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Running ${cases.length} Ask Rudy eval case${cases.length === 1 ? "" : "s"}...`);

  for (const [index, testCase] of cases.entries()) {
    console.log("\n============================================================");
    console.log(`${index + 1}. ${testCase.id} (${testCase.mode})`);
    console.log("============================================================");
    console.log(`Input: ${testCase.input}`);

    const startedAt = Date.now();
    const result = await runAskRudyQuery({
      input: testCase.input,
      mode: testCase.mode,
    });
    const elapsedMs = Date.now() - startedAt;

    console.log(`\nAnswer (${elapsedMs}ms):\n${result.answer.trim()}`);
    console.log("\nSources:");
    printSources(result.results);
    printChecks(testCase.checks);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
