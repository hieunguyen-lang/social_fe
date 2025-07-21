"use client";

import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { PERMISSIONS } from '../../utils/permissions';
import MomoHoaDonDashboard from '../../components/hoa-don/MomoHoaDonDashboard';

export default function MomoHoaDonPage() {
  return (
    <ProtectedRoute permission={PERMISSIONS.VIEW_MOMO_HOADON_PAGE}>
      <DashboardLayout>
        <MomoHoaDonDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  );
} 