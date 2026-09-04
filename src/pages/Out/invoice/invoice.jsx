import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import API from "../../../api/api";
import { UserContext } from "../../../userContex/userContex";
import { fetchPopupData, currentPopup, SearchPopup } from "./invoiceFunctions";
import { DateField } from "../cargo/cargo";
import { useOut } from "../context/outContext";
import { useNavigate } from "react-router-dom";
import { useDebounceAutoSave } from "../../../autoSave/useDebounceAutoSave";
import { CircleLoader } from "react-spinners";

function Invoice({ setActiveTab, isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    permitDetails,
    updatePermitDetails,

    invoiceExporterCode,
    setInvoiceExporterCode,
    invoiceExporterCruei,
    setInvoiceExporterCruei,
    invoiceExporterName,
    setInvoiceExporterName,
    invoiceExporterName1,
    setInvoiceExporterName1,
    invoiceTable,
    setInvoiceTable,
    invoiceSerialNumber,
    setInvoiceSerialNumber,
    invoiceNumber,
    setInvoiceNumber,
    invoiceDate,
    setInvoiceDate,
    adValoremIndicator,
    setAdValoremIndicator,
    preDutyRateIndicator,
    setPreDutyRateIndicator,
    invoiceInsurance,
    setInvoiceInsurance,
    supplierRelationship,
    setSupplierRelationship,
    termTypeSelected,
    setTermTypeSelected,
    showFreightRow,
    setShowFreightRow,
    showInsuranceRow,
    setShowInsuranceRow,
    supplierManuFacturer,
    setSupplierManuFacturer,
    supplierManuFacturerCode,
    setSupplierManuFacturerCode,
    supplierManuFacturerCruei,
    setSupplierManuFacturerCruei,
    supplierManuFacturerName,
    setSupplierManuFacturerName,
    supplierManuFacturerName1,
    setSupplierManuFacturerName1,
    invoiceCurrency,
    setInvoiceCurrency,
    invoiceExRate,
    setInvoiceExRate,
    invoiceAmount,
    setInvoiceAmount,
    invoiceDollar,
    setInvoiceDollar,
    otherValueCharges,
    setOtherValueCharges,
    otherValueCurrency,
    setOtherValueCurrency,
    otherValueExRate,
    setOtherValueExRate,
    otherValueAmount,
    setOtherValueAmount,
    otherValueDollar,
    setOtherValueDollar,
    freightValueCharges,
    setFreightValueCharges,
    freightValueCurrency,
    setFreightValueCurrency,
    freightValueExRate,
    setFreightValueExRate,
    freightValueAmount,
    setFreightValueAmount,
    freightValueDollar,
    setFreightValueDollar,
    insuranceCharges,
    setInsuranceCharges,
    insuranceValueCurrency,
    setInsuranceValueCurrency,
    insuranceValueExRate,
    setInsuranceValueExRate,
    insuranceValueAmount,
    setInsuranceValueAmount,
    insuranceValueDollar,
    setInsuranceValueDollar,
    cifTotal,
    setCifTotal,
    gstCharge,
    setGstCharge,
    gstTotal,
    setGstTotal,

    exporterCode,
    exporterCruei,
    exporterName,
    exporterName1,

    // ==============EXISITING STATES FOR SAVE AS DRAFT============
    decType,
    prevPermitNo,
    cargo,
    transportMode,
    bgInd,
    supplyInd,
    refDocs,
    declFor,
    Licence,
    Recipients,
    importerCode,
    inwardCode,
    freightForwarderCode,
    claimantCode,
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
    cargoHawb,
    arrivalDate,
    loadingPortCode,
    releaseCode,
    releaseLocationDescription,
    receiptCode,
    receiptLocationDescription,
    totalOuterPackValue,
    totalOuterPackName,
    totalGrossWeight,
    grossUOM,
    blanketStartDate,
  } = useOut();
  const [isInvoiceSaving, setIsInvoiceSaving] = useState(false);
  const [isInvoiceDeleting, setIsInvoiceDeleting] = useState(false);
  const [editingSNo, setEditingSNo] = useState(null);
  const [serialNumber, setSerialNumber] = useState(1);
  const [invoiceNumberError, setInvoiceNumberError] = useState(false);
  const [invoiceDateError, setInvoiceDateError] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);

  const supplierImporterRelationship = ["Ordinary Importer", "Agency"];
  const [freightChargesEnabled, setFreightChargesEnabled] = useState(false);
  const [insuranceChargesEnabled, setInsuranceChargesEnabled] = useState(false);
  // ======================== SUPPLIER / MANUFACTURER ========================
  const supplierManuFacturerCodeRef = useRef(null);
  const [supplierManuFacturerNameError, setSupplierManuFacturerNameError] =
    useState(false);

  useState("");
  const [supplierManuFacturerSuggestions, setSupplierManuFacturerSuggestions] =
    useState([]);
  const [
    filteredSupplierManuFacturerSuggestions,
    setFilteredSupplierManuFacturerSuggestions,
  ] = useState([]);
  const [
    showSupplierManuFacturerDropdown,
    setShowSupplierManuFacturerDropdown,
  ] = useState(false);
  const [
    highlightedSupplierManuFacturerIndex,
    setHighlightedSupplierManuFacturerIndex,
  ] = useState(0);
  const [supplierManuFacturerError, setSupplierManuFacturerError] =
    useState(false);

  // ======================== FETCH SUPPLIER / MANUFACTURER ========================
  useEffect(() => {
    const fetchsupplierManuFacturer = async () => {
      try {
        const response = await API.get(
          "/getCommonSupplierManufacturerPartTableInfo/",
        );
        const list = response.data.map(
          (i) => `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}`,
        );
        setSupplierManuFacturerSuggestions(list);
        setFilteredSupplierManuFacturerSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch suppliers", err);
      }
    };
    fetchsupplierManuFacturer();
  }, []);

  const handleSupplierManuFacturerChange = (e) => {
    const val = e.target.value;
    setSupplierManuFacturerCode(val);
    setSupplierManuFacturerError(false);
    setHighlightedSupplierManuFacturerIndex(0);
    if (!val) {
      setShowSupplierManuFacturerDropdown(false);
      return;
    }
    const filtered = supplierManuFacturerSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );
    setFilteredSupplierManuFacturerSuggestions(filtered.slice(0, 100));
    setShowSupplierManuFacturerDropdown(filtered.length > 0);
  };

  const handleSupplierManuFacturerKeyDown = (e) => {
    if (
      !showSupplierManuFacturerDropdown ||
      filteredSupplierManuFacturerSuggestions.length === 0
    )
      return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedSupplierManuFacturerIndex((prev) =>
        prev + 1 >= filteredSupplierManuFacturerSuggestions.length
          ? 0
          : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedSupplierManuFacturerIndex((prev) =>
        prev - 1 < 0
          ? filteredSupplierManuFacturerSuggestions.length - 1
          : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleSupplierManuFacturerSelect(
        filteredSupplierManuFacturerSuggestions[
          highlightedSupplierManuFacturerIndex
        ],
      );
    }
  };

  const handleSupplierManuFacturerSelect = (item) => {
    const [code, cruei, name, name1] = item.split(":");
    setSupplierManuFacturer({
      Code: code,
      CRUEI: cruei,
      Name: name,
      Name1: name1,
    });
    setSupplierManuFacturerCode(code);
    setSupplierManuFacturerCruei(cruei);
    setSupplierManuFacturerName(name);
    setSupplierManuFacturerName1(name1);
    setShowSupplierManuFacturerDropdown(false);
    setSupplierManuFacturerError(false);
  };

  const handleSupplierManuFacturerFocusOut = () => {
    setTimeout(() => {
      if (!supplierManuFacturerCode) {
        setSupplierManuFacturer(null);
        setSupplierManuFacturerCruei("");
        setSupplierManuFacturerName("");
        setSupplierManuFacturerName1("");
        setSupplierManuFacturerError(true);
        setShowSupplierManuFacturerDropdown(false);
        return;
      }
      const selected = supplierManuFacturerSuggestions
        .map((i) => i.split(":"))
        .find(
          ([code]) =>
            code.toLowerCase() === supplierManuFacturerCode.toLowerCase(),
        );
      if (selected) {
        const [code, cruei, name, name1] = selected;
        setSupplierManuFacturer({
          Code: code,
          CRUEI: cruei,
          Name: name,
          Name1: name1,
        });
        setSupplierManuFacturerCode(code);
        setSupplierManuFacturerCruei(cruei);
        setSupplierManuFacturerName(name);
        setSupplierManuFacturerName1(name1);
        setSupplierManuFacturerError(false);
      } else {
        setSupplierManuFacturer(null);
        setSupplierManuFacturerError(true);
      }
      setShowSupplierManuFacturerDropdown(false);
    }, 150);
  };

  const saveSupplierManuFacturer = async () => {
    if (!supplierManuFacturerCode) {
      setSupplierManuFacturerError(true);
      alert("Code is required!");
      return;
    }
    const duplicate = supplierManuFacturerSuggestions.some(
      (i) =>
        i.split(":")[0].toLowerCase() ===
        supplierManuFacturerCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! Supplier/Manufacturer not saved.");
      return;
    }
    const payload = {
      Id: supplierManuFacturer?.Id || 0,
      Code: supplierManuFacturerCode || "",
      CRUEI: supplierManuFacturerCruei || "",
      Name: supplierManuFacturerName || "",
      Name1: supplierManuFacturerName1 || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };
    try {
      const response = await API.post(
        "/postSupplierManufacturerPartTable/",
        payload,
      );
      alert(
        response.data?.message || "Supplier/Manufacturer saved successfully!",
      );
    } catch (err) {
      if (err.response?.status === 400) {
        alert(
          err.response.data?.error || "Failed to save Supplier/Manufacturer",
        );
      } else {
        alert(
          "Failed to save Supplier/Manufacturer, check console for details",
        );
      }
    }
  };

  // ======================== IMPORTER ========================
  const exporterCodeRef = useRef(null);
  const [exporter, setExporter] = useState(null);
  const [exporterCodeError, setExporterCodeError] = useState(false);
  const [exporterSuggestions, setExporterSuggestions] = useState([]);
  const [commonExporterCodes, setCommonExporterCodes] = useState(new Set());
  const [filteredExporterSuggestions, setFilteredExporterSuggestions] =
    useState([]);
  const [showExporterDropdown, setShowExporterDropdown] = useState(false);
  const [exporterHighlightedIndex, setExporterHighlightedIndex] = useState(0);
  const [exporterError, setExporterError] = useState(false);

  // Copy Importer from Party page
  const copyExporter = () => {
    if (!exporterCode) {
      alert("Exporter not filled in Party page");
      return;
    }
    setInvoiceExporterCode(exporterCode);
    setInvoiceExporterCruei(exporterCruei);
    setInvoiceExporterName(exporterName);
    setInvoiceExporterName1(exporterName1);

    setExporter({
      Code: exporterCode,
      CRUEI: exporterCruei,
      Name: exporterName,
      Name1: exporterName1,
    });

    setExporterError(false);
    setExporterCodeError(false);
  };
  // ======================== FETCH IMPORTERS ========================
  useEffect(() => {
    const fetchExporter = async () => {
      try {
        const [commonResult, outtResult] = await Promise.allSettled([
          API.get("/getCommonExporterTableInfo/"),
          API.get("out/getOutExporterTableInfo/"),
        ]);

        const commonData =
          commonResult.status === "fulfilled"
            ? commonResult.value.data || []
            : [];
        const outData =
          outtResult.status === "fulfilled" ? outtResult.value.data || [] : [];

        if (commonResult.status === "rejected") {
          console.error(
            "Failed to fetch Common Exporters",
            commonResult.reason,
          );
        }
        if (outtResult.status === "rejected") {
          console.error("Failed to fetch Out Exporters", outtResult.reason);
        }

        // Normalize both schemas to one common shape BEFORE merging.
        // /getCommonExporterTableInfo/ uses plain Code/CRUEI/Name/Name1/Address...
        // out/getOutExporterTableInfo/ uses OutUserCode/OutUserCRUEI/OutUserName...
        const normalize = (i) => ({
          Code: i.Code ?? i.OutUserCode ?? "",
          CRUEI: i.CRUEI ?? i.OutUserCRUEI ?? "",
          Name: i.Name ?? i.OutUserName ?? "",
          Name1: i.Name1 ?? i.OutUserName1 ?? "",
          Address: i.Address ?? i.OutUserAddress ?? "",
          Address1: i.Address1 ?? i.OutUserAddress1 ?? "",
          City: i.City ?? i.OutUserCity ?? "",
          SubCode: i.SubCode ?? i.OutUserSubCode ?? "",
          Sub: i.Sub ?? i.OutUserSub ?? "",
          Postal: i.Postal ?? i.OutUserPostal ?? "",
          Country: i.Country ?? i.OutUserCountry ?? "",
        });

        const normCommon = commonData.map(normalize);
        const normOut = outData.map(normalize);

        // De-dupe by lowercased Code across BOTH sources (and within each
        // source too) using a Map, so a code repeated anywhere never ends
        // up twice in the merged list — fixes the duplicate React key
        // warning (e.g. "DAL" appearing twice).
        const byCode = new Map();
        for (const item of normCommon) {
          const key = item.Code.toLowerCase();
          if (key && !byCode.has(key)) byCode.set(key, item);
        }
        for (const item of normOut) {
          const key = item.Code.toLowerCase();
          if (key && !byCode.has(key)) byCode.set(key, item);
        }
        const merged = Array.from(byCode.values());

        const list = merged.map(
          (i) =>
            `${i.Code}:${i.CRUEI}:${i.Name}:${i.Name1}:${i.Address}:${i.Address1}:${i.City}:${i.SubCode}:${i.Sub}:${i.Postal}:${i.Country}`,
        );

        setExporterSuggestions(list);
        setFilteredExporterSuggestions(list);
      } catch (err) {
        console.error("Failed to fetch exporters", err);
      }
    };
    fetchExporter();
  }, []);

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
        Code.toLowerCase().startsWith(search) ||
        Name.toLowerCase().startsWith(search)
      );
    });
    setFilteredExporterSuggestions(filtered.slice(0, 100));
    setShowExporterDropdown(filtered.length > 0);
  };

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

  const handleExporterSelect = (item) => {
    const [code, cruei, name, name1] = item.split(":");
    setExporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
    setInvoiceExporterCode(code);
    setInvoiceExporterCruei(cruei);
    setInvoiceExporterName(name);
    setInvoiceExporterName1(name1);
    setShowExporterDropdown(false);
    setExporterError(false);
  };

  const handleFocusOut = () => {
    setTimeout(() => {
      if (!invoiceExporterCode) {
        setExporter(null);
        setInvoiceExporterCruei("");
        setInvoiceExporterName("");
        setInvoiceExporterName1("");
        setExporterError(true);
        setShowExporterDropdown(false);
        return;
      }
      const selected = exporterSuggestions
        .map((i) => i.split(":"))
        .find(
          ([code]) => code.toLowerCase() === invoiceExporterCode.toLowerCase(),
        );
      if (selected) {
        const [code, cruei, name, name1] = selected;
        setExporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
        setInvoiceExporterCode(code);
        setInvoiceExporterCruei(cruei);
        setInvoiceExporterName(name);
        setInvoiceExporterName1(name1);
        setExporterError(false);
      } else {
        setExporter(null);
        setExporterError(true);
      }
      setShowExporterDropdown(false);
    }, 150);
  };

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
      Address: exporter?.Address || "",
      Address1: exporter?.Address1 || "",
      City: exporter?.City || "",
      SubCode: exporter?.SubCode || "",
      Sub: exporter?.Sub || "",
      Postal: exporter?.Postal || "",
      Country: exporter?.Country || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
    };

    console.log("Exporter payload to save:", payload);

    try {
      const response = await API.post("/postExporterTable/", payload);
      alert(
        response.data?.message ||
          response.data?.Result ||
          "Exporter saved successfully!",
      );
      console.log("Saved data:", response.data);

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

  // ======================== POPUP ========================
  const [popupType, setPopupType] = useState(null);
  const [popupData, setPopupData] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentPopupConfig = currentPopup(popupType, {
    setSupplierManuFacturer,
    setSupplierManuFacturerCode,
    setSupplierManuFacturerCruei,
    setSupplierManuFacturerName,
    setSupplierManuFacturerName1,
    setExporter,
    setExporterCode: setInvoiceExporterCode,
    setExporterCruei: setInvoiceExporterCruei,
    setExporterName: setInvoiceExporterName,
    setExporterName1: setInvoiceExporterName1,
  });

  const handleIconClick = async (type) => {
    setPopupType(type);
    await fetchPopupData(type, setPopupData, setLoading);
  };

  // ======================== TERM TYPE ========================
  const [termType, setTermType] = useState([]);

  const [currency, setCurrency] = useState([]);

  const [invoiceCurrencyError, setInvoiceCurrencyError] = useState("");

  // ======================== FETCH TERM TYPE ========================
  useEffect(() => {
    const fetchTermType = async () => {
      try {
        const response = await API.get("/getTermTypeFromCommonMaster/");
        setTermType(response.data);
      } catch (err) {
        console.error("Failed to fetch term type", err);
      }
    };
    fetchTermType();
  }, []);

  // ======================== FETCH CURRENCY ========================
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await API.get("/getCommonCurrencyTableInfo/");
        setCurrency(response.data);
      } catch (err) {
        console.error("Failed to fetch currency", err);
      }
    };
    fetchCurrency();
  }, []);

  const handleInvoiceNumberChange = (e) => {
    const value = e.target.value;
    // Allow typing freely — only restrict character set (no invalid symbols at all)
    const isValid = /^[a-zA-Z0-9\-/:]*$/.test(value);
    if (isValid) {
      setInvoiceNumber(value);
    }
  };

  // ======================== TERM TYPE CHANGE ========================
  // const handleTermChange = (val) => {
  //   setTermTypeSelected(val);
  //   setInvoiceAmount("");
  //   setInvoiceDollar("");
  //   setOtherValueAmount("");
  //   setOtherValueDollar("");
  //   setFreightValueAmount("");
  //   setFreightValueDollar("");
  //   setInsuranceValueAmount("");
  //   setInsuranceValueDollar("");
  //   setFreightChargesEnabled(false);
  //   setInsuranceChargesEnabled(false);
  //   setInvoiceCurrency("");
  //   setOtherValueCurrency("");
  //   setFreightValueCurrency("");
  //   setInsuranceValueCurrency("");
  //   setInvoiceExRate("");
  //   setOtherValueExRate("");
  //   setFreightValueExRate("");
  //   setInsuranceValueExRate("");
  //   setGstCharge(9);
  //   setShowFreightRow(true);
  //   setShowInsuranceRow(true);

  //   if (val === "CFR : Cost and Frieght ( also known as C & F )") {
  //     setShowFreightRow(false);
  //     setShowInsuranceRow(true);
  //     setInsuranceCharges("1.00");
  //     setInsuranceValueCurrency("SGD");
  //     setInsuranceValueExRate("1.000000");
  //   } else if (val === "CIF : Cost,Insurance and Frieght") {
  //     setShowFreightRow(false);
  //     setShowInsuranceRow(false);
  //   } else if (val === "CNI : Cost and Insurance (also Known as C & I )") {
  //     setShowFreightRow(true);
  //     setShowInsuranceRow(false);
  //   } else if (val === "EXW : Exw Works (also known as Ex-Factory)") {
  //     setShowFreightRow(true);
  //     setShowInsuranceRow(true);
  //     setInsuranceCharges("1.00");
  //     setInsuranceValueCurrency("SGD");
  //     setInsuranceValueExRate("1.000000");
  //   } else if (val === "FAS : Free Alongside Ship") {
  //     setShowFreightRow(true);
  //     setShowInsuranceRow(true);
  //     setInsuranceCharges("1.00");
  //     setInsuranceValueCurrency("SGD");
  //     setInsuranceValueExRate("1.000000");
  //   } else if (val === "FOB : Free On Board") {
  //     setShowFreightRow(true);
  //     setShowInsuranceRow(true);
  //     setInsuranceCharges("1.00");
  //     setInsuranceValueCurrency("SGD");
  //     setInsuranceValueExRate("1.000000");
  //   }
  // };

  // ======================== AMOUNT CHANGE ========================
  // const handleAmountChange = (value, row) => {
  //   const num = value === "" ? "" : parseFloat(value);
  //   if (row === "invoice") setInvoiceAmount(num);
  //   else if (row === "other") setOtherValueAmount(num);
  //   else if (row === "freight") setFreightValueAmount(num);
  //   else if (row === "insurance") setInsuranceValueAmount(num);
  // };

  const handleAmountChange = (value, row) => {
    const isValidInput = value === "" || /^\d*\.?\d*$/.test(value);
    if (!isValidInput) return;

    if (row === "invoice") setInvoiceAmount(value);
    // else if (row === "other") setOtherValueAmount(value);
    // else if (row === "freight") setFreightValueAmount(value);
    // else if (row === "insurance") setInsuranceValueAmount(value);
  };

  // ======================== CURRENCY CHANGE ========================
  const handleCurrencyChange = (currencyName, row) => {
    const selected = currency.find((item) => item.Currency === currencyName);
    const rate = selected ? selected.CurrencyRate : 0;
    if (row === "invoice") {
      setInvoiceCurrency(currencyName);
      setInvoiceExRate(rate);
    }
    // if (row === "other") {
    //   setOtherValueCurrency(currencyName);
    //   setOtherValueExRate(rate);
    // }
    // if (row === "freight") {
    //   setFreightValueCurrency(currencyName);
    //   setFreightValueExRate(rate);
    // }
    // if (row === "insurance") {
    //   setInsuranceValueCurrency(currencyName);
    //   setInsuranceValueExRate(rate);
    //   // Reset all insurance values to 0 when currency is selected/changed
    //   setInsuranceCharges(0);
    //   setInsuranceValueAmount(0);
    //   setInsuranceValueDollar(0);
    // }
  };

  // ======================== CALCULATIONS ========================
  useEffect(() => {
    const invAmount = parseFloat(invoiceAmount) || 0;
    const invEx = parseFloat(invoiceExRate) || 0;
    const invDollar = invAmount * invEx;

    // const othAmount = parseFloat(otherValueAmount) || 0;
    // const othEx = parseFloat(otherValueExRate) || 0;
    // const othDollar = othAmount * othEx;

    // const frCharge = parseFloat(freightValueCharges) || 0;
    // const frEx = parseFloat(freightValueExRate) || 0;
    // let frAmount = parseFloat(freightValueAmount) || 0;

    // if (frCharge > 0) {
    //   // const freightBase = invDollar + othDollar;
    //   const freightBase = invDollar;
    //   const frDollarCalculated = (freightBase * frCharge) / 100;
    //   const calculatedAmount = frDollarCalculated / frEx;
    //   if (freightValueAmount !== calculatedAmount.toFixed(2)) {
    //     setFreightValueAmount(calculatedAmount.toFixed(2));
    //   }
    //   frAmount = calculatedAmount;
    // }
    // const frDollar = frAmount * frEx;

    // const charge = parseFloat(insuranceCharges) || 0;

    // const insuranceBase = showFreightRow ? invDollar + frDollar : invDollar;
    // const insAmount = (insuranceBase * charge) / 100;
    // if (insuranceValueAmount !== insAmount.toFixed(2)) {
    //   setInsuranceValueAmount(insAmount.toFixed(2));
    // }

    // let insAmount;

    // if (charge === 0) {
    //   //  Manual entry — keep user typed value, just calculate dollar
    //   insAmount = parseFloat(insuranceValueAmount) || 0;
    // } else {
    //   // Auto-calculate from base percentage
    //   const insuranceBase = showFreightRow ? invDollar + frDollar : invDollar;
    //   insAmount = (insuranceBase * charge) / 100;
    //   if (insuranceValueAmount !== insAmount.toFixed(2)) {
    //     setInsuranceValueAmount(insAmount.toFixed(2));
    //   }
    // }

    // const insEx = parseFloat(insuranceValueExRate) || 0;
    // const insDollar = insAmount * insEx;

    setInvoiceDollar(invDollar.toFixed(2));
    // setOtherValueDollar(othDollar.toFixed(2));
    // setFreightValueDollar(frDollar.toFixed(2));
    // setInsuranceValueDollar(insDollar.toFixed(2));

    const totalCIF = invDollar;
    // othDollar +
    // (showFreightRow ? frDollar : 0) +
    // (showInsuranceRow ? insDollar : 0);
    setCifTotal(totalCIF.toFixed(2));

    // const gstPercent = parseFloat(gstCharge) || 0;
    // setGstTotal((totalCIF * (gstPercent / 100)).toFixed(2));
  }, [
    invoiceAmount,
    invoiceExRate,
    // otherValueAmount,
    // otherValueExRate,
    // freightValueAmount,
    // freightValueExRate,
    // freightValueCharges,
    // insuranceCharges,
    // insuranceValueAmount,
    // insuranceValueExRate,
    // gstCharge,
    // showFreightRow,
    // showInsuranceRow,
  ]);

  // ======================== VALIDATE ========================
  const validateInvoiceFields = () => {
    let check = true;
    const safeTrim = (v) => (v ? String(v).trim() : "");

    if (safeTrim(invoiceExporterCode) === "") {
      setExporterCodeError(true);
      check = false;
    } else setExporterCodeError(false);

    if (safeTrim(invoiceNumber) === "") {
      setInvoiceNumberError(true);
      check = false;
    } else setInvoiceNumberError(false);

    if (safeTrim(invoiceDate) === "") {
      setInvoiceDateError(true);
      check = false;
    } else setInvoiceDateError(false);

    if (safeTrim(invoiceCurrency) === "") {
      setInvoiceCurrencyError(true);
      check = false;
    } else setInvoiceCurrencyError(false);

    // if (safeTrim(supplierManuFacturerName) === "") {
    //   setSupplierManuFacturerNameError(true);
    //   check = false;
    // } else setSupplierManuFacturerNameError(false);

    return check;
  };

  // ======================== FORMAT DATE ========================
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  // ======================== SAVE INVOICE ========================
  // const saveInvoice = async () => {
  //   console.log("hello");
  //   if (!validateInvoiceFields()) return;
  //   const payload = {
  //     PermitId: permitDetails?.PermitId,
  //     SNo: editingSNo || serialNumber,
  //     InvoiceNo: invoiceNumber,
  //     InvoiceDate: formatDate(invoiceDate),
  //     TermType: termTypeSelected.toUpperCase(),
  //     AdValoremIndicator: adValoremIndicator || "False",
  //     PreDutyRateIndicator: preDutyRateIndicator || "False",
  //     SupplierImporterRelationship: supplierRelationship || "--Select--",
  //     SupplierCode: supplierManuFacturerCode || "-",
  //     ImportPartyCode: invoiceExporterCode || "",
  //     TICurrency: invoiceCurrency,
  //     TIExRate: Number(invoiceExRate) || 0,
  //     TIAmount: Number(invoiceAmount) || 0,
  //     TISAmount: Number(invoiceDollar) || 0,
  //     OTCCharge: Number(otherValueCharges) || 0,
  //     OTCCurrency: otherValueCurrency || "--Select--",
  //     OTCExRate: Number(otherValueExRate) || 0,
  //     OTCAmount: Number(otherValueAmount) || 0,
  //     OTCSAmount: Number(otherValueDollar) || 0,
  //     FCCharge: Number(freightValueCharges) || 0,
  //     FCCurrency: freightValueCurrency || "--Select--",
  //     FCExRate: Number(freightValueExRate) || 0,
  //     FCAmount: Number(freightValueAmount) || 0,
  //     FCSAmount: Number(freightValueDollar) || 0,
  //     ICCharge: Number(insuranceCharges) || 0,
  //     ICCurrency: insuranceValueCurrency,
  //     ICExRate: Number(insuranceValueExRate) || 0,
  //     ICAmount: Number(insuranceValueAmount) || 0,
  //     ICSAmount: Number(insuranceValueDollar) || 0,
  //     CIFSUMAmount: Number(cifTotal) || 0,
  //     GSTPercentage: Number(gstCharge) || 0,
  //     GSTSUMAmount: Number(gstTotal) || 0,
  //     MessageType: "OUTDEC",
  //     TouchUser: user.username,
  //     TouchTime: new Date().toISOString(),
  //     ChkOtherInv: invoiceInsurance || "No",
  //   };
  //   try {
  //     const res = await API.post("/postInvoiceTable/", payload);
  //     if (res.data?.Records) {
  //       setInvoiceTable(res.data.Records);
  //     } else {
  //       setInvoiceTable((prev) => {
  //         if (editingSNo) {
  //           return prev.map((inv) => (inv.SNo === editingSNo ? payload : inv));
  //         }
  //         return [...prev, payload];
  //       });
  //     }
  //     setEditingSNo(null);
  //     setSerialNumber((prev) => Number(prev) + 1);
  //     resetInvoiceForm();
  //   } catch (error) {
  //     console.error("Save failed", error);
  //   }
  // };

  const saveInvoice = async () => {
    console.log("hello");
    if (!validateInvoiceFields()) return;
    const payload = {
      PermitId: permitDetails?.PermitId,
      SNo: editingSNo || serialNumber,
      InvoiceNo: invoiceNumber.toUpperCase(),
      InvoiceDate: formatDate(invoiceDate),
      TermType: termTypeSelected.toUpperCase(),
      AdValoremIndicator: "False",
      PreDutyRateIndicator: preDutyRateIndicator || "False",
      SupplierImporterRelationship: supplierRelationship || "--Select--",
      SupplierCode: supplierManuFacturerCode || "-",
      ImportPartyCode: invoiceExporterCode || "",
      ExportPartyCode: invoiceExporterCode || "",
      TICurrency: invoiceCurrency,
      TIExRate: Number(invoiceExRate) || 0,
      TIAmount: Number(invoiceAmount) || 0,
      TISAmount: Number(invoiceDollar) || 0,
      OTCCharge: Number(otherValueCharges) || 0,
      OTCCurrency: otherValueCurrency || "--Select--",
      OTCExRate: Number(otherValueExRate) || 0,
      OTCAmount: Number(otherValueAmount) || 0,
      OTCSAmount: Number(otherValueDollar) || 0,
      FCCharge: Number(freightValueCharges) || 0,
      FCCurrency: freightValueCurrency || "--Select--",
      FCExRate: Number(freightValueExRate) || 0,
      FCAmount: Number(freightValueAmount) || 0,
      FCSAmount: Number(freightValueDollar) || 0,
      ICCharge: Number(insuranceCharges) || 0,
      ICCurrency: insuranceValueCurrency,
      ICExRate: Number(insuranceValueExRate) || 0,
      ICAmount: Number(insuranceValueAmount) || 0,
      ICSAmount: Number(insuranceValueDollar) || 0,
      CIFSUMAmount: Number(cifTotal) || 0,
      GSTPercentage: Number(gstCharge) || 0,
      GSTSUMAmount: Number(gstTotal) || 0,
      MessageType: "OUTDEC",
      TouchUser: user.username,
      TouchTime: new Date().toISOString(),
      ChkOtherInv: invoiceInsurance || "No",
    };
    let commonSaved = false;
    //   setIsInvoiceSaving(true);
    //   try {
    //     // Step 1: Save to CommonInvoiceDtl
    //     const commonResponse = await API.post("/postInvoiceTable/", payload);
    //     commonSaved = true;
    //     console.log("Saved to CommonInvoiceDtl:", commonResponse.data);

    //     // Step 2: Save to InvoiceDtl (inpayment)
    //     const outResponse = await API.post("out/postOutInvoiceTable/", payload);
    //     console.log("Saved to InvoiceDtl:", outResponse.data);

    //     if (commonResponse.data?.Records) {
    //       setInvoiceTable(commonResponse.data.Records);
    //     } else {
    //       setInvoiceTable((prev) => {
    //         if (editingSNo) {
    //           return prev.map((inv) => (inv.SNo === editingSNo ? payload : inv));
    //         }
    //         return [...prev, payload];
    //       });
    //     }

    //     setEditingSNo(null);
    //     setSerialNumber((prev) => Number(prev) + 1);
    //     resetInvoiceForm();
    //   } catch (error) {
    //     console.error("Failed to save invoice:", error);
    //     if (commonSaved) {
    //       alert(
    //         `Warning: Invoice "${payload.InvoiceNo}" was saved to CommonInvoiceDtl but FAILED to save to InvoiceDtl. ` +
    //           `Please contact support or retry — this record is now inconsistent between tables.\n\n` +
    //           `Error: ${error.response?.data?.error || error.message}`,
    //       );
    //     } else if (error.response?.status === 400) {
    //       alert(
    //         error.response.data?.error ||
    //           error.response.data?.Result ||
    //           "Failed to save invoice",
    //       );
    //     } else {
    //       alert("Failed to save invoice, check console for details");
    //     }
    //   } finally {
    //     setIsInvoiceSaving(false);
    //   }
    // };

    setIsInvoiceSaving(true);
    try {
      // Single call — backend saves to CommonInvoiceDtl AND mirrors to
      // OutInvoiceDtl in one transaction, so there's no "saved to one
      // table but not the other" risk.
      const response = await API.post("out/postOutInvoiceTable/", payload);

      if (response.data?.Records) {
        setInvoiceTable(response.data.Records);
      } else {
        setInvoiceTable((prev) => {
          if (editingSNo) {
            return prev.map((inv) => (inv.SNo === editingSNo ? payload : inv));
          }
          return [...prev, payload];
        });
      }

      // Surface a non-blocking warning if the mirror write failed server-side
      if (response.data?.Warning) {
        alert(response.data.Warning);
      }

      setEditingSNo(null);
      setSerialNumber((prev) => Number(prev) + 1);
      resetInvoiceForm();
    } catch (error) {
      console.error("Failed to save invoice:", error);
      if (error.response?.status === 400) {
        alert(
          error.response.data?.error ||
            error.response.data?.Result ||
            "Failed to save invoice",
        );
      } else {
        alert("Failed to save invoice, check console for details");
      }
    } finally {
      setIsInvoiceSaving(false);
    }
  };

  // ======================== DELETE INVOICE ========================
  // const deleteInvoice = async (sno) => {
  //   try {
  //     const res = await API.post("/deleteInvoiceNo/", {
  //       SNo: sno,
  //       PermitId: permitDetails?.PermitId,
  //     });
  //     if (res.data?.Records) {
  //       setInvoiceTable(res.data.Records);
  //     } else {
  //       setInvoiceTable((prev) => prev.filter((inv) => inv.SNo !== sno));
  //     }
  //   } catch (error) {
  //     console.error("Delete failed", error);
  //   }
  // };

  // const deleteInvoice = async (sno) => {
  //   try {
  //     const res = await API.post("/deleteInvoiceNo/", {
  //       SNo: sno,
  //       PermitId: permitDetails?.PermitId,
  //     });
  //     let updatedTable =
  //       res.data?.Records || invoiceTable.filter((inv) => inv.SNo !== sno);
  //     const reIndexedTable = updatedTable.map((inv, index) => ({
  //       ...inv,
  //       SNo: index + 1,
  //     }));
  //     setInvoiceTable(reIndexedTable);
  //     setSerialNumber(reIndexedTable.length + 1);
  //   } catch (error) {
  //     console.error("Delete failed", error);
  //   }
  // };

  const deleteInvoice = async (sno) => {
    const permitId = permitDetails?.PermitId;
    let commonDeleted = false;
    setIsInvoiceDeleting(true);

    try {
      // Step 1: Delete from CommonInvoiceDtl
      const res = await API.post("/deleteInvoiceNo/", {
        SNo: sno,
        PermitId: permitId,
      });
      commonDeleted = true;

      let updatedTable =
        res.data?.Records || invoiceTable.filter((inv) => inv.SNo !== sno);
      const reIndexedTable = updatedTable.map((inv, index) => ({
        ...inv,
        SNo: index + 1,
      }));
      setInvoiceTable(reIndexedTable);
      setSerialNumber(reIndexedTable.length + 1);

      // Step 2: Mirror delete to InvoiceDtl (inpayment)
      await API.post("out/deleteOutInvoiceNo/", {
        SNo: sno,
        PermitId: permitId,
      });
      console.log("Deleted from InvoiceDtl as well");
    } catch (error) {
      console.error("Delete failed", error);

      if (commonDeleted) {
        alert(
          `Warning: Invoice SNo ${sno} was deleted from CommonInvoiceDtl but FAILED to delete from InvoiceDtl. ` +
            `Please contact support or retry — this record is now inconsistent between tables.\n\n` +
            `Error: ${error.response?.data?.error || error.message}`,
        );
      } else {
        alert(
          error.response?.data?.error ||
            "Failed to delete invoice, check console for details",
        );
      }
    } finally {
      setIsInvoiceDeleting(false);
    }
  };

  useEffect(() => {
    if (editingSNo === null) {
      setSerialNumber(invoiceTable.length + 1);
    }
  }, [invoiceTable, editingSNo]);

  // ======================== EDIT INVOICE ========================
  const editInvoice = (invoice) => {
    if (!invoice) return;
    setEditingSNo(invoice.SNo);
    setSerialNumber(invoice.SNo);
    setInvoiceNumber(invoice.InvoiceNo);

    if (invoice.InvoiceDate) {
      const datePart = String(invoice.InvoiceDate).split("T")[0];
      const [year, month, day] = datePart.split("-");
      if (year && month && day) {
        setInvoiceDate(`${day}/${month}/${year}`);
      }
    }

    setTermTypeSelected(invoice.TermType);
    // handleTermChange(invoice.TermType);
    setAdValoremIndicator(invoice.AdValoremIndicator);
    setPreDutyRateIndicator(invoice.PreDutyRateIndicator);
    setSupplierRelationship(invoice.SupplierImporterRelationship);

    // Supplier
    setSupplierManuFacturerCode(invoice.SupplierCode);
    const supplier = supplierManuFacturerSuggestions
      .map((i) => i.split(":"))
      .find(([code]) => code === invoice.SupplierCode);
    if (supplier) {
      const [code, cruei, name, name1] = supplier;
      setSupplierManuFacturer({
        Code: code,
        CRUEI: cruei,
        Name: name,
        Name1: name1,
      });
      setSupplierManuFacturerCruei(cruei);
      setSupplierManuFacturerName(name);
      setSupplierManuFacturerName1(name1);
    }

    // EXPORTER — use invoice-specific states
    const importCode = invoice.ImportPartyCode || invoice.ExportPartyCode || "";
    setInvoiceExporterCode(importCode);

    const importerData = exporterSuggestions
      .map((i) => i.split(":"))
      .find(([code]) => code.toLowerCase() === importCode.toLowerCase());

    if (importerData) {
      const [code, cruei, name, name1] = importerData;
      setExporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
      setInvoiceExporterCruei(cruei);
      setInvoiceExporterName(name);
      setInvoiceExporterName1(name1);
    } else {
      setExporter(null);
      setInvoiceExporterCruei("");
      setInvoiceExporterName("");
      setInvoiceExporterName1("");
    }
    const findInvoiceFormattedRate = (currencyName) => {
      const found = currency.find((c) => c.Currency === currencyName);
      return found ? found.CurrencyRate : invoice.TIExRate;
    };
    

    setInvoiceCurrency(invoice.TICurrency);
    setInvoiceExRate(invoice.TIExRate);
    // setInvoiceExRate(findInvoiceFormattedRate(invoice.TICurrency));
    setInvoiceAmount(invoice.TIAmount);
    setInvoiceDollar(invoice.TISAmount);

    setOtherValueCharges(invoice.OTCCharge);
    setOtherValueCurrency(invoice.OTCCurrency);
    setOtherValueExRate(invoice.OTCExRate);
    setOtherValueAmount(invoice.OTCAmount);
    setOtherValueDollar(invoice.OTCSAmount);
    setFreightValueCharges(invoice.FCCharge);
    setFreightValueCurrency(invoice.FCCurrency);
    setFreightValueExRate(invoice.FCExRate);
    setFreightValueAmount(invoice.FCAmount);
    setFreightValueDollar(invoice.FCSAmount);
    setInsuranceCharges(invoice.ICCharge);
    setInsuranceValueCurrency(invoice.ICCurrency);
    setInsuranceValueExRate(invoice.ICExRate);
    setInsuranceValueAmount(invoice.ICAmount);
    setInsuranceValueDollar(invoice.ICSAmount);

    setCifTotal(invoice.CIFSUMAmount);

    setGstCharge(invoice.GSTPercentage);
    setGstTotal(invoice.GSTSUMAmount);
    setInvoiceInsurance(invoice.ChkOtherInv);
  };


    // comma separator

const fmtComma = (val, decimals = 2) => {
  const num = parseFloat(val);
  if (isNaN(num)) return (0).toFixed(decimals);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

//------------------------Decimal helper------------------------
const fmt = (val, decimals = 2) => {
  const num = parseFloat(val);
  return isNaN(num) ? (0).toFixed(decimals) : num.toFixed(decimals);
};

  // ======================== RESET INVOICE ========================
  const resetInvoiceForm = () => {
    setInvoiceNumber("");
    setInvoiceDate("");
    setTermTypeSelected("");
    setShowFreightRow(true);
    setShowInsuranceRow(true);
    setAdValoremIndicator(false);
    setPreDutyRateIndicator(false);
    setFreightChargesEnabled(false);
    setInsuranceChargesEnabled(false);
    setSupplierRelationship("");
    setSupplierManuFacturerCode("");
    setSupplierManuFacturerCruei("");
    setSupplierManuFacturerName("");
    setSupplierManuFacturerName1("");
    setSupplierManuFacturer(null);
    // Invoice-specific importer states only — Party importer untouched
    setInvoiceExporterCode("");
    setInvoiceExporterCruei("");
    setInvoiceExporterName("");
    setInvoiceExporterName1("");
    setExporter(null);
    setInvoiceCurrency("");
    setInvoiceExRate(0.0);
    setInvoiceAmount(0.0);
    setInvoiceDollar(0.0);
    setOtherValueCharges(0.0);
    setOtherValueCurrency("");
    setOtherValueExRate(0.0);
    setOtherValueAmount(0.0);
    setOtherValueDollar(0.0);
    setFreightValueCharges(0.0);
    setFreightValueCurrency("");
    setFreightValueExRate(0.0);
    setFreightValueAmount(0.0);
    setFreightValueDollar(0.0);
    setInsuranceCharges(0.0);
    setInsuranceValueCurrency("");
    setInsuranceValueExRate(0.0);
    setInsuranceValueAmount(0.0);
    setInsuranceValueDollar(0.0);
    setCifTotal(0.0);
    setGstCharge(9);
    setGstTotal(0.0);
    setInvoiceInsurance("No");
    setEditingSNo(null);
  };
  // ===================== SAVE AS DRAFT =====================
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftReason, setDraftReason] = useState("");
  const [draftReasonError, setDraftReasonError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAsDraftClick = () => {
    setDraftReason("");
    setDraftReasonError(false);
    setShowDraftModal(true);
  };

  const formatDraftDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "") return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
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
        MessageType: "OUTDEC",

        // ── Header fields ──────────────────────────────────
        DeclarationType: decType || "",
        PreviousPermit: prevPermitNo || "",
        CargoPackType: cargo || "",
        InwardTransportMode: transportMode || "",
        BGIndicator: bgInd || "",
        SupplyIndicator: supplyInd ? "true" : "false",
        ReferenceDocuments: refDocs ? "true" : "false",
        DeclarningFor: declFor || "",
        License: Licence || "",
        Recipient: Recipients || "",
        DeclarantCompanyCode: permitDetails?.DeclarantCode || "",

        // ── Party fields ───────────────────────────────────
        ImporterCompanyCode: importerCode || "",
        InwardCarrierAgentCode: inwardCode || "",
        FreightForwarderCode: freightForwarderCode || "",
        ClaimantPartyCode: claimantCode || "",

        // ── Transport fields ───────────────────────────────
        VoyageNumber: showVoyageNumber ? voyageNumber || "" : "",
        VesselName: showVesselName ? vesselName || "" : "",
        OceanBillofLadingNo: showOblNumber ? obl || "" : "",
        ConveyanceRefNo: showconveyanceNumber ? conveyanceNumber || "" : "",
        TransportId: showTransportDetails ? transportDetails || "" : "",
        FlightNO: showFlightNumber ? flightNumber || "" : "",
        AircraftRegNo: showAirCraftRegNumber ? airCraftRegNumber || "" : "",
        MasterAirwayBill: showMawbNumber ? mawbNumber || "" : "",

        // ── Cargo fields ───────────────────────────────────
        HBL: cargoHawb || "",
        ArrivalDate: formatDraftDate(arrivalDate) || null,
        LoadingPortCode: loadingPortCode || "",
        ReleaseLocation: releaseCode || "",
        ResLoaName: releaseLocationDescription || "",
        RecepitLocation: receiptCode || "",
        RecepitLocName: receiptLocationDescription || "",
        TotalOuterPack: totalOuterPackValue || "",
        TotalOuterPackUOM: totalOuterPackName || "",
        TotalGrossWeight: totalGrossWeight || "",
        TotalGrossWeightUOM: grossUOM || "",
        BlanketStartDate: formatDraftDate(blanketStartDate) || null,

        // ── Status & Meta ──────────────────────────────────
        Message: draftReason.trim().toUpperCase(),
        Status: "SAVEASDRF",
        prmtStatus: "SAVEASDRF",
        TouchUser,
        TouchTime,
        MRDate: null,
        MRTime: "",
      };

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
      alert("Error saving draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ===========================Auto save every filling Detils========================

  // const autoSavePayload = useMemo(() => {
  //   if (!permitDetails?.PermitId) return null;
  //   return {
  //     PermitId: (permitDetails?.PermitId || "").toUpperCase(),
  //     Refid: permitDetails?.RefId || "",
  //     JobId: permitDetails?.JobId || "",
  //     MSGId: permitDetails?.MsgId || "",
  //     TradeNetMailboxID:
  //       permitDetails?.TradeNetMailboxID || permitDetails?.MailBoxId || "",
  //     MessageType: "OUTDEC",
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
  //     // ── Transport (from Header) ────────────────────────
  //     VoyageNumber: showVoyageNumber ? voyageNumber || "" : "",
  //     VesselName: showVesselName ? vesselName || "" : "",
  //     OceanBillofLadingNo: showOblNumber ? obl || "" : "",
  //     ConveyanceRefNo: showconveyanceNumber ? conveyanceNumber || "" : "",
  //     TransportId: showTransportDetails ? transportDetails || "" : "",
  //     FlightNO: showFlightNumber ? flightNumber || "" : "",
  //     AircraftRegNo: showAirCraftRegNumber ? airCraftRegNumber || "" : "",
  //     MasterAirwayBill: showMawbNumber ? mawbNumber || "" : "",
  //     // ── Cargo fields ───────────────────────────────────
  //     HBL: cargoHawb || "",
  //     ArrivalDate: formatDate(arrivalDate) || null,
  //     LoadingPortCode: loadingPortCode || "",
  //     ReleaseLocation: releaseCode || "",
  //     ResLoaName: releaseLocationDescription || "",
  //     RecepitLocation: receiptCode || "",
  //     RecepitLocName: receiptLocationDescription || "",
  //     TotalOuterPack: totalOuterPackValue || "",
  //     TotalOuterPackUOM: totalOuterPackName || "",
  //     TotalGrossWeight: totalGrossWeight || "",
  //     TotalGrossWeightUOM: grossUOM || "",
  //     BlanketStartDate: formatDate(blanketStartDate) || null,
  //     // reamining
  //     Status: "DISCONNECT",
  //     prmtStatus: "DISCONNECT",
  //     TouchUser: (user?.username || "").toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Message: "AUTO-SAVED|TAB:InvoicePage",
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
  //   cargoHawb,
  //   arrivalDate,
  //   loadingPortCode,
  //   releaseCode,
  //   releaseLocationDescription,
  //   receiptCode,
  //   receiptLocationDescription,
  //   totalOuterPackValue,
  //   totalOuterPackName,
  //   totalGrossWeight,
  //   grossUOM,
  //   blanketStartDate,
  //   user,
  // ]);

  // useDebounceAutoSave({
  //   payload: autoSavePayload,
  //   enabled: !isViewMode,
  //   delay: 2000,
  // });

  // if this permit id's data already exists

  // ======================== LOAD EXISTING INVOICES ON PAGE (RE)ENTRY ========================
  const invoiceFetchedRef = useRef(false);

  useEffect(() => {
    const fetchExistingInvoices = async () => {
      if (!permitDetails?.PermitId) return;
      if (invoiceFetchedRef.current) return; // avoid re-fetch overwriting fresh adds
      invoiceFetchedRef.current = true;

      try {
        const response = await API.get(
          `/getInvoiceByPermitId/${permitDetails.PermitId}/`,
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          setInvoiceTable(response.data);
          setSerialNumber(response.data.length + 1);
        }
      } catch (err) {
        console.error("Failed to load existing invoices for this permit", err);
      }
    };

    fetchExistingInvoices();
  }, [permitDetails?.PermitId]);

  // ======================== UI ========================
  return (
    <div className="row g-2">
      <div className="col-12">
        {/* EXPORTER ROW */}
        <div className="row align-items-center compact-row mt-3">
          <label className="col-sm-1 col-form-label">EXPORTER</label>
          <div className="col-sm-1 icon-contaniner">
            <FaSearch
              className="me-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleIconClick("exporter")}
              tabIndex={1}
            />
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={saveExporter}
              tabIndex={2}
            />
          </div>
          <div className="col-sm-2 position-relative">
            <input
              ref={exporterCodeRef}
              id="exporterCode"
              className="form-control"
              placeholder="CODE"
              value={invoiceExporterCode}
              onChange={handleExporterChange}
              onKeyDown={handleExporterKeyDown}
              onBlur={handleFocusOut}
              tabIndex={3}
              onFocus={() => setExporterError(false)}
            />
            {(invoiceExporterCode || "").trim() === "" && exporterCodeError && (
              <span className="ErrColor">FILL Exporter</span>
            )}
            {showExporterDropdown && filteredExporterSuggestions.length > 0 && (
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
                      onMouseEnter={() => setExporterHighlightedIndex(index)}
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
              id="exporterCruei"
              className="form-control mandatory"
              placeholder="CRUEI"
              tabIndex={4}
              value={exporter?.CRUEI || invoiceExporterCruei || ""}
              onChange={(e) => setInvoiceExporterCruei(e.target.value)}
            />
          </div>
          <div className="col-sm-3">
            <input
              id="exporterName"
              className="form-control mandatory"
              placeholder="NAME"
              tabIndex={5}
              value={exporter?.Name || invoiceExporterName || ""}
              onChange={(e) => setInvoiceExporterName(e.target.value)}
            />
          </div>
          <div className="col-sm-1">
            <input
              id="exporterName1"
              className="form-control"
              placeholder="NAME1"
              tabIndex={6}
              value={exporter?.Name1 || invoiceExporterName1 || ""}
              onChange={(e) => setInvoiceExporterName1(e.target.value)}
            />
          </div>
          <div className="col-sm-1">
            <button
              tabIndex={7}
              type="button"
              className="ButtonClick SaveContainer"
              onClick={copyExporter}
            >
              CopyExporter
            </button>
          </div>
        </div>
      </div>

      {/* INVOICE INFORMATION */}
      <div className="col-12">
        <div className="row align-items-center compact-row">
          <div className="col-sm-8 border-bottom pb-1 full-width-title">
            INVOICE INFORMATION
          </div>
        </div>
        <div className="row align-items-center compact-row">
          <div className="col-sm-1 col-form-label">SERIAL NUMBER</div>
          <div className="col-sm-2">
            <input
              disabled
              type="text"
              className="form-control"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>
          <div className="col-sm-1">INVOICE DATE</div>
          <div className="col-sm-3">
            <DateField
              tabIndex={8}
              value={invoiceDate}
              setValue={setInvoiceDate}
            />
            {(invoiceDate || "").trim() === "" && invoiceDateError && (
              <span className="ErrColor">FILL Invoice Date</span>
            )}
          </div>

          <div className="col-sm-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={preDutyRateIndicator === "True"}
              onChange={(e) =>
                setPreDutyRateIndicator(e.target.checked ? "True" : "False")
              }
            />
            <div>PREFERENTIAL DUTY RATE INDICATOR</div>
          </div>
        </div>

        <div className="row align-items-center compact-row">
          <div className="col-sm-1 col-form-label">INVOICE NUMBER</div>
          <div className="col-sm-2">
            <input
              type="text"
              tabIndex={9}
              className="form-control"
              value={invoiceNumber}
              onChange={handleInvoiceNumberChange}
            />
            {(invoiceNumber || "").trim() === "" && invoiceNumberError && (
              <span className="ErrColor">FILL Real Invoice Number</span>
            )}
          </div>
          <div className="col-sm-1">TERM TYPE</div>
          <div className="col-sm-3">
            <select
              className="Dropdown HighLight"
              tabIndex={10}
              value={termTypeSelected}
              onChange={(e) => setTermTypeSelected(e.target.value)}
            >
              <option value="">--Select--</option>
              {termTypeSelected &&
                !termType.find((t) => t.Name === termTypeSelected) && (
                  <option value={termTypeSelected}>{termTypeSelected}</option>
                )}
              {termType.map((ttype) => (
                <option key={ttype.Name} value={ttype.Name}>
                  {ttype.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-2">SUPPLIER IMPORTER RELATIONSHIP</div>
          <div className="col-sm-2">
            <select
              className="form-control"
              value={supplierRelationship}
              onChange={(e) => setSupplierRelationship(e.target.value)}
            >
              <option value="">--Select--</option>
              {supplierRelationship &&
                !supplierImporterRelationship.includes(
                  supplierRelationship,
                ) && (
                  <option value={supplierRelationship}>
                    {supplierRelationship}
                  </option>
                )}
              {supplierImporterRelationship.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CALCULATION TABLE */}
      <div className="col-12 mt-1">
        <div className="table-responsive">
          <table id="InvoiceCalculationTable">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>CHARGES (%)</th>
                <th>CURRENCY</th>
                <th>EX.RATE</th>
                <th>AMOUNT</th>
                <th>AMOUNT ($)</th>
              </tr>
            </thead>
            <tbody>
              {/* INVOICE VALUE */}
              <tr>
                <td>INVOICE VALUE</td>
                <td></td>
                <td>
                  <select
                    className="Dropdown HighLight"
                    style={{ width: "90%" }}
                    value={invoiceCurrency}
                    tabIndex={11}
                    onChange={(e) =>
                      handleCurrencyChange(e.target.value, "invoice")
                    }
                  >
                    <option value="">--Select--</option>
                    {invoiceCurrency &&
                      !currency.find((c) => c.Currency === invoiceCurrency) && (
                        <option value={invoiceCurrency}>
                          {invoiceCurrency}
                        </option>
                      )}
                    {currency.map((cur) => (
                      <option key={cur.Currency} value={cur.Currency}>
                        {cur.Currency}
                      </option>
                    ))}
                  </select>
                  {(invoiceCurrency || "").trim() === "" &&
                    invoiceCurrencyError && (
                      <span className="ErrColor">FILL Currency</span>
                    )}
                </td>
                <td>
                  <input
                    type="text"
                    value={invoiceExRate}
                    placeholder="0.00"
                    className="inputStyle"
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={invoiceAmount}
                    className="inputStyle"
                    tabIndex={12}
                    onChange={(e) =>
                      handleAmountChange(e.target.value, "invoice")
                    }
                    // onKeyPress={(e) => {
                    //   if (!/[\d.]/.test(e.key)) e.preventDefault();
                    //   if (e.key === "." && String(e.target.value).includes("."))
                    //     e.preventDefault();
                    // }}
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={fmtComma(invoiceDollar)}
                    placeholder="0.00"
                    className="inputStyle"
                    disabled
                  />
                </td>
              </tr>

              {/* CIF TOTAL */}
              <tr className="InvoiceTotalRow">
                <td>CIF VALUE</td>
                <td colSpan="4"></td>
                <td>
                  <input
                    type="text"
                    value={cifTotal}
                    disabled
                    className="inputStyle"
                  />
                </td>
              </tr>

              {/* GST */}
              {/* <tr>
                <td>GST</td>
                <td>
                  <input
                    type="text"
                    value={gstCharge}
                    onChange={(e) => setGstCharge(e.target.value)}
                    className="inputStyle"
                  />
                </td>
                <td colSpan="3"></td>
                <td>
                  <input
                    type="text"
                    value={gstTotal}
                    disabled
                    className="inputStyle"
                  />
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="col-12 mt-1">
        <div className="mt-3 d-flex justify-content-center gap-3">
          <button
            className="NextpageBtns view-nav-btn"
            tabIndex={13}
            id="PartySaveDraft"
            onClick={handleSaveAsDraftClick}
          >
            SAVE AS DRAFT
          </button>
          <button
            className="NextpageBtns view-nav-btn"
            onClick={() => setActiveTab("CargoTab")}
            tabIndex={14}
          >
            PREVIOUS
          </button>
          <button
            className="NextpageBtns"
            onClick={saveInvoice}
            disabled={isInvoiceSaving}
            tabIndex={15}
          >
            {isInvoiceSaving ? "SAVING..." : "ADD INVOICE"}
          </button>
          {showResetButton && (
            <button className="NextpageBtns" onClick={resetInvoiceForm}>
              RESET
            </button>
          )}
          <button
            tabIndex={16}
            className="NextpageBtns view-nav-btn"
            onClick={() => setActiveTab("ItemTab")}
          >
            NEXT
          </button>
        </div>

        {isInvoiceSaving && (
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
            <CircleLoader size={60} color="#1bf807" loading={isInvoiceSaving} />
            <div
              style={{
                marginTop: "16px",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#1a6db5",
              }}
            >
              SAVING INVOICE...
            </div>
          </div>
        )}
        {isInvoiceDeleting && (
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
            <CircleLoader
              size={60}
              color="#c0392b"
              loading={isInvoiceDeleting}
            />
            <div
              style={{
                marginTop: "16px",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#c0392b",
              }}
            >
              DELETING INVOICE...
            </div>
          </div>
        )}
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

      {/* INVOICE TABLE */}
      <div className="col-12 mt-1">
        <div className="table-responsive">
          <table
            id="InvoiceTable"
            className="table table-bordered"
            style={{ width: "100%" }}
          >
            <thead className="table-light">
              <tr className="fontTable">
                <th>DELETE</th>
                <th>EDIT</th>
                <th>S.NO</th>
                <th>INVOICE NUMBER</th>
                <th>INVOICE DATE</th>
                {/* <th>TERM TYPE</th> */}
                <th>INVOICE CURRENCY</th>
                <th>INVOICE AMOUNT</th>
                <th>CIF/FOB VALUE (S$)</th>
                {/* <th>TOTAL INVOICE GST</th> */}
              </tr>
            </thead>
            <tbody>
              {invoiceTable.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center" }}>
                    No Record
                  </td>
                </tr>
              ) : (
                invoiceTable.map((inv) => (
                  <tr key={inv.SNo}>
                    <td>
                      <FaTrash
                        style={{
                          width: "15px",
                          cursor: isInvoiceDeleting ? "not-allowed" : "pointer",
                          opacity: isInvoiceDeleting ? 0.5 : 1,
                        }}
                        onClick={() => {
                          if (!isInvoiceDeleting) deleteInvoice(inv.SNo);
                        }}
                      />
                    </td>
                    <td>
                      <FaEdit
                        className="view-show"
                        style={{ width: "15px", cursor: "pointer" }}
                        onClick={() => editInvoice(inv)}
                      />
                    </td>
                    <td>{inv.SNo}</td>
                    <td>{inv.InvoiceNo}</td>
                    <td>{inv.InvoiceDate}</td>
                    <td>{inv.TICurrency}</td>
                    <td>{fmt(inv.TIAmount)}</td>
                    <td>{fmt(inv.CIFSUMAmount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP */}
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

export default Invoice;
