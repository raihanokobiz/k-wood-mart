import Image from "next/image";
import Link from "next/link";
import { apiBaseUrl } from "@/config/config";
import CartDelete from "@/components/actionButton/CartDelete";
import { getCartProducts } from "@/services/cart";
import { getUser } from "@/services/auth";
// import NavBar from "@/components/pages/header/NavBar/NavBar";
import { TProduct } from "@/types";
import { Key, ReactNode } from "react";
import { Metadata } from "next";
import { TbShoppingCartOff } from "react-icons/tb";
import NavBar from "@/components/pages/header/NavBar/NavBar";

export const metadata: Metadata = {
  title: "NOHASAN | cart",
  description: "Best E-commerce platform in BD",
};

const Cart = async () => {
  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const products = await getCartProducts(userId, coupon);

  console.log("----checking for quintity-----", products);

  return (
    <>
      <NavBar userCartProducts={products?.data} />
      <div className="Container w-full mx-auto  md:px-20 xl:px-60 2xl:px-60 lg:mt-0 mt-22">
        <div className="hidden lg:block">
          <h2 className="font-bold md:text-3xl text-xl text-center py-8">
            Your Cart
          </h2>

          {/* Header row */}
          <div className="grid grid-cols-7 font-bold border-t border-black/20 py-5">
            <div className="col-span-2">Product</div>
            <div>Unit Price</div>
            <div>Size</div>
            <div>Quantity</div>
            <div>Subtotal</div>
            <div>Action</div>
          </div>
          {/* make a div */}

          {/* Product rows */}
          {products?.data?.cartDetails?.length > 0 ? (
            products.data.cartDetails.map(
              (product: {
                inventory: any;
                quantity: string;
                subtotal: ReactNode;
                savedAmount: ReactNode;
                cartId: string;
                _id: Key | null | undefined;
                product: TProduct;
              }) => (
                <div
                  key={product._id}
                  className="grid grid-cols-7 items-center border-t border-black/20 py-3"
                >
                  {/* Product */}
                  <div className="col-span-2 flex flex-col xl:flex-row items-start xl:items-center gap-3">
                    {product?.product?.thumbnailImage && (
                      <Image
                        height={100}
                        width={100}
                        src={apiBaseUrl + product?.product?.thumbnailImage}
                        alt={product?.product?.name}
                        className="w-20 h-20 object-cover"
                      />
                    )}
                    <p className="md:text-base text-sm line-clamp-3">
                      {product?.product?.name}
                    </p>
                  </div>

                  {/* Unit Price */}
                  <div className="flex gap-2">
                    <p>৳ {product?.inventory?.price}</p>

                    {product?.inventory?.price !==
                      product?.inventory?.mrpPrice && (
                      <p className="text-red-600 line-through">
                        ৳ {product?.inventory?.mrpPrice}
                      </p>
                    )}
                  </div>

                  {/* Size */}
                  <div>
                    <p>
                      <span className="uppercase">
                        {product?.inventory?.level || "N/A"}
                      </span>
                    </p>
                  </div>

                  {/* Quantity */}
                  <div>{product?.quantity || "N/A"}</div>

                  {/* Subtotal */}
                  <div>
                    <p>৳ {product?.subtotal}</p>
                    {/* <p className="text-red-600 line-through">
                      ৳ {product?.savedAmount}
                    </p> */}
                  </div>

                  {/* Action buttons */}
                  <CartDelete cardId={product?.cartId} />
                </div>
              )
            )
          ) : (
            <div className="text-center text-2xl flex items-center justify-center flex-col gap-2 py-10 text-gray-500">
              <TbShoppingCartOff className="text-3xl" />
              Your cart is currently empty.
            </div>
          )}
        </div>

        <div className="lg:hidden block">
          <h2 className="font-bold md:text-3xl text-xl text-center mt- py-8">
            Your Cart
          </h2>

          {/* Product rows */}
          {products?.data?.cartDetails?.length > 0 ? (
            products.data.cartDetails.map(
              (product: {
                inventory: any;
                quantity: string;
                subtotal: ReactNode;
                savedAmount: ReactNode;
                cartId: string;
                _id: Key | null | undefined;
                product: TProduct;
              }) => (
                <div
                  key={product._id}
                  className="flex flex-col mb-5 bg-[#fcf9f9] hover:bg-[#E6E6E6] transition-colors duration-200 rounded"
                >
                  {/* Product */}
                  <div className="bg-[#F6F6F6] flex justify-between border-t border-black/5 py-3 px-3 rounded-t">
                    <div className="font-bold text-[15px]">
                      <p className="text-[#2287e0] hover:underline hover:text-[#014C8C] px-1">
                        {product?.product?.name}
                      </p>
                    </div>

                    {product?.product?.thumbnailImage && (
                      <Image
                        height={100}
                        width={100}
                        src={apiBaseUrl + product?.product?.thumbnailImage}
                        alt={product?.product?.name}
                        className="w-20 h-20 object-cover"
                      />
                    )}
                  </div>

                  <div className="hover:bg-[#E6E6E6] rounded-b">
                    {/* Price */}
                    <div className="flex justify-between border-t border-black/5 py-3 px-3">
                      <p className="font-bold text-[15px]">Price</p>
                      <div className="flex gap-2">
                        <p>৳ {product?.inventory?.price}</p>
                        {product?.inventory?.price !==
                          product?.inventory?.mrpPrice && (
                          <p className="text-red-600 line-through">
                            ৳ {product?.inventory?.mrpPrice}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Size */}
                    <div className="flex justify-between border-t border-black/5 py-3 px-3">
                      <p className="font-bold text-[15px]">Size</p>
                      {product?.inventory?.level || "N/A"}
                    </div>

                    {/* Quantity */}
                    <div className="flex justify-between border-t border-black/5 py-3 px-3">
                      <p className="font-bold text-[15px]">Quantity</p>
                      <p>{product?.quantity || "N/A"}</p>
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between border-t border-black/5 py-3 px-3">
                      <p className="font-bold text-[15px]">Subtotal</p>
                      <div className="flex gap-2">
                        <p>৳ {product?.subtotal}</p>
                        {/* <p className="text-red-600 line-through">
                          ৳ {product?.savedAmount}
                        </p> */}
                      </div>
                    </div>

                    {/* Action */}
                    <CartDelete cardId={product?.cartId} />
                  </div>
                </div>
              )
            )
          ) : (
            <p className="text-center text-gray-500">
              <div className="text-center md:text-2xl text-xl flex items-center justify-center flex-col gap-2  text-gray-500">
                <TbShoppingCartOff className="text-3xl" />
                Your cart is currently empty.
              </div>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-8 justify-between items-center my-12">
          <div className="text-2xl">
            Total Amount (৳):
            <span className="text-3xl font-bold text-green-600">
              {" "}
              {products?.data?.totalPrice}
            </span>
          </div>
          <Link
            href={products?.data?.cartDetails?.length ? "/checkout" : "/shop"}
            className="text-white text-sm font-semibold items-center text-center w-[70%] sm:w-[50%] md:w-[40%]  bg-[#D4A373] rounded  hover:bg-[#CCD5AE] duration-300 px-2 py-2"
          >
            <span>Place Order</span>
          </Link>
          <Link
            href="/shop"
            className="text-white text-sm font-semibold rounded items-center text-center  w-[70%] sm:w-[50%] md:w-[40%]  bg-[#CCD5AE] hover:bg-[#D4A373] px-2 py-2 mt-3 duration-300"
          >
            <span>Conting Shopping</span>
          </Link>
        </div>
        <div className="bg-[#F6F6F6] text-gray-600 rounded text-center py-5 px-8 my-5">
          <span>
            * If you wish to make a bulk order, please call us at{" "}
            <span className="font-bold text-black">+8801735775093</span> or
            email at{" "}
            <span className="font-bold text-black">info@nohasan.com</span> for
            more information.
          </span>
        </div>
        {/* You May Also Like */}
        {/* ------------------------if we have enough time after completed all required then we work this part------------------------------ */}
        {/* <div className="text-center py-5  my-5">
        <span className=" font-bold text-[20px] ">You May Also Like</span>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 py-8 text-black border-t border-black/20 ">
          {products?.cartDetails?.slice(0, 4).map((product) => (
            <ProductCard
              key={product._id}
              product={{
                thumbnailImage: product.image,
                name: product.title,
                mrpPrice: product.price,
                price: product.salePrice,
              }}
            />
          ))}
        </div>
      </div> */}
      </div>
    </>
  );
};

export default Cart;
