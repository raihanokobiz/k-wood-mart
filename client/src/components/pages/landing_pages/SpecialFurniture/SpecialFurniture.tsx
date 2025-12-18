"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TProduct } from "@/types";
import { apiBaseUrl } from "@/config/config";
import Image from "next/image";

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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % specialProducts.data.result.products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + specialProducts.data.result.products.length) %
      specialProducts.data.result.products.length
    );
  };

  return (
    <div className="Container">
      <div className=" bg-gray-100 py-6 md:py-12 px-4 md:px-8 lg:px-16">
        <div className=" grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left Side - Text Content */}
          <div className="lg:col-span-4 text-center lg:text-right space-y-3 md:space-y-6">
            <h1 className=" text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Discover Your Perfect  Style
            </h1>
            <p className="text-gray-600 text-lg md:text-xl">
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
            <div className="relative bg-white rounded shadow-lg overflow-hidden w-[300px] sm:w-[350px] md:w-[500px] lg:w-[700px] h-[300px] md:h-[400px] lg:h-[500px] mx-auto aspect-square">
              <Image
                src={`${apiBaseUrl}${specialProducts?.data?.result?.childCategory?.image}`}
                alt={specialProducts.data.result.products[currentIndex].name ?? "product"}
                fill
                className="object-cover"
              />
            </div>
            {/* Carousel */}
            <div className="flex items-center justify-center gap-3">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white shadow hover:shadow-md flex items-center justify-center transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              {/* Carousel Items */}
              <div className="flex gap-3 overflow-hidden rounded-md">
                {specialProducts?.data?.result?.products.slice(0, 4).map((item, index) => (
                  <div
                    key={`${item._id}-${index}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`bg-white w-[200px] h-[200px] md:w-[200px] md:h-[230px] rounded-md overflow-hidden cursor-pointer transition-all ${currentIndex === index ? '' : ''
                      }`}
                  >
                    <div className="relative w-[200px] h-[200px] md:w-[200px] md:h-[170px]">
                      <Image
                        src={`${apiBaseUrl}${item?.thumbnailImage}`}
                        alt={item?.name ?? "product"}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="p-3 text-center mt-1">
                      {item.set?.[0]?.setName && (
                        <p className="text-sm text-gray-500 truncate">{item?.set?.[0]?.setName}</p>
                      )}
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {item?.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white shadow hover:shadow-md flex items-center justify-center transition-all"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialFurniture;
