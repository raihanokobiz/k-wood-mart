import { TBlog } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { fileUrlGenerator } from "@/utils/helpers";
import { BlogDetailsSheet } from "./details";
import TruncatedHtml from "@/components/utils/truncated-html";

export const columns: ColumnDef<TBlog>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.image && (
            <Image
              src={fileUrlGenerator(row.original.image)}
              alt={row.original.image || ""}
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
    accessorKey: "title",
  },
  {
    header: "Tags",
    accessorKey: "tags",
  },
  {
    header: "Author",
    accessorKey: "author",
  },
  // {
  //   header: "Status",
  //   accessorKey: "status",
  // },
  {
    header: "Details",
    accessorKey: "details",
    cell: ({ row }) => {
      const description = row?.original?.details || "";
      return <TruncatedHtml html={description} maxLength={20} />;
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <BlogDetailsSheet blog={row.original} />;
    },
  },
];
