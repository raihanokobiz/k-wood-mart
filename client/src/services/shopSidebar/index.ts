"use server";
import { apiBaseUrl } from "@/config/config";

export const getShopSidebar = async () => {
  const res = await fetch(`${apiBaseUrl}/category/navbar`);

  return res.json();
};

export const getCategoryById = async (id: string) => {
  const res = await fetch(`${apiBaseUrl}/category/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch category");
  }

  return res.json();
};
