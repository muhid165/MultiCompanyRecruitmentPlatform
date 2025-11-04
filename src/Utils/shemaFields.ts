export type SchemaField =
  | { type: "string"; path: string[] }
  | { type: "number"; path: string[] }
  | { type: "boolean"; path: string[] }
  | { type: "rangeMin"; path: string[] }
  | { type: "rangeMax"; path: string[] }
  | { type: "year"; path: string[] }
  | { type: "json"; path: string[] }
  | { type: "array"; path: string[] };

