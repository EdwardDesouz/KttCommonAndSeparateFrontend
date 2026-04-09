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

/* ===========================
   Fetch Popup Data
=========================== */
export const fetchPopupData = async (type, setPopupData, setLoading) => {
  setLoading(true);
  try {
    let response;
    switch (type) {
      case "importer":
        response = await API.get("/getCommonImporterTableInfo/");
        break;
      case "inward":
        response = await API.get("/getCommonInwardCarrierAgentTableInfo/");
        break;
      case "freightForwarder":
        response = await API.get("/getCommonFreightForwarderTable/");
        break;
      case "claimantparty":
        response = await API.get("/getCommonClaimantPartyTable/");
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
    setImporter,
    setImporterCode,
    setImporterCruei,
    setImporterName,
    setImporterName1,
    setInwardAgent,
    setInwardCode,
    setInwardCruei,
    setInwardName,
    setInwardName1,
    setFreightForwarder,
    setFreightForwarderCode,
    setFreightForwarderCruei,
    setFreightForwarderName,
    setFreightForwarderName1,
    setClaimant,
    setClaimantCode,
    setClaimantCruei,
    setClaimantName,
    setClaimantName1,
    setclaimantcmantName,
    setclaimantcmantName1,
  } = setters;

  return {
    importer: {
      title: "IMPORTER",
      columns: ["Code", "Name", "CRUEI", "Name1"],
      onSelect: (item) => {
        setImporter(item);
        setImporterCode(item.Code);
        setImporterCruei(item.CRUEI);
        setImporterName(item.Name);
        setImporterName1(item.Name1);
      },
    },
    inward: {
      title: "INWARD CARRIER AGENT",
      columns: ["Code", "Name", "CRUEI", "Name1"],
      onSelect: (item) => {
        setInwardAgent(item);
        setInwardCode(item.Code);
        setInwardCruei(item.CRUEI);
        setInwardName(item.Name);
        setInwardName1(item.Name1);
      },
    },
    freightForwarder: {
      title: "FREIGHT FORWARDER",
      columns: ["Code", "Name", "CRUEI", "Name1"],
      onSelect: (item) => {
        setFreightForwarder(item);
        setFreightForwarderCode(item.Code);
        setFreightForwarderCruei(item.CRUEI);
        setFreightForwarderName(item.Name);
        setFreightForwarderName1(item.Name1);
      },
    },
    claimantparty: {
      title: "CLAIMANT PARTY",
      columns: [
        "ClaimantCode",
        "CRUEI",
        "Name",
        "Name1",
        "ClaimantName",
        "ClaimantName1",
      ],
      onSelect: (item) => {
        setClaimant(item);
        setClaimantCode(item.ClaimantCode);
        setClaimantCruei(item.CRUEI);
        setClaimantName(item.Name);
        setClaimantName1(item.Name);
        setclaimantcmantName(item.ClaimantName);
        setclaimantcmantName1(item.ClaimantName1);
      },
    },
  }[popupType];
};

/* ===========================End Current Popup Data=========================== */
