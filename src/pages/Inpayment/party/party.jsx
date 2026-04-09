import { useState, useEffect, useContext, useRef } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { fetchPopupData, SearchPopup, currentPopup } from "./partyFunctions";
import API from "../../../api/api";
import { UserContext } from "../../../userContex/userContex";
import { useInpayment } from "../context/inpaymentContext";

function Party({ setActiveTab }) {
  const { user } = useContext(UserContext);

  // Get global states and setters from context
  const {
    importerCode,
    setImporterCode,
    importerCruei,
    setImporterCruei,
    importerName,
    setImporterName,
    importerName1,
    setImporterName1,
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
  } = useInpayment();
  useEffect(() => {
    console.log("Party Component -  State Changed:", {
      importerCode,
      importerCruei,
      importerName,
      importerName1,
      inwardCode,
      inwardCruei,
      inwardName,
      inwardName1,
      freightForwarderCode,
      freightForwarderCruei,
      freightForwardName,
      freightForwardName1,
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
    });
  }, [
    importerCode,
    importerCruei,
    importerName,
    importerName1,
    inwardCode,
    inwardCruei,
    inwardName,
    inwardName1,
    freightForwarderCode,
    freightForwarderCruei,
    freightForwardName,
    freightForwardName1,
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
  ]);

  // ===== States =====
  // ui styles
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

    const filtered = importerSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );

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

    const filtered = inwardSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );
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

    const filtered = freightForwarderSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );
    setFreightForwarSuggestions(filtered.slice(0, 100));
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
  // ------------------------------UI---------------------
  return (
    <div className="row g-2">
      <div className="col-12">
        {/* DECLARANT COMPANY */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">DECLARANT COMPANY</label>
          <div className="col-sm-1"></div>
          <div className="col-sm-1">
            <input className="form-control" value="headdata" disabled />
          </div>
          <div className="col-sm-2">
            <input className="form-control" value="headCrueiNo" disabled />
          </div>
          <div className="col-sm-3">
            <input className="form-control" value="headname" disabled />
          </div>
          <div className="col-sm-3">
            <input className="form-control" value="headname1" disabled />
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
            />
            <FaPlus style={{ cursor: "pointer" }} onClick={saveImporter} />
          </div>
          <div className="col-sm-1 position-relative">
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
          </div>
          <div className="col-sm-3">
            <input
              id="importerName"
              className="form-control-mandatory"
              placeholder="NAME"
              value={importer?.Name || importerName || ""}
              onChange={(e) => setImporterName(e.target.value)}
            />
          </div>
          <div className="col-sm-3">
            <input
              id="importerName1"
              className="form-control-mandatory"
              placeholder="NAME1"
              value={importer?.Name1 || importerName1 || ""}
              onChange={(e) => setImporterName1(e.target.value)}
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
            />
            <FaPlus style={{ cursor: "pointer" }} onClick={saveInward} />
          </div>
          <div className="col-sm-1 position-relative">
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
              className={
                isSea || isAir ? "form-control-mandatory" : "form-control"
              }
              placeholder="CRUEI"
              value={inwardAgent?.CRUEI || inwardCruei || ""}
              onChange={(e) => setInwardCruei(e.target.value)}
            />
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
          <div className="col-sm-3">
            <input
              id="inwardName1"
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
            />
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={saveFreightForwarder}
            />
          </div>
          <div className="col-sm-1 position-relative">
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
          <div className="col-sm-3">
            <input
              className="form-control"
              id="freightForwarderName1"
              placeholder="NAME1"
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
                  className="me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleIconClick("claimantparty")}
                />
                <FaPlus
                  style={{ cursor: "pointer" }}
                  onClick={saveClaimanParty}
                />
              </div>

              {/* CLAIMANT CODE INPUT WITH DROPDOWN */}
              <div className="col-sm-1 position-relative">
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
                />
              </div>

              <div className="col-sm-3">
                <input
                  id="claimantPartyName"
                  className="form-control"
                  placeholder="NAME"
                  value={claimant?.Name || claimantName || ""}
                  onChange={(e) => setClaimantName(e.target.value)}
                />
              </div>

              <div className="col-sm-3">
                <input
                  id="claimantPartyName1"
                  className="form-control"
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

              <div className="col-sm-1">
                <input
                  type="text"
                  id="claimantId"
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
                  className="form-control"
                  placeholder="CLAIMANT NAME"
                  value={claimant?.ClaimantName1 || claimantcmantName1 || ""}
                  onChange={(e) => setclaimantcmantName1(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-4 d-flex justify-content-center gap-3">
          <button
            className="NextpageBtns"
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
            className="NextpageBtns"
            onClick={() => setActiveTab("CargoTab")}
          >
            NEXT
          </button>
        </div>
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
