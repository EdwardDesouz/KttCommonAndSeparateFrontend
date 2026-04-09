import React, { useState } from "react";

function Cpc({ setActiveTab }) {
  const [showAeo, setShowAeo] = useState(false);
  const [showCwc, setShowCwc] = useState(false);
  const [cnBChecked, setCnBChecked] = useState(false);
  const [showScheme, setShowScheme] = useState(false);

  const maxRows = 5;

  const emptyRow = () => ({
    ProcessingCode1: "",
    ProcessingCode2: "",
    ProcessingCode3: "",
  });

  const [aeoRows, setAeoRows] = useState([emptyRow()]);
  const [cwcRows, setCwcRows] = useState([emptyRow()]);
  const [schemeRows, setSchemeRows] = useState([emptyRow()]);

  const toggleCheckbox = (setter) => () => setter((prev) => !prev);

  const addRow = (rows, setRows) => {
    if (rows.length >= maxRows) return alert("EXCEED THE MAXIMUM NUMBERS (5)");
    setRows([...rows, emptyRow()]);
  };

  const deleteRow = (index, rows, setRows) => {
    if (rows.length === 1) return alert("At least one row must remain.");
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleInputChange = (rowIndex, field, value, rows, setRows) => {
    const newRows = rows.map((row, i) =>
      i === rowIndex ? { ...row, [field]: value } : row
    );
    setRows(newRows);
  };

  const renderTable = (rows, setRows, cpcType) => (
    <>
      {/* ✅ Button Row */}
      <div className="col-12 mb-1">
        <div className="row align-items-center">

          <div className="col-sm-2"></div>

          {/* Add Row button aligned with Code 1 */}
          <div className="col-sm-2 text-start">
            <button
              type="button"
              className="AddRowBtn"
              disabled={rows.length >= maxRows}
              onClick={() => addRow(rows, setRows)}
              style={{
                opacity: rows.length >= maxRows ? 0.4 : 1,
                cursor: rows.length >= maxRows ? "not-allowed" : "pointer",
              }}
            >
              Add Row
            </button>
          </div>

          <div className="col-sm-2"></div>
          <div className="col-sm-2"></div>
          <div className="col-sm-2"></div>
        </div>
      </div>

      {/* ✅ Header Row */}
      <div className="col-12 mb-2">
        <div className="row fw-bold text-center">
          <div className="col-sm-2"></div>
          <div className="col-sm-2">Processing Code 1</div>
          <div className="col-sm-2">Processing Code 2</div>
          <div className="col-sm-2">Processing Code 3</div>
          <div className="col-sm-2"></div>
        </div>
      </div>

      {/* ✅ Data Rows */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="col-12">
          <div className="row align-items-center compact-row">

            <label className="col-sm-2 col-form-label">
              {cpcType} ROW {rowIndex + 1}
            </label>

            <div className="col-sm-2">
              <input
                type="text"
                className="form-control"
                value={row.ProcessingCode1}
                onChange={(e) =>
                  handleInputChange(rowIndex, "ProcessingCode1", e.target.value, rows, setRows)
                }
              />
            </div>

            <div className="col-sm-2">
              <input
                type="text"
                className="form-control"
                value={row.ProcessingCode2}
                onChange={(e) =>
                  handleInputChange(rowIndex, "ProcessingCode2", e.target.value, rows, setRows)
                }
              />
            </div>

            <div className="col-sm-2">
              <input
                type="text"
                className="form-control"
                value={row.ProcessingCode3}
                onChange={(e) =>
                  handleInputChange(rowIndex, "ProcessingCode3", e.target.value, rows, setRows)
                }
              />
            </div>

            <div className="col-sm-2">
              <button
                type="button"
                className="DeleteContainerBtn"
                disabled={rows.length === 1}
                style={{
                  opacity: rows.length === 1 ? 0.4 : 1,
                  cursor: rows.length === 1 ? "not-allowed" : "pointer",
                }}
                onClick={() => deleteRow(rowIndex, rows, setRows)}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="row g-2 container mt-4">

      {/* AEO */}
      <div className="col-12">
        <div className="row align-items-center">
          <label className="col-sm-2 col-form-label">AEO</label>
          <div className="col-sm-1">
            <input
              type="checkbox"
              checked={showAeo}
              onChange={toggleCheckbox(setShowAeo)}
            />
          </div>
        </div>
        {showAeo && renderTable(aeoRows, setAeoRows, "AEO")}
      </div>

      {/* CWC */}
      <div className="col-12">
        <div className="row align-items-center">
          <label className="col-sm-2 col-form-label">CWC</label>
          <div className="col-sm-1">
            <input
              type="checkbox"
              checked={showCwc}
              onChange={toggleCheckbox(setShowCwc)}
            />
          </div>
        </div>
        {showCwc && renderTable(cwcRows, setCwcRows, "CWC")}
      </div>

      {/* CNB */}
      <div className="col-12">
        <div className="row align-items-center">
          <label className="col-sm-2 col-form-label">CNB</label>
          <div className="col-sm-1">
            <input
              type="checkbox"
              checked={cnBChecked}
              onChange={toggleCheckbox(setCnBChecked)}
            />
          </div>
        </div>
      </div>

      {/* SCHEME */}
      <div className="col-12">
        <div className="row align-items-center">
          <label className="col-sm-2 col-form-label">SCHEME</label>
          <div className="col-sm-1">
            <input
              type="checkbox"
              checked={showScheme}
              onChange={toggleCheckbox(setShowScheme)}
            />
          </div>
        </div>
        {showScheme && renderTable(schemeRows, setSchemeRows, "SCHEME")}
      </div>

      {/* Navigation */}
      <div className="mt-4 d-flex justify-content-center gap-3">
        <button onClick={() => setActiveTab("ItemTab")}>PREVIOUS</button>
        <button onClick={() => setActiveTab("SummaryTab")}>NEXT</button>
      </div>

    </div>
  );
}

export default Cpc;