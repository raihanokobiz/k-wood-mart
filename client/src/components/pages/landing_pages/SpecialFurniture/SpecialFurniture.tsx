"use client";

import React, { useState } from "react";
import { TProduct } from "@/types";
import { apiBaseUrl } from "@/config/config";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";


interface SpecialFurnitureProps {
  specialProducts: {
    data: {
      result: {
        products: TProduct[];
        childCategory?: {
          image: string;
          name?: string;
        };
      };
    };
  };
}

const SpecialFurniture = ({ specialProducts }: SpecialFurnitureProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = specialProducts?.data?.result?.products || [];
  // const childCategory = specialProducts?.data?.result?.childCategory;

  if (!products || products.length === 0) {
    return null;
  }

  // const nextSlide = () => {
  //   setCurrentIndex((prev) => (prev + 1) % specialProducts.data.result.products.length);
  // };

  // const prevSlide = () => {
  //   setCurrentIndex((prev) =>
  //     (prev - 1 + specialProducts.data.result.products.length) %
  //     specialProducts.data.result.products.length
  //   );
  // };

  return (
    <div className="Container">
      <div className=" bg-gray-100 py-6 md:py-12 px-4 md:px-8 lg:px-16">
        <div className=" grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left Side - Text Content */}
          <div className="lg:col-span-4 text-center lg:text-right space-y-3 md:space-y-6">
            <h1 className=" Title">
              Discover Your Perfect  Style
            </h1>
            <p className="Description">
              Transform every corner of your home with our exclusive collections
            </p>
            {/* <div>
              <Link href="/special/furniture">
                <button className="inline-flex items-center gap-2 text-gray-900 font-medium text-lg border-b-2 border-gray-900 pb-1 hover:border-amber-900 hover:text-amber-900 transition-colors">
                  Explore Now
                </button>
              </Link>
            </div> */}
          </div>
          {/* Right Side - Featured Image */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Image */}
            <div className="relative bg-white rounded shadow-lg overflow-hidden  md:w-[500px] lg:w-[700px]  md:h-[400px] lg:h-[500px] mx-auto aspect-square">
              <Image
                src={`${apiBaseUrl}${specialProducts?.data?.result?.childCategory?.image}`}
                alt={specialProducts.data.result.products[currentIndex].name ?? "product"}
                fill
                className="object-cover"
              />
            </div>
            {/* Carousel */}
            <div className="flex items-center justify-center gap-3">
              {/* Carousel Items */}
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                }}
                className="w-full rounded-md"
              >
                {specialProducts?.data?.result?.products.map((item, index) => (
                  <SwiperSlide key={`${item._id}-${index}`}>
                    <Link href={`product/${item?.slug}`}>
                      <div
                        onClick={() => setCurrentIndex(index)}
                        className="bg-white w-full md:h-[230px] rounded-md overflow-hidden cursor-pointer transition-all"
                      >
                        <div className="relative w-full h-[200px]  md:h-[170px]">
                          <Image
                            src={`${apiBaseUrl}${item?.thumbnailImage}`}
                            alt={item?.name ?? "product"}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        <div className="px-2 py-1 text-center mb-2">
                          {item.set?.[0]?.setName && (
                            <p className="text-sm text-gray-500 truncate">
                              {item?.set?.[0]?.setName}
                            </p>
                          )}
                          <p className="ProductTitle">
                            {item?.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialFurniture;
