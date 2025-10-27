import { TProduct } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ProductDetailsSheet } from "./details";
import { fileUrlGenerator, makeBDPrice, truncateText } from "@/utils/helpers";
import React from "react";
import { upperCase, upperFirst } from "lodash";
import TruncatedHtml from "@/components/utils/truncated-html";
import Barcode from "react-barcode";

export const columns: ColumnDef<TProduct>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Thumbnail Image",
    accessorKey: "thumbnailImage",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.thumbnailImage && (
            <Image
              src={fileUrlGenerator(row.original.thumbnailImage)}
              alt={row.original.name || ""}
              width={600}
              height={200}
              className="w-32 object-cover"
            />
          )}
        </div>
      );
    },
  },
  {
    header: "Backview Image",
    accessorKey: "backViewImage",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.backViewImage && (
            <Image
              src={fileUrlGenerator(row.original.backViewImage)}
              alt={row.original.name || ""}
              width={600}
              height={200}
              className="w-32 object-cover"
            />
          )}
        </div>
      );
    },
  },
  // {
  //   header: "Size Chart Image",
  //   accessorKey: "sizeChartImage",
  //   cell: ({ row }) => {
  //     return (
  //       <div>
  //         {row.original.sizeChartImage && (
  //           <Image
  //             src={fileUrlGenerator(row.original.sizeChartImage)}
  //             alt={row.original.name || ""}
  //             width={600}
  //             height={200}
  //             className="w-32 object-cover"
  //           />
  //         )}
  //       </div>
  //     );
  //   },
  // },
  {
    header: "Additional Images",
    accessorKey: "images",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.images &&
            row.original.images.map((img) => (
              <Image
                src={fileUrlGenerator(img)}
                alt={row.original.name || ""}
                width={600}
                height={200}
                className="w-32 object-cover"
              />
            ))}
        </div>
      );
    },
  },
  {
    header: "Barcode",
    cell: ({ row }) => {
      return (
        <div className="w-[300px]">
          <Barcode value={row?.original?._id} className="w-full" />
        </div>
      );
    },
  },
  {
    header: "Name",
    size: 200,
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row?.original?.name || "";
      const [expanded, setExpanded] = React.useState(false);

      const toggleExpanded = () => setExpanded((prev) => !prev);

      const shouldTruncate = name.length > 50;
      const displayedName = expanded ? name : truncateText(name, 50);

      return (
        <div className="w-[200px]">
          <p>{displayedName}</p>
          {shouldTruncate && (
            <button
              onClick={toggleExpanded}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      );
    },
  },
  {
    header: "Details",
    size: 250,
    accessorKey: "description",
    cell: ({ row }) => {
      const description = row?.original?.description || "";
      return <TruncatedHtml html={description} maxLength={100} />;
    },
  },
  {
    header: "Discount Type",
    accessorKey: "discountType",
    cell: ({ row }) => <div>{upperFirst(row.original.discountType || "")}</div>,
  },
  {
    header: "Discount",
    accessorKey: "discount",
    cell: ({ row }) => (
      <div>
        {row.original.discountType === "percent" ? (
          <p>{row.original.discount}%</p>
        ) : (
          <p>{row.original.discount}</p>
        )}
      </div>
    ),
  },
  // {
  //   header: "Discount Amount",
  //   accessorKey: "discountAmount",
  //   cell: ({ row }) => (
  //     <div className="w-[60px]">
  //       {makeBDPrice(row.original.discountAmount || 0)}
  //     </div>
  //   ),
  // },
  // {
  //   header: "MRP",
  //   accessorKey: "mrpPrice",
  //   cell: ({ row }) => (
  //     <div className="w-[60px]">{makeBDPrice(row.original.mrpPrice || 0)}</div>
  //   ),
  // },
  // {
  //   header: "Price",
  //   accessorKey: "price",
  //   cell: ({ row }) => (
  //     <div className="w-[60px]">{makeBDPrice(row.original.price)}</div>
  //   ),
  // },
  {
    header: "Inventory Type",
    accessorKey: "inventoryType",
    cell: ({ row }) => (
      <div className="">
        {row.original.inventoryType === "colorLevelInventory" && (
          <p>Color - Size</p>
        )}
        {row.original.inventoryType === "colorInventory" && <p>Color</p>}
        {row.original.inventoryType === "levelInventory" && <p>Size</p>}
        {row.original.inventoryType === "inventory" && <p>-</p>}
      </div>
    ),
  },
  {
    header: "Inventory Details",
    accessorKey: "inventoryRef",
    size: 600,
    cell: ({ row }) => {
      return (
        <div className="w-[600px] overflow-x-auto grid grid-cols-3 gap-1">
          {row.original.inventoryRef?.map((item) => (
            <div
              key={item._id}
              className="border p-2 rounded-md shadow hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center justify-start gap-2">
                <div className="flex items-center justify-start gap-1">
                  Color: {item.name ? upperCase(item.name) : "N/A"}
                  {item.color ? (
                    <div
                      style={{ backgroundColor: item.color }}
                      className="w-5 aspect-square rounded-full border border-black"
                    ></div>
                  ) : (
                    "-"
                  )}
                </div>
                <p>Level: {item.level ? upperCase(item.level) : "N/A"}</p>
              </div>
              <p>
                Quantity: <span className="font-bold"> {item.quantity}</span>
              </p>
              <p>Sold Quantity: {item.soldQuantity}</p>
              <p>Hold Quantity: {item.holdQuantity}</p>
              <p>price: {item.price}</p>
              <p>mrpPrice: {item.mrpPrice}</p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    header: "Gender",
    accessorKey: "gender",
    // cell: ({ row }) => {
    //   return (
    //     <div>
    //       <p>{upperFirst(row.original.categoryRef?.name)}</p>
    //     </div>
    //   );
    // },
  },
  {
    header: "Brand",
    accessorKey: "brandRef",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.brandRef?.name) || "N/A"} </p>
        </div>
      );
    },
  },
  {
    header: "Category",
    accessorKey: "categoryRef",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.categoryRef?.name) || "N/A"}</p>
        </div>
      );
    },
  },
  {
    header: "Subcategory",
    accessorKey: "subCategoryRef",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.subCategoryRef?.name) || "N/A"}</p>
        </div>
      );
    },
  },
  {
    header: "Child Category",
    accessorKey: "childCategoryRef",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.childCategoryRef?.name) || "N/A"}</p>
        </div>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <ProductDetailsSheet product={row.original} />;
    },
  },
];
