import { createContext, useState, useEffect } from "react";


export const UserContext = createContext();
export function UserProvider({ children }) {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(
    storedUser || { username: "", isLoggedIn: false }
  );

  const login = (username) => {
    const userData = { username, isLoggedIn: true };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser({ username: "", isLoggedIn: false });
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      if (updatedUser) setUser(updatedUser);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}