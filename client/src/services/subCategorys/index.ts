"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllSubCategorys = async () => {
  const res = await fetch(`${apiBaseUrl}/sub-category`);

  return res.json();
};

// export const getSingleSubCategoryBySlug = async (slug: string) => {
//   const res = await fetch(`${apiBaseUrl}/category/${slug}`);

//   if (!res.ok) {
//     throw new Error("Failed to fetch category");
//   }

//   return res.json();
// };
