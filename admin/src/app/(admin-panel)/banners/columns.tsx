import { TBanner } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { BannerDetailsSheet } from "./details";
import { fileUrlGenerator } from "@/utils/helpers";

export const columns: ColumnDef<TBanner>[] = [
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
              alt={row.original.title || ""}
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
    header: "Link",
    accessorKey: "link",
  },
  // {
  //   header: "Details",
  //   accessorKey: "details",
  // },
  // {
  //   header: "Category",
  //   accessorKey: "bannerCategory",
  // },
  // {
  //   header: "Banner Type",
  //   accessorKey: "type",
  // },
  // {
  //   header: "Status",
  //   accessorKey: "status",
  // },
  {
    header: "Action",
    cell: ({ row }) => {
      return <BannerDetailsSheet banner={row.original} />;
    },
  },
];
