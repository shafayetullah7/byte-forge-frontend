import type { ApiError } from "./types";

export function readApiErrorCode(response: ApiError["response"]): string | undefined {
  const nested = response?.error;
  if (typeof nested === "string") {
    return nested;
  }
  return nested?.code;
}
