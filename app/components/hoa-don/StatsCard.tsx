import React from 'react';
import { TrendingUp, TrendingDown, Users, FolderOpen } from 'lucide-react';
import { formatCurrency } from '../../utils/groupRecords';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: number;
  color: string;
  isCurrency?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color,
  isCurrency = false
}) => {
  const displayValue = isCurrency ? formatCurrency(value) : value.toLocaleString();

  return (
    <div className={`bg-white rounded-md shadow p-3 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-lg font-bold text-gray-900">{displayValue}</p>
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}> 
                {trendValue}%
              </span>
            </div>
          )}
        </div>
        <div className="text-gray-400">
          {/* Ép icon nhỏ lại nếu truyền icon lớn */}
          <span className="inline-flex items-center justify-center w-6 h-6">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 