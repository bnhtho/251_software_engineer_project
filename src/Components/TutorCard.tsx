import { Star } from "lucide-react";
import Avatar from "./Avatar";

interface TutorCardProps {
    name: string;
    lastName: string;
    title: string;
    department: string;
    description: string;
    specializations: string[];
    rating: number;
    reviewCount: number;
    studentCount: number;
    experienceYears: number;
    isAvailable: boolean;
}

const TutorCard = ({
    name,
    lastName,
    title,
    department,
    description,
    specializations,
    rating,
    reviewCount,
    experienceYears,
    isAvailable,
}: TutorCardProps) => {
    return (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow relative max-w-sm mx-auto p-6">
            {/* Availability Badge */}
            {isAvailable && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Còn chỗ
                </span>
            )}

            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
                <Avatar
                    name={`${name} ${lastName}`}
                    className="w-24 h-24 rounded-full text-3xl bg-[#0E7AA0] text-white flex items-center justify-center shadow-md"
                />
            </div>

            {/* Name & Title */}
            <div className="text-center mb-2">
                <h3 className="text-xl font-bold text-gray-900">{name} {lastName}</h3>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-sm text-gray-500 mt-1">{department}</p>
            </div>

            {/* Description */}
            {description && (
                <p className="text-sm text-gray-700 mb-4 text-center line-clamp-3">
                    {description}
                </p>
            )}

            {/* Specializations / Subjects Tags */}
            {specializations.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {specializations.map((spec, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-[#0E7AA0] text-white text-xs font-medium rounded-full"
                        >
                            {spec}
                        </span>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="flex justify-around text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900">{rating}</span>
                    <span className="text-gray-500">({reviewCount})</span>
                </div>

                <div>
                    <span className="font-medium">Kinh nghiệm:
                        <b> {experienceYears} </b></span> năm
                </div>
            </div>

        </div>
    );
};

export default TutorCard;
