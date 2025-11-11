"use client";
import { apiBaseUrl } from "@/config/config";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ slug, name, thumbnailImage, backViewImage, price ,discountType, discount}) {
  return (
    <Link
      href={`product/${slug}`}
      className="group relative bg-white border border-gray-100 rounded-md text-center shadow-md shadow-gray-200 overflow-hidden"
    >
      <div className="relative h-[150px] md:h-[200px] 2xl:h-[250px]">
        {/* Thumbnail Image */}
        <Image
          src={`${apiBaseUrl}${thumbnailImage}`}
          alt={name}
          fill
          className="rounded-md object-cover transition-opacity duration-500 group-hover:opacity-0"
        />

        {/* Back View Image */}
        {backViewImage && (
          <Image
            src={`${apiBaseUrl}${backViewImage}`}
            alt={`${name} Back`}
            fill
            className="rounded-md object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {/* Discount Circle */}
        {discountType && discount && (
          <div className="absolute bottom-3 right-3 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
            {discountType === "percent" ? `${discount}%` : `৳ ${discount}`}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="text-xl font-medium text-secondaryt px-4 py-4">
        <h3 className="text-left text-md text-gray-800">{name}</h3>
        <p className="text-left mt-4" style={{ fontVariantNumeric: "lining-nums" }}>
          ৳ {price}
        </p>
      </div>
    </Link>
  );
}
