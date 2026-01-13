import { Collection } from '@/components/pages/landing_pages/SignatureCollections/SignatureCollections';
import { apiBaseUrl } from '@/config/config';
import { getAllSubCategorys } from '@/services/subCategorys';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function Collections() {
    const { data } = await getAllSubCategorys();
    
    return (
        <div className="pb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {data?.slice(0, 8).map((collection: Collection, idx: number) => {
                    const categoryName = collection?.categoryRef?.name?.toLowerCase() || "";
                    const basePath = categoryName.includes("curtain") ? "/curtains" : "/furniture";

                    return (
                        <Link
                            key={idx}
                            href={`${basePath}?subCategory=${collection.slug}`}
                            className="group"
                        >
                            <div className="relative overflow-hidden shadow hover:shadow-xl transition-shadow duration-300">
                                <div className="relative aspect-square">
                                    <Image
                                        src={`${apiBaseUrl + collection?.image}`}
                                        alt={collection?.name || "Collection"}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                                </div>
                                
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <h3 className="text-lg font-semibold">
                                        {collection?.name}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}