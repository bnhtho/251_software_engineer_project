import React, { useState } from "react";
import { useUser } from "../Context/UserContext";
const InfoForm: React.FC = () => {
  const { user, isLoading } = useUser();
  const [FormdefaultValue] = useState({
      hcmutId: user?.hcmutId || "",
    other_method_contact: user?.otherMethodContact || "Chưa cập nhật thông tin liên lạc",
    phoneNumber: user?.phone || "",
    
  })
    const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return <div>
    <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-gray-900 mb-4">Thông tin chi tiết</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">Họ và tên đệm</label>
                      <input
                        type="text"
                        defaultValue={user?.firstName}  
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">Tên</label>
                      <input
                        type="text"
                        defaultValue={user?.lastName}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">MSSV</label>
                      <input
                        type="text"
                        defaultValue= {user?.hcmutId}
                        disabled
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">Ngày sinh</label>
                      <input
                        type="date"
                        defaultValue={user?.dob}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.otherMethodContact}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">Số điện thoại</label>
                      <input
                        type="tel"
                        defaultValue={user?.phone}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>


                  <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50">
                      Hủy
                    </button>
                    <button className="px-4 py-2 bg-cyan-600 text-white text-sm rounded-md hover:bg-cyan-700"
                    onClick={()=>{alert("Helllo")}}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
  </div>

  </div>;
};

export default InfoForm;
