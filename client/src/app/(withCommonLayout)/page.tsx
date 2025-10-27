import Banner from "@/components/pages/landing_pages/Banner/Banner";
import Category from "@/components/pages/landing_pages/Category/Category";

import React from "react";

import {
  getAllBestSellProduct,
  getAllDiscountProduct,
  getAllProducts,
} from "@/services/products";

import { getCartProducts } from "@/services/cart";
import NavBar from "@/components/pages/header/NavBar/NavBar";

import { getUser } from "@/services/auth";

import Newest from "@/components/pages/landing_pages/Newest/Newest";

import DiscountProduct from "@/components/pages/landing_pages/DiscountProduct/DiscountProduct";
import Brand from "@/components/pages/landing_pages/Brand/Brand";
import BestSelling from "@/components/pages/landing_pages/BestSelling/BestSelling";
import { getAllBrands } from "@/services/brand";
import Campaign from "@/components/pages/landing_pages/Campaign/Campaign";
import { getCampaign } from "@/services/campaign";
import { Metadata } from "next";
import CartSideBar from "@/components/pages/cartSideBar/CartSideBar";
import Blogs from "@/components/pages/landing_pages/Blogs/Blogs";

export const metadata: Metadata = {
  title: "NOHASAN",
  description:
    "Shop online at NOHASAN – Bangladesh's best perfumes e-commerce platform. Discover premium perfumes for men and women unisex at NOHASAN. Shop 100% authentic branded fragrances in Bangladesh with fast delivery and great prices.",
};

const page = async () => {
  // ------for campaign----

  const { data: campaign } = await getCampaign();

  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const products = await getCartProducts(userId, coupon);
  // console.log("products", products?.data);

  // for all products

  const allproducts = await getAllProducts();

  const bestSelling = await getAllBestSellProduct();
  const productWithDiscount = await getAllDiscountProduct();
  const brands = await getAllBrands();


  return (
    <>
      <NavBar userCartProducts={products?.data} />
      <div className="">
        <Banner banners={[]} />
        <Category />
        <BestSelling products={bestSelling} />
        <Newest products={allproducts} />
        <DiscountProduct products={productWithDiscount} />
        <Brand brands={brands} />

        <Campaign campaign={campaign[0]} />
        <Blogs  />
      </div>

      <CartSideBar cartProducts={products?.data} />
    </>
  );
};

export default page;
