"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterDrawer } from "./FilterDrawer";
import { SortDropdown } from "./SortDropdown";
import { getCurtainsSubCategory } from "@/services/shopSidebar";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCardForFurniture from "@/components/pages/products/ProductCardForFurniture/ProductCardForFurniture";
import { TProduct } from "@/types";




type SortKeys = "default" | "price-asc" | "price-desc";


export type TFilterSystemProps = {
  products: {
    result: TProduct[];
    filterOptions: {
      brands: string[];
    };
  };
};


// Main Component
export default function FilterSystem({ products }: TFilterSystemProps) {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentSort] = useState("default");
  const [selectedFilters, setSelectedFilters] = useState<{
    categories: string[];
    subCategories: string[];
    childCategories: string[];
    brands: string[]
  }>({
    categories: [],
    subCategories: [],
    childCategories: [],
    brands: [],
  });

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [furnitureSubCategory, setFurnitureSubCategory] = useState(null);


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

    //  value 
    const currentValues = new Set(
      (searchParams.get(type)?.split(",") || []).filter(Boolean)
    );

    // toggle logic
    if (currentValues.has(value)) {
      currentValues.delete(value);
    } else {
      currentValues.add(value);
    }

    // param update 
    if (currentValues.size > 0) {
      newParams.set(type, Array.from(currentValues).join(","));
    } else {
      newParams.delete(type);
    }

    // clean query 
    const queryString = newParams.toString().replace(/(^|&)(&|$)/g, "");

    // route update 
    router.push(`?${queryString}`);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("minPrice", min.toString());
    newParams.set("maxPrice", max.toString());

    const newUrl = `?${newParams.toString()}`;

    router.push(newUrl, { scroll: false });
  };

  const handleSortChange = (sortValue: SortKeys) => {
    const sortMapping: Record<SortKeys, { sortBy: string, order: string }> = {
      default: { sortBy: "createdAt", order: "DESC" },
      "price-asc": { sortBy: "price", order: "ASC" },
      "price-desc": { sortBy: "price", order: "DESC" },
    };

    const mapped = sortMapping[sortValue] || sortMapping.default;

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sortBy", mapped.sortBy);
    newParams.set("order", mapped.order);

    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const { data: furniture } = await getCurtainsSubCategory();
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
            onSortChange={handleSortChange}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
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
        setPriceRange={setPriceRange}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        onFilterChange={handleFilterChange}
        onPriceChange={handlePriceChange}
      />
    </div>
  );
}
