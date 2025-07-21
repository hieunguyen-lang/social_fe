import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface HoaDon {
  id: number;
  ck_ra?: string;
  ck_vao?: string;
  stk_cty?: string;
  caption_goc?: string;
  tinh_trang?: string;
  lich_canh_bao_datetime?: string;
  created_at?: string;
  [key: string]: any;
}

interface Props {
  open: boolean;
  onClose: () => void;
  batchRecords: HoaDon[];
  onSave: (updatedRecords: HoaDon[]) => void;
  isSaving?: boolean;
}

const HoaDonBatchEditModal: React.FC<Props> = ({ open, onClose, batchRecords, onSave, isSaving }) => {
  const [fieldsChung, setFieldsChung] = React.useState({
    nguoi_gui: '',
    ten_khach: '',
    so_dien_thoai: '',
    type_dao_rut: '',
    key_redis:'',
    ck_ra: '0',
    ck_vao: '0',
    stk_cty: '',
    stk_khach: '',
    caption_goc: '',
    tinh_trang: '',
    lich_canh_bao_datetime: '',
    created_at: '',
    phan_tram_phi: 0
  });
  const [records, setRecords] = React.useState<HoaDon[]>(batchRecords);
  const [validationErrors, setValidationErrors] = React.useState<(string | {index: number, error: string})[]>([]);

  React.useEffect(() => {
    setRecords(batchRecords);
    if (batchRecords.length > 0) {
      // Nếu tất cả hóa đơn có cùng giá trị thì set, nếu khác nhau thì để rỗng
      const getCommon = (key: keyof typeof fieldsChung) => {
        const val = batchRecords[0][key] || '';
        return batchRecords.every(r => r[key] === val) ? val : '';
      };
      setFieldsChung({
        nguoi_gui: getCommon('nguoi_gui'),
        ten_khach: getCommon('ten_khach'),
        so_dien_thoai: getCommon('so_dien_thoai'),
        type_dao_rut: getCommon('type_dao_rut'),
        key_redis:getCommon('key_redis'),
        ck_ra: getCommon('ck_ra'),
        ck_vao: getCommon('ck_vao'),
        stk_cty: getCommon('stk_cty'),
        stk_khach: getCommon('stk_khach'),
        caption_goc: getCommon('caption_goc'),
        tinh_trang: getCommon('tinh_trang'),
        lich_canh_bao_datetime: getCommon('lich_canh_bao_datetime'),
        created_at: getCommon('created_at'),
        phan_tram_phi: getCommon('phan_tram_phi')
      });
    }
  }, [batchRecords]);

  const handleChungChange = (field: string, value: string) => {
    setFieldsChung(prev => ({ ...prev, [field]: value }));
  };

  const handleRecordChange = (idx: number, field: string, value: string) => {
    setRecords(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const handleSave = async () => {
    if (isSaving) return;
    // Gán trường chung cho từng hóa đơn
    const updated = records.map(r => ({ ...r, ...fieldsChung }));
    // Validate
    const errors: string[] = [];
    updated.forEach((r, idx) => {
      if (!r.ck_ra || isNaN(Number(r.ck_ra))) errors.push(`Dòng ${idx + 1}: CK ra phải là số`);
      if (r.ck_vao && isNaN(Number(r.ck_vao))) errors.push(`Dòng ${idx + 1}: CK vào phải là số`);
      if ('so_dien_thoai' in r && (!r.so_dien_thoai || isNaN(Number(r.so_dien_thoai)))) errors.push(`Dòng ${idx + 1}: Số điện thoại phải là số và không được để trống`);
      if ('tong_so_tien' in r && (!r.tong_so_tien || isNaN(Number(r.tong_so_tien)))) errors.push(`Dòng ${idx + 1}: Tổng số tiền phải là số và không được để trống`);
      if ('phi_per_bill' in r && r.phi_per_bill && isNaN(Number(r.phi_per_bill))) errors.push(`Dòng ${idx + 1}: Phi/bill phải là số`);
      // Có thể bổ sung validate khác nếu cần
    });
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    } else {
      setValidationErrors([]);
    }
    try {
      await onSave(updated);
    } catch (err: any) {
      setValidationErrors([err?.message || 'Có lỗi xảy ra khi lưu batch!']);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sửa batch hóa đơn</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Đóng</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-xs">
          <div>
            <label className="block text-xs font-medium mb-1">Người gửi</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.nguoi_gui} onChange={e => handleChungChange('nguoi_gui', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Tên khách</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.ten_khach} onChange={e => handleChungChange('ten_khach', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">SĐT</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.so_dien_thoai} onChange={e => handleChungChange('so_dien_thoai', e.target.value.replace(/[^0-9]/g, ''))} type="number"/>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Key Redis</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.key_redis} onChange={e => handleChungChange('key_redis', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Phí %</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.phan_tram_phi} onChange={e => handleChungChange('phan_tram_phi', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">CK ra</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.ck_ra} onChange={e => handleChungChange('ck_ra', e.target.value.replace(/[^0-9]/g, ''))} type="number" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">CK vào</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.ck_vao} onChange={e => handleChungChange('ck_vao', e.target.value.replace(/[^0-9]/g, ''))} type="number" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">STK công ty</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.stk_cty} onChange={e => handleChungChange('stk_cty', e.target.value)}/>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">STK khách</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.stk_khach} onChange={e => handleChungChange('stk_khach', e.target.value)}/>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Note gốc</label>
            <input className="w-full border rounded px-2 py-1" value={fieldsChung.caption_goc} onChange={e => handleChungChange('caption_goc', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Loại giao dịch</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={fieldsChung.type_dao_rut}
              onChange={e => handleChungChange('type_dao_rut', e.target.value)}
            >
              <option value="">Chọn trạng thái</option>
              <option className="text-green-700" value="DAO">DAO</option>
              <option className="text-red-700" value="RUT">RUT</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Lịch cảnh báo</label>
            <DatePicker
              selected={fieldsChung.lich_canh_bao_datetime ? new Date(fieldsChung.lich_canh_bao_datetime) : null}
              onChange={date => handleChungChange('lich_canh_bao_datetime', date ? date.toISOString() : '')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm:ss"
              className="w-full border rounded px-2 py-1"
              placeholderText="Chọn thời gian"
              isClearable
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Thời điểm xử lý</label>
            <DatePicker
              selected={fieldsChung.created_at ? new Date(fieldsChung.created_at) : null}
              onChange={date => handleChungChange('created_at', date ? date.toISOString() : '')}
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
        {validationErrors.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-300 rounded p-3">
            <div className="text-red-700 font-semibold mb-1">Lỗi nhập liệu:</div>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((err, i) => (
                <li key={i} className="text-red-600 text-sm">
                  {typeof err === 'object' ? `Hóa đơn số ${Number(err.index) + 1}: ${err.error}` : err}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">STT</th>
                <th className="px-2 py-1 border">Ngân hàng</th>
                <th className="px-2 py-1 border">POS</th>
                <th className="px-2 py-1 border">Tid</th>
                <th className="px-2 py-1 border">MID</th>
                <th className="px-2 py-1 border">Số lô</th>
                <th className="px-2 py-1 border">Số hóa đơn</th>
                <th className="px-2 py-1 border">Số tiền</th>
                <th className="px-2 py-1 border">Phi/bill</th>
                <th className="px-2 py-1 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr key={r.id || idx}>
                  <td className="border px-2 py-1 text-center">{idx + 1}</td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.ngan_hang || ''} onChange={e => handleRecordChange(idx, 'ngan_hang', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.ten_may_pos || ''} onChange={e => handleRecordChange(idx, 'ten_may_pos', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.tid || ''} onChange={e => handleRecordChange(idx, 'tid', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.mid || ''} onChange={e => handleRecordChange(idx, 'mid', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.so_lo || ''} onChange={e => handleRecordChange(idx, 'so_lo', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.so_hoa_don || ''} onChange={e => handleRecordChange(idx, 'so_hoa_don', e.target.value)} /></td>
                  <td className="border px-2 py-1"><input className="w-full" value={r.tong_so_tien || ''} onChange={e => handleRecordChange(idx, 'tong_so_tien', e.target.value.replace(/[^0-9]/g, '0'))} /></td>
                  
                  <td className="border px-2 py-1">
                    <input
                      className="w-full text-green-700"
                      value={r.tong_so_tien || ''}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        handleRecordChange(idx, 'tong_so_tien', val);
                        const fee = val ? Math.floor(Number(val) * 0.1).toString() : '';
                        handleRecordChange(idx, 'phi_per_bill', fee);
                      }}
                      type="number"
                      min="0"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                      onClick={() => setRecords(prev => prev.filter((_, i) => i !== idx))}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">Hủy</button>
          <button type="button" onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60">{isSaving ? 'Đang lưu...' : 'Lưu tất cả'}</button>
        </div>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
          type="button"
          onClick={() => {
            setRecords(prev => [
              ...prev,
              {
                id: -1,
                thoi_gian: '',
                nguoi_gui: '',
                ten_khach: '',
                so_dien_thoai: '',
                type_dao_rut: '',
                ngan_hang: '',
                ngay_giao_dich: '',
                gio_giao_dich: '',
                tong_so_tien: '',
                so_the: '',
                tid: '',
                mid: '',
                so_lo: '',
                so_hoa_don: '',
                ten_may_pos: '',
                tien_phi: '',
                batch_id: '',
                caption_goc: fieldsChung.caption_goc || '',
                ck_ra: fieldsChung.ck_ra || '',
                ck_vao: fieldsChung.ck_vao || '',
                stk_khach: '',
                stk_cty: fieldsChung.stk_cty || '',
                tinh_trang: fieldsChung.tinh_trang || '',
                ly_do: '',
                dia_chi: '',
                khach_moi: false,
                phan_tram_phi: '',
                key_redis: '',
                ma_chuyen_khoan: '',
                lich_canh_bao_datetime: fieldsChung.lich_canh_bao_datetime || '',
                created_at: fieldsChung.created_at || '',
                updated_at: '',
                phi_per_bill: '',
              }
            ]);
          }}
        >
          Tạo hóa đơn mới
        </button>
      </div>
    </div>
  );
};

export default HoaDonBatchEditModal; 