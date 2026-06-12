import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../userContex/userContex";

function SgTime() {
  const [sgTime, setSgTime] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isIndexPage = location.pathname === "/index";
  const isInpaymentListPage = location.pathname === "/inpayment";

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="top-right-info">
      <div className="text-light sg-time">SGTIME: {sgTime}</div>
      {user.isLoggedIn ? (
        <div className="user-dropdown">
          <button className="text-light" onClick={handleUserClick}>
            WELCOME: {user.username.toUpperCase()}
          </button>
          {(isIndexPage || isInpaymentListPage)  && showLogout && (
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
