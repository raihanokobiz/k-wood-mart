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
          <ProductCard
            key={product?._id}
            slug={product?.slug}
            thumbnailImage={product?.thumbnailImage}
            backViewImage={product?.backViewImage}
            name={product?.name}
            price={product?.price}
            discountType={product?.discountType}
            discount={product?.discount}
          />
        ))}
      </div>
    </div>
  );
};

export default ReletiveProducts;
