"use client";

import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { PERMISSIONS } from '../../utils/permissions';
import DoiUngDashboard from '../../components/hoa-don/DoiUngDashboard';

export default function DoiUngPage() {
  return (
    <ProtectedRoute permission={PERMISSIONS.VIEW_DOI_UNG_PAGE}>
      <DashboardLayout>
        <DoiUngDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  );
} 