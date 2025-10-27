import { ContentLayout } from "@/components/admin-panel/content-layout";

import React from "react";
import { CustomTable } from "./table";
import { Item } from "@radix-ui/react-dropdown-menu";
import { fileUrlGenerator } from "@/utils/helpers";
import { getCategoryWithPagination } from "@/services/category";
import { CreateForm } from "./form";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function CouponsPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getCategoryWithPagination(page, limit);

  return (
    <ContentLayout title="Category">
      <CreateForm />
      <CustomTable
        data={data.result.map((item) => ({
          ...item,
          // image: fileUrlGenerator(String(item.image)),
          // vectorImage: fileUrlGenerator(String(item.vectorImage)),
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
