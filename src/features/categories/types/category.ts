export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryApiResponse = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export function normalizeCategory(category: CategoryApiResponse): Category {
  return {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt ?? "",
    updatedAt: category.updatedAt ?? "",
  };
}
