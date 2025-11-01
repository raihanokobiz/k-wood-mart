"use server";
import { apiBaseUrl } from "@/config/config";
import { apiRequest } from "@/lib/apiRequest";
import { TResponse } from "@/types";

export const getHomePageSubCategoryProducts = async (viewType?: string) => {
  const result: TResponse = await apiRequest({
    endpoint: `/product/view-type?viewType=${viewType}`,
  });
  return result;
};

export const getAllProducts = async () => {
  const res = await fetch(`${apiBaseUrl}/product`);

  return res.json();
};


  export const getAllProductsForShop = async (
    {
      categorySlug,
      subCategorySlug,
      childCategorySlug,
      brand,
      page,
      limit,
      minPrice,
      maxPrice,
      sortBy,
      level,
      color,
    }: {
      categorySlug?: string;
      subCategorySlug?: string;
      childCategorySlug?: string;
      brand?: string;
      page?: number;
      limit?: number;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      level?: string;
      color?: string;
    }
  ) => {

  const searchParams = new URLSearchParams();

  if (categorySlug) {
    const categories = categorySlug.split(",");
    categories.forEach((cat) => {
      searchParams.append("categorySlug", cat);
    });
  }

  if (subCategorySlug) {
    const subCategories = subCategorySlug.split(",");
    subCategories.forEach((sub) => {
      searchParams.append("subCategorySlug", sub);
    });
  }

  if (childCategorySlug) {
    const childCategories = childCategorySlug.split(",");
    childCategories.forEach((child) => {
      searchParams.append("childCategorySlug", child);
    });
  }


  if (brand) {
    const brands = brand.split(",");
    brands.forEach((brn) => {
      searchParams.append("brandSlug", brn);
    });
  }

  if (page) {
    searchParams.append("page", page.toString());
  }

  if (limit) {
    searchParams.append("limit", limit.toString());
  }
  if (minPrice !== undefined) {
    searchParams.append("minPrice", minPrice.toString());
  }

  if (maxPrice !== undefined) {
    searchParams.append("maxPrice", maxPrice.toString());
  }
  if (sortBy) {
    searchParams.append("sortBy", sortBy);
  }

  

  if (level) {
    searchParams.append("level", level);
  }

  if (color) {
    searchParams.append("color", color);
  }

  const url = `${apiBaseUrl}/product/pagination?${searchParams.toString()}`;

  console.log("This is the url >>>", url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

export const getAllBestSellProduct = async () => {
  const res = await fetch(`${apiBaseUrl}/product/best-sell`);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};
export const getAllDiscountProduct = async () => {
  const res = await fetch(`${apiBaseUrl}/product/discounted-product`);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};

export const getSingleProductBySlug = async (slug: string) => {
  const res = await fetch(`${apiBaseUrl}/product/${slug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};

export const getRelativeProducts = async (productId: { productId: string }) => {
  console.log("productId", productId);
  const res = await fetch(`${apiBaseUrl}/product/related-product/${productId}`);

  return res.json();
};

// export const getRelativeProducts = async () => {
//   const res = await fetch(`${apiBaseUrl}/category`);

//   return res.json();
// };

export const getSearchProducts = async (search: { search: string }) => {
  const res = await fetch(
    `${apiBaseUrl}/product/search?search=${search?.search}`
  );

  return res.json();
};
