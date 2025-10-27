"use server";

import { BASE_URL } from "@/config/config";
import {
  AllCouponResponse,
  AllCouponWithPaginationResponse,
  SingleCouponResponse,
  TCoupon,
} from "@/types/shared";

export async function createCoupon(data: any) {
  const response = await fetch(`${BASE_URL}/coupon`, {
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

export async function getAllCoupon(): Promise<AllCouponResponse> {
  const response = await fetch(`${BASE_URL}/coupon`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getCouponWithPagination(
  page?: string,
  limit?: string
): Promise<AllCouponWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/coupon/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getCouponById(id: string): Promise<SingleCouponResponse> {
  const response = await fetch(`${BASE_URL}/coupon/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateCoupon(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/coupon/${id}`, {
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

export async function deleteCoupon(id: string) {
  const response = await fetch(`${BASE_URL}/coupon/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
