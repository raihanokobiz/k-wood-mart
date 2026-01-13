"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllCategorys = async () => {
  const res = await fetch(`${apiBaseUrl}/category`);

  return res.json();
};

// export const getSingleCategoryBySlug = async (slug: string) => {
//   const res = await fetch(`${apiBaseUrl}/category/${slug}`);

//   if (!res.ok) {
//     throw new Error("Failed to fetch category");
//   }

//   return res.json();
// };
