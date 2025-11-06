import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
  id: number;
  name: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  // THÊM: Trạng thái loading
  isLoading: boolean; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // THÊM: State isLoading, ban đầu là true
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // ĐẶT isLoading thành false sau khi kiểm tra localStorage
    setIsLoading(false); 
  }, []); // Chỉ chạy một lần khi component mount

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }
  
  const logout = () => 
    {
          localStorage.removeItem("user");
          localStorage.removeItem("lastPath");
          setUser(null);
    };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}> 
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("useUser must be used within a UserProvider");
  return context;
};