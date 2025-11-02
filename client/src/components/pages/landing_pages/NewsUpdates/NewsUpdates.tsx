"use client";

import Image from "next/image";
import React from "react";
import { Calendar, ArrowRight } from "lucide-react";

export default function NewsUpdates() {
    const newsUpdates = [
        {
            title: "ওক উড ফার্নিচারের নতুন কালেকশন লঞ্চ",
            description:
                "আমাদের নতুন হ্যান্ডক্রাফটেড ওক উড কালেকশনটি আবিষ্কার করুন, যা আধুনিক ডিজাইন ও টিমলেস এ্যালিগেন্সের সমন্বয়।",
            image:
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
            date: "2025-11-01",
            category: "প্রোডাক্ট লঞ্চ",
        },
        {
            title: "উডমার্ট সর্বোত্তম ইন্টেরিয়র ডিজাইন অ্যাওয়ার্ড জিতেছে",
            description:
                "আমরা ২০২৫ সালের এক্সেলেন্স ইন ইন্টেরিয়র ডিজাইন অ্যাওয়ার্ড পেয়েছি আমাদের ইনোভেটিভ ফার্নিচার সলিউশনের জন্য।",
            image:
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
            date: "2025-10-28",
            category: "অর্জন",
        },
        {
            title: "টেকসই কাঠ উৎস প্রকল্প",
            description:
                "পরিবেশবান্ধব প্র্যাকটিস এবং টেকসই ফার্নিচার উৎপাদনের প্রতি আমাদের অঙ্গীকার সম্পর্কে জানুন।",
            image:
                "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
            date: "2025-10-15",
            category: "টেকসইতা",
        },
        {
            title: "কাস্টম ফার্নিচার ওয়ার্কশপ উদ্বোধন",
            description:
                "আমাদের নতুন শোরুম এবং কনসালটেশন সেন্টারে যান এবং আমাদের বিশেষজ্ঞদের সঙ্গে আপনার স্বপ্নের ফার্নিচার ডিজাইন করুন।",
            image:
                "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80",
            date: "2025-10-10",
            category: "ইভেন্ট",
        },
    ];


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            "Product Launch": "bg-blue-100 text-blue-700",
            Achievement: "bg-purple-100 text-purple-700",
            Sustainability: "bg-green-100 text-green-700",
            Event: "bg-orange-100 text-orange-700",
        };
        return colors[category] || "bg-gray-100 text-gray-700";
    };

    return (
        <section className="pb-4 md:px-6 lg:px-8">
            {/* Section Title */}
            <div className="text-center mb-8">
                <h2
                    className="rounded text-[#ed1c24] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
                    style={{ fontFamily: "Georgia, serif" }}
                >
                    News & Updates
                </h2>
            </div>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
                {newsUpdates.map((news, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-8 shadow-md shadow-gray-200 rounded overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                            <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                style={{ objectFit: "cover" }}
                                className="group-hover:scale-110 transition-transform duration-500 rounded"
                            />
                            <div className="absolute top-4 left-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                                        news.category
                                    )}`}
                                >
                                    {news.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="pt-4">
                            {/* Date */}
                            <div className="flex items-center text-gray-500 text-sm mb-3">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span className="tabular-nums">{formatDate(news.date)}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#ed1c24] transition-colors">
                                {news.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {news.description}
                            </p>

                            {/* Read More */}
                            <button className="flex items-center text-[#ed1c24] font-semibold text-sm group-hover:gap-2 transition-all">
                                Read More
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            <div className="text-center my-8">
                <button className="bg-[#ed1c24] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d11920] transition-colors shadow-lg hover:shadow-xl">
                    View All News
                </button>
            </div>
        </section>
    );
}
