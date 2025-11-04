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
import Banner2 from "@/components/pages/landing_pages/Banner/Banner2";
import SignatureCollections from "@/components/pages/landing_pages/SignatureCollections/SignatureCollections";
import BeforeAfterSection from "@/components/pages/landing_pages/BeforeAfterSection/BeforeAfterSection";
import WhyChooseUs from "@/components/pages/landing_pages/whyChooseUs/WhyChooseUs";
import FurnitureProducts from "@/components/pages/landing_pages/whyChooseUs/WhyChooseUs";
import NewArrivals from "@/components/pages/landing_pages/NewArrivals/NewArrivals";
import FeaturedProducts from "@/components/pages/landing_pages/FeaturedProducts/FeaturedProducts";
import NewsUpdates from "@/components/pages/landing_pages/NewsUpdates/NewsUpdates";
import FurnitureDemo from "@/components/pages/landing_pages/FurnitureDemo/FurnitureDemo";
import FurnitureCurtainGallery from "@/components/pages/landing_pages/FurnitureCurtainGallery/FurnitureCurtainGallery";

export const metadata: Metadata = {
  title: "K Wood Mart",
  description:
    "K Wood Mart – Premium Furniture & Elegant Curtains for Modern Homes. Discover luxury living with our handcrafted furniture and bespoke curtain collections.",
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
        {/* <Banner banners={[]} /> */}
        <Banner2 />
        <SignatureCollections />
        <BeforeAfterSection />
        <NewArrivals />
        <FurnitureCurtainGallery/>
        <FeaturedProducts />
        {/* <Category /> */}
        <FurnitureDemo/>
        <WhyChooseUs />
        <NewsUpdates />
        {/* <BestSelling products={bestSelling} /> */}
        {/* <Newest products={allproducts} /> */}
        {/* <DiscountProduct products={productWithDiscount} /> */}
        {/* <Brand brands={brands} /> */}

        {/* <Campaign campaign={campaign[0]} />
        <Blogs  /> */}
      </div>

      <CartSideBar cartProducts={products?.data} />
    </>
  );
};

export default page;
