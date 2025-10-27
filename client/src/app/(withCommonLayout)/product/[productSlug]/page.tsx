import NavBar from "@/components/pages/header/NavBar/NavBar";
import ProductDetails from "@/components/pages/products/ProductDetails/ProductDetails";
import ReletiveProducts from "@/components/pages/products/ReletiveProducts/ReletiveProducts";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";

import {
  getRelativeProducts,
  getSingleProductBySlug,
} from "@/services/products";
import React from "react";

interface PageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { data: product } = await getSingleProductBySlug(
    resolvedParams.productSlug
  );

  const user = await getUser();
  const userRef = user?.id;

  const productId = product?._id;

  const { data: relativeProducts } = await getRelativeProducts(productId);

  // ==================== Product Details ====================
  const coupon = "";
  const userCartProducts = await getCartProducts(userRef, coupon);

  return (
    <div>
      <NavBar userCartProducts={userCartProducts?.data} />
      <ProductDetails product={product} />
      {/* <ProductReview userRef={userRef} productRef={productId} /> */}
      <ReletiveProducts relativeProducts={relativeProducts} />
    </div>
  );
};

export default Page;
