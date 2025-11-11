// ────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

// ────────────────────────────────────────────────
// Mock data
// ────────────────────────────────────────────────
const userList = [
  { id: 1, name: "Nguyễn Văn An", email: "an.nguyen@hcmut.edu.vn", role: "Sinh viên", status: "Hoạt động" },
  { id: 2, name: "Trần Thị Hương", email: "huong.tran@hcmut.edu.vn", role: "Gia sư", status: "Hoạt động" },
  { id: 3, name: "Lê Văn Tuấn", email: "tuan.le@hcmut.edu.vn", role: "Gia sư", status: "Hoạt động" },
  { id: 4, name: "Phạm Thị Lan", email: "lan.pham@hcmut.edu.vn", role: "Điều phối viên", status: "Hoạt động" },
  { id: 5, name: "Hoàng Minh Tuấn", email: "tuan.hoang@hcmut.edu.vn", role: "Sinh viên", status: "Không hoạt động" },
];

// ────────────────────────────────────────────────
// Chart data
// ────────────────────────────────────────────────
const monthlyStats = [
  { label: "Tháng 6", value: 120 },
  { label: "Tháng 7", value: 165 },
  { label: "Tháng 8", value: 210 },
  { label: "Tháng 9", value: 280 },
  { label: "Tháng 10", value: 350 },
  { label: "Tháng 11", value: 420 },
];

const xLabels = monthlyStats.map((item) => item.label);
const pData = monthlyStats.map((item) => item.value);

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
const AdminDashboard = () => {
  // ─── Derived data ───────────────────────────────
  const roleCounts = userList.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const roleData = Object.entries(roleCounts).map(([label, value]) => ({
    label,
    value,
  }));

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* ─── Header ─────────────────────────────── */}
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Chào mừng trở lại, Admin. Đây là tổng quan nhanh về hệ thống.
        </p>
      </header>

      {/* ─── User Table ─────────────────────────── */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Người dùng mới</h2>
            <p className="text-sm text-gray-500">Hiển thị 1–5 của 420 kết quả</p>
          </div>
          <div className="flex items-center gap-3">
            <ActionButton label="Thêm mới" />
            <ActionButton label="Xuất dữ liệu" />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {userList.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </div>

        <Pagination />
      </section>

      {/* ─── Charts ─────────────────────────────── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Thống kê người dùng</h2>
            <p className="text-sm text-gray-500">Biểu đồ tổng quan về người dùng</p>
          </div>
          <ActionButton label="Xem chi tiết" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* ─── Bar Chart ─────────────────────────── */}
          
          <Box sx={{ width: "100%", height: 300 }}> <BarChart xAxis={[{ data: xLabels, label: "Tháng",categoryGapRatio: 0.5, barGapRatio: 0.1 }]} series={[ { data: pData, label: "Người dùng đăng ký theo tháng", id: "userGrowth", color: "#0E7AA0", }, ]} /> </Box>

          {/* ─── Pie Chart ─────────────────────────── */}
          <Box
            sx={{
              width: "100%",
              height: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3 className="mb-3 text-sm font-medium text-gray-700">
              Phân bố người dùng
            </h3>

            <PieChart
              series={[
                {
                  data: roleData,
                  arcLabel: "value",
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontSize: 14,
                },
              }}
              width={300}
              height={250}
            />
          </Box>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

// ────────────────────────────────────────────────
// Subcomponents
// ────────────────────────────────────────────────
const ActionButton = ({ label }: { label: string }) => (
  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
    {label}
  </button>
);

const UserRow = ({ user }: { user: typeof userList[number] }) => (
  <div className="flex flex-wrap items-center gap-3 px-6 py-4 text-sm text-gray-600">
    <div className="flex min-w-[200px] flex-1 items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-sm font-semibold text-white">
        {user.name.charAt(0)}
      </div>
      <div>
        <p className="font-medium text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>

    <RoleBadge role={user.role} />
    <StatusBadge status={user.status} />

    <div className="ml-auto flex items-center gap-3 text-blue-500">
      <button className="rounded-lg border border-blue-100 px-3 py-1 text-xs font-medium transition-colors hover:bg-blue-50">
        Chỉnh sửa
      </button>
      <button className="rounded-lg border border-red-100 px-3 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
        Xóa
      </button>
    </div>
  </div>
);

const RoleBadge = ({ role }: { role: string }) => (
  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
    {role}
  </span>
);

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "Hoạt động";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
};

const Pagination = () => (
  <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
    {["Trước", "1", "2", "3", "Sau"].map((label, i) => (
      <button
        key={i}
        className={`rounded-lg px-3 py-1.5 text-sm ${
          label === "1"
            ? "bg-blue-500 font-semibold text-white shadow-sm hover:bg-blue-600"
            : "border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);
