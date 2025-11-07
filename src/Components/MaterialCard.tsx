import { FileText, User, Calendar, Eye } from 'lucide-react';
import type { Material } from '../page/materials/types/material.types';

interface MaterialCardProps {
    material: Material;
}

export default function MaterialCard({ material }: MaterialCardProps) {
    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Toán học': 'bg-blue-100 text-blue-700',
            'Vật lý': 'bg-purple-100 text-purple-700',
            'Tin học': 'bg-cyan-100 text-cyan-700',
            'Hóa học': 'bg-green-100 text-green-700',
            'Cơ khí': 'bg-orange-100 text-orange-700',
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-7 h-7 text-blue-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title & Category */}
                    <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {material.title}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(material.category)}`}>
                            {material.category}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {material.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{material.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{material.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{material.views} lượt xem</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
}
