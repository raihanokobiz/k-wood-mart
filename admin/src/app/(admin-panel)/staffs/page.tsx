import { ContentLayout } from "@/components/admin-panel/content-layout";
import { getAllUser } from "@/services/auth";
import React from "react";
import { StaffTable } from "./table";

export default async function StaffsPage() {
  const { data } = await getAllUser();
  // console.log(data, "data from getall user respone........");
  return (
    <ContentLayout title="Staffs">
      <StaffTable data={data} />
    </ContentLayout>
  );
}
