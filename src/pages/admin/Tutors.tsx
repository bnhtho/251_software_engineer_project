import React, { useState, useEffect } from "react";
import { User, Fingerprint, Shield, Building2, Activity, Calendar } from "lucide-react";
import axios, { AxiosError } from "axios";
import moment from 'moment';
import Avatar from "../../Components/Avatar";
// 1. Định nghĩa Interface đầy đủ dựa trên code map của bạn
interface TutorData {
  id: number;
  bio: string;
  experienceYears: number;
  rating: number;
  totalSessionsCompleted: number;
  isAvailable: boolean;
  status: string;

  user: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
    hcmutId: string;
    academicStatus: string;
  };
}


const AdminTutorsPending = () => {
  const [loading, setLoading] = useState<boolean>(true);
  // Đổi tên state để tránh nhầm lẫn với interface TutorData
  const [tutorDataList, setTutorDataList] = useState<TutorData[]>([]);

  // Token
  const authToken = localStorage.getItem("authToken");

  // 2. Hàm fetch data
  useEffect(() => {
    const fetchPendingList = async () => {
      if (!authToken) {
        console.log("Lỗi: Không tìm thấy Token.");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get(
          'http://localhost:8081/api/admin/tutor_profiles/pending',
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        // ĐIỂM SỬA QUAN TRỌNG: Lấy dữ liệu từ response.data.content
        const tutorList = response.data.data.content || [];
        setTutorDataList(tutorList);

        console.log("Dữ liệu đã set vào state:", tutorList);


      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          const status = axiosError.response.status;

          if (status === 403) {
            console.log("403: Không có quyền truy cập.");
          } else {
            console.log(`Lỗi API ${status}: ${axiosError.response.statusText}`);
          }
          console.error("Lỗi Response:", axiosError.response.data);
        } else if (axiosError.request) {
          console.log("Lỗi: Không nhận được phản hồi từ server.");
        } else {
          console.log("Lỗi không xác định khi thiết lập request.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingList();
  }, [authToken]);


  // 3. Các hàm Helper (Xử lý hiển thị)
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("DD/MM/YYYY");
  };

  // CSS - Section
  const acceptTutor = "px-4 py-2 text-xs font-bold text-white bg-green-500 rounded-l-md hover:bg-green-600 focus:z-10 focus:ring-2 focus:ring-green-500 focus:bg-green-600 transition-colors duration-200"
  const declineTutor = "px-4 py-2 text-xs font-bold text-white bg-red-500 rounded-r-md hover:bg-red-600 focus:z-10 focus:ring-2 focus:ring-red-500 focus:bg-red-600 transition-colors duration-200 ml-px"

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { label: "Hoạt động", classes: "bg-green-100 text-green-800" };
      case "PENDING":
        return { label: "Chờ duyệt", classes: "bg-yellow-100 text-yellow-800" };
      case "LOCKED":
        return { label: "Đã khóa", classes: "bg-red-100 text-red-800" };
      default:
        return { label: "Không rõ", classes: "bg-gray-100 text-gray-800" };
    }
  };
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">

        {/* Header */}
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <User className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" /> Họ và Tên
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <Fingerprint className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" /> Mã giáo viên
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <Shield className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" /> Vai trò
            </th>

            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <Activity className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" /> Trạng thái
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : tutorDataList?.length > 0 ? (
            tutorDataList.map((item) => (
              <tr
                key={item.user.hcmutId}
                className="transition-colors duration-200 hover:bg-gray-50"
              >
                {/* Avatar + Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.user.lastName} className="w-9 h-9" />
                    <span className="font-medium text-gray-900">
                      {item.user.firstName} {item.user.lastName}
                    </span>
                  </div>
                </td>

                {/* ID */}
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-700">
                  {item.user.hcmutId}
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-lg text-xs font-medium">
                    {item.user.role}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusInfo(item.status).classes}`}>
                    {getStatusInfo(item.status).label}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow-sm transition"
                      onClick={() => alert('Duyệt')}
                    >
                      Duyệt
                    </button>

                    <button
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm transition"
                      onClick={() => alert('Không duyệt')}
                    >
                      Huỷ
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-lg">
                Chưa có người dùng nào trong hệ thống.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );


}
export default AdminTutorsPending;