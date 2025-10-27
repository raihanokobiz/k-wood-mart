"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import animationData from "@/assets/animation/thank-you-check.json";
import { useEffect, useState } from "react";
import { TResponse } from "@/types";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import NavBar from "@/components/pages/header/NavBar/NavBar";

const ThankYou = () => {
  const [productsByUser, setProductsByUser] = useState<TResponse | null>(null);

  const coupon = "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        const userId = user?.id;

        const data = await getCartProducts(userId, coupon);
        setProductsByUser(data || []);
      } catch (error) {
        console.error("Error fetching user or cart:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <NavBar userCartProducts={productsByUser?.data} />
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-10 lg:py-20">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center space-y-6 mt-35 lg:mt-0">
          <Lottie
            animationData={animationData}
            className="h-[120px] lg:h-[200px]"
            loop={true}
          />
          <h1 className="text-3xl font-bold text-gray-800">Thank You!</h1>
          <p className="text-gray-600 text-lg">
            Your submission has been received successfully.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#D4A373] hover:bg-[#CCD5AE]  text-white font-semibold px-6 py-2 rounded hover:bg-primary transition duration-300"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </>
  );
};

export default ThankYou;
