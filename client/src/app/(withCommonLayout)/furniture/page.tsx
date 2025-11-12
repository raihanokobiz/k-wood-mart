import ShopProducts from "@/components/pages/products/ShopProducts/ShopProducts";
import ShopProductsCategories from "@/components/pages/products/ShopProductsCategories/ShopProductsCategories";
import { getShopSidebar } from "@/services/shopSidebar";
import { getAllProductsForFurniture } from "@/services/products";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import CartSideBar from "@/components/pages/cartSideBar/CartSideBar";
import React from "react";
import { Metadata } from "next";
import NavBar from "@/components/pages/header/NavBar/NavBar";
import FilterSystem from "./FilterSystem";

// ... metadata এবং revalidate same থাকবে
export const metadata: Metadata = {
  title: "K Wood Mart | All Product",
  description: "Best E-commerce platform in BD",
};

export default async function FurniturePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { data: shopSideBar } = await getShopSidebar();

  // 🧩 Add these lines 👇
  const categorySlug = Array.isArray(params.category)
    ? params.category[0]
    : params.category || "";
  const subCategorySlug = Array.isArray(params.subCategory)
    ? params.subCategory[0]
    : params.subCategory || "";
  const childCategorySlug = Array.isArray(params.childCategory)
    ? params.childCategory[0]
    : params.childCategory || "";
  const brand = Array.isArray(params.brand)
    ? params.brand[0]
    : params.brand || "";
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const page = params.page ? Number(params.page) : 1;
  // 🧩 End
  // Validate that it's either "ASC" or "DESC", otherwise fallback
  const orderParam = Array.isArray(params.order) ? params.order[0] : params.order;
  const order: "ASC" | "DESC" = orderParam === "ASC" || orderParam === "DESC" ? orderParam : "DESC";
  const sortBy = Array.isArray(params.sortBy) ? params.sortBy[0] : params.sortBy ?? "createdAt";


  const { data: products } = await getAllProductsForFurniture({
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    brand,
    minPrice,
    maxPrice,
    page,
    limit: 9,
    sortBy: sortBy,
    order: order,

  });

  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const cartProducts = await getCartProducts(userId, coupon);



  return (
    <>
      <NavBar userCartProducts={cartProducts?.data} />
      <div className="min-h-screen">
        {/* Furniture Sub Banner - same */}
        <div className="mb-6 md:mb-8 relative overflow-hidden h-80 md:h-[450px] lg:h-[500px]">
          <div className="relative w-full h-full overflow-hidden">
            <video
              src="/F1.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pt-24 lg:pt-14 md:pt-28">
            <div className="text-white p-6 md:p-8 lg:p-12 max-w-2xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center">
                Premium Furniture Collection
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-center">
                Discover handcrafted wooden furniture that brings warmth and
                elegance to your home
              </p>
            </div>
          </div>
        </div>

        {/* নতুন Filter System */}
        <div className="px-4 md:px-6 lg:px-8 2xl:px-12">
          <FilterSystem
            shopSideBar={shopSideBar}
            products={products}
            ShopProducts={ShopProducts}
            ShopProductsCategories={ShopProductsCategories}
            categorySlug={categorySlug}
            subCategorySlug={subCategorySlug}
            childCategorySlug={childCategorySlug}
            brand={brand}
          />
          <CartSideBar cartProducts={cartProducts?.data} />
        </div>
      </div>
    </>
  );
}
