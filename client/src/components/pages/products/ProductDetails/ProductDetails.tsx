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

  const [levelError, setLevelError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const controls = useAnimation();
  const handleIncrement = () => {
    setCount((prev) => prev + 1);
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

  // const userId = "67f4c99c11813048a36a2496";

  const handleAddToCart = async () => {
    const user = await getUser();
    setLoading(true);
    // if not logged in then redirect to login page
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
      return;
    }

    if (
      (inventoryType === "colorLevelInventory" ||
        inventoryType === "colorInventory") &&
      !selectedColor
    ) {
      setColorError(true);
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
      // router.push("/cart");
      toast.success("Product added to cart!");
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
    <div className="Container  py-8 min-h-100 lg:mt-0 mt-22">
      <div className="grid lg:grid-cols-2 gap-8 ">
        <ProductDetailsSlide
          controls={controls}
          thumbnailImage={thumbnailImage}
          backViewImage={backViewImage}
          images={images}
          name={name}
        />

        <div className="">
          <h2 className={`text-2xl font-semibold ${rajdhani.className}`}>
            {name}
          </h2>

          <div className="flex gap-2 mt-2">
            <p className="flex items-center gap-1 font-semibold text-xl">
              <span>৳</span>{" "}
              <span>
                {(() => {
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

                  // Fall back to index 0 if no valid selection
                  const fallbackItem = Array.isArray(inventoryRef)
                    ? inventoryRef[0]
                    : undefined;
                  const price = selectedItem?.price ?? fallbackItem?.price;

                  return price ? Number(price).toFixed(2) : "0.00";
                })()}
              </span>
            </p>

            <p className="line-through text-[#262626]/60 font-semibold flex items-center gap-1">
              <span>৳</span>
              <span>
                {(() => {
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

                  // Fall back to index 0 if no valid selection
                  const fallbackItem = Array.isArray(inventoryRef)
                    ? inventoryRef[0]
                    : undefined;
                  const mrpPrice =
                    selectedItem?.mrpPrice ?? fallbackItem?.mrpPrice;

                  return mrpPrice ? Number(mrpPrice).toFixed(2) : "0.00";
                })()}
              </span>
            </p>
          </div>

          <div className="mt-3">
            {(inventoryType === "levelInventory" ||
              inventoryType === "colorLevelInventory") && (
              <div className="flex flex-col">
                <h3 className={`text-base font-semibold ${rajdhani.className}`}>
                  Select Size:
                </h3>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#262626]/60 mt-1 cursor-pointer">
                  {Array.isArray(inventoryRef) &&
                    inventoryRef.map((size) => (
                      <p
                        key={size._id}
                        onClick={() => {
                          setLevel(size.level);
                          setSelectedLevel(size._id);
                          setSelectedColor(null);
                          setLevelError(false);
                        }}
                        className={`p-1 border border-[#262626]/60 hover:bg-[#D4A373] hover:text-[#fff] duration-300 cursor-pointer rounded text-center flex items-center justify-center uppercase ${
                          level === size.level ? "bg-[#D4A373] text-white" : ""
                        }`}
                      >
                        {size.level}
                      </p>
                    ))}
                </div>
                {levelError && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select a size.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-3">
            {(inventoryType === "colorLevelInventory" && selectedLevel) ||
            inventoryType === "colorInventory" ? (
              <div className="flex flex-col">
                <h3
                  className={`text-base font-semibold text-[#262626] ${rajdhani.className}`}
                >
                  Select Color:
                </h3>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#262626]/60 mt-1">
                  {Array.isArray(inventoryRef) &&
                    inventoryRef.map(
                      (colorItem: { _id: string; color: string }) => (
                        <div
                          key={colorItem._id}
                          onClick={() => {
                            setSelectedColor(colorItem._id);
                            setColorError(false);
                          }}
                          className={`border ${
                            selectedColor === colorItem._id
                              ? "border-[#D4A373] border-2 w-[20px] h-[20px]"
                              : "border-[#262626] w-[25px] h-[25px]"
                          } rounded-full cursor-pointer`}
                          style={{ backgroundColor: colorItem.color }}
                        />
                      )
                    )}
                </div>
                {colorError && (
                  <p className="text-red-500 text-sm mt-1">
                    Please select color.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          <div className="border-b pb-4">
            <div className="mt-4 flex items-center gap-2 ">
              <div className="flex items-center justify-between border rounded px-3 py-[7px] md:w-[25%] w-[30%]">
                <p onClick={handleDecrement} className="cursor-pointer">
                  <FiMinus />
                </p>
                <span>{count}</span>
                <p onClick={handleIncrement} className="cursor-pointer">
                  <FiPlus />
                </p>
              </div>
              <div className="w-full cursor-pointer">
                <button
                  onClick={handleAddToCart}
                  className="bg-[#D4A373] hover:bg-[#CCD5AE] duration-300 flex items-center gap-1 px-6 py-2.5 font-semibold text-sm  rounded text-[#fff] cursor-pointer"
                >
                  <span>
                    <FiPlus />
                  </span>

                  <span>{loading ? "Sending..." : "Add To Cart"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>

          <div className="mt-3">
            <div className="mt-2">
              {sizeChartImage && (
                <Image
                  src={apiBaseUrl + sizeChartImage}
                  alt={`${name} sizeChartImage`}
                  width={500}
                  height={500}
                  className="w-full h-full rounded"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
