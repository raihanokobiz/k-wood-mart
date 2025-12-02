"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { TProduct } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { apiBaseUrl } from "@/config/config";
import { ArrowRight } from "lucide-react";



export default function NewArrivals({ newArrivalsProducts }: { newArrivalsProducts: TProduct }) {

  return (
    <section className="Container">
      <div className="flex items-center mb-2 md:mb-8">
        <div className="flex items-center gap-2 text-[#D4A373]">
          <svg
            className="w-16 h-16 md:w-10 md:h-10 font-bold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
        <h2 className="text-[#D4A373] text-2xl md:text-3xl lg:text-4xl font-light">
          New Arrivals
        </h2>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {newArrivalsProducts?.data?.result?.map((product: TProduct) => {
          const { slug, name, thumbnailImage, backViewImage, price, discountType, discount } = product;

          return (
            <SwiperSlide key={product._id}>
              <div className=" bg-white border border-gray-100 rounded-md">
                <Link
                  href={`product/${slug}`}
                  className="group relative  text-center shadow-md shadow-gray-200 overflow-hidden"
                >
                  <div className="relative h-[200px] md:h-[200px] 2xl:h-[300px]">
                    {/* Thumbnail Image */}
                    <Image
                      src={`${apiBaseUrl}${thumbnailImage}`}
                      alt={name}
                      fill
                      className={`rounded-md object-cover absolute inset-0 transition-opacity duration-500
                                ${backViewImage ? "group-hover:opacity-0" : ""}
                               `}
                    />

                    {/* Back View Image */}
                    {backViewImage && (
                      <Image
                        src={`${apiBaseUrl}${backViewImage}`}
                        alt={`${name} Back`}
                        fill
                        className="rounded-md object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    )}

                    {/* Discount Circle */}
                    {discountType && discount && (
                      <div className="absolute bottom-3 right-3 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                        {discountType === "percent" ? `${discount}%` : `৳ ${discount}`}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className=" text-xl font-medium text-secondaryt px-4 py-4">
                    <h3 className="text-left mt-3 text-[16px] md:text-md text-gray-800 line-clamp-2">{name}</h3>
                    <p className="text-left mt-3" style={{ fontVariantNumeric: "lining-nums" }}>
                      ৳ {price}
                    </p>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}

      </Swiper>
    </section>
  );
}

