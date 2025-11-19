import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  // User info taken from JWT and profile API
  id: number;
  role: string;
  firstName?: string;
  lastName?: string;
    hcmutId: string;        // MSSV
    dob: string;            // Ngày sinh
    otherMethodContact: string; //phương 
    phone: string;          // Số điện thoại
    bio: string;
    majorName :string; // ngành học
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  setUserDirectly: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------

const getToken = () => localStorage.getItem("authToken");

const decodeToken = (token: string) => {
  const decoded: any = jwtDecode(token);
  console.log("Decoded token:", decoded);
  if (decoded.exp * 1000 < Date.now()) throw new Error("Token expired");
  return decoded;
};

const fetchProfile = async (id: number, token: string) => {
  const res = await fetch(`http://localhost:8081/students/profile/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");

  const json = await res.json();
  return json.data ?? json; // phòng trường hợp API bọc { data: {...} }
};

// --------------------------------------------------------------
// Provider
// --------------------------------------------------------------

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Allow loginPage to set token
  const setToken = async (token: string) => {
    localStorage.setItem("authToken", token);
    await loadUserFromToken(token);
  };
// Load dữ liệu user từ token
const loadUserFromToken = async (token: string) => {
  try {
    const decoded = decodeToken(token);
    const profile = await fetchProfile(Number(decoded.sub), token);
    console.log("profile", profile);
    setUser({ ...decoded, ...profile });
  } catch (err) {
    setUser(null);
    localStorage.removeItem("authToken");
  } finally {
    setIsLoading(false);
  }
};

const setUserDirectly = (fetchedUser: User) => {
  setUser(fetchedUser);
  setIsLoading(false);
};
  

  // Load user on refresh
  useEffect(() => {
    const token = getToken();
    if (token) loadUserFromToken(token);
    else setIsLoading(false);
  }, []);

  // Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, setToken, logout, setUserDirectly }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};

export default UserProvider;
