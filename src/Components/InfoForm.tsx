import React, { useState, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import axios from "axios";
// Correctly import the useUser hook
import { useUser} from "../Context/UserContext"; 
// import toast from "react-hot-toast";
import toast, { Toaster } from 'react-hot-toast';
interface ProfileFormData {
  hcmutId: string;
  firstName: string;
  lastName: string;
  dob: string;
  otherMethodContact: string;
  phoneNumber: string; // Used for the input field
}

const InfoForm: React.FC = () => {
  const { 
    user, 
    isLoading: isUserLoading, 
    setUserDirectly 
  } = useUser(); 

  const [formData, setFormData] = useState<ProfileFormData>({
    hcmutId: "",
    firstName: "",
    lastName: "",
    dob: "",
    otherMethodContact: "",
    phoneNumber: "",
  });

  const [initialFormData, setInitialFormData] = useState<ProfileFormData>({
    hcmutId: "",
    firstName: "",
    lastName: "",
    dob: "",
    otherMethodContact: "",
    phoneNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (user) {
      const mapped: ProfileFormData = {
        hcmutId: user.hcmutId || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dob: user.dob || "",
        otherMethodContact: user.otherMethodContact || "",
        phoneNumber: user.phone || "", 
      };

      setFormData(mapped);
      setInitialFormData(mapped);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!user?.id) return;

      const token = localStorage.getItem("authToken");
      if (!token) return;

      setIsSubmitting(true);

      try {
        // Prepare the payload for the API
        const apiPayload = {
            hcmutId: formData.hcmutId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dob: formData.dob,
            otherMethodContact: formData.otherMethodContact,
            phone: formData.phoneNumber, 
        };

        await axios.put(
          `http://localhost:8081/students/profile/${user.id}`,
          apiPayload, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setInitialFormData(formData);
        
        const updatedUser = {
            ...user, 
            ...apiPayload, 
        };
        
        toast.success('Cập nhật thông tin thành công!');
        setUserDirectly(updatedUser); 

      } catch (err) {
        console.error("Update failed", err);
        toast.error('Cập nhật thất bại. Vui lòng thử lại.');
        
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, user, setUserDirectly] 
  );
// ------------
//  If the form is not changed -> disable the input
// ------------
  const isFormUnchanged = 
    formData.firstName !== initialFormData.firstName ||
    formData.lastName !== initialFormData.lastName ||
    formData.dob !== initialFormData.dob ||
    formData.otherMethodContact !== initialFormData.otherMethodContact ||
    formData.phoneNumber !== initialFormData.phoneNumber;

  const isSaveButtonDisabled = isSubmitting || !isFormUnchanged; 
  
  if (isUserLoading) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }

  // ---------------------------
  // Loading state return
  // ---------------------------
  if (isUserLoading) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }

  // ---------------------------
  // Normal return
  // ---------------------------
  return (
    <form onSubmit={handleSubmit} className="">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
            Thông tin chi tiết
          </h3>

          <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Họ và tên đệm</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg 
                    focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg 
                    focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* MSSV + DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">MSSV</label>
                <input
                  type="text"
                  name="hcmutId"
                  value={formData.hcmutId}
                  readOnly
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg 
                     bg-gray-100 text-gray-500"
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
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg 
                    focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="otherMethodContact"
                  value={formData.otherMethodContact}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg 
                    focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg 
                    focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setFormData(initialFormData)}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium text-sm 
                  rounded-lg hover:bg-gray-50 transition duration-150"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSaveButtonDisabled}
                className="px-6 py-2 bg-cyan-600 text-white font-medium text-sm 
                  rounded-lg hover:bg-cyan-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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
