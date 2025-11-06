"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Modal } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { TbExclamationCircleFilled } from "react-icons/tb";
import { BASE_URL } from "@/config/config";
import { useRouter } from "next/navigation";
import { YouTubeModal } from "@/utils/YouTubeModal ";

export interface ProductReview {
  _id: string;
  name: string;
  image?: string;
  district?: string;
  youtubeUrl?: string;
  comment?: string;
  status: boolean;
  createdAt?: string;
}

interface ActionsMenuProps {
  review: ProductReview;
  onEdit: (review: ProductReview) => void;
}

const ActionsMenu = ({ review, onEdit }: ActionsMenuProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/product-review/${review._id}`, {
        method: "DELETE",
      });
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
      setIsDeleteModalOpen(false);
    }
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    onEdit(review);
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="relative">
        <EllipsisOutlined
          className="text-xl cursor-pointer hover:text-blue-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Dropdown Menu */}
            <div className="absolute right-0 -mt-12 w-32 bg-white rounded-md shadow-lg z-20 border border-gray-200">
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-md"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <TbExclamationCircleFilled className="text-red-500 text-xl" />
            Confirm Delete
          </div>
        }
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Yes, Delete"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete the review by{" "}
          <strong>{review.name}</strong>?
        </p>
      </Modal>
    </>
  );
};

export const createProductReviewColumns = (
  onEdit: (review: ProductReview) => void
): ColumnDef<ProductReview>[] => [
  {
    header: "YouTube Video",
    accessorKey: "youtubeUrl",
    cell: ({ row }) => {
      const url = row.original.youtubeUrl;
      if (!url) return <span className="text-gray-400">No video</span>;

      return <YouTubeModal url={url} />;
    },
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isApproved = row.original.status;
      return (
        <Badge
          className={`${
            isApproved ? "bg-green-500" : "bg-yellow-500"
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
    cell: ({ row }) => (
      <ActionsMenu review={row.original} onEdit={onEdit} />
    ),
  },
];