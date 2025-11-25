import React, { useState, useEffect } from "react";
import { User, Fingerprint, Shield, Building2, Activity, Calendar, Save, X, Edit } from "lucide-react";
import moment from 'moment';

// 1. Định nghĩa Interface đầy đủ dựa trên code map của bạn
interface UserData {
  hcmutId: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  createdDate: string; // ISO date string
  statusName: string;
  avatar?: string | null;
}

// Component giả lập form edit (vì code gốc không có)
const EditRowFields = ({ user }: { user: UserData }) => (
  <>
    <td colSpan={3} className="px-4 py-3 text-sm text-gray-500 italic bg-yellow-50">
      Đang chỉnh sửa {user.firstName}... (Component EditRowFields)
    </td>
  </>
);

const AdminTutorsPending = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userDataItem, setUserDataItem] = useState<UserData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 2. Hàm giả lập fetch data
  useEffect(() => {
    // Giả lập gọi API mất 1 giây
    setTimeout(() => {
      const MOCK_DATA: UserData[] = [
        {
          hcmutId: "GV001",
          firstName: "Nguyễn Văn",
          lastName: "An",
          phone: "0901234567",
          role: "Giáo viên",
          createdDate: "2023-11-20T10:00:00Z",
          statusName: "ACTIVE",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          hcmutId: "GV002",
          firstName: "Trần Thị",
          lastName: "Bình",
          phone: "0912345678",
          role: "Trợ giảng",
          createdDate: "2023-12-05T08:30:00Z",
          statusName: "PENDING",
          avatar: null,
        },
        {
          hcmutId: "GV003",
          firstName: "Lê Hoàng",
          lastName: "Dũng",
          phone: "0987654321",
          role: "Giáo viên",
          createdDate: "2023-10-15T14:20:00Z",
          statusName: "LOCKED",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          hcmutId: "GV003",
          firstName: "Lê Hoàng",
          lastName: "Dũng",
          phone: "0987654321",
          role: "Giáo viên",
          createdDate: "2023-10-15T14:20:00Z",
          statusName: "LOCKED",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          hcmutId: "GV003",
          firstName: "Lê Hoàng",
          lastName: "Dũng",
          phone: "0987654321",
          role: "Giáo viên",
          createdDate: "2023-10-15T14:20:00Z",
          statusName: "LOCKED",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
        {
          hcmutId: "GV003",
          firstName: "Lê Hoàng",
          lastName: "Dũng",
          phone: "0987654321",
          role: "Giáo viên",
          createdDate: "2023-10-15T14:20:00Z",
          statusName: "LOCKED",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        },
      ];
      setUserDataItem(MOCK_DATA);
      setLoading(false);
    }, 1000);
  }, []);

  // 3. Các hàm Helper (Xử lý hiển thị)
  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD/MM/YYYY");
  };
  // CSS - Section
  const acceptTutor = "px-4 py-2 text-xs font-bold text-white bg-green-500 rounded-l-md hover:bg-green-600 focus:z-10 focus:ring-2 focus:ring-green-500 focus:bg-green-600 transition-colors duration-200"

  const declineTutor = "px-4 py-2 text-xs font-bold text-white bg-red-500 rounded-r-md hover:bg-red-600 focus:z-10 focus:ring-2 focus:ring-red-500 focus:bg-red-600 transition-colors duration-200 ml-px"
  // -------------
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

  const renderAvatar = (item: UserData) => {
    if (item.avatar) {
      return <img className="h-10 w-10 rounded-full mr-3 object-cover border border-gray-200" src={item.avatar} alt="" />;
    }
    return (
      <div className="h-10 w-10 rounded-full mr-3 bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
        {item.firstName.charAt(0)}{item.lastName.charAt(0)}
      </div>
    );
  };

  // 4. Các hàm xử lý hành động
  const handleEditClick = (item: UserData) => {
    setEditingId(item.hcmutId);
  };

  const handleSaveClick = () => {
    alert("Đã lưu (Logic API call tại đây)");
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  return (
    <>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          {/* TIÊU ĐỀ BẢNG */}
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <User className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />Họ và Tên
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <Fingerprint className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />Mã giáo viên
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <Shield className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />Vai Trò
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <Calendar className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />Ngày tạo
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <Activity className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />Trạng thái
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : userDataItem && userDataItem.length > 0 ? (

              userDataItem.map((item) => {
                const isEditing = editingId === item.hcmutId;

                return (
                  <tr key={item.hcmutId} className={`transition duration-200 ${isEditing ? 'bg-yellow-50/50' : 'hover:bg-indigo-50/30'}`}>

                    {/* Cột 1: Avatar + Tên */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderAvatar(item)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.firstName} {item.lastName}</p>
                          <p className="text-xs text-gray-500">{item.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: ID */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-mono">{item.hcmutId}</td>

                    {/* Logic hiển thị hoặc chỉnh sửa */}
                    {isEditing ? (
                      <EditRowFields user={item} />
                    ) : (
                      <>
                        {/* Cột 3: Vai trò */}
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">{item.role}</span>
                        </td>

                        {/* Cột 4: Ngày tạo */}
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <p className="font-medium text-gray-800">{formatDate(item.createdDate)}</p>
                        </td>

                        {/* Cột 5: Trạng thái */}
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusInfo(item.statusName).classes}`}>
                            {getStatusInfo(item.statusName).label}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Cột 6: Hành động */}
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="inline-flex rounded-md shadow-sm" role="group">
                        {/* Nút Duyệt */}
                        <button
                          type="button"
                          className={acceptTutor}
                          onClick={() => { alert("Duyệt") }}
                        >
                          Duyệt
                        </button>
                        {/* Nút Huỷ */}
                        <button
                          type="button"
                          className={declineTutor}
                          onClick={() => { alert("Không duyệt") }}
                        >
                          Huỷ
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })

            ) : (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-lg text-gray-500">Chưa có người dùng nào trong hệ thống.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminTutorsPending;