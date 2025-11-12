"use client";
import React, { useState } from "react";

import Image from "next/image";
import { rajdhani } from "@/app/font";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { TProduct } from "@/types";
import { apiBaseUrl } from "@/config/config";
import ProductDetailsSlide from "@/slider/ProductDetailsSlide/ProductDetailsSlide";
import { addToCart } from "@/services/cart";
import { toast } from "react-toastify";
import { getUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
interface Props {
  product: TProduct;
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const [count, setCount] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [emiMonths, setEmiMonths] = useState<number | null>(null);

  const [levelError, setLevelError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const controls = useAnimation();

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleBuyNow = async () => {
    const user = await getUser();
    setLoading(true);
    if (!user) {
      toast.error("Please login to proceed to checkout.");
      router.push("/login");
      return;
    }
    if (
      (inventoryType === "levelInventory" ||
        inventoryType === "colorLevelInventory") &&
      !selectedLevel
    ) {
      setLevelError(true);
      setLoading(false);
      return;
    }

    if (
      (inventoryType === "colorLevelInventory" ||
        inventoryType === "colorInventory") &&
      !selectedColor
    ) {
      setColorError(true);
      setLoading(false);
      return;
    }

    try {
      const productPayload: {
        quantity: number;
        productRef: string;
        userRef: string | undefined;
        inventoryRef?: string | null;
      } = {
        quantity: count,
        productRef: _id,
        userRef: user?.id,
      };

      if (inventoryType == "inventory") {
        productPayload.inventoryRef = Array.isArray(inventoryRef)
          ? inventoryRef[0]._id
          : undefined;
      } else if (inventoryType == "levelInventory") {
        productPayload.inventoryRef = selectedLevel;
      } else if (inventoryType == "colorInventory") {
        productPayload.inventoryRef = selectedColor;
      } else if (inventoryType == "colorLevelInventory") {
        productPayload.inventoryRef = selectedColor;
      }

      await addToCart(productPayload);
      router.push("/checkout");
    } catch (err) {
      console.error("Failed to proceed to checkout:", err);
      toast.error("Failed to start checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = () => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const {
    name,
    thumbnailImage,
    backViewImage,
    sizeChartImage,
    description,
    inventoryRef,
    inventoryType,
    images,
    _id,
  } = product;

  const currentPrice = (() => {
    let selectedItem: any;
    if (
      inventoryType === "levelInventory" ||
      inventoryType === "colorLevelInventory"
    ) {
      selectedItem = Array.isArray(inventoryRef)
        ? inventoryRef.find((item) => item._id === selectedLevel)
        : undefined;
    } else if (inventoryType === "colorInventory") {
      selectedItem = Array.isArray(inventoryRef)
        ? inventoryRef.find((item) => item._id === selectedColor)
        : undefined;
    }
    const fallbackItem = Array.isArray(inventoryRef)
      ? inventoryRef[0]
      : undefined;
    const price = selectedItem?.price ?? fallbackItem?.price;
    return price ? Number(price) : 0;
  })();

  const interestRates: Record<number, number> = {
    3: 0,
    6: 0.05,
    9: 0.08,
    12: 0.09,
  };
  const interestRate = emiMonths ? interestRates[emiMonths] ?? 0 : 0;
  const totalPayable = emiMonths
    ? Number((currentPrice * (1 + interestRate)).toFixed(2))
    : 0;
  const monthlyPayment = emiMonths
    ? Number((totalPayable / emiMonths).toFixed(2))
    : 0;

  const handleAddToCart = async () => {
    const user = await getUser();
    setLoading(true);
    if (!user) {
      toast.error("Please login to add product to cart.");
      router.push("/login");
      return;
    }
    if (
      (inventoryType === "levelInventory" ||
        inventoryType === "colorLevelInventory") &&
      !selectedLevel
    ) {
      setLevelError(true);
      setLoading(false);
      return;
    }

    if (
      (inventoryType === "colorLevelInventory" ||
        inventoryType === "colorInventory") &&
      !selectedColor
    ) {
      setColorError(true);
      setLoading(false);
      return;
    }
    try {
      controls.set({ x: 0, y: 0, scale: 1 });
      const product: {
        quantity: number;
        productRef: string;
        userRef: string | undefined;
        inventoryRef?: string | null;
      } = {
        quantity: count,
        productRef: _id,
        userRef: user?.id,
      };

      if (inventoryType == "inventory") {
        product.inventoryRef = Array.isArray(inventoryRef)
          ? inventoryRef[0]._id
          : undefined;
      } else if (inventoryType == "levelInventory") {
        product.inventoryRef = selectedLevel;
      } else if (inventoryType == "colorInventory") {
        product.inventoryRef = selectedColor;
      } else if (inventoryType == "colorLevelInventory") {
        product.inventoryRef = selectedColor;
      }

      await addToCart(product);
      toast.success("Product added to cart!");
      // setShowModal(true);
      setLevelError(false);
      setColorError(false);
      controls.start({
        scale: 0.01,
        x: 1200,
        y: -200,
        transition: { duration: 0.6, ease: "easeInOut" },
      });

      setTimeout(() => {
        controls.set({ x: 10, scale: 0 });
      }, 1000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add product to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="Container py-8 min-h-100 lg:mt-0 mt-16 md:mt-20">
        <div className="grid lg:grid-cols-2 gap-8">
          <ProductDetailsSlide
            controls={controls}
            thumbnailImage={thumbnailImage}
            backViewImage={backViewImage}
            images={images}
            name={name}
            videoUrl={product.videoUrl}
          />

          <div className="space-y-6">
            {/* Product Title & Price */}
            <div className="space-y-3">
              <h2
                className={`text-3xl font-bold text-[#262626] ${rajdhani.className}`}
              >
                {name}
              </h2>

              <div className="flex items-center gap-3">
                <p className="flex items-center gap-1 font-bold text-3xl text-[#D4A373]">
                  <span className="text-xl">৳</span>
                  <span>
                    {(() => {
                      let selectedItem;
                      if (
                        inventoryType === "levelInventory" ||
                        inventoryType === "colorLevelInventory"
                      ) {
                        selectedItem = Array.isArray(inventoryRef)
                          ? inventoryRef.find(
                              (item) => item._id === selectedLevel
                            )
                          : undefined;
                      } else if (inventoryType === "colorInventory") {
                        selectedItem = Array.isArray(inventoryRef)
                          ? inventoryRef.find(
                              (item) => item._id === selectedColor
                            )
                          : undefined;
                      }
                      const fallbackItem = Array.isArray(inventoryRef)
                        ? inventoryRef[0]
                        : undefined;
                      const price = selectedItem?.price ?? fallbackItem?.price;
                      return price ? Number(price).toFixed(2) : "0.00";
                    })()}
                  </span>
                </p>

                {/* <p className="line-through text-[#262626]/40 font-semibold text-lg flex items-center gap-1">
                  <span>৳</span>
                  <span>
                    {(() => {
                      let selectedItem;
                      if (
                        inventoryType === "levelInventory" ||
                        inventoryType === "colorLevelInventory"
                      ) {
                        selectedItem = Array.isArray(inventoryRef)
                          ? inventoryRef.find(
                              (item) => item._id === selectedLevel
                            )
                          : undefined;
                      } else if (inventoryType === "colorInventory") {
                        selectedItem = Array.isArray(inventoryRef)
                          ? inventoryRef.find(
                              (item) => item._id === selectedColor
                            )
                          : undefined;
                      }
                      const fallbackItem = Array.isArray(inventoryRef)
                        ? inventoryRef[0]
                        : undefined;
                      const mrpPrice =
                        selectedItem?.mrpPrice ?? fallbackItem?.mrpPrice;
                      return mrpPrice ? Number(mrpPrice).toFixed(2) : "0.00";
                    })()}
                  </span>
                </p> */}

                {/* {(() => {
                  let selectedItem;
                  if (
                    inventoryType === "levelInventory" ||
                    inventoryType === "colorLevelInventory"
                  ) {
                    selectedItem = Array.isArray(inventoryRef)
                      ? inventoryRef.find((item) => item._id === selectedLevel)
                      : undefined;
                  } else if (inventoryType === "colorInventory") {
                    selectedItem = Array.isArray(inventoryRef)
                      ? inventoryRef.find((item) => item._id === selectedColor)
                      : undefined;
                  }
                  const fallbackItem = Array.isArray(inventoryRef)
                    ? inventoryRef[0]
                    : undefined;
                  const price = selectedItem?.price ?? fallbackItem?.price;
                  const mrpPrice =
                    selectedItem?.mrpPrice ?? fallbackItem?.mrpPrice;
                  const discount =
                    mrpPrice && price
                      ? Math.round(((mrpPrice - price) / mrpPrice) * 100)
                      : 0;

                  return discount > 0 ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {discount}% OFF
                    </span>
                  ) : null;
                })()} */}
              </div>
            </div>

            {/* Size Selection */}
            {(inventoryType === "levelInventory" ||
              inventoryType === "colorLevelInventory") && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3
                  className={`text-lg font-bold text-[#262626] mb-3 ${rajdhani.className}`}
                >
                  Select Size
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {Array.isArray(inventoryRef) &&
                    inventoryRef.map((size) => (
                      <button
                        key={size._id}
                        onClick={() => {
                          setLevel(size.level);
                          setSelectedLevel(size._id);
                          setSelectedColor(null);
                          setLevelError(false);
                        }}
                        className={`min-w-[60px] px-4 py-3 border-2 font-bold text-sm uppercase rounded-lg transition-all duration-300 ${
                          level === size.level
                            ? "bg-[#D4A373] border-[#D4A373] text-white shadow-lg scale-105"
                            : "bg-white border-gray-300 text-[#262626] hover:border-[#D4A373] hover:text-[#D4A373]"
                        }`}
                      >
                        {size.level}
                      </button>
                    ))}
                </div>
                {levelError && (
                  <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Please select a size to continue</span>
                  </p>
                )}
              </div>
            )}

            {/* Color Selection */}
            {((inventoryType === "colorLevelInventory" && selectedLevel) ||
              inventoryType === "colorInventory") && (
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3
                  className={`text-lg font-bold text-[#262626] mb-3 ${rajdhani.className}`}
                >
                  Select Color
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {Array.isArray(inventoryRef) &&
                    inventoryRef.map(
                      (colorItem: { _id: string; color: string }) => (
                        <button
                          key={colorItem._id}
                          onClick={() => {
                            setSelectedColor(colorItem._id);
                            setColorError(false);
                          }}
                          className={`relative w-12 h-12 rounded-full transition-all duration-300 ${
                            selectedColor === colorItem._id
                              ? "ring-4 ring-[#D4A373] ring-offset-2 scale-110"
                              : "ring-2 ring-gray-300 hover:ring-[#D4A373]/50"
                          }`}
                          style={{ backgroundColor: colorItem.color }}
                        >
                          {selectedColor === colorItem._id && (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xl">
                              ✓
                            </span>
                          )}
                        </button>
                      )
                    )}
                </div>
                {colorError && (
                  <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Please select a color to continue</span>
                  </p>
                )}
              </div>
            )}

            {/* EMI Plan */}
            <div className="bg-gradient-to-br from-[#D4A373]/10 via-[#D4A373]/5 to-transparent rounded-xl p-6 border-2 border-[#D4A373]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#D4A373] p-3 rounded-lg shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold text-[#262626] ${rajdhani.className}`}
                >
                  EMI Payment Plan
                </h3>
              </div>

              <div className="relative mb-4">
                <select
                  className="border-2 border-[#D4A373]/50 focus:border-[#D4A373] rounded-xl px-5 py-4 w-full appearance-none bg-white cursor-pointer transition-all duration-300 font-semibold text-[#262626] focus:outline-none focus:ring-4 focus:ring-[#D4A373]/20 shadow-sm"
                  value={emiMonths ?? ""}
                  onChange={(e) =>
                    setEmiMonths(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">Choose your EMI tenure</option>
                  <option value="3">3 months - No Interest 🎉</option>
                  <option value="6">6 months - 5% interest</option>
                  <option value="9">9 months - 8% interest</option>
                  <option value="12">12 months - 9% interest</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-6 h-6 text-[#D4A373]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {emiMonths ? (
                <div className="bg-white rounded-xl p-5 shadow-md border border-[#D4A373]/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <p className="text-xs text-[#262626]/60 font-bold uppercase tracking-wider">
                        Monthly Payment
                      </p>
                      <p className="text-3xl font-black text-[#D4A373] flex items-center gap-1">
                        <span className="text-xl">৳</span>
                        <span>{monthlyPayment.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-[#262626]/60 font-bold uppercase tracking-wider">
                        Total Payable
                      </p>
                      <p className="text-3xl font-black text-[#262626] flex items-center gap-1">
                        <span className="text-xl">৳</span>
                        <span>{totalPayable.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  {emiMonths === 3 && (
                    <div className="mt-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 flex items-center gap-3 shadow-lg">
                      <span className="text-white text-2xl">🎉</span>
                      <p className="text-sm text-white font-bold">
                        Congratulations! You've selected interest-free EMI
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-[#262626]/50 font-medium">
                  💳 Select a tenure to see monthly payment details
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Quantity Counter */}
                <div className="flex items-center bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    className="px-5 py-3 hover:bg-gray-100 transition-colors duration-200 font-bold text-lg"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-6 py-3 font-bold text-lg border-x-2 border-gray-300 min-w-[60px] text-center">
                    {count}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-5 py-3 hover:bg-gray-100 transition-colors duration-200 font-bold text-lg"
                  >
                    <FiPlus />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className="cursor-pointer flex-1 bg-[#D4A373] hover:bg-[#CCD5AE] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 px-6 py-4 font-bold text-base rounded-lg text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <FiPlus className="text-xl" />
                    <span>{loading ? "Adding..." : "Add To Cart"}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={loading}
                    className="cursor-pointer flex-1 bg-[#262626] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 px-6 py-4 font-bold text-base rounded-lg text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? "Processing..." : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3
                className={`text-lg font-bold text-[#262626] mb-3 ${rajdhani.className}`}
              >
                Product Details
              </h3>
              <div
                className="prose prose-sm max-w-none text-[#262626]/80"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>

            {/* Size Chart */}
            {sizeChartImage && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3
                  className={`text-lg font-bold text-[#262626] mb-4 ${rajdhani.className}`}
                >
                  Size Chart
                </h3>
                <Image
                  src={apiBaseUrl + sizeChartImage}
                  alt={`${name} size chart`}
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {/* {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-scaleIn">
            <div className="text-center mb-6">
              <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3
                className={`text-2xl font-bold text-[#262626] mb-2 ${rajdhani.className}`}
              >
                Added to Cart!
              </h3>
              <p className="text-[#262626]/70">
                Your product has been successfully added to the cart.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/cart")}
                className="w-full bg-[#D4A373] hover:bg-[#CCD5AE] transition-all duration-300 px-6 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View Cart
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 px-6 py-4 rounded-xl font-bold text-[#262626]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )} */}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductDetails;
