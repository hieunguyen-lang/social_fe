'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = <AccessDenied />
}) => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, show access denied
  if (!user) {
    return <AccessDenied />;
  }

  // If no permission check required, render children
  if (!permission && !permissions) {
    return <>{children}</>;
  }

  // Check single permission
  if (permission) {
    if (!hasPermission(user.permissions || [], permission)) {
      return <>{fallback}</>;
    }
  }

  // Check multiple permissions
  if (permissions) {
    const hasAccess = requireAll
      ? hasAllPermissions(user.permissions || [], permissions)
      : hasAnyPermission(user.permissions || [], permissions);

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  // User has required permissions, render children
  return <>{children}</>;
};

export default ProtectedRoute; 