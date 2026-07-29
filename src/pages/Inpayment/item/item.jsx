import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { React, useEffect, useState, useContext, useRef, useMemo } from "react";
import { DateField } from "../cargo/cargo";
import API from "../../../api/api";
import { currentPopup, fetchPopupData, SearchPopup } from "./itemFunctions";
import { UserContext } from "../../../userContex/userContex";
import { useInpayment } from "../context/inpaymentContext";
import { useNavigate } from "react-router-dom";
import { useDebounceAutoSave } from "../../../autoSave/useDebounceAutoSave";
import ToastNotification, {
  useToast,
} from "../../../components/ToastNotification/toastNotification";
import { CircleLoader } from "react-spinners";
function Item({ setActiveTab, isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    permitDetails,
    updatePermitDetails,
    cargoHawbList,
    setCargoHawbList,
    decType,
    setDecType,
    invoiceTable,
    setInvoiceTable,
    totalGrossWeight,
    setTotalGrossWeight,
    hawbList,
    setHawbList,
    itemTable,
    setItemTable,
    makingLot,
    setMakingLot,
    itemSerialNumber,
    setItemSerialNumber,
    hawb,
    setHawb,
    hsCode,
    setHsCode,
    hsCodeDescription,
    setHsCodeDescription,
    hsCodeRow,
    setHsCodeRow,
    countryCode,
    setCountryCode,
    countryDescription,
    setCountryDescription,
    brand,
    setBrand,
    model,
    setModel,
    dgIndicator,
    setDgIndicator,
    unbranded,
    setUnbranded,
    invoiceQuantity,
    setInvoiceQuantity,
    hsQuantity,
    setHsQuantity,
    hsUom,
    setHsUom,
    duitableQuantity,
    setDuitableQuantity,
    duitableQuantityUom,
    setDuitableQuantityUom,
    totalDuitableQuantity,
    setTotalDuitableQuantity,
    totalDuitableQuantityUom,
    setTotalDuitableQuantityUom,
    alcoholPercentage,
    setAlcoholPercentage,
    selectedInvoice,
    setSelectedInvoice,
    invoiceCurrencyItem,
    setInvoiceCurrencyItem,
    invoiceExRateItem,
    setInvoiceExRateItem,
    invoiceCurrency,
    setInvoiceCurrency,
    invoiceExRate,
    setInvoiceExRate,
    unitPrice,
    setUnitPrice,
    sumExchangeRate,
    setSumExchangeRate,
    totalLineAmount,
    setTotalLineAmount,
    totalInvoiceCharge,
    setTotalInvoiceCharge,
    cifFob,
    setCifFob,
    exciseDutyRate,
    setExciseDutyRate,
    exciseDutyUom,
    setExciseDutyUom,
    exciseDutyAmount,
    setExciseDutyAmount,
    customsDutyRate,
    setCustomsDutyRate,
    customsDutyUom,
    setCustomsDutyUom,
    customsDutyAmount,
    setCustomsDutyAmount,
    otherTaxRate,
    setOtherTaxRate,
    otherTaxUom,
    setOtherTaxUom,
    otherTaxAmount,
    setOtherTaxAmount,
    gstRateValue,
    setGstRateValue,
    gstUom,
    setGstUom,
    gstSum,
    setGstSum,
    lastSellingPrice,
    setLastSellingPrice,
    preferentialCode,
    setPreferentialCode,
    packingChecked,
    setPackingChecked,
    outerPackQuantity,
    setOuterPackQuantity,
    outerPackQuantityUom,
    setOuterPackQuantityUom,
    inPackQuantity,
    setInPackQuantity,
    inPackQuantityUom,
    setInPackQuantityUom,
    innerPackQuantity,
    setInnerPackQuantity,
    innerPackQuantityUom,
    setInnerPackQuantityUom,
    immostPackQuantity,
    setImmostPackQuantity,
    immostPackQuantityUom,
    setImmostPackQuantityUom,
    showPacking,
    setShowPacking,
    showAlcohol,
    setShowAlcholPercentage,
    showDutiableQuantity,
    setShowDutiableQuantity,
    showVehicle,
    setShowVehicle,
    showOptionalCharges,
    setShowOptionalCharges,
    showItemCasc,
    setShowItemCasc,
    itemCascChecked,
    setItemCascChecked,
    showShippingMarks,
    setShowShippingMarks,
    showLotId,
    setShowLotId,
    showUnitPriceVal,
    setShowUnitPriceVal,
    itemCasc,
    setItemCasc,
    defaultItemCasc,
    currentLot,
    setCurrentLot,
    making,
    setMaking,
    previousLot,
    setPreviousLot,
    shippingMarks1,
    setShippingMarks1,
    shippingMarks2,
    setShippingMarks2,
    shippingMarks3,
    setShippingMarks3,
    shippingMarks4,
    setShippingMarks4,
    vehicleType,
    setVehicleType,
    engineCapacityValue,
    setEngineCapcityValue,
    engineCapacityUom,
    setEngineCapacityUom,
    originalRegistrationDate,
    setOriginalRegistrationDate,
    optionalCharges,
    setOptionalCharges,
    optionlAmount,
    setOptionalAmount,
    selectedCurrency,
    setSelectedCurrency,
    dutyTypeId,
    setDutyTypeId,
    kgmVisible,
    setKgmVisible,
    correctUom,
    setCorrectUom,
    // ==============EXISITING STATES FOR SAVE AS DRAFT============
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
    grossUOM,
    blanketStartDate,
  } = useInpayment();
  const [isItemEditall, setIsItemEditall] = useState(false);
  const [isUploadItem, setIsUploadItem] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [isAddItem, setIsAddItem] = useState(false);
  const [allBrandInput, setAllBrandInput] = useState("");

  const productCodeInputRef = useRef(null);
  const outerPackQtyRef = useRef(null);
  const shippingMarks1Ref = useRef(null);
  const currentLotRef = useRef(null);
  // ------------------ States ------------------
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    console.log("PERMIT DETAILS:", permitDetails);
  }, [permitDetails]);

  const [editingSNo, setEditingSNo] = useState(null);
  const itemNoRef = useRef(null);

  useEffect(() => {
    if (editingSNo !== null) {
      const el = document.getElementById("ItemHawbNo");
      if (el) {
        el.focus();
        el.select();
      }
    }
  }, [editingSNo]);

  useEffect(() => {
    if (editingSNo === null) {
      setSerialNumber((itemTable.length + 1).toString().padStart(3));
    }
  }, [itemTable, editingSNo]);

  const [showItemReset, setShowItemReset] = useState(false);
  const [serialNumber, setSerialNumber] = useState(1);
  // const [hawb, setHawb] = useState("");
  // const [unitPrice, setUnitPrice] = useState(0.0);
  const [recalculateClick, setRecalculateClick] = useState(false);

  const [unitPriceCurrency, setUnitPriceCurrency] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [unitPriceAuto, setUnitPriceAuto] = useState(false);
  const [itemInvoiceCurr, setItemInvoiceCurr] = useState("");
  const [iteminvoiceCurrInput, setIteminvoiceCurrInput] = useState(0.0);
  // const [sumExchangeRate, setSumExchangeRate] = useState(0.0);
  // const [totalLineAmount, setTotalLineAmount] = useState(0.0);
  const [totalLineAmountError, setTotalLineAmountError] = useState(false);
  // const [totalInvoiceCharge, setTotalInvoiceCharge] = useState(0.0);
  // const [cifFob, setCifFob] = useState(0.0);
  // const [gstSum, setGstSum] = useState(0.0);
  // const [preferentialCode, setPreferentialCode] = useState("");
  // const [exciseDutyRate, setExciseDutyRate] = useState(0.0);
  // const [exciseDutyUom, setExciseDutyUom] = useState("");
  // const [exciseDutyAmount, setExciseDutyAmount] = useState(0.0);
  // const [customsDutyRate, setCustomsDutyRate] = useState(0.0);
  // const [customsDutyUom, setCustomsDutyUom] = useState("");
  // const [customsDutyAmount, setCustomsDutyAmount] = useState("");
  // const [otherTaxRate, setOtherTaxRate] = useState(0.0);
  // const [otherTaxUom, setOtherTaxUom] = useState("");
  // const [otherTaxAmount, setOtherTaxAmount] = useState();
  // const [lastSellingPrice, setLastSellingPrice] = useState(0.0);
  // const [gstRateValue, setGstRateValue] = useState(9);
  // const [gstUom, setGstUom] = useState("PER");
  const [gstWarning, setGstWarning] = useState("");
  const fileInputRef = useRef(null);
  // ------------------ Static Data ------------------
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [currency, setCurrency] = useState([]);
  // const [selectedCurrency, setSelectedCurrency] = useState(null);
  // const [optionlAmount, setOptionalAmount] = useState(0);
  const [totaloptionalAmount, setTotalOptionalAmount] = useState(0);
  const [totalOuterPack, setTotalOuterPack] = useState([]);
  // const [brand, setBrand] = useState("");
  const [brandError, setBrandError] = useState(false);
  // const [dgIndicator, setDgIndicator] = useState(false);
  // const [unbranded, setUnbranded] = useState(false);
  const [preferential, setPreferential] = useState([]);
  // const [dutyTypeId, setDutyTypeId] = useState("");
  // const [kgmVisible, setKgmVisible] = useState("");
  // ------------------ Hs Code ------------------
  // const [hsCodeRow, setHsCodeRow] = useState(null);
  const [controlledItem, setControlledItem] = useState("");
  // const [hsCode, setHsCode] = useState("");
  // const [hsCodeDescription, setHsCodeDescription] = useState("");
  const [hsCodeDescriptionError, setHsCodeDescriptioError] = useState(false);
  const [hsCodeSuggestions, setHsCodeSuggestions] = useState([]);
  const [filteredHsCodeSuggestions, setFilteredHsCodeSuggestions] = useState(
    [],
  );
  const [showHscodeDropdown, setShowHsCodeDropdown] = useState(false);
  const [highlightedHsCodeIndex, setHighlightedHsCodeIndex] = useState(0);
  const [hsCodeError, setHsCodeError] = useState(false);
  // const [packingChecked, setPackingChecked] = useState(false);
  // const [showPacking, setShowPacking] = useState(false);
  // const [alcoholPercentage, setAlcoholPercentage] = useState(0);
  // const [showAlcohol, setShowAlcholPercentage] = useState(false);
  // const [showDutiableQuantity, setShowDutiableQuantity] = useState(false);
  // const [showVehicle, setShowVehicle] = useState(false);
  // const [showOptionalCharges, setShowOptionalCharges] = useState(false);
  // const [hsUom, setHsUom] = useState("--Select--");
  // const [correctUom, setCorrectUom] = useState("");
  const [hsUomError, setHsUomError] = useState("");
  // const [hsQuantity, setHsQuantity] = useState("");
  const [hsQuantityError, setHsQuantityError] = useState(false);
  // const [duitableQuantity, setDuitableQuantity] = useState("");
  // const [duitableQuantityUom, setDuitableQuantityUom] = useState("");
  // const [totalDuitableQuantity, setTotalDuitableQuantity] = useState("");
  // const [totalDuitableQuantityUom, setTotalDuitableQuantityUom] = useState("");
  const [cascProductCodes, setCascProductCodes] = useState([]);
  // ------------------ Package Details ------------------

  // const [outerPackQuantity, setOuterPackQuantity] = useState("0.00");
  // const [outerPackQuantityUom, setOuterPackQuantityUom] = useState("");
  // const [inPackQuantity, setInPackQuantity] = useState("0.00");
  // const [inPackQuantityUom, setInPackQuantityUom] = useState("");
  // const [innerPackQuantity, setInnerPackQuantity] = useState("0.00");
  // const [innerPackQuantityUom, setInnerPackQuantityUom] = useState("");
  // const [immostPackQuantity, setImmostPackQuantity] = useState("0.00");
  // const [immostPackQuantityUom, setImmostPackQuantityUom] = useState("");

  // ------------------ Country ------------------
  const [country, setCountry] = useState(null);
  // const [countryCode, setCountryCode] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");
  // const [countryDescription, setCountryDescription] = useState("");
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [filteredCountrySuggestions, setFilteredCountrySuggestions] = useState(
    [],
  );
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(0);

  //  ===============================Item Select State========================
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // ======================== FETCH COUNTRY ========================
  useEffect(() => {
    const fetchCountrySuggestions = async () => {
      try {
        const response = await API.get("/getCommonCountryTableInfo/");

        const list = response.data.map(
          (item) => `${item.CountryCode}:${item.Description}`,
        );

        setCountrySuggestions(list);
        setFilteredCountrySuggestions(list);
      } catch (error) {
        console.error("Error fetching country suggestions", error);
      }
    };

    fetchCountrySuggestions();
  }, []);

  // ======================== HANDLE INPUT CHANGE ========================
  const handleCountryChange = (e) => {
    const value = e.target.value;

    setCountryCode(value);
    setCountryCodeError(false);
    setHighlightedCountryIndex(0);

    if (!value) {
      setFilteredCountrySuggestions([]);
      setShowCountryDropdown(false);
      return;
    }

    const filtered = countrySuggestions.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredCountrySuggestions(filtered.slice(0, 50));
    setShowCountryDropdown(filtered.length > 0);
  };

  // ======================== HANDLE KEYBOARD ========================
  const handleCountryKeyDown = (e) => {
    if (!showCountryDropdown || filteredCountrySuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedCountryIndex((prev) =>
        prev + 1 >= filteredCountrySuggestions.length ? 0 : prev + 1,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedCountryIndex((prev) =>
        prev - 1 < 0 ? filteredCountrySuggestions.length - 1 : prev - 1,
      );
    }

    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();

      const selected = filteredCountrySuggestions[highlightedCountryIndex];
      if (selected) {
        handleCountrySelect(selected);
      }
    }
  };

  // ======================== SELECT ITEM ========================
  const handleCountrySelect = (item) => {
    const [Code, Description] = item.split(":");

    setCountry({ Code, Description });
    setCountryCode(Code);
    setCountryDescription(Description);
    setCountryCodeError(false);
    setShowCountryDropdown(false);
  };

  // ======================== BLUR VALIDATION ========================

  const handleCountryFocusOut = (value) => {
    const code = value || countryCode;
    if (!code) {
      setCountry(null);
      setCountryDescription("");
      setShowCountryDropdown(false);
      return;
    }
    // Find matching country from suggestions
    const selected = countrySuggestions
      .map((item) => item.split(":"))
      .find(([Code]) => Code.toLowerCase() === code.toLowerCase());
    if (selected) {
      const [Code, Description] = selected;
      setCountry({ Code, Description });
      setCountryCode(Code);
      setCountryDescription(Description);
    } else {
      setCountry(null);
      setCountryDescription("");
    }
    setShowCountryDropdown(false);
  };

  // ------------------ CopyHsQty ------------------

  const copyHsQty = (index) => {
    setItemCasc((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        hsQuantity: hsQuantity,
        uom: hsUom,
      };

      return updated;
    });
  };
  // ------------------ Optional Charges ------------------
  // const [optionalCharges, setOptionalCharges] = useState("0.00");

  // ------------------ Item CASC ------------------
  // const defaultItemCasc = [
  //   { code: "", hsQuantity: 0, uom: "", casc: [["", "", ""]], CascId: "Casc1" },
  //   { code: "", hsQuantity: 0, uom: "", casc: [["", "", ""]], CascId: "Casc2" },
  //   { code: "", hsQuantity: 0, uom: "", casc: [["", "", ""]], CascId: "Casc3" },
  // ];

  // const [itemCasc, setItemCasc] = useState(defaultItemCasc);
  // ------------------ Item CASC ------------------
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  // ------------------ Shipping Marks ------------------
  // const [shippingMarks1, setShippingMarks1] = useState("");
  // const [shippingMarks2, setShippingMarks2] = useState("");
  // const [shippingMarks3, setShippingMarks3] = useState("");
  // const [shippingMarks4, setShippingMarks4] = useState("");

  // ------------------ Visibility States ------------------

  // const [showItemCasc, setShowItemCasc] = useState(false);
  // const [itemCascChecked, setItemCascChecked] = useState(false);
  // const [showShippingMarks, setShowShippingMarks] = useState(false);

  // ------------------ Toggle Functions ------------------
  const togglePacking = (checked) => {
    setPackingChecked(checked);
    setShowPacking(checked);
    if (!checked) {
      setPackingDetails({
        outerPackQty: 0,
        outerPackUOM: "",
        inPackQty: 0,
        inPackUOM: "",
        innerPackQty: 0,
        innerPackUOM: "",
        inmostPackQty: 0,
        inmostPackUOM: "",
      });
    } else {
      setTimeout(() => {
        outerPackQtyRef.current?.focus();
      }, 0);
    }
  };

  const toggleItemCasc = (checked) => {
    setItemCascChecked(checked);
    setShowItemCasc(checked);
    if (!checked) {
      setItemCasc(defaultItemCasc);
    } else {
      setTimeout(() => {
        productCodeInputRef.current?.focus();
      }, 0);
    }
  };

  const toggleShippingMarks = (checked) => {
    setShowShippingMarks(checked);
    if (!checked) {
      setShippingMarks(["", "", "", ""]);
    } else {
      setTimeout(() => {
        shippingMarks1Ref.current?.focus();
      }, 0);
    }
  };

  const toggleLotId = (checked) => {
    setShowLotId(checked);
    if (!checked) {
      setCurrentLot("");
      setMaking("");
      setPreviousLot("");
    } else {
      setTimeout(() => {
        currentLotRef.current?.focus();
      }, 0);
    }
  };

  const toggleUnitPriceVal = (checked) => {
    setShowUnitPriceVal(checked);
  };

  // ------------------ Handlers ------------------
  const handleInvoiceCurrChange = (e) => setItemInvoiceCurr(e.target.value);

  const handleItemCascChange = (index, field, value) => {
    const newItemCasc = [...itemCasc];
    newItemCasc[index][field] = value;
    setItemCasc(newItemCasc);
  };

  const handleCascTableChange = (itemIndex, rowIndex, colIndex, value) => {
    const newItemCasc = [...itemCasc];
    if (!newItemCasc[itemIndex]) return;
    if (!newItemCasc[itemIndex].casc) {
      newItemCasc[itemIndex].casc = [];
    }
    if (!newItemCasc[itemIndex].casc[rowIndex]) {
      newItemCasc[itemIndex].casc[rowIndex] = ["", "", ""];
    }
    newItemCasc[itemIndex].casc[rowIndex][colIndex] = value;
    setItemCasc(newItemCasc);
  };

  const handleProductSelect = (index, selectedProduct) => {
    const newItemCasc = [...itemCasc];

    newItemCasc[index].code = selectedProduct.ProductCode;
    newItemCasc[index].uom = selectedProduct.UOM || "";

    setItemCasc(newItemCasc);
  };

  const addCascRow = (itemIndex) => {
    const newItemCasc = [...itemCasc];
    newItemCasc[itemIndex].casc.push(["", "", ""]);
    setItemCasc(newItemCasc);
  };

  const deleteCascRow = async (itemIndex, rowIndex) => {
    const item = itemCasc[itemIndex];
    const cascId = `Casc${itemIndex + 1}`;
    const rowNo = rowIndex + 1;
    const permitId = permitDetails?.PermitId;
    let commonDeleted = false;

    try {
      await API.delete(`/deleteCascByCascId/${cascId}/${rowNo}/${permitId}/`);
      commonDeleted = true;

      await API.delete(
        `inpayment/deleteInCascByCascId/${cascId}/${rowNo}/${permitId}/`,
      );
      console.log("Deleted from InnonCasc as well");
      const updated = [...itemCasc];
      updated[itemIndex].casc.splice(rowIndex, 1);
      setItemCasc(updated);
    } catch (error) {
      console.warn("Delete API error:", error);

      if (commonDeleted) {
        alert(
          `Warning: Casc row (${cascId}, row ${rowNo}) was deleted from the Common table but FAILED to delete from InnonCasc. ` +
            `Please contact support or retry — this record is now inconsistent between tables.\n\n` +
            `Error: ${error.response?.data?.error || error.message}`,
        );
        const updated = [...itemCasc];
        updated[itemIndex].casc.splice(rowIndex, 1);
        setItemCasc(updated);
      } else {
        alert(
          error.response?.data?.error ||
            "Failed to delete casc row, check console for details",
        );
      }
    }
  };

  // ------------------ Fetch HsCode ------------------
  const [hsCodeLoaded, setHsCodeLoaded] = useState(false);
  useEffect(() => {
    const fetchHsCodeSuggestions = async () => {
      try {
        const response = await API.get("/getCommonHsCodeTableInfo/");
        // console.log("HsCoderesponse:", response);
        setHsCodeSuggestions(response.data);
        setFilteredHsCodeSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching Hs Code suggestions", error);
      } finally {
        setHsCodeLoaded(true);
      }
    };
    fetchHsCodeSuggestions();
  }, []);
  // ------------------ Handle Chage HsCode ------------------
  // const handleHsCodeChange = (e) => {
  //   const val = e.target.value;
  //   setHsCode(val);
  //   setHsCodeError(false);
  //   setHighlightedHsCodeIndex(0);

  //   if (!val) {
  //     setShowHsCodeDropdown(false);
  //     setShowVehicle(false);
  //     return;
  //   }
  //   const filtered = hsCodeSuggestions.filter(
  //     (i) =>
  //       i.HSCode.toLowerCase().includes(val.toLowerCase()) ||
  //       i.Description.toLowerCase().includes(val.toLowerCase()),
  //   );

  //   setFilteredHsCodeSuggestions(filtered.slice(0, 100));
  //   setShowHsCodeDropdown(filtered.length > 0);
  // };
  const handleHsCodeChange = (e) => {
    const val = e.target.value;
    setHsCode(val);
    setHsCodeError(false);
    setHighlightedHsCodeIndex(0);

    if (!val) {
      setShowHsCodeDropdown(false);
      setShowVehicle(false);
      return;
    }

    const filtered = hsCodeSuggestions.filter(
      (i) =>
        i.HSCode.toLowerCase().includes(val.toLowerCase()) ||
        i.Description.toLowerCase().includes(val.toLowerCase()),
    );

    const exactMatch = filtered.filter(
      (i) => i.HSCode.toLowerCase() === val.toLowerCase(),
    );

    const finalList =
      exactMatch.length > 0 ? exactMatch : filtered.slice(0, 100);

    setFilteredHsCodeSuggestions(finalList);
    setShowHsCodeDropdown(finalList.length > 0);
  };
  // ======================== Hscode Keydown========================
  // const handleHsCodeKeyDown = (e) => {
  //    if (!showHscodeDropdown || filteredHsCodeSuggestions.length === 0) return;

  //   if (e.key === "ArrowDown") {
  //     e.preventDefault();
  //     setHighlightedHsCodeIndex((prev) =>
  //       prev + 1 >= filteredHsCodeSuggestions.length ? 0 : prev + 1,
  //     );
  //   } else if (e.key === "ArrowUp") {
  //     e.preventDefault();
  //     setHighlightedHsCodeIndex((prev) =>
  //       prev - 1 < 0 ? filteredHsCodeSuggestions.length - 1 : prev - 1,
  //     );
  //   } else if (e.key === "Enter" || e.key === "Tab") {
  //     e.preventDefault();
  //     handleHsCodeSelect(filteredHsCodeSuggestions[highlightedHsCodeIndex]);
  //   }
  // };

  const handleHsCodeKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();

      // If dropdown open, select the highlighted item first
      if (showHscodeDropdown && filteredHsCodeSuggestions.length > 0) {
        handleHsCodeSelect(filteredHsCodeSuggestions[highlightedHsCodeIndex]);
      }

      // Then move focus to description
      setTimeout(() => {
        const descEl = document.querySelector("textarea.inputStyle");
        if (descEl) {
          descEl.focus();
          descEl.select();
        }
      }, 200);
      return;
    }

    if (!showHscodeDropdown || filteredHsCodeSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedHsCodeIndex((prev) =>
        prev + 1 >= filteredHsCodeSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedHsCodeIndex((prev) =>
        prev - 1 < 0 ? filteredHsCodeSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleHsCodeSelect(filteredHsCodeSuggestions[highlightedHsCodeIndex]);
    }
  };

  // ======================== FETCH LOADING PORT========================
  const handleHsCodeSelect = async (item) => {
    setHsCode(item.HSCode);
    setHsCodeDescription(item.Description);
    setHsCodeRow(item);
    setShowHsCodeDropdown(false);

    applyHsLogic(item);

    try {
      const response = await API.get(
        `/getCascProductCodes/?HSCode=${item.HSCode}`,
      );

      setCascProductCodes(response.data);
    } catch (err) {
      console.error("Failed to fetch CASC product codes", err);
    }
  };

  const applyHsLogic = (item) => {
    const {
      HSCode,
      UOM,
      DUTYTYPID,
      Kgmvisible,
      DuitableUom,
      Excisedutyuom,
      Excisedutyrate,
      Customsdutyuom,
      Customsdutyrate,
    } = item;

    setDutyTypeId(DUTYTYPID);
    setKgmVisible(Kgmvisible);

    // RESET
    setShowVehicle(false);
    setShowPacking(false);
    setShowAlcholPercentage(false);
    setShowDutiableQuantity(false);
    setShowOptionalCharges(false);
    setShowItemCasc(false);

    setHsUom(UOM);
    setCorrectUom(UOM);
    setHsUomError("");
    setDuitableQuantityUom(UOM);
    setTotalDuitableQuantityUom(DuitableUom);

    setExciseDutyRate(0);
    setExciseDutyUom("--Select--");
    setCustomsDutyRate(0);
    setCustomsDutyUom("--Select--");

    // UOM
    if (UOM !== "LTR") {
      setShowPacking(false);
    }

    // ItemCasc
    if (Number(item.Inpayment) === 1) {
      setItemCascChecked(true);
      setShowItemCasc(true);
    } else {
      setItemCascChecked(false);
      setShowItemCasc(false);
    }

    // DUTY TYPE 62 & 63
    if (DUTYTYPID === 62 || DUTYTYPID === 63) {
      if (DUTYTYPID === 62 && UOM === "LTR") {
        setDuitableQuantityUom(UOM);
        setTotalDuitableQuantityUom(DuitableUom);
        setShowDutiableQuantity(true);
        setShowAlcholPercentage(true);
        setShowPacking(true);
        setPackingChecked(true);
      } else if (
        (DUTYTYPID === 63 && UOM === "KGM") ||
        (DUTYTYPID === 62 && UOM !== "LTR")
      ) {
        setDuitableQuantityUom(UOM);
        setTotalDuitableQuantityUom(DuitableUom);
        setShowDutiableQuantity(true);
      } else {
        setDuitableQuantityUom(UOM);
        setTotalDuitableQuantityUom(DuitableUom);
        setShowDutiableQuantity(true);
        setShowAlcholPercentage(true);
        setShowPacking(true);
        setPackingChecked(true);
      }

      if (DuitableUom === "A") {
        setDuitableQuantityUom("--Select--");
      }

      setExciseDutyUom(Excisedutyuom == 0 ? "--Select--" : Excisedutyuom);
      setCustomsDutyUom(Customsdutyuom == 0 ? "--Select--" : Customsdutyuom);
      setExciseDutyRate(Excisedutyrate);
      setCustomsDutyRate(Customsdutyrate);
    }

    // DUTY TYPE 64
    else if (DUTYTYPID === 64) {
      if (UOM !== "LTR") {
        setShowDutiableQuantity(true);
        setShowAlcholPercentage(false);
      } else {
        setShowDutiableQuantity(true);
        setShowAlcholPercentage(true);
        setShowPacking(true);
        setPackingChecked(true);
      }

      if (DuitableUom === "A") {
        setDuitableQuantityUom("--Select--");
      }

      setExciseDutyUom(Excisedutyuom == 0 ? "--Select--" : Excisedutyuom);
      setCustomsDutyUom(Customsdutyuom == 0 ? "--Select--" : Customsdutyuom);
      setExciseDutyRate(Excisedutyrate);
      setCustomsDutyRate(Customsdutyrate);
    }

    // DUTY TYPE 61
    else if (DUTYTYPID === 61) {
      if (UOM === "LTR") {
        setDuitableQuantityUom(UOM);
        setTotalDuitableQuantityUom(DuitableUom);
        setShowDutiableQuantity(true);
        setShowAlcholPercentage(true);
        setShowPacking(true);
        setPackingChecked(true);
      } else if (UOM === "KGM") {
        setDuitableQuantityUom(UOM);
        setTotalDuitableQuantityUom(DuitableUom);
        setShowDutiableQuantity(true);
        setShowAlcholPercentage(false);
      } else {
        setShowDutiableQuantity(false);
        setShowAlcholPercentage(false);
      }

      setExciseDutyUom(Excisedutyuom == 0 ? "--Select--" : Excisedutyuom);
      setCustomsDutyUom(Customsdutyuom == 0 ? "--Select--" : Customsdutyuom);
      setExciseDutyRate(Excisedutyrate);
      setCustomsDutyRate(Customsdutyrate);
    }

    // DUTY TYPE 67
    else if (DUTYTYPID === 67) {
      if (UOM === "LTR") {
        setDuitableQuantityUom(UOM);
        setTotalDuitableQuantityUom(DuitableUom);
        setShowDutiableQuantity(true);
        setShowAlcholPercentage(true);
        setShowPacking(true);
        setPackingChecked(true);
      } else if (UOM === "KGM") {
        setDuitableQuantityUom(UOM);
        setTotalDuitableQuantityUom(DuitableUom);
        setShowDutiableQuantity(true);
        setShowAlcholPercentage(false);
      } else {
        setShowDutiableQuantity(false);
        setShowAlcholPercentage(false);
      }

      setExciseDutyUom(Excisedutyuom == 0 ? "--Select--" : Excisedutyuom);
      setCustomsDutyUom(Customsdutyuom == 0 ? "--Select--" : Customsdutyuom);
      setExciseDutyRate(Excisedutyrate);
      setCustomsDutyRate(Customsdutyrate);
    }

    // VEHICLE (HSCode starts with 87)
    if (HSCode && HSCode.startsWith("87")) {
      setShowVehicle(true);
      setShowDutiableQuantity(true);
      setShowOptionalCharges(true);

      setExciseDutyUom(Excisedutyuom == 0 ? "--Select--" : Excisedutyuom);
      setCustomsDutyUom(Customsdutyuom == 0 ? "--Select--" : Customsdutyuom);
      setExciseDutyRate(Excisedutyrate);
      setCustomsDutyRate(Customsdutyrate);

      setDuitableQuantityUom(UOM);
      setTotalDuitableQuantityUom(DuitableUom);
    }
  };

  //-------------Hscode focus out logic --------

  const handleHsCodeFocusOut = () => {
    setTimeout(() => {
      if (!hsCode) {
        setHsCodeRow(null);
        setHsCode("");
        setHsCodeDescription("");
        // setHsCodeError(true);
        setShowVehicle(false);
        setShowPacking(false);
        setShowAlcholPercentage(false);
        setShowDutiableQuantity(false);
        setShowHsCodeDropdown(false);
        setDuitableQuantityUom("--Select--");
        setTotalDuitableQuantityUom("--Select--");
        setHsUom("--Select--");
        setExciseDutyRate(0.0);
        setExciseDutyUom(0.0);
        return;
      }

      const selected = hsCodeSuggestions.find(
        (i) => i.HSCode.toLowerCase() === hsCode.toLowerCase(),
      );

      // if (!selected) {
      //   setHsCodeError(true);
      //   return;
      // }

      setHsCodeRow(selected);
      setHsCode(selected.HSCode);
      setHsCodeDescription(selected.Description);
      setHsCodeError(false);

      applyHsLogic(selected);

      setTimeout(() => {
        const descEl = document.querySelector("textarea.inputStyle");
        if (descEl) {
          descEl.focus();
          descEl.select();
        }
      }, 50);
    }, 150);
  };

  // --------------------Hs code uom Checking-------------------
  const handleUomChange = (value) => {
    setHsUom(value);

    if (value === "--Select--") {
      setHsUomError("PLEASE CHECK UOM");
    } else if (value !== correctUom) {
      setHsUomError("INVALID UOM FOR THIS HS CODE");
    } else {
      setHsUomError("");
    }
  };

  // ----------------------Final validation---------------
  const validateUom = () => {
    if (hsUom === "--Select--") {
      setHsUomError("PLEASE CHECK UOM");
      return false;
    }

    if (hsUom !== correctUom) {
      setHsUomError("INVALID UOM FOR THIS HS CODE");
      return false;
    }

    setHsUomError("");
    return true;
  };

  // -----------fetchCurrency-----------
  const fetchInvoices = async () => {
    const permitId = permitDetails?.PermitId;
    console.log("Fetching invoices for PermitId:", permitId);
    try {
      const response = await API.get(`/getInvoiceByPermitId/${permitId}/`);
      console.log("Response:", response.data);
      setInvoiceNumbers(response.data);
    } catch (error) {
      console.error("Error fetching outer pack data", error);
    }
  };

  // -----------fetchCurrency-----------
  const fetchCurrency = async () => {
    try {
      const response = await API.get("/getCommonCurrencyTableInfo/");
      setCurrency(response.data);
      // console.log("Currency response:", response.data);
    } catch (error) {
      console.error("Error fetching outer pack data", error);
    }
  };
  // -----------fetch totalouterPack type-----------
  const fetchTotalOuterPackData = async () => {
    try {
      const response = await API.get("/getTotalOuterPackFromCommonMaster/");
      setTotalOuterPack(response.data);
    } catch (error) {
      console.error("Error fetching outer pack data", error);
    }
  };
  // -----------fetch vehicle type-----------
  const fetchVehicleType = async () => {
    try {
      const response = await API.get("/getVehicalTypeFromCommonMaster/");
      setVehicleTypeOptions(response.data);
    } catch (error) {
      console.error("Error fetching outer pack data", error);
    }
  };
  // -----------fetch Engine type-----------
  const fetchEngineType = async () => {
    try {
      const response = await API.get("/getEngineCapacityFromCommonMaster/");
      setEngineCapcityOptions(response.data);
    } catch (error) {
      console.error("Error fetching outer pack data", error);
    }
  };
  // -----------fetch Preferntial-----------
  const fetchPreferntial = async () => {
    try {
      const response = await API.get("/getPreferntialFromCommonMaster/");
      setPreferential(response.data);
    } catch (error) {
      console.error("Error fetching outer pack data", error);
    }
  };

  useEffect(() => {
    fetchTotalOuterPackData();
    fetchVehicleType();
    fetchEngineType();
    fetchPreferntial();
    fetchCurrency();
    fetchInvoices();
  }, []);

  // -------------------Invoices States-------------
  // const [selectedInvoice, setSelectedInvoice] = useState("");
  // const [invoiceCurrency, setInvoiceCurrency] = useState("");
  const [invoiceCurrencyError, setInvoiceCurrencyError] = useState(false);
  // const [invoiceExRate, setInvoiceExRate] = useState("");
  // -------------------Invoices changes-------------

  const applyInvoiceChange = (invoiceNo, clearIfNotFound = true) => {
    setSelectedInvoice(invoiceNo);
    const selected = invoiceNumbers.find((inv) => inv.InvoiceNo === invoiceNo);
    if (selected) {
      setInvoiceCurrency(selected.TICurrency);
      setInvoiceExRate(selected.TIExRate);
      return selected;
    } else {
      if (clearIfNotFound) {
        setInvoiceCurrency("");
        setInvoiceExRate("");
      }
      return null;
    }
  };

  const handleInvoiceChange = (e) => {
    applyInvoiceChange(e.target.value, true);
  };
  // ------------------ Item invoice function ------------------

  const itemInvoiceQuantityFunction = () => {
    let itemqty = invoiceQuantity;
    if (itemqty != "0.0000") {
      let hsopt = hsUom;
      let total;

      if (hsopt === "TEN" || hsopt === "TPR") {
        total = itemqty / 10;
      } else if (hsopt === "CEN") {
        total = itemqty / 100;
      } else if (hsopt === "MIL" || hsopt === "TNE") {
        total = itemqty / 1000;
      } else if (hsopt === "MTK") {
        total = itemqty * 3.213;
      } else if (hsopt === "LTR" || hsopt === "KGM") {
        total = itemqty * 1;
      } else {
        total = itemqty;
      }

      if (hsopt === "KGM" || hsopt === "LTR" || hsopt === "TNE") {
        if (itemqty > Number(totalGrossWeight)) {
          alert(
            "The Total Gross Weight is Less Than The Sum Of The Item Weight Please Check!!!",
          );
        }
      }

      if (hsQuantity === "0.00" || hsQuantity === "") {
        setHsQuantity(total);
      }

      if (itemqty != "0.00" || hsQuantity != "") {
        setHsQuantity(total);
      }
    }
  };

  // ------------------ UNBRANDED ------------------
  const handleCheckFunction = (e) => {
    const checked = e.target.checked;
    setUnbranded(checked);

    if (checked) {
      setBrand("UNBRANDED");
    } else {
      setBrand("");
    }
  };

  // ------------------ Dgindicator ------------------
  const handleDgIndicatorCheckFunction = (e) => {
    const checked = e.target.checked;
    setDgIndicator(checked);
    if (checked) {
      setBrand("");
    } else {
      setBrand("");
    }
  };

  // ------------------ Casc Product Code ------------------

  const [productCode1, setProductCode1] = useState("");
  const [productDesc1, setProductDesc1] = useState("");
  const [productUom1, setProductUom1] = useState("");

  //----------------------------Handle On Click-----------
  const handleIconClick = async (type, rowIndex) => {
    setPopupType(type);
    setActiveRowIndex(rowIndex);
    await fetchPopupData(type, setPopupData, setLoading, hsCode);
  };

  //---------------------------- Popup-----------------------------------
  const [popupType, setPopupType] = useState(null);
  const [popupData, setPopupData] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentPopupConfig = currentPopup(popupType, {
    setCountry,
    setCountryCode,
    setCountryDescription,
    setItemCasc,
    // setActiveRowIndex,
    activeRowIndex,
    setPopupType,
  });
  // ------------------ VEHICLE TYPE ------------------
  // const [vehicleType, setVehicleType] = useState("");
  // const [engineCapacityValue, setEngineCapcityValue] = useState("");
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
  const [engineCapacity, setEngineCapcityOptions] = useState([]);

  // const [showUnitPriceVal, setShowUnitPriceVal] = useState(false);
  // const [originalRegistrationDate, setOriginalRegistrationDate] = useState("");
  // const [engineCapacityUom, setEngineCapacityUom] = useState("");

  // ------------------ INVOICE QUANTITY------------------
  // const [invoiceQuantity, setInvoiceQuantity] = useState("0.00");
  // ------------------ INVOICE QUANTITY------------------

  // ------------------ Item Code ------------------

  const [itemCode, setItemCode] = useState("");
  const [itemCodeError, setItemCodeError] = useState(false);
  // const [model, setModel] = useState("");
  const [itemCodeSuggestions, setItemCodeSuggestions] = useState([]);
  const [filteredItemCodeSuggestions, setFilteredItemCodeSuggestions] =
    useState([]);
  const [showItemCodeDropdown, setShowItemCodeDropdown] = useState(false);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState(0);

  // ------------------Item Code Add ---------------------
  const handleAddItemCode = async () => {
    try {
      if (!itemCode) {
        alert("Fill Item Code");
        return;
      }

      // if (!hsCode) {
      //   setHsCodeError(true);
      //   return;
      // }

      const payload = {
        HouseCode: itemCode,
        HSCode: hsCode,
        Description: hsCodeDescription,
        Brand: brand,
        Model: model,
        DGIndicator: dgIndicator ? "Yes" : "No",
        TouchUser: user.username,
        TouchTime: new Date().toISOString(),
        DeclType: "INPAYMENT",
        ProductCode: itemCasc[0]?.code || "",
      };

      const response = await API.post("/postCommonHouseItemCode/", payload);

      alert("Item Saved Successfully");

      // clear form
      // setItemCode("");
      // setHsCode("");
      // setHsCodeDescription("");
      // setBrand("");
      // setModel("");
      // setDgIndicator(false);
      // setUnbranded(false);
    } catch (error) {
      console.error("Error saving item", error);
      alert("Error saving item");
    }
  };

  // ------------------Fetch Item Code  ---------------------
  useEffect(() => {
    const fetchItemCodes = async () => {
      try {
        const response = await API.get("/getCommonHouseItemCode/");
        setItemCodeSuggestions(response.data);
        setFilteredItemCodeSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching item codes", error);
      }
    };

    fetchItemCodes();
  }, []);

  // ------------------Handle Item Code  ---------------------
  const handleItemCodeChange = (e) => {
    const val = e.target.value;

    setItemCode(val);
    setHighlightedItemIndex(0);

    if (!val) {
      setShowItemCodeDropdown(false);
      return;
    }

    const filtered = itemCodeSuggestions.filter(
      (item) =>
        item.HouseCode.toLowerCase().includes(val.toLowerCase()) ||
        item.Description.toLowerCase().includes(val.toLowerCase()),
    );

    setFilteredItemCodeSuggestions(filtered.slice(0, 50));
    setShowItemCodeDropdown(filtered.length > 0);
  };

  // ------------------Item From Dropdown  ---------------------
  const handleItemCodeSelect = (item) => {
    setItemCode(item.HouseCode);
    setHsCode(item.HSCode);
    setHsCodeDescription(item.Description);
    setHsCodeError(false);
    setBrand(item.Brand);
    setModel(item.Model);
    setDgIndicator(item.DGIndicator === "Yes");
    if (item.Brand === "UNBRANDED") {
      setUnbranded(true);
    } else {
      setUnbranded(false);
    }
    const selectedHsRow = hsCodeSuggestions.find(
      (h) => h.HSCode === item.HSCode,
    );
    if (selectedHsRow) {
      setHsCodeRow(selectedHsRow);
    }
    if (item.ProductCode && item.ProductCode.trim() !== "") {
      setShowItemCasc(true);
      setItemCasc((prev) => {
        const updated = [...prev];
        updated[0].code = item.ProductCode;
        return updated;
      });
    } else {
      setShowItemCasc(false);
    }
    setShowItemCodeDropdown(false);
  };
  // ======================== ItemCode Keydown========================

  const handleItemCodeKeyDown = (e) => {
    if (!showItemCodeDropdown || filteredItemCodeSuggestions.length === 0)
      return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedItemIndex((prev) =>
        prev + 1 >= filteredItemCodeSuggestions.length ? 0 : prev + 1,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedItemIndex((prev) =>
        prev - 1 < 0 ? filteredItemCodeSuggestions.length - 1 : prev - 1,
      );
    }

    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();

      const selected = filteredItemCodeSuggestions[highlightedItemIndex];
      if (selected) {
        handleItemCodeSelect(selected);
      }
    }
  };

  // ------------------ HAWB LIST ------------------

  useEffect(() => {
    if (cargoHawbList?.length > 0) {
      setHawb((cargoHawbList[0] || "").toUpperCase());
    }
  }, [cargoHawbList]);
  // ------------------ Declaration Type ------------------

  // useEffect(() => {
  //   const storedData = localStorage.getItem("headerFormData");
  //   if (storedData) {
  //     const parsed = JSON.parse(storedData);
  //     setDeclarationType(parsed.decType || "");
  //   }
  // }, []);

  // ------------------ Gross Weight------------------

  // useEffect(() => {
  //   const storedGrossWeight = localStorage.getItem("grossWeight");
  //   if (storedGrossWeight) {
  //     const parsedGrossWeight = JSON.parse(storedGrossWeight);
  //     setTotalGrossWeight(parsedGrossWeight);
  //   }
  // }, []);
  // ------------------Invoice Calculations -------------
  useEffect(() => {
    itemAlchoholCalculationFunction();
    dutiableQtyFunction();
  }, [
    totalDuitableQuantity,
    alcoholPercentage,
    exciseDutyRate,
    customsDutyRate,
    cifFob,
    gstRateValue,
    decType,
  ]);

  // ------------------Invoice Calculations -------------
  // const invoiceTotalLineAmountFunction = () => {
  //   let itotalAmount = Number(totalLineAmount) || 0;
  //   let icurrinput = Number(invoiceExRate) || 0;
  //   let invoiceNumberval = selectedInvoice;
  //   let totalAmd = 0;
  //   let TotInvoiceAmd = 0;
  //   invoiceNumbers.forEach((i) => {
  //     if (invoiceNumberval === i.InvoiceNo) {
  //       totalAmd =
  //         Number(i.OTCSAmount) + Number(i.FCSAmount) + Number(i.ICSAmount);
  //       TotInvoiceAmd = Number(i.TISAmount);
  //     }
  //   });
  //   if (TotInvoiceAmd === 0) return;
  //   const InvoiceAmd = totalAmd / TotInvoiceAmd;
  //   const TotalLineAmd = icurrinput * itotalAmount;
  //   const invoiceCharge = InvoiceAmd * TotalLineAmd;
  //   setTotalInvoiceCharge(invoiceCharge.toFixed(2));
  //   const total2 = TotalLineAmd + invoiceCharge;
  //   setCifFob(total2.toFixed(2));
  // };

  const invoiceTotalLineAmountFunction = (
    overrideTotalLine = null,
    overrideExRate = null,
    overrideInvoiceNo = null,
  ) => {
    let itotalAmount = Number(overrideTotalLine ?? totalLineAmount) || 0;
    let icurrinput = Number(overrideExRate ?? invoiceExRate) || 0;
    let invoiceNumberval = overrideInvoiceNo ?? selectedInvoice;
    let totalAmd = 0;
    let TotInvoiceAmd = 0;
    invoiceNumbers.forEach((i) => {
      if (invoiceNumberval === i.InvoiceNo) {
        totalAmd =
          Number(i.OTCSAmount) + Number(i.FCSAmount) + Number(i.ICSAmount);
        TotInvoiceAmd = Number(i.TISAmount);
      }
    });
    if (TotInvoiceAmd === 0) return;
    const InvoiceAmd = totalAmd / TotInvoiceAmd;
    const TotalLineAmd = icurrinput * itotalAmount;
    const invoiceCharge = InvoiceAmd * TotalLineAmd;
    setTotalInvoiceCharge(invoiceCharge.toFixed(2));
    const total2 = TotalLineAmd + invoiceCharge;
    setCifFob(total2.toFixed(2));
  };

  // ------------------Total DutiableQuantity Function -------------
  const totalDutiableQtyFunction = () => {
    const totDuit = Number(totalDuitableQuantity);
    const duitQty = Number(duitableQuantity);
    if (totDuit === duitQty) {
    } else {
      const typeId = dutyTypeId;
      if (totDuit !== "") {
        if (!typeId.startsWith("87")) {
          const excise = totDuit * Number(exciseDutyRate);
          setExciseDutyAmount(excise);
        }
      }
      // itemAlchoholCalculationFunction();
    }
  };
  // ------------------Optional Charges Calculation -------------
  const optionalChargesFunction = (e) => {
    const value = e.target.value || 0;
    setOptionalAmount(value);
    const rate = selectedCurrency?.CurrencyRate || 0;
    const charges = value * rate;
    setOptionalCharges(charges);
  };

  // ------------------Alchohol Calculation Function-------------

  const itemAlchoholCalculationFunction = () => {
    // const itemAlchoholCalculationFunction = (latestCifFob = null) => {
    let T1 = parseFloat(totalDuitableQuantity) || 0;
    let T2 = parseFloat(alcoholPercentage) || 0;
    let T3 = parseFloat(exciseDutyRate) || 0;
    let T4 = parseFloat(customsDutyRate) || 0;

    let T5 = parseFloat(cifFob) || 0;
    // let T5 = parseFloat(latestCifFob ?? cifFob) || 0;
    let gstperval = (parseFloat(gstRateValue) || 0) / 100;
    let T6 = 0;
    let T7 = 0;
    let exciseValue = 0;
    if (T1 > 0 && T2 > 0 && T3 > 0) {
      exciseValue = T1 * T2 * (T3 / 100);
      T7 = T1 * T2 * (T4 / 100);

      setExciseDutyAmount(exciseValue.toFixed(2));
      setCustomsDutyAmount(T7.toFixed(2));
    } else {
      setExciseDutyAmount("0.00");
      setCustomsDutyAmount("0.00");
    }
    if (decType !== "GST : GST (Including Duty Exemption)") {
      T6 = (exciseValue + T5 + T7) * gstperval;
    } else {
      T6 = T5 * gstperval;
    }

    setGstSum(T6.toFixed(2));
    if (T6 >= 10000) {
      setGstWarning("Total GST Amount greater than 10000");
    } else {
      setGstWarning("");
    }
  };

  // ------------------Dutiable Quantity Function-------------
  const dutiableQtyFunction = () => {
    let opQty = parseFloat(outerPackQuantity) || 0;
    let inQty = parseFloat(inPackQuantity) || 0;
    let innerQty = parseFloat(innerPackQuantity) || 0;
    let inmostQty = parseFloat(immostPackQuantity) || 0;
    let dutiAb = parseFloat(duitableQuantity) || 0;
    duticalc(opQty, inQty, innerQty, inmostQty, dutiAb);
    // itemAlchoholCalculationFunction();
  };

  // ------------------Duti Calculation Function-------------

  const duticalc = (op, ip, inp, imp, totduti) => {
    let pckqty = 1;
    let HsVal = hsCode;
    let typeidval = dutyTypeId;
    let kgmvis = kgmVisible;

    // Packing calculation
    if (op > 0) pckqty = op;
    if (ip > 0) pckqty = pckqty * ip;
    if (inp > 0) pckqty = pckqty * inp;
    if (imp > 0) pckqty = pckqty * imp;

    if (!totduti) return;

    // Values from state
    let T1 = parseFloat(exciseDutyRate) || 0;
    let T2 = parseFloat(cifFob) || 0;
    let gstperval = (parseFloat(gstRateValue) || 0) / 100;

    let TDQUOM = totalDuitableQuantityUom;

    let totalQty = 0;
    let excise = 0;
    let gst = 0;

    // ================= LTR =================
    if (TDQUOM === "LTR") {
      totalQty = pckqty * totduti;

      setTotalDuitableQuantity(totalQty.toFixed(2));
      setHsQuantity(totalQty.toFixed(2));
    }

    // ================= KGM MULTIPLE =================
    else if (TDQUOM === "KGM" && kgmvis === "MULTIPLE") {
      totalQty = pckqty * totduti;
      setTotalDuitableQuantity(totalQty.toFixed(2));
      if (!HsVal.startsWith("87")) {
        excise = totalQty * T1;
        setExciseDutyAmount(excise.toFixed(2));
      }

      let T3 = T2;
      gst = T2 * gstperval + T3 * gstperval;
      setGstSum(gst.toFixed(2));
    }

    // ================= KGM DIVIDE =================
    else if (TDQUOM === "KGM" && kgmvis === "DIVIDE") {
      totalQty = (pckqty * totduti) / 1000;
      setTotalDuitableQuantity(totalQty.toFixed(2));

      if (!HsVal.startsWith("87")) {
        excise = totalQty * T1;
        setExciseDutyAmount(excise.toFixed(2));
      }

      let T3 = excise;
      gst = T2 * gstperval + T3 * gstperval;
      setGstSum(gst.toFixed(2));
    }

    // ================= STK =================
    else if (TDQUOM === "STK") {
      totalQty = pckqty;
      setTotalDuitableQuantity(totalQty.toFixed(2));
      setHsQuantity(((pckqty * totduti) / 1000).toFixed(2));

      if (!HsVal.startsWith("87")) {
        excise = pckqty * T1;
        setExciseDutyAmount(excise.toFixed(2));
      }

      let T3 = excise;
      gst = T2 * gstperval + T3 * gstperval;

      setGstSum(gst.toFixed(2));
    }

    // ================= TYPE 62 (KGM) =================
    else if (TDQUOM === "KGM" && typeidval === 62) {
      totalQty = pckqty * totduti;

      setTotalDuitableQuantity(totalQty.toFixed(2));

      if (!HsVal.startsWith("87")) {
        excise = totalQty * T1;
        setExciseDutyAmount(excise.toFixed(2));
      }

      let T3 = excise;
      gst = T2 * gstperval + T3 * gstperval;

      setGstSum(gst.toFixed(2));
    }

    // ================= TYPE 62 (TNE) =================
    else if (TDQUOM === "TNE" && typeidval === 62) {
      totalQty = pckqty * totduti;

      setTotalDuitableQuantity(totalQty.toFixed(2));

      if (!HsVal.startsWith("87")) {
        excise = totalQty * T1;
        setExciseDutyAmount(excise.toFixed(2));
      }

      let T3 = excise;
      gst = T2 * gstperval + T3 * gstperval;

      setGstSum(gst.toFixed(2));
    }

    // ================= TYPE 61 =================
    else if (TDQUOM === "KGM" && typeidval === 61) {
      totalQty = pckqty * totduti;

      setTotalDuitableQuantity(totalQty.toFixed(2));

      if (!HsVal.startsWith("87")) {
        excise = totalQty * T1;
        setExciseDutyAmount(excise.toFixed(2));
      }

      let T3 = excise;
      gst = T2 * gstperval + T3 * gstperval;

      setGstSum(gst.toFixed(2));
    }

    // ================= DAL =================
    else if (TDQUOM === "DAL") {
      totalQty = pckqty * totduti;

      setTotalDuitableQuantity(totalQty.toFixed(2));

      if (!HsVal.startsWith("87")) {
        excise = totalQty * T1;
        setExciseDutyAmount(excise.toFixed(2));
      }

      let T3 = excise;
      gst = T2 * gstperval + T3 * gstperval;

      setGstSum(gst.toFixed(2));
    }
    // ================= vechile =================
    else if (TDQUOM === "NMB" && hsCode.startsWith("87")) {
      if (HsVal.startsWith("87")) {
        excise = (T2 * T1) / 100;
      }
      setExciseDutyAmount(excise.toFixed(2));

      let T3 = excise;
      gst = T2 * gstperval + T3 * gstperval;

      setGstSum(gst.toFixed(2));
    }
  };

  // ----------------------- PREFERENTIAL CODE Out Function ---------------------------
  const itemPreferntialCodeOut = (value) => {
    console.log("PreferentialCode:", value);

    if (value == "PRF : if goods are imported under preferential duty rates") {
      setCustomsDutyRate(0);
      setCustomsDutyUom("--Select--");
      setCustomsDutyAmount(0);
    } else if (
      value == "PRI : if goods exported qualify for overseas preferential rates"
    ) {
      setCustomsDutyRate(0);
      setCustomsDutyUom();
      setCustomsDutyAmount(0.0);
    }
    dutiableQtyFunction();
  };
  // ----------------------- Last Selling Price Function ---------------------------
  const lastSellingPriceFunction = () => {
    const exciseAmt = parseFloat(exciseDutyAmount) || 0;
    const gstRate = parseFloat(gstRateValue) || 0;
    const lastPrice = parseFloat(lastSellingPrice);
    if (lastPrice > 0) {
      const gstOnExcise = (exciseAmt * gstRate) / 100;
      const totalGst = (lastPrice * gstRate) / 100 + gstOnExcise;
      setGstSum(totalGst.toFixed(2));
    }
  };
  // ----------------------- GST RECALCULATE Function ---------------------------
  const Recalculate = (e) => {
    setRecalculateClick(e.target.checked);
  };

  // ----------------------- Item Validation Function ---------------------------

  const validateItemFields = () => {
    let check = true;

    if (hsCode.trim() === "") {
      setHsCodeError(true);
      check = false;
    } else setHsCodeError(false);
    if (hsCodeDescription.trim() === "") {
      setHsCodeDescriptioError(true);
      check = false;
    } else setHsCodeDescriptioError(false);

    if (countryCode.trim() === "") {
      setCountryCodeError(true);
      check = false;
    } else setCountryCodeError(false);

    if (brand.trim() === "") {
      setBrandError(true);
      check = false;
    } else setBrandError(false);

    if (hsQuantity === "" || hsQuantity === 0) {
      setHsQuantityError(true);
      check = false;
    } else setHsQuantityError(false);

    if (hsUom === "--Select--") {
      setHsUomError(true);
      check = false;
    } else setHsUomError(false);

    if (selectedInvoice === "") {
      setInvoiceCurrencyError(true);
      check = false;
    } else {
      setInvoiceCurrencyError(false);
    }

    if (totalLineAmount === "" || totalLineAmount === 0) {
      setTotalLineAmountError(true);
      check = false;
    } else setTotalLineAmountError(false);
    if (itemCascChecked) {
      const firstCasc = itemCasc[0];
      if (!firstCasc.code.trim()) {
        check = false;
        alert("Please Check The Item Casc");
      }
    }

    return check;
  };

  // ----------------------- Add Item Function ---------------------------

  // const ItemSave = async () => {
  //   if (!validateItemFields()) return;
  //   const itemNumber = serialNumber;
  //   const payload = {
  //     CascDatas: JSON.stringify(ItemCascSave(itemNumber)),
  //     PermitId: permitDetails?.PermitId,
  //     ItemNo: itemNumber || null,
  //     MessageType: "IPTDEC",
  //     HSCode: hsCode || "",
  //     Description: hsCodeDescription || "",
  //     DGIndicator: dgIndicator ? "Yes" : "No",
  //     Contry: countryCode || "",
  //     EndUserDescription: "",
  //     Brand: brand || "",
  //     Model: model || "",
  //     InHAWBOBL: (hawb || "").toUpperCase(),
  //     OutHAWBOBL: "",
  //     DutiableQty: duitableQuantity || 0,
  //     DutiableUOM: duitableQuantityUom || "",
  //     TotalDutiableQty: totalDuitableQuantity || 0,
  //     TotalDutiableUOM: totalDuitableQuantityUom || "",
  //     InvoiceQuantity: invoiceQuantity || 0,
  //     HSQty: hsQuantity || 0,
  //     HSUOM: hsUom || "",
  //     AlcoholPer: alcoholPercentage || 0,
  //     InvoiceNo: selectedInvoice || "",
  //     ChkUnitPrice: showUnitPriceVal || "",
  //     UnitPrice: unitPrice || 0,
  //     UnitPriceCurrency: invoiceCurrency || "",
  //     ExchangeRate: invoiceExRate || 0,
  //     SumExchangeRate: sumExchangeRate || 0,
  //     TotalLineAmount: totalLineAmount || 0,
  //     InvoiceCharges: totalInvoiceCharge || 0,
  //     CIFFOB: cifFob || 0,
  //     OPQty: outerPackQuantity || 0,
  //     OPUOM: outerPackQuantityUom || "",
  //     IPQty: inPackQuantity || 0,
  //     IPUOM: inPackQuantityUom || "",
  //     InPqty: innerPackQuantity || 0,
  //     InPUOM: innerPackQuantityUom || "",
  //     ImPQty: immostPackQuantity || 0,
  //     ImPUOM: immostPackQuantityUom || "",
  //     PreferentialCode: preferentialCode || "",
  //     GSTRate: gstRateValue,
  //     GSTUOM: gstUom || "",
  //     GSTAmount: gstSum || 0,
  //     ExciseDutyRate: exciseDutyRate || 0,
  //     ExciseDutyUOM: exciseDutyUom || "",
  //     ExciseDutyAmount: exciseDutyAmount || 0,
  //     CustomsDutyRate: customsDutyRate || 0,
  //     CustomsDutyUOM: customsDutyUom || "",
  //     CustomsDutyAmount: customsDutyAmount || 0,
  //     OtherTaxRate: otherTaxRate || 0,
  //     OtherTaxUOM: otherTaxUom || "",
  //     OtherTaxAmount: otherTaxAmount || 0,
  //     LSPValue: lastSellingPrice || 0,
  //     CurrentLot: currentLot || "",
  //     PreviousLot: previousLot || "",
  //     Making: making || "",
  //     ShippingMarks1: shippingMarks1 || "",
  //     ShippingMarks2: shippingMarks2 || "",
  //     ShippingMarks3: shippingMarks3 || "",
  //     ShippingMarks4: shippingMarks4 || "",
  //     TouchUser: user.username.toUpperCase() || "",
  //     TouchTime: new Date().toISOString(),
  //     VehicleType: vehicleType || "",
  //     OptionalChrgeUOM: selectedCurrency?.CurrencyUOM || "",
  //     EngineCapcity: engineCapacityValue || "",
  //     Optioncahrge: optionalCharges || 0,
  //     OptionalSumtotal: optionlAmount || 0,
  //     OptionalSumExchage: selectedCurrency?.CurrencyRate || 0,
  //     EngineCapUOM: engineCapacityUom || "",
  //     orignaldatereg: originalRegistrationDate || "",
  //   };
  //   console.log("payload:", payload);
  //   try {
  //     const res = await API.post("/postItemTable/", payload);
  //     setItemTable(res.data.Records);
  //     showToast("Item Saved Successfully");
  //     const cascData = ItemCascSave(itemNumber);
  //     console.log("cascData:", cascData);
  //     if (cascData.length > 0) {
  //       await API.post("/postCascTable/", cascData);
  //       console.log("CASC Data Saved Successfully");
  //     }
  //     setEditingSNo(null);
  //     setSerialNumber((res.data.Records.length + 1).toString().padStart(3));
  //     resetItemForm();
  //   } catch (error) {
  //     console.error("Save failed", error);
  //   }
  // };

  const ItemSave = async () => {
    if (!validateItemFields()) return;
    const itemNumber = serialNumber;
    const payload = {
      CascDatas: JSON.stringify(ItemCascSave(itemNumber)),
      PermitId: permitDetails?.PermitId,
      ItemNo: itemNumber || null,
      MessageType: "IPTDEC",
      HSCode: hsCode || "",
      Description: hsCodeDescription.toUpperCase() || "",
      DGIndicator: dgIndicator ? "Yes" : "No",
      Contry: countryCode || "",
      EndUserDescription: "",
      Brand: brand || "",
      Model: model || "",
      InHAWBOBL: (hawb || "").toUpperCase(),
      OutHAWBOBL: "",
      DutiableQty: duitableQuantity || 0,
      DutiableUOM: duitableQuantityUom || "",
      TotalDutiableQty: totalDuitableQuantity || 0,
      TotalDutiableUOM: totalDuitableQuantityUom || "",
      InvoiceQuantity: invoiceQuantity || 0,
      HSQty: hsQuantity || 0,
      HSUOM: hsUom || "",
      AlcoholPer: alcoholPercentage || 0,
      InvoiceNo: selectedInvoice || "",
      ChkUnitPrice: showUnitPriceVal || "",
      UnitPrice: unitPrice || 0,
      UnitPriceCurrency: invoiceCurrency || "",
      ExchangeRate: invoiceExRate || 0,
      SumExchangeRate: sumExchangeRate || 0,
      TotalLineAmount: totalLineAmount || 0,
      InvoiceCharges: totalInvoiceCharge || 0,
      CIFFOB: Number(cifFob || 0).toFixed(2),
      OPQty: outerPackQuantity || 0,
      OPUOM: outerPackQuantityUom || "",
      IPQty: inPackQuantity || 0,
      IPUOM: inPackQuantityUom || "",
      InPqty: innerPackQuantity || 0,
      InPUOM: innerPackQuantityUom || "",
      ImPQty: immostPackQuantity || 0,
      ImPUOM: immostPackQuantityUom || "",
      PreferentialCode: preferentialCode || "",
      GSTRate: gstRateValue,
      GSTUOM: gstUom || "",
      GSTAmount: gstSum || 0,
      ExciseDutyRate: exciseDutyRate || 0,
      ExciseDutyUOM: exciseDutyUom || "",
      ExciseDutyAmount: exciseDutyAmount || 0,
      CustomsDutyRate: customsDutyRate || 0,
      CustomsDutyUOM: customsDutyUom || "",
      CustomsDutyAmount: customsDutyAmount || 0,
      OtherTaxRate: otherTaxRate || 0,
      OtherTaxUOM: otherTaxUom || "",
      OtherTaxAmount: otherTaxAmount || 0,
      LSPValue: lastSellingPrice || 0,
      CurrentLot: currentLot || "",
      PreviousLot: previousLot || "",
      Making: making || "",
      ShippingMarks1: shippingMarks1 || "",
      ShippingMarks2: shippingMarks2 || "",
      ShippingMarks3: shippingMarks3 || "",
      ShippingMarks4: shippingMarks4 || "",
      TouchUser: user.username.toUpperCase() || "",
      TouchTime: new Date().toISOString(),
      VehicleType: vehicleType || "",
      OptionalChrgeUOM: selectedCurrency?.CurrencyUOM || "",
      EngineCapcity: engineCapacityValue || "",
      Optioncahrge: optionalCharges || 0,
      OptionalSumtotal: optionlAmount || 0,
      OptionalSumExchage: selectedCurrency?.CurrencyRate || 0,
      EngineCapUOM: engineCapacityUom || "",
      orignaldatereg: originalRegistrationDate || "",
    };
    console.log("payload:", payload);

    let commonSaved = false;

    try {
      setIsAddItem(true);
      // Step 1: Save to CommonItemDtl
      const res = await API.post("/postItemTable/", payload);
      commonSaved = true;
      setItemTable(res.data.Records);

      const cascData = ItemCascSave(itemNumber);
      console.log("cascData:", cascData);
      if (cascData.length > 0) {
        await API.post("/postCascTable/", cascData);
        console.log("CASC Data Saved Successfully (Common)");
      }

      // Step 2: Save to ItemDtl (inpayment)
      const inpaymentRes = await API.post(
        "inpayment/postInItemTable/",
        payload,
      );
      console.log("Saved to ItemDtl:", inpaymentRes.data);

      if (cascData.length > 0) {
        await API.post("inpayment/postInCascTable/", cascData);
        console.log("CASC Data Saved Successfully (Inpayment)");
      }
      setIsAddItem(false);
      setEditingSNo(null);
      setSerialNumber((res.data.Records.length + 1).toString().padStart(3));
      resetItemForm();
    } catch (error) {
      console.error("Save failed", error);

      if (commonSaved) {
        alert(
          `Warning: Item "${payload.HSCode}" (Item No ${itemNumber}) was saved to CommonItemDtl but FAILED to save to ItemDtl. ` +
            `Please contact support or retry — this record is now inconsistent between tables.\n\n` +
            `Error: ${error.response?.data?.error || error.message}`,
        );
      } else if (error.response?.status === 400) {
        alert(
          error.response.data?.error ||
            error.response.data?.Result ||
            "Failed to save item",
        );
      } else {
        alert("Failed to save item, check console for details");
      }
    }
  };

  const ItemCascSave = (itemNumber) => {
    const username = user.username;
    const permitId = permitDetails?.PermitId;
    const messageType = "IPTDEC";

    const cascArray = itemCasc.flatMap((item, itemIndex) => {
      if (!item.code) return [];

      const hasRowData = item.casc.some((row) =>
        row.some((cell) => cell !== ""),
      );

      if (!hasRowData) {
        return [
          {
            ItemNo: itemNumber,
            ProductCode: item.code,
            Quantity: item.hsQuantity || 0,
            ProductUOM: item.uom || "",
            RowNo: 1,
            CascCode1: "",
            CascCode2: "",
            CascCode3: "",
            PermitId: permitId,
            MessageType: messageType,
            TouchUser: username,
            TouchTime: new Date().toISOString(),
            EndUserDes: "",
            CASCId: `Casc${itemIndex + 1}`,
          },
        ];
      }

      return item.casc
        .filter((row) => row.some((cell) => cell !== ""))
        .map((row, rowIndex) => ({
          ItemNo: itemNumber,
          ProductCode: item.code,
          Quantity: item.hsQuantity || 0,
          ProductUOM: item.uom || "",
          RowNo: rowIndex + 1,
          CascCode1: row[0] || "",
          CascCode2: row[1] || "",
          CascCode3: row[2] || "",
          PermitId: permitId,
          MessageType: messageType,
          TouchUser: username,
          TouchTime: new Date().toISOString(),
          EndUserDes: "",
          CASCId: `Casc${itemIndex + 1}`,
        }));
    });

    return cascArray;
  };

  // --------------------------delete Item-----------

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedItems(checked ? itemTable.map((item) => item.ItemNo) : []);
  };

  const handleSelectOne = (itemNo) => {
    setSelectedItems((prev) =>
      prev.includes(itemNo)
        ? prev.filter((id) => id !== itemNo)
        : [...prev, itemNo],
    );
  };

  // const deleteSelectedItems = async () => {
  //   if (selectedItems.length === 0) return;
  //   const permitId = permitDetails?.PermitId;
  //   try {
  //     const sorted = [...selectedItems].sort((a, b) => b - a);
  //     let latestRecords = itemTable;
  //     for (const itemNo of sorted) {
  //       const res = await API.post("/deleteItem/", {
  //         PermitId: permitId,
  //         ItemNo: itemNo,
  //       });
  //       latestRecords = res.data.Records;
  //     }
  //     setItemTable(latestRecords);
  //     setSelectedItems([]);
  //     setSelectAll(false);
  //     resetItemForm();
  //     alert("Selected items deleted successfully");
  //   } catch (error) {
  //     console.error("Bulk delete failed", error);
  //   }
  // };

  //   const deleteSelectedItems = async () => {
  //   if (selectedItems.length === 0) return;
  //   const permitId = permitDetails?.PermitId;
  //   const failedMirrors = [];

  //   try {
  //     // Sort descending so ItemNo reindexing (ItemNo > deleted -1) doesn't shift
  //     // items we still need to delete
  //     const sorted = [...selectedItems].sort((a, b) => b - a);
  //     let latestRecords = itemTable;

  //     for (const itemNo of sorted) {
  //       // Step 1: Delete from CommonItemDtl (+ cascades CommonCASCDtl)
  //       const res = await API.post("/deleteItem/", {
  //         PermitId: permitId,
  //         ItemNo: itemNo,
  //       });
  //       latestRecords = res.data.Records;

  //       // Step 2: Mirror delete to ItemDtl (+ cascades CASCDtl)
  //       try {
  //         await API.post("inpayment/deleteInItem/", {
  //           PermitId: permitId,
  //           ItemNo: itemNo,
  //         });
  //       } catch (mirrorErr) {
  //         console.error(`Mirror delete failed for ItemNo ${itemNo}`, mirrorErr);
  //         failedMirrors.push(itemNo);
  //       }
  //     }

  //     setItemTable(latestRecords);
  //     setSelectedItems([]);
  //     setSelectAll(false);
  //     resetItemForm();

  //     if (failedMirrors.length > 0) {
  //       alert(
  //         `Warning: Item No(s) ${failedMirrors.join(", ")} were deleted from CommonItemDtl ` +
  //         `but FAILED to delete from ItemDtl. Please contact support or retry — ` +
  //         `these records are now inconsistent between tables.`
  //       );
  //     } else {
  //       alert("Selected items deleted successfully from both tables");
  //     }
  //   } catch (error) {
  //     console.error("Bulk delete failed", error);
  //     alert(
  //       error.response?.data?.error || "Failed to delete items, check console for details"
  //     );
  //   }
  // };

  // const deleteSelectedItems = async () => {
  //   if (selectedItems.length === 0) return;
  //   const permitId = permitDetails?.PermitId;

  //   try {
  //     // Step 1: Bulk delete from CommonItemDtl/CommonCASCDtl — one request
  //     const res = await API.post("/deleteItem/", {
  //       PermitId: permitId,
  //       ItemNos: selectedItems,
  //     });

  //     setItemTable(res.data.Records);
  //     setSelectedItems([]);
  //     setSelectAll(false);
  //     resetItemForm();

  //     // Step 2: Mirror bulk delete to ItemDtl/CASCDtl — one request
  //     try {
  //       await API.post("inpayment/deleteInItem/", {
  //         PermitId: permitId,
  //         ItemNos: selectedItems,
  //       });
  //     } catch (mirrorErr) {
  //       console.error("Mirror bulk delete failed", mirrorErr);
  //       alert(
  //         "Warning: Items were deleted from CommonItemDtl but FAILED to mirror to ItemDtl. " +
  //           "Please contact support or retry.\n\n" +
  //           `Error: ${mirrorErr.response?.data?.error || mirrorErr.message}`,
  //       );
  //       return;
  //     }

  //     alert("Selected items deleted successfully from both tables");
  //   } catch (error) {
  //     console.error("Bulk delete failed", error);
  //     alert(
  //       error.response?.data?.error ||
  //         "Failed to delete items, check console for details",
  //     );
  //   }
  // };

  // const deleteSelectedItems = async () => {
  //   if (selectedItems.length === 0) return;
  //   const permitId = permitDetails?.PermitId;
  //   setIsDeletingItem(true);
  //   try {
  //     const [commonRes, inRes] = await Promise.allSettled([
  //       API.post("/deleteItem/", {
  //         PermitId: permitId,
  //         ItemNos: selectedItems,
  //       }),
  //       API.post("inpayment/deleteInItem/", {
  //         PermitId: permitId,
  //         ItemNos: selectedItems,
  //       }),
  //     ]);

  //     if (commonRes.status === "rejected") throw commonRes.reason;

  //     setItemTable(commonRes.value.data.Records);
  //     setSelectedItems([]);
  //     setSelectAll(false);
  //     resetItemForm();

  //     if (inRes.status === "rejected") {
  //       alert(
  //         "Warning: Items were deleted from CommonItemDtl but FAILED to mirror to ItemDtl. " +
  //           "Please contact support or retry.\n\n" +
  //           `Error: ${inRes.reason.response?.data?.error || inRes.reason.message}`,
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Bulk delete failed", error);
  //     alert(
  //       error.response?.data?.error ||
  //         "Failed to delete items, check console for details",
  //     );
  //   } finally {
  //     setIsDeletingItem(false); // ADD THIS
  //   }
  // };

  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;
    const permitId = permitDetails?.PermitId;
    setIsDeletingItem(true);
    try {
      const commonRes = await API.post("/deleteItem/", {
        PermitId: permitId,
        ItemNos: selectedItems,
      });

      setItemTable(commonRes.data.Records);
      setSelectedItems([]);
      setSelectAll(false);
      resetItemForm();

      try {
        await API.post("inpayment/syncInItemFromCommon/", {
          PermitId: permitId,
        });
      } catch (syncErr) {
        alert(
          "Warning: Items were deleted from CommonItemDtl but FAILED to sync to ItemDtl. " +
            "Please contact support or retry.\n\n" +
            `Error: ${syncErr.response?.data?.error || syncErr.message}`,
        );
      }
    } catch (error) {
      console.error("Bulk delete failed", error);
      alert(
        error.response?.data?.error ||
          "Failed to delete items, check console for details",
      );
    } finally {
      setIsDeletingItem(false);
    }
  };

  // const deleteItem = async (itemNo) => {
  //   const permitId = permitDetails?.PermitId;
  //   try {
  //     const res = await API.post("/deleteItem/", {
  //       ItemNo: itemNo,
  //       PermitId: permitId,
  //     });
  //     setItemTable(res.data.Records);
  //     const nextSerial = (res.data.Records.length + 1).toString().padStart("0");
  //     setSerialNumber(nextSerial);
  //   } catch (error) {
  //     console.error("Delete failed", error);
  //   }
  //   resetItemForm();
  // };

  // const deleteItem = async (itemNo) => {
  //   const permitId = permitDetails?.PermitId;
  //   let commonDeleted = false;

  //   try {
  //     // Step 1: Delete from CommonItemDtl (+ cascades CommonCASCDtl)
  //     const res = await API.post("/deleteItem/", {
  //       ItemNos: [itemNo],
  //       PermitId: permitId,
  //     });
  //     commonDeleted = true;
  //     setItemTable(res.data.Records);
  //     const nextSerial = (res.data.Records.length + 1).toString().padStart("0");
  //     setSerialNumber(nextSerial);

  //     // Step 2: Mirror delete to ItemDtl (+ cascades CASCDtl)
  //     await API.post("inpayment/deleteInItem/", {
  //       ItemNos: [itemNo],
  //       PermitId: permitId,
  //     });
  //     console.log("Deleted from ItemDtl as well");
  //   } catch (error) {
  //     console.error("Delete failed", error);

  //     if (commonDeleted) {
  //       alert(
  //         `Warning: Item No ${itemNo} was deleted from CommonItemDtl but FAILED to delete from ItemDtl. ` +
  //           `Please contact support or retry — this record is now inconsistent between tables.\n\n` +
  //           `Error: ${error.response?.data?.error || error.message}`,
  //       );
  //     } else {
  //       alert(
  //         error.response?.data?.error ||
  //           "Failed to delete item, check console for details",
  //       );
  //     }
  //   }
  //   resetItemForm();
  // };

  const deleteItem = async (itemNo) => {
    const permitId = permitDetails?.PermitId;
    setIsDeletingItem(true);
    try {
      const [commonRes, inRes] = await Promise.allSettled([
        API.post("/deleteItem/", { ItemNos: [itemNo], PermitId: permitId }),
        API.post("inpayment/deleteInItem/", {
          ItemNos: [itemNo],
          PermitId: permitId,
        }),
      ]);

      if (commonRes.status === "rejected") throw commonRes.reason;

      setItemTable(commonRes.value.data.Records);
      const nextSerial = (commonRes.value.data.Records.length + 1)
        .toString()
        .padStart("0");
      setSerialNumber(nextSerial);

      if (inRes.status === "rejected") {
        alert(
          `Warning: Item No ${itemNo} was deleted from CommonItemDtl but FAILED to delete from ItemDtl. ` +
            `Please contact support or retry.\n\nError: ${inRes.reason.response?.data?.error || inRes.reason.message}`,
        );
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert(
        error.response?.data?.error ||
          "Failed to delete item, check console for details",
      );
    } finally {
      setIsDeletingItem(false);
    }
    resetItemForm();
  };

  // ---------------------------EDIT ITEM -----------------

  const editItem = async (itemNo) => {
    const item = itemTable.find((i) => i.ItemNo === itemNo);
    if (!item) return;
    const permitId = permitDetails?.PermitId;

    setSerialNumber(item.ItemNo?.toString().padStart(3));
    const selectedHs = hsCodeSuggestions.find(
      (i) => i.HSCode.toLowerCase() === item.HSCode?.toLowerCase(),
    );
    if (selectedHs) {
      setHsCodeRow(selectedHs);
      applyHsLogic(selectedHs);
    }
    setHsCode(item.HSCode || "");
    setHsCodeDescription(item.Description || "");
    setDgIndicator(item.DGIndicator === "Yes");
    setCountryCode(item.Contry || "");
    setBrand(item.Brand || "");
    if (item.Brand == "UNBRANDED") {
      setUnbranded(true);
    }
    setModel(item.Model || "");
    setHawb(item.InHAWBOBL || "");
    setDuitableQuantity(item.DutiableQty || 0);
    setDuitableQuantityUom(item.DutiableUOM || "--Select--");
    setTotalDuitableQuantity(item.TotalDutiableQty || 0);
    setTotalDuitableQuantityUom(item.TotalDutiableUOM || "--Select--");
    setInvoiceQuantity(item.InvoiceQuantity || 0);
    setHsQuantity(item.HSQty || 0);
    setHsUom(item.HSUOM || "--Select--");
    setAlcoholPercentage(item.AlcoholPer || 0);
    setSelectedInvoice(item.InvoiceNo || "");
    console.log("invoiceno:", item.InvoiceNo);
    setUnitPrice(item.UnitPrice || 0);
    setInvoiceCurrency(item.UnitPriceCurrency || "");
    console.log("invoiceCurrency:", item.UnitPriceCurrency);
    setInvoiceExRate(item.ExchangeRate || 0);
    console.log("invoiceExRate:", item.ExchangeRate);
    setSumExchangeRate(item.SumExchangeRate || 0);
    setTotalLineAmount(item.TotalLineAmount || 0);
    setTotalInvoiceCharge(item.InvoiceCharges || 0);
    setCifFob(item.CIFFOB || 0);
    setOuterPackQuantity(item.OPQty || 0);
    setOuterPackQuantityUom(item.OPUOM || "");
    setInPackQuantity(item.IPQty || 0);
    setInPackQuantityUom(item.IPUOM || "");
    setInnerPackQuantity(item.InPqty || 0);
    setInnerPackQuantityUom(item.InPUOM || "");
    setImmostPackQuantity(item.ImPQty || 0);
    setImmostPackQuantityUom(item.ImPUOM || "");
    const hasPacking =
      item.OPQty > 0 ||
      item.OPUOM.trim() !== "" ||
      item.IPQty > 0 ||
      item.IPUOM.trim() !== "" ||
      item.InPqty > 0 ||
      item.ImPUOM.trim() !== "" ||
      item.ImPQty > 0 ||
      item.ImPUOM.trim() !== "";
    setPackingChecked(hasPacking);
    setShowPacking(hasPacking);
    setPreferentialCode(item.PreferentialCode || "");
    setGstRateValue(item.GSTRate);
    setGstUom(item.GSTUOM || "");
    setGstSum(item.GSTAmount || 0);
    setExciseDutyRate(item.ExciseDutyRate || 0);
    setExciseDutyUom(item.ExciseDutyUOM || "");
    setExciseDutyAmount(item.ExciseDutyAmount || 0);
    setCustomsDutyRate(item.CustomsDutyRate || 0);
    setCustomsDutyUom(item.CustomsDutyUOM || "");
    setCustomsDutyAmount(item.CustomsDutyAmount || 0);
    setOtherTaxRate(item.OtherTaxRate || 0);
    setOtherTaxUom(item.OtherTaxUOM || "");
    setOtherTaxAmount(item.OtherTaxAmount || 0);
    setLastSellingPrice(item.LSPValue || 0);

    const hasLotId =
      item.CurrentLot?.trim() ||
      item.Making?.trim() ||
      item.PreviousLot?.trim();
    setShowLotId(!!hasLotId);
    setCurrentLot(item.CurrentLot || "");
    setMaking(item.Making || "");
    setPreviousLot(item.PreviousLot || "");

    const hasShippingMarks =
      item.ShippingMarks1?.trim() ||
      item.ShippingMarks2?.trim() ||
      item.ShippingMarks3?.trim() ||
      item.ShippingMarks4?.trim();
    setShowShippingMarks(!!hasShippingMarks);
    setShippingMarks1(item.ShippingMarks1 || "");
    setShippingMarks2(item.ShippingMarks2 || "");
    setShippingMarks3(item.ShippingMarks3 || "");
    setShippingMarks4(item.ShippingMarks4 || "");
    setOptionalCharges(item.Optioncahrge || 0);
    // setOptionlAmount(item.OptionalSumtotal || 0);
    setSelectedCurrency(
      item.OptionalChrgeUOM
        ? {
            CurrencyUOM: item.OptionalChrgeUOM,
            CurrencyRate: item.OptionalSumExchage,
          }
        : null,
    );
    setEditingSNo(item.ItemNo);
    try {
      const res = await API.get(`/getCasc/${permitId}/`);
      const filtered = res.data.filter(
        (c) => String(c.ItemNo) === String(itemNo),
      );
      const maxCascBoxes = 3;
      const finalCasc = Array.from({ length: maxCascBoxes }, () => ({
        code: "",
        hsQuantity: 0,
        uom: "",
        casc: [],
      }));
      filtered.forEach((c) => {
        const cascIndex = parseInt(c.CASCId.replace("Casc", "")) - 1;
        if (cascIndex < 0 || cascIndex >= maxCascBoxes) return;
        if (!finalCasc[cascIndex].code) {
          finalCasc[cascIndex].code = c.ProductCode;
          finalCasc[cascIndex].hsQuantity = c.Quantity;
          finalCasc[cascIndex].uom = c.ProductUOM;
        }
        const row = [c.CascCode1 || "", c.CascCode2 || "", c.CascCode3 || ""];
        finalCasc[cascIndex].casc.push(row);
      });
      setItemCasc(finalCasc);
      const hasCasc = filtered.length > 0;
      setItemCascChecked(hasCasc);
      setShowItemCasc(hasCasc);
    } catch (error) {
      console.error("CASC fetch failed", error);
      const emptyCasc = Array.from({ length: 3 }, () => ({
        code: "",
        hsQuantity: 0,
        uom: "",
        casc: [],
      }));
      setItemCasc(emptyCasc);
      setItemCascChecked(false);
      setShowItemCasc(false);
    }
    handleCountryFocusOut(item.Contry || "");
    const matched = applyInvoiceChange(item.InvoiceNo, false);
    if (matched) {
      invoiceTotalLineAmountFunction(
        item.TotalLineAmount,
        matched.TIExRate,
        item.InvoiceNo,
      );
    } else {
      invoiceTotalLineAmountFunction(
        item.TotalLineAmount,
        item.ExchangeRate,
        item.InvoiceNo,
      );
    }
  };

  //----------------------------Reset Item-----------
  const resetItemForm = () => {
    // ---------------- BASIC DETAILS ----------------
    setHsCode("");
    setHsCodeDescription("");
    setDgIndicator(false);
    setCountryCode("");
    setCountryDescription("");
    setBrand("");
    setModel("");
    setHawb((cargoHawbList?.[0] || "").toUpperCase());

    // ---------------- DUTIABLE ----------------
    setDuitableQuantity("");
    setDuitableQuantityUom("--Select--");
    setTotalDuitableQuantity("");
    setTotalDuitableQuantityUom("--Select--");
    setInvoiceQuantity("");
    setHsQuantity("");
    setHsUom("--Select--");
    setAlcoholPercentage("");
    setSelectedInvoice("");

    // ---------------- INVOICE ----------------
    setUnitPrice("");
    setInvoiceCurrency("");
    setInvoiceExRate("");
    setSumExchangeRate("");
    setTotalLineAmount("");
    setTotalInvoiceCharge("");
    setCifFob("");

    // ---------------- PACKING ----------------
    setPackingChecked(false);
    setShowPacking(false);
    // ---------------- DUTY ----------------
    setPreferentialCode("");
    setGstRateValue(9);
    setGstUom("PER");
    setGstSum("");
    setExciseDutyRate("");
    setExciseDutyUom("");
    setExciseDutyAmount("");
    setCustomsDutyRate("");
    setCustomsDutyUom("");
    setCustomsDutyAmount("");
    setOtherTaxRate("");
    setOtherTaxUom("");
    setOtherTaxAmount("");

    // ---------------- LAST SELLING PRICE ----------------
    setLastSellingPrice("");

    // ---------------- SHIPPING MARKS ----------------
    setShippingMarks1("");
    setShippingMarks2("");
    setShippingMarks3("");
    setShippingMarks4("");

    // ---------------- LOT ID ----------------
    setCurrentLot("");
    setMaking("");
    setPreviousLot("");
    // ---------------- OPTIONAL CHARGES ----------------
    setOptionalCharges("");
    setOptionalAmount("");
    setSelectedCurrency(null);

    // ---------------- UI VISIBILITY ----------------
    setItemCasc(defaultItemCasc);
    setShowShippingMarks(false);
    setShowAlcholPercentage(false);
    setItemCascChecked(false);
    setShowItemCasc(false);
    setHsCodeRow(false);
    setShowDutiableQuantity(false);
    setShowVehicle(false);
    setShowOptionalCharges(false);
    setShowUnitPriceVal(false);
    setUnbranded(false);
    setShowLotId(false);
  };

  const downloadExcel = async (type) => {
    try {
      const response = await API.get(`/downloadExcelTemplate/${type}/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  // const ItemUploadData = async () => {
  //   const fileInput = fileInputRef.current;
  //   if (!fileInput || !fileInput.files[0]) {
  //     alert("Please select a file first!");
  //     return;
  //   }
  //   if (itemTable.length >= 50) {
  //     alert("Maximum 50 items allowed. Cannot upload more items.");
  //     return;
  //   }

  //   const file = fileInput.files[0];

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("PermitId", permitDetails?.PermitId);
  //   formData.append("MsgType", "IPTDEC");
  //   formData.append("UserName", user.username.toUpperCase());
  //   formData.append("TouchTime", new Date().toISOString());
  //   try {
  //     setLoading(true);
  //     const res = await API.post("/uploadedExcelItem/", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (res.data.error) {
  //       alert(res.data.error);
  //       return;
  //     }

  //     setItemTable(res.data.item);

  //     if (res.data.casc && res.data.casc.length > 0) {
  //       const groupedCasc = defaultItemCasc.map((defaultCasc, i) => {
  //         const cascId = `Casc${i + 1}`;
  //         const rows = res.data.casc.filter((c) => c.CASCId === cascId);
  //         if (rows.length === 0) return defaultCasc;
  //         return {
  //           code: rows[0].ProductCode || "",
  //           hsQuantity: rows[0].Quantity || 0,
  //           uom: rows[0].ProductUOM || "",
  //           CascId: cascId,
  //           casc: rows.map((r) => [
  //             r.CascCode1 || "",
  //             r.CascCode2 || "",
  //             r.CascCode3 || "",
  //           ]),
  //         };
  //       });
  //       setItemCasc(groupedCasc);
  //     } else {
  //       setItemCasc(defaultItemCasc);
  //     }
  //     alert(res.data.Result);
  //   } catch (error) {
  //     console.error("Upload failed", error);
  //     alert("Upload failed: " + (error.response?.data?.error || error.message));
  //   } finally {
  //     setLoading(false);
  //     fileInputRef.current.value = "";
  //   }
  // };

  const ItemUploadData = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files[0]) {
      alert("Please select a file first!");
      return;
    }
    if (itemTable.length >= 150) {
      alert("Maximum 150 items allowed. Cannot upload more items.");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("PermitId", permitDetails?.PermitId);
    formData.append("MsgType", "IPTDEC");
    formData.append("UserName", user.username.toUpperCase());
    formData.append("TouchTime", new Date().toISOString());
    try {
      setIsUploadItem(true);
      const res = await API.post("/uploadedExcelItem/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      setItemTable(res.data.item);

      if (res.data.casc && res.data.casc.length > 0) {
        const groupedCasc = defaultItemCasc.map((defaultCasc, i) => {
          const cascId = `Casc${i + 1}`;
          const rows = res.data.casc.filter((c) => c.CASCId === cascId);
          if (rows.length === 0) return defaultCasc;
          return {
            code: rows[0].ProductCode || "",
            hsQuantity: rows[0].Quantity || 0,
            uom: rows[0].ProductUOM || "",
            CascId: cascId,
            casc: rows.map((r) => [
              r.CascCode1 || "",
              r.CascCode2 || "",
              r.CascCode3 || "",
            ]),
          };
        });
        setItemCasc(groupedCasc);
      } else {
        setItemCasc(defaultItemCasc);
      }

      // ---------------- Mirror upload to InItemDtl / InCASCDtl ----------------
      const inFormData = new FormData();
      inFormData.append("file", file);
      inFormData.append("PermitId", permitDetails?.PermitId);
      inFormData.append("MsgType", "IPTDEC");
      inFormData.append("UserName", user.username.toUpperCase());
      inFormData.append("TouchTime", new Date().toISOString());
      try {
        // await API.post("inpayment/uploadedInItemExcel/", inFormData, {
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        await API.post("inpayment/syncInItemFromCommon/", {
          PermitId: permitDetails?.PermitId,
        });
      } catch (mirrorError) {
        console.error("Mirror upload failed", mirrorError);
        alert(
          "Warning: Excel data was uploaded to CommonItemDtl but FAILED to mirror to InItemDtl. " +
            "Please contact support or re-upload.\n\n" +
            `Error: ${mirrorError.response?.data?.error || mirrorError.message}`,
        );
      }

      // alert(res.data.Result);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed: " + (error.response?.data?.error || error.message));
    } finally {
      setIsUploadItem(false);
      fileInputRef.current.value = "";
    }
  };

  // get hscode description for if not giving in excel

  const hsCodeMap = useMemo(() => {
    const map = {};
    hsCodeSuggestions.forEach((item) => {
      const code = item.HSCode?.toString().trim();
      if (code) {
        map[code] = item.Description;
      }
    });
    return map;
  }, [hsCodeSuggestions]);

  // ================= Edit All Items Function =================

  // const ItemEditAll = async () => {
  //   if (itemTable.length === 0) {
  //     alert("No items to update.");
  //     return;
  //   }

  //   const hawbListStored = cargoHawbList || [];
  //   const firstHawb = hawbListStored[0] || "";

  //   setLoading(true);

  //   try {
  //     const ItemAllData = itemTable.map((item) => {
  //       const matchedInvoice = invoiceNumbers.find(
  //         (inv) => inv.InvoiceNo === item.InvoiceNo,
  //       );
  //       let recalcInvoiceCharges = item.InvoiceCharges || 0;
  //       let recalcCIFFOB = item.CIFFOB || 0;
  //       if (matchedInvoice) {
  //         const itotalAmount = Number(item.TotalLineAmount) || 0;
  //         const icurrinput = Number(matchedInvoice.TIExRate) || 0;
  //         const totalAmd =
  //           Number(matchedInvoice.OTCSAmount) +
  //           Number(matchedInvoice.FCSAmount) +
  //           Number(matchedInvoice.ICSAmount);
  //         const TotInvoiceAmd = Number(matchedInvoice.TISAmount);
  //         if (TotInvoiceAmd !== 0) {
  //           const InvoiceAmd = totalAmd / TotInvoiceAmd;
  //           const TotalLineAmd = icurrinput * itotalAmount;
  //           recalcInvoiceCharges = parseFloat(
  //             (InvoiceAmd * TotalLineAmd).toFixed(2),
  //           );
  //           recalcCIFFOB = parseFloat(
  //             (TotalLineAmd + recalcInvoiceCharges).toFixed(2),
  //           );
  //         }
  //       }
  //       const gstPerval = (parseFloat(item.GSTRate) || 0) / 100;
  //       const exciseAmt = parseFloat(item.ExciseDutyAmount) || 0;
  //       const customsAmt = parseFloat(item.CustomsDutyAmount) || 0;
  //       let recalcGST = 0;
  //       if (decType !== "GST : GST (Including Duty Exemption)") {
  //         recalcGST = (exciseAmt + recalcCIFFOB + customsAmt) * gstPerval;
  //       } else {
  //         recalcGST = recalcCIFFOB * gstPerval;
  //       }
  //       recalcGST = parseFloat(recalcGST.toFixed(2));
  //       // ================= Hscode DESCRIPTION FALLBACK =================
  //       const hsCode = (item.HSCode || "").toString().trim();
  //       const descFromExcel = (item.Description || "").trim();
  //       const finalDescription = descFromExcel || hsCodeMap[hsCode] || "";
  //       return {
  //         ItemNo: item.ItemNo,
  //         PermitId: permitDetails?.PermitId,
  //         MessageType: item.MessageType || "IPTDEC",
  //         HSCode: item.HSCode || "",
  //         // Description: item.Description || "",
  //         Description: finalDescription,
  //         DGIndicator: item.DGIndicator || "",
  //         Contry: item.Contry || "",
  //         Brand: item.Brand || "",
  //         Model: item.Model || "",
  //         InHAWBOBL: (firstHawb || item.InHAWBOBL || "").toUpperCase(),
  //         DutiableQty: item.DutiableQty || 0,
  //         DutiableUOM: item.DutiableUOM || "",
  //         TotalDutiableQty: item.TotalDutiableQty || 0,
  //         TotalDutiableUOM: item.TotalDutiableUOM || "",
  //         InvoiceQuantity: item.InvoiceQuantity || 0,
  //         HSQty: item.HSQty || 0,
  //         HSUOM: item.HSUOM || "",
  //         AlcoholPer: item.AlcoholPer || 0,
  //         InvoiceNo: item.InvoiceNo || "",
  //         ChkUnitPrice: item.ChkUnitPrice || "",
  //         UnitPrice: item.UnitPrice || 0,
  //         UnitPriceCurrency:
  //           matchedInvoice?.TICurrency || item.UnitPriceCurrency || "",
  //         ExchangeRate: matchedInvoice?.TIExRate || item.ExchangeRate || 0,
  //         SumExchangeRate: item.SumExchangeRate || 0,
  //         TotalLineAmount: item.TotalLineAmount || 0,
  //         InvoiceCharges: recalcInvoiceCharges,
  //         CIFFOB: recalcCIFFOB,
  //         OPQty: item.OPQty || 0,
  //         OPUOM: item.OPUOM || "",
  //         IPQty: item.IPQty || 0,
  //         IPUOM: item.IPUOM || "",
  //         InPqty: item.InPqty || 0,
  //         InPUOM: item.InPUOM || "",
  //         ImPQty: item.ImPQty || 0,
  //         ImPUOM: item.ImPUOM || "",
  //         PreferentialCode: item.PreferentialCode || "",
  //         GSTRate: item.GSTRate || 9,
  //         GSTUOM: item.GSTUOM || "PER",
  //         GSTAmount: recalcGST,
  //         ExciseDutyRate: item.ExciseDutyRate || 0,
  //         ExciseDutyUOM: item.ExciseDutyUOM || "",
  //         ExciseDutyAmount: item.ExciseDutyAmount || 0,
  //         CustomsDutyRate: item.CustomsDutyRate || 0,
  //         CustomsDutyUOM: item.CustomsDutyUOM || "",
  //         CustomsDutyAmount: item.CustomsDutyAmount || 0,
  //         OtherTaxRate: item.OtherTaxRate || 0,
  //         OtherTaxUOM: item.OtherTaxUOM || "",
  //         OtherTaxAmount: item.OtherTaxAmount || 0,
  //         CurrentLot: item.CurrentLot || "",
  //         PreviousLot: item.PreviousLot || "",
  //         LSPValue: item.LSPValue || 0,
  //         Making: item.Making || "",
  //         ShippingMarks1: item.ShippingMarks1 || "",
  //         ShippingMarks2: item.ShippingMarks2 || "",
  //         ShippingMarks3: item.ShippingMarks3 || "",
  //         ShippingMarks4: item.ShippingMarks4 || "",
  //         TouchUser: user.username.toUpperCase(),
  //         TouchTime: new Date().toISOString(),
  //         VehicleType: item.VehicleType || "",
  //         EngineCapcity: item.EngineCapcity || "",
  //         EngineCapUOM: item.EngineCapUOM || "",
  //         orignaldatereg: item.orignaldatereg || "",
  //         OptionalChrgeUOM: item.OptionalChrgeUOM || "",
  //         Optioncahrge: item.Optioncahrge || 0,
  //         OptionalSumtotal: item.OptionalSumtotal || 0,
  //         OptionalSumExchage: item.OptionalSumExchage || 0,
  //       };
  //     });
  //     const res = await API.post("/editAllItems/", {
  //       Item: ItemAllData,
  //       PermitId: permitDetails?.PermitId,
  //     });
  //     setItemTable(res.data.Item);
  //     alert(res.data.message);
  //   } catch (error) {
  //     console.error("Edit All failed", error);
  //     alert(
  //       "Update failed: " + (error.response?.data?.message || error.message),
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const ItemEditAll = async () => {
  //   if (itemTable.length === 0) {
  //     alert("No items to update.");
  //     return;
  //   }

  //   const hawbListStored = cargoHawbList || [];
  //   const firstHawb = hawbListStored[0] || "";

  //   setIsItemEditall(true);

  //   try {
  //     const ItemAllData = itemTable.map((item) => {
  //       const matchedInvoice = invoiceNumbers.find(
  //         (inv) => inv.InvoiceNo === item.InvoiceNo,
  //       );
  //       let recalcInvoiceCharges = item.InvoiceCharges || 0;
  //       let recalcCIFFOB = item.CIFFOB || 0;
  //       if (matchedInvoice) {
  //         const itotalAmount = Number(item.TotalLineAmount) || 0;
  //         const icurrinput = Number(matchedInvoice.TIExRate) || 0;
  //         const totalAmd =
  //           Number(matchedInvoice.OTCSAmount) +
  //           Number(matchedInvoice.FCSAmount) +
  //           Number(matchedInvoice.ICSAmount);
  //         const TotInvoiceAmd = Number(matchedInvoice.TISAmount);
  //         if (TotInvoiceAmd !== 0) {
  //           const InvoiceAmd = totalAmd / TotInvoiceAmd;
  //           const TotalLineAmd = icurrinput * itotalAmount;
  //           recalcInvoiceCharges = parseFloat(
  //             (InvoiceAmd * TotalLineAmd).toFixed(2),
  //           );
  //           recalcCIFFOB = parseFloat(
  //             (TotalLineAmd + recalcInvoiceCharges).toFixed(2),
  //           );
  //         }
  //       }
  //       const gstPerval = (parseFloat(item.GSTRate) || 0) / 100;
  //       const exciseAmt = parseFloat(item.ExciseDutyAmount) || 0;
  //       const customsAmt = parseFloat(item.CustomsDutyAmount) || 0;
  //       let recalcGST = 0;
  //       if (decType !== "GST : GST (Including Duty Exemption)") {
  //         recalcGST = (exciseAmt + recalcCIFFOB + customsAmt) * gstPerval;
  //       } else {
  //         recalcGST = recalcCIFFOB * gstPerval;
  //       }
  //       recalcGST = parseFloat(recalcGST.toFixed(2));
  //       // ================= Hscode DESCRIPTION FALLBACK =================
  //       const hsCode = (item.HSCode || "").toString().trim();
  //       const descFromExcel = (item.Description || "").trim();
  //       const finalDescription = descFromExcel || hsCodeMap[hsCode] || "";
  //       return {
  //         ItemNo: item.ItemNo,
  //         PermitId: permitDetails?.PermitId,
  //         MessageType: item.MessageType || "IPTDEC",
  //         HSCode: item.HSCode || "",
  //         // Description: item.Description || "",
  //         Description: finalDescription,
  //         DGIndicator: item.DGIndicator || "",
  //         Contry: item.Contry || "",
  //         Brand: item.Brand || "",
  //         Model: item.Model || "",
  //         InHAWBOBL: (firstHawb || item.InHAWBOBL || "").toUpperCase(),
  //         DutiableQty: item.DutiableQty || 0,
  //         DutiableUOM: item.DutiableUOM || "",
  //         TotalDutiableQty: item.TotalDutiableQty || 0,
  //         TotalDutiableUOM: item.TotalDutiableUOM || "",
  //         InvoiceQuantity: item.InvoiceQuantity || 0,
  //         HSQty: item.HSQty || 0,
  //         HSUOM: item.HSUOM || "",
  //         AlcoholPer: item.AlcoholPer || 0,
  //         InvoiceNo: item.InvoiceNo || "",
  //         ChkUnitPrice: item.ChkUnitPrice || "",
  //         UnitPrice: item.UnitPrice || 0,
  //         UnitPriceCurrency:
  //           matchedInvoice?.TICurrency || item.UnitPriceCurrency || "",
  //         ExchangeRate: matchedInvoice?.TIExRate || item.ExchangeRate || 0,
  //         SumExchangeRate: item.SumExchangeRate || 0,
  //         TotalLineAmount: item.TotalLineAmount || 0,
  //         InvoiceCharges: recalcInvoiceCharges,
  //         CIFFOB: recalcCIFFOB,
  //         OPQty: item.OPQty || 0,
  //         OPUOM: item.OPUOM || "",
  //         IPQty: item.IPQty || 0,
  //         IPUOM: item.IPUOM || "",
  //         InPqty: item.InPqty || 0,
  //         InPUOM: item.InPUOM || "",
  //         ImPQty: item.ImPQty || 0,
  //         ImPUOM: item.ImPUOM || "",
  //         PreferentialCode: item.PreferentialCode || "",
  //         GSTRate: item.GSTRate || 9,
  //         GSTUOM: item.GSTUOM || "PER",
  //         GSTAmount: recalcGST,
  //         ExciseDutyRate: item.ExciseDutyRate || 0,
  //         ExciseDutyUOM: item.ExciseDutyUOM || "",
  //         ExciseDutyAmount: item.ExciseDutyAmount || 0,
  //         CustomsDutyRate: item.CustomsDutyRate || 0,
  //         CustomsDutyUOM: item.CustomsDutyUOM || "",
  //         CustomsDutyAmount: item.CustomsDutyAmount || 0,
  //         OtherTaxRate: item.OtherTaxRate || 0,
  //         OtherTaxUOM: item.OtherTaxUOM || "",
  //         OtherTaxAmount: item.OtherTaxAmount || 0,
  //         CurrentLot: item.CurrentLot || "",
  //         PreviousLot: item.PreviousLot || "",
  //         LSPValue: item.LSPValue || 0,
  //         Making: item.Making || "",
  //         ShippingMarks1: item.ShippingMarks1 || "",
  //         ShippingMarks2: item.ShippingMarks2 || "",
  //         ShippingMarks3: item.ShippingMarks3 || "",
  //         ShippingMarks4: item.ShippingMarks4 || "",
  //         TouchUser: user.username.toUpperCase(),
  //         TouchTime: new Date().toISOString(),
  //         VehicleType: item.VehicleType || "",
  //         EngineCapcity: item.EngineCapcity || "",
  //         EngineCapUOM: item.EngineCapUOM || "",
  //         orignaldatereg: item.orignaldatereg || "",
  //         OptionalChrgeUOM: item.OptionalChrgeUOM || "",
  //         Optioncahrge: item.Optioncahrge || 0,
  //         OptionalSumtotal: item.OptionalSumtotal || 0,
  //         OptionalSumExchage: item.OptionalSumExchage || 0,
  //       };
  //     });

  //     const payload = {
  //       Item: ItemAllData,
  //       PermitId: permitDetails?.PermitId,
  //     };

  //     // Step 1: Update CommonItemDtl
  //     const res = await API.post("/editAllItems/", payload);
  //     setItemTable(res.data.Item);

  //     // Step 2: Mirror update to ItemDtl (inpayment)
  //     try {
  //       await API.post("inpayment/editInAllItems/", payload);
  //       console.log("All items mirrored to ItemDtl");
  //     } catch (mirrorError) {
  //       console.error("Mirror edit-all failed", mirrorError);
  //       alert(
  //         "Warning: Items were updated in CommonItemDtl but FAILED to mirror to ItemDtl. " +
  //           "Please contact support or retry.\n\n" +
  //           `Error: ${mirrorError.response?.data?.message || mirrorError.message}`,
  //       );
  //       return;
  //     }

  //     // alert(res.data.message);
  //   } catch (error) {
  //     console.error("Edit All failed", error);
  //     alert(
  //       "Update failed: " + (error.response?.data?.message || error.message),
  //     );
  //   }
  //    finally {
  //     setIsItemEditall(false);
  //   }
  // };

  const ItemEditAll = async () => {
    if (itemTable.length === 0) {
      alert("No items to update.");
      return;
    }

    const hawbListStored = cargoHawbList || [];
    const firstHawb = hawbListStored[0] || "";

    setIsItemEditall(true);

    try {
      const ItemAllData = itemTable.map((item) => {
        const matchedInvoice = invoiceNumbers.find(
          (inv) => inv.InvoiceNo === item.InvoiceNo,
        );
        let recalcInvoiceCharges = item.InvoiceCharges || 0;
        let recalcCIFFOB = item.CIFFOB || 0;
        if (matchedInvoice) {
          const itotalAmount = Number(item.TotalLineAmount) || 0;
          const icurrinput = Number(matchedInvoice.TIExRate) || 0;
          const totalAmd =
            Number(matchedInvoice.OTCSAmount) +
            Number(matchedInvoice.FCSAmount) +
            Number(matchedInvoice.ICSAmount);
          const TotInvoiceAmd = Number(matchedInvoice.TISAmount);
          if (TotInvoiceAmd !== 0) {
            const InvoiceAmd = totalAmd / TotInvoiceAmd;
            const TotalLineAmd = icurrinput * itotalAmount;
            recalcInvoiceCharges = parseFloat(
              (InvoiceAmd * TotalLineAmd).toFixed(2),
            );
            recalcCIFFOB = parseFloat(
              (TotalLineAmd + recalcInvoiceCharges).toFixed(2),
            );
          }
        }
        const gstPerval = (parseFloat(item.GSTRate) || 0) / 100;
        const exciseAmt = parseFloat(item.ExciseDutyAmount) || 0;
        const customsAmt = parseFloat(item.CustomsDutyAmount) || 0;
        let recalcGST = 0;
        if (decType !== "GST : GST (Including Duty Exemption)") {
          recalcGST = (exciseAmt + recalcCIFFOB + customsAmt) * gstPerval;
        } else {
          recalcGST = recalcCIFFOB * gstPerval;
        }
        recalcGST = parseFloat(recalcGST.toFixed(2));
        // ================= Hscode DESCRIPTION FALLBACK =================
        const hsCode = (item.HSCode || "").toString().trim();
        const descFromExcel = (item.Description || "").trim();
        const finalDescription = descFromExcel || hsCodeMap[hsCode] || "";
        return {
          ItemNo: item.ItemNo,
          PermitId: permitDetails?.PermitId,
          MessageType: item.MessageType || "IPTDEC",
          HSCode: item.HSCode || "",
          // Description: item.Description || "",
          Description: finalDescription,
          DGIndicator: item.DGIndicator || "",
          Contry: item.Contry || "",
          Brand: item.Brand || "",
          Model: item.Model || "",
          InHAWBOBL: (firstHawb || item.InHAWBOBL || "").toUpperCase(),
          DutiableQty: item.DutiableQty || 0,
          DutiableUOM: item.DutiableUOM || "",
          TotalDutiableQty: item.TotalDutiableQty || 0,
          TotalDutiableUOM: item.TotalDutiableUOM || "",
          InvoiceQuantity: item.InvoiceQuantity || 0,
          HSQty: item.HSQty || 0,
          HSUOM: item.HSUOM || "",
          AlcoholPer: item.AlcoholPer || 0,
          InvoiceNo: item.InvoiceNo || "",
          ChkUnitPrice: item.ChkUnitPrice || "",
          UnitPrice: item.UnitPrice || 0,
          UnitPriceCurrency:
            matchedInvoice?.TICurrency || item.UnitPriceCurrency || "",
          ExchangeRate: matchedInvoice?.TIExRate || item.ExchangeRate || 0,
          SumExchangeRate: item.SumExchangeRate || 0,
          TotalLineAmount: item.TotalLineAmount || 0,
          InvoiceCharges: recalcInvoiceCharges,
          CIFFOB: recalcCIFFOB,
          OPQty: item.OPQty || 0,
          OPUOM: item.OPUOM || "",
          IPQty: item.IPQty || 0,
          IPUOM: item.IPUOM || "",
          InPqty: item.InPqty || 0,
          InPUOM: item.InPUOM || "",
          ImPQty: item.ImPQty || 0,
          ImPUOM: item.ImPUOM || "",
          PreferentialCode: item.PreferentialCode || "",
          GSTRate: item.GSTRate || 9,
          GSTUOM: item.GSTUOM || "PER",
          GSTAmount: recalcGST,
          ExciseDutyRate: item.ExciseDutyRate || 0,
          ExciseDutyUOM: item.ExciseDutyUOM || "",
          ExciseDutyAmount: item.ExciseDutyAmount || 0,
          CustomsDutyRate: item.CustomsDutyRate || 0,
          CustomsDutyUOM: item.CustomsDutyUOM || "",
          CustomsDutyAmount: item.CustomsDutyAmount || 0,
          OtherTaxRate: item.OtherTaxRate || 0,
          OtherTaxUOM: item.OtherTaxUOM || "",
          OtherTaxAmount: item.OtherTaxAmount || 0,
          CurrentLot: item.CurrentLot || "",
          PreviousLot: item.PreviousLot || "",
          LSPValue: item.LSPValue || 0,
          Making: item.Making || "",
          ShippingMarks1: item.ShippingMarks1 || "",
          ShippingMarks2: item.ShippingMarks2 || "",
          ShippingMarks3: item.ShippingMarks3 || "",
          ShippingMarks4: item.ShippingMarks4 || "",
          TouchUser: user.username.toUpperCase(),
          TouchTime: new Date().toISOString(),
          VehicleType: item.VehicleType || "",
          EngineCapcity: item.EngineCapcity || "",
          EngineCapUOM: item.EngineCapUOM || "",
          orignaldatereg: item.orignaldatereg || "",
          OptionalChrgeUOM: item.OptionalChrgeUOM || "",
          Optioncahrge: item.Optioncahrge || 0,
          OptionalSumtotal: item.OptionalSumtotal || 0,
          OptionalSumExchage: item.OptionalSumExchage || 0,
        };
      });

      const payload = {
        Item: ItemAllData,
        PermitId: permitDetails?.PermitId,
      };

      // Step 1: Update CommonItemDtl
      const res = await API.post("/editAllItems/", payload);
      setItemTable(res.data.Item);

      // Step 2: Mirror update to ItemDtl (inpayment)
      try {
        // await API.post("inpayment/editInAllItems/", payload);
        // console.log("All items mirrored to ItemDtl");
        await API.post("inpayment/syncInItemFromCommon/", {
          PermitId: permitDetails?.PermitId,
        });
      } catch (mirrorError) {
        console.error("Mirror edit-all failed", mirrorError);
        alert(
          "Warning: Items were updated in CommonItemDtl but FAILED to mirror to ItemDtl. " +
            "Please contact support or retry.\n\n" +
            `Error: ${mirrorError.response?.data?.message || mirrorError.message}`,
        );
        return;
      }

      // alert(res.data.message);
    } catch (error) {
      console.error("Edit All failed", error);
      alert(
        "Update failed: " + (error.response?.data?.message || error.message),
      );
    } finally {
      setIsItemEditall(false);
    }
  };

  const applyBrandToAllItems = async (newBrandValue) => {
    if (itemTable.length === 0) {
      alert("No items to update.");
      return;
    }

    const permitId = permitDetails?.PermitId;
    if (!permitId) {
      alert("PermitId not found.");
      return;
    }

    setIsItemEditall(true);
    let commonUpdated = false;

    try {
      // Step 1: direct UPDATE on CommonItemDtl
      const res = await API.post("/updateItemBrand/", {
        PermitId: permitId,
        Brand: newBrandValue,
      });
      commonUpdated = true;
      setItemTable(res.data.Records);

      // Step 2: mirror to ItemDtl (inpayment)
      try {
        await API.post("inpayment/updateInItemBrand/", {
          PermitId: permitId,
          Brand: newBrandValue,
        });
      } catch (mirrorErr) {
        console.error("Mirror brand update failed", mirrorErr);
        alert(
          "Warning: Brand was updated in CommonItemDtl but FAILED to mirror to ItemDtl. " +
            "Please contact support or retry.\n\n" +
            `Error: ${mirrorErr.response?.data?.error || mirrorErr.message}`,
        );
        return; // keep input so user can retry
      }

      setAllBrandInput("");
      // alert(
      //   newBrandValue
      //     ? "Brand applied to all items successfully"
      //     : "Brand deleted from all items successfully",
      // );
    } catch (error) {
      console.error("Bulk brand update failed", error);
      alert(
        error.response?.data?.error ||
          "Failed to update brand for all items, check console for details",
      );
    } finally {
      setIsItemEditall(false);
    }
  };

  const handleAllItemBrand = () => {
    if (!allBrandInput.trim()) {
      alert("Please enter a brand name first");
      return;
    }
    applyBrandToAllItems(allBrandInput.trim().toUpperCase());
  };

  const handleDeleteBrand = () => {
    applyBrandToAllItems("");
  };
  // ==================Delete hawb from all items when hawb deleted from header==================
  const deleteHblHawb = async () => {
    const permitId = permitDetails?.PermitId;
    let commonCleared = false;

    try {
      await API.delete(`/deleteHawbByPermitId/${permitId}/`);
      commonCleared = true;

      setItemTable((prev) =>
        prev.map((item) => ({
          ...item,
          InHAWBOBL: "",
          OutHAWBOBL: "",
        })),
      );

      await API.delete(`inpayment/deleteInHawbByPermitId/${permitId}/`);

      // alert("All HAWB/HBL cleared successfully from both tables");
    } catch (error) {
      console.error(error);

      if (commonCleared) {
        alert(
          "Warning: HAWB/HBL was cleared in CommonItemDtl but FAILED to clear in ItemDtl. " +
            "Please contact support or retry.\n\n" +
            `Error: ${error.response?.data?.error || error.message}`,
        );
      } else {
        alert("Failed to clear HAWB/HBL");
      }
    }
  };

  const fetchMakingLot = async () => {
    try {
      const response = await API.get("/getMakingLotFromCommonMaster/");
      setMakingLot(response.data);
    } catch (error) {
      console.error("Error fetching makingLot data:", error);
    }
  };
  useEffect(() => {
    fetchMakingLot();
  }, []);

  // ====================Next item Previous Item Function====================
  const NextItem = () => {
    const inputVal = document.getElementById("ItemNextItemID").value.trim();
    const currentItemNo = inputVal !== "" ? parseInt(inputVal) : null;

    if (currentItemNo === null) return;

    // Find next item from table
    const nextItem = itemTable.find(
      (item) => item.ItemNo === currentItemNo + 1,
    );
    if (nextItem) {
      editItem(nextItem.ItemNo);
      document.getElementById("ItemNextItemID").value = nextItem.ItemNo;
    } else {
      alert("No next item found.");
    }
  };

  const PreviousItem = () => {
    const inputVal = document.getElementById("ItemNextItemID").value.trim();
    const currentItemNo = inputVal !== "" ? parseInt(inputVal) : null;

    if (currentItemNo === null) return;

    // Find previous item from table
    const prevItem = itemTable.find(
      (item) => item.ItemNo === currentItemNo - 1,
    );
    if (prevItem) {
      editItem(prevItem.ItemNo);
      document.getElementById("ItemNextItemID").value = prevItem.ItemNo;
    } else {
      alert("No previous item found.");
    }
  };

  const sortedItemTable = useMemo(() => {
    return [...itemTable].sort((a, b) => Number(a.ItemNo) - Number(b.ItemNo));
  }, [itemTable]);

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
        MessageType: "IPTDEC",

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
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "") return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

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
  //     Message: "AUTO-SAVED|TAB:ItemPage",
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

  // if this permtiid already exists with data

  // ======================== LOAD EXISTING ITEMS ON PAGE (RE)ENTRY ========================
  const itemFetchedRef = useRef(false);

  useEffect(() => {
    const fetchExistingItems = async () => {
      if (!permitDetails?.PermitId) return;
      if (itemFetchedRef.current) return;
      itemFetchedRef.current = true;

      try {
        const response = await API.get(
          `/getItemByEditPermitId/?PermitId=${permitDetails.PermitId}`,
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          setItemTable(response.data);
          setSerialNumber((response.data.length + 1).toString().padStart(3));
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Failed to load existing items for this permit", err);
        }
      }
    };

    fetchExistingItems();
  }, [permitDetails?.PermitId]);

  // ----------------------- UI ---------------------------------
  return (
    <div className="row g-2">
      <div className="col-12">
        <div className="row">
          <div className="col-7"></div>
          <div className="col-5">
            <button
              type="button"
              style={{ width: "24%" }}
              className="NextpageBtns"
              tabIndex={27}
              onClick={ItemSave}
              disabled={isAddItem}
            >
              {isAddItem ? "Adding Items..." : "ADD ITEM"}
            </button>

            <button
              type="button"
              style={{ width: "24%" }}
              className="NextpageBtns"
              onClick={PreviousItem}
            >
              PREVIOUS
            </button>

            <input
              type="text"
              style={{ display: "inline", width: "22%" }}
              className="inputStyle"
              id="ItemNextItemID"
            />

            <button
              type="button"
              style={{ width: "24%" }}
              className="NextpageBtns"
              onClick={NextItem}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="row">
          <div className="col-4">
            {/* HAWB */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-4" id="itemHwabHbl">
                  HAWB
                </div>
                <div className="col-8">
                  {cargoHawbList.length <= 1 ? (
                    // Single or no HAWB — readonly text
                    <input
                      type="text"
                      id="ItemHawbNo"
                      className="form-control"
                      value={cargoHawbList[0] || ""}
                      readOnly
                    />
                  ) : (
                    <select
                      id="itemHawb"
                      className="Dropdown"
                      value={hawb}
                      onChange={(e) => setHawb(e.target.value)}
                    >
                      {cargoHawbList.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* ITEM NUMBER */}
            <div className="row mt-1">
              <div className="row">
                <div className="col-4">ITEM NUMBER</div>
                <div className="col-8">
                  <input
                    type="text"
                    id="ITEMNUMBER"
                    className="inputStyle"
                    ref={itemNoRef}
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* ITEM CODE */}
            <div className="row mt-4">
              <div className="row">
                <div className="col-4">ITEM CODE</div>
                <div className="col-6 position-relative">
                  <input
                    type="text"
                    className="inputStyle"
                    value={itemCode}
                    onChange={handleItemCodeChange}
                    onKeyDown={handleItemCodeKeyDown}
                    autoComplete="off"
                  />
                  {showItemCodeDropdown &&
                    filteredItemCodeSuggestions.length > 0 && (
                      <div className="dropdown-suggestions">
                        {filteredItemCodeSuggestions.map((item, index) => (
                          <div
                            key={item.Id}
                            className="dropdown-item"
                            style={{
                              backgroundColor:
                                index === highlightedItemIndex
                                  ? "#234263"
                                  : "white",
                              color:
                                index === highlightedItemIndex
                                  ? "white"
                                  : "black",
                              cursor: "pointer",
                            }}
                            onMouseDown={() => handleItemCodeSelect(item)}
                          >
                            {item.HouseCode} - {item.Description}
                          </div>
                        ))}
                      </div>
                    )}
                  {itemCode.trim() === "" && itemCodeError && (
                    <span className="ErrColor">FILL THE CODE</span>
                  )}
                </div>
                <div className="col-1">
                  <button
                    type="button"
                    className="btn"
                    style={{ fontWeight: "bold" }}
                    onClick={handleAddItemCode}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>

            {/* CONTROLLED ITEM */}
            <div
              className="row mt-3"
              id="hsControledId"
              style={{ display: "none" }}
            >
              <div className="row">
                <div className="col-4"></div>
                <div
                  className="col-8"
                  style={{
                    backgroundColor: "brown",
                    color: "white",
                    width: "60%",
                    textAlign: "center",
                  }}
                >
                  CONTROLLED ITEM
                </div>
              </div>
            </div>

            {/* ================= HS CODE ================= */}

            <div className="row">
              <div className="row mt-1">
                <div className="col-4">HS CODE</div>

                <div className="col-8 position-relative">
                  {/* Controlled Item Alert */}
                  {hsCodeRow?.Inpayment === "1" && (
                    <div
                      style={{
                        background: "#ffe6e6",
                        color: "#b30000",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        marginBottom: "4px",
                        display: "inline-block",
                      }}
                    >
                      Controlled Item
                    </div>
                  )}

                  <input
                    type="text"
                    className="inputStyle HighLight"
                    id="ItemHsCode"
                    value={hsCode}
                    onChange={handleHsCodeChange}
                    onKeyDown={handleHsCodeKeyDown}
                    onBlur={handleHsCodeFocusOut}
                    onFocus={() => setHsCodeError(false)}
                    autoComplete="off"
                  />

                  {/* Dropdown */}
                  {showHscodeDropdown &&
                    filteredHsCodeSuggestions.length > 0 && (
                      <div className="dropdown-suggestions">
                        {filteredHsCodeSuggestions.map((item, index) => {
                          const { HSCode, Description } = item;

                          return (
                            <div
                              key={HSCode}
                              className="dropdown-item"
                              style={{
                                backgroundColor:
                                  index === highlightedHsCodeIndex
                                    ? "#234263"
                                    : "white",
                                color:
                                  index === highlightedHsCodeIndex
                                    ? "white"
                                    : "black",
                                cursor: "pointer",
                              }}
                              onMouseDown={() => handleHsCodeSelect(item)}
                              onMouseEnter={() =>
                                setHighlightedHsCodeIndex(index)
                              }
                            >
                              {HSCode} - {Description}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  {hsCode.trim() === "" && hsCodeError && (
                    <span className="ErrColor">FILL HSCODE</span>
                  )}
                </div>
              </div>
            </div>

            {/* ================= DESCRIPTION ================= */}

            <div className="row mt-4">
              <div className="row">
                <div className="col-4">DESCRIPTION</div>

                <div className="col-8">
                  <textarea
                    className="inputStyle"
                    value={hsCodeDescription}
                    style={{ resize: "vertical", minHeight: "90px" }}
                    onChange={(e) => setHsCodeDescription(e.target.value)}
                  />
                  {hsCodeDescription.trim() === "" &&
                    hsCodeDescriptionError && (
                      <span className="ErrColor">FILL HSCODE DESCRIPTION</span>
                    )}
                </div>
              </div>
            </div>

            {/* COO */}
            <div className="row mt-4">
              <div className="row">
                <div className="col-2">COO</div>

                <div className="col-2">
                  <FaSearch
                    style={{ cursor: "pointer" }}
                    onClick={() => handleIconClick("cooLocation")}
                  />
                </div>

                <div className="col-sm-3 position-relative">
                  <input
                    type="text"
                    className="form-control"
                    value={countryCode}
                    onChange={handleCountryChange}
                    onKeyDown={handleCountryKeyDown}
                    onBlur={(e) => handleCountryFocusOut(e.target.value)}
                  />

                  {showCountryDropdown &&
                    filteredCountrySuggestions.length > 0 && (
                      <div className="dropdown-suggestions">
                        {filteredCountrySuggestions.map((item, index) => {
                          const [Code, Description] = item.split(":");

                          return (
                            <div
                              key={Code}
                              className="dropdown-item"
                              style={{
                                backgroundColor:
                                  index === highlightedCountryIndex
                                    ? "#234263"
                                    : "white",
                                color:
                                  index === highlightedCountryIndex
                                    ? "white"
                                    : "black",
                                cursor: "pointer",
                              }}
                              onMouseDown={() => handleCountrySelect(item)}
                              onMouseEnter={() =>
                                setHighlightedCountryIndex(index)
                              }
                            >
                              {Code} - {Description}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  {countryCode.trim() === "" && countryCodeError && (
                    <span className="ErrColor">FILL COO</span>
                  )}
                </div>

                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    value={countryDescription}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* DGINDICATOR */}
            <div className="row mt-4">
              <div className="row">
                <div className="col-3">DG INDICATOR</div>

                <div className="col-2">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="itemDgIndicator"
                      className="me-2"
                      checked={dgIndicator}
                      onChange={handleDgIndicatorCheckFunction}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>

                <div className="col-3">UNBRANDED</div>
                <div className="col-4">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="itemUnBrand"
                      className="me-2"
                      checked={unbranded}
                      onChange={handleCheckFunction}
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BRAND */}
            <div className="row mt-4">
              <div className="row">
                <div className="col-4">BRAND</div>
                <div className="col-8">
                  <input
                    type="text"
                    className="inputStyle HighLight"
                    id="itemBrandInput"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    tabIndex={5}
                  />
                  {brand.trim() === "" && brandError && (
                    <span className="ErrColor">FILL BRAND</span>
                  )}
                </div>
              </div>
            </div>

            {/* MODEL */}
            <div className="row mt-4">
              <div className="row">
                <div className="col-4">MODEL</div>
                <div className="col-8">
                  <input
                    type="text"
                    className="inputStyle"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-4">
            {/* VEHICLE TYPE */}

            {showVehicle && (
              <div>
                {/* VEHICLE TYPE */}
                <div className="row">
                  <div className="row">
                    <div className="col-5">VEHICLE TYPE</div>
                    <div className="col-7">
                      <select
                        className="Dropdown"
                        id="VehicalTypeUom"
                        tabIndex={7}
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                      >
                        <option value="">--Select--</option>
                        {vehicleType &&
                          !vehicleTypeOptions?.find(
                            (v) => v.Name === vehicleType,
                          ) && (
                            <option value={vehicleType}>{vehicleType}</option>
                          )}
                        {vehicleTypeOptions?.map((vecopt) => (
                          <option key={vecopt.Name} value={vecopt.Name}>
                            {vecopt.Name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ENGINE CAPACITY */}
                <div className="row mt-3">
                  <div className="row">
                    <div className="col-5">ENGINE CAPACITY</div>
                    <div className="col-2">
                      <input
                        type="text"
                        className="inputStyle"
                        placeholder="0.00"
                        tabIndex={8}
                        value={engineCapacityValue}
                        onChange={(e) => setEngineCapcityValue(e.target.value)}
                      />
                    </div>
                    <div className="col-5">
                      <select
                        className="Dropdown"
                        tabIndex={9}
                        value={engineCapacityUom}
                        onChange={(e) => setEngineCapacityUom(e.target.value)}
                      >
                        <option value="">--Select--</option>
                        {engineCapacityUom &&
                          !engineCapacity?.find(
                            (e) => e.Name === engineCapacityUom,
                          ) && (
                            <option value={engineCapacityUom}>
                              {engineCapacityUom}
                            </option>
                          )}
                        {engineCapacity?.map((encpt) => (
                          <option key={encpt.Name} value={encpt.Name}>
                            {encpt.Name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ORIGINAL REGISTRATION DATE */}
                <div className="row mt-3">
                  <div className="row">
                    <div
                      className="col-sm-5"
                      style={{ fontSize: "12px", wordBreak: "break-word" }}
                    >
                      ORIGINAL REGISTRATION DATE
                    </div>
                    <div className="col-sm-7">
                      <DateField
                        value={originalRegistrationDate}
                        setValue={setOriginalRegistrationDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DUTIABLE QUANTITY */}
            {showDutiableQuantity && (
              <div className="row mt-3">
                <div className="row">
                  <div className="col-5">DUTIABLE QUANTITY</div>
                  <div className="col-4">
                    <input
                      type="text"
                      className="inputStyle"
                      placeholder="0.00"
                      tabIndex={12}
                      value={duitableQuantity}
                      onChange={(e) => setDuitableQuantity(e.target.value)}
                      onBlur={dutiableQtyFunction}
                    />
                  </div>
                  <div className="col-3">
                    <select
                      className="Dropdown"
                      value={duitableQuantityUom}
                      onChange={(e) => setDuitableQuantityUom(e.target.value)}
                    >
                      <option>--Select--</option>
                      {duitableQuantityUom &&
                        duitableQuantityUom !== "--Select--" &&
                        !totalOuterPack.find(
                          (t) => t.Name === duitableQuantityUom,
                        ) && (
                          <option value={duitableQuantityUom}>
                            {duitableQuantityUom}
                          </option>
                        )}
                      {totalOuterPack.map((tooupack) => (
                        <option key={tooupack.Name} value={tooupack.Name}>
                          {tooupack.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TOTAL DUTIABLE QUANTITY */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-5">TOTAL DUTIABLE QUANTITY</div>
                <div className="col-4">
                  <input
                    type="text"
                    className="inputStyle"
                    placeholder="0.00"
                    tabIndex={12}
                    onBlur={totalDutiableQtyFunction}
                    value={totalDuitableQuantity}
                    onChange={(e) => setTotalDuitableQuantity(e.target.value)}
                  />
                </div>
                <div className="col-3">
                  <select
                    className="Dropdown"
                    value={totalDuitableQuantityUom}
                    onChange={(e) =>
                      setTotalDuitableQuantityUom(e.target.value)
                    }
                  >
                    <option>--Select--</option>
                    {/* {totalDuitableQuantityUom &&
                      totalDuitableQuantityUom !== "--Select--" &&
                      !totalOuterPack.find(
                        (t) => t.Name === totalDuitableQuantityUom,
                      ) && (
                        <option value={totalDuitableQuantityUom}>
                          {totalDuitableQuantityUom}
                        </option>
                      )} */}
                    {totalOuterPack.map((tooupack) => (
                      <option key={tooupack.Name} value={tooupack.Name}>
                        {tooupack.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* INVOICE QUANTITY */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-5">INVOICE QUANTITY</div>
                <div className="col-7">
                  <input
                    type="text"
                    className="inputStyle"
                    value={invoiceQuantity}
                    placeholder="0.00"
                    onBlur={itemInvoiceQuantityFunction}
                    onChange={(e) => setInvoiceQuantity(e.target.value)}
                    tabIndex={13}
                  />
                </div>
              </div>
            </div>

            {/* HS QUANTITY */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-5">HS QUANTITY</div>
                <div className="col-4">
                  <input
                    type="text"
                    className="inputStyle HighLight"
                    placeholder="0.00"
                    value={hsQuantity}
                    onChange={(e) => setHsQuantity(e.target.value)}
                    tabIndex={14}
                  />
                  {hsQuantity === "" && hsQuantityError && (
                    <span className="ErrColor">FILL HS QUANTITY</span>
                  )}
                </div>
                <div className="col-3">
                  {/* <select className="Dropdown HighLight" defaultValue=""> */}
                  <select
                    className="Dropdown HighLight"
                    value={hsUom}
                    // onChange={(e) => setHsUom(e.target.value)}
                    onChange={(e) => handleUomChange(e.target.value)}
                  >
                    <option>--Select--</option>
                    {hsUom &&
                      hsUom !== "--Select--" &&
                      !totalOuterPack.find((t) => t.Name === hsUom) && (
                        <option value={hsUom}>{hsUom}</option>
                      )}
                    {totalOuterPack.map((tooupack) => (
                      <option key={tooupack.Name} value={tooupack.Name}>
                        {tooupack.Name}
                      </option>
                    ))}
                  </select>
                  {hsUom.trim() === "--Select--" && hsUomError && (
                    <span className="ErrColor">PLEASE CHECK UOM</span>
                  )}
                  {hsUomError && <span className="ErrColor">{hsUomError}</span>}
                </div>
              </div>
            </div>
            {/* ALCOHOL PERCENTAGE (%) */}
            {showAlcohol && (
              <div className="row mt-3">
                <div className="row">
                  <div className="col-5">ALCOHOL PERCENTAGE (%)</div>
                  <div className="col-7">
                    <input
                      type="text"
                      className="inputStyle"
                      placeholder="0.00"
                      value={alcoholPercentage}
                      onChange={(e) => setAlcoholPercentage(e.target.value)}
                      onBlur={itemAlchoholCalculationFunction}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="row mt-3" style={{ display: "none" }}>
              <div className="row">
                <input className="me-2" value={dutyTypeId} />
              </div>
              <div className="row">
                <input className="me-2" value={kgmVisible} />
              </div>
            </div>

            {/* ADDITIONAL FEATURES */}
            <div className="row mt-3">
              <div className="col-12">
                <p className="border-bottom pb-1 full-width-title">
                  ADDITIONAL FEATURES
                </p>
              </div>
              <div className="row mt-2">
                <div className="col-3">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="packing_details"
                      className="me-2"
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                      tabIndex={16}
                      checked={packingChecked}
                      onChange={(e) => togglePacking(e.target.checked)}
                    />
                    <label
                      htmlFor="packing_details"
                      style={{ cursor: "pointer" }}
                    >
                      PACKING INFO
                    </label>
                  </div>
                </div>

                <div className="col-3">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="itemCascID"
                      className="me-2"
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                      tabIndex={17}
                      checked={itemCascChecked}
                      onChange={(e) => toggleItemCasc(e.target.checked)}
                    />
                    <label htmlFor="itemCascID" style={{ cursor: "pointer" }}>
                      ITEM CASC
                    </label>
                  </div>
                </div>

                <div className="col-3">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="shippingMarkCheck"
                      className="me-2"
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                      checked={showShippingMarks}
                      onChange={(e) => toggleShippingMarks(e.target.checked)}
                    />
                    <label
                      htmlFor="shippingMarkCheck"
                      style={{ cursor: "pointer" }}
                    >
                      SHIPPING MARK
                    </label>
                  </div>
                </div>

                <div className="col-2">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="lotIdCheck"
                      className="me-2"
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                      checked={showLotId}
                      onChange={(e) => toggleLotId(e.target.checked)}
                    />
                    <label htmlFor="lotIdCheck" style={{ cursor: "pointer" }}>
                      LOT ID
                    </label>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-3">PREFERENTIAL CODE</div>
                <div className="col-9">
                  <select
                    className="Dropdown"
                    value={preferentialCode}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPreferentialCode(value);
                      itemPreferntialCodeOut(value);
                    }}
                  >
                    <option value="">--Select--</option>
                    {preferentialCode &&
                      !preferential?.find(
                        (p) => p.Name === preferentialCode,
                      ) && (
                        <option value={preferentialCode}>
                          {preferentialCode}
                        </option>
                      )}
                    {preferential?.map((pref) => (
                      <option key={pref.Name} value={pref.Name}>
                        {pref.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* TAX TABLE */}
            <div className="row mt-3">
              <div className="col-12">
                <div className="table-responsive">
                  <table
                    className="table table-bordered"
                    style={{ width: "100%" }}
                  >
                    <thead className="table-light">
                      <tr className="fontTable">
                        <th>ITEM</th>
                        <th>RATE</th>
                        <th>UOM</th>
                        <th>AMOUNT$</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          GST (
                          <input
                            type="checkbox"
                            className="me-2"
                            style={{
                              width: "16px",
                              height: "12px",
                              cursor: "pointer",
                            }}
                            checked={recalculateClick}
                            onChange={Recalculate}
                          />
                          RECALCULATE )
                        </td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            defaultValue={9}
                            value={gstRateValue}
                            onChange={(e) => setGstRateValue(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            value={gstUom}
                            onChange={(e) => setGstUom(e.target.value)}
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            value={gstSum}
                            placeholder="0.00"
                            disabled={!recalculateClick}
                            onChange={(e) => setGstSum(e.target.value)}
                          />
                        </td>
                      </tr>

                      <tr>
                        <td>EXCISE DUTY</td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            placeholder="0.00"
                            value={exciseDutyRate}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            value={exciseDutyUom}
                            defaultValue=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            placeholder="0.00"
                            value={exciseDutyAmount}
                          />
                        </td>
                      </tr>

                      <tr>
                        <td>CUSTOMS DUTY</td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            placeholder="0.00"
                            value={customsDutyRate}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            placeholder="0.00"
                            value={customsDutyUom}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            placeholder="0.00"
                            value={customsDutyAmount}
                          />
                        </td>
                      </tr>

                      <tr>
                        <td>OTHER TAX</td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            placeholder="0.00"
                            value={otherTaxRate}
                            onChange={(e) => setOtherTaxRate(e.target.value)}
                          />
                        </td>
                        <td>
                          <select
                            className="Dropdown HighLight"
                            defaultValue=""
                            value={otherTaxUom}
                            onChange={(e) => {
                              setOtherTaxUom(e.target.value);
                            }}
                          >
                            <option value="">--Select--</option>
                            {otherTaxUom &&
                              !totalOuterPack?.find(
                                (i) => i.Name === otherTaxUom,
                              ) && (
                                <option value={otherTaxUom}>
                                  {otherTaxUom}
                                </option>
                              )}
                            {totalOuterPack?.map((i, index) => (
                              <option key={index} value={i.Name}>
                                {i.Name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="inputStyle"
                            placeholder="0.00"
                            value={otherTaxAmount}
                            onChange={(e) => setOtherTaxAmount(e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            {/* INVOICE NUMBER */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-5">INVOICE NUMBER</div>
                <div className="col-7">
                  <select
                    className="Dropdown"
                    id="ItemInvoiceNumber"
                    tabIndex={25}
                    value={selectedInvoice}
                    onChange={handleInvoiceChange}
                    defaultValue=""
                  >
                    <option value="">--Select--</option>
                    {selectedInvoice &&
                      !invoiceNumbers.find(
                        (inv) => inv.InvoiceNo === selectedInvoice,
                      ) && (
                        <option value={selectedInvoice}>
                          {selectedInvoice}
                        </option>
                      )}
                    {invoiceNumbers.map((inv) => (
                      <option key={inv.InvoiceNo} value={inv.InvoiceNo}>
                        {inv.InvoiceNo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* CURRENCY UNIT PRICE AUTO */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-5">
                  <label htmlFor="itemCheckUnitPrice">
                    CURR (UNIT PRICE{" "}
                    <input
                      type="checkbox"
                      className="me-2"
                      style={{
                        width: "16px",
                        height: "12px",
                        cursor: "pointer",
                      }}
                      checked={showUnitPriceVal}
                      onChange={(e) => toggleUnitPriceVal(e.target.checked)}
                    />
                    AUTO)
                  </label>
                </div>

                <div className="col-4">
                  <select
                    className="Dropdown HighLight"
                    id="itemInvoiceCurr"
                    value={invoiceCurrency}
                    disabled
                  >
                    <option value="">{invoiceCurrency || "--Select--"}</option>
                  </select>
                  {selectedInvoice === "" && invoiceCurrencyError && (
                    <span className="ErrColor">CHOOSE INVOICE</span>
                  )}
                </div>

                <div className="col-3">
                  <input
                    type="text"
                    value={invoiceExRate}
                    disabled
                    className="inputStyle"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* UNIT PRICE SECTION */}
            {showUnitPriceVal && (
              <div className="row mt-3">
                <div className="row">
                  <div className="col-5">UNIT PRICE VAL</div>
                  <div className="col-4">
                    <input
                      type="text"
                      className="inputStyle"
                      defaultValue="0.00"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-3">
                    <input
                      type="text"
                      className="inputStyle"
                      defaultValue="0.00"
                      value={sumExchangeRate}
                      onChange={(e) => setSumExchangeRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {showOptionalCharges && (
              <div>
                {/* OPTIONAL CHARGES */}
                <div className="row mt-3">
                  <div className="row">
                    <div className="col-5">OPTIONAL CHARGES</div>
                    <div className="col-4">
                      <select
                        className="Dropdown"
                        placeholder=""
                        // value={optionalCharges}
                        onChange={(e) => {
                          const selected = currency.find(
                            (cur) => cur.Currency === e.target.value,
                          );
                          setSelectedCurrency(selected);
                        }}
                      >
                        <option value="">--Select--</option>
                        {selectedCurrency &&
                          !currency.find(
                            (c) => c.Currency === selectedCurrency.CurrencyUOM,
                          ) && (
                            <option value={selectedCurrency.CurrencyUOM}>
                              {selectedCurrency.CurrencyUOM}
                            </option>
                          )}
                        {currency.map((cur) => (
                          <option key={cur.Currency} value={cur.Currency}>
                            {cur.Currency}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-3">
                      <input
                        type="text"
                        className="inputStyle"
                        value={optionlAmount}
                        onChange={optionalChargesFunction}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-5"></div>
                    <div className="col-4">
                      <input
                        type="text"
                        className="inputStyle"
                        value={selectedCurrency?.CurrencyRate || ""}
                        disabled
                      />
                    </div>
                    <div className="col-3">
                      <input
                        type="text"
                        className="inputStyle"
                        placeholder="0.00"
                        value={optionalCharges}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOTAL LINE AMOUNT */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-5">TOTAL LINE AMOUNT</div>
                <div className="col-7">
                  <input
                    type="text"
                    placeholder="0.00"
                    className="inputStyle HighLight"
                    value={totalLineAmount}
                    onChange={(e) => setTotalLineAmount(e.target.value)}
                    // onBlur={invoiceTotalLineAmountFunction}
                    onBlur={(e) =>
                      invoiceTotalLineAmountFunction(e.target.value)
                    }
                    tabIndex={26}
                  />
                  {totalLineAmount === 0 && totalLineAmountError && (
                    <span className="ErrColor">FILL TOTAL LINE AMOUNT</span>
                  )}
                </div>
              </div>
            </div>

            {/* TOTAL INVOICE CHARGE */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-5">TOTAL INVOICE CHARGE (SGD)</div>
                <div className="col-7">
                  <input
                    type="text"
                    placeholder="0.00"
                    className="inputStyle"
                    value={totalInvoiceCharge}
                  />
                </div>
              </div>
            </div>

            {/* CIF / FOB */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-5">CIF/FOB (SGD)</div>
                <div className="col-7">
                  <input
                    type="text"
                    placeholder="0.00"
                    className="inputStyle"
                    value={cifFob}
                  />
                </div>
              </div>
            </div>

            {/* LAST SELLING PRICE */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-5">LAST SELLING PRICE (SGD)</div>
                <div className="col-7">
                  <input
                    type="text"
                    className="inputStyle"
                    value={lastSellingPrice}
                    placeholder="0.00"
                    onChange={(e) => setLastSellingPrice(e.target.value)}
                    onBlur={() => {
                      if (lastSellingPrice === "") setLastSellingPrice("0.00");
                      lastSellingPriceFunction();
                    }}
                  />
                </div>
              </div>
            </div>

            {/* PACKING DETAILS */}
            {showPacking && (
              <div className="row mt-3 PackingDetails">
                <div className="col-12 border-bottom pb-2 mb-2 full-width-title">
                  PACKING DETAILS
                </div>

                {/* OUTER PACK */}
                <div className="row mt-2 align-items-center">
                  <div className="col-5">OUTER PACK QUANTITY</div>
                  <div className="col-3">
                    <input
                      type="text"
                      className="inputStyle"
                      value={outerPackQuantity}
                      placeholder="0.00"
                      ref={outerPackQtyRef}
                      onBlur={(e) =>
                        dutiableQtyFunction(
                          e.target.value,
                          inPackQuantity,
                          innerPackQuantity,
                          immostPackQuantity,
                          duitableQuantity,
                          cifFob,
                        )
                      }
                      onChange={(e) => setOuterPackQuantity(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <select
                      className="Dropdown"
                      value={outerPackQuantityUom}
                      onChange={(e) => setOuterPackQuantityUom(e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {outerPackQuantityUom &&
                        !totalOuterPack?.find(
                          (t) => t.Name === outerPackQuantityUom,
                        ) && (
                          <option value={outerPackQuantityUom}>
                            {outerPackQuantityUom}
                          </option>
                        )}
                      {totalOuterPack?.map((i, idx) => (
                        <option key={idx} value={i.Name}>
                          {i.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* IN PACK */}
                <div className="row mt-2 align-items-center">
                  <div className="col-5">IN PACK QUANTITY</div>
                  <div className="col-3">
                    <input
                      type="text"
                      className="inputStyle"
                      value={inPackQuantity}
                      placeholder="0.00"
                      onBlur={(e) =>
                        dutiableQtyFunction(
                          outerPackQuantity,
                          e.target.value,
                          innerPackQuantity,
                          immostPackQuantity,
                          duitableQuantity,
                          cifFob,
                        )
                      }
                      onChange={(e) => setInPackQuantity(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <select
                      className="Dropdown"
                      value={inPackQuantityUom}
                      onChange={(e) => setInPackQuantityUom(e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {totalOuterPack?.map((i, idx) => (
                        <option key={idx} value={i.Name}>
                          {i.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* INNER PACK */}
                <div className="row mt-2 align-items-center">
                  <div className="col-5">INNER PACK QUANTITY</div>
                  <div className="col-3">
                    <input
                      type="text"
                      className="inputStyle"
                      value={innerPackQuantity}
                      placeholder="0.00"
                      onBlur={(e) =>
                        dutiableQtyFunction(
                          outerPackQuantity,
                          e.target.value,
                          innerPackQuantity,
                          immostPackQuantity,
                          duitableQuantity,
                          cifFob,
                        )
                      }
                      onChange={(e) => setInnerPackQuantity(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <select
                      className="Dropdown"
                      value={innerPackQuantityUom}
                      onChange={(e) => setInnerPackQuantityUom(e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {totalOuterPack?.map((i, idx) => (
                        <option key={idx} value={i.Name}>
                          {i.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* INMOST PACK */}
                <div className="row mt-2 align-items-center">
                  <div className="col-5">INMOST PACK QUANTITY</div>
                  <div className="col-3">
                    <input
                      type="text"
                      className="inputStyle"
                      value={immostPackQuantity}
                      placeholder="0.00"
                      onBlur={(e) =>
                        dutiableQtyFunction(
                          outerPackQuantity,
                          e.target.value,
                          innerPackQuantity,
                          immostPackQuantity,
                          duitableQuantity,
                          cifFob,
                        )
                      }
                      onChange={(e) => setImmostPackQuantity(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <select
                      className="Dropdown"
                      value={immostPackQuantityUom}
                      onChange={(e) => setImmostPackQuantityUom(e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {totalOuterPack?.map((i, idx) => (
                        <option key={idx} value={i.Name}>
                          {i.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-sm-8 border-bottom pb-1 full-width-title">
                UPLOAD ITEM EXCEL TEMPLATE
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <button
                  className="NextpageBtns"
                  onClick={() => downloadExcel("inpayment")}
                >
                  DOWNLOAD TEMPLATE
                </button>
              </div>
              <div className="col-sm-2">
                <input
                  type="file"
                  className="NextpageBtns"
                  style={{ width: "100%" }}
                  ref={fileInputRef}
                  accept=".xlsx"
                />
              </div>
              <div className="col-sm-4">
                <button
                  className="NextpageBtns"
                  onClick={ItemUploadData}
                  disabled={isUploadItem}
                >
                  {isUploadItem ? "Uploading Items..." : "UPLOAD ITEM"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ITEM CASC */}
      {showItemCasc && (
        <div className="col-12">
          <div className="col-sm-8 border-bottom pb-1 full-width-title">
            ITEM CASC
          </div>

          {itemCasc.map((item, index) => (
            <div className="row mt-3" key={index}>
              <div className="col-10 offset-2">
                <div className="row align-items-center mb-2">
                  <div className="col-1">PRODUCT CODE {index + 1}</div>
                  <div className="col-2 mb-2 d-flex align-items-center">
                    <FaSearch
                      style={{ cursor: "pointer", marginRight: "6px" }}
                      onClick={() =>
                        // handleIconClick(`productCode${index + 1}`, index)
                        handleIconClick("productCode", index)
                      }
                    />
                    <input
                      type="text"
                      className="inputStyle"
                      style={{ width: "80%" }}
                      value={item.code}
                      ref={index === 0 ? productCodeInputRef : null}
                      onChange={(e) =>
                        handleItemCascChange(index, "code", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-3">
                    <button
                      className="NextpageBtns"
                      onClick={() => copyHsQty(index)}
                    >
                      COPY HS-QUANTITY
                    </button>
                  </div>

                  <div className="col-1">
                    <input
                      type="text"
                      className="inputStyle"
                      value={item.hsQuantity}
                      onChange={(e) =>
                        handleItemCascChange(
                          index,
                          "hsQuantity",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="col-2">
                    <select
                      className="Dropdown"
                      value={item.uom}
                      onChange={(e) =>
                        handleItemCascChange(index, "uom", e.target.value)
                      }
                    >
                      <option value="">--Select--</option>
                      {item.uom &&
                        !totalOuterPack.find((t) => t.Name === item.uom) && (
                          <option value={item.uom}>{item.uom}</option>
                        )}
                      {totalOuterPack.map((pack, i) => (
                        <option key={i} value={pack.Name}>
                          {pack.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-1">
                    <button
                      type="button"
                      className="NextpageBtns"
                      onClick={() => addCascRow(index)}
                    >
                      ADDCASC
                    </button>
                  </div>
                </div>
                {item.description && (
                  <small
                    style={{
                      color: "#f10e0e",
                      fontSize: "11px",
                      marginTop: "3px",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.description}
                  </small>
                )}
                {/* Casc Table */}
                <div className="row">
                  <div className="col-9">
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm align-middle">
                        <thead>
                          <tr>
                            <th className="text-center">CASC CODE 1</th>
                            <th className="text-center">CASC CODE 2</th>
                            <th className="text-center">CASC CODE 3</th>
                            <th
                              className="text-center"
                              style={{ width: "60px" }}
                            ></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(item.casc.length ? item.casc : [["", "", ""]]).map(
                            (row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                  <td key={colIndex}>
                                    <input
                                      className="inputStyle"
                                      value={cell}
                                      onChange={(e) =>
                                        handleCascTableChange(
                                          index,
                                          rowIndex,
                                          colIndex,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </td>
                                ))}
                                <td className="text-center">
                                  <FaTrash
                                    style={{ cursor: "pointer", color: "red" }}
                                    onClick={() =>
                                      deleteCascRow(index, rowIndex)
                                    }
                                  />
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOT ID */}
      {showLotId && (
        <div className="col-12 mt-4">
          <div className="col-sm-8 border-bottom pb-1 full-width-title">
            LOT ID
          </div>
          <div className="row mt-2">
            <div className="col-4">CURRENT LOT</div>
            <div className="col-4">MAKING</div>
            <div className="col-4">PREVIOUS LOT</div>
          </div>
          <div className="row mt-3">
            <div className="col-4">
              <input
                className="inputStyle"
                value={currentLot}
                ref={currentLotRef}
                onChange={(e) => setCurrentLot(e.target.value)}
              />
            </div>
            <div className="col-4">
              <select
                className="Dropdown HighLight mandatory"
                id="makingLot"
                value={making}
                onChange={(e) => setMaking(e.target.value)}
              >
                <option value="">--Select--</option>
                {making && !makingLot.find((m) => m.Name === making) && (
                  <option value={making}>{making}</option>
                )}
                {makingLot.map((lot) => (
                  <option key={lot.Name} value={lot.Name}>
                    {lot.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-4">
              <input
                className="inputStyle"
                value={previousLot}
                onChange={(e) => setPreviousLot(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* SHIPPING MARKS */}
      {showShippingMarks && (
        <div className="col-12 mt-4">
          <div className="col-sm-8 border-bottom pb-1 full-width-title">
            SHIPPING MARKS INFORMATION
          </div>

          <div className="row mt-2">
            <div className="col-3">SHIPPING MARKS 1</div>
            <div className="col-3">SHIPPING MARKS 2</div>
            <div className="col-3">SHIPPING MARKS 3</div>
            <div className="col-3">SHIPPING MARKS 4</div>
          </div>

          <div className="row mt-3">
            <div className="col-3">
              <textarea
                className="inputStyle"
                value={shippingMarks1}
                ref={shippingMarks1Ref}
                onChange={(e) => setShippingMarks1(e.target.value)}
              />
            </div>
            <div className="col-3">
              <textarea
                className="inputStyle"
                value={shippingMarks2}
                onChange={(e) => setShippingMarks2(e.target.value)}
              />
            </div>
            <div className="col-3">
              <textarea
                className="inputStyle"
                value={shippingMarks3}
                onChange={(e) => setShippingMarks3(e.target.value)}
              />
            </div>
            <div className="col-3">
              <textarea
                className="inputStyle"
                value={shippingMarks4}
                onChange={(e) => setShippingMarks4(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-3 d-flex justify-content-center gap-3">
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
          onClick={() => setActiveTab("InvoiceTab")}
        >
          PREVIOUS
        </button>
        {showItemReset && (
          <button className="NextpageBtns" onClick={resetItemForm}>
            RESET
          </button>
        )}
        <button
          className="NextpageBtns view-nav-btn"
          onClick={() => setActiveTab("CpcTab")}
        >
          NEXT
        </button>
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

      {/* item section --buttons */}
      <div className="row mt-4">
        <div className="col-2">
          <button
            className="MoveOnButtons showDisable"
            type="button"
            onClick={deleteSelectedItems}
            disabled={selectedItems.length === 0 || isDeletingItem}
          >
            {isDeletingItem ? "DELETING..." : "DELETE ITEM"}
          </button>
        </div>

        <div className="col-2">
          <button
            className="MoveOnButtons showDisable"
            type="button"
            onClick={ItemEditAll}
            disabled={isItemEditall}
          >
            {isItemEditall ? "EDITING ALL ITEMS..." : "EDIT ALL ITEM"}
          </button>
        </div>

        <div className="col-2">
          <input
            type="text"
            className="inputStyle"
            placeholder="SEARCH BY ITEM NO..."
          />
        </div>
        <div className="col-2">
          <input
            type="text"
            className="inputStyle"
            placeholder="ENTER ALL BRAND NAME..."
            value={allBrandInput}
            onChange={(e) => setAllBrandInput(e.target.value)}
          />
        </div>
        <div className="col-2">
          <button
            className="MoveOnButtons showDisable"
            type="button"
            onClick={handleAllItemBrand}
            disabled={isItemEditall}
          >
            ALL ITEM BRAND
          </button>
        </div>
        <div className="col-2">
          <button
            className="MoveOnButtons showDisable"
            type="button"
            onClick={handleDeleteBrand}
          >
            DELETE ALL BRAND
          </button>
        </div>
      </div>

      {/* item section --table */}
      <div className="col-12 mt-5">
        <div className="table-responsive">
          <table id="ItemTable">
            <thead>
              <tr className="fontTable">
                {!isViewMode && (
                  <th>
                    <input
                      type="checkbox"
                      id="ItemHeadCheck"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th>EDIT</th>
                <th>S.NO</th>
                <th>HS CODE</th>
                <th>GOODS DESCRIPTION</th>
                <th>COO</th>
                <th>HAWB/HBL</th>
                <th>CURRENCY</th>
                <th>CIF/FOB (S$)</th>
                <th>HS QUANTITY</th>
                <th>HS UOM</th>
                <th>GST (S$)</th>
                <th>ITEM LINE AMOUNT</th>
              </tr>
            </thead>

            <tbody>
              {sortedItemTable.length === 0 ? (
                <tr>
                  <td colSpan={14} style={{ textAlign: "center" }}>
                    No Record
                  </td>
                </tr>
              ) : (
                sortedItemTable.map((item, index) => {
                  const hsRow = hsCodeSuggestions.find(
                    (h) =>
                      h.HSCode?.toLowerCase() === item.HSCode?.toLowerCase(),
                  );
                  const isControlled = hsRow?.Inpayment === "1";

                  return (
                    <tr
                      key={item.SNo}
                      style={{ color: isControlled ? "red" : "inherit" }}
                    >
                      {!isViewMode && (
                        <td>
                          <input
                            type="checkbox"
                            name="itemCheckDel"
                            value={item.ItemNo}
                            checked={selectedItems.includes(item.ItemNo)}
                            onChange={
                              !isViewMode
                                ? () => handleSelectOne(item.ItemNo)
                                : undefined
                            }
                            readOnly={isViewMode}
                          />
                        </td>
                      )}
                      <td>
                        <FaEdit
                          className="view-show"
                          style={{ width: "15px", cursor: "pointer" }}
                          onClick={() => editItem(item.ItemNo)}
                        />
                      </td>
                      <td>{item.ItemNo}</td>
                      <td>{item.HSCode}</td>
                      <td>{item.Description}</td>
                      <td>{item.Contry}</td>
                      <td>{item.InHAWBOBL}</td>
                      <td>{item.UnitPriceCurrency}</td>
                      <td>{item.CIFFOB}</td>
                      <td>{item.HSQty}</td>
                      <td>{item.HSUOM}</td>
                      <td>{item.GSTAmount}</td>
                      <td>{item.TotalLineAmount}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Del HBL/HAWB */}
      <div className="row mt-4">
        <div className="col-2">
          <button
            className="MoveOnButtons showDisable"
            type="button"
            onClick={deleteHblHawb}
          >
            DEL HBL / HAWB
          </button>
        </div>
      </div>
      {/* Alert Notification */}
      <ToastNotification toast={toast} onClose={hideToast} />
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
      {isItemEditall && (
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
          <CircleLoader size={60} color="#07b4f8" loading={isItemEditall} />
          <div
            style={{
              marginTop: "16px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1a6db5",
            }}
          >
            EDIT ITEMS...
          </div>
        </div>
      )}
      {isUploadItem && (
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
          <CircleLoader size={60} color="#07b4f8" loading={isUploadItem} />
          <div
            style={{
              marginTop: "16px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1a6db5",
            }}
          >
            UPLOAD ITEMS...
          </div>
        </div>
      )}
      {isAddItem && (
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
          <CircleLoader size={60} color="#23f807" loading={isAddItem} />
          <div
            style={{
              marginTop: "16px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1ab522",
            }}
          >
            ADDING ITEM...
          </div>
        </div>
      )}
      {isDeletingItem && (
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
          <CircleLoader size={60} color="#fc0f07" loading={isDeletingItem} />
          <div
            style={{
              marginTop: "16px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#fc0f07",
            }}
          >
            DELETING ITEMS...
          </div>
        </div>
      )}
    </div>
  );
}
export default Item;
