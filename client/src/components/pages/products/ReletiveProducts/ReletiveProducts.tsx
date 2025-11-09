import { rajdhani } from "@/app/font";

import ProductCard from "../ProductCard/ProductCard";
import { TProduct } from "@/types";
import React from "react";
import Image from "next/image";
import { apiBaseUrl } from "@/config/config";

interface Products {
  relativeProducts: TProduct[];
}

const ReletiveProducts: React.FC<Products> = async ({ relativeProducts }) => {
  return (
    <div className="my-12 Container">
      <h2
        className={`text-xl font-semibold border-b pb-3 ${rajdhani.className}`}
      >
        Related Products :
      </h2>

      <div className="grid xl:grid-cols-4 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2 mt-8">
        {relativeProducts?.slice(0, 12).map((product) => (
          <div
          key={product?._id}
            className="bg-white  text-center mb-8"
          >
            <div className=" relative h-[400px] mb-4">
              <Image
                src={`${apiBaseUrl}${product?.thumbnailImage}`}
                alt={product?.name}
                fill
                className="mx-auto mb-4"
              />
            </div>
            <div className="flex items-center justify-between text-xl font-medium text-secondary text-secondaryt p-4 ">
              <h3 className="">
                {product?.name}
              </h3>
              <p className="" style={{ fontVariantNumeric: 'lining-nums' }}>
                ৳ {product?.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReletiveProducts;
