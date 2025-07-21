import { PERMISSIONS } from '../../utils/permissions';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/DashboardLayout';
import ReportDashboard from '../../components/reports/ReportDashboard';

export default function ReportsCommissionPage() {
  return (
    <ProtectedRoute permission={PERMISSIONS.REPORT_COMMISSION}>
      <DashboardLayout>
        <ReportDashboard activeTab="commission" />
      </DashboardLayout>
    </ProtectedRoute>
  );
} 