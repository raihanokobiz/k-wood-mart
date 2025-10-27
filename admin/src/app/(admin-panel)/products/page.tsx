import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import { ProductTable } from "./table";
import { fileUrlGenerator } from "@/utils/helpers";
import { CreateProductForm } from "./form";
import { getProductWithPagination } from "@/services/product";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getProductWithPagination(page, limit);

  return (
    <ContentLayout title="Product">
      <CreateProductForm />
      <ProductTable
        data={data.result.map((item) => ({
          ...item,
          // thumbnailImage: fileUrlGenerator(String(item.thumbnailImage)),
          // backViewImage: fileUrlGenerator(String(item.backViewImage)),
          // sizeChartImage: fileUrlGenerator(String(item.sizeChartImage)),
        }))}
        pagination={{
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.pagination.total,
        }}
      />
    </ContentLayout>
  );
}
