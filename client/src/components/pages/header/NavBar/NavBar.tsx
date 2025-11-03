"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import logo from "@/assets/logo/KWoodMart.jpeg";
import { menuList } from "@/utilits/menuList";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import { AnimatePresence, motion } from "framer-motion";
import ResponsiveSearchForm from "../ResponsiveSearchForm/ResponsiveSearchForm";
import ResponsiveNavSidBar from "../ResponsiveNavSidBar/ResponsiveNavSidBar";
import "../NavBar/NavBar.css";

import { getCurtainsSubCategory, getFurnitureSubCategory } from "@/services/shopSidebar";
// import { getCartProducts } from "@/services/cart";
import { getUser, setCorrelation } from "@/services/auth";

import UserPopover from "@/shared/UserPopover/UserPopover";
import { TUser } from "@/types";
import { usePathname } from "next/navigation";
import { RiCloseFill, RiMenuAddFill } from "react-icons/ri";

// import { useCartRefresh } from "@/context/CartRefreshContext";

interface NavBarProps {
  userCartProducts: {
    cartDetails: any[]; // Replace 'any' with the specific type if known
  };
}

const NavBar: React.FC<NavBarProps> = ({ userCartProducts }) => {
  // const { shouldRefresh, doneRefresh } = useCartRefresh();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [furnitureSubCategory, setFurnitureSubCategory] = useState(null);
  const [curtainsSubCategory, setCurtainsSubCategory] = useState(null);
  // const [productsByUser, setProductsByUser] = useState<{
  //   cartDetails: any[];
  // } | null>(null);
  const [usersId, setUsersId] = useState<TUser | null>(null);

  const pathname = usePathname();
  const isShopPage = pathname === "/shop";
  // const { shouldRefresh, doneRefresh } = useCartRefresh();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setShowSideMenu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const { data: furniture } = await getFurnitureSubCategory();
        setFurnitureSubCategory(furniture);
        const { data: curtain } = await getCurtainsSubCategory();
        setCurtainsSubCategory(curtain);
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };

    fetchSidebarData();
  }, []);

  useEffect(() => {
    const userData = async () => {
      try {
        const user = await getUser();

        setUsersId(user);
      } catch (error) {
        console.error("get user:", error);
      }
    };

    userData();
  }, []);

  // const userId = usersId?.id;
  const userName = usersId?.name;

  useEffect(() => {
    const setCorrelationAsync = async () => {
      await setCorrelation();
    };
    setCorrelationAsync();
  }, []);


  // Helper function to get correct sidebar data
  const getSidebarData = (menuTitle: string) => {
    if (menuTitle === "Furniture") return furnitureSubCategory;
    if (menuTitle === "Curtains") return curtainsSubCategory;
    return null;
  };


  return (
    <>
      <div
        className={`hidden lg:block w-full py-6 z-40  bg-white transition-all duration-300 fixed top-0 ${isScrolled ? "shadow" : " relative "
          }`}
      >
        <div className="Container">
          <div className="flex items-center justify-between relative">
            <div>
              <div className="flex items-center lg:gap-0 gap-2">
                <div className="w-[80px]">
                  <Link href="/">
                    {/* <Image
                      src={logo || null}
                      alt="K Wood Mart | Best E-commerce platform in BD"
                      width={100}
                      height={80}
                      className="w-full h-full"
                    /> */}
                    LOGO
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center  2xl:gap-16   gap-2 xl:relative">
              <div className="lg:flex hidden items-center justify-center  ml-8">
                {menuList?.map((menu, index) => (
                  <div
                    onMouseEnter={() => setActiveMenu(menu.title)}
                    onMouseLeave={() => setActiveMenu(null)}
                    key={index}
                    className="relative"
                  >
                    <Link href={menu.link}>
                      <li
                        className={`list-none py-4 hover:text-[#1E3E96] tracking-wider duration-300 menuTitle xl:px-6 px-4 ${index === menuList.length - 1 ? "" : ""
                          }`}
                      >
                        {menu.title}
                      </li>
                    </Link>
                    {menu?.subMenu === true && activeMenu === menu.title && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 top-full w-[800px]"
                      >
                        {getSidebarData(menu.title) && (
                          <DropDownMenu menu={getSidebarData(menu.title)} />
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center xl:gap-4 gap-2">
              <Link href="/cart">
                <div className="px-2 py-2 border rounded relative">
                  <BsCart2 />
                  <p className="top-[-12px] right-[-8px] absolute w-[20px] h-[20px] text-sm text-[#fff] text-center rounded-full bg-[#D4A373]">
                    {userCartProducts?.cartDetails?.length || 0}
                  </p>
                </div>
              </Link>
              <div>
                {userName ? (
                  <div className="p-1 border rounded">
                    <UserPopover />
                  </div>
                ) : (
                  // Show login link if userId is not present
                  <Link href="/login">
                    <div className="px-2 py-2 border rounded">
                      <FiUser />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`py-3 px-4 shadow-md border border-gray-200 fixed w-full z-30 top-0 bg-white transition-all duration-300 lg:hidden `}
      >
        <div className="">
          <div className="flex items-center justify-between relative">
            <div className="flex space-x-3 lg:gap-0 gap-2">
              <div
                onClick={() => setShowSideMenu(!showSideMenu)}
                className={`pr-3  border-gray-300 cursor-pointer mt-6 ${isShopPage ? "lg:hidden" : "lg:block"
                  }`}
              >
                {showSideMenu ? (
                  <RiCloseFill className="text-2xl" />
                ) : (
                  <RiMenuAddFill className="text-2xl" />
                )}
              </div>

              <div className="w-[80px]">
                <Link href="/">
                  <Image
                    src={logo || null}
                    alt="K Wood Mart"
                    width={100}
                    height={80}
                    className="w-full h-full"
                  />
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center 2xl:gap-16 xl:gap-8 lg:gap-4 gap-2 xl:relative">
              <div className="flex items-center justify-center xl:gap-4 gap-2">
                <Link href="/cart">
                  <div className="px-2 py-2 border rounded relative">
                    <BsCart2 />

                    <p className="top-[-12px] right-[-8px] absolute w-[20px] h-[20px] text-sm text-[#fff] text-center rounded-full bg-[#D4A373]">
                      {userCartProducts?.cartDetails?.length || 0}
                    </p>
                  </div>
                </Link>
                <div>
                  {userName ? (
                    <div className="p-1 border rounded">
                      <UserPopover />
                    </div>
                  ) : (
                    // Show login link if userId is not present
                    <Link href="/login">
                      <div className="px-2 py-2 border rounded">
                        <FiUser />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSearch && (
          <ResponsiveSearchForm onClose={() => setShowSearch(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSideMenu && (
          <ResponsiveNavSidBar
            onClose={() => setShowSideMenu(false)}
            menuList={menuList}
            furnitureSubCategory={furnitureSubCategory}
            curtainsSubCategory={curtainsSubCategory}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
