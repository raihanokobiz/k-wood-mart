import { getProductReviewWithPagination } from '@/app/(withCommonLayout)/productReview/productReviewAction';
import ReviewsCard from '@/app/(withCommonLayout)/productReview/ReviewCard';
import Link from 'next/link';
import React from 'react'

export default async function ReviewSection() {

    const { data } = await getProductReviewWithPagination("1", "100");

    return (
        <div className="py-6 md:py-8 2xl:py-12 px-4 md:px-6 lg:px-8 2xl:px-12">
            <div className='flex justify-between items-center'>
                <h2
                    className=" text-[#ed1c24] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
                    style={{ fontFamily: "Georgia, serif" }}
                >
                    What Our Clients Say About Us
                </h2>
                {/* Button */}
                <div className="flex justify-center mb-8">
                    <Link
                        href={"/productReview"}
                        className="bg-[#ed1c24] text-white px-6 py-2 rounded-md hover:bg-[#c8161d] transition duration-300 text-sm md:text-base"
                    >
                        See All Reviews
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {data?.result?.slice(0, 3).map((review: any) => (
                    <ReviewsCard key={review._id} review={review} />
                ))}
            </div>
        </div>
    )
}
