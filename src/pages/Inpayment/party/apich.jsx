import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaSearch, FaPlus } from "react-icons/fa";
import { UserContext } from "../userContex/userContex";

export default function ImporterForm({ fetchImporterList }) {
  const { user } = useContext(UserContext);

  // Controlled states
  const [importer, setImporter] = useState(null);
  const [importerCode, setImporterCode] = useState("");
  const [importerCruei, setImporterCruei] = useState("");
  const [importerName, setImporterName] = useState("");
  const [importerName1, setImporterName1] = useState("");

  const [importerSuggestions, setImporterSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showImporterDropdown, setShowImporterDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [importerError, setImporterError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch suggestions on mount
  useEffect(() => {
    const fetchImporters = async () => {
      try {
        const res = await axios.get("/getCommonImporterTable/");
        setImporterSuggestions(res.data);
        setFilteredSuggestions(res.data);
      } catch (err) {
        console.error("Failed to fetch importers", err);
      }
    };
    fetchImporters();
  }, []);

  // Handle typing in Code field
  const handleImporterChange = (e) => {
    const val = e.target.value;
    setImporterCode(val);
    setImporterError(false);

    if (!val) {
      setShowImporterDropdown(false);
      setImporter(null);
      setFilteredSuggestions(importerSuggestions);
      return;
    }

    const filtered = importerSuggestions.filter(
      (i) => i.Code.toLowerCase().startsWith(val.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowImporterDropdown(filtered.length > 0);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    if (!showImporterDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 >= filteredSuggestions.length ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev - 1 < 0 ? filteredSuggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      selectSuggestion(filteredSuggestions[highlightedIndex]);
    }
  };

  const selectSuggestion = (item) => {
    setImporter(item);
    setImporterCode(item.Code);
    setImporterCruei(item.CRUEI);
    setImporterName(item.Name);
    setImporterName1(item.Name1);
    setShowImporterDropdown(false);
  };

  const handleFocusOut = () => {
    setTimeout(() => setShowImporterDropdown(false), 100);
  };

  // --- Save Importer ---
  const saveImporter = async () => {
    try {
      setImporterError(false);

      if (!importerCode || importerCode.trim() === "") {
        setImporterError(true);
        alert("Please fill the Code");
        return;
      }

      const duplicate = importerSuggestions.some(
        (i) =>
          i &&
          i.Code &&
          i.Code.toLowerCase() === importerCode.toLowerCase() &&
          i.Id !== (importer?.Id || null)
      );

      if (duplicate) {
        alert("Duplicate code found! Importer not saved.");
        return;
      }

      const payload = {
        Id: importer?.Id || null,
        Code: importerCode,
        CRUEI: importerCruei || "",
        Name: importerName || "",
        Name1: importerName1 || "",
        TouchUser: user?.username.toUpperCase() || "UNKNOWN",
        TouchTime: new Date().toISOString(),
      };

      setLoading(true);
      const response = await axios.post("/postImporterTable/", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);

      if (response.status === 201) {
        alert("Importer saved successfully!");
        setImporter(null);
        setImporterCode("");
        setImporterCruei("");
        setImporterName("");
        setImporterName1("");
        fetchImporterList(); // refresh suggestions
      } else {
        alert("Failed to save importer");
      }
    } catch (err) {
      setLoading(false);
      console.error("Failed to save importer:", err);
      alert("Error saving importer. Check console for details.");
    }
  };

  return (
    <div className="row align-items-center compact-row">
      <label className="col-sm-2 col-form-label">IMPORTER</label>
      <div className="col-sm-1">
        <FaSearch style={{ cursor: "pointer" }} />
        <FaPlus style={{ cursor: "pointer" }} onClick={saveImporter} />
      </div>
      <div className="col-sm-1 position-relative">
        <input
          id="importerCode"
          className="form-control"
          placeholder="CODE"
          value={importerCode}
          onChange={handleImporterChange}
          onKeyDown={handleKeyDown}
          onBlur={handleFocusOut}
          onFocus={() => setImporterError(false)}
        />
        {showImporterDropdown && filteredSuggestions.length > 0 && (
          <div className="dropdown-suggestions">
            {filteredSuggestions.map((item, index) => (
              <div
                key={item.Code}
                className="dropdown-item"
                style={{
                  backgroundColor:
                    index === highlightedIndex ? "#234263" : "white",
                  color: index === highlightedIndex ? "white" : "black",
                  cursor: "pointer",
                }}
                onMouseDown={() => selectSuggestion(item)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {item.Code} - {item.Name}
              </div>
            ))}
          </div>
        )}
        {importerError && (
          <span className="text-danger" style={{ fontSize: "0.8rem" }}>
            FILL THE CODE
          </span>
        )}
      </div>

      <div className="col-sm-2">
        <input
          id="importerCruei"
          className="form-control"
          placeholder="CRUEI"
          value={importerCruei}
          onChange={(e) => setImporterCruei(e.target.value)}
        />
      </div>
      <div className="col-sm-3">
        <input
          id="importerName"
          className="form-control"
          placeholder="NAME"
          value={importerName}
          onChange={(e) => setImporterName(e.target.value)}
        />
      </div>
      <div className="col-sm-3">
        <input
          id="importerName1"
          className="form-control"
          placeholder="NAME1"
          value={importerName1}
          onChange={(e) => setImporterName1(e.target.value)}
        />
      </div>
    </div>
  );
}