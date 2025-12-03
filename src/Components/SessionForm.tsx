import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useUser } from "../Context/UserContext";
import { scheduleApi, publicApi, tutorApi } from "../services/api";
import moment from "moment";
const SessionForm = () => {
    const { user } = useUser();

    // State
    const [format, setFormat] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0); // phút
    const [startTime, setStartTime] = useState<string>(""); // local input
    const [endTime, setEndTime] = useState<string>(""); // ISO UTC
    const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<number>(2); // Default SCHEDULED - backend will use this or default to SCHEDULED
    const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Load subjects for tutor
    useEffect(() => {
        const loadData = async () => {
            try {
                const tutorSubjectsList = await tutorApi.getTutorSubjects(); // Get only tutor's subjects from tutor profile
                setSubjects(tutorSubjectsList);
            } catch (err) {
                console.error("Failed to load tutor subjects:", err);
                // Fallback to all subjects if tutor subjects fail
                try {
                    const allSubjects = await publicApi.getSubjects();
                    setSubjects(allSubjects);
                } catch (fallbackErr) {
                    console.error("Failed to load fallback subjects:", fallbackErr);
                }
            }
        };
        loadData();
    }, []);

    // Subjects convert → React Select options
    const listSubjects = subjects.map((sub) => ({
        value: sub.id,
        label: sub.name,
    }));


    const formatOptions = [
        { value: "OFFLINE", label: "Offline" },
        { value: "ONLINE", label: "Online" },
    ];

    // ---------------- Helper ----------------
    const calculateEndTime = (start: string, durationMinutes: number): string => {
        if (!start || !durationMinutes) return "";
        // Parse giờ local và cộng phút
        const endMoment = moment(start, "YYYY-MM-DDTHH:mm")
            .add(durationMinutes, "minutes");
        // Convert to ISO format for backend
        return endMoment.toISOString();
    };




    const handleSessionSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        // Lưu reference của form trước khi vào async block
        const formElement = event.currentTarget as HTMLFormElement;

        const target = event.target as typeof event.target & {
            startTime: { value: string };
            location: { value: string };
            maxQuantity: { value: string };
        };

        // Validation
        if (!user?.id) {
            setError("Không tìm thấy thông tin tutor");
            return;
        }
        if (!selectedSubject) {
            setError("Vui lòng chọn môn học");
            return;
        }
        if (!format) {
            setError("Vui lòng chọn hình thức học");
            return;
        }
        if (!startTime) {
            setError("Vui lòng chọn thời gian bắt đầu");
            return;
        }
        if (!duration || duration <= 0) {
            setError("Vui lòng nhập thời lượng hợp lệ");
            return;
        }
        if (!target.location.value) {
            setError("Vui lòng nhập địa điểm/ID Meet");
            return;
        }
        if (!target.maxQuantity.value || parseInt(target.maxQuantity.value) <= 0) {
            setError("Vui lòng nhập số lượng tối đa hợp lệ");
            return;
        }

        // Calculate end time
        const calculatedEndTime = calculateEndTime(startTime, duration);
        const startTimeISO = moment(startTime, "YYYY-MM-DDTHH:mm").toISOString();

        // Prepare request body (backend tự động tính dayOfWeek từ startTime)
        const sessionData = {
            tutorId: user.id,
            subjectId: selectedSubject,
            startTime: startTimeISO,
            endTime: calculatedEndTime,
            format: format,
            location: target.location.value,
            maxQuantity: parseInt(target.maxQuantity.value),
            sessionStatusId: selectedStatus, // Matches SessionRequest.sessionStatusId (Byte)
        };

        try {
            setLoading(true);
            await scheduleApi.createSession(sessionData);
            setSuccess("Tạo buổi học thành công!");

            // Reset form sử dụng formElement đã lưu trước đó
            formElement.reset();
            setStartTime("");
            setEndTime("");
            setDuration(0);
            setFormat(null);
            setSelectedSubject(null);
            setSelectedStatus(1);

            // Reload page after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err: unknown) {
            console.error("Failed to create session:", err);
            // Try to extract server-provided message if present
            type AxiosLikeError = { response?: { data?: { message?: string } } };
            let errorMessage: string | null = null;
            if (typeof err === "object" && err !== null && "response" in err) {
                const axiosErr = err as AxiosLikeError;
                errorMessage = axiosErr.response?.data?.message ?? null;
            }
            if (!errorMessage) {
                if (err instanceof Error) {
                    errorMessage = err.message;
                } else {
                    errorMessage = "Không thể tạo buổi học. Vui lòng thử lại.";
                }
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- Return UI ----------------
    return (
        <>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                    {success}
                </div>
            )}
            <form onSubmit={handleSessionSubmit} className="space-y-4">
                {/* Tutor Info (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Giảng viên
                    </label>
                    <input
                        type="text"
                        value={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.hcmutId : ''}
                        readOnly
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm p-2 border cursor-not-allowed"
                    />
                </div>

                {/* Subject + Time Start + End Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Lựa chọn môn học <span className="text-red-500">*</span>
                        </label>
                        <Select
                            name="subjectID"
                            options={listSubjects}
                            onChange={(val) => setSelectedSubject(val ? val.value : null)}
                            placeholder="Chọn môn học..."
                        />
                    </div>

                    {/* Start Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Thời gian bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            name="startTime"
                            min={moment().format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => {
                                const newStartTime = e.target.value;
                                setStartTime(newStartTime);
                                // Auto calculate end time
                                if (duration > 0) {
                                    setEndTime(calculateEndTime(newStartTime, duration));
                                }
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            required
                        />
                    </div>

                    {/* End Time (auto-calculated, read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Thời gian kết thúc
                        </label>
                        <input
                            type="text"
                            value={endTime ? moment(endTime).format("DD/MM/YYYY HH:mm") : ""}
                            readOnly
                            placeholder="Tự động tính"
                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm p-2 border cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Format + Duration + Max Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hình thức học */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Hình thức học <span className="text-red-500">*</span>
                        </label>
                        <Select
                            options={formatOptions}
                            name="format"
                            onChange={(val) => setFormat(val ? val.value : null)}
                            placeholder="Chọn hình thức..."
                        />
                    </div>
                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Thời lượng (tiếng) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="duration"
                            placeholder="Ví dụ: 1.5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            step={0.5}
                            min={0.5}
                            required
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) {
                                    const minutes = val * 60;
                                    setDuration(minutes); // lưu phút
                                    // Auto calculate end time
                                    if (startTime) {
                                        setEndTime(calculateEndTime(startTime, minutes));
                                    }
                                }
                            }}
                        />
                    </div>
                    {/* Số lượng tối đa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Số lượng tối đa <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="maxQuantity"
                            placeholder="Ví dụ: 10"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            min={1}
                            required
                        />
                    </div>
                </div>


                {/* Location / Meet ID */}
                {format === "OFFLINE" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nhập địa điểm học <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Ví dụ: B4-406 , H6-301"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                )}

                {format === "ONLINE" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nhập ID Meet <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Ví dụ: https://meet.google.com/abc-xyz"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                )}

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tạo...
                        </>
                    ) : (
                        'Tạo ngay'
                    )}
                </button>
            </form>
        </>
    );
};

export default SessionForm;
