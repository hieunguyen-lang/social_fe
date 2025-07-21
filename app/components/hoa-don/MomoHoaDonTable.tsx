"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Search, Filter, Download, Star, X } from 'lucide-react';
import { format } from 'date-fns';
import { th, vi } from 'date-fns/locale';
import { MomoRecord, MomoBatch, deleteMomoHoaDonBatch } from '../../api/hoaDonApi';

interface MomoHoaDonResponse {
  total: number;
  data: MomoBatch[];
}

interface MomoHoaDonTableProps {
  data: MomoHoaDonResponse;
  loading: boolean;
  onPageChange: (page: number) => void;
  currentPage: number;
  itemsPerPage: number;
  onEditBatch?: (records: MomoRecord[]) => void;
  onDelete?: (record: MomoRecord) => void;
}

const MomoHoaDonTable: React.FC<MomoHoaDonTableProps> = ({
  data,
  loading,
  onPageChange,
  currentPage,
  itemsPerPage,
  onEditBatch,
  onDelete
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailBatch, setDetailBatch] = useState<MomoBatch | null>(null);
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());

  const handleShowDetail = (batch: MomoBatch) => {
    setDetailBatch(batch);
    setShowDetailModal(true);
  };

  const toggleBatch = (batchId: string) => {
    setExpandedBatches(prev => {
      const newSet = new Set(prev);
      if (newSet.has(batchId)) {
        newSet.delete(batchId);
      } else {
        newSet.add(batchId);
      }
      return newSet;
    });
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';
      // Parse ISO string, cộng thêm 7 tiếng (UTC+7)
      const date = new Date(dateString);
      // Nếu dateString đã có offset, vẫn cộng thêm 7h để đảm bảo về giờ VN
      const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
      return format(vnDate, 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'thành công':
        return 'bg-green-100 text-green-800';
      case 'thất bại':
        return 'bg-red-100 text-red-800';
      case 'đang xử lý':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusSendRecieveColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'true':
        return 'bg-green-100 text-green-800';
      case 'false':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  const totalPages = Math.ceil(data.total / itemsPerPage);

  const handleDeleteBatch = async (batchId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ hóa đơn trong batch này?')) return;
    try {
      await deleteMomoHoaDonBatch(batchId);
      onPageChange(currentPage); // reload lại bảng
      alert('Đã xóa batch thành công!');
    } catch (e) {
      alert('Xóa batch thất bại!');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header với thống kê */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách hóa đơn MoMo ({data.total} hóa đơn)
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Batch ID</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Tên Zalo</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Tổng hóa đơn</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Tổng tiền</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Tổng phí </th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Chuyển vào</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Chuyển ra</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Số tài khoản</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Trạng thái chuyển khoản</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-xs">
            {data.data.map((batch) => {
              const totalAmount = batch.records.reduce((sum, record) => sum + parseFloat(record.so_tien), 0);
              const successCount = batch.records.filter(record => record.trang_thai === 'Thành công').length;
              const latestRecord = batch.records[0]; // Giả sử record đầu tiên là mới nhất
              const tenZalo = latestRecord?.ten_zalo || 'N/A';
              const totalPhiCongTyThu = batch.records.reduce((sum, record) => sum + (parseFloat(record.phi_cong_ty_thu || '0')), 0);
              const ck_vao = latestRecord?.ck_vao || '0';
              const ck_ra = latestRecord?.ck_ra || '0';
              const so_tk = latestRecord?.so_tk || 'N/A';
              const is_send_or_recieve = latestRecord?.is_send_or_recieve || 'False';
              const isExpanded = expandedBatches.has(batch.batch_id);
              return (
                <React.Fragment key={batch.batch_id}>
                  {/* Batch row */}
                  <tr className="bg-blue-50 border-b border-blue-200 hover:bg-blue-100 transition-colors">
                    <td className="px-2 py-1 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleBatch(batch.batch_id)}
                          className="mr-2 text-blue-700 hover:text-blue-700 p-0.5"
                        >
                          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <span className="text-xs font-medium text-blue-700">
                          {batch.batch_id.slice(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap">
                      <div className="text-xs font-medium text-blue-700">
                        {tenZalo}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap">
                      <div className="text-xs text-blue-700">
                        {batch.records.length} 
                      </div>
                      {/* <div className="text-xs text-blue-700">
                        {successCount} thành công
                      </div> */}
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-900">
                        {formatCurrency(totalAmount.toString())}
                      </div>
                    
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap">
                      
                      <div className="text-xs text-green-600 font-semibold">
                        {formatCurrency(totalPhiCongTyThu.toString())}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap">
                      <div className="text-xs font-medium text-green-600">
                        {formatCurrency(ck_vao.toString())}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap">
                      <div className="text-xs font-medium text-red-700">
                        {formatCurrency(ck_ra.toString())}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap">
                      <div className="text-xs font-medium text-blue-700">
                        {so_tk}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap">
                      <div className="text-xs font-medium text-blue-700">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusSendRecieveColor(is_send_or_recieve)}`}>
                              {is_send_or_recieve}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap">
                      <div className="text-xs text-blue-700">
                        {formatDate(latestRecord?.update_at || '')}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap text-xs">
                      <button
                        onClick={() => handleShowDetail(batch)}
                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      <button
                          onClick={() => onEditBatch && onEditBatch(batch.records)}
                          className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
                        >
                          Sửa batch
                        </button>
                      <button
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                          onClick={() => handleDeleteBatch(batch.batch_id)}
                        >
                          Xóa batch
                        </button>
                    </td>
                  </tr>
                  {/* Expanded records (inline, không phải modal) */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={16} className="px-2 py-0">
                        <div className="bg-gray-50 border-t border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200 text-xs">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nhà cung cấp</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kỳ thanh toán</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mã giao dịch</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tài khoản thẻ</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Người gửi</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên Zalo</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cập nhật</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phí công ty thu</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {batch.records.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">{record.id}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-xs font-medium text-gray-900">{record.ten_khach_hang}</div>
                                    <div className="text-xs text-gray-500">{record.ma_khach_hang}</div>
                                  </td>
                                  <td className="px-4 py-3"><div className="text-xs text-gray-900">{record.nha_cung_cap}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs text-gray-900">{record.dia_chi}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs text-gray-900">{record.ky_thanh_toan}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs font-medium text-gray-900">{formatCurrency(record.so_tien)}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs text-gray-900">{record.ma_giao_dich}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs text-gray-900">{formatDate(record.created_at)}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs text-gray-900">{record.tai_khoan_the}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs text-gray-900">{record.nguoi_gui}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs text-gray-900">{record.ten_zalo}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs text-gray-900">{formatDate(record.update_at)}</div></td>
                                  <td className="px-4 py-3"><div className="text-xs font-medium text-gray-900">{formatCurrency(record.phi_cong_ty_thu?.toString() || '0')}</div></td>
                                  
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, data.total)} trong tổng số {data.total} bản ghi
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết batch - render một lần duy nhất ở cuối component */}
      {showDetailModal && detailBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-700">Chi tiết batch {detailBatch.batch_id.slice(0,8)}...</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-200 rounded-lg overflow-hidden text-xs md:text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">ID</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Khách hàng</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Nhà cung cấp</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Địa chỉ</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Kỳ thanh toán</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Số tiền</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Mã giao dịch</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Ngày tạo</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Tài khoản thẻ</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Người gửi</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Tên Zalo</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Cập nhật</th>
                    <th className="px-2 py-1 text-xs font-semibold text-gray-700">Phí công ty thu</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailBatch.records.map((record) => (
                    <tr key={record.id} className="hover:bg-blue-50">
                      <td className="px-2 py-1 text-center text-gray-500">{record.id}</td>
                      <td className="px-2 py-1 text-sm">{record.ten_khach_hang}<div className="text-xs text-gray-500">{record.ma_khach_hang}</div></td>
                      <td className="px-2 py-1 text-sm">{record.nha_cung_cap}</td>
                      <td className="px-2 py-1 text-sm">{record.dia_chi}</td>
                      <td className="px-2 py-1 text-sm">{record.ky_thanh_toan}</td>
                      <td className="px-2 py-1 text-sm font-medium">{formatCurrency(record.so_tien)}</td>
                      <td className="px-2 py-1 text-sm">{record.ma_giao_dich}</td>
                      <td className="px-2 py-1 text-sm">{formatDate(record.created_at)}</td>
                      <td className="px-2 py-1 text-sm">{record.tai_khoan_the}</td>
                      <td className="px-2 py-1 text-sm">{record.nguoi_gui}</td>
                      <td className="px-2 py-1 text-sm">{record.ten_zalo}</td>
                      <td className="px-2 py-1 text-sm">{formatDate(record.update_at)}</td>
                      <td className="px-2 py-1 text-sm font-medium">{formatCurrency(record.phi_cong_ty_thu?.toString() || '0')}</td>                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MomoHoaDonTable; 