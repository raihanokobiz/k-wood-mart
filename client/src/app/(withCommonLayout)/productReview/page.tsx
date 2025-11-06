import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getProductReviewWithPagination } from "./productReviewAction";
import { getCartProducts } from "@/services/cart";
import { getUser } from "@/services/auth";
import Image from "next/image";
import ReviewsCard from "./ReviewCard";

export default async function ProductReviewsPage() {
  const user = await getUser();
  const userRef = user?.id;
  const coupon = "";
  const userCartProducts = await getCartProducts(userRef, coupon);
  const { data } = await getProductReviewWithPagination("1", "100");

  return (
    <>
      <NavBar userCartProducts={userCartProducts?.data} />
      <div className="min-h-screen">
        {/* Banner Section */}
        <div className="relative overflow-hidden h-64 md:h-80 lg:h-[450px]">
          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80"
              alt="Premium Furniture Collection"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          {/* Text Content */}
          <div className="absolute inset-0 flex items-center justify-center pt-24 lg:pt-14 md:pt-28">
            <div className="text-white p-6 md:p-8 lg:p-12 max-w-2xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-center">
                Customer Reviews & Testimonials
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-center">
                See what our happy customers are saying about our premium
                furniture collection
              </p>
            </div>
          </div>
        </div>
        {/* Reviews Content Section */}
        <div className="py-6 md:py-8 2xl:py-12 px-4 md:px-6 lg:px-8 2xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {data?.result?.map((review: any) => (
               <ReviewsCard key={review._id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}