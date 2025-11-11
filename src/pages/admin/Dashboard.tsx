// ────────────────────────────────────────────────
// Imports
// ────────────────────────────────────────────────
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

// ────────────────────────────────────────────────
// Mock data
// ────────────────────────────────────────────────

import { userList } from "../../Components/Data/user";
import { UserRow } from "../../Components/UserList";
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


