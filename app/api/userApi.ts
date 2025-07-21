const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8002'
    : 'http://45.32.104.37:8002';

const API_URL = `${API_BASE_URL}/user`;

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  hashed_password: string;
}

export interface UserCreate {
  username: string;
  email: string;
  name: string;
  password: string;
  role: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}

// Helper fetch tự động bắt lỗi 401
export async function fetchWith401(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.status === 401) {
    // Ném lỗi đặc biệt để component bắt và redirect
    throw { code: 401, message: 'Phiên đăng nhập đã hết, vui lòng đăng nhập lại!' };
  }
  return response;
}

// Lấy danh sách users
export const getUsers = async (): Promise<User[]> => {
  const response = await fetchWith401(`${API_URL}/`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy danh sách users thất bại');
  return response.json();
};

// Lấy thông tin user theo ID
export const getUser = async (userId: number): Promise<User> => {
  const response = await fetchWith401(`${API_URL}/${userId}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy thông tin user thất bại');
  return response.json();
};

// Tạo user mới
export const createUser = async (userData: UserCreate): Promise<any> => {
  const response = await fetchWith401(`${API_URL}/create_user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Tạo user thất bại');
  }
  
  return response.json();
};

// Cập nhật user
export const updateUser = async (userId: number, userData: UserUpdate): Promise<User> => {
  const response = await fetchWith401(`${API_URL}/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Cập nhật user thất bại');
  }
  
  return response.json();
};

// Xóa user
export const deleteUser = async (userId: number): Promise<void> => {
  const response = await fetchWith401(`${API_URL}/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Xóa user thất bại');
  }
};

// Lấy thông tin user hiện tại
export const getCurrentUser = async (): Promise<any> => {
  const response = await fetchWith401(`${API_URL}/me`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy thông tin user hiện tại thất bại');
  return response.json();
};

export const addUserPermission = async (userId: number, permissionName: string) => {
  const response = await fetchWith401(`${API_URL}/${userId}/add_permission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ permission_name: permissionName }),
  });
  if (!response.ok) throw await response.json();
  return response.json();
};

export const removeUserPermission = async (userId: number, permissionName: string) => {
  const response = await fetchWith401(`${API_URL}/${userId}/remove_permission`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ permission_name: permissionName }),
  });
  if (!response.ok) throw await response.json();
  return response.json();
};

export async function fetchAllPermissions() {
  const response = await fetchWith401(`${API_URL}/permissions`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Không lấy được danh sách quyền');
  return response.json();
} 