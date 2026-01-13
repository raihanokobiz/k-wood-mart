"use server";

import { BASE_URL } from "@/config/config";
import {
  AllBulkOrderResponse,
  AllBulkOrderWithPaginationResponse,
} from "@/types/shared";
export async function getAllBulkOrder(): Promise<AllBulkOrderResponse> {
  const response = await fetch(`${BASE_URL}/order-bulk`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getBulkOrderWithPagination(
  page?: string,
  limit?: string
): Promise<AllBulkOrderWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/order-bulk/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function deleteBulkOrder(id: string) {
  const response = await fetch(`${BASE_URL}/order-bulk/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
