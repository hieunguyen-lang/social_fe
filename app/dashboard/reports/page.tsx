"use client";

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { PERMISSIONS } from '../../utils/permissions';
import ReportDashboard from '../../components/reports/ReportDashboard';

const TABS = [
  { key: 'summary', label: 'Tổng hợp', perm: PERMISSIONS.REPORT_SUMMARY },
  { key: 'commission', label: 'Hoa hồng', perm: PERMISSIONS.REPORT_COMMISSION },
  { key: 'calendar', label: 'Lịch hóa đơn', perm: PERMISSIONS.REPORT_CALENDAR },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'summary' | 'commission' | 'calendar'>('summary');

  return (
    <ProtectedRoute permissions={TABS.map(tab => tab.perm)}>
      <DashboardLayout>
        <div className="tabs flex gap-2 mb-4">
          {TABS.map(tab => (
            <ProtectedRoute key={tab.key} permission={tab.perm} fallback={null}>
              <button
                className={`px-4 py-2 rounded ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </button>
            </ProtectedRoute>
          ))}
        </div>
        <div className="tab-content">
          <ReportDashboard activeTab={activeTab} />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 