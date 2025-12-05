import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Clock,
    MapPin,
    Laptop,
    BookOpen,
    RefreshCw,
    Filter,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "../../Context/UserContext";

// --- CONSTANTS & TYPES ---

const API_BASE_URL = "http://localhost:8081";

interface SessionDTO {
    id: number;
    sessionDate: string;
    sessionStartTime: string;
    sessionEndTime: string;
    sessionLocation?: string;
    sessionFormat: 'ONLINE' | 'OFFLINE' | string;
    meetingLink?: string;
    status: string;
    sessionSubject?: string;
    course?: {
        name: string;
        code: string;
        tutorName: string;
    };
}

type FilterType = "all" | "online" | "offline";

// --- UTILS (Hàm hỗ trợ xử lý ngày tháng và định dạng) ---

const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const getDayName = (date: Date): string => {
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return days[date.getDay()];
};

const formatTime = (isoString: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getWeekRange = (offset: number) => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) + (offset * 7);

    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), diff);
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

    return { start: startOfWeek, end: endOfWeek };
};

const getStatusConfig = (status: string) => {
    switch (status) {
        case "SCHEDULED":
        case "CONFIRMED":
            return { text: "Đã lên lịch", style: "bg-green-100 text-green-800", icon: CheckCircle };
        case "CANCELLED":
            return { text: "Đã hủy", style: "bg-red-100 text-red-800", icon: AlertCircle };
        case "COMPLETED":
            return { text: "Hoàn thành", style: "bg-blue-100 text-blue-800", icon: CheckCircle };
        default:
            return { text: status, style: "bg-gray-100 text-gray-800", icon: null };
    }
};

// --- CUSTOM HOOK (Quản lý dữ liệu) ---

const useScheduleData = (weekOffset: number) => {
    const [sessions, setSessions] = useState<SessionDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = useCallback(async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Phiên đăng nhập hết hạn.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/students/schedule/${weekOffset}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSessions(response.data.data || response.data || []);
        } catch (error) {
            console.error("Lỗi tải lịch học:", error);
            toast.error("Không thể tải lịch học");
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }, [weekOffset]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    return { sessions, loading, refresh: fetchSessions };
};

// --- SUB-COMPONENTS (Chia nhỏ giao diện) ---

const StatusBadge = ({ status }: { status: string }) => {
    const config = getStatusConfig(status);
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.style}`}>
            {Icon && <Icon className="mr-1 h-3 w-3" />}
            {config.text}
        </span>
    );
};

const FormatBadge = ({ format }: { format: string }) => {
    const isOnline = format?.toUpperCase() === "ONLINE";
    return (
        <div className={`flex items-center gap-1 ${isOnline ? "text-blue-600" : "text-green-600"}`}>
            {isOnline ? <Laptop className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            <span className="text-xs font-medium uppercase">{isOnline ? "Online" : "Offline"}</span>
        </div>
    );
};

const WeekNavigator = ({
    weekRange,
    onPrev,
    onNext
}: {
    weekRange: { start: Date, end: Date },
    onPrev: () => void,
    onNext: () => void
}) => (
    <div className="flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
        <button onClick={onPrev} className="rounded-md border border-gray-300 p-1 hover:bg-gray-50">
            <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-gray-900 min-w-[200px] text-center">
            {formatDate(weekRange.start)} - {formatDate(weekRange.end)}
        </span>
        <button onClick={onNext} className="rounded-md border border-gray-300 p-1 hover:bg-gray-50">
            <ChevronRight className="h-5 w-5" />
        </button>
    </div>
);

const FilterTabs = ({
    current,
    onChange,
    counts
}: {
    current: FilterType,
    onChange: (f: FilterType) => void,
    counts: { all: number, online: number, offline: number }
}) => {
    const tabs: { key: FilterType, label: string, icon: any, count: number }[] = [
        { key: "all", label: "Tất cả", icon: Filter, count: counts.all },
        { key: "online", label: "Online", icon: Laptop, count: counts.online },
        { key: "offline", label: "Offline", icon: MapPin, count: counts.offline },
    ];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-2 flex gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${current === tab.key
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    <tab.icon className="h-4 w-4" />
                    {tab.label} <span className="opacity-80">({tab.count})</span>
                </button>
            ))}
        </div>
    );
};

const EmptyState = ({ filter }: { filter: FilterType }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lịch học</h3>
        <p className="text-gray-600">
            {filter === 'all'
                ? "Bạn chưa có lịch học nào trong tuần này."
                : `Không có buổi học ${filter} nào trong tuần này.`}
        </p>
    </div>
);

// --- MAIN COMPONENT ---

export default function SchedulePage() {
    const { user } = useUser();
    const [weekOffset, setWeekOffset] = useState(0);
    const [filter, setFilter] = useState<FilterType>("all");

    // Hooks custom
    const { sessions, loading, refresh } = useScheduleData(weekOffset);

    // Tính toán hiển thị
    const weekRange = useMemo(() => getWeekRange(weekOffset), [weekOffset]);

    const filteredSessions = useMemo(() => {
        return sessions.filter(s => {
            const format = s.sessionFormat?.toUpperCase() || "OFFLINE";
            if (filter === "online") return format === "ONLINE";
            if (filter === "offline") return format === "OFFLINE";
            return true;
        });
    }, [sessions, filter]);

    const counts = useMemo(() => ({
        all: sessions.length,
        online: sessions.filter(s => s.sessionFormat?.toUpperCase() === "ONLINE").length,
        offline: sessions.filter(s => s.sessionFormat?.toUpperCase() === "OFFLINE").length
    }), [sessions]);

    // Render Logic
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-64 items-center justify-center text-center">
                <div className="max-w-md">
                    <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Vui lòng đăng nhập</h3>
                    <button
                        onClick={() => (window.location.href = "/login")}
                        className="bg-blue-600 px-4 py-2 text-white rounded-md hover:bg-blue-700"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <title>Lịch học</title>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    Lịch học
                </h1>
                <button
                    onClick={refresh}
                    className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <RefreshCw className="h-4 w-4" /> Làm mới
                </button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                    <WeekNavigator
                        weekRange={weekRange}
                        onPrev={() => setWeekOffset(p => p - 1)}
                        onNext={() => setWeekOffset(p => p + 1)}
                    />
                </div>
                <div className="md:col-span-8">
                    <FilterTabs current={filter} onChange={setFilter} counts={counts} />
                </div>
            </div>

            {/* Table Content */}
            {filteredSessions.length === 0 ? (
                <EmptyState filter={filter} />
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Môn học</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Ngày</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Thời gian</th>
                                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Địa điểm/Link</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Trạng thái</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">Hình thức</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredSessions.map((session, index) => {
                                    const sessionDate = new Date(session.sessionStartTime);
                                    return (
                                        <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 text-sm font-medium text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                                                    {session.sessionSubject || session.course?.name}
                                                </div>
                                                {session.course?.code && (
                                                    <div className="text-xs text-gray-500">{session.course.code}</div>
                                                )}
                                                {session.course?.tutorName && (
                                                    <div className="text-xs text-gray-400 mt-0.5">GV: {session.course.tutorName}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{formatDate(sessionDate)}</div>
                                                <div className="text-xs text-gray-500">{getDayName(sessionDate)}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatTime(session.sessionStartTime)} - {formatTime(session.sessionEndTime)}
                                                </div>
                                            </td>
                                            <td className="hidden lg:table-cell px-4 py-4 max-w-xs">
                                                <div className="flex items-start gap-1.5 text-sm text-gray-600">
                                                    {session.sessionFormat === 'ONLINE' ? (
                                                        session.meetingLink ? (
                                                            <a href={session.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline line-clamp-1">
                                                                {session.meetingLink}
                                                            </a>
                                                        ) : <span className="text-gray-400 italic">Chưa có link</span>
                                                    ) : (
                                                        <span className="line-clamp-2">{session.sessionLocation || session.course?.tutorName || "Đang cập nhật"}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <StatusBadge status={session.status} />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <FormatBadge format={session.sessionFormat} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}