"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'indigo';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  color = 'blue'
}) => {
  const colorClasses = {
    blue: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    green: {
      icon: 'text-green-600',
      bg: 'bg-green-50',
      text: 'text-green-600'
    },
    red: {
      icon: 'text-red-600',
      bg: 'bg-red-50',
      text: 'text-red-600'
    },
    yellow: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600'
    },
    purple: {
      icon: 'text-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-600'
    },
    indigo: {
      icon: 'text-indigo-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600'
    }
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const selectedColor = colorClasses[color];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-1 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${selectedColor.bg}`}>
          <Icon className={`h-6 w-6 ${selectedColor.icon}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard; 