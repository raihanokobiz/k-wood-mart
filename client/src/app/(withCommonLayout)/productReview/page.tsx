import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getProductReviewWithPagination } from "./productReviewAction";
import { getCartProducts } from "@/services/cart";
import { getUser } from "@/services/auth";
import Image from "next/image";


export default async function ProductReviewsPage() {
  const user = await getUser();
  const userRef = user?.id;
  const coupon = "";
  const userCartProducts = await getCartProducts(userRef, coupon);
  const { data } = await getProductReviewWithPagination("1", "100");

  return (
    <>
      <NavBar userCartProducts={userCartProducts?.data} />
      <div className="min-h-screen pb-8 md:pb-12 lg:pb-16 ">
        {/* Furniture Sub Banner - same */}
        <div className="mb-6 md:mb-8 relative overflow-hidden h-64 md:h-80 lg:h-[450px]">
          <div className="relative w-full h-[450px] overflow-hidden">
             <Image  />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pt-24 lg:pt-14 md:pt-28">
            <div className="text-white p-6 md:p-8 lg:p-12 max-w-2xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center">
                Premium Furniture Collection
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-center">
                Discover handcrafted wooden furniture that brings warmth and
                elegance to your home
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
