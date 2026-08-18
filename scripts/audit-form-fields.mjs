#!/usr/bin/env node
/**
 * Regression checks for form-field visual conventions.
 *
 * Fails on:
 * - h5/h6 used as a field <label>
 * - terracotta focus rings on text/select controls (not buttons/checkboxes)
 *
 * Usage: node scripts/audit-form-fields.mjs
 *
 * @see docs/FORM_FIELD_UNIFORMITY_PLAN.md
 * @see .agent/workflows/form-fields.md
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src/routes", "src/components"];
const SKIP_DIRS = new Set(["node_modules"]);

function walk(dir, files = []) {
  for (const ent of readdirSync(dir)) {
    if (SKIP_DIRS.has(ent)) continue;
    const p = join(dir, ent);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (/\.(tsx|jsx)$/.test(ent)) files.push(p);
  }
  return files;
}

function isExemptTerracotta(lines, index) {
  const window = lines.slice(Math.max(0, index - 8), index + 1).join("\n");
  if (/type=["'](checkbox|radio)["']/.test(window)) return true;
  if (/<(Button|button)\b/.test(window)) return true;
  if (/variant=["'](accent|primary|secondary)["']/.test(window)) return true;
  return false;
}

function auditFile(file) {
  const lines = readFileSync(file, "utf8").split("\n");
  const issues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const n = i + 1;

    if (/<label\b/.test(line) && /\bh[56]\b/.test(line)) {
      issues.push({ file, line: n, kind: "h6-label", text: line.trim() });
    }

    if (
      (/focus:border-terracotta/.test(line) || /focus:ring-terracotta/.test(line)) &&
      !isExemptTerracotta(lines, i)
    ) {
      issues.push({ file, line: n, kind: "terracotta-focus", text: line.trim() });
    }
  }

  return issues;
}

const files = ROOTS.flatMap((root) => walk(root));
const allIssues = files.flatMap(auditFile);

if (allIssues.length === 0) {
  console.log("✓ No h6/h5 field labels or terracotta text-control focus rings.");
  process.exit(0);
}

const labels = {
  "h6-label": "h5/h6 on <label>",
  "terracotta-focus": "terracotta focus on a text/select control",
};

console.error("Form field visual audit failed:\n");
for (const issue of allIssues) {
  console.error(`  ${issue.file}:${issue.line}  [${labels[issue.kind]}]  ${issue.text}`);
}
console.error(`\n${allIssues.length} issue(s). See .agent/workflows/form-fields.md`);
process.exit(1);
