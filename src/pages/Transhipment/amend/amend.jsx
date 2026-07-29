import { useState, useEffect, useContext } from "react";
import { useTranshipment } from "../context/transhipmentContext";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../userContex/userContex";
import { CircleLoader } from "react-spinners";

function Amend({ setActiveTab, isViewMode }) {
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
    outTransportMode, // ⬅ missing
    coType, // ⬅ missing
    declFor,
    bgInd,
    supplyInd,
    refDocs,
    Licence,
    Recipients,
    certificateType1, // ⬅ missing
    certificateCopy1, // ⬅ missing
    certificateType2, // ⬅ missing
    certificateCopy2, // ⬅ missing
    currencyCode, // ⬅ missing
    additionalCertificateDetails, // ⬅ missing
    transportDetailsHeader, // ⬅ missing
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
    endUserCode, // ⬅ missing
    manufacturerCode, // ⬅ missing
    handlingAgentCode, // ⬅ missing
    exporterCode, // ⬅ missing
    outwardCode, // ⬅ missing
    congineeCode, // ⬅ missing

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
    exhibitionStartDate,
    exhibitionEndDate, // ⬅ missing
    containers,

    storageCode, // ⬅ missing
    dischargePortCode, // ⬅ missing
    finalDestinationCountry, // ⬅ missing
    departureDate, // ⬅ missing
    outVoyageNumber,
    outVesselName,
    outObl, // ⬅ missing
    vesselType,
    vesselNetRegisterTonnage,
    vesselNationality, // ⬅ missing
    towingVesselId,
    towingVesselName, // ⬅ missing
    nextPortCode,
    lastPortCode, // ⬅ missing
    outConveyanceNumber,
    outTransportDetails, // ⬅ missing
    outFlightNumber,
    outAirCraftRegNumber,
    outMawbNumber, // ⬅ missing
    outCargoHawb, // ⬅ missing
    outSeaStore, // ⬅ missing
    showTransportDetails, // ⬅ missing (gates TransportId)

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
  } = useTranshipment();

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
      Permitno: (permitNumber || permitDetails?.PermitNumber || "").trim(),
      AmendmentCount: amendCount,
      UpdateIndicator: "AME",
      ReplacementPermitno: replacementPermitNumber,
      DescriptionOfReason: amendDescription,
      PermitExtension: permitValidity ? "True" : "False",
      ExtendImportPeriod: extendPeriod,
      DeclarationIndigator: declarationChecked ? "True" : "False",
      AmendType: amendType,
      TouchUser: touchUser,
      TouchTime: touchTime,
      MSGId: msgId,
    };

    // ── Header payload (unchanged from your current version) ────────────
    const headerPayload = {
      Refid: permitDetails?.RefId || "",
      JobId: permitDetails?.JobId || "",
      MSGId: msgId,
      PermitId: permitId,
      TradeNetMailboxID:
        permitDetails?.MailBoxId || permitDetails?.TradeNetMailboxID || "",
      MessageType: "TNPDEC",
      DeclarationType: decType || "",
      PreviousPermit: prevPermitNo || "",
      CargoPackType: cargo || "",
      InwardTransportMode: transportMode || "",
      OutwardTransportMode: outTransportMode || "",
      COType: coType || "",
      BGIndicator: bgInd || "",
      SupplyIndicator: supplyInd ? "Y" : "N",
      ReferenceDocuments: refDocs ? "Y" : "N",
      License: Licence || "",
      Recipient: Recipients || "",
      CerDetailtype1: certificateType1 || "",
      CerDetailCopies1: certificateCopy1 || "",
      CerDetailtype2: certificateType2 || "",
      CerDetailCopies2: certificateCopy2 || "",
      CurrencyCode: currencyCode || "",
      TransDtl: transportDetailsHeader || "",
      AddCerDtl: additionalCertificateDetails || "",
      DeclarantCompanyCode: permitDetails?.Code || "",
      ImporterCompanyCode: importerCode || "",
      ExporterCompanyCode: exporterCode || "",
      InwardCarrierAgentCode: inwardCode || "",
      OutwardCarrierAgentCode: outwardCode || "",
      CONSIGNEECode: congineeCode || "",
      FreightForwarderCode: freightForwarderCode || "",
      ClaimantPartyCode: claimantCode || "",
      EndUserCode: endUserCode || "",
      Manufacturer: manufacturerCode || "",
      HandlingAgentCode: handlingAgentCode || "",
      ArrivalDate: formatDate(arrivalDate) || null,
      LoadingPortCode: loadingPortCode || "",
      VoyageNumber: voyageNumber || "",
      VesselName: vesselName || "",
      OceanBillofLadingNo: obl || "",
      ConveyanceRefNo: conveyanceNumber || "",
      TransportId: showTransportDetails ? transportDetails || "" : "",
      FlightNO: flightNumber || "",
      AircraftRegNo: airCraftRegNumber || "",
      MasterAirwayBill: mawbNumber || "",
      ReleaseLocation: releaseCode || "",
      ResLoaName: releaseLocationDescription || "",
      RecepitLocation: receiptCode || "",
      RecepitLocName: receiptLocationDescription || "",
      StorageLocation: storageCode || "",
      BlanketStartDate: formatDate(blanketStartDate) || null,
      ExhibitionSDate: formatDate(exhibitionStartDate) || null,
      ExhibitionEDate: formatDate(exhibitionEndDate) || null,
      DepartureDate: formatDate(departureDate) || null,
      DischargePort: dischargePortCode || "",
      FinalDestinationCountry: finalDestinationCountry || "",
      OutVoyageNumber: outVoyageNumber || "",
      OutVesselName: outVesselName || "",
      OutOceanBillofLadingNo: outObl || "",
      VesselType: vesselType || "",
      VesselNetRegTon: vesselNetRegisterTonnage || "",
      VesselNationality: vesselNationality || "",
      TowingVesselID: towingVesselId || "",
      TowingVesselName: towingVesselName || "",
      NextPort: nextPortCode || "",
      LastPort: lastPortCode || "",
      OutConveyanceRefNo: outConveyanceNumber || "",
      OutTransportId: outTransportDetails || "",
      OutFlightNO: outFlightNumber || "",
      OutAircraftRegNo: outAirCraftRegNumber || "",
      OutMasterAirwayBill: outMawbNumber || "",
      TotalOuterPack: totalOuterPackValue || "",
      TotalOuterPackUOM: totalOuterPackName || "",
      // TotalGrossWeight: totalGrossWeight || "",
      TotalGrossWeight:
        permitGrossWeight !== "" && permitGrossWeight !== undefined
          ? permitGrossWeight
          : totalGrossWeight || "",
      TotalGrossWeightUOM: grossUOM || "",
      ReleaseLocaName: "",
      INHAWB: cargoHawb || "",
      outHAWB: outCargoHawb || "",
      seastore: outSeaStore ? "Y" : "N",
      GrossReference: summaryCrossReference || "",
      TradeRemarks: summaryRemarks || "",
      InternalRemarks: summaryInternalReamarks || "",
      CustomerRemarks: "",
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
      DeclarningFor: declFor || "--Select--",
      MRDate: formatDate(summaryDate) || null,
      MRTime: summaryTime || "",
    };

    try {
      // Save amend record — postTransAmendTable mirrors
      // CommonAmend -> TransAmend server-side.
      await API.post("/postTransAmendTable/", amendPayload);

      // Then save/update the canonical header
      await API.post("/postCommonHeaderTable/", headerPayload);

      // Mirror header into TranshipmentHeader (same pattern as
      // Transhipment Summary's doSavePermit mirroring)
      // Note: TranshipmentHeader uses ReleaseLocName instead of ResLoaName
      // and RemovalStartDate instead of BlanketStartDate — match Summary's mapping.
      const transHeaderPayload = {
        ...headerPayload,
        ReleaseLocName: releaseLocationDescription || "",
      };
      delete transHeaderPayload.ResLoaName;

      try {
        await API.post(
          "transhipment/postTransHeaderTable/",
          transHeaderPayload,
        );
      } catch (mirrorErr) {
        console.error("Mirror header save failed", mirrorErr);
        setSaveMessage(
          "Warning: Amend was saved but failed to mirror to TranshipmentHeader. " +
            `Error: ${mirrorErr.response?.data?.error || mirrorErr.message}`,
        );
        setSaving(false);
        return;
      }

      setSaveMessage("Permit saved successfully.");
      setTimeout(() => navigate("/transhipment"), 1000);
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
          <input className="inputStyle" value="AME" disabled />
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
      {saving && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <CircleLoader size={60} color="#35e00b" loading={saving} />
          <div
            style={{
              marginTop: "16px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#165f03",
            }}
          >
            SAVING PERMIT...
          </div>
        </div>
      )}
    </div>
  );
}

export default Amend;
