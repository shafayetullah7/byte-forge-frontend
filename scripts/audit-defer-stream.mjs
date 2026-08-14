#!/usr/bin/env node
/**
 * Audits route-level createAsync() calls for explicit deferStream choices.
 *
 * Pass: deferStream: true | initialValue | // deferStream: intentional | allowlisted file
 *
 * Usage: node scripts/audit-defer-stream.mjs
 * Exit 1 if any route createAsync lacks an explicit choice.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = "src/routes";
const ALLOWLIST = new Set([
  "PlantReviews.tsx",
  "PlantWizardPage.tsx",
  "PlantSectionFieldEditor.tsx",
]);

function walk(dir, files = []) {
  for (const ent of readdirSync(dir)) {
    const p = join(dir, ent);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (/\.(tsx|ts)$/.test(ent)) files.push(p);
  }
  return files;
}

function auditFile(file) {
  const content = readFileSync(file, "utf8");
  if (!content.includes("createAsync")) return [];

  if (ALLOWLIST.has(basename(file))) return [];
  if (/\/\/\s*deferStream:\s*intentional/.test(content)) return [];

  const issues = [];
  const re = /createAsync\s*\(/g;
  let match;

  while ((match = re.exec(content)) !== null) {
    const start = match.index;
    const snippet = content.slice(start, start + 600);
    const hasDefer = /deferStream\s*:\s*true/.test(snippet);
    const hasInitial = /initialValue\s*:/.test(snippet);

    if (!hasDefer && !hasInitial) {
      const line = content.slice(0, start).split("\n").length;
      const lineText = content.split("\n")[line - 1]?.trim() ?? "";
      issues.push({ file, line, text: lineText });
    }
  }

  return issues;
}

const allIssues = walk(ROOT).flatMap(auditFile);

if (allIssues.length === 0) {
  console.log("✓ All route createAsync calls have an explicit deferStream or initialValue choice.");
  process.exit(0);
}

console.error("Route createAsync calls missing deferStream: true or initialValue:\n");
for (const issue of allIssues) {
  console.error(`  ${issue.file}:${issue.line}  ${issue.text}`);
}
console.error(`\n${allIssues.length} issue(s). Add deferStream, initialValue, allowlist entry, or // deferStream: intentional`);
process.exit(1);
