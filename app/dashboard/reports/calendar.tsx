import { PERMISSIONS } from '../../utils/permissions';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/DashboardLayout';
import ReportDashboard from '../../components/reports/ReportDashboard';

export default function ReportsCalendarPage() {
  return (
    <ProtectedRoute permission={PERMISSIONS.REPORT_CALENDAR}>
      <DashboardLayout>
        <ReportDashboard activeTab="calendar" />
      </DashboardLayout>
    </ProtectedRoute>
  );
} 