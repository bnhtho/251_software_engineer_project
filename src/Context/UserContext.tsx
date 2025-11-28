import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: number;
  role: string;
  firstName?: string;
  lastName?: string;
  hcmutId: string;
  dob: string;
  otherMethodContact: string;
  phone: string;
  bio: string;
  majorName: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  setUserDirectly: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// --------------------------------------------
// Helpers
// --------------------------------------------
const getToken = () => localStorage.getItem("authToken");

export const decodeToken = (token: string) => {
  const decoded: any = jwtDecode(token);
  if (decoded.exp * 1000 < Date.now()) throw new Error("Token expired");
  return decoded;
};

const fetchProfile = async (token: string) => {
  const decoded = jwtDecode<{ role: string }>(token);

  // Map role to API path
  const roleMap: Record<string, string> = {
    TUTOR: "tutors",
    STUDENT: "students",
    ADMIN: "admin",
  };

  const rolePath = roleMap[decoded.role];

  if (!rolePath) {
    throw new Error("Invalid role in token");
  }

  const res = await fetch(`http://localhost:8081/${rolePath}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch profile");

  const json = await res.json();
  return json.data ?? json;
};

// --------------------------------------------
// Provider
// --------------------------------------------
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = async (token: string) => {
    localStorage.setItem("authToken", token);
    await loadUserFromToken(token);
  };

  const loadUserFromToken = async (token: string) => {
    try {
      const decoded = decodeToken(token);
      const profile = await fetchProfile(token);

      const normalizedRole = decoded.role.toLowerCase();

      setUser({
        ...profile,
        id: decoded.id,
        role: normalizedRole,
      });
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

  useEffect(() => {
    const token = getToken();
    if (token) loadUserFromToken(token);
    else setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, isLoading, setToken, logout, setUserDirectly }}
    >
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
