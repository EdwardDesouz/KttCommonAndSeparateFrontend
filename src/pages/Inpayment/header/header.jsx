import { useEffect, useState, useRef, useContext } from "react";
import API from "../../../api/api";
import { useInpayment } from "../context/inpaymentContext";
import { UserContext } from "../../../userContex/userContex";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function Header({ setActiveTab }) {
  const { user } = useContext(UserContext);
  // Saved Options States
  const [declarantType, setDeclarantType] = useState([]);
  const [cargoType, setCargoType] = useState([]);
  const [inwardTransportMode, setInwardTransportMode] = useState([]);
  const [declaringFor, setDeclaringFor] = useState([]);
  const [bgIndicator, setBgIndicator] = useState([]);
  const [documentAttachType, setDocumentAttachType] = useState([]);

  // User Context States
  const {
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
    setVesselName,
    setObl,
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
  } = useInpayment();

  useEffect(() => {
    console.log("=== INPAYMENT CONTEXT UPDATED ===");
    console.log("decType:", decType);
    console.log("prevPermitNo:", prevPermitNo);
    console.log("cargo:", cargo);
    console.log("transportMode:", transportMode);
    console.log("declFor:", declFor);
    console.log("bgInd:", bgInd);
    console.log("overrideEx:", overrideEx);
    console.log("supplyInd:", supplyInd);
    console.log("refDocs:", refDocs);
    console.log("Licence:", Licence);
    console.log("Recipients:", Recipients);
    console.log("uploadedFiles:", uploadedFiles);
    console.log("selectedFile:", selectedFile);
    console.log("documentType:", documentType);
  }, [
    decType,
    prevPermitNo,
    cargo,
    transportMode,
    declFor,
    bgInd,
    overrideEx,
    supplyInd,
    refDocs,
    Licence,
    Recipients,
    uploadedFiles,
    selectedFile,
    documentType,
  ]);

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

  useEffect(() => {
    fetchDeclarationTypeData();
    fetchCargoTypeData();
    fetchInwardTransportMode();
    fetchDeclaringFor();
    fetchBgIndicator();
    fetchDocumentAttachType();
  }, []);

  // ===================== Handle Declaration Type Change =================

  const DeclarationChange = (e) => {
    const value = e.target.value;
    setDecType(value);
    console.log("Selected Declaration Type:", value);
    setShowInwardTransport(true);
    setShowClaimantPartyShow(false);
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
    if (value === "9: Containerized") {
      setShowCargoType(true);
    } else {
      setShowCargoType(false);
    }
  };
  // ==================== Handle Inward Transport Mode Change =================
  const InwardTrasnPortModeChange = (e) => {
    const value = e.target.value;
    setTransportMode(value);
    setInwardTransport(value);
    console.log("Selected Inward Transport Mode:", value);

    setVoyageNumber("");
    setVesselName("");
    setObl("");
    setConveyanceNumber("");
    setTransportDetails("");
    setFlightNumber("");
    setAirCraftRegNumber("");
    setMawbNumber("");

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
    if (value === "1 : Sea") {
      setShowVoyageNumber(true);
      setShowVesselName(true);
      setShowOblNumber(true);
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
  const handleAttach = async () => {
    if (!selectedFile || !documentType) {
      alert("Please select file and document type");
      return;
    }
    try {
      const MSGID = "IPTDEC";
      const PermitId = "PERMIT104";
      const UserName = (user?.username || "").toUpperCase();
      const file = selectedFile;
      let fileName = file.name.split(".")[0];
      fileName = fileName.replaceAll(" ", "_").replaceAll("-", "_");
      fileName = fileName + MSGID + UserName;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("Sno", uploadedFiles.length + 1); // auto increment
      formData.append("Name", fileName);
      formData.append("ContentType", file.type);
      formData.append("DocumentType", documentType);
      formData.append("PaymentId", MSGID);
      formData.append("Size", `${Math.round(file.size / 1024)} KB`);
      formData.append("PermitId", PermitId);
      formData.append("Type", "NEW");
      formData.append("TouchUser", UserName);
      formData.append("TouchTime", new Date().toISOString());
      const response = await API.post("/postFileTable/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const files = response?.data?.Records || [];
      setUploadedFiles(files);
      setSelectedFile();
      setDocumentType("");
      console.log("UPLOAD SUCCESS:", files);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
    }
  };

  const handleDelete = async (sno) => {
    try {
      const PermitId = "PERMIT104";
      const res = await API.delete(`/deleteFile/${PermitId}/${sno}/`);
      setUploadedFiles(res.data.Records);
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

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
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">DECLARATION TYPE</label>
          <div className="col-sm-8">
            <select
              className="Dropdown HighLight mandatory"
              id="declarationType"
              tabindex="1"
              value={decType}
              // onChange={(e) => setDecType(e.target.value)}
              onChange={DeclarationChange}
            >
              <option value="">--Select--</option>
              {declarantType.map((dectype) => (
                <option key={dectype.Name} value={dectype.Name}>
                  {dectype.Name}
                </option>
              ))}
            </select>
            <span
              className="ErrorColor"
              style={{ display: "none" }}
              id="declarationTypeSpan"
            >
              PLEASE CHOOSE DECLARATION TYPE
            </span>
          </div>
        </div>

        {/* PREVIOUS PERMIT NO */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">PREVIOUS PERMIT NO</label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              tabindex="2"
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
              tabindex="3"
              value={cargo}
              onChange={CargoPackTypeChange}
            >
              <option value="">--Select--</option>
              {cargoType.map((cargotype) => (
                <option key={cargotype.Name} value={cargotype.Name}>
                  {cargotype.Name}
                </option>
              ))}
            </select>
            <span
              className="ErrorColor"
              style={{ display: "none" }}
              id="CargoPackTypeSpan"
            >
              PLEASE CHOOSE CARGO PACK TYPE
            </span>
          </div>
        </div>

        {/* INWARD TRANSPORT */}
        {showInwardTransport && (
          <div
            className="row align-items-center compact-row"
            id="InwardTransportModeShowHide"
          >
            <label className="col-sm-4 col-form-label">INWARD TRANSPORT</label>
            <div className="col-sm-8">
              <select
                className="Dropdown HighLight mandatory"
                value={transportMode}
                onChange={InwardTrasnPortModeChange}
                tabIndex={4}
              >
                <option value="">--Select--</option>
                {inwardTransportMode.map((inwardTransward) => (
                  <option
                    key={inwardTransward.Name}
                    value={inwardTransward.Name}
                  >
                    {inwardTransward.Name}
                  </option>
                ))}
              </select>
              <span
                className="ErrorColor"
                style={{ display: "none" }}
                id="inwardTranseportModeSpan"
              >
                PLEASE CHOOSE INWARD TRANSPORT MODE
              </span>
            </div>
          </div>
        )}

        {/* DECLARING FOR */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">DECLARING FOR</label>
          <div className="col-sm-8">
            <select
              className="Dropdown HighLight mandatory"
              value={declFor}
              onChange={(e) => setDeclFor(e.target.value)}
              tabindex="5"
            >
              <option value="">--Select--</option>
              {declaringFor.map((dclrfor) => (
                <option key={dclrfor.Name} value={dclrfor.Name}>
                  {dclrfor.Name}
                </option>
              ))}
            </select>
            <span
              className="ErrorColor"
              style={{ display: "none" }}
              id="DeclaringForSpan"
            >
              PLEASE CHOOSE DECLARING FOR
            </span>
          </div>
        </div>

        {/* BG INDICATOR */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">BG INDICATOR</label>
          <div className="col-sm-8">
            <select
              className="Dropdown HighLight"
              value={bgInd}
              onChange={(e) => setBgInd(e.target.value)}
              tabindex="6"
            >
              <option value="">--Select--</option>
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
              className="form-check-input"
              checked={overrideEx}
              onChange={(e) => setOverrideEx(e.target.checked)}
              tabindex="7"
            />
          </div>
        </div>

        {/* SUPPLY INDICATOR */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">SUPPLY INDICATOR</label>
          <div className="col-sm-8 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={supplyInd}
              onChange={(e) => setSupplyInd(e.target.checked)}
              tabindex="8"
            />
          </div>
        </div>

        {/* REFERENCE DOCUMENT */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-4 col-form-label">REFERENCE DOCUMENT</label>
          <div className="col-sm-8 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="ReferenceDocuments"
              tabindex="9"
              checked={refDocs}
              onChange={(e) => setRefDocs(e.target.checked)}
            />
          </div>
        </div>

        {/*------------------------------------------------------------ DisableClass------------------------------------------------ */}
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">PERMIT ID</label>
          <div className="col-sm-8 form-check">
            <input className="form-control" id="PermitID" value="PermitId" />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">USER NAME</label>
          <div className="col-sm-8 form-check">
            <input className="form-control" id="USERNAME" value="UserName" />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">MSG ID</label>
          <div className="col-sm-8 form-check">
            <input className="form-control" id="MSGID" value="MsgId" />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">JOB ID</label>
          <div className="col-sm-8 form-check">
            <input className="form-control" id="JOBID" value="JobId" />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">REF ID</label>
          <div className="col-sm-8 form-check">
            <input className="form-control" id="REFID" value="REFID" />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">PERMIT NUMBER</label>
          <div className="col-sm-8 form-check">
            <input className="form-control" id="PermitNumberId" value="" />
          </div>
        </div>
        <div className="row align-items-center compact-row DisableClass">
          <label className="col-sm-4 col-form-label">SHOW EDIT</label>
          <div className="col-sm-8 form-check">
            <input className="form-control" id="ShowEdit" value="SHOW" />
          </div>
        </div>
        {/* -----------------------------------------------------DisableClass------------------------------------------------------- */}
        {/* LICENSE SECTION */}
        {refDocs && (
          <fieldset>
            <div className="row mt-2 col-12">
              <h5 className="mt-3 border-bottom pb-2 full-width-title">
                LICENSE
              </h5>

              {/* Licence 1 + 2 */}
              <div className="row g-2">
                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Licence 1"
                    value={licence1}
                    onChange={(e) => setLicence1(e.target.value)}
                  />
                </div>

                <div className="col-1"></div>

                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Licence 2"
                    value={licence2}
                    onChange={(e) => setLicence2(e.target.value)}
                  />
                </div>
              </div>

              {/* Licence 3 + 4 */}
              <div className="row g-2">
                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Licence 3"
                    value={licence3}
                    onChange={(e) => setLicence3(e.target.value)}
                  />
                </div>

                <div className="col-1"></div>

                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Licence 4"
                    value={licence4}
                    onChange={(e) => setLicence4(e.target.value)}
                  />
                </div>
              </div>

              {/* Licence 5 */}
              <div className="row g-2">
                <div className="col-5 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Licence 5"
                    value={licence5}
                    onChange={(e) => setLicence5(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        )}
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
              value="headmailId"
              disabled
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
              value="headdeclarantName"
              disabled
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
              value="headdeclarantCode"
              disabled
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
              value="headdeclarantTelephone"
              disabled
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
              value="headCrueiNo"
              disabled
            />
          </div>
        </div>

        {/* ADDITIONAL RECIPIENTS */}
        <h6 className="full-width-title">ADDITIONAL RECIPIENTS</h6>

        <div className="row align-items-center mb-2">
          <label className="col-sm-4 col-form-label">RECIPIENTS 1</label>
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control form-control-sm"
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
              className="form-control form-control-sm"
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
              className="form-control form-control-sm"
              value={recipients3}
              onChange={(e) => setRecipients3(e.target.value)}
            />
          </div>
        </div>

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
                    onChange={handleDocTypeChange}
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
                    onChange={handleFileChange}
                  />
                </div>

                <div className="col-2">
                  <button className="NextpageBtns" onClick={handleAttach}>
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
                                href={`http://localhost:8000/${file.filePath}`}
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
      <div className="mt-3 d-flex justify-content-center gap-3">
        <button className="NextpageBtns">RESET</button>
        <button
          className="NextpageBtns"
          tabindex="17"
          id="HeaderNext"
          onClick={() => setActiveTab("PartyTab")}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

export default Header;
