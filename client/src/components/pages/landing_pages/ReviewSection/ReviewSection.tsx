import { getProductReviewWithPagination } from '@/app/(withCommonLayout)/productReview/productReviewAction';
import ReviewsCard from '@/app/(withCommonLayout)/productReview/ReviewCard';
import React from 'react'

export default async function ReviewSection() {

    const { data } = await getProductReviewWithPagination("1", "100");

    return (
        <div className="py-6 md:py-8 2xl:py-12 px-4 md:px-6 lg:px-8 2xl:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {data?.result?.slice(0, 3).map((review: any) => (
                    <ReviewsCard key={review._id} review={review} />
                ))}
            </div>
        </div>
    )
}
