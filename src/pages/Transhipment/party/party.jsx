import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { fetchPopupData, SearchPopup, currentPopup } from "./partyFunctions";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../userContex/userContex";
import { useTranshipment } from "../context/transhipmentContext";
import { useDebounceAutoSave } from "../../../autoSave/useDebounceAutoSave";

function Party({ setActiveTab, isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  // Get global states and setters from context
  const {
    permitDetails,
    updatePermitDetails,
    showPartyImporter,
    setShowPartyImporter,
    importerCode,
    setImporterCode,
    importerCruei,
    setImporterCruei,
    importerName,
    setImporterName,
    importerName1,
    setImporterName1,
    showImporterCrueiError,
    setShowImporterCrueiError,
    showImporterNameError,
    setShowImporterNameError,
    setInvoiceExporterCode,
    setInvoiceExporterCruei,
    setInvoiceExporterName,
    setInvoiceExporterName1,
    summaryImporterCruei,
    setSummaryImporterCruei,
    summaryImporterName,
    setSummaryImporterName,
    showExporter,
    setShowExporter,
    exporterCode,
    setExporterCode,
    exporterCruei,
    setExporterCruei,
    exporterName,
    setExporterName,
    exporterName1,
    setExporterName1,
    showExporterCrueiError,
    setShowExporterCrueiError,
    showExporterNameError,
    setShowExporterNameError,
    exporterAddress,
    setExporterAddress,
    exporterAddress1,
    setExporterAddress1,
    exporterCity,
    setExporterCity,
    exporterSubCode,
    setExporterSubCode,
    exporterSubDivision,
    setExporterSubDivision,
    exporterCountryCode,
    setExporterCountryCode,
    exporterPostal,
    setExporterPostal,
    inwardCode,
    setInwardCode,
    inwardCruei,
    setInwardCruei,
    inwardName,
    setInwardName,
    inwardName1,
    setInwardName1,
    showInwardCrueiError,
    setShowInwardCrueiError,
    showInwardNameError,
    setShowInwardNameError,
    showInwardCarrier,
    setShowInwardCarrier,
    showOutwardCarrier,
    setShowOutwardCarrier,
    outwardCode,
    setOutwardCode,
    outwardCruei,
    setOutwardCruei,
    outwardName,
    setOutwardName,
    outwardName1,
    setOutwardName1,
    freightForwarderCode,
    setFreightForwarderCode,
    freightForwarderCruei,
    setFreightForwarderCruei,
    freightForwardName,
    setFreightForwarderName,
    freightForwardName1,
    setFreightForwarderName1,
    claimantCode,
    setClaimantCode,
    claimantCruei,
    setClaimantCruei,
    claimantName,
    setClaimantName,
    claimantName1,
    setClaimantName1,

    congineeCode,
    setCongineeCode,
    congineeCruei,
    setCongineeCruei,
    congineeName,
    setCongineeName,
    congineeName1,
    setCongineeName1,
    congineeAddress,
    setCongineeAddress,
    congineeAddress1,
    setCongineeAddress1,
    congineeCity,
    setCongineeCity,
    congineeSubCode,
    setCongineeSubCode,
    congineeSubDivision,
    setCongineeSubDivision,
    congineePostal,
    setCongineePostel,
    congineeCountryCode,
    setCongineeCountryCode,
    showClaimantPartyShow,
    setShowClaimantPartyShow,
    showCongineeShow,
    setShowCongineeShow,
    showEndUserRow,
    setShowEndUserRow,
    endUserCheck,
    setEndUserCheck,
    showCertificateOfOrigin,
    setShowCertificateOfOrgin,
    showPartyEndUser,
    setShowPartyEndUser,
    transportMode,
    setTransportMode,

    endUserCode,
    setEndUserCode,
    endUserCruei,
    setEndUserCruei,
    endUserName,
    setEndUserName,
    endUserName1,
    setEndUserName1,
    endUserAddress,
    setEndUserAddress,
    endUserAddress1,
    setEndUserAddress1,
    endUserCity,
    setEndUserCity,
    endUserSubCode,
    setEndUserSubCode,
    endUserSubDivision,
    setEndUserSubDivision,
    endUserPostal,
    setEndUserPostal,
    endUserCountryCode,
    setEndUserCountryCode,

    manufacturerCode,
    setManufacturerCode,
    manufacturerCruei,
    setManufacturerCruei,
    manufacturerName,
    setManufacturerName,
    manufacturerName1,
    setManufacturerName1,
    manufacturerAddress,
    setManufacturerAddress,
    manufacturerAddress1,
    setManufacturerAddress1,
    manufacturerCity,
    setManufacturerCity,
    manufacturerSub,
    setManufacturerSub,
    manufacturerSubDivi,
    setManufacturerSubDivi,
    manufacturerPostal,
    setManufacturerPostal,
    manufacturerCountry,
    setManufacturerCountry,

    showHandlingAgent,
    setShowHandlingAgent,
    handlingAgentCode,
    setHandlingAgentCode,
    handlingAgentCruei,
    setHandlingAgentCruei,
    handlingAgentName,
    setHandlingAgentName,
    handlingAgentName1,
    setHandlingAgentName1,

    // Apart from party page for save as draft mode
    decType,
    prevPermitNo,
    cargo,
    bgInd,
    supplyInd,
    refDocs,
    declFor,
    Licence,
    Recipients,
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
  } = useTranshipment();

  useEffect(() => {
    if (!permitDetails?.PermitId) {
      const stored = sessionStorage.getItem("currentPermit");
      if (stored) {
        const parsed = JSON.parse(stored);
        updatePermitDetails(parsed); // sync into context on page load
      }
    }
  }, []);

  //======= States   ==========
  //======= Ui Styles==========
  const isSea = transportMode === "1 : Sea";
  const isAir = transportMode === "4 : Air";

  const [showResetButton, setShowResetButton] = useState(false);
  // ======================== IMPORTERS ========================
  const importerCodeRef = useRef(null);
  const [importer, setImporter] = useState(null);
  const [importerSuggestions, setImporterSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showImporterDropdown, setShowImporterDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [importerError, setImporterError] = useState(false);

  // current importer
  useEffect(() => {
    window.currentPartyImporter = {
      Code: importerCode,
      CRUEI: importerCruei,
      Name: importerName,
      Name1: importerName1,
    };
  }, [importerCode, importerCruei, importerName, importerName1]);
  // ======================== FETCH IMPORTERS ========================
  useEffect(() => {
    const fetchImporters = async () => {
      try {
        const response = await API.get("/getCommonImporterTableInfo/");
        const list = response.data.map(
          (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
        );
        setImporterSuggestions(list);
        setFilteredSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch importers", err);
      }
    };
    fetchImporters();
  }, []);
  // ======================== IMPORTER HANDLERS ========================
  const handleImporterChange = (e) => {
    const val = e.target.value;
    setImporterCode(val);
    setImporterError(false);
    setHighlightedIndex(0);

    if (!val) {
      setShowImporterDropdown(false);
      return;
    }
    if (!val) {
      setShowImporterCrueiError(true);
      setShowImporterNameError(true);
    } else {
      setShowImporterCrueiError(false);
      setShowImporterNameError(false);
    }

    const filtered = importerSuggestions.filter((i) => {
      const [Code, Cruei, Name, Name1] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Name.toLowerCase().startsWith(search)
      );
    });
    setFilteredSuggestions(filtered.slice(0, 100));
    setShowImporterDropdown(filtered.length > 0);
  };
  // ======================== IMPORTER KEYDOWN ========================
  const handleImporterKeyDown = (e) => {
    if (!showImporterDropdown || filteredSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 >= filteredSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleImporterSelect(filteredSuggestions[highlightedIndex]);
    }
  };
  // ======================== IMPORTER SELECT ========================
  const handleImporterSelect = (item) => {
    const [code, cruei, name, name1] = item.split(":");
    setImporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
    setImporterCode(code);
    setImporterCruei(cruei);
    setImporterName(name);
    setImporterName1(name1);
    setShowImporterDropdown(false);
    setImporterError(false);
  };
  // ======================== IMPORTER FOCUSOUT ========================
  const handleFocusOut = () => {
    setTimeout(() => {
      if (!importerCode) {
        setImporter(null);
        setImporterCruei("");
        setImporterName("");
        setImporterName1("");
        setImporterError(true);
        setShowImporterDropdown(false);
        return;
      }

      const selected = importerSuggestions
        .map((i) => i.split(":"))
        .find(([code]) => code.toLowerCase() === importerCode.toLowerCase());
      if (selected) {
        const [code, cruei, name, name1] = selected;
        setImporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
        setImporterCode(code);
        setImporterCruei(cruei);
        setImporterName(name);
        setImporterName1(name1);
        setImporterError(false);
      } else {
        setImporter(null);
        // setImporterCruei("");
        // setImporterName("");
        // setImporterName1("");
        setImporterError(true);
      }
      setShowImporterDropdown(false);
    }, 150);
  };
  // // ======================== IMPORTER SAVE FUNCTION ========================
  const saveImporter = async () => {
    if (!importerCode) {
      setImporterError(true);
      alert("Code is required!");
      return;
    }
    const duplicate = importerSuggestions.some(
      (i) => i.split(":")[0].toLowerCase() === importerCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! Importer not saved.");
      return;
    }

    const payload = {
      Id: importer?.Id || 0,
      Code: importerCode || "",
      CRUEI: importerCruei || "",
      Name: importerName || "",
      Name1: importerName1 || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
      MES: "",
      APS: "",
    };

    console.log("Payload to save:", payload);

    try {
      const response = await API.post("/postImporterTable/", payload);
      alert(response.data?.message || "Importer saved successfully!");
      console.log("Saved data:", response.data);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data?.error || "Failed to save importer");
      } else {
        console.error("Failed to save importer:", err);
        alert("Failed to save importer, check console for details");
      }
    }
  };

  // iNVOICE PAGE
  useEffect(() => {
    if (exporterCode) {
      setInvoiceExporterCode(exporterCode);
      setInvoiceExporterCruei(exporterCruei);
      setInvoiceExporterName(exporterName);
      setInvoiceExporterName1(exporterName1);
      setSummaryImporterCruei(exporterCruei);
      setSummaryImporterName(exporterName);
    }
  }, [exporterCode, exporterCruei, exporterName, exporterName1]);

  // ======================== INWARD ========================
  const inwardCodeRef = useRef(null);
  const [inwardAgent, setInwardAgent] = useState(null);
  const [inwardSuggestions, setInwardSuggestions] = useState([]);
  const [filteredInwardSuggestions, setFilteredInwardSuggestions] = useState(
    [],
  );
  const [showInwardDropdown, setShowInwardDropdown] = useState(false);
  const [inwardHighlightedIndex, setInwardHighlightedIndex] = useState(0);
  const [inwardError, setInwardError] = useState(false);
  // ======================== FETCH INWARD ========================
  useEffect(() => {
    const fetchInward = async () => {
      try {
        const response = await API.get(
          "/getCommonInwardCarrierAgentTableInfo/",
        );
        const list = response.data.map(
          (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
        );
        setInwardSuggestions(list);
        setFilteredInwardSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch importers", err);
      }
    };
    fetchInward();
  }, []);
  // ======================== INWARD HANDLERS ========================
  const handleInwardChange = (e) => {
    const val = e.target.value;
    setInwardCode(val);
    setInwardError(false);
    setInwardHighlightedIndex(0);

    if (!val) {
      setShowInwardDropdown(false);
      // setInwardAgent(null);
      // setFilteredInwardSuggestions(inwardSuggestions);
      return;
    }

    const filtered = inwardSuggestions.filter((i) => {
      const [Code, Cruei, Name, Name1] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Name.toLowerCase().startsWith(search)
      );
    });
    setFilteredInwardSuggestions(filtered.slice(0, 100));
    setShowInwardDropdown(filtered.length > 0);
  };
  // ======================== INWARD KEYDOWN ========================
  const handleInwardKeyDown = (e) => {
    if (!showInwardDropdown || filteredInwardSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setInwardHighlightedIndex((prev) =>
        prev + 1 >= filteredInwardSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setInwardHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredInwardSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleInwardSelect(filteredInwardSuggestions[inwardHighlightedIndex]);
    }
  };
  // ======================== INWARD SELECT ========================
  const handleInwardSelect = (item) => {
    const [code, cruei, name, name1] = item.split(":");
    setInwardAgent({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
    setInwardCode(code);
    setInwardCruei(cruei);
    setInwardName(name);
    setInwardName1(name1);
    setShowInwardDropdown(false);
    setInwardError(false);
  };
  // ======================== INWARD FOCUSOUT ========================
  const handleInwardFocusOut = () => {
    setTimeout(() => {
      if (!inwardCode) {
        setInwardAgent(null);
        setInwardCruei("");
        setInwardName("");
        setInwardName1("");
        setInwardError(true);
        setShowInwardDropdown(false);
        return;
      }
      const selected = inwardSuggestions
        .map((i) => i.split(":"))
        .find(([code]) => code.toLowerCase() === inwardCode.toLowerCase());
      if (selected) {
        const [code, cruei, name, name1] = selected;
        setInwardAgent({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
        setInwardCode(code);
        setInwardCruei(cruei);
        setInwardName(name);
        setInwardName1(name1);
        setInwardError(false);
      } else {
        setInwardAgent(null);
        // setInwardCruei("");
        // setInwardName("");
        // setInwardName1("");
        setInwardError(true);
      }
      setShowInwardDropdown(false);
    }, 150);
  };
  // ======================== INWARD SAVE FUNCTION ========================
  const saveInward = async () => {
    if (!inwardCode) {
      setInwardError(true);
      alert("Code is required!");
      return;
    }

    // Check for duplicate
    const duplicate = inwardSuggestions.some(
      (i) => i.split(":")[0].toLowerCase() === inwardCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! Inward Carrier Agent not saved.");
      return;
    }
    const payload = {
      Id: inwardAgent?.Id || 0,
      Code: inwardCode || "",
      CRUEI: inwardCruei || "",
      Name: inwardName || "",
      Name1: inwardName1 || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };
    console.log("Payload to save:", payload);
    try {
      const response = await API.post("/postInwardCarrierAgentTable/", payload);
      alert(response.data?.message || "Inward saved successfully!");
      console.log("Saved data:", response.data);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data?.error || "Failed to save Inward");
      } else {
        console.error("Failed to save Inward:", err);
        alert("Failed to save Inward, check console for details");
      }
    }
  };

  // ======================== FETCH FREIGHTFORWARDER  ========================
  const freightForwarderCodeRef = useRef(null);
  const [freightForwarder, setFreightForwarder] = useState(null);
  const [freightForwarderSuggestions, setFreightForwarSuggestions] = useState(
    [],
  );
  const [
    filteredFreightForwarderSuggestions,
    setFilteredFreightForwarderSuggestions,
  ] = useState([]);
  const [showFreightForwarderDropdown, setShowFreightForwarderDropdown] =
    useState(false);
  const [freightForwarderError, setFreightForwarderError] = useState(false);
  const [
    freightForwarderHighlightedIndex,
    setFreightForwarderHighlightedIndex,
  ] = useState(0);
  // const [loading, setLoading] = useState(false);
  // ======================== FETCH FREIGHTFORWARDER ========================
  useEffect(() => {
    const fetchFreightForwarder = async () => {
      try {
        const response = await API.get("/getCommonFreightForwarderTable/");
        const list = response.data.map(
          (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
        );
        setFreightForwarSuggestions(list);
        setFilteredFreightForwarderSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch importers", err);
      }
    };
    fetchFreightForwarder();
  }, []);

  // ======================== FREIGHTFORWARDER HANDLERS ========================
  const handleFreightForwarderChange = (e) => {
    const val = e.target.value;
    setFreightForwarderCode(val);
    setFreightForwarderError(false);
    setFreightForwarderHighlightedIndex(0); // reset highlight to first item

    if (!val) {
      setShowFreightForwarderDropdown(false);
      // setFreightForwarder(null);
      // setFilteredFreightForwarderSuggestions(freightForwarderSuggestions);
      return;
    }

    const filtered = freightForwarderSuggestions.filter((i) => {
      const [Code, Cruei, Name, Name1] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Name.toLowerCase().startsWith(search)
      );
    });
    setFilteredFreightForwarderSuggestions(filtered.slice(0, 100));
    setShowFreightForwarderDropdown(filtered.length > 0);
  };

  // ======================== FREIGHTFORWARDER KEYDOWN ========================
  const handleFreightForwarderKeyDown = (e) => {
if (!showFreightForwarderDropdown || filteredFreightForwarderSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFreightForwarderHighlightedIndex((prev) =>
       prev + 1 >= filteredFreightForwarderSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFreightForwarderHighlightedIndex((prev) =>
        prev - 1 < 0
          ? filteredFreightForwarderSuggestions.length - 1
          : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleFreightForwarderSelect(
        filteredFreightForwarderSuggestions[freightForwarderHighlightedIndex],
      );
    }
  };

  // ======================== FREIGHTFORWARDER SELECT ========================
  const handleFreightForwarderSelect = (item) => {
    const [code, cruei, name, name1] = item.split(":");
    setFreightForwarder({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
    setFreightForwarderCode(code);
    setFreightForwarderCruei(cruei);
    setFreightForwarderName(name);
    setFreightForwarderName1(name1);
    setShowFreightForwarderDropdown(false);
    setFreightForwarderError(false);
  };

  // ======================== FREIGHTFORWARDER FOCUSOUT ========================
  const handleFreightForwarderFocusOut = () => {
    setTimeout(() => {
      if (!freightForwarderCode) {
        setFreightForwarder(null);
        setFreightForwarderCruei("");
        setFreightForwarderName("");
        setFreightForwarderName1("");
        setFreightForwarderError(true);
        setShowFreightForwarderDropdown(false);
        return;
      }

      const selected = freightForwarderSuggestions
        .map((i) => i.split(":"))
        .find(
          ([code]) => code.toLowerCase() === freightForwarderCode.toLowerCase(),
        );

      if (selected) {
        const [code, cruei, name, name1] = selected;
        setFreightForwarder({
          Code: code,
          CRUEI: cruei,
          Name: name,
          Name1: name1,
        });
        setFreightForwarderCode(code);
        setFreightForwarderCruei(cruei);
        setFreightForwarderName(name);
        setFreightForwarderName1(name1);
        setFreightForwarderError(false);
      } else {
        setFreightForwarder(null);
        // setFreightForwarderCruei("");
        // setFreightForwarderName("");
        // setFreightForwarderName1("");
        setFreightForwarderError(true);
      }
      setShowFreightForwarderDropdown(false);
    }, 150);
  };

  // ======================== FREIGHTFORWARDER SAVE FUNCTION ========================
  const saveFreightForwarder = async () => {
    if (!freightForwarderCode) {
      setFreightForwarderError(true);
      alert("Code is required!");
      return;
    }
    // Check for duplicate
    const duplicate = freightForwarderSuggestions.some(
      (i) =>
        i.split(":")[0].toLowerCase() === freightForwarderCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! Freight Forwarder not saved.");
      return;
    }
    const payload = {
      Id: freightForwarder?.Id || 0,
      Code: freightForwarderCode || "",
      CRUEI: freightForwarderCruei || "",
      Name: freightForwardName || "",
      Name1: freightForwardName1 || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };
    console.log("Payload to save:", payload);
    try {
      const response = await API.post("/postFreightForwarderTable/", payload);
      alert(response.data?.message || "FreightForwarder saved successfully!");
      console.log("Saved data:", response.data);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data?.error || "Failed to save FreightForwarder");
      } else {
        console.error("Failed to save FreightForwarder:", err);
        alert("Failed to save FreightForwarder, check console for details");
      }
    }
  };

  // ======================== CLAIMANT PARTY========================
  const claimantCodeRef = useRef(null);
  const [claimant, setClaimant] = useState(null);

  const [claimantcmantName, setclaimantcmantName] = useState("");
  const [claimantcmantName1, setclaimantcmantName1] = useState("");
  const [claimantSuggestions, setClaimantSuggestions] = useState([]);
  const [filteredClaimantSuggestions, setFilteredClaimantSuggestions] =
    useState([]);
  const [showClaimantDropdown, setShowClaimantDropdown] = useState(false);
  const [claimantError, setClaimantError] = useState(false);
  const [claimantHighlightedIndex, setClaimantHighlightedIndex] = useState(0);
  // const [loading, setLoading] = useState(false);
  // ======================== FETCH CLAIMANT PARTY========================
  useEffect(() => {
    const fetchClaimant = async () => {
      try {
        const response = await API.get("/getCommonClaimantPartyTable/");
        const list = response.data.map(
          (i) =>
            `${i.ClaimantCode}:${i.CRUEI}:${i.Name}:${i.Name1}:${i.ClaimantName}:${i.ClaimantName1}`,
        );
        setClaimantSuggestions(list);
        setFilteredClaimantSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch claimant party", err);
      }
    };
    fetchClaimant();
  }, []);

  // ======================== CLAIMANT PARTY HANDLERS ========================
  const handleClaimantChange = (e) => {
    const val = e.target.value;
    setClaimantCode(val);
    setClaimantError(false);
    setClaimantHighlightedIndex(0);
    if (!val) {
      setShowClaimantDropdown(false);
      return;
    }
    const filtered = claimantSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );
    setFilteredClaimantSuggestions(filtered.slice(0, 100));
    setShowClaimantDropdown(filtered.length > 0);
  };
  // ======================== CLAIMANT PARTY KEYDOWN ========================
  const handleClaimantKeyDown = (e) => {
    if (!showClaimantDropdown || filteredClaimantSuggestions.length === 0)
      return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setClaimantHighlightedIndex((prev) =>
        prev + 1 >= filteredClaimantSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setClaimantHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredClaimantSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleClaimantSelect(
        filteredClaimantSuggestions[claimantHighlightedIndex],
      );
    }
  };
  // ======================== CLAIMANT PARTY SELECT ========================
  const handleClaimantSelect = (item) => {
    const [code, cruei, name, name1, claimantName, claimantName1] =
      item.split(":");
    setClaimant({
      ClaimantCode: code,
      CRUEI: cruei,
      Name: name,
      Name1: name1,
      ClaimantName: claimantName,
      ClaimantName1: claimantName1,
    });
    setClaimantCode(code);
    setClaimantCruei(cruei);
    setClaimantName(name);
    setClaimantName1(name1);
    setclaimantcmantName(claimantName);
    setclaimantcmantName1(claimantName1);
    setShowClaimantDropdown(false);
    setClaimantError(false);
  };
  // ======================== CLAIMANT PARTY FOCUSOUT ========================
  const handleClaimantFocusOut = () => {
    setTimeout(() => {
      if (!claimantCode) {
        setClaimant(null);
        setClaimantCruei("");
        setClaimantName("");
        setClaimantName1("");
        setclaimantcmantName("");
        setclaimantcmantName1("");
        setClaimantError(true);
        setShowClaimantDropdown(false);
        return;
      }
      const selected = claimantSuggestions
        .map((i) => i.split(":"))
        .find(([code]) => code.toLowerCase() === claimantCode.toLowerCase());

      if (selected) {
        const [code, cruei, name, name1, claimantName, claimantName1] =
          selected;
        setClaimant({
          ClaimantCode: code,
          CRUEI: cruei,
          Name: name,
          Name1: name1,
          ClaimantName: claimantName,
          ClaimantName1: claimantName1,
        });
        setClaimantCode(code);
        setClaimantCruei(cruei);
        setClaimantName(name);
        setClaimantName1(name1);
        setclaimantcmantName(claimantName);
        setclaimantcmantName1(claimantName1);
        setClaimantError(false);
      } else {
        setClaimant(null);
        // setClaimantCruei("");
        // setClaimantName("");
        // setClaimantName1("");
        // setclaimantcmantName("");
        // setclaimantcmantName1("");
        setClaimantError(true);
      }

      setShowClaimantDropdown(false);
    }, 100);
  };
  // ======================== CLAIMANT PARTY SAVE FUNCTION ========================
  const saveClaimanParty = async () => {
    if (!claimantCode) {
      setClaimantError(true);
      alert("Code is required!");
      return;
    }
    // Check for duplicate
    const duplicate = claimantSuggestions.some(
      (i) => i.split(":")[0].toLowerCase() === claimantCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! Freight Forwarder not saved.");
      return;
    }
    const payload = {
      Id: claimant?.Id || 0,
      Name: claimantName || "",
      Name1: claimantName1 || "",
      CRUEI: claimantCruei || "",
      ClaimantName: claimantcmantName || "",
      ClaimantName1: claimantcmantName1 || "",
      ClaimantCode: claimantCode || "",
      Name2: "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };
    console.log("Payload to save:", payload);
    try {
      const response = await API.post("/postClaimantPartyTable/", payload);
      alert(response.data?.message || "Claimant Party saved successfully!");
      console.log("Saved data:", response.data);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data?.error || "Failed to save Claimant Party");
      } else {
        console.error("Failed to save Claimant Party:", err);
        alert("Failed to save Claimant Party, check console for details");
      }
    }
  };

  // ======================== CONSIGNEE ========================
  const congineeCodeRef = useRef(null);
  const [consignee, setConsignee] = useState(null);
  const [congineeSuggestions, setCongineeSuggestions] = useState([]);
  const [filteredCongineeSuggestions, setFilteredCongineeSuggestions] =
    useState([]);
  const [showCongineeDropdown, setShowCongineeDropdown] = useState(false);
  const [congineeError, setCongineeError] = useState(false);
  const [congineeHighlightedIndex, setCongineeHighlightedIndex] = useState(0);

  // ======================== FETCH CONSIGNEE ========================
  useEffect(() => {
    const fetchConsignee = async () => {
      try {
        const response = await API.get("/getCommonConsigneeTableInfo/");
        const list = response.data.map(
          (i) =>
            `${i.ConsigneeCode}:${i.ConsigneeCRUEI}:${i.ConsigneeName}:${i.ConsigneeName1}:${i.ConsigneeAddress}:${i.ConsigneeAddress1}:${i.ConsigneeCity}:${i.ConsigneeSub}:${i.ConsigneeSubDivi}:${i.ConsigneePostal}:${i.ConsigneeCountry}`,
        );
        setCongineeSuggestions(list);
        setFilteredCongineeSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch consignee", err);
      }
    };
    fetchConsignee();
  }, []);

  // ======================== CONSIGNEE HANDLERS ========================
  const handleCongineeChange = (e) => {
    const val = e.target.value;
    setCongineeCode(val);
    setCongineeError(false);
    setCongineeHighlightedIndex(0);
    if (!val) {
      setShowCongineeDropdown(false);
      return;
    }
    const filtered = congineeSuggestions.filter((i) => {
      const [Code, Cruei, Name, Name1] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Name.toLowerCase().startsWith(search)
      );
    });
    setFilteredCongineeSuggestions(filtered.slice(0, 100));
    setShowCongineeDropdown(filtered.length > 0);
  };

  // ======================== CONSIGNEE KEYDOWN ========================
  const handleCongineeKeyDown = (e) => {
    if (!showCongineeDropdown || filteredCongineeSuggestions.length === 0)
      return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCongineeHighlightedIndex((prev) =>
        prev + 1 >= filteredCongineeSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCongineeHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredCongineeSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleCongineeSelect(
        filteredCongineeSuggestions[congineeHighlightedIndex],
      );
    }
  };

  // ======================== CONSIGNEE SELECT ========================
  const handleCongineeSelect = (item) => {
    const [
      code,
      cruei,
      name,
      name1,
      addr,
      addr1,
      city,
      sub,
      subDivi,
      postal,
      country,
    ] = item.split(":");
    setConsignee({
      ConsigneeCode: code,
      ConsigneeCRUEI: cruei,
      ConsigneeName: name,
      ConsigneeName1: name1,
      ConsigneeAddress: addr,
      ConsigneeAddress1: addr1,
      ConsigneeCity: city,
      ConsigneeSub: sub,
      ConsigneeSubDivi: subDivi,
      ConsigneePostal: postal,
      ConsigneeCountry: country,
    });
    setCongineeCode(code);
    setCongineeCruei(cruei);
    setCongineeName(name);
    setCongineeName1(name1);
    setCongineeAddress(addr);
    setCongineeAddress1(addr1);
    setCongineeCity(city);
    setCongineeSubCode(sub);
    setCongineeSubDivision(subDivi);
    setCongineePostel(postal);
    setCongineeCountryCode(country);
    setShowCongineeDropdown(false);
    setCongineeError(false);
  };

  // ======================== CONSIGNEE FOCUSOUT ========================
  const handleCongineeFocusOut = () => {
    setTimeout(() => {
      if (!congineeCode) {
        setConsignee(null);
        setCongineeCruei("");
        setCongineeName("");
        setCongineeName1("");
        setCongineeAddress("");
        setCongineeAddress1("");
        setCongineeCity("");
        setCongineeSubCode("");
        setCongineeSubDivision("");
        setCongineePostel("");
        setCongineeCountryCode("");
        setCongineeError(true);
        setShowCongineeDropdown(false);
        return;
      }
      const selected = congineeSuggestions
        .map((i) => i.split(":"))
        .find(([code]) => code.toLowerCase() === congineeCode.toLowerCase());
      if (selected) {
        const [
          code,
          cruei,
          name,
          name1,
          addr,
          addr1,
          city,
          sub,
          subDivi,
          postal,
          country,
        ] = selected;
        setConsignee({
          ConsigneeCode: code,
          ConsigneeCRUEI: cruei,
          ConsigneeName: name,
          ConsigneeName1: name1,
          ConsigneeAddress: addr,
          ConsigneeAddress1: addr1,
          ConsigneeCity: city,
          ConsigneeSub: sub,
          ConsigneeSubDivi: subDivi,
          ConsigneePostal: postal,
          ConsigneeCountry: country,
        });
        setCongineeCode(code);
        setCongineeCruei(cruei);
        setCongineeName(name);
        setCongineeName1(name1);
        setCongineeAddress(addr);
        setCongineeAddress1(addr1);
        setCongineeCity(city);
        setCongineeSubCode(sub);
        setCongineeSubDivision(subDivi);
        setCongineePostel(postal);
        setCongineeCountryCode(country);
        setCongineeError(false);
      } else {
        setConsignee(null);
        setCongineeError(true);
      }
      setShowCongineeDropdown(false);
    }, 150);
  };

  // ======================== CONSIGNEE SAVE ========================
  const saveConsignee = async () => {
    if (!congineeCode) {
      setCongineeError(true);
      alert("Code is required!");
      return;
    }
    const duplicate = congineeSuggestions.some(
      (i) => i.split(":")[0].toLowerCase() === congineeCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! Consignee not saved.");
      return;
    }
    const payload = {
      Id: consignee?.Id || 0,
      ConsigneeCode: congineeCode || "",
      ConsigneeCRUEI: congineeCruei || "",
      ConsigneeName: congineeName || "",
      ConsigneeName1: congineeName1 || "",
      ConsigneeAddress: congineeAddress || "",
      ConsigneeAddress1: congineeAddress1 || "",
      ConsigneeCity: congineeCity || "",
      ConsigneeSub: congineeSubCode || "",
      ConsigneeSubDivi: congineeSubDivision || "",
      ConsigneePostal: congineePostal || "",
      ConsigneeCountry: congineeCountryCode || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };
    try {
      const response = await API.post("/postCongineeTable/", payload);
      alert(response.data?.message || "Consignee saved successfully!");
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data?.error || "Failed to save Consignee");
      } else {
        console.error("Failed to save Consignee:", err);
        alert("Failed to save Consignee, check console for details");
      }
    }
  };

  // ======================== EXPORTER ========================
  // const exporterCodeRef = useRef(null);
  // const [exporter, setExporter] = useState(null);
  // const [exporterSuggestions, setExporterSuggestions] = useState([]);
  // const [filteredExporterSuggestions, setFilteredExporterSuggestions] =
  //   useState([]);
  // const [showExporterDropdown, setShowExporterDropdown] = useState(false);
  // const [exporterHighlightedIndex, setExporterHighlightedIndex] = useState(0);
  // const [exporterError, setExporterError] = useState(false);

  // ======================== FETCH EXPORTER ========================
  // useEffect(() => {
  //   const fetchExporter = async () => {
  //     try {
  //       const response = await API.get("/getCommonExporterTableInfo/");
  //       const list = response.data.map(
  //         (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
  //       );
  //       setExporterSuggestions(list);
  //       setFilteredExporterSuggestions(list);
  //     } catch (err) {
  //       console.error("Failed to fetch exporters", err);
  //     }
  //   };
  //   fetchExporter();
  // }, []);

  // ======================== EXPORTER HANDLERS ========================
  // const handleExporterChange = (e) => {
  //   const val = e.target.value;
  //   setExporterCode(val);
  //   setExporterError(false);
  //   setExporterHighlightedIndex(0);

  //   if (!val) {
  //     setShowExporterDropdown(false);
  //     return;
  //   }

  //   const filtered = exporterSuggestions.filter((i) =>
  //     i.toLowerCase().startsWith(val.toLowerCase()),
  //   );
  //   setFilteredExporterSuggestions(filtered.slice(0, 100));
  //   setShowExporterDropdown(filtered.length > 0);
  // };

  // ======================== EXPORTER KEYDOWN ========================
  // const handleExporterKeyDown = (e) => {
  //   if (!showExporterDropdown || filteredExporterSuggestions.length === 0)
  //     return;

  //   if (e.key === "ArrowDown") {
  //     e.preventDefault();
  //     setExporterHighlightedIndex((prev) =>
  //       prev + 1 >= filteredExporterSuggestions.length ? 0 : prev + 1,
  //     );
  //   } else if (e.key === "ArrowUp") {
  //     e.preventDefault();
  //     setExporterHighlightedIndex((prev) =>
  //       prev - 1 < 0 ? filteredExporterSuggestions.length - 1 : prev - 1,
  //     );
  //   } else if (e.key === "Enter" || e.key === "Tab") {
  //     e.preventDefault();
  //     handleExporterSelect(
  //       filteredExporterSuggestions[exporterHighlightedIndex],
  //     );
  //   }
  // };

  // ======================== EXPORTER SELECT ========================
  // const handleExporterSelect = (item) => {
  //   const [code, cruei, name, name1] = item.split(":");
  //   setExporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
  //   setExporterCode(code);
  //   setExporterCruei(cruei);
  //   setExporterName(name);
  //   setExporterName1(name1);
  //   setShowExporterDropdown(false);
  //   setExporterError(false);
  // };

  // ======================== EXPORTER FOCUSOUT ========================
  // const handleExporterFocusOut = () => {
  //   setTimeout(() => {
  //     if (!exporterCode) {
  //       setExporter(null);
  //       setExporterCruei("");
  //       setExporterName("");
  //       setExporterName1("");
  //       setExporterError(true);
  //       setShowExporterDropdown(false);
  //       return;
  //     }

  //     const selected = exporterSuggestions
  //       .map((i) => i.split(":"))
  //       .find(([code]) => code.toLowerCase() === exporterCode.toLowerCase());

  //     if (selected) {
  //       const [code, cruei, name, name1] = selected;
  //       setExporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
  //       setExporterCode(code);
  //       setExporterCruei(cruei);
  //       setExporterName(name);
  //       setExporterName1(name1);
  //       setExporterError(false);
  //     } else {
  //       setExporter(null);
  //       setExporterError(true);
  //     }
  //     setShowExporterDropdown(false);
  //   }, 150);
  // };

  // ======================== EXPORTER SAVE ========================
  // const saveExporter = async () => {
  //   if (!exporterCode) {
  //     setExporterError(true);
  //     alert("Code is required!");
  //     return;
  //   }

  //   const duplicate = exporterSuggestions.some(
  //     (i) => i.split(":")[0].toLowerCase() === exporterCode.toLowerCase(),
  //   );
  //   if (duplicate) {
  //     alert("Duplicate code found! Exporter not saved.");
  //     return;
  //   }

  //   const payload = {
  //     Id: exporter?.Id || 0,
  //     Code: exporterCode || "",
  //     CRUEI: exporterCruei || "",
  //     Name: exporterName || "",
  //     Name1: exporterName1 || "",
  //     // Address:
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //   };

  //   console.log("Payload to save:", payload);

  //   try {
  //     const response = await API.post("/postExporterTable/", payload);
  //     alert(response.data?.message || "Exporter saved successfully!");
  //     console.log("Saved data:", response.data);
  //   } catch (err) {
  //     if (err.response?.status === 400) {
  //       alert(err.response.data?.error || "Failed to save Exporter");
  //     } else {
  //       console.error("Failed to save Exporter:", err);
  //       alert("Failed to save Exporter, check console for details");
  //     }
  //   }
  // };

  // ======================== OUTWARD CARRIER AGENT ========================
  const outwardCodeRef = useRef(null);
  const [outwardAgent, setOutwardAgent] = useState(null);
  const [outwardSuggestions, setOutwardSuggestions] = useState([]);
  const [filteredOutwardSuggestions, setFilteredOutwardSuggestions] = useState(
    [],
  );
  const [showOutwardDropdown, setShowOutwardDropdown] = useState(false);
  const [outwardHighlightedIndex, setOutwardHighlightedIndex] = useState(0);
  const [outwardError, setOutwardError] = useState(false);

  // ======================== FETCH OUTWARD ========================
  useEffect(() => {
    const fetchOutward = async () => {
      try {
        const response = await API.get(
          "/getCommonOutwardCarrierAgentTableInfo/",
        );
        const list = response.data.map(
          (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
        );
        setOutwardSuggestions(list);
        setFilteredOutwardSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch outward carrier agent", err);
      }
    };
    fetchOutward();
  }, []);

  // ======================== OUTWARD HANDLERS ========================
  const handleOutwardChange = (e) => {
    const val = e.target.value;
    setOutwardCode(val);
    setOutwardError(false);
    setOutwardHighlightedIndex(0);

    if (!val) {
      setShowOutwardDropdown(false);
      return;
    }

    console.log("outwardSuggestions length:", outwardSuggestions.length);
    const filtered = outwardSuggestions.filter((i) => {
      const [Code, Cruei, Name, Name1] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Name.toLowerCase().startsWith(search)
      );
    });
    console.log("filtered:", filtered);
    setFilteredOutwardSuggestions(filtered.slice(0, 100));
    setShowOutwardDropdown(filtered.length > 0);
  };

  // ======================== OUTWARD KEYDOWN ========================
  const handleOutwardKeyDown = (e) => {
    if (!showOutwardDropdown || filteredOutwardSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOutwardHighlightedIndex((prev) =>
        prev + 1 >= filteredOutwardSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOutwardHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredOutwardSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleOutwardSelect(filteredOutwardSuggestions[outwardHighlightedIndex]);
    }
  };

  // ======================== OUTWARD SELECT ========================
  const handleOutwardSelect = (item) => {
    const [code, cruei, name, name1] = item.split(":");
    setOutwardAgent({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
    setOutwardCode(code);
    setOutwardCruei(cruei);
    setOutwardName(name);
    setOutwardName1(name1);
    setShowOutwardDropdown(false);
    setOutwardError(false);
  };

  // ======================== OUTWARD FOCUSOUT ========================
  const handleOutwardFocusOut = () => {
    setTimeout(() => {
      if (!outwardCode) {
        setOutwardAgent(null);
        setOutwardCruei("");
        setOutwardName("");
        setOutwardName1("");
        setOutwardError(true);
        setShowOutwardDropdown(false);
        return;
      }

      const selected = outwardSuggestions
        .map((i) => i.split(":"))
        .find(([code]) => code.toLowerCase() === outwardCode.toLowerCase());

      if (selected) {
        const [code, cruei, name, name1] = selected;
        setOutwardAgent({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
        setOutwardCode(code);
        setOutwardCruei(cruei);
        setOutwardName(name);
        setOutwardName1(name1);
        setOutwardError(false);
      } else {
        setOutwardAgent(null);
        setOutwardError(true);
      }
      setShowOutwardDropdown(false);
    }, 150);
  };

  // ======================== OUTWARD SAVE ========================
  const saveOutward = async () => {
    if (!outwardCode) {
      setOutwardError(true);
      alert("Code is required!");
      return;
    }

    const duplicate = outwardSuggestions.some(
      (i) => i.split(":")[0].toLowerCase() === outwardCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! Outward Carrier Agent not saved.");
      return;
    }

    const payload = {
      Id: outwardAgent?.Id || 0,
      Code: outwardCode || "",
      CRUEI: outwardCruei || "",
      Name: outwardName || "",
      Name1: outwardName1 || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };

    console.log("Payload to save:", payload);

    try {
      const response = await API.post(
        "/postOutwardCarrierAgentTable/",
        payload,
      );
      alert(
        response.data?.message || "Outward Carrier Agent saved successfully!",
      );
      console.log("Saved data:", response.data);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(
          err.response.data?.error || "Failed to save Outward Carrier Agent",
        );
      } else {
        console.error("Failed to save Outward Carrier Agent:", err);
        alert(
          "Failed to save Outward Carrier Agent, check console for details",
        );
      }
    }
  };

  // ======================== END USER ========================
  const endUserCodeRef = useRef(null);
  const [endUser, setEndUser] = useState(null);
  const [endUserSuggestions, setEndUserSuggestions] = useState([]);
  const [filteredEndUserSuggestions, setFilteredEndUserSuggestions] = useState(
    [],
  );
  const [showEndUserDropdown, setShowEndUserDropdown] = useState(false);
  const [endUserError, setEndUserError] = useState(false);
  const [endUserHighlightedIndex, setEndUserHighlightedIndex] = useState(0);

  // ======================== FETCH END USER ========================
  useEffect(() => {
    const fetchEndUser = async () => {
      try {
        const response = await API.get("/getCommonEndUserTableInfo/");
        const list = response.data.map(
          (i) =>
            `${i.EndUserCode}:${i.EndUserCRUEI}:${i.EndUserName}:${i.EndUserName1}:${i.EndUserAddress}:${i.EndUserAddress1}:${i.EndUserCity}:${i.EndUserSub}:${i.EndUserSubDivi}:${i.EndUserPostal}:${i.EndUserCountry}`,
        );
        setEndUserSuggestions(list);
        setFilteredEndUserSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch end user", err);
      }
    };
    fetchEndUser();
  }, []);

  // ======================== END USER HANDLERS ========================
  const handleEndUserChange = (e) => {
    const val = e.target.value;
    setEndUserCode(val);
    setEndUserError(false);
    setEndUserHighlightedIndex(0);
    if (!val) {
      setShowEndUserDropdown(false);
      return;
    }
    const filtered = endUserSuggestions.filter((i) => {
      const [Code, Cruei, Name, Name1] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Name.toLowerCase().startsWith(search)
      );
    });
    setFilteredEndUserSuggestions(filtered.slice(0, 100));
    setShowEndUserDropdown(filtered.length > 0);
  };

  // ======================== END USER KEYDOWN ========================
  const handleEndUserKeyDown = (e) => {
    if (!showEndUserDropdown || filteredEndUserSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setEndUserHighlightedIndex((prev) =>
        prev + 1 >= filteredEndUserSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setEndUserHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredEndUserSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleEndUserSelect(filteredEndUserSuggestions[endUserHighlightedIndex]);
    }
  };

  // ======================== END USER SELECT ========================
  const handleEndUserSelect = (item) => {
    const [
      code,
      cruei,
      name,
      name1,
      addr,
      addr1,
      city,
      sub,
      subDivi,
      postal,
      country,
    ] = item.split(":");
    setEndUser({
      EndUserCode: code,
      EndUserCRUEI: cruei,
      EndUserName: name,
      EndUserName1: name1,
      EndUserAddress: addr,
      EndUserAddress1: addr1,
      EndUserCity: city,
      EndUserSub: sub,
      EndUserSubDivi: subDivi,
      EndUserPostal: postal,
      EndUserCountry: country,
    });
    setEndUserCode(code);
    setEndUserCruei(cruei);
    setEndUserName(name);
    setEndUserName1(name1);
    setEndUserAddress(addr);
    setEndUserAddress1(addr1);
    setEndUserCity(city);
    setEndUserSubCode(sub);
    setEndUserSubDivision(subDivi);
    setEndUserPostal(postal);
    setEndUserCountryCode(country);
    setShowEndUserDropdown(false);
    setEndUserError(false);
  };

  // ======================== END USER FOCUSOUT ========================
  const handleEndUserFocusOut = () => {
    setTimeout(() => {
      if (!endUserCode) {
        setEndUser(null);
        setEndUserCruei("");
        setEndUserName("");
        setEndUserName1("");
        setEndUserAddress("");
        setEndUserAddress1("");
        setEndUserCity("");
        setEndUserSubCode("");
        setEndUserSubDivision("");
        setEndUserPostal("");
        setEndUserCountryCode("");
        setEndUserError(true);
        setShowEndUserDropdown(false);
        return;
      }
      const selected = endUserSuggestions
        .map((i) => i.split(":"))
        .find(([code]) => code.toLowerCase() === endUserCode.toLowerCase());
      if (selected) {
        const [
          code,
          cruei,
          name,
          name1,
          addr,
          addr1,
          city,
          sub,
          subDivi,
          postal,
          country,
        ] = selected;
        setEndUser({
          EndUserCode: code,
          EndUserCRUEI: cruei,
          EndUserName: name,
          EndUserName1: name1,
          EndUserAddress: addr,
          EndUserAddress1: addr1,
          EndUserCity: city,
          EndUserSub: sub,
          EndUserSubDivi: subDivi,
          EndUserPostal: postal,
          EndUserCountry: country,
        });
        setEndUserCode(code);
        setEndUserCruei(cruei);
        setEndUserName(name);
        setEndUserName1(name1);
        setEndUserAddress(addr);
        setEndUserAddress1(addr1);
        setEndUserCity(city);
        setEndUserSubCode(sub);
        setEndUserSubDivision(subDivi);
        setEndUserPostal(postal);
        setEndUserCountryCode(country);
        setEndUserError(false);
      } else {
        setEndUser(null);
        setEndUserError(true);
      }
      setShowEndUserDropdown(false);
    }, 150);
  };

  // ======================== END USER SAVE ========================
  const saveEndUser = async () => {
    if (!endUserCode) {
      setEndUserError(true);
      alert("Code is required!");
      return;
    }
    const duplicate = endUserSuggestions.some(
      (i) => i.split(":")[0].toLowerCase() === endUserCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! End User not saved.");
      return;
    }
    const payload = {
      Id: endUser?.Id || 0,
      EndUserCode: endUserCode || "",
      EndUserCRUEI: endUserCruei || "",
      EndUserName: endUserName || "",
      EndUserName1: endUserName1 || "",
      EndUserAddress: endUserAddress || "",
      EndUserAddress1: endUserAddress1 || "",
      EndUserCity: endUserCity || "",
      EndUserSub: endUserSubCode || "",
      EndUserSubDivi: endUserSubDivision || "",
      EndUserPostal: endUserPostal || "",
      EndUserCountry: endUserCountryCode || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };
    try {
      const response = await API.post("/postEndUserTable/", payload);
      alert(response.data?.message || "End User saved successfully!");
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data?.error || "Failed to save End User");
      } else {
        console.error("Failed to save End User:", err);
        alert("Failed to save End User, check console for details");
      }
    }
  };

  // ====================Copy Consignee Button=========================

  const handleCopyConsignee = () => {
    setEndUser({
      EndUserCode: congineeCode,
      EndUserCRUEI: congineeCruei,
      EndUserName: congineeName,
      EndUserName1: congineeName1,
      EndUserAddress: congineeAddress,
      EndUserAddress1: congineeAddress1,
      EndUserCity: congineeCity,
      EndUserSub: congineeSubCode,
      EndUserSubDivi: congineeSubDivision,
      EndUserPostal: congineePostal,
      EndUserCountry: congineeCountryCode,
    });
    setEndUserCode(congineeCode);
    setEndUserCruei(congineeCruei);
    setEndUserName(congineeName);
    setEndUserName1(congineeName1);
    setEndUserAddress(congineeAddress);
    setEndUserAddress1(congineeAddress1);
    setEndUserCity(congineeCity);
    setEndUserSubCode(congineeSubCode);
    setEndUserSubDivision(congineeSubDivision);
    setEndUserPostal(congineePostal);
    setEndUserCountryCode(congineeCountryCode);
  };

  // ======================== MANUFACTURER ========================
  // const manufacturerCodeRef = useRef(null);
  // const [manufacturer, setManufacturer] = useState(null);
  // const [manufacturerSuggestions, setManufacturerSuggestions] = useState([]);
  // const [filteredManufacturerSuggestions, setFilteredManufacturerSuggestions] =
  //   useState([]);
  // const [showManufacturerDropdown, setShowManufacturerDropdown] =
  //   useState(false);
  // const [manufacturerError, setManufacturerError] = useState(false);
  // const [manufacturerHighlightedIndex, setManufacturerHighlightedIndex] =
  //   useState(0);

  // ======================== FETCH MANUFACTURER ========================
  // useEffect(() => {
  //   const fetchManufacturer = async () => {
  //     try {
  //       const response = await API.get("/getCommonManufacturerTableInfo/");
  //       const list = response.data.map(
  //         (i) =>
  //           `${i.ManufacturerCode}:${i.ManufacturerCRUEI}:${i.ManufacturerName}:${i.ManufacturerName1}:${i.ManufacturerAddress}:${i.ManufacturerAddress1}:${i.ManufacturerCity}:${i.ManufacturerSub}:${i.ManufacturerSubDivi}:${i.ManufacturerPostal}:${i.ManufacturerCountry}`,
  //       );
  //       setManufacturerSuggestions(list);
  //       setFilteredManufacturerSuggestions(list);
  //     } catch (err) {
  //       console.error("Failed to fetch manufacturer", err);
  //     }
  //   };
  //   fetchManufacturer();
  // }, []);

  // ======================== MANUFACTURER CHANGE ========================
  // const handleManufacturerChange = (e) => {
  //   const val = e.target.value;
  //   setManufacturerCode(val);
  //   setManufacturerError(false);
  //   setManufacturerHighlightedIndex(0);
  //   if (!val) {
  //     setShowManufacturerDropdown(false);
  //     return;
  //   }
  //   const filtered = manufacturerSuggestions.filter((i) =>
  //     i.toLowerCase().startsWith(val.toLowerCase()),
  //   );
  //   setFilteredManufacturerSuggestions(filtered.slice(0, 100));
  //   setShowManufacturerDropdown(filtered.length > 0);
  // };

  // ======================== MANUFACTURER KEYDOWN ========================
  // const handleManufacturerKeyDown = (e) => {
  //   if (
  //     !showManufacturerDropdown ||
  //     filteredManufacturerSuggestions.length === 0
  //   )
  //     return;
  //   if (e.key === "ArrowDown") {
  //     e.preventDefault();
  //     setManufacturerHighlightedIndex((prev) =>
  //       prev + 1 >= filteredManufacturerSuggestions.length ? 0 : prev + 1,
  //     );
  //   } else if (e.key === "ArrowUp") {
  //     e.preventDefault();
  //     setManufacturerHighlightedIndex((prev) =>
  //       prev - 1 < 0 ? filteredManufacturerSuggestions.length - 1 : prev - 1,
  //     );
  //   } else if (e.key === "Enter" || e.key === "Tab") {
  //     e.preventDefault();
  //     handleManufacturerSelect(
  //       filteredManufacturerSuggestions[manufacturerHighlightedIndex],
  //     );
  //   }
  // };

  // ======================== MANUFACTURER SELECT ========================
  // const handleManufacturerSelect = (item) => {
  //   const [
  //     code,
  //     cruei,
  //     name,
  //     name1,
  //     addr,
  //     addr1,
  //     city,
  //     sub,
  //     subDivi,
  //     postal,
  //     country,
  //   ] = item.split(":");
  //   setManufacturer({
  //     ManufacturerCode: code,
  //     ManufacturerCRUEI: cruei,
  //     ManufacturerName: name,
  //     ManufacturerName1: name1,
  //     ManufacturerAddress: addr,
  //     ManufacturerAddress1: addr1,
  //     ManufacturerCity: city,
  //     ManufacturerSub: sub,
  //     ManufacturerSubDivi: subDivi,
  //     ManufacturerPostal: postal,
  //     ManufacturerCountry: country,
  //   });
  //   setManufacturerCode(code);
  //   setManufacturerCruei(cruei);
  //   setManufacturerName(name);
  //   setManufacturerName1(name1);
  //   setManufacturerAddress(addr);
  //   setManufacturerAddress1(addr1);
  //   setManufacturerCity(city);
  //   setManufacturerSub(sub);
  //   setManufacturerSubDivi(subDivi);
  //   setManufacturerPostal(postal);
  //   setManufacturerCountry(country);
  //   setShowManufacturerDropdown(false);
  //   setManufacturerError(false);
  // };

  // ======================== MANUFACTURER FOCUSOUT ========================
  // const handleManufacturerFocusOut = () => {
  //   setTimeout(() => {
  //     if (!manufacturerCode) {
  //       setManufacturer(null);
  //       setManufacturerCruei("");
  //       setManufacturerName("");
  //       setManufacturerName1("");
  //       setManufacturerAddress("");
  //       setManufacturerAddress1("");
  //       setManufacturerCity("");
  //       setManufacturerSub("");
  //       setManufacturerSubDivi("");
  //       setManufacturerPostal("");
  //       setManufacturerCountry("");
  //       setManufacturerError(true);
  //       setShowManufacturerDropdown(false);
  //       return;
  //     }
  //     const selected = manufacturerSuggestions
  //       .map((i) => i.split(":"))
  //       .find(
  //         ([code]) => code.toLowerCase() === manufacturerCode.toLowerCase(),
  //       );
  //     if (selected) {
  //       const [
  //         code,
  //         cruei,
  //         name,
  //         name1,
  //         addr,
  //         addr1,
  //         city,
  //         sub,
  //         subDivi,
  //         postal,
  //         country,
  //       ] = selected;
  //       setManufacturer({
  //         ManufacturerCode: code,
  //         ManufacturerCRUEI: cruei,
  //         ManufacturerName: name,
  //         ManufacturerName1: name1,
  //         ManufacturerAddress: addr,
  //         ManufacturerAddress1: addr1,
  //         ManufacturerCity: city,
  //         ManufacturerSub: sub,
  //         ManufacturerSubDivi: subDivi,
  //         ManufacturerPostal: postal,
  //         ManufacturerCountry: country,
  //       });
  //       setManufacturerCode(code);
  //       setManufacturerCruei(cruei);
  //       setManufacturerName(name);
  //       setManufacturerName1(name1);
  //       setManufacturerAddress(addr);
  //       setManufacturerAddress1(addr1);
  //       setManufacturerCity(city);
  //       setManufacturerSub(sub);
  //       setManufacturerSubDivi(subDivi);
  //       setManufacturerPostal(postal);
  //       setManufacturerCountry(country);
  //       setManufacturerError(false);
  //     } else {
  //       setManufacturer(null);
  //       setManufacturerError(true);
  //     }
  //     setShowManufacturerDropdown(false);
  //   }, 150);
  // };

  // ======================== MANUFACTURER SAVE ========================
  // const saveManufacturer = async () => {
  //   if (!manufacturerCode) {
  //     setManufacturerError(true);
  //     alert("Code is required!");
  //     return;
  //   }
  //   const duplicate = manufacturerSuggestions.some(
  //     (i) => i.split(":")[0].toLowerCase() === manufacturerCode.toLowerCase(),
  //   );
  //   if (duplicate) {
  //     alert("Duplicate code found! Manufacturer not saved.");
  //     return;
  //   }
  //   const payload = {
  //     ManufacturerCode: manufacturerCode || "",
  //     ManufacturerCRUEI: manufacturerCruei || "",
  //     ManufacturerName: manufacturerName || "",
  //     ManufacturerName1: manufacturerName1 || "",
  //     ManufacturerAddress: manufacturerAddress || "",
  //     ManufacturerAddress1: manufacturerAddress1 || "",
  //     ManufacturerCity: manufacturerCity || "",
  //     ManufacturerSub: manufacturerSub || "",
  //     ManufacturerSubDivi: manufacturerSubDivi || "",
  //     ManufacturerPostal: manufacturerPostal || "",
  //     ManufacturerCountry: manufacturerCountry || "",
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //   };
  //   try {
  //     const response = await API.post("/postManufacturerTable/", payload);
  //     alert(response.data?.Result || "Manufacturer saved successfully!");
  //   } catch (err) {
  //     if (err.response?.status === 400) {
  //       alert(
  //         err.response.data?.Result ||
  //           err.response.data?.error ||
  //           "Failed to save Manufacturer",
  //       );
  //     } else {
  //       console.error("Failed to save Manufacturer:", err);
  //       alert("Failed to save Manufacturer, check console for details");
  //     }
  //   }
  // };

  // ======================== HANDLING AGENT ========================
  const handlingAgentCodeRef = useRef(null);
  const [handlingAgent, setHandlingAgent] = useState(null);
  const [handlingAgentSuggestions, setHandlingAgentSuggestions] = useState([]);
  const [handlefilteredSuggestions, setHandleFilteredSuggestions] = useState(
    [],
  );
  const [showHandlingAgentDropdown, setShowHandlingAgentDropdown] =
    useState(false);
  const [handlehighlightedIndex, setHandleHighlightedIndex] = useState(0);
  const [handlingAgentError, setHandlingAgentError] = useState(false);

  // current handling agent
  useEffect(() => {
    window.currentPartyHandlingAgent = {
      Code: handlingAgentCode,
      CRUEI: handlingAgentCruei,
      Name: handlingAgentName,
      Name1: handlingAgentName1,
    };
  }, [
    handlingAgentCode,
    handlingAgentCruei,
    handlingAgentName,
    handlingAgentName1,
  ]);
  // ======================== FETCH HANDLING AGENTS ========================
  useEffect(() => {
    const fetchHandlingAgents = async () => {
      try {
        const response = await API.get("/getCommonHandlingAgentTableInfo/");
        const list = response.data.map(
          (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
        );
        setHandlingAgentSuggestions(list);
        setHandleFilteredSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch handling agents", err);
      }
    };
    fetchHandlingAgents();
  }, []);
  // ======================== HANDLING AGENT HANDLERS ========================
  const handleHandlingAgentChange = (e) => {
    const val = e.target.value;
    setHandlingAgentCode(val);
    setHandlingAgentError(false);
    setHandleHighlightedIndex(0);

    if (!val) {
      setShowHandlingAgentDropdown(false);
      return;
    }
    if (!val) {
      setShowHandlingAgentCrueiError(true);
      setShowHandlingAgentNameError(true);
    } else {
      setShowHandlingAgentCrueiError(false);
      setShowHandlingAgentNameError(false);
    }

    const filtered = handlingAgentSuggestions.filter((i) => {
      const [Code, Cruei, Name, Name1] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Name.toLowerCase().startsWith(search)
      );
    });

setHandleFilteredSuggestions(filtered.slice(0, 100));
    setShowHandlingAgentDropdown(filtered.length > 0);
  };
  // ======================== HANDLING AGENT KEYDOWN ========================
const handleHandlingAgentKeyDown = (e) => {
    if (!showHandlingAgentDropdown || handlefilteredSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHandleHighlightedIndex((prev) =>
        prev + 1 >= handlefilteredSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHandleHighlightedIndex((prev) =>
        prev - 1 < 0 ? handlefilteredSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleHandlingAgentSelect(handlefilteredSuggestions[handlehighlightedIndex]);
    }
  };
  // ======================== HANDLING AGENT SELECT ========================
  const handleHandlingAgentSelect = (item) => {
    const [code, cruei, name, name1] = item.split(":");
    setHandlingAgent({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
    setHandlingAgentCode(code);
    setHandlingAgentCruei(cruei);
    setHandlingAgentName(name);
    setHandlingAgentName1(name1);
    setShowHandlingAgentDropdown(false);
    setHandlingAgentError(false);
  };
  // ======================== HANDLING AGENT FOCUSOUT ========================
  const handleHandlingAgentFocusOut = () => {
    setTimeout(() => {
      if (!handlingAgentCode) {
        setHandlingAgent(null);
        setHandlingAgentCruei("");
        setHandlingAgentName("");
        setHandlingAgentName1("");
        setHandlingAgentError(true);
        setShowHandlingAgentDropdown(false);
        return;
      }

      const selected = handlingAgentSuggestions
        .map((i) => i.split(":"))
        .find(
          ([code]) => code.toLowerCase() === handlingAgentCode.toLowerCase(),
        );
      if (selected) {
        const [code, cruei, name, name1] = selected;
        setHandlingAgent({
          Code: code,
          CRUEI: cruei,
          Name: name,
          Name1: name1,
        });
        setHandlingAgentCode(code);
        setHandlingAgentCruei(cruei);
        setHandlingAgentName(name);
        setHandlingAgentName1(name1);
        setHandlingAgentError(false);
      } else {
        setHandlingAgent(null);
        // setHandlingAgentCruei("");
        // setHandlingAgentName("");
        // setHandlingAgentName1("");
        setHandlingAgentError(true);
      }
      setShowHandlingAgentDropdown(false);
    }, 150);
  };
  // // ======================== HANDLING AGENT SAVE FUNCTION ========================
  const saveHandlingAgent = async () => {
    if (!handlingAgentCode) {
      setHandlingAgentError(true);
      alert("Code is required!");
      return;
    }
    const duplicate = handlingAgentSuggestions.some(
      (i) => i.split(":")[0].toLowerCase() === handlingAgentCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! Handling agent not saved.");
      return;
    }

    const payload = {
      Id: handlingAgent?.Id || 0,
      Code: handlingAgentCode || "",
      CRUEI: handlingAgentCruei || "",
      Name: handlingAgentName || "",
      Name1: handlingAgentName1 || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };

    console.log("Payload to save:", payload);

    try {
      const response = await API.post("/postHandlingAgentTable/", payload);
      alert(response.data?.message || "Handling agent saved successfully!");
      console.log("Saved data:", response.data);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data?.error || "Failed to save importer");
      } else {
        console.error("Failed to save importer:", err);
        alert("Failed to save importer, check console for details");
      }
    }
  };

  //---------------------------- Popup-----------------------------------
  const [popupType, setPopupType] = useState(null);
  const [popupData, setPopupData] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentPopupConfig = currentPopup(popupType, {
    setImporter,
    setImporterCode,
    setImporterCruei,
    setImporterName,
    setImporterName1,
    // setExporter,
    // setExporterCode,
    // setExporterCruei,
    // setExporterName,
    // setExporterName1,
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

    // setManufacturer,
    // setManufacturerCode,
    // setManufacturerCruei,
    // setManufacturerName,
    // setManufacturerName1,
    // setManufacturerAddress,
    // setManufacturerAddress1,
    // setManufacturerCity,
    // setManufacturerSub,
    // setManufacturerSubDivi,
    // setManufacturerPostal,
    // setManufacturerCountry,

    setHandlingAgent,
    setHandlingAgentCode,
    setHandlingAgentCruei,
    setHandlingAgentName,
    setHandlingAgentName1,
  });
  //----------------------------Handle On Click-----------
  const handleIconClick = async (type) => {
    setPopupType(type);
    await fetchPopupData(type, setPopupData, setLoading);
  };
  //----------------------------Reset----------------------
  const resetParty = () => {
    // Importer fields
    setImporterCode("");
    setImporterCruei("");
    setImporterName("");
    setImporterName1("");
    setImporter(null);
    // Inward Carrier Agent fields
    setInwardCode("");
    setInwardCruei("");
    setInwardName("");
    setInwardName1("");
    setInwardAgent(null);
    // Freight Forwarder fields
    setFreightForwarderCode("");
    setFreightForwarderCruei("");
    setFreightForwarderName("");
    setFreightForwarderName1("");
    setFreightForwarder(null);
    // Claimant Party fields
    setClaimantCode("");
    setClaimantCruei("");
    setClaimantName("");
    setClaimantName1("");
    setclaimantcmantName("");
    setclaimantcmantName1("");
    setClaimant(null);
    // Optional: reset dropdown states
    setShowImporterDropdown(false);
    setShowInwardDropdown(false);
    setShowFreightForwarderDropdown(false);
    setShowClaimantDropdown(false);
  };

  // =======================SAVE AS DRAFT MODEL===========================
  // ===================== STATES =====================
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftReason, setDraftReason] = useState("");
  const [draftReasonError, setDraftReasonError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      const payload = {
        PermitId: permitDetails?.PermitId || "",
        Refid: permitDetails?.RefId || "",
        JobId: permitDetails?.JobId || "",
        MSGId: permitDetails?.MsgId || "",
        TradeNetMailboxID:
          permitDetails?.TradeNetMailboxID || permitDetails?.MailBoxId || "",
        MessageType: "TNPDEC",

        DeclarationType: decType,
        PreviousPermit: prevPermitNo,
        CargoPackType: cargo,
        InwardTransportMode: transportMode,
        BGIndicator: bgInd,
        SupplyIndicator: supplyInd ? "true" : "false",
        ReferenceDocuments: refDocs ? "true" : "false",
        DeclarningFor: declFor,
        License: Licence || "",
        Recipient: Recipients || "",
        DeclarantCompanyCode: permitDetails?.DeclarantCode || "",
        // party fields
        ImporterCompanyCode: importerCode || "",
        InwardCarrierAgentCode: inwardCode || "",
        FreightForwarderCode: freightForwarderCode || "",
        ClaimantPartyCode: claimantCode || "",

        // Transport fields
        VoyageNumber: showVoyageNumber ? voyageNumber || "" : "",
        VesselName: showVesselName ? vesselName || "" : "",
        OceanBillofLadingNo: showOblNumber ? obl || "" : "",
        ConveyanceRefNo: showconveyanceNumber ? conveyanceNumber || "" : "",
        TransportId: showTransportDetails ? transportDetails || "" : "",
        FlightNO: showFlightNumber ? flightNumber || "" : "",
        AircraftRegNo: showAirCraftRegNumber ? airCraftRegNumber || "" : "",
        MasterAirwayBill: showMawbNumber ? mawbNumber || "" : "",
        //
        Message: draftReason.trim().toUpperCase(),
        Status: "SAVEASDRF",
        prmtStatus: "SAVEASDRF",
        TouchUser,
        TouchTime,
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

  // =====================Auto save every filling Details===================
  // const autoSavePayload = useMemo(() => {
  //   if (!permitDetails?.PermitId) return null;
  //   return {
  //     PermitId: (permitDetails?.PermitId || "").toUpperCase(),
  //     Refid: permitDetails?.RefId || "",
  //     JobId: permitDetails?.JobId || "",
  //     MSGId: permitDetails?.MsgId || "",
  //     TradeNetMailboxID:
  //       permitDetails?.TradeNetMailboxID || permitDetails?.MailBoxId || "",
  //     MessageType: "TNPDEC",
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
  //     // transport fields
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
  //     Message: "AUTO-SAVED|TAB:PartyPage",
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
  //   user,
  // ]);

  // useDebounceAutoSave({
  //   payload: autoSavePayload,
  //   enabled: !isViewMode,
  //   delay: 2000,
  // });

  // =======================End User Click==============
  const handleEndUserCheckFunction = (e) => {
    const checked = e.target.checked;
    setEndUserCheck(checked);
    setShowPartyEndUser(checked);
  };
  // ------------------------------UI---------------------
  return (
    <div className="row g-2">
      <div className="col-12">
        {/* DECLARANT COMPANY */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">DECLARANT COMPANY</label>
          <div className="col-sm-1"></div>
          <div className="col-sm-2">
            <input
              className="form-control"
              value={permitDetails?.Code || ""}
              readOnly
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              value={permitDetails?.CRUEI || ""}
              readOnly
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={permitDetails?.name || ""}
              readOnly
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              placeholder="Name1"
              value={permitDetails?.name1 || ""}
              readOnly
            />
          </div>
        </div>

        {/* IMPORTER */}
        {showPartyImporter && (
          <div className="row align-items-center compact-row mt-3">
            <label className="col-sm-2 col-form-label">IMPORTER</label>
            <div className="col-sm-1">
              <FaSearch
                className="me-3"
                style={{ cursor: "pointer" }}
                onClick={() => handleIconClick("importer")}
              />
              <FaPlus style={{ cursor: "pointer" }} onClick={saveImporter} />
            </div>
            <div className="col-sm-2 position-relative">
              <input
                ref={importerCodeRef}
                id="importerCode"
                className="form-control-mandatory"
                placeholder="CODE"
                // value={importer?.Code || importerCode || ""}
                value={importerCode}
                onChange={handleImporterChange}
                onKeyDown={handleImporterKeyDown}
                onBlur={handleFocusOut}
                onFocus={() => setImporterError(false)}
              />
              {showImporterDropdown && filteredSuggestions.length > 0 && (
                <div className="dropdown-suggestions">
                  {filteredSuggestions.map((item, index) => {
                    const [code, , name] = item.split(":");
                    return (
                      <div
                        key={code}
                        className="dropdown-item"
                        style={{
                          backgroundColor:
                            index === highlightedIndex ? "#234263" : "white",
                          color: index === highlightedIndex ? "white" : "black",
                          cursor: "pointer",
                        }}
                        onMouseDown={() => handleImporterSelect(item)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {code} - {name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="col-sm-2">
              <input
                id="importerCruei"
                className="form-control-mandatory"
                placeholder="CRUEI"
                value={importer?.CRUEI || importerCruei || ""}
                onChange={(e) => setImporterCruei(e.target.value)}
              />
              {showImporterCrueiError && (
                <span className="ErrorColor">CRUEI is required</span>
              )}
            </div>

            <div className="col-sm-3">
              <input
                id="importerName"
                className="form-control-mandatory"
                placeholder="NAME"
                value={importer?.Name || importerName || ""}
                onChange={(e) => setImporterName(e.target.value)}
              />
              {showImporterNameError && (
                <span className="ErrorColor">Name is required</span>
              )}
            </div>
            <div className="col-sm-2">
              <input
                id="importerName1"
                className="form-control-mandatory"
                placeholder="NAME1"
                value={importer?.Name1 || importerName1 || ""}
                onChange={(e) => setImporterName1(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* HANDLING AGENT */}
        {showHandlingAgent && (
          <div className="row align-items-center compact-row">
            <div className="col-sm-2 col-form-label">HANDLING AGENT</div>
            <div className="col-sm-1">
              <FaSearch
                className="me-3"
                style={{ cursor: "pointer" }}
                onClick={() => handleIconClick("handlingAgent")}
              />
              <FaPlus
                style={{ cursor: "pointer" }}
                onClick={saveHandlingAgent}
              />
            </div>

            {/* CODE */}
            <div className="col-sm-2 position-relative">
              <input
                ref={handlingAgentCodeRef}
                id="handlingAgentCode"
                className="inputStyle"
                placeholder="CODE"
                value={handlingAgentCode}
                onChange={handleHandlingAgentChange}
                onKeyDown={handleHandlingAgentKeyDown}
                onBlur={handleHandlingAgentFocusOut}
                onFocus={() => setHandlingAgentError(false)}
              />
              {showHandlingAgentDropdown &&
                filteredHandlingAgentSuggestions.length > 0 && (
                  <div className="dropdown-suggestions">
                    {filteredHandlingAgentSuggestions.map((item, index) => {
                      const [code, , name] = item.split(":");
                      return (
                        <div
                          key={code}
                          className="dropdown-item"
                          style={{
                            backgroundColor:
                              index === handlingAgentHighlightedIndex
                                ? "#234263"
                                : "white",
                            color:
                              index === handlingAgentHighlightedIndex
                                ? "white"
                                : "black",
                            cursor: "pointer",
                          }}
                          onMouseDown={() => handleHandlingAgentSelect(item)}
                          onMouseEnter={() =>
                            setHandlingAgentHighlightedIndex(index)
                          }
                        >
                          {code} - {name}
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>

            {/* CRUEI */}
            <div className="col-2">
              <input
                id="handlingAgentCruei"
                className="inputStyle HighLight"
                placeholder="CRUEI"
                value={handlingAgent?.CRUEI || handlingAgentCruei || ""}
                onChange={(e) => setHandlingAgentCruei(e.target.value)}
              />
              <br />
            </div>

            {/* NAME */}
            <div className="col-3">
              <input
                id="handlingAgentName"
                className="inputStyle HighLight"
                placeholder="NAME"
                value={handlingAgent?.Name || handlingAgentName || ""}
                onChange={(e) => setHandlingAgentName(e.target.value)}
              />
              <br />
            </div>

            {/* NAME1 */}
            <div className="col-2">
              <input
                id="handlingAgentName1"
                className="inputStyle"
                placeholder="NAME1"
                value={handlingAgent?.Name1 || handlingAgentName1 || ""}
                onChange={(e) => setHandlingAgentName1(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* INWARD CARRIER AGENT */}
        {showInwardCarrier && (
          <div className="row align-items-center compact-row">
            <label className="col-sm-2 col-form-label">
              INWARD CARRIER AGENT
            </label>
            <div className="col-sm-1">
              <FaSearch
                className="me-3"
                style={{ cursor: "pointer" }}
                onClick={() => handleIconClick("inward")}
              />
              <FaPlus style={{ cursor: "pointer" }} onClick={saveInward} />
            </div>
            <div className="col-sm-2 position-relative">
              <input
                ref={inwardCodeRef}
                id="inwardCode"
                className="form-control"
                placeholder="CODE"
                // value={inwardAgent?.Code || inwardCode || ""}
                value={inwardCode}
                onChange={handleInwardChange}
                onKeyDown={handleInwardKeyDown}
                onBlur={handleInwardFocusOut}
                onFocus={() => setInwardError(false)}
              />
              {showInwardDropdown && filteredInwardSuggestions.length > 0 && (
                <div className="dropdown-suggestions">
                  {filteredInwardSuggestions.map((item, index) => {
                    const [code, , name] = item.split(":");
                    return (
                      <div
                        key={code}
                        className="dropdown-item"
                        style={{
                          backgroundColor:
                            index === inwardHighlightedIndex
                              ? "#234263"
                              : "white",
                          color:
                            index === inwardHighlightedIndex
                              ? "white"
                              : "black",
                          cursor: "pointer",
                        }}
                        onMouseDown={() => handleInwardSelect(item)}
                        onMouseEnter={() => setInwardHighlightedIndex(index)}
                      >
                        {code} - {name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="col-sm-2">
              <input
                id="inwardCruei"
                className={
                  isSea || isAir ? "form-control-mandatory" : "form-control"
                }
                placeholder="CRUEI"
                value={inwardAgent?.CRUEI || inwardCruei || ""}
                onChange={(e) => {
                  setInwardCruei(e.target.value);
                }}
              />
              {showInwardCrueiError && (
                <span className="ErrorColor">CRUEI is required</span>
              )}
            </div>
            <div className="col-sm-3">
              <input
                id="inwardName"
                className={
                  isSea || isAir ? "form-control-mandatory" : "form-control"
                }
                placeholder="NAME"
                value={inwardAgent?.Name || inwardName || ""}
                onChange={(e) => setInwardName(e.target.value)}
              />
            </div>
            <div className="col-sm-2">
              <input
                id="inwardName1"
                className="form-control"
                placeholder="NAME1"
                value={inwardAgent?.Name1 || inwardName1 || ""}
                onChange={(e) => setInwardName1(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* OUTWARD CARRIER AGENT */}
        {showOutwardCarrier && (
          <div className="row align-items-center compact-row">
            <label className="col-sm-2 col-form-label">
              OUTWARD CARRIER AGENT
            </label>
            <div className="col-sm-1">
              <FaSearch
                className="me-3"
                style={{ cursor: "pointer" }}
                onClick={() => handleIconClick("outward")}
              />
              <FaPlus style={{ cursor: "pointer" }} onClick={saveOutward} />
            </div>

            {/* CODE */}
            <div className="col-sm-2 position-relative">
              <input
                ref={outwardCodeRef}
                id="outwardCode"
                className="form-control"
                placeholder="CODE"
                value={outwardCode}
                onChange={handleOutwardChange}
                onKeyDown={handleOutwardKeyDown}
                onBlur={handleOutwardFocusOut}
                onFocus={() => setOutwardError(false)}
              />
              {showOutwardDropdown && filteredOutwardSuggestions.length > 0 && (
                <div className="dropdown-suggestions">
                  {filteredOutwardSuggestions.map((item, index) => {
                    const [code, , name] = item.split(":");
                    return (
                      <div
                        key={code}
                        className="dropdown-item"
                        style={{
                          backgroundColor:
                            index === outwardHighlightedIndex
                              ? "#234263"
                              : "white",
                          color:
                            index === outwardHighlightedIndex
                              ? "white"
                              : "black",
                          cursor: "pointer",
                        }}
                        onMouseDown={() => handleOutwardSelect(item)}
                        onMouseEnter={() => setOutwardHighlightedIndex(index)}
                      >
                        {code} - {name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CRUEI */}
            <div className="col-sm-2">
              <input
                id="outwardCruei"
                className="form-control"
                placeholder="CRUEI"
                value={outwardAgent?.CRUEI || outwardCruei || ""}
                onChange={(e) => setOutwardCruei(e.target.value)}
              />
            </div>

            {/* NAME */}
            <div className="col-sm-3">
              <input
                id="outwardName"
                className="form-control"
                placeholder="NAME"
                value={outwardAgent?.Name || outwardName || ""}
                onChange={(e) => setOutwardName(e.target.value)}
              />
            </div>

            {/* NAME1 */}
            <div className="col-sm-2">
              <input
                id="outwardName1"
                className="form-control"
                placeholder="NAME1"
                value={outwardAgent?.Name1 || outwardName1 || ""}
                onChange={(e) => setOutwardName1(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* FREIGHT FORWARDER  */}
        <div className="row align-items-center compact-row mt-3">
          <label className="col-sm-2 col-form-label">FREIGHT FORWARDER</label>
          <div className="col-sm-1">
            <FaSearch
              className="me-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleIconClick("freightForwarder")}
            />
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={saveFreightForwarder}
            />
          </div>
          <div className="col-sm-2 position-relative">
            <input
              ref={freightForwarderCodeRef}
              id="freightForwarderCode"
              className="form-control"
              placeholder="CODE"
              value={freightForwarderCode}
              onChange={handleFreightForwarderChange}
              onKeyDown={handleFreightForwarderKeyDown}
              onBlur={handleFreightForwarderFocusOut}
              onFocus={() => setFreightForwarderError(false)}
            />
            {showFreightForwarderDropdown &&
              filteredFreightForwarderSuggestions.length > 0 && (
                <div className="dropdown-suggestions">
                  {filteredFreightForwarderSuggestions.map((item, index) => {
                    const [code, , name] = item.split(":");
                    return (
                      <div
                        key={code}
                        className="dropdown-item"
                        style={{
                          backgroundColor:
                            index === freightForwarderHighlightedIndex
                              ? "#234263"
                              : "white",
                          color:
                            index === freightForwarderHighlightedIndex
                              ? "white"
                              : "black",
                          cursor: "pointer",
                        }}
                        onMouseDown={() => handleFreightForwarderSelect(item)}
                        onMouseEnter={() =>
                          setFreightForwarderHighlightedIndex(index)
                        }
                      >
                        {code} - {name}
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
          <div className="col-sm-2">
            <input
              id="freightForwarderCrei"
              className="form-control"
              placeholder="CRUEI"
              value={freightForwarder?.CRUEI || freightForwarderCruei || ""}
              onChange={(e) => setFreightForwarderCruei(e.target.value)}
            />
          </div>
          <div className="col-sm-3">
            <input
              id="freightForwarderName"
              className="form-control"
              placeholder="NAME"
              value={freightForwarder?.Name || freightForwardName || ""}
              onChange={(e) => setFreightForwarderName(e.target.value)}
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              id="freightForwarderName1"
              placeholder="NAME1"
              value={freightForwarder?.Name1 || freightForwardName1 || ""}
              onChange={(e) => setFreightForwarderName1(e.target.value)}
            />
          </div>
        </div>

        {/* CONGINEE */}
        {showCongineeShow && (
          <div>
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label">CONSIGNEE</label>

              <div className="col-sm-1">
                <FaSearch
                  className="me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleIconClick("consignee")}
                />
                <FaPlus style={{ cursor: "pointer" }} onClick={saveConsignee} />
              </div>

              {/* CONGINEE CODE INPUT WITH DROPDOWN */}
              <div className="col-sm-2 position-relative">
                <input
                  ref={congineeCodeRef}
                  id="congineeCode"
                  className="form-control"
                  placeholder="CODE"
                  value={congineeCode}
                  onChange={handleCongineeChange}
                  onKeyDown={handleCongineeKeyDown}
                  onBlur={handleCongineeFocusOut}
                  onFocus={() => setCongineeError(false)}
                />

                {showCongineeDropdown &&
                  filteredCongineeSuggestions.length > 0 && (
                    <div className="dropdown-suggestions">
                      {filteredCongineeSuggestions.map((item, index) => {
                        const [code, , name] = item.split(":");
                        return (
                          <div
                            key={code}
                            className="dropdown-item"
                            style={{
                              backgroundColor:
                                index === congineeHighlightedIndex
                                  ? "#234263"
                                  : "white",
                              color:
                                index === congineeHighlightedIndex
                                  ? "white"
                                  : "black",
                              cursor: "pointer",
                            }}
                            onMouseDown={() => handleCongineeSelect(item)}
                            onMouseEnter={() =>
                              setCongineeHighlightedIndex(index)
                            }
                          >
                            {code} - {name}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>

              {/* CRUEI */}
              <div className="col-sm-2">
                <input
                  id="congineeCruei"
                  className="form-control"
                  placeholder="CRUEI"
                  value={consignee?.ConsigneeCRUEI || congineeCruei || ""}
                  onChange={(e) => setCongineeCruei(e.target.value)}
                />
              </div>

              {/* NAME */}
              <div className="col-sm-3">
                <input
                  id="congineeName"
                  className="form-control"
                  placeholder="NAME"
                  value={consignee?.ConsigneeName || congineeName || ""}
                  onChange={(e) => setCongineeName(e.target.value)}
                />
              </div>

              {/* NAME1 */}
              <div className="col-sm-2">
                <input
                  id="congineeName1"
                  className="form-control"
                  placeholder="NAME1"
                  value={consignee?.ConsigneeName1 || congineeName1 || ""}
                  onChange={(e) => setCongineeName1(e.target.value)}
                />
              </div>
            </div>

            {/* CONGINEE ROW */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1 icon-contaniner"></div>

              <div className="col-sm-2"></div>

              <div className="col-sm-2">
                <input
                  id="congineeAddress"
                  className="form-control"
                  placeholder="ADDRESS"
                  value={consignee?.ConsigneeAddress || congineeAddress || ""}
                  onChange={(e) => setCongineeAddress(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="congineeAddress1"
                  className="form-control"
                  placeholder="ADDRESS1"
                  value={consignee?.ConsigneeAddress1 || congineeAddress1 || ""}
                  onChange={(e) => setCongineeAddress1(e.target.value)}
                />
              </div>
              <div className="col-sm-2">
                <input
                  id="congineeCity"
                  className="form-control"
                  placeholder="CITY"
                  value={consignee?.ConsigneeCity || congineeCity || ""}
                  onChange={(e) => setCongineeCity(e.target.value)}
                />
              </div>
            </div>
            {/* CONGINEE ROW  */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1"></div>
              <div className="col-sm-2"></div>

              <div className="col-sm-2">
                <input
                  id="congineeSubCode"
                  className="form-control"
                  placeholder="SUB CODE"
                  value={consignee?.ConsigneeSub || congineeSubCode || ""}
                  onChange={(e) => setCongineeSubCode(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="congineeSubDivision"
                  className="form-control"
                  placeholder="SUB DIVISION"
                  value={
                    consignee?.ConsigneeSubDivi || congineeSubDivision || ""
                  }
                  onChange={(e) => setCongineeSubDivision(e.target.value)}
                />
              </div>
              <div className="col-sm-2">
                <input
                  id="congineePostal"
                  className="form-control"
                  placeholder="COUNTRY"
                  value={consignee?.ConsigneePostal || congineePostal || ""}
                  onChange={(e) => setCongineePostel(e.target.value)}
                />
              </div>
            </div>
            {/* CONGINEE ROW  */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1"></div>
              <div className="col-sm-2"></div>

              <div className="col-sm-2">
                <input
                  id="congineeCountryCode"
                  className="form-control"
                  placeholder="POSTAL"
                  value={
                    consignee?.ConsigneeCountry || congineeCountryCode || ""
                  }
                  onChange={(e) => setCongineeCountryCode(e.target.value)}
                />
              </div>
              <div className="col-sm-3"></div>
              <div className="col-sm-3"></div>
            </div>
          </div>
        )}

        {/* END USER */}

        <div>
          <div className="row align-items-center compact-row">
            <label
              className="col-sm-2 col-form-label"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <input
                type="checkbox"
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                  margin: 0,
                }}
                checked={endUserCheck}
                onChange={handleEndUserCheckFunction}
              />
              ENDUSER
            </label>

            <div className="col-sm-1"></div>

            {/* CONGINEE CODE INPUT WITH DROPDOWN */}
            <div className="col-sm-1 position-relative"></div>

            {/* CRUEI */}
            <div className="col-sm-2"></div>

            {/* NAME */}
            <div className="col-sm-3"></div>

            {/* NAME1 */}
            <div className="col-sm-3"></div>
          </div>
        </div>

        {showPartyEndUser && (
          <div>
            <div className="row align-items-center compact-row">
              <label
                className="col-sm-2 col-form-label"
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <button
                  className="NextpageBtns view-nav-btn"
                  onClick={handleCopyConsignee}
                >
                  COPY OF CONSIGNE
                </button>
              </label>

              <div className="col-sm-1">
                <FaSearch
                  className="me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleIconClick("endUser")}
                />
                <FaPlus style={{ cursor: "pointer" }} onClick={saveEndUser} />
              </div>

              {/* CONGINEE CODE INPUT WITH DROPDOWN */}
              <div className="col-sm-2 position-relative">
                <input
                  ref={endUserCodeRef}
                  id="endUserCode"
                  className="form-control"
                  placeholder="CODE"
                  value={endUserCode}
                  onChange={handleEndUserChange}
                  onKeyDown={handleEndUserKeyDown}
                  onBlur={handleEndUserFocusOut}
                  onFocus={() => setEndUserError(false)}
                />

                {showEndUserDropdown &&
                  filteredEndUserSuggestions.length > 0 && (
                    <div className="dropdown-suggestions">
                      {filteredEndUserSuggestions.map((item, index) => {
                        const [code, , name] = item.split(":");
                        return (
                          <div
                            key={code}
                            className="dropdown-item"
                            style={{
                              backgroundColor:
                                index === endUserHighlightedIndex
                                  ? "#234263"
                                  : "white",
                              color:
                                index === endUserHighlightedIndex
                                  ? "white"
                                  : "black",
                              cursor: "pointer",
                            }}
                            onMouseDown={() => handleEndUserSelect(item)}
                            onMouseEnter={() =>
                              setEndUserHighlightedIndex(index)
                            }
                          >
                            {code} - {name}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>

              {/* CRUEI */}
              <div className="col-sm-2">
                <input
                  id="endUserCruei"
                  className="form-control"
                  placeholder="CRUEI"
                  value={endUser?.EndUserCRUEI || endUserCruei || ""}
                  onChange={(e) => setEndUserCruei(e.target.value)}
                />
              </div>

              {/* NAME */}
              <div className="col-sm-3">
                <input
                  id="endUserName"
                  className="form-control"
                  placeholder="NAME"
                  value={endUser?.EndUserName || endUserName || ""}
                  onChange={(e) => setEndUserName(e.target.value)}
                />
              </div>

              {/* NAME1 */}
              <div className="col-sm-2">
                <input
                  id="endUserName1"
                  className="form-control"
                  placeholder="NAME1"
                  value={endUser?.EndUserName1 || endUserName1 || ""}
                  onChange={(e) => setEndUserName1(e.target.value)}
                />
              </div>
            </div>

            {/* ENDUSER ROW */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1 icon-contaniner"></div>
              <div className="col-sm-2"></div>

              <div className="col-sm-2">
                <input
                  id="endUserAddress"
                  className="form-control"
                  placeholder="ADDRESS"
                  value={endUser?.EndUserAddress || endUserAddress || ""}
                  onChange={(e) => setEndUserAddress(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="endUserAddress1"
                  className="form-control"
                  placeholder="ADDRESS1"
                  value={endUser?.EndUserAddress1 || endUserAddress1 || ""}
                  onChange={(e) => setEndUserAddress1(e.target.value)}
                />
              </div>
              <div className="col-sm-2">
                <input
                  id="endUserCity"
                  className="form-control"
                  placeholder="CITY"
                  value={endUser?.EndUserCity || endUserCity || ""}
                  onChange={(e) => setEndUserCity(e.target.value)}
                />
              </div>
            </div>

            {/* ENDUSER ROW */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1"></div>
              <div className="col-sm-2"></div>

              <div className="col-sm-2">
                <input
                  id="endUserSubCode"
                  className="form-control"
                  placeholder="SUB CODE"
                  value={endUser?.EndUserSub || endUserSubCode || ""}
                  onChange={(e) => setEndUserSubCode(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="endUserSubDivision"
                  className="form-control"
                  placeholder="SUB DIVISION"
                  value={endUser?.EndUserSubDivi || endUserSubDivision || ""}
                  onChange={(e) => setEndUserSubDivision(e.target.value)}
                />
              </div>
              <div className="col-sm-2">
                <input
                  id="endUserPostal"
                  className="form-control"
                  placeholder="COUNTRY"
                  value={endUser?.EndUserPostal || endUserPostal || ""}
                  onChange={(e) => setEndUserPostal(e.target.value)}
                />
              </div>
            </div>

            {/* ENDUSER ROW */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1"></div>
              <div className="col-sm-2"></div>

              <div className="col-sm-2">
                <input
                  id="endUserCountryCode"
                  className="form-control"
                  placeholder="POSTAL"
                  value={endUser?.EndUserCountry || endUserCountryCode || ""}
                  onChange={(e) => setEndUserCountryCode(e.target.value)}
                />
              </div>
              <div className="col-sm-3"></div>
              <div className="col-sm-3"></div>
            </div>
          </div>
        )}

        {/* MANUFACTURER */}
        {/* {showCertificateOfOrigin && (
          <div>
  
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label">MANUFACTURER</label>
              <div className="col-sm-1">
                <FaSearch
                  className="me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleIconClick("manufacturer")}
                />
                <FaPlus
                  style={{ cursor: "pointer" }}
                  onClick={saveManufacturer}
                />
              </div>
              <div className="col-sm-1 position-relative">
                <input
                  ref={manufacturerCodeRef}
                  id="manufacturerCode"
                  className="form-control"
                  placeholder="CODE"
                  value={manufacturerCode}
                  onChange={handleManufacturerChange}
                  onKeyDown={handleManufacturerKeyDown}
                  onBlur={handleManufacturerFocusOut}
                  onFocus={() => setManufacturerError(false)}
                />
                {showManufacturerDropdown &&
                  filteredManufacturerSuggestions.length > 0 && (
                    <div className="dropdown-suggestions">
                      {filteredManufacturerSuggestions.map((item, index) => {
                        const [code, , name] = item.split(":");
                        return (
                          <div
                            key={code}
                            className="dropdown-item"
                            style={{
                              backgroundColor:
                                index === manufacturerHighlightedIndex
                                  ? "#234263"
                                  : "white",
                              color:
                                index === manufacturerHighlightedIndex
                                  ? "white"
                                  : "black",
                              cursor: "pointer",
                            }}
                            onMouseDown={() => handleManufacturerSelect(item)}
                            onMouseEnter={() =>
                              setManufacturerHighlightedIndex(index)
                            }
                          >
                            {code} - {name}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
              <div className="col-sm-2">
                <input
                  id="manufacturerCruei"
                  className="form-control"
                  placeholder="CRUEI"
                  value={
                    manufacturer?.ManufacturerCRUEI || manufacturerCruei || ""
                  }
                  onChange={(e) => setManufacturerCruei(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="manufacturerName"
                  className="form-control"
                  placeholder="NAME"
                  value={
                    manufacturer?.ManufacturerName || manufacturerName || ""
                  }
                  onChange={(e) => setManufacturerName(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="manufacturerName1"
                  className="form-control"
                  placeholder="NAME1"
                  value={
                    manufacturer?.ManufacturerName1 || manufacturerName1 || ""
                  }
                  onChange={(e) => setManufacturerName1(e.target.value)}
                />
              </div>
            </div>

     
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1 icon-contaniner"></div>
              <div className="col-sm-1"></div>
              <div className="col-sm-2">
                <input
                  id="manufacturerAddress"
                  className="form-control"
                  placeholder="ADDRESS"
                  value={
                    manufacturer?.ManufacturerAddress ||
                    manufacturerAddress ||
                    ""
                  }
                  onChange={(e) => setManufacturerAddress(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="manufacturerAddress1"
                  className="form-control"
                  placeholder="ADDRESS1"
                  value={
                    manufacturer?.ManufacturerAddress1 ||
                    manufacturerAddress1 ||
                    ""
                  }
                  onChange={(e) => setManufacturerAddress1(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="manufacturerCity"
                  className="form-control"
                  placeholder="CITY"
                  value={
                    manufacturer?.ManufacturerCity || manufacturerCity || ""
                  }
                  onChange={(e) => setManufacturerCity(e.target.value)}
                />
              </div>
            </div>

      
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1"></div>
              <div className="col-sm-1"></div>
              <div className="col-sm-2">
                <input
                  id="manufacturerSub"
                  className="form-control"
                  placeholder="SUB CODE"
                  value={manufacturer?.ManufacturerSub || manufacturerSub || ""}
                  onChange={(e) => setManufacturerSub(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="manufacturerSubDivi"
                  className="form-control"
                  placeholder="SUB DIVISION"
                  value={
                    manufacturer?.ManufacturerSubDivi ||
                    manufacturerSubDivi ||
                    ""
                  }
                  onChange={(e) => setManufacturerSubDivi(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="manufacturerPostal"
                  className="form-control"
                  placeholder="COUNTRY"
                  value={
                    manufacturer?.ManufacturerPostal || manufacturerPostal || ""
                  }
                  onChange={(e) => setManufacturerPostal(e.target.value)}
                />
              </div>
            </div>

                  <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1"></div>
              <div className="col-sm-1"></div>
              <div className="col-sm-2">
                <input
                  id="manufacturerCountry"
                  className="form-control"
                  placeholder="POSTAL"
                  value={
                    manufacturer?.ManufacturerCountry ||
                    manufacturerCountry ||
                    ""
                  }
                  onChange={(e) => setManufacturerCountry(e.target.value)}
                />
              </div>
              <div className="col-sm-3"></div>
              <div className="col-sm-3"></div>
            </div>
          </div>
        )} */}

        {/* Navigation Buttons */}
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
            onClick={() => setActiveTab("HeaderTab")}
          >
            PREVIOUS
          </button>
          {showResetButton && (
            <button className="NextpageBtns" onClick={resetParty}>
              RESET
            </button>
          )}
          <button
            className="NextpageBtns view-nav-btn"
            onClick={() => setActiveTab("CargoTab")}
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

      {/* Popup */}
      {popupType && currentPopupConfig && (
        <SearchPopup
          title={currentPopupConfig.title}
          data={popupData}
          columns={currentPopupConfig.columns}
          onClose={() => setPopupType(null)}
          onSelect={(item) => {
            currentPopupConfig.onSelect(item);
            setPopupType(null);
          }}
        />
      )}
    </div>
  );
}

export default Party;
