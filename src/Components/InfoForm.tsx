import React, { useState } from "react";
import { useUser } from "../Context/UserContext";
// use Hook

const InfoForm = () => {

  // useUser nơi chứa thông tin của user như id, name
  const { user, isLoading } = useUser();
  // FORMAT DATE
  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    let newDate = `${day}/${month}/${year}`;
    return newDate;
  };
  // Check  isLoading thì return loading
  if (isLoading) {
    return <div>Đang tải thông tin...</div>;
  }
  if (!user) {
    return <div>Lỗi: Không tìm thấy người dùng.</div>;
  }
  const [formValue, setFormValue] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    dob: user.dob || "",
    hcmutId: user.hcmutId || "",
    other_method_contact: user.otherMethodContact|| "Chưa có cập nhật",
    phoneNumber: user.phone || "",
    bio: user.bio || "",
  });
  return (
    <div>
      <>
        {/* --------------------------------------------------------------- */}
          <div className="space-y-4">
            {/* Họ và tên đệm, Tên */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Họ và tên đệm
                </label>
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                  {formValue.firstName}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Tên</label>
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                  {formValue.lastName}
                </div>
              </div>
            </div>

            {/* MSSV, Ngày sinh */}
            <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">MSSV</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {formValue.hcmutId}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Ngày sinh</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {/* {formValue.dob}  */}
                                {formatDate(formValue.dob)}
                                {/* Function */}
                            </div>
                        </div>
                    </div>

            {/* Email, Số điện thoại */}
            <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Email</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {formValue.other_method_contact}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Số điện thoại</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {formValue.phoneNumber}
                            </div>
                        </div>
                    </div>

            {/* Bio */}
            <div>
                        <label className="block text-sm text-gray-600 mb-2">Giới thiệu bản thân</label>
                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 min-h-[100px]">
                            {formValue.bio}
                        </div>
                    </div>
          </div>
        </>
        {/* ------------------------------------------------------------------ */}
    </div>
    // <div>{formValue.firstName}</div>
  );
};
export default InfoForm;
