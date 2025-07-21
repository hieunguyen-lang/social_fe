# Permission System - Frontend Implementation

## Tổng quan

Hệ thống permission đã được implement hoàn chỉnh cho frontend với các tính năng:

- **Role-based Access Control (RBAC)**
- **Permission-based UI rendering**
- **Protected routes**
- **Dynamic menu filtering**

## Cấu trúc Files

```
app/
├── utils/
│   └── permissions.ts          # Định nghĩa permissions và roles
├── components/
│   ├── ProtectedRoute.tsx      # Component bảo vệ routes
│   ├── AccessDenied.tsx        # Component hiển thị khi không có quyền
│   └── Sidebar.tsx             # Sidebar với permission filtering
├── context/
│   └── AuthContext.tsx         # Context với permission checking
└── dashboard/
    ├── page.tsx                # Main dashboard
    ├── hoa-don/page.tsx        # Hóa đơn page
    ├── momo-hoadon/page.tsx    # MoMo hóa đơn page
    ├── doi-ung/page.tsx        # Đối ứng page
    ├── reports/page.tsx        # Reports page
    └── users/page.tsx          # Users page
```

## Permissions Available

### Dashboard Permissions
- `view_dashboard` - Xem dashboard chính
- `view_hoa_don` - Xem hóa đơn
- `view_reports` - Xem báo cáo
- `view_calendar` - Xem lịch

### User Management Permissions
- `view_users` - Xem danh sách users
- `create_users` - Tạo user mới
- `edit_users` - Chỉnh sửa user
- `delete_users` - Xóa user

### Hóa đơn Permissions
- `create_hoa_don` - Tạo hóa đơn
- `edit_hoa_don` - Chỉnh sửa hóa đơn
- `delete_hoa_don` - Xóa hóa đơn
- `export_hoa_don` - Xuất Excel hóa đơn

### Reports Permissions
- `view_commission_reports` - Xem báo cáo hoa hồng
- `view_summary_reports` - Xem báo cáo tổng hợp
- `export_reports` - Xuất báo cáo

### System Permissions
- `view_system_settings` - Xem cài đặt hệ thống
- `manage_system` - Quản lý hệ thống

### Page Permissions
- `view_about_page` - Xem trang About
- `view_doi_ung_page` - Xem trang Đối ứng
- `view_momo_hoadon_page` - Xem trang MoMo Hóa đơn
- `view_users_page` - Xem trang Quản lý Users
- `view_reports_page` - Xem trang Báo cáo

### User Permission Management
- `manage_user_permissions` - Quản lý permissions của users
- `grant_user_permissions` - Cấp permissions cho user
- `revoke_user_permissions` - Thu hồi permissions của user
- `view_user_permissions` - Xem permissions của user
- `assign_user_roles` - Gán roles cho user
- `remove_user_roles` - Gỡ roles của user

### Role Management
- `manage_roles` - Quản lý roles
- `create_roles` - Tạo role mới
- `edit_roles` - Chỉnh sửa role
- `delete_roles` - Xóa role
- `view_roles` - Xem danh sách roles
- `assign_role_permissions` - Gán permissions cho role
- `remove_role_permissions` - Gỡ permissions của role

## Roles và Permissions Mapping

### Admin Role
- Có tất cả permissions
- Có thể quản lý users, roles, permissions
- Có thể truy cập tất cả pages

### Manager Role
- Quản lý hóa đơn và báo cáo
- Xem users và roles
- Không thể quản lý system settings

### User Role
- Xem và tạo hóa đơn
- Xem báo cáo cơ bản
- Không thể quản lý users

### Viewer Role
- Chỉ xem (không thể tạo/sửa/xóa)
- Xem dashboard và báo cáo
- Không thể truy cập quản lý

## Cách sử dụng

### 1. Protected Routes

```tsx
import ProtectedRoute from '../components/ProtectedRoute';
import { PERMISSIONS } from '../utils/permissions';

export default function MyPage() {
  return (
    <ProtectedRoute permission={PERMISSIONS.VIEW_HOA_DON}>
      <div>Nội dung trang</div>
    </ProtectedRoute>
  );
}
```

### 2. Multiple Permissions

```tsx
// Cần có ít nhất 1 trong các permissions
<ProtectedRoute permissions={[PERMISSIONS.VIEW_HOA_DON, PERMISSIONS.EDIT_HOA_DON]}>
  <div>Nội dung</div>
</ProtectedRoute>

// Cần có tất cả permissions
<ProtectedRoute permissions={[PERMISSIONS.VIEW_HOA_DON, PERMISSIONS.EDIT_HOA_DON]} requireAll={true}>
  <div>Nội dung</div>
</ProtectedRoute>
```

### 3. Conditional Rendering

```tsx
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';

function MyComponent() {
  const { hasPermission } = useAuth();

  return (
    <div>
      {hasPermission(PERMISSIONS.CREATE_HOA_DON) && (
        <button>Tạo hóa đơn mới</button>
      )}
      
      {hasPermission(PERMISSIONS.DELETE_HOA_DON) && (
        <button>Xóa hóa đơn</button>
      )}
    </div>
  );
}
```

### 4. Sidebar Menu Filtering

Sidebar đã được cập nhật để tự động ẩn/hiện menu items dựa trên permissions:

```tsx
const menuItems = [
  { 
    name: 'Hóa đơn', 
    path: '/dashboard/hoa-don', 
    icon: <FiPieChart />,
    permission: PERMISSIONS.VIEW_HOA_DON  // Chỉ hiện nếu có permission
  },
  // ...
];
```

### 5. AuthContext Usage

```tsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { 
    user, 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions 
  } = useAuth();

  // Check single permission
  if (hasPermission(PERMISSIONS.VIEW_USERS)) {
    // Do something
  }

  // Check multiple permissions (any)
  if (hasAnyPermission([PERMISSIONS.VIEW_USERS, PERMISSIONS.EDIT_USERS])) {
    // Do something
  }

  // Check multiple permissions (all)
  if (hasAllPermissions([PERMISSIONS.VIEW_USERS, PERMISSIONS.EDIT_USERS])) {
    // Do something
  }

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <p>Role: {user?.role}</p>
      <p>Permissions: {user?.permissions?.length}</p>
    </div>
  );
}
```

## API Integration

### Expected API Response

API `/user/me` cần trả về:

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "roles": ["admin"],
  "permissions": [
    "view_dashboard",
    "view_hoa_don",
    "create_hoa_don",
    "edit_hoa_don",
    "delete_hoa_don",
    "view_users",
    "create_users",
    "edit_users",
    "delete_users"
  ],
  "is_active": true
}
```

### Permission Checking Flow

1. User login → API trả về user info + permissions
2. AuthContext lưu user info và permissions
3. ProtectedRoute check permissions trước khi render
4. Sidebar filter menu items dựa trên permissions
5. Components sử dụng `useAuth()` để check permissions

## Customization

### Thêm Permission Mới

1. Thêm vào `app/utils/permissions.ts`:

```tsx
export const PERMISSIONS = {
  // ... existing permissions
  NEW_PERMISSION: 'new_permission',
} as const;
```

2. Thêm vào role mapping:

```tsx
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // ... existing permissions
    PERMISSIONS.NEW_PERMISSION,
  ],
  // ...
};
```

3. Sử dụng trong components:

```tsx
<ProtectedRoute permission={PERMISSIONS.NEW_PERMISSION}>
  <div>Protected content</div>
</ProtectedRoute>
```

### Thêm Role Mới

1. Thêm role vào `app/utils/permissions.ts`:

```tsx
export const ROLES = {
  // ... existing roles
  NEW_ROLE: 'new_role',
} as const;
```

2. Định nghĩa permissions cho role:

```tsx
export const ROLE_PERMISSIONS = {
  // ... existing roles
  [ROLES.NEW_ROLE]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_HOA_DON,
    // ... other permissions
  ],
};
```

## Security Notes

- Permissions được check ở cả frontend và backend
- Frontend chỉ để UX, không đảm bảo security
- Backend phải validate tất cả requests
- JWT token nên chứa permissions để tránh API calls không cần thiết

## Troubleshooting

### Menu Items Không Hiện

1. Check user có permission không:
```tsx
console.log('User permissions:', user?.permissions);
```

2. Check permission name có đúng không:
```tsx
console.log('Permission check:', hasPermission(PERMISSIONS.VIEW_HOA_DON));
```

### Access Denied Error

1. Check API response format
2. Check permission name trong database
3. Check role-permission mapping

### Performance Issues

1. Permissions được cache trong AuthContext
2. Chỉ re-fetch khi user logout/login
3. Sử dụng `useMemo` cho permission checks nếu cần 