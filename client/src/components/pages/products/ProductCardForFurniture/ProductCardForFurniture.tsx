import { apiBaseUrl } from "@/config/config";
import Image from "next/image";
import Link from "next/link";

export default function ProductCardForFurniture({ product }) {
  const {
    name,
    thumbnailImage,
    price,
    backViewImage,
    inventoryRef,
    inventoryType,
    slug,
    _id,
    brandRef,
  } = product;

  return (
    <Link href={`product/${slug}`}>
      <div
        key={product._id}
        className="border border-gray-200 rounded hover:shadow-lg transition"
      >
        <div className="relative h-40 md:h-60 lg:h-96 2xl:h-[500px] mb-3">
          <Image
            src={apiBaseUrl + thumbnailImage}
            fill
            alt={name}
            className="object-cover object-center rounded-t"
          />
        </div>
        <div className="p-4 flex justify-between items-center">
          <h3 className=" text-lg lg:text-2xl font-medium text-black">
            {name}
          </h3>
          <p className="text-red-600 text-lg lg:text-2xl font-medium">
            ৳ {price}
          </p>
        </div>
      </div>
    </Link>
  );
}
