"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterDrawer } from "./FilterDrawer";
import { SortDropdown } from "./SortDropdown";
import { getFurnitureSubCategory } from "@/services/shopSidebar";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { apiBaseUrl } from "@/config/config";
import ProductDialog from "@/components/pages/products/ProductDialog/ProductDialog";
import ProductCardForFurniture from "@/components/pages/products/ProductCardForFurniture/ProductCardForFurniture";

// Main Component
export default function HatilFilterSystem({ products }) {
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
  const [brand, setBrand] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  //  useEffect
  useEffect(() => {
    const cats = searchParams.get("category")?.split(",").filter(Boolean) || [];
    const subCats =
      searchParams.get("subCategory")?.split(",").filter(Boolean) || [];
    const childCats =
      searchParams.get("childCategory")?.split(",").filter(Boolean) || [];
    const brands = searchParams.get("brand")?.split(",").filter(Boolean) || [];

    setSelectedFilters({
      categories: cats,
      subCategories: subCats,
      childCategories: childCats,
      brands: brands,
    });
  }, [searchParams]);

  // Mock data - replace with your actual data
  const brands = products.filterOptions.brands;

  const handleFilterChange = (type: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // বর্তমান value গুলো বের করা
    const currentValues = new Set(
      (searchParams.get(type)?.split(",") || []).filter(Boolean)
    );

    // toggle logic
    if (currentValues.has(value)) {
      currentValues.delete(value);
    } else {
      currentValues.add(value);
    }

    // param update করা
    if (currentValues.size > 0) {
      newParams.set(type, Array.from(currentValues).join(","));
    } else {
      newParams.delete(type);
    }

    // clean query বানানো
    const queryString = newParams.toString().replace(/(^|&)(&|$)/g, "");

    // route update করা
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
      <div className=" sticky top-0 bg-white z-30 border-b border-gray-200 py-4">
        <div className="flex items-center justify-between gap-4 ">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="cursor-pointer text-red-600 flex items-center gap-2 px-4 py-2 border border-brown-600 rounded-lg text-brown-600 font-semibold hover:bg-brown-50 transition"
          >
            <SlidersHorizontal className="w-5 h-5 " />
            Filters
          </button>
          <SortDropdown
            onSortChange={setCurrentSort}
            currentSort={currentSort}
          />
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
              {products?.result?.map((product) => (
                <ProductCardForFurniture key={product._id} product={product} />
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
