"use client";
import { apiBaseUrl } from "@/config/config";
import Image from "next/image";

export default function ProductCard({ name, thumbnailImage, price }) {
    return (
        <div
            className="bg-white  text-center mb-8"
        >
            <div className=" relative h-[400px] mb-4">
                <Image
                    src={`${apiBaseUrl}${thumbnailImage}`}
                    alt={name}
                    fill
                    className="mx-auto mb-4"
                />
            </div>
            <div className="flex items-center justify-between text-xl font-medium text-secondary text-secondaryt p-4 ">
                <h3 className="">
                    {name}
                </h3>
                <p className="" style={{ fontVariantNumeric: 'lining-nums' }}>
                    ৳ {price}
                </p>
            </div>
        </div>
    );
}
