import { ColumnDef } from "@tanstack/react-table";
import { formatDate, isValid } from "date-fns";

import { TContact } from "@/types/shared";
import { DetailsSheet2 } from "./details";

export const columns: ColumnDef<TContact>[] = [
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
    header: "Subject",
    accessorKey: "subject",
  },

  {
    header: "Message",
    accessorKey: "message",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <DetailsSheet2 item={row.original} />;
    },
  },
];
