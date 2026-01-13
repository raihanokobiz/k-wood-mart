import { ContentLayout } from "@/components/admin-panel/content-layout";
import AdminDashboard from "./dashboard";
import { getDashboardMetrics } from "@/services/dashboard";

// Force dynamic rendering - dashboard should never be statically generated
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
  const dashboardMetrics = await getDashboardMetrics();



  return (
    <ContentLayout title="Dashboard">
      <AdminDashboard counts={dashboardMetrics.data} />
    </ContentLayout>
  );
}
