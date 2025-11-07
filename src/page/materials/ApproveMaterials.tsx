import { useState } from 'react';
import { FileText, User, Calendar, Link as LinkIcon, Check, X } from 'lucide-react';

interface PendingMaterial {
    id: string;
    title: string;
    category: string;
    description: string;
    author: string;
    email: string;
    date: string;
    link: string;
    views: number;
}

export default function ApproveMaterials() {
    const [materials, setMaterials] = useState<PendingMaterial[]>([
        {
            id: '1',
            title: 'Bài tập Giải tích nâng cao',
            category: 'Toán học',
            description: 'Tài liệu đầy đủ về Giải tích 1, bao gồm đạo hàm, tích phân và ứng dụng',
            author: 'TS. Nguyễn Văn A',
            email: 'nguyenvana@hcmut.edu.vn',
            date: '25/10/2025',
            link: 'https://drive.google.com/file/d/abc123',
            views: 0
        },
        {
            id: '2',
            title: 'Hướng dẫn thực hành Vật lý cơ năm thái đỉnh',
            category: 'Vật lý',
            description: 'Tài liệu hướng dẫn thực hành vật lý đại cương',
            author: 'ThS. Trần Thị B',
            email: 'tranthib@hcmut.edu.vn',
            date: '24/10/2025',
            link: 'https://drive.google.com/file/d/def456',
            views: 0
        },
        {
            id: '3',
            title: 'Bài giảng Cơ học kỹ thuật - Động học',
            category: 'Cơ khí',
            description: 'Slide bài giảng động học cho sinh viên cơ khí',
            author: 'PGS. Lê Văn C',
            email: 'levanc@hcmut.edu.vn',
            date: '23/10/2025',
            link: 'https://drive.google.com/file/d/ghi789',
            views: 0
        },
        {
            id: '4',
            title: 'Đề thi thử Kỹ thuật lập trình',
            category: 'Tin học',
            description: '10 đề thi thử kèm theo đáp án',
            author: 'TS. Phạm Thị D',
            email: 'phamthid@hcmut.edu.vn',
            date: '22/10/2025',
            link: 'https://drive.google.com/file/d/jkl012',
            views: 0
        },
        {
            id: '5',
            title: 'Thiết kế kết cấu thép - Giáo trình và bài tập',
            category: 'Xây dựng',
            description: 'Giáo trình thiết kế kết cấu thép đầy đủ',
            author: 'PGS.TS. Hoàng Văn E',
            email: 'hoangvane@hcmut.edu.vn',
            date: '21/10/2025',
            link: 'https://drive.google.com/file/d/mno345',
            views: 0
        }
    ]);

    const handleApprove = (id: string) => {
        console.log('Approved material:', id);
        setMaterials(materials.filter(m => m.id !== id));
    };

    const handleReject = (id: string) => {
        console.log('Rejected material:', id);
        setMaterials(materials.filter(m => m.id !== id));
    };

    // Stats
    const pendingCount = materials.length;
    const approvedToday = 12;
    const rejectedCount = 3;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header màu xanh - Chế độ Admin */}
            <div className="bg-teal-600 text-white px-6 py-3 mb-6">
                <p className="text-sm font-medium">Chế độ: Admin</p>
            </div>

            <div className="px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Duyệt tài liệu
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Xem xét và phê duyệt các tài liệu do gia sư gửi lên
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
                                    <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Đã duyệt hôm nay</p>
                                    <p className="text-2xl font-bold text-gray-900">{approvedToday}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Check className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Từ chối hôm nay</p>
                                    <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <X className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Materials Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Table Header */}
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-700 uppercase">
                                <div className="col-span-3">Tài liệu</div>
                                <div className="col-span-2">Người gửi</div>
                                <div className="col-span-2">Ngày gửi</div>
                                <div className="col-span-3">Link</div>
                                <div className="col-span-2 text-center">Hành động</div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-200">
                            {materials.map(material => (
                                <div key={material.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* Tài liệu */}
                                        <div className="col-span-3">
                                            <div className="flex items-start gap-2">
                                                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h3 className="font-medium text-gray-900 text-sm mb-0.5">
                                                        {material.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">{material.category}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Người gửi */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{material.author}</p>
                                                    <p className="text-xs text-gray-500">{material.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ngày gửi */}
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <p className="text-sm text-gray-900">{material.date}</p>
                                            </div>
                                        </div>

                                        {/* Link */}
                                        <div className="col-span-3">
                                            <a 
                                                href={material.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                <LinkIcon className="w-4 h-4" />
                                                <span className="truncate">Xem tài liệu</span>
                                            </a>
                                        </div>

                                        {/* Hành động */}
                                        <div className="col-span-2 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleApprove(material.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
                                            >
                                                <Check className="w-3 h-3" />
                                                Duyệt
                                            </button>
                                            <button
                                                onClick={() => handleReject(material.id)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs font-medium"
                                            >
                                                <X className="w-3 h-3" />
                                                Từ chối
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hướng dẫn */}
                    <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Hướng dẫn duyệt tài liệu
                        </h3>
                        <ul className="text-xs text-blue-800 space-y-1 list-decimal pl-5">
                            <li>Kiểm tra nội dung tài liệu có phù hợp với mục đích học tập không</li>
                            <li>Đảm bảo link tài liệu có thể truy cập và xem được</li>
                            <li>Kiểm tra tài liệu không vi phạm bản quyền, chứa nội dung không phù hợp</li>
                            <li>Nếu có chốc, cảnh giải rõ lý do để gia sư hiểu và chỉnh sửa</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
