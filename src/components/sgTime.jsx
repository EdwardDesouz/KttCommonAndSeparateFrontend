import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../userContex/userContex";

const getModuleLabel = (pathname) => {
  if (pathname.startsWith("/inpayment")) return "INPAYMENT";
  if (pathname.startsWith("/innonpayment")) return "INNONPAYMENT";
  if (pathname.startsWith("/out")) return "OUT";
  if (pathname.startsWith("/transhipment")) return "TRANSHIPMENT";
  if (pathname.startsWith("/coo"))return "COO";
  return "";
};

function SgTime() {
  const [sgTime, setSgTime] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isIndexPage = location.pathname === "/index";
  const isInpaymentListPage = location.pathname === "/inpayment";
  const moduleLabel = getModuleLabel(location.pathname);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const sgTimeString = now.toLocaleTimeString("en-SG", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Singapore",
      });
      setSgTime(sgTimeString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUserClick = () => setShowLogout(!showLogout);

const handleLogout = async () => {
  await logout();
  navigate("/");
};

  return (
    <div className="top-right-info">
      {moduleLabel && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 14px",
            borderRadius: "15%",
            background: "rgba(255, 5, 5, 0.12)",
            border: "1px solid #070707",
            color: "#000000",
            fontWeight: 600,
            fontSize: "0.8rem",
            letterSpacing: "0.5px",
          }}
        >
          {moduleLabel}
        </div>
      )}
      <div className="text-light sg-time">SGTIME: {sgTime}</div>

      {user.isLoggedIn ? (
        <div className="user-dropdown">
          <button className="text-light" onClick={handleUserClick}>
            WELCOME: {user.username.toUpperCase()}
          </button>
          {(isIndexPage || isInpaymentListPage) && showLogout && (
            <div className="logout-menu" onClick={handleLogout}>
              LOGOUT
            </div>
          )}
        </div>
      ) : (
        <button className="text-light" onClick={() => navigate("/")}>
          LOGIN
        </button>
      )}
    </div>
  );
}

export default SgTime;
