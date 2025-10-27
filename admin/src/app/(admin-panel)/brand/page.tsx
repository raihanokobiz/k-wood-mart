import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import { BrandTable } from "./table";
import { CreateBrandForm } from "./form";
import { getBrandWithPagination } from "@/services/brand";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function BrandsPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getBrandWithPagination(page, limit);

  return (
    <ContentLayout title="Brand">
      <CreateBrandForm />
      <BrandTable
        data={data.result.map((item) => ({
          ...item,
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
