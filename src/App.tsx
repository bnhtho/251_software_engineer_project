import { BrowserRouter, Routes, Route} from "react-router-dom";
import LoginPage from "./page/LoginPage";
import Schedule from "./page/Schedule";
import HomePage from "./page/HomePage";
import Profile from "./page/Profile";
import Layout from "./Components/Layout";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang login không có Layout */}
        <Route path="/" element={<LoginPage />} />
        {/* Các route có layout (Navbar + Sidebar) */}
        <Route path="/home/:userID" element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* home/idUser */}
          {/* home/idUser/schedule */}
          <Route path="schedule" element={<Schedule />} />
          {/* home/idUser/profile */}
          <Route path="profile" element={<Profile />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
