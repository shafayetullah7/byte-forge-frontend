import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function extractKeys(obj, prefix = '') {
  const keys = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

function parseDictFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  content = content.replace(/^export const dict = /, '').replace(/;\s*$/, '');
  content = content.replace(/\(\w+:\s*\{[^}]*\}\)\s*=>/g, '(p) =>');
  try {
    return new Function(`"use strict"; return (${content})`)();
  } catch (e) {
    console.error(`Failed to parse ${filePath}:`, e.message);
    process.exit(1);
  }
}

const enDict = parseDictFile(join(__dirname, 'src/i18n/en.ts'));
const bnDict = parseDictFile(join(__dirname, 'src/i18n/bn.ts'));

const enKeys = new Set(extractKeys(enDict));
const bnKeys = new Set(extractKeys(bnDict));

const onlyInEn = [...enKeys].filter(k => !bnKeys.has(k)).sort();
const onlyInBn = [...bnKeys].filter(k => !enKeys.has(k)).sort();

console.log('='.repeat(70));
console.log('  BYTEFORGE i18n KEY COMPARISON REPORT');
console.log('='.repeat(70));
console.log();
console.log(`  en.ts total keys: ${enKeys.size}`);
console.log(`  bn.ts total keys: ${bnKeys.size}`);
console.log(`  Shared keys:      ${[...enKeys].filter(k => bnKeys.has(k)).length}`);
console.log();
console.log('-'.repeat(70));

if (onlyInEn.length > 0) {
  console.log(`\n  Keys in en.ts but NOT in bn.ts (${onlyInEn.length}):`);
  console.log('-'.repeat(70));
  for (const key of onlyInEn) {
    console.log(`  ❌ ${key}`);
  }
} else {
  console.log('\n  ✅ No missing keys in bn.ts');
}

console.log();
console.log('-'.repeat(70));

if (onlyInBn.length > 0) {
  console.log(`\n  Keys in bn.ts but NOT in en.ts (${onlyInBn.length}):`);
  console.log('-'.repeat(70));
  for (const key of onlyInBn) {
    console.log(`  ⚠️  ${key}`);
  }
} else {
  console.log('\n  ✅ No extra keys in bn.ts');
}

console.log();
console.log('='.repeat(70));
console.log(`  SUMMARY: ${onlyInEn.length} missing in bn, ${onlyInBn.length} extra in bn`);
console.log('='.repeat(70));
