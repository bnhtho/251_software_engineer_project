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
  }

  const UserContext = createContext<UserContextType | undefined>(undefined);

  export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
    const login = (userData: User) => {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    // const login = (userData: User) => setUser(userData);
    const logout = () => 
      {
            localStorage.removeItem("user"); 
            setUser(null);
      };

    return (
      <UserContext.Provider value={{ user, login, logout }}>
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