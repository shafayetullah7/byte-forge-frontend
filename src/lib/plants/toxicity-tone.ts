export type ToxicityTone = "warning" | "safe" | "info";

const SAFE_PATTERN =
  /(non[- ]?toxic|not toxic|pet[- ]?safe|safe for (?:pets|cats|dogs|children)|poison[- ]?free|অবিষাক্ত|বিষাক্ত নয়|বিষাক্ত না|পোষা প্রাণীর জন্য নিরাপদ)/i;

const TOXIC_PATTERN =
  /\b(toxic|poison(?:ous)?|harmful|dangerous|venomous)\b|বিষাক্ত|বিষক্রিয়া/i;

function stripSafePhrases(value: string): string {
  return value
    .replace(/non[- ]?toxic/gi, "")
    .replace(/not toxic/gi, "")
    .replace(/poison[- ]?free/gi, "")
    .replace(/অবিষাক্ত/g, "")
    .replace(/বিষাক্ত নয়/g, "")
    .replace(/বিষাক্ত না/g, "");
}

/** Classify free-text toxicity notes for public PDP styling. Toxic beats safe when both match. */
export function getToxicityTone(text: string | null | undefined): ToxicityTone {
  const value = text?.trim() ?? "";
  if (!value) return "info";

  const stripped = stripSafePhrases(value);
  if (TOXIC_PATTERN.test(stripped)) return "warning";
  if (SAFE_PATTERN.test(value)) return "safe";
  return "info";
}
