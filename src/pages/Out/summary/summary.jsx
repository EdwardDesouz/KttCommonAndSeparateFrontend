import { useState, useEffect, useContext, useMemo } from "react";
import { useOut } from "../context/outContext";
import { DateField } from "../cargo/cargo";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import { UserContext } from "../../../userContex/userContex";
import { useDebounceAutoSave } from "../../../autoSave/useDebounceAutoSave";
import { getFieldConfig } from "../../config/accountFieldConfig";
import { CircleLoader } from "react-spinners";
function Summary({ setActiveTab, isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const {
    permitDetails,
    updatePermitDetails,

    // Header
    decType,
    prevPermitNo,
    setPrevPermitNo,
    showPermit,
    setShowPermit,
    cargo,
    transportMode,
    outTransportMode,
    coType,
    declFor,
    setDeclFor,
    bgInd,
    supplyInd,
    refDocs,
    Licence,
    Recipients,
    certificateType1,
    certificateCopy1,
    certificateType2,
    certificateCopy2,
    currencyCode,

    additionalCertificateDetails,
    transportDetailsHeader,
    showDeclarationTypeError,
    setShowDeclarationTypeError,
    showCargoPackTypeError,
    setShowCargoPackTypeError,
    showDeclaringForError,
    setShowDeclaringForError,
    setShowInwardTransportError,
    showInwardTransportError,
    showOutwardTransportError,
    setShowOutwardTransportError,
    // Party
    importerCode,
    showImporterCrueiError,
    setShowImporterCrueiError,
    showImporterNameError,
    setShowImporterNameError,
    inwardCode,
    showInwardCrueiError,
    setShowInwardCrueiError,
    showInwardNameError,
    setShowInwardNameError,
    freightForwarderCode,
    claimantCode,
    endUserCode,
    manufacturerCode,
    // Cargo
    cargoHawb,
    arrivalDate,
    showArriavalDateError,
    setShowArrivalDateError,
    loadingPortCode,
    showLoadingPortCodeError,
    setShowLoadingPortCodeError,
    voyageNumber,
    vesselName,
    obl,
    conveyanceNumber,
    transportDetails,
    flightNumber,
    airCraftRegNumber,
    mawbNumber,
    releaseCode,
    showReleaseCodeError,
    setShowReleaseCodeError,
    releaseLocationDescription,
    receiptCode,
    showreceiptCodeError,
    setShowReceiptCodeError,
    receiptLocationDescription,
    totalOuterPackValue,
    totalOuterPackName,
    showTotalOuterPackValueError,
    setShowTotalOuterPackValueError,
    showTotalOuterPackUomError,
    setShowTotalOuterPackUomError,
    permitGrossWeight,
    totalGrossWeight,
    grossUOM,
    showTotalGrossWeightError,
    setShowTotalGrossWeightError,
    showGrossUOMError,
    setShowGrossUOMError,
    blanketStartDate,
    exhibitionStartDate,
    exhibitionEndDate,
    containers,
    exporterCode,
    exporterCruei,
    exporterName,
    outwardCode,
    congineeCode,

    storageCode,
    dischargePortCode,
    finalDestinationCountry,
    departureDate,
    setDepartureDate,
    showDepartureDateError,
    outVoyageNumber,
    outVesselName,
    outObl,
    vesselType,
    vesselNetRegisterTonnage,
    vesselNationality,
    towingVesselId,
    towingVesselName,
    nextPortCode,
    lastPortCode,
    outConveyanceNumber,
    outTransportDetails,
    outFlightNumber,
    outAirCraftRegNumber,
    outMawbNumber,
    outHblHawb,
    outCargoHawb,
    setOutCargoHawb,
    outSeaStore,

    // Invoice & Item tables
    invoiceTable,
    itemTable,

    // Summary states
    summaryImporterCruei,
    setSummaryImporterCruei,
    summaryImporterName,
    setSummaryImporterName,
    totalAmountPayable,
    setTotalAmountPayable,
    showCifMatchingError,
    setShowCifMatchingError,
    summaryRemarks,
    setSummaryRemarks,
    formatRemark,
    setFormatRemark,
    summaryCrossReference,
    setSummaryCrossReference,
    summaryInternalReamarks,
    setSummaryInternalRemarks,
    summaryDate,
    setSummaryDate,
    summaryTime,
    setSummaryTime,
    declarationChecked,
    setDeclarationChecked,
    summaryDeclaringFor,
    setSummaryDeclaringFor,
    // CPC
    showAeo,
    showCwc,
    showSeaStoreCpc,
    cnBChecked,
    showInternationalPermitExchange,
    showSts,
    showStsCwc,
    showDeferredPrinting,
    aeoRows,
    cwcRows,
    seaStoreRows,
    stsRows,
    stsCwcRows,
    deferredPrintingRows,
    internationalPermitExchangeRows,
    // SAVE AS DRAFT MODEL
    showVoyageNumber,
    showVesselName,
    showOblNumber,
    showconveyanceNumber,
    showTransportDetails,
    showFlightNumber,
    showAirCraftRegNumber,
    showMawbNumber,
    // prepareCpcData,
  } = useOut();

  // ── Party master table check ──────────────────────────────────────────
  const [showPartyNotSavedModal, setShowPartyNotSavedModal] = useState(false);
  const [missingPartyCodes, setMissingPartyCodes] = useState([]);
  const [isSavingPermit, setIsSavingPermit] = useState(false);
  // summary declraing for
  const [declaringFor, setDeclaringFor] = useState([]);
  // DeclaringFor
  const fetchDeclaringFor = async () => {
    try {
      const response = await API.get(
        "/getDeclaringForFromCommonMasterByOutandTranshipment/",
      );
      setDeclaringFor(response.data);
    } catch (error) {
      console.error("Error fetching mailbox data:", error);
    }
  };
  useEffect(() => {
    fetchDeclaringFor();
  }, []);

  // declaring for hide show use effect for empty save
  useEffect(() => {
    const config = getFieldConfig(user?.accountId);
    if (!config.showDeclaringFor) {
      setDeclFor("");
      setShowDeclaringForError(false);
    }
  }, [user?.accountId]);

  // Decelaring for visible depends account id

  const fieldConfig = getFieldConfig(user?.accountId);
  console.log("accountId:", user?.accountId);
  console.log("fieldConfig:", fieldConfig);

  // ── Validation Modal State ───────────────────────────────────────────────
  const [validationErrors, setValidationErrors] = useState({
    header: [],
    party: [],
    cargo: [],
    invoice: [],
    item: [],
    summary: [],
  });
  const [showValidationModal, setShowValidationModal] = useState(false);

  // ── Computed Totals ──────────────────────────────────────────────────────
  const totalItemValue = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.TotalLineAmount) || 0),
    0,
  );

  const totalInvoiceCifValue = invoiceTable.reduce(
    (sum, inv) => sum + (parseFloat(inv.CIFSUMAmount) || 0),
    0,
  );

  const totalItemCifValue = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.CIFFOB) || 0),
    0,
  );

  const totalItemGstAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.GSTAmount) || 0),
    0,
  );

  const sumOfExciseDutyAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.ExciseDutyAmount) || 0),
    0,
  );

  const sumOfCustomsDutyAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.CustomsDutyAmount) || 0),
    0,
  );

  const sumOfOtherTaxAmount = itemTable.reduce(
    (sum, item) => sum + (parseFloat(item.OtherTaxAmount) || 0),
    0,
  );

  // ── Total Amount Payable ─────────────────────────────────────────────────
  useEffect(() => {
    if (decType === "DNG : Duty & GST") {
      setTotalAmountPayable(
        Number(sumOfOtherTaxAmount || 0) +
          Number(sumOfExciseDutyAmount || 0) +
          Number(totalItemGstAmount || 0) +
          Number(sumOfCustomsDutyAmount || 0),
      );
    } else {
      setTotalAmountPayable(Number(totalItemGstAmount || 0));
    }
  }, [
    decType,
    sumOfOtherTaxAmount,
    sumOfExciseDutyAmount,
    totalItemGstAmount,
    sumOfCustomsDutyAmount,
  ]);

  // ── CIF Match Check ──────────────────────────────────────────────────────
  useEffect(() => {
    const invoiceValue = Number(totalInvoiceCifValue.toFixed(2));
    const itemValue = Number(totalItemCifValue.toFixed(2));
    setShowCifMatchingError(invoiceValue !== itemValue);
  }, [totalInvoiceCifValue, totalItemCifValue]);

  // ── Invoice Grouping ─────────────────────────────────────────────────────
  const groupedInvoices = {};
  invoiceTable.forEach((inv) => {
    const currency = inv.TICurrency || "";
    const amount = Number(inv.TIAmount || 0);
    groupedInvoices[currency] = (groupedInvoices[currency] || 0) + amount;
  });
  const result = Object.keys(groupedInvoices).map((key) => ({
    TICurrency: key,
    TIAmount: groupedInvoices[key],
  }));

  // ── Item Grouping ────────────────────────────────────────────────────────
  const groupedItems = {};
  itemTable.forEach((item) => {
    const itemCurrency = item.UnitPriceCurrency || "";
    const itemTotalLineAmount = item.TotalLineAmount || 0;
    groupedItems[itemCurrency] =
      (groupedItems[itemCurrency] || 0) + itemTotalLineAmount;
  });
  const itemResult = Object.keys(groupedItems).map((key) => ({
    UnitPriceCurrency: key,
    TotalLineAmount: groupedItems[key],
  }));

  // ── Remark Helpers ───────────────────────────────────────────────────────
  const showPermitFunction = () => {
    if (prevPermitNo && prevPermitNo.trim() !== "") {
      setShowPermit(true);
      setSummaryRemarks(`PREVIOUS PERMIT NO : ${prevPermitNo}`);
    } else {
      setSummaryRemarks("PREVIOUS PERMIT NO :");
    }
  };

  const showExRate = () => {
    const grouped = {};
    invoiceTable.forEach((inv) => {
      const currency = inv.TICurrency || "";
      const rate = Number(inv.TIExRate || 0);
      grouped[currency] = (grouped[currency] || 0) + rate;
    });
    const exRateText = Object.keys(grouped)
      .map(
        (cur) =>
          `CURRENCY : ${cur} , EXCHANGE RATE : ${grouped[cur].toFixed(6)}`,
      )
      .join("\n");
    setSummaryRemarks((prev) => prev + (prev ? "\n" : "") + exRateText);
  };

  const summaryConfigBtnFunction = () => {
    setFormatRemark("");
    setSummaryRemarks((prev) => prev.replaceAll("\n", formatRemark));
  };

  // ── Time Handler ─────────────────────────────────────────────────────────
  const handleTimeBlur = (val) => {
    if (val.length >= 6 && val.length <= 8) {
      const regex1 = /^\d{2}(AM|PM)$/i;
      const regex2 = /^\d{4} (AM|PM)$/i;
      const regex3 = /^\d{2}:\d{2} (AM|PM)$/i;
      const regex4 = /^\d{4}(AM|PM)$/i;
      const regex5 = /^\d{2}:\d{2}(AM|PM)$/i;
      if (regex1.test(val))
        setSummaryTime(`${val[0]}${val[1]}:00 ${val.slice(2).toUpperCase()}`);
      else if (regex2.test(val))
        setSummaryTime(
          `${val[0]}${val[1]}:${val[2]}${val[3]} ${val.slice(5).toUpperCase()}`,
        );
      else if (regex3.test(val)) setSummaryTime(val.toUpperCase());
      else if (regex4.test(val))
        setSummaryTime(
          `${val[0]}${val[1]}:${val[2]}${val[3]} ${val.slice(4).toUpperCase()}`,
        );
      else if (regex5.test(val))
        setSummaryTime(`${val.slice(0, 5)} ${val.slice(5).toUpperCase()}`);
      else setSummaryTime("");
    } else {
      setSummaryTime("");
    }
  };

  // ════════════════════════════════════════════════════════════════════════
  //  VALIDATION — mirrors old FinalSubmit() logic using React context state
  // ════════════════════════════════════════════════════════════════════════
  const runValidation = () => {
    const errors = {
      header: [],
      party: [],
      cargo: [],
      invoice: [],
      item: [],
      summary: [],
    };
    let isValid = true;

    // ── HEADER ──────────────────────────────────────────────────────────
    setShowDeclarationTypeError(false);
    if (!decType || decType === "--Select--") {
      errors.header.push("CHECK THE DECLARATION TYPE");
      setShowDeclarationTypeError(true);
      isValid = false;
    } else {
      setShowDeclarationTypeError(false);
    }

    setShowCargoPackTypeError(false);
    if (!cargo || cargo === "--Select--") {
      errors.header.push("CHECK THE CARGO PACK TYPE");
      setShowCargoPackTypeError(true);
      isValid = false;
    } else {
      setShowCargoPackTypeError(false);
    }

    // setShowInwardTransportError(false);
    // if (
    //   decType !==
    //   "BKT : BLANKET [INCLUDING BLANKET GST RELIEF (& DUTY EXEMPTION)]"
    // ) {
    //   if (!transportMode || transportMode === "--Select--") {
    //     errors.header.push("CHECK THE INWARD TRANSPORT MODE");
    //     setShowInwardTransportError(true);
    //     isValid = false;
    //   }
    // }

    setShowOutwardTransportError(false);
    // if (
    //   decType === "REX : FOR RE-EXPORT" ||
    //   decType === "SFZ : STORAGE IN FTZ"
    // ) {
    if (!outTransportMode || outTransportMode === "--Select--") {
      errors.header.push("CHECK THE OUTWARD TRANSPORT MODE");
      setShowOutwardTransportError(true);
      isValid = false;
    }
    // }

    if (fieldConfig.showDeclaringFor) {
      if (!declFor) {
        errors.header.push("CHECK THE DECLARING FOR");
        setShowDeclaringForError(true);
        isValid = false;
      } else {
        setShowDeclaringForError(false);
      }
    }

    // ── PARTY ────────────────────────────────────────────────────────────
    // setShowImporterCrueiError(false);
    // if (!importerCode || importerCode.trim() === "") {
    //   errors.party.push("CHECK THE IMPORTER CRUEI");
    //   setShowImporterCrueiError(true);
    //   isValid = false;
    // } else {
    //   setShowImporterCrueiError(false);
    // }

    // setShowImporterNameError(false);
    // if (!summaryImporterName || summaryImporterName.trim() === "") {
    //   errors.party.push("CHECK THE IMPORTER NAME");
    //   setShowImporterNameError(true);
    //   isValid = false;
    // } else {
    //   setShowImporterNameError(false);
    // }

    if (transportMode === "1 : Sea" || transportMode === "4 : Air") {
      if (!inwardCode || inwardCode.trim() === "") {
        errors.party.push("CHECK THE INWARD CARRIER CRUEI");
        isValid = false;
      }
    }

    // ── CARGO ────────────────────────────────────────────────────────────
    setShowTotalOuterPackValueError(false);
    if (!totalOuterPackValue || totalOuterPackValue === "") {
      errors.cargo.push("CHECK THE TOTAL OUTER PACK VALUE");
      setShowTotalOuterPackValueError(true);
      isValid = false;
    } else {
      setShowTotalOuterPackValueError(false);
    }

    setShowTotalOuterPackUomError(false);
    if (!totalOuterPackName || totalOuterPackName === "--Select--") {
      errors.cargo.push("CHECK THE TOTAL OUTER PACK UOM");
      setShowTotalOuterPackUomError(true);
      isValid = false;
    } else {
      setShowTotalOuterPackUomError(false);
    }

    setShowTotalGrossWeightError(false);
    if (!totalGrossWeight || totalGrossWeight === "") {
      errors.cargo.push("CHECK THE TOTAL GROSS WEIGHT");
      setShowTotalGrossWeightError(true);
      isValid = false;
    } else {
      setShowTotalGrossWeightError(false);
    }

    setShowGrossUOMError(false);
    if (!grossUOM || grossUOM === "--Select--") {
      errors.cargo.push("CHECK THE GROSS WEIGHT UOM");
      setShowGrossUOMError(true);
      isValid = false;
    } else {
      setShowGrossUOMError(false);
    }
    setShowReleaseCodeError(false);
    if (!releaseCode || releaseCode.trim() === "") {
      errors.cargo.push("CHECK THE RELEASE LOCATION");
      setShowReleaseCodeError(true);
      isValid = false;
    } else {
      setShowReleaseCodeError(false);
    }

    setShowReceiptCodeError(false);
    if (!receiptCode || receiptCode.trim() === "") {
      errors.cargo.push("CHECK THE RECEIPT LOCATION");
      setShowReceiptCodeError(true);
      isValid = false;
    } else {
      setShowReceiptCodeError(false);
    }

    if (transportMode !== "N : Not Required") {
      // if (!loadingPortCode || loadingPortCode.trim() === "") {
      //   errors.cargo.push("CHECK THE LOADING PORT");
      //   setShowLoadingPortCodeError(true);
      //   isValid = false;
      // } else {
      //   setShowLoadingPortCodeError(false);
      // }
      // setShowArrivalDateError(false);
      // if (!arrivalDate || arrivalDate.trim() === "") {
      //   errors.cargo.push("CHECK THE ARRIVAL DATE");
      //   setShowArrivalDateError(true);
      //   isValid = false;
      // } else {
      //   setShowArrivalDateError(false);
      // }
    }
    if (transportMode === "1 : Sea") {
      if (!voyageNumber || voyageNumber.trim() === "") {
        errors.cargo.push("CHECK THE VOYAGE NUMBER");
        isValid = false;
      }
      if (!vesselName || vesselName.trim() === "") {
        errors.cargo.push("CHECK THE VESSEL NAME");
        isValid = false;
      }
      if (!obl || obl.trim() === "") {
        errors.cargo.push("CHECK THE OBL");
        isValid = false;
      }
    }
    if (transportMode === "4 : Air") {
      if (!flightNumber || flightNumber.trim() === "") {
        errors.cargo.push("CHECK THE FLIGHT NUMBER");
        isValid = false;
      }
      if (!mawbNumber || mawbNumber.trim() === "") {
        errors.cargo.push("CHECK THE MAWB");
        isValid = false;
      }
    }
    if (cargo === "9: Containerized") {
      // verify this matches your dropdown value exactly
      const hasValidContainer = containers.some(
        (c) => c.isSaved && c.number && c.number.trim() !== "", // ✅ check string not number
      );
      if (!hasValidContainer) {
        errors.cargo.push("CHECK THE CONTAINER — AT LEAST ONE REQUIRED");
        isValid = false;
      }
    }

    // ── INVOICE ──────────────────────────────────────────────────────────
    if (invoiceTable.length < 1) {
      errors.invoice.push("PLEASE ADD AT LEAST ONE INVOICE");
      isValid = false;
    }

    // ── ITEM ─────────────────────────────────────────────────────────────
    if (itemTable.length < 1) {
      errors.item.push("PLEASE ADD AT LEAST ONE ITEM");
      isValid = false;
    }

    // ── SUMMARY ──────────────────────────────────────────────────────────
    if (fieldConfig.showDeclaringFor) {
      if (
        !summaryDeclaringFor ||
        !declFor ||
        summaryDeclaringFor.trim() !== declFor.trim()
      ) {
        errors.summary.push(
          "DECLARING FOR (HEADER) AND SUMMARY DECLARING FOR MUST MATCH",
        );
        isValid = false;
      }
    }
    console.log("Header DeclaringFor:", declFor);
    console.log("Summary DeclaringFor:", summaryDeclaringFor);

    if (!declarationChecked) {
      errors.summary.push("PLEASE CHECK THE DECLARATION INDICATOR");
      isValid = false;
    }
    // if (!summaryDate || summaryDate.trim() === "") {
    //   errors.summary.push("PLEASE ADD MRD (DATE)");
    //   isValid = false;
    // }
    // if (!summaryTime || summaryTime.trim() === "") {
    //   errors.summary.push("PLEASE ADD SUMMARY TIME");
    //   isValid = false;
    // }

    return { isValid, errors };
  };

  // ════════════════════════════════════════════════════════════════════════
  //  SAVE HELPERS
  // ════════════════════════════════════════════════════════════════════════
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "") return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  const toDecimal = (val) => {
    if (val === null || val === undefined || val === "") return 0.0;
    const num = parseFloat(String(val).replace(/,/g, ""));
    return isNaN(num) ? 0.0 : num;
  };

  const toBigInt = (val) => {
    if (val === null || val === undefined || val === "") return null;
    const num = parseInt(val, 10);
    return isNaN(num) ? null : num;
  };

  // ALL CONTAINERS SAVE

  // ── Auto-save unsaved containers ────────────────────────────────────────
  const saveAllContainers = async (touchUser, touchTime) => {
    const unsavedContainers = containers.filter(
      (c) => !c.isSaved && c.number && c.number.trim() !== "",
    );

    for (let i = 0; i < unsavedContainers.length; i++) {
      const container = unsavedContainers[i];
      const rowNo = containers.findIndex((c) => c.id === container.id) + 1;

      const payload = {
        PermitId: (permitDetails?.PermitId || "").toUpperCase(),
        RowNo: rowNo,
        ContainerNo: String(container.number).trim(),
        Size:
          typeof container.sizeType === "object"
            ? String(container.sizeType.value).trim()
            : String(container.sizeType).trim(),
        Weight: Number(container.weight),
        SealNo: String(container.seal).trim(),
        MessageType: "OUTDEC",
        TouchUser: touchUser,
        TouchTime: touchTime,
      };

      try {
        await API.post("/postContainerTable/", payload);
      } catch (err) {
        console.error(`Error auto-saving container row ${rowNo}:`, err);
      }
    }
  };

  const prepareCpcData = () => {
    const touchTime = new Date().toISOString();
    const touchUser = user?.username;
    const cpcPayload = [];

    const formatSection = (rows, type) => {
      return rows
        .filter(
          (row) =>
            row.ProcessingCode1 || row.ProcessingCode2 || row.ProcessingCode3,
        )
        .map((row, index) => ({
          PermitId: (permitDetails?.PermitId || "").toUpperCase(),
          MessageType: "OUTDEC",
          RowNo: index + 1,
          CPCType: type,
          ProcessingCode1: row.ProcessingCode1 || "",
          ProcessingCode2: row.ProcessingCode2 || "",
          ProcessingCode3: row.ProcessingCode3 || "",
          TouchUser: touchUser,
          TouchTime: touchTime,
        }));
    };

    if (showAeo) cpcPayload.push(...formatSection(aeoRows, "AEO"));
    if (showCwc) cpcPayload.push(...formatSection(cwcRows, "CWC"));
    if (showSeaStoreCpc)
      cpcPayload.push(...formatSection(seaStoreRows, "SEASTORE"));
    if (showSts) cpcPayload.push(...formatSection(stsRows, "STS"));
    if (showStsCwc) cpcPayload.push(...formatSection(stsCwcRows, "STSCWC"));
    if (showDeferredPrinting)
      cpcPayload.push(...formatSection(deferredPrintingRows, "DEFERREDCO"));

    if (cnBChecked) {
      cpcPayload.push({
        PermitId: (permitDetails?.PermitId || "").toUpperCase(),
        MessageType: "OUTDEC",
        RowNo: 1,
        CPCType: "CNB",
        ProcessingCode1: "",
        ProcessingCode2: "",
        ProcessingCode3: "",
        TouchUser: touchUser,
        TouchTime: touchTime,
      });
    }

    if (showInternationalPermitExchange)
      cpcPayload.push(...formatSection(internationalPermitExchangeRows, "IPE"));

    return cpcPayload;
  };

  // ════════════════════════════════════════════════════════════════════════
  //  HANDLE SAVE PERMIT
  // ════════════════════════════════════════════════════════════════════════
  // const handleSavePermit = async () => {
  //   // ── Step 1: Validate ───────────────────────────────────────────────
  //   const { isValid, errors } = runValidation();
  //   if (!isValid) {
  //     setValidationErrors(errors);
  //     setShowValidationModal(true);
  //     return;
  //   }

  //   // ── Step 2: Touch Info ─────────────────────────────────────────────
  //   const touchUser = (user?.username || "").toUpperCase();
  //   const touchTime = new Date().toISOString();

  //   // ── Step 3: Permit Status ──────────────────────────────────────────
  //   let PermitStatus = "NEW";
  //   let PermitNumber = permitDetails?.PermitNumber || "";
  //   if (PermitNumber === "None" || PermitNumber === "NONE") PermitNumber = "";
  //   // Wire when Refund/Cancel/Amend tabs ready:
  //   // if (refundUpdateIndicator === "RFD") { PermitStatus = "RFD"; PermitNumber = refundPermitNumber; }
  //   // if (cancelUpdateIndicator === "CNL") { PermitStatus = "CNL"; PermitNumber = cancelPermitNumber; }
  //   // if (amendUpdateIndicator === "AME") { PermitStatus = "AME"; PermitNumber = amendPermitNumber; }

  //   // ── Step 4: Build CPC Payload ──────────────────────────────────────
  //   const cpcData = prepareCpcData();

  //   // ── Step 5: Build Header Payload ───────────────────────────────────
  //   const headerPayload = {
  //     // Permit IDs
  //     Refid: toBigInt(permitDetails?.RefId),
  //     JobId: permitDetails?.JobId || "",
  //     MSGId: permitDetails?.MsgId || "",
  //     PermitId: (permitDetails?.PermitId || "").toUpperCase(),

  //     // Header
  //     TradeNetMailboxID: permitDetails?.MailBoxId || "",
  //     MessageType: "OUTDEC",
  //     DeclarationType: decType || "",
  //     PreviousPermit: prevPermitNo || "",
  //     CargoPackType: cargo || "",
  //     InwardTransportMode: transportMode || "",
  //     OutwardTransportMode: outTransportMode || "",
  //     COType: coType || "",
  //     BGIndicator: bgInd || "",
  //     SupplyIndicator: supplyInd ? "Y" : "N",
  //     ReferenceDocuments: refDocs ? "Y" : "N",
  //     License: Licence || "",
  //     Recipient: Recipients || "",
  //     CerDetailtype1: certificateType1 || "",
  //     CerDetailCopies1: certificateCopy1 || "",
  //     CerDetailtype2: certificateType2 || "",
  //     CerDetailCopies2: certificateCopy2 || "",
  //     CurrencyCode: currencyCode || "",
  //     TransDtl: transportDetailsHeader || "",
  //     AddCerDtl: additionalCertificateDetails || "",

  //     // Party
  //     DeclarantCompanyCode: permitDetails?.DeclarantCode || "",
  //     ImporterCompanyCode: importerCode || "",
  //     ExporterCompanyCode: exporterCode || "",
  //     InwardCarrierAgentCode: inwardCode || "",
  //     OutwardCarrierAgentCode: outwardCode || "",
  //     CONSIGNEECode: congineeCode || "",
  //     FreightForwarderCode: freightForwarderCode || "",
  //     ClaimantPartyCode: claimantCode || "",
  //     EndUserCode: endUserCode || "",
  //     Manufacturer: manufacturerCode || "",

  //     // Cargo
  //     ArrivalDate: formatDate(arrivalDate) || null,
  //     LoadingPortCode: loadingPortCode || "",
  //     VoyageNumber: voyageNumber || "",
  //     VesselName: vesselName || "",
  //     OceanBillofLadingNo: obl || "",
  //     ConveyanceRefNo: conveyanceNumber || "",
  //     TransportId: showTransportDetails ? transportDetails || "" : "",
  //     FlightNO: flightNumber || "",
  //     AircraftRegNo: airCraftRegNumber || "",
  //     MasterAirwayBill: mawbNumber || "",
  //     ReleaseLocation: releaseCode || "",
  //     ResLoaName: releaseLocationDescription || "",
  //     RecepitLocation: receiptCode || "",
  //     RecepitLocName: receiptLocationDescription || "",
  //     StorageLocation: storageCode || "",
  //     BlanketStartDate: formatDate(blanketStartDate) || null,
  //     ExhibitionSDate: formatDate(exhibitionStartDate) || null,
  //     ExhibitionEDate: formatDate(exhibitionEndDate) || null,
  //     DepartureDate: formatDate(departureDate) || null,
  //     DischargePort: dischargePortCode || "",
  //     FinalDestinationCountry: finalDestinationCountry || "",
  //     OutVoyageNumber: outVoyageNumber || "",
  //     OutVesselName: outVesselName || "",
  //     OutOceanBillofLadingNo: outObl || "",
  //     VesselType: vesselType || "",
  //     VesselNetRegTon: vesselNetRegisterTonnage || "",
  //     VesselNationality: vesselNationality || "",
  //     TowingVesselID: towingVesselId || "",
  //     TowingVesselName: towingVesselName || "",
  //     NextPort: nextPortCode || "",
  //     LastPort: lastPortCode || "",
  //     OutConveyanceRefNo: outConveyanceNumber || "",
  //     OutTransportId: outTransportDetails || "",
  //     OutFlightNO: outFlightNumber || "",
  //     OutAircraftRegNo: outAirCraftRegNumber || "",
  //     OutMasterAirwayBill: outMawbNumber || "",
  //     TotalOuterPack: totalOuterPackValue || "",
  //     TotalOuterPackUOM: totalOuterPackName || "",
  //     TotalGrossWeight: totalGrossWeight || "",
  //     TotalGrossWeightUOM: grossUOM || "",
  //     ReleaseLocaName: "",
  //     INHAWB: cargoHawb || "",
  //     outHAWB: outCargoHawb || "",
  //     seastore: outSeaStore ? "Y" : "N",
  //     // Summary / Remarks
  //     GrossReference: summaryCrossReference || "",
  //     TradeRemarks: summaryRemarks || "",
  //     InternalRemarks: summaryInternalReamarks || "",
  //     CustomerRemarks: "",
  //     DeclareIndicator: declarationChecked ? "Y" : "N",

  //     // Totals
  //     NumberOfItems: toDecimal(itemTable.length),
  //     TotalCIFFOBValue: toDecimal(totalItemCifValue),
  //     TotalGSTTaxAmt: toDecimal(totalItemGstAmount),
  //     TotalExDutyAmt: toDecimal(sumOfExciseDutyAmount),
  //     TotalCusDutyAmt: toDecimal(sumOfCustomsDutyAmount),
  //     TotalODutyAmt: toDecimal(sumOfOtherTaxAmount),
  //     TotalAmtPay: toDecimal(totalAmountPayable),

  //     // Status & Touch
  //     Status: "NEW",
  //     TouchUser: touchUser,
  //     TouchTime: touchTime,
  //     PermitNumber: PermitNumber,
  //     prmtStatus: PermitStatus,

  //     // Other
  //     Cnb: cnBChecked ? "Y" : "N",
  //     DeclarningFor: declFor || "--Select--",
  //     MRDate: formatDate(summaryDate) || null,
  //     MRTime: summaryTime || "",
  //   };

  //   // ── Step 6: API Calls ──────────────────────────────────────────────
  //   try {
  //     console.log("SENDING HEADER:", headerPayload);
  //     await saveAllContainers(touchUser, touchTime);
  //     // 6a. Save CPC — only if CPC rows exist
  //     if (cpcData.length > 0) {
  //       await API.post("/postCpcTable/", cpcData);
  //     }
  //     // 6b. Save Header
  //     await API.post("/postCommonHeaderTable/", headerPayload);

  //     alert("Permit Saved Successfully!");
  //     navigate("/out");
  //   } catch (err) {
  //     if (err.response) {
  //       console.error("Save Error:", err.response.data);
  //       alert(
  //         `Database Error: ${err.response.data.error || "Check console for details"}`,
  //       );
  //     } else {
  //       console.error("Network Error:", err.message);
  //       alert("Network Error: Could not reach the server.");
  //     }
  //   }
  // };

  const handleSavePermit = async () => {
    // ── Step 1: Validate ───────────────────────────────────────────────
    const { isValid, errors } = runValidation();
    if (!isValid) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    // ── Step 2: Check only filled party codes against master tables ────
    const missing = [];

    try {
      // -- EXPORTER (always shown in out module) --
      if (exporterCode && exporterCode.trim() !== "") {
        const res = await API.get("/getCommonExporterTableInfo/");
        const exists = res.data.some(
          (i) =>
            String(i.Code).toLowerCase() === exporterCode.trim().toLowerCase(),
        );
        if (!exists)
          missing.push({ label: "EXPORTER", code: exporterCode.trim() });
      }

      // -- IMPORTER (only if filled) --
      if (importerCode && importerCode.trim() !== "") {
        const res = await API.get("/getCommonImporterTableInfo/");
        const exists = res.data.some(
          (i) =>
            String(i.Code).toLowerCase() === importerCode.trim().toLowerCase(),
        );
        if (!exists)
          missing.push({ label: "IMPORTER", code: importerCode.trim() });
      }

      // -- INWARD CARRIER AGENT (only if filled) --
      if (inwardCode && inwardCode.trim() !== "") {
        const res = await API.get("/getCommonInwardCarrierAgentTableInfo/");
        const exists = res.data.some(
          (i) =>
            String(i.Code).toLowerCase() === inwardCode.trim().toLowerCase(),
        );
        if (!exists)
          missing.push({
            label: "INWARD CARRIER AGENT",
            code: inwardCode.trim(),
          });
      }

      // -- OUTWARD CARRIER AGENT (only if filled) --
      if (outwardCode && outwardCode.trim() !== "") {
        const res = await API.get("/getCommonOutwardCarrierAgentTableInfo/");
        const exists = res.data.some(
          (i) =>
            String(i.Code).toLowerCase() === outwardCode.trim().toLowerCase(),
        );
        if (!exists)
          missing.push({
            label: "OUTWARD CARRIER AGENT",
            code: outwardCode.trim(),
          });
      }

      // -- FREIGHT FORWARDER (only if filled) --
      if (freightForwarderCode && freightForwarderCode.trim() !== "") {
        const res = await API.get("/getCommonFreightForwarderTable/");
        const exists = res.data.some(
          (i) =>
            String(i.Code).toLowerCase() ===
            freightForwarderCode.trim().toLowerCase(),
        );
        if (!exists)
          missing.push({
            label: "FREIGHT FORWARDER",
            code: freightForwarderCode.trim(),
          });
      }

      // -- CONSIGNEE (only if filled) --
      if (congineeCode && congineeCode.trim() !== "") {
        const res = await API.get("/getCommonConsigneeTableInfo/");
        const exists = res.data.some(
          (i) =>
            String(i.ConsigneeCode).toLowerCase() ===
            congineeCode.trim().toLowerCase(),
        );
        if (!exists)
          missing.push({ label: "CONSIGNEE", code: congineeCode.trim() });
      }

      // -- CLAIMANT PARTY (only if filled) --
      if (claimantCode && claimantCode.trim() !== "") {
        const res = await API.get("/getCommonClaimantPartyTable/");
        const exists = res.data.some(
          (i) =>
            String(i.ClaimantCode).toLowerCase() ===
            claimantCode.trim().toLowerCase(),
        );
        if (!exists)
          missing.push({ label: "CLAIMANT PARTY", code: claimantCode.trim() });
      }

      // -- END USER (only if filled) --
      if (endUserCode && endUserCode.trim() !== "") {
        const res = await API.get("/getCommonEndUserTableInfo/");
        const exists = res.data.some(
          (i) =>
            String(i.EndUserCode).toLowerCase() ===
            endUserCode.trim().toLowerCase(),
        );
        if (!exists)
          missing.push({ label: "END USER", code: endUserCode.trim() });
      }

      // -- MANUFACTURER (only if filled) --
      if (manufacturerCode && manufacturerCode.trim() !== "") {
        const res = await API.get("/getCommonManufacturerTableInfo/");
        const exists = res.data.some(
          (i) =>
            String(i.ManufacturerCode).toLowerCase() ===
            manufacturerCode.trim().toLowerCase(),
        );
        if (!exists)
          missing.push({
            label: "MANUFACTURER",
            code: manufacturerCode.trim(),
          });
      }
    } catch (err) {
      console.error("Failed to verify party codes in master tables:", err);
      // If the check itself fails, don't block the save
    }

    if (missing.length > 0) {
      setMissingPartyCodes(missing);
      setShowPartyNotSavedModal(true);
      return;
    }

    // ── Step 3: All checks passed — save permit ────────────────────────
    await doSavePermit();
  };

  // const doSavePermit = async () => {
  //   const touchUser = (user?.username || "").toUpperCase();
  //   const touchTime = new Date().toISOString();

  //   let PermitStatus = "NEW";
  //   let PermitNumber = permitDetails?.PermitNumber || "";
  //   if (PermitNumber === "None" || PermitNumber === "NONE") PermitNumber = "";

  //   //   // Wire when Refund/Cancel/Amend tabs ready:
  //   //   // if (refundUpdateIndicator === "RFD") { PermitStatus = "RFD"; PermitNumber = refundPermitNumber; }
  //   //   // if (cancelUpdateIndicator === "CNL") { PermitStatus = "CNL"; PermitNumber = cancelPermitNumber; }
  //   //   // if (amendUpdateIndicator === "AME") { PermitStatus = "AME"; PermitNumber = amendPermitNumber; }

  //   const cpcData = prepareCpcData();

  //   const headerPayload = {
  //     Refid: toBigInt(permitDetails?.RefId),
  //     JobId: permitDetails?.JobId || "",
  //     MSGId: permitDetails?.MsgId || "",
  //     PermitId: (permitDetails?.PermitId || "").toUpperCase(),
  //     TradeNetMailboxID: permitDetails?.MailBoxId || "",
  //     MessageType: "OUTDEC",
  //     DeclarationType: decType || "",
  //     PreviousPermit: prevPermitNo || "",
  //     CargoPackType: cargo || "",
  //     InwardTransportMode: transportMode || "",
  //     OutwardTransportMode: outTransportMode || "",
  //     COType: coType || "",
  //     BGIndicator: bgInd || "",
  //     SupplyIndicator: supplyInd ? "Y" : "N",
  //     ReferenceDocuments: refDocs ? "Y" : "N",
  //     License: Licence || "",
  //     Recipient: Recipients || "",
  //     CerDetailtype1: certificateType1 || "",
  //     CerDetailCopies1: certificateCopy1 || "",
  //     CerDetailtype2: certificateType2 || "",
  //     CerDetailCopies2: certificateCopy2 || "",
  //     CurrencyCode: currencyCode || "",
  //     TransDtl: transportDetailsHeader || "",
  //     AddCerDtl: additionalCertificateDetails || "",
  //     DeclarantCompanyCode: permitDetails?.DeclarantCode || "",
  //     ImporterCompanyCode: importerCode || "",
  //     ExporterCompanyCode: exporterCode || "",
  //     InwardCarrierAgentCode: inwardCode || "",
  //     OutwardCarrierAgentCode: outwardCode || "",
  //     CONSIGNEECode: congineeCode || "",
  //     FreightForwarderCode: freightForwarderCode || "",
  //     ClaimantPartyCode: claimantCode || "",
  //     EndUserCode: endUserCode || "",
  //     Manufacturer: manufacturerCode || "",
  //     ArrivalDate: formatDate(arrivalDate) || null,
  //     LoadingPortCode: loadingPortCode || "",
  //     VoyageNumber: voyageNumber || "",
  //     VesselName: vesselName || "",
  //     OceanBillofLadingNo: obl || "",
  //     ConveyanceRefNo: conveyanceNumber || "",
  //     TransportId: showTransportDetails ? transportDetails || "" : "",
  //     FlightNO: flightNumber || "",
  //     AircraftRegNo: airCraftRegNumber || "",
  //     MasterAirwayBill: mawbNumber || "",
  //     ReleaseLocation: releaseCode || "",
  //     ResLoaName: releaseLocationDescription || "",
  //     RecepitLocation: receiptCode || "",
  //     RecepitLocName: receiptLocationDescription || "",
  //     StorageLocation: storageCode || "",
  //     BlanketStartDate: formatDate(blanketStartDate) || null,
  //     ExhibitionSDate: formatDate(exhibitionStartDate) || null,
  //     ExhibitionEDate: formatDate(exhibitionEndDate) || null,
  //     DepartureDate: formatDate(departureDate) || null,
  //     DischargePort: dischargePortCode || "",
  //     FinalDestinationCountry: finalDestinationCountry || "",
  //     OutVoyageNumber: outVoyageNumber || "",
  //     OutVesselName: outVesselName || "",
  //     OutOceanBillofLadingNo: outObl || "",
  //     VesselType: vesselType || "",
  //     VesselNetRegTon: vesselNetRegisterTonnage || "",
  //     VesselNationality: vesselNationality || "",
  //     TowingVesselID: towingVesselId || "",
  //     TowingVesselName: towingVesselName || "",
  //     NextPort: nextPortCode || "",
  //     LastPort: lastPortCode || "",
  //     OutConveyanceRefNo: outConveyanceNumber || "",
  //     OutTransportId: outTransportDetails || "",
  //     OutFlightNO: outFlightNumber || "",
  //     OutAircraftRegNo: outAirCraftRegNumber || "",
  //     OutMasterAirwayBill: outMawbNumber || "",
  //     TotalOuterPack: totalOuterPackValue || "",
  //     TotalOuterPackUOM: totalOuterPackName || "",
  //     TotalGrossWeight: totalGrossWeight || "",
  //     TotalGrossWeightUOM: grossUOM || "",
  //     ReleaseLocaName: "",
  //     INHAWB: cargoHawb || "",
  //     outHAWB: outCargoHawb || "",
  //     seastore: outSeaStore ? "Y" : "N",
  //     GrossReference: summaryCrossReference || "",
  //     TradeRemarks: summaryRemarks || "",
  //     InternalRemarks: summaryInternalReamarks || "",
  //     CustomerRemarks: "",
  //     DeclareIndicator: declarationChecked ? "Y" : "N",
  //     NumberOfItems: toDecimal(itemTable.length),
  //     TotalCIFFOBValue: toDecimal(totalItemCifValue),
  //     TotalGSTTaxAmt: toDecimal(totalItemGstAmount),
  //     TotalExDutyAmt: toDecimal(sumOfExciseDutyAmount),
  //     TotalCusDutyAmt: toDecimal(sumOfCustomsDutyAmount),
  //     TotalODutyAmt: toDecimal(sumOfOtherTaxAmount),
  //     TotalAmtPay: toDecimal(totalAmountPayable),
  //     Status: "NEW",
  //     TouchUser: touchUser,
  //     TouchTime: touchTime,
  //     PermitNumber: PermitNumber,
  //     prmtStatus: PermitStatus,
  //     Cnb: cnBChecked ? "Y" : "N",
  //     DeclarningFor: declFor || "--Select--",
  //     MRDate: formatDate(summaryDate) || null,
  //     MRTime: summaryTime || "",
  //   };

  //   try {
  //     console.log("SENDING HEADER:", headerPayload);
  //     await saveAllContainers(touchUser, touchTime);
  //     if (cpcData.length > 0) {
  //       await API.post("/postCpcTable/", cpcData);
  //     }
  //     await API.post("/postCommonHeaderTable/", headerPayload);
  //     alert("Permit Saved Successfully!");
  //     navigate("/out");
  //   } catch (err) {
  //     if (err.response) {
  //       console.error("Save Error:", err.response.data);
  //       alert(
  //         `Database Error: ${err.response.data.error || "Check console for details"}`,
  //       );
  //     } else {
  //       console.error("Network Error:", err.message);
  //       alert("Network Error: Could not reach the server.");
  //     }
  //   }
  // };

  const doSavePermit = async () => {
    const touchUser = (user?.username || "").toUpperCase();
    const touchTime = new Date().toISOString();

    let PermitStatus = "NEW";
    let PermitNumber = permitDetails?.PermitNumber || "";
    if (PermitNumber === "None" || PermitNumber === "NONE") PermitNumber = "";

    //   // Wire when Refund/Cancel/Amend tabs ready:
    //   // if (refundUpdateIndicator === "RFD") { PermitStatus = "RFD"; PermitNumber = refundPermitNumber; }
    //   // if (cancelUpdateIndicator === "CNL") { PermitStatus = "CNL"; PermitNumber = cancelPermitNumber; }
    //   // if (amendUpdateIndicator === "AME") { PermitStatus = "AME"; PermitNumber = amendPermitNumber; }

    const cpcData = prepareCpcData();

    const headerPayload = {
      Refid: toBigInt(permitDetails?.RefId),
      JobId: permitDetails?.JobId || "",
      MSGId: permitDetails?.MsgId || "",
      PermitId: (permitDetails?.PermitId || "").toUpperCase(),
      TradeNetMailboxID: permitDetails?.MailBoxId || "",
      MessageType: "OUTDEC",
      DeclarationType: decType || "",
      PreviousPermit: prevPermitNo || "",
      CargoPackType: cargo || "",
      InwardTransportMode: transportMode || "",
      OutwardTransportMode: outTransportMode || "",
      COType: coType || "",
      BGIndicator: bgInd || "",
      SupplyIndicator: supplyInd ? "Y" : "N",
      ReferenceDocuments: refDocs ? "Y" : "N",
      License: Licence || "",
      Recipient: Recipients || "",
      CerDetailtype1: certificateType1 || "",
      CerDetailCopies1: certificateCopy1 || "",
      CerDetailtype2: certificateType2 || "",
      CerDetailCopies2: certificateCopy2 || "",
      CurrencyCode: currencyCode || "",
      TransDtl: transportDetailsHeader || "",
      AddCerDtl: additionalCertificateDetails || "",
      DeclarantCompanyCode: permitDetails?.Code || "",
      ImporterCompanyCode: importerCode || "",
      ExporterCompanyCode: exporterCode || "",
      InwardCarrierAgentCode: inwardCode || "",
      OutwardCarrierAgentCode: outwardCode || "",
      CONSIGNEECode: congineeCode || "",
      FreightForwarderCode: freightForwarderCode || "",
      ClaimantPartyCode: claimantCode || "",
      EndUserCode: endUserCode || "",
      Manufacturer: manufacturerCode || "",
      ArrivalDate: formatDate(arrivalDate) || null,
      LoadingPortCode: loadingPortCode || "",
      VoyageNumber: voyageNumber || "",
      VesselName: vesselName || "",
      OceanBillofLadingNo: obl || "",
      ConveyanceRefNo: conveyanceNumber || "",
      TransportId: showTransportDetails ? transportDetails || "" : "",
      FlightNO: flightNumber || "",
      AircraftRegNo: airCraftRegNumber || "",
      MasterAirwayBill: mawbNumber || "",
      ReleaseLocation: releaseCode || "",
      ResLoaName: releaseLocationDescription || "",
      RecepitLocation: receiptCode || "",
      RecepitLocName: receiptLocationDescription || "",
      StorageLocation: storageCode || "",
      BlanketStartDate: formatDate(blanketStartDate) || null,
      ExhibitionSDate: formatDate(exhibitionStartDate) || null,
      ExhibitionEDate: formatDate(exhibitionEndDate) || null,
      DepartureDate: formatDate(departureDate) || null,
      DischargePort: dischargePortCode || "",
      FinalDestinationCountry: finalDestinationCountry || "",
      OutVoyageNumber: outVoyageNumber || "",
      OutVesselName: outVesselName || "",
      OutOceanBillofLadingNo: outObl || "",
      VesselType: vesselType || "",
      VesselNetRegTon: vesselNetRegisterTonnage || "",
      VesselNationality: vesselNationality || "",
      TowingVesselID: towingVesselId || "",
      TowingVesselName: towingVesselName || "",
      NextPort: nextPortCode || "",
      LastPort: lastPortCode || "",
      OutConveyanceRefNo: outConveyanceNumber || "",
      OutTransportId: outTransportDetails || "",
      OutFlightNO: outFlightNumber || "",
      OutAircraftRegNo: outAirCraftRegNumber || "",
      OutMasterAirwayBill: outMawbNumber || "",
      TotalOuterPack: totalOuterPackValue || "",
      TotalOuterPackUOM: totalOuterPackName || "",
      // TotalGrossWeight: totalGrossWeight || "",
      TotalGrossWeight:
        permitGrossWeight !== "" && permitGrossWeight !== undefined
          ? permitGrossWeight
          : totalGrossWeight || "",
      TotalGrossWeightUOM: grossUOM || "",
      ReleaseLocaName: "",
      INHAWB: cargoHawb || "",
      outHAWB: outCargoHawb || "",
      seastore: outSeaStore ? "Y" : "N",
      GrossReference: summaryCrossReference || "",
      TradeRemarks: summaryRemarks || "",
      InternalRemarks: summaryInternalReamarks || "",
      CustomerRemarks: "",
      DeclareIndicator: declarationChecked ? "Y" : "N",
      NumberOfItems: toDecimal(itemTable.length),
      TotalCIFFOBValue: toDecimal(totalItemCifValue),
      TotalGSTTaxAmt: toDecimal(totalItemGstAmount),
      TotalExDutyAmt: toDecimal(sumOfExciseDutyAmount),
      TotalCusDutyAmt: toDecimal(sumOfCustomsDutyAmount),
      TotalODutyAmt: toDecimal(sumOfOtherTaxAmount),
      TotalAmtPay: toDecimal(totalAmountPayable),
      Status: "NEW",
      TouchUser: touchUser,
      TouchTime: touchTime,
      PermitNumber: PermitNumber,
      prmtStatus: PermitStatus,
      Cnb: cnBChecked ? "Y" : "N",
      DeclarningFor: declFor || "--Select--",
      MRDate: formatDate(summaryDate) || null,
      MRTime: summaryTime || "",
    };

    let commonSaved = false;
    setIsSavingPermit(true);
    try {
      console.log("SENDING HEADER:", headerPayload);
      const permitIdForCpc = (permitDetails?.PermitId || "").toUpperCase();

      await saveAllContainers(touchUser, touchTime);

      // if (cpcData.length > 0) {
      await API.post(`/postCpcTable/?PermitId=${permitIdForCpc}`, cpcData);
      // }
      await API.post("/postCommonHeaderTable/", headerPayload);
      commonSaved = true;

      // ── Mirror to Innon (InNonHeaderTbl / InNonCPCDtl) ────────────────────
      try {
        // if (cpcData.length > 0) {
        await API.post(
          `out/postOutCpcTable/?PermitId=${permitIdForCpc}`,
          cpcData,
        );
        // }
        await API.post("out/postOutHeaderTable/", headerPayload);
      } catch (mirrorErr) {
        console.error("Mirror header save failed", mirrorErr);
        alert(
          "Warning: Permit was saved to CommonHeaderTbl but FAILED to mirror to InNonHeaderTbl. " +
            "Please contact support or retry.\n\n" +
            `Error: ${mirrorErr.response?.data?.error || mirrorErr.message}`,
        );
        return;
      }

      // alert("Permit Saved Successfully!");
      navigate("/out");
    } catch (err) {
      if (err.response) {
        console.error("Save Error:", err.response.data);
        alert(
          `Database Error: ${err.response.data.error || "Check console for details"}`,
        );
      } else {
        console.error("Network Error:", err.message);
        alert("Network Error: Could not reach the server.");
      }
    } finally {
      setIsSavingPermit(false);
    }
  };
  // ── Total Error Count for Modal Badge ───────────────────────────────────
  const totalErrorCount = Object.values(validationErrors).flat().length;

  // ════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════════════

  //  ===============SAVE AS DRAFT MODEL =====================
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftReason, setDraftReason] = useState("");
  const [draftReasonError, setDraftReasonError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formatDraftDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === "") return null;
    const parts = dateStr.split("/");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

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

      // ── Step 1: Save CPC rows first ──
      const cpcData = prepareCpcData();
      if (cpcData.length > 0) {
        await API.post("/postCpcTable/", cpcData);
      }

      // ── Step 2: Save header as draft ──
      const headerPayload = {
        // Header
        PermitId: permitDetails?.PermitId || "",
        Refid: permitDetails?.RefId || "",
        JobId: permitDetails?.JobId || "",
        MSGId: permitDetails?.MsgId || "",
        TradeNetMailboxID:
          permitDetails?.TradeNetMailboxID || permitDetails?.MailBoxId || "",
        MessageType: "OUTDEC",
        DeclarationType: decType || "",
        PreviousPermit: prevPermitNo || "",
        CargoPackType: cargo || "",
        InwardTransportMode: transportMode || "",
        OutwardTransportMode: outTransportMode || "",
        COType: coType || "",

        BGIndicator: bgInd || "",
        SupplyIndicator: supplyInd ? "true" : "false",
        ReferenceDocuments: refDocs ? "true" : "false",
        DeclarningFor: declFor || "--Select--",
        License: Licence || "",
        Recipient: Recipients || "",
        CerDetailtype1: certificateType1 || "",
        CerDetailCopies1: certificateCopy1 || "",
        CerDetailtype2: certificateType2 || "",
        CerDetailCopies2: certificateCopy2 || "",
        CurrencyCode: currencyCode || "",
        TransDtl: transportDetailsHeader || "",
        AddCerDtl: additionalCertificateDetails || "",
        // Party
        DeclarantCompanyCode: permitDetails?.Code || "",
        ExporterCompanyCode: exporterCode || "",
        ImporterCompanyCode: importerCode || "",
        InwardCarrierAgentCode: inwardCode || "",
        OutwardCarrierAgentCode: outwardCode || "",
        FreightForwarderCode: freightForwarderCode || "",
        CONSIGNEECode: congineeCode || "",
        ClaimantPartyCode: claimantCode || "",
        EndUserCode: endUserCode || "",
        Manufacturer: manufacturerCode || "",
        // Cargo
        HBL: cargoHawb || "",
        ArrivalDate: formatDraftDate(arrivalDate) || null,
        LoadingPortCode: loadingPortCode || "",
        VoyageNumber: showVoyageNumber ? voyageNumber || "" : "",
        VesselName: showVesselName ? vesselName || "" : "",
        OceanBillofLadingNo: showOblNumber ? obl || "" : "",
        ConveyanceRefNo: showconveyanceNumber ? conveyanceNumber || "" : "",
        TransportId: showTransportDetails ? transportDetails || "" : "",
        FlightNO: showFlightNumber ? flightNumber || "" : "",
        AircraftRegNo: showAirCraftRegNumber ? airCraftRegNumber || "" : "",
        MasterAirwayBill: showMawbNumber ? mawbNumber || "" : "",
        ReleaseLocation: releaseCode || "",
        RecepitLocation: receiptCode || "",
        StorageLocation: storageCode || "",
        ResLoaName: releaseLocationDescription || "",
        RecepitLocName: receiptLocationDescription || "",
        BlanketStartDate: formatDraftDate(blanketStartDate) || null,
        DepartureDate: formatDraftDate(departureDate) || null,
        DischargePort: dischargePortCode || "",
        FinalDestinationCountry: finalDestinationCountry || "",
        OutVoyageNumber: outVoyageNumber || "",
        OutVesselName: outVesselName || "",
        OutOceanBillofLadingNo: outObl || "",
        VesselType: vesselType || "",
        VesselNetRegTon: vesselNetRegisterTonnage || "",
        VesselNationality: vesselNationality || "",
        TowingVesselID: towingVesselId || "",
        TowingVesselName: towingVesselName || "",
        NextPort: nextPortCode || "",
        LastPort: lastPortCode || "",
        OutConveyanceRefNo: outConveyanceNumber || "",
        OutTransportId: outTransportDetails || "",
        OutFlightNO: outFlightNumber || "",
        OutAircraftRegNo: outAirCraftRegNumber || "",
        OutMasterAirwayBill: outMawbNumber || "",

        TotalOuterPack: totalOuterPackValue || "",
        TotalOuterPackUOM: totalOuterPackName || "",
        // TotalGrossWeight: totalGrossWeight || "",
        TotalGrossWeight:
          permitGrossWeight !== "" && permitGrossWeight !== undefined
            ? permitGrossWeight
            : totalGrossWeight || "",
        TotalGrossWeightUOM: grossUOM || "",

        //  Summary
        GrossReference: summaryCrossReference || "",
        TradeRemarks: summaryRemarks || "",
        Message: draftReason.trim().toUpperCase(),
        CustomerRemarks: "",
        DeclareIndicator: declarationChecked ? "Y" : "N",
        Status: "SAVEASDRF",
        prmtStatus: "SAVEASDRF",
        TouchUser,
        TouchTime,
        MRDate: null,
        MRTime: "",
      };

      const response = await API.post("/postCommonHeaderTable/", [
        headerPayload,
      ]);

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
      alert("❌ Error saving draft. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // =====================Auto save every filling Details==============================

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
  //     // party fields
  //     DeclarantCompanyCode: permitDetails?.DeclarantCode || "",
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
  //     //  summary page
  //     GrossReference: summaryCrossReference || "",
  //     TradeRemarks: summaryRemarks || "",
  //     InternalRemarks: summaryInternalReamarks || "",
  //     CustomerRemarks: "",
  //     DeclareIndicator: declarationChecked ? "Y" : "N",
  //     DeclarningForSummary: summaryDeclaringFor || "",

  //     NumberOfItems: toDecimal(itemTable.length),
  //     TotalCIFFOBValue: toDecimal(totalItemCifValue),
  //     TotalGSTTaxAmt: toDecimal(totalItemGstAmount),
  //     TotalExDutyAmt: toDecimal(sumOfExciseDutyAmount),
  //     TotalCusDutyAmt: toDecimal(sumOfCustomsDutyAmount),
  //     TotalODutyAmt: toDecimal(sumOfOtherTaxAmount),
  //     TotalAmtPay: toDecimal(totalAmountPayable),

  //     // reamining
  //     Status: "DISCONNECT",
  //     prmtStatus: "DISCONNECT",
  //     TouchUser: (user?.username || "").toUpperCase(),
  //     TouchTime: new Date().toISOString(),
  //     Message: "AUTO-SAVED|TAB:SummaryPage",
  //     MRDate: formatDate(summaryDate) || null,
  //     MRTime: summaryTime || "",
  //   };
  // }, [
  //   permitDetails,
  //   // Header
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
  //   // Party
  //   importerCode,
  //   inwardCode,
  //   freightForwarderCode,
  //   claimantCode,
  //   // Transport visibility flags
  //   showVoyageNumber,
  //   showVesselName,
  //   showOblNumber,
  //   showconveyanceNumber,
  //   showTransportDetails,
  //   showFlightNumber,
  //   showAirCraftRegNumber,
  //   showMawbNumber,
  //   // Transport values
  //   voyageNumber,
  //   vesselName,
  //   obl,
  //   conveyanceNumber,
  //   transportDetails,
  //   flightNumber,
  //   airCraftRegNumber,
  //   mawbNumber,
  //   // Cargo
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
  //   // Summary (NEW additions)
  //   summaryCrossReference,
  //   summaryRemarks,
  //   summaryInternalReamarks,
  //   declarationChecked,
  //   summaryDeclaringFor,
  //   summaryDate,
  //   summaryTime,
  //   // Computed totals (NEW additions)
  //   totalItemCifValue,
  //   totalItemGstAmount,
  //   sumOfExciseDutyAmount,
  //   sumOfCustomsDutyAmount,
  //   sumOfOtherTaxAmount,
  //   totalAmountPayable,
  //   itemTable,
  //   // User
  //   user,
  // ]);

  // useDebounceAutoSave({
  //   payload: autoSavePayload,
  //   enabled: !isViewMode,
  //   delay: 2000,
  // });

  // Safe number formatter — handles string, undefined, null, NaN
  const money = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // ====================UI============================
  return (
    <div className="row g-2">
      {/* ── VALIDATION MODAL ───────────────────────────────────────────── */}
      {showValidationModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowValidationModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              width: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h5 style={{ margin: 0, color: "#131313", fontWeight: "bold" }}>
                VALIDATION ERRORS ({totalErrorCount})
              </h5>
              <button
                onClick={() => setShowValidationModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            {/* Error Sections */}
            {[
              { key: "header", label: "HEADER" },
              { key: "party", label: "PARTY" },
              { key: "cargo", label: "CARGO" },
              { key: "invoice", label: "INVOICE" },
              { key: "item", label: "ITEM" },
              { key: "summary", label: "SUMMARY" },
            ].map(({ key, label }) =>
              validationErrors[key].length > 0 ? (
                <div key={key} style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      background: "#fc240c",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      marginBottom: "4px",
                    }}
                  >
                    {label}
                  </div>
                  {validationErrors[key].map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "6px 12px",
                        background: "#fdf0f0",
                        borderLeft: "3px solid #c0392b",
                        marginBottom: "4px",
                        fontSize: "0.85rem",
                        color: "#333",
                      }}
                    >
                      {label} ➜ {msg}
                    </div>
                  ))}
                </div>
              ) : null,
            )}

            {/* Close Button */}
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <button
                className="NextpageBtns"
                onClick={() => setShowValidationModal(false)}
              >
                CLOSE & FIX ERRORS
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="col-12">
        {/* ── NO OF INVOICES ROW ──────────────────────────────────────── */}
        <div className="row align-items-center compact-row">
          <div className="col-2">NO OF INVOICES</div>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={invoiceTable.length}
              readOnly
            />
          </div>
          <label className="col-sm-2 col-form-label">NO OF ITEMS</label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={itemTable.length}
              readOnly
            />
          </div>
          {/* <label className="col-sm-1 col-form-label">SUM OF ITEM VALUE</label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={totalItemValue.toFixed(2)}
              readOnly
            />
          </div> */}
          <label className="col-sm-2 col-form-label">
            TOTAL INVOICE CIF VALUE
          </label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={money(totalInvoiceCifValue)}
              readOnly
            />
          </div>
        </div>

        {/* ── TOTAL CIF/FOB VALUE ROW ─────────────────────────────────── */}
        <div className="row align-items-center compact-row">
          <div className="col-2">TOTAL CIF/FOB VALUE</div>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={money(totalItemCifValue)}
              readOnly
            />
          </div>
          <label className="col-sm-2 col-form-label">
            SUM OF INVOICE AMOUNT
          </label>
          <div className="col-sm-2">
            {(result.length > 0 ? result : [{}]).map((inv, index) => (
              <div className="row mb-1" key={index}>
                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    value={inv.TICurrency || ""}
                    readOnly
                  />
                </div>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    value={money(inv.TIAmount) || ""}
                    readOnly
                  />
                </div>
              </div>
            ))}
          </div>
          <label className="col-sm-2 col-form-label">SUM OF ITEM AMOUNT</label>
          <div className="col-sm-2">
            {(itemResult.length > 0 ? itemResult : [{}]).map((item, index) => (
              <div className="row mb-1" key={index}>
                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    value={item.UnitPriceCurrency || ""}
                    readOnly
                  />
                </div>
                <div className="col-sm-7">
                  <input
                    type="text"
                    className="form-control"
                    value={money(item.TotalLineAmount) || ""}
                    readOnly
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CIF MISMATCH WARNING ─────────────────────────────────────── */}
        <div className="row align-items-center compact-row">
          <div className="col-3"></div>
          <div className="col-6">
            {showCifMatchingError && (
              <span style={{ color: "red", fontWeight: "bold" }}>
                THE TOTAL ITEM CIF/FOB VALUE DOES NOT EQUAL WITH TOTAL INVOICE
                CIF VALUE
              </span>
            )}
          </div>
          <div className="col-3"></div>
        </div>

        {/* ── TRADER REMARKS ───────────────────────────────────────────── */}
        <div className="row align-items-center compact-row mt-1">
          <div className="col-1">TRADER REMARKS</div>
          <div className="col-sm-2">
            <button
              type="button"
              className="ButtonClick SaveContainer"
              onClick={showPermitFunction}
              tabIndex={1}
            >
              PREV PERMIT NUMBER
            </button>
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              className="ButtonClick SaveContainer"
              onClick={showExRate}
              tabIndex={2}
            >
              EX. RATE
            </button>
          </div>
          <label className="col-sm-1 col-form-label">FORMAT REMARKS</label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={formatRemark}
              tabIndex={3}
              onChange={(e) => setFormatRemark(e.target.value)}
            />
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              className="ButtonClick SaveContainer"
              onClick={summaryConfigBtnFunction}
              tabIndex={4}
            >
              CONFIG
            </button>
          </div>
          <label className="col-sm-1 col-form-label">CROSS REFERENCE</label>
          <div className="col-sm-3">
            <input
              type="text"
              tabIndex={5}
              className="form-control"
              value={summaryCrossReference}
              onChange={(e) => setSummaryCrossReference(e.target.value)}
            />
          </div>
        </div>

        {/* ── REMARKS TEXTAREA ─────────────────────────────────────────── */}
        <div className="row align-items-center compact-row">
          <div className="col-sm-12">
            <textarea
              className="form-control summary-remarks-textarea"
              value={summaryRemarks}
              tabIndex={6}
              onChange={(e) => setSummaryRemarks(e.target.value)}
            />
          </div>
        </div>

        {/* ── INTERNAL REMARKS / MRD / TIME LABELS ────────────────────── */}
        <div className="row align-items-center compact-row">
          <div className="col-sm-6">INTERNAL REMARKS</div>
          {/* <div className="col-sm-3">MRD</div>
          <div className="col-sm-3">TIME</div> */}
          {fieldConfig.showDeclaringFor && (
            <div className="col-sm-6">CONFIRM DECLARING FOR</div>
          )}
        </div>

        {/* ── INTERNAL REMARKS / MRD / TIME INPUTS ────────────────────── */}
        <div className="row align-items-center compact-row">
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control"
              value={summaryInternalReamarks}
              tabIndex={7}
              onChange={(e) => setSummaryInternalRemarks(e.target.value)}
            />
          </div>
          {/* <div className="col-sm-3">
            <DateField value={summaryDate} setValue={setSummaryDate} />
          </div>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              placeholder="TIME"
              value={summaryTime}
              onChange={(e) => setSummaryTime(e.target.value)}
              onBlur={(e) => handleTimeBlur(e.target.value)}
            />
          </div> */}
          {fieldConfig.showDeclaringFor && (
            <div className="col-sm-4">
              <select
                className="Dropdown HighLight mandatory"
                value={summaryDeclaringFor}
                tabIndex={8}
                onChange={(e) => setSummaryDeclaringFor(e.target.value)}
         
              >
                <option value="">--Select--</option>

                {summaryDeclaringFor &&
                  !declaringFor.find((d) => d.Name === summaryDeclaringFor) && (
                    <option value={summaryDeclaringFor}>
                      {summaryDeclaringFor}
                    </option>
                  )}
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
          )}
        </div>

        {/* ── DECLARATION SUMMARY HEADER ───────────────────────────────── */}
        <div className="row align-items-center compact-row mt-1">
          <div className="col-sm-8 border-bottom pb-1 full-width-title">
            DECLARATION SUMMARY
          </div>
        </div>

        {/* ── DECLARATION SUMMARY BODY ─────────────────────────────────── */}
        <div className="col-12">
          <div className="row mt-1">
            <div className="col-6">
              <div className="row">
                <div className="col-6">EXPORTER</div>
                <div className="col-6">
                  {exporterCruei}-{exporterName}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row"></div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="col-6">IN MAWB/OBL</div>
                <div className="col-6">{mawbNumber}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-6">IN HAWB/HBL</div>
                <div className="col-6">{cargoHawb.toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="col-6">OUT MAWB/OBL</div>
                <div className="col-6">{outMawbNumber.toUpperCase()}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-6">OUT HAWB/OBL</div>
                <div className="col-6">{outCargoHawb.toUpperCase()}</div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="col-6">NO OF PACKING</div>
                <div className="col-6">
                  {totalOuterPackValue}-{totalOuterPackName}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-6">GROSS WEIGHT</div>
                <div className="col-6">
                  {totalGrossWeight}-{grossUOM}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="col-6">INVOICE AMOUNT</div>
                <div className="col-6">
                  {result.map((inv, index) => (
                    <div key={index}>
                      {inv.TICurrency} : {inv.TIAmount.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-6"></div>
          </div>
        </div>

        {/* ── DECLARATION CHECKBOX ─────────────────────────────────────── */}
        <div className="row">
          <div className="col-12">
            <div className="summarycheck row mt">
              <div className="col-1 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={declarationChecked}
                  tabIndex={9}
                  onChange={(e) => setDeclarationChecked(e.target.checked)}
                />
              </div>
              <div className="col-8">
                I/WE DECLARE THAT ALL PARTICULARS IN THIS APPLICATION ARE TRUE
                AND CORRECT
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BUTTONS ───────────────────────────────────────────────── */}
      {/* <div className="mt-3 d-flex justify-content-center gap-3">
        <button className="NextpageBtns view-nav-btn" onClick={() => setActiveTab("CpcTab")}>
          PREVIOUS
        </button>

        {permitDetails?.prmtStatus === "AMD" ? (
          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("AmendTab")}
          >
            NEXT
          </button>
        ) : permitDetails?.prmtStatus === "CNL" ? (
          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("CancelTab")}
          >
            NEXT
          </button>
        ):permitDetails?.prmtStatus === "RFD" ? (
          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("RefundTab")}
          >
            NEXT
          </button>
        )
         : (
          <button className="NextpageBtns" onClick={handleSavePermit}>
            SUBMIT
          </button>
        )}
      </div> */}
      <div className="mt-3 d-flex justify-content-center gap-3">
        <button
          className="NextpageBtns view-nav-btn"
       
          id="PartySaveDraft"
          onClick={handleSaveAsDraftClick}
        >
          SAVE AS DRAFT
        </button>
        <button
          className="NextpageBtns view-nav-btn"
          onClick={() => setActiveTab("CpcTab")}
        >
          PREVIOUS
        </button>

        {isViewMode ? (
          // View mode: if AMD/CNL/RFD go to that tab, otherwise CLOSE
          permitDetails?.prmtStatus === "AMD" ? (
            <button
              className="NextpageBtns view-nav-btn"
              onClick={() => setActiveTab("AmendTab")}
            >
              NEXT
            </button>
          ) : permitDetails?.prmtStatus === "CNL" ? (
            <button
              className="NextpageBtns view-nav-btn"
              onClick={() => setActiveTab("CancelTab")}
            >
              NEXT
            </button>
          ) : permitDetails?.prmtStatus === "RFD" ? (
            <button
              className="NextpageBtns view-nav-btn"
              onClick={() => setActiveTab("RefundTab")}
            >
              NEXT
            </button>
          ) : (
            <button
              className="NextpageBtns view-nav-btn"
              onClick={() => window.close()}
            >
              CLOSE
            </button>
          )
        ) : // Edit mode
        permitDetails?.prmtStatus === "AMD" ? (
          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("AmendTab")}
          >
            NEXT
          </button>
        ) : permitDetails?.prmtStatus === "CNL" ? (
          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("CancelTab")}
          >
            NEXT
          </button>
        ) : permitDetails?.prmtStatus === "RFD" ? (
          <button
            className="NextpageBtns"
            onClick={() => setActiveTab("RefundTab")}
          >
            NEXT
          </button>
        ) : (
          <button className="NextpageBtns" tabIndex={10} onClick={handleSavePermit}>
            SAVE
          </button>
        )}
      </div>

      {/* ── PARTY CODES NOT SAVED IN MASTER TABLE MODAL ──────────────────── */}
      {showPartyNotSavedModal && (
        <>
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
            onClick={() => setShowPartyNotSavedModal(false)}
          />
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
              width: "500px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#c0392b",
                color: "#fff",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                ⚠ PARTY CODE(S) NOT SAVED IN MASTER TABLE
              </span>
              <span
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                onClick={() => setShowPartyNotSavedModal(false)}
              >
                ✕
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px" }}>
              <div
                style={{
                  backgroundColor: "#fdf0f0",
                  border: "1px solid #e74c3c",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "#922b21",
                  marginBottom: "16px",
                  lineHeight: "1.6",
                }}
              >
                The following code(s) are filled but{" "}
                <strong>not yet saved</strong> in their master tables. Please go
                to the <strong>PARTY</strong> tab, click the{" "}
                <strong>+ (Plus)</strong> button next to each field to save
                them, then come back and click <strong>SAVE</strong> again.
              </div>

              <table
                style={{
                  width: "100%",
                  fontSize: "13px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f5b7b1" }}>
                    <th
                      style={{
                        padding: "7px 10px",
                        textAlign: "left",
                        border: "1px solid #e74c3c",
                        color: "#922b21",
                      }}
                    >
                      PARTY FIELD
                    </th>
                    <th
                      style={{
                        padding: "7px 10px",
                        textAlign: "left",
                        border: "1px solid #e74c3c",
                        color: "#922b21",
                      }}
                    >
                      CODE ENTERED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {missingPartyCodes.map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#fff" : "#fdf2f2",
                      }}
                    >
                      <td
                        style={{
                          padding: "7px 10px",
                          border: "1px solid #fadbd8",
                          fontWeight: "600",
                        }}
                      >
                        {item.label}
                      </td>
                      <td
                        style={{
                          padding: "7px 10px",
                          border: "1px solid #fadbd8",
                          color: "#c0392b",
                          fontWeight: "bold",
                        }}
                      >
                        {item.code}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 24px 20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                className="NextpageBtns"
                onClick={() => setShowPartyNotSavedModal(false)}
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
                CLOSE
              </button>
              <button
                className="NextpageBtns"
                onClick={() => {
                  setShowPartyNotSavedModal(false);
                  setActiveTab("PartyTab"); // ← match your exact tab key
                }}
                style={{
                  backgroundColor: "#c0392b",
                  color: "#fff",
                  border: "none",
                  padding: "7px 20px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                GO TO PARTY PAGE →
              </button>
            </div>
          </div>
        </>
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
      {isSavingPermit && (
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
          <CircleLoader size={60} color="#35e00b" loading={isSavingPermit} />
          <div
            style={{
              marginTop: "16px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#165f03",
            }}
          >
            SAVING PERMIT...
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;
