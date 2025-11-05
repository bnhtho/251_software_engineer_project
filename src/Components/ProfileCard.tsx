import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";
import Avatar from "./Avatar";
import {useUser} from "../Context/UserContext";
import React from "react"; // Ensure React is imported if using functional components

interface ProfileCardProps {
  name: string;
  mssv: string;
  onEditClick?: () => void;
}

interface ContactInfo {
  icon: React.ElementType;
  label: string;
  value: string;
}


const ProfileCard = ({name, mssv, onEditClick }: ProfileCardProps) => {
  const {user} = useUser();
  const contactInfos: ContactInfo[] = [
    { icon: Mail, label: "Email", value:"nva.sdh21@hcmut.edu.vn" }, // Use user data if available
    { icon: Phone, label: "Số điện thoại", value: "0901 234 567" },
    { icon: GraduationCap, label: "Khóa/Ngành", value: "Khoa Khoa học và Kỹ thuật Máy tính" },
    { icon: MapPin, label: "Cơ sở", value: "Cơ sở 1 - Lý Thường Kiệt" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-xs">
      {/* Avatar Section */}
      <div className="flex flex-col items-center">
        {/* Pass all desired styling directly to the Avatar component */}
        <Avatar 
          name={user?.name ?? name} // Use user name from context or prop
          className="
            w-24 h-24 rounded-full 
            bg-[#0E7AA0] 
            text-white text-5xl font-bold
            flex items-center justify-center mb-4
          "
        />
        
        <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
        <p className="text-sm text-gray-500 mb-3">MSSV: {mssv}</p>
      </div>

      {/* Edit Button */}
      <button
        onClick={onEditClick}
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
      >
        Chỉnh sửa ảnh
      </button>

      {/* Contact Information */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
        <div className="space-y-4">
          {contactInfos.map((info, idx) => {
            const Icon = info.icon;
            return (
              <div key={idx} className="flex gap-3 items-start"> 
                <Icon className="h-5 w-5 text-[#0E7AA0] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{info.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;