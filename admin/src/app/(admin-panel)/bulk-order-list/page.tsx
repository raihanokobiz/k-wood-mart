import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import { BulkOrderTable } from "./table";
import { getBulkOrderWithPagination } from "@/services/bulk_order";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function BulkOrdersPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getBulkOrderWithPagination(page, limit);

  return (
    <ContentLayout title="Bulk Order">
      <BulkOrderTable
        data={data.result.map((item) => item)}
        pagination={{
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.pagination.total,
        }}
      />
    </ContentLayout>
  );
}
