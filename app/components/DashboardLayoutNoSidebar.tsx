"use client";

import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutNoSidebarProps {
  children: ReactNode;
}

const DashboardLayoutNoSidebar = ({ children }: DashboardLayoutNoSidebarProps) => {
  return (
    <div className="min-h-screen bg-lightgray">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default DashboardLayoutNoSidebar; 