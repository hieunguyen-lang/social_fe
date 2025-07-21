"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FiHome, FiPieChart, FiUser, FiInfo, FiSettings, FiMenu, FiDollarSign } from 'react-icons/fi';
import { FaApple } from 'react-icons/fa';
import { useState,useEffect } from 'react';
import { apiService } from '../utils/api';
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
interface NavbarProps {
  onMenuClick?: () => void;
}

const navCenterItems = [
  { name: 'Pricing', path: '/pricing' },
  { name: 'Features', path: '/features' },
  { name: 'Enterprise', path: '/enterprise' },
  { name: 'Blog', path: '/blog' },
  { name: 'Forum', path: '/forum' },
  { name: 'Careers', path: '/careers' },
];

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#232329]/70  shadow-xl rounded-b-2xl border-b border-white/10">
      <div className="mx-auto max-w-5xl px-2 md:px-6">
        <div className="flex justify-between h-16 items-center w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo_v2.png" alt="Logo" className="h-8 w-8" />
              <span className="text-2xl font-extrabold text-white tracking-wide">SOCIAL CRAWLER</span>
            </Link>
          </div>
          {/* Center nav */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {navCenterItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-gray-200 text-base font-medium px-2 py-1 rounded transition-all hover:text-white ${pathname === item.path ? 'font-bold text-white' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {/* Right nav */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login" className="p-2 rounded-lg border border-white/10 text-gray-200 hover:bg-white/10 transition-all">
              <FiUser className="w-5 h-5" />
            </Link>
            <a href="#" className="flex items-center bg-white/10 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-white/20 transition-all">
              <FaApple className="w-5 h-5 mr-2" />
              Open Web
            </a>
          </div>
          {/* Hamburger for mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all ml-auto"
            style={{marginRight: 0}}
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#18181b] bg-opacity-95 flex flex-col items-center justify-start md:hidden rounded-2xl pt-6">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            ×
          </button>
          <div className="flex flex-col space-y-8 w-full items-center">
            {navCenterItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`text-white text-2xl font-semibold px-8 py-3 rounded-xl hover:text-gray-200 transition-all ${pathname === item.path ? 'font-bold text-white' : ''}`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/login" className="flex items-center justify-center p-4 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-all w-2/3 text-xl mt-6">
              <FiUser className="w-6 h-6 mr-2" /> Đăng nhập
            </Link>
            <a href="#" className="flex items-center justify-center bg-white/10 text-white font-semibold px-8 py-4 rounded-lg shadow hover:bg-white/20 transition-all w-2/3 text-xl mt-2">
              <FaApple className="w-6 h-6 mr-3" /> Open Web
            </a>
          </div>
        </div>
      )}
    </nav>
  );
} 