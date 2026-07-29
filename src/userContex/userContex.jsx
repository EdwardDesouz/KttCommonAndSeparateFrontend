import { createContext, useState, useEffect,useRef  } from "react";
import API from "../api/api";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    username: "",
    accountId: "",
    isLoggedIn: false,
  });

  const forcedLogoutRef = useRef(false);

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
  // SAFETY NET: tab/browser close -> notify backend to clear LoginStatus
  // =========================
  useEffect(() => {
    const handleUnload = () => {
      if (user.isLoggedIn && user.username) {
        try {
          navigator.sendBeacon(
            `${API.defaults.baseURL}/logoutUser/`,
            new Blob([JSON.stringify({ Username: user.username })], {
              type: "application/json",
            }),
          );
        } catch (e) {
          console.log("sendBeacon failed:", e);
        }
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [user.isLoggedIn, user.username]);


  

  // =========================
  // LOGIN
  // =========================
  const login = (username, accountId) => {
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
  const logout = async () => {
    if (user.username) {
      try {
        await API.post("/logoutUser/", { Username: user.username });
      } catch (err) {
        console.error("Logout API failed:", err);
      }
    }

    const userData = {
      username: "",
      accountId: "",
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
