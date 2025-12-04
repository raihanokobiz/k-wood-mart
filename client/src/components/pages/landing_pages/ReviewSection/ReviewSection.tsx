'use client';
import { getProductReviewWithPagination } from '@/app/(withCommonLayout)/productReview/productReviewAction';
import ReviewsCard from '@/app/(withCommonLayout)/productReview/ReviewCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';

export default function ReviewSection() {
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const { data } = await getProductReviewWithPagination("1", "100");
            setReviews(data?.result || []);
        };
        fetchReviews();
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: i * 0.15,
                ease: [0.25, 0.4, 0.25, 1]
            }
        })
    };

    return (
        <motion.div className="Container"
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
                            <motion.h2 className="text-gray-600 font-bold text-2xl md:text-3xl lg:text-4xl leading-tight"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                What Our Clients  Say
                                <motion.span className="block text-[#D4A373] font-normal mt-2"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    About Us
                                </motion.span>
                            </motion.h2>
                        </div>

                        {/* Description */}
                        {/* <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto lg:mx-0">
                            Don't just take our word for it. Hear from our satisfied customers about their experience.
                        </p> */}

                        {/* Button */}
                        <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
                            <Link
                                href={"/productReview"}
                                className="text-gray-600 group  rounded-full transition-all duration-300 md:text-base font-medium  flex items-center gap-2"
                            >
                                <motion.span className="text-3xl"
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    Explore All Reviews
                                </motion.span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <div className=" col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {reviews?.slice(0, 3).map((review: any) => (
                        <motion.div
                            key={review.id || review._id}
                            custom={review._id}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                        >

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ReviewsCard key={review._id} review={review} />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
