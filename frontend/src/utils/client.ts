import { Category } from "@/models";

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${process.env.BACKEND_URL}/categories`);
  const responseData = await response.json();
  return responseData.data;
};

export const fetchCategoryMeasurements = async (
  categoryId: string
): Promise<Category> => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/stats/${categoryId}`
  );
  const responseData = await response.json();

  return responseData.data.category;
};
