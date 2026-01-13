"use server";

import { apiRequest } from "@/lib/apiRequest";

export const addReview = async (review: {
  name: string;
  rating: number;
  comment: string;
  userRef: string | undefined;
  productRef: string;
}) => {
  const res = await apiRequest({
    endpoint: "/product-review",
    method: "POST",
    body: review,
  });
  return res;
};

export const getPaginatedReviews = async (
  page: number = 1,
  limit: number = 10
) => {
  const res = await apiRequest({
    endpoint: `/product-review/pagination?page=${page}&limit=${limit}`,
    method: "GET",
  });
  return res;
};

// export const getPaginatedReviews = async (
//   page: number = 1,
//   limit: number = 10
// ): Promise<TProductReviewsResponse> => {
//   const res = await fetch(
//     `/product-review/pagination?page=${page}&limit=${limit}`
//   );
//   const data = await res.json();
//   return data;
// };
