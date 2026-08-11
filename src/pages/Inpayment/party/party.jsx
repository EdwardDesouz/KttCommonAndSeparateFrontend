import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { fetchPopupData, SearchPopup, currentPopup } from "./partyFunctions";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../userContex/userContex";
import { useInpayment } from "../context/inpaymentContext";
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
    showClaimantPartyShow,
    setShowClaimantPartyShow,
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
  } = useInpayment();

  useEffect(() => {
    // if (isEditMode) return;
    if (!permitDetails?.PermitId) {
      const stored = sessionStorage.getItem("currentPermit");
      if (stored) {
        const parsed = JSON.parse(stored);
        updatePermitDetails(parsed);
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
  //       // const response = await API.get("/getCommonImporterTableInfo/");
  //         const response = await API.get("inpayment/getInImporterTableInfo/");
  //         console.log("importer data:", response.data);
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
          API.get("inpayment/getInImporterTableInfo/"),
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
    // console.log("Filtered:", filtered);

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

  //   const code = (importerCode || "").toUpperCase();

  //   const commonPayload = {
  //     Id: importer?.Id || 0,
  //     Code: code,
  //     CRUEI: (importerCruei || "").toUpperCase(),
  //     Name: (importerName || "").toUpperCase(),
  //     Name1: (importerName1 || "").toUpperCase(),
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //     MES: "",
  //     APS: "",
  //   };

  //   const inpaymentPayload = {
  //     Id: importer?.Id || 0,
  //     Code: code,
  //     CRUEI: (importerCruei || "").toUpperCase(),
  //     Name: (importerName || "").toUpperCase(),
  //     Name1: (importerName1 || "").toUpperCase(),
  //     TouchUser: (user?.username).toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Status: "Active",
  //   };

  //   console.log("Payload to save (Common):", commonPayload);
  //   console.log("Payload to save (Inpayment):", inpaymentPayload);

  //   let commonSaved = false;

  //   try {
  //     // Step 1: Save to CommonImporter
  //     const commonResponse = await API.post("/postImporterTable/", commonPayload);
  //     commonSaved = true;
  //     console.log("Saved to CommonImporter:", commonResponse.data);

  //     // Step 2: Save to Importer (inpayment)
  //     const inpaymentResponse = await API.post("/inpayment/postInpaymentImporterTable/", inpaymentPayload);
  //     console.log("Saved to Importer:", inpaymentResponse.data);

  //     alert("Importer saved successfully in both tables!");
  //   } catch (err) {
  //     console.error("Failed to save importer:", err);

  //     if (commonSaved) {
  //       alert(
  //         `Warning: Code "${code}" was saved to CommonImporter but FAILED to save to Importer. ` +
  //         `Please contact support or retry — this code is now inconsistent between tables.\n\n` +
  //         `Error: ${err.response?.data?.error || err.message}`
  //       );
  //     } else if (err.response?.status === 400) {
  //       alert(err.response.data?.error || err.response.data?.Result || "Failed to save importer");
  //     } else {
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
  const [commonInwardCodes, setCommonInwardCodes] = useState(new Set());
  const [filteredInwardSuggestions, setFilteredInwardSuggestions] = useState(
    [],
  );
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
        const [commonResult, inpaymentResult] = await Promise.allSettled([
          API.get("/getCommonInwardCarrierAgentTableInfo/"),
          API.get("inpayment/getInInwardCarrierAgentTableInfo/"),
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
            "Failed to fetch Common inward agents",
            commonResult.reason,
          );
        }
        if (inpaymentResult.status === "rejected") {
          console.error(
            "Failed to fetch Inpayment inward agents",
            inpaymentResult.reason,
          );
        }

        const commonCodes = new Set(
          commonData.map((i) => String(i.Code || "").toLowerCase()),
        );
        setCommonInwardCodes(commonCodes);

        const merged = [...commonData];
        for (const item of inpaymentData) {
          const code = String(item.Code || "").toLowerCase();
          if (!commonCodes.has(code)) {
            merged.push(item);
          }
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
      // Save to CommonInwardCarrierAgentTable only
      const response = await API.post("/postInwardCarrierAgentTable/", payload);

      alert(
        response.data?.message ||
          response.data?.Result ||
          "Inward saved successfully!",
      );
      console.log("Saved data:", response.data);

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
        const [commonResult, inpaymentResult] = await Promise.allSettled([
          API.get("/getCommonFreightForwarderTable/"),
          API.get("inpayment/getInFreightForwarderTable/"),
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
            "Failed to fetch Common freight forwarders",
            commonResult.reason,
          );
        }
        if (inpaymentResult.status === "rejected") {
          console.error(
            "Failed to fetch Inpayment freight forwarders",
            inpaymentResult.reason,
          );
        }

        const commonCodes = new Set(
          commonData.map((i) => String(i.Code || "").toLowerCase()),
        );
        setCommonFreightForwarderCodes(commonCodes);

        const merged = [...commonData];
        for (const item of inpaymentData) {
          const code = String(item.Code || "").toLowerCase();
          if (!commonCodes.has(code)) {
            merged.push(item);
          }
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
    setFreightForwarderHighlightedIndex(0);

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
      freightForwarderSuggestions.length === 0
    )
      return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFreightForwarderHighlightedIndex((prev) =>
        prev + 1 >= freightForwarderSuggestions.length ? 0 : prev + 1,
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
        filteredFreightForwarderSuggestions[inwardHighlightedIndex],
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
      // Save to CommonFreightForwarderTable only
      const response = await API.post("/postFreightForwarderTable/", payload);

      alert(
        response.data?.message ||
          response.data?.Result ||
          "FreightForwarder saved successfully!",
      );
      console.log("Saved data:", response.data);

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

  // ======================== CLAIMANT PARTY========================
  const claimantCodeRef = useRef(null);
  const [claimant, setClaimant] = useState(null);

  const [claimantcmantName, setclaimantcmantName] = useState("");
  const [claimantcmantName1, setclaimantcmantName1] = useState("");
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
  //       const response = await API.get("/getCommonClaimantPartyTable/");
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
  useEffect(() => {
    const fetchClaimant = async () => {
      try {
        const [commonResult, inpaymentResult] = await Promise.allSettled([
          API.get("/getCommonClaimantPartyTable/"),
          API.get("inpayment/getInClaimantPartyTable/"),
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
            "Failed to fetch Common claimant party",
            commonResult.reason,
          );
        }
        if (inpaymentResult.status === "rejected") {
          console.error(
            "Failed to fetch Inpayment claimant party",
            inpaymentResult.reason,
          );
        }

        const commonCodes = new Set(
          commonData.map((i) => String(i.ClaimantCode || "").toLowerCase()),
        );
        setCommonClaimantCodes(commonCodes);

        const merged = [...commonData];
        for (const item of inpaymentData) {
          const code = String(item.ClaimantCode || "").toLowerCase();
          if (!commonCodes.has(code)) {
            merged.push(item);
          }
        }

        const list = merged.map(
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
    const filtered = claimantSuggestions.filter((i) => {
      const [Code, Cruei, Name] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Name.toLowerCase().startsWith(search)
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

        focusNextSection("claimant");
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

  const saveClaimanParty = async () => {
    if (!claimantCode) {
      setClaimantError(true);
      alert("Code is required!");
      return;
    }
    const duplicate = commonClaimantCodes.has(claimantCode.toLowerCase());
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

    try {
      // Save to CommonClaimantPartyTable only
      const response = await API.post("/postClaimantPartyTable/", payload);

      alert(
        response.data?.message ||
          response.data?.Result ||
          "Claimant Party saved successfully!",
      );
      console.log("Saved data:", response.data);

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

  // ============================Party Filled Order Check=========================

  const getSectionOrder = () => [
    { key: "importer", visible: true, ref: importerCodeRef },
    { key: "inward", visible: true, ref: inwardCodeRef },
    { key: "freightForwarder", visible: true, ref: freightForwarderCodeRef },
    { key: "claimant", visible: showClaimantPartyShow, ref: claimantCodeRef },
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
    setInwardAgent,
    setInwardCode,
    setInwardCruei,
    setInwardName,
    setInwardName1,
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
        MessageType: "IPTDEC",

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
              onClick={() => handleIconClick("importer")}
              tabIndex={5}
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
              // value={importer?.Code || importerCode || ""}
              value={importerCode}
              onChange={handleImporterChange}
              onKeyDown={handleImporterKeyDown}
              onBlur={handleFocusOut}
              onFocus={() => setImporterError(false)}
              tabIndex={7}
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
              tabIndex={8}
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
              tabIndex={9}
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
              tabIndex={10}
            />
          </div>
        </div>

        {/* INWARD CARRIER AGENT */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">
            INWARD CARRIER AGENT
          </label>
          <div className="col-sm-1">
            <FaSearch
              className="me-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleIconClick("inward")}
              tabIndex={11}
            />
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={saveInward}
              tabIndex={12}
            />
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
              tabIndex={13}
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
              tabIndex={14}
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
              tabIndex={15}
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
              tabIndex={16}
              className="form-control"
              placeholder="NAME1"
              value={inwardAgent?.Name1 || inwardName1 || ""}
              onChange={(e) => setInwardName1(e.target.value)}
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
              onClick={() => handleIconClick("freightForwarder")}
              tabIndex={17}
            />
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={saveFreightForwarder}
              tabIndex={18}
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
              tabIndex={19}
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
              tabIndex={20}
            />
          </div>
          <div className="col-sm-3">
            <input
              id="freightForwarderName"
              className="form-control"
              placeholder="NAME"
              value={freightForwarder?.Name || freightForwardName || ""}
              onChange={(e) => setFreightForwarderName(e.target.value)}
              tabIndex={21}
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control"
              id="freightForwarderName1"
              placeholder="NAME1"
              value={freightForwarder?.Name1 || freightForwardName1 || ""}
              onChange={(e) => setFreightForwarderName1(e.target.value)}
              tabIndex={22}
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
                  className="me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleIconClick("claimantparty")}
                  tabIndex={23}
                />
                <FaPlus
                  style={{ cursor: "pointer" }}
                  onClick={saveClaimanParty}
                  tabIndex={24}
                />
              </div>

              {/* CLAIMANT CODE INPUT WITH DROPDOWN */}
              <div className="col-sm-2 position-relative">
                <input
                  ref={claimantCodeRef}
                  id="claimantPartyCode"
                  className="form-control"
                  placeholder="CODE"
                  value={claimantCode}
                  onChange={handleClaimantChange}
                  onKeyDown={handleClaimantKeyDown}
                  onBlur={handleClaimantFocusOut}
                  onFocus={() => setClaimantError(false)}
                  tabIndex={25}
                />

                {showClaimantDropdown &&
                  filteredClaimantSuggestions.length > 0 && (
                    <div className="dropdown-suggestions">
                      {filteredClaimantSuggestions.map((item, index) => {
                        const [code, , name] = item.split(":");

                        return (
                          <div
                            key={code}
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
                            {code} - {name}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>

              <div className="col-sm-2">
                <input
                  id="claimantPartyCruei"
                  className="form-control"
                  placeholder="CRUEI"
                  value={claimant?.CRUEI || claimantCruei || ""}
                  onChange={(e) => setClaimantCruei(e.target.value)}
                  tabIndex={26}
                />
              </div>

              <div className="col-sm-3">
                <input
                  id="claimantPartyName"
                  className="form-control"
                  placeholder="NAME"
                  value={claimant?.Name || claimantName || ""}
                  onChange={(e) => setClaimantName(e.target.value)}
                  tabIndex={27}
                />
              </div>

              <div className="col-sm-2">
                <input
                  id="claimantPartyName1"
                  className="form-control"
                  placeholder="NAME1"
                  value={claimant?.Name1 || claimantName1 || ""}
                  onChange={(e) => setClaimantName1(e.target.value)}
                  tabIndex={28}
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
                  className="form-control"
                  placeholder="CLAIMANT ID"
                  value={claimant?.ClaimantName || claimantcmantName || ""}
                  onChange={(e) => setclaimantcmantName(e.target.value)}
                  tabIndex={29}
                />
              </div>

              <div className="col-sm-5">
                <input
                  type="text"
                  id="claimantName"
                  className="form-control"
                  placeholder="CLAIMANT NAME"
                  value={claimant?.ClaimantName1 || claimantcmantName1 || ""}
                  onChange={(e) => setclaimantcmantName1(e.target.value)}
                  tabIndex={30}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-4 d-flex justify-content-center gap-3">
          <button
            className="NextpageBtns view-nav-btn"
            tabIndex={31}
            id="PartySaveDraft"
            onClick={handleSaveAsDraftClick}
          >
            SAVE AS DRAFT
          </button>
          <button
            className="NextpageBtns view-nav-btn"
            tabIndex={32}
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
            tabIndex={33}
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
