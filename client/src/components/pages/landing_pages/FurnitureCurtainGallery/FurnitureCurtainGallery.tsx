"use client";
import { apiBaseUrl } from '@/config/config';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { motion } from "framer-motion";

interface Item {
  name: string;
  slug: string;
  image: string;
  categoryRef?: {
    name?: string;
  };
}

interface GalleryProps {
  response: {
    data: Item[];
  };
}


export default function FurnitureCurtainGallery({ response } : GalleryProps) {

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
    <section className="px-4 md:px-6 lg:px-8 2xl:px-12">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LEFT BIG IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href={makeLink(first)}
              className="relative group overflow-hidden shadow-xl h-[300px] md:h-[400px] lg:h-[80vh] block"
            >
              {first && (
                <>
                  <Image
                    src={apiBaseUrl + first.image}
                    alt={first.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-102 rounded-md"
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
          </motion.div>
          {/* RIGHT COLUMN */}
          <div className="flex flex-row lg:flex-col gap-4 h-[180px] md:h-[400px] lg:h-[80vh]">

            {/* TOP SMALL IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <Link
                href={makeLink(second)}
                className="relative group overflow-hidden shadow-xl h-full block"
              >
                {second && (
                  <>
                    <Image
                      src={apiBaseUrl + second.image}
                      alt={second.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-102 rounded-md"
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
            </motion.div>

            {/* BOTTOM SMALL IMAGE */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1"
            >
              <Link
                href={makeLink(third)}
                className="relative group overflow-hidden shadow-xl h-full block"
              >
                {third && (
                  <>
                    <Image
                      src={apiBaseUrl + third.image}
                      alt={third.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-102 rounded-md"
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
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
