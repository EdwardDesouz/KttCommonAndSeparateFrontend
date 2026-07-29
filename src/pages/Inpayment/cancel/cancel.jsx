import { useState, useEffect, useContext } from "react";
import { useInpayment } from "../context/inpaymentContext";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import { UserContext } from "../../../userContex/userContex";
import { FaTrash } from "react-icons/fa";
import { CircleLoader } from "react-spinners";

function Cancel({ setActiveTab, isViewMode }) {
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
  } = useInpayment();

  const [updateIndicator, setUpdateIndicator] = useState("");
  const [permitNumber, setPermitNumber] = useState("");
  const [replacementPermitNumber, setReplacementPermitNumber] = useState("");
  const [reasonForCancel, setReasonForCancel] = useState("");
  const [descriptionOfReason, setDescriptionOfReason] = useState("");
  const [cancelationType, setCancelationType] = useState("");
  const [declarationChecked, setDeclarationChecked] = useState(false);
  const [cancelTypeOptions, setCancelTypeOptions] = useState([]);
  const [documentAttachType, setDocumentAttachType] = useState([]);
  const [docType, setDocType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showReasonError, setShowReasonError] = useState(false);
  const [showDescError, setShowDescError] = useState(false);
  const [showCancelTypeError, setShowCancelTypeError] = useState(false);
  const [showDeclarationError, setShowDeclarationError] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [cancelRes, docRes] = await Promise.all([
          API.get("/getCancelTypeFromCommonMaster/"),
          API.get("/getDocumentAttachFromCommonMaster/"),
        ]);
        setCancelTypeOptions(cancelRes.data);
        setDocumentAttachType(docRes.data);
      } catch (err) {
        console.error("Failed to fetch cancel dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    const permitId = permitDetails?.PermitId;
    if (!permitId) return;
    API.get("/getCommonFileByEditPermitId/", { params: { PermitId: permitId } })
      .then((res) => {
        const files = Array.isArray(res.data) ? res.data : [];
        setUploadedFiles(files);
      })
      .catch(() => {
        setUploadedFiles([]);
      });
  }, [permitDetails?.PermitId]);

  useEffect(() => {
    const msgId = permitDetails?.MsgId || permitDetails?.MSGId;
    if (!msgId) return;
    API.get("/getCancelPermitByMsgId/", { params: { MSGId: msgId } })
      .then((res) => {
        const rows = res.data;
        if (Array.isArray(rows) && rows.length > 0) {
          const d = rows[0];
          setUpdateIndicator(d.UpdateIndicator || "");
          setPermitNumber(d.Permitno || "");
          setReplacementPermitNumber(d.ReplacementPermitno || "");
          setReasonForCancel(d.ReasonForCancel || "");
          setDescriptionOfReason(d.DescriptionOfReason || "");
          setCancelationType(d.CancelType || "");
          setDeclarationChecked(
            d.DeclarationIndigator === "True" ||
              d.DeclarationIndigator === "true",
          );
        } else {
          setPermitNumber(permitDetails?.PermitNumber || "");
          setUpdateIndicator(permitDetails?.prmtStatus || "");
        }
      })
      .catch(() => {
        setPermitNumber(permitDetails?.PermitNumber || "");
        setUpdateIndicator(permitDetails?.prmtStatus || "");
      });
  }, [permitDetails?.MsgId, permitDetails?.MSGId]);

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

  // const handleAttach = async () => {
  //   if (!selectedFile || !docType) {
  //     alert("Please select file and document type");
  //     return;
  //   }
  //   try {
  //     const MSGID = "IPTDEC";
  //     const PermitId = permitDetails?.PermitId;
  //     const UserName = (user?.username || "").toUpperCase();
  //     let fileName = selectedFile.name.split(".")[0];
  //     fileName = fileName.replaceAll(" ", "_").replaceAll("-", "_");
  //     fileName = fileName + MSGID + UserName;
  //     const formData = new FormData();
  //     formData.append("file", selectedFile);
  //     formData.append("Sno", (uploadedFiles?.length || 0) + 1);
  //     formData.append("Name", fileName);
  //     formData.append("ContentType", selectedFile.type);
  //     formData.append("DocumentType", docType);
  //     formData.append("PaymentId", MSGID);
  //     formData.append("Size", `${Math.round(selectedFile.size / 1024)} KB`);
  //     formData.append("PermitId", PermitId);
  //     formData.append("Type", "CNL");
  //     formData.append("TouchUser", UserName);
  //     formData.append("TouchTime", new Date().toISOString());
  //     const response = await API.post("/postFileTable/", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     const files = response?.data?.Records || [];
  //     setUploadedFiles(files);
  //     setSelectedFile(null);
  //     setDocType("");
  //   } catch (err) {
  //     console.error("UPLOAD ERROR:", err);
  //   }
  // };

  // const handleDelete = async (sno) => {
  //   try {
  //     const PermitId = permitDetails?.PermitId;
  //     const res = await API.delete(`/deleteFile/${PermitId}/${sno}/`);
  //     setUploadedFiles(res.data.Records);
  //     alert("File Deleted Successfully");
  //   } catch (err) {
  //     console.error("DELETE ERROR:", err);
  //   }
  // };

  const handleAttach = async () => {
    if (!selectedFile || !docType) {
      alert("Please select file and document type");
      return;
    }
    try {
      const MSGID = "IPTDEC";
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
      formData.append("Type", "CNL");
      formData.append("TouchUser", UserName);
      formData.append("TouchTime", new Date().toISOString());

      // Save to CommonFileTable
      const response = await API.post("/postFileTable/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Mirror save to InFileTable (inpayment) — needs a fresh FormData
      const inFormData = new FormData();
      formData.forEach((value, key) => inFormData.append(key, value));
      await API.post("inpayment/postInFileTable/", inFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const files = response?.data?.Records || [];
      setUploadedFiles(files);
      setSelectedFile(null);
      setDocType("");
    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          "Error uploading file! Check console for details.",
      );
    }
  };

  const handleDelete = async (sno) => {
    try {
      const PermitId = permitDetails?.PermitId;

      const res = await API.delete(`/deleteFile/${PermitId}/${sno}/`);

      await API.delete(`inpayment/deleteInFile/${PermitId}/${sno}/`);

      setUploadedFiles(res.data.Records);
      alert("File Deleted Successfully");
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          "Error deleting file! Check console for details.",
      );
    }
  };

  

  const validate = () => {
    let valid = true;
    if (!reasonForCancel || reasonForCancel === "--Select--") {
      setShowReasonError(true);
      valid = false;
    } else {
      setShowReasonError(false);
    }
    if (!descriptionOfReason.trim()) {
      setShowDescError(true);
      valid = false;
    } else {
      setShowDescError(false);
    }
    if (!cancelationType || cancelationType === "--Select--") {
      setShowCancelTypeError(true);
      valid = false;
    } else {
      setShowCancelTypeError(false);
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

    const cancelPayload = {
      Permitno: permitDetails?.PermitNumber,
      UpdateIndicator: updateIndicator,
      ReplacementPermitno: replacementPermitNumber,
      ReasonForCancel: reasonForCancel,
      DescriptionOfReason: descriptionOfReason,
      CancelType: cancelationType,
      DeclarationIndigator: declarationChecked ? "True" : "False",
      TouchUser: touchUser,
      TouchTime: touchTime,
      MSGId: msgId,
    };

    const headerPayload = {
      Refid: permitDetails?.RefId || "",
      JobId: permitDetails?.JobId || "",
      MSGId: msgId,
      PermitId: permitId,
      TradeNetMailboxID:
        permitDetails?.MailBoxId || permitDetails?.TradeNetMailboxID || "",
      MessageType: "IPTDEC",
      DeclarationType: cleanSelect(decType),
      PreviousPermit: prevPermitNo || "",
      CargoPackType: cleanSelect(cargo),
      InwardTransportMode: cleanSelect(transportMode),
      BGIndicator: cleanSelect(bgInd),
      SupplyIndicator: supplyInd ? "Y" : "N",
      ReferenceDocuments: refDocs ? "Y" : "N",
      License: Licence || "",
      Recipient: Recipients || "",
      DeclarantCompanyCode: permitDetails?.Code || "",
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
      TotalGrossWeight:
        permitGrossWeight !== "" && permitGrossWeight !== undefined
          ? permitGrossWeight
          : totalGrossWeight || "",
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
      PermitNumber: permitDetails?.PermitNumber || "",
      prmtStatus: "CNL",
      Cnb: cnBChecked ? "Y" : "N",
      DeclarningFor: declFor || "",
      MRDate: formatDate(summaryDate),
      MRTime: summaryTime || "",
    };

    try {
      // Save cancel record first
      await API.post("/postCancelPermit/", cancelPayload);
      // Then save/update header
      await API.post("/postCommonHeaderTable/", headerPayload);

      // Mirror header into InHeaderTbl (same pattern as Amend's doSavePermit)
      const inHeaderPayload = {
        ...headerPayload,
        ReleaseLocName: releaseLocationDescription || "",
      };
      delete inHeaderPayload.ResLoaName;

      try {
        await API.post("inpayment/postInHeaderTable/", inHeaderPayload);
      } catch (mirrorErr) {
        console.error("Mirror header save failed", mirrorErr);
        setSaveMessage(
          "Warning: Cancel was saved but failed to mirror to InHeaderTbl. " +
            `Error: ${mirrorErr.response?.data?.error || mirrorErr.message}`,
        );
        setSaving(false);
        return;
      }

      setSaveMessage("Permit cancelled successfully.");
      setTimeout(() => navigate("/inpayment"), 1000);
    } catch (err) {
      console.error("Cancel save error:", err);
      setSaveMessage(
        err?.response?.data?.error || "Failed to save. Please try again.",
      );
      setSaving(false);
    }
  };
  return (
    <div className="col-12">
      {/* UPDATE INFORMATION */}
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
            value={updateIndicator}
            onChange={(e) => setUpdateIndicator(e.target.value)}
            style={{ width: "70%" }}
          />
        </div>
        <div className="col-4">
          <input
            className="inputStyle"
            value={permitNumber}
            onChange={(e) => setPermitNumber(e.target.value)}
            style={{ width: "70%" }}
          />
        </div>
        <div className="col-4">
          <input
            className="inputStyle"
            value={replacementPermitNumber}
            onChange={(e) => setReplacementPermitNumber(e.target.value)}
            style={{ width: "70%" }}
          />
        </div>
      </div>

      {/* CANCELLATION INFORMATION */}
      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-4">
        CANCELLATION INFORMATION
      </div>
      <div className="row mt-3">
        <div className="col-5">REASON FOR CANCELLATION</div>
        <div className="col-2" />
        <div className="col-5">DESCRIPTION FOR REASON</div>
      </div>
      <div className="row mt-2">
        <div className="col-5">
          <select
            className="Dropdown"
            value={reasonForCancel}
            onChange={(e) => {
              setReasonForCancel(e.target.value);
              setShowReasonError(false);
            }}
            style={{ width: "80%" }}
          >
            <option value="">--Select--</option>
            {cancelTypeOptions.map((c) => (
              <option key={c.Name} value={`${c.Name}:${c.Description}`}>
                {c.Name} : {c.Description}
              </option>
            ))}
          </select>
          {showReasonError && (
            <span className="ErrColor" style={{ display: "block" }}>
              PLEASE CHOOSE REASON FOR CANCELLATION
            </span>
          )}
        </div>
        <div className="col-2" />
        <div className="col-5">
          <textarea
            className="inputStyle"
            style={{ height: "40px", width: "95%" }}
            value={descriptionOfReason}
            onChange={(e) => {
              setDescriptionOfReason(e.target.value);
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

      {/* CANCELLATION TYPE */}
      <div className="row mt-3">
        <div className="col-5">CANCELLATION TYPE</div>
      </div>
      <div className="row mt-2">
        <div className="col-5">
          <select
            className="Dropdown"
            value={cancelationType}
            onChange={(e) => {
              setCancelationType(e.target.value);
              setShowCancelTypeError(false);
            }}
            style={{ width: "60%" }}
          >
            <option value="">--Select--</option>
            <option value="CUSTOMER REQUEST">CUSTOMER REQUEST</option>
            <option value="CUSTOMER COMPLAINT">CUSTOMER COMPLAINT</option>
            <option value="LOCAL COMPLAINT">LOCAL COMPLAINT</option>
          </select>
          {showCancelTypeError && (
            <span className="ErrColor" style={{ display: "block" }}>
              PLEASE CHOOSE CANCELLATION TYPE
            </span>
          )}
        </div>
      </div>

      {/* ATTACHMENT DOCUMENT */}
      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-4">
        ATTACHMENT DOCUMENT
      </div>
      <div className="row mt-3 align-items-center">
        <div className="col-5">
          <select
            className="Dropdown"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            style={{ width: "80%" }}
          >
            <option value="">--Select--</option>
            {documentAttachType.map((doc) => (
              <option key={doc.Name} value={doc.Name}>
                {doc.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-4">
          <input
            type="file"
            className="NextpageBtns"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ width: "80%" }}
          />
        </div>
        <div className="col-2">
          <button
            type="button"
            className="NextpageBtns"
            style={{ width: "80%" }}
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

      {uploadedFiles?.length > 0 && (
        <div className="row mt-3">
          <div className="col-12">
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

      {/* DECLARATION INDICATOR */}
      <div className="col-sm-12 border-bottom pb-1 full-width-title mt-4">
        DECLARATION INDICATOR
      </div>
      <div className="row mt-2">
        <div className="col">
          <input
            type="checkbox"
            id="CancelDeclarationCheck"
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
            checked={declarationChecked}
            onChange={(e) => setDeclarationChecked(e.target.checked)}
          />
          <label htmlFor="CancelDeclarationCheck" style={{ marginLeft: "6px" }}>
            I/WE DECLARE THAT ALL PARTICULARS IN THIS APPLICATION ARE TRUE AND
            CORRECT
          </label>
        </div>
      </div>

      {/* SAVE MESSAGE */}
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

      {/* BUTTONS */}
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

export default Cancel;
