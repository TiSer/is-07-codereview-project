#!/usr/bin/env node
/**
 * Consolidate multiple local review passes into one deduplicated, ranked list.
 *
 * Local AI review is non-deterministic — one pass misses things. Run the review
 * a few times, dump each pass as `review-pass-*.json` (array of findings), then:
 *
 *   npm run review:consolidate
 *
 * Each finding: { severity: "normal"|"nit"|"pre_existing", file, line, title }
 *
 * Outputs:
 *   - review-findings.json  → deduped, ranked array
 *   - review-summary.json   → { normal, nit, pre_existing }  (for CI gating)
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const SEVERITY_ORDER = { normal: 0, nit: 1, pre_existing: 2 };

function loadPasses() {
  const files = readdirSync(process.cwd()).filter(
    (f) => /^review-pass-.*\.json$/.test(f),
  );
  if (files.length === 0) {
    console.error(
      "No review-pass-*.json files found. Save each review pass first.",
    );
    process.exit(1);
  }

  const findings = [];
  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      console.error(`Skipping ${file}: invalid JSON`);
      continue;
    }
    const items = Array.isArray(parsed) ? parsed : (parsed.findings ?? []);
    for (const item of items) findings.push(item);
  }
  return findings;
}

function key(f) {
  return `${f.file ?? "?"}:${f.line ?? "?"}:${(f.title ?? "").trim().toLowerCase()}`;
}

function consolidate(findings) {
  const byKey = new Map();
  for (const f of findings) {
    const k = key(f);
    const existing = byKey.get(k);
    if (!existing) {
      byKey.set(k, { ...f, seenIn: 1 });
    } else {
      existing.seenIn += 1;
      // Keep the most severe label if passes disagree.
      if (
        (SEVERITY_ORDER[f.severity] ?? 9) <
        (SEVERITY_ORDER[existing.severity] ?? 9)
      ) {
        existing.severity = f.severity;
      }
    }
  }

  return [...byKey.values()].sort((a, b) => {
    const sev =
      (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9);
    if (sev !== 0) return sev;
    return b.seenIn - a.seenIn; // more agreement first
  });
}

function main() {
  const ranked = consolidate(loadPasses());

  const summary = { normal: 0, nit: 0, pre_existing: 0 };
  for (const f of ranked) {
    if (f.severity in summary) summary[f.severity] += 1;
  }

  writeFileSync("review-findings.json", JSON.stringify(ranked, null, 2));
  writeFileSync("review-summary.json", JSON.stringify(summary, null, 2));

  console.log(
    `Tally — normal ${summary.normal} · nit ${summary.nit} · pre_existing ${summary.pre_existing}`,
  );
  console.log(`Wrote review-findings.json (${ranked.length}) + review-summary.json`);
  if (summary.normal > 0) {
    console.log("⚠ Blocking findings present (normal > 0).");
  }
}

main();
