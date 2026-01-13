import { TCoupon } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CouponDetailsSheet } from "./details";
import { upperFirst } from "lodash";
import { formatDate } from "date-fns";

export const columns: ColumnDef<TCoupon>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Coupon Code",
    accessorKey: "code",
  },
  {
    header: "Discount",
    accessorKey: "discount",
  },
  {
    header: "Use Limit",
    accessorKey: "useLimit",
  },
  {
    header: "Use Count",
    accessorKey: "used",
  },
  {
    header: "Start Date",
    accessorKey: "startDate",
    cell: ({ row }) => {
      return (
        <div>
          <p>{formatDate(row.original.startDate, "dd/MM/yyyy")}</p>
        </div>
      );
    },
  },
  {
    header: "Expire Date",
    accessorKey: "expireDate",
    cell: ({ row }) => {
      return (
        <div>
          <p>{formatDate(row.original.expireDate, "dd/MM/yyyy")}</p>
        </div>
      );
    },
  },
  {
    header: "Discount Type",
    accessorKey: "discountType",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.discountType)}</p>
        </div>
      );
    },
  },
  {
    header: "Brand",
    accessorKey: "brandRef",
  },
  {
    header: "Category",
    accessorKey: "categoryRef",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.categoryRef?.name)}</p>
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
          <p>{upperFirst(row.original.subCategoryRef?.name)}</p>
        </div>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <CouponDetailsSheet coupon={row.original} />;
    },
  },
];
