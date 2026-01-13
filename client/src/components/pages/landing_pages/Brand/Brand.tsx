"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import { apiBaseUrl } from "@/config/config";
import { TBrand } from "../../../../types";
import Link from "next/link";

interface Props {
  brands: {
    data: TBrand[];
  };
}

const Brand: React.FC<Props> = ({ brands }) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [navigation, setNavigation] = useState<{
    prevEl: HTMLButtonElement | null;
    nextEl: HTMLButtonElement | null;
  }>({ prevEl: null, nextEl: null });

  useLayoutEffect(() => {
    setNavigation({
      prevEl: prevRef.current,
      nextEl: nextRef.current,
    });
  }, []);

  console.log("try to find brands data", brands);

  return (
    <div className="py-12">
      <h2 className="md:text-2xl font-semibold md:text-center px-4  md:mb-6 mb-3">
        SHOP BY BRANDS
      </h2>
      <div className="relative  px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32 2xl:px-80">
        {/* Nav Buttons */}
        <button
          ref={prevRef}
          className="absolute left-2 sm:left-4 md:left-8 lg:left-18 xl:left-26 2xl:left-76 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#D4A373] rounded-full hover:bg-[#CCD5AE] text-white duration-300 cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          ref={nextRef}
          className="absolute right-2 sm:right-4 md:right-8 lg:right-18 xl:right-26 2xl:right-76 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#D4A373] rounded-full hover:bg-[#CCD5AE] text-white duration-300 cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.2}
          loop={true}
          breakpoints={{
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
            1536: { slidesPerView: 6 },
          }}
          navigation={navigation}
          className="pb-8"
        >
          {brands?.data?.map((brand: TBrand) => (
            <SwiperSlide key={brand._id}>
              <Link href={`/shop?brand=${brand.slug || brand._id}`}>
                <div className="border border-[#D4A373] rounded flex items-center justify-center cursor-pointer">
                  {brand.image && (
                    <Image
                      src={apiBaseUrl + brand.image}
                      width={100}
                      height={100}
                      alt="Brand Image"
                      className="p-4 max-w-full max-h-full"
                    />
                  )}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Brand;
