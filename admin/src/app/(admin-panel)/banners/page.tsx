import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getBannerWithPagination } from "@/services/banner";
import React from "react";
import { BannerTable } from "./table";
import { fileUrlGenerator } from "@/utils/helpers";
import { CreateBannerForm } from "./form";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function BannersPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getBannerWithPagination(page, limit);

  return (
    <ContentLayout title="Banner">
      <CreateBannerForm />
      <BannerTable
        data={data.result.map((item) => ({
          ...item,
          // image: fileUrlGenerator(String(item.image)),
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
