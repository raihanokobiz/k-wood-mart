"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllChildCategorys = async (viewType:string) => {
  const res = await fetch(`${apiBaseUrl}/child-category?viewType=${viewType}&limit=4`);

  return res.json();
};

// export const getSingleSubCategoryBySlug = async (slug: string) => {
//   const res = await fetch(`${apiBaseUrl}/category/${slug}`);

//   if (!res.ok) {
//     throw new Error("Failed to fetch category");
//   }

//   return res.json();
// };
