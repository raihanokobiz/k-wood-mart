"use client";
import Image from "next/image";
import React, { useState } from "react";
import ProductDialog from "../ProductDialog/ProductDialog";
import { apiBaseUrl } from "@/config/config";
import Link from "next/link";
import { TProduct } from "@/types";
import { motion, useAnimation } from "framer-motion";
import Lottie from "lottie-react";
import cardImageLoading from "@/assets/animation/card-loading.json";

interface Product {
  product: TProduct;
}

const PerfurmCard: React.FC<Product> = ({ product }) => {
  const {
    name,
    thumbnailImage,
    backViewImage,
    inventoryRef,
    inventoryType,
    slug,
    _id,
    gender,
    brandRef,
  } = product;

  console.log("for find product inventoryRef", inventoryRef);

  const controls = useAnimation();
  const [imageLoaded, setImageLoaded] = useState({
    back: false,
    front: false,
  });

  const handleHoverStart = () => {
    controls.start({ x: "0", opacity: 0 });
  };

  const handleHoverEnd = () => {
    controls.start({ x: 0, opacity: 1 });
  };

  return (
    <div className="group">
      <div
        className="overflow-hidden shadow transition border border-[#262626]/0 group-hover:border-[#CCD5AE]/70 rounded"
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        <div className="relative w-full overflow-hidden aspect-square">
          <Link href={`product/${slug}`}>
            <div className="relative w-full h-full">
              {/* Lottie loader until both images loaded */}
              {thumbnailImage && backViewImage
                ? (!imageLoaded.back || !imageLoaded.front) && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white z-10">
                      <div className="w-24 h-24">
                        <Lottie
                          animationData={cardImageLoading}
                          loop
                          autoplay
                        />
                      </div>
                    </div>
                  )
                : !imageLoaded.front && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white z-10">
                      <div className="w-24 h-24">
                        <Lottie
                          animationData={cardImageLoading}
                          loop
                          autoplay
                        />
                      </div>
                    </div>
                  )}

              {backViewImage && (
                <Image
                  src={apiBaseUrl + backViewImage}
                  alt={`${name} backViewImage`}
                  width={500}
                  height={500}
                  onLoad={() =>
                    setImageLoaded((prev) => ({ ...prev, back: true }))
                  }
                  className="w-full h-full object-cover group-hover:scale-110 duration-500"
                />
              )}

              {thumbnailImage && backViewImage ? (
                <motion.div
                  className="absolute top-0 left-0 w-full h-full"
                  initial={{ x: 0, opacity: 1 }}
                  animate={controls}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Image
                    src={apiBaseUrl + thumbnailImage}
                    alt={`${name} thumbnailImage`}
                    width={500}
                    height={500}
                    onLoad={() =>
                      setImageLoaded((prev) => ({ ...prev, front: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ) : (
                <Image
                  src={apiBaseUrl + thumbnailImage}
                  alt={`${name} thumbnailImage`}
                  width={500}
                  height={500}
                  onLoad={() =>
                    setImageLoaded((prev) => ({ ...prev, front: true }))
                  }
                  className="w-full h-full object-cover relative"
                />
              )}

              {brandRef?.name && (
                <p className="text-[#fff] text-[12px] absolute top-2 right-2 z-10 bg-[#D4A373] rounded p-1 lowercase">
                  {brandRef?.name}
                </p>
              )}
            </div>
          </Link>
        </div>

        <div className="flex flex-col  justify-between py-4 px-4">
          <Link href={`product/${slug}`}>
            <div className="">
              <h2 className="text-base font-medium line-clamp-1 capitalize">
                {name}
              </h2>
              <div className="flex items-center gap-1 lowercase text-[#D4A373]">
                <p>{gender}</p>
              </div>
              <div className="relative pt-1">
                {/* <div className="inline-flex item-center justify-center gap-2 xl:text-base lg:text-[12px] text-base ">
                  <p className="flex  items-center gap-1">
                    <span>৳ {Number(inventoryRef?.[0]?.price).toFixed(2)}</span>
                  </p>
                  {inventoryRef?.[0]?.mrpPrice && (
                    <p className="line-through text-[red]">
                      <span>৳</span>{" "}
                      <span>
                        {Number(inventoryRef?.[0]?.mrpPrice).toFixed(2)}
                      </span>
                    </p>
                  )}
                </div> */}

                {Array.isArray(inventoryRef) ? (
                  <div className="inline-flex items-center justify-center gap-2 xl:text-base lg:text-[12px] text-base">
                    <p className="flex items-center gap-1">
                      <span>৳ {inventoryRef[0]?.price}</span>
                    </p>
                    {inventoryRef[0]?.price !== inventoryRef[0]?.mrpPrice && (
                      <p className="line-through text-[red]">
                        <span>৳</span>{" "}
                        <span>
                          {Number(inventoryRef[0]?.mrpPrice).toFixed(2)}
                        </span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center gap-2 xl:text-base lg:text-[12px] text-base">
                    <p className="flex items-center gap-1">
                      <span>৳ {inventoryRef?.price}</span>
                    </p>
                    {/* {inventoryRef?.mrpPrice && (
                      <p className="line-through text-[red]">
                        <span>৳</span>{" "}
                        <span>{Number(inventoryRef?.mrpPrice).toFixed(2)}</span>
                      </p>
                    )} */}

                    {inventoryRef.price !== inventoryRef.mrpPrice && (
                      <p className="text-red-600 line-through">
                        ৳ {inventoryRef.mrpPrice}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>

          <div className="">
            <ProductDialog
              name={name}
              productRef={_id}
              thumbnailImage={thumbnailImage}
              inventoryRef={
                Array.isArray(inventoryRef) ? inventoryRef : [inventoryRef]
              }
              inventoryType={inventoryType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfurmCard;
