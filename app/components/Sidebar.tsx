"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React,{ useState,useEffect  } from 'react';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';
import { useRouter } from 'next/navigation';

import {
  FiHome,
  FiPieChart,
  FiBarChart2,
  FiActivity,
  FiUsers,
  FiSettings,
  FiDatabase,
  FiFileText,
  FiLogOut,
  FiCreditCard,
  FiLink
} from 'react-icons/fi';
import apiService from '../utils/api';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
  children?: MenuItem[];
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, hasPermission, logout } = useAuth();

  const menuItems: MenuItem[] = [
    { 
      name: 'Hóa Đơn Đáo - Rút', 
      path: '/dashboard/hoa-don', 
      icon: <FiPieChart className="w-5 h-5" />,
      permission: PERMISSIONS.BILL_VIEW
    },
    { 
      name: 'Hóa Đơn MoMo', 
      path: '/dashboard/momo-hoadon', 
      icon: <FiCreditCard className="w-5 h-5" />,
      permission: PERMISSIONS.VIEW_MOMO_HOADON_PAGE
    },
    { 
      name: 'Hóa Đơn Đối Ứng', 
      path: '/dashboard/doi-ung', 
      icon: <FiLink className="w-5 h-5" />,
      permission: PERMISSIONS.VIEW_DOI_UNG_PAGE
    },
    { 
      name: 'Báo cáo', 
      path: '/dashboard/reports', 
      icon: <FiBarChart2 className="w-5 h-5" />,
      permission: undefined,
    },
    { 
      name: 'Người dùng', 
      path: '/dashboard/users', 
      icon: <FiUsers className="w-5 h-5" />,
      permission: PERMISSIONS.USER_READ
    },
    { 
      name: 'Dữ liệu', 
      path: '/dashboard/data', 
      icon: <FiDatabase className="w-5 h-5" />,
      permission: PERMISSIONS.VIEW_SYSTEM_SETTINGS
    },
    { 
      name: 'Tài liệu', 
      path: '/dashboard/documents', 
      icon: <FiFileText className="w-5 h-5" />,
      permission: PERMISSIONS.VIEW_SYSTEM_SETTINGS
    },
  ];

  const bottomMenuItems: MenuItem[] = [
    { 
      name: 'Settings', 
      path: '/dashboard/settings', 
      icon: <FiSettings className="w-5 h-5" />,
      permission: PERMISSIONS.VIEW_SYSTEM_SETTINGS
    },
    { 
      name: 'Logout', 
      path: '/logout', 
      icon: <FiLogOut className="w-5 h-5" />
    },
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (item.name === 'Báo cáo') {
      return hasPermission(PERMISSIONS.REPORT_SUMMARY)
        || hasPermission(PERMISSIONS.REPORT_COMMISSION)
        || hasPermission(PERMISSIONS.REPORT_CALENDAR);
    }
    if (typeof item.permission === 'undefined') return true;
    return hasPermission(item.permission);
  });

  const filteredBottomMenuItems = bottomMenuItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const handleLogout = async () => {
    try {
      await apiService.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-blue-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
      <div className="h-full flex flex-col justify-between">
        <div className="p-4">
          <div className="py-4 border-b border-blue-200">
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            {user && (
              <p className="text-sm text-gray-500 mt-1">
                {user.username} ({user.role || 'User'})
              </p>
            )}
          </div>
          <nav className="mt-4 space-y-1">
            {filteredMenuItems.map((item) => {
            const isActive = pathname === item.path;
            const isOpen = openSubmenu === item.name;

            return (
              <div key={item.name}>
                <button
                  onClick={() => {
                    router.push(item.path);
                    if (onClose) onClose(); // Đóng sidebar trên mobile sau khi chuyển trang
                  }}
                  className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'} mr-3 group-hover:text-blue-600`}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left">{item.name}</span>
                 
                </button>

                
              </div>
            );
          })}
          </nav>
        </div>
        <div className="p-4 border-t border-blue-200">
          <nav className="space-y-1">
            {filteredBottomMenuItems.map((item) =>
              item.name === 'Logout' ? (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className={`text-red-500 group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-red-50 hover:text-red-700 transition-all`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`${pathname === item.path
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all`}
                >
                  <span className={`${pathname === item.path ? 'text-blue-600' : 'text-gray-500'} mr-3 group-hover:text-blue-600`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              ))}
          </nav>
        </div>
      </div>
      </aside>
    </>
  );
};

export default Sidebar; 