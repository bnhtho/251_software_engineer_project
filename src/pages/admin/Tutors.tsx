import React, { useState, useEffect } from "react";
import { User, Fingerprint, Shield, Activity } from "lucide-react";
import axios, { AxiosError } from "axios";
import Avatar from "../../Components/Avatar";
import { toast, ToastContainer } from "react-toastify";

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
  const [tutorDataList, setTutorDataList] = useState<TutorData[]>([]);

  const authToken = localStorage.getItem("authToken");

  // -----------------------------
  // FETCH DATA
  // -----------------------------
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
          "http://localhost:8081/admin/tutor/pending",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const tutorList: TutorData[] = response.data.data.content || [];
        const filtered = tutorList.filter(
          (t) => t.user.role === "STUDENT"
        );

        setTutorDataList(filtered);
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          console.log(`Lỗi API ${axiosError.response.status}`);
        } else {
          console.log(err)
          console.log("Lỗi kết nối server");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingList();
  }, [authToken]);

  // -----------------------------
  // STATUS UI
  // -----------------------------
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

  // -----------------------------
  // HANDLE APPROVE
  // -----------------------------
  const handleAccept = async (id: number) => {
    try {
      await axios.patch(
        `http://localhost:8081/admin/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.success(`Duyệt thành công ID: ${id}`);
      setTutorDataList((prev) => prev.filter((item) => item.user.id !== id));
    } catch (error) {
      toast.error("Có lỗi khi duyệt!");
      console.log(error);
    }
  };

  // // -----------------------------
  // HANDLE Decline
  // -----------------------------
  const handleDecline = async (id: number) => {
    try {
      await axios.patch(
        `http://localhost:8081/admin/${id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      toast.warning(`Đã từ chối ID: ${id}`);

      setTutorDataList((prev) => prev.filter((item) => item.user.id !== id));
    } catch (error) {
      toast.error("Có lỗi khi từ chối!");
      console.log(error);
    }
  };
  return (
    <>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-900">
          Danh sách sinh viên đang chờ duyệt
        </h3>
        <ul className="list-disc space-y-1 pl-6 text-xs text-blue-800">
          <li>Danh sách đang ở trạng thái <b>pending</b>.</li>
          <li>Chỉ hiển thị sinh viên đăng ký làm <b>Tutor</b>.</li>
          <li>Duyệt thành công → dòng sẽ biến mất ngay.</li>
        </ul>
      </div>

      <div className="mt-2 w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-max w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-gray-600 text-xs font-semibold uppercase">
              <th className="px-4 py-3 text-left">
                <User className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" /> Họ tên
              </th>
              <th className="px-4 py-3 text-left">
                <Fingerprint className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" /> Mã số
              </th>
              <th className="px-4 py-3 text-left">
                <Shield className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" /> Vai trò hiện tại
              </th>
              <th className="px-4 py-3 text-center">
                <Activity className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" /> Trạng thái
              </th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : tutorDataList.length > 0 ? (
              tutorDataList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={item.user.lastName}
                        className="w-8 h-8 rounded-full ring-1 ring-gray-200"
                      />
                      <span className="font-medium text-gray-900">
                        {item.user.firstName} {item.user.lastName}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 font-mono">{item.user.hcmutId}</td>

                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {item.user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusInfo(item.status).classes}`}
                    >
                      {getStatusInfo(item.status).label}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg"
                      onClick={() => handleAccept(item.user.id)}
                    >
                      Duyệt
                    </button>
                  </td>
                  {/* --------------- Handle Decline */}
                  <td className="px-4 py-3 text-right">
                    <button
                      className="px-2 py-1 bg-red-500 hover:bg-green-600 text-white text-xs rounded-lg"
                      onClick={() => handleDecline(item.user.id)}
                    >
                      Huỷ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500 text-lg"
                >
                  Không có sinh viên nào đang chờ duyệt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </>
  );
};

export default AdminTutorsPending;
