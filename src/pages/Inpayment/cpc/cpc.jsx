import { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useInpayment } from "../context/inpaymentContext";

function Cpc({ setActiveTab }) {
  const {
    showAeo, setShowAeo,
    showCwc, setShowCwc,
    cnBChecked, setCnBChecked,
    showScheme, setShowScheme,
    aeoRows, setAeoRows,
    cwcRows, setCwcRows,
    schemeRows, setSchemeRows,
  } = useInpayment();

  const maxRows = 5;

  const emptyRow = () => ({
    ProcessingCode1: "",
    ProcessingCode2: "",
    ProcessingCode3: "",
  });

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
      i === rowIndex ? { ...row, [field]: value } : row,
    );
    setRows(newRows);
  };


useEffect(() => {
  const logRows = (type, rows) => {
    console.group(`CPC TYPE: ${type}`);
    rows.forEach((row, index) => {
      console.log(`Row ${index + 1}`, {
        ProcessingCode1: row.ProcessingCode1,
        ProcessingCode2: row.ProcessingCode2,
        ProcessingCode3: row.ProcessingCode3,
      });
    });
    console.groupEnd();
  };
  if (showAeo) logRows("AEO", aeoRows);
  if (showCwc) logRows("CWC", cwcRows);
  if (showScheme) logRows("SCHEME", schemeRows);
  if (cnBChecked) {
    console.group("CPC TYPE: CNB");
    console.log("CNB is ACTIVE (no rows attached)");
    console.groupEnd();
  }
}, [aeoRows, cwcRows, schemeRows, cnBChecked, showAeo, showCwc, showScheme]);

const renderTable = (rows, setRows) => (
    <>
      <div className="col-12 mb-2">
        <div className="row fw-bold text-center">
          <div className="col-sm-2"></div>
          <div className="col-sm-1"></div>
          <div className="col-sm-2">Processing Code 1</div>
          <div className="col-sm-2">Processing Code 2</div>
          <div className="col-sm-2">Processing Code 3</div>
          <div className="col-sm-1"></div>
        </div>
      </div>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="col-12">
          <div className="row align-items-center compact-row">
            <label className="col-sm-2 col-form-label"></label>
            <div className="col-sm-1 icon-contaniner">
              {rowIndex === rows.length - 1 && (
                <FaPlus
                  style={{
                    cursor: rows.length >= maxRows ? "not-allowed" : "pointer",
                    opacity: rows.length >= maxRows ? 0.4 : 1,
                  }}
                  onClick={() => addRow(rows, setRows)}
                />
              )}
            </div>
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
            <div className="col-sm-1">
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
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">AEO</label>
          <div className="col-sm-1 icon-contaniner">
            <input
              type="checkbox"
              id="Aeo"
              checked={showAeo}
              onChange={toggleCheckbox(setShowAeo)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        </div>
        {showAeo && renderTable(aeoRows, setAeoRows)}
      </div>

      {/* CWC */}
      <div className="col-12">
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">CWC</label>
          <div className="col-sm-1 icon-contaniner">
            <input
              type="checkbox"
              id="Cwc"
              checked={showCwc}
              onChange={toggleCheckbox(setShowCwc)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        </div>
        {showCwc && renderTable(cwcRows, setCwcRows)}
      </div>

      {/* CNB */}
      <div className="col-12">
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">CNB</label>
          <div className="col-sm-1 icon-contaniner">
            <input
              type="checkbox"
              id="Cnb"
              checked={cnBChecked}
              onChange={toggleCheckbox(setCnBChecked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>

      {/* SCHEME */}
      <div className="col-12">
        <div className="row align-items-center compact-row">
          <label className="col-sm-2 col-form-label">SCHEME</label>
          <div className="col-sm-1 icon-contaniner">
            <input
              type="checkbox"
              id="Scheme"
              checked={showScheme}
              onChange={toggleCheckbox(setShowScheme)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </div>
        </div>
        {showScheme && renderTable(schemeRows, setSchemeRows)}
      </div>

      {/* Navigation */}
      <div className="mt-4 d-flex justify-content-center gap-3">
        <button className="NextpageBtns" onClick={() => setActiveTab("ItemTab")}>
          PREVIOUS
        </button>
        <button className="NextpageBtns" onClick={() => setActiveTab("SummaryTab")}>
          NEXT
        </button>
      </div>
    </div>
  );
}

export default Cpc;