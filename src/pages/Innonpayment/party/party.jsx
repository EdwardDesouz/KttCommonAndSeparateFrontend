import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { fetchPopupData, SearchPopup, currentPopup } from "./partyFunctions";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../userContex/userContex";
import { useInnonpayment } from "../context/innonpaymentContext";
import { useDebounceAutoSave } from "../../../autoSave/useDebounceAutoSave";

function Party({ setActiveTab, isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  // Get global states and setters from context
  const {
    permitDetails,
    updatePermitDetails,
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
    setInvoiceImporterCode,
    setInvoiceImporterCruei,
    setInvoiceImporterName,
    setInvoiceImporterName1,
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
    showFreightForwarderMandatoryError,
    setShowFreightForwarderMandatoryError,
    showCargoHawbMandatoryError,
    setShowCargoHawbMandatoryError,
    claimantCode,
    setClaimantCode,
    claimantCruei,
    setClaimantCruei,
    claimantName,
    setClaimantName,
    claimantName1,
    setClaimantName1,
    claimantcmantName,
    setclaimantcmantName,
    claimantcmantName1,
    setclaimantcmantName1,

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
    transportMode,
    setTransportMode,
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
  } = useInnonpayment();

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
  const [commonImporterCodes, setCommonImporterCodes] = useState(new Set());
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
  // useEffect(() => {
  //   const fetchImporters = async () => {
  //     try {
  //       const response = await API.get("/getCommonImporterTableInfo/");
  //       const list = response.data.map(
  //         (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
  //       );
  //       setImporterSuggestions(list);
  //       setFilteredSuggestions(list);
  //     } catch (err) {
  //       console.error("Failed to fetch importers", err);
  //     }
  //   };
  //   fetchImporters();
  // }, []);

  useEffect(() => {
    const fetchImporters = async () => {
      try {
        const [commonResult, inpaymentResult] = await Promise.allSettled([
          API.get("/getCommonImporterTableInfo/"),
          API.get("innonpayment/getInnonImporterTableInfo/"),
        ]);

        const commonData =
          commonResult.status === "fulfilled"
            ? commonResult.value.data || []
            : [];
        const inpaymentData =
          inpaymentResult.status === "fulfilled"
            ? inpaymentResult.value.data || []
            : [];

        if (commonResult.status === "rejected") {
          console.error(
            "Failed to fetch Common importers",
            commonResult.reason,
          );
        }
        if (inpaymentResult.status === "rejected") {
          console.error(
            "Failed to fetch Inpayment importers",
            inpaymentResult.reason,
          );
        }

        const merged = [...commonData];
        const seenCodes = new Set(
          commonData.map((i) => String(i.Code || "").toLowerCase()),
        );
        for (const item of inpaymentData) {
          const code = String(item.Code || "").toLowerCase();
          if (!seenCodes.has(code)) {
            merged.push(item);
            seenCodes.add(code);
          }
        }

        const list = merged.map(
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
    focusNextSection("importer");
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
        focusNextSection("importer");
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
    const duplicate = commonImporterCodes.has(importerCode.toLowerCase());
    if (duplicate) {
      alert("Duplicate code found! Importer not saved.");
      return;
    }
    if (duplicate) {
      alert("Duplicate code found! Importer not saved.");
      return;
    }

    const payload = {
      Id: importer?.Id || 0,
      Code: (importerCode || "").toUpperCase(),
      CRUEI: (importerCruei || "").toUpperCase(),
      Name: (importerName || "").toUpperCase(),
      Name1: (importerName1 || "").toUpperCase(),
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
      MES: "",
      APS: "",
    };

    console.log("Payload to save:", payload);

    try {
      const response = await API.post("/postImporterTable/", payload);

      alert(
        response.data?.message ||
          response.data?.Result ||
          "Importer saved successfully!",
      );
      console.log("Saved data:", response.data);

      setCommonImporterCodes((prev) =>
        new Set(prev).add(importerCode.toLowerCase()),
      );
    } catch (err) {
      console.error("Failed to save importer:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.Result ||
          "Failed to save importer, check console for details",
      );
    }
  };
  // const saveImporter = async () => {
  //   if (!importerCode) {
  //     setImporterError(true);
  //     alert("Code is required!");
  //     return;
  //   }
  //   const duplicate = importerSuggestions.some(
  //     (i) => i.split(":")[0].toLowerCase() === importerCode.toLowerCase(),
  //   );
  //   if (duplicate) {
  //     alert("Duplicate code found! Importer not saved.");
  //     return;
  //   }

  //   const payload = {
  //     Id: importer?.Id || 0,
  //     Code: importerCode || "",
  //     CRUEI: importerCruei || "",
  //     Name: importerName || "",
  //     Name1: importerName1 || "",
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //     MES: "",
  //     APS: "",
  //   };

  //   console.log("Payload to save:", payload);

  //   try {
  //     const response = await API.post("/postImporterTable/", payload);
  //     alert(response.data?.message || "Importer saved successfully!");
  //     console.log("Saved data:", response.data);
  //   } catch (err) {
  //     if (err.response?.status === 400) {
  //       alert(err.response.data?.error || "Failed to save importer");
  //     } else {
  //       console.error("Failed to save importer:", err);
  //       alert("Failed to save importer, check console for details");
  //     }
  //   }
  // };

  // iNVOICE PAGE
  useEffect(() => {
    if (importerCode) {
      setInvoiceImporterCode(importerCode);
      setInvoiceImporterCruei(importerCruei);
      setInvoiceImporterName(importerName);
      setInvoiceImporterName1(importerName1);
      setSummaryImporterCruei(importerCruei);
      setSummaryImporterName(importerName);
    }
  }, [importerCode, importerCruei, importerName, importerName1]);

  // ======================== INWARD ========================
  const inwardCodeRef = useRef(null);
  const [inwardAgent, setInwardAgent] = useState(null);
  const [inwardSuggestions, setInwardSuggestions] = useState([]);
  const [filteredInwardSuggestions, setFilteredInwardSuggestions] = useState(
    [],
  );
  const [commonInwardCodes, setCommonInwardCodes] = useState(new Set());
  const [showInwardDropdown, setShowInwardDropdown] = useState(false);
  const [inwardHighlightedIndex, setInwardHighlightedIndex] = useState(0);
  const [inwardError, setInwardError] = useState(false);
  // ======================== FETCH INWARD ========================
  // useEffect(() => {
  //   const fetchInward = async () => {
  //     try {
  //       const response = await API.get(
  //         "/getCommonInwardCarrierAgentTableInfo/",
  //       );
  //       const list = response.data.map(
  //         (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
  //       );
  //       setInwardSuggestions(list);
  //       setFilteredInwardSuggestions(list);
  //     } catch (err) {
  //       console.error("Failed to fetch importers", err);
  //     }
  //   };
  //   fetchInward();
  // }, []);

  useEffect(() => {
    const fetchInward = async () => {
      try {
        const [commonResult, innonResult] = await Promise.allSettled([
          API.get("/getCommonInwardCarrierAgentTableInfo/"),
          API.get("innonpayment/getInnonInwardCarrierAgentTableInfo/"),
        ]);

        const commonData =
          commonResult.status === "fulfilled"
            ? commonResult.value.data || []
            : [];
        const innonData =
          innonResult.status === "fulfilled"
            ? innonResult.value.data || []
            : [];

        if (commonResult.status === "rejected")
          console.error(
            "Failed to fetch Common inward agents",
            commonResult.reason,
          );
        if (innonResult.status === "rejected")
          console.error(
            "Failed to fetch Innon inward agents",
            innonResult.reason,
          );

        const commonCodes = new Set(
          commonData.map((i) => String(i.Code || "").toLowerCase()),
        );
        setCommonInwardCodes(commonCodes);

        const merged = [...commonData];
        for (const item of innonData) {
          const code = String(item.Code || "").toLowerCase();
          if (!commonCodes.has(code)) merged.push(item);
        }

        const list = merged.map(
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
    focusNextSection("inward");
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
        focusNextSection("inward");
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
    const duplicate = commonInwardCodes.has(inwardCode.toLowerCase());
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

    try {
      const response = await API.post("/postInwardCarrierAgentTable/", payload);
      alert(
        response.data?.message ||
          response.data?.Result ||
          "Inward saved successfully!",
      );
      setCommonInwardCodes((prev) =>
        new Set(prev).add(inwardCode.toLowerCase()),
      );
    } catch (err) {
      console.error("Failed to save Inward:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.Result ||
          "Failed to save Inward, check console for details",
      );
    }
  };
  // const saveInward = async () => {
  //   if (!inwardCode) {
  //     setInwardError(true);
  //     alert("Code is required!");
  //     return;
  //   }

  //   // Check for duplicate
  //   const duplicate = inwardSuggestions.some(
  //     (i) => i.split(":")[0].toLowerCase() === inwardCode.toLowerCase(),
  //   );
  //   if (duplicate) {
  //     alert("Duplicate code found! Inward Carrier Agent not saved.");
  //     return;
  //   }
  //   const payload = {
  //     Id: inwardAgent?.Id || 0,
  //     Code: inwardCode || "",
  //     CRUEI: inwardCruei || "",
  //     Name: inwardName || "",
  //     Name1: inwardName1 || "",
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //   };
  //   console.log("Payload to save:", payload);
  //   try {
  //     const response = await API.post("/postInwardCarrierAgentTable/", payload);
  //     alert(response.data?.message || "Inward saved successfully!");
  //     console.log("Saved data:", response.data);
  //   } catch (err) {
  //     if (err.response?.status === 400) {
  //       alert(err.response.data?.error || "Failed to save Inward");
  //     } else {
  //       console.error("Failed to save Inward:", err);
  //       alert("Failed to save Inward, check console for details");
  //     }
  //   }
  // };

  // ======================== FETCH FREIGHTFORWARDER  ========================
  const freightForwarderCodeRef = useRef(null);
  const [freightForwarder, setFreightForwarder] = useState(null);
  const [freightForwarderSuggestions, setFreightForwarSuggestions] = useState(
    [],
  );
  const [commonFreightForwarderCodes, setCommonFreightForwarderCodes] =
    useState(new Set());
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
  // useEffect(() => {
  //   const fetchFreightForwarder = async () => {
  //     try {
  //       const response = await API.get("/getCommonFreightForwarderTable/");
  //       const list = response.data.map(
  //         (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
  //       );
  //       setFreightForwarSuggestions(list);
  //       setFilteredFreightForwarderSuggestions(list);
  //     } catch (err) {
  //       console.error("Failed to fetch importers", err);
  //     }
  //   };
  //   fetchFreightForwarder();
  // }, []);

  useEffect(() => {
    const fetchFreightForwarder = async () => {
      try {
        const [commonResult, innonResult] = await Promise.allSettled([
          API.get("/getCommonFreightForwarderTable/"),
          API.get("innonpayment/getInnonFreightForwarderTable/"),
        ]);

        const commonData =
          commonResult.status === "fulfilled"
            ? commonResult.value.data || []
            : [];
        const innonData =
          innonResult.status === "fulfilled"
            ? innonResult.value.data || []
            : [];

        if (commonResult.status === "rejected")
          console.error(
            "Failed to fetch Common freight forwarders",
            commonResult.reason,
          );
        if (innonResult.status === "rejected")
          console.error(
            "Failed to fetch Innon freight forwarders",
            innonResult.reason,
          );

        const commonCodes = new Set(
          commonData.map((i) => String(i.Code || "").toLowerCase()),
        );
        setCommonFreightForwarderCodes(commonCodes);

        const merged = [...commonData];
        for (const item of innonData) {
          const code = String(item.Code || "").toLowerCase();
          if (!commonCodes.has(code)) merged.push(item);
        }

        const list = merged.map(
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
    if (
      !showFreightForwarderDropdown ||
      filteredFreightForwarderSuggestions.length === 0
    )
      return;

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
    focusNextSection("freightForwarder");
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
        focusNextSection("freightForwarder");
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
    const duplicate = commonFreightForwarderCodes.has(
      freightForwarderCode.toLowerCase(),
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

    try {
      const response = await API.post("/postFreightForwarderTable/", payload);
      alert(
        response.data?.message ||
          response.data?.Result ||
          "FreightForwarder saved successfully!",
      );
      setCommonFreightForwarderCodes((prev) =>
        new Set(prev).add(freightForwarderCode.toLowerCase()),
      );
    } catch (err) {
      console.error(
        "Failed to save FreightForwarder:",
        err.response?.data || err,
      );
      alert(
        err.response?.data?.error ||
          err.response?.data?.Result ||
          "Failed to save FreightForwarder, check console for details",
      );
    }
  };

  // const saveFreightForwarder = async () => {
  //   if (!freightForwarderCode) {
  //     setFreightForwarderError(true);
  //     alert("Code is required!");
  //     return;
  //   }
  //   // Check for duplicate
  //   const duplicate = freightForwarderSuggestions.some(
  //     (i) =>
  //       i.split(":")[0].toLowerCase() === freightForwarderCode.toLowerCase(),
  //   );
  //   if (duplicate) {
  //     alert("Duplicate code found! Freight Forwarder not saved.");
  //     return;
  //   }
  //   const payload = {
  //     Id: freightForwarder?.Id || 0,
  //     Code: freightForwarderCode || "",
  //     CRUEI: freightForwarderCruei || "",
  //     Name: freightForwardName || "",
  //     Name1: freightForwardName1 || "",
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //   };
  //   console.log("Payload to save:", payload);
  //   try {
  //     const response = await API.post("/postFreightForwarderTable/", payload);
  //     alert(response.data?.message || "FreightForwarder saved successfully!");
  //     console.log("Saved data:", response.data);
  //   } catch (err) {
  //     if (err.response?.status === 400) {
  //       alert(err.response.data?.error || "Failed to save FreightForwarder");
  //     } else {
  //       console.error("Failed to save FreightForwarder:", err);
  //       alert("Failed to save FreightForwarder, check console for details");
  //     }
  //   }
  // };

  // ======================== CLAIMANT PARTY========================
  const claimantCodeRef = useRef(null);
  const [claimant, setClaimant] = useState(null);

  const [claimantSuggestions, setClaimantSuggestions] = useState([]);
  const [filteredClaimantSuggestions, setFilteredClaimantSuggestions] =
    useState([]);
  const [commonClaimantCodes, setCommonClaimantCodes] = useState(new Set());
  const [showClaimantDropdown, setShowClaimantDropdown] = useState(false);
  const [claimantError, setClaimantError] = useState(false);
  const [claimantHighlightedIndex, setClaimantHighlightedIndex] = useState(0);
  // const [loading, setLoading] = useState(false);
  // ======================== FETCH CLAIMANT PARTY========================
  // useEffect(() => {
  //   const fetchClaimant = async () => {
  //     try {
  //       const response = await API.get("/"innonpayment/getInnonClaimantPartyTable/");
  //       const list = response.data.map(
  //         (i) =>
  //           `${i.ClaimantCode}:${i.CRUEI}:${i.Name}:${i.Name1}:${i.ClaimantName}:${i.ClaimantName1}`,
  //       );
  //       setClaimantSuggestions(list);
  //       setFilteredClaimantSuggestions(list);
  //     } catch (err) {
  //       console.error("Failed to fetch claimant party", err);
  //     }
  //   };
  //   fetchClaimant();
  // }, []);

  // ======================== FETCH CLAIMANT PARTY ========================
  useEffect(() => {
    const fetchClaimant = async () => {
      try {
        const response = await API.get(
          "/innonpayment/getInnonClaimantPartyTable/",
        );
        const innonData = response.data || [];

        const list = innonData
          .filter((i) => i.Name)
          .map(
            (i) =>
              `${i.Name}:${i.CRUEI || ""}:${i.Name1 || ""}:${i.ClaimantName || ""}:${i.ClaimantName1 || ""}`,
          );

        setClaimantSuggestions(list);
        setFilteredClaimantSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch Innon claimant party", err);
      }
    };
    fetchClaimant();
  }, []);

  useEffect(() => {
    const fetchCommonNames = async () => {
      try {
        const response = await API.get("/getCommonClaimantPartyTable/");
        const commonData = response.data || [];
        const names = new Set(
          commonData.map((i) =>
            String(i.ClaimantCode || i.Name || "").toLowerCase(),
          ),
        );
        setCommonClaimantCodes(names);
      } catch (err) {
        console.error(
          "Failed to fetch Common claimant party for duplicate check",
          err,
        );
      }
    };
    fetchCommonNames();
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
    const filtered = claimantSuggestions.filter((i) => {
      const [Name, Cruei, Name1, ClaimantName] = i.split(":");
      const search = val.toLowerCase();
      return (
        (Name || "").toLowerCase().startsWith(search) ||
        (ClaimantName || "").toLowerCase().startsWith(search)
      );
    });

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
    const [name, cruei, name1, claimantName, claimantName1] = item.split(":");
    setClaimant({
      Name: name,
      CRUEI: cruei,
      Name1: name1,
      ClaimantName: claimantName,
      ClaimantName1: claimantName1,
    });
    setClaimantCode(name);
    setClaimantCruei(cruei);
    setClaimantName(name);
    setClaimantName1(name1);
    setclaimantcmantName(claimantName);
    setclaimantcmantName1(claimantName1);
    setShowClaimantDropdown(false);
    setClaimantError(false);
    focusNextSection("claimant");
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
        .find(([name]) => name.toLowerCase() === claimantCode.toLowerCase());

      if (selected) {
        const [name, cruei, name1, claimantName, claimantName1] = selected;
        setClaimant({
          Name: name,
          CRUEI: cruei,
          Name1: name1,
          ClaimantName: claimantName,
          ClaimantName1: claimantName1,
        });
        setClaimantCode(name);
        setClaimantCruei(cruei);
        setClaimantName(name);
        setClaimantName1(name1);
        setclaimantcmantName(claimantName);
        setclaimantcmantName1(claimantName1);
        setClaimantError(false);
        focusNextSection("claimant");
      } else {
        setClaimant(null);
        setClaimantError(true);
      }

      setShowClaimantDropdown(false);
    }, 100);
  };
  // ======================== CLAIMANT PARTY SAVE FUNCTION ========================
  const saveClaimanParty = async () => {
    if (!claimantCode) {
      setClaimantError(true);
      alert("Name is required!");
      return;
    }
    const duplicate = commonClaimantCodes.has(claimantCode.toLowerCase());
    if (duplicate) {
      alert("Duplicate code found! Claimant Party not saved.");
      return;
    }
    const payload = {
      Id: claimant?.Id || 0,
      Name: claimantCode || "",
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
    console.log("Data:", payload);

    try {
      const response = await API.post("/postClaimantPartyTable/", payload);
      alert(
        response.data?.message ||
          response.data?.Result ||
          "Claimant Party saved successfully!",
      );
      setCommonClaimantCodes((prev) =>
        new Set(prev).add(claimantCode.toLowerCase()),
      );
    } catch (err) {
      console.error(
        "Failed to save Claimant Party:",
        err.response?.data || err,
      );
      alert(
        err.response?.data?.error ||
          err.response?.data?.Result ||
          "Failed to save Claimant Party, check console for details",
      );
    }
  };
  // const saveClaimanParty = async () => {
  //   if (!claimantCode) {
  //     setClaimantError(true);
  //     alert("Code is required!");
  //     return;
  //   }
  //   // Check for duplicate
  //   const duplicate = claimantSuggestions.some(
  //     (i) => i.split(":")[0].toLowerCase() === claimantCode.toLowerCase(),
  //   );
  //   if (duplicate) {
  //     alert("Duplicate code found! Freight Forwarder not saved.");
  //     return;
  //   }
  //   const payload = {
  //     Id: claimant?.Id || 0,
  //     Name: claimantName || "",
  //     Name1: claimantName1 || "",
  //     CRUEI: claimantCruei || "",
  //     ClaimantName: claimantcmantName || "",
  //     ClaimantName1: claimantcmantName1 || "",
  //     ClaimantCode: claimantCode || "",
  //     Name2: "",
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //   };
  //   console.log("Payload to save:", payload);
  //   try {
  //     const response = await API.post("/postClaimantPartyTable/", payload);
  //     alert(response.data?.message || "Claimant Party saved successfully!");
  //     console.log("Saved data:", response.data);
  //   } catch (err) {
  //     if (err.response?.status === 400) {
  //       alert(err.response.data?.error || "Failed to save Claimant Party");
  //     } else {
  //       console.error("Failed to save Claimant Party:", err);
  //       alert("Failed to save Claimant Party, check console for details");
  //     }
  //   }
  // };

  // ======================== CONSIGNEE ========================
  const congineeCodeRef = useRef(null);
  const [consignee, setConsignee] = useState(null);
  const [congineeSuggestions, setCongineeSuggestions] = useState([]);
  const [commonCongineeCodes, setCommonCongineeCodes] = useState(new Set());
  const [filteredCongineeSuggestions, setFilteredCongineeSuggestions] =
    useState([]);
  const [showCongineeDropdown, setShowCongineeDropdown] = useState(false);
  const [congineeError, setCongineeError] = useState(false);
  const [congineeHighlightedIndex, setCongineeHighlightedIndex] = useState(0);

  // ======================== FETCH CONSIGNEE ========================
  // useEffect(() => {
  //   const fetchConsignee = async () => {
  //     try {
  //       const response = await API.get("/getCommonConsigneeTableInfo/");
  //       const list = response.data.map(
  //         (i) =>
  //           `${i.ConsigneeCode}:${i.ConsigneeCRUEI}:${i.ConsigneeName}:${i.ConsigneeName1}:${i.ConsigneeAddress}:${i.ConsigneeAddress1}:${i.ConsigneeCity}:${i.ConsigneeSub}:${i.ConsigneeSubDivi}:${i.ConsigneePostal}:${i.ConsigneeCountry}`,
  //       );
  //       setCongineeSuggestions(list);
  //       setFilteredCongineeSuggestions(list);
  //     } catch (err) {
  //       console.error("Failed to fetch consignee", err);
  //     }
  //   };
  //   fetchConsignee();
  // }, []);

  useEffect(() => {
    const fetchConsignee = async () => {
      try {
        const [commonResult, innonResult] = await Promise.allSettled([
          API.get("/getCommonConsigneeTableInfo/"),
          API.get("innonpayment/getInnonConsigneeTableInfo/"),
        ]);

        const commonData =
          commonResult.status === "fulfilled"
            ? commonResult.value.data || []
            : [];
        const innonData =
          innonResult.status === "fulfilled"
            ? innonResult.value.data || []
            : [];

        if (commonResult.status === "rejected")
          console.error(
            "Failed to fetch Common consignees",
            commonResult.reason,
          );
        if (innonResult.status === "rejected")
          console.error("Failed to fetch Innon consignees", innonResult.reason);

        const commonCodes = new Set(
          commonData.map((i) => String(i.ConsigneeCode || "").toLowerCase()),
        );
        setCommonCongineeCodes(commonCodes);

        const merged = [...commonData];
        for (const item of innonData) {
          const code = String(item.ConsigneeCode || "").toLowerCase();
          if (!commonCodes.has(code)) merged.push(item);
        }

        const list = merged.map(
          (i) =>
            `${i.ConsigneeCode}:${i.ConsigneeCRUEI}:${i.ConsigneeName}:${i.ConsigneeName1}:${i.ConsigneeAddress || ""}:${i.ConsigneeAddress1 || ""}:${i.ConsigneeCity || ""}:${i.ConsigneeSub || ""}:${i.ConsigneeSubDivi || ""}:${i.ConsigneePostal || ""}:${i.ConsigneeCountry || ""}`,
        );

        console.log("Fetched consignees:", list);

        setCongineeSuggestions(list);
        setFilteredCongineeSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch consignees", err);
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
    focusNextSection("consignee");
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
        focusNextSection("consignee");
      } else {
        setConsignee(null);
        setCongineeError(true);
      }
      setShowCongineeDropdown(false);
    }, 150);
  };

  // ======================== CONSIGNEE SAVE ========================
  // const saveConsignee = async () => {
  //   if (!congineeCode) {
  //     setCongineeError(true);
  //     alert("Code is required!");
  //     return;
  //   }
  //   const duplicate = congineeSuggestions.some(
  //     (i) => i.split(":")[0].toLowerCase() === congineeCode.toLowerCase(),
  //   );
  //   if (duplicate) {
  //     alert("Duplicate code found! Consignee not saved.");
  //     return;
  //   }
  //   const payload = {
  //     Id: consignee?.Id || 0,
  //     ConsigneeCode: congineeCode || "",
  //     ConsigneeCRUEI: congineeCruei || "",
  //     ConsigneeName: congineeName || "",
  //     ConsigneeName1: congineeName1 || "",
  //     ConsigneeAddress: congineeAddress || "",
  //     ConsigneeAddress1: congineeAddress1 || "",
  //     ConsigneeCity: congineeCity || "",
  //     ConsigneeSub: congineeSubCode || "",
  //     ConsigneeSubDivi: congineeSubDivision || "",
  //     ConsigneePostal: congineePostal || "",
  //     ConsigneeCountry: congineeCountryCode || "",
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //   };
  //   try {
  //     const response = await API.post("/postCongineeTable/", payload);
  //     alert(response.data?.message || "Consignee saved successfully!");
  //   } catch (err) {
  //     if (err.response?.status === 400) {
  //       alert(err.response.data?.error || "Failed to save Consignee");
  //     } else {
  //       console.error("Failed to save Consignee:", err);
  //       alert("Failed to save Consignee, check console for details");
  //     }
  //   }
  // };
  const saveConsignee = async () => {
    if (!congineeCode) {
      setCongineeError(true);
      alert("Code is required!");
      return;
    }
    const duplicate = commonCongineeCodes.has(congineeCode.toLowerCase());
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
  const exporterCodeRef = useRef(null);
  const [exporter, setExporter] = useState(null);
  const [exporterSuggestions, setExporterSuggestions] = useState([]);
  const [commonExporterCodes, setCommonExporterCodes] = useState(new Set());
  const [filteredExporterSuggestions, setFilteredExporterSuggestions] =
    useState([]);
  const [showExporterDropdown, setShowExporterDropdown] = useState(false);
  const [exporterHighlightedIndex, setExporterHighlightedIndex] = useState(0);
  const [exporterError, setExporterError] = useState(false);

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

  useEffect(() => {
    const fetchExporter = async () => {
      try {
        const response = await API.get(
          "/innonpayment/getInnonExporterTableInfo/",
        );
        const innonData = response.data || [];

        const list = innonData
          .filter((i) => i.Code)
          .map(
            (i) =>
              `${i.Code}:${i.CRUEI || ""}:${i.Name || ""}:${i.Name1 || ""}`,
          );

        setExporterSuggestions(list);
        setFilteredExporterSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch Innon exporters", err);
      }
    };
    fetchExporter();
  }, []);

  // ======================== FETCH COMMON EXPORTER CODES (for duplicate-check on save) ========================
  useEffect(() => {
    const fetchCommonExporterCodes = async () => {
      try {
        const response = await API.get("/getCommonExporterTableInfo/");
        const commonData = response.data || [];
        const codes = new Set(
          commonData.map((i) => String(i.Code || "").toLowerCase()),
        );
        setCommonExporterCodes(codes);
      } catch (err) {
        console.error(
          "Failed to fetch Common exporters for duplicate check",
          err,
        );
      }
    };
    fetchCommonExporterCodes();
  }, []);

  // ======================== EXPORTER HANDLERS ========================
  const handleExporterChange = (e) => {
    const val = e.target.value;
    setExporterCode(val);
    setExporterError(false);
    setExporterHighlightedIndex(0);

    if (!val) {
      setShowExporterDropdown(false);
      return;
    }

    const filtered = exporterSuggestions.filter((i) => {
      const [Code, Cruei, Name, Name1] = i.split(":");
      const search = val.toLowerCase();
      return (
        (Code || "").toLowerCase().startsWith(search) ||
        (Name || "").toLowerCase().startsWith(search)
      );
    });

    setFilteredExporterSuggestions(filtered.slice(0, 100));
    setShowExporterDropdown(filtered.length > 0);
  };

  // ======================== EXPORTER KEYDOWN ========================
  const handleExporterKeyDown = (e) => {
    if (!showExporterDropdown || filteredExporterSuggestions.length === 0)
      return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setExporterHighlightedIndex((prev) =>
        prev + 1 >= filteredExporterSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setExporterHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredExporterSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleExporterSelect(
        filteredExporterSuggestions[exporterHighlightedIndex],
      );
    }
  };

  // ======================== EXPORTER SELECT ========================
  const handleExporterSelect = (item) => {
    const [code, cruei, name, name1] = item.split(":");
    setExporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
    setExporterCode(code);
    setExporterCruei(cruei);
    setExporterName(name);
    setExporterName1(name1);
    setShowExporterDropdown(false);
    setExporterError(false);
    focusNextSection("exporter");
  };

  // ======================== EXPORTER FOCUSOUT ========================
  const handleExporterFocusOut = () => {
    setTimeout(() => {
      if (!exporterCode) {
        setExporter(null);
        setExporterCruei("");
        setExporterName("");
        setExporterName1("");
        setExporterError(true);
        setShowExporterDropdown(false);
        return;
      }

      const selected = exporterSuggestions
        .map((i) => i.split(":"))
        .find(([code]) => code.toLowerCase() === exporterCode.toLowerCase());

      if (selected) {
        const [code, cruei, name, name1] = selected;
        setExporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
        setExporterCode(code);
        setExporterCruei(cruei);
        setExporterName(name);
        setExporterName1(name1);
        setExporterError(false);
        focusNextSection("exporter");
      } else {
        setExporter(null);
        setExporterError(true);
      }
      setShowExporterDropdown(false);
    }, 150);
  };

  // // ======================== EXPORTER SAVE ========================
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
  const saveExporter = async () => {
    if (!exporterCode) {
      setExporterError(true);
      alert("Code is required!");
      return;
    }

    const duplicate = commonExporterCodes.has(exporterCode.toLowerCase());
    if (duplicate) {
      alert("Duplicate code found! Exporter not saved.");
      return;
    }

    const payload = {
      Id: exporter?.Id || 0,
      Code: exporterCode || "",
      CRUEI: exporterCruei || "",
      Name: exporterName || "",
      Name1: exporterName1 || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };

    try {
      const response = await API.post("/postExporterTable/", payload);
      alert(
        response.data?.message ||
          response.data?.Result ||
          "Exporter saved successfully!",
      );
      setCommonExporterCodes((prev) =>
        new Set(prev).add(exporterCode.toLowerCase()),
      );
    } catch (err) {
      console.error("Failed to save Exporter:", err.response?.data || err);
      alert(
        err.response?.data?.error ||
          err.response?.data?.Result ||
          "Failed to save Exporter, check console for details",
      );
    }
  };

  // ======================== OUTWARD CARRIER AGENT ========================
  const outwardCodeRef = useRef(null);
  const [outwardAgent, setOutwardAgent] = useState(null);
  const [outwardSuggestions, setOutwardSuggestions] = useState([]);
  const [commonOutwardCodes, setCommonOutwardCodes] = useState(new Set());
  const [filteredOutwardSuggestions, setFilteredOutwardSuggestions] = useState(
    [],
  );
  const [showOutwardDropdown, setShowOutwardDropdown] = useState(false);
  const [outwardHighlightedIndex, setOutwardHighlightedIndex] = useState(0);
  const [outwardError, setOutwardError] = useState(false);

  // ======================== FETCH OUTWARD ========================
  // useEffect(() => {
  //   const fetchOutward = async () => {
  //     try {
  //       const response = await API.get(
  //         "/getCommonOutwardCarrierAgentTableInfo/",
  //       );
  //       const list = response.data.map(
  //         (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
  //       );
  //       setOutwardSuggestions(list);
  //       setFilteredOutwardSuggestions(list);
  //     } catch (err) {
  //       console.error("Failed to fetch outward carrier agent", err);
  //     }
  //   };
  //   fetchOutward();
  // }, []);

  useEffect(() => {
    const fetchOutward = async () => {
      try {
        const [commonResult, innonResult] = await Promise.allSettled([
          API.get("/getCommonOutwardCarrierAgentTableInfo/"),
          API.get("innonpayment/getInnonOutwardCarrierAgentTableInfo/"),
        ]);

        const commonData =
          commonResult.status === "fulfilled"
            ? commonResult.value.data || []
            : [];
        const innonData =
          innonResult.status === "fulfilled"
            ? innonResult.value.data || []
            : [];

        if (commonResult.status === "rejected")
          console.error(
            "Failed to fetch Common outward carrier agents",
            commonResult.reason,
          );
        if (innonResult.status === "rejected")
          console.error(
            "Failed to fetch Innon outward carrier agents",
            innonResult.reason,
          );

        const commonCodes = new Set(
          commonData.map((i) => String(i.Code || "").toLowerCase()),
        );
        setCommonOutwardCodes(commonCodes);

        const merged = [...commonData];
        for (const item of innonData) {
          const code = String(item.Code || "").toLowerCase();
          if (!commonCodes.has(code)) merged.push(item);
        }

        const list = merged.map(
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
    focusNextSection("outward");
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
        focusNextSection("outward");
      } else {
        setOutwardAgent(null);
        setOutwardError(true);
      }
      setShowOutwardDropdown(false);
    }, 150);
  };

  // ======================== OUTWARD SAVE ========================
  // const saveOutward = async () => {
  //   if (!outwardCode) {
  //     setOutwardError(true);
  //     alert("Code is required!");
  //     return;
  //   }

  //   const duplicate = outwardSuggestions.some(
  //     (i) => i.split(":")[0].toLowerCase() === outwardCode.toLowerCase(),
  //   );
  //   if (duplicate) {
  //     alert("Duplicate code found! Outward Carrier Agent not saved.");
  //     return;
  //   }

  //   const payload = {
  //     Id: outwardAgent?.Id || 0,
  //     Code: outwardCode || "",
  //     CRUEI: outwardCruei || "",
  //     Name: outwardName || "",
  //     Name1: outwardName1 || "",
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //   };

  //   console.log("Payload to save:", payload);

  //   try {
  //     const response = await API.post(
  //       "/postOutwardCarrierAgentTable/",
  //       payload,
  //     );
  //     alert(
  //       response.data?.message || "Outward Carrier Agent saved successfully!",
  //     );
  //     console.log("Saved data:", response.data);
  //   } catch (err) {
  //     if (err.response?.status === 400) {
  //       alert(
  //         err.response.data?.error || "Failed to save Outward Carrier Agent",
  //       );
  //     } else {
  //       console.error("Failed to save Outward Carrier Agent:", err);
  //       alert(
  //         "Failed to save Outward Carrier Agent, check console for details",
  //       );
  //     }
  //   }
  // };

  const saveOutward = async () => {
    if (!outwardCode) {
      setOutwardError(true);
      alert("Code is required!");
      return;
    }

    const duplicate = commonOutwardCodes.has(outwardCode.toLowerCase());
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

    try {
      const response = await API.post(
        "/postOutwardCarrierAgentTable/",
        payload,
      );
      alert(
        response.data?.message ||
          response.data?.Result ||
          "Outward Carrier Agent saved successfully!",
      );
      setCommonOutwardCodes((prev) =>
        new Set(prev).add(outwardCode.toLowerCase()),
      );
    } catch (err) {
      console.error(
        "Failed to save Outward Carrier Agent:",
        err.response?.data || err,
      );
      alert(
        err.response?.data?.error ||
          err.response?.data?.Result ||
          "Failed to save Outward Carrier Agent, check console for details",
      );
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
        MessageType: "INPDEC",

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
  //     MessageType: "INPDEC",
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

  // ============================Party Filled Order Check=========================

  const getSectionOrder = () => [
    { key: "importer", visible: true, ref: importerCodeRef },
    { key: "exporter", visible: showExporter, ref: exporterCodeRef },
    { key: "inward", visible: true, ref: inwardCodeRef },
    { key: "outward", visible: showOutwardCarrier, ref: outwardCodeRef },
    { key: "freightForwarder", visible: true, ref: freightForwarderCodeRef },
    { key: "claimant", visible: showClaimantPartyShow, ref: claimantCodeRef },
    { key: "consignee", visible: showCongineeShow, ref: congineeCodeRef },
  ];

  const focusNextSection = (currentKey) => {
    setTimeout(() => {
      const order = getSectionOrder();
      const currentIndex = order.findIndex((s) => s.key === currentKey);
      if (currentIndex === -1) return;

      for (let i = currentIndex + 1; i < order.length; i++) {
        if (order[i].visible) {
          order[i].ref.current?.focus();
          return;
        }
      }

      document.getElementById("PartySaveDraft")?.focus();
    }, 0);
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
              tabIndex={1}
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              value={permitDetails?.CRUEI || ""}
              readOnly
              tabIndex={2}
            />
          </div>
          <div className="col-sm-3">
            <input
              className="form-control"
              value={permitDetails?.name || ""}
              readOnly
              tabIndex={3}
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              placeholder="Name1"
              value={permitDetails?.name1 || ""}
              readOnly
              tabIndex={4}
            />
          </div>
        </div>

        {/* IMPORTER */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">IMPORTER</label>
          <div className="col-sm-1">
            <FaSearch
              className="me-3"
              style={{ cursor: "pointer" }}
              tabIndex={5}
              onClick={() => handleIconClick("importer")}
            />
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={saveImporter}
              tabIndex={6}
            />
          </div>
          <div className="col-sm-2 position-relative">
            <input
              ref={importerCodeRef}
              id="importerCode"
              className="form-control-mandatory"
              placeholder="CODE"
              tabIndex={7}
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
              tabIndex={8}
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
              tabIndex={9}
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
              tabIndex={10}
              className="form-control-mandatory"
              placeholder="NAME1"
              value={importer?.Name1 || importerName1 || ""}
              onChange={(e) => setImporterName1(e.target.value)}
            />
          </div>
        </div>

        {/* EXPORTER */}
        {showExporter && (
          <div className="row align-items-center compact-row">
            <label className="col-sm-2 col-form-label">EXPORTER</label>
            <div className="col-sm-1">
              <FaSearch
                className="me-3"
                tabIndex={11}
                style={{ cursor: "pointer" }}
                onClick={() => handleIconClick("exporter")}
              />
              <FaPlus
                style={{ cursor: "pointer" }}
                onClick={saveExporter}
                tabIndex={12}
              />
            </div>

            {/* CODE */}
            <div className="col-sm-2 position-relative">
              <input
                ref={exporterCodeRef}
                id="exporterCode"
                tabIndex={13}
                className="form-control-mandatory"
                placeholder="CODE"
                value={exporterCode}
                onChange={handleExporterChange}
                onKeyDown={handleExporterKeyDown}
                onBlur={handleExporterFocusOut}
                onFocus={() => setExporterError(false)}
              />
              {showExporterDropdown &&
                filteredExporterSuggestions.length > 0 && (
                  <div className="dropdown-suggestions">
                    {filteredExporterSuggestions.map((item, index) => {
                      const [code, , name] = item.split(":");
                      return (
                        <div
                          key={code}
                          className="dropdown-item"
                          style={{
                            backgroundColor:
                              index === exporterHighlightedIndex
                                ? "#234263"
                                : "white",
                            color:
                              index === exporterHighlightedIndex
                                ? "white"
                                : "black",
                            cursor: "pointer",
                          }}
                          onMouseDown={() => handleExporterSelect(item)}
                          onMouseEnter={() =>
                            setExporterHighlightedIndex(index)
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
                id="exporterCruei"
                className="form-control-mandatory"
                placeholder="CRUEI"
                tabIndex={14}
                value={exporter?.CRUEI || exporterCruei || ""}
                onChange={(e) => setExporterCruei(e.target.value)}
              />
              {showExporterCrueiError && (
                <span className="ErrorColor">CRUEI is required</span>
              )}
            </div>

            {/* NAME */}
            <div className="col-sm-3">
              <input
                id="exporterName"
                className="form-control-mandatory"
                placeholder="NAME"
                tabIndex={15}
                value={exporter?.Name || exporterName || ""}
                onChange={(e) => setExporterName(e.target.value)}
              />
              {showExporterNameError && (
                <span className="ErrorColor">Name is required</span>
              )}
            </div>

            {/* NAME1 */}
            <div className="col-sm-2">
              <input
                id="exporterName1"
                className="form-control-mandatory"
                placeholder="NAME1"
                tabIndex={16}
                value={exporter?.Name1 || exporterName1 || ""}
                onChange={(e) => setExporterName1(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* INWARD CARRIER AGENT */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">
            INWARD CARRIER AGENT
          </label>
          <div className="col-sm-1">
            <FaSearch
              className="me-3"
              tabIndex={17}
              style={{ cursor: "pointer" }}
              onClick={() => handleIconClick("inward")}
            />
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={saveInward}
              tabIndex={18}
            />
          </div>
          <div className="col-sm-2 position-relative">
            <input
              ref={inwardCodeRef}
              id="inwardCode"
              tabIndex={19}
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
                          index === inwardHighlightedIndex ? "white" : "black",
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
              tabIndex={20}
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
              tabIndex={21}
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
              tabIndex={22}
              value={inwardAgent?.Name1 || inwardName1 || ""}
              onChange={(e) => setInwardName1(e.target.value)}
            />
          </div>
        </div>

        {/* OUTWARD CARRIER AGENT */}
        {showOutwardCarrier && (
          <div className="row align-items-center compact-row">
            <label className="col-sm-2 col-form-label">
              OUTWARD CARRIER AGENT
            </label>
            <div className="col-sm-1">
              <FaSearch
                tabIndex={23}
                className="me-3"
                style={{ cursor: "pointer" }}
                onClick={() => handleIconClick("outward")}
              />
              <FaPlus
                style={{ cursor: "pointer" }}
                onClick={saveOutward}
                tabIndex={24}
              />
            </div>

            {/* CODE */}
            <div className="col-sm-2 position-relative">
              <input
                ref={outwardCodeRef}
                id="outwardCode"
                tabIndex={25}
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
                tabIndex={26}
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
                tabIndex={27}
              />
            </div>

            {/* NAME1 */}
            <div className="col-sm-2">
              <input
                id="outwardName1"
                className="form-control"
                placeholder="NAME1"
                tabIndex={28}
                value={outwardAgent?.Name1 || outwardName1 || ""}
                onChange={(e) => setOutwardName1(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* FREIGHT FORWARDER  */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">FREIGHT FORWARDER</label>
          <div className="col-sm-1">
            <FaSearch
              className="me-3"
              tabIndex={29}
              style={{ cursor: "pointer" }}
              onClick={() => handleIconClick("freightForwarder")}
            />
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={saveFreightForwarder}
              tabIndex={30}
            />
          </div>
          <div className="col-sm-2 position-relative">
            <input
              ref={freightForwarderCodeRef}
              id="freightForwarderCode"
              className={
                showFreightForwarderMandatoryError
                  ? "form-control-mandatory"
                  : "form-control"
              }
              placeholder="CODE"
              tabIndex={31}
              value={freightForwarderCode}
              onChange={(e) => {
                handleFreightForwarderChange(e);
                if (showFreightForwarderMandatoryError) {
                  setShowFreightForwarderMandatoryError(false);
                }
              }}
              onKeyDown={handleFreightForwarderKeyDown}
              onBlur={handleFreightForwarderFocusOut}
              onFocus={() => setFreightForwarderError(false)}
            />
            {showFreightForwarderMandatoryError && (
              <span className="ErrorColor">
                Freight Forwarder is required when Cargo HAWB is entered.
              </span>
            )}
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
              tabIndex={32}
            />
          </div>
          <div className="col-sm-3">
            <input
              id="freightForwarderName"
              className="form-control"
              placeholder="NAME"
              tabIndex={33}
              value={freightForwarder?.Name || freightForwardName || ""}
              onChange={(e) => setFreightForwarderName(e.target.value)}
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              id="freightForwarderName1"
              placeholder="NAME1"
              tabIndex={34}
              value={freightForwarder?.Name1 || freightForwardName1 || ""}
              onChange={(e) => setFreightForwarderName1(e.target.value)}
            />
          </div>
        </div>

        {/* CLAIMANT PARTY */}
        {showClaimantPartyShow && (
          <div>
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label">CLAIMANT PARTY</label>

              <div className="col-sm-1">
                <FaSearch
                  tabIndex={35}
                  className="me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleIconClick("claimantparty")}
                />
                <FaPlus
                  style={{ cursor: "pointer" }}
                  onClick={saveClaimanParty}
                  tabIndex={36}
                />
              </div>

              {/* CLAIMANT CODE INPUT WITH DROPDOWN */}
              <div className="col-sm-2 position-relative">
                <input
                  ref={claimantCodeRef}
                  tabIndex={37}
                  id="claimantPartyCode"
                  className="form-control"
                  placeholder="CODE"
                  value={claimantCode}
                  onChange={handleClaimantChange}
                  onKeyDown={handleClaimantKeyDown}
                  onBlur={handleClaimantFocusOut}
                  onFocus={() => setClaimantError(false)}
                />

                {showClaimantDropdown &&
                  filteredClaimantSuggestions.length > 0 && (
                    <div className="dropdown-suggestions">
                      {filteredClaimantSuggestions.map((item, index) => {
                        const parts = item.split(":");
                        const name = parts[0] || "";
                        const claimantName = parts[3] || "";

                        return (
                          <div
                            key={`${name || "row"}-${index}`}
                            className="dropdown-item"
                            style={{
                              backgroundColor:
                                index === claimantHighlightedIndex
                                  ? "#234263"
                                  : "white",
                              color:
                                index === claimantHighlightedIndex
                                  ? "white"
                                  : "black",
                              cursor: "pointer",
                            }}
                            onMouseDown={() => handleClaimantSelect(item)}
                            onMouseEnter={() =>
                              setClaimantHighlightedIndex(index)
                            }
                          >
                            {name} - {claimantName}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>

              <div className="col-sm-2">
                <input
                  id="claimantPartyCruei"
                  tabIndex={38}
                  className="form-control"
                  placeholder="CRUEI"
                  value={claimant?.CRUEI || claimantCruei || ""}
                  onChange={(e) => setClaimantCruei(e.target.value)}
                />
              </div>

              <div className="col-sm-3">
                <input
                  id="claimantPartyName"
                  tabIndex={39}
                  className="form-control"
                  placeholder="NAME"
                  value={claimant?.Name || claimantName || ""}
                  onChange={(e) => setClaimantName(e.target.value)}
                />
              </div>

              <div className="col-sm-2">
                <input
                  id="claimantPartyName1"
                  className="form-control"
                  tabIndex={40}
                  placeholder="NAME1"
                  value={claimant?.Name1 || claimantName1 || ""}
                  onChange={(e) => setClaimantName1(e.target.value)}
                />
              </div>
            </div>

            {/* CLAIMANT ROW */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-2 col-form-label"></label>
              <div className="col-sm-1 icon-contaniner"></div>

              <div className="col-sm-2">
                <input
                  type="text"
                  id="claimantId"
                  tabIndex={41}
                  className="form-control"
                  placeholder="CLAIMANT ID"
                  value={claimant?.ClaimantName || claimantcmantName || ""}
                  onChange={(e) => setclaimantcmantName(e.target.value)}
                />
              </div>

              <div className="col-sm-5">
                <input
                  type="text"
                  id="claimantName"
                  tabIndex={42}
                  className="form-control"
                  placeholder="CLAIMANT NAME"
                  value={claimant?.ClaimantName1 || claimantcmantName1 || ""}
                  onChange={(e) => setclaimantcmantName1(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

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
                  tabIndex={43}
                />
                <FaPlus
                  style={{ cursor: "pointer" }}
                  onClick={saveConsignee}
                  tabIndex={44}
                />
              </div>

              {/* CONGINEE CODE INPUT WITH DROPDOWN */}
              <div className="col-sm-2 position-relative">
                <input
                  ref={congineeCodeRef}
                  id="congineeCode"
                  className="form-control"
                  placeholder="CODE"
                  value={congineeCode}
                  tabIndex={45}
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
                  tabIndex={46}
                />
              </div>

              {/* NAME */}
              <div className="col-sm-3">
                <input
                  id="congineeName"
                  className="form-control"
                  placeholder="NAME"
                  tabIndex={47}
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
                  tabIndex={48}
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
                  tabIndex={49}
                  value={consignee?.ConsigneeAddress || congineeAddress || ""}
                  onChange={(e) => setCongineeAddress(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="congineeAddress1"
                  className="form-control"
                  placeholder="ADDRESS1"
                  tabIndex={50}
                  value={consignee?.ConsigneeAddress1 || congineeAddress1 || ""}
                  onChange={(e) => setCongineeAddress1(e.target.value)}
                />
              </div>
              <div className="col-sm-2">
                <input
                  id="congineeCity"
                  className="form-control"
                  placeholder="CITY"
                  tabIndex={51}
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
                  tabIndex={52}
                  value={consignee?.ConsigneeSub || congineeSubCode || ""}
                  onChange={(e) => setCongineeSubCode(e.target.value)}
                />
              </div>
              <div className="col-sm-3">
                <input
                  id="congineeSubDivision"
                  className="form-control"
                  placeholder="SUB DIVISION"
                  tabIndex={53}
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
                  placeholder="POSTAL"
                  tabIndex={54}
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
                  placeholder="COUNTRY CODE"
                  tabIndex={55}
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

        {/* Navigation Buttons */}
        <div className="mt-4 d-flex justify-content-center gap-3">
          <button
            className="NextpageBtns view-nav-btn"
            tabIndex={56}
            id="PartySaveDraft"
            onClick={handleSaveAsDraftClick}
          >
            SAVE AS DRAFT
          </button>
          <button
            className="NextpageBtns view-nav-btn"
            tabIndex={57}
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
            tabIndex={58}
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
