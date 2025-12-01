"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TProduct } from "@/types";
import { apiBaseUrl } from "@/config/config";
import Image from "next/image";
import Link from "next/link";

interface SpecialFurnitureProps {
  specialProducts: {
    data: {
      result: {
        products: TProduct[];
      };
    };
  };
}


const SpecialFurniture = ({ specialProducts }: SpecialFurnitureProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      <div className=" bg-gray-100 py-12 px-4 md:px-8 lg:px-16">
        <div className=" grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left Side - Text Content */}
          <div className="lg:col-span-4 text-center lg:text-right space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
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
            <div className="relative bg-white rounded shadow-lg overflow-hidden w-[600px] h-[500px] mx-auto aspect-square">
              <Image
                src={`${apiBaseUrl}${specialProducts?.data?.result?.childCategory?.image}`}
                alt={specialProducts.data.result.products[currentIndex].name}
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
              <div className="flex gap-3 overflow-hidden">
                {specialProducts?.data?.result?.products.slice(0, 4).map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer ${currentIndex === index ? 'ring-2 ring-amber-900' : ''
                      }`}
                  >
                    <div className="relative w-[250px] h-[250px] rounded">
                      <Image
                        src={`${apiBaseUrl}${item?.thumbnailImage}`}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
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
