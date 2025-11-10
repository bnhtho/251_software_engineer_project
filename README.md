# 251_software_engineer_project

Repository dự án môn công nghệ phần mềm Frontend - Hệ thống Gia sư HCMUT

## Công nghệ sử dụng
- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **State Management:** React Context

## Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- Yarn hoặc npm

## Hướng dẫn cài đặt

### Cách 1: Sử dụng Volta (Khuyến nghị)
1. Cài đặt Volta: https://volta.sh
2. Cài đặt Node.js và Yarn:
```bash
volta install node@18
volta install yarn
```

### Cách 2: Cài đặt trực tiếp
1. Tải và cài đặt Node.js từ: https://nodejs.org
2. Cài đặt Yarn:
```bash
npm install -g yarn
```

## Hướng dẫn setup project
1. Clone repository về máy:
```bash
git clone <repository-url>
cd 251_software_engineer_project
```

2. Cài đặt dependencies:
```bash
yarn install
```

3. Chạy development server:
```bash
yarn dev
```

4. Mở trình duyệt và truy cập: http://localhost:5173

## Tài khoản Demo

### Đăng nhập hệ thống
### User
- **Email:** `test@hcmut.edu.vn`
- **Mật khẩu:** `123456`
- **Vai trò:** `Student`
### Admin
- **Email:**: `admin@hcmut.edu.vn`
- **Mật khẩu**: `123456`
- **Vai trò:** : `Admin`
## Cấu trúc Routes

### 🌐 Public Routes
- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký (TODO)
- `/forgot-password` - Quên mật khẩu (TODO)

### 🔐 Protected Routes (Yêu cầu đăng nhập)
- `/dashboard` - Trang chủ dashboard
- `/dashboard/profile` - Thông tin cá nhân
- `/dashboard/schedule` - Lịch học
- `/dashboard/courses` - Danh sách khóa học
- `/dashboard/settings` - Cài đặt (TODO)
- `/dashboard/notifications` - Thông báo (TODO)
- `/dashboard/help` - Trợ giúp (TODO)

### 👨‍💼 Admin Routes (Chỉ dành cho Admin)
- `/admin` - Admin Dashboard
- `/admin/users` - Quản lý người dùng (TODO)
- `/admin/reports` - Báo cáo (TODO)

## Tính năng chính

### ✅ Đã hoàn thành
- **Authentication:** Đăng nhập/đăng xuất với route protection
- **Dashboard Layout:** Sidebar navigation + Header
- **Profile Management:** Xem và chỉnh sửa thông tin cá nhân
- **Course Management:** Danh sách và đăng ký khóa học
- **Schedule:** Xem lịch học với bảng responsive
- **Learning History:** Lịch sử học tập dạng bảng
- **Responsive Design:** Hỗ trợ mobile, tablet, desktop
- **404 Page:** Trang lỗi với thiết kế đẹp

### 🚧 Đang phát triển
- Trang đăng ký
- Quên mật khẩu
- Cài đặt hệ thống
- Thông báo
- Admin panel
- Quản lý gia sư

## Các lệnh hữu ích
- `yarn run dev` - Chạy development server
- `yarn lint` - Kiểm tra lỗi code

## Cấu trúc project
```
src/
├── Components/          # Các component tái sử dụng
│   ├── Layout.tsx      # Layout chính với sidebar
│   ├── Navbar.tsx      # Header navigation
│   ├── Sidebar.tsx     # Sidebar navigation
│   ├── ProtectedRoute.tsx # Route protection
│   └── ...
├── Context/            # React Context
│   └── UserContext.tsx # User state management
├── page/              # Các trang chính
│   ├── LoginPage.tsx  # Trang đăng nhập
│   ├── HomePage.tsx   # Dashboard chính
│   ├── Profile.tsx    # Thông tin cá nhân
│   ├── Course.tsx     # Quản lý khóa học
│   ├── Schedule.tsx   # Lịch học
│   └── PageNotFound.tsx # Trang 404
└── assets/            # Hình ảnh, icon
```

## Ghi chú
- Dự án sử dụng Grid 12 column system cho layout responsive
- Authentication được quản lý qua React Context
- Routes được bảo vệ bằng ProtectedRoute component
- UI/UX thiết kế theo chuẩn modern web app
