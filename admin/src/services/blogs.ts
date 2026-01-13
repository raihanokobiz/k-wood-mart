"use server";

import { BASE_URL } from "@/config/config";
import {
  AllBlogWithPaginationResponse,
  SingleBlogResponse,
} from "@/types/shared";

export async function createBlog(data: any) {
  console.log(data, "data from post api........");
  const response = await fetch(`${BASE_URL}/blog`, {
    // headers: {
    //   "Content-Type": "application/json",
    // },
    method: "POST",
    body: data,
    // body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

// export async function getAllProduct(): Promise<AllProductResponse> {
//   const response = await fetch(`${BASE_URL}/product`);
//   if (!response.ok) {
//     throw new Error(`Error: ${response.status} - ${response.statusText}`);
//   }
//   return response.json();
// }

export async function getBlogWithPagination(
  page?: string,
  limit?: string
): Promise<AllBlogWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/blog/pagination?${queryParams.toString()}`
    // { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getBlogById(id: string): Promise<SingleBlogResponse> {
  const response = await fetch(`${BASE_URL}/blog/single/${id}`);
  //   if (!response.ok) {
  //     throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //   }
  return response.json();
}

export async function updateBlog(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/blog/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function deleteBlog(id: string) {
  const response = await fetch(`${BASE_URL}/blog/${id}`, {
    method: "DELETE",
  });
  //   if (!response.ok) {
  //     throw new Error(`Error: ${response.status} - ${response.statusText}`);
  //   }
  return response.json();
}
