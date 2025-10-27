import { TBulkOrder } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";

export const columns: ColumnDef<TBulkOrder>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "Company Name",
    accessorKey: "companyName",
  },
  {
    header: "Product Type",
    accessorKey: "productType",
  },
  {
    header: "Delivery Date",
    accessorKey: "deliveryDate",
    cell: ({ row }) => {
      const { deliveryDate } = row.original;
      return <div>{formatDate(deliveryDate || "", "dd/MM/yyyy")}</div>;
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
];
