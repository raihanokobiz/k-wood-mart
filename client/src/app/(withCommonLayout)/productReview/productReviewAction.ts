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

export const addProductReview = async (formData: FormData) => {
  try {
    const res = await fetch(`${apiBaseUrl}/product-review`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to add review");
    }

    return res.json();
  } catch (err) {
    console.error("Error adding review:", err);
    throw err;
  }
};


