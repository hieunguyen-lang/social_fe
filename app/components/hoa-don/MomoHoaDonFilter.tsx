"use client";

import React, { useState } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { vi } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

interface MomoHoaDonFilterProps {
  onFilterChange: (filters: any) => void;
  loading: boolean;
}

const MomoHoaDonFilter: React.FC<MomoHoaDonFilterProps> = ({
  onFilterChange,
  loading
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    maGiaoDich: '',
    maKhachHang: '',
    fromDate: null as Date | null,
    toDate: null as Date | null,
    tenZalo: '',
    nguoiGui: ''
    
  });
  const [showFilters, setShowFilters] = useState(false); // Thêm state này để điều khiển ẩn/hiện filter

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      maGiaoDich: '',
      maKhachHang: '',
      fromDate: null,
      toDate: null,
      tenZalo: '',
      nguoiGui: ''
      
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== null
  );

  return (
    <>
      {/* Bộ lọc - Thanh tiêu đề nhỏ gọn và các nút chức năng */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-semibold text-gray-800">Bộ lọc</span>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="ml-2 px-3 py-1 rounded-lg font-medium transition-colors border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 flex items-center gap-1"
          >
            {showFilters ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                Ẩn bộ lọc
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                Hiện bộ lọc
              </>
            )}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-semibold shadow"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </button>
          )}
          {showFilters && (
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg border border-blue-500 transition-colors font-medium"
            >
              {showAdvanced ? 'Thu gọn' : 'Mở rộng'}
            </button>
          )}
        </div>
      </div>
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          {/* Basic filters */}
          <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            {/* Mã khách hàng */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã khách hàng
              </label>
              <input
                type="text"
                placeholder="Nhập mã khách hàng..."
                value={filters.maKhachHang}
                onChange={(e) => handleFilterChange('maKhachHang', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            {/* Tên Zalo */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Zalo
              </label>
              <input
                type="text"
                placeholder="Nhập tên Zalo..."
                value={filters.tenZalo}
                onChange={(e) => handleFilterChange('tenZalo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            {/* From Date */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <DatePicker
                  selected={filters.fromDate}
                  onChange={(date) => handleFilterChange('fromDate', date)}
                  selectsStart
                  startDate={filters.fromDate}
                  endDate={filters.toDate}
                  dateFormat="dd/MM/yyyy"
                  locale={vi}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholderText="Chọn ngày bắt đầu"
                  maxDate={filters.toDate || new Date()}
                />
              </div>
            </div>
            {/* To Date */}
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <DatePicker
                  selected={filters.toDate}
                  onChange={(date) => handleFilterChange('toDate', date)}
                  selectsEnd
                  startDate={filters.fromDate}
                  endDate={filters.toDate}
                  minDate={filters.fromDate || undefined}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  locale={vi}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholderText="Chọn ngày kết thúc"
                />
              </div>
            </div>
          </div>
          {/* Advanced filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
              {/* Mã giao dịch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã giao dịch
                </label>
                <input
                  type="text"
                  placeholder="Nhập mã giao dịch..."
                  value={filters.maGiaoDich}
                  onChange={(e) => handleFilterChange('maGiaoDich', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              {/* Người gửi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Người gửi
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên người gửi..."
                  value={filters.nguoiGui}
                  onChange={(e) => handleFilterChange('nguoiGui', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Active filters display giữ nguyên */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            
            {filters.fromDate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Từ: {filters.fromDate.toLocaleDateString('vi-VN')}
                <button
                  onClick={() => handleFilterChange('fromDate', null)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.toDate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Đến: {filters.toDate.toLocaleDateString('vi-VN')}
                <button
                  onClick={() => handleFilterChange('toDate', null)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.maGiaoDich && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Mã GD: {filters.maGiaoDich}
                <button
                  onClick={() => handleFilterChange('maGiaoDich', '')}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.maKhachHang && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Mã KH: {filters.maKhachHang}
                <button
                  onClick={() => handleFilterChange('maKhachHang', '')}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.tenZalo && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                Tên Zalo: {filters.tenZalo}
                <button
                  onClick={() => handleFilterChange('tenZalo', '')}
                  className="ml-1 text-pink-600 hover:text-pink-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.nguoiGui && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Người gửi: {filters.nguoiGui}
                <button
                  onClick={() => handleFilterChange('nguoiGui', '')}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MomoHoaDonFilter; 