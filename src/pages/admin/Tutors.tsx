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
    <>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <div className="mb-2 flex items-start gap-2">
          <h3 className="text-sm font-semibold text-blue-900">
            Danh sách gia sư đang chờ duyệt
          </h3>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-xs text-blue-800">
          <li>Danh sách dưới đây chứa danh sách những sinh viên đã gửi phiếu đăng ký và đang trạng thái kiểm duyệt <b>(pending).</b></li>
          <li>Admin sẽ xem xét thông tin chi tiết của những sinh viên này.</li>
          <li>Nếu được cấp phép, sinh viên sẽ được cấp quyền <b>Gia sư (tutor).</b></li>

        </ul>

      </div>

      <div className="mt-2 w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">


        {/* min-w-max giữ bảng không bị co lại trên mobile, kích hoạt cuộn ngang */}
        <table className="min-w-max w-full divide-y divide-gray-200">

          {/* Header */}
          <thead className="bg-gray-50 sticky top-0 z-10">
            {/* Giảm kích thước văn bản header trên màn hình nhỏ: text-xs */}
            <tr className="text-gray-600 text-xs font-semibold uppercase tracking-wider">
              {/* Giảm padding trên header: px-4 py-3 thay vì px-6 py-4 */}
              <th className="px-4 py-3 text-left">
                <User className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                Họ tên
              </th>

              <th className="px-4 py-3 text-left">
                <Fingerprint className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                Mã số
              </th>

              <th className="px-4 py-3 text-left">
                <Shield className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                Vai trò hiện tại
              </th>

              <th className="px-4 py-3 text-center">
                <Activity className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                Trạng thái
              </th>

              <th className="px-4 py-3 text-right">
                Hành động
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : tutorDataList?.length > 0 ? (
              tutorDataList.map((item) => (
                <tr
                  key={item.user.hcmutId}
                  className="transition-colors duration-150 hover:bg-gray-50"
                >
                  {/* Avatar + Name */}
                  {/* Giảm padding body: px-4 py-3 thay vì px-6 py-4 */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar
                        // Giảm kích thước Avatar trên mobile
                        name={item.user.lastName}
                        className="w-8 h-8 ring-1 ring-gray-200 rounded-full"
                      />
                      <span className="font-medium text-gray-900">
                        {item.user.firstName} {item.user.lastName}
                      </span>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-gray-700">
                    {item.user.hcmutId}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-md border bg-blue-50 text-blue-700 border-blue-200">
                      {item.user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusInfo(item.status).classes}`}
                    >
                      {getStatusInfo(item.status).label}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {/* Thay đổi nhỏ để sử dụng không gian hiệu quả hơn */}
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg shadow-sm transition" // Giảm padding nút
                        onClick={() => alert('Duyệt')}
                      >
                        Duyệt
                      </button>

                      <button
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg shadow-sm transition" // Giảm padding nút
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
    </>
  );



}
export default AdminTutorsPending;