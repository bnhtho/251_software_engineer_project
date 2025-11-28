// src/hooks/useProfileUpdate.ts

import { useState, useCallback } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import { useUser, type User } from "../Context/UserContext";
interface ProfileFormData {
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
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("Phiên đăng nhập hết hạn.");
                return;
            }

            setIsSubmitting(true);

            // API Payload: Đảm bảo gửi đúng trường mà API backend mong đợi
            const apiPayload = {
                hcmutId: formData.hcmutId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dob: formData.dob,
                otherMethodContact: formData.otherMethodContact,
                // Dùng `phone` cho form, gửi `phoneNumber` hoặc `phone` tùy API
                phone: formData.phone,
                phoneNumber: formData.phone, // Giả sử API dùng cả hai hoặc một trong hai
            };

            try {
                const response = await axios.put(
                    `http://localhost:8081/students/profile`,
                    apiPayload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                // --- Cập nhật UI/Context thành công ---
                const responseData = response.data?.data || response.data || {};
                console.log(">>> Update Success:", response.data);
                // Cập nhật Context: Ghi đè các trường đã được cập nhật
                const updatedUser: User = {
                    ...user,
                    ...responseData, // Dữ liệu trả về từ server
                    // Đảm bảo các trường trong form được cập nhật chính xác vào context
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    dob: formData.dob,
                    otherMethodContact: formData.otherMethodContact,
                    phone: formData.phone,
                };

                setUserDirectly(updatedUser);
                toast.success('Cập nhật thông tin thành công!');

                return { success: true, newInitialData: formData };
            } catch (err: any) {
                console.error("Update failed", err.response || err);
                const errorMsg = err.response?.data?.message || 'Cập nhật thất bại.';
                toast.error(errorMsg);
                return { success: false };
            } finally {
                setIsSubmitting(false);
            }
        },
        [user, setUserDirectly]
    ); // Dependencies: user và setUserDirectly

    return { updateProfile, isSubmitting };
};