"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { apiBaseUrl } from "@/config/config";

interface Banner {
  _id: string;
  image: string;
  link?: string;
  type: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BannerSlider2({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [showBubbles, setShowBubbles] = useState(false);

  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const timer = setInterval(() => {
      setShowBubbles(true);
      setTimeout(() => {
        setShowBubbles(false);
        setIndex((prev) => (prev + 1) % banners.length);
      }, 1000);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20">No banners found</div>
    );
  }

  const currentBanner = banners[index];

  return (
    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Banner Image */}
          <Image
            src={apiBaseUrl + currentBanner.image}
            alt={`banner-${index}`}
            fill
            className="object-cover"
            priority
          />

          {/* Gradient Overlay (WoodMart style) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* Floating Bubble Effect */}
          {showBubbles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 md:w-4 md:h-4 bg-white/10 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: "0%",
                  }}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{
                    y: -Math.random() * 300 - 100,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* 🪵 WoodMart Furniture & Curtain Style Text */}
          <div className="absolute inset-0 flex flex-col justify-center items-start z-10 px-6 sm:px-12 lg:px-24 max-w-3xl">
            <motion.h2
              className="text-white/90 text-sm sm:text-base md:text-lg tracking-[6px] uppercase font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Elegant Furniture & Curtains
            </motion.h2>

            <motion.h1
              className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold mt-4 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Redefine Your <br className="hidden sm:block" /> Living Experience
            </motion.h1>

            <motion.p
              className="text-white/80 text-sm sm:text-base md:text-lg max-w-md mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              Discover timeless furniture & premium curtains designed to bring
              comfort and luxury into your home.
            </motion.p>

            {currentBanner?.link && currentBanner.link !== "undefined" && (
              <motion.a
                href={currentBanner.link}
                className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold text-sm md:text-base uppercase rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3 }}
              >
                Explore Collection
              </motion.a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
