import { TBrand } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { BrandDetailsSheet } from "./details";
import { fileUrlGenerator } from "@/utils/helpers";

export const columns: ColumnDef<TBrand>[] = [
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
  {
    header: "Title",
    accessorKey: "name",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <BrandDetailsSheet brand={row.original} />;
    },
  },
];
