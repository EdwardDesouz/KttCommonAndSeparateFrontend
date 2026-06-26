import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { React, useEffect, useState, useContext, useRef, useMemo } from "react";
import { DateField } from "../cargo/cargo";
import API from "../../../api/api";
import { currentPopup, fetchPopupData, SearchPopup } from "./itemFunctions";
import { UserContext } from "../../../userContex/userContex";
import { useCoo } from "../context/cooContext";
import { useNavigate } from "react-router-dom";
import { useDebounceAutoSave } from "../../../autoSave/useDebounceAutoSave";
import ToastNotification, {useToast} from "../../../components/ToastNotification/toastNotification";


function Item({ setActiveTab, isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const {
    permitDetails,
    updatePermitDetails,
    cargoHawbList,
    setCargoHawbList,
    setOutCargoHawbList,
    outCargoHawb,
    setOutCargoHawb,
    outCargoHawbList,
    decType,
    setDecType,
    invoiceTable,
    setInvoiceTable,
    totalGrossWeight,
    setTotalGrossWeight,
    totalLineAmd,
    hawbList,
    setHawbList,
    showOutItemHawbHbl,
    setShowOutItemHawbHbl,
    itemTable,
    setItemTable,
    itemSerialNumber,
    setItemSerialNumber,
    hawb,
    setHawb,
    outHawb,
    setOutHawb,
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
    showCertificateOfOrigin,
    setShowCertificateOfOrgin,
    showItemTexttile,
    setShowItemTexttile,

    showCifFobItemValue,
    setShowCifFobItemValue,
    showCifFobValue,
    setShowCifFobValue,

    showOriginCriterion,
    setShowOriginCriterion,
    cerDescription,
    setCerDescription,
    cerItemQty,
    setCerItemQty,
    cerItemUOM,
    setCerItemUOM,
    cifCerValue,
    setCifCerValue,
    manuDate,
    setManuDate,
    textileCategory,
    setTextileCategory,
    textileQuotaQty,
    setTextileQuotaQty,
    textileQuotaUOM,
    setTextileQuotaUOM,
    cerInvoiceNumber,
    setCerInvoiceNumber,
    invDate,
    setInvDate,
    originCriterionCode1,
    setOriginCriterionCode1,
    originCriterionCode2,
    setOriginCriterionCode2,
    originCriterionCode3,
    setOriginCriterionCode3,
    originCeritficateDetails,
    hsCodeCer,
    setHsCodeCer,
    percentageOrigin,
    setPercentageOrigin,

    showUnitPriceVal,
    setShowUnitPriceVal,
    itemCasc,
    setItemCasc,
    defaultItemCasc,
    shippingMarks,
    setShippingMarks,
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
  } = useCoo();

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
      // setSerialNumber((itemTable.length + 1).toString().padStart(3));
      setSerialNumber(itemTable.length + 1);
    }
  }, [itemTable, editingSNo]);

  const [showItemReset, setShowItemReset] = useState(false);
  const [serialNumber, setSerialNumber] = useState(1);
  // const [recalculateClick, setRecalculateClick] = useState(false);
  const [unitPriceCurrency, setUnitPriceCurrency] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [unitPriceAuto, setUnitPriceAuto] = useState(false);
  const [itemInvoiceCurr, setItemInvoiceCurr] = useState("");
  const [iteminvoiceCurrInput, setIteminvoiceCurrInput] = useState(0.0);
  const [totalLineAmountError, setTotalLineAmountError] = useState(false);
  const fileInputRef = useRef(null);
  // ------------------ Static Data ------------------
  const [invoiceNumbers, setInvoiceNumbers] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [totaloptionalAmount, setTotalOptionalAmount] = useState(0);
  const [totalOuterPack, setTotalOuterPack] = useState([]);
  const [brandError, setBrandError] = useState(false);
  const [preferential, setPreferential] = useState([]);
  // ------------------ Hs Code ------------------
  const [controlledItem, setControlledItem] = useState("");
  const [hsCodeDescriptionError, setHsCodeDescriptioError] = useState(false);
  const [hsCodeSuggestions, setHsCodeSuggestions] = useState([]);
  const [filteredHsCodeSuggestions, setFilteredHsCodeSuggestions] = useState(
    [],
  );
  const [showHscodeDropdown, setShowHsCodeDropdown] = useState(false);
  const [highlightedHsCodeIndex, setHighlightedHsCodeIndex] = useState(0);
  const [hsCodeError, setHsCodeError] = useState(false);
  const [hsUomError, setHsUomError] = useState("");
  const [hsQuantityError, setHsQuantityError] = useState(false);
  const [cascProductCodes, setCascProductCodes] = useState([]);
  // ------------------ Package Details ------------------

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
  // ------------------ Item CASC ------------------
  const [activeRowIndex, setActiveRowIndex] = useState(null);

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
    }
  };

  const toggleItemCasc = (checked) => {
    setItemCascChecked(checked);
    setShowItemCasc(checked);
    if (!checked) {
      setItemCasc(defaultItemCasc);
    }
  };

  const toggleShippingMarks = (checked) => {
    setShowShippingMarks(checked);
    if (!checked) {
      setShippingMarks(["", "", "", ""]);
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
    try {
      await API.delete(`/deleteCascByCascId/${cascId}/${rowNo}/${permitId}/`);
    } catch (error) {
      console.warn("Delete API error (ignored):", error);
    }
    const updated = [...itemCasc];
    updated[itemIndex].casc.splice(rowIndex, 1);

    setItemCasc(updated);
  };

  // ------------------ Fetch HsCode ------------------
  useEffect(() => {
    const fetchHsCodeSuggestions = async () => {
      try {
        const response = await API.get("/getCommonHsCodeTableInfo/");
        // console.log("HsCoderesponse:", response);
        setHsCodeSuggestions(response.data);
        setFilteredHsCodeSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching Hs Code suggestions", error);
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
      (i) => i.HSCode.toLowerCase() === val.toLowerCase()
    );

    const finalList = exactMatch.length > 0 ? exactMatch : filtered.slice(0, 100);

    setFilteredHsCodeSuggestions(finalList);
    setShowHsCodeDropdown(finalList.length > 0);
  };
  
  // ======================== Hscode Keydown========================
  // const handleHsCodeKeyDown = (e) => {
  //   if (!showHscodeDropdown || filteredHsCodeSuggestions.length === 0) return;

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
    // if (Number(item.Co) === 1) {
    //   setItemCascChecked(true);
    //   setShowItemCasc(true);
    // } else {
    //   setItemCascChecked(false);
    //   setShowItemCasc(false);
    // }

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

      setExciseDutyUom("--Select--");
      setCustomsDutyUom("--Select--");
      setExciseDutyRate(0);
      setCustomsDutyRate(0);
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

      setExciseDutyUom("--Select--");
      setCustomsDutyUom("--Select--");
      setExciseDutyRate(0);
      setCustomsDutyRate(0);
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

      setExciseDutyUom("--Select--");
      setCustomsDutyUom("--Select--");
      setExciseDutyRate(0);
      setCustomsDutyRate(0);
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

      setExciseDutyUom("--Select--");
      setCustomsDutyUom("--Select--");
      setExciseDutyRate(0);
      setCustomsDutyRate(0);
    }

    // VEHICLE (HSCode starts with 87)
    if (HSCode && HSCode.startsWith("87")) {
      setShowVehicle(true);
      setShowDutiableQuantity(true);
      setShowOptionalCharges(true);

      setExciseDutyUom("--Select--");
      setCustomsDutyUom("--Select--");
      setExciseDutyRate(0);
      setCustomsDutyRate(0);

      setDuitableQuantityUom(UOM);
      setTotalDuitableQuantityUom(DuitableUom);
    }
  };
  // ── HS CODE FOCUS OUT ────────────────────────────────────
  const handleHsCodeFocusOut = () => {
    setTimeout(() => {
      if (!hsCode) {
        setHsCodeRow(null);
        setHsCode("");
        setHsCodeDescription("");
        setShowVehicle(false);
        setShowPacking(false);
        setShowAlcholPercentage(false);
        setShowDutiableQuantity(false);
        setShowHsCodeDropdown(false);
        setDuitableQuantityUom("--Select--");
        setTotalDuitableQuantityUom("--Select--");
        setHsUom("--Select--");
        setExciseDutyRate(0);
        setExciseDutyUom("--Select--");
        return;
      }

      const selected = hsCodeSuggestions.find(
        (i) => i.HSCode.toLowerCase() === hsCode.toLowerCase(),
      );

      if (!selected) return;

      setHsCodeRow(selected);
      setHsCode(selected.HSCode);
      setHsCodeDescription(selected.Description);
      setHsCodeError(false);

      applyHsLogic(selected);
    }, 150);

          setTimeout(() => {
        const descEl = document.querySelector("textarea.inputStyle");
        if (descEl) {
          descEl.focus();
          descEl.select();
        }
      }, 50);
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

  const handleInvoiceQuantityFocusOut = () => {
    let qty = parseFloat(invoiceQuantity);

    if (!invoiceQuantity || isNaN(qty)) {
      setInvoiceQuantity("0.00");
      setHsQuantity("0.00");
      return;
    }

    const UOM = hsUom;

    let hsQty = qty;

    if (UOM === "TEN" || UOM === "TPR") {
      hsQty = qty / 10;
    } else if (UOM === "CEN") {
      hsQty = qty / 100;
    } else if (UOM === "MIL" || UOM === "TNE") {
      hsQty = qty / 1000;
    } else if (UOM === "MTK") {
      hsQty = qty * 3.213;
    } else if (UOM === "LTR") {
      hsQty = qty * 1;
    } else if (UOM === "KGM" || UOM === "NMB" || UOM === "-") {
      hsQty = qty;
    }

    setInvoiceQuantity(qty.toFixed(2));
    setHsQuantity(hsQty === 0 ? "0.00" : hsQty.toFixed(2));
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
  // const fetchVehicleType = async () => {
  //   try {
  //     const response = await API.get("/getVehicalTypeFromCommonMaster/");
  //     setVehicleTypeOptions(response.data);
  //   } catch (error) {
  //     console.error("Error fetching outer pack data", error);
  //   }
  // };
  // // -----------fetch Engine type-----------
  // const fetchEngineType = async () => {
  //   try {
  //     const response = await API.get("/getEngineCapacityFromCommonMaster/");
  //     setEngineCapcityOptions(response.data);
  //   } catch (error) {
  //     console.error("Error fetching outer pack data", error);
  //   }
  // };
  // // -----------fetch Preferntial-----------
  // const fetchPreferntial = async () => {
  //   try {
  //     const response = await API.get("/getPreferntialFromCommonMaster/");
  //     setPreferential(response.data);
  //   } catch (error) {
  //     console.error("Error fetching outer pack data", error);
  //   }
  // };

  useEffect(() => {
    fetchTotalOuterPackData();
    fetchCurrency();
    // fetchVehicleType();
    // fetchEngineType();
    // fetchPreferntial();

    // fetchInvoices();
  }, []);

  // -------------------Invoices States-------------
  // const [selectedInvoice, setSelectedInvoice] = useState("");
  const [invoiceCurrency, setInvoiceCurrency] = useState("");
  const [invoiceCurrencyError, setInvoiceCurrencyError] = useState(false);
  const [invoiceExRate, setInvoiceExRate] = useState("");
  // -------------------Invoices changes-------------
  const handleCurrencyChange = (currencyName, row) => {
    const selected = currency.find((item) => item.Currency === currencyName);
    const rate = selected ? parseFloat(selected.CurrencyRate) : 0;
    if (row === "invoice") {
      setInvoiceCurrency(currencyName);
      setInvoiceExRate(rate);
    }
  };

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
        Brand: "",
        Model: "",
        DGIndicator: "",
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
      setHawb(cargoHawbList[0] || "");
    }
  }, [cargoHawbList]);

  // -------------------Out HAWB List ------------------
  useEffect(() => {
    if (outCargoHawbList?.length > 0) {
      setOutHawb(outCargoHawbList[0] || "");
    }
  }, [outCargoHawbList]);

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

  const invoiceTotalLineAmountFunction = () => {
    const cif = parseFloat(invoiceExRate) * parseFloat(totalLineAmount);
    console.log("Cif:", cif);
    setCifFob(cif.toFixed(2));
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
    }
  };
  // ------------------Optional Charges Calculation -------------
  const optionalChargesFunction = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setOptionalAmount(value);
    const rate = selectedCurrency?.CurrencyRate || 0;
    const charges = value * rate;
    setOptionalCharges(charges.toFixed(2));
  };

  // ------------------Alchohol Calculation Function-------------

  const itemAlchoholCalculationFunction = () => {
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
    // if (T6 >= 10000) {
    //   setGstWarning("Total GST Amount greater than 10000");
    // } else {
    //   setGstWarning("");
    // }
  };

  // ------------------Dutiable Quantity Function-------------
  const dutiableQtyFunction = () => {
    let opQty = parseFloat(outerPackQuantity) || 0;
    let inQty = parseFloat(inPackQuantity) || 0;
    let innerQty = parseFloat(innerPackQuantity) || 0;
    let inmostQty = parseFloat(immostPackQuantity) || 0;
    let dutiAb = parseFloat(duitableQuantity) || 0;
    duticalc(opQty, inQty, innerQty, inmostQty, dutiAb);
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
  // const itemPreferntialCodeOut = (value) => {
  //   console.log("PreferentialCode:", value);

  //   if (value == "PRF : if goods are imported under preferential duty rates") {
  //     setCustomsDutyRate(0);
  //     setCustomsDutyUom("--Select--");
  //     setCustomsDutyAmount(0);
  //   } else if (
  //     value == "PRI : if goods exported qualify for overseas preferential rates"
  //   ) {
  //     setCustomsDutyRate(0);
  //     setCustomsDutyUom();
  //     setCustomsDutyAmount(0.0);
  //   }
  //   dutiableQtyFunction();
  // };
  // ----------------------- Last Selling Price Function ---------------------------
  // const lastSellingPriceFunction = () => {
  //   const exciseAmt = parseFloat(exciseDutyAmount) || 0;
  //   const gstRate = parseFloat(gstRateValue) || 0;
  //   const lastPrice = parseFloat(lastSellingPrice);
  //   if (lastPrice > 0) {
  //     const gstOnExcise = (exciseAmt * gstRate) / 100;
  //     const totalGst = (lastPrice * gstRate) / 100 + gstOnExcise;
  //     setGstSum(totalGst.toFixed(2));
  //   }
  // };
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

    if (hsQuantity === "" || hsQuantity === 0) {
      setHsQuantityError(true);
      check = false;
    } else setHsQuantityError(false);

    if (hsUom === "--Select--") {
      setHsUomError(true);
      check = false;
    } else setHsUomError(false);

    if (totalLineAmount === "" || totalLineAmount === 0) {
      setTotalLineAmountError(true);
      check = false;
    } else setTotalLineAmountError(false);
    // if (itemCascChecked) {
    //   const firstCasc = itemCasc[0];
    //   if (!firstCasc.code.trim()) {
    //     check = false;
    //     alert("Please Check The Item Casc");
    //   }
    // }

    return check;
  };

  const formatItemDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "") return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD/MM/YYYY → YYYY-MM-DD
    return null;
  };
  // ----------------------- Add Item Function ---------------------------

  const ItemSave = async () => {
    if (!validateItemFields()) return;
    // const itemNumber = serialNumber;
    const itemNumber = Number(serialNumber);
    const payload = {
      CascDatas: JSON.stringify(ItemCascSave(itemNumber)),
      PermitId: permitDetails?.PermitId,
      ItemNo: itemNumber || null,
      MessageType: "COODEC",
      HSCode: hsCode || "",
      Description: hsCodeDescription || "",
      DGIndicator: dgIndicator ? "Yes" : "No",
      Contry: countryCode || "",
      EndUserDescription: "",
      Brand: brand || "",
      Model: model || "",
      InHAWBOBL: hawb || "",
      OutHAWBOBL: outHawb || outCargoHawbList[0] || "",
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
      CIFFOB: cifFob || 0,
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
      ShippingMarks1: shippingMarks || "",
      ShippingMarks2: "",
      ShippingMarks3: "",
      ShippingMarks4: "",
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

      CerItemQty: cerItemQty || 0,
      CerItemUOM: cerItemUOM || "",
      CIFValOfCer: cifCerValue || 0,
      // ManufactureCostDate: manuDate || "",
      ManufactureCostDate: formatItemDate(manuDate),
      TexCat: textileCategory || "",
      TexQuotaQty: textileQuotaQty || 0,
      TexQuotaUOM: textileQuotaUOM || "",
      CerInvNo: cerInvoiceNumber || "",
      // CerInvDate: invDate || "",
      CerInvDate: formatItemDate(invDate),
      OriginOfCer: originCeritficateDetails || "",
      HSCodeCer: hsCodeCer || "",
      PerContent: percentageOrigin || "",
      CertificateDescription: cerDescription || "",
    };
    console.log("payload:", payload);
    try {
      const res = await API.post("/postItemTable/", payload);
      setItemTable(res.data.Records);
      showToast("Item Saved Successfully");
      const cascData = ItemCascSave(itemNumber);
      console.log("cascData:", cascData);
      if (cascData.length > 0) {
        await API.post("/postCascTable/", cascData);
        console.log("CASC Data Saved Successfully");
      }
      setEditingSNo(null);
      // setSerialNumber((res.data.Records.length + 1).toString().padStart(3));
      setSerialNumber(res.data.Records.length + 1);
      resetItemForm();
    } catch (error) {
      console.error("Save failed", error);
      console.error("Error response:", error.response?.data);
    }
  };

  const ItemCascSave = (itemNumber) => {
    const username = user.username;
    const permitId = permitDetails?.PermitId;
    const messageType = "COODEC";

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
            EndUserDes: item.enduserDescription || "",
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
          EndUserDes: item.enduserDescription || "",
          CASCId: `Casc${itemIndex + 1}`,
        }));
      console.log("CASC Data:", cascArray);
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

  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;
    const permitId = permitDetails?.PermitId;
    try {
      const sorted = [...selectedItems].sort((a, b) => b - a);
      let latestRecords = itemTable;
      for (const itemNo of sorted) {
        const res = await API.post("/deleteItem/", {
          PermitId: permitId,
          ItemNo: itemNo,
        });
        latestRecords = res.data.Records;
      }
      setItemTable(latestRecords);
      setSelectedItems([]);
      setSelectAll(false);
      resetItemForm();
      alert("Selected items deleted successfully");
    } catch (error) {
      console.error("Bulk delete failed", error);
    }
  };

  const deleteItem = async (itemNo) => {
    const permitId = permitDetails?.PermitId;
    try {
      const res = await API.post("/deleteItem/", {
        ItemNo: itemNo,
        PermitId: permitId,
      });
      setItemTable(res.data.Records);
      // const nextSerial = (res.data.Records.length + 1).toString().padStart("0");
      const nextSerial = res.data.Records.length + 1;
      setSerialNumber(nextSerial);
    } catch (error) {
      console.error("Delete failed", error);
    }
    resetItemForm();
  };
  // ---------------------------EDIT ITEM -----------------

  const editItem = async (itemNo) => {
    const item = itemTable.find((i) => i.ItemNo === itemNo);
    if (!item) return;

    const permitId = permitDetails?.PermitId;

    // setSerialNumber(item.ItemNo?.toString().padStart(3));
    setSerialNumber(item.ItemNo?.toString().padStart(3, "0"));

    // HS Code logic
    const selectedHs = hsCodeSuggestions.find(
      (i) => i.HSCode.toLowerCase() === item.HSCode?.toLowerCase(),
    );
    if (selectedHs) {
      setHsCodeRow(selectedHs);
      applyHsLogic(selectedHs);
    }

    // Basic details
    setHsCode(item.HSCode || "");
    setHsCodeDescription(item.Description || "");
    setDgIndicator(item.DGIndicator === "Yes");
    setCountryCode(item.Contry || "");
    setBrand(item.Brand || "");
    setUnbranded(item.Brand === "UNBRANDED");
    setModel(item.Model || "");
    setHawb(item.InHAWBOBL || "");
    setOutHawb(item.OutHAWBOBL || "");

    // Dutiable
    setDuitableQuantity(item.DutiableQty || 0);
    setDuitableQuantityUom(item.DutiableUOM || "--Select--");
    setTotalDuitableQuantity(item.TotalDutiableQty || 0);
    setTotalDuitableQuantityUom(item.TotalDutiableUOM || "--Select--");
    setInvoiceQuantity(item.InvoiceQuantity || 0);
    setHsQuantity(item.HSQty || 0);
    setHsUom(item.HSUOM || "--Select--");
    setAlcoholPercentage(item.AlcoholPer || 0);
    setSelectedInvoice(item.InvoiceNo || "");

    // Invoice
    setUnitPrice(item.UnitPrice || 0);
    setInvoiceCurrency(item.UnitPriceCurrency || "");
    setInvoiceExRate(item.ExchangeRate || 0);
    setSumExchangeRate(item.SumExchangeRate || 0);
    setTotalLineAmount(item.TotalLineAmount || 0);
    setCifFob(item.CIFFOB || 0);

    // Packing
    const hasPacking =
      item.OPQty > 0 ||
      (item.OPUOM || "").trim() !== "" ||
      item.IPQty > 0 ||
      (item.IPUOM || "").trim() !== "" ||
      item.InPqty > 0 ||
      (item.InPUOM || "").trim() !== "" ||
      item.ImPQty > 0 ||
      (item.ImPUOM || "").trim() !== "";
    setPackingChecked(hasPacking);
    setShowPacking(hasPacking);
    setOuterPackQuantity(item.OPQty || 0);
    setOuterPackQuantityUom(item.OPUOM || "");
    setInPackQuantity(item.IPQty || 0);
    setInPackQuantityUom(item.IPUOM || "");
    setInnerPackQuantity(item.InPqty || 0);
    setInnerPackQuantityUom(item.InPUOM || "");
    setImmostPackQuantity(item.ImPQty || 0);
    setImmostPackQuantityUom(item.ImPUOM || "");

    // Duty
    setPreferentialCode(item.PreferentialCode || "");
    setGstRateValue(item.GSTRate || 0);
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

    // Shipping marks — single textarea now
    setShippingMarks(item.ShippingMarks1 || "");
    setShowShippingMarks(!!item.ShippingMarks1?.trim());

    // Optional charges
    setOptionalCharges(item.Optioncahrge || 0);
    setSelectedCurrency(
      item.OptionalChrgeUOM
        ? {
            CurrencyUOM: item.OptionalChrgeUOM,
            CurrencyRate: item.OptionalSumExchage,
          }
        : null,
    );

    // Certificate of Origin
    setCerItemQty(parseFloat(item.CerItemQty) || 0);
    setCerItemUOM(item.CerItemUOM || "--Select--");
    setCifCerValue(parseFloat(item.CIFValOfCer) || 0);

    if (item.ManufactureCostDate) {
      const date = new Date(item.ManufactureCostDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      setManuDate(`${day}/${month}/${year}`);
    } else {
      setManuDate("");
    }

    setTextileCategory(item.TexCat || "");
    setTextileQuotaQty(parseFloat(item.TexQuotaQty) || 0);
    setTextileQuotaUOM(item.TexQuotaUOM || "--Select--");
    setCerInvoiceNumber(item.CerInvNo || "");

    if (item.CerInvDate) {
      const date = new Date(item.CerInvDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      setInvDate(`${day}/${month}/${year}`);
    } else {
      setInvDate("");
    }

    setCerDescription(item.CertificateDescription || "");
    setHsCodeCer(item.HSCodeCer || "");
    setPercentageOrigin(item.PerContent || "");

    // Origin criterion — split joined string back into 3 individual fields
    const originParts = (item.OriginOfCer || "")
      .split(",")
      .map((s) => s.trim());
    setOriginCriterionCode1(originParts[0] || "");
    setOriginCriterionCode2(originParts[1] || "");
    setOriginCriterionCode3(originParts[2] || "");

    setEditingSNo(item.ItemNo);

    // Fetch CASC data
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
        enduserDescription: "",
        casc: [],
      }));
      filtered.forEach((c) => {
        const cascIndex = parseInt(c.CASCId.replace("Casc", "")) - 1;
        if (cascIndex < 0 || cascIndex >= maxCascBoxes) return;
        if (!finalCasc[cascIndex].code) {
          finalCasc[cascIndex].code = c.ProductCode;
          finalCasc[cascIndex].hsQuantity = c.Quantity;
          finalCasc[cascIndex].uom = c.ProductUOM;
          finalCasc[cascIndex].enduserDescription = c.EndUserDes || "";
        }
        finalCasc[cascIndex].casc.push([
          c.CascCode1 || "",
          c.CascCode2 || "",
          c.CascCode3 || "",
        ]);
      });
      setItemCasc(finalCasc);
      const hasCasc = filtered.length > 0;
      setItemCascChecked(hasCasc);
      setShowItemCasc(hasCasc);
    } catch (error) {
      console.error("CASC fetch failed", error);
      setItemCasc(
        Array.from({ length: 3 }, () => ({
          code: "",
          hsQuantity: 0,
          uom: "",
          casc: [],
        })),
      );
      setItemCascChecked(false);
      setShowItemCasc(false);
    }

    handleCountryFocusOut(item.Contry || "");

    // CIF/FOB recalculation
    const matchedCurrency = currency.find(
      (cur) => cur.Currency === item.UnitPriceCurrency,
    );
    const resolvedExRate = matchedCurrency
      ? parseFloat(matchedCurrency.CurrencyRate)
      : parseFloat(item.ExchangeRate) || 0;
    const recalcCif = resolvedExRate * parseFloat(item.TotalLineAmount || 0);
    setCifFob(recalcCif.toFixed(2));
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
    setHawb("");
    setOutHawb("");

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
    setCifFob("");

    // ---------------- PACKING ----------------
    setPackingChecked(false);
    setShowPacking(false);

    // ---------------- DUTY ----------------
    setPreferentialCode("");
    setGstRateValue(9);
    setGstUom("");
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

    // ---------------- SHIPPING MARKS (single textarea) ----------------
    setShippingMarks("");

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

    // ---------------- CERTIFICATE OF ORIGIN ----------------
    setCerItemQty("");
    setCerItemUOM("--Select--");
    setCifCerValue("");
    setManuDate("");
    setTextileCategory("");
    setTextileQuotaQty("");
    setTextileQuotaUOM("--Select--");
    setCerInvoiceNumber("");
    setInvDate("");
    setOriginCriterionCode1("");
    setOriginCriterionCode2("");
    setOriginCriterionCode3("");
    setHsCodeCer("");
    setPercentageOrigin("");
    setCerDescription("");
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

  const ItemUploadData = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files[0]) {
      alert("Please select a file first!");
      return;
    }
    if (itemTable.length >= 50) {
      alert("Maximum 50 items allowed. Cannot upload more items.");
      return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("PermitId", permitDetails?.PermitId);
    formData.append("MsgType", "TNPDEC");
    formData.append("UserName", user.username.toUpperCase());
    formData.append("TouchTime", new Date().toISOString());
    try {
      setLoading(true);
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
            enduserDescription: rows[0].EndUserDescription || "",
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
      alert(res.data.Result);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
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

  const ItemEditAll = async () => {
    if (itemTable.length === 0) {
      alert("No items to update.");
      return;
    }

    const firstHawb = (cargoHawbList || [])[0] || "";
    const firstOutHawb = (outCargoHawbList || [])[0] || "";

    setLoading(true);

    try {
      const ItemAllData = itemTable.map((item) => {
        const matchedCurrency = currency.find(
          (cur) => cur.Currency === item.UnitPriceCurrency,
        );
        const resolvedExRate = matchedCurrency
          ? parseFloat(matchedCurrency.CurrencyRate)
          : parseFloat(item.ExchangeRate) || 0;

        const recalcCIFFOB = parseFloat(
          (resolvedExRate * Number(item.TotalLineAmount)).toFixed(2),
        );

        const gstPerval = (parseFloat(item.GSTRate) || 0) / 100;
        const exciseAmt = parseFloat(item.ExciseDutyAmount) || 0;
        const customsAmt = parseFloat(item.CustomsDutyAmount) || 0;
        let recalcGST =
          decType !== "GST : GST (Including Duty Exemption)"
            ? (exciseAmt + recalcCIFFOB + customsAmt) * gstPerval
            : recalcCIFFOB * gstPerval;
        recalcGST = parseFloat(recalcGST.toFixed(2));

        const hsCodeVal = (item.HSCode || "").toString().trim();
        const finalDescription =
          (item.Description || "").trim() || hsCodeMap[hsCodeVal] || "";

        return {
          ItemNo: item.ItemNo,
          PermitId: permitDetails?.PermitId,
          MessageType: "COODEC",
          HSCode: item.HSCode || "",
          Description: finalDescription,
          DGIndicator: item.DGIndicator || "",
          Contry: item.Contry || "",
          Brand: item.Brand || "",
          Model: item.Model || "",
          InHAWBOBL: firstHawb || item.InHAWBOBL || "",
          OutHAWBOBL: firstOutHawb || item.OutHAWBOBL || "",
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
          UnitPriceCurrency: item.UnitPriceCurrency || "",
          ExchangeRate: resolvedExRate,
          SumExchangeRate: item.SumExchangeRate || 0,
          TotalLineAmount: item.TotalLineAmount || 0,
          InvoiceCharges: item.InvoiceCharges || 0,
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
          GSTRate: item.GSTRate || 0,
          GSTUOM: item.GSTUOM || "",
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
          LSPValue: item.LSPValue || 0,
          ShippingMarks1: item.ShippingMarks1 || "",
          ShippingMarks2: "",
          ShippingMarks3: "",
          ShippingMarks4: "",
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
          CerItemQty: item.CerItemQty || 0,
          CerItemUOM: item.CerItemUOM || "",
          CIFValOfCer: item.CIFValOfCer || 0,
          ManufactureCostDate: item.ManufactureCostDate || "",
          TexCat: item.TexCat || "",
          TexQuotaQty: item.TexQuotaQty || 0,
          TexQuotaUOM: item.TexQuotaUOM || "",
          CerInvNo: item.CerInvNo || "",
          CerInvDate: item.CerInvDate || "",
          OriginOfCer: item.OriginOfCer || "",
          HSCodeCer: item.HSCodeCer || "",
          PerContent: item.PerContent || "",
          CertificateDescription: item.CertificateDescription || "",
        };
      });

      const res = await API.post("/editAllItems/", {
        Item: ItemAllData,
        PermitId: permitDetails?.PermitId,
      });
      setItemTable(res.data.Item);
      alert(res.data.message);
    } catch (error) {
      console.error("Edit All failed", error);
      alert(
        "Update failed: " + (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================Delete hawb from all items when hawb deleted from header==================
  const deleteHblHawb = async () => {
    const permitId = permitDetails?.PermitId;
    try {
      await API.delete(`/deleteHawbByPermitId/${permitId}/`);
      alert("All HAWB/HBL cleared successfully");
      setItemTable((prev) =>
        prev.map((item) => ({
          ...item,
          InHAWBOBL: "",
          OutHAWBOBL: "",
        })),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to clear HAWB/HBL");
    }
  };

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
        MessageType: "TNPDEC",

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
            >
              ADD ITEM
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

      <div className="col-6">
        <div className="row align-items-center compact-row">
          <div className="col-sm-8 border-bottom pb-1 full-width-title">
            ITEM DETAILS
          </div>
        </div>
        <div className="row">
          <div className="col-12">
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

            {/* ================= HS CODE ================= */}

            <div className="row">
              <div className="row mt-1">
                <div className="col-4">HS CODE</div>

                <div className="col-8 position-relative">
                  {/* Controlled Item Alert */}
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
            {/* INVOICE QUANTITY */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-4">INVOICE QUANTITY</div>
                <div className="col-8">
                  <input
                    type="text"
                    className="inputStyle"
                    value={invoiceQuantity}
                    placeholder="0.00"
                    onChange={(e) => setInvoiceQuantity(e.target.value)}
                    onBlur={handleInvoiceQuantityFocusOut}
                    tabIndex={13}
                  />
                </div>
              </div>
            </div>

            {/* HS QUANTITY */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-4">HS QUANTITY</div>
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
                <div className="col-4">
                  <select
                    className="Dropdown HighLight"
                    value={hsUom}
                    onChange={(e) => handleUomChange(e.target.value)}
                  >
                    <option>--Select--</option>
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
            {/* CURRENCY UNIT PRICE AUTO */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-4">
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
                </div>

                <div className="col-4">
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
            {/* TOTAL LINE AMOUNT */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-4">TOTAL LINE AMOUNT</div>
                <div className="col-8">
                  <input
                    type="text"
                    placeholder="0.00"
                    className="inputStyle HighLight"
                    value={totalLineAmount}
                    onChange={(e) => setTotalLineAmount(e.target.value)}
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
            {/* CIF / FOB */}
            <div className="row mt-3">
              <div className="row">
                <div className="col-4">CIF/FOB (SGD)</div>
                <div className="col-8">
                  <input
                    type="text"
                    placeholder="0.00"
                    className="inputStyle"
                    value={cifFob}
                    onChange={(e) => setCifFob(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* SHIPPING MARKS*/}
            <div className="row mt-3">
              <div className="row">
                <div className="col-4">SHIPPING MARKS</div>
                <div className="col-8">
                  <textarea
                    className="inputStyle"
                    value={shippingMarks}
                    style={{ resize: "vertical", minHeight: "90px" }}
                    onChange={(e) => setShippingMarks(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="row mt-3" style={{ display: "none" }}>
              <div className="row">
                <input className="me-2" value={dutyTypeId} />
              </div>
              <div className="row">
                <input className="me-2" value={kgmVisible} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-6">
        <div className="row align-items-center compact-row">
          <div className="col-sm-8 border-bottom pb-1 full-width-title">
            CERTIFICATE OF ORIGIN
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {/* CERTIFICATE ITEM QUANTITY */}
            <div className="row mt-1">
              <div className="row">
                <div className="col-5">CERTIFICATE ITEM QUANTITY</div>

                <div className="col-4">
                  <input
                    type="text"
                    className="inputStyle CoTypeEmpty"
                    id="TxtCerItemQty"
                    value={cerItemQty}
                    placeholder="0.00"
                    onChange={(e) => setCerItemQty(e.target.value)}
                  />
                </div>
                <div className="col-3">
                  <select
                    className="Dropdown CoTypeEmptySelect"
                    id="DrpCerItemUOM"
                    value={cerItemUOM}
                    onChange={(e) => setCerItemUOM(e.target.value)}
                  >
                    <option value="">--Select--</option>
                    {totalOuterPack.map((tooupack) => (
                      <option key={tooupack.Name} value={tooupack.Name}>
                        {tooupack.Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-5">MANUFACTURING COST DATE</div>

                <div className="col-7">
                  <DateField
                    tabIndex={10}
                    value={manuDate}
                    setValue={setManuDate}
                  />
                </div>
              </div>
              {showCifFobValue && (
                <div className="row mt-3">
                  <div className="col-5">CIF/FOB ITEM VALUE ON CERTIFICATE</div>

                  <div className="col-7">
                    <input
                      type="text"
                      className="inputStyle CoTypeEmpty"
                      id="TxtCIFCer"
                      value={cifCerValue}
                      placeholder="0.00"
                      onChange={(e) => setCifCerValue(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {showItemTexttile && (
                <div className="row mt-3">
                  <div className="col-5">TEXTILE CATEGORY</div>

                  <div className="col-7">
                    <input
                      type="text"
                      className="inputStyle CoTypeEmpty"
                      id="TexCat"
                      value={textileCategory}
                      onChange={(e) => setTextileCategory(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {showItemTexttile && (
                <div className="row mt-3">
                  <div className="col-5">TEXTILE QUOTA QUANTITY</div>

                  <div className="col-4">
                    <input
                      type="text"
                      className="inputStyle CoTypeEmpty"
                      id="TexQuotaQty"
                      value={textileQuotaQty}
                      onChange={(e) => setTextileQuotaQty(e.target.value)}
                    />
                  </div>
                  <div className="col-3">
                    <select
                      className="Dropdown CoTypeEmptySelect"
                      id="DrpCerItemUOM"
                      value={textileQuotaUOM}
                      onChange={(e) => setTextileQuotaUOM(e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {totalOuterPack.map((tooupack) => (
                        <option key={tooupack.Name} value={tooupack.Name}>
                          {tooupack.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div className="row mt-3">
                <div className="col-5">INVOICE NUMBER</div>

                <div className="col-7">
                  <input
                    type="text"
                    className="inputStyle CoTypeEmpty"
                    id="TxtCerInvoice"
                    value={cerInvoiceNumber}
                    onChange={(e) => setCerInvoiceNumber(e.target.value)}
                  />
                </div>
              </div>
              {showOriginCriterion && (
                <div className="row mt-3">
                  <div className="col-5">ORIGIN CRITERION</div>

                  <div className="col-7">
                    <input
                      type="text"
                      className="inputStyle CoTypeEmpty"
                      id="OriginDes1"
                      value={originCriterionCode1}
                      onChange={(e) => setOriginCriterionCode1(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {showOriginCriterion && (
                <div className="row mt-3">
                  <div className="col-5"></div>

                  <div className="col-7">
                    <input
                      type="text"
                      className="inputStyle CoTypeEmpty"
                      id="OriginDes2"
                      value={originCriterionCode2}
                      onChange={(e) => setOriginCriterionCode2(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {showOriginCriterion && (
                <div className="row mt-3">
                  <div className="col-5"></div>

                  <div className="col-7">
                    <input
                      type="text"
                      className="inputStyle CoTypeEmpty"
                      id="OriginDes3"
                      value={originCriterionCode3}
                      onChange={(e) => setOriginCriterionCode3(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <div className="row mt-3">
                <div className="col-5">INVOICE DATE</div>

                <div className="col-7">
                  <DateField
                    tabIndex={10}
                    value={invDate}
                    setValue={setInvDate}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-5">HS CODE ON CERTIFICATE</div>

                <div className="col-7">
                  <input
                    type="text"
                    className="inputStyle CoTypeEmpty"
                    id="TxtHSCodeCer"
                    value={hsCodeCer}
                    onChange={(e) => setHsCodeCer(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-5">
                  PERCENTAGE CONTENT OF ORIGIN CRITERION
                </div>

                <div className="col-7">
                  <input
                    type="text"
                    className="inputStyle CoTypeEmpty"
                    id="TxtPerOrigin"
                    value={percentageOrigin}
                    onChange={(e) => setPercentageOrigin(e.target.value)}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-5">CERTIFICATE DESCRIPTION</div>

                <div className="col-7">
                  <textarea
                    className="inputStyle CoTypeEmpty"
                    style={{ resize: "vertical", minHeight: "90px" }}
                    id="TxtCerDes"
                    value={cerDescription}
                    onChange={(e) => setCerDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="row mt-3" style={{ display: "none" }}>
              <div className="row">
                <input className="me-2" value={dutyTypeId} />
              </div>
              <div className="row">
                <input className="me-2" value={kgmVisible} />
              </div>
            </div>
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
                <button className="NextpageBtns" onClick={ItemUploadData}>
                  UPLOAD DATA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
          onClick={() => setActiveTab("SummaryTab")}
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
            disabled={selectedItems.length === 0}
          >
            DELETE ITEM
          </button>
        </div>

        <div className="col-2">
          <button
            className="MoveOnButtons showDisable"
            type="button"
            onClick={ItemEditAll}
          >
            EDIT ALL ITEM
          </button>
        </div>

        <div className="col-2">
          <input
            type="text"
            className="inputStyle"
            placeholder="SEARCH BY ITEM NO..."
          />
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
                <th>CURRENCY</th>
                <th>CIF/FOB (S$)</th>
                <th>HS QUANTITY</th>
                <th>HS UOM</th>
                <th>ITEM LINE AMOUNT</th>
                <th>CERT ITEM QTY</th>
                <th>CERT ITEM UOM</th>
                <th> CERT ITEM VALUE</th>
              </tr>
            </thead>

            <tbody>
              {itemTable.length === 0 ? (
                <tr>
                  <td colSpan={14} style={{ textAlign: "center" }}>
                    No Record
                  </td>
                </tr>
              ) : (
                itemTable.map((item, index) => {
                  const hsRow = hsCodeSuggestions.find(
                    (h) =>
                      h.HSCode?.toLowerCase() === item.HSCode?.toLowerCase(),
                  );
                  const isControlled = hsRow?.Out === "1";

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
                      <td>{item.UnitPriceCurrency}</td>
                      <td>{item.CIFFOB}</td>
                      <td>{item.HSQty}</td>
                      <td>{item.HSUOM}</td>
                      <td>{item.TotalLineAmount}</td>
                      <td>{item.CerItemQty}</td>
                      <td>{item.CerItemUOM}</td>
                      <td>{item.CIFValOfCer}</td>
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
    </div>
  );
}
export default Item;
