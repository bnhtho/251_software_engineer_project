// src/hooks/useProfileUpdate.ts

import { useState, useCallback } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useUser, type User } from "../Context/UserContext";

interface ProfileFormData {
    bio: string;
    hcmutId: string;
    firstName: string;
    lastName: string;
    dob: string;
    otherMethodContact: string;
    phone: string;
    experienceYears: number;
}

export const useProfileUpdate = () => {
    const { user, setUserDirectly } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateProfile = useCallback(
        async (formData: ProfileFormData) => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("Phiên đăng nhập hết hạn.");
                return;
            }

            setIsSubmitting(true);

            const apiPayload = {
                hcmutId: formData.hcmutId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dob: formData.dob,
                otherMethodContact: formData.otherMethodContact,
                phone: formData.phone,
                phoneNumber: formData.phone,
                experienceYears: formData.experienceYears,
                bio: formData.bio
            };

            // CHỌN API THEO ROLE
            const endpoint =
                user?.role?.toLowerCase() === "tutor"
                    ? "http://localhost:8081/tutors/profile"
                    : "http://localhost:8081/students/profile";

            try {
                const response = await axios.put(endpoint, apiPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const responseData = response.data?.data || response.data || {};


                // Force new object reference để trigger React re-render
                const updatedUser: User = {
                    ...user!,
                    ...responseData,
                    role: user!.role,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    dob: formData.dob,
                    otherMethodContact: formData.otherMethodContact,
                    phone: formData.phone,
                };

                // Force update với new object
                setUserDirectly(updatedUser);
                toast.success("Cập nhật thông tin thành công!");

                return { success: true, newInitialData: formData };
            } catch (err: any) {
                console.error("❌ Update failed", err.response || err);
                const errorMsg = err.response?.data?.message || "Cập nhật thất bại.";
                toast.error(errorMsg);
                return { success: false };
            } finally {
                setIsSubmitting(false);
            }
        },
        [user, setUserDirectly]
    );

    return { updateProfile, isSubmitting };
};
