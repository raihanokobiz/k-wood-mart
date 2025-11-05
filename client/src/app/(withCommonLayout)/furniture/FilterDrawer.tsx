"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TBrand {
    _id: string;
    name: string;
    slug: string;
}

interface TChildCategory {
    _id: string;
    name: string;
    slug: string;
}

interface TSubCategory {
    _id: string;
    name: string;
    slug: string;
    childCategories?: TChildCategory[];
}

interface TCategory {
    _id: string;
    name: string;
    slug: string;
    subCategories?: TSubCategory[];
}

export const FilterDrawer = ({
    isOpen,
    onClose,
    categories,
    brands,
    priceRange,
    setPriceRange,
    selectedFilters,
    setSelectedFilters,
    onFilterChange,
    onPriceChange,
}: any) => {
    const [localPriceRange, setLocalPriceRange] = useState<[number | "", number | ""]>([
        priceRange?.[0] ?? 0,
        priceRange?.[1] ?? 10000,
    ]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [expandedSubCategories, setExpandedSubCategories] = useState<string[]>([]);
    const router = useRouter();

    const toggleCategory = (slug: string) => {
        setExpandedCategories((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
    };

    const toggleSubCategory = (slug: string) => {
        setExpandedSubCategories((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[85%] max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-black">Filters</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <X className="w-6 h-6 text-black" />
                        </button>
                    </div>

                    {/* Filter Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Price Range */}
                        <div className="border border-brown-500 rounded-lg p-4">
                            <h3 className="font-semibold text-black mb-4">Price Range</h3>
                            <div className="flex gap-2 mb-4">
                                <div className="flex-1">
                                    <label className="text-sm text-gray-600 mb-1 block">Min</label>
                                    <input
                                        type="number"
                                        value={localPriceRange[0]}
                                        onChange={(e) => {
                                            const value = e.target.value === "" ? "" : Number(e.target.value);
                                            setLocalPriceRange([value, localPriceRange[1]]);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brown-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm text-gray-600 mb-1 block">Max</label>
                                    <input
                                        type="number"
                                        value={localPriceRange[1]}
                                        onChange={(e) =>
                                            setLocalPriceRange([localPriceRange[0], Number(e.target.value)])
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brown-500"
                                    />
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                ৳{localPriceRange[0]} - ৳{localPriceRange[1]}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="border border-brown-500 rounded-lg p-4">
                            <h3 className="font-semibold text-black mb-4">Categories</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {categories?.subCategories?.map((cat: TCategory) => (
                                    <div key={cat._id}>
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.subCategories.includes(cat.slug)}
                                                    onChange={() => onFilterChange("subCategory", cat.slug)}
                                                    className="w-4 h-4 accent-brown-600"
                                                />
                                                <span className="text-sm text-black">{cat.name}</span>
                                            </label>
                                            {cat?.childCategories && cat.childCategories.length > 0 && (
                                                <button
                                                    onClick={() => toggleCategory(cat.slug)}
                                                    className="p-1"
                                                >
                                                    {expandedCategories.includes(cat.slug) ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Subcategories */}
                                        {expandedCategories.includes(cat.slug) && cat.childCategories && (
                                            <div className="ml-6 mt-2 space-y-2">
                                                {cat.childCategories.map((subCat: TSubCategory) => (
                                                    <div key={subCat._id}>
                                                        <div className="flex items-center justify-between">
                                                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedFilters.childCategories.includes(
                                                                        subCat.slug
                                                                    )}
                                                                    onChange={() =>
                                                                        onFilterChange("childCategorie", subCat.slug)
                                                                    }
                                                                    className="w-4 h-4 accent-brown-600"
                                                                />
                                                                <span className="text-sm text-gray-700">
                                                                    {subCat.name}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Brands */}
                        <div className="border border-brown-500 rounded-lg p-4">
                            <h3 className="font-semibold text-black mb-4">Brands</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {brands?.map((brand: TBrand) => (
                                    <label
                                        key={brand._id}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters.brands.includes(brand.slug)}
                                            onChange={() => onFilterChange("brand", brand.slug)}
                                            className="w-4 h-4 accent-brown-600"
                                        />
                                        <span className="text-sm text-black">{brand.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-4 border-t border-gray-200 space-y-2">
                        <button
                            onClick={() => {
                                onPriceChange(localPriceRange[0], localPriceRange[1]);
                                onClose();
                            }}
                            className="w-full bg-red-500 cursor-pointer text-white py-3 rounded-lg font-semibold hover:bg-brown-700 transition"

                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={() => {
                                setSelectedFilters({
                                    categories: [],
                                    subCategories: [],
                                    childCategories: [],
                                    brands: [],
                                });
                                setPriceRange([0, 10000]);
                                router.push('/furniture');
                                onClose();
                            }}
                            className="bg-red-500 text-white cursor-pointer w-full border border-brown-600 text-brown-600 py-3 rounded-lg font-semibold hover:bg-brown-50 transition"

                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};