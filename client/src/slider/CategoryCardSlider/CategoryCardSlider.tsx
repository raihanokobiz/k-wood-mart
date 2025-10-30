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
  const showCustomArrows = categoriesList.length > 3;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative w-full mt-4">
      {showCustomArrows && (
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
        spaceBetween={8}
        slidesPerView={2}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
          1280: { slidesPerView: 2 },
          1536: { slidesPerView: 2 },
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: showCustomArrows ? prevRef.current : undefined,
          nextEl: showCustomArrows ? nextRef.current : undefined,
        }}
        onBeforeInit={(swiper) => {
          if (
            showCustomArrows &&
            swiper.params.navigation &&
            typeof swiper.params.navigation === "object"
          ) {
            swiper.params.navigation.prevEl = prevRef.current!;
            swiper.params.navigation.nextEl = nextRef.current!;
          }
        }}
      >
        {categoriesList.map((category) => (
          <SwiperSlide key={category._id}>
            <Link href={`/shop?category=${category.slug || category._id}`}>
              <div className="text-center w-full max-w-[250px] mx-auto aspect-square bg-red-100 rounded-lg overflow-hidden">
                <Image
                  src={apiBaseUrl + category.vectorImage || ""}
                  alt={category.name}
                  width={250}
                  height={250}
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryCardSlider;