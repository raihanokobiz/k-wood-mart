"use client";

import React, { useState, useEffect } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

// Types
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

// Filter Drawer Component
const FilterDrawer = ({
  isOpen,
  onClose,
  categories,
  brands,
  priceRange,
  selectedFilters,
  onFilterChange,
  onPriceChange,
}: any) => {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubCategories, setExpandedSubCategories] = useState<string[]>([]);

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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
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
                    onChange={(e) =>
                      setLocalPriceRange([Number(e.target.value), localPriceRange[1]])
                    }
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
                {categories?.map((cat: TCategory) => (
                  <div key={cat._id}>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={selectedFilters.categories.includes(cat.slug)}
                          onChange={() => onFilterChange("category", cat.slug)}
                          className="w-4 h-4 accent-brown-600"
                        />
                        <span className="text-sm text-black">{cat.name}</span>
                      </label>
                      {cat.subCategories && cat.subCategories.length > 0 && (
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
                    {expandedCategories.includes(cat.slug) && cat.subCategories && (
                      <div className="ml-6 mt-2 space-y-2">
                        {cat.subCategories.map((subCat: TSubCategory) => (
                          <div key={subCat._id}>
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 cursor-pointer flex-1">
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.subCategories.includes(
                                    subCat.slug
                                  )}
                                  onChange={() =>
                                    onFilterChange("subCategory", subCat.slug)
                                  }
                                  className="w-4 h-4 accent-brown-600"
                                />
                                <span className="text-sm text-gray-700">
                                  {subCat.name}
                                </span>
                              </label>
                              {subCat.childCategories &&
                                subCat.childCategories.length > 0 && (
                                  <button
                                    onClick={() => toggleSubCategory(subCat.slug)}
                                    className="p-1"
                                  >
                                    {expandedSubCategories.includes(subCat.slug) ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                            </div>

                            {/* Child Categories */}
                            {expandedSubCategories.includes(subCat.slug) &&
                              subCat.childCategories && (
                                <div className="ml-6 mt-2 space-y-2">
                                  {subCat.childCategories.map(
                                    (childCat: TChildCategory) => (
                                      <label
                                        key={childCat._id}
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selectedFilters.childCategories.includes(
                                            childCat.slug
                                          )}
                                          onChange={() =>
                                            onFilterChange(
                                              "childCategory",
                                              childCat.slug
                                            )
                                          }
                                          className="w-4 h-4 accent-brown-600"
                                        />
                                        <span className="text-sm text-gray-600">
                                          {childCat.name}
                                        </span>
                                      </label>
                                    )
                                  )}
                                </div>
                              )}
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
              className="w-full bg-brown-600 text-white py-3 rounded-lg font-semibold hover:bg-brown-700 transition"
              style={{ backgroundColor: "#8B4513" }}
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                // Clear all filters logic here
                onClose();
              }}
              className="w-full border border-brown-600 text-brown-600 py-3 rounded-lg font-semibold hover:bg-brown-50 transition"
              style={{ borderColor: "#8B4513", color: "#8B4513" }}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Sort Dropdown Component
const SortDropdown = ({ onSortChange, currentSort }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-brown-500 transition"
      >
        <span className="text-sm text-black">
          Sort by: {sortOptions.find((o) => o.value === currentSort)?.label}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-black hover:bg-brown-50 transition first:rounded-t-lg last:rounded-b-lg"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Active Filter Tags Component
const ActiveFilterTags = ({ filters, onRemove, onClearAll }: any) => {
  const hasFilters =
    filters.categories.length > 0 ||
    filters.subCategories.length > 0 ||
    filters.childCategories.length > 0 ||
    filters.brands.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-semibold text-black">Active Filters:</span>
      {[...filters.categories, ...filters.subCategories, ...filters.brands].map(
        (filter, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-3 py-1 bg-brown-100 text-brown-800 rounded-full text-sm"
            style={{ backgroundColor: "#F5E6D3", color: "#3E2723" }}
          >
            {filter}
            <button
              onClick={() => onRemove(filter)}
              className="hover:text-brown-900"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )
      )}
      <button
        onClick={onClearAll}
        className="text-sm text-brown-600 hover:text-brown-800 underline"
        style={{ color: "#8B4513" }}
      >
        Clear All
      </button>
    </div>
  );
};

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

  const handleFilterChange = (type: string, value: string) => {
    // Implement your filter logic here
    console.log("Filter changed:", type, value);
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Filter Button & Sort - Fixed at top */}
      <div className="lg:hidden sticky top-0 bg-white z-30 border-b border-gray-200 p-4">
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

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Desktop Sort & Active Filters */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <ActiveFilterTags
            filters={selectedFilters}
            onRemove={() => {}}
            onClearAll={() => {}}
          />
          <SortDropdown onSortChange={setCurrentSort} currentSort={currentSort} />
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-64 flex-shrink-0">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Your product cards here */}
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                  <h3 className="font-semibold text-black mb-2">Product {i}</h3>
                  <p className="text-brown-600 font-bold" style={{ color: "#8B4513" }}>
                    ৳ 12,500
                  </p>
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
        categories={categories}
        brands={brands}
        priceRange={priceRange}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onPriceChange={handlePriceChange}
      />
    </div>
  );
}