import React, { useState, useMemo, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { SearchPopup } from "./partyFunctions";
import API from "../../../api/api";
import ApiChecking from "./apiChecking";

/* ===========================
   Main Party Component
=========================== */
function Party({
  setActiveTab,
  ImporterData = [],
  InwardData = [],
  FreightForwarder = [],
  ClaimantPary = [],
}) {
  const [popupType, setPopupType] = useState(null);
  const [importer, setImporter] = useState(null);
  const [inwardAgent, setInwardAgent] = useState(null);
  const [freightForwarder, setFreightForwarder] = useState(null);
  const [claimant, setClaimant] = useState(null);
  const [popupData, setPopupData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/getCommonImporterTableInfo");
        console.log("API is working! Response data:", response.data);
      } catch (error) {
        console.error("API call failed:", error);
      }
    };

    fetchData();
  }, []);

  const fetchPopupData = async (type) => {
    setLoading(true);
    try {
      let response = [];
      switch (type) {
        case "importer":
          response = await API.get("/getCommonImporterTableInfo");
          console.log("response:", response);
          break;
        default:
          response = [];
      }
      setPopupData(response.data);
    } catch (err) {
      console.error("Failed to fetch popup data", err);
      setPopupData([]);
    }
    setLoading(false);
  };

  const popupConfig = {
    importer: {
      title: "IMPORTER",
      data: ImporterData,
      columns: ["Code", "Name", "Name1", "CRUEI"],
      onSelect: (item) => setImporter(item),
    },
    inward: {
      title: "INWARD CARRIER AGENT",
      data: InwardData,
      columns: ["Code", "Name", "Name1", "CRUEI"],
      onSelect: (item) => setInwardAgent(item),
    },
    freightForwarder: {
      title: "FREIGHT FORWARDER",
      data: FreightForwarder,
      columns: ["Code", "Name", "Name1", "CRUEI"],
      onSelect: (item) => setFreightForwarder(item),
    },
    claimantparty: {
      title: "CLAIMANT PARTY",
      data: ClaimantPary,
      columns: ["Name", "Name1", "CRUEI", "ClaimantName", "ClaimantName1"],
      onSelect: (item) => setClaimant(item),
    },
  };

  const handleIconClick = async (type) => {
    setPopupType(type);
    await fetchPopupData(type);
  };

  const currentPopup = popupType ? popupConfig[popupType] : null;

  return (
    <div className="row g-2">
      <div className="App">
        <h1>API Integration Test</h1>
        <ApiChecking />
      </div>
      <div className="col-12">
        {/* DECLARANT COMPANY */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">DECLARANT COMPANY</label>
          <div className="col-sm-1"></div>
          <div className="col-sm-1">
            <input className="form-control" value="headdata" disabled />
          </div>
          <div className="col-sm-2">
            <input className="form-control" value="headCrueiNo" disabled />
          </div>
          <div className="col-sm-3">
            <input className="form-control" value="headname" disabled />
          </div>
          <div className="col-sm-3">
            <input className="form-control" value="headname1" disabled />
          </div>
        </div>

        {/* IMPORTER */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">IMPORTER</label>
          <div className="col-sm-1">
            <FaSearch
              className="me-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleIconClick("importer")}
            />
            <FaPlus style={{ cursor: "pointer" }} />
          </div>
          <div className="col-sm-1">
            <input
              className="form-control"
              value={importer?.Code || ""}
              readOnly
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              value={importer?.CRUEI || ""}
              readOnly
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={importer?.Name || ""}
              readOnly
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={importer?.Name1 || ""}
              readOnly
            />
          </div>
        </div>

        {/* INWARD CARRIER AGENT */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">
            INWARD CARRIER AGENT
          </label>
          <div className="col-sm-1">
            {/* <FaSearch
              className="me-3"
              style={{ cursor: "pointer" }}
              onClick={() => setPopupType("inward")}
            /> */}
            <FaSearch
              className="me-3"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                setPopupType("importer"); // show popup
                await fetchImporterData(); // fetch Importer data
              }}
            />
            <FaPlus style={{ cursor: "pointer" }} />
          </div>
          <div className="col-sm-1">
            <input
              className="form-control"
              value={inwardAgent?.Code || ""}
              readOnly
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              value={inwardAgent?.CRUEI || ""}
              readOnly
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={inwardAgent?.Name || ""}
              readOnly
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={inwardAgent?.Name1 || ""}
              readOnly
            />
          </div>
        </div>

        {/* FREIGHT FORWARDER  */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">FREIGHT FORWARDER</label>
          <div className="col-sm-1">
            <FaSearch
              className="me-3"
              style={{ cursor: "pointer" }}
              onClick={() => setPopupType("freightForwarder")}
            />
            <FaPlus style={{ cursor: "pointer" }} />
          </div>
          <div className="col-sm-1">
            <input
              className="form-control"
              value={freightForwarder?.Code || ""}
              readOnly
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              value={freightForwarder?.CRUEI || ""}
              readOnly
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={freightForwarder?.Name || ""}
              readOnly
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={freightForwarder?.Name1 || ""}
              readOnly
            />
          </div>
        </div>

        {/* CLAIMANT PARTY */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">CLAIMANT PARTY</label>
          <div className="col-sm-1">
            <FaSearch
              className="me-3"
              style={{ cursor: "pointer" }}
              onClick={() => setPopupType("claimantparty")}
            />
            <FaPlus style={{ cursor: "pointer" }} />
          </div>
          <div className="col-sm-1">
            <input
              className="form-control"
              value={claimant?.Name || ""}
              readOnly
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              value={claimant?.Name1 || ""}
              readOnly
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={claimant?.ClaimantName || ""}
              readOnly
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={claimant?.ClaimantName1 || ""}
              readOnly
            />
          </div>
        </div>

        {/* CLAIMANT ROW */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label"></label>
          <div className="col-sm-1 icon-contaniner"></div>
          <div className="col-sm-1">
            <input type="text" className="form-control" />
          </div>
          <div className="col-sm-5">
            <input type="text" className="form-control" disabled />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-4 d-flex justify-content-center gap-3">
          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("HeaderTab")}
          >
            PREVIOUS
          </button>

          <button
            className="NextpageBtns"
            onClick={() => {
              setImporter(null);
              setInwardAgent(null);
            }}
          >
            RESET
          </button>

          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("CargoTab")}
          >
            NEXT
          </button>
        </div>
      </div>

      {/* Render Popup */}
      {popupType === "importer" && (
        <SearchPopup
          title={currentPopup.title}
          data={popupData}
          columns={currentPopup.columns}
          onClose={() => setPopupType(null)}
          onSelect={(item) => {
            currentPopup.onSelect(item);
            setPopupType(null);
          }}
        />
      )}
    </div>
  );
}

export default Party;
