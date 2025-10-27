"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { HiMiniXMark } from "react-icons/hi2";

const SearchCancel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categorySlugs = searchParams.getAll("category");
  const subCategorySlugs = searchParams.getAll("subCategory");
  const childCategorySlugs = searchParams.getAll("childCategory");
  const brandSlugs = searchParams.getAll("brand");
  const genderSlugs = searchParams.getAll("gender");

  // Split categories by commas
  const allCategories = categorySlugs.flatMap((cat) => cat.split(","));
  const allSubCategories = subCategorySlugs.flatMap((sub) => sub.split(","));
  const allChildCategories = childCategorySlugs.flatMap((sub) =>
    sub.split(",")
  );
  const allbrands = brandSlugs.flatMap((brn) => brn.split(","));
  const allgenders = genderSlugs.flatMap((gen) => gen.split(","));

  // const handleClear = () => {
  //   const newParams = new URLSearchParams(searchParams.toString());

  //   // Remove all categories and subcategories
  //   categorySlugs.forEach((cat) => newParams.delete("category"));
  //   subCategorySlugs.forEach((sub) => newParams.delete("subCategory"));

  //   router.replace(`?${newParams.toString()}`);
  // };

  const handleClear = (
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

  // Don't show the component if no categories or subcategories are present
  if (
    categorySlugs.length === 0 &&
    subCategorySlugs.length === 0 &&
    childCategorySlugs.length === 0 &&
    brandSlugs.length === 0 &&
    genderSlugs.length === 0
  )
    return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
      {/* Render selected categories in separate divs */}
      {allCategories.length > 0 && (
        // <div className="flex gap-x-2">
        <>
          {allCategories.map((cat, index) => (
            <div
              key={index}
              className="bg-[#D4A373] inline-flex p-1 px-2 rounded text-[#fff] text-sm items-center justify-center gap-1 capitalize"
            >
              <p>{cat}</p>
              <HiMiniXMark
                className="text-lg cursor-pointer"
                onClick={() => handleClear("category", cat)}
              />
            </div>
          ))}
        </>
      )}

      {allSubCategories.length > 0 && (
        <>
          {allSubCategories.map((sub, index) => (
            <div
              key={index}
              className="bg-[#D4A373] inline-flex p-1 px-2 rounded text-[#fff] text-sm items-center justify-center gap-1 capitalize"
            >
              <p>{sub}</p>
              <HiMiniXMark
                className="text-lg cursor-pointer"
                onClick={() => handleClear("subCategory", sub)}
              />
            </div>
          ))}
        </>
      )}

      {allChildCategories.length > 0 && (
        <>
          {allChildCategories.map((child, index) => (
            <div
              key={index}
              className="bg-[#D4A373] inline-flex p-1 px-2 rounded text-[#fff] text-sm items-center justify-center gap-1 capitalize"
            >
              <p>{child}</p>
              <HiMiniXMark
                className="text-lg cursor-pointer"
                onClick={() => handleClear("childCategory", child)}
              />
            </div>
          ))}
        </>
      )}

      {allbrands.length > 0 && (
        <>
          {allbrands.map((brn, index) => (
            <div
              key={index}
              className="bg-[#D4A373] inline-flex p-1 px-2 rounded text-[#fff] text-sm items-center justify-center gap-1 capitalize"
            >
              <p>{brn}</p>
              <HiMiniXMark
                className="text-lg cursor-pointer"
                onClick={() => handleClear("brand", brn)}
              />
            </div>
          ))}
        </>
      )}

      {allgenders.length > 0 && (
        <>
          {allgenders.map((gen, index) => (
            <div
              key={index}
              className="bg-[#D4A373] inline-flex p-1 px-2 rounded text-[#fff] text-sm items-center justify-center gap-1 capitalize"
            >
              <p>{gen}</p>
              <HiMiniXMark
                className="text-lg cursor-pointer"
                onClick={() => handleClear("gender", gen)}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchCancel;
