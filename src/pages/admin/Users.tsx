import React, { useState, useEffect } from "react";
import { User, Fingerprint, Shield, Building2, Activity, Calendar } from "lucide-react";
import moment from 'moment';

// 1. Interface định nghĩa dữ liệu (dựa trên các đoạn chat trước)
interface UserData {
  hcmutId: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  academicStatus: string;
  dob: string;
  phone: string;
  otherMethodContact: string;
  role: string;
  majorId: number | null;
  majorName: string | null;
  department: string | null;
  statusId: number;
  statusName: string;
  createdDate: string;
  updateDate: string | null;
  lastLogin: string | null;
}

const AdminUsers: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userDataItem, setUserDataItem] = useState<UserData[]>([]); 
  
  const token = localStorage.getItem("authToken") || "";

  // 2. Hàm Fetch và LỌC dữ liệu
  const fetchUserList = async () => {
    try {
      const res = await fetch(`http://localhost:8081/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      // --- LOGIC LỌC ADMIN Ở ĐÂY ---
      // Lấy data gốc, filter những người KHÔNG phải là ADMIN
      const filteredUsers = (data.data || []).filter((u: UserData) => u.role !== 'admin');
      setUserDataItem(filteredUsers);
      console.log("Fetched users: ", filteredUsers);

    } catch(err) {
      console.error("Lỗi khi fetch danh sách user:", err);
    } finally {
      setLoading(false);
    }
  }

  // 3. Helper lấy style cho trạng thái (giống mẫu)
  const getStatusInfo = (statusName: string) => {
    // Chuyển về chữ thường để so sánh cho chính xác
    const status = statusName ? statusName.toLowerCase() : "";

    if (status.includes('hoạt động') || status === 'active') {
      return {
        label: 'Đang hoạt động',
        classes: 'bg-green-100 text-green-800 font-medium',
      };
    } else if (status.includes('khóa') || status === 'banned') {
      return {
        label: 'Đã bị khóa',
        classes: 'bg-red-100 text-red-800 font-medium',
      };
    } else {
      return {
        label: statusName || 'Không xác định',
        classes: 'bg-gray-100 text-gray-800 font-medium',
      };
    }
  };

  // Helper hiển thị Avatar
  const renderAvatar = (user: UserData) => {
    if (user.profileImage) {
      return <img src={user.profileImage} alt="avatar" className="h-8 w-8 rounded-full object-cover mr-3 border border-gray-200" />;
    }
    return (
      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 font-bold text-xs border border-indigo-200">
        {user.lastName.charAt(0)}
      </div>
    );
  };
  
  // 4. UseEffect
  useEffect(() => {
    fetchUserList();
  }, []);

  // 5. Render component
  return (
    <>
    {/* Container chính giống mẫu */}
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
            
            {/* TIÊU ĐỀ BẢNG (THEAD) */}
            <thead className="bg-gray-100 sticky top-0">
                <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <User className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                        Họ và Tên
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <Fingerprint className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                        MSSV/CB
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                         <Shield className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                        Vai Trò
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                         <Building2 className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                        Khoa / Ngành
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <Calendar className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                        Ngày tạo
                    </th>
               
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <Activity className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />
                        Trạng Thái
                    </th>
                </tr>
            </thead>
            
            {/* THÂN BẢNG (TBODY) */}
            <tbody className="divide-y divide-gray-100">
                
                {loading ? (
                   <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                          Đang tải dữ liệu...
                      </td>
                   </tr>
                ) : userDataItem && userDataItem.length > 0 ? (
                    // Map dữ liệu
                    userDataItem.map((item) => (
                        // Áp dụng lớp hover tinh tế giống mẫu
                        <tr key={item.hcmutId} className="hover:bg-indigo-50/30 transition duration-200 ease-in-out">
                            
                            {/* Cột 1: Tên & Avatar */}
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                    {renderAvatar(item)}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.lastName} {item.firstName}</p>
                                        <p className="text-xs text-gray-500">{item.phone}</p>
                                    </div>
                                </div>
                            </td>

                            {/* Cột 2: MSSV */}
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-mono">
                                {item.hcmutId}
                            </td>

                            {/* Cột 3: Vai trò */}
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                    {item.role}
                                </span>
                            </td>

                            {/* Cột 4: Khoa/Ngành */}
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <p className="font-medium text-gray-800">{item.majorName || "---"}</p>
                                <p className="text-xs text-gray-500">{item.department}</p>
                            </td>
                            
                            {/* Cột 5: Ngày tạo (Dùng moment giống mẫu) */}
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <p className="font-medium text-gray-800">{moment(item.createdDate).format('DD/MM/YYYY')}</p>
                            </td>

                            {/* Cột 6: TRẠNG THÁI (Badge giống mẫu) */}
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                                <span className={`
                                    px-2 py-1 
                                    text-xs leading-5 font-semibold rounded-full 
                                    ${getStatusInfo(item.statusName).classes}
                                `}>
                                    {getStatusInfo(item.statusName).label}
                                </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    // Trạng thái nếu không có dữ liệu
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-lg text-gray-500">
                            Chưa có người dùng nào trong hệ thống.
                        </td>
                    </tr>
                )}

            </tbody>
        </table>
    </div>
    </>
  );
};
  
export default AdminUsers;