import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import { SubCategoryTable } from "./table";
import { fileUrlGenerator } from "@/utils/helpers";
import { CreateSubCategoryForm } from "./form";
import { getSubCategoryWithPagination } from "@/services/sub-category";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function SubCategorysPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getSubCategoryWithPagination(page, limit);

  return (
    <ContentLayout title="SubCategory">
      <CreateSubCategoryForm />
      <SubCategoryTable
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
