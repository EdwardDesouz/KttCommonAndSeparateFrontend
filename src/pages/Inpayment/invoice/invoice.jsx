import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useState, useEffect, useContext, useRef } from "react";
import API from "../../../api/api";
import { UserContext } from "../../../userContex/userContex";
import { fetchPopupData, currentPopup, SearchPopup } from "./invoiceFunctions";
import { DateField } from "../cargo/cargo";
import { useInpayment } from "../context/inpaymentContext";

function Invoice({ setActiveTab }) {
  const { user } = useContext(UserContext);

  const {
    invoiceImporterCode,
    setInvoiceImporterCode,
    invoiceImporterCruei,
    setInvoiceImporterCruei,
    invoiceImporterName,
    setInvoiceImporterName,
    invoiceImporterName1,
    setInvoiceImporterName1,
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
  } = useInpayment();

  const [editingSNo, setEditingSNo] = useState(null);
  const [serialNumber, setSerialNumber] = useState(1);
  // const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceNumberError, setInvoiceNumberError] = useState(false);
  // const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceDateError, setInvoiceDateError] = useState(false);
  const [showResetButton, setShowResetButton] = useState(false);

  // const [adValoremIndicator, setAdValoremIndicator] = useState("False");
  // const [preDutyRateIndicator, setPreDutyRateIndicator] = useState("False");
  // const [invoiceInsurance, setInvoiceInsurance] = useState("False");
  // const [supplierRelationship, setSupplierRelationship] = useState("");
  const supplierImporterRelationship = ["Ordinary Importer", "Agency"];

  // ======================== SUPPLIER / MANUFACTURER ========================
  const supplierManuFacturerCodeRef = useRef(null);
  // const [supplierManuFacturer, setSupplierManuFacturer] = useState(null);
  // const [supplierManuFacturerCode, setSupplierManuFacturerCode] = useState("");
  // const [supplierManuFacturerCruei, setSupplierManuFacturerCruei] =useState("");
  // const [supplierManuFacturerName, setSupplierManuFacturerName] = useState("");
  const [supplierManuFacturerNameError, setSupplierManuFacturerNameError] =
    useState(false);
  // const [supplierManuFacturerName1, setSupplierManuFacturerName1] =
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
  const importerCodeRef = useRef(null);
  const [importer, setImporter] = useState(null);
  const [importerCodeError, setImporterCodeError] = useState(false);
  const [importerSuggestions, setImporterSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showImporterDropdown, setShowImporterDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [importerError, setImporterError] = useState(false);

  // Copy Importer from Party page
  const copyImporter = () => {
    const partyImporter = window.currentPartyImporter;
    if (!partyImporter?.Code) {
      alert("Importer not filled in Party page");
      return;
    }
    setInvoiceImporterCode(partyImporter.Code);
    setInvoiceImporterCruei(partyImporter.CRUEI);
    setInvoiceImporterName(partyImporter.Name);
    setInvoiceImporterName1(partyImporter.Name1);
  };

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

  const handleImporterChange = (e) => {
    const val = e.target.value;
    setInvoiceImporterCode(val);
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

  const handleImporterSelect = (item) => {
    const [code, cruei, name, name1] = item.split(":");
    setImporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
    setInvoiceImporterCode(code);
    setInvoiceImporterCruei(cruei);
    setInvoiceImporterName(name);
    setInvoiceImporterName1(name1);
    setShowImporterDropdown(false);
    setImporterError(false);
  };

  const handleFocusOut = () => {
    setTimeout(() => {
      if (!invoiceImporterCode) {
        setImporter(null);
        setInvoiceImporterCruei("");
        setInvoiceImporterName("");
        setInvoiceImporterName1("");
        setImporterError(true);
        setShowImporterDropdown(false);
        return;
      }
      const selected = importerSuggestions
        .map((i) => i.split(":"))
        .find(
          ([code]) => code.toLowerCase() === invoiceImporterCode.toLowerCase(),
        );
      if (selected) {
        const [code, cruei, name, name1] = selected;
        setImporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
        setInvoiceImporterCode(code);
        setInvoiceImporterCruei(cruei);
        setInvoiceImporterName(name);
        setInvoiceImporterName1(name1);
        setImporterError(false);
      } else {
        setImporter(null);
        setImporterError(true);
      }
      setShowImporterDropdown(false);
    }, 150);
  };

  const saveImporter = async () => {
    if (!invoiceImporterCode) {
      setImporterError(true);
      alert("Code is required!");
      return;
    }
    const duplicate = importerSuggestions.some(
      (i) =>
        i.split(":")[0].toLowerCase() === invoiceImporterCode.toLowerCase(),
    );
    if (duplicate) {
      alert("Duplicate code found! Importer not saved.");
      return;
    }
    const payload = {
      Id: importer?.Id || 0,
      Code: invoiceImporterCode || "",
      CRUEI: invoiceImporterCruei || "",
      Name: invoiceImporterName || "",
      Name1: invoiceImporterName1 || "",
      TouchUser: (user?.username).toUpperCase(),
      TouchTime: new Date().toISOString(),
      Status: "Active",
      MES: "",
      APS: "",
    };
    try {
      const response = await API.post("/postImporterTable/", payload);
      alert(response.data?.message || "Importer saved successfully!");
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data?.error || "Failed to save importer");
      } else {
        alert("Failed to save importer, check console for details");
      }
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
    setImporter,
    setImporterCode: setInvoiceImporterCode,
    setImporterCruei: setInvoiceImporterCruei,
    setImporterName: setInvoiceImporterName,
    setImporterName1: setInvoiceImporterName1,
  });

  const handleIconClick = async (type) => {
    setPopupType(type);
    await fetchPopupData(type, setPopupData, setLoading);
  };

  // ======================== TERM TYPE ========================
  const [termType, setTermType] = useState([]);
  // const [termTypeSelected, setTermTypeSelected] = useState("");
  // const [showFreightRow, setShowFreightRow] = useState(true);
  // const [showInsuranceRow, setShowInsuranceRow] = useState(true);
  // const [gstCharge, setGstCharge] = useState(9);

  const [currency, setCurrency] = useState([]);

  // const [invoiceCurrency, setInvoiceCurrency] = useState("");
  const [invoiceCurrencyError, setInvoiceCurrencyError] = useState("");
  // const [invoiceExRate, setInvoiceExRate] = useState("");
  // const [invoiceAmount, setInvoiceAmount] = useState("");
  // const [invoiceDollar, setInvoiceDollar] = useState("");

  // const [otherValueCharges, setOtherValueCharges] = useState("");
  // const [otherValueCurrency, setOtherValueCurrency] = useState("");
  // const [otherValueExRate, setOtherValueExRate] = useState("");
  // const [otherValueAmount, setOtherValueAmount] = useState("");
  // const [otherValueDollar, setOtherValueDollar] = useState("");

  // const [freightValueCharges, setFreightValueCharges] = useState("");
  // const [freightValueCurrency, setFreightValueCurrency] = useState("");
  // const [freightValueExRate, setFreightValueExRate] = useState("");
  // const [freightValueAmount, setFreightValueAmount] = useState("");
  // const [freightValueDollar, setFreightValueDollar] = useState("");

  // const [insuranceCharges, setInsuranceCharges] = useState("");
  // const [insuranceValueCurrency, setInsuranceValueCurrency] = useState("");
  // const [insuranceValueExRate, setInsuranceValueExRate] = useState("");
  // const [insuranceValueAmount, setInsuranceValueAmount] = useState("");
  // const [insuranceValueDollar, setInsuranceValueDollar] = useState("");

  // const [cifTotal, setCifTotal] = useState("0.00");
  // const [gstTotal, setGstTotal] = useState("0.00");

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

  // ======================== TERM TYPE CHANGE ========================
  const handleTermChange = (val) => {
    setTermTypeSelected(val);
    setInvoiceAmount("");
    setInvoiceDollar("");
    setOtherValueAmount("");
    setOtherValueDollar("");
    setFreightValueAmount("");
    setFreightValueDollar("");
    setInsuranceValueAmount("");
    setInsuranceValueDollar("");
    setInvoiceCurrency("");
    setOtherValueCurrency("");
    setFreightValueCurrency("");
    setInsuranceValueCurrency("");
    setInvoiceExRate("");
    setOtherValueExRate("");
    setFreightValueExRate("");
    setInsuranceValueExRate("");
    setGstCharge(9);
    setShowFreightRow(true);
    setShowInsuranceRow(true);

    if (val === "CFR : Cost and Frieght ( also known as C & F )") {
      setShowFreightRow(false);
      setShowInsuranceRow(true);
      setInsuranceCharges("1.00");
      setInsuranceValueCurrency("SGD");
      setInsuranceValueExRate("1.000000");
    } else if (val === "CIF : Cost,Insurance and Frieght") {
      setShowFreightRow(false);
      setShowInsuranceRow(false);
    } else if (val === "CNI : Cost and Insurance (also Known as C & I )") {
      setShowFreightRow(true);
      setShowInsuranceRow(false);
    } else if (val === "EXW : Exw Works (also known as Ex-Factory)") {
      setShowFreightRow(true);
      setShowInsuranceRow(true);
      setInsuranceCharges("1.00");
      setInsuranceValueCurrency("SGD");
      setInsuranceValueExRate("1.000000");
    } else if (val === "FAS : Free Alongside Ship") {
      setShowFreightRow(true);
      setShowInsuranceRow(true);
      setInsuranceCharges("1.00");
      setInsuranceValueCurrency("SGD");
      setInsuranceValueExRate("1.000000");
    } else if (val === "FOB : Free On Board") {
      setShowFreightRow(true);
      setShowInsuranceRow(true);
      setInsuranceCharges("1.00");
      setInsuranceValueCurrency("SGD");
      setInsuranceValueExRate("1.000000");
    }
  };

  // ======================== AMOUNT CHANGE ========================
  const handleAmountChange = (value, row) => {
    const num = value === "" ? "" : parseFloat(value);
    if (row === "invoice") setInvoiceAmount(num);
    else if (row === "other") setOtherValueAmount(num);
    else if (row === "freight") setFreightValueAmount(num);
    else if (row === "insurance") setInsuranceValueAmount(num);
  };

  // ======================== CURRENCY CHANGE ========================
  const handleCurrencyChange = (currencyName, row) => {
    const selected = currency.find((item) => item.Currency === currencyName);
    const rate = selected ? parseFloat(selected.CurrencyRate) : 0;
    if (row === "invoice") {
      setInvoiceCurrency(currencyName);
      setInvoiceExRate(rate);
    }
    if (row === "other") {
      setOtherValueCurrency(currencyName);
      setOtherValueExRate(rate);
    }
    if (row === "freight") {
      setFreightValueCurrency(currencyName);
      setFreightValueExRate(rate);
    }
    if (row === "insurance") {
      setInsuranceValueCurrency(currencyName);
      setInsuranceValueExRate(rate);
    }
  };

  // ======================== CALCULATIONS ========================
  useEffect(() => {
    const invAmount = parseFloat(invoiceAmount) || 0;
    const invEx = parseFloat(invoiceExRate) || 0;
    const invDollar = invAmount * invEx;

    const othAmount = parseFloat(otherValueAmount) || 0;
    const othEx = parseFloat(otherValueExRate) || 0;
    const othDollar = othAmount * othEx;

    const frCharge = parseFloat(freightValueCharges) || 0;
    const frEx = parseFloat(freightValueExRate) || 0;
    let frAmount = parseFloat(freightValueAmount) || 0;

    if (frCharge > 0) {
      const freightBase = invDollar + othDollar;
      const frDollarCalculated = (freightBase * frCharge) / 100;
      const calculatedAmount = frDollarCalculated / frEx;
      if (freightValueAmount !== calculatedAmount.toFixed(2)) {
        setFreightValueAmount(calculatedAmount.toFixed(2));
      }
      frAmount = calculatedAmount;
    }
    const frDollar = frAmount * frEx;

    const charge = parseFloat(insuranceCharges) || 0;
    const insuranceBase = showFreightRow ? invDollar + frDollar : invDollar;
    const insAmount = (insuranceBase * charge) / 100;
    if (insuranceValueAmount !== insAmount.toFixed(2)) {
      setInsuranceValueAmount(insAmount.toFixed(2));
    }
    const insEx = parseFloat(insuranceValueExRate) || 0;
    const insDollar = insAmount * insEx;

    setInvoiceDollar(invDollar.toFixed(2));
    setOtherValueDollar(othDollar.toFixed(2));
    setFreightValueDollar(frDollar.toFixed(2));
    setInsuranceValueDollar(insDollar.toFixed(2));

    const totalCIF =
      invDollar +
      othDollar +
      (showFreightRow ? frDollar : 0) +
      (showInsuranceRow ? insDollar : 0);
    setCifTotal(totalCIF.toFixed(2));

    const gstPercent = parseFloat(gstCharge) || 0;
    setGstTotal((totalCIF * (gstPercent / 100)).toFixed(2));
  }, [
    invoiceAmount,
    invoiceExRate,
    otherValueAmount,
    otherValueExRate,
    freightValueAmount,
    freightValueExRate,
    freightValueCharges,
    insuranceCharges,
    insuranceValueAmount,
    insuranceValueExRate,
    gstCharge,
    showFreightRow,
    showInsuranceRow,
  ]);

  // ======================== VALIDATE ========================
  const validateInvoiceFields = () => {
    let check = true;
    const safeTrim = (v) => (v ? String(v).trim() : "");

    if (safeTrim(invoiceImporterCode) === "") {
      setImporterCodeError(true);
      check = false;
    } else setImporterCodeError(false);

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

    if (safeTrim(supplierManuFacturerName) === "") {
      setSupplierManuFacturerNameError(true);
      check = false;
    } else setSupplierManuFacturerNameError(false);

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
  const saveInvoice = async () => {
    if (!validateInvoiceFields()) return;
    const payload = {
      PermitId: "PERMIT104",
      SNo: editingSNo || serialNumber,
      InvoiceNo: invoiceNumber,
      InvoiceDate: formatDate(invoiceDate),
      TermType: termTypeSelected,
      AdValoremIndicator: adValoremIndicator || "False",
      PreDutyRateIndicator: preDutyRateIndicator || "False",
      SupplierImporterRelationship: supplierRelationship || "--Select--",
      SupplierCode: supplierManuFacturerCode || "-",
      ImportPartyCode: invoiceImporterCode || "",
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
      MessageType: "IPTDEC",
      TouchUser: user.username,
      TouchTime: new Date().toISOString(),
      ChkOtherInv: invoiceInsurance || "No",
    };
    try {
      const res = await API.post("/postInvoiceTable/", payload);
      if (res.data?.Records) {
        setInvoiceTable(res.data.Records);
      } else {
        setInvoiceTable((prev) => {
          if (editingSNo) {
            return prev.map((inv) => (inv.SNo === editingSNo ? payload : inv));
          }
          return [...prev, payload];
        });
      }
      setEditingSNo(null);
      setSerialNumber((prev) => Number(prev) + 1);
      resetInvoiceForm();
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  // ======================== DELETE INVOICE ========================
  const deleteInvoice = async (sno) => {
    try {
      const res = await API.post("/deleteInvoiceNo/", {
        SNo: sno,
        PermitId: "PERMIT104",
      });
      if (res.data?.Records) {
        setInvoiceTable(res.data.Records);
      } else {
        setInvoiceTable((prev) => prev.filter((inv) => inv.SNo !== sno));
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // ======================== EDIT INVOICE ========================
  const editInvoice = (invoice) => {
    if (!invoice) return;
    setEditingSNo(invoice.SNo);
    setSerialNumber(invoice.SNo);
    setInvoiceNumber(invoice.InvoiceNo);

    if (invoice.InvoiceDate) {
      const date = new Date(invoice.InvoiceDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      setInvoiceDate(`${day}/${month}/${year}`);
    }

    setTermTypeSelected(invoice.TermType);
    handleTermChange(invoice.TermType);
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

    // Importer — use invoice-specific states
    setInvoiceImporterCode(invoice.ImportPartyCode);
    const importerData = importerSuggestions
      .map((i) => i.split(":"))
      .find(([code]) => code === invoice.ImportPartyCode);
    if (importerData) {
      const [code, cruei, name, name1] = importerData;
      setImporter({ Code: code, CRUEI: cruei, Name: name, Name1: name1 });
      setInvoiceImporterCruei(cruei);
      setInvoiceImporterName(name);
      setInvoiceImporterName1(name1);
    }

    setInvoiceCurrency(invoice.TICurrency);
    setInvoiceExRate(invoice.TIExRate);
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

  // ======================== RESET INVOICE ========================
  const resetInvoiceForm = () => {
    setInvoiceNumber("");
    setInvoiceDate("");
    setTermTypeSelected("");
    setShowFreightRow(true);
    setShowInsuranceRow(true);
    setAdValoremIndicator("False");
    setPreDutyRateIndicator("False");
    setSupplierRelationship("");
    setSupplierManuFacturerCode("");
    setSupplierManuFacturerCruei("");
    setSupplierManuFacturerName("");
    setSupplierManuFacturerName1("");
    setSupplierManuFacturer(null);
    // Invoice-specific importer states only — Party importer untouched
    setInvoiceImporterCode("");
    setInvoiceImporterCruei("");
    setInvoiceImporterName("");
    setInvoiceImporterName1("");
    setImporter(null);
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

  // ======================== UI ========================
  return (
    <div className="row g-2">
      <div className="col-12">
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">
            SUPPLIER / MANUFACTURER
          </label>
          <div className="col-sm-1 icon-contaniner">
            <FaSearch
              className="me-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleIconClick("supplierManuFacturer")}
            />
            <FaPlus
              style={{ cursor: "pointer" }}
              onClick={saveSupplierManuFacturer}
            />
          </div>
          <div className="col-sm-1 position-relative">
            <input
              ref={supplierManuFacturerCodeRef}
              type="text"
              className="form-control"
              placeholder="CODE"
              value={supplierManuFacturerCode}
              onChange={handleSupplierManuFacturerChange}
              onKeyDown={handleSupplierManuFacturerKeyDown}
              onBlur={handleSupplierManuFacturerFocusOut}
              onFocus={() => setSupplierManuFacturerError(false)}
              tabIndex={1}
            />
            {showSupplierManuFacturerDropdown &&
              filteredSupplierManuFacturerSuggestions.length > 0 && (
                <div className="dropdown-suggestions">
                  {filteredSupplierManuFacturerSuggestions.map(
                    (item, index) => {
                      const [code, , name] = item.split(":");
                      return (
                        <div
                          key={code}
                          className="dropdown-item"
                          style={{
                            backgroundColor:
                              index === highlightedSupplierManuFacturerIndex
                                ? "#234263"
                                : "white",
                            color:
                              index === highlightedSupplierManuFacturerIndex
                                ? "white"
                                : "black",
                            cursor: "pointer",
                          }}
                          onMouseDown={() =>
                            handleSupplierManuFacturerSelect(item)
                          }
                          onMouseEnter={() =>
                            setHighlightedSupplierManuFacturerIndex(index)
                          }
                        >
                          {code} - {name}
                        </div>
                      );
                    },
                  )}
                </div>
              )}
          </div>
          <div className="col-sm-2">
            <input
              tabIndex={2}
              type="text"
              className="form-control mandatory"
              placeholder="CRUEI"
              value={
                supplierManuFacturer?.CRUEI || supplierManuFacturerCruei || ""
              }
              onChange={(e) => setSupplierManuFacturerCruei(e.target.value)}
            />
          </div>
          <div className="col-sm-3">
            <input
              type="text"
              tabIndex={3}
              className="form-control mandatory"
              placeholder="NAME"
              value={
                supplierManuFacturer?.Name || supplierManuFacturerName || ""
              }
              onChange={(e) => {
                const val = e.target.value;
                setSupplierManuFacturerName(val);
                setSupplierManuFacturer((prev) => ({ ...prev, Name: val }));
                if (val.trim() !== "") setSupplierManuFacturerNameError(false);
              }}
            />
            {supplierManuFacturerNameError &&
              supplierManuFacturerName.trim() === "" && (
                <span className="ErrColor">FILL Supplier Manufacturer</span>
              )}
          </div>
          <div className="col-sm-3">
            <input
              type="text"
              tabIndex={4}
              className="form-control"
              placeholder="NAME1"
              value={
                supplierManuFacturer?.Name1 || supplierManuFacturerName1 || ""
              }
              onChange={(e) => setSupplierManuFacturerName1(e.target.value)}
            />
          </div>
        </div>

        {/* IMPORTER ROW */}
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">IMPORTER</label>
          <div className="col-sm-1 icon-contaniner">
            <FaSearch
              className="me-4"
              style={{ cursor: "pointer" }}
              onClick={() => handleIconClick("importer")}
            />
            <FaPlus style={{ cursor: "pointer" }} onClick={saveImporter} />
          </div>
          <div className="col-sm-1 position-relative">
            <input
              ref={importerCodeRef}
              id="importerCode"
              className="form-control"
              placeholder="CODE"
              tabIndex={5}
              value={invoiceImporterCode}
              onChange={handleImporterChange}
              onKeyDown={handleImporterKeyDown}
              onBlur={handleFocusOut}
              onFocus={() => setImporterError(false)}
            />
            {invoiceImporterCode.trim() === "" && importerCodeError && (
              <span className="ErrColor">FILL Importer</span>
            )}
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
              className="form-control mandatory"
              placeholder="CRUEI"
              tabIndex={6}
              value={importer?.CRUEI || invoiceImporterCruei || ""}
              onChange={(e) => setInvoiceImporterCruei(e.target.value)}
            />
          </div>
          <div className="col-sm-3">
            <input
              id="importerName"
              className="form-control mandatory"
              placeholder="NAME"
              tabIndex={7}
              value={importer?.Name || invoiceImporterName || ""}
              onChange={(e) => setInvoiceImporterName(e.target.value)}
            />
          </div>
          <div className="col-sm-2">
            <input
              id="importerName1"
              className="form-control"
              placeholder="NAME1"
              tabIndex={8}
              value={importer?.Name1 || invoiceImporterName1 || ""}
              onChange={(e) => setInvoiceImporterName1(e.target.value)}
            />
          </div>
          <div className="col-sm-1">
            <button
              tabIndex={9}
              type="button"
              className="ButtonClick SaveContainer"
              onClick={copyImporter}
            >
              CopyImporter
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
          <div className="col-sm-2 col-form-label">SERIAL NUMBER</div>
          <div className="col-sm-1">
            <input
              disabled
              type="text"
              className="form-control"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>
          <div className="col-sm-1">INVOICE DATE</div>
          <div className="col-sm-2">
            <DateField
              tabIndex={10}
              value={invoiceDate}
              setValue={setInvoiceDate}
            />
            {invoiceDate.trim() === "" && invoiceDateError && (
              <span className="ErrColor">FILL Invoice Date</span>
            )}
          </div>
          <div className="col-sm-1 form-check">
            <input
              type="checkbox"
              tabIndex={11}
              className="form-check-input"
              checked={adValoremIndicator === "True"}
              onChange={(e) =>
                setAdValoremIndicator(e.target.checked ? "True" : "False")
              }
            />
          </div>
          <div className="col-sm-1">AD VALOREM INDICATOR</div>
          <div className="col-sm-1 form-check">
            <input
              type="checkbox"
              tabIndex={12}
              className="form-check-input"
              checked={preDutyRateIndicator === "True"}
              onChange={(e) =>
                setPreDutyRateIndicator(e.target.checked ? "True" : "False")
              }
            />
          </div>
          <div className="col-sm-3">PREFERENTIAL DUTY RATE INDICATOR</div>
        </div>

        <div className="row align-items-center compact-row">
          <div className="col-sm-2 col-form-label">INVOICE NUMBER</div>
          <div className="col-sm-1">
            <input
              type="text"
              tabIndex={13}
              className="form-control"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
            {invoiceNumber.trim() === "" && invoiceNumberError && (
              <span className="ErrColor">FILL Invoice Number</span>
            )}
          </div>
          <div className="col-sm-1">TERM TYPE</div>
          <div className="col-sm-3">
            <select
              className="Dropdown HighLight mandatory"
              tabIndex={14}
              value={termTypeSelected}
              onChange={(e) => handleTermChange(e.target.value)}
            >
              <option value="">--Select--</option>
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
              tabIndex={15}
              value={supplierRelationship}
              onChange={(e) => setSupplierRelationship(e.target.value)}
            >
              <option value="">--Select--</option>
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
      <div className="col-12 mt-3">
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
                    onChange={(e) =>
                      handleCurrencyChange(e.target.value, "invoice")
                    }
                  >
                    <option value="">--Select--</option>
                    {currency.map((cur) => (
                      <option key={cur.Currency} value={cur.Currency}>
                        {cur.Currency}
                      </option>
                    ))}
                  </select>
                  {invoiceCurrency.trim() === "" && invoiceCurrencyError && (
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
                    onChange={(e) =>
                      handleAmountChange(e.target.value, "invoice")
                    }
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={invoiceDollar}
                    placeholder="0.00"
                    className="inputStyle"
                    disabled
                  />
                </td>
              </tr>

              {/* OTHER VALUE */}
              <tr>
                <td>OTHER VALUE</td>
                <td>
                  <input
                    type="text"
                    className="inputStyle"
                    placeholder="0.00"
                    disabled
                  />
                </td>
                <td>
                  <select
                    className="Dropdown"
                    style={{ width: "90%" }}
                    value={otherValueCurrency}
                    onChange={(e) =>
                      handleCurrencyChange(e.target.value, "other")
                    }
                  >
                    <option value="">--Select--</option>
                    {currency.map((cur) => (
                      <option key={cur.Currency} value={cur.Currency}>
                        {cur.Currency}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={otherValueExRate}
                    className="inputStyle"
                    disabled
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={otherValueAmount}
                    className="inputStyle"
                    onChange={(e) =>
                      handleAmountChange(e.target.value, "other")
                    }
                    placeholder="0.00"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={otherValueDollar}
                    className="inputStyle"
                    disabled
                    placeholder="0.00"
                  />
                </td>
              </tr>

              {/* FREIGHT VALUE */}
              {showFreightRow && (
                <tr>
                  <td className="nowrap-cell form-check">
                    <label className="inline-label">
                      FREIGHT VALUE (INCL. OTHER VALUE)
                      <input
                        type="checkbox"
                        className="form-check-input ms-2"
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={freightValueCharges}
                      className="inputStyle"
                      placeholder="0.00"
                      onChange={(e) => setFreightValueCharges(e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      className="Dropdown"
                      style={{ width: "90%" }}
                      value={freightValueCurrency}
                      onChange={(e) =>
                        handleCurrencyChange(e.target.value, "freight")
                      }
                    >
                      <option value="">--Select--</option>
                      {currency.map((cur) => (
                        <option key={cur.Currency} value={cur.Currency}>
                          {cur.Currency}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={freightValueExRate}
                      className="inputStyle"
                      disabled
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={freightValueAmount}
                      disabled={freightValueCharges > 0}
                      onChange={(e) =>
                        handleAmountChange(e.target.value, "freight")
                      }
                      className="inputStyle"
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={freightValueDollar}
                      className="inputStyle"
                      disabled
                      placeholder="0.00"
                    />
                  </td>
                </tr>
              )}

              {/* INSURANCE VALUE */}
              {showInsuranceRow && (
                <tr>
                  <td className="nowrap-cell form-check">
                    <label className="inline-label">
                      INSURANCE VALUE (INCL. FREIGHT VALUE)
                      <input
                        type="checkbox"
                        className="ms-2 form-check-input"
                        checked={invoiceInsurance === "True"}
                        onChange={(e) =>
                          setInvoiceInsurance(
                            e.target.checked ? "True" : "False",
                          )
                        }
                      />
                    </label>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="0.00"
                      className="inputStyle"
                      value={insuranceCharges}
                      onChange={(e) => setInsuranceCharges(e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      className="Dropdown"
                      style={{ width: "90%" }}
                      value={insuranceValueCurrency}
                      onChange={(e) =>
                        handleCurrencyChange(e.target.value, "insurance")
                      }
                    >
                      <option value="">--Select--</option>
                      {currency.map((cur) => (
                        <option key={cur.Currency} value={cur.Currency}>
                          {cur.Currency}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={insuranceValueExRate}
                      className="inputStyle"
                      disabled
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={insuranceValueAmount}
                      className="inputStyle"
                      disabled
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={insuranceValueDollar}
                      className="inputStyle"
                      disabled
                      placeholder="0.00"
                    />
                  </td>
                </tr>
              )}

              {/* CIF TOTAL */}
              <tr className="InvoiceTotalRow">
                <td>COST, INSURANCE & FREIGHT</td>
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
              <tr>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="col-12">
        <div className="mt-3 d-flex justify-content-center gap-3">
          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("CargoTab")}
          >
            PREVIOUS
          </button>
          <button className="NextpageBtns" onClick={saveInvoice}>
            ADD INVOICE
          </button>
          {showResetButton && (
            <button className="NextpageBtns" onClick={resetInvoiceForm}>
              RESET
            </button>
          )}
          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("ItemTab")}
          >
            NEXT
          </button>
        </div>
      </div>

      {/* INVOICE TABLE */}
      <div className="col-12 mt-4">
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
                <th>TERM TYPE</th>
                <th>INVOICE CURRENCY</th>
                <th>INVOICE AMOUNT</th>
                <th>CIF/FOB VALUE (S$)</th>
                <th>TOTAL INVOICE GST</th>
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
                        style={{ width: "15px", cursor: "pointer" }}
                        onClick={() => deleteInvoice(inv.SNo)}
                      />
                    </td>
                    <td>
                      <FaEdit
                        style={{ width: "15px", cursor: "pointer" }}
                        onClick={() => editInvoice(inv)}
                      />
                    </td>
                    <td>{inv.SNo}</td>
                    <td>{inv.InvoiceNo}</td>
                    <td>{inv.InvoiceDate}</td>
                    <td>{inv.TermType}</td>
                    <td>{inv.TICurrency}</td>
                    <td>{inv.TIAmount}</td>
                    <td>{inv.CIFSUMAmount}</td>
                    <td>{inv.GSTSUMAmount}</td>
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
