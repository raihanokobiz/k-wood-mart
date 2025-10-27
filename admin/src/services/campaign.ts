"use server";

import { BASE_URL } from "@/config/config";
import {
  AllCampaignResponse,
  AllCampaignWithPaginationResponse,
  SingleCampaignResponse,
} from "@/types/shared";

export async function createCampaign(data: any) {
  const response = await fetch(`${BASE_URL}/campaign`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    // body: data,
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getAllCampaign(): Promise<AllCampaignResponse> {
  const response = await fetch(`${BASE_URL}/campaign`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getCampaignWithPagination(
  page?: string,
  limit?: string
): Promise<AllCampaignWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/campaign/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getCampaignById(
  id: string
): Promise<SingleCampaignResponse> {
  const response = await fetch(`${BASE_URL}/campaign/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateCampaign(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/campaign/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(data),
    // body: data,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function deleteCampaign(id: string) {
  const response = await fetch(`${BASE_URL}/campaign/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
