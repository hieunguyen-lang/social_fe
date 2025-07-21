"use client";

import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { PERMISSIONS } from '../../utils/permissions';
import HoaDonDashboard from '../../components/hoa-don/HoaDonDashboard';

export default function HoaDonPage() {
  return (
    <ProtectedRoute permission={PERMISSIONS.BILL_VIEW}>
      <DashboardLayout>
        <HoaDonDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  );
} 