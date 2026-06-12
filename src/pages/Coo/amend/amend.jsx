import { useState, useEffect, useContext } from "react";
import { useCoo } from "../context/cooContext";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../userContex/userContex";

function Amend({ setActiveTab,isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const {
    permitDetails,

    // Header
    decType,
    prevPermitNo,
    setPrevPermitNo,
    showPermit,
    setShowPermit,
    cargo,
    transportMode,
    declFor,
    bgInd,
    supplyInd,
    refDocs,
    Licence,
    Recipients,
    showDeclarationTypeError,
    setShowDeclarationTypeError,
    showCargoPackTypeError,
    setShowCargoPackTypeError,
    showDeclaringForError,
    setShowDeclaringForError,
    setShowInwardTransportError,
    showInwardTransportError,
    // Party
    importerCode,
    showImporterCrueiError,
    setShowImporterCrueiError,
    showImporterNameError,
    setShowImporterNameError,
    inwardCode,
    showInwardCrueiError,
    setShowInwardCrueiError,
    showInwardNameError,
    setShowInwardNameError,
    freightForwarderCode,
    claimantCode,
    // Cargo
    cargoHawb,
    arrivalDate,
    showArriavalDateError,
    setShowArrivalDateError,
    loadingPortCode,
    showLoadingPortCodeError,
    setShowLoadingPortCodeError,
    voyageNumber,
    vesselName,
    obl,
    conveyanceNumber,
    transportDetails,
    flightNumber,
    airCraftRegNumber,
    mawbNumber,
    releaseCode,
    showReleaseCodeError,
    setShowReleaseCodeError,
    releaseLocationDescription,
    receiptCode,
    showreceiptCodeError,
    setShowReceiptCodeError,
    receiptLocationDescription,
    totalOuterPackValue,
    totalOuterPackName,
    showTotalOuterPackValueError,
    setShowTotalOuterPackValueError,
    showTotalOuterPackUomError,
    setShowTotalOuterPackUomError,
    permitGrossWeight,
    totalGrossWeight,
    grossUOM,
    showTotalGrossWeightError,
    setShowTotalGrossWeightError,
    showGrossUOMError,
    setShowGrossUOMError,
    blanketStartDate,
    containers,

    // Invoice & Item tables
    invoiceTable,
    itemTable,

    // Summary states
    summaryImporterCruei,
    setSummaryImporterCruei,
    summaryImporterName,
    setSummaryImporterName,
    totalAmountPayable,
    setTotalAmountPayable,
    showCifMatchingError,
    setShowCifMatchingError,
    summaryRemarks,
    setSummaryRemarks,
    formatRemark,
    setFormatRemark,
    summaryCrossReference,
    setSummaryCrossReference,
    summaryInternalReamarks,
    setSummaryInternalRemarks,
    summaryDate,
    setSummaryDate,
    summaryTime,
    setSummaryTime,
    summaryDeclaringFor,
    setSummaryDeclaringFor,
    // CPC
    showAeo,
    showCwc,
    showScheme,
    cnBChecked,
    aeoRows,
    cwcRows,
    schemeRows,
  } = useCoo();

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "") return "1900-01-01";
    const parts = dateStr.split("/");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const toDecimal = (val) => {
    if (val === null || val === undefined || val === "") return 0.0;
    const num = parseFloat(String(val).replace(/,/g, ""));
    return isNaN(num) ? 0.0 : num;
  };

  const toBigInt = (val) => {
    if (val === null || val === undefined || val === "") return null;
    const num = parseInt(val, 10);
    return isNaN(num) ? null : num;
  };

  const cleanSelect = (val) => {
    if (!val || String(val).trim() === "--Select--") return "";
    return val;
  };

  // ── Computed Totals ──────────────────────────────────────────────────────
  const totalItemValue = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.TotalLineAmount) || 0),
    0,
  );

  const totalInvoiceCifValue = invoiceTable.reduce(
    (sum, inv) => sum + (parseFloat(inv.CIFSUMAmount) || 0),
    0,
  );

  const totalItemCifValue = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.CIFFOB) || 0),
    0,
  );

  const totalItemGstAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.GSTAmount) || 0),
    0,
  );

  const sumOfExciseDutyAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.ExciseDutyAmount) || 0),
    0,
  );

  const sumOfCustomsDutyAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.CustomsDutyAmount) || 0),
    0,
  );

  const sumOfOtherTaxAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.OtherTaxAmount) || 0),
    0,
  );

  const [amendCount, setAmendCount] = useState("");
  const [updateIndicator, setUpdateIndicator] = useState("");
  const [permitNumber, setPermitNumber] = useState("");
  const [replacementPermitNumber, setReplacementPermitNumber] = useState("");
  const [amendType, setAmendType] = useState("");
  const [amendDescription, setAmendDescription] = useState("");
  const [permitValidity, setPermitValidity] = useState(false);
  const [extendPeriod, setExtendPeriod] = useState("");
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showAmendTypeError, setShowAmendTypeError] = useState(false);
  const [showDescError, setShowDescError] = useState(false);

  // Load existing amend data
  useEffect(() => {
    const msgId = permitDetails?.MsgId || permitDetails?.MSGId;
    if (!msgId) return;

    API.get("/getAmendPermitByMsgId/", { params: { MSGId: msgId } })
      .then((res) => {
        const rows = res.data;
        if (Array.isArray(rows) && rows.length > 0) {
          const d = rows[0];
          setAmendCount(d.AmendmentCount || "");
          setUpdateIndicator(d.UpdateIndicator || "");
          setPermitNumber(d.Permitno || "");
          setReplacementPermitNumber(d.ReplacementPermitno || "");
          setAmendType(d.AmendType || "");
          setAmendDescription(d.DescriptionOfReason || "");
          setPermitValidity(
            d.PermitExtension === "True" || d.PermitExtension === "true",
          );
          setExtendPeriod(d.ExtendImportPeriod || "");
          setDeclarationChecked(
            d.DeclarationIndigator === "True" ||
              d.DeclarationIndigator === "true",
          );
        } else {
          // New amend - pre-fill from header
          setPermitNumber(permitDetails?.PermitNumber || "");
          setUpdateIndicator(permitDetails?.prmtStatus || "");
        }
      })
      .catch((err) => {
        console.error("Failed to load amend data:", err);
        setPermitNumber(permitDetails?.PermitNumber || "");
        setUpdateIndicator(permitDetails?.prmtStatus || "");
      });
  }, [permitDetails?.MsgId, permitDetails?.MSGId]);
  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    let valid = true;
    if (!amendType || amendType === "--Select--") {
      setShowAmendTypeError(true);
      valid = false;
    }
    if (!amendDescription.trim()) {
      setShowDescError(true);
      valid = false;
    }
    if (!declarationChecked) {
      alert("Please tick the Declaration Indicator before saving.");
      valid = false;
    }
    return valid;
  };

  const handleSavePermit = async () => {
    if (!validate()) return;

    setSaving(true);
    setSaveMessage("");

    const msgId = permitDetails?.MsgId || permitDetails?.MSGId || "";
    const permitId = permitDetails?.PermitId || "";
    const touchUser = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"))?.username || "";
      } catch {
        return "";
      }
    })();
    const touchTime = new Date().toISOString().slice(0, 19).replace("T", " ");

    // ── Amend payload ────────────────────────────────────────────────────
    const amendPayload = {
      Permitno: permitId,
      AmendmentCount: amendCount,
      UpdateIndicator: updateIndicator,
      ReplacementPermitno: replacementPermitNumber,
      DescriptionOfReason: amendDescription,
      PermitExtension: permitValidity ? "True" : "False",
      ExtendImportPeriod: extendPeriod,
      DeclarationIndigator: declarationChecked ? "True" : "False",
      AmendType: amendType,
      TouchUser: touchUser,
      TouchTme: touchTime,
      MSGId: msgId,
    };

    // ── Header payload (only fields needed for amend update) ────────────
    const headerPayload = {
      Refid: permitDetails?.RefId || "",
      JobId: permitDetails?.JobId || "",
      MSGId: msgId,
      PermitId: permitId,
      TradeNetMailboxID:
        permitDetails?.MailBoxId || permitDetails?.TradeNetMailboxID || "",
      MessageType: "TNPDEC",
      DeclarationType: cleanSelect(decType),
      PreviousPermit: prevPermitNo || "",
      CargoPackType: cleanSelect(cargo),
      InwardTransportMode: cleanSelect(transportMode),
      BGIndicator: cleanSelect(bgInd),
      SupplyIndicator: supplyInd ? "Y" : "N",
      ReferenceDocuments: refDocs ? "Y" : "N",
      License: Licence || "",
      Recipient: Recipients || "",
      DeclarantCompanyCode: permitDetails?.DeclarantCode || "",
      ImporterCompanyCode: importerCode || "",
      InwardCarrierAgentCode: inwardCode || "",
      FreightForwarderCode: freightForwarderCode || "",
      ClaimantPartyCode: claimantCode || "",
      HBL: cargoHawb || "",
      ArrivalDate: formatDate(arrivalDate),
      LoadingPortCode: loadingPortCode || "",
      VoyageNumber: voyageNumber || "",
      VesselName: vesselName || "",
      OceanBillofLadingNo: obl || "",
      ConveyanceRefNo: conveyanceNumber || "",
      TransportId: transportDetails || "",
      FlightNO: flightNumber || "",
      AircraftRegNo: airCraftRegNumber || "",
      MasterAirwayBill: mawbNumber || "",
      ReleaseLocation: releaseCode || "",
      ResLoaName: releaseLocationDescription || "",
      RecepitLocation: receiptCode || "",
      RecepitLocName: receiptLocationDescription || "",
      TotalOuterPack: totalOuterPackValue || "",
      TotalOuterPackUOM: cleanSelect(totalOuterPackName),
      TotalGrossWeight: totalGrossWeight || "",
      TotalGrossWeightUOM: cleanSelect(grossUOM),
      BlanketStartDate: formatDate(blanketStartDate),
      GrossReference: summaryCrossReference || "",
      TradeRemarks: summaryRemarks || "",
      InternalRemarks: summaryInternalReamarks || "",
      DeclareIndicator: declarationChecked ? "Y" : "N",
      NumberOfItems: toDecimal(itemTable.length),
      TotalCIFFOBValue: toDecimal(totalItemCifValue),
      TotalGSTTaxAmt: toDecimal(totalItemGstAmount),
      TotalExDutyAmt: toDecimal(sumOfExciseDutyAmount),
      TotalCusDutyAmt: toDecimal(sumOfCustomsDutyAmount),
      TotalODutyAmt: toDecimal(sumOfOtherTaxAmount),
      TotalAmtPay: toDecimal(totalAmountPayable),
      Status: "NEW",
      TouchUser: touchUser,
      TouchTime: touchTime,
      PermitNumber: permitDetails?.PermitNumber || "",
      prmtStatus: "AMD",
      Cnb: cnBChecked ? "Y" : "N",
      DeclarningFor: declFor || "",
      MRDate: formatDate(summaryDate),
      MRTime: summaryTime || "",
    };

    try {
      // Save amend record first
      await API.post("/postAmendTable/", amendPayload);
      // Then save/update header
      await API.post("/postCommonHeaderTable/", headerPayload);

      setSaveMessage("Permit saved successfully.");
      setTimeout(() => navigate("/innonpayment"), 1000);
    } catch (err) {
      console.error("Amend save error:", err);
      setSaveMessage(
        err?.response?.data?.error || "Failed to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="col-12">
      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-3">
        UPDATE INFORMATION
      </div>

      <div className="row mt-3">
        <div className="col-3">AMENDMENT COUNT</div>
        <div className="col-3">UPDATE INDICATOR</div>
        <div className="col-3">PERMIT NUMBER</div>
        <div className="col-3">REPLACEMENT PERMIT NUMBER</div>
      </div>

      <div className="row mt-2">
        <div className="col-3">
          <input
            className="inputStyle"
            value={amendCount}
            onChange={(e) => setAmendCount(e.target.value)}
          />
        </div>
        <div className="col-3">
          <input
            className="inputStyle"
            value={updateIndicator}
            onChange={(e) => setUpdateIndicator(e.target.value)}
          />
        </div>
        <div className="col-3">
          <input
            className="inputStyle"
            value={permitNumber}
            onChange={(e) => setPermitNumber(e.target.value)}
          />
        </div>
        <div className="col-3">
          <input
            className="inputStyle"
            value={replacementPermitNumber}
            onChange={(e) => setReplacementPermitNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-3">
        AMENDMENT INFORMATION
      </div>

      <div className="row mt-3">
        <div className="col-6">AMEND TYPE</div>
        <div className="col-6">DESCRIPTION OF REASON</div>
      </div>

      <div className="row mt-2">
        <div className="col-6">
          <select
            className="Dropdown"
            style={{ width: "60%" }}
            value={amendType}
            onChange={(e) => {
              setAmendType(e.target.value);
              setShowAmendTypeError(false);
            }}
          >
            <option value="">--Select--</option>
            <option value="CUSTOMER REQUEST">CUSTOMER REQUEST</option>
            <option value="CUSTOMER COMPLAINT">CUSTOMER COMPLAINT</option>
            <option value="LOCAL COMPLAINT">LOCAL COMPLAINT</option>
          </select>
          {showAmendTypeError && (
            <span className="ErrColor" style={{ display: "block" }}>
              PLEASE CHOOSE AMEND TYPE
            </span>
          )}
        </div>
        <div className="col-6">
          <textarea
            className="inputStyle"
            style={{ height: "40px", width: "95%" }}
            value={amendDescription}
            onChange={(e) => {
              setAmendDescription(e.target.value);
              setShowDescError(false);
            }}
          />
          {showDescError && (
            <span className="ErrColor" style={{ display: "block" }}>
              PLEASE ENTER DESCRIPTION OF REASON
            </span>
          )}
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <input
            type="checkbox"
            id="AmendPermitValidity"
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
            checked={permitValidity}
            onChange={(e) => setPermitValidity(e.target.checked)}
          />
          <label htmlFor="AmendPermitValidity" style={{ marginLeft: "6px" }}>
            PERMIT VALIDITY EXTENSION
          </label>
        </div>
      </div>

      <div className="row mt-1">
        <div className="col">
          EXTEND IMPORT PERIOD (REASON FOR EXTENSION OF VALIDITY FOR TEMPORARY /
          EXHIBIT CARGOES)
        </div>
      </div>

      <div className="row mt-1">
        <div className="col">
          <textarea
            className="inputStyle"
            style={{ height: "40px", width: "60%" }}
            value={extendPeriod}
            onChange={(e) => setExtendPeriod(e.target.value)}
          />
        </div>
      </div>

      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-3">
        DECLARATION INDICATOR
      </div>

      <div className="row mt-2">
        <div className="col">
          <input
            type="checkbox"
            id="AmendDeclarationCheck"
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
            checked={declarationChecked}
            onChange={(e) => setDeclarationChecked(e.target.checked)}
          />
          <label htmlFor="AmendDeclarationCheck" style={{ marginLeft: "6px" }}>
            I/WE DECLARE THAT ALL PARTICULARS IN THIS APPLICATION ARE TRUE AND
            CORRECT
          </label>
        </div>
      </div>

      {saveMessage && (
        <div
          className="row mt-3"
          style={{ color: saveMessage.includes("success") ? "green" : "red" }}
        >
          <div className="col">{saveMessage}</div>
        </div>
      )}

<div className="mt-4 d-flex justify-content-center gap-3">
  <button
    className="NextpageBtns view-nav-btn"
    onClick={() => setActiveTab("SummaryTab")}
  >
    PREVIOUS
  </button>
  {isViewMode ? (
    <button
      className="NextpageBtns view-nav-btn"
      onClick={() => window.close()}
    >
      CLOSE
    </button>
  ) : (
    <button
      className="NextpageBtns"
      onClick={handleSavePermit}
      disabled={saving}
    >
      {saving ? "SAVING..." : "SAVE PERMIT"}
    </button>
  )}
</div>
      <br />
    </div>
  );
}

export default Amend;
