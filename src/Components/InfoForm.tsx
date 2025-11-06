import { useState } from "react";
import { Edit, X } from "lucide-react";

interface UserInfo {
    firstName: string;
    lastName: string;
    studentId: string;
    birthDate: string;
    email: string;
    phoneNumber: string;
    bio: string;
}

interface InfoFormProps {
    userInfo?: UserInfo;
}

// InfoForm component
const InfoForm = ({ userInfo }: InfoFormProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<UserInfo>({
        firstName: userInfo?.firstName || "Nguyễn Văn",
        lastName: userInfo?.lastName || "An",
        studentId: userInfo?.studentId || "2012345",
        birthDate: userInfo?.birthDate || "19/05/2000",
        email: userInfo?.email || "nguyenvanan@hcmut.edu.vn",
        phoneNumber: userInfo?.phoneNumber || "0841234567",
        bio: userInfo?.bio || "Sinh viên năm 3 khoa Khoa học và Kỹ thuật Máy tính, ĐHBK TP.HCM. Yêu thích lập trình và công nghệ.",
    });

    const [editData, setEditData] = useState<UserInfo>(formData);

    const handleEdit = () => {
        setEditData(formData);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setFormData(editData);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setEditData(formData);
        setIsModalOpen(false);
    };

    const handleInputChange = (field: keyof UserInfo, value: string) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h2>
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                        <Edit className="w-4 h-4" />
                        Sửa
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Họ và tên đệm, Tên */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Họ và tên đệm</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {formData.firstName}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Tên</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {formData.lastName}
                            </div>
                        </div>
                    </div>

                    {/* MSSV, Ngày sinh */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">MSSV</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {formData.studentId}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Ngày sinh</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {formData.birthDate}
                            </div>
                        </div>
                    </div>

                    {/* Email, Số điện thoại */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Email</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {formData.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Số điện thoại</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                                {formData.phoneNumber}
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Giới thiệu bản thân</label>
                        <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 min-h-[100px]">
                            {formData.bio}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa thông tin</h3>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Họ và tên đệm, Tên */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Họ và tên đệm</label>
                                    <input
                                        type="text"
                                        value={editData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Tên</label>
                                    <input
                                        type="text"
                                        value={editData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* MSSV, Ngày sinh */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">MSSV</label>
                                    <input
                                        type="text"
                                        value={editData.studentId}
                                        onChange={(e) => handleInputChange('studentId', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Ngày sinh</label>
                                    <input
                                        type="text"
                                        value={editData.birthDate}
                                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Email, Số điện thoại */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        value={editData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Giới thiệu bản thân</label>
                                <textarea
                                    value={editData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Modal Buttons */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

 export default InfoForm;