import { useEffect, useState, useRef, useContext, useMemo } from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { useInpayment } from "../context/inpaymentContext";
import { UserContext } from "../../../userContex/userContex";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useDebounceAutoSave } from "../../../autoSave/useDebounceAutoSave";
import { getFieldConfig } from "../../config/accountFieldConfig";

function Header({ setActiveTab, isViewMode, isEditMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  // Saved Options States
  const [declarantType, setDeclarantType] = useState([]);
  const [cargoType, setCargoType] = useState([]);
  const [inwardTransportMode, setInwardTransportMode] = useState([]);
  const [declaringFor, setDeclaringFor] = useState([]);
  const [bgIndicator, setBgIndicator] = useState([]);
  const [documentAttachType, setDocumentAttachType] = useState([]);
  const [permitConditions, setPermitConditions] = useState(null);

  // Decelaring for visible depends account id

  const fieldConfig = getFieldConfig(user?.accountId);
  console.log("accountId:", user?.accountId);
  console.log("fieldConfig:", fieldConfig);
  // User Context States
  const {
    permitDetails,
    updatePermitDetails,
    decType,
    setDecType,
    prevPermitNo,
    setPrevPermitNo,
    cargo,
    setCargo,
    transportMode,
    setTransportMode,
    declFor,
    setDeclFor,
    bgInd,
    setBgInd,
    overrideEx,
    setOverrideEx,
    supplyInd,
    setSupplyInd,
    refDocs,
    setRefDocs,
    licence1,
    setLicence1,
    licence2,
    setLicence2,
    licence3,
    setLicence3,
    licence4,
    setLicence4,
    licence5,
    setLicence5,
    Licence,
    recipients1,
    setRecipients1,
    recipients2,
    setRecipients2,
    recipients3,
    setRecipients3,
    Recipients,
    documentType,
    setDocumentType,
    selectedFile,
    setSelectedFile,
    uploadedFiles,
    setUploadedFiles,
    // Cargo
    totalOuterPackName,
    setTotalOuterPackName,
    grossUOM,
    setGrossUOM,
    // UI Control States
    showInwardTransport,
    setShowInwardTransport,
    showClaimantPartyShow,
    setShowClaimantPartyShow,
    showCargoType,
    setShowCargoType,
    inwardTransport,
    setInwardTransport,
    showVoyageNumber,
    setShowVoyageNumber,
    showVesselName,
    setShowVesselName,
    showFlightNumber,
    setShowFlightNumber,
    showAirCraftRegNumber,
    setShowAirCraftRegNumber,
    showMawbNumber,
    setShowMawbNumber,
    showOblNumber,
    setShowOblNumber,
    showconveyanceNumber,
    setShowconveyanceNumber,
    showTransportDetails,
    setShowTransportDetails,
    showNotRequired,
    setShowNotRequired,
    setVoyageNumber,
    voyageNumber,
    setVesselName,
    vesselName,
    setObl,
    obl,
    conveyanceNumber,
    setConveyanceNumber,
    transportDetails,
    setTransportDetails,
    flightNumber,
    setFlightNumber,
    airCraftRegNumber,
    setAirCraftRegNumber,
    mawbNumber,
    setMawbNumber,
    loadingPortCode,
    setLoadingPortCode,
    loadingPortName,
    setLoadingPortName,
    cargoHawb,
    setCargoHawb,
    arrivalDate,
    setArrivalDate,
    blanketStartDate,
    setBlanketStartDate,
    showDeclarationTypeError,
    setShowDeclarationTypeError,
    showCargoPackTypeError,
    setShowCargoPackTypeError,
    showDeclaringForError,
    setShowDeclaringForError,
    setShowInwardTransportError,
    showInwardTransportError,
  } = useInpayment();

  useEffect(() => {
    if (isEditMode) return;
    if (!permitDetails?.PermitId) {
      const stored = sessionStorage.getItem("currentPermit");
      if (stored) {
        const parsed = JSON.parse(stored);
        updatePermitDetails(parsed);
      }
    }
  }, []);

  // fetch declaration type
  const fetchDeclarationTypeData = async () => {
    try {
      const response = await API.get(
        "/getDeclarationTypeFromCommonMasterForInpayment/",
      );
      setDeclarantType(response.data);
    } catch (error) {
      console.error("Error fetching mailbox data:", error);
    }
  };

  // fetch cargo type
  const fetchCargoTypeData = async () => {
    try {
      const response = await API.get("/getCargoTypeFromCommonMaster/");
      setCargoType(response.data);
    } catch (error) {
      console.error("Error fetching mailbox data:", error);
    }
  };

  // inwardTransportMode
  const fetchInwardTransportMode = async () => {
    try {
      const response = await API.get(
        "/getInwardTransportModeFromCommonMaster/",
      );
      setInwardTransportMode(response.data);
    } catch (error) {
      console.error("Error fetching mailbox data:", error);
    }
  };

  // DeclaringFor
  const fetchDeclaringFor = async () => {
    try {
      const response = await API.get("/getDeclaringForFromCommonMaster/");
      setDeclaringFor(response.data);
    } catch (error) {
      console.error("Error fetching mailbox data:", error);
    }
  };

  // BgIndicator
  const fetchBgIndicator = async () => {
    try {
      const response = await API.get("/getBgIndicatorFromCommonMaster/");
      setBgIndicator(response.data);
    } catch (error) {
      console.error("Error fetching mailbox data:", error);
    }
  };

  // DocumentAttachType
  const fetchDocumentAttachType = async () => {
    try {
      const response = await API.get("/getDocumentAttachFromCommonMaster/");
      setDocumentAttachType(response.data);
    } catch (error) {
      console.error("Error fetching mailbox data:", error);
    }
  };

  const fetchPermitConditions = async (permitId) => {
    try {
      const response = await API.get(
        `/getPermitConditions/?PermitId=${permitId}`,
      );
      setPermitConditions(response.data);
    } catch (error) {
      console.error("Error fetching permit conditions:", error);
    }
  };

  // This useeffect for calling api's
  useEffect(() => {
    fetchDeclarationTypeData();
    fetchCargoTypeData();
    fetchInwardTransportMode();
    fetchDeclaringFor();
    fetchBgIndicator();
    fetchDocumentAttachType();
  }, []);

  // declaring for hide show use effect for empty save

  useEffect(() => {
    const config = getFieldConfig(user?.accountId);
    if (!config.showDeclaringFor) {
      setDeclFor("");
      setShowDeclaringForError(false);
    }
  }, [user?.accountId]);

  // ===================== Handle Declaration Type Change =================

  const DeclarationChange = (e) => {
    const value = e.target.value;
    setDecType(value);
    console.log("Selected Declaration Type:", value);
    setShowInwardTransport(true);
    setShowClaimantPartyShow(false);
    if (value === "--Select--") {
      setShowDeclarationTypeError(true);
    } else {
      setShowDeclarationTypeError(false);
    }
    if (
      value === "BKT : Blanket" ||
      value === "GST : GST (Including Duty Exemption)"
    ) {
      setShowClaimantPartyShow(true);
      if (value === "BKT : Blanket") {
        setShowInwardTransport(false);
        setTransportMode("");
      }
    }
  };

  // ==================== Handle Cargo Pack Type Change =================
  const CargoPackTypeChange = (e) => {
    const value = e.target.value;
    setCargo(value);
    console.log("Selected Cargo Pack Type:", value);
    if (value === "--Select--") {
      setShowCargoPackTypeError(true);
    } else {
      setShowCargoPackTypeError(false);
    }
    if (value === "9: Containerized") {
      setShowCargoType(true);
    } else {
      setShowCargoType(false);
    }
    if (transportMode === "1 : Sea") {
      if (value === "9: Containerized") {
        setTotalOuterPackName("UNT");
      } else if (value === "5 : Other non-Containerized") {
        setTotalOuterPackName("-");
      }
    }
  };

  // ==================== Handle Inward Transport Mode Change =================
  const InwardTrasnPortModeChange = (e) => {
    const value = e.target.value;
    const isContainer = cargo;
    setTransportMode(value);
    setInwardTransport(value);
    if (value === "--Select--") {
      setShowInwardTransportError(true);
    } else {
      setShowInwardTransportError(false);
    }
    console.log("Selected Inward Transport Mode:", value);
    setVoyageNumber("");
    setVesselName("");
    setObl("");
    setConveyanceNumber("");
    setTransportDetails("");
    setFlightNumber("");
    setAirCraftRegNumber("");
    setMawbNumber("");
    // setLoadingPortCode("");
    // setLoadingPortName("");
    // setCargoHawb("");
    setArrivalDate("");
    setBlanketStartDate("");
    setShowInwardTransport(true);
    setShowVoyageNumber(false);
    setShowVesselName(false);
    setShowOblNumber(false);
    setShowconveyanceNumber(false);
    setShowTransportDetails(false);
    setShowFlightNumber(false);
    setShowAirCraftRegNumber(false);
    setShowMawbNumber(false);
    setShowNotRequired(true);
    setGrossUOM("");
    setTotalOuterPackName("");

    if (value === "1 : Sea") {
      setShowVoyageNumber(true);
      setShowVesselName(true);
      setShowOblNumber(true);
      setGrossUOM("TNE");
      if (isContainer === "9: Containerized") {
        setTotalOuterPackName("UNT");
      } else if (isContainer === "5 : Other non-Containerized") {
        setTotalOuterPackName("-");
      }
    } else if (value === "2 : Rail") {
      setShowconveyanceNumber(true);
      setShowTransportDetails(true);
    } else if (value === "3 : Road") {
      setShowconveyanceNumber(true);
      setShowTransportDetails(true);
    } else if (value === "4 : Air") {
      setShowFlightNumber(true);
      setShowAirCraftRegNumber(true);
      setShowMawbNumber(true);
      setTotalOuterPackName("PKG");
      setGrossUOM("KGM");
    } else if (value === "5 : Mail") {
      setShowconveyanceNumber(true);
      setShowTransportDetails(true);
    } else if (value === "6 : Multi-model(Not in use)") {
      setShowconveyanceNumber(true);
      setShowTransportDetails(true);
    } else if (value === "7 : Pipeline") {
      setShowconveyanceNumber(true);
      setShowTransportDetails(true);
    } else if (value === "N : Not Required") {
      setShowNotRequired(false);
    }
  };

  // ===================== Document Type Change =================
  const filteredFiles = uploadedFiles || [];
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDocTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  // const handleAttach = async () => {
  //   if (!selectedFile || !documentType) {
  //     alert("Please select file and document type");
  //     return;
  //   }
  //   try {
  //     const MSGID = "IPTDEC";
  //     const PermitId = permitDetails?.PermitId;
  //     const UserName = (user?.username || "").toUpperCase();
  //     const file = selectedFile;
  //     let fileName = file.name.split(".")[0];
  //     fileName = fileName.replaceAll(" ", "_").replaceAll("-", "_");
  //     fileName = fileName + MSGID + UserName;
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("Sno", uploadedFiles.length + 1);
  //     formData.append("Name", fileName);
  //     formData.append("ContentType", file.type);
  //     formData.append("DocumentType", documentType);
  //     formData.append("PaymentId", MSGID);
  //     formData.append("Size", `${Math.round(file.size / 1024)} KB`);
  //     formData.append("PermitId", PermitId);
  //     formData.append("Type", "NEW");
  //     formData.append("TouchUser", UserName);
  //     formData.append("TouchTime", new Date().toISOString());
  //     const response = await API.post("/postFileTable/", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     const files = response?.data?.Records || [];
  //     setUploadedFiles(files);
  //     setSelectedFile();
  //     setDocumentType("");
  //     console.log("UPLOAD SUCCESS:", files);
  //   } catch (err) {
  //     console.error("UPLOAD ERROR:", err);
  //   }
  // };

  const handleAttach = async () => {
    if (!selectedFile || !documentType) {
      alert("Please select file and document type");
      return;
    }
    try {
      const MSGID = "IPTDEC";
      const PermitId = permitDetails?.PermitId;
      const UserName = (user?.username || "").toUpperCase();
      const file = selectedFile;
      let fileName = file.name.split(".")[0];
      fileName = fileName.replaceAll(" ", "_").replaceAll("-", "_");
      fileName = fileName + MSGID + UserName;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("Sno", uploadedFiles.length + 1);
      formData.append("Name", fileName);
      formData.append("ContentType", file.type);
      formData.append("DocumentType", documentType);
      formData.append("PaymentId", MSGID);
      formData.append("Size", `${Math.round(file.size / 1024)} KB`);
      formData.append("PermitId", PermitId);
      formData.append("Type", "NEW");
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
      setSelectedFile();
      setDocumentType("");
      console.log("UPLOAD SUCCESS:", files);
    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          "Error uploading file! Check console for details.",
      );
    }
  };

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

  // =====================SAVE AS DRAFT MODEL================
  // ===================== STATES =====================
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftReason, setDraftReason] = useState("");
  const [draftReasonError, setDraftReasonError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ===================== OPEN MODAL ONLY =====================
  const handleSaveAsDraftClick = () => {
    setDraftReason("");
    setDraftReasonError(false);
    setShowDraftModal(true);
  };

  // formatdate for saving
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "") return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  // ===================== CANCEL MODAL =====================
  const handleCancelDraftModal = () => {
    setShowDraftModal(false);
    setDraftReason("");
    setDraftReasonError(false);
  };

  // ===================== ACTUAL SAVE (after filling reason) =====================
  const handleConfirmSaveAsDraft = async () => {
    if (!draftReason.trim()) {
      setDraftReasonError(true);
      return;
    }

    setIsSaving(true);

    try {
      const TouchUser = (user?.username || "").toUpperCase();
      const TouchTime = new Date().toISOString();

      const payload = {
        PermitId: permitDetails?.PermitId || "",
        Refid: permitDetails?.RefId || "",
        JobId: permitDetails?.JobId || "",
        MSGId: permitDetails?.MsgId || "",
        TradeNetMailboxID:
          permitDetails?.TradeNetMailboxID || permitDetails?.MailBoxId || "",
        MessageType: "IPTDEC",

        DeclarationType: decType,
        PreviousPermit: prevPermitNo,
        CargoPackType: cargo,
        InwardTransportMode: transportMode,
        BGIndicator: bgInd,
        SupplyIndicator: supplyInd ? "true" : "false",
        ReferenceDocuments: refDocs ? "true" : "false",
        DeclarningFor: declFor || "--Select--",
        License: [licence1, licence2, licence3, licence4, licence5]
          .filter(Boolean)
          .join(","),
        Recipient: [recipients1, recipients2, recipients3]
          .filter(Boolean)
          .join(","),
        DeclarantCompanyCode: permitDetails?.DeclarantCode || "",
        Message: draftReason.trim().toUpperCase(),
        Status: "SAVEASDRF",
        prmtStatus: "SAVEASDRF",
        TouchUser,
        TouchTime,
        VoyageNumber: showVoyageNumber ? voyageNumber || "" : "",
        VesselName: showVesselName ? vesselName || "" : "",
        OceanBillofLadingNo: showOblNumber ? obl || "" : "",
        ConveyanceRefNo: showconveyanceNumber ? conveyanceNumber || "" : "",
        TransportId: showTransportDetails ? transportDetails || "" : "",
        FlightNO: showFlightNumber ? flightNumber || "" : "",
        AircraftRegNo: showAirCraftRegNumber ? airCraftRegNumber || "" : "",
        MasterAirwayBill: showMawbNumber ? mawbNumber || "" : "",
        ArrivalDate: null,
        BlanketStartDate: null,
        MRDate: null,
        MRTime: "",
      };
      console.log("payload:", payload);
      const response = await API.post("/postCommonHeaderTable/", [payload]);

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
      console.error("ERROR RESPONSE DATA:", err.response?.data);
      alert("Error saving draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // // =====================Auto save every filling Details====================================
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
  //     License: [licence1, licence2, licence3, licence4, licence5]
  //       .filter(Boolean)
  //       .join(","),
  //     Recipient: [recipients1, recipients2, recipients3]
  //       .filter(Boolean)
  //       .join(","),
  //     // party fields
  //     DeclarantCompanyCode: permitDetails?.DeclarantCode || "",
  //     VoyageNumber: showVoyageNumber ? voyageNumber || "" : "",
  //     VesselName: showVesselName ? vesselName || "" : "",
  //     OceanBillofLadingNo: showOblNumber ? obl || "" : "",
  //     ConveyanceRefNo: showconveyanceNumber ? conveyanceNumber || "" : "",
  //     TransportId: showTransportDetails ? transportDetails || "" : "",
  //     FlightNO: showFlightNumber ? flightNumber || "" : "",
  //     AircraftRegNo: showAirCraftRegNumber ? airCraftRegNumber || "" : "",
  //     MasterAirwayBill: showMawbNumber ? mawbNumber || "" : "",
  //     Status: "DISCONNECT",
  //     prmtStatus: "DISCONNECT",
  //     TouchUser: (user?.username || "").toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Message: "AUTO-SAVED|TAB:HeaderPage",
  //     ArrivalDate: null,
  //     BlanketStartDate: null,
  //     MRDate: null,
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
  //   licence1,
  //   licence2,
  //   licence3,
  //   licence4,
  //   licence5,
  //   recipients1,
  //   recipients2,
  //   recipients3,
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
  //   user,
  // ]);

  // useDebounceAutoSave({
  //   payload: autoSavePayload,
  //   enabled: !isViewMode,
  //   delay: 2000,
  // });
  // ====================UI==================================
  return (
    <div className="row g-2">
      {/* LEFT COLUMN */}
      <div className="col-6">
        {/* MESSAGE TYPE */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">MESSAGE TYPE</label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              value="IPTDEC"
              id="MsgType"
              disabled
            />
          </div>
        </div>
        {/* DECLARATION TYPE */}
        <div className="row align-items-center compact-row mt-1">
          <label className="col-sm-4 col-form-label">DECLARATION TYPE</label>
          <div className="col-sm-8">
            <select
              className="Dropdown HighLight mandatory"
              id="declarationType"
              tabIndex={1}
              value={decType}
              // onChange={(e) => setDecType(e.target.value)}
              onChange={DeclarationChange}
            >
              <option value="">--Select--</option>
              {decType && !declarantType.find((d) => d.Name === decType) && (
                <option value={decType}>{decType}</option>
              )}
              {declarantType.map((dectype) => (
                <option key={dectype.Name} value={dectype.Name}>
                  {dectype.Name}
                </option>
              ))}
            </select>
            {showDeclarationTypeError && (
              <span className="ErrorColor" id="declarationTypeSpan">
                PLEASE CHOOSE DECLARATION TYPE
              </span>
            )}
          </div>
        </div>

        {/* PREVIOUS PERMIT NO */}
        <div className="row align-items-center compact-row mt-2">
          <label className="col-sm-4 col-form-label">PREVIOUS PERMIT NO</label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              tabIndex={2}
              value={prevPermitNo}
              onChange={(e) => setPrevPermitNo(e.target.value)}
            />
          </div>
        </div>

        {/* CARGO PACK TYPE */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">CARGO PACK TYPE</label>
          <div className="col-sm-8">
            <select
              className="Dropdown HighLight mandatory"
              tabIndex={3}
              value={cargo}
              onChange={CargoPackTypeChange}
            >
              <option value="">--Select--</option>
              {cargo && !cargoType.find((c) => c.Name === cargo) && (
                <option value={cargo}>{cargo}</option>
              )}
              {cargoType.map((c) => (
                <option key={c.Name} value={c.Name}>
                  {c.Name}
                </option>
              ))}
            </select>
            {showCargoPackTypeError && (
              <span className="ErrorColor">PLEASE CHOOSE CARGO PACK TYPE</span>
            )}
          </div>
        </div>

        {/* INWARD TRANSPORT */}
        {showInwardTransport && (
          <div
            className="row align-items-center compact-row"
            id="InwardTransportModeShowHide"
          >
            <label className="col-sm-4 col-form-label">
              INWARD TRANSPORT MODE
            </label>
            <div className="col-sm-8">
              <select
                className="Dropdown HighLight mandatory"
                value={transportMode}
                onChange={InwardTrasnPortModeChange}
                tabIndex={4}
              >
                <option value="">--Select--</option>
                {transportMode &&
                  !inwardTransportMode.find(
                    (t) => t.Name === transportMode,
                  ) && <option value={transportMode}>{transportMode}</option>}
                {inwardTransportMode.map((t) => (
                  <option key={t.Name} value={t.Name}>
                    {t.Name}
                  </option>
                ))}
              </select>
              {showInwardTransportError && (
                <span className="ErrorColor" id="inwardTranseportModeSpan">
                  PLEASE CHOOSE INWARD TRANSPORT MODE
                </span>
              )}
            </div>
          </div>
        )}

        {/* DECLARING FOR */}
        {fieldConfig.showDeclaringFor && (
          <div className="row align-items-center compact-row">
            <label className="col-sm-4 col-form-label">DECLARING FOR</label>
            <div className="col-sm-8">
              <select
                className="Dropdown HighLight mandatory"
                value={declFor}
                onChange={(e) => {
                  setDeclFor(e.target.value);
                  if (e.target.value) setShowDeclaringForError(false);
                }}
                tabIndex={5}
              >
                <option value="">--Select--</option>
                {declFor && !declaringFor.find((d) => d.Name === declFor) && (
                  <option value={declFor}>{declFor}</option>
                )}
                {declaringFor.map((dclrfor) => (
                  <option key={dclrfor.Name} value={dclrfor.Name}>
                    {dclrfor.Name}
                  </option>
                ))}
              </select>
              {showDeclaringForError && (
                <span className="ErrorColor" id="DeclaringForSpan">
                  PLEASE CHOOSE DECLARING FOR
                </span>
              )}
            </div>
          </div>
        )}

        {/* BG INDICATOR */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">BG INDICATOR</label>
          <div className="col-sm-8">
            <select
              className="Dropdown HighLight"
              value={bgInd}
              onChange={(e) => setBgInd(e.target.value)}
              tabIndex={6}
            >
              <option value="">--Select--</option>
              {bgInd && !bgIndicator.find((b) => b.Name === bgInd) && (
                <option value={bgInd}>{bgInd}</option>
              )}
              {bgIndicator.map((bgindr) => (
                <option key={bgindr.Name} value={bgindr.Name}>
                  {bgindr.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* OVERRIDE EXGE RATE */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">OVERRIDE EXGE RATE</label>
          <div className="col-sm-8 form-check">
            <input
              type="checkbox"
              className="me-2"
              checked={overrideEx}
              onChange={(e) => setOverrideEx(e.target.checked)}
              tabIndex={7}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {/* SUPPLY INDICATOR */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">SUPPLY INDICATOR</label>
          <div className="col-sm-8 form-check">
            <input
              type="checkbox"
              className="me-2"
              checked={supplyInd}
              onChange={(e) => setSupplyInd(e.target.checked)}
              tabIndex={8}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {/* REFERENCE DOCUMENT */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">REFERENCE DOCUMENT</label>
          <div className="col-sm-8 form-check">
            <input
              type="checkbox"
              className="me-2"
              id="ReferenceDocuments"
              tabIndex={9}
              checked={refDocs}
              onChange={(e) => setRefDocs(e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {/* -----------------------------------------------------DisableClass------------------------------------------------------- */}
        {/* LICENSE SECTION */}
        {refDocs && (
          <fieldset>
            <div className="row mt-1 col-13">
              <h5 className="mt-1 border-bottom pb-2 full-width-title">
                LICENSE
              </h5>

              {/* Licence 1 + 2 */}
              <div className="row mt-1">
                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Licence 1"
                    tabIndex={13}
                    value={licence1}
                    onChange={(e) => setLicence1(e.target.value)}
                  />
                </div>

                <div className="col-1"></div>

                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Licence 2"
                    tabIndex={14}
                    value={licence2}
                    onChange={(e) => setLicence2(e.target.value)}
                  />
                </div>
              </div>

              {/* Licence 3 + 4 */}
              <div className="row">
                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Licence 3"
                    tabIndex={15}
                    value={licence3}
                    onChange={(e) => setLicence3(e.target.value)}
                  />
                </div>

                <div className="col-1"></div>

                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Licence 4"
                    tabIndex={16}
                    value={licence4}
                    onChange={(e) => setLicence4(e.target.value)}
                  />
                </div>
              </div>

              {/* Licence 5 */}
              <div className="row  mt-1">
                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Licence 5"
                    tabIndex={17}
                    value={licence5}
                    onChange={(e) => setLicence5(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        )}

        {/*------------------------------------------------------------ DisableClass------------------------------------------------ */}
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">PERMIT ID</label>
          <div className="col-sm-8 form-check">
            <input
              className="form-control"
              value={permitDetails?.PermitId || ""}
              readOnly
            />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">USER NAME</label>
          <div className="col-sm-8 form-check">
            <input
              className="form-control"
              id="USERNAME"
              value={user?.username?.toUpperCase() || ""}
              readOnly
            />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">MSG ID</label>
          <div className="col-sm-8 form-check">
            <input
              className="form-control"
              id="MSGID"
              value={permitDetails?.MsgId || ""}
              readOnly
            />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">JOB ID</label>
          <div className="col-sm-8 form-check">
            <input
              className="form-control"
              id="JOBID"
              value={permitDetails?.JobId || ""}
              readOnly
            />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">REF ID</label>
          <div className="col-sm-8 form-check">
            <input
              className="form-control"
              id="REFID"
              value={permitDetails?.RefId || ""}
              readOnly
            />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">PERMIT NUMBER</label>
          <div className="col-sm-8 form-check">
            <input
              className="form-control"
              id="PermitNumberId"
              value={permitDetails?.PermitNumber || ""}
              readOnly
            />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">SHOW EDIT</label>
          <div className="col-sm-8 form-check">
            <input className="form-control" id="ShowEdit" />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-6">
        {/* MAILBOX ID */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">MAILBOX ID</label>
          <div className="col-sm-8">
            <input
              type="text"
              id="MailBoxId"
              className="form-control form-control-sm"
              value={permitDetails?.MailBoxId || ""}
              readOnly
            />
          </div>
        </div>

        {/* DECLARANT NAME */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">DECLARANT NAME</label>
          <div className="col-sm-8">
            <input
              type="text"
              id="DeclarantName"
              className="form-control form-control-sm"
              value={permitDetails?.DeclarantName || ""}
              readOnly
            />
          </div>
        </div>

        {/* DECLARANT NAME */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">DECLARANT CODE</label>
          <div className="col-sm-8">
            <input
              type="text"
              id="DeclarantCode"
              className="form-control form-control-sm"
              value={permitDetails?.DeclarantCode || ""}
              readOnly
            />
          </div>
        </div>

        {/* DECLARANT TELEPHONE */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">DECLARANT TELEPHONE</label>
          <div className="col-sm-8">
            <input
              type="text"
              id="DeclarantTelePhone"
              className="form-control form-control-sm"
              value={permitDetails?.DeclarantTel || ""}
              readOnly
            />
          </div>
        </div>

        {/* CR UEI NO */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">CR UEI NO</label>
          <div className="col-sm-8">
            <input
              id="CrueiNo"
              type="text"
              className="form-control form-control-sm"
              value={permitDetails?.CRUEI || ""}
              readOnly
            />
          </div>
        </div>

        {/* ADDITIONAL RECIPIENTS */}
        {/* <h6 className="full-width-title">ADDITIONAL RECIPIENTS</h6> */}

        {/* <div className="row align-items-center mb-2">
          <label className="col-sm-4 col-form-label">RECIPIENTS 1</label>
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control"
              tabIndex={10}
              value={recipients1}
              onChange={(e) => setRecipients1(e.target.value)}
            />
          </div>
        </div>
        <div className="row align-items-center mb-2">
          <label className="col-sm-4 col-form-label">RECIPIENTS 2</label>
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control"
              tabIndex={11}
              value={recipients2}
              onChange={(e) => setRecipients2(e.target.value)}
            />
          </div>
        </div>
        <div className="row align-items-center mb-2">
          <label className="col-sm-4 col-form-label">RECIPIENTS 3</label>
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control"
              tabIndex={12}
              value={recipients3}
              onChange={(e) => setRecipients3(e.target.value)}
            />
          </div>
        </div> */}

        {/* EMPTY SPACE USING BOOTSTRAP */}
        <div className="py-"></div>

        {/* ATTACHMENT DOCUMENT */}
        {refDocs && (
          <fieldset>
            <div className="mt-5">
              <h5 className="border-bottom pb-2 full-width-title">
                ATTACHMENT DOCUMENT
              </h5>

              <div className="row align-items-center mb-2">
                <div className="col-5">
                  <select
                    className="Dropdown HighLight"
                    value={documentType}
                    tabIndex={18}
                    onChange={handleDocTypeChange}
                  >
                    <option value="">--Select--</option>
                    {documentType &&
                      !documentAttachType.find(
                        (d) => d.Name === documentType,
                      ) && <option value={documentType}>{documentType}</option>}
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
                    tabIndex={19}
                    onChange={handleFileChange}
                  />
                </div>

                <div className="col-2">
                  <button
                    className="NextpageBtns"
                    onClick={handleAttach}
                    tabIndex={20}
                  >
                    ATTACH
                  </button>
                </div>
              </div>

              <div className="row" style={{ fontSize: "0.8rem", color: "red" }}>
                <div className="col-12">
                  TOTAL SIZE SHOULD NOT EXCEED 20000 (KB)
                </div>
                <div className="col-12">
                  FILE FORMAT: DOC, DOCX, XLS, XLSX, PDF, JPG, JPEG, PNG, BMP,
                  GIF, TIF, TIFF
                </div>
              </div>

              {filteredFiles.length > 0 && (
                <div className="row mt-2">
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
                        {filteredFiles.map((file) => (
                          <tr key={file.Sno}>
                            <td>
                              <FaTrash
                                style={{ color: "red" }}
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
            </div>
          </fieldset>
        )}
      </div>
      {/* BOTTOM BUTTONS */}

      {isViewMode && permitConditions && (
        <div className="col-12 mt-3">
          {/* Blue header bar */}
          <div>PERMIT CONDITIONS</div>

          {/* Yellow info grid */}
          <div>
            <div
              className="row"
              style={{ fontSize: "13px", color: "#b00020", fontWeight: "600" }}
            >
              <div className="col-4 mb-1">
                PERMIT NO : {permitConditions.PermitNo || "-"}
              </div>
              <div className="col-4 mb-1">
                VALIDITY PERIOD : {permitConditions.ValidityPeriod || "-"}
              </div>
              <div className="col-4 mb-1">
                PERMIT APPROVED DATE :{" "}
                {permitConditions.PermitApprovedDate || "-"}
              </div>
              <div className="col-4 mb-1">
                JOB ID : {permitConditions.JobId || "-"}
              </div>
              <div className="col-4 mb-1">
                MSG ID : {permitConditions.MsgId || "-"}
              </div>
              <div className="col-4 mb-1">
                DEC DATE : {permitConditions.DecDate || "-"}
              </div>
              <div className="col-4 mb-1">
                SUBMITTED BY : {permitConditions.SubmittedBy || "-"}
              </div>
              <div className="col-4 mb-1">
                STATUS : {permitConditions.Status || "-"}
              </div>
              <div className="col-4 mb-1">
                TRANSMIT USER : {permitConditions.TransmitUser || ""}
              </div>
              <div className="col-4 mb-1">
                CREATED BY : {permitConditions.CreatedBy || "-"}
              </div>
            </div>
          </div>

          {/* Spacer row */}
          <div
            style={{
              background: "#fffde7",
              padding: "10px",
              border: "1px solid #e0d89c",
              borderTop: "none",
            }}
          />

          {/* Conditional table */}
          {permitConditions.Status === "ERR" ? (
            <table
              className="table table-bordered mb-0"
              style={{
                fontSize: "12px",
                borderRadius: "0 0 4px 4px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      background: "#1a6db5",
                      color: "white",
                      border: "1px solid #1565a8",
                      width: "80px",
                    }}
                  >
                    SNO
                  </th>
                  <th
                    style={{
                      background: "#1a6db5",
                      color: "white",
                      border: "1px solid #1565a8",
                      width: "180px",
                    }}
                  >
                    ERRORCODE
                  </th>
                  <th
                    style={{
                      background: "#1a6db5",
                      color: "white",
                      border: "1px solid #1565a8",
                    }}
                  >
                    DESCRIPTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {(permitConditions.Records || []).map((rec, idx) => (
                  <tr key={idx} style={{ background: "#fffde7" }}>
                    <td style={{ border: "1px solid #e0d89c" }}>
                      {rec.Sno ?? idx + 1}
                    </td>
                    <td style={{ border: "1px solid #e0d89c" }}>
                      {rec.ErrorCode}
                    </td>
                    <td style={{ border: "1px solid #e0d89c" }}>
                      {rec.Description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table
              className="table table-bordered mb-0"
              style={{
                fontSize: "12px",
                borderRadius: "0 0 4px 4px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      background: "#1a6db5",
                      color: "white",
                      border: "1px solid #1565a8",
                      width: "80px",
                    }}
                  >
                    SNO
                  </th>
                  <th
                    style={{
                      background: "#1a6db5",
                      color: "white",
                      border: "1px solid #1565a8",
                      width: "180px",
                    }}
                  >
                    CODE
                  </th>
                  <th
                    style={{
                      background: "#1a6db5",
                      color: "white",
                      border: "1px solid #1565a8",
                    }}
                  >
                    DESCRIPTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {(permitConditions.Records || []).map((rec, idx) => (
                  <tr key={idx} style={{ background: "#fffde7" }}>
                    <td style={{ border: "1px solid #e0d89c" }}>
                      {rec.Sno ?? idx + 1}
                    </td>
                    <td style={{ border: "1px solid #e0d89c" }}>{rec.Code}</td>
                    <td style={{ border: "1px solid #e0d89c" }}>
                      {rec.Description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===================== SAVE AS DRAFT MODAL ===================== */}

      <div className="mt-3 d-flex justify-content-center gap-3">
        <button
          className="NextpageBtns view-nav-btn"
          tabIndex={21}
          id="HeaderSaveDraft"
          onClick={handleSaveAsDraftClick}
        >
          SAVE AS DRAFT
        </button>
        <button
          className="NextpageBtns view-nav-btn"
          tabIndex={22}
          id="HeaderNext"
          onClick={() => setActiveTab("PartyTab")}
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

export default Header;
