import { useEffect, useContext, useCallback, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { useInpayment } from "../context/inpaymentContext";
import { UserContext } from "../../../userContex/userContex";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import { useDebounceAutoSave } from "../../../autoSave/useDebounceAutoSave";

function Cpc({ setActiveTab, isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const {
    permitDetails,
    updatePermitDetails,
    showAeo,
    setShowAeo,
    showCwc,
    setShowCwc,
    cnBChecked,
    setCnBChecked,
    showScheme,
    setShowScheme,
    aeoRows,
    setAeoRows,
    cwcRows,
    setCwcRows,
    schemeRows,
    setSchemeRows,

    // additional requirements for save as draft functions
    decType,
    prevPermitNo,
    cargo,
    transportMode,
    bgInd,
    supplyInd,
    refDocs,
    declFor,
    Licence,
    Recipients,
    importerCode,
    inwardCode,
    freightForwarderCode,
    claimantCode,
    showVoyageNumber,
    voyageNumber,
    showVesselName,
    vesselName,
    showOblNumber,
    obl,
    showconveyanceNumber,
    conveyanceNumber,
    showTransportDetails,
    transportDetails,
    showFlightNumber,
    flightNumber,
    showAirCraftRegNumber,
    airCraftRegNumber,
    showMawbNumber,
    mawbNumber,
    cargoHawb,
    arrivalDate,
    loadingPortCode,
    releaseCode,
    releaseLocationDescription,
    receiptCode,
    receiptLocationDescription,
    totalOuterPackValue,
    totalOuterPackName,
    totalGrossWeight,
    grossUOM,
    blanketStartDate,
  } = useInpayment();

  const maxRows = 5;

  const emptyRow = () => ({
    ProcessingCode1: "",
    ProcessingCode2: "",
    ProcessingCode3: "",
  });

  const toggleCheckbox = (setter) => () => setter((prev) => !prev);

  const addRow = (rows, setRows) => {
    if (rows.length >= maxRows) return alert("EXCEED THE MAXIMUM NUMBERS (5)");
    setRows([...rows, emptyRow()]);
  };

  const deleteRow = (index, rows, setRows) => {
    if (rows.length === 1) return alert("At least one row must remain.");
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleInputChange = (rowIndex, field, value, rows, setRows) => {
    const newRows = rows.map((row, i) =>
      i === rowIndex ? { ...row, [field]: value } : row,
    );
    setRows(newRows);
  };

  useEffect(() => {
    const logRows = (type, rows) => {
      console.group(`CPC TYPE: ${type}`);
      rows.forEach((row, index) => {
        console.log(`Row ${index + 1}`, {
          ProcessingCode1: row.ProcessingCode1,
          ProcessingCode2: row.ProcessingCode2,
          ProcessingCode3: row.ProcessingCode3,
        });
      });
      console.groupEnd();
    };
    if (showAeo) logRows("AEO", aeoRows);
    if (showCwc) logRows("CWC", cwcRows);
    if (showScheme) logRows("SCHEME", schemeRows);
    if (cnBChecked) {
      console.group("CPC TYPE: CNB");
      console.log("CNB is ACTIVE (no rows attached)");
      console.groupEnd();
    }
  }, [aeoRows, cwcRows, schemeRows, cnBChecked, showAeo, showCwc, showScheme]);

  const renderTable = (rows, setRows) => (
    <>
      <div className="col-12 mb-2">
        <div className="row fw-bold text-center">
          <div className="col-sm-2"></div>
          <div className="col-sm-1"></div>
          <div className="col-sm-2">Processing Code 1</div>
          <div className="col-sm-2">Processing Code 2</div>
          <div className="col-sm-2">Processing Code 3</div>
          <div className="col-sm-1"></div>
        </div>
      </div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="col-12">
          <div className="row align-items-center compact-row">
            <label className="col-sm-2 col-form-label"></label>
            <div className="col-sm-1 icon-contaniner">
              {rowIndex === rows.length - 1 && (
                <FaPlus
                  style={{
                    cursor: rows.length >= maxRows ? "not-allowed" : "pointer",
                    opacity: rows.length >= maxRows ? 0.4 : 1,
                  }}
                  onClick={() => addRow(rows, setRows)}
                />
              )}
            </div>
            <div className="col-sm-2">
              <input
                type="text"
                className="form-control"
                value={row.ProcessingCode1}
                onChange={(e) =>
                  handleInputChange(
                    rowIndex,
                    "ProcessingCode1",
                    e.target.value,
                    rows,
                    setRows,
                  )
                }
              />
            </div>
            <div className="col-sm-2">
              <input
                type="text"
                className="form-control"
                value={row.ProcessingCode2}
                onChange={(e) =>
                  handleInputChange(
                    rowIndex,
                    "ProcessingCode2",
                    e.target.value,
                    rows,
                    setRows,
                  )
                }
              />
            </div>
            <div className="col-sm-2">
              <input
                type="text"
                className="form-control"
                value={row.ProcessingCode3}
                onChange={(e) =>
                  handleInputChange(
                    rowIndex,
                    "ProcessingCode3",
                    e.target.value,
                    rows,
                    setRows,
                  )
                }
              />
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="DeleteContainerBtn"
                disabled={rows.length === 1}
                style={{
                  opacity: rows.length === 1 ? 0.4 : 1,
                  cursor: rows.length === 1 ? "not-allowed" : "pointer",
                }}
                onClick={() => deleteRow(rowIndex, rows, setRows)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  const prepareCpcData = useCallback(() => {
    const touchTime = new Date().toISOString();
    const touchUser = user?.username;
    const cpcPayload = [];
    const formatSection = (rows, type) => {
      return rows
        .filter(
          (row) =>
            row.ProcessingCode1 || row.ProcessingCode2 || row.ProcessingCode3,
        )
        .map((row, index) => ({
          PermitId: permitDetails?.PermitId || "",
          MessageType: "INP",
          RowNo: index + 1,
          CPCType: type,
          ProcessingCode1: row.ProcessingCode1 || "",
          ProcessingCode2: row.ProcessingCode2 || "",
          ProcessingCode3: row.ProcessingCode3 || "",
          TouchUser: touchUser,
          TouchTime: touchTime,
        }));
    };
    if (showAeo) cpcPayload.push(...formatSection(aeoRows, "AEO"));
    if (showCwc) cpcPayload.push(...formatSection(cwcRows, "CWC"));
    if (showScheme) cpcPayload.push(...formatSection(schemeRows, "SCHEME"));

    if (cnBChecked) {
      cpcPayload.push({
        PermitId: permitDetails?.PermitId || "",
        MessageType: "INP",
        RowNo: 1,
        CPCType: "CNB",
        TouchUser: touchUser,
        TouchTime: touchTime,
      });
    }
    return cpcPayload;
  }, [
    aeoRows,
    cwcRows,
    schemeRows,
    showAeo,
    showCwc,
    showScheme,
    cnBChecked,
    permitDetails,
    user,
  ]);

  useEffect(() => {
    const currentData = prepareCpcData();
    if (currentData.length > 0) {
      console.log("CPC Data Ready for Final Save:", currentData);
    }
  }, [prepareCpcData]);

  // console.log("prepareCpcData:",prepareCpcData)

  // ===================== SAVE AS DRAFT =====================
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftReason, setDraftReason] = useState("");
  const [draftReasonError, setDraftReasonError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatDraftDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "") return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const handleSaveAsDraftClick = () => {
    setDraftReason("");
    setDraftReasonError(false);
    setShowDraftModal(true);
  };

  const handleCancelDraftModal = () => {
    setShowDraftModal(false);
    setDraftReason("");
    setDraftReasonError(false);
  };

  const handleConfirmSaveAsDraft = async () => {
    if (!draftReason.trim()) {
      setDraftReasonError(true);
      return;
    }
    setIsSaving(true);
    try {
      const TouchUser = (user?.username || "").toUpperCase();
      const TouchTime = new Date().toISOString();

      // ── Step 1: Save CPC rows first (same as Summary) ──
      const cpcPayload = [];

      const formatSection = (rows, type) => {
        return rows
          .filter(
            (row) =>
              row.ProcessingCode1 || row.ProcessingCode2 || row.ProcessingCode3,
          )
          .map((row, index) => ({
            PermitId: (permitDetails?.PermitId || "").toUpperCase(),
            MessageType: "IPTDEC",
            RowNo: index + 1,
            CPCType: type,
            ProcessingCode1: row.ProcessingCode1 || "",
            ProcessingCode2: row.ProcessingCode2 || "",
            ProcessingCode3: row.ProcessingCode3 || "",
            TouchUser,
            TouchTime,
          }));
      };

      if (showAeo) cpcPayload.push(...formatSection(aeoRows, "AEO"));
      if (showCwc) cpcPayload.push(...formatSection(cwcRows, "CWC"));
      if (showScheme) cpcPayload.push(...formatSection(schemeRows, "SCHEME"));

      if (cnBChecked) {
        cpcPayload.push({
          PermitId: (permitDetails?.PermitId || "").toUpperCase(),
          MessageType: "IPTDEC",
          RowNo: 1,
          CPCType: "CNB",
          ProcessingCode1: "",
          ProcessingCode2: "",
          ProcessingCode3: "",
          TouchUser,
          TouchTime,
        });
      }

      if (cpcPayload.length > 0) {
        await API.post("/postCpcTable/", cpcPayload);
      }

      // ── Step 2: Save header as draft ──
      const headerPayload = {
        PermitId: permitDetails?.PermitId || "",
        Refid: permitDetails?.RefId || "",
        JobId: permitDetails?.JobId || "",
        MSGId: permitDetails?.MsgId || "",
        TradeNetMailboxID:
          permitDetails?.TradeNetMailboxID || permitDetails?.MailBoxId || "",
        MessageType: "IPTDEC",
        DeclarationType: decType || "",
        PreviousPermit: prevPermitNo || "",
        CargoPackType: cargo || "",
        InwardTransportMode: transportMode || "",
        BGIndicator: bgInd || "",
        SupplyIndicator: supplyInd ? "true" : "false",
        ReferenceDocuments: refDocs ? "true" : "false",
        DeclarningFor: declFor || "",
        License: Licence || "",
        Recipient: Recipients || "",
        DeclarantCompanyCode: permitDetails?.DeclarantCode || "",
        ImporterCompanyCode: importerCode || "",
        InwardCarrierAgentCode: inwardCode || "",
        FreightForwarderCode: freightForwarderCode || "",
        ClaimantPartyCode: claimantCode || "",
        VoyageNumber: showVoyageNumber ? voyageNumber || "" : "",
        VesselName: showVesselName ? vesselName || "" : "",
        OceanBillofLadingNo: showOblNumber ? obl || "" : "",
        ConveyanceRefNo: showconveyanceNumber ? conveyanceNumber || "" : "",
        TransportId: showTransportDetails ? transportDetails || "" : "",
        FlightNO: showFlightNumber ? flightNumber || "" : "",
        AircraftRegNo: showAirCraftRegNumber ? airCraftRegNumber || "" : "",
        MasterAirwayBill: showMawbNumber ? mawbNumber || "" : "",
        HBL: cargoHawb || "",
        ArrivalDate: formatDraftDate(arrivalDate) || null,
        LoadingPortCode: loadingPortCode || "",
        ReleaseLocation: releaseCode || "",
        ResLoaName: releaseLocationDescription || "",
        RecepitLocation: receiptCode || "",
        RecepitLocName: receiptLocationDescription || "",
        TotalOuterPack: totalOuterPackValue || "",
        TotalOuterPackUOM: totalOuterPackName || "",
        TotalGrossWeight: totalGrossWeight || "",
        TotalGrossWeightUOM: grossUOM || "",
        BlanketStartDate: formatDraftDate(blanketStartDate) || null,
        Message: draftReason.trim().toUpperCase(),
        Status: "SAVEASDRF",
        prmtStatus: "SAVEASDRF",
        TouchUser,
        TouchTime,
        MRDate: null,
        MRTime: "",
      };

      const response = await API.post("/postCommonHeaderTable/", [
        headerPayload,
      ]);

      if (response?.data) {
        const updatedPermit = {
          ...permitDetails,
          JobId: response.data.JobId || permitDetails?.JobId,
          MsgId: response.data.MSGId || permitDetails?.MsgId,
        };
        updatePermitDetails(updatedPermit);
        sessionStorage.setItem("currentPermit", JSON.stringify(updatedPermit));

        setShowDraftModal(false);
        setDraftReason("");
        setDraftReasonError(false);

        alert("Draft Saved Successfully!");
        navigate("/inpayment");
      }
    } catch (err) {
      console.error("SAVE AS DRAFT ERROR:", err);
      alert("❌ Error saving draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // =====================Auto save every filling Details==============================

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "") return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  // const autoSavePayload = useMemo(() => {
  //   if (!permitDetails?.PermitId) return null;
  //   return {
  //     PermitId: (permitDetails?.PermitId || "").toUpperCase(),
  //     Refid: permitDetails?.RefId || "",
  //     JobId: permitDetails?.JobId || "",
  //     MSGId: permitDetails?.MsgId || "",
  //     TradeNetMailboxID:
  //       permitDetails?.TradeNetMailboxID || permitDetails?.MailBoxId || "",
  //     MessageType: "IPTDEC",
  //     DeclarationType: decType || "",
  //     PreviousPermit: prevPermitNo || "",
  //     CargoPackType: cargo || "",
  //     InwardTransportMode: transportMode || "",
  //     BGIndicator: bgInd || "",
  //     SupplyIndicator: supplyInd ? "true" : "false",
  //     ReferenceDocuments: refDocs ? "true" : "false",
  //     DeclarningFor: declFor || "",
  //     License: Licence || "",
  //     Recipient: Recipients || "",
  //     DeclarantCompanyCode: permitDetails?.DeclarantCode || "",
  //     // party fields
  //     ImporterCompanyCode: importerCode || "",
  //     InwardCarrierAgentCode: inwardCode || "",
  //     FreightForwarderCode: freightForwarderCode || "",
  //     ClaimantPartyCode: claimantCode || "",
  //     // ── Transport (from Header) ────────────────────────
  //     VoyageNumber: showVoyageNumber ? voyageNumber || "" : "",
  //     VesselName: showVesselName ? vesselName || "" : "",
  //     OceanBillofLadingNo: showOblNumber ? obl || "" : "",
  //     ConveyanceRefNo: showconveyanceNumber ? conveyanceNumber || "" : "",
  //     TransportId: showTransportDetails ? transportDetails || "" : "",
  //     FlightNO: showFlightNumber ? flightNumber || "" : "",
  //     AircraftRegNo: showAirCraftRegNumber ? airCraftRegNumber || "" : "",
  //     MasterAirwayBill: showMawbNumber ? mawbNumber || "" : "",
  //     // ── Cargo fields ───────────────────────────────────
  //     HBL: cargoHawb || "",
  //     ArrivalDate: formatDate(arrivalDate) || null,
  //     LoadingPortCode: loadingPortCode || "",
  //     ReleaseLocation: releaseCode || "",
  //     ResLoaName: releaseLocationDescription || "",
  //     RecepitLocation: receiptCode || "",
  //     RecepitLocName: receiptLocationDescription || "",
  //     TotalOuterPack: totalOuterPackValue || "",
  //     TotalOuterPackUOM: totalOuterPackName || "",
  //     TotalGrossWeight: totalGrossWeight || "",
  //     TotalGrossWeightUOM: grossUOM || "",
  //     BlanketStartDate: formatDate(blanketStartDate) || null,
  //     // reamining
  //     Status: "DISCONNECT",
  //     prmtStatus: "DISCONNECT",
  //     TouchUser: (user?.username || "").toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Message: "AUTO-SAVED|TAB:CpcPage",
  //     MRTime: "",
  //   };
  // }, [
  //   permitDetails,
  //   decType,
  //   prevPermitNo,
  //   cargo,
  //   transportMode,
  //   bgInd,
  //   supplyInd,
  //   refDocs,
  //   declFor,
  //   Licence,
  //   Recipients,
  //   // Party page Reamainig
  //   importerCode,
  //   inwardCode,
  //   freightForwarderCode,
  //   claimantCode,
  //   // Cargo Page & Remaining
  //   voyageNumber,
  //   vesselName,
  //   obl,
  //   conveyanceNumber,
  //   transportDetails,
  //   flightNumber,
  //   airCraftRegNumber,
  //   mawbNumber,
  //   showVoyageNumber,
  //   showVesselName,
  //   showOblNumber,
  //   showconveyanceNumber,
  //   showTransportDetails,
  //   showFlightNumber,
  //   showAirCraftRegNumber,
  //   showMawbNumber,
  //   cargoHawb,
  //   arrivalDate,
  //   loadingPortCode,
  //   releaseCode,
  //   releaseLocationDescription,
  //   receiptCode,
  //   receiptLocationDescription,
  //   totalOuterPackValue,
  //   totalOuterPackName,
  //   totalGrossWeight,
  //   grossUOM,
  //   blanketStartDate,
  //   user,
  // ]);

  // useDebounceAutoSave({
  //   payload: autoSavePayload,
  //   enabled: !isViewMode,
  //   delay: 2000,
  // });

  // =========================================UI=========================================

  return (
    <div className="row g-2 container mt-4">
      {/* AEO */}
      <div className="col-12">
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">AEO</label>
          <div className="col-sm-1 icon-contaniner">
            <input
              type="checkbox"
              id="Aeo"
              checked={showAeo}
              onChange={toggleCheckbox(setShowAeo)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        </div>
        {showAeo && renderTable(aeoRows, setAeoRows)}
      </div>

      {/* CWC */}
      <div className="col-12">
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">CWC</label>
          <div className="col-sm-1 icon-contaniner">
            <input
              type="checkbox"
              id="Cwc"
              checked={showCwc}
              onChange={toggleCheckbox(setShowCwc)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        </div>
        {showCwc && renderTable(cwcRows, setCwcRows)}
      </div>

      {/* CNB */}
      <div className="col-12">
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">CNB</label>
          <div className="col-sm-1 icon-contaniner">
            <input
              type="checkbox"
              id="Cnb"
              checked={cnBChecked}
              onChange={toggleCheckbox(setCnBChecked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>

      {/* SCHEME */}
      <div className="col-12">
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">SCHEME</label>
          <div className="col-sm-1 icon-contaniner">
            <input
              type="checkbox"
              id="Scheme"
              checked={showScheme}
              onChange={toggleCheckbox(setShowScheme)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        </div>
        {showScheme && renderTable(schemeRows, setSchemeRows)}
      </div>

      {/* Navigation */}
      <div className="mt-4 d-flex justify-content-center gap-3">
        <button
          className="NextpageBtns view-nav-btn"
          tabIndex="17"
          id="PartySaveDraft"
          onClick={handleSaveAsDraftClick}
        >
          SAVE AS DRAFT
        </button>
        <button
          className="NextpageBtns view-nav-btn"
          onClick={() => setActiveTab("ItemTab")}
        >
          PREVIOUS
        </button>
        <button
          className="NextpageBtns view-nav-btn"
          onClick={() => setActiveTab("SummaryTab")}
        >
          NEXT
        </button>
      </div>
      {showDraftModal && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1040,
            }}
            onClick={handleCancelDraftModal}
          />
          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              zIndex: 1050,
              width: "460px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#1a6db5",
                color: "#fff",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                SAVE AS DRAFT
              </span>
              <span
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                onClick={handleCancelDraftModal}
              >
                ✕
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 24px 16px 24px" }}>
              <div
                style={{
                  backgroundColor: "#fff8e1",
                  border: "1px solid #ffe082",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  marginBottom: "18px",
                  fontSize: "13px",
                  color: "#7b5800",
                }}
              >
                This permit will be saved as <strong>DRAFT (DRF)</strong>. You
                can continue filling the remaining details later.
              </div>

              <label
                style={{
                  fontWeight: "600",
                  fontSize: "13px",
                  marginBottom: "6px",
                  display: "block",
                  color: "#333",
                }}
              >
                WHY ARE YOU SAVING AS DRAFT?{" "}
                <span style={{ color: "red" }}>*</span>
              </label>

              <textarea
                rows={4}
                className="form-control"
                value={draftReason}
                onChange={(e) => {
                  setDraftReason(e.target.value);
                  if (e.target.value.trim()) setDraftReasonError(false);
                }}
                style={{
                  resize: "vertical",
                  fontSize: "13px",
                  border: draftReasonError
                    ? "1px solid red"
                    : "1px solid #ced4da",
                  borderRadius: "4px",
                  padding: "8px",
                  width: "100%",
                }}
                autoFocus
              />

              {draftReasonError && (
                <span
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "4px",
                    display: "block",
                  }}
                >
                  Please provide a reason before saving as draft.
                </span>
              )}

              <div
                style={{
                  textAlign: "right",
                  fontSize: "11px",
                  color: draftReason.length > 200 ? "red" : "#888",
                  marginTop: "4px",
                }}
              >
                {draftReason.length} / 200
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 24px 20px 24px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                className="NextpageBtns"
                onClick={handleCancelDraftModal}
                disabled={isSaving}
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  padding: "7px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                CANCEL
              </button>

              <button
                className="NextpageBtns"
                onClick={handleConfirmSaveAsDraft}
                disabled={isSaving || draftReason.length > 200}
                style={{
                  backgroundColor: isSaving ? "#90caf9" : "#1a6db5",
                  color: "#fff",
                  border: "none",
                  padding: "7px 20px",
                  borderRadius: "4px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                {isSaving ? "SAVING..." : "💾 SAVE AS DRAFT"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cpc;
