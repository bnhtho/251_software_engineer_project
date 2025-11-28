import React, { useState, useEffect } from "react";
import hcmutLogo from '/src/assets/logo.svg';
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setToken } = useUser();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || window.location.pathname !== "/login") return;

    const role = user.role;
    console.log(role)
    let redirectPath = "/"; // Đường dẫn mặc định (Fallback)

    switch (role) {
      case "student":
        redirectPath = "/dashboard";
        break;
      case "tutor":
        redirectPath = "/tutor/dashboard";
        break;
      default:
        toast.error("Không xác định được role!")
        // Xử lý vai trò không xác định hoặc mặc định
        redirectPath = "/welcome";
        break;
    }

    navigate(redirectPath, { replace: true });
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    // SECTION: Gửi yêu cầu đăng nhập đến backend
    axios
      .post("http://localhost:8081/auth/login", { email, password })
      .then(async (response) => {
        const token = response.data.data;
        // Lưu token vào UserProvider, setUser async
        await setToken(token);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });

  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
        <div className="flex flex-col items-center w-full max-w-md bg-gray-50">
          {/* Header */}
          <header className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img className="w-12 h-12" alt="HCMUT Logo" src={hcmutLogo} />
              <div>
                <h1 className="text-2xl font-normal text-[#101727]">HCMUT</h1>
                <p className="text-sm text-[#697282] leading-5">
                  Hệ thống gia sư
                </p>
              </div>
            </div>
            <h2 className="text-base font-normal text-[#101727] leading-6">
              Đăng nhập hệ thống
            </h2>
            <p className="text-sm text-[#495565] leading-5">
              Vui lòng chọn vai trò và đăng nhập
            </p>
          </header>

          {/* Card */}
          <main className="bg-white rounded-xl shadow-md p-8 w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm text-neutral-950 font-normal">
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
                    placeholder="example@hcmut.edu.vn"
                    className="w-full pl-10 pr-3 py-2 bg-[#f3f3f5] rounded-lg text-sm text-[#717182] border border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm text-neutral-950 font-normal">
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
                <a href="#forgot-password" className="text-[#0b7a9f] hover:underline">
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
            <div className="text-center text-sm text-[#495565] mt-5 space-y-2">
              <div>
                Chưa có tài khoản?{" "}
                <a href="#register" className="text-[#0b7a9f] hover:underline">
                  Đăng ký ngay
                </a>
              </div>
              <div>
                Bạn là Admin?{" "}
                <a href="/admin/login" className="text-[#0b7a9f] hover:underline">
                  Đăng nhập Admin
                </a>
              </div>
            </div>
          </main>

          <footer className="mt-6 text-xs text-[#697282] text-center">
            © 2025 HCMUT - Đại học Bách Khoa TP.HCM
          </footer>
        </div>

      </div>
    </>
  );
};

export default LoginPage;
