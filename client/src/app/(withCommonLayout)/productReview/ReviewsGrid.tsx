"use client";
import React, { useState } from "react";
import { ProductReview } from "./product-review-form-schema";
import { ReviewFormModal } from "./CreateProductReviewForm";

interface Props {
  initialReviews: ProductReview[];
}

export default function ReviewsGrid({ initialReviews }: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [displayCount, setDisplayCount] = useState(9);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + 9);
      setLoading(false);
    }, 500);
  };

  const handleSubmitReview = async (formData: FormData) => {
    // API call
    const res = await fetch(`/api/product-review`, { method: "POST", body: formData });
    if (res.ok) {
      const newReview = await res.json();
      setReviews((prev) => [newReview, ...prev]);
      setIsModalOpen(false);
    }
  };

  const visibleReviews = reviews.slice(0, displayCount);
  const hasMore = displayCount < reviews.length;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Customer Reviews</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-black text-white px-6 py-3 rounded-lg">
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {visibleReviews.map((r) => (
          <ReviewCard key={r._id} review={r} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-white border-2 border-black px-8 py-3 rounded-lg"
          >
            {loading ? "Loading..." : "Load More Reviews"}
          </button>
        </div>
      )}

      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </>
  );
}
