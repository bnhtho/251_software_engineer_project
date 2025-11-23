import React from "react"; // Bỏ import useState
import { useUser } from "../Context/UserContext";
import Avatar from "./Avatar";
import { Mail, Phone } from "lucide-react";

const ProfileCard = () => {
  const { user } = useUser();
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Người dùng";
  
  const displayData = {
    majorName: user?.majorName || "Chưa cập nhật ngành học",
    phone: user?.phone || "Chưa cập nhật SĐT",
    otherMethodContact: user?.otherMethodContact || "Chưa cập nhật liên lạc",
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-xs mx-auto flex flex-col items-center shadow-sm">
        
        <Avatar 
          name={name}
          className="
            w-24 h-24 rounded-full 
            bg-[#0E7AA0] 
            text-white text-5xl font-bold
            flex items-center justify-center mb-4
          "
        />
        <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
        
        <h3 className="text-sm text-gray-500 mt-1">
          {displayData.majorName}
        </h3>

        <div className="w-full border-t border-gray-200 my-5" />

        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Thông tin liên hệ
        </h3>

        <div className="space-y-3 w-full">
          {/* Số điện thoại */}
          <div className="flex gap-3 items-center">
            <Phone className="h-5 w-5 text-[#0E7AA0] flex-shrink-0" />
            <p className="text-sm text-gray-700 truncate">
              {displayData.phone}
            </p>
          </div>

          {/* Email / Liên hệ khác */}
          <div className="flex gap-3 items-center">
            <Mail className="h-5 w-5 text-[#0E7AA0] flex-shrink-0" />
            <p className="text-sm text-gray-700 truncate" title={displayData.otherMethodContact}>
              {displayData.otherMethodContact}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProfileCard;