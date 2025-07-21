"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { PERMISSIONS } from '../../utils/permissions';
import { getUsers, createUser, updateUser, deleteUser, addUserPermission, removeUserPermission, getUser, fetchAllPermissions } from '../../api/userApi';

const ALL_PERMISSIONS = [
  'bill:view', 'bill:create', 'bill:update', 'bill:delete',
  'user:read', 'user:create', 'user:update', 'user:delete',
  // ... thêm các quyền khác nếu có
];

function UserPermissionModal({ user, onClose, onSuccess }: { user: any, onClose: () => void, onSuccess: () => void }) {
  const [selected, setSelected] = useState<string[]>(user.permissions || []);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Gọi API lấy danh sách quyền
    fetchAllPermissions()
      .then(data => setAllPermissions(data))
      .catch(() => setAllPermissions([]));
  }, []);

  const handleToggle = (perm: string) => {
    setSelected(selected =>
      selected.includes(perm)
        ? selected.filter(p => p !== perm)
        : [...selected, perm]
    );
  };
  const handleSave = async () => {
    setError(null);
    try {
      for (const perm of selected) {
        if (!user.permissions.includes(perm)) {
          await addUserPermission(user.id, perm);
        }
      }
      for (const perm of user.permissions) {
        if (!selected.includes(perm)) {
          await removeUserPermission(user.id, perm);
        }
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.detail || 'Có lỗi xảy ra!');
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Gán quyền cho user</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {allPermissions.map(perm => (
            <label key={perm.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(perm.name)}
                onChange={() => handleToggle(perm.name)}
              />
              {perm.description ? `${perm.description} (${perm.name})` : perm.name}
            </label>
          ))}
        </div>
        <div className="flex gap-2 justify-end pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [showPermModal, setShowPermModal] = useState(false);
  const [permUser, setPermUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải danh sách user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (user: any) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      await deleteUser(user.id);
      fetchUsers();
    }
  };

  const handleEdit = async (user: any) => {
    const fullUser = await getUser(user.id);
    setEditingUser(fullUser);
    setShowModal(true);
  };

  const handlePerm = async (user: any) => {
    const fullUser = await getUser(user.id);
    setPermUser(fullUser);
    setShowPermModal(true);
  };

  const handleSave = async (form: any) => {
    if (editingUser) {
      await updateUser(editingUser.id, form);
    } else {
      await createUser(form);
    }
    setShowModal(false);
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <ProtectedRoute permission={PERMISSIONS.USER_READ}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
            <button onClick={() => { setEditingUser(null); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded">Thêm user</button>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">{user.is_active ? 'Active' : 'Inactive'}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">Sửa</button>
                      <button onClick={() => handleDelete(user)} className="text-red-600 hover:underline">Xóa</button>
                      <button onClick={() => handlePerm(user)} className="text-green-600 hover:underline">Gán quyền</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showModal && (
          <UserFormModal
            user={editingUser}
            onClose={() => { setShowModal(false); setEditingUser(null); }}
            onSave={handleSave}
          />
        )}
        {showPermModal && permUser && (
          <UserPermissionModal
            user={permUser}
            onClose={() => { setShowPermModal(false); setPermUser(null); }}
            onSuccess={fetchUsers}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function UserFormModal({ user, onClose, onSave }: { user: any, onClose: () => void, onSave: (form: any) => void }) {
  console.log('UserFormModal user:', user);
  const [form, setForm] = useState<any>({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || '',
    is_active: user?.is_active ?? true,
  });
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setForm({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      role: user?.role || '',
      is_active: user?.is_active ?? true,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra!');
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{user ? 'Sửa user' : 'Thêm user'}</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full border rounded px-3 py-2" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-3 py-2" required />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full border rounded px-3 py-2" type="password" required={!user} />
          <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Chọn role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            {/* Thêm các role khác nếu có */}
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            Active
          </label>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
} 