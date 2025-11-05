import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getProductReviewWithPagination } from "./productReviewAction";
import { getCartProducts } from "@/services/cart";
import { getUser } from "@/services/auth";


export default async function ProductReviewsPage() {
  const user = await getUser();
  const userRef = user?.id;
  const coupon = "";
  const userCartProducts = await getCartProducts(userRef, coupon);
  const { data } = await getProductReviewWithPagination("1", "100");

  return (
    <>
      <NavBar userCartProducts={userCartProducts?.data} />
      <div className="min-h-screen py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
        </div>
      </div>
    </>
  );
}
