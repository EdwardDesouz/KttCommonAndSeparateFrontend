import { createContext, useContext, useState, useEffect } from "react";

const InpaymentContext = createContext();

export const InpaymentProvider = ({ children }) => {
  // Permit Details
  const [permitDetails, setPermitDetails] = useState({
    PermitId: "",
    JobId: "",
    MsgId: "",
    RefId: "",
    AccountId: "",
    LoginStatus: "",
    DateLastUpdated: "",
    MailBoxId: "",
    SeqPool: "",
    StartSequence: "",
    TradeNetMailboxID: "",
    DeclarantName: "",
    DeclarantCode: "",
    DeclarantTel: "",
    CRUEI: "",
    Code: "",
    name: "",
    name1: "",
    PermitNumber: "",
    prmtStatus: "",
    CurrentDate: "",
    prmtStatus: "NEW",
  });
  const updatePermitDetails = (newDetails) => {
    setPermitDetails((prev) => ({
      ...prev,
      ...(typeof newDetails === "function" ? newDetails(prev) : newDetails),
    }));
  };
  // HEADER PAGE STATES
  const [decType, setDecType] = useState("");
  const [prevPermitNo, setPrevPermitNo] = useState("");
  const [showPermit, setShowPermit] = useState(false);
  const [cargo, setCargo] = useState("");
  const [transportMode, setTransportMode] = useState("");
  const [declFor, setDeclFor] = useState("");
  const [bgInd, setBgInd] = useState("");
  const [overrideEx, setOverrideEx] = useState(false);
  const [supplyInd, setSupplyInd] = useState(false);
  const [refDocs, setRefDocs] = useState(false);
  const [licence1, setLicence1] = useState("");
  const [licence2, setLicence2] = useState("");
  const [licence3, setLicence3] = useState("");
  const [licence4, setLicence4] = useState("");
  const [licence5, setLicence5] = useState("");
  const [recipients1, setRecipients1] = useState("");
  const [recipients2, setRecipients2] = useState("");
  const [recipients3, setRecipients3] = useState("");
  const Licence = [licence1, licence2, licence3, licence4, licence5]
    .filter((val) => val && val.trim() !== "")
    .join(",");
  const Recipients = [recipients1, recipients2, recipients3]
    .filter((val) => val && val.trim() !== "")
    .join(",");
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // Header Page Errors
  const [showDeclarationTypeError, setShowDeclarationTypeError] =
    useState(false);
  const [showCargoPackTypeError, setShowCargoPackTypeError] = useState(false);
  const [showDeclaringForError, setShowDeclaringForError] = useState(false);
  const [showInwardTransportError, setShowInwardTransportError] =
    useState(false);
  // PARTY PAGE IMPORTER STATES
  const [importerCode, setImporterCode] = useState("");
  const [importerCruei, setImporterCruei] = useState("");
  const [showImporterCrueiError, setShowImporterCrueiError] = useState(false);
  const [importerName, setImporterName] = useState("");
  const [showImporterNameError, setShowImporterNameError] = useState(false);
  const [importerName1, setImporterName1] = useState("");
  // PARTY PAGE INWARD CARRIER STATES
  const [inwardCode, setInwardCode] = useState("");
  const [inwardCruei, setInwardCruei] = useState("");
  const [showInwardCrueiError, setShowInwardCrueiError] = useState(false);
  const [inwardName, setInwardName] = useState("");
  const [showInwardNameError, setShowInwardNameError] = useState(false);
  const [inwardName1, setInwardName1] = useState("");
  //PARTY PAGE FRIEGHT FORWARDER STATES
  const [freightForwarderCode, setFreightForwarderCode] = useState("");
  const [freightForwarderCruei, setFreightForwarderCruei] = useState("");
  const [freightForwardName, setFreightForwarderName] = useState("");
  const [freightForwardName1, setFreightForwarderName1] = useState("");
  // PARTY PAGE CLAIMANT STATES
  const [claimantCode, setClaimantCode] = useState("");
  const [claimantCruei, setClaimantCruei] = useState("");
  const [claimantName, setClaimantName] = useState("");
  const [claimantName1, setClaimantName1] = useState("");
  // HEADER PAGE FUNCTION FOR DECLARATION TYPE SELECTION
  const [showInwardTransport, setShowInwardTransport] = useState(true);
  const [showClaimantPartyShow, setShowClaimantPartyShow] = useState(false);
  // HEADER PAGE CARGO TYPE SELECTION
  const [showCargoType, setShowCargoType] = useState(false);
  // Cargo Type Selection
  const [inwardTransport, setInwardTransport] = useState("");
  // cargo page UI section
  const [showVoyageNumber, setShowVoyageNumber] = useState(false);
  const [showVesselName, setShowVesselName] = useState(false);
  const [showFlightNumber, setShowFlightNumber] = useState(false);
  const [showAirCraftRegNumber, setShowAirCraftRegNumber] = useState(false);
  const [showMawbNumber, setShowMawbNumber] = useState(false);
  const [showOblNumber, setShowOblNumber] = useState(false);
  const [showconveyanceNumber, setShowconveyanceNumber] = useState(false);
  const [showTransportDetails, setShowTransportDetails] = useState(false);
  const [showNotRequired, setShowNotRequired] = useState(true);
  // cargo page states
  const [totalOuterPackValue, setTotalOuterPackValue] = useState("");
  const [showTotalOuterPackValueError, setShowTotalOuterPackValueError] =
    useState(false);
  const [totalOuterPackName, setTotalOuterPackName] = useState("");
  const [showTotalOuterPackUomError, setShowTotalOuterPackUomError] =
    useState(false);
  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [showTotalGrossWeightError, setShowTotalGrossWeightError] =
    useState(false);
  const [grossUOM, setGrossUOM] = useState("");
  const [showGrossUOMError, setShowGrossUOMError] = useState(false);
  const [showCargoSeaGrossWeightError, setShowCargoSeaGrossWeightError] =
    useState(false);
  const [permitGrossWeight, setPermitGrossWeight] = useState("");
  const [receiptCode, setReceiptCode] = useState("");
  const [showReceiptCodeError, setShowReceiptCodeError] = useState(false);
  const [receiptLocationDescription, setReceiptLocationDescription] =
    useState("");
  const [releaseCode, setReleaseCode] = useState("");
  const [showReleaseCodeError, setShowReleaseCodeError] = useState(false);
  const [releaseLocationDescription, setReleaseLocationDescription] =
    useState("");
  const [loadingPortCode, setLoadingPortCode] = useState("");
  const [showLoadingPortCodeError, setShowLoadingPortCodeError] =
    useState(false);
  const [loadingPortName, setLoadingPortName] = useState("");
  const [cargoHawb, setCargoHawb] = useState("");
  const [cargoHawbList, setCargoHawbList] = useState([]);
  const [arrivalDate, setArrivalDate] = useState("");
  const [showArriavalDateError, setShowArrivalDateError] = useState(false);
  const [blanketStartDate, setBlanketStartDate] = useState("");
  const [voyageNumber, setVoyageNumber] = useState("");
  const [vesselName, setVesselName] = useState("");
  const [obl, setObl] = useState("");
  const [conveyanceNumber, setConveyanceNumber] = useState("");
  const [transportDetails, setTransportDetails] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [airCraftRegNumber, setAirCraftRegNumber] = useState("");
  const [mawbNumber, setMawbNumber] = useState("");
  const [showHawbDuplicateError, setShowHawbDuplicateError] = useState(false);
  const [hawbDuplicateMessage, setHawbDuplicateMessage] = useState("Duplicate HBL/HAWB Found");
  // Container
  const [containers, setContainers] = useState([
    {
      id: 1,
      number: "",
      sizeType: "",
      weight: "",
      seal: "",
      isSaved: false,
      isChecked: false,
    },
  ]);
  // Invoice page
  const [invoiceTable, setInvoiceTable] = useState([]);
  const [invoiceImporterCode, setInvoiceImporterCode] = useState("");
  const [invoiceImporterCruei, setInvoiceImporterCruei] = useState("");
  const [invoiceImporterName, setInvoiceImporterName] = useState("");
  const [invoiceImporterName1, setInvoiceImporterName1] = useState("");
  const [invoiceSerialNumber, setInvoiceSerialNumber] = useState(1);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [adValoremIndicator, setAdValoremIndicator] = useState("False");
  const [preDutyRateIndicator, setPreDutyRateIndicator] = useState("False");
  const [invoiceInsurance, setInvoiceInsurance] = useState("False");
  const [supplierRelationship, setSupplierRelationship] = useState("");
  const [termTypeSelected, setTermTypeSelected] = useState("");
  const [showFreightRow, setShowFreightRow] = useState(true);
  const [showInsuranceRow, setShowInsuranceRow] = useState(true);
  const [supplierManuFacturer, setSupplierManuFacturer] = useState(null);
  const [supplierManuFacturerCode, setSupplierManuFacturerCode] = useState("-");
  const [supplierManuFacturerCruei, setSupplierManuFacturerCruei] =
    useState("-");
  const [supplierManuFacturerName, setSupplierManuFacturerName] = useState("-");
  const [supplierManuFacturerName1, setSupplierManuFacturerName1] =
    useState("-");
  const [invoiceCurrency, setInvoiceCurrency] = useState("");
  const [invoiceExRate, setInvoiceExRate] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDollar, setInvoiceDollar] = useState("");
  const [otherValueCharges, setOtherValueCharges] = useState("");
  const [otherValueCurrency, setOtherValueCurrency] = useState("");
  const [otherValueExRate, setOtherValueExRate] = useState("");
  const [otherValueAmount, setOtherValueAmount] = useState("");
  const [otherValueDollar, setOtherValueDollar] = useState("");
  const [freightValueCharges, setFreightValueCharges] = useState("");
  const [freightValueCurrency, setFreightValueCurrency] = useState("");
  const [freightValueExRate, setFreightValueExRate] = useState("");
  const [freightValueAmount, setFreightValueAmount] = useState("");
  const [freightValueDollar, setFreightValueDollar] = useState("");
  const [insuranceCharges, setInsuranceCharges] = useState("");
  const [insuranceValueCurrency, setInsuranceValueCurrency] = useState("");
  const [insuranceValueExRate, setInsuranceValueExRate] = useState("");
  const [insuranceValueAmount, setInsuranceValueAmount] = useState("");
  const [insuranceValueDollar, setInsuranceValueDollar] = useState("");
  const [cifTotal, setCifTotal] = useState("0.00");
  const [gstCharge, setGstCharge] = useState(9);
  const [gstTotal, setGstTotal] = useState("0.00");
  // Item page
  const [hawbList, setHawbList] = useState([]);
  const [itemTable, setItemTable] = useState([]);
  const [makingLot, setMakingLot] = useState([]);
  const [itemSerialNumber, setItemSerialNumber] = useState(1);
  const [hawb, setHawb] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [hsCodeDescription, setHsCodeDescription] = useState("");
  const [hsCodeRow, setHsCodeRow] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [countryDescription, setCountryDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [dgIndicator, setDgIndicator] = useState(false);
  const [unbranded, setUnbranded] = useState(false);
  const [invoiceQuantity, setInvoiceQuantity] = useState("");
  const [hsQuantity, setHsQuantity] = useState("");
  const [hsUom, setHsUom] = useState("--Select--");
  const [duitableQuantity, setDuitableQuantity] = useState("");
  const [duitableQuantityUom, setDuitableQuantityUom] = useState("");
  const [totalDuitableQuantity, setTotalDuitableQuantity] = useState("");
  const [totalDuitableQuantityUom, setTotalDuitableQuantityUom] = useState("");
  const [alcoholPercentage, setAlcoholPercentage] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [invoiceCurrencyItem, setInvoiceCurrencyItem] = useState("");
  const [invoiceExRateItem, setInvoiceExRateItem] = useState("");
  const [unitPrice, setUnitPrice] = useState(0.0);
  const [sumExchangeRate, setSumExchangeRate] = useState(0.0);
  const [totalLineAmount, setTotalLineAmount] = useState("");
  const [totalInvoiceCharge, setTotalInvoiceCharge] = useState("");
  const [cifFob, setCifFob] = useState("");
  const [exciseDutyRate, setExciseDutyRate] = useState("");
  const [exciseDutyUom, setExciseDutyUom] = useState("");
  const [exciseDutyAmount, setExciseDutyAmount] = useState("");
  const [customsDutyRate, setCustomsDutyRate] = useState("");
  const [customsDutyUom, setCustomsDutyUom] = useState("");
  const [customsDutyAmount, setCustomsDutyAmount] = useState("");
  const [otherTaxRate, setOtherTaxRate] = useState("");
  const [otherTaxUom, setOtherTaxUom] = useState("");
  const [otherTaxAmount, setOtherTaxAmount] = useState("");
  const [gstRateValue, setGstRateValue] = useState(9);
  const [gstUom, setGstUom] = useState("PER");
  const [gstSum, setGstSum] = useState("");
  const [lastSellingPrice, setLastSellingPrice] = useState("");
  const [preferentialCode, setPreferentialCode] = useState("");
  const [packingChecked, setPackingChecked] = useState(false);
  const [outerPackQuantity, setOuterPackQuantity] = useState("");
  const [outerPackQuantityUom, setOuterPackQuantityUom] = useState("");
  const [inPackQuantity, setInPackQuantity] = useState("");
  const [inPackQuantityUom, setInPackQuantityUom] = useState("");
  const [innerPackQuantity, setInnerPackQuantity] = useState("");
  const [innerPackQuantityUom, setInnerPackQuantityUom] = useState("");
  const [immostPackQuantity, setImmostPackQuantity] = useState("");
  const [immostPackQuantityUom, setImmostPackQuantityUom] = useState("");
  const [showFreightRowItem, setShowFreightRowItem] = useState(true);
  const [showInsuranceRowItem, setShowInsuranceRowItem] = useState(true);
  const [showPacking, setShowPacking] = useState(false);
  const [showAlcohol, setShowAlcholPercentage] = useState(false);
  const [showDutiableQuantity, setShowDutiableQuantity] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [showOptionalCharges, setShowOptionalCharges] = useState(false);
  const [showItemCasc, setShowItemCasc] = useState(false);
  const [itemCascChecked, setItemCascChecked] = useState(false);
  const [showShippingMarks, setShowShippingMarks] = useState(false);
  const [showLotId, setShowLotId] = useState(false);
  const [showUnitPriceVal, setShowUnitPriceVal] = useState(false);
  const defaultItemCasc = [
    { code: "", hsQuantity: 0, uom: "", casc: [["", "", ""]], CascId: "Casc1" },
    { code: "", hsQuantity: 0, uom: "", casc: [["", "", ""]], CascId: "Casc2" },
    { code: "", hsQuantity: 0, uom: "", casc: [["", "", ""]], CascId: "Casc3" },
  ];
  const [itemCasc, setItemCasc] = useState(defaultItemCasc);
  const [currentLot, setCurrentLot] = useState("");
  const [making, setMaking] = useState("");
  const [previousLot, setPreviousLot] = useState("");
  const [shippingMarks1, setShippingMarks1] = useState("");
  const [shippingMarks2, setShippingMarks2] = useState("");
  const [shippingMarks3, setShippingMarks3] = useState("");
  const [shippingMarks4, setShippingMarks4] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [engineCapacityValue, setEngineCapcityValue] = useState("");
  const [engineCapacityUom, setEngineCapacityUom] = useState("");
  const [originalRegistrationDate, setOriginalRegistrationDate] = useState("");
  const [optionalCharges, setOptionalCharges] = useState("");
  const [optionlAmount, setOptionalAmount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [dutyTypeId, setDutyTypeId] = useState("");
  const [kgmVisible, setKgmVisible] = useState("");
  const [correctUom, setCorrectUom] = useState("");

  // Cpc Page
  const [showAeo, setShowAeo] = useState(false);
  const [showCwc, setShowCwc] = useState(false);
  const [cnBChecked, setCnBChecked] = useState(false);
  const [showScheme, setShowScheme] = useState(false);
  const [aeoRows, setAeoRows] = useState([
    { ProcessingCode1: "", ProcessingCode2: "", ProcessingCode3: "" },
  ]);
  const [cwcRows, setCwcRows] = useState([
    { ProcessingCode1: "", ProcessingCode2: "", ProcessingCode3: "" },
  ]);
  const [schemeRows, setSchemeRows] = useState([
    { ProcessingCode1: "", ProcessingCode2: "", ProcessingCode3: "" },
  ]);
  // Summary Page
  const [summaryApprovedBy, setSummaryApprovedBy] = useState("");
  const [summaryCustomerRemarks, setSummaryCustomerRemarks] = useState("");
  const [summaryDeclaringFor, setSummaryDeclaringFor] = useState("");
  const [summaryImporterCruei, setSummaryImporterCruei] = useState("");
  const [summaryImporterName, setSummaryImporterName] = useState("");
  const [totalAmountPayable, setTotalAmountPayable] = useState("");
  const [showCifMatchingError, setShowCifMatchingError] = useState(false);
  const [summaryRemarks, setSummaryRemarks] = useState("");
  const [formatRemark, setFormatRemark] = useState("");
  const [summaryCrossReference, setSummaryCrossReference] = useState("");
  const [summaryInternalReamarks, setSummaryInternalRemarks] = useState("");
  const [summaryDate, setSummaryDate] = useState("");
  const [summaryTime, setSummaryTime] = useState("");
  const [declarationChecked, setDeclarationChecked] = useState(false);
  return (
    <InpaymentContext.Provider
      value={{
        // Permit Details
        permitDetails,
        setPermitDetails,
        updatePermitDetails,
        // HEADER PAGE STATES
        decType,
        setDecType,
        prevPermitNo,
        setPrevPermitNo,
        showPermit,
        setShowPermit,
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
        uploadedFiles,
        setUploadedFiles,
        selectedFile,
        setSelectedFile,
        documentType,
        setDocumentType,
        showDeclarationTypeError,
        setShowDeclarationTypeError,
        showCargoPackTypeError,
        setShowCargoPackTypeError,
        showDeclaringForError,
        setShowDeclaringForError,
        setShowInwardTransportError,
        showInwardTransportError,
        // PARTY PAGE STATES IMPORTER
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
        // PARTY PAGE STATES INWARD CARRIER
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
        // PARTY PAGE STATES FREIGHT FORWARDER
        freightForwarderCode,
        setFreightForwarderCode,
        freightForwarderCruei,
        setFreightForwarderCruei,
        freightForwardName,
        setFreightForwarderName,
        freightForwardName1,
        setFreightForwarderName1,
        // PARTY PAGE STATES CLAIMANT
        claimantCode,
        setClaimantCode,
        claimantCruei,
        setClaimantCruei,
        claimantName,
        setClaimantName,
        claimantName1,
        setClaimantName1,
        // HEADER PAGE FUNCTION FOR DECLARATION TYPE SELECTION
        showInwardTransport,
        setShowInwardTransport,
        showClaimantPartyShow,
        setShowClaimantPartyShow,
        // HEADER PAGE FUNCTION FOR CARGO TYPE SELECTION
        showCargoType,
        setShowCargoType,
        // Cargo Type Selection
        inwardTransport,
        setInwardTransport,
        // Cargo Page UI Section
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
        // cargo page states
        totalOuterPackValue,
        setTotalOuterPackValue,
        showTotalOuterPackValueError,
        setShowTotalOuterPackValueError,
        totalOuterPackName,
        setTotalOuterPackName,
        showTotalOuterPackUomError,
        setShowTotalOuterPackUomError,
        totalGrossWeight,
        setTotalGrossWeight,
        grossUOM,
        setGrossUOM,
        showTotalGrossWeightError,
        setShowTotalGrossWeightError,
        showGrossUOMError,
        setShowGrossUOMError,
        showCargoSeaGrossWeightError,
        setShowCargoSeaGrossWeightError,
        permitGrossWeight,
        setPermitGrossWeight,
        receiptCode,
        setReceiptCode,
        showReceiptCodeError,
        setShowReceiptCodeError,
        receiptLocationDescription,
        setReceiptLocationDescription,
        releaseCode,
        setReleaseCode,
        showReleaseCodeError,
        setShowReleaseCodeError,
        releaseLocationDescription,
        setReleaseLocationDescription,
        loadingPortCode,
        setLoadingPortCode,
        showLoadingPortCodeError,
        setShowLoadingPortCodeError,
        loadingPortName,
        setLoadingPortName,
        cargoHawb,
        setCargoHawb,
        cargoHawbList,
        setCargoHawbList,
        arrivalDate,
        setArrivalDate,
        showArriavalDateError,
        setShowArrivalDateError,
        blanketStartDate,
        setBlanketStartDate,
        voyageNumber,
        setVoyageNumber,
        vesselName,
        setVesselName,
        obl,
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
        containers,
        setContainers,
        showHawbDuplicateError,
        setShowHawbDuplicateError,
        hawbDuplicateMessage,
        setHawbDuplicateMessage,
        // Invoice
        invoiceTable,
        setInvoiceTable,
        invoiceImporterCode,
        setInvoiceImporterCode,
        invoiceImporterCruei,
        setInvoiceImporterCruei,
        invoiceImporterName,
        setInvoiceImporterName,
        invoiceImporterName1,
        setInvoiceImporterName1,
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
        // Item page
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
        // Cpc Page
        showAeo,
        setShowAeo,
        showCwc,
        setShowCwc,
        cnBChecked,
        setCnBChecked,
        showScheme,
        setShowScheme,
        aeoRows,
        setAeoRows,
        cwcRows,
        setCwcRows,
        schemeRows,
        setSchemeRows,
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
        summaryApprovedBy,
        setSummaryApprovedBy,
        summaryCustomerRemarks,
        setSummaryCustomerRemarks,
      }}
    >
      {children}
    </InpaymentContext.Provider>
  );
};

export const useInpayment = () => useContext(InpaymentContext);
