import { apiBaseUrl } from "@/config/config";

export const getProductReviewWithPagination = async (
  page?: string,
  limit?: string
) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  try {
    const response = await fetch(
      `${apiBaseUrl}/product-review/pagination?${queryParams.toString()}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { result: [], pagination: { total: 0, page, limit } };
  }
};



