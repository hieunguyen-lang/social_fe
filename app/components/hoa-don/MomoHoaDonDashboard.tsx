"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Download, RefreshCw, Users, DollarSign } from 'lucide-react';
import MomoHoaDonFilter from './MomoHoaDonFilter';
import MomoHoaDonTable from './MomoHoaDonTable';
import StatsCard from './StatsCard';
import { format } from 'date-fns';
import { th, vi } from 'date-fns/locale';
import { 
  getMomoHoaDonList, 
  getMomoHoaDonStats,
  MomoHoaDonResponse,
  MomoHoaDonStatsResponse,
  MomoRecord
} from '../../api/hoaDonApi';
import { exportMomoHoaDonExcel, createMomoHoaDon, updateMomoHoaDon, deleteMomoHoaDon, batchUpdateMomoHoaDon } from '../../api/momoHoaDonApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRef } from 'react';

// Helper to format date as YYYY-MM-DD in local time
function formatDateLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper chuyển đổi ISO datetime về MySQL DATETIME string (giờ VN)
function toMySQLDatetime(dtStr: string): string {
  if (!dtStr) return '';
  try {
    let d = new Date(dtStr);
    // Chuyển sang giờ VN nếu cần
    d = new Date(d.getTime() + 7 * 60 * 60 * 1000);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  } catch {
    return dtStr;
  }
}

function MomoHoaDonFormModal({ open, onClose, onSubmit, initialData }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: Partial<MomoRecord>) => void;
  initialData?: Partial<MomoRecord> | null;
}) {
  const [form, setForm] = useState<Partial<MomoRecord>>({
    ...initialData,
    so_tien: initialData && initialData.so_tien !== undefined && initialData.so_tien !== null ? initialData.so_tien.toString() : '',
    phi_cong_ty_thu: initialData?.phi_cong_ty_thu !== undefined && initialData?.phi_cong_ty_thu !== null ? initialData.phi_cong_ty_thu.toString() : '',
    nha_cung_cap: initialData?.nha_cung_cap || '',
    ten_khach_hang: initialData?.ten_khach_hang || '',
    ma_khach_hang: initialData?.ma_khach_hang || '',
    dia_chi: initialData?.dia_chi || '',
    ky_thanh_toan: initialData?.ky_thanh_toan || '',
    ma_giao_dich: initialData?.ma_giao_dich || '',
    thoi_gian: initialData?.thoi_gian || '',
    tai_khoan_the: initialData?.tai_khoan_the || '',
    trang_thai: initialData?.trang_thai || '',
    nguoi_gui: initialData?.nguoi_gui || '',
    update_at: initialData?.update_at || '',
    ten_zalo: initialData?.ten_zalo || ''
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleDateChange = (name: string, date: Date | null) => setForm({ ...form, [name]: date ? date.toISOString() : '' });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const submitData: any = { ...form };
    if (submitData.so_tien !== undefined && submitData.so_tien !== null && submitData.so_tien !== '') {
      submitData.so_tien = parseInt(submitData.so_tien as string, 10);
    } else {
      delete submitData.so_tien;
    }
    if (submitData.phi_cong_ty_thu !== undefined && submitData.phi_cong_ty_thu !== null && submitData.phi_cong_ty_thu !== '') {
      submitData.phi_cong_ty_thu = parseInt(submitData.phi_cong_ty_thu as string, 10);
    } else {
      delete submitData.phi_cong_ty_thu;
    }
    delete submitData.update_at;
    try {
      await onSubmit(submitData);
    } catch (err: any) {
      if (err?.detail && Array.isArray(err.detail)) {
        setErrorMsg(err.detail.map((d: any) => d.msg).join(', '));
      } else if (err?.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Có lỗi xảy ra!');
      }
    }
  };

  // Thêm useEffect để cập nhật form khi initialData thay đổi
  React.useEffect(() => {
    setForm({
      ...initialData,
      so_tien: initialData && initialData.so_tien !== undefined && initialData.so_tien !== null ? initialData.so_tien.toString() : '',
      phi_cong_ty_thu: initialData?.phi_cong_ty_thu !== undefined && initialData?.phi_cong_ty_thu !== null ? initialData.phi_cong_ty_thu.toString() : '',
      nha_cung_cap: initialData?.nha_cung_cap || '',
      ten_khach_hang: initialData?.ten_khach_hang || '',
      ma_khach_hang: initialData?.ma_khach_hang || '',
      dia_chi: initialData?.dia_chi || '',
      ky_thanh_toan: initialData?.ky_thanh_toan || '',
      ma_giao_dich: initialData?.ma_giao_dich || '',
      thoi_gian: initialData?.thoi_gian || '',
      tai_khoan_the: initialData?.tai_khoan_the || '',
      trang_thai: initialData?.trang_thai || '',
      nguoi_gui: initialData?.nguoi_gui || '',
      update_at: initialData?.update_at || '',
      ten_zalo: initialData?.ten_zalo || ''
    });
  }, [initialData]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-lg font-bold mb-4">{initialData ? 'Sửa' : 'Tạo mới'} hóa đơn MoMo</h2>
        <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto">
          {errorMsg && (
            <div className="text-red-600 mb-2">{errorMsg}</div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Tên khách hàng</label>
            <input name="ten_khach_hang" value={form.ten_khach_hang} onChange={handleChange} placeholder="Tên khách hàng" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mã khách hàng</label>
            <input name="ma_khach_hang" value={form.ma_khach_hang} onChange={handleChange} placeholder="Mã khách hàng" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nhà cung cấp</label>
            <input name="nha_cung_cap" value={form.nha_cung_cap} onChange={handleChange} placeholder="Nhà cung cấp" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input name="dia_chi" value={form.dia_chi} onChange={handleChange} placeholder="Địa chỉ" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kỳ thanh toán</label>
            <input name="ky_thanh_toan" value={form.ky_thanh_toan} onChange={handleChange} placeholder="Kỳ thanh toán" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số tiền</label>
            <input name="so_tien" value={form.so_tien} onChange={handleChange} placeholder="Số tiền" className="w-full border rounded px-3 py-2" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mã giao dịch</label>
            <input name="ma_giao_dich" value={form.ma_giao_dich} onChange={handleChange} placeholder="Mã giao dịch" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thời gian</label>
            <DatePicker
              selected={form.thoi_gian ? new Date(form.thoi_gian) : null}
              onChange={date => handleDateChange('thoi_gian', date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm:ss"
              className="w-full border rounded px-3 py-2"
              placeholderText="Chọn thời gian"
              isClearable
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tài khoản thẻ</label>
            <input name="tai_khoan_the" value={form.tai_khoan_the} onChange={handleChange} placeholder="Tài khoản thẻ" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <input name="trang_thai" value={form.trang_thai} onChange={handleChange} placeholder="Trạng thái" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Người gửi</label>
            <input name="nguoi_gui" value={form.nguoi_gui} onChange={handleChange} placeholder="Người gửi" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Update At</label>
            <input name="update_at" value={form.update_at} onChange={handleChange} placeholder="Update At" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên Zalo</label>
            <input name="ten_zalo" value={form.ten_zalo} onChange={handleChange} placeholder="Tên Zalo" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phí công ty thu</label>
            <input name="phi_cong_ty_thu" value={form.phi_cong_ty_thu || ''} onChange={handleChange} placeholder="Phí công ty thu" className="w-full border rounded px-3 py-2" type="number" />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
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
function EditBatchModal({ open, onClose, batchRecords, onSave }: {
  open: boolean;
  onClose: () => void;
  batchRecords: MomoRecord[];
  onSave: (updatedRecords: MomoRecord[]) => void;
}) {
  const [fieldsChung, setFieldsChung] = React.useState({
    ck_ra: '',
    ck_vao: '',
    so_tk: '',
    note: '',
    ten_zalo: '',
    is_send_or_recieve: '',
    batch_id: '',
    thoi_gian: '', // thêm trường thời gian dùng chung
  });
  const [records, setRecords] = React.useState<MomoRecord[]>(batchRecords);
  
  // Khi batchRecords thay đổi (mở modal mới), reset state
  React.useEffect(() => {
    setRecords(batchRecords);
    if (batchRecords.length > 0) {
      // Chuyển đổi giá trị is_send_or_recieve về 'True'/'False' nếu là 'true'/'false'
      let is_send_or_recieve = batchRecords[0].is_send_or_recieve || '';
      if (is_send_or_recieve === 'true') is_send_or_recieve = 'True';
      if (is_send_or_recieve === 'false') is_send_or_recieve = 'False';
      // Kiểm tra nếu tất cả hóa đơn có cùng thoi_gian thì set, nếu khác nhau thì để rỗng
      let thoi_gian = batchRecords[0].thoi_gian || '';
      if (!batchRecords.every(r => r.thoi_gian === thoi_gian)) thoi_gian = '';
      setFieldsChung({
        ck_ra: batchRecords[0].ck_ra || '',
        ck_vao: batchRecords[0].ck_vao || '',
        so_tk: batchRecords[0].so_tk || '',
        note: batchRecords[0].note || '',
        ten_zalo: batchRecords[0].ten_zalo || '',
        is_send_or_recieve: batchRecords[0].is_send_or_recieve || '',
        batch_id: batchRecords[0].batch_id || '',
        thoi_gian, // luôn có trường thoi_gian
      });
    }
  }, [batchRecords]);

  // Xử lý thay đổi trường dùng chung
  const handleChungChange = (field: string, value: string) => {
    setFieldsChung(prev => ({ ...prev, [field]: value }));
  };

  // Xử lý thay đổi trường riêng từng hóa đơn
  const handleRecordChange = (idx: number, field: string, value: string) => {
    setRecords(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  // Lưu tất cả
  const [validationErrors, setValidationErrors] = React.useState<(string | {index: number, error: string})[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    // Gán trường chung cho từng hóa đơn
    // CK ra = tổng số tiền - tổng phí dịch vụ
    const ck_ra_value = records.reduce((sum, r) => sum + (Number(r.so_tien) || 0), 0) - records.reduce((sum, r) => sum + (Number(r.phi_cong_ty_thu) || 0), 0);
    const updated = records.map(r => ({ ...r, ...fieldsChung, ck_ra: ck_ra_value.toString() }));
    // Validate tất cả record mới trước khi gọi API
    const errors: string[] = [];
    updated.forEach((r, idx) => {
      if (r.id === -1) {
        if (!r.ten_khach_hang) errors.push(`Dòng ${idx + 1}: Thiếu Tên KH`);
        if (!r.ma_khach_hang) errors.push(`Dòng ${idx + 1}: Thiếu Mã KH`);
        if (!r.dia_chi) errors.push(`Dòng ${idx + 1}: Thiếu Địa chỉ`);
        if (!r.thoi_gian) errors.push(`Dòng ${idx + 1}: Thiếu Thời gian`);
        if (!r.ma_giao_dich) errors.push(`Dòng ${idx + 1}: Thiếu Mã giao dịch`);
        if (!r.batch_id) errors.push(`Dòng ${idx + 1}: Thiếu Batch ID`);
        if (!r.so_tien || isNaN(Number(r.so_tien))) errors.push(`Dòng ${idx + 1}: Số tiền phải là số và không được để trống`);
      }
      // Validate ck_vao và ck_ra
      if (r.ck_vao !== undefined && r.ck_vao !== null && r.ck_vao !== '') {
        if (isNaN(Number(r.ck_vao)) || !Number.isInteger(Number(r.ck_vao)) || Number(r.ck_vao) < 0) {
          errors.push(`Dòng ${idx + 1}: CK vào phải là số nguyên không âm hoặc để trống`);
        }
      }
      if (r.ck_ra !== undefined && r.ck_ra !== null && r.ck_ra !== '') {
        if (isNaN(Number(r.ck_ra)) || !Number.isInteger(Number(r.ck_ra)) || Number(r.ck_ra) < 0) {
          errors.push(`Dòng ${idx + 1}: CK ra phải là số nguyên không âm hoặc để trống`);
        }
      }
    });
    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsSaving(false);
      return;
    } else {
      setValidationErrors([]);
    }
    // Gọi API batch
    try {
      await batchUpdateMomoHoaDon(updated.map(r => {
        // Nếu id === -1 thì bỏ id để backend nhận biết là tạo mới
        const { id, ...rest } = r;
        // Chuyển đổi thoi_gian về dạng MySQL DATETIME nếu có
        const thoi_gian = rest.thoi_gian ? toMySQLDatetime(rest.thoi_gian) : undefined;
        // Nếu created_at là '' thì bỏ đi
        const created_at = rest.created_at && rest.created_at !== '' ? rest.created_at : undefined;
        // Nếu update_at là '' thì bỏ đi
        const update_at = rest.update_at && rest.update_at !== '' ? rest.update_at : undefined;
        return r.id === -1
          ? { ...rest, thoi_gian, created_at, update_at }
          : { ...r, thoi_gian, created_at, update_at };
      }));
      onSave(updated);
    } catch (err: any) {
      // Nếu backend trả về mảng lỗi dạng object, set luôn
      if (err && err.message) {
        // Nếu message chứa chuỗi lỗi batch, tách lấy JSON phía sau
        const batchPrefix = 'Batch update/create hóa đơn MoMo thất bại:';
        let jsonStr = '';
        if ((err as any).message && (err as any).message.startsWith(batchPrefix)) {
          jsonStr = (err as any).message.slice(batchPrefix.length).trim();
        } else if ((err as any).message && (err as any).message.trim().startsWith('[')) {
          // Nếu message là mảng JSON luôn
          jsonStr = (err as any).message.trim();
        }
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr);
            if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === 'object' && 'index' in parsed[0] && 'error' in parsed[0]) {
              setValidationErrors(parsed);
              return;
            }
          } catch {}
        }
        // Nếu không parse được, thử parse như cũ
        try {
          const parsed = JSON.parse((err as any).message);
          if (Array.isArray(parsed) && parsed[0] && typeof parsed[0] === 'object' && 'index' in parsed[0] && 'error' in parsed[0]) {
            setValidationErrors(parsed);
            return;
          }
        } catch {}
      }
      // Nếu không parse được JSON, hiển thị lỗi chung
      setValidationErrors([(err as any).message || 'Có lỗi xảy ra khi lưu batch!']);
      return; // Đảm bảo return để không tiếp tục thực thi
    } finally {
      setIsSaving(false);
    }
  };

  // Xử lý xóa hóa đơn trong batch
  const handleDeleteRecord = async (idx: number) => {
    const record = records[idx];
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      if (record.id && record.id !== -1) {
        try {
          await deleteMomoHoaDon(record.id);
        } catch (err: any) {
          alert(err.message || 'Xóa hóa đơn thất bại!');
          return;
        }
      }
      // Xóa khỏi state
      setRecords(prev => prev.filter((_, i) => i !== idx));
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {fieldsChung.batch_id && (
              <span >Batch ID: {fieldsChung.batch_id}</span>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Đóng</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Tên Zalo</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.ten_zalo} onChange={e => handleChungChange('ten_zalo', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CK ra</label>
            <input
              className="w-full border rounded px-2 py-1 bg-gray-100 font-semibold"
              value={(records.reduce((sum, r) => sum + (Number(r.so_tien) || 0), 0) - records.reduce((sum, r) => sum + (Number(r.phi_cong_ty_thu) || 0), 0)).toLocaleString()}
              disabled
              readOnly
              tabIndex={-1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CK vào</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={fieldsChung.ck_vao}
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                handleChungChange('ck_vao', val);
              }}
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">STK</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.so_tk} onChange={e => handleChungChange('so_tk', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Note</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.note} onChange={e => handleChungChange('note', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái chuyển khoản</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={fieldsChung.is_send_or_recieve}
              onChange={e => handleChungChange('is_send_or_recieve', e.target.value)}
            >
              <option value="">Chọn trạng thái</option>
              <option className="text-green-700" value="True">True</option>
              <option className="text-red-700" value="False">False</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Thời gian</label>
            <DatePicker
              selected={fieldsChung.thoi_gian ? new Date(fieldsChung.thoi_gian) : null}
              onChange={date => handleChungChange('thoi_gian', date ? date.toISOString() : '')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm:ss"
              className="w-full border rounded px-2 py-1"
              placeholderText="Chọn thời gian"
              isClearable
            />
          </div>
        </div>
        {/* Hiển thị lỗi validate đẹp */}
        {validationErrors.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-300 rounded p-3">
            <div className="text-red-700 font-semibold mb-1">Lỗi nhập liệu:</div>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((err, i) => {
                if (typeof err === 'object' && err !== null && 'index' in err && 'error' in err) {
                  return (
                    <li key={i} className="text-red-600 text-sm">
                      {`Hóa đơn số ${Number(err.index) + 1}: ${err.error}`}
                    </li>
                  );
                }
                return (
                  <li key={i} className="text-red-600 text-sm">
                    {err && err.trim() !== '' ? err : 'Có lỗi không xác định xảy ra!'}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Tên KH</th>
                <th className="px-2 py-1 border">Mã KH</th>
                <th className="px-2 py-1 border">Địa chỉ</th>
                <th className="px-2 py-1 border">Kỳ TT</th>
                <th className="px-2 py-1 border">Mã GD</th>
                {/* <th className="px-2 py-1 border">Thời gian</th> */}
                <th className="px-2 py-1 border">Tài khoản thẻ</th>
                <th className="px-2 py-1 border">Số tiền</th>
                <th className="px-2 py-1 border">Phí DV (10% số tiền)</th>
                <th className="px-2 py-1 border">Người gửi</th>
                <th className="px-2 py-1 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr key={r.id || idx}>
                  <td className="border px-2 py-1"><input className="w-full" value={r.ten_khach_hang || ''} onChange={e => handleRecordChange(idx, 'ten_khach_hang', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.ma_khach_hang || ''} onChange={e => handleRecordChange(idx, 'ma_khach_hang', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.dia_chi || ''} onChange={e => handleRecordChange(idx, 'dia_chi', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.ky_thanh_toan || ''} onChange={e => handleRecordChange(idx, 'ky_thanh_toan', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.ma_giao_dich || ''} onChange={e => handleRecordChange(idx, 'ma_giao_dich', e.target.value)} /></td>
                  {/* <td className="border px-2 py-1">
                    <DatePicker
                      selected={r.thoi_gian ? new Date(r.thoi_gian) : null}
                      onChange={date => handleRecordChange(idx, 'thoi_gian', date ? date.toISOString() : '')}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="yyyy-MM-dd HH:mm:ss"
                      className="w-full border rounded px-2 py-1"
                      placeholderText="Chọn thời gian"
                      isClearable
                    />
                  </td> */}
                  <td className="border px-2 py-1"><input className="w-full" value={r.tai_khoan_the || ''} onChange={e => handleRecordChange(idx, 'tai_khoan_the', e.target.value)} /></td>
                  <td className="border px-2 py-1">
                    <input
                      className="w-full text-green-700"
                      value={r.so_tien || ''}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        handleRecordChange(idx, 'so_tien', val);
                        const fee = val ? Math.floor(Number(val) * 0.1).toString() : '';
                        handleRecordChange(idx, 'phi_cong_ty_thu', fee);
                      }}
                      type="number"
                      min="0"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </td>
                  {/* Phí DV (10% số tiền) - tự động, không cho sửa */}
                  <td className="border px-2 py-1">
                    <input
                      className="w-full text-red-700"
                      value={r.phi_cong_ty_thu || ''}
                      disabled
                      type="number"
                    />
                  </td>
                  {/* Bỏ CK ra, CK vào ở đây */}
                  <td className="border px-2 py-1"><input className="w-full" value={r.nguoi_gui || ''} onChange={e => handleRecordChange(idx, 'nguoi_gui', e.target.value)} /></td>
                  <td className="border px-2 py-1">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                      onClick={() => handleDeleteRecord(idx)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Tổng số tiền và tổng phí DV */}
        <div className="flex gap-8 justify-end mt-4 text-base font-semibold">
          <div>
            Tổng số tiền: {records.reduce((sum, r) => sum + (Number(r.so_tien) || 0), 0).toLocaleString()}
          </div>
          <div>
            Tổng phí DV: {records.reduce((sum, r) => sum + (Number(r.phi_cong_ty_thu) || 0), 0).toLocaleString()}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">Hủy</button>
          <button type="button" onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60">{isSaving ? 'Đang lưu...' : 'Lưu tất cả'}</button>
        </div>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="button"
          onClick={() => {
            setRecords(prev => [
              ...prev,
              {
                id: -1, // id tạm cho hóa đơn mới, sẽ nhận id thật sau khi tạo
                ten_khach_hang: '',
                ma_khach_hang: '',
                dia_chi: '',
                ky_thanh_toan: '',
                so_tien: '',
                ma_giao_dich: '',
                thoi_gian: '',
                tai_khoan_the: '',
                trang_thai: '',
                nguoi_gui: '',
                batch_id: fieldsChung.batch_id,
                update_at: '',
                ten_zalo: '',
                phi_cong_ty_thu: '',
                ck_vao: '',
                ck_ra: '',
                ma_chuyen_khoan: '',
                so_tk: '',
                is_send_or_recieve: '',
                note: '',
                nha_cung_cap: '',
                created_at: '',
              }
            ]);
          }}
        >
          Tạo hóa đơn mới
        </button>
      </div>
    </div>
  );
}

const MomoHoaDonDashboard: React.FC = () => {
  const [data, setData] = useState<MomoHoaDonResponse>({ total: 0, data: [] });
  const [stats, setStats] = useState({ totalRecords: 0, totalAmount: 0, total_fee: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<any>({});
  const itemsPerPage = 20;
  const [editingRecord, setEditingRecord] = useState<Partial<MomoRecord> | null>(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Thêm logic mở modal sửa batch và lưu hàng loạt
  const [editBatchOpen, setEditBatchOpen] = React.useState(false);
  const [editBatchRecords, setEditBatchRecords] = React.useState<MomoRecord[]>([]);

  // Hàm mở modal sửa batch (gọi từ nút Sửa batch)
  const handleEditBatch = (records: MomoRecord[]) => {
    setEditBatchRecords(records);
    setEditBatchOpen(true);
  };

  // Hàm lưu hàng loạt
  const handleSaveBatch = async (updatedRecords: MomoRecord[]) => {
    // Không gọi API ở đây nữa vì đã được gọi trong EditBatchModal.handleSave
    setEditBatchOpen(false);
    // Reload lại dữ liệu
    loadStats();
    fetchData();
  };

  // Tạo query string từ filters
  const buildQueryString = useCallback((filterParams: any, page: number) => {
    const params = new URLSearchParams();
    
    // Thêm pagination
    params.append('page', page.toString());
    params.append('page_size', itemsPerPage.toString());
    
    if (filterParams.fromDate) {
      params.append('from_date', formatDateLocal(filterParams.fromDate));
    }
    if (filterParams.toDate) {
      params.append('to_date', formatDateLocal(filterParams.toDate));
    }
    if (filterParams.maGiaoDich) {
      params.append('ma_giao_dich', filterParams.maGiaoDich);
    }
    if (filterParams.tenZalo) {
      params.append('ten_zalo', filterParams.tenZalo);
    }
    if (filterParams.nguoiGui) {
      params.append('nguoi_gui', filterParams.nguoiGui);
    }
    if (filterParams.maKhachHang) {
      params.append('ma_khach_hang', filterParams.maKhachHang);
    }
    
    return params.toString();
  }, []);

  // Load stats
  const loadStats = useCallback(async (filterParams: any = filters) => {
    try {
      const params = new URLSearchParams();
      
      
      if (filterParams.fromDate) {
        params.append('from_date', formatDateLocal(filterParams.fromDate));
      }
      if (filterParams.toDate) {
        params.append('to_date', formatDateLocal(filterParams.toDate));
      }
      if (filterParams.maGiaoDich) {
        params.append('ma_giao_dich', filterParams.maGiaoDich);
      }
      if (filterParams.tenZalo) {
        params.append('ten_zalo', filterParams.tenZalo);
      }
      if (filterParams.nguoiGui) {
        params.append('nguoi_gui', filterParams.nguoiGui);
      }
      if (filterParams.maKhachHang) {
        params.append('ma_khach_hang', filterParams.maKhachHang);
      }
      
      const data: MomoHoaDonStatsResponse = await getMomoHoaDonStats(params.toString());
      setStats({
        totalRecords: data.total,
        totalAmount: data.totalAmount,
        total_fee: data.total_fee || 0
      });
    } catch (error) {
      console.error('Không thể tải thống kê:', error);
    }
  }, [filters]);

  // Fetch data
  const fetchData = useCallback(async (filterParams: any = filters, page: number = currentPage) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryString = buildQueryString(filterParams, page);
      const response = await getMomoHoaDonList(queryString);
      setData(response);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString, filters, currentPage]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset về trang đầu khi filter thay đổi
    loadStats(newFilters);
    fetchData(newFilters, 1);
  }, [loadStats, fetchData]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchData(filters, page);
  }, [fetchData, filters]);

  // Export Excel
  const handleExportExcel = async () => {
    try {
      const queryString = buildQueryString(filters, currentPage);
      const blob = await exportMomoHoaDonExcel(queryString);
      
      // Tạo download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `momo-hoadon-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error exporting Excel:', err);
      alert('Có lỗi xảy ra khi xuất Excel');
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchData();
  };

  const handleEdit = (record: any) => setEditingRecord(record);
  const handleDelete = async (record: Partial<MomoRecord>) => {
    if (!record.id) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      await deleteMomoHoaDon(record.id);
      loadStats();
      fetchData();
    }
  };
  const handleCreate = () => setShowCreateModal(true);

  // Load data on mount
  useEffect(() => {
    loadStats();
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi các giao dịch hóa đơn qua MoMo
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>
      {/* Stats Cards */}
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
        />
        <StatsCard
          title="Phí công ty thu"
          value={stats.total_fee}
          icon={<DollarSign className="w-5 h-5" />}
          color="border-orange-500"
          isCurrency={true}
        />
      </div>
      {/* Filter */}
      <MomoHoaDonFilter
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Có lỗi xảy ra
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <MomoHoaDonTable
        data={data}
        loading={loading}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onEditBatch={handleEditBatch}
        onDelete={handleDelete}
      />

      {/* Empty state */}
      {!loading && data.total === 0 && !error && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có dữ liệu</h3>
          <p className="mt-1 text-sm text-gray-500">
            Không tìm thấy hóa đơn nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      )}

      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Tạo hóa đơn mới
      </button>

      <MomoHoaDonFormModal
        open={showCreateModal || !!editingRecord}
        onClose={() => { setShowCreateModal(false); setEditingRecord(null); }}
        onSubmit={async (form: Partial<MomoRecord>) => {
          if (editingRecord && editingRecord.id) {
            await updateMomoHoaDon(editingRecord.id, form);
            setEditingRecord(null);
          } else {
            // Nếu đang ở batch, truyền batch_id vào form
            let batchId = null;
            if (editBatchRecords && editBatchRecords.length > 0) {
              batchId = editBatchRecords[0].batch_id;
            }
            await createMomoHoaDon({ ...form, batch_id: batchId || form.batch_id });
            setShowCreateModal(false);
          }
          loadStats();
          fetchData();
        }}
        initialData={editingRecord}
      />
      <EditBatchModal open={editBatchOpen} onClose={() => setEditBatchOpen(false)} batchRecords={editBatchRecords} onSave={handleSaveBatch} />
    </div>
  );
};

export default MomoHoaDonDashboard; 