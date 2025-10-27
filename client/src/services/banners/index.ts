"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllBanners = async () => {
  const res = await fetch(`${apiBaseUrl}/banners`);

  return res.json();
};

// export const getSingleBannerBySlug = async (slug: string) => {
//   const res = await fetch(`${apiBaseUrl}/banners/${slug}`);

//   if (!res.ok) {
//     throw new Error("Failed to fetch banners");
//   }

//   return res.json();
// };
