// src/Components/TutorRegisterForm.tsx

import React, { useState } from "react";
import { X, Calendar, MapPin, Users, Send } from "lucide-react";

// Định nghĩa Interface cho dữ liệu buổi học
interface SessionFormData {
  tutorId: number;
  subjectId: number;
  startTime: string;
  endTime: string;
  format: "ONLINE" | "OFFLINE";
  location: string;
  maxQuantity: number;
  dayOfWeek: number; // 1 (Thứ Hai) đến 7 (Chủ Nhật)
  sessionStatusId: number; // Mặc định là OPEN (1)
}

interface TutorRegisterFormProps {
  isOpen: boolean;
  onClose: () => void;
  // Thêm prop để xử lý submit form
  onSubmit?: (data: SessionFormData) => void;
}

const initialFormData: SessionFormData = {
  tutorId: 1, // Giả định
  subjectId: 1, // Mặc định
  startTime: "08:00", // Giờ mặc định
  endTime: "10:00", // Giờ mặc định
  format: "ONLINE",
  location: "",
  maxQuantity: 10,
  dayOfWeek: 1, // Mặc định Thứ Ba
  sessionStatusId: 1, // Mặc định OPEN
};

const TutorRegisterForm: React.FC<TutorRegisterFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<SessionFormData>(initialFormData);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // State cho ngày

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Xử lý giá trị số
    const newValue = name === 'subjectId' || name === 'maxQuantity' || name === 'dayOfWeek' || name === 'sessionStatusId'
      ? parseInt(value, 10)
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalData: SessionFormData = {
      ...formData,
      startTime: `${date}T${formData.startTime}:00Z`, // Giả sử là giờ UTC
      endTime: `${date}T${formData.endTime}:00Z`,     // Giả sử là giờ UTC
    };

    if (onSubmit) {
      onSubmit(finalData);
    }

    // In ra dữ liệu cuối cùng theo format JSON đã yêu cầu
    console.log("[FORM SUBMITTED DATA]:", JSON.stringify(finalData, null, 2));

    // Đóng modal và reset form
    onClose();
    setFormData(initialFormData);
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose} // Đóng khi click ra ngoài
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan truyền ra lớp nền
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Tạo Buổi Học Mới
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Ngày & Giờ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Ngày</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={handleDateChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Bắt đầu</label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Kết thúc</label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Môn học và Ngày trong tuần */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">Môn học (ID)</label>
              <input
                id="subjectId"
                name="subjectId"
                type="number"
                value={formData.subjectId}
                onChange={handleChange}
                required
                min="1"
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="ID môn học"
              />
            </div>
            <div>
              <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">Ngày trong tuần</label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value={2}>Thứ Hai</option>
                <option value={3}>Thứ Ba</option>
                <option value={4}>Thứ Tư</option>
                <option value={5}>Thứ Năm</option>
                <option value={6}>Thứ Sáu</option>
                <option value={7}>Thứ Bảy</option>
                <option value={1}>Chủ Nhật</option>
              </select>
            </div>
          </div>

          {/* Hình thức & Số lượng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700">Hình thức</label>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
            <div>
              <label htmlFor="maxQuantity" className="block text-sm font-medium text-gray-700">Số lượng tối đa</label>
              <div className="relative mt-1">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="maxQuantity"
                  name="maxQuantity"
                  type="number"
                  value={formData.maxQuantity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Số lượng"
                />
              </div>
            </div>
          </div>

          {/* Địa điểm */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Địa điểm/Link</label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder={formData.format === 'ONLINE' ? 'Google Meet, Zoom Link...' : 'Phòng A301, Tầng 3...'}
              />
            </div>
          </div>

          {/* Hidden Fields (for JSON requirements) */}
          <input type="hidden" name="tutorId" value={formData.tutorId} />
          <input type="hidden" name="sessionStatusId" value={formData.sessionStatusId} />


          {/* Footer */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
            >
              <Send className="h-4 w-4" />
              Tạo Buổi Học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorRegisterForm;