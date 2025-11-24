import React, { useState, useEffect, useCallback } from "react";
import { User, Fingerprint, Shield, Building2, Activity, Calendar, Save, X, Edit } from "lucide-react";
import moment from 'moment';
import axios from "axios";
// ... (Interface UserData và các Helper functions: getStatusInfo, renderAvatar, formatDate giữ nguyên) ...

interface UserData {
  id: string;
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

const getStatusInfo = (statusName: string) => {
    const status = statusName ? statusName.toLowerCase() : "";
    if (status.includes('hoạt động') || status === 'ACTIVE' || status === "active") {
      return { label: 'Đang hoạt động', classes: 'bg-green-100 text-green-800 font-medium' };
    } else if (status.includes('khóa') || status === 'INACTIVE' || status === 'inactive') {
      return { label: 'Đã bị khóa', classes: 'bg-red-100 text-red-800 font-medium' };
    } else {
      return { label: statusName || 'Không xác định', classes: 'bg-gray-100 text-gray-800 font-medium' };
    }
};

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

// Hàm định dạng ngày tháng (thêm vào scope của AdminUsers nếu cần)
const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return moment(dateString).format('DD/MM/YYYY');
};


// -----------------------------------------------------------

const AdminUsers: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userDataItem, setUserDataItem] = useState<UserData[]>([]); 
  
  // State MỚI để theo dõi hàng nào đang chỉnh sửa
  const [editingId, setEditingId] = useState<string | null>(null); 
  // State MỚI để giữ dữ liệu tạm thời khi đang chỉnh sửa
  const [editFormData, setEditFormData] = useState<Partial<UserData>>({}); 

  const token = localStorage.getItem("authToken") || "";

  // Hàm Fetch Dữ liệu (Dùng useCallback để ổn định)
  const fetchUserList = useCallback(async () => {
    // ... (logic fetch giữ nguyên)
    try {
      const res = await fetch(`http://localhost:8081/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      const filteredUsers = (data.data || []).filter((u: UserData) => u.role !== 'admin');
      setUserDataItem(filteredUsers);

    } catch(err) {
      console.error("Lỗi khi fetch danh sách user:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // -----------------------------------------------------------
  // 1. LOGIC XỬ LÝ INLINE EDITING
  // -----------------------------------------------------------

  const handleEditClick = (user: UserData) => {
    
    // -----------
    setEditingId(user.hcmutId);
    setEditFormData({ 
      // Chỉnh sửa vai trò
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        statusName: user.statusName,
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({
        ...prevData,
        [name]: value,
    }));
  };

  const handleUserUpdate = (updatedUser: UserData) => {
    setUserDataItem(prevItems => 
      prevItems.map(user => 
        user.hcmutId === updatedUser.hcmutId ? updatedUser : user
      )
    );
    handleCancelClick(); // Đóng chế độ chỉnh sửa
  };


  const handleSaveClick = async () => {
    
    if (!editingId) return;
    const payload = {
        id: editFormData.id,
        role: editFormData.role,
        statusName: editFormData.statusName,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
    };
    
    try {
        const oldUser = userDataItem.find(u => u.hcmutId === editingId);
        
        if (!oldUser) {
            console.error("User not found for editingId", editingId);
            alert("Người dùng không tồn tại");
            return;
        }
        const userId = oldUser?.id;
        const userRole = oldUser?.role 
        let editURL: string;
        if (userRole === "tutor")
        {
            editURL = `http://localhost:8081/admin/tutors/${userId}`
        }
        else if (userRole === "student") 
        {
            editURL = `http://localhost:8081/admin/students/${userId}` 
        } else {
            console.error("Vai trò không hợp lệ:", userRole);
            return; 
        }
        console.log("Vai trò được chọn (editFormData.role):", editFormData.role);
        
        const response = await axios.put(
          editURL,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data)
        const updatedUser: UserData = { ...oldUser, ...payload } as UserData;
        handleUserUpdate(updatedUser);
        
    } catch (error) {
        console.error("Lỗi cập nhật user:", error);
        alert("Cập nhật thất bại!");
    }
  };


  // -----------------------------------------------------------
  // 2. COMPONENT INLINE EDITING
  // -----------------------------------------------------------

  const EditRowFields = ({ user }: { user: UserData }) => {
    return (
        <>
            <td className="px-4 py-3 whitespace-nowrap text-sm">
                <select 
                    name="role"
                    value={editFormData.role || user.role} 
                    onChange={handleFormChange}
                    className="p-1 border rounded text-gray-700 bg-white"
                >
                    <option value="tutors">Gia Sư</option>
                    <option value="students">Sinh Viên</option>
                </select>
            </td>

            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                <p className="font-medium text-gray-800">{user.majorName || "---"}</p>
                <p className="text-xs text-gray-500">{user.department}</p>
            </td>
            
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                <p className="font-medium text-gray-800">{formatDate(user.createdDate)}</p>
            </td>

            <td className="px-4 py-3 whitespace-nowrap text-center">
                <select 
                    name="statusName"
                    value={editFormData.statusName || user.statusName} 
                    onChange={handleFormChange}
                    className={`p-1 border rounded text-xs text-center bg-white ${getStatusInfo(editFormData.statusName || user.statusName).classes}`}
                >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="INACTIVE">Bị khóa</option>
                </select>
            </td>
        </>
    );
  };
  
  // -----------------------------------------------------------
  // 3. RENDER CHÍNH
  // -----------------------------------------------------------

  useEffect(() => {
    fetchUserList();
  }, [fetchUserList]);

  return (
    <>
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
            
            {/* TIÊU ĐỀ BẢNG (Giữ nguyên) */}
            <thead className="bg-gray-100 sticky top-0">
                <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"><User className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />Họ và Tên</th> 
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"><Fingerprint className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />MSSV/CB</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"><Shield className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />Vai Trò</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"><Calendar className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />Ngày tạo</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"><Activity className="h-4 w-4 inline-block mr-1 text-[#0E7AA0]" />Trạng Thái</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
                
                {loading ? (
                   <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">Đang tải dữ liệu...</td></tr>
                ) : userDataItem && userDataItem.length > 0 ? (
                    userDataItem.map((item) => {
                        const isEditing = editingId === item.hcmutId;
                        
                        return (
                        <tr key={item.hcmutId} className={`transition duration-200 ${isEditing ? 'bg-yellow-50/50' : 'hover:bg-indigo-50/30'}`}>
                            
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                    {renderAvatar(item)}
                                    <div><p className="text-sm font-medium text-gray-900">{item.firstName} {item.lastName}</p><p className="text-xs text-gray-500">{item.phone}</p></div>
                                </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-mono">{item.hcmutId}</td>

                            {isEditing ? (
                                <EditRowFields user={item} />
                            ) : (
                                <>
                                    {/* Cột 3: Vai trò (Hiển thị) */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">{item.role}</span>
                                    </td>
                                    
                                    {/* Cột 4: Ngày tạo (Hiển thị) */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                        <p className="font-medium text-gray-800">{formatDate(item.createdDate)}</p>
                                    </td>
                                    {/* Cột 5: TRẠNG THÁI (Hiển thị) */}
                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                        <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusInfo(item.statusName).classes}`}>
                                            {getStatusInfo(item.statusName).label}
                                        </span>
                                    </td>
                                </>
                            )}
                            
                            {/* Cột 7: Hành động */}
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                                {isEditing ? (
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={handleSaveClick} className="p-1 rounded text-green-600 hover:bg-green-100" title="Lưu"><Save className="h-4 w-4" /></button>
                                        <button onClick={handleCancelClick} className="p-1 rounded text-red-600 hover:bg-red-100" title="Hủy"><X className="h-4 w-4" /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => handleEditClick(item)} className="p-1 rounded text-indigo-600 hover:bg-indigo-100" title="Chỉnh sửa"><Edit className="h-4 w-4" /></button>
                                )}
                            </td>
                        </tr>
                    );
                })
                ) : (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-lg text-gray-500">Chưa có người dùng nào trong hệ thống.</td></tr>
                )}

            </tbody>
        </table>
    </div>
    </>
  );
};
  
export default AdminUsers;