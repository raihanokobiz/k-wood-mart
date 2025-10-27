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

export const metadata: Metadata = {
  title: "NOHASAN | All Product",
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

  const gender = Array.isArray(params.gender)
    ? params.gender[0]
    : params.gender || "";

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  // const { data: products } = await getAllProductsForShop(
  //   categorySlug,
  //   subCategorySlug,
  //   childCategorySlug,
  //   brandSlug,
  //   genderSlug,
  //   minPrice,
  //   maxPrice
  // );

  const { data: products } = await getAllProductsForShop({
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    brand,
    gender,
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
      <div className="flex min-h-screen Container">
        <div className="2xl:w-[20%] xl:xl-[25%] lg:w-[25%]  hidden lg:block">
          <ShopProductsCategories
            shopSideBar={shopSideBar}
            products={products.filterOptions}
          />
        </div>
        <div className="flex-1 lg:mt-0  mt-24">
          <ShopProducts
            products={products.result}
            pagination={products.pagination}
            categorySlug={categorySlug}
            subCategorySlug={subCategorySlug} 
            childCategorySlug={childCategorySlug}
            brand={brand}
            gender={gender}
          />
        </div>
        <CartSideBar cartProducts={cartProducts?.data} />
        {/* <UpcomingSideBanner banners={banners} /> */}
      </div>
    </>
  );
}
