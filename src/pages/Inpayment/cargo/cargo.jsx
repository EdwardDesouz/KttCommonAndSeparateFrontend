import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useEffect, useState, useContext, useMemo } from "react";
import API from "../../../api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../userContex/userContex";
import { useInpayment } from "../context/inpaymentContext";
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
  } = useInpayment();

  //  Calculate permit gross weight based on total gross weight and UOM
  useEffect(() => {
    setShowCargoSeaGrossWeightError(false);
    if (!totalGrossWeight || grossUOM === "--Select--") {
      setPermitGrossWeight("");
      return;
    }
    if (inwardTransport === "1 : Sea") {
      if (grossUOM !== "TNE") {
        setShowCargoSeaGrossWeightError(true);
      }
    }
    const weight = Number(totalGrossWeight);
    if (isNaN(weight)) {
      setPermitGrossWeight("");
      return;
    }
    if (grossUOM === "TNE") {
      setPermitGrossWeight(weight / 1000);
    } else {
      setPermitGrossWeight(weight);
    }
  }, [totalGrossWeight, grossUOM, inwardTransport]);
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

  useEffect(() => {
    fetchTotalOuterPackData();
    fetchContainerTypeData();
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
    const filtered = releaseLocationSuggestions.filter((i) => {
      const [Code, , Description] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Description.toLowerCase().includes(search)
      );
    });
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
      setShowReleaseLocationDropdown(false);
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
    setShowReleaseLocationDropdown(false);
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
        .find(
          ([Code, , Description]) =>
            Code.toLowerCase() === releaseCode.toLowerCase() ||
            Description.toLowerCase() === releaseCode.toLowerCase(),
        );

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
    const filtered = receiptLocationSuggestions.filter((i) => {
      const [Code, , Description] = i.split(":");
      const search = val.toLowerCase();
      return (
        Code.toLowerCase().startsWith(search) ||
        Description.toLowerCase().includes(search)
      );
    });
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
      setShowReceiptLocationDropdown(false);
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
        .find(
          ([Code, , Description]) =>
            Code.toLowerCase() === receiptCode.toLowerCase() ||
            Description.toLowerCase() === receiptCode.toLowerCase(),
        );

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

    const filtered = loadingPortSuggestions.filter((i) => {
      const [PortCode, PortName] = i.split(":");
      const search = val.toLowerCase();
      return (
        PortCode.toLowerCase().startsWith(search) ||
        PortName.toLowerCase().includes(search)
      );
    });

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
      setShowLoadingPortDropdown(false);
    }
  };
  // ======================== FETCH LOADING PORT========================
  const handleLoadingPortSelect = (item) => {
    const [PortCode, PortName, Country] = item.split(":");

    setLoadingPort({ PortCode, PortName, Country });
    setLoadingPortCode(PortCode);
    setLoadingPortName(PortName);
    setLoadingPortError(false);
    setShowLoadingPortDropdown(false);
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
          ([PortCode, PortName]) =>
            PortCode.toLowerCase() === loadingPortCode.toLowerCase() ||
            PortName.toLowerCase() === loadingPortCode.toLowerCase(),
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
      MessageType: "IPTDEC",
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

  // ========================HAWB TEXT========================
  const getCargoLabel = () => {
    if (transportMode === "4 : Air") return "HAWB";
    if (!transportMode) return "HAWB";
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
  //     TradeNetMailboxID: permitDetails?.TradeNetMailboxID || permitDetails?.MailBoxId || "",
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
                  {totalOuterPackName &&
                    !totalOuterPack.find(
                      (t) => t.Name === totalOuterPackName,
                    ) && (
                      <option value={totalOuterPackName}>
                        {totalOuterPackName}
                      </option>
                    )}
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
                  {grossUOM && !totalGrossWeightOptions.includes(grossUOM) && (
                    <option value={grossUOM}>{grossUOM}</option>
                  )}
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
            {showCargoSeaGrossWeightError && (
              <div className="ErrorColor">=1:sea</div>
            )}

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
          </div>
        </div>
      </div>
      <div className="col-12">
        {/* INWARD DETAILS */}
        <div className="row align-items-center compact-row">
          <div className="col-sm-8 border-bottom pb-1 full-width-title">
            INWARD DETAILS
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            {/* MODE */}
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

            {/* LOADING PORT */}
            {showNotRequired && (
              <div className="row align-items-center compact-row">
                <label className="col-sm-3 col-form-label">LOADING PORT</label>
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
                        {filteredLoadingPortSuggestions.map((item, index) => {
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
                              onMouseDown={() => handleLoadingPortSelect(item)}
                              onMouseEnter={() =>
                                setHighlightedLoadingPortIndex(index)
                              }
                            >
                              {PortCode} - {PortName}
                            </div>
                          );
                        })}
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
            {/* HAWB */}
            {showNotRequired && (
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

            {/* ARRIVAL DATE */}
            {showNotRequired && (
              <div className="row align-items-center compact-row mb-3">
                <label className="col-sm-4 col-form-label">ARRIVAL DATE</label>
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
            )}

            {showVoyageNumber && (
              <div className="row align-items-center compact-row mb-3">
                <label className="col-sm-4 col-form-label">VOYAGE NUMBER</label>
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
                <label className="col-sm-4 col-form-label">VESSEL NAME</label>
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

            {/* FLIGHT NUMBER */}
            {showFlightNumber && (
              <div className="row align-items-center compact-row mb-3">
                <label className="col-sm-4 col-form-label">FLIGHT NUMBER</label>
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
                <label className="col-sm-4 col-form-label">TRANSPORT ID</label>
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
            {/* BLANKET START DATE */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">
                BLANKET START DATE
              </label>
              <DateField
                value={blanketStartDate}
                setValue={setBlanketStartDate}
              />
            </div>
          </div>
          {/* VOYAGE NUMBER */}
          <div className="col-6"></div>
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
                          style={{ width: "350px" }}
                        >
                          <option>--Select--</option>
                              {container.sizeType &&
                            !containerType.find(
                              (ct) => ct.Name === container.sizeType,
                            ) && (
                              <option value={container.sizeType}>
                                {container.sizeType}
                              </option>
                            )}
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
