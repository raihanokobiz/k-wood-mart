"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterDrawer } from "./FilterDrawer";
import { SortDropdown } from "./SortDropdown";
import { getFurnitureSubCategory } from "@/services/shopSidebar";
import { useRouter, useSearchParams } from "next/navigation";


// Main Component
export default function HatilFilterSystem() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentSort, setCurrentSort] = useState("default");
    const [selectedFilters, setSelectedFilters] = useState({
        categories: [],
        subCategories: [],
        childCategories: [],
        brands: [],
    });
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [furnitureSubCategory, setFurnitureSubCategory] = useState(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    // Mock data - replace with your actual data
    const categories = [
        {
            _id: "1",
            name: "Living Room",
            slug: "living-room",
            subCategories: [
                {
                    _id: "1-1",
                    name: "Sofas",
                    slug: "sofas",
                    childCategories: [
                        { _id: "1-1-1", name: "3 Seater", slug: "3-seater" },
                        { _id: "1-1-2", name: "L-Shape", slug: "l-shape" },
                    ],
                },
                { _id: "1-2", name: "Coffee Tables", slug: "coffee-tables" },
            ],
        },
        {
            _id: "2",
            name: "Bedroom",
            slug: "bedroom",
            subCategories: [
                { _id: "2-1", name: "Beds", slug: "beds" },
                { _id: "2-2", name: "Wardrobes", slug: "wardrobes" },
            ],
        },
    ];

    const brands = [
        { _id: "b1", name: "Hatil", slug: "hatil" },
        { _id: "b2", name: "Otobi", slug: "otobi" },
        { _id: "b3", name: "Partex", slug: "partex" },
    ];

    const handleFilterChange = (type: "subCategorie" | "childCategorie", value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());

        const currentValues = new Set(
            (searchParams.get(type)?.split(",") || []).filter(Boolean)
        );

        if (currentValues.has(value)) {
            currentValues.delete(value);
        } else {
            currentValues.add(value);
        }

        if (currentValues.size > 0) {
            newParams.set(type, Array.from(currentValues).join(","));
        } else {
            newParams.delete(type);
        }

        newParams.set("category", "furniture");

        const queryString = `category=furniture${newParams.toString()
            ? "&" + newParams.toString().replace(/(^|&)category=furniture(&|$)/g, "")
            : ""
            }`;

        router.push(`?${queryString}`);
    };

    const handlePriceChange = (min: number, max: number) => {
        setPriceRange([min, max]);
    };

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const { data: furniture } = await getFurnitureSubCategory();
                setFurnitureSubCategory(furniture);
            } catch (error) {
                console.error("Error fetching sidebar data:", error);
            }
        };

        fetchSidebarData();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Mobile Filter Button & Sort - Fixed at top */}
            <div className=" sticky top-0 bg-white z-30 border-b border-gray-200 p-4">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-brown-600 rounded-lg text-brown-600 font-semibold hover:bg-brown-50 transition"
                        style={{ borderColor: "#8B4513", color: "#8B4513" }}
                    >
                        <SlidersHorizontal className="w-5 h-5" />
                        Filters
                    </button>
                    <SortDropdown onSortChange={setCurrentSort} currentSort={currentSort} />
                </div>
            </div>

            <div className=" mx-auto py-4 lg:py-8">

                <div className="flex gap-6">
                    {/* Desktop Sidebar - Hidden on mobile */}
                    <div className="hidden w-64 flex-shrink-0">
                        <div className="sticky top-4 space-y-6">
                            {/* Desktop filters - your existing ShopProductsCategories component */}
                            <div className="border border-brown-500 rounded-lg p-4">
                                <h3 className="font-semibold text-black mb-4">Price Range</h3>
                                {/* Add your price range slider here */}
                            </div>

                            <div className="border border-brown-500 rounded-lg p-4 max-h-96 overflow-y-auto">
                                <h3 className="font-semibold text-black mb-4">Categories</h3>
                                {/* Add your categories here */}
                            </div>

                            <div className="border border-brown-500 rounded-lg p-4 max-h-64 overflow-y-auto">
                                <h3 className="font-semibold text-black mb-4">Brands</h3>
                                {/* Add your brands here */}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Your product cards here */}
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div
                                    key={i}
                                    className="border border-gray-200 rounded hover:shadow-lg transition"
                                >
                                    <div className="bg-gray-200 h-40 md:h-60 2xl:h-[500px] mb-3"></div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-black mb-2">Product {i}</h3>
                                        <p className="text-brown-600 font-bold" style={{ color: "#8B4513" }}>
                                            ৳ 12,500
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <FilterDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                categories={furnitureSubCategory}
                brands={brands}
                priceRange={priceRange}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onPriceChange={handlePriceChange}
            />
        </div>
    );
}