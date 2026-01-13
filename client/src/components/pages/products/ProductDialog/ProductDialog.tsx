"use client";
import { rajdhani } from "@/app/font";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiBaseUrl } from "@/config/config";
import { getUser } from "@/services/auth";
import { addToCart } from "@/services/cart";

import Image from "next/image";
import { useRef, useState } from "react";
import { BsFillCartPlusFill } from "react-icons/bs";
import { FiMinus, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

import { motion, useAnimation } from "framer-motion";

interface InventoryItem {
  _id: string;
  availableQuantity: number;
  barcode: string;
  color: string;
  createdAt: string;
  holdQuantity: number;
  inventoryID: string;
  level: string;
  name: string;
  productRef: string;
  quantity: number;
  soldQuantity: number;
  updatedAt: string;
  price: any; // Added price property
  mrpPrice: any; // Added mrpPrice property
}

interface Product {
  name: string;
  thumbnailImage: string;
  inventoryRef: InventoryItem[];
  inventoryType: string;
  productRef: string;
}
const ProductDialog: React.FC<Product> = ({
  name,
  thumbnailImage,
  inventoryRef,
  inventoryType,
  productRef,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const [levelError, setLevelError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const controls = useAnimation();
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleAddToCart = async () => {
    // Trigger animation

    try {
      const user = await getUser();
      controls.set({ x: 0, y: 0, scale: 1 });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const imageBox = imageRef.current?.getBoundingClientRect();

      // const cartBox = cartRef.current?.getBoundingClientRect();

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

      const product: {
        quantity: number;
        productRef: string;
        userRef: string | undefined;
        inventoryRef?: string | null;
      } = {
        productRef: productRef,
        userRef: user?.id,
        quantity: count,
      };

      if (inventoryType == "inventory") {
        product.inventoryRef = inventoryRef[0]._id;
      } else if (inventoryType == "levelInventory") {
        product.inventoryRef = selectedLevel;
      } else if (inventoryType == "colorInventory") {
        product.inventoryRef = selectedColor;
      } else if (inventoryType == "colorLevelInventory") {
        product.inventoryRef = selectedColor;
      }

      await addToCart(product);

      let currentX = 0;
      let currentY = 0;

      if ((imageBox?.width ?? 0) <= 120) {
        currentX = (imageBox?.x ?? 0) + 400;
        currentY = 120;
      } else {
        currentX = (imageBox?.x ?? 0) + 450;
        currentY = 40;
      }

      controls.start({
        scale: 0.1,
        x: currentX,
        y: currentY,
        transition: { duration: 0.6, ease: "easeInOut" },
      });
      // setOpen(false);
      toast.success("Product added to cart!");
      setLevelError(false);
      setColorError(false);

      // Reset image after animation
      setTimeout(() => {
        controls.set({ x: 1120, scale: 0 });
      }, 1500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add product to cart.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="flex items-center justify-center py-2 rounded text-[#fff] text-sm font-semibold mt-2 bg-[#D4A373] group-hover:bg-[#CCD5AE] w-full gap-2 duration-300 cursor-pointer"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span>
            <BsFillCartPlusFill />
          </span>
          <motion.span
            key={isHovered ? "click" : "add"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="capitalize"
          >
            {isHovered ? "click to add" : "add to cart"}
          </motion.span>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="border-b border-[#262626]/20 p-4">
            Price Details
          </DialogTitle>
          <DialogDescription className=" px-4 hidden md:block text-base capitalize ">
            {name}
          </DialogDescription>
        </DialogHeader>
        <div className="md:px-4 pb-4 flex md:flex-row flex-col md:justify-normal  gap-4">
          <div className="flex items-center justify-between bg-[#F8F8F8] px-8">
            <div className=" md:w-[200px] w-[60px] md:rounded relative">
              <div>
                {thumbnailImage && (
                  <Image
                    src={apiBaseUrl + thumbnailImage}
                    alt={name}
                    width={200}
                    height={200}
                    className="md:rounded w-full h-full"
                  />
                )}
              </div>
              <div className="top-0 absolute ">
                {thumbnailImage && (
                  <motion.div ref={imageRef} animate={controls}>
                    <Image
                      src={apiBaseUrl + thumbnailImage}
                      alt={name}
                      width={200}
                      height={200}
                      className="md:rounded w-full h-full"
                    />
                  </motion.div>
                )}
              </div>
            </div>
            <p className="md:hidden font-semibold text-sm text-[#262626]/70 line-clamp-1 capitalize">
              {name}
            </p>
          </div>

          <div className="w-full">
            <div className="md:px-0 px-6">
              {(inventoryType === "levelInventory" ||
                inventoryType === "colorLevelInventory") && (
                <div className="flex flex-col">
                  <h3
                    className={`text-base font-semibold ${rajdhani.className}`}
                  >
                    Select Size:
                  </h3>
                  {Array.isArray(inventoryRef) ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#262626]/60 mt-1 cursor-pointer">
                      {inventoryRef?.length ? (
                        inventoryRef
                          .filter(
                            (value, index, item) =>
                              index ===
                              item.findIndex((t) => t.level === value.level)
                          )
                          .map((size) => (
                            <p
                              key={size._id}
                              onClick={() => {
                                setLevel(size.level);
                                setSelectedLevel(size._id);
                                setSelectedColor(null);
                                setLevelError(false);
                              }}
                              className={`p-1 border border-[#262626]/60 hover:bg-[#D4A373] hover:text-[#fff] duration-300 cursor-pointer rounded text-center flex items-center justify-center uppercase ${
                                level === size.level
                                  ? "bg-[#D4A373] text-white"
                                  : ""
                              }`}
                            >
                              {size.level}
                            </p>
                          ))
                      ) : (
                        <p className="text-sm text-[#262626]/70 bg-[red]">
                          Free Size
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#262626]/60 mt-1 cursor-pointer">
                      <p
                        key={(inventoryRef as InventoryItem)._id}
                        onClick={() => {
                          setLevel((inventoryRef as InventoryItem).level);
                          setSelectedLevel((inventoryRef as InventoryItem)._id);
                          setSelectedColor(null);
                          setLevelError(false);
                        }}
                        className={`p-1 border border-[#262626]/60 hover:bg-[#D4A373] hover:text-[#fff] duration-300 cursor-pointer rounded text-center flex items-center justify-center uppercase ${
                          level === (inventoryRef as InventoryItem).level
                            ? "bg-[#D4A373] text-white"
                            : ""
                        }`}
                      >
                        {(inventoryRef as InventoryItem).level}
                      </p>
                    </div>
                  )}
                  {levelError && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select a size.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 md:px-0 px-6">
              {(inventoryType === "colorLevelInventory" && selectedLevel) ||
              inventoryType === "colorInventory" ? (
                <div className="flex flex-col">
                  <h3
                    className={`text-base font-semibold text-[#262626] ${rajdhani.className}`}
                  >
                    Select Color:
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#262626]/60 mt-1">
                    {inventoryRef
                      ?.filter((item) =>
                        inventoryType === "colorLevelInventory"
                          ? item.level === level
                          : true
                      )
                      .filter(
                        (value, index, arr) =>
                          index ===
                          arr.findIndex((t) => t.color === value.color)
                      )
                      .map((colorItem) => (
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
                      ))}
                  </div>
                  {colorError && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select color.
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex gap-2 w-full md:px-0 px-6 mt-2">
              <div className="flex md:w-[30%] w-[40%] items-center justify-between border rounded px-3">
                <p onClick={handleDecrement} className="cursor-pointer">
                  <FiMinus />
                </p>
                <span>{count}</span>
                <p onClick={handleIncrement} className="cursor-pointer">
                  <FiPlus />
                </p>
              </div>
              <div
                onClick={handleAddToCart}
                className="w-[50%] bg-[#D4A373] border-transparent hover:bg-[#CCD5AE] duration-300 text-center flex items-center justify-center rounded cursor-pointer"
              >
                <button className=" focus:outline-none w-full border-transparent flex items-center justify-center gap-1 px-4 py-3 font-semibold text-[12px] cursor-pointer rounded text-[#fff] ">
                  <span>
                    <FiPlus />
                  </span>
                  <span>Add To Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-2 border-t border-[#F8F8F8]">
          <h2 className="text-base text-[#262626]/70 font-semibold">
            Unit Price
          </h2>
          <p className="text-[#D4A373] text-xl font-semibold">
            <span className="text-xl">৳</span>{" "}
            {/* <span>
              {(() => {
                let selectedItem: InventoryItem | undefined;

                if (
                  inventoryType === "levelInventory" ||
                  inventoryType === "colorLevelInventory"
                ) {
                  selectedItem =
                    Array.isArray(inventoryRef) &&
                    inventoryRef.find((item) => item._id === selectedLevel);
                } else if (inventoryType === "colorInventory") {
                  selectedItem =
                    Array.isArray(inventoryRef) &&
                    inventoryRef.find((item) => item._id === selectedColor);
                }

                const fallbackItem =
                  Array.isArray(inventoryRef) && inventoryRef.length > 0
                    ? inventoryRef[0]
                    : undefined;

                const price =
                  selectedItem?.price ??
                  (fallbackItem ? fallbackItem.price : undefined);

                return price !== undefined ? Number(price).toFixed(2) : "N/A";
              })()}
            </span> */}
            {Array.isArray(inventoryRef) ? (
              <span>
                {(() => {
                  let selectedItem: InventoryItem | undefined;

                  if (
                    inventoryType === "levelInventory" ||
                    inventoryType === "colorLevelInventory"
                  ) {
                    if (Array.isArray(inventoryRef)) {
                      selectedItem = inventoryRef.find(
                        (item) => item._id === selectedLevel
                      );
                    }
                  } else if (inventoryType === "colorInventory") {
                    if (Array.isArray(inventoryRef)) {
                      selectedItem = inventoryRef.find(
                        (item) => item._id === selectedColor
                      );
                    }
                  }

                  const fallbackItem =
                    Array.isArray(inventoryRef) && inventoryRef.length > 0
                      ? inventoryRef[0]
                      : undefined;

                  const price =
                    selectedItem?.price ??
                    (fallbackItem ? fallbackItem.price : undefined);

                  return price !== undefined ? Number(price).toFixed(2) : "N/A";
                })()}
              </span>
            ) : (
              <span>
                {/* {(() => {
                  let selectedItem: InventoryItem | undefined;

                  if (
                    inventoryType === "levelInventory" ||
                    inventoryType === "colorLevelInventory"
                  ) {
                    if (Array.isArray(inventoryRef)) {
                      selectedItem = inventoryRef.find(
                        (item) => item._id === selectedLevel
                      );
                    }
                  } else if (inventoryType === "colorInventory") {
                    if (Array.isArray(inventoryRef)) {
                      selectedItem = inventoryRef.find(
                        (item) => item._id === selectedColor
                      );
                    }
                  }

                  // const fallbackItem =
                  //   Array.isArray(inventoryRef) && inventoryRef.length > 0
                  //     ? inventoryRef
                  //     : undefined;

                  // const price =
                  //   selectedItem?.price ??
                  //   (fallbackItem ? fallbackItem.price : undefined);

                  return price !== undefined ? Number(price).toFixed(2) : "N/A";
                })()} */}

                {(inventoryRef as InventoryItem).price}
              </span>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
