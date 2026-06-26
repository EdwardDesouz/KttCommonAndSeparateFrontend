import React, { useState, useEffect } from "react";

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
};

const ToastNotification = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const bgColor = {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f97316",
    info: "#3b82f6",
  }[toast.type] || "#22c55e";

  return (
    <div style={{
      position: "fixed",
      top: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: bgColor,
      color: "white",
      padding: "12px 20px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      zIndex: 9999,
      fontSize: "14px",
      fontWeight: "500",
      minWidth: "120px",
      textAlign: "center",
      width:"50%"
    }}>
      {toast.message}
    </div>
  );
};

export default ToastNotification;