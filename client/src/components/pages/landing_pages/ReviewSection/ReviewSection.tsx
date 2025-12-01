import { getProductReviewWithPagination } from '@/app/(withCommonLayout)/productReview/productReviewAction';
import ReviewsCard from '@/app/(withCommonLayout)/productReview/ReviewCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default async function ReviewSection() {

    const { data } = await getProductReviewWithPagination("1", "100");

    return (
        <div className="Container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Section - Header & Button */}
                <div className='col-span-12 lg:col-span-5 flex items-center justify-center lg:justify-end'>
                    <div className="text-center lg:text-left space-y-4">
                        {/* Heading */}
                        <div>
                            <div className="inline-block mb-4">
                                <span className="text-[#D4A373] text-sm md:text-base font-medium tracking-wider uppercase text-right">
                                    Testimonials
                                </span>
                                <div className="h-0.5 bg-gradient-to-r from-[#D4A373] to-transparent mt-2"></div>
                            </div>
                            <h2 className="text-gray-600 font-bold text-2xl md:text-3xl lg:text-4xl leading-tight">
                                What Our Clients  Say
                                <span className="block text-[#D4A373] font-normal mt-2 ">
                                    About Us
                                </span>
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto lg:mx-0">
                            Don't just take our word for it. Hear from our satisfied customers about their experience.
                        </p>

                        {/* Button */}
                        <div className="flex justify-center lg:justify-start">
                            <Link
                                href={"/productReview"}
                                className="text-gray-600 group  rounded-full transition-all duration-300 md:text-base font-medium  flex items-center gap-2"
                            >
                                <span className="text-3xl">
                                    Explore All Reviews
                                </span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className=" col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {data?.result?.slice(0, 3).map((review: any) => (
                        <ReviewsCard key={review._id} review={review} />
                    ))}
                </div>
            </div>
        </div>
    )
}
