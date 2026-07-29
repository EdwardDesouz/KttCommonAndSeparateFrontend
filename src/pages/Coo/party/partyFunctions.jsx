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
// export const fetchPopupData = async (type, setPopupData, setLoading) => {
//   setLoading(true);
//   try {
//     let response;
//     switch (type) {
//       case "importer":
//         response = await API.get("/getCommonImporterTableInfo/");
//         break;
//       case "handlingAgent":
//         response = await API.get("/getCommonHandlingAgentTableInfo/");
//         break;
//       case "inward":
//         response = await API.get("/getCommonInwardCarrierAgentTableInfo/");
//         break;
//       case "freightForwarder":
//         response = await API.get("/getCommonFreightForwarderTable/");
//         break;
//       case "claimantparty":
//         response = await API.get("/getCommonClaimantPartyTable/");
//         break;
//       case "consignee":
//         response = await API.get("/getCommonConsigneeTableInfo/");
//         break;
//       case "exporter":
//         response = await API.get("/getCommonExporterTableInfo/");
//         break;
//       case "outward":
//         response = await API.get("/getCommonOutwardCarrierAgentTableInfo/");
//         break;
//       case "endUser":
//         response = await API.get("/getCommonEndUserTableInfo/");
//         break;
//       case "manufacturer":
//         response = await API.get("/getCommonManufacturerTableInfo/");
//         break;
//       default:
//         response = { data: [] };
//     }
//     setPopupData(response.data);
//   } catch (err) {
//     console.error("Failed to fetch popup data", err);
//     setPopupData([]);
//   } finally {
//     setLoading(false);
//   }
// };

export const fetchPopupData = async (type, setPopupData, setLoading) => {
  setLoading(true);
  try {
    // Types with no Coo-specific table — Common only.
    const COMMON_ONLY_URLS = {
      claimantparty: "/getCommonClaimantPartyTable/",
      endUser: "/getCommonEndUserTableInfo/",
      handlingAgent: "/getCommonHandlingAgentTableInfo/",
      inward: "/getCommonInwardCarrierAgentTableInfo/",
      importer: "/getCommonImporterTableInfo/",
    };

    if (COMMON_ONLY_URLS[type]) {
      try {
        const res = await API.get(COMMON_ONLY_URLS[type]);
        setPopupData(res.data || []);
      } catch (err) {
        console.error(`Failed to fetch Common ${type} data`, err);
        setPopupData([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Exporter's Coo endpoint uses a different field naming scheme
    // (OutUserCode / OutUserName / OutUserCRUEI / OutUserAddress / ...)
    // — normalize both sides to the Common shape before merging.
    // NOTE: this mirrors the normalize logic already in Party.jsx's
    // fetchExporter useEffect. Worth double-checking that
    // coo/getCooExporterTableInfo/ actually returns OutUser*-named
    // fields rather than Coo-prefixed ones — if it doesn't, the merge
    // will silently drop the Coo-side data.
    if (type === "exporter") {
      try {
        const [commonResult, cooResult] = await Promise.allSettled([
          API.get("/getCommonExporterTableInfo/"),
          API.get("coo/getCooExporterTableInfo/"),
        ]);

        const commonData =
          commonResult.status === "fulfilled"
            ? commonResult.value.data || []
            : [];
        const cooData =
          cooResult.status === "fulfilled" ? cooResult.value.data || [] : [];

        if (commonResult.status === "rejected") {
          console.error(
            "Failed to fetch Common exporter data",
            commonResult.reason,
          );
        }
        if (cooResult.status === "rejected") {
          console.error("Failed to fetch Coo exporter data", cooResult.reason);
        }

        const normalize = (i) => ({
          Id: i.Id ?? i.id ?? 0,
          Code: i.Code ?? i.OutUserCode ?? "",
          CRUEI: i.CRUEI ?? i.OutUserCRUEI ?? "",
          Name: i.Name ?? i.OutUserName ?? "",
          Name1: i.Name1 ?? i.OutUserName1 ?? "",
          Address: i.Address ?? i.OutUserAddress ?? "",
          Address1: i.Address1 ?? i.OutUserAddress1 ?? "",
          City: i.City ?? i.OutUserCity ?? "",
          SubCode: i.SubCode ?? i.OutUserSubCode ?? "",
          Sub: i.Sub ?? i.OutUserSub ?? "",
          Postal: i.Postal ?? i.OutUserPostal ?? "",
          Country: i.Country ?? i.OutUserCountry ?? "",
        });

        const normCommon = commonData.map(normalize);
        const normCoo = cooData.map(normalize);

        const merged = [...normCommon];
        const seenCodes = new Set(
          normCommon.map((i) => i.Code.toLowerCase()),
        );
        for (const item of normCoo) {
          const code = item.Code.toLowerCase();
          if (code && !seenCodes.has(code)) {
            merged.push(item);
            seenCodes.add(code);
          }
        }

        setPopupData(merged);
      } catch (err) {
        console.error("Failed to fetch exporter popup data", err);
        setPopupData([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    let commonUrl, cooUrl, keyField;

    switch (type) {
      case "freightForwarder":
        commonUrl = "/getCommonFreightForwarderTable/";
        cooUrl = "coo/getCooFreightForwarderTableInfo/";
        keyField = "Code";
        break;
      case "consignee":
        commonUrl = "/getCommonConsigneeTableInfo/";
        cooUrl = "coo/getCooConsigneeTableInfo/";
        keyField = "ConsigneeCode";
        break;
      case "outward":
        commonUrl = "/getCommonOutwardCarrierAgentTableInfo/";
        cooUrl = "coo/getCooOutwardCarrierAgentTableInfo/";
        keyField = "Code";
        break;
      case "manufacturer":
        commonUrl = "/getCommonManufacturerTableInfo/";
        cooUrl = "coo/getCooManufacturerTableInfo/";
        keyField = "ManufacturerCode";
        break;
      default:
        setPopupData([]);
        setLoading(false);
        return;
    }

    // Fetch both tables in parallel; don't let one failing kill the other
    const [commonResult, cooResult] = await Promise.allSettled([
      API.get(commonUrl),
      API.get(cooUrl),
    ]);

    const commonData =
      commonResult.status === "fulfilled" ? commonResult.value.data || [] : [];
    const cooData =
      cooResult.status === "fulfilled" ? cooResult.value.data || [] : [];

    if (commonResult.status === "rejected") {
      console.error(`Failed to fetch Common ${type} data`, commonResult.reason);
    }
    if (cooResult.status === "rejected") {
      console.error(`Failed to fetch Coo ${type} data`, cooResult.reason);
    }

    // Merge, de-duping by code (case-insensitive), Common takes priority on conflicts
    const merged = [...commonData];
    const seenCodes = new Set(
      commonData.map((item) => String(item[keyField] || "").toLowerCase()),
    );

    for (const item of cooData) {
      const code = String(item[keyField] || "").toLowerCase();
      if (!seenCodes.has(code)) {
        merged.push(item);
        seenCodes.add(code);
      }
    }

    setPopupData(merged);
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
    setExporter,
    setExporterCode,
    setExporterCruei,
    setExporterName,
    setExporterName1,
    setInwardAgent,
    setInwardCode,
    setInwardCruei,
    setInwardName,
    setInwardName1,
    setOutwardAgent,
    setOutwardCode,
    setOutwardCruei,
    setOutwardName,
    setOutwardName1,
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

    setConsignee,
    setCongineeCode,
    setCongineeCruei,
    setCongineeName,
    setCongineeName1,
    setCongineeAddress,
    setCongineeAddress1,
    setCongineeCity,
    setCongineeSubCode,
    setCongineeSubDivision,
    setCongineePostel,
    setCongineeCountryCode,

    setEndUser,
    setEndUserCode,
    setEndUserCruei,
    setEndUserName,
    setEndUserName1,
    setEndUserAddress,
    setEndUserAddress1,
    setEndUserCity,
    setEndUserSubCode,
    setEndUserSubDivision,
    setEndUserPostal,
    setEndUserCountryCode,

    setManufacturer,
    setManufacturerCode,
    setManufacturerCruei,
    setManufacturerName,
    setManufacturerName1,
    setManufacturerAddress,
    setManufacturerAddress1,
    setManufacturerCity,
    setManufacturerSub,
    setManufacturerSubDivi,
    setManufacturerPostal,
    setManufacturerCountry,

    setHandlingAgent,
    setHandlingAgentCode,
    setHandlingAgentCruei,
    setHandlingAgentName,
    setHandlingAgentName1,
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
    consignee: {
      title: "CONSIGNEE",
      columns: [
        "ConsigneeCode",
        "ConsigneeCRUEI",
        "ConsigneeName",
        "ConsigneeName1",
        "ConsigneeCity",
        "ConsigneeCountry",
      ],
      onSelect: (item) => {
        setConsignee(item);
        setCongineeCode(item.ConsigneeCode);
        setCongineeCruei(item.ConsigneeCRUEI);
        setCongineeName(item.ConsigneeName);
        setCongineeName1(item.ConsigneeName1);
        setCongineeAddress(item.ConsigneeAddress);
        setCongineeAddress1(item.ConsigneeAddress1);
        setCongineeCity(item.ConsigneeCity);
        setCongineeSubCode(item.ConsigneeSub);
        setCongineeSubDivision(item.ConsigneeSubDivi);
        setCongineePostel(item.ConsigneePostal);
        setCongineeCountryCode(item.ConsigneeCountry);
      },
    },
    exporter: {
      title: "EXPORTER",
      columns: ["Code", "Name", "CRUEI", "Name1"],
      onSelect: (item) => {
        setExporter(item);
        setExporterCode(item.Code);
        setExporterCruei(item.CRUEI);
        setExporterName(item.Name);
        setExporterName1(item.Name1);
      },
    },
    outward: {
      title: "OUTWARD CARRIER AGENT",
      columns: ["Code", "Name", "CRUEI", "Name1"],
      onSelect: (item) => {
        setOutwardAgent(item);
        setOutwardCode(item.Code);
        setOutwardCruei(item.CRUEI);
        setOutwardName(item.Name);
        setOutwardName1(item.Name1);
      },
    },
    endUser: {
      title: "END USER",
      columns: [
        "EndUserCode",
        "EndUserCRUEI",
        "EndUserName",
        "EndUserName1",
        "EndUserCity",
        "EndUserCountry",
      ],
      onSelect: (item) => {
        setEndUser(item);
        setEndUserCode(item.EndUserCode);
        setEndUserCruei(item.EndUserCRUEI);
        setEndUserName(item.EndUserName);
        setEndUserName1(item.EndUserName1);
        setEndUserAddress(item.EndUserAddress);
        setEndUserAddress1(item.EndUserAddress1);
        setEndUserCity(item.EndUserCity);
        setEndUserSubCode(item.EndUserSub);
        setEndUserSubDivision(item.EndUserSubDivi);
        setEndUserPostal(item.EndUserPostal);
        setEndUserCountryCode(item.EndUserCountry);
      },
    },
    manufacturer: {
      title: "MANUFACTURER",
      columns: [
        "ManufacturerCode",
        "ManufacturerCRUEI",
        "ManufacturerName",
        "ManufacturerName1",
        "ManufacturerCity",
        "ManufacturerCountry",
      ],
      onSelect: (item) => {
        setManufacturer(item);
        setManufacturerCode(item.ManufacturerCode);
        setManufacturerCruei(item.ManufacturerCRUEI);
        setManufacturerName(item.ManufacturerName);
        setManufacturerName1(item.ManufacturerName1);
        setManufacturerAddress(item.ManufacturerAddress);
        setManufacturerAddress1(item.ManufacturerAddress1);
        setManufacturerCity(item.ManufacturerCity);
        setManufacturerSub(item.ManufacturerSub);
        setManufacturerSubDivi(item.ManufacturerSubDivi);
        setManufacturerPostal(item.ManufacturerPostal);
        setManufacturerCountry(item.ManufacturerCountry);
      },
    },
    handlingAgent: {
      title: "HANDLING AGENT",
      columns: ["Code", "Name", "CRUEI", "Name1"],
      onSelect: (item) => {
        setHandlingAgent(item);
        setHandlingAgentCode(item.Code);
        setHandlingAgentCruei(item.CRUEI);
        setHandlingAgentName(item.Name);
        setHandlingAgentName1(item.Name1);
      },
    },
  }[popupType];
};

/* ===========================End Current Popup Data=========================== */
