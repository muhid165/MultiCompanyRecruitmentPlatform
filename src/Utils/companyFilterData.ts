import prisma from "../Config/prisma";

interface FilterOptions {
  model: any; // e.g., prisma.department
  query: Record<string, any>; // req.query
  searchFields?: string[];
  defaultSortBy?: string;
  defaultOrder?: "asc" | "desc";
}

export const filterData = async ({
  model,
  query,
  searchFields = [],
  defaultSortBy = "createdAt",
  defaultOrder = "desc",
}: FilterOptions) => {
  const { sortBy, order, search, ...filters } = query;

  // Build dynamic "where" clause
  const where: any = {};

  // Handle direct filters from query params
  for (const key in filters) {
    const value = filters[key];

    if (value === undefined || value === null || value === "") continue;

    // Support comma-separated filters (e.g. ?status=active,pending)
    if (typeof value === "string" && value.includes(",")) {
      where[key] = { in: value.split(",") };
    } else {
      where[key] = value;
    }
  }

  // Handle search across multiple fields
  if (search && searchFields.length > 0) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    }));
  }

  const data = await model.findMany({
    where,
    orderBy: { [sortBy || defaultSortBy]: order || defaultOrder },
  });

  return {
    success: true,
    data,
  };
};
