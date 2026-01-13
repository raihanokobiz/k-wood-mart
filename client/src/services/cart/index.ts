"use server";
import { apiBaseUrl } from "@/config/config";
import { apiRequest } from "@/lib/apiRequest";
import { revalidatePath } from "next/cache";

// export const getCartProducts = async (userId: { userId: string }) => {
//   // const res = await fetch(`${apiBaseUrl}/cart/all`);
//   const res = await fetch(`${apiBaseUrl}/cart?userId=${userId}`);

//   return res.json();
// };

export const getCartProducts = async (
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

  const res = await fetch(`${apiBaseUrl}/cart?${params.toString()}`);
  return res.json();
};

export const deleteCartProduct = async (cartId: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/cart/${cartId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete item from cart");
    revalidatePath("/cart");
    return await res.json();
  } catch (error) {
    console.error("Delete failed:", error);
    return null;
  }
};

export const addToCart = async (product: {
  productRef: string;
  quantity?: number;
  userRef: string | undefined;
  inventoryRef?: string | null;
}) => {
  const res = await apiRequest({
    endpoint: "/cart",
    method: "POST",
    body: product,
  });
  revalidatePath("/");
  return res;
};
