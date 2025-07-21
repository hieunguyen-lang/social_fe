import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('../Chart'), { ssr: false });
import { getReportSummary } from '../../api/reportApi';
import StatsCard from '../hoa-don/StatsCard';
import { Users, FolderOpen, DollarSign, CreditCard } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
import CommissionChart from './CommissionChart';
import CalendarView from './CalendarView';

interface ReportDashboardProps {
  activeTab: 'summary' | 'commission' | 'calendar';
}

const TYPE_OPTIONS = [
  { value: 'hour', label: 'Giờ' },
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
  { value: 'year', label: 'Năm' },
];

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

const today = formatDate(new Date());
const lastMonth = formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

const ReportDashboard: React.FC<ReportDashboardProps> = ({ activeTab }) => {
  const [type, setType] = useState<'hour'|'day'|'week'|'month'|'year'>('day');
  const [from, setFrom] = useState(lastMonth);
  const [to, setTo] = useState(today);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalRecords: 0, totalBatches: 0, totalAmount: 0, totalFee: 0,totalNewCustomers: 0 });

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
      const res = await getReportSummary(type, from, to);
      setData(res);
    } catch (e: any) {
      setError(e.message || 'Lỗi lấy dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getReportSummary(type, from, to);
      let totalRecords = 0, totalBatches = 0, totalAmount = 0, totalFee = 0,totalNewCustomers = 0;
      res.forEach((item: any) => {
        totalRecords += item.total_invoices || 0;
        totalBatches += item.total_batches || 0;
        totalAmount += item.total_amount || 0;
        totalFee += item.total_fee || 0;
        totalNewCustomers += item.total_new_customers || 0;
      });
      setStats({ totalRecords, totalBatches, totalAmount, totalFee,totalNewCustomers });
    } catch (e) {
      // Nếu lỗi thì giữ nguyên stats cũ
    }
  };

  // Tự động gọi API khi component mount với type mặc định là 'day'
  useEffect(() => {
    fetchData();
  }, []); // Chỉ chạy một lần khi component mount

  // Gọi fetchStats mỗi khi type, from, to thay đổi
  useEffect(() => {
    fetchStats();
  }, [type, from, to]);

  // Chuẩn bị data cho biểu đồ chứng khoán (line chart)
  const chartData = {
    labels: data.map((d) => d.period),
    datasets: [
      {
        label: 'Tổng tiền',
        data: data.map((d) => d.total_amount),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 3,
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        shadowBlur: 6,
        shadowColor: 'rgba(59,130,246,0.2)'
      },
      {
        label: 'Tổng phí',
        data: data.map((d) => d.total_fee),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 3,
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        shadowBlur: 6,
        shadowColor: 'rgba(239,68,68,0.2)'
      },
      {
        label: 'Khách mới',
        data: data.map((d) => d.total_new_customers || 0),
        borderColor: 'rgba(147, 51, 234, 1)',
        backgroundColor: 'rgba(147, 51, 234, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 3,
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        shadowBlur: 6,
        shadowColor: 'rgba(147,51,234,0.2)'
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Báo cáo tổng hợp (Tổng tiền & Tổng phí)', font: { size: 18 } },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('vi-VN').format(context.parsed.y) + ' VNĐ';
            }
            return label;
          }
        }
      },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v: any) => new Intl.NumberFormat('vi-VN').format(v) } },
      x: {},
    },
  };

  // Hàm reset filter về mặc định
  const resetFilter = () => {
    setType('day');
    setFrom(lastMonth);
    setTo(today);
  };

  // Tính toán tăng trưởng tổng tiền và tổng phí
  function calcGrowth(current: number, prev: number) {
    if (prev === 0) return null;
    const percent = ((current - prev) / prev) * 100;
    return Math.round(percent * 10) / 10; // làm tròn 1 số thập phân
  }

  // Tìm tổng tiền/tổng phí của kỳ trước (ngày, tháng, năm)
  let prevDayAmount = 0, prevDayFee = 0, prevMonthAmount = 0, prevMonthFee = 0, prevYearAmount = 0, prevYearFee = 0;
  if (data.length > 1) {
    // Giả sử data đã sort theo thời gian tăng dần
    prevDayAmount = data[data.length - 2]?.total_amount || 0;
    prevDayFee = data[data.length - 2]?.total_fee || 0;
  }
  // Tìm theo tháng
  const monthMap: Record<string, {amount: number, fee: number}> = {};
  data.forEach(d => {
    const month = (d.period || '').slice(0, 7); // yyyy-mm
    if (!monthMap[month]) monthMap[month] = {amount: 0, fee: 0};
    monthMap[month].amount += d.total_amount || 0;
    monthMap[month].fee += d.total_fee || 0;
  });
  const months = Object.keys(monthMap).sort();
  if (months.length > 1) {
    prevMonthAmount = monthMap[months[months.length - 2]].amount;
    prevMonthFee = monthMap[months[months.length - 2]].fee;
  }
  // Tìm theo năm
  const yearMap: Record<string, {amount: number, fee: number}> = {};
  data.forEach(d => {
    const year = (d.period || '').slice(0, 4); // yyyy
    if (!yearMap[year]) yearMap[year] = {amount: 0, fee: 0};
    yearMap[year].amount += d.total_amount || 0;
    yearMap[year].fee += d.total_fee || 0;
  });
  const years = Object.keys(yearMap).sort();
  if (years.length > 1) {
    prevYearAmount = yearMap[years[years.length - 2]].amount;
    prevYearFee = yearMap[years[years.length - 2]].fee;
  }

  // Tính % tăng trưởng
  const dayGrowthAmount = calcGrowth(stats.totalAmount, prevDayAmount);
  const dayGrowthFee = calcGrowth(stats.totalFee, prevDayFee);
  const monthGrowthAmount = calcGrowth(stats.totalAmount, prevMonthAmount);
  const monthGrowthFee = calcGrowth(stats.totalFee, prevMonthFee);
  const yearGrowthAmount = calcGrowth(stats.totalAmount, prevYearAmount);
  const yearGrowthFee = calcGrowth(stats.totalFee, prevYearFee);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Tab content */}
      {activeTab === 'summary' && (
        <>
          {/* Bộ lọc lên đầu */}
          <div className="flex flex-wrap gap-4 mb-8 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Loại thống kê</label>
              <select
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={type}
                onChange={e => setType(e.target.value as any)}
              >
                {TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
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
                <option value="" disabled>Tùy chọn nhanh</option>
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
                selected={from ? parseDate(from) : null}
                onChange={date => date && setFrom(formatDate(date))}
                dateFormat="dd/MM/yyyy"
                locale={vi}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxDate={to ? parseDate(to) : undefined}
                placeholderText="Chọn ngày bắt đầu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đến ngày</label>
              <DatePicker
                selected={to ? parseDate(to) : null}
                onChange={date => date && setTo(formatDate(date))}
                dateFormat="dd/MM/yyyy"
                locale={vi}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                minDate={from ? parseDate(from) : undefined}
                maxDate={new Date()}
                placeholderText="Chọn ngày kết thúc"
              />
            </div>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Xem báo cáo'}
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              onClick={resetFilter}
            >
              Đặt lại bộ lọc
            </button>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Tổng Batch"
              value={stats.totalBatches}
              icon={<FolderOpen className="w-8 h-8" />}
              color="border-green-500"
            />
            <StatsCard
              title="Khách mới"
              value={stats.totalNewCustomers}
              icon={<Users className="w-5 h-5" />}
              color="border-purple-500"
              isCurrency={false}
            />
            <StatsCard
              title="Tổng Tiền"
              value={stats.totalAmount}
              icon={<DollarSign className="w-8 h-8" />}
              color="border-emerald-500"
              isCurrency={true}
              trend={dayGrowthAmount !== null ? (dayGrowthAmount >= 0 ? 'up' : 'down') : undefined}
              trendValue={dayGrowthAmount !== null ? Math.abs(dayGrowthAmount) : undefined}
            />
            <StatsCard
              title="Tổng Phí"
              value={stats.totalFee}
              icon={<CreditCard className="w-8 h-8" />}
              color="border-red-500"
              isCurrency={true}
              trend={dayGrowthFee !== null ? (dayGrowthFee >= 0 ? 'up' : 'down') : undefined}
              trendValue={dayGrowthFee !== null ? Math.abs(dayGrowthFee) : undefined}
            />
            <StatsCard
              title="Tăng trưởng tháng"
              value={monthGrowthAmount !== null ? monthGrowthAmount : 0}
              icon={<DollarSign className="w-8 h-8" />}
              color="border-blue-500"
              isCurrency={false}
              trend={monthGrowthAmount !== null ? (monthGrowthAmount >= 0 ? 'up' : 'down') : undefined}
              trendValue={monthGrowthAmount !== null ? Math.abs(monthGrowthAmount) : undefined}
            />
            <StatsCard
              title="Tăng trưởng năm"
              value={yearGrowthAmount !== null ? yearGrowthAmount : 0}
              icon={<DollarSign className="w-8 h-8" />}
              color="border-green-500"
              isCurrency={false}
              trend={yearGrowthAmount !== null ? (yearGrowthAmount >= 0 ? 'up' : 'down') : undefined}
              trendValue={yearGrowthAmount !== null ? Math.abs(yearGrowthAmount) : undefined}
            />
          </div>
          {/* Nếu không có dữ liệu, hiển thị thông báo */}
          {data.length === 0 && !loading && (
            <div className="text-center text-red-500 mb-6">
              Không có dữ liệu cho bộ lọc này. <button className="underline text-blue-600" onClick={resetFilter}>Đặt lại bộ lọc</button>
            </div>
          )}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="h-[700px]">
            <Chart data={chartData} options={chartOptions} height="h-full" />
          </div>
        </>
      )}
      {activeTab === 'commission' && <CommissionChart />}
      {activeTab === 'calendar' && <CalendarView />}
    </div>
  );
};

export default ReportDashboard;
