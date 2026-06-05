#!/usr/bin/env node
/**
 * Lint-on-edit hook — brings the deterministic Layer 2 into the AI loop.
 *
 * Works in BOTH Cursor (`afterFileEdit`) and Claude Code (`PostToolUse` with
 * matcher `Edit|Write`). Reads the edited file path from stdin (payload shape
 * differs per tool) and runs ESLint on just that file.
 *
 * This is a NOTIFICATION hook: it always exits 0 so it never blocks the agent —
 * it surfaces lint problems on stderr so the agent sees and fixes them.
 */

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function extractPath(payload) {
  if (!payload || typeof payload !== "object") return "";
  // Cursor: { file_path }, Claude: { tool_input: { file_path } }
  return payload.file_path ?? payload.tool_input?.file_path ?? "";
}

const LINTABLE = /\.(ts|tsx|js|jsx|mjs|cjs)$/;

function main() {
  const raw = readStdin();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const filePath = String(extractPath(payload) || "");
  if (!filePath || !LINTABLE.test(filePath)) process.exit(0);

  const isWin = process.platform === "win32";
  const result = spawnSync(
    isWin ? "npx.cmd" : "npx",
    ["eslint", "--no-error-on-unmatched-pattern", filePath],
    { encoding: "utf8" },
  );

  if (result.status && result.status !== 0) {
    process.stderr.write(
      `lint-changed: ESLint problems in ${filePath}:\n${result.stdout || ""}${result.stderr || ""}\n`,
    );
  }
  process.exit(0); // never block on a notification hook
}

main();
