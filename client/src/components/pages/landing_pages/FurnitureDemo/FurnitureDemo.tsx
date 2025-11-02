"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

export default function FurnitureDemo() {
  const [startTableAnimation, setStartTableAnimation] = useState(false);

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden grid grid-cols-2">
      {/* Left Grid - Chair এর জন্য */}
      <div className="relative flex items-center justify-center bg-slate-200">
        <motion.div
          className="absolute inset-0"
          initial={{ x: "100%", rotateY: 0 }}
          whileInView={{
            x: 0,
            rotateY: [0, 0, 180],
          }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 3,
            times: [0, 0.66, 1],
            ease: "easeInOut",
          }}
          onAnimationComplete={() => setStartTableAnimation(true)} // চেয়ার শেষ হলে table শুরু
          style={{ perspective: 1000 }}
        >
          <Image
            src="https://cdn.pixabay.com/photo/2017/02/17/06/17/konsyap-2073454_640.jpg"
            alt="Chair"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Right Grid - Table এর জন্য */}
      <div className="relative flex items-center justify-center bg-slate-100">
        <motion.div
          className="absolute inset-0"
          initial={{ x: "100%" }}
          animate={startTableAnimation ? { x: 0 } : { x: "100%" }} // state এর উপর depend করে
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <Image
            src="https://cdn.pixabay.com/photo/2014/09/17/20/26/restaurant-449952_640.jpg"
            alt="Table"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </div>
  );
}
