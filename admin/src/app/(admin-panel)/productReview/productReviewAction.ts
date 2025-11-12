// services/products.ts

import { BASE_URL } from "@/config/config";

export const getProductReviewWithPagination = async ({
  page,
  limit,
}: {
  page?: string | number;
  limit?: string | number;
}) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page.toString());
  if (limit) queryParams.set("limit", limit.toString());

  try {
    const response = await fetch(
      `${BASE_URL}/product-review/pagination?${queryParams.toString()}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { result: [], pagination: { total: 0, page, limit } };
  }
};

export const deleteProductReview = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/product-review/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete review");
    }

    return res.json();
  } catch (err) {
    console.error("Error deleting review:", err);
    throw err;
  }
};
