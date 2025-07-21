import { HoaDon, GroupedHoaDon, DashboardStats } from '../types';

export const groupHoaDonByBatchId = (hoaDonList: HoaDon[]): GroupedHoaDon => {
  return hoaDonList.reduce((groups, hoaDon) => {
    const batchId = hoaDon.batch_id;
    if (!groups[batchId]) {
      groups[batchId] = [];
    }
    groups[batchId].push(hoaDon);
    return groups;
  }, {} as GroupedHoaDon);
};

export const calculateStats = (hoaDonList: HoaDon[]): DashboardStats => {
  const totalRecords = hoaDonList.length;
  const uniqueBatches = new Set(hoaDonList.map(hoaDon => hoaDon.batch_id));
  const totalBatches = uniqueBatches.size;
  
  const totalAmount = hoaDonList.reduce((sum, hoaDon) => {
    return sum + parseInt(hoaDon.tong_so_tien.replace(/,/g, ''));
  }, 0);
  
  const totalFee = hoaDonList.reduce((sum, hoaDon) => {
    return sum + parseInt(hoaDon.tien_phi.replace(/,/g, ''));
  }, 0);

  return {
    totalRecords,
    totalBatches,
    totalAmount,
    totalFee
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatVietnameseDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}; 