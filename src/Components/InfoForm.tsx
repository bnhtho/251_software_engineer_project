import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { FormEvent } from "react";
import { useUser } from "../Context/UserContext";
// import { useProfileUpdate } from ; // Import hook mới
import { useProfileUpdate } from "../hooks/updateProfile"
interface ProfileFormData {
  hcmutId: string;
  firstName: string;
  lastName: string;
  dob: string;
  otherMethodContact: string;
  phone: string;
}

// Giá trị mặc định
const defaultState: ProfileFormData = {
  hcmutId: "",
  firstName: "",
  lastName: "",
  dob: "",
  otherMethodContact: "",
  phone: "",
};

const InfoForm: React.FC = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const { updateProfile, isSubmitting } = useProfileUpdate(); // Sử dụng hook custom

  const [formData, setFormData] = useState<ProfileFormData>(defaultState);
  const [initialFormData, setInitialFormData] = useState<ProfileFormData>(defaultState);

  // 1. Sync data từ User Context vào Form & Initial Data
  useEffect(() => {
    if (user) {
      // Chuẩn hóa dữ liệu từ Context sang Form
      const mapped: ProfileFormData = {
        hcmutId: user.hcmutId || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        // Đảm bảo ngày tháng là định dạng YYYY-MM-DD
        dob: user.dob ? user.dob.toString().substring(0, 10) : "",
        otherMethodContact: user.otherMethodContact || "",
        phone: user.phone || "",
      };

      setFormData(mapped);
      setInitialFormData(mapped);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Tối ưu hóa: Kiểm tra xem form có thay đổi so với dữ liệu ban đầu không
  const isFormChanged = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const result = await updateProfile(formData);

      // Nếu cập nhật thành công, set lại initialFormData để form không còn được xem là 'đã thay đổi'
      if (result?.success && result.newInitialData) {
        setInitialFormData(result.newInitialData);
      }
    },
    [formData, updateProfile]
  );

  // Hàm Reset form về trạng thái ban đầu
  const handleReset = useCallback(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  if (isUserLoading) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
            Thông tin chi tiết
          </h3>

          <div className="space-y-6">
            {/* ... (Các trường input giữ nguyên) ... */}

            {/* Hàng 1: Họ tên */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Họ và tên đệm</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                />
              </div>
            </div>

            {/* Hàng 2: MSSV & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">MSSV</label>
                <input
                  type="text"
                  name="hcmutId"
                  value={formData.hcmutId}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                />
              </div>
            </div>

            {/* Hàng 3: Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email liên hệ khác</label>
                <input
                  type="email"
                  name="otherMethodContact"
                  value={formData.otherMethodContact}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Nhập số điện thoại..."
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                />
              </div>
            </div>

            {/* Buttons Action */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleReset} // Dùng handleReset
                disabled={isSubmitting || !isFormChanged} // Tắt nếu không có thay đổi
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition duration-150 disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-cyan-600 text-white font-medium text-sm rounded-lg hover:bg-cyan-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InfoForm;