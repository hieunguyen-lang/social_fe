import { HoaDon } from '../types';

const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8002'
    : '/api';

const API_URL = `${API_BASE_URL}/hoa-don`;
// ===== Thẻ HOA DON INTERFACES =====
export interface HoaDonGroup {
  batch_id: string;
  records: HoaDon[];
}

export interface HoaDonListResponse {
  total: number;
  data: HoaDonGroup[];
}


export const getHoaDonList = async (queryParams?: string) => {
  const url = queryParams 
    ? `${API_URL}/?${queryParams}`
    : API_URL;
    
  const response = await fetch(url, {
    credentials: 'include', // ✅ Thêm dòng này để gửi cookie
  });
  if (!response.ok) throw new Error('Lấy danh sách hóa đơn thất bại');
  return response.json();
};

// Thêm function để lấy thống kê tổng hợp
export const getHoaDonStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy thống kê hóa đơn thất bại');
  return response.json();
};

export const getHoaDonStatsByFilter = async (queryParams?: string) => {
  const url = queryParams
    ? `${API_URL}/stats-hoadon?${queryParams}`
    : `${API_URL}/stats-hoadon`;
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy thống kê hóa đơn theo filter thất bại');
  return response.json();
};

export async function updateHoaDon(id: number, data: Partial<HoaDon>): Promise<HoaDon> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    credentials: 'include', // ✅
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Cập nhật hóa đơn thất bại');
  return res.json();
}


export async function deleteHoaDon(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include', // ✅
  });
  if (!res.ok) throw new Error('Xóa hóa đơn thất bại');
}

export async function deleteHoaDonBatch(batchId: string): Promise<void> {
  const res = await fetch(`${API_URL}/batch/${batchId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Xóa batch hóa đơn thất bại');
}

export const createHoaDon = async (hoaDonData: Partial<HoaDon>) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(hoaDonData),
  });
  if (!response.ok) {
    if (response.status === 422) {
      const errorData = await response.json();
      throw { status: 422, detail: errorData.detail };
    }
    throw new Error('Tạo hóa đơn thất bại');
  }
  return response.json();
};

export const exportHoaDonExcel = async (queryParams?: string) => {
  const url = queryParams
    ? `${API_URL}/export-excel?${queryParams}`
    : `${API_URL}/export-excel`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Xuất Excel thất bại');
  return response.blob();
};

// ===== MOMO HOA DON INTERFACES =====
export interface MomoRecord {
  nha_cung_cap: string;
  ten_khach_hang: string;
  ma_khach_hang: string;
  dia_chi: string;
  ky_thanh_toan: string;
  so_tien: string;
  ma_giao_dich: string;
  thoi_gian: string;
  created_at: string;
  tai_khoan_the: string;
  trang_thai: string;
  nguoi_gui: string;
  batch_id: string;
  update_at: string;
  ten_zalo: string;
  phi_cong_ty_thu: string;
  ck_vao: string;
  ck_ra: string;
  ma_chuyen_khoan: string;
  so_tk: string;
  is_send_or_recieve: string;
  note: string;
  id: number; 
}

export interface MomoBatch {
  batch_id: string;
  records: MomoRecord[];
}

export interface MomoHoaDonResponse {
  total: number;
  data: MomoBatch[];
}

// Interface cho stats response của MoMo
export interface MomoHoaDonStatsResponse {
  total: number;
  totalAmount: number;
  total_fee?: number;
}

// ===== MOMO HOA DON API =====


export const getMomoHoaDonList = async (queryParams?: string) => {
  const url = queryParams 
    ? `${API_URL}/momo?${queryParams}`
    : `${API_URL}/momo`;
    
  const response = await fetch(url, {
    credentials: 'include', // ✅ Thêm dòng này để gửi cookie
  });
  if (!response.ok) throw new Error('Lấy danh sách hóa đơn thất bại');
  return response.json();
};
export async function deleteMomoHoaDonBatch(batchId: string): Promise<void> {
  const res = await fetch(`${API_URL}/momo/batch/${batchId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Xóa batch hóa đơn thất bại');
}
// Thêm API stats cho MoMo hóa đơn
export const getMomoHoaDonStats = async (queryParams?: string) => {
  const url = queryParams 
    ? `${API_URL}/stats-hoa-don-dien?${queryParams}`
    : `${API_URL}/stats-hoa-don-dien`;
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy thống kê MoMo hóa đơn thất bại');
  return response.json();
};

// ===== DOI UNG INTERFACES =====
export interface DoiUngRecord {
  nha_cung_cap: string;
  ten_khach_hang: string;
  ma_khach_hang: string;
  dia_chi: string;
  ky_thanh_toan: string;
  so_tien: string;
  ma_giao_dich: string;
  thoi_gian: string;
  tai_khoan_the: string;
  tong_phi: string;
  trang_thai: string;
  nguoi_gui: string;
  batch_id: string;
  update_at: string;
  phi_phan_tram: string;
  doi_tac: string;
  key_redis: string;
  id: number;
}

export interface DoiUngResponse {
  total: number;
  data: DoiUngRecord[];
}

// ===== DOI UNG API =====
export const getDoiUngList = async (queryParams?: string) => {
  const url = queryParams 
    ? `${API_URL}/doi-ung?${queryParams}`
    : `${API_URL}/doi-ung`;
    
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy danh sách đối ứng thất bại');
  return response.json();
};

// Thêm API stats cho đối ứng (không phân trang)
export const getDoiUngStats = async (queryParams?: string) => {
  const url = queryParams 
    ? `${API_URL}/stats-doi-ung?${queryParams}`
    : `${API_URL}/stats-doi-ung`;
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy thống kê đối ứng thất bại');
  return response.json();
};

export const batchUpdateHoaDon = async (records: any[]) => {
  const response = await fetch(`${API_URL}/batch-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(records),
  });
  if (!response.ok) {
    let errMsg = 'Batch update hóa đơn thất bại';
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        errMsg += ': ' + JSON.stringify(errData.detail);
      }
    } catch {}
    throw new Error(errMsg);
  }
  return response.json();
};

