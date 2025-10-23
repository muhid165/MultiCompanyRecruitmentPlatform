
interface FilterOptions {
  model: any;
  query: Record<string, any>;
}

export const filterData = async ({ model, query }: FilterOptions) => {
  const where: any = {};

  // dynamically build filter conditions
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      where[key] = value;
    }
  }

  const data = await model.findMany({ where });
  return data;
};
