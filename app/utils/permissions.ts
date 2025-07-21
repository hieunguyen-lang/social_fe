// Permission definitions
export const PERMISSIONS = {
  // Dashboard permissions
  VIEW_DASHBOARD: 'view_dashboard',
  BILL_VIEW: 'bill:view',
  BILL_CREATE: 'bill:create',
  BILL_UPDATE: 'bill:update',
  BILL_DELETE: 'bill:delete',
  BILL_EXPORT: 'bill:export',

  // User management permissions
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Reports permissions
  REPORT_SUMMARY: 'report:summary',
  REPORT_COMMISSION: 'report:commission',
  REPORT_CALENDAR: 'report:calendar',

  // System permissions
  VIEW_SYSTEM_SETTINGS: 'view_system_settings',
  MANAGE_SYSTEM: 'manage_system',

  // Page permissions
  VIEW_ABOUT_PAGE: 'view_about_page',
  VIEW_DOI_UNG_PAGE: 'view_doi_ung_page',
  VIEW_MOMO_HOADON_PAGE: 'view_momo_hoadon_page',
  VIEW_USERS_PAGE: 'view_users_page',
  VIEW_REPORTS_PAGE: 'view_reports_page',

  // User permission management
  MANAGE_USER_PERMISSIONS: 'manage_user_permissions',
  GRANT_USER_PERMISSIONS: 'grant_user_permissions',
  REVOKE_USER_PERMISSIONS: 'revoke_user_permissions',
  VIEW_USER_PERMISSIONS: 'view_user_permissions',
  ASSIGN_USER_ROLES: 'assign_user_roles',
  REMOVE_USER_ROLES: 'remove_user_roles',

  // Role management
  MANAGE_ROLES: 'manage_roles',
  CREATE_ROLES: 'create_roles',
  EDIT_ROLES: 'edit_roles',
  DELETE_ROLES: 'delete_roles',
  VIEW_ROLES: 'view_roles',
  ASSIGN_ROLE_PERMISSIONS: 'assign_role_permissions',
  REMOVE_ROLE_PERMISSIONS: 'remove_role_permissions',
} as const;

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  VIEWER: 'viewer',
} as const;

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin has all permissions
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.BILL_VIEW,
    PERMISSIONS.BILL_CREATE,
    PERMISSIONS.BILL_UPDATE,
    PERMISSIONS.BILL_EXPORT,
    PERMISSIONS.REPORT_SUMMARY,
    PERMISSIONS.REPORT_COMMISSION,
    PERMISSIONS.REPORT_CALENDAR,
    PERMISSIONS.USER_READ,
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.BILL_VIEW,
    PERMISSIONS.BILL_CREATE,
    PERMISSIONS.BILL_EXPORT,
    PERMISSIONS.REPORT_SUMMARY,
    PERMISSIONS.REPORT_CALENDAR,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.BILL_VIEW,
    PERMISSIONS.REPORT_SUMMARY,
  ],
};

// Permission checking functions
export const hasPermission = (userPermissions: string[], permission: string): boolean => {
  return userPermissions.includes(permission);
};

export const hasAnyPermission = (userPermissions: string[], permissions: string[]): boolean => {
  return permissions.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions: string[], permissions: string[]): boolean => {
  return permissions.every(permission => userPermissions.includes(permission));
};

export const hasRole = (userRoles: string[], role: string): boolean => {
  return userRoles.includes(role);
};

export const isAdmin = (userRoles: string[]): boolean => {
  return hasRole(userRoles, ROLES.ADMIN);
};

export const isManager = (userRoles: string[]): boolean => {
  return hasRole(userRoles, ROLES.MANAGER);
};

// Get permissions for a role
export const getRolePermissions = (role: string): string[] => {
  return ROLE_PERMISSIONS[role] || [];
};

// Get all permissions for multiple roles
export const getRolesPermissions = (roles: string[]): string[] => {
  const permissions = new Set<string>();
  roles.forEach(role => {
    getRolePermissions(role).forEach(permission => {
      permissions.add(permission);
    });
  });
  return Array.from(permissions);
}; 