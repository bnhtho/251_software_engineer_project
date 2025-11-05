import { Mail, Phone, MapPin, GraduationCap, Award, Clock } from "lucide-react";
import Avatar from "./Avatar";
import {useUser} from "../Context/UserContext";
interface ProfileCardProps {
  name: string;
  mssv: string;
  status: string;
  onEditClick?: () => void;
}

interface ContactInfo {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface Achievement {
  icon: React.ElementType;
  label: string;
  description: string;
}

const ProfileCard = ({name, mssv, status, onEditClick }: ProfileCardProps) => {
  const {user} = useUser();
  const contactInfos: ContactInfo[] = [
    { icon: Mail, label: "Email", value: "nva.sdh21@hcmut.edu.vn" },
    { icon: Phone, label: "Số điện thoại", value: "0901 234 567" },
    { icon: GraduationCap, label: "Khóa/Ngành", value: "Khoa Khoa học và Kỹ thuật Máy tính" },
    { icon: MapPin, label: "Cơ sở", value: "Cơ sở 1 - Lý Thường Kiệt" },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-xs">
      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
          {/* avatar */}
        <Avatar name={user?.name ?? ""}/>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
        <p className="text-sm text-gray-500 mb-3">MSSV: {mssv}</p>
        <span className="text-sm text-green-600 font-medium">{status}</span>
      </div>

      {/* Edit Button */}
      <button
        onClick={onEditClick}
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
      >
        ✏️ Chỉnh sửa ảnh
      </button>

      {/* Contact Information */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
        <div className="space-y-4">
          {contactInfos.map((info, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <info.icon className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
