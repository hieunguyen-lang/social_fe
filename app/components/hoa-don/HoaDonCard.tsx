import React from 'react';
import { HoaDon } from '../../types/index';
import { formatCurrency, formatDate } from '../../utils/groupRecords';

interface HoaDonCardProps {
  hoaDon: HoaDon;
}

const HoaDonCard: React.FC<HoaDonCardProps> = ({ hoaDon }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Rút tiền':
        return 'bg-blue-100 text-blue-800';
      case 'Đạo tiền':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">
            Hóa đơn #{hoaDon.so_hoa_don}
          </h3>
          <p className="text-sm text-gray-600">ID: {hoaDon.id}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(hoaDon.type_dao_rut)}`}>
          {hoaDon.type_dao_rut}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-500">Khách hàng:</span>
          <p className="font-medium">{hoaDon.ten_khach}</p>
        </div>
        <div>
          <span className="text-gray-500">SĐT:</span>
          <p className="font-medium">{hoaDon.so_dien_thoai}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-500">Ngân hàng:</span>
          <p className="font-medium">{hoaDon.ngan_hang}</p>
        </div>
        <div>
          <span className="text-gray-500">Số thẻ:</span>
          <p className="font-medium text-xs">{hoaDon.so_the}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-500">Tổng tiền:</span>
          <p className="font-semibold text-green-600">
            {formatCurrency(parseInt(hoaDon.tong_so_tien))}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Phí:</span>
          <p className="font-medium text-red-600">
            {formatCurrency(parseInt(hoaDon.tien_phi))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <span className="text-gray-500">Thời gian:</span>
          <p className="font-medium">{formatDate(hoaDon.thoi_gian)}</p>
        </div>
        <div>
          <span className="text-gray-500">Người gửi:</span>
          <p className="font-medium">{hoaDon.nguoi_gui}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-3">
        <div>
          <span>TID: {hoaDon.tid}</span>
        </div>
        <div>
          <span>MID: {hoaDon.mid}</span>
        </div>
      </div>

      {hoaDon.caption_goc && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 italic">"{hoaDon.caption_goc}"</p>
        </div>
      )}
    </div>
  );
};

export default HoaDonCard; 