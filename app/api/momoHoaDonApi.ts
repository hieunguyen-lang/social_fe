const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8002'
    : 'http://45.32.104.37:8002';

const API_URL = `${API_BASE_URL}/hoa-don/momo`;


export interface MomoRecord {
  nha_cung_cap: string;
  ten_khach_hang: string;
  ma_khach_hang: string;
  dia_chi: string;
  ky_thanh_toan: string;
  so_tien: string;
  ma_giao_dich: string;
  thoi_gian: string;
  tai_khoan_the: string;
  trang_thai: string;
  nguoi_gui: string;
  batch_id: string;
  update_at: string;
  ten_zalo: string;
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

export const getMomoHoaDonList = async (queryParams?: string) => {
  const url = queryParams 
    ? `${API_URL}/?${queryParams}`
    : API_URL;
    
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy danh sách hóa đơn MoMo thất bại');
  return response.json();
};

export const getMomoHoaDonStats = async () => {
  const response = await fetch(`${API_URL}/stats`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy thống kê hóa đơn MoMo thất bại');
  return response.json();
};

export const getMomoHoaDonStatsByFilter = async (queryParams?: string) => {
  const url = queryParams
    ? `${API_URL}/stats-hoadon?${queryParams}`
    : `${API_URL}/stats-hoadon`;
  const response = await fetch(url, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Lấy thống kê hóa đơn MoMo theo filter thất bại');
  return response.json();
};

export async function updateMomoHoaDon(id: number, data: Partial<MomoRecord>): Promise<MomoRecord> {
  console.log('updateMomoHoaDon - id:', id, 'data:', data); // log dữ liệu gửi lên
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    credentials: 'include', // ✅
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let errMsg = 'Cập nhật hóa đơn MoMo thất bại';
    try {
      const errData = await res.json();
      if (errData && errData.detail) {
        errMsg += ': ' + JSON.stringify(errData.detail);
      }
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
}

export async function deleteMomoHoaDon(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include', // ✅
  });
  if (!res.ok) throw new Error('Xóa hóa đơn MoMo thất bại');
}

export const createMomoHoaDon = async (hoaDonData: Partial<MomoRecord>) => {
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
    throw new Error('Tạo hóa đơn MoMo thất bại');
  }
  return response.json();
};

export const exportMomoHoaDonExcel = async (queryParams?: string) => {
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

// Batch update/create MomoHoaDon
export const batchUpdateMomoHoaDon = async (records: Partial<MomoRecord>[]) => {
  const response = await fetch(`${API_BASE_URL}/hoa-don/batch-momo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ records }),
  });
  if (!response.ok) {
    let errMsg = 'Batch update/create hóa đơn MoMo thất bại';
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