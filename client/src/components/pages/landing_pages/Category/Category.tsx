import { getAllCategorys } from "@/services/categorys";
import CategoryCardSlider from "@/slider/CategoryCardSlider/CategoryCardSlider";
import React from "react";

const Category = async () => {
  const { data: categoriesList } = await getAllCategorys();
  return (
    <div className="Container py-4 mt-6">
      <div className="text-center pb-5">
        <h2 className="md:text-2xl text-xl font-semibold">SHOP BY CATEGORY</h2>
      </div>
      <CategoryCardSlider categoriesList={categoriesList} />
    </div>
  );
};

export default Category;
