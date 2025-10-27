"use server";

import { BASE_URL } from "@/config/config";
import {
  AllCategoryResponse,
  AllCategoryWithPaginationResponse,
  SingleCategoryResponse,
  TCategory,
} from "@/types/shared";

export async function createCategory(data: any) {
  const response = await fetch(`${BASE_URL}/category`, {
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

export async function getAllCategory(): Promise<AllCategoryResponse> {
  const response = await fetch(`${BASE_URL}/category`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getCategoryWithPagination(
  page?: string,
  limit?: string
): Promise<AllCategoryWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/category/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getCategoryById(id: string): Promise<SingleCategoryResponse> {
  const response = await fetch(`${BASE_URL}/category/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateCategory(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/category/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function deleteCategory(id: string) {
  const response = await fetch(`${BASE_URL}/category/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
