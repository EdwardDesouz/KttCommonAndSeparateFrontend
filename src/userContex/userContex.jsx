
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    username: "",
     accountId: "", 
    isLoggedIn: false,
  });

  // =========================
  // LOAD FROM LOCALSTORAGE ON START
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.log("Invalid user data in storage");
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = (username,accountId ) => {
   console.log("login() called with:", username, accountId);
    const userData = {
      username,
      accountId,
      isLoggedIn: true,
    };
  console.log(" userData being saved:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    const userData = {
      username: "",
      isLoggedIn: false,
    };

    setUser(userData);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}