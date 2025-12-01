import { apiBaseUrl } from '@/config/config';
import { getThreeSubCategorys } from '@/services/subCategorys';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function FurnitureCurtainGallery() {
  const response = await getThreeSubCategorys();
  const items = response?.data || [];

  // Safe guards
  if (!items.length) return null;

  // Helper to generate correct link
  const makeLink = (item: any) => {
    if (!item?.slug) return "#";

    const name = item?.categoryRef?.name?.toLowerCase() || "";
    const base = name.includes("curtain") ? "/curtains" : "/furniture";

    return `${base}?subCategory=${item.slug}`;
  };

  // Easy short access
  const first = items[0];
  const second = items[1];
  const third = items[2];

  return (
    <section className="px-4 md:px-6 lg:px-8 2xl:px-12 lg:-mt-4">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* LEFT BIG IMAGE */}
          <Link
            href={makeLink(first)}
            className="relative group overflow-hidden shadow-xl lg:h-[80vh] block"
          >
            {first && (
              <>
                <Image
                  src={apiBaseUrl + first.image}
                  alt={first.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-bold mb-2">{first.name}</h3>
                    <p className="text-gray-200">Luxury sofas and modern designs</p>
                  </div>
                </div>
              </>
            )}
          </Link>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4 lg:h-[80vh]">

            {/* TOP SMALL IMAGE */}
            <Link
              href={makeLink(second)}
              className="relative group overflow-hidden shadow-xl flex-1 block"
            >
              {second && (
                <>
                  <Image
                    src={apiBaseUrl + second.image}
                    alt={second.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold mb-1">{second.name}</h3>
                      <p className="text-gray-200 text-sm">Elegant window treatments</p>
                    </div>
                  </div>
                </>
              )}
            </Link>

            {/* BOTTOM SMALL IMAGE */}
            <Link
              href={makeLink(third)}
              className="relative group overflow-hidden shadow-xl flex-1 block"
            >
              {third && (
                <>
                  <Image
                    src={apiBaseUrl + third.image}
                    alt={third.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold mb-1">{third.name}</h3>
                      <p className="text-gray-200 text-sm">Complete bedroom solutions</p>
                    </div>
                  </div>
                </>
              )}
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
