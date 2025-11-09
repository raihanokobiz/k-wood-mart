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

interface Product {
  _id: string;
  name: string;
  thumbnailImage: string;
  backViewImage?: string;
  price: number;
  mrpPrice: number;
  slug: string;
  inventoryRef?: any;
  inventoryType?: string;
}

interface FilterResponse {
  data: {
    result: Product[];
    pagination: {
      currentPage: number;
      totalPage: number;
      total: number;
    };
    filterOptions: {
      brands: string[];
      categories: string[];
      subCategories: string[];
      childCategories: string[];
    };
  };
  message: string;
  statusCode: number;
}

interface SelectedFilters {
  categories: string[];
  subCategories: string[];
  childCategories: string[];
  brands: string[];
}

interface FilterSystemProps {
  products: {
    result: Product[];
    pagination?: {
      currentPage: number;
      totalPage: number;
      total: number;
    };
    filterOptions?: {
      brands: string[];
      categories: string[];
      subCategories: string[];
      childCategories: string[];
    };
  };
  shopSideBar?: any;
  ShopProducts?: any;
  ShopProductsCategories?: any;
  categorySlug?: string;
  subCategorySlug?: string;
  childCategorySlug?: string;
  brand?: string;
}

// Main Component
export default function FilterSystem({
  products,
  shopSideBar,
  ShopProducts,
  ShopProductsCategories,
  categorySlug,
  subCategorySlug,
  childCategorySlug,
  brand,
}: FilterSystemProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("default");
  const [selectedFilters, setSelectedFilters] = useState<{
    categories: string[];
    subCategories: string[];
    childCategories: string[];
    brands: string[];
  }>({
    categories: [],
    subCategories: [],
    childCategories: [],
    brands: [],
  });

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [furnitureSubCategory, setFurnitureSubCategory] = useState(null);
  const [allProducts, setAllProducts] = useState(products?.result || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setAllProducts(products?.result || []);
    setCurrentPage(products?.pagination?.currentPage || 1);
  }, [products]);

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
  const brands = products.filterOptions?.brands || [];

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

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("minPrice", min.toString());
    newParams.set("maxPrice", max.toString());

    const newUrl = `?${newParams.toString()}`;

    router.push(newUrl, { scroll: false });
  };

  // 🔥 এই পুরো function যোগ করুন
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    // Preserve all existing query parameters
    const params = new URLSearchParams(searchParams.toString());

    // Add pagination parameters
    params.set("page", nextPage.toString());
    params.set("limit", "9");

    // Log the full URL being called
    const url = `${apiBaseUrl}/product/furniture/pagination?${params.toString()}`;
    console.log("Fetching more products from:", url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Received data:", data);

      if (data?.data?.result && data?.data?.result?.length > 0) {
        setAllProducts((prev) => [...prev, ...data.data.result]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSortChange = (sortValue: string) => {
    const sortMapping = {
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


  // 🔥 এটাও যোগ করুন
  const hasMore = currentPage < (products?.pagination?.totalPage || 1);

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
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Your product cards here */}
              {allProducts?.map((product) => (
                <ProductCardForFurniture key={product._id} product={product} />
              ))}
            </div>
            {hasMore && (
              <div className="flex flex-col items-center mt-8 gap-4">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 cursor-pointer bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Load More"
                  )}
                </button>

                <p className="text-center text-gray-600 text-sm">
                  Showing {allProducts.length} of{" "}
                  {products?.pagination?.total || 0} products
                </p>
              </div>
            )}
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
        onFilterChange={handleFilterChange}
        onPriceChange={handlePriceChange}
        setSelectedFilters={setSelectedFilters}
      />
    </div>
  );
}
