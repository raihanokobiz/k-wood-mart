"use server";
import { apiBaseUrl } from "@/config/config";

export const getNewArrivals = async () => {
  const res = await fetch(`${apiBaseUrl}/product/new-arrivals`);
  return res.json();
};
