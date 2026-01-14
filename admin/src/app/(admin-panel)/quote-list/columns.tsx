import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { UpdateQuoteStatus } from "./actions";
import { useRouter } from "next/navigation";

export const quoteStatuses = [
  { key: "Pending", name: "Pending" },
  { key: "Approved", name: "Approved" },
  { key: "Contacted", name: "Contacted" },
];

export const columns: ColumnDef<any>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Product ID",
    accessorKey: "productId",
    cell: ({ row }) => (
      <div className="text-sm font-semibold min-w-[120px]">
        {row.original.productId || row.original.productRef || "N/A"}
      </div>
    ),
  },
  {
    header: "Date",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-gray-600 min-w-[120px]">
          <p>
            {row.original.createdAt
              ? format(new Date(row.original.createdAt), "dd MMM yyyy")
              : "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    header: "Product",
    cell: ({ row }) => {
      const { productRef, productName } = row.original;
      return (
        <div className="min-w-[200px]">
          <p className="font-semibold">{productName || productRef?.name}</p>
        </div>
      );
    },
  },
  {
    header: "Qty",
    cell: ({ row }) => (
      <div className="text-sm min-w-[10px] text-center">
        {row.original.quantity ?? 0}
      </div>
    ),
  },

  {
    header: "Specifications",
    cell: ({ row }) => {

      const { material, materialNote, color, colorNote, size, sizeNote, fabric, fabricNote, set, setNote } = row.original;

      return (
        <div className=" grid grid-cols-2 gap-2 text-sm min-w-[250px] border p-2 rounded">
          {material && (
            <div className="bg-gray-50 p-2 rounded">
              <p>
                <span className="font-semibold">Material:</span>{" "}
                {Array.isArray(material) ? material.join(", ") : material}
              </p>
              {materialNote && (
                <p className="text-xs text-gray-600 italic">Choice: {materialNote}</p>
              )}
            </div>
          )}
          {fabric && (
            <div className="bg-gray-50 p-2 rounded">
              <p>
                <span className="font-semibold">Fabric:</span>{" "}
                {Array.isArray(fabric) ? fabric.join(", ") : fabric}
              </p>
              {fabricNote && (
                <p className="text-xs text-gray-600 italic">Choice: {fabricNote}</p>
              )}
            </div>
          )}
          {color && (
            <div className="bg-gray-50 p-2 rounded">
              <p>
                <span className="font-semibold">Color:</span>{" "}
                {Array.isArray(color) ? color.join(", ") : color}
              </p>
              {colorNote && (
                <p className="text-xs text-gray-600 italic">Choice: {colorNote}</p>
              )}
            </div>
          )}
          {size && (
            <div className="bg-gray-50 p-2 rounded">
              <p>
                <span className="font-semibold">Size:</span>{" "}
                {Array.isArray(size) ? size.join(", ") : size}
              </p>
              {sizeNote && (
                <p className="text-xs text-gray-600 italic">Choice: {sizeNote}</p>
              )}
            </div>
          )}
          {set && (
            <div className="bg-gray-50 p-2 rounded">
              <p>
                <span className="font-semibold">Set:</span>{" "}
                {Array.isArray(set) ? set.join(", ") : set}
              </p>
              {setNote && (
                <p className="text-xs text-gray-600 italic">Choice: {setNote}</p>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "EMI Info",
    cell: ({ row }) => {
      const { emiMonths } = row.original;

      if (!emiMonths) {
        return <p className="text-gray-500 italic min-w-[120px]">N/A</p>;
      }

      return (
        <div className="text-sm space-y-1 min-w-[120px]">
          <p>
            <span className="font-semibold">Months:</span> {emiMonths}
          </p>
        </div>
      );
    },
  },

  {
    header: "Customer Info",
    cell: ({ row }) => {
      const { name, email, phone } = row.original;
      return (
        <div className="text-sm space-y-1 min-w-[180px]">
          <p>
            <span className="font-semibold">Name:</span> {name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {email || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {phone || "N/A"}
          </p>
        </div>
      );
    },
  },
  {
    header: "Subject",
    cell: ({ row }) => {
      const { subject } = row.original;
      return (
        <div className="text-sm min-w-[150px]">
          <p>{subject || "N/A"}</p>
        </div>
      );
    },
  },
  {
    header: "Message",
    cell: ({ row }) => {
      const { message } = row.original;
      const [expanded, setExpanded] = React.useState(false);

      if (!message) {
        return <p className="text-sm min-w-[150px]">N/A</p>;
      }

      return (
        <div className="text-sm min-w-[200px]">
          <p className={expanded ? "" : "line-clamp-2"}>
            {message}
          </p>

          {message.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 text-xs mt-1 hover:underline"
            >
              {expanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      );
    },
  },


  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const rowStatus = quoteStatuses.find((r) => {
        return r.key === row?.original?.status;
      });
      return <div className="min-w-[100px]">{rowStatus?.name || "N/A"}</div>;
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const [loading, setLoading] = React.useState(false);
      const { toast } = useToast();
      const router = useRouter();
      const currentStatus = row.original.status || "Pending";
      const quoteId = row.original._id;

      const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return;

        setLoading(true);
        try {
          if (quoteId) {
            const res = await UpdateQuoteStatus(quoteId, newStatus);
            if (res.success) {
              toast({
                title: "Success",
                description: `Quote status updated to ${newStatus}`,
              });
              router.refresh();
            }
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update quote status",
          });
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="min-w-[160px]">
          <Select
            disabled={loading}
            defaultValue={currentStatus}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              {quoteStatuses.map((status) => (
                <SelectItem key={status.key} value={String(status.key)}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
];
