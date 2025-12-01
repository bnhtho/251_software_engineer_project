import React, { useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";
import { User, MapPin, GraduationCap, Clock, BookOpen, Calendar } from "lucide-react";

import moment from 'moment';

interface HistoryItem {
  studentSessionId: number;
  sessionId: number;
  subjectName: string;
  tutorName: string;
  startTime: string;
  endTime: string;
  location: string;
  format: string;
  registrationStatus: string;
  sessionStatus: string;
  registeredDate: string;
  updatedDate: string | null;
  subjectCode: string | null;
}

const HistoryLearning: React.FC = () => {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [historyItem, setHistoryItem] = useState<HistoryItem[]>([]);
  // const
  // Estimated function2025-10-14T10:00:00Z - 2025-10-14T11:00:00Z
  const estimatedTime = (endTime: string, startTime: string): number => {
    const start = moment(startTime);
    const end = moment(endTime);
    const duration = moment.duration(end.diff(start));
    return duration.asMinutes();
  }


  const token = localStorage.getItem("authToken") || "";

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:8081/students/history/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistoryItem(data.data);
    } catch (err) {
      // Xử lý các luồng lỗi
      console.error("Lỗi khi fetch lịch sử học tập:", err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'SCHEDULED': // id: 1
        return {
          label: 'Đăng ký thành công',
          classes: 'bg-indigo-100 text-indigo-800 font-medium',
        };

      case 'IN_PROGRESS': // id: 2
        return {
          label: 'Sắp diễn ra',
          classes: 'bg-blue-100 text-blue-800 font-medium',
        };

      case 'COMPLETED': // id: 3
        return {
          label: 'Đã hoàn thành',
          classes: 'bg-green-100 text-green-800 font-medium',
        };

      case 'CANCELLED':
        return {
          label: 'Đã hủy',
          classes: 'bg-red-100 text-red-800 font-medium',
        };

      default:
        return {
          label: 'Không xác định',
          classes: 'bg-gray-100 text-gray-801 font-medium',
        };
    }
  };

  useEffect(() => {
    if (user && !isLoading) {
      fetchHistory();
    }
  }, [user, isLoading]);

  // Render component
  return (
    <>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">

          {/* TIÊU ĐỀ BẢNG (THEAD) */}
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <BookOpen className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                Môn đã học
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <User className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                Người dạy
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <Clock className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                Ngày học
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <Clock className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                Thời Lượng
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <MapPin className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                Địa Điểm
              </th>

              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trạng Thái Buổi Học
              </th>
              <th scope="col" className="relative px-4 py-3">
                {/* Chi Tiết */}
              </th>
            </tr>
          </thead>

          {/* THÂN BẢNG (TBODY) */}
          <tbody className="divide-y divide-gray-100">

            {historyItem && historyItem.length > 0 ? (
              historyItem.map((item) => (
                // Áp dụng lớp hover tinh tế
                <tr key={item.studentSessionId} className="hover:bg-indigo-50/30 transition duration-200 ease-in-out">

                  {/* Môn Học & Mã */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{item.subjectName}</p>
                    <p className="text-xs text-gray-500">{item.subjectCode}</p>
                  </td>

                  {/* Gia Sư */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {item.tutorName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {/* moment(data.startTime) */}
                    {/* USe momment for data.startDate */}
                    <p className="font-medium text-gray-800">{moment(item.startTime).format('DD/MM/YYYY')}</p>
                  </td>
                  {/* Thời Gian */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">

                    <p className="font-medium text-gray-800">{estimatedTime(item.endTime, item.startTime)} phút </p>
                  </td>

                  {/* Địa Điểm/Hình Thức */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <p className="font-medium text-gray-800">{item.location}</p>

                  </td>
                  {/* TRẠNG THÁI BUỔI HỌC */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`
                                px-2 py-1 
                                text-xs leading-5 font-semibold rounded-full 
                                text-left
                                ${getStatusInfo(item.sessionStatus).classes}
                            `}>
                      {getStatusInfo(item.sessionStatus).label}
                    </span>
                  </td>


                </tr>
              ))
            ) : (
              // Trạng thái nếu không có dữ liệu
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-lg text-gray-500">
                  Chưa có buổi học nào được đăng ký.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </>
  );
};

export default HistoryLearning;
