"use server";

import { apiBaseUrl } from "@/config/config";

export const getAllBrands = async () => {
  const res = await fetch(`${apiBaseUrl}/brand`);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};
