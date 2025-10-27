import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import AdminDashboard from "./dashboard";
import { getDashboardMetrics } from "@/services/dashboard";

export default async function Dashboard() {
  const dashboardMetrics = await getDashboardMetrics();
  return (
    <ContentLayout title="Dashboard">
      <AdminDashboard counts={dashboardMetrics.data} />
    </ContentLayout>
  );
}
