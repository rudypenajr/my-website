#!/usr/bin/env node
import { runAskRudyQuery } from "./run-query.mjs";

// CLI commands:
//   npm run ask-rudy:ask -- "What kind of engineer is Rudy?"
//   npm run ask-rudy:fit -- "Paste a role description"
//
// This is the online/question-answering step:
// 1. embed the user's question with the selected model provider
// 2. search through the selected retrieval provider
// 3. build a grounded prompt from the best chunks
// 4. ask the selected model provider for the final answer
// 5. print the sources we used

// Read simple CLI flags and treat the rest of the command as the user input.
function parseArgs(argv) {
  const args = [...argv];
  let mode = "ask";

  if (args[0] === "--mode") {
    mode = args[1] ?? mode;
    args.splice(0, 2);
  }

  if (args[0] === "--fit") {
    mode = "fit";
    args.shift();
  }

  return {
    mode,
    input: args.join(" ").trim(),
  };
}

// Show the retrieved chunks after the answer so you can inspect whether retrieval
// found the right evidence.
function printSources(results) {
  console.log("\nSources:");
  for (const [index, result] of results.entries()) {
    console.log(
      `${index + 1}. ${result.title} (${result.path}) score=${result.score.toFixed(3)} id=${result.id}`,
    );
  }
}

async function main() {
  const { mode, input } = parseArgs(process.argv.slice(2));

  if (!input) {
    console.error('Usage: npm run ask-rudy:ask -- "What kind of engineer is Rudy?"');
    console.error('   or: npm run ask-rudy:fit -- "Paste a role description here"');
    process.exitCode = 1;
    return;
  }

  const { answer, results } = await runAskRudyQuery({ input, mode });
  console.log(`\n${answer.trim()}`);
  printSources(results);
}

// Keep CLI failures readable instead of showing a huge stack trace for setup issues.
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
