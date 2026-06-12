import { useState, useEffect, useContext } from "react";
import { useTranshipment } from "../context/transhipmentContext";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import { UserContext } from "../../../userContex/userContex";
import { FaTrash } from "react-icons/fa";

function Refund({ setActiveTab,isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    permitDetails,
    decType,
    prevPermitNo,
    cargo,
    transportMode,
    declFor,
    bgInd,
    supplyInd,
    refDocs,
    Licence,
    Recipients,
    importerCode,
    inwardCode,
    freightForwarderCode,
    claimantCode,
    cargoHawb,
    arrivalDate,
    loadingPortCode,
    voyageNumber,
    vesselName,
    obl,
    conveyanceNumber,
    transportDetails,
    flightNumber,
    airCraftRegNumber,
    mawbNumber,
    releaseCode,
    releaseLocationDescription,
    receiptCode,
    receiptLocationDescription,
    totalOuterPackValue,
    totalOuterPackName,
    permitGrossWeight,
    totalGrossWeight,
    grossUOM,
    blanketStartDate,
    containers,
    invoiceTable,
    itemTable,
    summaryRemarks,
    summaryCrossReference,
    summaryInternalReamarks,
    summaryDate,
    summaryTime,
    cnBChecked,
    showAeo,
    showCwc,
    showScheme,
    aeoRows,
    cwcRows,
    schemeRows,
    uploadedFiles,
    setUploadedFiles,
  } = useTranshipment();

  // ── UPDATE INFORMATION STATES ──────────────────────────────────────
  const [updateIndicator, setUpdateIndicator] = useState("");
  const [permitNumber, setPermitNumber] = useState("");
  const [replacementPermitNumber, setReplacementPermitNumber] = useState("");

  // ── REFUND INFORMATION STATES ──────────────────────────────────────
  const [typeOfRefund, setTypeOfRefund] = useState("");
  const [reasonForRefund, setReasonForRefund] = useState("");
  const [refundDescription, setRefundDescription] = useState("");

  // ── DROPDOWN OPTIONS ───────────────────────────────────────────────
  const [refundTypeOptions, setRefundTypeOptions] = useState([]);
  const [reasonForRefundOptions, setReasonForRefundOptions] = useState([]);
  const [documentAttachType, setDocumentAttachType] = useState([]);

  // ── REFUND SUMMARY VISIBILITY ──────────────────────────────────────
  const [showRefundSummary, setShowRefundSummary] = useState(false);
  const [showItemRefund, setShowItemRefund] = useState(false);
  const [showPrg, setShowPrg] = useState(true);

  // ── REFUND SUMMARY TOTALS ──────────────────────────────────────────
  const [totalGstRefund, setTotalGstRefund] = useState("0.00");
  const [totalExciseRefund, setTotalExciseRefund] = useState("0.00");
  const [totalCustomsRefund, setTotalCustomsRefund] = useState("0.00");
  const [totalOtherRefund, setTotalOtherRefund] = useState("0.00");

  // ── ITEM REFUND TABLE ROWS ─────────────────────────────────────────
  const [refundItems, setRefundItems] = useState([
    {
      itemNo: "",
      hsCode: "",
      gst: "0.00",
      excise: "0.00",
      customs: "0.00",
      other: "0.00",
    },
  ]);

  // ── ATTACHMENT ────────────────────────────────────────────────────
  const [docType, setDocType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // ── ADDITIONAL RECIPIENTS ─────────────────────────────────────────
  const [recipients, setRecipients] = useState({ r1: "", r2: "", r3: "" });

  // ── DECLARATION ───────────────────────────────────────────────────
  const [declarationChecked, setDeclarationChecked] = useState(false);

  // ── UI STATES ─────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // ── VALIDATION ERRORS ─────────────────────────────────────────────
  const [showTypeError, setShowTypeError] = useState(false);
  const [showReasonError, setShowReasonError] = useState(false);
  const [showDescError, setShowDescError] = useState(false);

  // ── FETCH DROPDOWNS ───────────────────────────────────────────────
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [refundRes, reasonRes, docRes] = await Promise.all([
          API.get("/getRefundTypeFromCommonMaster/"),
          API.get("/getReasonForRefundFromCommonMaster/"),
          API.get("/getDocumentAttachFromCommonMaster/"),
        ]);
        setRefundTypeOptions(refundRes.data);
        setReasonForRefundOptions(reasonRes.data);
        setDocumentAttachType(docRes.data);
      } catch (err) {
        console.error("Failed to fetch refund dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // ── LOAD UPLOADED FILES FOR THIS PERMIT ───────────────────────────
  useEffect(() => {
    const permitId = permitDetails?.PermitId;
    if (!permitId) return;
    API.get("/getCommonFileByEditPermitId/", { params: { PermitId: permitId } })
      .then((res) => {
        const files = Array.isArray(res.data) ? res.data : [];
        setUploadedFiles(files.filter((f) => f.Type === "RFD"));
      })
      .catch(() => setUploadedFiles([]));
  }, [permitDetails?.PermitId]);

  // ── LOAD EXISTING REFUND DATA (EDIT MODE) ─────────────────────────
  useEffect(() => {
    const msgId = permitDetails?.MsgId || permitDetails?.MSGId;
    if (!msgId) return;

    Promise.all([
      API.get("/getRefundPermitByMsgId/", { params: { MSGId: msgId } }),
      API.get("/getRefundValSummaryByMsgId/", { params: { MSGId: msgId } }),
      API.get("/getRefundItemSummaryByMsgId/", { params: { MSGId: msgId } }),
    ])
      .then(([refundRes, valSummaryRes, itemSummaryRes]) => {
        console.log("REFUND MAIN:", refundRes.data);
        console.log("VAL SUMMARY:", valSummaryRes.data);
        console.log("ITEM SUMMARY:", itemSummaryRes.data);

        // ── Load main refund data from CommonRefund ─────────────
        const rows = refundRes.data;
        if (Array.isArray(rows) && rows.length > 0) {
          const d = rows[0];

          setUpdateIndicator(d.UpdateIndicator || "");
          setPermitNumber(d.Permitno || "");
          setReplacementPermitNumber(d.ReplacementPermitno || "");
          setTypeOfRefund(d.TypeOfRefund || "");
          setReasonForRefund(d.ReasonForRefund || d.ReasonForREfund || "");
          setRefundDescription(d.DescriptionOfReason || "");
          setDeclarationChecked(
            d.DeclarationIndigator === "True" ||
              d.DeclarationIndigator === "true"
          );

          if (d.Additionalinfo) {
            const parts = d.Additionalinfo.split("-");
            setRecipients({
              r1: parts[0] || "",
              r2: parts[1] || "",
              r3: parts[2] || "",
            });
          }

          // ── Apply visibility WITHOUT resetting amounts ──────────
          if (d.TypeOfRefund) {
            const val = d.TypeOfRefund;
            if (val.startsWith("PRS")) {
              setShowItemRefund(true);
              setShowRefundSummary(true);
              setShowPrg(true);
            } else if (val.startsWith("FRF")) {
              setShowItemRefund(false);
              setShowRefundSummary(true);
              setShowPrg(true);
            } else if (val.startsWith("PRG")) {
              setShowItemRefund(false);
              setShowRefundSummary(true);
              setShowPrg(false);
            }
          }

          // ── Load amounts from CommonRefund ──────────────────────
          if (d.TotalGstAmt) setTotalGstRefund(String(d.TotalGstAmt));
          if (d.TotalExciseAmt) setTotalExciseRefund(String(d.TotalExciseAmt));
          if (d.TxtCusdutyAmt) setTotalCustomsRefund(String(d.TxtCusdutyAmt));
          if (d.TxtOtherAmt) setTotalOtherRefund(String(d.TxtOtherAmt));
        } else {
          // New refund - pre-fill from header
          setPermitNumber(permitDetails?.PermitNumber || "");
          setUpdateIndicator(permitDetails?.prmtStatus || "");
        }

        // ── Load summary amounts from CommonRefundValSummary ────
        const valRows = valSummaryRes.data;
        if (Array.isArray(valRows) && valRows.length > 0) {
          const v = valRows[0];
          if (v.totalgstAmt !== undefined && v.totalgstAmt !== null)
            setTotalGstRefund(String(v.totalgstAmt));
          if (v.totalexciseAmt !== undefined && v.totalexciseAmt !== null)
            setTotalExciseRefund(String(v.totalexciseAmt));
          if (v.txtcusdutyAmt !== undefined && v.txtcusdutyAmt !== null)
            setTotalCustomsRefund(String(v.txtcusdutyAmt));
          if (v.txtotherAmt !== undefined && v.txtotherAmt !== null)
            setTotalOtherRefund(String(v.txtotherAmt));
        }

        // ── Load item refund rows from CommonReundItemSumm ──────
        const itemRows = itemSummaryRes.data;
        if (Array.isArray(itemRows) && itemRows.length > 0) {
          const loadedItems = itemRows.map((row) => ({
            itemNo: String(row.ItemNo || ""),
            hsCode: String(row.HsCode || ""),
            gst: String(row.TotalGstAmt || "0.00"),
            excise: String(row.TotalExciseAmt || "0.00"),
            customs: String(row.TxtCusdutyAmt || "0.00"),
            other: String(row.TxtOtherAmt || "0.00"),
          }));
          setRefundItems(loadedItems);
        }
      })
      .catch((err) => {
        console.error("Failed to load refund data:", err);
        setPermitNumber(permitDetails?.PermitNumber || "");
        setUpdateIndicator(permitDetails?.prmtStatus || "");
      });
  }, [permitDetails?.MsgId, permitDetails?.MSGId]);

  // ── USER CHANGES TYPE OF REFUND (resets everything) ───────────────
  const handleTypeOfRefundChange = (val) => {
    setTypeOfRefund(val);
    setShowTypeError(false);

    // Reset totals and items only on user interaction
    setTotalGstRefund("0.00");
    setTotalExciseRefund("0.00");
    setTotalCustomsRefund("0.00");
    setTotalOtherRefund("0.00");
    setRefundItems([
      {
        itemNo: "",
        hsCode: "",
        gst: "0.00",
        excise: "0.00",
        customs: "0.00",
        other: "0.00",
      },
    ]);

    if (val.startsWith("PRS")) {
      setShowItemRefund(true);
      setShowRefundSummary(true);
      setShowPrg(true);
    } else if (val.startsWith("FRF")) {
      setShowItemRefund(false);
      setShowRefundSummary(true);
      setShowPrg(true);
    } else if (val.startsWith("PRG")) {
      setShowItemRefund(false);
      setShowRefundSummary(true);
      setShowPrg(false);
    } else {
      setShowItemRefund(false);
      setShowRefundSummary(false);
      setShowPrg(true);
    }
  };

  // ── ITEM REFUND TABLE HELPERS ──────────────────────────────────────
  const addRefundRow = () => {
    setRefundItems((prev) => [
      ...prev,
      {
        itemNo: "",
        hsCode: "",
        gst: "0.00",
        excise: "0.00",
        customs: "0.00",
        other: "0.00",
      },
    ]);
  };

  const removeRefundRow = (index) => {
    setRefundItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRefundItemChange = (index, field, value) => {
    const updated = [...refundItems];
    updated[index][field] = value;
    setRefundItems(updated);
  };

  // ── RECALCULATE SUMMARY TOTALS when items change ──────────────────
  useEffect(() => {
    if (!showItemRefund) return;
    const sumField = (field) =>
      refundItems
        .reduce((sum, row) => sum + parseFloat(row[field] || 0), 0)
        .toFixed(2);
    setTotalGstRefund(sumField("gst"));
    setTotalExciseRefund(sumField("excise"));
    setTotalCustomsRefund(sumField("customs"));
    setTotalOtherRefund(sumField("other"));
  }, [refundItems, showItemRefund]);

  // ── FILE ATTACH ───────────────────────────────────────────────────
  const handleAttach = async () => {
    if (!selectedFile || !docType) {
      alert("Please select file and document type");
      return;
    }
    try {
      const MSGID = permitDetails?.MSGId || permitDetails?.MsgId || "TNPDEC";
      const PermitId = permitDetails?.PermitId;
      const UserName = (user?.username || "").toUpperCase();

      let fileName = selectedFile.name.split(".")[0];
      fileName = fileName.replaceAll(" ", "_").replaceAll("-", "_");
      fileName = fileName + MSGID + UserName;

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("Sno", (uploadedFiles?.length || 0) + 1);
      formData.append("Name", fileName);
      formData.append("ContentType", selectedFile.type);
      formData.append("DocumentType", docType);
      formData.append("PaymentId", MSGID);
      formData.append("Size", `${Math.round(selectedFile.size / 1024)} KB`);
      formData.append("PermitId", PermitId);
      formData.append("Type", "RFD");
      formData.append("TouchUser", UserName);
      formData.append("TouchTime", new Date().toISOString());

      const response = await API.post("/postFileTable/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const files = response?.data?.Records || [];
      setUploadedFiles(files.filter((f) => f.Type === "RFD"));
      setSelectedFile(null);
      setDocType("");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
    }
  };

  // ── FILE DELETE ───────────────────────────────────────────────────
  const handleDelete = async (sno) => {
    try {
      const PermitId = permitDetails?.PermitId;
      const res = await API.delete(`/deleteFile/${PermitId}/${sno}/`);
      setUploadedFiles(
        (res.data.Records || []).filter((f) => f.Type === "RFD")
      );
      alert("File Deleted Successfully");
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  // ── HELPERS ───────────────────────────────────────────────────────
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

  const cleanSelect = (val) => {
    if (!val || String(val).trim() === "--Select--") return "";
    return val;
  };

  // ── SUMMARY CALCULATIONS ──────────────────────────────────────────
  const totalItemCifValue = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.CIFFOB) || 0),
    0
  );
  const totalItemGstAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.GSTAmount) || 0),
    0
  );
  const sumOfExciseDutyAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.ExciseDutyAmount) || 0),
    0
  );
  const sumOfCustomsDutyAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.CustomsDutyAmount) || 0),
    0
  );
  const sumOfOtherTaxAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.OtherTaxAmount) || 0),
    0
  );

  // ── VALIDATION ────────────────────────────────────────────────────
  const validate = () => {
    let valid = true;
    if (!typeOfRefund || typeOfRefund === "--Select--") {
      setShowTypeError(true);
      valid = false;
    } else {
      setShowTypeError(false);
    }
    if (!reasonForRefund || reasonForRefund === "--Select--") {
      setShowReasonError(true);
      valid = false;
    } else {
      setShowReasonError(false);
    }
    if (!refundDescription.trim()) {
      setShowDescError(true);
      valid = false;
    } else {
      setShowDescError(false);
    }
    if (!declarationChecked) {
      alert("Please accept declaration");
      valid = false;
    }
    return valid;
  };

  // ── BUILD REFUND DATA ARRAY ───────────────────────────────────────
  const buildRefundData = () => {
    return refundItems.map((row, i) => [
      i + 1,
      row.itemNo,
      row.hsCode,
      row.gst,
      row.excise,
      row.customs,
      row.other,
    ]);
  };

  // ── SAVE PERMIT ───────────────────────────────────────────────────
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

    const refundPayload = {
      Permitno: permitNumber || permitId,
      UpdateIndicator: updateIndicator,
      ReplacementPermitno: replacementPermitNumber,
      TypeOfRefund: typeOfRefund,
      ReasonForRefund: reasonForRefund,
      DescriptionOfReason: refundDescription,
      DeclarationIndigator: declarationChecked ? "True" : "False",
      Additionalinfo: `${recipients.r1}-${recipients.r2}-${recipients.r3}`,
      TotalGstAmt: totalGstRefund,
      TotalExciseAmt: totalExciseRefund,
      TxtCusdutyAmt: totalCustomsRefund,
      TxtOtherAmt: totalOtherRefund,
      RefundDatas: JSON.stringify(buildRefundData()),
      TouchUser: touchUser,
      TouchTime: touchTime,
      MSGId: msgId,
    };

    const refundValSummaryPayload = {
      PermitId: permitId,
      totalgstAmt: totalGstRefund,
      totalexciseAmt: totalExciseRefund,
      txtcusdutyAmt: totalCustomsRefund,
      txtotherAmt: totalOtherRefund,
      MSGId: msgId,
    };

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
      TotalAmtPay: toDecimal(totalItemGstAmount),
      Status: "NEW",
      TouchUser: touchUser,
      TouchTime: touchTime,
      PermitNumber: permitNumber || permitDetails?.PermitNumber || "",
      prmtStatus: "RFD",
      Cnb: cnBChecked ? "Y" : "N",
      DeclarningFor: declFor || "",
      MRDate: formatDate(summaryDate),
      MRTime: summaryTime || "",
    };

    try {
      await API.post("/postRefundPermit/", refundPayload);
      await API.post("/postRefundValSummary/", refundValSummaryPayload);

      if (showItemRefund && refundItems.length > 0) {
        const itemRefundRows = refundItems
          .filter((row) => row.itemNo || row.hsCode)
          .map((row, i) => ({
            PermitId: permitId,
            ItemNo: row.itemNo || "",
            HsCode: row.hsCode || "",
            TotalGstAmt: row.gst || "0.00",
            TotalExciseAmt: row.excise || "0.00",
            TxtCusdutyAmt: row.customs || "0.00",
            TxtOtherAmt: row.other || "0.00",
            Sno: String(i + 1),
            MsgId: msgId,
          }));

        if (itemRefundRows.length > 0) {
          for (const itemRow of itemRefundRows) {
            await API.post("/postRefundItemSummary/", itemRow);
          }
        }
      }

      await API.post("/postCommonHeaderTable/", headerPayload);
      setSaveMessage("Refund permit saved successfully.");
      setTimeout(() => navigate("/innonpayment"), 1000);
    } catch (err) {
      console.error("Refund save error:", err);
      setSaveMessage(
        err?.response?.data?.error || "Failed to save. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────
  return (
    <div className="col-12">
      {/* ── UPDATE INFORMATION ─────────────────────────────────────── */}
      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-3">
        UPDATE INFORMATION
      </div>
      <div className="row mt-3">
        <div className="col-4">UPDATE INDICATOR</div>
        <div className="col-4">PERMIT NUMBER</div>
        <div className="col-4">REPLACEMENT PERMIT NUMBER</div>
      </div>
      <div className="row mt-2">
        <div className="col-4">
          <input
            className="inputStyle"
            style={{ width: "80%" }}
            value={updateIndicator}
            onChange={(e) => setUpdateIndicator(e.target.value)}
          />
        </div>
        <div className="col-4">
          <input
            className="inputStyle"
            style={{ width: "80%" }}
            value={permitNumber}
            onChange={(e) => setPermitNumber(e.target.value)}
          />
        </div>
        <div className="col-4">
          <input
            className="inputStyle"
            style={{ width: "80%" }}
            value={replacementPermitNumber}
            onChange={(e) => setReplacementPermitNumber(e.target.value)}
          />
        </div>
      </div>

      {/* ── REFUND INFORMATION ─────────────────────────────────────── */}
      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-4">
        REFUND INFORMATION
      </div>
      <div className="row mt-3 col-12">
        <div className="col-2">TYPE FOR REFUND</div>
        <div className="col-1" />
        <div className="col-4">REASON FOR REFUND</div>
        <div className="col-1" />
        <div className="col-4">DESCRIPTION FOR REFUND</div>
      </div>
      <div className="row mt-2 col-11">
        {/* TYPE OF REFUND */}
        <div className="col-2">
          <select
            className="Dropdown"
            style={{ width: "100%" }}
            value={typeOfRefund}
            onChange={(e) => handleTypeOfRefundChange(e.target.value)}
          >
            <option value="">--Select--</option>
            {refundTypeOptions.map((c) => (
              <option key={c.Name} value={`${c.Name}:${c.Description}`}>
                {c.Name} : {c.Description}
              </option>
            ))}
          </select>
          {showTypeError && (
            <span className="ErrColor" style={{ display: "block" }}>
              PLEASE CHOOSE TYPE OF REFUND
            </span>
          )}
        </div>

        <div className="col-1" />

        {/* REASON FOR REFUND */}
        <div className="col-4">
          <select
            className="Dropdown"
            style={{ width: "100%" }}
            value={reasonForRefund}
            onChange={(e) => {
              setReasonForRefund(e.target.value);
              setShowReasonError(false);
            }}
          >
            <option value="">--Select--</option>
            {reasonForRefundOptions.map((c) => (
              <option key={c.Name} value={`${c.Name}:${c.Description}`}>
                {c.Name} : {c.Description}
              </option>
            ))}
          </select>
          {showReasonError && (
            <span className="ErrColor" style={{ display: "block" }}>
              PLEASE CHOOSE REASON FOR REFUND
            </span>
          )}
        </div>

        <div className="col-1" />

        {/* DESCRIPTION */}
        <div className="col-4">
          <textarea
            className="inputStyle"
            style={{ height: "50px", width: "95%" }}
            value={refundDescription}
            onChange={(e) => {
              setRefundDescription(e.target.value);
              setShowDescError(false);
            }}
          />
          {showDescError && (
            <span className="ErrColor" style={{ display: "block" }}>
              PLEASE ENTER DESCRIPTION OF REFUND
            </span>
          )}
        </div>
      </div>

      {/* ── REFUND SUMMARY (visible for PRS, FRF, PRG) ────────────── */}
      {showRefundSummary && (
        <div className="row mt-4">
          <div className="col-sm-12 border-bottom pb-1 full-width-title">
            REFUND SUMMARY
          </div>

          <div className="row mt-3 col-12">
            {/* GST always visible */}
            <div className="col-3">
              <div className="row">TOTAL GST REFUND</div>
              <div className="row mt-2">
                <input
                  className="inputStyle"
                  style={{ width: "90%" }}
                  value={totalGstRefund}
                  onChange={(e) => setTotalGstRefund(e.target.value)}
                />
              </div>
            </div>

            {/* Excise / Customs / Other — hidden for PRG (showPrg = false) */}
            {showPrg && (
              <div className="col-9">
                <div className="row">
                  <div className="col-4">
                    <div className="row">TOTAL EXCISE DUTY REFUND</div>
                    <div className="row mt-2">
                      <input
                        className="inputStyle"
                        style={{ width: "90%" }}
                        value={totalExciseRefund}
                        onChange={(e) => setTotalExciseRefund(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="row">TOTAL CUSTOMS DUTY REFUND</div>
                    <div className="row mt-2">
                      <input
                        className="inputStyle"
                        style={{ width: "90%" }}
                        value={totalCustomsRefund}
                        onChange={(e) => setTotalCustomsRefund(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="row">TOTAL OTHER TAX REFUND</div>
                    <div className="row mt-2">
                      <input
                        className="inputStyle"
                        style={{ width: "90%" }}
                        value={totalOtherRefund}
                        onChange={(e) => setTotalOtherRefund(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ITEM REFUND TABLE (visible only for PRS) ──────────────── */}
      {showItemRefund && (
        <div className="row mt-4">
          <div className="col-sm-12 border-bottom pb-1 full-width-title">
            ITEM REFUND
          </div>
          <div className="row mt-2">
            <div className="col-2">
              <button
                className="NextpageBtns"
                type="button"
                onClick={addRefundRow}
              >
                ADD REFUND
              </button>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: "8%" }}>ITEM NO</th>
                    <th>HS CODE</th>
                    <th>TOTAL GST REFUND</th>
                    <th>TOTAL EXCISE DUTY REFUND</th>
                    <th>TOTAL CUSTOMS DUTY REFUND</th>
                    <th>TOTAL OTHER TAX</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {refundItems.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="text"
                          className="inputStyle"
                          value={row.itemNo}
                          onChange={(e) =>
                            handleRefundItemChange(i, "itemNo", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="inputStyle"
                          value={row.hsCode}
                          onChange={(e) =>
                            handleRefundItemChange(i, "hsCode", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="inputStyle"
                          value={row.gst}
                          onChange={(e) =>
                            handleRefundItemChange(i, "gst", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="inputStyle"
                          value={row.excise}
                          onChange={(e) =>
                            handleRefundItemChange(i, "excise", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="inputStyle"
                          value={row.customs}
                          onChange={(e) =>
                            handleRefundItemChange(i, "customs", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="inputStyle"
                          value={row.other}
                          onChange={(e) =>
                            handleRefundItemChange(i, "other", e.target.value)
                          }
                        />
                      </td>
                      <td style={{ width: "4%", textAlign: "center" }}>
                        <FaTrash
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => removeRefundRow(i)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ATTACHMENT DOCUMENT ───────────────────────────────────── */}
      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-4">
        ATTACHMENT DOCUMENT
      </div>
      <div className="row mt-3">
        <div className="col-5">DOCUMENT TYPE</div>
        <div className="col-5">ATTACHMENT</div>
        <div className="col-2" />
      </div>
      <div className="row mt-2 align-items-center">
        <div className="col-3">
          <select
            className="Dropdown"
            style={{ width: "80%" }}
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          >
            <option value="">--Select--</option>
            {documentAttachType.map((doc) => (
              <option key={doc.Name} value={doc.Name}>
                {doc.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-2">
          <input
            type="file"
            className="NextpageBtns"
            style={{ width: "100%" }}
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </div>
        <div className="col-1">
          <button
            type="button"
            className="NextpageBtns"
            style={{ width: "100%" }}
            onClick={handleAttach}
          >
            ATTACH
          </button>
        </div>
      </div>
      <div className="row mt-2" style={{ fontSize: "0.8rem", color: "red" }}>
        <div className="col-12">TOTAL SIZE SHOULD NOT EXCEED 20000 (KB)</div>
        <div className="col-12">
          FILE FORMAT: DOC, DOCX, XLS, XLSX, PDF, JPG, JPEG, PNG, BMP, GIF, TIF,
          TIFF
        </div>
      </div>

      {/* Uploaded files list (mirrors RefundDocumentLoadFunction — Type = "RFD") */}
      {uploadedFiles?.length > 0 && (
        <div className="row mt-3">
          <div className="col-11">
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th>Delete</th>
                  <th>Document Type</th>
                  <th>Name</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file) => (
                  <tr key={file.Sno}>
                    <td>
                      <FaTrash
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(file.Sno)}
                      />
                    </td>
                    <td>{file.DocumentType}</td>
                    <td>
                      <a
                        href={`${API.defaults.baseURL}/serveFile/?path=${encodeURIComponent(file.filePath)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.Name}
                      </a>
                    </td>
                    <td>{file.Size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ADDITIONAL RECIPIENTS ────────────────────────────────── */}
      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-4">
        ADDITIONAL RECIPIENTS
      </div>
      <div className="row mt-3">
        <div className="col-3">RECIPIENTS 1</div>
        <div className="col-1" />
        <div className="col-3">RECIPIENTS 2</div>
        <div className="col-1" />
        <div className="col-3">RECIPIENTS 3</div>
        <div className="col-1" />
      </div>
      <div className="row mt-2">
        <div className="col-3">
          <input
            className="inputStyle"
            value={recipients.r1}
            onChange={(e) =>
              setRecipients({ ...recipients, r1: e.target.value })
            }
          />
        </div>
        <div className="col-1" />
        <div className="col-3">
          <input
            className="inputStyle"
            value={recipients.r2}
            onChange={(e) =>
              setRecipients({ ...recipients, r2: e.target.value })
            }
          />
        </div>
        <div className="col-1" />
        <div className="col-3">
          <input
            className="inputStyle"
            value={recipients.r3}
            onChange={(e) =>
              setRecipients({ ...recipients, r3: e.target.value })
            }
          />
        </div>
        <div className="col-1" />
      </div>

      {/* ── DECLARATION INDICATOR ────────────────────────────────── */}
      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-5">
        DECLARATION INDICATOR
      </div>
      <div className="row mt-3">
        <div className="col">
          <input
            type="checkbox"
            id="RefundDeclarationCheck"
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
            checked={declarationChecked}
            onChange={(e) => setDeclarationChecked(e.target.checked)}
          />
          <label htmlFor="RefundDeclarationCheck" style={{ marginLeft: "6px" }}>
            I/WE DECLARE THAT ALL PARTICULARS IN THIS APPLICATION ARE TRUE AND
            CORRECT
          </label>
        </div>
      </div>

      {/* ── SAVE MESSAGE ─────────────────────────────────────────── */}
      {saveMessage && (
        <div
          className="row mt-3"
          style={{
            color: saveMessage.toLowerCase().includes("success")
              ? "green"
              : "red",
          }}
        >
          <div className="col">{saveMessage}</div>
        </div>
      )}

      {/* ── BUTTONS ──────────────────────────────────────────────── */}
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

export default Refund;
