const userList = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@hcmut.edu.vn",
    role: "Sinh viên",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Trần Thị Hương",
    email: "huong.tran@hcmut.edu.vn",
    role: "Gia sư",
    status: "Hoạt động",
  },
  {
    id: 3,
    name: "Lê Văn Tuấn",
    email: "tuan.le@hcmut.edu.vn",
    role: "Gia sư",
    status: "Hoạt động",
  },
  {
    id: 4,
    name: "Phạm Thị Lan",
    email: "lan.pham@hcmut.edu.vn",
    role: "Điều phối viên",
    status: "Hoạt động",
  },
  {
    id: 5,
    name: "Hoàng Minh Tuấn",
    email: "tuan.hoang@hcmut.edu.vn",
    role: "Sinh viên",
    status: "Không hoạt động",
  },
];

const monthlyStats = [
  { label: "T6", value: 120 },
  { label: "T7", value: 165 },
  { label: "T8", value: 210 },
  { label: "T9", value: 280 },
  { label: "T10", value: 350 },
  { label: "T11", value: 420 },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Chào mừng trở lại, Admin. Đây là tổng quan nhanh về hệ thống.
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Người dùng mới</h2>
            <p className="text-sm text-gray-500">
              Hiển thị 1-5 của 420 kết quả
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
              Thêm mới
            </button>
            <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
              Xuất dữ liệu
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {userList.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap items-center gap-3 px-6 py-4 text-sm text-gray-600"
            >
              <div className="flex min-w-[200px] flex-1 items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-indigo-500 text-sm font-semibold text-white">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {user.role}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  user.status === "Hoạt động"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {user.status}
              </span>
              <div className="ml-auto flex items-center gap-3 text-blue-500">
                <button className="rounded-lg border border-blue-100 px-3 py-1 text-xs font-medium transition-colors hover:bg-blue-50">
                  Chỉnh sửa
                </button>
                <button className="rounded-lg border border-red-100 px-3 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
            Trước
          </button>
          <button className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">
            1
          </button>
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
            2
          </button>
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
            3
          </button>
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
            Sau
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Thống kê người dùng
            </h2>
            <p className="text-sm text-gray-500">
              Số lượng người dùng đăng ký mới theo tháng
            </p>
          </div>
          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            Xem chi tiết
          </button>
        </div>

        <div className="space-y-4">
          {monthlyStats.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full bg-linear-to-r from-indigo-400 via-purple-500 to-blue-500"
                  style={{
                    width: `${(item.value / 420) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

