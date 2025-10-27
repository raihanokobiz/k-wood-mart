"use server";

import { BASE_URL } from "@/config/config";
import { AllBrandResponse, AllBrandWithPaginationResponse, SingleBrandResponse } from "@/types/shared";

export async function createBrand(data: any) {
  const response = await fetch(`${BASE_URL}/brand`, {
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

export async function getAllBrand(): Promise<AllBrandResponse> {
  const response = await fetch(`${BASE_URL}/brand`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getBrandWithPagination(
  page?: string,
  limit?: string
): Promise<AllBrandWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/brand/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getBrandById(id: string): Promise<SingleBrandResponse> {
  const response = await fetch(`${BASE_URL}/brand/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateBrand(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/brand/${id}`, {
    // headers: {
    //   "Content-Type": "application/json",
    // },
    method: "PUT",
    // body: JSON.stringify(data),
    body: data,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function deleteBrand(id: string) {
  const response = await fetch(`${BASE_URL}/brand/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
