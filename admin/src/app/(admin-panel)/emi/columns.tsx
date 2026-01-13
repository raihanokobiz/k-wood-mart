"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Switch, message, Badge } from "antd";
import { Emi } from "@/services/emi";
import { toggleEmiPlanActive } from "@/services/emi";
import { EmiDetailsSheet } from "./details";
import { useRouter } from "next/navigation";

export const getColumns = (): ColumnDef<Emi>[] => [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
    size: 50,
  },
  {
    header: "Active Status",
    accessorKey: "isActive",
    cell: ({ row }) => {
      const router = useRouter();
      const [loading, setLoading] = React.useState(false);

      const handleToggle = async (checked: boolean) => {
        try {
          setLoading(true);
          await toggleEmiPlanActive(row.original._id || "", checked);
          message.success(
            checked
              ? "EMI plan activated successfully!"
              : "EMI plan deactivated successfully!"
          );
          router.refresh();
        } catch (error: any) {
          message.error(
            error.message || "Failed to toggle EMI plan status"
          );
        } finally {
          setLoading(false);
        }
      };

      return (
        <Switch
          checked={row.original.isActive}
          onChange={handleToggle}
          disabled={loading}
        />
      );
    },
    size: 120,
  },
  {
    header: "EMI Plans",
    accessorKey: "plans",
    cell: ({ row }) => (
      <div className="space-y-2">
        {row.original.plans?.map((plan, idx) => (
          <div key={idx} className="text-sm">
            <span className="font-semibold">{plan.months} Months</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-orange-600">{plan.interestRate}%</span>
          </div>
        ))}
      </div>
    ),
    size: 250,
  },
  {
    header: "Total Plans",
    cell: ({ row }) => (
      <Badge color="cyan" text={`${row.original.plans?.length || 0} plans`} />
    ),
    size: 100,
  },
  {
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {new Date(row.original.createdAt || "").toLocaleDateString()}
      </span>
    ),
    size: 120,
  },
  {
    header: "Updated",
    accessorKey: "updatedAt",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {new Date(row.original.updatedAt || "").toLocaleDateString()}
      </span>
    ),
    size: 120,
  },
  {
    header: "Action",
    cell: ({ row }) => <EmiDetailsSheet emi={row.original} />,
    size: 100,
  },
];
