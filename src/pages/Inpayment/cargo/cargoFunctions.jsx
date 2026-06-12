import React, { useState, useEffect, useMemo, useContext, useRef } from "react";
import API from "../../../api/api";
import { UserContext } from "../../../userContex/userContex";

/* ===========================
   Reusable Search Popup with Pagination
=========================== */
export function SearchPopup({ title, data = [], onClose, onSelect, columns }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  // Filter data based on search
  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search, data],
  );
  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  // Reset to first page if search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  return (
    <div
      className="popup-overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="popup-content"
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 6,
          width: 700,
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        <h4>{title}</h4>
        <input
          type="text"
          placeholder={`Search ${title}...`}
          className="form-control mb-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table className="table table-bordered">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onSelect(item)}
                style={{ cursor: "pointer" }}
              >
                {columns.map((col) => (
                  <td key={col}>{item[col]}</td>
                ))}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <span>
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
            entries
          </span>
          <div>
            <button
              className="btn btn-secondary me-2"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
        <button className="btn btn-secondary mt-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
/* ===========================End Search Icon=========================== */

export const fetchPopupData = async (type, setPopupData, setLoading) => {
  setLoading(true);
  try {
    let response;
    switch (type) {
      case "releaselocation":
        response = await API.get("/getReleaseLocation/");
        break;
      case "receiptlocation":
        response = await API.get("/getReceiptLocation/");
        break;
      case "loadingport":
        response = await API.get("/getLoadingPort/");
        break;
      default:
        response = { data: [] };
    }
    setPopupData(response.data);
  } catch (err) {
    console.error("Failed to fetch popup data", err);
    setPopupData([]);
  } finally {
    setLoading(false);
  }
};
/* ===========================End Fetch Popup Data=========================== */

/* ===========================
   Current Popup Data
=========================== */

export const currentPopup = (popupType, setters) => {
  if (!popupType) return null;

  const {
    setReleaseLocation,
    setReleaseCode,
    setReleaseLocationCode,
    setReleaseLocationDescription,
    setReceiptLocation,
    setReceiptCode,
    setReceiptLocationCode,
    setReceiptLocationDescription,
    setLoadingPort,
    setLoadingPortCode,
    setLoadingPortName,
  } = setters;

  return {
    releaselocation: {
      title: "RELEASE LOCATION",
      columns: ["Code", "LocationCode", "Description"],
      onSelect: (item) => {
        setReleaseLocation(item);
        setReleaseCode(item.Code);
        setReleaseLocationCode(item.LocationCode);
        setReleaseLocationDescription(item.Description);
      },
    },
    receiptlocation: {
      title: "RECEIPT LOCATION",
      columns: ["Code", "LocationCode", "Description"],
      onSelect: (item) => {
        setReceiptLocation(item);
        setReceiptCode(item.Code);
        setReceiptLocationCode(item.LocationCode);
        setReceiptLocationDescription(item.Description);
      },
    },
    loadingport: {
      title: "LOADING PORT",
      columns: ["PortCode", "PortName", "Country"],
      onSelect: (item) => {
        setLoadingPort(item);
        setLoadingPortCode(item.PortCode);
        setLoadingPortName(item.PortName);
      },
    },
  }[popupType];
};

// ===================Date Function==============

export const useCargoDate = (initialDate = "") => {
  const [cargoDate, setCargoDate] = useState(initialDate);
  const [error, setError] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (val) => {
    if (!val) return null;
    const parts = val.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  };

  const handleBlur = (value, setValue, setErrorFunc) => {
    if (!value || value.trim() === "") {
      return;
    }

    const raw = value.replace(/\D/g, "");

    if (raw.length === 8) {
      const dd = raw.slice(0, 2);
      const mm = raw.slice(2, 4);
      const yyyy = raw.slice(4, 8);

      if (
        parseInt(dd) >= 1 &&
        parseInt(dd) <= 31 &&
        parseInt(mm) >= 1 &&
        parseInt(mm) <= 12
      ) {
        setValue(`${dd}/${mm}/${yyyy}`);
        setErrorFunc(false);
      } else {
        setValue(getTodayDate());
        setErrorFunc(true);
      }
    } else if (value.length === 10 && value.includes("/")) {
      setErrorFunc(false);
    } else {
      setValue(getTodayDate());
      setErrorFunc(false);
    }
  };

  const handleKeyDown = (e, setValue) => {
    if (e.key === " " || e.keyCode === 32) {
      e.preventDefault();
      setValue(getTodayDate());
    }
  };

  return {
    cargoDate,
    setCargoDate,
    error,
    setError,
    getTodayDate,
    parseDate,
    handleBlur,
    handleKeyDown,
  };
};
