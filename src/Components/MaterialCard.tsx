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

    const handleViewDetail = () => {
        // Implement view detail functionality
        console.log('View detail for:', material.id);
        // Có thể navigate đến trang chi tiết hoặc mở modal
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {material.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {material.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{material.author}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{material.date}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{material.views} lượt xem</span>
                        </div>

                        <div className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(material.category)}`}>
                            {material.category}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleViewDetail}
                    className="group flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    <Eye className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Xem chi tiết</span>
                </button>
            </div>
        </div>
    );
}
