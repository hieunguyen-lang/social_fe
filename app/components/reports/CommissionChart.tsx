import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('../Chart'), { ssr: false });
import { getCommissionBySender } from '../../api/reportApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';

interface CommissionData {
  nguoi_gui: string;
  total_commission: number;
  total_commission_momo: number;
  total_transactions: number;
  total_transactions_momo: number;
  total_amount: number;
  total_amount_momo: number;
  total_fee?: number;
  total_fee_momo?: number;
  hoa_hong_cuoi_cung?: number;
}

const CommissionChart: React.FC = () => {
  const [from, setFrom] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CommissionData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Các option mặc định cho khoảng thời gian
  const timeRangeOptions = [
    {
      label: 'Hôm nay',
      value: 'today',
      getDates: () => {
        const today = new Date().toISOString().slice(0, 10);
        return { from: today, to: today };
      }
    },
    {
      label: 'Hôm qua',
      value: 'yesterday',
      getDates: () => {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        return { from: yesterday, to: yesterday };
      }
    },
    {
      label: '7 ngày qua',
      value: '7days',
      getDates: () => {
        const today = new Date().toISOString().slice(0, 10);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        return { from: sevenDaysAgo, to: today };
      }
    },
    {
      label: '30 ngày qua',
      value: '30days',
      getDates: () => {
        const today = new Date().toISOString().slice(0, 10);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        return { from: thirtyDaysAgo, to: today };
      }
    },
    {
      label: 'Tháng này',
      value: 'thisMonth',
      getDates: () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        const today = now.toISOString().slice(0, 10);
        return { from: firstDay, to: today };
      }
    },
    {
      label: 'Tháng trước',
      value: 'lastMonth',
      getDates: () => {
        const now = new Date();
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10);
        return { from: firstDayLastMonth, to: lastDayLastMonth };
      }
    },
    {
      label: 'Năm nay',
      value: 'thisYear',
      getDates: () => {
        const now = new Date();
        const firstDayYear = new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10);
        const today = now.toISOString().slice(0, 10);
        return { from: firstDayYear, to: today };
      }
    },
    {
      label: 'Năm trước',
      value: 'lastYear',
      getDates: () => {
        const now = new Date();
        const firstDayLastYear = new Date(now.getFullYear() - 1, 0, 1).toISOString().slice(0, 10);
        const lastDayLastYear = new Date(now.getFullYear() - 1, 11, 31).toISOString().slice(0, 10);
        return { from: firstDayLastYear, to: lastDayLastYear };
      }
    }
  ];

  const handleTimeRangeChange = (option: any) => {
    const dates = option.getDates();
    setFrom(dates.from);
    setTo(dates.to);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCommissionBySender(from, to);
      setData(res);
    } catch (e: any) {
      setError(e.message || 'Lỗi lấy dữ liệu hoa hồng');
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi API khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Lấy top 10 người gửi theo tổng hoa hồng
  const topData = [...data]
    .sort((a, b) => (b.total_commission || 0) - (a.total_commission || 0))
    .slice(0, 10);

  // Hàm xử lý label dài: tự động xuống dòng nếu quá 12 ký tự
  const wrapLabel = (label: string) => {
    if (label.length <= 12) return label;
    // Cắt thành các đoạn 12 ký tự, nối bằng \n
    return label.match(/.{1,12}/g)?.join('\n') || label;
  };

  // Chuẩn bị data cho biểu đồ cột (bar chart) - vertical bar
  const chartData = {
    labels: topData.map((d) => wrapLabel(d.nguoi_gui)),
    datasets: [
    //   {
    //     label: 'Tổng tiền phí (VNĐ)',
    //     data: topData.map((d) => d.total_commission),
    //     backgroundColor: 'rgba(59, 130, 246, 0.8)',
    //     borderColor: 'rgba(59, 130, 246, 1)',
    //     borderWidth: 1,
    //     barPercentage: 0.9,
    //     categoryPercentage: 0.7,
    //   },
      {
        label: 'Tổng hoa hồng (0.0002 Tổng tiền)',
        data: topData.map((d) => d.total_amount ? d.total_amount * 0.0002 : 0),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        barPercentage: 0.9,
        categoryPercentage: 0.7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { 
        display: true, 
        text: 'Top 10 hoa hồng theo từng người gửi' 
      },
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('vi-VN').format(value);
          }
        }
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 75,
          minRotation: 0,
          font: {
            size: 11
          },
          callback: function(value: any) {
            // value là index, trả về label đã wrap
            if (chartData.labels && typeof value === 'number') {
              return chartData.labels[value];
            }
            return value;
          }
        }
      },
    },
  };

  // Chuẩn bị data cho biểu đồ tròn (pie chart) - chỉ hiển thị hoa hồng
  const pieChartData = {
    labels: data.map((d) => d.nguoi_gui),
    datasets: [
      {
        data: data.map((d) => d.total_commission),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'right' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      title: { 
        display: true, 
        text: 'Phân bố hoa hồng theo người gửi' 
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${new Intl.NumberFormat('vi-VN').format(value)} VNĐ (${percentage}%)`;
          }
        }
      }
    },
  };

  // Helper chuyển string yyyy-MM-dd sang Date object
  const parseDate = (str: string) => {
    const [year, month, day] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  // Helper chuyển Date object sang yyyy-MM-dd
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        {/* Dropdown chọn khoảng thời gian mặc định */}
        <div>
          <label className="block text-sm font-medium mb-1">Khoảng thời gian</label>
          <select
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            onChange={(e) => {
              const option = timeRangeOptions.find(opt => opt.value === e.target.value);
              if (option) {
                handleTimeRangeChange(option);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Chọn nhanh</option>
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Từ ngày</label>
          <DatePicker
            selected={parseDate(from)}
            onChange={date => date && setFrom(formatDate(date))}
            dateFormat="dd/MM/yyyy"
            locale={vi}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxDate={parseDate(to)}
            placeholderText="Chọn ngày bắt đầu"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Đến ngày</label>
          <DatePicker
            selected={parseDate(to)}
            onChange={date => date && setTo(formatDate(date))}
            dateFormat="dd/MM/yyyy"
            locale={vi}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            minDate={parseDate(from)}
            maxDate={new Date()}
            placeholderText="Chọn ngày kết thúc"
          />
        </div>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          onClick={fetchData}
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Xem thống kê'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 mb-4 p-3 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      {data.length > 0 && (
        <>
          {/* Bảng thống kê */}
          <div className="mb-6 overflow-x-auto w-full">
            <table className="min-w-max bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b bg-gray-50">
                    Người gửi
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b bg-blue-50">
                    Số giao dịch(thẻ)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b bg-blue-50">
                    Tổng tiền(thẻ)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b bg-blue-50">
                    Tổng phí(thẻ)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b bg-blue-50">
                    Tổng hoa hồng(thẻ)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase tracking-wider border-b bg-pink-50">
                    Số giao dịch(momo)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase tracking-wider border-b bg-pink-50">
                    Tổng tiền(momo)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase tracking-wider border-b bg-pink-50">
                    Tổng phí(momo)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-pink-700 uppercase tracking-wider border-b bg-pink-50">
                    Tổng hoa hồng(momo)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b bg-gray-50">
                    Hoa hồng cuối cùng (0.0002 phí)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => {
                  const hoaHongCuoiCung = item.total_amount ? item.total_amount * 0.0002 : 0;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800 bg-gray-50">
                        {item.nguoi_gui}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-800 bg-blue-50">
                        {item.total_transactions}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-800 bg-blue-50">
                        {new Intl.NumberFormat('vi-VN').format(item.total_amount)} VNĐ
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-800 bg-blue-50">
                        {new Intl.NumberFormat('vi-VN').format(item.total_fee?? 0)} VNĐ
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-800 bg-blue-50">
                        {new Intl.NumberFormat('vi-VN').format(item.total_commission?? 0)} VNĐ
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-pink-800 bg-pink-50">
                        {item.total_transactions_momo}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-pink-800 bg-pink-50">
                        {new Intl.NumberFormat('vi-VN').format(item.total_amount_momo)} VNĐ
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-pink-800 bg-pink-50">
                        {new Intl.NumberFormat('vi-VN').format(item.total_fee_momo ?? 0)} VNĐ
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-pink-800 bg-pink-50">
                        {new Intl.NumberFormat('vi-VN').format(item.total_commission_momo?? 0)} VNĐ
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 bg-gray-50">
                      {new Intl.NumberFormat('vi-VN').format(item.hoa_hong_cuoi_cung ?? 0)} VNĐ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Biểu đồ cột */}
          <div className="mb-8 w-full">
            <h3 className="text-lg font-semibold mb-4">Biểu đồ cột - Hoa hồng và số giao dịch (Top 10)</h3>
            <div className="h-96 w-full">
              <Chart data={chartData} options={chartOptions} type="bar" />
            </div>
          </div>

          {/* Biểu đồ tròn */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Biểu đồ tròn - Phân bố hoa hồng</h3>
            <div className="h-96">
              <Chart data={pieChartData} options={pieChartOptions} type="pie" />
            </div>
          </div>
        </>
      )}

      {!loading && data.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu hoa hồng trong khoảng thời gian này
        </div>
      )}
    </div>
  );
};

export default CommissionChart; 