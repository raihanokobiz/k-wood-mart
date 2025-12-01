import Image from "next/image";
import { getAllSubCategorys } from "@/services/subCategorys";
import { apiBaseUrl } from "@/config/config";
import Link from "next/link";

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  image: string;
  categoryRef?: {
    name?: string;
  };
  title?: string;
}

export default async function SignatureCollections() {
  const data = await getAllSubCategorys();
  



  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 text-center mb-8 mt-4">
      {/* Left Column - Heading & Description */}
      <div className="col-span-1 flex flex-col justify-center items-end text-left px-4 md:px-0">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-600 mb-4 text-right">
          Crafted for Inspired Living
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed text-right">
          Thoughtfully designed to fit your unique space
        </p>
        <Link
          href="/collections"
          className=" text-2xl  text-gray-700 inline-flex items-center gap-2 rounded-full font-medium  transition-colors"
        >
          Explore Now
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Right Column - Collection Cards */}
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {data?.data?.slice(0, 6).map((collection: Collection, idx: number) => {
          const categoryName =
            collection?.categoryRef?.name?.toLowerCase() || "";
          const basePath = categoryName.includes("curtain")
            ? "/curtains"
            : "/furniture";

          return (
            <Link
              key={idx}
              href={`${basePath}?subCategory=${collection.slug}`}
              className="group block"
            >
              <div className="relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative aspect-square">
                  <Image
                    src={`${apiBaseUrl + collection?.image}`}
                    alt={collection?.name || "Collection image"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-6 py-2.5 bg-white text-amber-900 rounded-full text-sm font-semibold shadow-lg hover:bg-amber-50 transition-colors">
                      {collection?.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
