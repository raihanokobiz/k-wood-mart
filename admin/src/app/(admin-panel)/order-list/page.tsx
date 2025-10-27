import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getOrderWithPagination } from "@/services/order";
import React from "react";
import { OrderTable } from "./table";
import { fileUrlGenerator } from "@/utils/helpers";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function OrdersPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getOrderWithPagination(page, limit);

  console.log("orderlist", data.result);

  return (
    <ContentLayout title="Order">
      <OrderTable
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
