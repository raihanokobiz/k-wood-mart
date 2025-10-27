"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllBlogs = async () => {
  const res = await fetch(`${apiBaseUrl}/blog`);

  return res.json();
};

export const getSingleBlogBySlug = async (slug: string) => {
  console.log("slug", slug);
  console.log("slug", `${apiBaseUrl}/blog/single/${slug}`);
  const res = await fetch(`${apiBaseUrl}/blog/single/${slug}`);
  return res.json();
};
// export const getSingleBannerBySlug = async (slug: string) => {
//   const res = await fetch(`${apiBaseUrl}/banners/${slug}`);

//   if (!res.ok) {
//     throw new Error("Failed to fetch banners");
//   }

//   return res.json();
// };
