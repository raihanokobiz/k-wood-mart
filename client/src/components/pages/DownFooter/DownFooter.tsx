"use client";
import React, { useEffect, useState } from "react";
import { LiaHomeSolid } from "react-icons/lia";
import { AiOutlineShopping } from "react-icons/ai";

import Link from "next/link";
import { BsCart2 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { TUser } from "@/types";
import { getUser } from "@/services/auth";
import { useRouter } from "next/navigation";
interface FooterProps {
  userCartProducts: {
    cartDetails: any[]; // Replace 'any' with the specific type if known
  };
}
const DownFooter: React.FC<FooterProps> = ({ userCartProducts }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [usersId, setUsersId] = useState<TUser | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUser();
        setUsersId(fetchedUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleAccountClick = () => {
    if (usersId?.email) {
      router.push("/dashboard/profile");
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled past 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check if the user has reached the bottom of the page
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight;

      if (isBottom) {
        setIsVisible(false); // Hide the footer when at the bottom of the page
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    // <div className="fixed bottom-0 md:py-12 py-2 w-full bg-[#fff] shadow-2xl z-[999]">
    <div
      className={`fixed  bottom-0 md:py-12 py-1 w-full bg-[#fff] shadow-2xl border-t border-[#1D4095] z-[999]  transition-transform duration-300 ${isVisible ? "translate-y-0 " : "translate-y-full"
        } md:hidden`}
    >
      <div className="px-6 flex items-center justify-between divide-x divide-gray-300/60">
        <Link href="/" className="flex-1 flex flex-col items-center text-sm font-semibold px-4">
          <LiaHomeSolid className="text-lg text-[#262626]" />
          <p className="text-[#D4A373]">Home</p>
        </Link>

        <Link href="/shop" className="flex-1 flex flex-col items-center text-sm font-semibold px-4">
          <AiOutlineShopping className="text-lg text-[#262626]" />
          <p className="text-[#D4A373]">Shop</p>
        </Link>

        <Link href="/cart" className="flex-1 flex flex-col items-center text-sm font-semibold px-4 relative">
          <BsCart2 className="text-lg text-[#262626]" />
          <span className="top-[-12px] right-[14px] absolute w-[20px] h-[20px] text-sm text-[#fff] text-center rounded-full bg-[#D4A373]">
            {userCartProducts?.cartDetails?.length || 0}
          </span>
          <p className="text-[#D4A373]">Cart</p>
        </Link>

        <div onClick={handleAccountClick} className="flex-1 flex flex-col items-center text-sm font-semibold px-4 cursor-pointer">
          <FaRegUser className="text-lg text-[#262626]" />
          <p className="text-[#D4A373] text-center">My Account</p>
        </div>
      </div>

    </div>
  );
};

export default DownFooter;
