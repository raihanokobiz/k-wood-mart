"use server";

import { BASE_URL } from "@/config/config";
import { AllContactWithPaginationResponse } from "@/types/shared";

export async function getContactWithPagination(
  page?: string,
  limit?: string
): Promise<AllContactWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/contact-info/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}


export async function deleteContact(id: string) {
    const response = await fetch(`${BASE_URL}/contact-info/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  }
