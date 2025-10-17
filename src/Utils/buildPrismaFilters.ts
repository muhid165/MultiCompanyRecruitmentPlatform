export function buildPrismaFilters(
  query: Record<string, string>,
  schemaFields: Record<
    string,
    { type: "string" | "number" | "enum"; path?: string[]; enumValues?: string[] }
  >
) {
  const filters: Record<string, any> = {};

  for (const key in query) {
    const config = schemaFields[key];
    if (!config) continue;

    const rawValue = query[key];
    if (rawValue === undefined) continue;

    // Special case: "null" string â†’ actual null
    if (rawValue.toLowerCase() === "null") {
      if (config.path) {
        let current = filters;
        for (let i = 0; i < config.path.length - 1; i++) {
          const part = config.path[i];
          current[part] ??= {};
          current = current[part];
        }
        current[config.path[config.path.length - 1]] = null;
      } else {
        filters[key] = null;
      }
      continue;
    }

    let filterValue;
    switch (config.type) {
      case "string":
        filterValue = { contains: rawValue, mode: "insensitive" };
        break;
      case "number":
        const numberVal = Number(rawValue);
        if (!isNaN(numberVal)) filterValue = numberVal;
        break;
      case "enum":
        if (config.enumValues?.includes(rawValue)) filterValue = rawValue;
        break;
    }

    if (filterValue === undefined) continue;

    if (config.path) {
      // Nested filter, e.g., Category.name
      let current = filters;
      for (let i = 0; i < config.path.length - 1; i++) {
        const part = config.path[i];
        current[part] ??= {};
        current = current[part];
      }
      current[config.path[config.path.length - 1]] = filterValue;
    } else {
      filters[key] = filterValue;
    }
  }

  return filters;
}
