import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface User {
  id: number;
  name: string;
  role: string;
  token: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // THÊM: State isLoading, ban đầu là true
  const [isLoading, setIsLoading] = useState(true); 

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Invalid JSON in localStorage:", err);
      localStorage.removeItem("user");
    }
  }

  setIsLoading(false);
}, []);
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("id", JSON.stringify(userData.id));
    localStorage.setItem("role", JSON.stringify(userData.role));
  };
  
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