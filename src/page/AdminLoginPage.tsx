import React, { useState } from "react";
import hcmutLogo from '/src/assets/logo.svg';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Tài khoản admin demo
    if (email === "admin@hcmut.edu.vn" && password === "123456") {
      console.log("Admin login success!");
      login({
        id: 1,
        name: "Admin",
        role: "admin",
      });
      // Redirect về trang đã cố gắng truy cập hoặc admin dashboard
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="flex flex-col items-center w-full max-w-md bg-gray-50">
        {/* Header */}
        <header className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              className="w-12 h-12"
              alt="HCMUT Logo"
              src={hcmutLogo}
            />
            <div>
              <h1 className="text-2xl font-normal text-[#101727]">HCMUT</h1>
              <p className="text-sm text-[#697282] leading-5">
                Hệ thống gia sư
              </p>
            </div>
          </div>
          <h2 className="text-base font-normal text-[#101727] leading-6">
            Đăng nhập Admin
          </h2>
          <p className="text-sm text-[#495565] leading-5">
            Vui lòng đăng nhập bằng tài khoản Admin
          </p>
        </header>

        {/* Card */}
        <main className="bg-white rounded-xl shadow-md p-8 w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm text-neutral-950 font-normal"
              >
                Email
              </label>
              <div className="relative">
                <img
                  className="absolute top-2.5 left-3 w-4 h-4"
                  alt=""
                  src="https://c.animaapp.com/4n87O6lS/img/icon.svg"
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hcmut.edu.vn"
                  className="w-full pl-10 pr-3 py-2 bg-[#f3f3f5] rounded-lg text-sm text-[#717182] border border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm text-neutral-950 font-normal"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <img
                  className="absolute top-2.5 left-3 w-4 h-4"
                  alt=""
                  src="https://c.animaapp.com/4n87O6lS/img/icon-1.svg"
                />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 bg-[#f3f3f5] rounded-lg text-sm text-[#717182] border border-transparent"
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 w-4 h-4 cursor-pointer"
                />
                <span className="text-[#354152]">Ghi nhớ đăng nhập</span>
              </label>
              <a
                href="#forgot-password"
                className="text-[#0b7a9f] hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Đăng nhập
            </button>
          </form>

          {/* Footer inside card */}
          <div className="text-center text-sm text-[#495565] mt-5">
            Bạn là người dùng?{" "}
            <Link to="/login" className="text-[#0b7a9f] hover:underline">
              Đăng nhập tại đây
            </Link>
          </div>
        </main>

        {/* Page footer */}
        <footer className="mt-6 text-xs text-[#697282] text-center">
          © 2025 HCMUT - Đại học Bách Khoa TP.HCM
        </footer>
      </div>
    </div>
  );
};

export default AdminLoginPage;

