"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TGender, TShopSideBar, TShopSideBarResponsive } from "@/types";
import { usePathname } from "next/navigation";
import { getShopSidebar } from "@/services/shopSidebar";
import ShopPageSidebar from "./ShopPageSidebar";
import AllPageSidebar from "./AllPageSidebar";
import { getAllProductsForShop } from "@/services/products";

type ResponsiveNavSidBarProps = {
  onClose: () => void;
};

const ResponsiveNavSidBar: React.FC<ResponsiveNavSidBarProps> = ({
  onClose,
}) => {
  const pathname = usePathname();
  const [shopSideBar, setShopSideBar] = useState<TShopSideBar[]>([]);
  const [products, setProducts] = useState<TShopSideBarResponsive | null>(null);

  // console.log("products", products);
  useEffect(() => {
    getShopSidebar()
      .then((res) => {
        if (res?.data) setShopSideBar(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    getAllProductsForShop({})
      .then((res) => {
        if (res?.data) setProducts(res.data?.filterOptions);
        console.log("products res.data", res?.data?.filterOptions);
      })
      .catch((err) => console.error(err));
    // .then((res) => { const { data: products } =
    //   console.log("products res.data", res.data);
    //   if (res?.data) setProducts(res.data);
    // })
    // .catch((err) => console.error(err));
  }, []);

  const isShopPage = pathname === "/shop";
  const defaultProducts: TShopSideBarResponsive = {
    brands: [],
    categories: [],
    genders: null as unknown as TGender, // Replace with a valid default value for TGender
    priceRange: { minPrice: 0, maxPrice: 0 }, // Set default values for minPrice and maxPrice
    sizes: [],
  };

  return (
    <div className=" ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        className="w-[70%] lg:w-[20%] bg-[#fff] top-[80px] h-screen fixed  left-0 z-30 pt-12 lg:hidden"
      >
        {isShopPage ? (
          // <ShopPageSidebar
          // shopSideBar={shopSideBar}
          // products={products ? products.filterOptions : []}
          // />
          <ShopPageSidebar
            shopSideBar={shopSideBar}
            products={products || defaultProducts}
          />
        ) : (
          <AllPageSidebar shopSideBar={shopSideBar} />
        )}
      </motion.div>
    </div>
  );
};

export default ResponsiveNavSidBar;
