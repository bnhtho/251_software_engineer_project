import React, { useEffect, useState } from "react";
import { useUser } from "../Context/UserContext";
import { User, MapPin, Clock, BookOpen, Calendar, AlertTriangle, Loader2, GraduationCap } from "lucide-react";
import moment from 'moment';

// Cập nhật Interface để bao gồm các trường từ API mới
interface HistoryItem {
  studentSessionId: number;
  sessionId: number;
  tutorName: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  format: string;
  location: string;
  dayOfWeek: string;
  sessionStatus: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | string;
  registrationStatus: string;
  registeredDate: string;
  updatedDate: string | null;
  // Các trường cũ không có trong API mới có thể được giữ lại hoặc loại bỏ tùy theo yêu cầu hiển thị
  // Hiện tại tôi giữ lại subjectCode/subjectName như API đã cung cấp và loại bỏ subjectCode cũ nếu không dùng
  subjectCode?: string | null;
}

// Cấu trúc phản hồi API
interface HistoryResponse {
  statusCode: number;
  message: string;
  data: {
    pagination: {
      totalItems: number;
      totalPages: number;
      pageSize: number;
      hasPrevious: boolean;
      hasNext: boolean;
      currentPage: number;
    };
    content: HistoryItem[];
  };
}


const TableRowSkeleton = ({ columns = 6 }) => (
  <tr className="animate-pulse">
    {[...Array(columns)].map((_, index) => (
      <td key={index} className="px-4 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </td>
    ))}
  </tr>
);

const TableHeader: React.FC<{ title: string; icon: React.ElementType; align?: 'left' | 'center' }> = ({ title, icon: Icon, align = 'left' }) => (
  <th
    scope="col"
    className={`px-4 py-3 text-${align} text-xs font-semibold text-gray-600 uppercase tracking-wider`}
  >
    <Icon className="h-4 w-4 inline-block mr-1 text-blue-600" />
    {title}
  </th>
);

const HistoryLearning: React.FC = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const estimatedTime = (endTime: string, startTime: string): number => {
    const start = moment(startTime);
    const end = moment(endTime);
    const duration = moment.duration(end.diff(start));
    return duration.asMinutes();
  }

  // Khôi phục lấy token
  const token = localStorage.getItem("authToken") || "";

  const fetchHistory = async () => {
    if (!user?.id) {
      // Nếu user chưa tải hoặc không có ID, chỉ cần dừng lại và chờ
      if (!isUserLoading) {
        setError("Không thể tải dữ liệu: Thiếu thông tin người dùng.");
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    const API_URL = "http://localhost:8081/students/history?page=0";

    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      // Xử lý lỗi HTTP status (4xx, 5xx)
      if (!res.ok) {
        let errorMsg = `Lỗi tải dữ liệu: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          // Không làm gì nếu body không phải JSON
        }
        throw new Error(errorMsg);
      }

      // Xử lý thành công
      const data: HistoryResponse = await res.json();

      // Kiểm tra cấu trúc dữ liệu JSON
      if (data.statusCode === 200 && data.data && data.data.content) {
        setHistoryItems(data.data.content);
      } else {
        throw new Error(data.message || "Phản hồi API không hợp lệ.");
      }

    } catch (err) {
      console.error("Lỗi khi fetch lịch sử học tập:", err);
      setError((err as Error).message || "Không thể kết nối đến máy chủ.");
      setHistoryItems([]); // Đảm bảo danh sách rỗng khi có lỗi
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Chỉ chạy khi user đã tải xong (không còn loading)
    if (!isUserLoading) {
      fetchHistory();
    }
  }, [user, isUserLoading]); // Phụ thuộc vào user và trạng thái loading của user

  // Giữ nguyên logic status dựa trên các status đã biết
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return { label: 'Đã đăng ký', classes: 'bg-indigo-100 text-indigo-800' };
      case 'IN_PROGRESS':
        return { label: 'Sắp diễn ra', classes: 'bg-blue-100 text-blue-800' };
      case 'COMPLETED':
        return { label: 'Đã hoàn thành', classes: 'bg-green-100 text-green-800' };
      case 'CANCELLED':
        return { label: 'Đã hủy', classes: 'bg-red-100 text-red-800' };
      case 'CONFIRMED':
        // API mới có 'CONFIRMED' trong registrationStatus, nhưng ta dùng sessionStatus
        // Nếu sessionStatus là SCHEDULED, ta dùng SCHEDULED. Nếu API trả về status mới, ta thêm vào đây.
        return { label: 'Đã xác nhận', classes: 'bg-indigo-100 text-indigo-800' };
      default:
        return { label: 'Không xác định', classes: 'bg-gray-100 text-gray-600' };
    }
  };

  // Hàm helper để hiển thị SubjectName hoặc SubjectName + SubjectCode nếu có
  const renderSubjectDisplay = (item: HistoryItem) => {
    // API mới không có subjectCode, nên ta chỉ hiển thị subjectName
    return (
      <>
        <p className="text-sm font-semibold text-gray-900">{item.subjectName}</p>
        {/* Nếu bạn muốn thêm placeholder cho Subject Code, dùng đoạn sau: 
        <p className="text-xs text-gray-500 mt-0.5">{item.subjectCode || 'Không mã'}</p> 
        */}
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
          Lịch sử học tập
        </h2>
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="p-2 text-sm text-gray-500 hover:text-blue-600 disabled:opacity-50 transition duration-150"
          title="Tải lại dữ liệu"
        >
          <Loader2 className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">
            <tr>
              {/* Xóa Subject Code trong header vì API mới không cung cấp */}
              <TableHeader title="Môn học" icon={BookOpen} />
              <TableHeader title="Người dạy" icon={User} />
              <TableHeader title="Thời gian" icon={Clock} />
              <TableHeader title="Thời lượng" icon={Clock} />
              <TableHeader title="Hình thức" icon={MapPin} />
              <TableHeader title="Trạng thái" icon={Calendar} align="center" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-red-500 bg-red-50">
                  <AlertTriangle className="h-5 w-5 inline-block mr-2" />
                  **Lỗi tải dữ liệu:** {error}
                </td>
              </tr>
            ) : historyItems.length > 0 ? (
              historyItems.map((item) => (
                <tr key={item.studentSessionId} className="hover:bg-blue-50/50 transition duration-200 ease-in-out">

                  <td className="px-4 py-3 whitespace-nowrap">
                    {/* Hiển thị môn học */}
                    {renderSubjectDisplay(item)}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {item.tutorName}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {/* Hiển thị thời gian */}
                    <p className="font-medium text-gray-800">{moment(item.startTime).format('HH:mm - DD/MM/YYYY')}</p>
                    <p className="text-xs text-gray-500">{moment(item.endTime).format('HH:mm')}</p>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {/* Tính thời lượng */}
                    <span className="font-medium text-blue-600">
                      {estimatedTime(item.endTime, item.startTime)}
                    </span> phút
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {/* Hiển thị địa điểm và hình thức */}
                    <p className="font-medium text-gray-800">{item.location}</p>
                    {/* Chuyển format từ code sang chữ dễ đọc hơn */}
                    <p className="text-xs text-gray-500 mt-0.5 italic">
                      ({item.format === 'OFFLINE' ? 'Trực tiếp' : item.format === 'ONLINE' ? 'Trực tuyến' : item.format})
                    </p>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {/* Hiển thị trạng thái phiên học (sessionStatus) */}
                    <span className={`
                                            px-3 py-1 text-xs leading-5 font-bold rounded-full
                                            ${getStatusInfo(item.sessionStatus).classes}
                                        `}>
                      {getStatusInfo(item.sessionStatus).label}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-lg text-gray-500">
                  <GraduationCap className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  **Chưa có buổi học nào được đăng ký.**
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryLearning;