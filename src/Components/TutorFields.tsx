import React from "react";

export interface TutorFieldsProps {
    formData: any;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    isSubmitting: boolean;
    subjectsOptions?: { id: number; name: string }[]; // Danh sách môn học để select
}

const TutorFields: React.FC<TutorFieldsProps> = ({
    formData,
    handleChange,
    isSubmitting,
    // subjectsOptions = [],
}) => {
    return (
        <div className="grid gap-4">
            {/* Họ / Tên */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Họ</label>
                    <input
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                    <input
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Ngày sinh */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Liên hệ khác / Số điện thoại */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Liên hệ khác</label>
                    <input
                        name="otherMethodContact"
                        value={formData.otherMethodContact || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Bio */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Giới thiệu / Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Experience Years */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Số năm kinh nghiệm</label>
                <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears || 0}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={0}
                />
            </div>


        </div>
    );
};

export default TutorFields;
