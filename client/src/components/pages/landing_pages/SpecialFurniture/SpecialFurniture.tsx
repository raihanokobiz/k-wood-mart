"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FurnitureItem {
  id: number;
  name: string;
  image: string;
  price: string;
}

const SpecialFurniture = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const furnitureItems: FurnitureItem[] = [
    {
      id: 1,
      name: "Andaman-184",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      price: "BDT 36,100",
    },
    {
      id: 2,
      name: "Andaman-279",
      image:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop",
      price: "BDT 39,150",
    },
    {
      id: 3,
      name: "Lucam-308",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      price: "BDT 18,468",
    },
    {
      id: 4,
      name: "Kennett-313",
      image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop",
      price: "BDT 32,250",
    },
    {
      id: 5,
      name: "Modern-405",
      image:
        "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&h=400&fit=crop",
      price: "BDT 28,900",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % furnitureItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + furnitureItems.length) % furnitureItems.length
    );
  };

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < 4; i++) {
      items.push(furnitureItems[(currentIndex + i) % furnitureItems.length]);
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Choose what resonates with your uniqueness
            </h1>
            <p className="text-gray-600 text-lg md:text-xl">
              Organize every space with our timeless furniture collections
            </p>
            <div>
              <button className="inline-flex items-center gap-2 text-gray-900 font-medium text-lg border-b-2 border-gray-900 pb-1 hover:border-amber-900 hover:text-amber-900 transition-colors">
                Explore Now
              </button>
            </div>
          </div>

          {/* Right Side - Featured Image */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=500&fit=crop"
                alt="Featured Furniture"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Bottom Carousel */}
        <div className="mt-16 relative">
          <div className="flex items-center justify-center gap-4">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-shadow"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Carousel Items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 max-w-5xl">
              {getVisibleItems().map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">{item.name}</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Starts from{" "}
                      <span className="text-amber-900">{item.price}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition-shadow"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialFurniture;
