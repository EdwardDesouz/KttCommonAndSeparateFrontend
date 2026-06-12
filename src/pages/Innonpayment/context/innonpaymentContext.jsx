import { createContext, useContext, useState, useEffect } from "react";

const InnonpaymentContext = createContext();

export const InnonpaymentProvider = ({ children }) => {
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
  const [outTransportMode, setOutTransportMode] = useState("");
  const [cargoOutwardTransportMode, setCargoOutwardTransportMode] =
    useState("");
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
  const [showOutwardTransportError, setShowOutwardTransportError] =
    useState(false);
  // PARTY PAGE IMPORTER STATES
  const [importerCode, setImporterCode] = useState("");
  const [importerCruei, setImporterCruei] = useState("");
  const [showImporterCrueiError, setShowImporterCrueiError] = useState(false);
  const [importerName, setImporterName] = useState("");
  const [showImporterNameError, setShowImporterNameError] = useState(false);
  const [importerName1, setImporterName1] = useState("");
  // PARTY PAGE EXPORTER STATES
  const [showExporter, setShowExporter] = useState(false);
  const [exporterCode, setExporterCode] = useState("");
  const [exporterCruei, setExporterCruei] = useState("");
  const [showExporterCrueiError, setShowExporterCrueiError] = useState(false);
  const [exporterName, setExporterName] = useState("");
  const [showExporterNameError, setShowExporterNameError] = useState(false);
  const [exporterName1, setExporterName1] = useState("");

  // PARTY PAGE INWARD CARRIER STATES
  const [inwardCode, setInwardCode] = useState("");
  const [inwardCruei, setInwardCruei] = useState("");
  const [showInwardCrueiError, setShowInwardCrueiError] = useState(false);
  const [inwardName, setInwardName] = useState("");
  const [showInwardNameError, setShowInwardNameError] = useState(false);
  const [inwardName1, setInwardName1] = useState("");
  // PARTY PAGE OUTWARD CARRIER STATES
  const [showOutwardCarrier, setShowOutwardCarrier] = useState(false);
  const [outwardCode, setOutwardCode] = useState("");
  const [outwardCruei, setOutwardCruei] = useState("");
  const [outwardName, setOutwardName] = useState("");
  const [outwardName1, setOutwardName1] = useState("");
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
  // PARTY PAGE CONGINEE STATES
  const [congineeCode, setCongineeCode] = useState("");
  const [congineeCruei, setCongineeCruei] = useState("");
  const [congineeName, setCongineeName] = useState("");
  const [congineeName1, setCongineeName1] = useState("");
  const [congineeAddress, setCongineeAddress] = useState("");
  const [congineeAddress1, setCongineeAddress1] = useState("");
  const [congineeCity, setCongineeCity] = useState("");
  const [congineeSubCode, setCongineeSubCode] = useState("");
  const [congineeSubDivision, setCongineeSubDivision] = useState("");
  const [congineePostal, setCongineePostel] = useState("");
  const [congineeCountryCode, setCongineeCountryCode] = useState("");
  // HEADER PAGE FUNCTION FOR DECLARATION TYPE SELECTION
  const [showInwardTransport, setShowInwardTransport] = useState(true);
  const [showOutwardTransport, setShowOutwardTransport] = useState(false);
  const [showClaimantPartyShow, setShowClaimantPartyShow] = useState(false);
  const [showCongineeShow, setShowCongineeShow] = useState(true);
  // HEADER PAGE CARGO TYPE SELECTION
  const [showCargoType, setShowCargoType] = useState(false);
  // Cargo Type Selection
  const [inwardTransport, setInwardTransport] = useState("");
  const [storageCode, setStorageCode] = useState("");
  const [storageLocationDescription, setStorageLocationDescription] =
    useState("");
  // cargo page UI section
  const [showInwardMode, setShowInwardMode] = useState(true);
  const [showInHawbInward, setShowInHawbInward] = useState(true);
  const [showInWardDetails, setShowInWardDetails] = useState(true);
  const [showOutWardDetails, setShowOutWardDetails] = useState(false);
  const [showstorageLocation, setShowStorageLocation] = useState(true);
  const [showExhibition, setShowExhibition] = useState(false);
  const [showExhibitionStartDate, setShowExhibitionStartDate] = useState(false);
  const [showExhibitionEndDate, setShowExhibitionEndDate] = useState(false);
  const [showLoadingPort, setShowLoadingPort] = useState(true);
  const [showVoyageNumber, setShowVoyageNumber] = useState(false);
  const [showVesselName, setShowVesselName] = useState(false);
  const [showFlightNumber, setShowFlightNumber] = useState(false);
  const [showAirCraftRegNumber, setShowAirCraftRegNumber] = useState(false);
  const [showMawbNumber, setShowMawbNumber] = useState(false);
  const [showOblNumber, setShowOblNumber] = useState(false);
  const [showconveyanceNumber, setShowconveyanceNumber] = useState(false);
  const [showTransportDetails, setShowTransportDetails] = useState(false);
  const [showNotRequired, setShowNotRequired] = useState(true);

  // Outward visibility states — ADD THESE to innonpaymentContext.jsx
  const [showOutVoyage, setShowOutVoyage] = useState(false);
  const [showOutVesselName, setShowOutVesselName] = useState(false);
  const [showOutObl, setShowOutObl] = useState(false);
  const [showOutHblHawb, setShowOutHblHawb] = useState(false);
  const [showOutConveyance, setShowOutConveyance] = useState(false);
  const [showOutTransportId, setShowOutTransportId] = useState(false);
  const [showOutFlightNumber, setShowOutFlightNumber] = useState(false);
  const [outSeaStore, setOutSeaStore] = useState(false);
  const [showOutAircraftReg, setShowOutAircraftReg] = useState(false);
  const [showOutMawb, setShowOutMawb] = useState(false);
  const [showOutConveyanceNumber, setShowOutConveyanceNumber] = useState(false);
  const [showOutTransportDetails, setShowOutTransportDetails] = useState(false);
  const [showVesselType, setShowVesselType] = useState(false);
  const [showVesselNetRegister, setShowVesselNetRegister] = useState(false);
  const [showVesselNationality, setShowVesselNationality] = useState(false);
  const [showTowingVesselId, setShowTowingVesselId] = useState(false);
  const [showTowingVesselName, setShowTowingVesselName] = useState(false);
  const [showNextPort, setShowNextPort] = useState(false);
  const [showLastPort, setShowLastPort] = useState(false);
  const [outHblHawbLabel, setOutHblHawbLabel] = useState("HAWB/HBL");
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
  const [grossUOM, setGrossUOM] = useState("--Select--");
  const [showGrossUOMError, setShowGrossUOMError] = useState(false);
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
  const[outCargoHawb, setOutCargoHawb] = useState("");
  const [outCargoHawbList, setOutCargoHawbList] = useState([]);
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
  // States needed (add to context)
  const [outwardMode, setOutwardMode] = useState("");
  const [dischargePortCode, setDischargePortCode] = useState("");
  const [dischargePortName, setDischargePortName] = useState("");
  const [finalDestinationCountry, setFinalDestinationCountry] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [showDepartureDateError, setShowDepartureDateError] = useState(false);
  const [seaStore, setSeaStore] = useState(false);
  // Outward transport-specific fields:
  const [outVoyageNumber, setOutVoyageNumber] = useState("");
  const [outVesselName, setOutVesselName] = useState("");
  const [outObl, setOutObl] = useState("");
  const [outHblHawb, setOutHblHawb] = useState("");
  const [outConveyanceNumber, setOutConveyanceNumber] = useState("");
  const [outTransportDetails, setOutTransportDetails] = useState("");
  const [outFlightNumber, setOutFlightNumber] = useState("");
  const [outAircraftRegNumber, setOutAircraftRegNumber] = useState("");
  const [outMawbNumber, setOutMawbNumber] = useState("");
  // Vessel details (Sea only)
  const [vesselType, setVesselType] = useState("");
  const [vesselNetRegisterTonnage, setVesselNetRegisterTonnage] = useState("");
  const [vesselNationality, setVesselNationality] = useState("");
  const [towingVesselId, setTowingVesselId] = useState("");
  const [towingVesselName, setTowingVesselName] = useState("");
  const [nextPortCode, setNextPortCode] = useState("");
  const [nextPortName, setNextPortName] = useState("");
  const [lastPortCode, setLastPortCode] = useState("");
  const [lastPortName, setLastPortName] = useState("");

  // Add to context
  const [showOutwardMode, setShowOutwardMode] = useState(false);
  const [showDischargePort, setShowDischargePort] = useState(true);
  const [showFinalDestination, setShowFinalDestination] = useState(true);
  const [showDepartureDate, setShowDepartureDateDiv] = useState(false);
  const [showSeaStore, setShowSeaStore] = useState(false);
  // Add to context
  const [exhibitionStartDate, setExhibitionStartDate] = useState("");
  const [exhibitionEndDate, setExhibitionEndDate] = useState("");
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
  const [supplierManuFacturerCode, setSupplierManuFacturerCode] = useState("");
  const [supplierManuFacturerCruei, setSupplierManuFacturerCruei] =
    useState("");
  const [supplierManuFacturerName, setSupplierManuFacturerName] = useState("");
  const [supplierManuFacturerName1, setSupplierManuFacturerName1] =
    useState("");
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
  const [showOutItemHawbHbl, setShowOutItemHawbHbl] = useState(false);
  const [itemTable, setItemTable] = useState([]);
  const [itemSerialNumber, setItemSerialNumber] = useState(1);
  const [hawb, setHawb] = useState("");
  const [outHawb, setOutHawb] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [hsCodeDescription, setHsCodeDescription] = useState("");
  const [hsCodeRow, setHsCodeRow] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [countryDescription, setCountryDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [dgIndicator, setDgIndicator] = useState(false);
  const [unbranded, setUnbranded] = useState(false);
  const [invoiceQuantity, setInvoiceQuantity] = useState("0.00");
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
  const [totalLineAmount, setTotalLineAmount] = useState(0.0);
  const [totalInvoiceCharge, setTotalInvoiceCharge] = useState(0.0);
  const [cifFob, setCifFob] = useState(0.0);
  const [exciseDutyRate, setExciseDutyRate] = useState(0.0);
  const [exciseDutyUom, setExciseDutyUom] = useState("");
  const [exciseDutyAmount, setExciseDutyAmount] = useState(0.0);
  const [customsDutyRate, setCustomsDutyRate] = useState(0.0);
  const [customsDutyUom, setCustomsDutyUom] = useState("");
  const [customsDutyAmount, setCustomsDutyAmount] = useState("");
  const [otherTaxRate, setOtherTaxRate] = useState(0.0);
  const [otherTaxUom, setOtherTaxUom] = useState("");
  const [otherTaxAmount, setOtherTaxAmount] = useState();
  const [gstRateValue, setGstRateValue] = useState(9);
  const [gstUom, setGstUom] = useState("PER");
  const [gstSum, setGstSum] = useState(0.0);
  const [lastSellingPrice, setLastSellingPrice] = useState(0.0);
  const [preferentialCode, setPreferentialCode] = useState("");
  const [packingChecked, setPackingChecked] = useState(false);
  const [outerPackQuantity, setOuterPackQuantity] = useState("0.00");
  const [outerPackQuantityUom, setOuterPackQuantityUom] = useState("");
  const [inPackQuantity, setInPackQuantity] = useState("0.00");
  const [inPackQuantityUom, setInPackQuantityUom] = useState("");
  const [innerPackQuantity, setInnerPackQuantity] = useState("0.00");
  const [innerPackQuantityUom, setInnerPackQuantityUom] = useState("");
  const [immostPackQuantity, setImmostPackQuantity] = useState("0.00");
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
  const [showUnitPriceVal, setShowUnitPriceVal] = useState(false);
  const defaultItemCasc = [
    { code: "", hsQuantity: 0, uom: "", casc: [["", "", ""]], CascId: "Casc1" },
    { code: "", hsQuantity: 0, uom: "", casc: [["", "", ""]], CascId: "Casc2" },
    { code: "", hsQuantity: 0, uom: "", casc: [["", "", ""]], CascId: "Casc3" },
  ];
  const [itemCasc, setItemCasc] = useState(defaultItemCasc);
  const [shippingMarks1, setShippingMarks1] = useState("");
  const [shippingMarks2, setShippingMarks2] = useState("");
  const [shippingMarks3, setShippingMarks3] = useState("");
  const [shippingMarks4, setShippingMarks4] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [engineCapacityValue, setEngineCapcityValue] = useState("");
  const [engineCapacityUom, setEngineCapacityUom] = useState("");
  const [originalRegistrationDate, setOriginalRegistrationDate] = useState("");
  const [optionalCharges, setOptionalCharges] = useState("0.00");
  const [optionlAmount, setOptionalAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [dutyTypeId, setDutyTypeId] = useState("");
  const [kgmVisible, setKgmVisible] = useState("");
  const [correctUom, setCorrectUom] = useState("");

  // Cpc Page
  const [showAeo, setShowAeo] = useState(false);
  const [showCwc, setShowCwc] = useState(false);
  const [showSeaStoreCpc, setShowSeaStoreCpc] = useState(false);
  const [cnBChecked, setCnBChecked] = useState(false);
  const [showScheme, setShowScheme] = useState(false);
  const [showInternationalPermitExchange, setShowInternationalPermitExchange] =
    useState(false);
  const [aeoRows, setAeoRows] = useState([
    { ProcessingCode1: "", ProcessingCode2: "", ProcessingCode3: "" },
  ]);
  const [cwcRows, setCwcRows] = useState([
    { ProcessingCode1: "", ProcessingCode2: "", ProcessingCode3: "" },
  ]);
  const [seaStoreRows, setSeaStoreRows] = useState([
    { ProcessingCode1: "", ProcessingCode2: "", ProcessingCode3: "" },
  ]);
  const [schemeRows, setSchemeRows] = useState([
    { ProcessingCode1: "", ProcessingCode2: "", ProcessingCode3: "" },
  ]);
  const [internationalPermitExchangeRows, setInternationalPermitExchangeRows] =
    useState([
      { ProcessingCode1: "", ProcessingCode2: "", ProcessingCode3: "" },
    ]);

  // Summary Page
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
    <InnonpaymentContext.Provider
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
        outTransportMode,
        setOutTransportMode,
        cargoOutwardTransportMode,
        setCargoOutwardTransportMode,
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
        showOutwardTransportError,
        setShowOutwardTransportError,
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
        // PARTY PAGE STATES EXPORTER
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
        // PARTY PAGE STATES OUTWARD CARRIER
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
        // PARTY PAGE STATES CONGINEE
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
        // HEADER PAGE FUNCTION FOR DECLARATION TYPE SELECTION
        showInwardTransport,
        setShowInwardTransport,
        showOutwardTransport,
        setShowOutwardTransport,
        showClaimantPartyShow,
        setShowClaimantPartyShow,
        showCongineeShow,
        setShowCongineeShow,
        // HEADER PAGE FUNCTION FOR CARGO TYPE SELECTION
        showCargoType,
        setShowCargoType,
        // Cargo Type Selection
        inwardTransport,
        setInwardTransport,
        // Cargo Page UI Section
        showInwardMode,
        setShowInwardMode,
        showInHawbInward,
        setShowInHawbInward,
        showstorageLocation,
        setShowStorageLocation,
        showInWardDetails,
        setShowInWardDetails,
        showOutWardDetails,
        setShowOutWardDetails,
        showExhibition,
        setShowExhibition,
        showExhibitionStartDate,
        setShowExhibitionStartDate,
        showExhibitionEndDate,
        setShowExhibitionEndDate,
        showLoadingPort,
        setShowLoadingPort,
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
        storageCode,
        setStorageCode,
        storageLocationDescription,
        setStorageLocationDescription,
        cargoHawb,
        setCargoHawb,
        cargoHawbList,
        setCargoHawbList,
        outCargoHawb,
        setOutCargoHawb,
        outCargoHawbList,
        setOutCargoHawbList,
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
        dischargePortCode,
        setDischargePortCode,
        dischargePortName,
        setDischargePortName,
        finalDestinationCountry,
        setFinalDestinationCountry,
        departureDate,
        setDepartureDate,
        showDepartureDateError,
        nextPortCode,
        setNextPortCode,
        nextPortName,
        setNextPortName,
        lastPortCode,
        setLastPortCode,
        lastPortName,
        setLastPortName,
        exhibitionStartDate,
        setExhibitionStartDate,
        exhibitionEndDate,
        setExhibitionEndDate,
        vesselNationality,
        setVesselNationality,
        towingVesselId,
        setTowingVesselId,
        towingVesselName,
        setTowingVesselName,
        containers,
        setContainers,
        // invoice
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
        showUnitPriceVal,
        setShowUnitPriceVal,
        itemCasc,
        setItemCasc,
        defaultItemCasc,
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
        showSeaStoreCpc,
        setShowSeaStoreCpc,
        cnBChecked,
        setCnBChecked,
        showScheme,
        setShowScheme,
        aeoRows,
        setAeoRows,
        cwcRows,
        setCwcRows,
        seaStoreRows,
        setSeaStoreRows,
        schemeRows,
        setSchemeRows,
        showInternationalPermitExchange,
        setShowInternationalPermitExchange,
        internationalPermitExchangeRows,
        setInternationalPermitExchangeRows,
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

        showOutVoyage,
        setShowOutVoyage,
        outVoyageNumber,
        setOutVoyageNumber,
        outVesselName,
        setOutVesselName,
        outObl,
        setOutObl,
        outHblHawb,
        setOutHblHawb,
        outConveyanceNumber,
        setOutConveyanceNumber,
        outTransportDetails,
        setOutTransportDetails,
        outFlightNumber,
        setOutFlightNumber,
        outAircraftRegNumber,
        setOutAircraftRegNumber,
        outMawbNumber,
        setOutMawbNumber,
        showDischargePort,
        setShowDischargePort,
        showFinalDestination,
        setShowFinalDestination,
        vesselType,
        setVesselType,
        showOutVesselName,
        vesselNetRegisterTonnage,
        setVesselNetRegisterTonnage,
        setShowOutVesselName,
        showOutObl,
        setShowOutObl,
        showOutHblHawb,
        setShowOutHblHawb,
        showOutConveyance,
        setShowOutConveyance,
        showOutTransportId,
        setShowOutTransportId,
        showOutFlightNumber,
        setShowOutFlightNumber,
        outSeaStore,
        setOutSeaStore,
        showOutAircraftReg,
        setShowOutAircraftReg,
        showOutMawb,
        setShowOutMawb,
        showOutConveyanceNumber,
        setShowOutConveyanceNumber,
        showOutTransportDetails,
        setShowOutTransportDetails,
        showVesselType,
        setShowVesselType,
        showVesselNetRegister,
        setShowVesselNetRegister,
        showVesselNationality,
        setShowVesselNationality,
        showTowingVesselId,
        setShowTowingVesselId,
        showTowingVesselName,
        setShowTowingVesselName,
        showNextPort,
        setShowNextPort,
        showLastPort,
        setShowLastPort,
        outHblHawbLabel,
        setOutHblHawbLabel,
      }}
    >
      {children}
    </InnonpaymentContext.Provider>
  );
};

export const useInnonpayment = () => useContext(InnonpaymentContext);
