import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useEffect, useState, useContext, useMemo } from "react";
import API from "../../../api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../userContex/userContex";
import { useOut } from "../context/outContext";
import { useDebounceAutoSave } from "../../../autoSave/useDebounceAutoSave";
import {
  currentPopup,
  fetchPopupData,
  SearchPopup,
  useCargoDate,
} from "./cargoFunctions";

// =================== DateField ===================
export const DateField = ({ value, setValue }) => {
  const { error, parseDate, handleBlur, handleKeyDown } = useCargoDate();

  return (
    <div className="col-sm-7">
      <DatePicker
        selected={value && value.length === 10 ? parseDate(value) : null}
        onChange={(date) => {
          if (!date) {
            setValue("");
            return;
          }
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          setValue(`${day}/${month}/${year}`);
        }}
        dateFormat="dd/MM/yyyy"
        placeholderText="DD/MM/YYYY"
        className={`form-control ${error ? "is-invalid" : ""}`}
        wrapperClassName="w-100"
        onChangeRaw={(e) => setValue(e.target.value)}
        onBlur={() => handleBlur(value, setValue, () => {})}
        onKeyDown={(e) => handleKeyDown(e, setValue)}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        autoComplete="off"
      />
      <input type="hidden" value={value} readOnly />
    </div>
  );
};

function Cargo({ setActiveTab, isViewMode }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const {
    permitDetails,
    updatePermitDetails,
    // Header States
    showCargoType,
    setShowCargoType,
    transportMode,
    setTransportMode,
    outTransportMode,
    setOutTransportMode,
    inwardTransport,
    setInwardTransport,
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
    outCargoHawb,
    setOutCargoHawb,
    showInWardDetails,
    setShowInWardDetails,
    showOutWardDetails,
    setShowOutWardDetails,
    showInwardMode,
    setShowInwardMode,
    cargoOutwardTransportMode,
    setCargoOutwardTransportMode,
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
    showInHawbInward,
    setShowInHawbInward,
    showstorageLocation,
    setShowStorageLocation,
    showExhibition,
    setShowExhibition,
    showExhibitionStartDate,
    setShowExhibitionStartDate,
    showExhibitionEndDate,
    setShowExhibitionEndDate,
    showLoadingPort,
    setShowLoadingPort,
    cargoHawbList,
    setCargoHawbList,
    outCargoHawbList,
    setOutCargoHawbList,
    arrivalDate,
    setArrivalDate,
    showArriavalDateError,
    setShowArrivalDateError,
    blanketStartDate,
    setBlanketStartDate,
    showCargoBlanketStartDate,
    setShowCargoBlanketStartDate,
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
    // EXISTING STATES FOR SAVE AS DRAFT
    decType,
    prevPermitNo,
    cargo, // already exists as CargoPackType
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

    showOutVoyage,
    setShowOutVoyage,
    outVoyageNumber,
    setOutVoyageNumber,
    showOutVesselName,
    setShowOutVesselName,
    outVesselName,
    setOutVesselName,
    showOutObl,
    setShowOutObl,
    outObl,
    setOutObl,
    showOutHblHawb,
    setShowOutHblHawb,
    outHblHawb,
    setOutHblHawb,
    outConveyanceNumber,
    setOutConveyanceNumber,
    showOutConveyance,
    setShowOutConveyance,
    showOutTransportId,
    setShowOutTransportId,
    outTransportDetails,
    setOutTransportDetails,
    showOutFlightNumber,
    setShowOutFlightNumber,
    outSeaStore,
    setOutSeaStore,
    outFlightNumber,
    setOutFlightNumber,
    outAircraftRegNumber,
    setOutAircraftRegNumber,
    outMawbNumber,
    setOutMawbNumber,
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
    vesselType,
    setVesselType,
    vesselNetRegisterTonnage,
    setVesselNetRegisterTonnage,
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
    vesselNationality,
    setVesselNationality,
    towingVesselId,
    setTowingVesselId,
    towingVesselName,
    setTowingVesselName,
    showDischargePort,
    setShowDischargePort,
    showFinalDestination,
    setShowFinalDestination,
    exhibitionStartDate,
    setExhibitionStartDate,
    exhibitionEndDate,
    setExhibitionEndDate,
  } = useOut();

  //  Calculate permit gross weight based on total gross weight and UOM
  useEffect(() => {
    if (!totalGrossWeight || grossUOM === "--Select--") {
      setPermitGrossWeight("");
      return;
    }
    const weight = parseFloat(totalGrossWeight);
    if (isNaN(weight)) {
      setPermitGrossWeight("");
      return;
    }
    if (grossUOM === "TNE") {
      setPermitGrossWeight((weight / 1000).toFixed(2));
    } else {
      setPermitGrossWeight(weight.toFixed(2));
    }
  }, [totalGrossWeight, grossUOM]);
  // ========================STATES========================

  const [totalOuterPack, setTotalOuterPack] = useState([]);
  const [containerType, setContainerType] = useState([]);
  //  Gross Weight
  const totalGrossWeightOptions = ["KGM", "TNE"];

  // fetch totalouterPack type
  const fetchTotalOuterPackData = async () => {
    try {
      const response = await API.get("/getTotalOuterPackFromCommonMaster/");
      setTotalOuterPack(response.data);
    } catch (error) {
      console.error("Error fetching outer pack data", error);
    }
  };

  // fetch container
  const fetchContainerTypeData = async () => {
    try {
      const response = await API.get("/getContainerFromCommonMaster/");
      setContainerType(response.data);
    } catch (error) {
      console.error("Error fetching Container data", error);
    }
  };

  // fetch vesseltype

  const [vesselTypeList, setVesselTypeList] = useState([]);
  const fetchVesselTypeData = async () => {
    try {
      const response = await API.get("/getVesselTypeFromCommonMaster/");
      setVesselTypeList(response.data);
    } catch (error) {
      console.error("Error fetching vessel type data", error);
    }
  };

  useEffect(() => {
    fetchTotalOuterPackData();
    fetchContainerTypeData();
    fetchVesselTypeData();
  }, []);

  // ===========================Country List========================

  const [countryList, setCountryList] = useState([]);

  const fetchCountryList = async () => {
    try {
      const response = await API.get("/getCommonCountryTableInfo/");
      setCountryList(response.data);
    } catch (error) {
      console.error("Error fetching country list", error);
    }
  };

  const [nationalityList, setNationalityList] = useState([]);
  const fetchNationalityList = async () => {
    try {
      const response = await API.get("/getCommonCountryTableInfo/");
      setNationalityList(response.data);
    } catch (error) {
      console.error("Error fetching nationality list", error);
    }
  };

  useEffect(() => {
    fetchCountryList();
    fetchNationalityList();
  }, []);

  // ======================== RELEASE LOCATION ========================
  const [releaseLocation, setReleaseLocation] = useState(null);
  const [releaseLocationCode, setReleaseLocationCode] = useState("");
  const [releaseLocationSuggestions, setReleaseLocationSuggestions] = useState(
    [],
  );
  const [
    filteredReleaseLocationSuggestions,
    setFilteredReleaseLocationSuggestions,
  ] = useState([]);
  const [showReleaseLocationDropdown, setShowReleaseLocationDropdown] =
    useState(false);
  const [highlightedReleaseLocationIndex, setHighlightedReleaseLocationIndex] =
    useState(0);
  const [releaseLocationError, setReleaseLocationError] = useState(false);
  // const [loading, setLoading] = useState(false);
  // ======================== FETCH RELEASE LOCATION ========================
  useEffect(() => {
    const fetchReleaseLocationSuggestions = async () => {
      try {
        const response = await API.get("/getReleaseLocation/");
        const list = response.data.map(
          (i) => `${i.Code}:${i.LocationCode}:${i.Description}`,
        );
        setReleaseLocationSuggestions(list);
        setFilteredReleaseLocationSuggestions(list);
      } catch (error) {
        console.error("Error fetching release location suggestions", error);
      }
    };
    fetchReleaseLocationSuggestions();
  }, []);

  // ======================== RELEASE LOCATION HANDLERS ========================
  const handleReleaseLocationChange = (e) => {
    const val = e.target.value;
    setReleaseCode(val);
    setReleaseLocationError(false);
    setHighlightedReleaseLocationIndex(0);
    if (!val) {
      setShowReleaseLocationDropdown(false);
      return;
    }
    if (!val) {
      setShowReleaseCodeError(true);
      return;
    } else {
      setShowReleaseCodeError(false);
    }
    const filtered = releaseLocationSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );
    setFilteredReleaseLocationSuggestions(filtered.slice(0, 100));
    setShowReleaseLocationDropdown(filtered.length > 0);
  };

  // ======================== RELEASE LOCATION KEYDOWN ========================
  const handleReleaseLocationKeyDown = (e) => {
    if (
      !showReleaseLocationDropdown ||
      filteredReleaseLocationSuggestions.length === 0
    )
      return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedReleaseLocationIndex((prev) =>
        prev + 1 >= filteredReleaseLocationSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedReleaseLocationIndex((prev) =>
        prev - 1 < 0 ? filteredReleaseLocationSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleReleaseLocationSelect(
        filteredReleaseLocationSuggestions[highlightedReleaseLocationIndex],
      );
    }
  };

  // ========================  RELEASE LOCATION SELECT ========================
  const handleReleaseLocationSelect = (item) => {
    const [Code, LocationCode, Description] = item.split(":");

    setReleaseLocation({
      Code: Code,
      LocationCode: LocationCode,
      Description: Description,
    });

    setReleaseCode(Code);
    setReleaseLocationCode(LocationCode);
    setReleaseLocationDescription(Description);
    setReleaseLocationError(false);
  };
  // ======================== RELEASE LOCATION FOCUSOUT ========================
  const handleReleaseLocationFocusOut = () => {
    setTimeout(() => {
      if (!releaseCode) {
        setReleaseLocation(null);
        setReleaseLocationCode("");
        setReleaseLocationDescription("");
        setReleaseLocationError(true);
        setShowReleaseLocationDropdown(false);
        return;
      }
      const selected = releaseLocationSuggestions
        .map((i) => i.split(":"))
        .find(([Code]) => Code.toLowerCase() === releaseCode.toLowerCase());
      if (selected) {
        const [Code, LocationCode, Description] = selected;

        setReleaseLocation({
          Code: Code,
          LocationCode: LocationCode,
          Description: Description,
        });
        setReleaseCode(Code);
        setReleaseLocationCode(LocationCode);
        setReleaseLocationDescription(Description);
        setReleaseLocationError(false);
      } else {
        setReleaseLocation(null);
        setReleaseLocationError(true);
      }
      setShowReleaseLocationDropdown(false);
    }, 150);
  };

  // ======================== RECEIPT LOCATION ========================
  const [receiptLocation, setReceiptLocation] = useState(null);
  const [receiptLocationCode, setReceiptLocationCode] = useState("");
  const [receiptLocationSuggestions, setReceiptLocationSuggestions] = useState(
    [],
  );
  const [
    filteredReceiptLocationSuggestions,
    setFilteredReceiptLocationSuggestions,
  ] = useState([]);
  const [showReceiptLocationDropdown, setShowReceiptLocationDropdown] =
    useState(false);
  const [highlightedReceiptLocationIndex, setHighlightedReceiptLocationIndex] =
    useState(0);
  const [receiptLocationError, setReceiptLocationError] = useState(false);
  // ======================== FETCH RECEIPT LOCATION ========================
  useEffect(() => {
    const fetchReceiptLocationSuggestions = async () => {
      try {
        const response = await API.get("/getReceiptLocation/");
        const list = response.data.map(
          (i) => `${i.Code}:${i.LocationCode}:${i.Description}`,
        );
        setReceiptLocationSuggestions(list);
        setFilteredReceiptLocationSuggestions(list);
      } catch (error) {
        console.error("Error fetching receipt location suggestions", error);
      }
    };
    fetchReceiptLocationSuggestions();
  }, []);
  // ======================== FETCH RECEIPT LOCATION ========================
  const handleReceiptLocationChange = (e) => {
    const val = e.target.value;
    setReceiptCode(val);
    setReceiptLocationError(false);
    setHighlightedReceiptLocationIndex(0);
    if (!val) {
      setShowReceiptLocationDropdown(false);
      return;
    }
    if (!val) {
      setShowReceiptCodeError(true);
      return;
    } else {
      setShowReceiptCodeError(false);
    }
    const filtered = receiptLocationSuggestions.filter((i) =>
      i.toLowerCase().includes(val.toLowerCase()),
    );
    setFilteredReceiptLocationSuggestions(filtered.slice(0, 100));
    setShowReceiptLocationDropdown(filtered.length > 0);
  };
  // ======================== FETCH RECEIPT LOCATION ========================
  const handleReceiptLocationKeyDown = (e) => {
    if (
      !showReceiptLocationDropdown ||
      filteredReceiptLocationSuggestions.length === 0
    )
      return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedReceiptLocationIndex((prev) =>
        prev + 1 >= filteredReceiptLocationSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedReceiptLocationIndex((prev) =>
        prev - 1 < 0 ? filteredReceiptLocationSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleReceiptLocationSelect(
        filteredReceiptLocationSuggestions[highlightedReceiptLocationIndex],
      );
    }
  };
  // ======================== FETCH RECEIPT LOCATION ========================
  const handleReceiptLocationSelect = (item) => {
    const [Code, LocationCode, Description] = item.split(":");
    setReceiptLocation({
      Code,
      LocationCode,
      Description,
    });
    setReceiptCode(Code);
    setReceiptLocationCode(LocationCode);
    setReceiptLocationDescription(Description);
    setReceiptLocationError(false);
    setShowReceiptLocationDropdown(false);
  };
  // ======================== FETCH RECEIPT LOCATION ========================
  const handleReceiptLocationFocusOut = () => {
    setTimeout(() => {
      if (!receiptCode) {
        setReceiptLocation(null);
        setReceiptLocationCode("");
        setReceiptLocationDescription("");
        setReceiptLocationError(true);
        setShowReceiptLocationDropdown(false);
        return;
      }
      const selected = receiptLocationSuggestions
        .map((i) => i.split(":"))
        .find(([Code]) => Code.toLowerCase() === receiptCode.toLowerCase());
      if (selected) {
        const [Code, LocationCode, Description] = selected;
        setReceiptLocation({ Code, LocationCode, Description });
        setReceiptCode(Code);
        setReceiptLocationCode(LocationCode);
        setReceiptLocationDescription(Description);
        setReceiptLocationError(false);
      } else {
        setReceiptLocation(null);
        setReceiptLocationCode("");
        setReceiptLocationDescription("");
        setReceiptLocationError(true);
      }
      setShowReceiptLocationDropdown(false);
    }, 150);
  };

  // ========================InWARD TRANSPORT========================

  // ======================== LOADING PORT========================

  const [loadingPort, setLoadingPort] = useState(null);
  const [loadingPortSuggestions, setLoadingPortSuggestions] = useState([]);
  const [filteredLoadingPortSuggestions, setFilteredLoadingPortSuggestions] =
    useState([]);
  const [showLoadingPortDropdown, setShowLoadingPortDropdown] = useState(false);
  const [highlightedLoadingPortIndex, setHighlightedLoadingPortIndex] =
    useState(0);
  const [loadingPortError, setLoadingPortError] = useState(false);
  // ======================== FETCH LOADING PORT========================
  useEffect(() => {
    const fetchLoadingPortSuggestions = async () => {
      try {
        const response = await API.get("/getLoadingPort/");
        const list = response.data.map(
          (i) => `${i.PortCode}:${i.PortName}:${i.Country}`,
        );
        setLoadingPortSuggestions(list);
        setFilteredLoadingPortSuggestions(list);
      } catch (error) {
        console.error("Error fetching loading port suggestions", error);
      }
    };
    fetchLoadingPortSuggestions();
  }, []);

  // ======================== FETCH LOADING PORT========================
  const handleLoadingPortChange = (e) => {
    const val = e.target.value;
    setLoadingPortCode(val);
    setLoadingPortError(false);
    setHighlightedLoadingPortIndex(0);

    if (!val) {
      setShowLoadingPortDropdown(false);
      return;
    }
    if (!val) {
      setShowLoadingPortCodeError(true);
      return;
    } else {
      setShowLoadingPortCodeError(false);
    }

    const filtered = loadingPortSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );

    setFilteredLoadingPortSuggestions(filtered.slice(0, 100));
    setShowLoadingPortDropdown(filtered.length > 0);
  };
  // ======================== FETCH LOADING PORT========================
  const handleLoadingPortKeyDown = (e) => {
    if (!showLoadingPortDropdown || filteredLoadingPortSuggestions.length === 0)
      return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedLoadingPortIndex((prev) =>
        prev + 1 >= filteredLoadingPortSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedLoadingPortIndex((prev) =>
        prev - 1 < 0 ? filteredLoadingPortSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleLoadingPortSelect(
        filteredLoadingPortSuggestions[highlightedLoadingPortIndex],
      );
    }
  };
  // ======================== FETCH LOADING PORT========================
  const handleLoadingPortSelect = (item) => {
    const [PortCode, PortName, Country] = item.split(":");

    setLoadingPort({ PortCode, PortName, Country });
    setLoadingPortCode(PortCode);
    setLoadingPortName(PortName);
    setLoadingPortError(false);
  };

  const handleLoadingPortFocusOut = () => {
    setTimeout(() => {
      if (!loadingPortCode) {
        setLoadingPort(null);
        setLoadingPortCode("");
        setLoadingPortName("");
        setLoadingPortError(true);
        setShowLoadingPortDropdown(false);
        return;
      }

      const selected = loadingPortSuggestions
        .map((i) => i.split(":"))
        .find(
          ([PortCode]) =>
            PortCode.toLowerCase() === loadingPortCode.toLowerCase(),
        );

      if (selected) {
        const [PortCode, PortName, Country] = selected;
        setLoadingPort({ PortCode, PortName, Country });
        setLoadingPortCode(PortCode);
        setLoadingPortName(PortName);
        setLoadingPortError(false);
      } else {
        setLoadingPort(null);
        setLoadingPortError(true);
      }

      setShowLoadingPortDropdown(false);
    }, 150);
  };

  // ======================== STORAGE LOCATION ========================
  const [storageLocation, setStorageLocation] = useState(null);
  const [storageLocationSuggestions, setStorageLocationSuggestions] = useState(
    [],
  );
  const [
    filteredStorageLocationSuggestions,
    setFilteredStorageLocationSuggestions,
  ] = useState([]);
  const [showStorageLocationDropdown, setShowStorageLocationDropdown] =
    useState(false);
  const [highlightedStorageLocationIndex, setHighlightedStorageLocationIndex] =
    useState(0);
  const [storageLocationError, setStorageLocationError] = useState(false);

  useEffect(() => {
    const fetchStorageLocationSuggestions = async () => {
      try {
        const response = await API.get("/getStorageLocation/");
        const list = response.data.map(
          (i) => `${i.Code}:${i.StorageCode}:${i.Description}`,
        );
        setStorageLocationSuggestions(list);
        setFilteredStorageLocationSuggestions(list);
      } catch (error) {
        console.error("Error fetching storage location suggestions", error);
      }
    };
    fetchStorageLocationSuggestions();
  }, []);

  // ======================== STORAGE LOCATION HANDLERS ========================
  const handleStorageLocationChange = (e) => {
    const val = e.target.value;
    setStorageCode(val);
    setStorageLocationError(false);
    setHighlightedStorageLocationIndex(0);
    if (!val) {
      setShowStorageLocationDropdown(false);
      return;
    } else {
      setShowStorageCodeError(false);
    }
    const filtered = storageLocationSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );
    setFilteredStorageLocationSuggestions(filtered.slice(0, 100));
    setShowStorageLocationDropdown(filtered.length > 0);
  };

  // ======================== STORAGE LOCATION KEYDOWN ========================
  const handleStorageLocationKeyDown = (e) => {
    if (
      !showStorageLocationDropdown ||
      filteredStorageLocationSuggestions.length === 0
    )
      return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedStorageLocationIndex((prev) =>
        prev + 1 >= filteredStorageLocationSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedStorageLocationIndex((prev) =>
        prev - 1 < 0 ? filteredStorageLocationSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleStorageLocationSelect(
        filteredStorageLocationSuggestions[highlightedStorageLocationIndex],
      );
    }
  };

  // ======================== STORAGE LOCATION SELECT ========================
  const handleStorageLocationSelect = (item) => {
    const [Code, StorageCode, Description] = item.split(":");
    setStorageLocation({ Code, StorageCode, Description });
    setStorageCode(StorageCode);
    setStorageLocationDescription(Description);
    setStorageLocationError(false);
    setShowStorageLocationDropdown(false);
  };

  // ======================== STORAGE LOCATION FOCUSOUT ========================
  const handleStorageLocationFocusOut = () => {
    setTimeout(() => {
      if (!storageCode) {
        setStorageLocation(null);
        setStorageLocationDescription("");
        setStorageLocationError(true);
        setShowStorageLocationDropdown(false);
        return;
      }
      const selected = storageLocationSuggestions
        .map((i) => i.split(":"))
        .find(
          ([, StorageCode]) =>
            StorageCode.toLowerCase() === storageCode.toLowerCase(),
        );
      if (selected) {
        const [Code, StorageCode, Description] = selected;
        setStorageLocation({ Code, StorageCode, Description });
        setStorageCode(StorageCode);
        setStorageLocationDescription(Description);
        setStorageLocationError(false);
      } else {
        setStorageLocation(null);
        setStorageLocationError(true);
      }
      setShowStorageLocationDropdown(false);
    }, 150);
  };

  // ======================== DISCHARGE PORT ========================
  const [dischargePort, setDischargePort] = useState(null);
  const [dischargePortSuggestions, setDischargePortSuggestions] = useState([]);
  const [
    filteredDischargePortSuggestions,
    setFilteredDischargePortSuggestions,
  ] = useState([]);
  const [showDischargePortDropdown, setShowDischargePortDropdown] =
    useState(false);
  const [highlightedDischargePortIndex, setHighlightedDischargePortIndex] =
    useState(0);
  const [dischargePortError, setDischargePortError] = useState(false);

  useEffect(() => {
    const fetchDischargePortSuggestions = async () => {
      try {
        const response = await API.get("/getLoadingPort/"); // same API as loading port
        const list = response.data.map(
          (i) => `${i.PortCode}:${i.PortName}:${i.Country}`,
        );
        setDischargePortSuggestions(list);
        setFilteredDischargePortSuggestions(list);
      } catch (error) {
        console.error("Error fetching discharge port suggestions", error);
      }
    };
    fetchDischargePortSuggestions();
  }, []);

  const handleDischargePortChange = (e) => {
    const val = e.target.value;
    setDischargePortCode(val);
    setDischargePortError(false);
    setHighlightedDischargePortIndex(0);
    if (!val) {
      setShowDischargePortDropdown(false);
      return;
    }
    const filtered = dischargePortSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );
    setFilteredDischargePortSuggestions(filtered.slice(0, 100));
    setShowDischargePortDropdown(filtered.length > 0);
  };

  const handleDischargePortKeyDown = (e) => {
    if (
      !showDischargePortDropdown ||
      filteredDischargePortSuggestions.length === 0
    )
      return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedDischargePortIndex((prev) =>
        prev + 1 >= filteredDischargePortSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedDischargePortIndex((prev) =>
        prev - 1 < 0 ? filteredDischargePortSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleDischargePortSelect(
        filteredDischargePortSuggestions[highlightedDischargePortIndex],
      );
    }
  };

  const handleDischargePortSelect = (item) => {
    const [PortCode, PortName, Country] = item.split(":");
    setDischargePort({ PortCode, PortName, Country });
    setDischargePortCode(PortCode);
    setDischargePortName(PortName);
    setDischargePortError(false);
    setShowDischargePortDropdown(false);
  };

  const handleDischargePortFocusOut = () => {
    setTimeout(() => {
      if (!dischargePortCode) {
        setDischargePort(null);
        setDischargePortCode("");
        setDischargePortName("");
        setShowDischargePortDropdown(false);
        return;
      }
      const selected = dischargePortSuggestions
        .map((i) => i.split(":"))
        .find(
          ([PortCode]) =>
            PortCode.toLowerCase() === dischargePortCode.toLowerCase(),
        );
      if (selected) {
        const [PortCode, PortName, Country] = selected;
        setDischargePort({ PortCode, PortName, Country });
        setDischargePortCode(PortCode);
        setDischargePortName(PortName);
        setDischargePortError(false);
      } else {
        setDischargePort(null);
        setDischargePortError(true);
      }
      setShowDischargePortDropdown(false);
    }, 150);
  };

  // ======================== NEXT PORT ========================
  const [nextPort, setNextPort] = useState(null);
  const [nextPortSuggestions, setNextPortSuggestions] = useState([]);
  const [filteredNextPortSuggestions, setFilteredNextPortSuggestions] =
    useState([]);
  const [showNextPortDropdown, setShowNextPortDropdown] = useState(false);
  const [highlightedNextPortIndex, setHighlightedNextPortIndex] = useState(0);
  const [nextPortError, setNextPortError] = useState(false);

  useEffect(() => {
    const fetchNextPortSuggestions = async () => {
      try {
        const response = await API.get("/getLoadingPort/");
        const list = response.data.map(
          (i) => `${i.PortCode}:${i.PortName}:${i.Country}`,
        );
        setNextPortSuggestions(list);
        setFilteredNextPortSuggestions(list);
      } catch (error) {
        console.error("Error fetching next port suggestions", error);
      }
    };
    fetchNextPortSuggestions();
  }, []);

  const handleNextPortChange = (e) => {
    const val = e.target.value;
    setNextPortCode(val);
    setNextPortError(false);
    setHighlightedNextPortIndex(0);
    if (!val) {
      setShowNextPortDropdown(false);
      return;
    }
    const filtered = nextPortSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );
    setFilteredNextPortSuggestions(filtered.slice(0, 100));
    setShowNextPortDropdown(filtered.length > 0);
  };

  const handleNextPortKeyDown = (e) => {
    if (!showNextPortDropdown || filteredNextPortSuggestions.length === 0)
      return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedNextPortIndex((prev) =>
        prev + 1 >= filteredNextPortSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedNextPortIndex((prev) =>
        prev - 1 < 0 ? filteredNextPortSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleNextPortSelect(
        filteredNextPortSuggestions[highlightedNextPortIndex],
      );
    }
  };

  const handleNextPortSelect = (item) => {
    const [PortCode, PortName, Country] = item.split(":");
    setNextPort({ PortCode, PortName, Country });
    setNextPortCode(PortCode);
    setNextPortName(PortName);
    setNextPortError(false);
    setShowNextPortDropdown(false);
  };

  const handleNextPortFocusOut = () => {
    setTimeout(() => {
      if (!nextPortCode) {
        setNextPortObj(null);
        setNextPortCode("");
        setNextPortName("");
        setShowNextPortDropdown(false);
        return;
      }
      const selected = nextPortSuggestions
        .map((i) => i.split(":"))
        .find(
          ([PortCode]) => PortCode.toLowerCase() === nextPort.toLowerCase(),
        );
      if (selected) {
        const [PortCode, PortName, Country] = selected;
        setNextPortObj({ PortCode, PortName, Country });
        setNextPortCode(PortCode);
        setNextPortName(PortName);
        setNextPortError(false);
      } else {
        setNextPortObj(null);
        setNextPortError(true);
      }
      setShowNextPortDropdown(false);
    }, 150);
  };

  // ======================== LAST PORT ========================
  const [lastPort, setLastPort] = useState(null);
  const [lastPortSuggestions, setLastPortSuggestions] = useState([]);
  const [filteredLastPortSuggestions, setFilteredLastPortSuggestions] =
    useState([]);
  const [showLastPortDropdown, setShowLastPortDropdown] = useState(false);
  const [highlightedLastPortIndex, setHighlightedLastPortIndex] = useState(0);
  const [lastPortError, setLastPortError] = useState(false);

  useEffect(() => {
    const fetchLastPortSuggestions = async () => {
      try {
        const response = await API.get("/getLoadingPort/");
        const list = response.data.map(
          (i) => `${i.PortCode}:${i.PortName}:${i.Country}`,
        );
        setLastPortSuggestions(list);
        setFilteredLastPortSuggestions(list);
      } catch (error) {
        console.error("Error fetching last port suggestions", error);
      }
    };
    fetchLastPortSuggestions();
  }, []);

  const handleLastPortChange = (e) => {
    const val = e.target.value;
    setLastPort(val);
    setLastPortError(false);
    setHighlightedLastPortIndex(0);
    if (!val) {
      setShowLastPortDropdown(false);
      return;
    }
    const filtered = lastPortSuggestions.filter((i) =>
      i.toLowerCase().startsWith(val.toLowerCase()),
    );
    setFilteredLastPortSuggestions(filtered.slice(0, 100));
    setShowLastPortDropdown(filtered.length > 0);
  };

  const handleLastPortKeyDown = (e) => {
    if (!showLastPortDropdown || filteredLastPortSuggestions.length === 0)
      return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedLastPortIndex((prev) =>
        prev + 1 >= filteredLastPortSuggestions.length ? 0 : prev + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedLastPortIndex((prev) =>
        prev - 1 < 0 ? filteredLastPortSuggestions.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleLastPortSelect(
        filteredLastPortSuggestions[highlightedLastPortIndex],
      );
    }
  };

  const handleLastPortSelect = (item) => {
    const [PortCode, PortName, Country] = item.split(":");
    setLastPortObj({ PortCode, PortName, Country });
    setLastPort(PortCode);
    setLastPortName(PortName);
    setLastPortError(false);
    setShowLastPortDropdown(false);
  };

  const handleLastPortFocusOut = () => {
    setTimeout(() => {
      if (!lastPort) {
        setLastPortObj(null);
        setLastPort("");
        setLastPortName("");
        setShowLastPortDropdown(false);
        return;
      }
      const selected = lastPortSuggestions
        .map((i) => i.split(":"))
        .find(
          ([PortCode]) => PortCode.toLowerCase() === lastPort.toLowerCase(),
        );
      if (selected) {
        const [PortCode, PortName, Country] = selected;
        setLastPortObj({ PortCode, PortName, Country });
        setLastPort(PortCode);
        setLastPortName(PortName);
        setLastPortError(false);
      } else {
        setLastPortObj(null);
        setLastPortError(true);
      }
      setShowLastPortDropdown(false);
    }, 150);
  };

  //---------------------------- Popup-----------------------------------
  const [popupType, setPopupType] = useState(null);
  const [popupData, setPopupData] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentPopupConfig = currentPopup(popupType, {
    setReleaseLocation,
    setReleaseCode,
    setReleaseLocationCode,
    setReleaseLocationDescription,
    setReceiptLocation,
    setReceiptCode,
    setReceiptLocationCode,
    setReceiptLocationDescription,
    setLoadingPort,
    setLoadingPortCode,
    setLoadingPortName,
    setStorageLocation,
    setStorageCode,
    setStorageLocationDescription,
    setDischargePort,
    setDischargePortCode,
    setDischargePortName,
    setNextPort,
    setNextPortCode,
    setNextPortName,
    setLastPort,
    setLastPortCode,
    setLastPortName,
  });
  //----------------------------Handle On Click-----------
  const handleIconClick = async (type) => {
    setPopupType(type);
    await fetchPopupData(type, setPopupData, setLoading);
  };

  // ====================== Container State ======================

  // ====================== Utility Functions ======================
  const resetEmptyContainer = () => ({
    id: 1,
    number: "",
    sizeType: "",
    weight: "",
    seal: "",
    isSaved: false,
    isChecked: false,
  });

  const getRowNo = (container) =>
    containers.findIndex((c) => c.id === container.id) + 1;

  // ====================== Add Container ======================
  const addContainer = () => {
    const newId = containers.length
      ? Math.max(...containers.map((c) => c.id)) + 1
      : 1;
    setContainers((prev) => [
      ...prev,
      {
        id: newId,
        number: "",
        sizeType: "",
        weight: "",
        seal: "",
        isSaved: false,
        isChecked: false,
      },
    ]);
  };

  // ====================== Delete Single Container ======================
  const deleteContainer = async (container) => {
    const rowNo = getRowNo(container);
    const payload = { PermitId: permitDetails?.PermitId, RowNo: rowNo };

    try {
      setLoading(true);
      await API.post("/deleteContainer/", payload);

      setContainers((prev) => {
        const remaining = prev.filter((c) => c.id !== container.id);
        return remaining.length ? remaining : [resetEmptyContainer()];
      });
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting container");
    } finally {
      setLoading(false);
    }
  };

  // ====================== Bulk Delete Selected Containers ======================
  const deleteSelectedContainers = async () => {
    // get all selected containers
    const selected = containers.filter((c) => c.isChecked);
    if (!selected.length)
      return alert("Select at least one container to delete");

    try {
      setLoading(true);

      // sort by RowNo descending to avoid shifting issues
      const sortedSelected = selected
        .map((c) => ({ ...c, RowNo: getRowNo(c) }))
        .sort((a, b) => b.RowNo - a.RowNo);

      // delete each container
      for (let container of sortedSelected) {
        await API.post("/deleteContainer/", {
          PermitId: permitDetails?.PermitId,
          RowNo: container.RowNo,
        });
      }

      // remove deleted containers from state
      setContainers((prev) => {
        const remaining = prev.filter((c) => !c.isChecked);
        return remaining.length
          ? remaining.map((c) => ({ ...c, isChecked: false }))
          : [resetEmptyContainer()];
      });
    } catch (err) {
      console.error("Error deleting selected containers:", err);
      alert("Error deleting containers");
    } finally {
      setLoading(false);
    }
  };

  // ====================== Save Single Container ======================
  const saveContainer = async (container) => {
    const rowNo = getRowNo(container);
    const regex = /^[A-Za-z]{4}\d{7}$/;
    if (
      !regex.test(container.number) ||
      !container.sizeType ||
      container.sizeType === "--Select--" ||
      !container.weight ||
      !container.seal
    ) {
      alert(`Please fill all details correctly for row ${rowNo}`);
      return;
    }
    const payload = {
      PermitId: permitDetails?.PermitId,
      RowNo: rowNo,
      ContainerNo: String(container.number).trim(),
      Size:
        typeof container.sizeType === "object"
          ? String(container.sizeType.value).trim()
          : String(container.sizeType).trim(),
      Weight: Number(container.weight),
      SealNo: String(container.seal).trim(),
      MessageType: "OUTDEC",
      TouchUser: user.username.toUpperCase(),
      TouchTime: new Date().toISOString(),
    };

    try {
      setLoading(true);
      const res = await API.post("/postContainerTable/", payload);
      alert(res.data.Result);

      setContainers((prev) =>
        prev.map((c) =>
          c.id === container.id ? { ...c, isSaved: true, isChecked: false } : c,
        ),
      );
    } catch (err) {
      console.error("Error saving container:", err.response?.data || err);
      alert("Error saving container! Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ====================== Select All Checkbox ======================
  const handleSelectAll = (checked) => {
    setContainers((prev) => prev.map((c) => ({ ...c, isChecked: checked })));
  };

  // ====================== Handle Individual Row Checkbox ======================
  const handleRowCheckbox = (id) => {
    setContainers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isChecked: !c.isChecked } : c)),
    );
  };

  // ====================== HAWB VLAUES======================

  const updateCargoHawb = (value) => {
    setCargoHawb(value);
    const hawbArray = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setCargoHawbList(hawbArray);
  };

  const updateOutCargoHawb = (value) => {
    setOutCargoHawb(value);
    const outHawbArray = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    setOutCargoHawbList(outHawbArray);
  };

  // ========================HAWB TEXT========================
  const getCargoLabel = () => {
    if (transportMode === "4 : Air") return "HAWB";
    if (!transportMode) return "HAWB/HBL";
    return "HBL";
  };

  const getOutCargoLabel = () => {
    if (outTransportMode === "4 : Air") return "HAWB";
    if (!outTransportMode) return "HAWB/HBL";
    return "HBL";
  };

  // =======================SAVE AS DRAFT MODEL================
  // =======================STATES==================
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftReason, setDraftReason] = useState("");
  const [draftReasonError, setDraftReasonError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ===================== OPEN MODAL ONLY =====================
  const handleSaveAsDraftClick = () => {
    setDraftReason("");
    setDraftReasonError(false);
    setShowDraftModal(true);
  };
  // ===================== CANCEL MODAL =====================
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

      const formatDate = (dateStr) => {
        if (!dateStr || dateStr.trim() === "") return null;
        const parts = dateStr.split("/");
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return dateStr;
      };

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

        // ── Transport (from Header) ────────────────────────
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
        ArrivalDate: formatDate(arrivalDate) || null,
        LoadingPortCode: loadingPortCode || "",
        ReleaseLocation: releaseCode || "",
        ResLoaName: releaseLocationDescription || "",
        RecepitLocation: receiptCode || "",
        RecepitLocName: receiptLocationDescription || "",
        TotalOuterPack: totalOuterPackValue || "",
        TotalOuterPackUOM: totalOuterPackName || "",
        TotalGrossWeight: totalGrossWeight || "",
        TotalGrossWeightUOM: grossUOM || "",
        BlanketStartDate: formatDate(blanketStartDate) || null,

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

  // =====================Auto save every filling Details==============================

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
  //     Message: "AUTO-SAVED|TAB:CargoPage",
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

  // ======================== Handle sea store function=======================

  const handleSeaStoreFunction = (e) => {
    const checked = e.target.checked;
    setOutSeaStore(checked);
    setShowDischargePort(true);
    setShowFinalDestination(true);
    if (checked) {
      setShowDischargePort(false);
      setShowFinalDestination(false);
      setDischargePortCode("");
      setDischargePortName("");
      setFinalDestinationCountry("");
    }
  };

  // ====================== UI======================

  return (
    <div className="row g-2">
      <div className="col-12">
        <div className="row">
          {/* LEFT COLUMN */}
          <div className="col-6">
            {/* MESSAGE TYPE */}
            <div className="row align-items-center compact-row">
              <div className="col-sm-8 border-bottom pb-1 full-width-title">
                OUTER PACK DETAILS
              </div>
            </div>

            {/* TOTAL OUTER PACK */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-4 mt-1 col-form-label">
                TOTAL OUTER PACK
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  className="pack-input"
                  value={totalOuterPackValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTotalOuterPackValue(val);
                    if (val.trim()) {
                      setShowTotalOuterPackValueError(false);
                    }
                  }}
                />
                {showTotalOuterPackValueError && (
                  <span className="ErrorColor">
                    Please enter a valid total outer pack value.
                  </span>
                )}
              </div>
              <div className="col-sm-5">
                <select
                  className="pack-select"
                  value={totalOuterPackName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTotalOuterPackName(val);
                    if (val) {
                      setShowTotalOuterPackUomError(false);
                    }
                  }}
                >
                  <option>--Select--</option>
                  {totalOuterPack.map((tooupack) => (
                    <option key={tooupack.Name} value={tooupack.Name}>
                      {tooupack.Name}
                    </option>
                  ))}
                </select>
                {showTotalOuterPackUomError && (
                  <span className="ErrorColor">
                    Please select a total outer pack UOM.
                  </span>
                )}
              </div>
            </div>

            {/* TOTAL GROSS WEIGHT */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-4 mt-1 col-form-label">
                TOTAL GROSS WEIGHT
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  className="pack-input"
                  value={totalGrossWeight}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTotalGrossWeight(val);
                    if (val.trim()) {
                      setShowTotalGrossWeightError(false);
                    }
                  }}
                />
                {showTotalGrossWeightError && (
                  <span className="ErrorColor">
                    Please enter a valid total gross weight.
                  </span>
                )}
              </div>
              <div className="col-sm-5">
                <select
                  className="pack-select"
                  value={grossUOM}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGrossUOM(val);
                    if (val) {
                      setShowGrossUOMError(false);
                    }
                  }}
                >
                  <option>--Select--</option>
                  {totalGrossWeightOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {showGrossUOMError && (
                  <span className="ErrorColor">
                    Please select a gross weight UOM.
                  </span>
                )}
              </div>
            </div>

            {/* PERMIT GROSS WEIGHT */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-4 col-form-label">
                PERMIT GROSS WEIGHT
              </label>
              <div className="col-sm-7">
                <input
                  type="number"
                  className="form-control"
                  value={permitGrossWeight}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-6">
            <div className="row align-items-center compact-row">
              <div className="col-sm-8 border-bottom pb-1 full-width-title">
                LOCATION INFORMATION
              </div>
            </div>

            <div className="row align-items-center compact-row">
              <label className="col-sm-3 col-form-label">
                RELEASE LOCATION
              </label>
              <div className="col-sm-1 d-flex align-items-center gap-2">
                <FaSearch
                  style={{ cursor: "pointer" }}
                  onClick={() => handleIconClick("releaselocation")}
                />
              </div>
              <div className="col-sm-2 position-relative">
                <input
                  type="text"
                  id="releaseLocationInput"
                  className="form-control"
                  value={releaseCode}
                  onChange={handleReleaseLocationChange}
                  onKeyDown={handleReleaseLocationKeyDown}
                  onBlur={handleReleaseLocationFocusOut}
                  onFocus={() => setReleaseLocationError(false)}
                />
                {showReleaseCodeError && (
                  <span className="ErrorColor">
                    Please enter a valid release location code.
                  </span>
                )}
                {showReleaseLocationDropdown &&
                  filteredReleaseLocationSuggestions.length > 0 && (
                    <div className="dropdown-suggestions">
                      {filteredReleaseLocationSuggestions.map((item, index) => {
                        const [Code, , Description] = item.split(":");

                        return (
                          <div
                            key={Code}
                            className="dropdown-item"
                            style={{
                              backgroundColor:
                                index === highlightedReleaseLocationIndex
                                  ? "#234263"
                                  : "white",
                              color:
                                index === highlightedReleaseLocationIndex
                                  ? "white"
                                  : "black",
                              cursor: "pointer",
                            }}
                            onMouseDown={() =>
                              handleReleaseLocationSelect(item)
                            }
                            onMouseEnter={() =>
                              setHighlightedReleaseLocationIndex(index)
                            }
                          >
                            {Code} - {Description}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
              <div className="col-sm-5">
                <input
                  type="text"
                  className="form-control"
                  value={releaseLocationDescription}
                  onChange={(e) =>
                    setReleaseLocationDescription(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="row align-items-center compact-row">
              <label className="col-sm-3 col-form-label">
                RECEIPT LOCATION
              </label>
              <div className="col-sm-1 d-flex align-items-center gap-2">
                <FaSearch
                  style={{ cursor: "pointer" }}
                  onClick={() => handleIconClick("receiptlocation")}
                />
              </div>
              <div className="col-sm-2 position-relative">
                <input
                  type="text"
                  id="receiptLocationInput"
                  className="form-control"
                  value={receiptCode}
                  onChange={handleReceiptLocationChange}
                  onKeyDown={handleReceiptLocationKeyDown}
                  onBlur={handleReceiptLocationFocusOut}
                  onFocus={() => setReceiptLocationError(false)}
                />
                {showReceiptCodeError && (
                  <span className="ErrorColor">
                    Please enter a valid receipt location code.
                  </span>
                )}
                {showReceiptLocationDropdown &&
                  filteredReceiptLocationSuggestions.length > 0 && (
                    <div className="dropdown-suggestions">
                      {filteredReceiptLocationSuggestions.map((item, index) => {
                        const [Code, , Description] = item.split(":");

                        return (
                          <div
                            key={Code}
                            className="dropdown-item"
                            style={{
                              backgroundColor:
                                index === highlightedReceiptLocationIndex
                                  ? "#234263"
                                  : "white",
                              color:
                                index === highlightedReceiptLocationIndex
                                  ? "white"
                                  : "black",
                              cursor: "pointer",
                            }}
                            onMouseDown={() =>
                              handleReceiptLocationSelect(item)
                            }
                            onMouseEnter={() =>
                              setHighlightedReceiptLocationIndex(index)
                            }
                          >
                            {Code} - {Description}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
              <div className="col-sm-5">
                <input
                  type="text"
                  id="receiptLocationText"
                  className="form-control"
                  value={receiptLocationDescription}
                  onChange={(e) =>
                    setReceiptLocationDescription(e.target.value)
                  }
                />
              </div>
            </div>
            {showstorageLocation && (
              <div className="row align-items-center compact-row">
                <label className="col-sm-3 col-form-label">
                  STORAGE LOCATION
                </label>
                <div className="col-sm-1 d-flex align-items-center gap-2">
                  <FaSearch
                    style={{ cursor: "pointer" }}
                    onClick={() => handleIconClick("storagelocation")}
                  />
                </div>
                <div className="col-sm-2 position-relative">
                  <input
                    type="text"
                    id="storageLocationInput"
                    className="form-control"
                    value={storageCode}
                    onChange={handleStorageLocationChange}
                    onKeyDown={handleStorageLocationKeyDown}
                    onBlur={handleStorageLocationFocusOut}
                    onFocus={() => setStorageLocationError(false)}
                  />
                  {storageLocationError && (
                    <span className="ErrorColor">
                      Please enter a valid storage location code.
                    </span>
                  )}
                  {showStorageLocationDropdown &&
                    filteredStorageLocationSuggestions.length > 0 && (
                      <div className="dropdown-suggestions">
                        {filteredStorageLocationSuggestions.map(
                          (item, index) => {
                            const [, StorageCode, Description] =
                              item.split(":");
                            return (
                              <div
                                key={StorageCode}
                                className="dropdown-item"
                                style={{
                                  backgroundColor:
                                    index === highlightedStorageLocationIndex
                                      ? "#234263"
                                      : "white",
                                  color:
                                    index === highlightedStorageLocationIndex
                                      ? "white"
                                      : "black",
                                  cursor: "pointer",
                                }}
                                onMouseDown={() =>
                                  handleStorageLocationSelect(item)
                                }
                                onMouseEnter={() =>
                                  setHighlightedStorageLocationIndex(index)
                                }
                              >
                                {StorageCode} - {Description}
                              </div>
                            );
                          },
                        )}
                      </div>
                    )}
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    id="storageLocationText"
                    className="form-control"
                    value={storageLocationDescription}
                    onChange={(e) =>
                      setStorageLocationDescription(e.target.value)
                    }
                  />
                </div>
              </div>
            )}
            {showCargoBlanketStartDate && (
              <div className="row align-items-center compact-row mb-3">
                <label className="col-sm-4 col-form-label">
                  BLANKET START DATE
                </label>
                <DateField
                  value={blanketStartDate}
                  setValue={(val) => {
                    setBlanketStartDate(val);
                    if (val) setShowBlanketStartDateError(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="row">
          {/* INWARD DETAILS */}
          {showInWardDetails && (
            <div className="col-6">
              <div className="row align-items-center compact-row">
                <div className="col-sm-4 border-bottom pb-1 full-width-title">
                  INWARD DETAILS
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  {/* MODE */}
                  {showInwardMode && (
                    <div className="row align-items-center compact-row">
                      <label className="col-sm-4 col-form-label">MODE</label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={inwardTransport}
                          onChange={(e) => setInwardTransport(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  {/* ARRIVAL DATE  && TIME*/}

                  <div className="row align-items-center compact-row mb-3">
                    <label className="col-sm-4 col-form-label">
                      ARRIVAL DATE & TIME
                    </label>
                    <DateField
                      value={arrivalDate}
                      setValue={(val) => {
                        setArrivalDate(val);
                        if (val) setShowArrivalDateError(false);
                      }}
                    />
                    {showArriavalDateError && (
                      <span className="ErrorColor">
                        Please select a valid arrival date.
                      </span>
                    )}
                  </div>

                  {/* LOADING PORT */}
                  {showLoadingPort && (
                    <div className="row align-items-center compact-row">
                      <label className="col-sm-3 col-form-label">
                        LOADING PORT
                      </label>
                      <div className="col-sm-1 d-flex align-items-center gap-2">
                        <FaSearch
                          style={{ cursor: "pointer" }}
                          onClick={() => handleIconClick("loadingport")}
                        />
                      </div>
                      <div className="col-sm-2 position-relative">
                        <input
                          type="text"
                          className="form-control"
                          id="CargoLoadingPort1"
                          value={loadingPortCode}
                          onChange={handleLoadingPortChange}
                          onKeyDown={handleLoadingPortKeyDown}
                          onBlur={handleLoadingPortFocusOut}
                          onFocus={() => setLoadingPortError(false)}
                        />
                        {showLoadingPortCodeError && (
                          <span className="ErrorColor">
                            Please select a valid loading port.
                          </span>
                        )}
                        {showLoadingPortDropdown &&
                          filteredLoadingPortSuggestions.length > 0 && (
                            <div className="dropdown-suggestions">
                              {filteredLoadingPortSuggestions.map(
                                (item, index) => {
                                  const [PortCode, PortName] = item.split(":");
                                  return (
                                    <div
                                      key={PortCode}
                                      className="dropdown-item"
                                      style={{
                                        backgroundColor:
                                          index === highlightedLoadingPortIndex
                                            ? "#234263"
                                            : "white",
                                        color:
                                          index === highlightedLoadingPortIndex
                                            ? "white"
                                            : "black",
                                        cursor: "pointer",
                                      }}
                                      onMouseDown={() =>
                                        handleLoadingPortSelect(item)
                                      }
                                      onMouseEnter={() =>
                                        setHighlightedLoadingPortIndex(index)
                                      }
                                    >
                                      {PortCode} - {PortName}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          )}
                      </div>
                      <div className="col-sm-5">
                        <input
                          type="text"
                          id="CargoLoadingPort2"
                          className="form-control"
                          value={loadingPortName}
                          readOnly
                        />
                      </div>
                    </div>
                  )}

                  {/* VOYAGE NUMBER */}
                  {showVoyageNumber && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        VOYAGE NUMBER
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={voyageNumber}
                          onChange={(e) => setVoyageNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* VESSEL NAME */}
                  {showVesselName && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        VESSEL NAME
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          value={vesselName}
                          onChange={(e) => setVesselName(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}

                  {/* CONVEYANCE NO */}
                  {showconveyanceNumber && (
                    <div className="row align-items-center compact-row mb-3">
                      <label
                        for="CargoConveyanceNo"
                        className="col-sm-4 col-form-label"
                      >
                        CONVEYANCE NO
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          value={conveyanceNumber}
                          onChange={(e) => setConveyanceNumber(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}

                  {/* TRANSPORT ID */}
                  {showTransportDetails && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        TRANSPORT ID
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          value={transportDetails}
                          onChange={(e) => setTransportDetails(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}

                  {/* FLIGHT NUMBER */}
                  {showFlightNumber && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        FLIGHT NUMBER
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          value={flightNumber}
                          onChange={(e) => setFlightNumber(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}

                  {/* AIRCRAFT REG NO */}
                  {showAirCraftRegNumber && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        AIRCRAFT REG NO
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          value={airCraftRegNumber}
                          onChange={(e) => setAirCraftRegNumber(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}

                  {/* OBL */}
                  {showOblNumber && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">OBL</label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          value={obl}
                          onChange={(e) => setObl(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}

                  {/* HAWB */}
                  {showInHawbInward && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        {getCargoLabel()}
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          id="CargoHbl"
                          className="form-control"
                          value={cargoHawb}
                          onChange={(e) => updateCargoHawb(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* MAWB */}
                  {showMawbNumber && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">MAWB</label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          value={mawbNumber}
                          onChange={(e) => setMawbNumber(e.target.value)}
                          className="form-control"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* OUTWARD DETAILS */}
          {showOutWardDetails && (
            <div className="col-6">
              <div className="row align-items-center compact-row">
                <div className="col-sm-4 border-bottom pb-1 full-width-title">
                  OUTWARD DETAILS
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  {/* MODE */}
                  <div className="row align-items-center compact-row">
                    <label className="col-sm-4 col-form-label">MODE</label>
                    <div className="col-sm-7">
                      <input
                        type="text"
                        className="form-control"
                        value={cargoOutwardTransportMode}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* DEPARTURE DATE */}
                  {/* {showDepartureDate && ( */}
                  <div className="row align-items-center compact-row mb-3 mt-3">
                    <label className="col-sm-4 col-form-label">
                      DEPARTURE DATE
                    </label>
                    <DateField
                      value={departureDate}
                      setValue={(val) => {
                        setDepartureDate(val);
                        if (val) setShowDepartureDateError(false);
                      }}
                    />
                    {/* {showDepartureDateError && (
                        <span className="ErrorColor">FILL DEPARTURE DATE</span>
                      )} */}
                  </div>
                  {/* )} */}

                  {/* DISCHARGE PORT */}
                  {showDischargePort && (
                    <div className="row align-items-center compact-row">
                      <label className="col-sm-3 col-form-label">
                        DISCHARGE PORT
                      </label>
                      <div className="col-sm-1 d-flex align-items-center">
                        <FaSearch
                          style={{ cursor: "pointer" }}
                          onClick={() => handleIconClick("dischargeport")}
                        />
                      </div>
                      <div className="col-sm-2 position-relative">
                        <input
                          type="text"
                          className="form-control"
                          value={dischargePortCode}
                          onChange={handleDischargePortChange}
                          onKeyDown={handleDischargePortKeyDown}
                          onBlur={handleDischargePortFocusOut}
                          onFocus={() => setDischargePortError(false)}
                        />
                        {dischargePortError && (
                          <span className="ErrorColor">
                            Please select a valid discharge port.
                          </span>
                        )}
                        {showDischargePortDropdown &&
                          filteredDischargePortSuggestions.length > 0 && (
                            <div className="dropdown-suggestions">
                              {filteredDischargePortSuggestions.map(
                                (item, index) => {
                                  const [PortCode, PortName] = item.split(":");
                                  return (
                                    <div
                                      key={PortCode}
                                      className="dropdown-item"
                                      style={{
                                        backgroundColor:
                                          index ===
                                          highlightedDischargePortIndex
                                            ? "#234263"
                                            : "white",
                                        color:
                                          index ===
                                          highlightedDischargePortIndex
                                            ? "white"
                                            : "black",
                                        cursor: "pointer",
                                      }}
                                      onMouseDown={() =>
                                        handleDischargePortSelect(item)
                                      }
                                      onMouseEnter={() =>
                                        setHighlightedDischargePortIndex(index)
                                      }
                                    >
                                      {PortCode} - {PortName}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          )}
                      </div>
                      <div className="col-sm-5">
                        <input
                          type="text"
                          className="form-control"
                          value={dischargePortName}
                          readOnly
                        />
                      </div>
                    </div>
                  )}
                  {/* FINAL DESTINATION COUNTRY */}
                  {showFinalDestination && (
                    <div className="row align-items-center compact-row">
                      <label className="col-sm-4 col-form-label">
                        FINAL DESTINATION COUNTRY
                      </label>
                      <div className="col-sm-7">
                        <select
                          className="Dropdown HighLight"
                          value={finalDestinationCountry}
                          onChange={(e) =>
                            setFinalDestinationCountry(e.target.value)
                          }
                        >
                          <option value="">--Select--</option>
                          {countryList.map((country) => (
                            <option
                              key={country.CountryCode}
                              value={country.CountryCode}
                            >
                              {country.CountryCode}:{country.Description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* SEA STORE */}
                  {/* {showSeaStore && ( */}
                  <div className="row align-items-center compact-row">
                    <label className="col-sm-4 col-form-label">SEA STORE</label>
                    <div className="col-sm-7 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="OutSeaStore"
                        checked={outSeaStore}
                        onChange={handleSeaStoreFunction}
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                        }}
                      />
                      <label className="form-check-label" htmlFor="OutSeaStore">
                        SEA STORE
                      </label>
                    </div>
                  </div>
                  {/* )} */}

                  {/* VOYAGE NUMBER */}
                  {showOutVoyage && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        VOYAGE NUMBER
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={outVoyageNumber}
                          onChange={(e) => setOutVoyageNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* VESSEL NAME */}
                  {showOutVesselName && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        VESSEL NAME
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={outVesselName}
                          onChange={(e) => setOutVesselName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* OBL */}
                  {showOutObl && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">OBL</label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={outObl}
                          onChange={(e) => setOutObl(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* OUT HAWB/HBL */}
                  {showOutHblHawb && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        {getOutCargoLabel()}
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={outCargoHawb}
                          onChange={(e) => updateOutCargoHawb(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* VESSEL TYPE */}
                  {showVesselType && (
                    <div className="row align-items-center compact-row">
                      <label className="col-sm-4 col-form-label">
                        VESSEL TYPE
                      </label>
                      <div className="col-sm-7">
                        <select
                          className="Dropdown HighLight"
                          value={vesselType}
                          onChange={(e) => setVesselType(e.target.value)}
                        >
                          <option value="">--Select--</option>
                          {vesselTypeList.map((v) => (
                            <option key={v.Name} value={v.Name}>
                              {v.Name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* VESSEL NET REGISTER TONNAGE */}
                  {showVesselNetRegister && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        VESSEL NET REGISTER TONNAGE
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={vesselNetRegisterTonnage}
                          onChange={(e) =>
                            setVesselNetRegisterTonnage(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* VESSEL NATIONALITY */}
                  {showVesselNationality && (
                    <div className="row align-items-center compact-row">
                      <label className="col-sm-4 col-form-label">
                        VESSEL NATIONALITY
                      </label>
                      <div className="col-sm-7">
                        <select
                          className="Dropdown"
                          value={vesselNationality}
                          onChange={(e) => setVesselNationality(e.target.value)}
                        >
                          <option value="">--Select--</option>
                          {nationalityList.map((n) => (
                            <option key={n.CountryCode} value={n.CountryCode}>
                              {n.CountryCode}:{n.Description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* TOWING VESSEL ID */}
                  {showTowingVesselId && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        TOWING VESSEL ID
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={towingVesselId}
                          onChange={(e) => setTowingVesselId(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* TOWING VESSEL NAME */}
                  {showTowingVesselName && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        TOWING VESSEL NAME
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={towingVesselName}
                          onChange={(e) => setTowingVesselName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* NEXT PORT */}
                  {showNextPort && (
                    <div className="row align-items-center compact-row">
                      <label className="col-sm-3 col-form-label">
                        NEXT PORT
                      </label>
                      <div className="col-sm-1 d-flex align-items-center">
                        <FaSearch
                          style={{ cursor: "pointer" }}
                          onClick={() => handleIconClick("nextport")}
                        />
                      </div>
                      <div className="col-sm-2 position-relative">
                        <input
                          type="text"
                          className="form-control"
                          value={nextPortCode}
                          onChange={handleNextPortChange}
                          onKeyDown={handleNextPortKeyDown}
                          onBlur={handleNextPortFocusOut}
                          onFocus={() => setNextPortError(false)}
                        />
                        {nextPortError && (
                          <span className="ErrorColor">
                            Please select a valid next port.
                          </span>
                        )}
                        {showNextPortDropdown &&
                          filteredNextPortSuggestions.length > 0 && (
                            <div className="dropdown-suggestions">
                              {filteredNextPortSuggestions.map(
                                (item, index) => {
                                  const [PortCode, PortName] = item.split(":");
                                  return (
                                    <div
                                      key={PortCode}
                                      className="dropdown-item"
                                      style={{
                                        backgroundColor:
                                          index === highlightedNextPortIndex
                                            ? "#234263"
                                            : "white",
                                        color:
                                          index === highlightedNextPortIndex
                                            ? "white"
                                            : "black",
                                        cursor: "pointer",
                                      }}
                                      onMouseDown={() =>
                                        handleNextPortSelect(item)
                                      }
                                      onMouseEnter={() =>
                                        setHighlightedNextPortIndex(index)
                                      }
                                    >
                                      {PortCode} - {PortName}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          )}
                      </div>
                      <div className="col-sm-5">
                        <input
                          type="text"
                          className="form-control"
                          value={nextPortName}
                          readOnly
                        />
                      </div>
                    </div>
                  )}

                  {/* LAST PORT */}
                  {showLastPort && (
                    <div className="row align-items-center compact-row">
                      <label className="col-sm-3 col-form-label">
                        LAST PORT
                      </label>
                      <div className="col-sm-1 d-flex align-items-center">
                        <FaSearch
                          style={{ cursor: "pointer" }}
                          onClick={() => handleIconClick("lastport")}
                        />
                      </div>
                      <div className="col-sm-2 position-relative">
                        <input
                          type="text"
                          className="form-control"
                          value={lastPortCode}
                          onChange={handleLastPortChange}
                          onKeyDown={handleLastPortKeyDown}
                          onBlur={handleLastPortFocusOut}
                          onFocus={() => setLastPortError(false)}
                        />
                        {lastPortError && (
                          <span className="ErrorColor">
                            Please select a valid last port.
                          </span>
                        )}
                        {showLastPortDropdown &&
                          filteredLastPortSuggestions.length > 0 && (
                            <div className="dropdown-suggestions">
                              {filteredLastPortSuggestions.map(
                                (item, index) => {
                                  const [PortCode, PortName] = item.split(":");
                                  return (
                                    <div
                                      key={PortCode}
                                      className="dropdown-item"
                                      style={{
                                        backgroundColor:
                                          index === highlightedLastPortIndex
                                            ? "#234263"
                                            : "white",
                                        color:
                                          index === highlightedLastPortIndex
                                            ? "white"
                                            : "black",
                                        cursor: "pointer",
                                      }}
                                      onMouseDown={() =>
                                        handleLastPortSelect(item)
                                      }
                                      onMouseEnter={() =>
                                        setHighlightedLastPortIndex(index)
                                      }
                                    >
                                      {PortCode} - {PortName}
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          )}
                      </div>
                      <div className="col-sm-5">
                        <input
                          type="text"
                          className="form-control"
                          value={lastPortName}
                          readOnly
                        />
                      </div>
                    </div>
                  )}

                  {/* CONVEYANCE NO */}
                  {showOutConveyanceNumber && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        CONVEYANCE NO
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={outConveyanceNumber}
                          onChange={(e) =>
                            setOutConveyanceNumber(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* TRANSPORT ID */}
                  {showOutTransportDetails && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        TRANSPORT ID
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={outTransportDetails}
                          onChange={(e) =>
                            setOutTransportDetails(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* FLIGHT NUMBER */}
                  {showOutFlightNumber && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        FLIGHT NUMBER
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={outFlightNumber}
                          onChange={(e) => setOutFlightNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* AIRCRAFT REG NO */}
                  {showOutAircraftReg && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        AIRCRAFT REG NO
                      </label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={outAircraftRegNumber}
                          onChange={(e) =>
                            setOutAircraftRegNumber(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* MAWB */}
                  {showOutMawb && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">MAWB</label>
                      <div className="col-sm-7">
                        <input
                          type="text"
                          className="form-control"
                          value={outMawbNumber}
                          onChange={(e) => setOutMawbNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* EXHIBITION / TEMP IMPORT */}
          {/* {showExhibition && (
            <div className="col-6">
              <div className="row align-items-center compact-row">
                <div className="col-sm-4 border-bottom pb-1 full-width-title">
                  EXHIBITION / TEMP IMPORT
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  {/* START DATE */}
          {/* {showExhibitionStartDate && ( */}
          {/* <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        START DATE
                      </label>
                      <DateField
                        value={exhibitionStartDate}
                        setValue={setExhibitionStartDate}
                      />
                    </div> */}
          {/* )} */}

          {/* END DATE */}
          {/* {showExhibitionEndDate && (
                    <div className="row align-items-center compact-row mb-3">
                      <label className="col-sm-4 col-form-label">
                        END DATE
                      </label>
                      <DateField
                        value={exhibitionEndDate}
                        setValue={setExhibitionEndDate}
                      />
                    </div>
                  )} */}
          {/* </div>
              </div>
            </div> */}
          {/* )} */}
        </div>
      </div>

      {/* CONTAINER INFO */}
      {showCargoType && (
        <div className="col-12">
          <div className="row align-items-center compact-row mb-3">
            <div className="col-sm-8 border-bottom pb-1 full-width-title">
              CONTAINER INFO
            </div>
          </div>

          {/* Delete Container Button */}
          <div className="row mt-3 mb-3">
            <div className="col-1"></div>
            <div className="col-2">
              <button
                type="button"
                className="MoveOnButtons"
                style={{ fontSize: "12px" }}
                onClick={deleteSelectedContainers}
              >
                DELETE CONTAINER
              </button>
            </div>
          </div>

          {/* Container Table */}
          <div className="row mb-3">
            <div className="col-11 form-check">
              <table id="ConatinerTable" style={{ width: "100%" }}>
                <thead>
                  <tr className="fontTable">
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          containers.length > 0 &&
                          containers.every((c) => c.isChecked)
                        }
                        onChange={(e) =>
                          setContainers((prev) =>
                            prev.map((c) => ({
                              ...c,
                              isChecked: e.target.checked,
                            })),
                          )
                        }
                      />
                    </th>
                    <th>EDIT</th>
                    <th>DELETE</th>
                    <th>S.NO</th>
                    <th>CONTAINER NO</th>
                    <th>SIZE / TYPE</th>
                    <th>WEIGHT (TNE)</th>
                    <th>SEAL NO</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {containers.map((container, index) => (
                    <tr key={container.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={container.isChecked || false}
                          onChange={(e) =>
                            setContainers((prev) =>
                              prev.map((c) =>
                                c.id === container.id
                                  ? { ...c, isChecked: e.target.checked }
                                  : c,
                              ),
                            )
                          }
                        />
                      </td>
                      <td>
                        {/* Edit */}
                        <FaEdit
                          className="view-show"
                          style={{ width: "20px", cursor: "pointer" }}
                          onClick={() =>
                            setContainers((prev) =>
                              prev.map((c) =>
                                c.id === container.id
                                  ? { ...c, isSaved: false }
                                  : c,
                              ),
                            )
                          }
                        />
                      </td>
                      <td>
                        <FaTrash
                          style={{ width: "15px", cursor: "pointer" }}
                          onClick={() => deleteContainer(container, index)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={index + 1}
                          disabled
                          className="inputStyle"
                          style={{ width: "50px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="inputStyle"
                          value={container.number}
                          onChange={(e) =>
                            setContainers((prev) =>
                              prev.map((c) =>
                                c.id === container.id
                                  ? { ...c, number: e.target.value }
                                  : c,
                              ),
                            )
                          }
                          disabled={container.isSaved}
                        />
                      </td>
                      <td>
                        <select
                          className="Dropdown HighLighty"
                          value={container.sizeType}
                          onChange={(e) =>
                            setContainers((prev) =>
                              prev.map((c) =>
                                c.id === container.id
                                  ? { ...c, sizeType: e.target.value }
                                  : c,
                              ),
                            )
                          }
                          disabled={container.isSaved}
                        >
                          <option>--Select--</option>
                          {containerType.map((ct) => (
                            <option key={ct.Name} value={ct.Name}>
                              {ct.Name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="inputStyle"
                          value={container.weight}
                          onChange={(e) =>
                            setContainers((prev) =>
                              prev.map((c) =>
                                c.id === container.id
                                  ? { ...c, weight: e.target.value }
                                  : c,
                              ),
                            )
                          }
                          disabled={container.isSaved}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="inputStyle"
                          value={container.seal}
                          onChange={(e) =>
                            setContainers((prev) =>
                              prev.map((c) =>
                                c.id === container.id
                                  ? { ...c, seal: e.target.value }
                                  : c,
                              ),
                            )
                          }
                          disabled={container.isSaved}
                        />
                      </td>
                      <td>
                        {!container.isSaved ? (
                          <button
                            type="button"
                            className="ButtonClick SaveContainer"
                            onClick={() => saveContainer(container, index)}
                          >
                            Save
                          </button>
                        ) : (
                          <span
                            className="ButtonClick SaveContainer"
                            style={{ cursor: "default" }}
                          >
                            Saved
                          </span>
                        )}
                      </td>
                      <td>
                        <FaPlus
                          style={{ width: "30px", cursor: "pointer" }}
                          className="AddContainerBtn"
                          onClick={addContainer}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* BOTTOM BUTTONS */}
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
          onClick={() => setActiveTab("PartyTab")}
        >
          PREVIOUS
        </button>
        <button
          className="NextpageBtns view-nav-btn"
          onClick={() => setActiveTab("InvoiceTab")}
        >
          NEXT
        </button>
      </div>
      {/* DRAFT MODEL */}
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

export default Cargo;
