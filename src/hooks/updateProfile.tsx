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
}

export const useProfileUpdate = () => {
    const { user, setUserDirectly } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateProfile = useCallback(
        async (formData: ProfileFormData) => {

            // ========== CHECKPOINT A ==========
            console.log("📌 [A] Payload gửi lên server:", formData);

            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("Phiên đăng nhập hết hạn.");
                return;
            }

            setIsSubmitting(true);
            // Check user role timing bug here
            console.log(">>> user BEFORE sending API:", user);
            console.log(">>> user.role BEFORE sending API:", user?.role);
            const apiPayload = {
                hcmutId: formData.hcmutId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dob: formData.dob,
                otherMethodContact: formData.otherMethodContact,
                phone: formData.phone,
                phoneNumber: formData.phone,
            };

            // CHỌN API THEO ROLE
            const endpoint =
                user?.role === "tutor"
                    ? "http://localhost:8081/tutors/profile"
                    : "http://localhost:8081/students/profile";

            // ========== CHECKPOINT B ==========
            console.log("📌 [B] Endpoint gọi tới:", endpoint);

            try {
                const response = await axios.put(endpoint, apiPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                // ========== CHECKPOINT C ==========
                console.log("📌 [C] Raw response từ server:", response.data);

                const responseData = response.data?.data || response.data || {};

                // ========== CHECKPOINT D ==========
                console.log("📌 [D] responseData sau khi bóc tách:", responseData);

                // KHÓA ROLE – không cho backend ghi đè
                const originalRole = user?.role;

                const updatedUser: User = {
                    ...user,
                    ...responseData,

                    // override lại bằng dữ liệu từ form
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    dob: formData.dob,
                    otherMethodContact: formData.otherMethodContact,
                    phone: formData.phone,

                    // YÊU CẦU: KHÓA ROLE
                    role: originalRole,
                };

                // ========== CHECKPOINT E ==========
                console.log("📌 [E] User trước khi update:", user);
                console.log("📌 [F] updatedUser chuẩn bị set:", updatedUser);

                setUserDirectly(updatedUser);

                // ========== CHECKPOINT G ==========
                console.log("📌 [G] setUserDirectly() đã chạy");

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
