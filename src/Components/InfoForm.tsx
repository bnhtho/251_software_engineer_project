import React, { useState } from "react";
import { useUser } from "../Context/UserContext";
// use Hook
interface InfoFormProps {
  isEditable?: boolean;
}


// NOTE: Functional Components: Thêm props isEditable kiểu Boolean vào InfoForm.
//
const InfoForm: React.FC<InfoFormProps> = ({ isEditable = false }) => {
  // useUser nơi chứa thông tin của user như id, name
  const { user, isLoading } = useUser();
  // FORMAT DATE
  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split("-");
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
    other_method_contact: user.otherMethodContact || "Chưa có cập nhật",
    phoneNumber: user.phone || "",
  });

  // Hàm để kiểm soát các trường
  const getDisabledState = (fieldName: string): boolean => {
    return !isEditable;
  };
  // ---------------------------------------------
  //  Get class theo trạng thái
  // Base class
  const inputBaseClasses =
    "w-full px-4 py-2 border text-sm rounded-lg transition-all duration-200 ease-in-out";
  // Trạng thái 1 : Cho phép Edit
    const editableClasses =
    "bg-white border-blue-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none shadow-sm";
    // Trạng thái 2 : Không có phép Edit
  const readOnlyClasses =
    "bg-gray-50 border-gray-200 disabled:bg-gray-100 disabled:opacity-100 disabled:cursor-default text-gray-700";
  // -------------------------------------------------

  const getInputClassName = () => {
    let conditionalClasses = "";
    if (isEditable) {
      conditionalClasses = editableClasses;
    } else {
      conditionalClasses = readOnlyClasses;
    }
    return `${inputBaseClasses} ${conditionalClasses}`;
  };

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
              <input
                className={getInputClassName()}
                value={formValue.firstName}
                disabled={getDisabledState("firstName")}
                onChange={(e) =>
                  setFormValue({ ...formValue, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Tên</label>
              <input
                className={getInputClassName()}
                value={formValue.lastName}
                disabled={getDisabledState("formValue.lastName")}
                onChange={(e) =>
                  setFormValue({ ...formValue, lastName: e.target.value })
                }
              />
            </div>
          </div>

          {/* MSSV, Ngày sinh */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">MSSV</label>
              <input
                className={getInputClassName()}
                value={formValue.hcmutId}
                onChange={(e) =>
                  setFormValue({ ...formValue, hcmutId: e.target.value })
                }
                disabled={getDisabledState("formValue.hcmutId")}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Ngày sinh
              </label>
              <input
                className={getInputClassName()}
                value={formatDate(formValue.dob)}
                onChange={(e) =>
                  setFormValue({ ...formValue, dob: e.target.value })
                }
                disabled={getDisabledState("formValue.dob")}
              />
            </div>
          </div>

          {/* Email, Số điện thoại */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input
                className={getInputClassName()}
                value={formValue.other_method_contact}
                onChange={(e) =>
                  setFormValue({
                    ...formValue,
                    other_method_contact: e.target.value,
                  })
                }
                disabled={getDisabledState("formValue.other_method_contact")}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Số điện thoại
              </label>
              <input
                className={getInputClassName()}
                value={formValue.phoneNumber}
                onChange={(e) =>
                  setFormValue({ ...formValue, phoneNumber: e.target.value })
                }
                disabled={getDisabledState("formValue.phoneNumber")}
              />
            </div>
          </div>

          {/* Bio */}
          <div></div>
        </div>
      </>
      {/* ------------------------------------------------------------------ */}
    </div>
    // <div>{formValue.firstName}</div>
  );
};
export default InfoForm;
