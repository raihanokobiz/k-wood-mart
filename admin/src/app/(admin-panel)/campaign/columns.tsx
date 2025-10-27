import { TCampaign } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CampaignDetailsSheet } from "./details";
import { upperFirst } from "lodash";

export const columns: ColumnDef<TCampaign>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Title",
    accessorKey: "name",
  },
  {
    header: "Coupon Code",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.couponRef?.code)}</p>
        </div>
      );
    },
  },
  {
    header: "Discount Type",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.couponRef?.discountType)}</p>
        </div>
      );
    },
  },
  {
    header: "Discount",
    cell: ({ row }) => {
      return (
        <div>
          <p>{row.original.couponRef?.discount}</p>
        </div>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <CampaignDetailsSheet campaign={row.original} />;
    },
  },
];
