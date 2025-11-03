"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FurnitureShowcaseFull() {
  const [startTableAnimation, setStartTableAnimation] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2 mb-12">
      {/* Left Image - Chair */}
      <motion.div
        className="relative w-full h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        onAnimationComplete={() => setStartTableAnimation(true)}
      >
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
          alt="Premium Chair"
          className="w-full h-full object-cover"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-1/4 left-1/4 text-left"
        >
          <h2 className="text-5xl font-bold text-red-600 mb-2">Premium</h2>
          <h3 className="text-2xl md:text-3xl font-light text-white">
            Seating Collection
          </h3>
          <div className="w-24 h-1 bg-red-600 mt-4" />
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-12 left-12 bg-red-100/30 backdrop-blur-md px-6 py-3 rounded-full border border-red-200"
        >
          <p className="text-sm text-white">Starting from</p>
          <p className="text-2xl font-bold text-red-600">৳12,999</p>
        </motion.div>
      </motion.div>

      {/* Right Image - Table */}
      <motion.div
        className="relative w-full h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: startTableAnimation ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        <img
          src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&q=80"
          alt="Elegant Table"
          className="w-full h-full object-cover"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={startTableAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-1/4 right-1/4 text-right"
        >
          <h2 className="text-5xl font-bold text-red-600 mb-2">Elegant</h2>
          <h3 className="text-2xl md:text-3xl font-light text-white">
            Dining Tables
          </h3>
          <div className="w-24 h-1 bg-red-600 mt-4 ml-auto" />
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={startTableAnimation ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-12 right-12 bg-red-100/30 backdrop-blur-md px-6 py-3 rounded-full border border-red-200"
        >
          <p className="text-sm text-white">Starting from</p>
          <p className="text-2xl font-bold text-red-600">৳24,999</p>
        </motion.div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-12 left-0 right-0 p-8 text-center"
      >
        <button className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105">
          Explore Collection
        </button>
      </motion.div>
    </div>
  );
}
