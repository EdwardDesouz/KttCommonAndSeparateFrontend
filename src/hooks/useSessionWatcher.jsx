import { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContex/userContex";
import API from "../api/api";

const POLL_INTERVAL_MS = 1000; 

export default function useSessionWatcher() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!user.isLoggedIn) return;

    const check = async () => {
      try {
        const res = await API.get("/checkSession/");
        if (!res.data.valid) throw new Error("invalid");
      } catch (err) {
        clearInterval(intervalRef.current);
        sessionStorage.setItem(
          "forcedLogoutMsg",
          "Someone has taken over your login. You have been logged out."
        );
        await logout();
        navigate("/");
      }
    };

    intervalRef.current = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [user.isLoggedIn]);
}