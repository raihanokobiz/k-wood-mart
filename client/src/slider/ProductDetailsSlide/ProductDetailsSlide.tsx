"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { apiBaseUrl } from "@/config/config";

interface Props {
  thumbnailImage: string;
  backViewImage?: string;
  images?: string[];
  name: string;
  controls: any;
  videoUrl?: string; // ✅ Add this
}

const getYoutubeThumbnail = (url) => {
  const videoId = url.split("v=")[1];
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
};

const ProductDetailsSlide: React.FC<Props> = ({
  thumbnailImage,
  backViewImage,
  images = [],
  name,
  controls,
  videoUrl,
}) => {
  // ✅ Store all previewable items (images + video)
  const allMedia = [
    apiBaseUrl + thumbnailImage,
    ...(backViewImage ? [apiBaseUrl + backViewImage] : []),
    ...images.map((img) => apiBaseUrl + img),
    ...(videoUrl ? [videoUrl] : []), // ✅ Add video as last item
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedItem = allMedia[selectedIndex];
  const isVideo = selectedItem?.includes("youtube.com");

  return (
    <div className="space-y-4">
      {/* Main preview area */}
      <div className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-2xl shadow-md bg-gray-100">
        {isVideo ? (
          <iframe
            src={selectedItem.replace("watch?v=", "embed/")}
            title="Product Video"
            allowFullScreen
            className="w-full h-full rounded-2xl"
          ></iframe>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full"
          >
            <Image
              src={selectedItem}
              alt={name}
              fill
              className="object-cover w-full h-full"
            />
          </motion.div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto">
        {allMedia.map((item, index) => {
          const isVideoThumb = item.includes("youtube.com");
          return (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === selectedIndex
                  ? "border-[#D4A373] scale-105 shadow-md"
                  : "border-transparent hover:border-[#D4A373]/50"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              {isVideoThumb ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={getYoutubeThumbnail(item)}
                    alt="Video Thumbnail"
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  {/* Overlay play icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <Image
                  src={item}
                  alt={`${name} thumbnail ${index}`}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDetailsSlide;
