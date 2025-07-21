import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FolderOpen, Calendar, DollarSign } from 'lucide-react';
import { GroupedHoaDon, HoaDon } from '../../types/index';
import HoaDonCard from './HoaDonCard';
import { formatCurrency } from '../../utils/groupRecords';

interface GroupedHoaDonSectionProps {
  groupedHoaDon: GroupedHoaDon;
}

const GroupedHoaDonSection: React.FC<GroupedHoaDonSectionProps> = ({ 
  groupedHoaDon 
}) => {
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());

  const toggleBatch = (batchId: string) => {
    const newExpanded = new Set(expandedBatches);
    if (newExpanded.has(batchId)) {
      newExpanded.delete(batchId);
    } else {
      newExpanded.add(batchId);
    }
    setExpandedBatches(newExpanded);
  };

  const calculateBatchTotal = (hoaDonList: HoaDon[]) => {
    return hoaDonList.reduce((sum, hoaDon) => sum + parseInt(hoaDon.tong_so_tien), 0);
  };

  const calculateBatchFee = (hoaDonList: HoaDon[]) => {
    return hoaDonList.reduce((sum, hoaDon) => sum + parseInt(hoaDon.tien_phi), 0);
  };

  const getBatchTypeCounts = (hoaDonList: HoaDon[]) => {
    const counts = { 'Rút tiền': 0, 'Đạo tiền': 0 };
    hoaDonList.forEach(hoaDon => {
      counts[hoaDon.type_dao_rut as keyof typeof counts]++;
    });
    return counts;
  };

  const getBatchDate = (hoaDonList: HoaDon[]) => {
    if (hoaDonList.length > 0) {
      return new Date(hoaDonList[0].thoi_gian).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    return '';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Hóa đơn được nhóm theo Batch ID
      </h2>
      
      {Object.entries(groupedHoaDon).map(([batchId, hoaDonList]) => {
        const isExpanded = expandedBatches.has(batchId);
        const totalAmount = calculateBatchTotal(hoaDonList);
        const totalFee = calculateBatchFee(hoaDonList);
        const typeCounts = getBatchTypeCounts(hoaDonList);
        const batchDate = getBatchDate(hoaDonList);
        
        return (
          <div key={batchId} className="bg-white rounded-lg shadow-sm border">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleBatch(batchId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{batchId}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {batchDate}
                      </div>
                      <span>{hoaDonList.length} hóa đơn</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500">Tổng tiền</p>
                    </div>
                    <div>
                      <p className="font-semibold text-red-600">
                        {formatCurrency(totalFee)}
                      </p>
                      <p className="text-xs text-gray-500">Tổng phí</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 text-xs mt-1">
                    <span className="text-blue-600">● Rút: {typeCounts['Rút tiền']}</span>
                    <span className="text-green-600">● Đạo: {typeCounts['Đạo tiền']}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="border-t border-gray-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hoaDonList.map(hoaDon => (
                    <HoaDonCard key={hoaDon.id} hoaDon={hoaDon} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupedHoaDonSection; 