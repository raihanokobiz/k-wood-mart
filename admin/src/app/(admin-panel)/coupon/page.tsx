import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getAllCoupon, getCouponWithPagination } from "@/services/coupon";
import React from "react";
import { CouponTable } from "./table";
import { Item } from "@radix-ui/react-dropdown-menu";
import { fileUrlGenerator } from "@/utils/helpers";
import { CreateCouponForm } from "./form";

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

  const { data } = await getCouponWithPagination(page, limit);

  return (
    <ContentLayout title="Coupon">
      <CreateCouponForm />
      <CouponTable
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
