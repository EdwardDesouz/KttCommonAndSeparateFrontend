import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import API from "../../../api/api";
import { currentPopup, fetchPopupData, SearchPopup } from "./cargoFunctions";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; 

function Cargo({ setActiveTab }) {
  const [totalOuterPack, setTotalOuterPack] = useState([]);
  const [containerType, setContainerType] = useState([]);
  const totalGrossWeightOptions = ["KGM", "TNE"];

  // fetch declaration type
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
  const [releaseCode, setReleaseCode] = useState("");
  const [releaseLocationCode, setReleaseLocationCode] = useState("");
  const [releaseLocationDescription, setReleaseLocationDescription] =
    useState("");
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
  const [receiptCode, setReceiptCode] = useState("");
  const [receiptLocationCode, setReceiptLocationCode] = useState("");
  const [receiptLocationDescription, setReceiptLocationDescription] =
    useState("");
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
  // ======================== LOADING PORT========================
  const [loadingPort, setLoadingPort] = useState(null);
  const [loadingPortCode, setLoadingPortCode] = useState("");
  const [loadingPortName, setLoadingPortName] = useState("");
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

  // Date Function
  const [cargoArrivalDate, setCargoArrivalDate] = useState("");
  const [error, setError] = useState(false);

  // Helper to get today's date in DD/MM/YYYY
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Convert string DD/MM/YYYY to Date object for DatePicker
  const parseDate = (val) => {
    if (!val) return null;
    const parts = val.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  };

  const handleBlur = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setError(false);

    if (!val) {
      setCargoArrivalDate(getTodayDate());
      return;
    }

    if (val.length === 8) {
      const day = parseInt(val.slice(0, 2), 10);
      const month = parseInt(val.slice(2, 4), 10);
      const year = val.slice(4, 8);

      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        setCargoArrivalDate(
          `${String(day).padStart(2, "0")}/${String(month).padStart(
            2,
            "0",
          )}/${year}`,
        );
      } else {
        setCargoArrivalDate(getTodayDate());
        setError(true);
      }
    } else if (val.length === 10) {
      const [dayStr, monthStr, yearStr] = val.split("/");
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);

      if (!(day >= 1 && day <= 31 && month >= 1 && month <= 12)) {
        setCargoArrivalDate(getTodayDate());
        setError(true);
      } else {
        setCargoArrivalDate(val);
      }
    } else {
      setCargoArrivalDate(getTodayDate());
      setError(true);
    }
  };

  // Handle spacebar key to set today
  const handleKeyDown = (e) => {
    if (e.key === " " || e.keyCode === 32) {
      e.preventDefault();
      setCargoArrivalDate(getTodayDate());
    }
  };

  // State for containers
  const [containers, setContainers] = useState([
    { id: 1, number: "", sizeType: "", weight: "", seal: "" },
  ]);

  // Add new container
  const addContainer = () => {
    const newId = containers.length + 1;
    setContainers([
      ...containers,
      { id: newId, number: "", sizeType: "", weight: "", seal: "" },
    ]);
  };

  // Delete a single container
  const deleteContainer = (id) => {
    setContainers(containers.filter((c) => c.id !== id));
  };

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
              <label className="col-sm-4 col-form-label">
                TOTAL OUTER PACK
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  id="CargoTotalOuterPack"
                  className="form-control-mandatory"
                />
              </div>
              <div className="col-sm-5">
                <select
                  className="Dropdown HighLight mandatory"
                  id="CargoOuterPack"
                >
                  <option>--Select--</option>
                  {totalOuterPack.map((tooupack) => (
                    <option key={tooupack.Name} value={tooupack.Name}>
                      {tooupack.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TOTAL GROSS WEIGHT */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-4 col-form-label">
                TOTAL GROSS WEIGHT
              </label>
              <div className="col-sm-2">
                <input
                  type="text"
                  className="form-control-mandatory"
                  id="CargoTotalGrossweight"
                />
              </div>
              <div className="col-sm-5">
                <select
                  className="Dropdown HighLight mandatory"
                  id="CargoTotalGrossUOM"
                >
                  <option>--Select--</option>
                  {totalGrossWeightOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PERMIT GROSS WEIGHT */}
            <div className="row align-items-center compact-row">
              <label className="col-sm-4 col-form-label">
                PERMIT GROSS WEIGHT
              </label>
              <div className="col-sm-7">
                <input
                  type="text"
                  id="CargoPermitGrossWeight"
                  className="form-control"
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
                  id="releaseLocationText"
                  className="form-control"
                  value={releaseLocationDescription}
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
                <input type="text" id="CargoMode" className="form-control" />
              </div>
            </div>

            {/* LOADING PORT */}
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

            {/* HAWB */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">HAWB</label>
              <div className="col-sm-7">
                <input type="text" id="CargoHbl" className="form-control" />
              </div>
            </div>

            {/* ARRIVAL DATE */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">ARRIVAL DATE</label>
              {/* <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  value={cargoArrivalDate}
                  onChange={(e) => setCargoArrivalDate(e.target.value)}
                  onBlur={handleBlur}
                />
              </div> */}
              <div className="col-sm-7">
                 <DatePicker
                  selected={parseDate(cargoArrivalDate)}
                  onChange={(date) => {
                    if (!date) return;
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    setCargoArrivalDate(`${day}/${month}/${year}`);
                    setError(false);
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.keyCode === 32) {
                      e.preventDefault();
                      setCargoArrivalDate(getTodayDate());
                    }
                  }}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* BLANKET START DATE */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">
                BLANKET START DATE
              </label>
              <div className="col-sm-7">
                <input type="text" className="form-control" />
              </div>
            </div>
          </div>

          <div className="col-6">
            {/* VOYAGE NUMBER */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">VOYAGE NUMBER</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" />
              </div>
            </div>

            {/* VESSEL NAME */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">VESSEL NAME</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" />
              </div>
            </div>

            {/* FLIGHT NUMBER */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">FLIGHT NUMBER</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" />
              </div>
            </div>

            {/* AIRCRAFT REG NO */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">AIRCRAFT REG NO</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" />
              </div>
            </div>

            {/* MAWB */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">MAWB</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" />
              </div>
            </div>

            {/* OBL */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">OBL</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" />
              </div>
            </div>

            {/* CONVEYANCE NO */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">CONVEYANCE NO</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" />
              </div>
            </div>

            {/* TRANSPORT ID */}
            <div className="row align-items-center compact-row mb-3">
              <label className="col-sm-4 col-form-label">TRANSPORT ID</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTAINER INFO */}
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
              onClick={() => setContainers([])}
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
                  <th></th>
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
                      <input type="checkbox" />
                    </td>
                    <td>
                      <FaEdit style={{ width: "20px", cursor: "pointer" }} />
                    </td>
                    <td>
                      <FaTrash
                        style={{ width: "15px", cursor: "pointer" }}
                        onClick={() => deleteContainer(container.id)}
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
                      />
                    </td>
                    <td>
                      <select className="Dropdown HighLighty">
                        <option>--Select--</option>
                        {containerType.map((contype) => (
                          <option key={contype.Name} value={contype.Name}>
                            {contype.Name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
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
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="ButtonClick SaveContainer"
                      >
                        SaveContainer
                      </button>
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

      {/* BOTTOM BUTTONS */}
      <div className="mt-3 d-flex justify-content-center gap-3">
        <button
          className="NextpageBtns"
          onClick={() => setActiveTab("PartyTab")}
        >
          PREVIOUS
        </button>
        <button className="NextpageBtns">RESET</button>
        <button
          className="NextpageBtns"
          onClick={() => setActiveTab("InvoiceTab")}
        >
          NEXT
        </button>
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

export default Cargo;
