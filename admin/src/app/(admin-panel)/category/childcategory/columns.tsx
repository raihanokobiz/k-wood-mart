import { TChildCategory } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ChildCategoryDetailsSheet } from "./details";
import { fileUrlGenerator, makeBDPrice, truncateText } from "@/utils/helpers";
import React from "react";
import { upperCase, upperFirst } from "lodash";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config/config";
import { toast } from "sonner";
import { Switch } from "antd";

export const getColumns = (
  tableData: TChildCategory[]
): ColumnDef<TChildCategory>[] => [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Media",
    accessorKey: "image",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.image && (
            <Image
              src={fileUrlGenerator(row.original.image)}
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
  //   header: "Banner Image",
  //   accessorKey: "bannerImage",
  //   cell: ({ row }) => {
  //     return (
  //       <div>
  //         {row.original.bannerImage && (
  //           <Image
  //             src={fileUrlGenerator(row.original.bannerImage)}
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
    header: "Category",
    accessorKey: "categoryRef",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.subCategoryRef?.name)}</p>
        </div>
      );
    },
  },
  {
    header: "Special",
    accessorKey: "isSpecial",
    cell: ({ row }) => {
      const sub = row.original;
      const router = useRouter();

      const handleToggle = async (checked: boolean) => {
        try {
          const anyActive = tableData.some(
            (item) => item._id !== sub._id && item.isSpecial === true
          );
          
          if (checked && anyActive) {
            alert("A special sub-category is already active!");
            return;
          }

          const res = await fetch(
            `${BASE_URL}/child-category/status/isSpecial/${sub._id}?status=${checked}`,
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
          checked={sub.isSpecial}
          onChange={handleToggle}
          style={{
            width: 50,
            height: 24,
            backgroundColor: sub.isSpecial ? "#3b82f6" : "#d1d5db",
          }}
        />
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <ChildCategoryDetailsSheet childCategory={row.original} />;
    },
  },
];
