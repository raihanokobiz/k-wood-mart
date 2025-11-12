import { apiBaseUrl } from '@/config/config';
import { getThreeSubCategorys } from '@/services/subCategorys';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function FurnitureCurtainGallery() {

  const threeData = await getThreeSubCategorys();

  if (!threeData?.data || threeData.data.length < 3) {
    return (
      <section className="pb-6 md:pb-8 2xl:pb-12 px-4 md:px-6 lg:px-8 2xl:px-12">
        <p className="text-center text-gray-500">No subcategories available.</p>
      </section>
    );
  }


  return (
    <section className="pb-6 md:pb-8 2xl:pb-12 px-4 md:px-6 lg:px-8 2xl:px-12">
      <div className="mx-auto">
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Single Large Image */}
          <Link
            href={`furniture?subCategory=${threeData?.data[0]?.slug}`}
            className="relative group overflow-hidden shadow-xl lg:h-screen block"
          >
            <div className="relative w-full h-full">
              <Image
                src={apiBaseUrl + threeData?.data[0]?.image}
                alt={threeData?.data[0]?.name || 'Furniture'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-bold mb-2">{threeData?.data[0]?.name}</h3>
                <p className="text-gray-200">Luxury sofas and modern designs</p>
              </div>
            </div>
          </Link>

          {/* Right Column - Two Stacked Images */}
          <div className="flex flex-col gap-6 lg:h-screen">
            {/* Top Image */}
            <Link
              href={`furniture?subCategory=${threeData?.data[1]?.slug}`}
              className="relative group overflow-hidden shadow-xl flex-1 block"
            >
              <div className="relative w-full h-full">
                <Image
                  src={apiBaseUrl + threeData?.data[1]?.image}
                  alt={threeData?.data[1]?.name || 'Curtains'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-1">{threeData?.data[1]?.name}</h3>
                  <p className="text-gray-200 text-sm">Elegant window treatments</p>
                </div>
              </div>
            </Link>

            {/* Bottom Image */}
            <Link
              href={`furniture?subCategory=${threeData?.data[2]?.slug}`}
              className="relative group overflow-hidden shadow-xl flex-1 block"
            >
              <div className="relative w-full h-full">
                <Image
                  src={apiBaseUrl + threeData?.data[2]?.image}
                  alt={threeData?.data[2]?.name || 'Furniture'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-1">{threeData?.data[2]?.name}</h3>
                  <p className="text-gray-200 text-sm">Complete bedroom solutions</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
