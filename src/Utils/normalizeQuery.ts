import { ParsedQs } from "qs";

export function normalizeQuery(query: ParsedQs): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in query) {
    const value = query[key];
    if (typeof value === "string") result[key] = value;
    else if (Array.isArray(value) && typeof value[0] === "string") result[key] = value[0];
  }
  return result;
}
