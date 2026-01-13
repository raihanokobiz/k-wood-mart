import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import { EmiTable } from "./table";
import { getAllEmiPlans } from "@/services/emi";
import { CreateEmiForm } from "./form";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function EmiPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";
  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const response = await getAllEmiPlans();
  const allData = response.data || [];

  // Manual pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIdx = (pageNum - 1) * limitNum;
  const paginatedData = allData.slice(startIdx, startIdx + limitNum);

  return (
    <ContentLayout title="EMI Plans">
      <CreateEmiForm />
      <EmiTable
        data={paginatedData}
        pagination={{
          page: pageNum,
          limit: limitNum,
          total: allData.length,
        }}
      />
    </ContentLayout>
  );
}
