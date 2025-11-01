import { getAllCategorys } from "@/services/categorys";
import CategoryCardSlider from "@/slider/CategoryCardSlider/CategoryCardSlider";
import React from "react";

const Category = async () => {
  const { data: categoriesList } = await getAllCategorys();
  return (
    <section className="pb-4 md:px-6 lg:px-8">
      <h2
        className="rounded text-[#ed1c24] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
      >
        Shop By Category
      </h2>
      <CategoryCardSlider categoriesList={categoriesList} />
    </section>
  );
};

export default Category;
