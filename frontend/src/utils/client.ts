import { Category } from '@/models';

const API_URL = process.env.BACKEND_URL;

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}categories`);
  const responseData = await response.json();
  return responseData.data;
};

export const fetchCategoryMeasurements = async (
  categoryId: string
): Promise<Category> => {
  const response = await fetch(`${API_URL}stats/${categoryId}`);
  const responseData = await response.json();

  return responseData.data.category;
};
