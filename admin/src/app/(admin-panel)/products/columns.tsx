import { TProduct } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ProductDetailsSheet } from "./details";
import { fileUrlGenerator, makeBDPrice, truncateText } from "@/utils/helpers";
import React from "react";
import { upperCase, upperFirst } from "lodash";
import TruncatedHtml from "@/components/utils/truncated-html";
import Barcode from "react-barcode";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config/config";
import { toast } from "sonner";
import { Switch } from "antd";
import { getProductById } from "@/services/product";
import { Loader2 } from "lucide-react";

// Action cell component that fetches full product data
const ProductActionCell = ({ product }: { product: TProduct }) => {
  const [fullProduct, setFullProduct] = React.useState<TProduct | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleOpenSheet = async () => {
    if (fullProduct) {
      setOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getProductById(String(product._id));
      setFullProduct(response.data);
      setOpen(true);
    } catch (error) {
      toast.error("Failed to load product details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {fullProduct && (
        <ProductDetailsSheet
          product={fullProduct}
          isOpen={open}
          onOpenChange={setOpen}
        />
      )}
      <button
        onClick={handleOpenSheet}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Edit"
        )}
      </button>
    </>
  );
};

export const getColumns = (
  tableData: TProduct[]
): ColumnDef<TProduct>[] => [
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
                className="w-20 mb-1 rounded-md object-cover"
                loading="lazy"
                quality={75}
              />
            )}
          </div>
        );
      },
    },
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
                  className="w-20 mb-1 rounded-md object-cover"
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
    // {
    //   header: "Discount Type",
    //   accessorKey: "discountType",
    //   cell: ({ row }) => <div>{upperFirst(row.original.discountType || "")}</div>,
    // },
    // {
    //   header: "Discount",
    //   accessorKey: "discount",
    //   cell: ({ row }) => (
    //     <div>
    //       {row.original.discountType === "percent" ? (
    //         <p>{row.original.discount}%</p>
    //       ) : (
    //         <p>{row.original.discount}</p>
    //       )}
    //     </div>
    //   ),
    // },
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
    // {
    //   header: "Inventory Type",
    //   accessorKey: "inventoryType",
    //   cell: ({ row }) => (
    //     <div className="">
    //       {row.original.inventoryType === "colorLevelInventory" && (
    //         <p>Color - Size</p>
    //       )}
    //       {row.original.inventoryType === "colorInventory" && <p>Color</p>}
    //       {row.original.inventoryType === "levelInventory" && <p>Size</p>}
    //       {row.original.inventoryType === "inventory" && <p>-</p>}
    //     </div>
    //   ),
    // },
    // {
    //   header: "Inventory Details",
    //   accessorKey: "inventoryRef",
    //   size: 600,
    //   cell: ({ row }) => {
    //     return (
    //       <div className="w-[600px] overflow-x-auto grid grid-cols-3 gap-1">
    //         {row.original.inventoryRef?.map((item) => (
    //           <div
    //             key={item._id}
    //             className="border p-2 rounded-md shadow hover:shadow-xl transition-all duration-500"
    //           >
    //             <div className="flex items-center justify-start gap-2">
    //               <div className="flex items-center justify-start gap-1">
    //                 Color: {item.name ? upperCase(item.name) : "N/A"}
    //                 {item.color ? (
    //                   <div
    //                     style={{ backgroundColor: item.color }}
    //                     className="w-5 aspect-square rounded-full border border-black"
    //                   ></div>
    //                 ) : (
    //                   "-"
    //                 )}
    //               </div>
    //               <p>Level: {item.level ? upperCase(item.level) : "N/A"}</p>
    //             </div>
    //             <p>
    //               Quantity: <span className="font-bold"> {item.quantity}</span>
    //             </p>
    //             <p>Sold Quantity: {item.soldQuantity}</p>
    //             <p>Hold Quantity: {item.holdQuantity}</p>
    //             <p>price: {item.price}</p>
    //             <p>mrpPrice: {item.mrpPrice}</p>
    //           </div>
    //         ))}
    //       </div>
    //     );
    //   },
    // },
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
      header: "New Arrival",
      accessorKey: "isNewArrival",
      cell: ({ row }) => {
        const sub = row.original;
        const router = useRouter();

        const handleToggle = async (checked: boolean) => {
          try {

            const activeCount = tableData.filter(
              (item) => item.isNewArrival === true
            ).length;

            // If turning ON and already 10 active → stop
            if (checked && activeCount >= 10) {
              alert("Maximum 10 New Arrival items allowed!");
              return;
            }

            const res = await fetch(
              `${BASE_URL}/product/status/isNewArrival/${sub._id}?status=${checked}`,
              { method: "PATCH" }
            );

            if (!res.ok) {
              toast.error("Failed to update!");
              return;
            }

            toast.success(
              checked
                ? "Special status activated successfully!"
                : "Special removed!"
            );
            router.refresh();
          } catch {
            toast.error("Something went wrong!");
          }
        };

        return (
          <Switch
            checked={sub.isNewArrival}
            onChange={handleToggle}
            style={{
              width: 50,
              height: 24,
              backgroundColor: sub.isNewArrival ? "#3b82f6" : "#d1d5db",
            }}
          />
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
