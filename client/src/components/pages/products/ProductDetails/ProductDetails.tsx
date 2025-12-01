"use client";
import React, { useState } from "react";
import Image from "next/image";
import { rajdhani } from "@/app/font";
import { FiPlus, FiMinus } from "react-icons/fi";
import { TProduct } from "@/types";
import { apiBaseUrl } from "@/config/config";
import ProductDetailsSlide from "@/slider/ProductDetailsSlide/ProductDetailsSlide";
import { addToCart } from "@/services/cart";
import { toast } from "react-toastify";
import { getUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
import Link from "next/link";

interface Props {
  product: TProduct;
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const [count, setCount] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [emiMonths, setEmiMonths] = useState<number | null>(null);
  // ADD THESE NEW STATES
  const [accordionOpen, setAccordionOpen] = useState<string | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<any>(null);
  const [selectedProductColor, setSelectedProductColor] = useState<any>(null);
  const [selectedProductSize, setSelectedProductSize] = useState<any>(null);
  const [selectedSet, setSelectedSet] = useState<any>(null);

  const [levelError, setLevelError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const controls = useAnimation();


  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const {
    name,
    price,
    mrpPrice,
    isDiscounted,
    discount,
    discountType,
    thumbnailImage,
    backViewImage,
    sizeChartImage,
    description,
    inventoryRef,
    inventoryType,
    images,
    _id,
    productId,
    // ADD THESE
    material,
    fabrics,
    colors,
    sizes,
    set,
  } = product;

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));


  console.log(product, "ok");


  // ✅ Calculate Discounted Price from MRP
  const calculateDiscountedPrice = (
    mrpPrice: number,
    hasDiscount: boolean,
    discValue?: number,
    discType?: string
  ) => {
    if (!hasDiscount || !discValue) return mrpPrice;

    if (discType === "percent") {
      // If MRP = 41 and discount = 5%, then discounted price = 41 - (41 × 0.05) = 38.95
      return mrpPrice - (mrpPrice * discValue) / 100;
    } else if (discType === "flat") {
      // If discount is flat amount, discounted price = MRP - discount
      return mrpPrice - discValue;
    }

    return mrpPrice;
  };

  // ✅ Get Current Price and MRP Data
  const getCurrentPriceData = () => {
    let selectedItem: any = null;

    if (inventoryType === "colorLevelInventory") {
      const levelItem = Array.isArray(inventoryRef)
        ? inventoryRef.find((item) => item._id === selectedLevel)
        : undefined;

      if (levelItem && selectedColor && Array.isArray(levelItem.colors)) {
        selectedItem = levelItem.colors.find(
          (c: any) => c._id === selectedColor
        );
      }
    } else if (inventoryType === "levelInventory") {
      selectedItem = Array.isArray(inventoryRef)
        ? inventoryRef.find((item) => item._id === selectedLevel)
        : undefined;
    } else if (inventoryType === "colorInventory") {
      selectedItem = Array.isArray(inventoryRef)
        ? inventoryRef.find((item) => item._id === selectedColor)
        : undefined;
    } else if (inventoryType === "inventory") {
      selectedItem = Array.isArray(inventoryRef) ? inventoryRef[0] : undefined;
    }

    // Fallback to first item if nothing selected
    if (
      !selectedItem &&
      Array.isArray(inventoryRef) &&
      inventoryRef.length > 0
    ) {
      if (
        inventoryType === "colorLevelInventory" &&
        inventoryRef[0]?.colors?.length > 0
      ) {
        selectedItem = inventoryRef[0].colors[0];
      } else {
        selectedItem = inventoryRef[0];
      }
    }

    // Get MRP (original price) and discount info
    let itemMrpPrice = selectedItem?.mrpPrice
      ? Number(selectedItem.mrpPrice)
      : Number(mrpPrice || price) || 0;
    const itemDiscount = selectedItem?.discount ?? discount;
    const itemDiscountType = selectedItem?.discountType ?? discountType;
    const itemIsDiscounted = selectedItem?.isDiscounted ?? isDiscounted;

    // Calculate discounted price from MRP
    let itemPrice = itemIsDiscounted
      ? calculateDiscountedPrice(
        itemMrpPrice,
        itemIsDiscounted,
        itemDiscount,
        itemDiscountType
      )
      : itemMrpPrice;

    return {
      price: itemPrice,
      mrpPrice: itemMrpPrice,
    };
  };

  const { price: currentPrice, mrpPrice: currentMrpPrice } =
    getCurrentPriceData();

  // ✅ EMI Calculation
  const interestRates: Record<number, number> = {
    3: 0,
    6: 0.05,
    9: 0.08,
    12: 0.09,
  };

  const interestRate = emiMonths ? interestRates[emiMonths] ?? 0 : 0;
  const totalPayable = emiMonths ? currentPrice * (1 + interestRate) : 0;
  const monthlyPayment = emiMonths ? totalPayable / emiMonths : 0;

  // Calculate discount percentage
  const discountPercentage =
    currentMrpPrice > currentPrice
      ? Math.round(((currentMrpPrice - currentPrice) / currentMrpPrice) * 100)
      : 0;

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

      if (inventoryType === "inventory") {
        productPayload.inventoryRef = Array.isArray(inventoryRef)
          ? inventoryRef[0]._id
          : undefined;
      } else if (inventoryType === "levelInventory") {
        productPayload.inventoryRef = selectedLevel;
      } else if (inventoryType === "colorInventory") {
        productPayload.inventoryRef = selectedColor;
      } else if (inventoryType === "colorLevelInventory") {
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

      if (inventoryType === "inventory") {
        product.inventoryRef = Array.isArray(inventoryRef)
          ? inventoryRef[0]._id
          : undefined;
      } else if (inventoryType === "levelInventory") {
        product.inventoryRef = selectedLevel;
      } else if (inventoryType === "colorInventory") {
        product.inventoryRef = selectedColor;
      } else if (inventoryType === "colorLevelInventory") {
        product.inventoryRef = selectedColor;
      }

      await addToCart(product);
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

  //  FIXED IMAGE DISPLAY FUNCTION
  const getDisplayImages = () => {
    // Helper function to properly format image URLs
    const formatImageUrl = (img: string) => {
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      if (img.startsWith('/public/')) {
        return apiBaseUrl + img;
      }
      if (img.startsWith('/')) {
        return apiBaseUrl + img;
      }
      return apiBaseUrl + '/' + img;
    };

    // ✅ Jodi kono item select kora thake, shudhu oi item er images dekhao
    if (selectedFabric?.images?.length) {
      return selectedFabric.images.map((img: string) => formatImageUrl(img));
    } else if (selectedProductColor?.images?.length) {
      return selectedProductColor.images.map((img: string) => formatImageUrl(img));
    } else if (selectedProductSize?.images?.length) {
      return selectedProductSize.images.map((img: string) => formatImageUrl(img));
    } else if (selectedSet?.images?.length) {
      return selectedSet.images.map((img: string) => formatImageUrl(img));
    }

    // ✅ Default: base images dekhao
    return [
      apiBaseUrl + thumbnailImage,
      ...(backViewImage ? [apiBaseUrl + backViewImage] : []),
      ...images.map((img) => apiBaseUrl + img),
    ];
  };

  const displayImages = getDisplayImages();

  return (
    <>
      <div className="Container py-8 min-h-100 lg:mt-0 mt-16 md:mt-20">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Product Title & Price - Mobile/Tablet only */}
          <div className="lg:hidden space-y-2 mb-4">
            <h2 className={`text-3xl font-bold text-[#262626] ${rajdhani.className}`}>
              {name}
            </h2>
            <p className="text-lg md:text-xl text-gray-500 font-semibold">
              Product ID: <span className="text-[#D4A373]">{productId}</span>
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="flex items-center gap-1 font-bold text-3xl text-[#D4A373]">
                <span className="text-xl">৳</span>
                <span>{currentPrice.toFixed(2)}</span>
              </p>
              {discountPercentage > 0 && (
                <>
                  <p className="line-through text-[#262626]/40 font-semibold text-lg flex items-center gap-1">
                    <span>৳</span>
                    <span>{currentMrpPrice.toFixed(2)}</span>
                  </p>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="lg:col-span-8">
            <ProductDetailsSlide
              controls={controls}
              thumbnailImage={thumbnailImage}
              backViewImage={backViewImage}
              // images={images}
              images={displayImages}
              name={name}
              videoUrl={product.videoUrl}
            />
            {/* Description */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
              <button
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </div>
                  <h3 className={`text-lg font-bold text-[#262626] ${rajdhani.className}`}>
                    Product Details
                  </h3>
                </div>
                <svg className={`w-5 h-5 transition-transform duration-300 ${isDescriptionOpen ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDescriptionOpen && (
                <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6 lg:col-span-4 bg-gray-100 rounded-md p-6">
            {/* Product Title & Price */}
            <div className="space-y-2">
              <h2
                className={`text-3xl font-bold text-[#262626] ${rajdhani.className}`}
              >
                {name}
              </h2>
              {/* Product ID */}
              <p className="text-lg md:text-xl text-gray-500 font-semibold">
                Product ID: <span className="text-[#D4A373]">{productId}</span>
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Discounted Price */}
                <p className="flex items-center gap-1 font-bold text-3xl text-[#D4A373]">
                  <span className="text-xl">৳</span>
                  <span>{currentPrice.toFixed(2)}</span>
                </p>

                {/* Show MRP and discount badge only if there's a discount */}
                {discountPercentage > 0 && (
                  <>
                    <p className="line-through text-[#262626]/40 font-semibold text-lg flex items-center gap-1">
                      <span>৳</span>
                      <span>{currentMrpPrice.toFixed(2)}</span>
                    </p>

                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Fabric, Material, Color, Size, Set Accordion */}
            {(material ||
              fabrics?.length > 0 ||
              colors?.length > 0 ||
              sizes?.length > 0 ||
              set?.length > 0) && (
                <div className="space-y-2">
                  {/* Material Accordion */}
                  {material && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() =>
                          setAccordionOpen(
                            accordionOpen === "material" ? null : "material"
                          )
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-lg">🧵</span>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-[#262626]">Material</p>
                            <p className="text-sm text-gray-500">
                              Material And Wood Finish
                            </p>
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform ${accordionOpen === "material" ? "rotate-180" : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {accordionOpen === "material" && (
                        <div className="p-4 pt-0 border-t">
                          <div className="bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 mt-4">
                            {material}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fabric Accordion */}
                  {fabrics?.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() =>
                          setAccordionOpen(
                            accordionOpen === "fabric" ? null : "fabric"
                          )
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-lg">🧶</span>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-[#262626]">Fabric</p>
                            <p className="text-sm text-gray-500">
                              Fabric configuration
                            </p>
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform ${accordionOpen === "fabric" ? "rotate-180" : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {accordionOpen === "fabric" && (
                        <div className="p-4 pt-0 border-t space-y-2">
                          {fabrics.map((fabric: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedFabric(fabric);
                                setSelectedProductColor(null);
                                setSelectedProductSize(null);
                                setSelectedSet(null);
                              }}
                              className={`mt-4 w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedFabric === fabric
                                ? "border-[#D4A373] bg-[#D4A373]/5"
                                : "border-gray-200 hover:border-[#D4A373]/50"
                                }`}
                            >
                              <div
                                className="w-10 h-10 rounded-md border-2 border-white shadow"
                                style={{ backgroundColor: fabric.colorCode }}
                              />
                              <span className="font-medium text-sm">
                                {fabric.colorName}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Colors Accordion */}
                  {colors?.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() =>
                          setAccordionOpen(
                            accordionOpen === "color" ? null : "color"
                          )
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-lg">🎨</span>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-[#262626]">Color</p>
                            <p className="text-sm text-gray-500">
                              Material & Wood Finish Color
                            </p>
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform ${accordionOpen === "color" ? "rotate-180" : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {accordionOpen === "color" && (
                        <div className="p-4 pt-0 border-t space-y-2">
                          {colors.map((color: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedProductColor(color);
                                setSelectedFabric(null);
                                setSelectedProductSize(null);
                                setSelectedSet(null);
                              }}
                              className={` mt-4 w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${selectedProductColor === color
                                ? "border-[#D4A373] bg-[#D4A373]/5"
                                : "border-gray-200 hover:border-[#D4A373]/50"
                                }`}
                            >
                              <span className="font-medium text-sm">
                                {color.colorName}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sizes Accordion */}
                  {sizes?.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() =>
                          setAccordionOpen(
                            accordionOpen === "size" ? null : "size"
                          )
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-lg">📏</span>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-[#262626]">Size</p>
                            <p className="text-sm text-gray-500">Material Size</p>
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform ${accordionOpen === "size" ? "rotate-180" : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {accordionOpen === "size" && (
                        <div className="p-4 pt-0 border-t space-y-2">
                          {sizes.map((size: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedProductSize(size);
                                setSelectedFabric(null);
                                setSelectedProductColor(null);
                                setSelectedSet(null);
                              }}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer mt-4 ${selectedProductSize === size
                                ? "border-[#D4A373] bg-[#D4A373]/5"
                                : "border-gray-200 hover:border-[#D4A373]/50"
                                }`}
                            >
                              <span className="font-medium text-sm text-gray-600">
                                {size.sizeName}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Set Accordion */}
                  {set?.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() =>
                          setAccordionOpen(accordionOpen === "set" ? null : "set")
                        }
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-lg">📦</span>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-[#262626]">Set</p>
                            <p className="text-sm text-gray-500">Set Option</p>
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform ${accordionOpen === "set" ? "rotate-180" : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {accordionOpen === "set" && (
                        <div className="p-4 pt-0 border-t space-y-2">
                          {set.map((setItem: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedSet(setItem);
                                setSelectedFabric(null);
                                setSelectedProductColor(null);
                                setSelectedProductSize(null);
                              }}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all mt-4 cursor-pointer ${selectedSet === setItem
                                ? "border-[#D4A373] bg-[#D4A373]/5"
                                : "border-gray-200 hover:border-[#D4A373]/50"
                                }`}
                            >
                              <span className="font-medium text-sm">
                                {setItem.setName}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

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
                          className={`min-w-[60px] px-4 py-3 border-2 font-bold text-sm uppercase rounded-lg transition-all duration-300 ${level === size.level
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
                    {(() => {
                      let colorItems: Array<{
                        _id: string;
                        color: string;
                        name?: string;
                      }> = [];

                      if (
                        inventoryType === "colorLevelInventory" &&
                        selectedLevel
                      ) {
                        const levelItem = Array.isArray(inventoryRef)
                          ? inventoryRef.find(
                            (item) => item._id === selectedLevel
                          )
                          : undefined;
                        colorItems = levelItem?.colors || [];
                      } else if (inventoryType === "colorInventory") {
                        colorItems = Array.isArray(inventoryRef)
                          ? inventoryRef
                          : [];
                      }

                      return colorItems.map((colorItem) => (
                        <button
                          key={colorItem._id}
                          onClick={() => {
                            setSelectedColor(colorItem._id);
                            setColorError(false);
                          }}
                          className={`relative w-12 h-12 rounded-full transition-all duration-300 ${selectedColor === colorItem._id
                            ? "ring-4 ring-[#D4A373] ring-offset-2 scale-110"
                            : "ring-2 ring-gray-300 hover:ring-[#D4A373]/50"
                            }`}
                          style={{ backgroundColor: colorItem.color }}
                          title={colorItem.name || colorItem.color}
                        >
                          {selectedColor === colorItem._id && (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xl">
                              ✓
                            </span>
                          )}
                        </button>
                      ));
                    })()}
                  </div>
                  {colorError && (
                    <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Please select a color to continue</span>
                    </p>
                  )}
                </div>
              )}


            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Quantity Counter */}
                <div className="flex items-center bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    className="px-8 py-3 hover:bg-gray-100 transition-colors duration-200 font-bold text-lg"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-8 py-3 font-bold text-lg border-x-2 border-gray-300 min-w-[60px] text-center">
                    {count}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-8 py-3 hover:bg-gray-100 transition-colors duration-200 font-bold text-lg"
                  >
                    <FiPlus />
                  </button>
                </div>

                {/* Action Buttons */}
                {/* <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
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
                </div> */}
                <Link href="/contact" className="flex-1 w-full">
                  <button
                    className="flex-1 w-full bg-gradient-to-r from-[#D4A373] to-[#CCD5AE] hover:from-[#CCD5AE] hover:to-[#D4A373] transition-all duration-500 px-8 py-4 font-bold text-lg rounded-lg text-white shadow-lg hover:shadow-md  flex items-center justify-center gap-3 group cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Get a Quote</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>

              </div>
            </div>

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

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 lg:hidden">
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
    </>
  );
};

export default ProductDetails;
