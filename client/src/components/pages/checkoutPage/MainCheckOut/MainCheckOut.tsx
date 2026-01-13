"use client";
import React, { useEffect, useState } from "react";
import CheckOutForm from "../CheckOutForm/CheckOutForm";
import CartOverView from "../CartOverView/CartOverView";
import { TProduct } from "@/types";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import { toast } from "react-toastify";

const MainCheckOut = () => {
  // ============
  const [products, setProducts] = useState<TProduct | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [shipping, setShipping] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        const userId = user?.id;
        const products = await getCartProducts(userId, coupon || "");
        if (products?.message?.toLowerCase().includes("sorry")) {
          toast.error(products.message);
        } else {
          toast.success(products?.message || "Products fetched successfully");
        }
        console.log("products", products);

        // set state here if needed
        setUserId(userId ?? null);
        setProducts(products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [coupon]);
  // ============

  return (
    <div className="min-h-screen">
      {products && (
        <div className="flex lg:flex-row flex-col-reverse  Container xl:mx-20 my-20 xl:gap-30 gap-8 relative">
          <div className="lg:w-3/5 w-full">
            {products && (
              <CheckOutForm
                products={products}
                userRef={String(userId)}
                shipping={shipping}
                setShipping={setShipping}
                setCoupon={setCoupon}
              />
            )}
          </div>
          <div className="lg:w-2/5 w-full">
            <CartOverView products={products?.data} shipping={shipping} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainCheckOut;
