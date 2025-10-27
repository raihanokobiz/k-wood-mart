"use server";
import { apiBaseUrl } from "@/config/config";

export const getCampaign = async () => {
  const res = await fetch(`${apiBaseUrl}/campaign`);

  return res.json();
};