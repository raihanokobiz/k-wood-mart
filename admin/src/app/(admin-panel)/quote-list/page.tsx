import { ContentLayout } from "@/components/admin-panel/content-layout";

import React from "react";
import { QuoteTable } from "./table";
import { getQuoteWithPagination } from "./quote";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function QuotesPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getQuoteWithPagination(page, limit);


  return (
    <ContentLayout title="Quote List">
      <QuoteTable
        data={data.result.map((item: any) => item)}
        pagination={{
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.pagination.total,
        }}
      />
    </ContentLayout>
  );
}
