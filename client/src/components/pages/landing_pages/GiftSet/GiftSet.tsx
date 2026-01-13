import { TProduct } from "@/types";
import React from "react";
import icon from "@/assets/images/perfume_bottal.png";
import PerfurmCard from "../../products/PerfurmCard/PerfurmCard";
import Image from "next/image";
interface ProductsProps {
  products: {
    category: TProduct;
    data: TProduct[];
  };
}
const GiftSet: React.FC<ProductsProps> = ({ products }) => {
  console.log("best slele", products);
  return (
    <div className="Container pt-12 pb-12">
      <div className="flex items-center justify-center pb-2 relative w-[40px] h-[40px] mx-auto">
        <span className="absolute top-[-6px]  left-[-4px]  w-3 h-3 border-t-4 border-l-4  border-[#D4A373] rounded-tl-md transition-all duration-300"></span>

        {/* Top-right corner */}
        <span className="absolute top-[-6px]  right-[-4px]  w-3 h-3 border-t-4 border-r-4  border-[#D4A373] rounded-tr-md transition-all duration-300"></span>

        {/* Bottom-left corner */}
        <span className="absolute bottom-0  left-[-4px]  w-3 h-3 border-b-4 border-l-4  border-[#D4A373] rounded-bl-md transition-all duration-300"></span>

        {/* Bottom-right corner */}
        <span className="absolute bottom-0  right-[-4px]  w-3 h-3 border-b-4 border-r-4  border-[#D4A373] rounded-br-md transition-all duration-300"></span>
        <Image src={icon} width={35} height={35} alt="icon" className="p-0.5" />
      </div>
      <h2 className="text-center text-2xl font-semibold uppercase mt-2">
        Discount Products
      </h2>

      <div className="grid lg:grid-cols-5 py-8 gap-4">
        {products?.data?.slice(0, 5).map((product) => (
          <PerfurmCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default GiftSet;
