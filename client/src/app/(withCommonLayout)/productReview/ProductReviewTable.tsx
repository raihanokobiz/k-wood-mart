"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@radix-ui/react-label";
import { Card } from "@/components/ui/card";
import { ProductReviewColumns } from "./ProductReviewColumns";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ProductReview } from "./ProductReviewColumns";

interface Props {
  data: ProductReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const ProductReviewTable: React.FC<Props> = ({ data, pagination }) => {
  const table = useReactTable({
    data,
    columns: ProductReviewColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    columnResizeMode: "onChange",
    pageCount: Math.ceil(pagination.total / pagination.limit),
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
  });

  return (
    <Card className="m-6 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Label className="text-xl font-semibold">Product Reviews</Label>
      </div>

      <Table className="rounded-lg overflow-hidden">
        <TableHeader className="bg-primary text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    width: header.getSize(),
                  }}
                  className="text-white"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                    className="py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={ProductReviewColumns.length}
                className="h-24 text-center"
              >
                No reviews found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
    </Card>
  );
};

export default ProductReviewTable;

