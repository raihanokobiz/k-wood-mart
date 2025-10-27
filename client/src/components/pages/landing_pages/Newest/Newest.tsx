/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { TProduct } from "@/types";
import icon from "@/assets/images/sectionIcon.webp";
import React, { useRef } from "react";
import PerfurmCard from "../../products/PerfurmCard/PerfurmCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react"; // or any icon set you prefer
import Image from "next/image";
import { NavigationOptions } from "swiper/types";

interface ProductsProps {
  products: {
    category: TProduct;
    data: TProduct[];
  };
}

const Newest: React.FC<ProductsProps> = ({ products }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  console.log("for checking newst peroducts", products);

  return (
    <div className="Container pt-12 relative">
      <div className="md:flex hidden items-center justify-center pb-2 relative w-[40px] h-[40px] mx-auto">
        <span className="absolute top-[-6px]  left-[-4px]  w-3 h-3 border-t-4 border-l-4  border-[#D4A373] rounded-tl-md transition-all duration-300"></span>

        {/* Top-right corner */}
        <span className="absolute top-[-6px]  right-[-4px]  w-3 h-3 border-t-4 border-r-4  border-[#D4A373] rounded-tr-md transition-all duration-300"></span>

        {/* Bottom-left corner */}
        <span className="absolute bottom-0  left-[-4px]  w-3 h-3 border-b-4 border-l-4  border-[#D4A373] rounded-bl-md transition-all duration-300"></span>

        {/* Bottom-right corner */}
        <span className="absolute bottom-0  right-[-4px]  w-3 h-3 border-b-4 border-r-4  border-[#D4A373] rounded-br-md transition-all duration-300"></span>
        <Image src={icon} width={35} height={35} alt="icon" className="p-0.5" />
      </div>
      <h2 className="md:text-2xl font-semibold md:text-center hidden md:block mt-2">
        NEWEST ARRIVALS FRAGRANCES
      </h2>
      <div className="flex justify-between">
        <p className="here using this p for arrow right site hidden md:block"></p>
        <h2 className="md:text-2xl font-semibold text-start md:hidden">
          NEWEST ARRIVALS FRAGRANCES
        </h2>
        <div className="flex gap-2 pb-2" ref={(el) => {}}>
          <button
            ref={prevRef}
            className="p-2 bg-[#D4A373] rounded hover:bg-[#CCD5AE] cursor-pointer text-[#fff] duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            ref={nextRef}
            className="p-2 bg-[#D4A373] rounded hover:bg-[#CCD5AE] cursor-pointer text-[#fff] duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1.2}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          const navigation = swiper.params.navigation as NavigationOptions;
          if (navigation) {
            navigation.prevEl = prevRef.current;
            navigation.nextEl = nextRef.current;
          }
        }}
        className="pb-8"
      >
        {products?.data?.map((product) => (
          <SwiperSlide key={product._id}>
            <PerfurmCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Newest;
