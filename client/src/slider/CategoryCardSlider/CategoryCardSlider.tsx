"use client";
import { TCategory } from "@/types";
import Image from "next/image";
import React, { useRef } from "react";
import { apiBaseUrl } from "@/config/config";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryProps {
  categoriesList: TCategory[];
}

const CategoryCardSlider: React.FC<CategoryProps> = ({ categoriesList }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  
  // Responsive item count check
  const useSwiper = categoriesList.length > 6; // Adjust based on your needs

  return (
    <div className="bg-gray-100 p-4 md:p-6 lg:p-10 rounded relative">
      {useSwiper ? (
        <>
          {categoriesList.length > 10 && (
            <>
              <button
                ref={prevRef}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#D4A373] rounded-full hover:bg-[#CCD5AE] text-white duration-300 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                ref={nextRef}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#D4A373] rounded-full hover:bg-[#CCD5AE] text-white duration-300 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper: any) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            centeredSlides={true}
            loop={categoriesList.length > 10}
            slidesPerView="auto"
            spaceBetween={16}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 6,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 8,
                spaceBetween: 16,
              },
              1536: {
                slidesPerView: 10,
                spaceBetween: 16,
              },
            }}
            className="w-full"
          >
            {categoriesList.map((category) => (
              <SwiperSlide key={category._id}>
                <Link href={`/shop?category=${category.slug || category._id}`}>
                  <div className="bg-white shadow-md shadow-gray-400 rounded text-center hover:shadow-lg transition-shadow">
                    <div className="relative h-[150px] mb-4">
                      <Image
                        src={apiBaseUrl + category.vectorImage || ""}
                        alt={category.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : (
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {categoriesList.map((category) => (
            <Link
              key={category._id}
              href={`/shop?category=${category.slug || category._id}`}
              className="w-[calc(50%-8px)] sm:w-[calc(25%-12px)] md:w-[calc(16.666%-14px)] lg:w-[calc(12.5%-14px)]"
            >
              <div className="bg-white shadow-md shadow-gray-400 rounded text-center hover:shadow-lg transition-shadow">
                <div className="relative h-[150px] mb-4">
                  <Image
                    src={apiBaseUrl + category.vectorImage || ""}
                    alt={category.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCardSlider;