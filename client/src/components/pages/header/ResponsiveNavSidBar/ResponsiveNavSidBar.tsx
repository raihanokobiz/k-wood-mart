"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TShopSideBar, TShopSideBarResponsive } from "@/types";
import { usePathname } from "next/navigation";
import { getShopSidebar } from "@/services/shopSidebar";
import ShopPageSidebar from "./ShopPageSidebar";
import AllPageSidebar from "./AllPageSidebar";
import { getAllProductsForShop } from "@/services/products";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Link from "next/link";

type ChildCategory = {
  _id: string;
  name: string;
  slug?: string;
};

type SubCategory = {
  _id: string;
  name: string;
  slug?: string;
  childCategories?: ChildCategory[];
};

type CategoryNav = {
  _id: string;
  name: string;
  slug?: string;
  subCategories?: SubCategory[];
};

type Props = {
  onClose: () => void;
  menuList: typeof menuList;
  furnitureSubCategory?: CategoryNav | null;
  curtainsSubCategory?: CategoryNav | null;
};

const ResponsiveNavSidBar: React.FC<Props> = ({
  onClose,
  menuList,
  furnitureSubCategory,
  curtainsSubCategory,
}) => {
  const pathname = usePathname();
  const [shopSideBar, setShopSideBar] = useState<TShopSideBar[]>([]);
  const [products, setProducts] = useState<TShopSideBarResponsive | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null); // Top menu open
  const [openSub, setOpenSub] = useState<string | null>(null);

  const getSidebarData = (menuTitle: string): CategoryNav | null => {
    if (menuTitle.toLowerCase() === "furniture")
      return furnitureSubCategory || null;
    if (menuTitle.toLowerCase() === "curtains")
      return curtainsSubCategory || null;
    return null;
  };

  const toggleMenu = (title: string) => {
    if (openMenu === title) {
      setOpenMenu(null);
      setOpenSub(null);
    } else {
      setOpenMenu(title);
      setOpenSub(null);
    }
  };

  const toggleSub = (subId: string) => {
    setOpenSub((prev) => (prev === subId ? null : subId));
  };

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

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.28 }}
        className="fixed top-8 left-0 z-40 w-[75%] sm:w-[60%] md:w-[45%] h-screen bg-white p-4 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Menu</h3>
          <button
            className="text-sm text-gray-500"
            onClick={() => {
              setOpenMenu(null);
              setOpenSub(null);
              onClose();
            }}
          >
            Close
          </button>
        </div>

        <nav className="space-y-2">
          {menuList.map((menu) => {
            const categoryData = getSidebarData(menu.title);
            const hasSub = !!categoryData?.subCategories?.length;

            return (
              <div key={menu.title} className="border-b last:border-b-0 pb-2">
                {/* Top menu item */}
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    {menu.subMenu ? (
                      <button
                        onClick={() => toggleMenu(menu.title)}
                        className="w-full text-left py-2 flex items-center justify-between"
                      >
                        <span>{menu.title}</span>
                        {openMenu === menu.title ? (
                          <IoIosArrowUp size={20} />
                        ) : (
                          <IoIosArrowDown size={20} />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={menu.link}
                        onClick={onClose}
                        className="block py-2"
                      >
                        {menu.title}
                      </Link>
                    )}
                  </div>
                </div>

                {/* SubCategories */}
                <AnimatePresence>
                  {openMenu === menu.title &&
                  categoryData?.subCategories?.length ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="pl-4 mt-1 space-y-1"
                    >
                      {categoryData.subCategories.map((sub) => {
                        const hasChild = !!sub.childCategories?.length;
                        return (
                          <div key={sub._id}>
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() => hasChild && toggleSub(sub._id)}
                                className="text-left w-full py-1 flex items-center justify-between"
                              >
                                <span>{sub.name}</span>
                                {hasChild &&
                                  (openSub === sub._id ? (
                                    <IoIosArrowUp size={16} />
                                  ) : (
                                    <IoIosArrowDown size={16} />
                                  ))}
                              </button>
                            </div>

                            {/* ChildCategories */}
                            <AnimatePresence>
                              {openSub === sub._id &&
                              sub.childCategories?.length ? (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.16 }}
                                  className="pl-4 mt-1 space-y-1 text-gray-600"
                                >
                                  {sub.childCategories.map((child) => (
                                    <li key={child._id}>
                                      <Link
                                        href={`/${categoryData.slug}/${sub.slug}/${child.slug}`}
                                        onClick={onClose}
                                        className="block py-1"
                                      >
                                        {child.name}
                                      </Link>
                                    </li>
                                  ))}
                                </motion.ul>
                              ) : null}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </motion.aside>
    </div>
  );
};

export default ResponsiveNavSidBar;
