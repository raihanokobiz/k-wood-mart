import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import { ContactTable } from "./table";
import { getContactWithPagination } from "@/services/contact";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function page({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getContactWithPagination(page, limit);

  return (
    <ContentLayout title="Contact">
      <ContactTable
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
