"use server";

import { BASE_URL } from "@/config/config";
import {
  AllSubCategoryResponse,
  AllSubCategoryWithPaginationResponse,
  SingleSubCategoryResponse,
  TSubCategory,
} from "@/types/shared";

export async function createSubCategory(data: any) {
  const response = await fetch(`${BASE_URL}/sub-category`, {
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

export async function getAllSubCategory(): Promise<AllSubCategoryResponse> {
  const response = await fetch(`${BASE_URL}/sub-category`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getSubCategoryWithPagination(
  page?: string,
  limit?: string
): Promise<AllSubCategoryWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/sub-category/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getSubCategoryById(id: string): Promise<SingleSubCategoryResponse> {
  const response = await fetch(`${BASE_URL}/sub-category/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateSubCategory(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/sub-category/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function deleteSubCategory(id: string) {
  const response = await fetch(`${BASE_URL}/sub-category/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
