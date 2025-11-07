import { useState } from 'react';
import { FileText, Link as LinkIcon, AlertCircle, Save, X } from 'lucide-react';
import type { MaterialFormData, SubmittedMaterial } from '../types/material.types';

export default function UploadMaterials() {
    const [formData, setFormData] = useState<MaterialFormData>({
        title: '',
        category: '',
        description: '',
        link: ''
    });

    const [errors, setErrors] = useState<Partial<MaterialFormData>>({});
    const [showSuccess, setShowSuccess] = useState(false);

    const categories = ['Toán học', 'Vật lý', 'Tin học', 'Hóa học', 'Cơ khí'];

    const submittedMaterials: SubmittedMaterial[] = [
        {
            id: '1',
            title: 'Bài tập Giải tích nâng cao',
            category: 'Toán học',
            description: '',
            author: 'Gia sư',
            date: '29/10/2025',
            views: 0,
            status: 'pending',
            submittedDate: '29/10/2025'
        },
        {
            id: '2',
            title: 'Slide Cấu trúc dữ liệu',
            category: 'Tin học',
            description: '',
            author: 'Gia sư',
            date: '20/10/2025',
            views: 0,
            status: 'approved',
            submittedDate: '20/10/2025'
        },
        {
            id: '3',
            title: 'Đề cương ôn tập Vật lý',
            category: 'Vật lý',
            description: '',
            author: 'Gia sư',
            date: '15/10/2025',
            views: 0,
            status: 'approved',
            submittedDate: '15/10/2025'
        }
    ];

    const validateForm = (): boolean => {
        const newErrors: Partial<MaterialFormData> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Vui lòng nhập tiêu đề';
        }

        if (!formData.category) {
            newErrors.category = 'Vui lòng chọn danh mục';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Vui lòng nhập mô tả';
        }

        if (!formData.link.trim()) {
            newErrors.link = 'Vui lòng nhập link tài liệu';
        } else if (!isValidUrl(formData.link)) {
            newErrors.link = 'Link không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Submitting material:', formData);
            setShowSuccess(true);
            
            setFormData({
                title: '',
                category: '',
                description: '',
                link: ''
            });
            setErrors({});

            setTimeout(() => setShowSuccess(false), 5000);
        }
    };

    const handleReset = () => {
        setFormData({
            title: '',
            category: '',
            description: '',
            link: ''
        });
        setErrors({});
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        const labels = {
            pending: 'Chờ duyệt',
            approved: 'Đã duyệt',
            rejected: 'Từ chối'
        };
        return (
            <span className={`px-3 py-1 rounded text-xs font-medium ${badges[status as keyof typeof badges]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header màu xanh - Chế độ Gia sư */}
            <div className="bg-teal-600 text-white px-6 py-3 mb-6">
                <p className="text-sm font-medium">Chế độ: Gia sư</p>
            </div>

            <div className="px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Tải tài liệu lên
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Chia sẻ tài liệu học tập với sinh viên qua link
                        </p>
                    </div>

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs">✓</span>
                            </div>
                            <p className="text-green-800 text-sm">
                                Tài liệu đã được gửi thành công! Vui lòng đợi admin duyệt.
                            </p>
                        </div>
                    )}

                    {/* Upload Form */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                        {/* Info Box */}
                        <div className="bg-blue-50 p-4 flex items-start gap-3 border-b border-blue-100">
                            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-900 text-sm mb-0.5">
                                    Thông tin tài liệu
                                </h3>
                                <p className="text-xs text-blue-700">
                                    Vui lòng điền đầy đủ thông tin bên dưới
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Tiêu đề tài liệu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Tiêu đề tài liệu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="VD: Giáo trình Toán Cao Cấp 1"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                        errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Đặt tên ngắn gọn, dễ hiểu để sinh viên dễ tìm kiếm
                                </p>
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Danh mục */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${
                                        errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Mô tả <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Mô tả chi tiết về nội dung tài liệu, phạm vi kiến thức, đối tượng phù hợp..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none ${
                                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Mô tả càng chi tiết sẽ giúp sinh viên hiểu rõ hơn về tài liệu
                                </p>
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Link tài liệu */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Link tài liệu <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="https://drive.google.com/file/d/..."
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                            errors.link ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Hỗ trợ link từ Google Drive, Dropbox, OneDrive, hoặc link trực tiếp đến file PDF
                                </p>
                                {errors.link && (
                                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.link}
                                    </p>
                                )}
                            </div>

                            {/* Lưu ý khi tải tài liệu */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <div className="flex items-start gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <h4 className="font-semibold text-blue-900 text-sm">
                                        Lưu ý khi tải tài liệu
                                    </h4>
                                </div>
                                <ul className="text-xs text-blue-800 space-y-1 pl-6 list-disc">
                                    <li>Tài liệu cần phải được admin duyệt trước khi cho sinh viên xem</li>
                                    <li>Đảm bảo link tài liệu có thể truy cập công khai</li>
                                    <li>Nội dung tài liệu phải phù hợp với mục đích học tập</li>
                                    <li>Không vi phạm bản quyền hoặc chứa nội dung không phù hợp</li>
                                </ul>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Gửi duyệt
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Xóa form
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tài liệu đã gửi gần đây */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-base font-semibold text-gray-900">
                                Tài liệu đã gửi gần đây
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {submittedMaterials.map(material => (
                                <div key={material.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 text-sm mb-1">
                                                {material.title}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Gửi ngày {material.submittedDate}
                                            </p>
                                        </div>
                                        {getStatusBadge(material.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
