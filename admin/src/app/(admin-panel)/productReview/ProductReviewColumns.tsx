"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { fileUrlGenerator } from "@/utils/helpers";
import { useState } from "react";
import { Dropdown, MenuProps, Modal } from "antd";
import { EllipsisOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { TbExclamationCircleFilled } from "react-icons/tb";
import { BASE_URL } from "@/config/config";
import { useRouter } from "next/navigation";

export interface ProductReview {
  _id: string;
  name: string;
  image?: string;
  district?: string;
  comment: string;
  status: boolean;
  createdAt?: string;
}

export const ProductReviewColumns: ColumnDef<ProductReview>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        {row.original.image ? (
          <img
            src={fileUrlGenerator(row.original.image)}
            alt={row.original.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
        )}
      </div>
    ),
  },

  {
    accessorKey: "name",
    header: "User Name",
    cell: ({ row }) => (
      <span className="font-medium text-gray-800">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => row.original.district || "-",
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <span className="line-clamp-1 text-gray-700">
        {row.original.comment || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isApproved = row.original.status;
      return (
        <Badge
          className={`${isApproved ? "bg-green-500" : "bg-yellow-500"
            } text-white px-3 py-1 rounded-full`}
        >
          {isApproved ? "Accepted" : "Pending"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      row.original.createdAt
        ? new Date(row.original.createdAt).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }: any) => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const router = useRouter();
      const handleDelete = async () => {
        try {
          const res = await fetch(
            `${BASE_URL}/product-review/${row.original._id}`,
            { method: "DELETE" }
          );
          if (res.ok) {
            Modal.success({
              title: "Deleted!",
              content: "Review has been deleted successfully.",
            });
            router.refresh();
          } else {
            throw new Error("Delete failed");
          }
        } catch (err) {
          Modal.error({
            title: "Error!",
            content: "Something went wrong while deleting.",
          });
        } finally {
          setIsModalOpen(false);
        }
      };

      return (
        <>
          <EllipsisOutlined
            className="text-xl cursor-pointer hover:text-red-500"
            onClick={() => setIsModalOpen(true)}
          />

          <Modal
            title={
              <div className="flex items-center gap-2">
                <TbExclamationCircleFilled className="text-red-500 text-xl" />
                Confirm Delete
              </div>
            }
            open={isModalOpen}
            onOk={handleDelete}
            onCancel={() => setIsModalOpen(false)}
            okText="Yes, Delete"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <p>
              Are you sure you want to delete the review by <strong>{row.original.name}</strong>?
            </p>
          </Modal>
        </>
      );
    },
  },
];

