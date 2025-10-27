"use client";

import {
  TBrand,
  TChildCategory,
  TGender,
  TShopSideBar,
  TShopSideBarResponsive,
  TSubCategory,
} from "@/types";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Range } from "react-range";

interface ShopProductsCategoriesProps {
  shopSideBar: TShopSideBar[];
  products: TShopSideBarResponsive;
}

const ShopProductsCategories: React.FC<ShopProductsCategoriesProps> = ({
  shopSideBar,
  products,
}) => {
  // const propProduct: TProduct[] = products;
  console.log("shopSideBar", shopSideBar);
  console.log("products", products);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );
  const [selectedChildCategories, setSelectedChildCategories] = useState<
    string[]
  >([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  // const MIN = products?.priceRange?.minPrice || 0;
  const MIN = 0;
  const MAX = products?.priceRange?.maxPrice || 10000;
  // const MIN = 0;
  // const MAX = 10000;

  const [values, setValues] = useState([MIN, MAX]);

  console.log("This is products form products", products);
  // console.log("This is products form MAX", MAX);
  useEffect(() => {
    const cats = searchParams.get("category")?.split(",") || [];
    const subCats = searchParams.get("subCategory")?.split(",") || [];
    const childCats = searchParams.get("childCategory")?.split(",") || [];
    const brands = searchParams.get("brand")?.split(",") || [];
    const genders = searchParams.get("gender")?.split(",") || [];
    const minPrice = Number(searchParams.get("minPrice")) || MIN;
    const maxPrice = Number(searchParams.get("maxPrice")) || MAX;
    console.log("for  brands", brands);
    console.log("for  genders", genders);
    setSelectedCategories(cats);
    setSelectedSubCategories(subCats);
    setSelectedChildCategories(childCats);
    setSelectedBrands(brands);
    setSelectedGenders(genders);

    setValues([minPrice, maxPrice]);
  }, [searchParams, MIN, MAX]);

  const updateParams = (
    type: "category" | "subCategory" | "childCategory" | "brand" | "gender",
    value: string
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentValues = new Set(
      (searchParams.get(type)?.split(",") || []).filter(Boolean)
    );

    if (currentValues.has(value)) {
      currentValues.delete(value);
    } else {
      currentValues.add(value);
    }

    if (currentValues.size > 0) {
      newParams.set(type, Array.from(currentValues).join(","));
    } else {
      newParams.delete(type);
    }

    router.push(`?${newParams.toString()}`);
  };

  const updatePriceParams = (min: number, max: number) => {
    const newParams = new URLSearchParams(searchParams.toString());

    newParams.set("minPrice", String(min));
    newParams.set("maxPrice", String(max));

    router.push(`?${newParams.toString()}`);
  };

  // console.log("try to find brand for filter", products);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValues = [...values];
    newValues[index] = Number(event.target.value);

    // Ensure min is always <= max
    if (newValues[0] <= newValues[1]) {
      setValues(newValues);
      updatePriceParams(newValues[0], newValues[1]);
    }
  };

  console.log("geting value", values);

  return (
    <div className="px-4 pt-2 sticky top-0 h-screen overflow-y-scroll custom-scroll flex flex-col gap-4 pb-12">
      <div>
        <div className="space-y-2 border border-[#D4A373] rounded px-3 py-4 h-[220px]">
          <h2 className="pb-2 text-base font-semibold uppercase">
            Price range
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">
                Min Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">৳</span>
                <input
                  type="number"
                  value={values[0]}
                  onChange={(e) => handleInputChange(0, e)}
                  className="pl-7 pr-3 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200"
                  min={MIN}
                  max={MAX}
                />
              </div>
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-semibold mb-1">
                Max Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">৳</span>
                <input
                  type="number"
                  value={values[1]}
                  onChange={(e) => handleInputChange(1, e)}
                  className="pl-7 pr-3 py-2 w-full border rounded-lg focus:ring focus:ring-blue-200"
                  min={MIN}
                  max={MAX}
                />
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="py-2">
            <Range
              step={10}
              min={MIN}
              max={MAX}
              values={values}
              onChange={(newValues) => {
                setValues(newValues);
              }}
              onFinalChange={(finalValues) => {
                updatePriceParams(finalValues[0], finalValues[1]);
              }}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    background:
                      "linear-gradient(to right, #D4A373 0%, #D4A373 " +
                      (values[0] / MAX) * 100 +
                      "%, #CCD5AE " +
                      (values[1] / MAX) * 100 +
                      "%, #D4A373 100%)",
                    borderRadius: "4px",
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "20px",
                    width: "20px",
                    backgroundColor: "#D4A373",
                    borderRadius: "50%",
                    border: "2px solid white",
                    boxShadow: "0 0 3px rgba(0, 0, 0, 0.3)",
                  }}
                />
              )}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500 pb-2">
            <span>৳{values[0]}</span>
            <span>৳{values[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <ul className="space-y-2 border border-[#D4A373] rounded px-3 py-4 h-[258px] overflow-y-scroll">
          <h2 className="pb-2 text-base font-semibold">CATEGORY</h2>
          {shopSideBar?.map((cat) => (
            <li key={cat._id}>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => updateParams("category", cat.slug)}
                  className="accent-[#495588]"
                />
                {cat.name}
              </label>

              <ul className="space-y-1 pl-6 mt-1">
                {Array.isArray(cat.subCategories) &&
                  cat.subCategories.map((subCat: TSubCategory) => (
                    <li key={subCat._id}>
                      <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={selectedSubCategories.includes(subCat.slug)}
                          onChange={() =>
                            updateParams("subCategory", subCat.slug)
                          }
                          className="accent-[#495588]"
                        />
                        {subCat.name}
                      </label>

                      <ul className="space-y-1 pl-6 mt-1">
                        {Array.isArray(subCat.childCategories) &&
                          subCat.childCategories.map(
                            (childCat: TChildCategory) => (
                              <li key={childCat._id}>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                  <input
                                    type="checkbox"
                                    checked={selectedChildCategories.includes(
                                      childCat.slug
                                    )}
                                    onChange={() =>
                                      updateParams(
                                        "childCategory",
                                        childCat.slug
                                      )
                                    }
                                    className="accent-[#495588]"
                                  />
                                  {childCat.name}
                                </label>
                              </li>
                            )
                          )}
                      </ul>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="space-y-2 border border-[#D4A373] rounded px-3 py-4 h-[250px] overflow-y-scroll">
          <h2 className="pb-2 text-base font-semibold uppercase">Brands</h2>
          <div>
            {products?.brands?.map((brand: TBrand) => (
              <ul key={brand._id}>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand?.slug)}
                      onChange={() => updateParams("brand", brand?.slug)}
                      className="accent-[#495588]"
                    />
                    {brand.name}
                  </label>
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="space-y-2 border border-[#D4A373] rounded px-3 py-4 h-[160px]">
          <h2 className="pb-2 text-base font-semibold uppercase">Genders</h2>

          <div>
            {Array.isArray(products?.genders) &&
              products?.genders?.map((gender: TGender) => (
                <ul key={gender}>
                  <li>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(gender)}
                        onChange={() => updateParams("gender", gender)}
                        className="accent-[#495588]"
                      />
                      {gender}
                    </label>
                  </li>
                </ul>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProductsCategories;
