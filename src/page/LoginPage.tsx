import React, { useState } from "react";
import hcmutLogo from '/src/assets/logo.svg';
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

export const LoginPage = () => {
    // selectedRole state
  const [selectedRole, setSelectedRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  // const login
  const { login } = useUser();
  const navigate = useNavigate();
  const roles = [
    { id: "student", label: "Sinh viên", value: "student" },
    { id: "tutor", label: "Gia sư", value: "tutor" },
    { id: "admin", label: "Admin", value: "admin" },
  ];

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ selectedRole, email, password, rememberMe });
    const userID = 123; 
    
    
    if (email === "test@hcmut.edu.vn" && password === "123456") {
      console.log("Login success!");
      // NOTE:[Logic] Khi sử lý với backend, lấy user data từ backend trả về login({...})
      login({
        id: 123, // trả về ID
        name: "User Test", // trả về name
        role: "student", // trả về role
      });
      navigate(`/home/${userID}`); // navigator vào trang chủ
      
    } else {
      alert("Sai thông tin đăng nhập!");
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
                Tutor/Mentor System
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
            {/* Role selection */}
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm text-neutral-950">Vai trò</legend>
              <div className="flex gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`w-1/3 py-2 rounded-lg border text-sm transition-colors ${
                      selectedRole === role.value
                        ? "bg-[#0b7a9f] text-white"
                        : "bg-white text-[#354152] border-[#d0d5db] hover:bg-gray-100"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </fieldset>

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
                  placeholder="example@hcmut.edu.vn"
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
            Chưa có tài khoản?{" "}
            <a href="#register" className="text-[#0b7a9f] hover:underline">
              Đăng ký ngay
            </a>
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

export default LoginPage;
