import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { getHoaDonDenHanKetToan } from '../../api/reportApi';

interface HoaDon {
  id: string;
  title: string;
  start: string; // ISO date string
  nguoi_gui?: string;
  ten_khach?: string;
  so_dien_thoai?: string;
  batch_id?: string;
  thoi_gian?: string;
  // ... các trường khác nếu cần
}

const CalendarView: React.FC = () => {
  const [hoaDons, setHoaDons] = useState<HoaDon[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSender, setSelectedSender] = useState<string | null>(null);

  useEffect(() => {
    // Lấy hóa đơn đến hạn kết toán trong tháng hiện tại
    const fetchData = async () => {
      try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
        const data = await getHoaDonDenHanKetToan(firstDay, lastDay);
        setHoaDons(data);
      } catch (e) {
        setHoaDons([]);
      }
    };
    fetchData();
  }, []);

  // Group hóa đơn theo ngày
  const hoaDonByDate: { [date: string]: HoaDon[] } = {};
  hoaDons.forEach(hd => {
    if (!hoaDonByDate[hd.start]) hoaDonByDate[hd.start] = [];
    hoaDonByDate[hd.start].push(hd);
  });

  // Tạo event cho calendar: mỗi ngày 1 event tổng
  const events = Object.entries(hoaDonByDate).map(([date, list]) => ({
    id: date,
    title: `Có ${list.length} hóa đơn đến hạn`,
    start: date,
    allDay: true
  }));

  // Xử lý click vào ngày
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr); // yyyy-mm-dd
  };

  // Xử lý click vào event (label số hóa đơn)
  const handleEventClick = (arg: any) => {
    setSelectedDate(arg.event.startStr.slice(0, 10)); // yyyy-mm-dd
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Lịch các hóa đơn đến hạn đáo hạn</h2>
      <div className="w-full max-w-5xl mx-auto">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={viLocale}
          height={650}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
          eventDisplay="block"
        />
      </div>
      {/* Table chi tiết hóa đơn khi chọn ngày */}
      {selectedDate && hoaDonByDate[selectedDate] && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">Danh sách người gửi có hóa đơn đến hạn ngày {selectedDate}</h3>
          <ul className="mb-4">
            {Array.from(new Set(hoaDonByDate[selectedDate].map(hd => hd.nguoi_gui || 'Không rõ'))).map(sender => (
              <li key={sender}>
                <button
                  className={`text-blue-600 hover:underline ${selectedSender === sender ? 'font-bold' : ''}`}
                  onClick={() => setSelectedSender(sender)}
                >
                  {sender}
                </button>
              </li>
            ))}
          </ul>
          {/* Hiện danh sách hóa đơn của người gửi đã chọn */}
          {selectedSender && (
            <>
              <h4 className="font-semibold mb-2">Hóa đơn của {selectedSender} ngày {selectedDate}</h4>
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">Thời gian giao dịch</th>
                    <th className="border px-2 py-1">Tên khách</th>
                    <th className="border px-2 py-1">Số Điện Thoại</th>
                  </tr>
                </thead>
                <tbody>
                  {hoaDonByDate[selectedDate].filter(hd => (hd.nguoi_gui || 'Không rõ') === selectedSender).map(hd => (
                    <tr key={hd.id}>
                      <td className="border px-2 py-1">{hd.thoi_gian}</td>
                      <td className="border px-2 py-1">{hd.ten_khach}</td>
                      <td className="border px-2 py-1">{hd.so_dien_thoai?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView; 