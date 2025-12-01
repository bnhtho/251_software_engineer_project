import React, { useState } from "react";
import Select from "react-select";
import { useUser } from "../Context/UserContext";
// import {} from "moment";
import moment from "moment";
const SessionForm = () => {
    const { user } = useUser();

    // Format
    const [format, setFormat] = useState<string | null>(null);

    // Subjects convert → React Select options
    const listSubjects =
        user?.subjects?.map((sub) => ({
            value: sub.id,
            label: sub.name,
        })) || [];

    // Time state
    const [duration, setDuration] = useState<number>(0); // phút
    const [startTime, setStartTime] = useState<string>(""); // local input
    const [endTime, setEndTime] = useState<string>(""); // ISO UTC


    const formatOptions = [
        { value: "offline", label: "Offline" },
        { value: "online", label: "Online" },
    ];

    // ---------------- Helper ----------------
    // getEndtimeHelper 
    // Moment parse local string, cộng duration phút
    const calculateEndTime = () => {
        if (!startTime || !duration) return;
        // 1. Parse giờ local và cộng phút
        const endMoment = moment(startTime, "YYYY-MM-DDTHH:mm")
            .add(duration, "minutes");

        const end = endMoment.format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z";
        setEndTime(end);
        // Log kiểm tra
        console.log(`${startTime}`); // 15:50
        console.log(`${duration}`); // 90
        console.log(`${end}`);    // 17:20...Z
    };




    const handleSessionSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            startTime: { value: string };
            format: { value: string };
            location: { value: string };
            subjectID: { value: number };
            maxQuantity: { value: number };
            duration: { value: number };
        };

        console.log("Format Session Submit !");
        console.log("----------- Info -------");
        console.log(target.startTime.value);
        console.log(target.format.value);
        console.log(target.location.value);
        console.log(target.subjectID.value);
        console.log("============= Time ========")
        calculateEndTime()
    };

    // ---------------- Return UI ----------------
    return (
        <>
            <form onSubmit={handleSessionSubmit} className="space-y-4">
                {/* Subject + Time Start */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Lựa chọn môn học
                        </label>
                        <Select name="subjectID" options={listSubjects} />
                    </div>

                    {/* Start Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Thời gian bắt đầu
                        </label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            name="startTime"
                            // Khi nhập, lưu giá trị vào setStartTime
                            onChange={(e) => setStartTime(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        />
                    </div>
                </div>

                {/* Format + Max Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hình thức học */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Hình thức học
                        </label>
                        <Select
                            options={formatOptions}
                            name="format"
                            onChange={(val) => setFormat(val ? val.value : null)}
                        />
                    </div>
                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Thời lượng (tiếng)
                        </label>
                        <input
                            type="number"
                            name="duration"
                            placeholder="Ví dụ: 1.5"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            step={0.5}
                            min={0.5}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) {
                                    setDuration(val * 60); // lưu phút
                                    // lưu phút
                                }
                            }}
                        />


                    </div>
                    {/* Số lượng tối đa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Số lượng tối đa
                        </label>
                        <input
                            type="number"
                            name="maxQuantity"
                            placeholder="Ví dụ: 10"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
                {/* Location / Meet ID */}
                {format === "offline" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nhập địa điểm học
                        </label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Ví dụ: B4-406 , H6-301"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                )}

                {format === "online" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nhập ID Meet
                        </label>
                        <input
                            type="text"
                            name="location"
                            placeholder="Ví dụ: ABC-XYZ"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                )}

                {/* Quantity */}

                {/* Button */}
                <button
                    type="submit"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-700 mt-3"
                >
                    Tạo ngay
                </button>
            </form>
        </>
    );
};

export default SessionForm;
