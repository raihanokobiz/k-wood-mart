"use server";
import { apiBaseUrl } from "@/config/config";
import { apiRequest } from "@/lib/apiRequest";
import { revalidatePath } from "next/cache";


export const getQuoteProducts = async (
  userId: string | undefined,
  coupon: string,
  inventoryRef?: string | null,
  productRef?: string | null
) => {
  const params = new URLSearchParams();

  if (userId) params.append("userId", userId);
  if (coupon) params.append("coupon", coupon);
  if (inventoryRef) params.append("inventoryRef", inventoryRef);
  if (productRef) params.append("productRef", productRef);

  const res = await fetch(`${apiBaseUrl}/quote?${params.toString()}`);
  return res.json();
};

export const deleteQuoteProduct = async (quoteId: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/quote/${quoteId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete item from quote");
    revalidatePath("/quote");
    return await res.json();
  } catch (error) {
    console.error("Delete failed:", error);
    return null;
  }
};

export const addToQuote = async (product: {
  productRef: string;
  quantity?: number;
  userRef: string | undefined;
  inventoryRef?: string | null;
}) => {

  const res = await apiRequest({
    endpoint: "/quote",
    method: "POST",
    body: product,
  });
  revalidatePath("/quote");
  return res;
};
