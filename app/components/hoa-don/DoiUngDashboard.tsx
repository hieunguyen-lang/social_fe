import React, { useState, useEffect } from 'react';
import { Users, FolderOpen, DollarSign, CreditCard, X, Plus } from 'lucide-react';
import { HoaDonGroup, HoaDon } from '../../types/index';
import StatsCard from './StatsCard';
import HoaDonTable from './HoaDonTable';
import { getHoaDonList, getHoaDonStats, exportHoaDonExcel, createHoaDon, getHoaDonStatsByFilter, getDoiUngList, getDoiUngStats, DoiUngRecord, DoiUngResponse } from '../../api/hoaDonApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';

interface Filters {
  ten_khach_hang: string;
  ma_khach_hang: string;
  doi_tac: string;
  nguoi_gui: string;
  ma_giao_dich: string;
  nha_cung_cap: string;
  trang_thai: string;
  ky_thanh_toan: string;
  from_date: string;
  to_date: string;
  search: string;
}

const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];

// Định nghĩa fields cho đối ứng
const fields: { key: keyof DoiUngRecord; label: string; type?: string }[] = [
  { key: 'thoi_gian', label: 'THỜI GIAN' },
  { key: 'nguoi_gui', label: 'NGƯỜI GỬI' },
  { key: 'ten_khach_hang', label: 'TÊN KHÁCH' },
  { key: 'ma_khach_hang', label: 'MÃ KHÁCH' },
  { key: 'nha_cung_cap', label: 'NHÀ CUNG CẤP' },
  { key: 'ky_thanh_toan', label: 'KỲ THANH TOÁN' },
  { key: 'so_tien', label: 'SỐ TIỀN', type: 'number' },
  { key: 'tong_phi', label: 'TỔNG PHÍ', type: 'number' },
  { key: 'phi_phan_tram', label: 'PHÍ %' },
  { key: 'ma_giao_dich', label: 'MÃ GIAO DỊCH' },
  { key: 'tai_khoan_the', label: 'TÀI KHOẢN THẺ' },
  { key: 'trang_thai', label: 'TRẠNG THÁI' },
  { key: 'doi_tac', label: 'ĐỐI TÁC' },
  { key: 'batch_id', label: 'BATCH ID' },
  { key: 'dia_chi', label: 'ĐỊA CHỈ' },
  { key: 'update_at', label: 'CẬP NHẬT' },
];

// Thêm map mô tả dữ liệu mẫu cho từng trường
const fieldPlaceholderMap: Record<string, string> = {
  ten_khach_hang: 'Nguyễn Văn A',
  ma_khach_hang: 'KH001',
  doi_tac: 'Đối tác 1',
  nguoi_gui: 'Người gửi hóa đơn',
  ma_giao_dich: 'GD001',
  nha_cung_cap: 'Nhà cung cấp A',
  trang_thai: 'true',
  ky_thanh_toan: 'Kỳ 1/2024',
  from_date: '2024-06-01',
  to_date: '2024-06-30',
  search: '',
};

const parseDate = (str: string) => {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Thêm interface cho stats response
interface DoiUngStatsResponse {
  total: number;
  totalAmount: number;
}

const DoiUngDashboard: React.FC = () => {
  const [doiUngRecords, setDoiUngRecords] = useState<DoiUngRecord[]>([]);
  const [stats, setStats] = useState({ totalRecords: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    ten_khach_hang: '',
    ma_khach_hang: '',
    doi_tac: '',
    nguoi_gui: '',
    ma_giao_dich: '',
    nha_cung_cap: '',
    trang_thai: '',
    ky_thanh_toan: '',
    from_date: '',
    to_date: '',
    search: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [visibleFields, setVisibleFields] = useState<(keyof DoiUngRecord)[]>(
    fields.map(f => f.key as keyof DoiUngRecord).filter(key => 
      key !== 'batch_id' && key !== 'ky_thanh_toan' && key !== 'nguoi_gui' && key !== 'key_redis' && key !== 'tai_khoan_the'&& key !== 'dia_chi'
    )
  );
  
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  
  // State cho modal tạo hóa đơn
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createData, setCreateData] = useState<Partial<DoiUngRecord>>({});
  const [createLoading, setCreateLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Map field key sang label tiếng Việt
  const fieldLabelMap: Record<string, string> = Object.fromEntries(fields.map(f => [f.key, f.label]));

  const buildQueryParams = (filters: Filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  };

  const buildStatsQueryParams = (filters: Filters) => {
    const params = new URLSearchParams();
    // Chỉ gửi các tham số mà stats API hỗ trợ
    const statsParams = ['ma_giao_dich', 'nguoi_gui', 'ma_khach_hang', 'ten_khach_hang', 'from_date', 'to_date', 'search'];
    statsParams.forEach(key => {
      if (filters[key as keyof Filters]) {
        params.append(key, filters[key as keyof Filters]);
      }
    });
    return params.toString();
  };

  const loadStats = async (filters: Filters) => {
    try {
      const queryParams = buildStatsQueryParams(filters);
      const data: DoiUngStatsResponse = await getDoiUngStats(queryParams);
      
      // Nhận trực tiếp từ API thay vì tính toán
      setStats({
        totalRecords: data.total,
        totalAmount: data.totalAmount
      });
    } catch (error) {
      console.error('Không thể tải thống kê:', error);
    }
  };

  const reloadData = async (filterParams?: Filters, pageParam?: number, pageSizeParam?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterParams) {
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      params.append('page', String(pageParam || page));
      params.append('page_size', String(pageSizeParam || pageSize));
      const data: DoiUngResponse = await getDoiUngList(params.toString());
      setDoiUngRecords(data.data);
      setTotalPages(Math.ceil(data.total / (pageSizeParam || pageSize)));
    } catch (e) {
      alert('Không thể tải dữ liệu đối ứng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats(filters);
    reloadData(filters, page, pageSize);
    // eslint-disable-next-line
  }, [filters, page, pageSize]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1); // Reset page về 1 khi filter thay đổi
  };

  const clearFilters = () => {
    const emptyFilters = {
      ten_khach_hang: '',
      ma_khach_hang: '',
      doi_tac: '',
      nguoi_gui: '',
      ma_giao_dich: '',
      nha_cung_cap: '',
      trang_thai: '',
      ky_thanh_toan: '',
      from_date: '',
      to_date: '',
      search: ''
    };
    setFilters(emptyFilters);
    setPage(1);
    loadStats(emptyFilters);
  };

  const handleExportExcel = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const blob = await exportHoaDonExcel(params.toString());
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'doi_ung.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Xuất Excel thất bại!');
    }
  };

  const handleCreateHoaDon = async () => {
    setCreateLoading(true);
    setFormErrors([]);
    try {
      await createHoaDon(createData);
      setCreateModalOpen(false);
      setCreateData({});
      reloadData(filters, page, pageSize);
      alert('Tạo hóa đơn thành công!');
    } catch (e: any) {
      if (e.status === 422 && Array.isArray(e.detail)) {
        setFormErrors(e.detail.map((err: any) => {
          const field = err.loc[1];
          const label = fieldLabelMap[field] || field;
          return `${label}: ${err.msg}`;
        }));
      } else {
        alert('Tạo hóa đơn thất bại!');
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateChange = (field: keyof DoiUngRecord, value: string | boolean) => {
    setCreateData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Đối Ứng</h1>
            <p className="text-gray-600 mt-2">
                Quản lý và theo dõi đối ứng Momo
            </p>
        </div>
        {/* Nút xuất Excel */}
        <div className="mb-4 flex justify-end gap-2">
          
          <button
            onClick={() => setShowStats(s => !s)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {showStats ? 'Ẩn Thống kê' : 'Hiện Thống kê'}
          </button>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {showFilters ? 'Ẩn Bộ lọc' : 'Hiện Bộ lọc'}
          </button>
        </div>

        {/* Stats Cards */}
        {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <StatsCard
            title="Tổng Hóa Đơn"
            value={stats.totalRecords}
            icon={<Users className="w-5 h-5" />}
            color="border-blue-500"
          />
          <StatsCard
            title="Tổng Tiền"
            value={stats.totalAmount}
            icon={<DollarSign className="w-5 h-5" />}
            color="border-emerald-500"
            isCurrency={true}
          />
          <StatsCard
            title="Tổng Phí"
            value={stats.totalAmount}
            icon={<CreditCard className="w-5 h-5" />}
            color="border-red-500"
            isCurrency={true}
          />
        </div>
        )}

        {/* Filters */}
        {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
              <input
                type="text"
                value={filters.ten_khach_hang}
                onChange={(e) => handleFilterChange('ten_khach_hang', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên khách hàng..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã khách hàng</label>
              <input
                type="text"
                value={filters.ma_khach_hang}
                onChange={(e) => handleFilterChange('ma_khach_hang', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mã khách hàng..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đối tác</label>
              <input
                type="text"
                value={filters.doi_tac}
                onChange={(e) => handleFilterChange('doi_tac', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập đối tác..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Người gửi</label>
              <input
                type="text"
                value={filters.nguoi_gui}
                onChange={(e) => handleFilterChange('nguoi_gui', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập người gửi..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã giao dịch</label>
              <input
                type="text"
                value={filters.ma_giao_dich}
                onChange={(e) => handleFilterChange('ma_giao_dich', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mã giao dịch..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nhà cung cấp</label>
              <input
                type="text"
                value={filters.nha_cung_cap}
                onChange={(e) => handleFilterChange('nha_cung_cap', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập nhà cung cấp..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={filters.trang_thai}
                onChange={(e) => handleFilterChange('trang_thai', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="true">Đã xử lý</option>
                <option value="false">Chưa xử lý</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kỳ thanh toán</label>
              <input
                type="text"
                value={filters.ky_thanh_toan}
                onChange={(e) => handleFilterChange('ky_thanh_toan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập kỳ thanh toán..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
              <DatePicker
                selected={filters.from_date ? parseDate(filters.from_date) : null}
                onChange={date => date && handleFilterChange('from_date', formatDate(date))}
                dateFormat="dd/MM/yyyy"
                locale={vi}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Chọn ngày bắt đầu"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
              <DatePicker
                selected={filters.to_date ? parseDate(filters.to_date) : null}
                onChange={date => date && handleFilterChange('to_date', formatDate(date))}
                dateFormat="dd/MM/yyyy"
                locale={vi}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Chọn ngày kết thúc"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm kiếm theo tên KH, mã KH, mã GD..."
              />
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
        )}

        {/* Chọn trường hiển thị */}
        <div className="flex flex-wrap gap-2 mb-2">
          {fields.map(f => (
            <label key={f.key as string} className="inline-flex items-center gap-1 text-xs whitespace-nowrap px-2 py-1 bg-gray-100 rounded border border-gray-200">
              <input
                type="checkbox"
                checked={visibleFields.includes(f.key)}
                onChange={() => {
                  setVisibleFields(prev =>
                    prev.includes(f.key)
                      ? prev.filter(k => k !== f.key)
                      : [...prev, f.key]
                  );
                }}
              />
              {f.label}
            </label>
          ))}
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-10 text-lg">Đang tải dữ liệu...</div>
        ) : (
          <>
            {/* Hiển thị dữ liệu flat */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="overflow-x-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      {visibleFields.map(field => (
                        <th key={field} className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">
                          {fieldLabelMap[field]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doiUngRecords.map((record, index) => (
                      <tr key={record.id || index} className="hover:bg-gray-50">
                        {visibleFields.map(field => (
                          <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {field === 'so_tien' || field === 'tong_phi' ? (
                              <span className="font-mono">
                                {parseFloat(record[field] || '0').toLocaleString('vi-VN')}
                              </span>
                            ) : field === 'thoi_gian' || field === 'update_at' ? (
                              <span>
                                {new Date(record[field]).toLocaleString('vi-VN')}
                              </span>
                            ) : (
                              record[field] || '-'
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pagination UI chuyển lên Dashboard */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm">Trang:</span>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Trước
                </button>
                <span className="font-semibold text-blue-700">{page}</span>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Sau
                </button>
                <span className="text-sm ml-4">Số dòng/trang:</span>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Tổng số record: <b>{stats.totalRecords}</b>
              </div>
            </div>
          </>
        )}

        {/* Create Modal */}
        {createModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Tạo Hóa Đơn Mới</h2>
                <button
                  onClick={() => {
                    setCreateModalOpen(false);
                    setCreateData({});
                    setFormErrors([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Hiển thị lỗi 422 */}
              {formErrors.length > 0 && (
                <div className="mb-2 text-red-600">
                  <ul>
                    {formErrors.map((err, idx) => <li key={idx}>{err}</li>)}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(f => (
                  <div key={f.key as string} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {f.label}
                    </label>
                    {f.key === 'trang_thai' ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          checked={createData[f.key] === 'true'}
                          onChange={e => handleCreateChange(f.key, e.target.checked.toString())}
                          disabled={createLoading}
                        />
                        <span className="ml-2 text-sm text-gray-600">Đã xử lý</span>
                      </div>
                    ) : f.key === 'so_tien' || f.key === 'tong_phi' ? (
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={createData[f.key] ?? ''}
                        onChange={e => handleCreateChange(f.key, e.target.value)}
                        disabled={createLoading}
                        placeholder={fieldPlaceholderMap[f.key as string] || `Nhập ${f.label.toLowerCase()}`}
                      />
                    ) : f.key === 'thoi_gian' ? (
                      <DatePicker
                        selected={createData[f.key] ? parseDate(createData[f.key] as string) : null}
                        onChange={date => date && handleCreateChange(f.key, formatDate(date))}
                        dateFormat="dd/MM/yyyy"
                        locale={vi}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : f.key === 'dia_chi' ? (
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        value={createData[f.key] ?? ''}
                        onChange={e => handleCreateChange(f.key, e.target.value)}
                        disabled={createLoading}
                        placeholder={fieldPlaceholderMap[f.key as string] || `Nhập ${f.label.toLowerCase()}`}
                      />
                    ) : (
                      <input
                        type={f.type || 'text'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={typeof createData[f.key] === 'boolean' || createData[f.key] == null ? '' : String(createData[f.key])}
                        onChange={e => handleCreateChange(f.key, e.target.value)}
                        disabled={createLoading}
                        placeholder={fieldPlaceholderMap[f.key as string] || `Nhập ${f.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setCreateModalOpen(false);
                    setCreateData({});
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  disabled={createLoading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateHoaDon}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  disabled={createLoading}
                >
                  {createLoading ? 'Đang tạo...' : 'Tạo hóa đơn'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoiUngDashboard; 