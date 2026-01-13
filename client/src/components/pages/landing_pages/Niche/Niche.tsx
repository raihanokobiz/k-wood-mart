import { TProduct } from "@/types";
import React from "react";
import PerfurmCard from "../../products/PerfurmCard/PerfurmCard";
interface ProductsProps {
  products: {
    category: TProduct;
    data: TProduct[];
  };
}
const Niche: React.FC<ProductsProps> = ({ products }) => {
  console.log("best slele", products);
  return (
    <div className="Container pt-12">
      <h2 className="text-center text-2xl font-semibold uppercase">
        NICHE FRAGRANCES
      </h2>

      <div className="grid lg:grid-cols-5 py-8 gap-4">
        {products?.data?.slice(0, 5).map((product) => (
          <PerfurmCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Niche;
