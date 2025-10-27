import { apiBaseUrl } from "@/config/config";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import "../ProductCard/ProductCard.css";

interface Props {
  product: {
    thumbnailImage: string;
    name: string;
    mrpPrice: number;
    price: number;
    slug: string;
    inventoryRef: any;
  };
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { thumbnailImage, name, slug, inventoryRef } = product;
  console.log("product card", product);

  return (
    <div className="productcard">
      <Link href={`/product/${slug}`}>
        <div className="relative group rounded ">
          <div className="absolute top-0 rounded left-0 h-[2px] w-full bg-[#D4A373] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 z-10"></div>
          <div className=" rounded-t overflow-hidden">
            {thumbnailImage && (
              <Image
                src={apiBaseUrl + thumbnailImage}
                alt="image"
                width={300}
                height={300}
                className="rounded-t h-full w-full object-cover group-hover:scale-105 duration-300"
              />
            )}
          </div>

          <div className="">
            <div className="text-[12px] font-semibold flex-col bg-[#fff]  w-full  m-auto rounded-b-md shadow px-4 py-1 z-50 flex  gap-1 justify-center items-center">
              <h2 className="line-clamp-1">{name}</h2>
              <div className="flex gap-2">
                <p className="flex items-center gap-1">
                  <span>৳</span>{" "}
                  <span>{Number(inventoryRef?.[0]?.price).toFixed(2)}</span>
                </p>{" "}
                {/* <p className="line-through text-[#262626]/60 flex items-center gap-1">
                {inventoryRef?.[0]?.mrpPrice && (<span>৳</span> <span>{Number(mrpPrice).toFixed(2)}</span>)}
                  
                </p> */}
                {inventoryRef?.[0]?.mrpPrice && (
                  <p className="line-through text-[#262626]/60 flex items-center gap-1">
                    <span>৳</span>{" "}
                    <span>
                      {Number(inventoryRef?.[0]?.mrpPrice).toFixed(2)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
