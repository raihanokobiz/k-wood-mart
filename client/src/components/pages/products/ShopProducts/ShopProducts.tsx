"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

import SearchCancel from "./SearchCancel";
import { getAllProductsForShop } from "@/services/products";
import Lottie from "lottie-react";
import loadingSpinner from "@/assets/animation/shop-page-loading.json";
import { TProduct } from "@/types";
import ProductCardForFurniture from "../ProductCardForFurniture/ProductCardForFurniture";

interface Pagination {
  currentPage: number;
  currentPageLimit: number;
  total: number;
  totalPage: number;
  prevPage: number | null;
  nextPage: number | null;
}

interface ShopProductsProps {
  products: TProduct[];
  pagination: Pagination;
  categorySlug: string;
  brand: string;
  subCategorySlug: string;
  childCategorySlug: string;
}

const ShopProducts: React.FC<ShopProductsProps> = ({
  products,
  pagination,
  categorySlug,
  subCategorySlug,
  brand,

  childCategorySlug,
}) => {
  const [allProducts, setAllProducts] = useState<TProduct[]>(products);
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);
  const [hasMore, setHasMore] = useState(pagination.nextPage !== null);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const page = currentPage + 1;
      const { data } = await getAllProductsForShop({
        categorySlug,
        subCategorySlug,
        childCategorySlug,
        page,
      });

      if (data.result.length === 0) {
        setHasMore(false);
        return;
      }

      if (data.pagination.currentPage === currentPage) {
        setHasMore(false);
        return;
      }

      setAllProducts((prev) => [...prev, ...data.result]);
      setCurrentPage(data.pagination.currentPage);
      setHasMore(data.pagination.nextPage !== null);
    } catch (error) {
      console.error("Error fetching more products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMore,
    currentPage,
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    brand,
  ]);

  useEffect(() => {
    setAllProducts(products);
    setCurrentPage(pagination.currentPage);
    setHasMore(pagination.nextPage !== null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    products,
    pagination,
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    brand,
  ]);

  useEffect(() => {
    console.log("Has more >>>>>", hasMore);
    if (!observerRef.current || !hasMore) return;
    console.log("Has more >>>>>", hasMore);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreProducts();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    brand,
    fetchMoreProducts,
    hasMore,
  ]);

  return (
    <div className="">
      <div className="pb-4">
        <SearchCancel />
      </div>

      {allProducts.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10 col-span-full">
          No products available for now.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProducts.map((product : TProduct) => (
            // <ShopProductCard key={product._id} product={product} />
            // <>
            <ProductCardForFurniture key={product._id} product={product} />
            // <ProductCardForFurniture key={product._id} product={product} />
            // <ProductCardForFurniture key={product._id} product={product} />
            // </>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-24 h-24">
            <Lottie animationData={loadingSpinner} loop={true} />
          </div>
        </div>
      )}

      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default ShopProducts;
