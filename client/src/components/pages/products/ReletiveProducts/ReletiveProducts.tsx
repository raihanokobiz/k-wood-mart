import { rajdhani } from "@/app/font";

import ProductCard from "../ProductCard/ProductCard";
import { TProduct } from "@/types";
import React from "react";

interface Products {
  relativeProducts: TProduct[];
}

const ReletiveProducts: React.FC<Products> = async ({ relativeProducts }) => {
  return (
    <div className="mb-12 pb-6 px-4 md:px-6 lg:px-8 2xl:px-12">
      <div className="relative mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4A373] to-[#CCD5AE] rounded-lg flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h2 className={`text-3xl font-bold text-[#262626] ${rajdhani.className}`}>
              Related Products
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#D4A373]/30 to-transparent"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 md:gap-10 mt-8">
        {relativeProducts?.slice(0, 12).map((product) => (
          <ProductCard
            key={product?._id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default ReletiveProducts;
