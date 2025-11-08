import Image from "next/image";
import React from "react";
import P1 from "../../../assets/emi/P1.jpg";
import P2 from "../../../assets/emi/P2.webp";
import P3 from "../../../assets/emi/P3.webp";

export default function Pic() {
  return (
    <div className="bg-[#e7e1db]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className=" overflow-hidden shadow-sm relative h-64">
            <Image
              src={P1}
              alt="Description of image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className=" overflow-hidden shadow-sm relative h-64">
            <Image
              src={P2}
              alt="Description of image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className=" overflow-hidden shadow-sm relative h-64">
            <Image
              src={P3}
              alt="Description of image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
        <div className="mt-10 bg-white/80 backdrop-blur-sm rounded-xl shadow p-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#8B4513]">
            Own Your Dream Furniture Now, Pay Over 3 Months with 0% EMI
          </h2>
          <div className="h-1 w-16 bg-[#8B4513] mx-auto rounded-full mt-3" />
          <p className="mt-4 text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Make your home the way you’ve always imagined without waiting. With
            ISHO’s 0% EMI for 3 Months offer, you can bring home your favourite
            furniture today and spread the payment over three months, without
            paying a single taka in interest.
          </p>
        </div>
      </div>
    </div>
  );
}
