"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";


interface Props {
  // thumbnailImage: string;
  // backViewImage?: string;
  images?: string[];
  name: string;
  controls: any;
  videoUrl?: string; // ✅ Add this
}

const getYoutubeThumbnail = (url: string) => {
  const videoId = url.split("v=")[1];
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
};

const ProductDetailsSlide: React.FC<Props> = ({
  // thumbnailImage,
  // backViewImage,
  images = [],
  name,
  videoUrl,
}) => {
  //  Store all previewable items (images + video)
  const allMedia = [
    // apiBaseUrl + thumbnailImage,
    // ...(backViewImage ? [apiBaseUrl + backViewImage] : []),
    // ...images.map((img) => apiBaseUrl + img),
    // ...(videoUrl ? [videoUrl] : []), // Add video as last item
     ...images,  // ✅ এভাবে লেখো
  ...(videoUrl ? [videoUrl] : []),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedItem = allMedia[selectedIndex];
  const isVideo = selectedItem?.includes("youtube.com");

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Thumbnail Gallery - Vertical on large screens */}
      <div className="bg-gray-100 p-4 rounded-md order-2 lg:order-1">
        <div className="flex lg:flex-col flex-row gap-3 lg:max-h-[550px] overflow-x-auto lg:overflow-y-auto scrollbar-hide">
          {allMedia.map((item, index) => {
            const isVideoThumb = item.includes("youtube.com");
            const isSelected = index === selectedIndex;

            return (
              <motion.div
                key={index}
                whileTap={{ scale: 0.95 }}
                className={`relative flex-shrink-0 cursor-pointer rounded-md overflow-hidden transition-all duration-300`}
                onClick={() => setSelectedIndex(index)}
              >
                <div className="relative w-20 h-20 lg:w-36 lg:h-32">
                  {isVideoThumb ? (
                    <>
                      <Image
                        src={getYoutubeThumbnail(item)}
                        alt="Video Thumbnail"
                        fill
                        className="object-cover"
                      />
                      {/* Video Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-[#D4A373]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={item}
                      alt={`${name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 bg-[#D4A373] rounded-full p-1 shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                {/* Gradient overlay on unselected items */}
                {!isSelected && (
                  <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-all duration-300" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Main Preview Area */}
      <div className=" relative order-1 lg:order-2 w-full h-[300px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[80vh] rounded-md overflow-hidden shadow-md bg-gray-100">
        <AnimatePresence mode="wait">
          {isVideo ? (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <iframe
                src={selectedItem.replace("watch?v=", "embed/")}
                title="Product Video"
                allowFullScreen
                className="w-full h-full rounded-md"
              ></iframe>
            </motion.div>
          ) : (
            <motion.div
              key={`image-${selectedIndex}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <Image
                src={selectedItem}
                alt={`${name} - View ${selectedIndex + 1}`}
                fill
                className="object-cover p-4 w-full h-full rounded-md max-h-screen"
                priority={selectedIndex === 0}
              />

              {/* Image counter badge */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                {selectedIndex + 1} / {allMedia.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={() => setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : allMedia.length - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group z-10"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-700 group-hover:text-[#D4A373]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={() => setSelectedIndex(selectedIndex < allMedia.length - 1 ? selectedIndex + 1 : 0)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group z-10"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-700 group-hover:text-[#D4A373]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
            {allMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`transition-all duration-300 rounded-full ${index === selectedIndex
                  ? "w-8 bg-[#D4A373]"
                  : "w-2 bg-white/60 hover:bg-white/90"
                  } h-2`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
       }`}</style>
    </div>
  );
};

export default ProductDetailsSlide;
