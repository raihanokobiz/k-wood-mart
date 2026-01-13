import NavBar from "@/components/pages/header/NavBar/NavBar";
import ProductDetails from "@/components/pages/products/ProductDetails/ProductDetails";
import ReletiveProducts from "@/components/pages/products/ReletiveProducts/ReletiveProducts";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import { getEmiPlans } from "@/services/emi";

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

  const emiPlans = await getEmiPlans();


  //  only one active EMI config
  const activeEmiPlan = emiPlans?.data?.find(
    (item: any) => item.isActive === true
  );

  // Debug: Check actual data structure

  //  plans map
  const interestRates =
    activeEmiPlan?.plans?.map((plan: any) => ({
      termMonths: plan.months,
      interestRate: plan.interestRate,
    })) || [];


  return (
    <div>
      <NavBar userCartProducts={userCartProducts?.data} />
      <div className="lg:pt-24">
        <ProductDetails product={product} emiPlans={activeEmiPlan?.plans || []} />
        {/* <ProductReview userRef={userRef} productRef={productId} /> */}
        <ReletiveProducts relativeProducts={relativeProducts} />
      </div>
    </div>
  );
};

export default Page;
