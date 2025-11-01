"use client";
import Image from "next/image";

export default function ProductCard({ name, image, price }) {
    return (
        <div
            className="bg-white shadow-md shadow-gray-400 rounded  text-center hover:shadow-lg transition-shadow"
        >
            <div className=" relative h-[400px] mb-4">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="mx-auto mb-4"
                />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-secondary text-left px-4">
                {name}
            </h3>
            <p className="text-base text-secondary text-right px-8 pb-4" style={{ fontVariantNumeric: 'lining-nums' }}>
                ৳ {price}
            </p>
        </div>
    );
}
