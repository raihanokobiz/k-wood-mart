"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function FurnitureShowcaseFull() {
  const [startTableAnimation, setStartTableAnimation] = useState(false);

  return (
    <div className="relative w-full">
      {/* Container with proper grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Image - Chair */}
        <motion.div
          className="relative w-full h-[50vh] md:h-[80vh] 2xl:h-[800px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          onAnimationComplete={() => setStartTableAnimation(true)}
        >
          <div className="w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
              alt="Premium Chair"
              className="w-full h-full object-cover"
              fill
            />
          </div>
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute top-1/4 left-8 lg:left-1/4 text-left"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-red-600 mb-2">Premium</h2>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-light text-white">
              Seating Collection
            </h3>
            <div className="w-24 h-1 bg-red-600 mt-4" />
          </motion.div>
          {/* Price */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 lg:bottom-12 left-8 lg:left-12 bg-white/20 backdrop-blur-md px-6 lg:px-8 py-3 lg:py-4 rounded-full border border-white/30"
          >
            <p className="text-base lg:text-lg font-semibold text-white">Modern Collection</p>
          </motion.div>
        </motion.div>

        {/* Right Image - Table */}
        <motion.div
          className="relative w-full h-[50vh] md:h-[80vh] 2xl:h-[800px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: startTableAnimation ? 1 : 0 }}
          transition={{ duration: 1.5 }}
        >
          <div className="w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&q=80"
              alt="Elegant Table"
              className="w-full h-full object-cover"
              fill
            />
          </div>
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={
              startTableAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }
            }
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute top-1/4 md:right-8 left-8 lg:right-1/4 text-right"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-red-600 mb-2">Elegant</h2>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-light text-white text-left md:text-right">
              Dining Tables
            </h3>
            <div className="w-24 h-1 bg-red-600 mt-4 md:ml-auto" />
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 lg:bottom-12 right-8 lg:right-12 bg-white/20 backdrop-blur-md px-6 lg:px-8 py-3 lg:py-4 rounded-full border border-white/30"
          >
            <p className="text-base lg:text-lg font-semibold text-white">Modern Collection</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}