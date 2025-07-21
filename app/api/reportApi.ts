const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8002'
    : 'http://localhost:8002';

const API_URL = `${API_BASE_URL}/report`;


export async function getReportSummary(type: 'hour'|'day'|'week'|'month'|'year', from: string, to: string, include?: string) {
  let url = `${API_URL}/summary?type=${type}&from=${from}&to=${to}`;
  if (include) {
    url += `&include=${encodeURIComponent(include)}`;
  }
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Lỗi lấy báo cáo');
  return res.json();
}

export async function getCommissionBySender(from: string, to: string) {
  const url = `${API_URL}/commission-by-sender?from=${from}&to=${to}`;
  const res = await fetch(url, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Lỗi lấy thống kê hoa hồng');
  return res.json();
} 

export async function getHoaDonDenHanKetToan(from: string, to: string) {
  const url = `${API_URL}/den-han-ket-toan?from=${from}&to=${to}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Lỗi lấy hóa đơn đến hạn kết toán');
  return res.json();
}