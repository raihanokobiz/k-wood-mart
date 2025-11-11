"use client";

import Link from "next/link";
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

type ChildCategory = {
  _id: string;
  name: string;
  slug: string;
  status: boolean;
  subCategoryRef: string;
};

type SubCategory = {
  _id: string;
  name: string;
  slug: string;
  status: boolean;
  categoryRef: string;
  childCategories: ChildCategory[];
};

type CategoryData = {
  _id: string;
  name: string;
  slug: string;
  subCategories: SubCategory[];
};

type DropDownMenuProps = {
  menu: CategoryData;
};

const DropDownMenu: React.FC<DropDownMenuProps> = ({ menu }) => {
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(
    null
  );

  return (
    <div
      className={`-ml-52 z-[999] bg-white shadow-lg rounded-lg border mt-2 p-6 overflow-auto max-h-[300px]
    ${menu.name === "Curtains" ? "-ml-[310px]" : "-ml-48"}
    `}
    >
      <div className="grid grid-cols-3 gap-6">
        {/* Left side - Sub Categories */}
        <div className="border-r pr-4">
          <h3 className="font-bold text-lg mb-4 text-gray-800">{menu.name}</h3>
          <ul className="space-y-1">
            {menu.subCategories?.map((subCat) => (
              <li
                key={subCat._id}
                onMouseEnter={() => setActiveSubCategory(subCat._id)}
                className="group"
              >
                <Link
                  href={`/${menu.slug}?subCategory=${subCat.slug}`}
                  className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-600 group-hover:text-[#1E3E96] transition-colors">
                    {subCat.name}
                  </span>
                  {subCat.childCategories &&
                    subCat.childCategories.length > 0 && (
                      <IoIosArrowForward className="text-gray-400 group-hover:text-[#1E3E96]" />
                    )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Right side - Child Categories */}
        <div className="col-span-2">
          <AnimatePresence mode="wait">
            {activeSubCategory && (
              <motion.div
                key={activeSubCategory}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {(() => {
                  const activeSubCat = menu.subCategories?.find(
                    (sub) => sub._id === activeSubCategory
                  );

                  if (!activeSubCat || !activeSubCat.childCategories?.length) {
                    return (
                      <div className="text-gray-400 text-sm">
                        No child categories available
                      </div>
                    );
                  }

                  return (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">
                        {activeSubCat.name} Categories
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {activeSubCat.childCategories.map((child) => (
                          <Link
                            key={child._id}
                            href={`/${menu.slug}?subCategory=${activeSubCat.slug}&childCategory=${child.slug}`}
                            className="block py-2 px-3 text-[#1E3E96] hover:text-[#1E3E96] hover:bg-gray-50 rounded transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DropDownMenu;
