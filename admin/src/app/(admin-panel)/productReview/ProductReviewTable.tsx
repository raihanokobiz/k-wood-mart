"use client";

import React, { useState, useMemo } from "react";
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
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { createProductReviewColumns, ProductReview } from "./ProductReviewColumns";
import { ReviewFormModal } from "./ReviewFormModal";
import { BASE_URL } from "@/config/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditReviewModal } from "./EditReviewModal";

interface Props {
  data: ProductReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const ProductReviewTable: React.FC<Props> = ({ data, pagination }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ProductReview | null>(
    null
  );

  const handleEdit = (review: ProductReview) => {
    setSelectedReview(review);
    setIsEditModalOpen(true);
  };

  const columns = useMemo(
    () => createProductReviewColumns(handleEdit),
    []
  );

  const table = useReactTable({
    data,
    columns,
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedReview(null);
  };

  // Handle form submit for new review
  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await fetch(`${BASE_URL}/product-review`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit review");

      toast.success("Review submitted successfully!");
      handleCloseModal();
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting review.");
    }
  };

  // Handle update review
  const handleUpdate = async (id: string, formData: FormData) => {
    try {
      const res = await fetch(`${BASE_URL}/product-review/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update review");

      toast.success("Review updated successfully!");
      handleCloseEditModal();
      router.refresh();
    } catch (error) {
      toast.error("Error updating review.");
      throw error;
    }
  };

  // Handle delete from edit modal
  const handleDeleteFromModal = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/product-review/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete review");

      toast.success("Review deleted successfully!");
      handleCloseEditModal();
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting review.");
      throw error;
    }
  };

  return (
    <Card className="m-6 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Label className="text-xl font-semibold">Product Reviews</Label>
        <button
          onClick={handleOpenModal}
          className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
        >
          Add Review
        </button>
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
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No reviews found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />

      {/* Add Review Modal */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      {/* Edit Review Modal */}
      <EditReviewModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdate}
        onDelete={handleDeleteFromModal}
        review={selectedReview}
      />
    </Card>
  );
};

export default ProductReviewTable;