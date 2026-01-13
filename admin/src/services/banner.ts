"use server";

import { BASE_URL } from "@/config/config";
import {
  AllBannerResponse,
  AllBannerWithPaginationResponse,
  SingleBannerResponse,
  TBanner,
} from "@/types/shared";

export async function createBanner(data: any) {
  const response = await fetch(`${BASE_URL}/banners`, {
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

export async function getAllBanner(): Promise<AllBannerResponse> {
  const response = await fetch(`${BASE_URL}/banners`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getBannerWithPagination(
  page?: string,
  limit?: string
): Promise<AllBannerWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/banners/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getBannerById(id: string): Promise<SingleBannerResponse> {
  const response = await fetch(`${BASE_URL}/banners/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateBanner(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/banners/${id}`, {
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

export async function deleteBanner(id: string) {
  const response = await fetch(`${BASE_URL}/banners/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
