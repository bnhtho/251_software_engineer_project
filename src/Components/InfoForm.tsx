import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { FormEvent } from "react";
import { useUser } from "../Context/UserContext";
// import { useProfileUpdate } from ; // Import hook mới
import { useProfileUpdate } from "../hooks/updateProfile"
// Load 2 giao diện
// --------------------
import StudentFields from "./StudentFields";
import TutorFields from "./TutorFields";
// --------------------
const InfoForm: React.FC = () => {
  const { user } = useUser();
  const { updateProfile, isSubmitting } = useProfileUpdate();

  // Tự quản lý formData tại component
  const [formData, setFormData] = React.useState({
    hcmutId: user?.hcmutId || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dob: user?.dob || "",
    phone: user?.phone || "",
    otherMethodContact: user?.otherMethodContact || "",
    bio: user?.bio || "",
    majorId: user?.majorId || null,
    subjects: user?.subjects?.map(s => s.id) || [], // lưu id môn học
    experienceYears: user?.experienceYears || 0,
    isAvailable: user?.isAvailable || false,
  });

  // Update từng input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form, gọi hook update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {user?.role === "student" && (
        <StudentFields
          formData={formData}
          handleChange={handleChange}
          isSubmitting={isSubmitting}
        />
      )}

      {user?.role === "tutor" && (
        <TutorFields
          formData={formData}
          handleChange={handleChange}
          isSubmitting={isSubmitting}
        />
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        Lưu thay đổi
      </button>
    </form>
  );
};

export default InfoForm;