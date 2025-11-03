import ShopProducts from "@/components/pages/products/ShopProducts/ShopProducts";
import ShopProductsCategories from "@/components/pages/products/ShopProductsCategories/ShopProductsCategories";
import { getShopSidebar } from "@/services/shopSidebar";
import { getAllProductsForShop } from "@/services/products";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
// import NavBar from "@/components/pages/header/NavBar/NavBar";
import CartSideBar from "@/components/pages/cartSideBar/CartSideBar";
import React from "react";
// import UpcomingSideBanner from "@/components/pages/UpcomingSideBanner/UpcomingSideBanner";
// import { getAllBanners } from "@/services/banners";
import { Metadata } from "next";
import NavBar from "@/components/pages/header/NavBar/NavBar";
import Image from "next/image";

export const metadata: Metadata = {
  title: "K Wood Mart | All Product",
  description: "Best E-commerce platform in BD",
};

export const revalidate = 0;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { data: shopSideBar } = await getShopSidebar();

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

  // const { data: products } = await getAllProductsForShop(
  //   categorySlug,
  //   subCategorySlug,
  //   childCategorySlug,
  //   brandSlug,
  //   minPrice,
  //   maxPrice
  // );

  const { data: products } = await getAllProductsForShop({
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    brand,
    minPrice,
    maxPrice,
  });

  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const cartProducts = await getCartProducts(userId, coupon);

  // const { data: banners } = await getAllBanners();

  return (
    <>
      <NavBar userCartProducts={cartProducts?.data} />
      <div className="flex min-h-screen pb-8 md:pb-12 lg:pb-16 px-4 md:px-6 lg:px-8">
        {/* <div className="2xl:w-[20%] xl:xl-[25%] lg:w-[25%]  hidden lg:block">
          <ShopProductsCategories
            shopSideBar={shopSideBar}
            products={products.filterOptions}
          />
        </div> */}
        <div className="flex-1">
          {/* Furniture Sub Banner */}
          <div className="mb-6 md:mb-8 relative rounded-lg overflow-hidden">
            <div className=" grid grid-cols-2 gap-4">
              <div className="flex-1 space-y-3 md:space-y-4 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                  Premium Furniture Collection
                </h2>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-xl">
                  Discover handcrafted wooden furniture that brings warmth and elegance to your home
                </p>
              </div>
              <div className="flex items-center">
                <div className="relative w-full h-full min-h-full">
                  <Image
                    src="https://cdn.pixabay.com/photo/2024/04/21/01/27/ai-generated-8709665_640.png"
                    alt="Premium Furniture"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <ShopProducts
            products={products.result}
            pagination={products.pagination}
            categorySlug={categorySlug}
            subCategorySlug={subCategorySlug}
            childCategorySlug={childCategorySlug}
            brand={brand}
          />
        </div>
        <CartSideBar cartProducts={cartProducts?.data} />
        {/* <UpcomingSideBanner banners={banners} /> */}
      </div>
    </>
  );
}
