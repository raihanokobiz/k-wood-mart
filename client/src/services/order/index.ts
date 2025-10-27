"use server";

import { apiRequest } from "@/lib/apiRequest";

export const addOrder = async (order: {
  productRef: string;
  quantity: number;
  userRef: string;
  inventoryRef?: string | null;
}) => {
  const res = await apiRequest({
    endpoint: "/order",
    method: "POST",
    body: order,
  });
  return res;
};
