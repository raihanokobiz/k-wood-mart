import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import { ChildCategoryTable } from "./table";
import { fileUrlGenerator } from "@/utils/helpers";
import { CreateChildCategoryForm } from "./form";
import { getChildCategoryWithPagination } from "@/services/child-category";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ChildCategorysPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getChildCategoryWithPagination(page, limit);

  return (
    <ContentLayout title="ChildCategory">
      <CreateChildCategoryForm />
      <ChildCategoryTable
        data={data.result.map((item) => ({
          ...item,
          // image: fileUrlGenerator(String(item.image)),
          // bannerImage: fileUrlGenerator(String(item.bannerImage)),
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
