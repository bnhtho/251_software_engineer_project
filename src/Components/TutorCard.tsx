import { MessageCircle, Calendar, Star } from "lucide-react";
import Avatar from "./Avatar";

interface TutorCardProps {
    id: number;
    name: string;
    title: string; // e.g., "Tiến sĩ", "Phó Giáo sư, Tiến sĩ"
    department: string;
    description: string;
    specializations: string[];
    rating: number;
    reviewCount: number;
    studentCount: number;
    experienceYears: number;
    isAvailable: boolean;
    onMessage?: (tutorId: number) => void;
    onSchedule?: (tutorId: number) => void;
}

const TutorCard = ({
    id,
    name,
    title,
    department,
    description,
    specializations,
    rating,
    reviewCount,
    studentCount,
    experienceYears,
    isAvailable,
    onMessage,
    onSchedule,
}: TutorCardProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow relative">
            {/* Availability Badge */}
            {isAvailable && (
                <span className="absolute top-4 right-4 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Còn chỗ
                </span>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                {/* Avatar Section */}
                <div className="shrink-0">
                    <Avatar name={name} className="w-16 h-16 text-2xl" />
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    {/* Name and Title */}
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                        <p className="text-sm text-gray-600">{title}</p>
                    </div>

                    {/* Department */}
                    <p className="text-sm text-gray-700 mb-3">{department}</p>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

                    {/* Specializations Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {specializations.map((spec, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-[#0E7AA0] text-white text-xs font-medium rounded-full"
                            >
                                {spec}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold text-gray-900">{rating}</span>
                            <span className="text-gray-500">({reviewCount} đánh giá)</span>
                        </div>
                        <div>
                            <span className="font-medium">{studentCount}</span> học viên
                        </div>
                        <div>
                            <span className="font-medium">{experienceYears}</span> năm
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onMessage?.(id)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Nhắn tin
                        </button>
                        <button
                            onClick={() => onSchedule?.(id)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0E7AA0] text-white rounded-md text-sm font-medium hover:bg-[#0a5f7a] transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                            Đặt lịch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorCard;
