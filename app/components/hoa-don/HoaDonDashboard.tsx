import React, { useState, useEffect } from 'react';
import { Users, FolderOpen, DollarSign, CreditCard, X, Plus } from 'lucide-react';
import { HoaDonGroup, HoaDon } from '../../types/index';
import StatsCard from './StatsCard';
import HoaDonTable from './HoaDonTable';
import { getHoaDonList, getHoaDonStats, exportHoaDonExcel, createHoaDon, getHoaDonStatsByFilter } from '../../api/hoaDonApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';

interface Filters {
  so_hoa_don: string;
  so_lo: string;
  tid: string;
  mid: string;
  nguoi_gui: string;
  ten_khach: string;
  so_dien_thoai: string;
  ngay_giao_dich: string;
}

const PAGE_SIZE_OPTIONS = [20, 30, 40, 50, 100,200,500];

// Định nghĩa fields ở đầu file
const fields: { key: keyof HoaDon; label: string; type?: string }[] = [
  { key: 'created_at', label: 'Thời điểm xử lý' },
  { key: 'gio_giao_dich', label: 'GIỜ GIAO DỊCH' },
  { key: 'nguoi_gui', label: 'NGƯỜI GỬI' },
  { key: 'ten_khach', label: 'TÊN KHÁCH' },
  { key: 'so_dien_thoai', label: 'SĐT KHÁCH' },
  { key: 'type_dao_rut', label: 'ĐÁO / RÚT' },
  { key: 'so_the', label: 'SỐ THẺ' },
  { key: 'tid', label: 'TID' },
  { key: 'so_lo', label: 'SỐ LÔ' },
  { key: 'so_hoa_don', label: 'SỐ HÓA ĐƠN' },
  { key: 'ten_may_pos', label: 'POS' },
  { key: 'tong_so_tien', label: 'SỐ TIỀN', type: 'number' },
  { key: 'phan_tram_phi', label: 'Phí %' },
  { key: 'phi_per_bill', label: 'PHÍ DV', type: 'number' },
  { key: 'ck_ra', label: 'CK ra'},
  { key: 'ck_vao', label: 'CK vào'},
  { key: 'stk_khach', label: 'STK KHÁCH' },
  { key: 'stk_cty', label: 'STK CÔNG TY' },
  { key: 'caption_goc', label: 'NOTE GỐC' },
  { key: 'lich_canh_bao_datetime', label: 'Lịch cảnh báo' },
  { key: 'tinh_trang', label: 'TÌNH TRẠNG' },
];

// Thêm map mô tả dữ liệu mẫu cho từng trường
const fieldPlaceholderMap: Record<string, string> = {
  ten_khach: 'Nguyễn Văn A',
  so_dien_thoai: '0123456789',
  nguoi_gui: 'Người gửi hóa đơn',
  ngay_giao_dich: '2024-06-01',
  gio_giao_dich: '14:30',
  type_dao_rut: 'DAO  hoặc RUT',
  tong_so_tien: '1000000',
  tien_phi: '20000',
  so_the: '1234567890123456',
  tid: 'TID123456',
  mid: 'MID123456',
  so_lo: 'Lô 1',
  so_hoa_don: 'HD001',
  ten_may_pos: 'POS 01',
  ck_vao: '50000',
  ck_ra: '10000',
  dia_chi: '123 Đường ABC',
  stk_khach: '0123456789',
  stk_cty: '9876543210',
  caption_goc: 'Ghi chú...',
  ket_toan: 'Đã KT',
  ly_do: 'Lý do...',
  phan_tram_phi: '0.02',
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

const HoaDonDashboard: React.FC = () => {
  const [hoaDonGroups, setHoaDonGroups] = useState<HoaDonGroup[]>([]);
  const [stats, setStats] = useState({ totalRecords: 0, totalBatches: 0, totalAmount: 0, totalFee: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    so_hoa_don: '',
    so_lo: '',
    tid: '',
    mid: '',
    nguoi_gui: '',
    ten_khach: '',
    so_dien_thoai: '',
    ngay_giao_dich: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [visibleFields, setVisibleFields] = useState<(keyof HoaDon)[]>(
    fields.map(f => f.key as keyof HoaDon).filter(key => 
      key !== 'ten_khach' && key !== 'so_dien_thoai' && key !== 'nguoi_gui' && key !== 'gio_giao_dich'
    )
  );
  const [showStats, setShowStats] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // Mặc định ẩn bộ lọc
  
  // State cho modal tạo hóa đơn
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createData, setCreateData] = useState<Partial<HoaDon>>({});
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

  const loadStats = async (filters: Filters) => {
    try {
      const queryParams = buildQueryParams(filters);
      const statsData = await getHoaDonStatsByFilter(queryParams);
      setStats(statsData);
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
      const data = await getHoaDonList(params.toString());
      setHoaDonGroups(data.data);
      setTotalPages(Math.ceil(data.total / (pageSizeParam || pageSize)));
    } catch (e) {
      alert('Không thể tải dữ liệu hóa đơn!');
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
      so_hoa_don: '',
      so_lo: '',
      tid: '',
      mid: '',
      nguoi_gui: '',
      ten_khach: '',
      so_dien_thoai: '',
      ngay_giao_dich: ''
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
      // KHÔNG truyền page và page_size
      const blob = await exportHoaDonExcel(params.toString());
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hoa_don.xlsx';
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

  const handleCreateChange = (field: keyof HoaDon, value: string | boolean) => {
    setCreateData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          {/* <h1 className="text-3xl font-bold text-gray-900">Dashboard Hóa Đơn</h1> */}
          <p className="text-gray-600 mt-2">
            Quản lý và theo dõi hóa đơn giao dịch theo batch
          </p>
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
            title="Tổng Batch"
            value={stats.totalBatches}
            icon={<FolderOpen className="w-5 h-5" />}
            color="border-green-500"
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
            value={stats.totalFee}
            icon={<CreditCard className="w-5 h-5" />}
            color="border-red-500"
            isCurrency={true}
          />
        </div>
        )}
        {/* Bộ lọc - Thanh tiêu đề nhỏ gọn và các nút chức năng */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" /></svg>
            <span className="text-lg font-semibold text-gray-800">Bộ lọc</span>
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`ml-2 px-3 py-1 rounded-lg font-medium transition-colors border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 flex items-center gap-1`}
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
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo hóa đơn
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Xuất Excel
            </button>
            <button
              onClick={() => setShowStats(s => !s)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {showStats ? 'Ẩn Thống kê' : 'Hiện Thống kê'}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số hóa đơn</label>
              <input
                type="text"
                value={filters.so_hoa_don}
                onChange={(e) => handleFilterChange('so_hoa_don', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Nhập số hóa đơn..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số lô</label>
              <input
                type="text"
                value={filters.so_lo}
                onChange={(e) => handleFilterChange('so_lo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Nhập số lô..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TID</label>
              <input
                type="text"
                value={filters.tid}
                onChange={(e) => handleFilterChange('tid', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Nhập TID..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MID</label>
              <input
                type="text"
                value={filters.mid}
                onChange={(e) => handleFilterChange('mid', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Nhập MID..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Người gửi</label>
              <input
                type="text"
                value={filters.nguoi_gui}
                onChange={(e) => handleFilterChange('nguoi_gui', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Nhập người gửi..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách</label>
              <input
                type="text"
                value={filters.ten_khach}
                onChange={(e) => handleFilterChange('ten_khach', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Nhập tên khách..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={filters.so_dien_thoai}
                onChange={(e) => handleFilterChange('so_dien_thoai', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Nhập số điện thoại..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giao dịch</label>
              <DatePicker
                selected={filters.ngay_giao_dich ? parseDate(filters.ngay_giao_dich) : null}
                onChange={date => date && handleFilterChange('ngay_giao_dich', formatDate(date))}
                dateFormat="dd/MM/yyyy"
                locale={vi}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
            <HoaDonTable 
              hoaDonGroups={hoaDonGroups}
              onReload={() => reloadData(filters, page, pageSize)}
              fields={fields}
              visibleFields={visibleFields}
            />
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
                <span className="text-sm ml-4">Số batch/trang:</span>
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
                Tổng số batch: <b>{stats.totalBatches}</b>
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
                    {f.key === 'tinh_trang' ? (
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
                    ) : f.key === 'tong_so_tien' || f.key === 'tien_phi' || f.key === 'ck_ra' || f.key === 'ck_vao' ? (
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={createData[f.key] ?? ''}
                        onChange={e => handleCreateChange(f.key, e.target.value)}
                        disabled={createLoading}
                        placeholder={fieldPlaceholderMap[f.key as string] || `Nhập ${f.label.toLowerCase()}`}
                      />
                    ) : f.key === 'ngay_giao_dich' ? (
                      <DatePicker
                        selected={createData[f.key] ? parseDate(createData[f.key] as string) : null}
                        onChange={date => date && handleCreateChange(f.key, formatDate(date))}
                        dateFormat="dd/MM/yyyy"
                        locale={vi}
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : f.key === 'caption_goc' || f.key === 'ly_do' ? (
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

export default HoaDonDashboard; 