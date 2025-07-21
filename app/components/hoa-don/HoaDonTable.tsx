import React, { useState } from 'react';
import { HoaDon, HoaDonGroup } from '../../types/index';
import { formatCurrency } from '../../utils/groupRecords';
import { updateHoaDon, deleteHoaDon, deleteHoaDonBatch } from '../../api/hoaDonApi';
import { Star, X } from 'lucide-react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';
import HoaDonBatchEditModal from './HoaDonBatchEditModal';
import { batchUpdateHoaDon } from '../../api/hoaDonApi';
interface HoaDonTableProps {
  hoaDonGroups: HoaDonGroup[];
  onReload: () => void;
  fields: { key: keyof HoaDon; label: string; type?: string }[];
  visibleFields: (keyof HoaDon)[];
}

const PAGE_SIZE_OPTIONS = [2, 5, 10, 20]; // Số batch/trang

const HoaDonTable: React.FC<HoaDonTableProps> = ({ hoaDonGroups, onReload, fields, visibleFields }) => {
  // Modal edit state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<HoaDon>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailBatch, setDetailBatch] = useState<HoaDonGroup | null>(null);
  const [editBatchOpen, setEditBatchOpen] = useState(false);
  const [editBatchRecords, setEditBatchRecords] = useState<HoaDon[]>([]);
  const [isBatchSaving, setIsBatchSaving] = useState(false);

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

  // Handle edit
  const handleEdit = (hoaDon: HoaDon) => {
    setEditId(hoaDon.id);
    setEditData({ ...hoaDon });
    setEditModalOpen(true);
  };

  const handleCancel = () => {
    setEditModalOpen(false);
    setEditId(null);
    setEditData({});
  };

  const handleChange = (field: keyof HoaDon, value: string | boolean) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editId) return;
    setLoading(true);
    try {
      await updateHoaDon(editId, editData);
      setEditModalOpen(false);
      setEditId(null);
      setEditData({});
      onReload();
      alert('Cập nhật thành công!');
    } catch (e) {
      alert('Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) return;
    try {
      await deleteHoaDon(id);
      onReload();
      alert('Đã xóa thành công!');
    } catch (e) {
      alert('Xóa thất bại!');
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ hóa đơn trong batch này?')) return;
    setLoading(true);
    try {
      await deleteHoaDonBatch(batchId);
      onReload();
      alert('Đã xóa batch thành công!');
    } catch (e) {
      alert('Xóa batch thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = (batch: HoaDonGroup) => {
    setDetailBatch(batch);
    setShowDetailModal(true);
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
  function formatDateTime(datetimeStr: string) {
    if (!datetimeStr) return '';
    const date = new Date(datetimeStr);
    // Cộng thêm 7 tiếng (7 * 60 * 60 * 1000 ms)
    const vietnamDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return format(vietnamDate, 'dd/MM/yyyy HH:mm');
  }
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="text-sm text-gray-600">
          Tổng số batch: <b>{hoaDonGroups.length}</b> | Tổng số hóa đơn: <b>{hoaDonGroups.reduce((sum: number, g: HoaDonGroup) => sum + g.records.length, 0)}</b>
        </div>
        
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" >
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >Batch ID</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >Tổng hóa đơn</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >Tổng kết toán</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >Khách</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >SĐT</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >Người gửi</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >Tổng phí</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >Chuyển khoản vào</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >Chuyển khoản ra</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-900 uppercase tracking-wider" >Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-xs">
            {hoaDonGroups.map((group: HoaDonGroup, batchIdx: number) => {
              const hoaDonList = group.records;
              const batchId = group.batch_id;
              const batchTotal = hoaDonList.reduce((sum: number, h: HoaDon) => sum + parseInt(h.tong_so_tien), 0);
              const batchTotalFee = hoaDonList.reduce((sum: number, h: HoaDon) => sum + parseInt(h.phi_per_bill ?? '0'), 0);
              // Lấy thông tin tổng hợp của batch
              const uniqueCustomers = new Set(hoaDonList.map(h => h.ten_khach).filter(Boolean));
              const uniquePhones = new Set(hoaDonList.map(h => h.so_dien_thoai).filter(Boolean));
              const uniqueSenders = new Set(hoaDonList.map(h => h.nguoi_gui).filter(Boolean));
              const uniqueCkRa = new Set(hoaDonList.map(h => h.ck_ra).filter(Boolean));
              const uniqueCkVao = new Set(hoaDonList.map(h => h.ck_vao).filter(Boolean));
              const firstCkVao = Array.from(uniqueCkVao)[0] ?? '';
              const firstCkRa = Array.from(uniqueCkRa)[0] ?? '';
              const isExpanded = expandedBatches.has(batchId);
              
              return (
                <React.Fragment key={batchId}>
                  <tr className="bg-blue-50 border-b border-blue-200 hover:bg-blue-100 transition-colors">
                    <td className="px-2 py-2 font-semibold text-blue-800 text-left">
                      <button
                        onClick={() => toggleBatch(batchId)}
                        className="mr-2 text-blue-400 hover:text-blue-700 align-middle"
                        aria-label={isExpanded ? 'Thu gọn batch' : 'Mở rộng batch'}
                        style={{ verticalAlign: 'middle' }}
                      >
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                      <span className="text-sm font-bold text-blue-900" title={batchId}>
                        {batchId ? batchId.slice(0, 8) : ''}...
                      </span>
                    </td>
                    <td className="px-2 py-2 text-blue-700 text-center">{hoaDonList.length}</td>
                    <td className="px-2 py-2 text-blue-700 text-center">{formatCurrency(batchTotal)}</td>
                    <td className="px-2 py-2 text-blue-700 text-center flex items-center justify-center gap-1">
                      {Array.from(uniqueCustomers).join(', ')}
                      {hoaDonList.some(h => h.khach_moi) && (
                        <span className="flex items-center ml-1">
                          <Star className="w-4 h-4 text-emerald-500 inline" />
                          <span className="text-emerald-600 ml-1 text-xs">Khách mới</span>
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-blue-700 text-center">{Array.from(uniquePhones).join(', ')}</td>
                    <td className="px-2 py-2 text-blue-700 text-center">{Array.from(uniqueSenders).join(', ')}</td>
                    <td className="px-2 py-2 text-green-700 text-center">{formatCurrency(batchTotalFee)}</td>
                    <td className="px-2 py-2 text-green-700 text-center">
                      {firstCkVao ? formatCurrency(Number(firstCkVao)) : ''}
                    </td>
                    <td className="px-2 py-2 text-red-700 text-center">
                      {firstCkRa ? formatCurrency(Number(firstCkRa)) : ''}
                    </td>
                    <td className="px-2 py-1 text-center whitespace-nowrap text-xs">
                      
                      <button
                        className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                        onClick={() => handleShowDetail(group)}
                        disabled={loading}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
                        onClick={() => { setEditBatchRecords(hoaDonList); setEditBatchOpen(true); }}
                        disabled={loading}
                      >
                        Sửa batch
                      </button>
                      <button
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                        onClick={() => handleDeleteBatch(batchId)}
                        disabled={loading}
                      >
                        Xóa batch
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-gray-100">
                      <td colSpan={10} className="p-0">
                        {/* Bọc bảng chi tiết trong overflow-x-auto riêng */}
                        <div className="overflow-x-auto">
                          <table className="min-w-[1200px] w-full table-fixed">
                            <colgroup>
                              {fields.filter(f => visibleFields.includes(f.key)).map((f, idx, arr) => (
                                <col key={f.key} style={{ width: `${100 / (arr.length + 1)}%` }} />
                              ))}
                              <col style={{ width: `${100 / (fields.filter(f => visibleFields.includes(f.key)).length + 1)}%` }} />
                            </colgroup>
                            <thead>
                              <tr>
                                {fields.filter(f => visibleFields.includes(f.key)).map(f => (
                                  <th key={f.key} className="px-2 py-2 text-xs font-semibold text-gray-600 border-r last:border-r-0 bg-gray-100">{f.label}</th>
                                ))}
                                
                              </tr>
                            </thead>
                            <tbody>
                              {hoaDonList.map((hoaDon: HoaDon, idx: number) => (
                                <tr key={hoaDon.id} className="bg-white hover:bg-blue-50 border-b border-gray-100 transition-colors">
                                  {fields.filter(f => visibleFields.includes(f.key)).map(f => (
                                    <td key={f.key} className="px-2 py-2 border-r last:border-r-0 truncate">
                                      {f.key === 'so_the' ? (
                                        hoaDon[f.key]
                                          ? '**** ' + hoaDon[f.key].slice(-4)
                                          : ''
                                      ) : f.key === 'tong_so_tien'  || f.key === 'ck_ra' || f.key === 'ck_vao' || f.key === 'phi_per_bill' ? (
                                        <span className={f.key === 'tong_so_tien' ? 'text-green-700 font-semibold' : f.key === 'phi_per_bill' ? 'text-red-600' : ''}>
                                          {hoaDon[f.key] ? formatCurrency(Number(hoaDon[f.key])) : ''}
                                        </span>
                                      ) : f.key === 'phan_tram_phi' ? (
                                        (() => {
                                          const val = hoaDon[f.key];
                                          if (typeof val === 'string' && val === '0') return '0%';
                                          if (typeof val === 'number' && val === 0) return '0%';
                                          if (val) {
                                            const percent = Number(val) * 100;
                                            return percent % 1 === 0 ? percent.toFixed(0) + '%' : percent.toFixed(1) + '%';
                                          }
                                          return '';
                                        })()
                                      ) : f.key === 'tinh_trang' ? (
                                        <div className="flex items-center justify-center">
                                          <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                            checked={hoaDon[f.key] === 'true'}
                                            disabled
                                          />
                                        </div>
                                      ) : f.key === 'ten_khach' ? (
                                        <span>
                                          {hoaDon[f.key] ?? ''}
                                        </span>
                                      ) : f.key === 'lich_canh_bao_datetime' ? (
                                        formatDateTime(hoaDon[f.key] ?? '')
                                      ) : f.key === 'created_at' ? (
                                        formatDateTime(hoaDon[f.key] ?? '')
                                      ) : (
                                        hoaDon[f.key] ?? ''
                                      )}
                                    </td>
                                  ))}
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

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sửa Hóa Đơn</h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
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
                        checked={editData[f.key] === 'true'}
                        onChange={e => handleChange(f.key, e.target.checked.toString())}
                        disabled={loading}
                      />
                      <span className="ml-2 text-sm text-gray-600">Đã xử lý</span>
                    </div>
                  ) : f.key === 'tong_so_tien' || f.key === 'tien_phi' || f.key === 'ck_ra' || f.key === 'ck_vao' ? (
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editData[f.key] ?? ''}
                      onChange={e => handleChange(f.key, e.target.value)}
                      disabled={loading}
                      placeholder={`Nhập ${f.label.toLowerCase()}`}
                    />
                  ) : f.key === 'ngay_giao_dich' ? (
                    <DatePicker
                      selected={parseDate(editData[f.key] ?? '')}
                      onChange={date => date && handleChange(f.key, formatDate(date))}
                      dateFormat="dd/MM/yyyy"
                      locale={vi}
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : f.key === 'caption_goc' || f.key === 'ly_do' ? (
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={typeof editData[f.key] === 'boolean' || editData[f.key] == null ? '' : String(editData[f.key])}
                      onChange={e => handleChange(f.key, e.target.value)}
                      disabled={loading}
                      placeholder={`Nhập ${f.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={f.type || 'text'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={typeof editData[f.key] === 'boolean' || editData[f.key] == null ? '' : String(editData[f.key])}
                      onChange={e => handleChange(f.key, e.target.value)}
                      disabled={loading}
                      placeholder={`Nhập ${f.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && detailBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-[90vw] max-h-[90vh] overflow-y-auto shadow-2xl rounded-xl p-0 md:p-6 flex flex-col">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-2xl font-bold text-blue-700">Chi tiết batch {detailBatch.batch_id.slice(0,8)}...</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2 md:p-6">
              <div className="overflow-x-auto">
                <table className="w-full table-auto border border-gray-200 rounded-lg overflow-hidden text-xs md:text-sm">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-3 py-2 text-xs font-semibold text-gray-700">STT</th>
                      {fields.filter(f => visibleFields.includes(f.key)).map(f => (
                        <th key={f.key} className="px-3 py-2 text-xs font-semibold text-gray-700">{f.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {detailBatch.records.map((hoaDon, idx) => (
                      <tr key={hoaDon.id} className="border-b hover:bg-blue-50">
                        <td className="px-3 py-2 text-center text-gray-500">{idx + 1}</td>
                        {fields.filter(f => visibleFields.includes(f.key)).map(f => (
                          <td key={f.key} className="px-3 py-2 text-sm">
                            {f.key === 'so_the' ? (
                              hoaDon[f.key]
                                ? '**** ' + hoaDon[f.key].slice(-4)
                                : ''
                            ) : f.key === 'tong_so_tien'  || f.key === 'ck_ra' || f.key === 'ck_vao' || f.key === 'phi_per_bill' ? (
                              <span className={f.key === 'tong_so_tien' ? 'text-green-700 font-semibold' : f.key === 'phi_per_bill' ? 'text-red-600' : ''}>
                                {hoaDon[f.key] ? formatCurrency(Number(hoaDon[f.key])) : ''}
                              </span>
                            ) : f.key === 'phan_tram_phi' ? (
                              (() => {
                                const val = hoaDon[f.key];
                                if (typeof val === 'string' && val === '0') return '0%';
                                if (typeof val === 'number' && val === 0) return '0%';
                                if (val) {
                                  const percent = Number(val) * 100;
                                  return percent % 1 === 0 ? percent.toFixed(0) + '%' : percent.toFixed(1) + '%';
                                }
                                return '';
                              })()
                            ) : f.key === 'tinh_trang' ? (
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                                  checked={hoaDon[f.key] === 'true'}
                                  disabled
                                />
                              </div>
                            ) : f.key === 'ten_khach' ? (
                              <span>
                                {hoaDon[f.key] ?? ''}
                              </span>
                            ) : f.key === 'lich_canh_bao_datetime' ? (
                              formatDateTime(hoaDon[f.key] ?? '')
                            ) : f.key === 'created_at' ? (
                              formatDateTime(hoaDon[f.key] ?? '')
                            ) : (
                              hoaDon[f.key] ?? ''
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <HoaDonBatchEditModal
        open={editBatchOpen}
        onClose={() => setEditBatchOpen(false)}
        batchRecords={editBatchRecords}
        isSaving={isBatchSaving}
        onSave={async (updatedRecords) => {
          setIsBatchSaving(true);
          try {
            await batchUpdateHoaDon(updatedRecords);
            setEditBatchOpen(false);
            onReload();
          } catch (err: any) {
            // Nếu lỗi dạng mảng (batch), hiển thị trong modal
            if (err.message && err.message.includes('[')) {
              // Đã có xử lý trong modal
              throw err;
            } else {
              alert(err.message || 'Batch update hóa đơn thất bại!');
            }
          } finally {
            setIsBatchSaving(false);
          }
        }}
      />
    </div>
  );
};

export default HoaDonTable; 