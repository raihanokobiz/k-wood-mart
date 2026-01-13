'use client';
import { getProductReviewWithPagination } from '@/app/(withCommonLayout)/productReview/productReviewAction';
import ReviewsCard from '@/app/(withCommonLayout)/productReview/ReviewCard';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function ReviewSection() {
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data } = await getProductReviewWithPagination("1", "100");
            setReviews(data?.result || []);
        };
        fetchReviews();
    }, []);

    // =====================
    // Framer Motion Variants
    // =====================
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const
            }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: i * 0.15,
                ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number]
            }
        })
    };

    return (
        <>
            <motion.div className="py-6 md:py-8 px-4 md:px-6 lg:px-8 2xl:px-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 xl:gap-28">
                    {/* Left Section - Header & Button */}
                    <div className='col-span-12 lg:col-span-5 flex items-center justify-center lg:justify-end mb-6 md:mb-10'>
                        <div className="text-center lg:text-left space-y-4">
                            {/* Heading */}
                            <div>
                                <motion.div variants={itemVariants} className="inline-block mb-4">
                                    <motion.span className="text-[#D4A373] text-sm md:text-base font-medium tracking-wider uppercase text-right"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        Testimonials
                                    </motion.span>
                                    <div className="h-0.5 bg-gradient-to-r from-[#D4A373] to-transparent mt-2"></div>
                                </motion.div>
                                <motion.h2 className="Title"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    What Our Clients Say
                                    <motion.span className="block text-[#D4A373] font-normal mt-2 text-left"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                    >
                                        About Us
                                    </motion.span>
                                </motion.h2>
                            </div>

                            {/* Button */}
                            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
                                <Link
                                    href={"/productReview"}
                                    className="ExploreButton"
                                >
                                    <motion.span className="text-3xl"
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Explore All Reviews
                                    </motion.span>
                                    <motion.svg
                                        className="w-8 h-8"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </motion.svg>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                    <div className='col-span-12 lg:col-span-7'>
                        {/* Right Section - Reviews */}
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={16}
                            slidesPerView={2}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 2,
                                },
                                1536: {
                                    slidesPerView: 3,
                                },
                            }}
                            className="w-full rounded-md px-4 md:px-0"
                        >
                            {reviews?.slice(0, 3).map((review: any, index: number) => (
                                <SwiperSlide key={review.id || review._id}>
                                    <motion.div
                                        key={review.id || review._id}
                                        custom={index} // for delay in variants
                                        variants={cardVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-50px" }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ReviewsCard key={review._id} review={review} />
                                        </motion.div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                </div>
            </motion.div >
        </>
    )
}
