"use client";
import Image from "next/image";
import { apiBaseUrl } from "@/config/config";
import Link from "next/link";
import { motion, Variants, Transition } from "framer-motion";

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

interface SignatureCollectionsProps {
  subCategorysData: {
    data: Collection[];
  };
}

export default function SignatureCollections({ subCategorysData }: SignatureCollectionsProps) {

  // Transition helpers
  const defaultTransition: Transition = { duration: 0.6, ease: "easeOut" as const };

  // Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const leftColumnVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: defaultTransition }
  };

  return (
    <section className="Container">
      <motion.div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 text-center mb-8 mt-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Left Column - Heading & Description */}
        <motion.div className="col-span-1 flex flex-col justify-center items-end text-left px-4 md:px-0"
          variants={leftColumnVariants}
        >
          <h2 className="Title">
            Crafted for Inspired Living
          </h2>
          <p className="Description">
            Thoughtfully designed to fit your unique space
          </p>
          <Link
            href="/collections"
            className="ExploreButton"
          >
            Explore Now
            <motion.svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </motion.svg>
          </Link>
        </motion.div>

        {/* Right Column - Collection Cards */}
        <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 rounded-md">
          {subCategorysData?.data?.slice(0, 6).map((collection: Collection, idx: number) => {
            const categoryName = collection?.categoryRef?.name?.toLowerCase() || "";
            const basePath = categoryName.includes("curtain") ? "/curtains" : "/furniture";

            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" as const } }}
              >
                <Link href={`${basePath}?subCategory=${collection.slug}`} className="group block rounded-md">
                  <div className="relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square">
                      <Image
                        src={`${apiBaseUrl + collection?.image}`}
                        alt={collection?.name || "Collection image"}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 rounded-md"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-6 py-2.5 bg-white text-amber-900 rounded-full text-sm font-semibold shadow-lg hover:bg-amber-50 transition-colors">
                          {collection?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
