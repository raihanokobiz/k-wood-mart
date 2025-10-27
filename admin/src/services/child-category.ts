"use server";

import { BASE_URL } from "@/config/config";
import {
  AllChildCategoryResponse,
  AllChildCategoryWithPaginationResponse,
  SingleChildCategoryResponse,
  TChildCategory,
} from "@/types/shared";

export async function createChildCategory(data: any) {
  const response = await fetch(`${BASE_URL}/child-category`, {
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

export async function getAllChildCategory(): Promise<AllChildCategoryResponse> {
  const response = await fetch(`${BASE_URL}/child-category`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getChildCategoryWithPagination(
  page?: string,
  limit?: string
): Promise<AllChildCategoryWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/child-category/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getChildCategoryById(
  id: string
): Promise<SingleChildCategoryResponse> {
  const response = await fetch(`${BASE_URL}/child-category/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateChildCategory(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/child-category/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function deleteChildCategory(id: string) {
  const response = await fetch(`${BASE_URL}/child-category/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
