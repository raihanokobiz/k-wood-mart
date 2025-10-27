import { TUser } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TUser>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Staff",
    accessorKey: "name",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Designation",
    accessorKey: "role",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      // return <StaffDetailSheet user={row.original} />;
    },
  },
];
