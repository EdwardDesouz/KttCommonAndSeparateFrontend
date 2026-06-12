import { useEffect, useState, useRef } from "react";
import ListButtons from "../../components/listSlideButtons";
import SgTime from "../../components/sgTime";
import API from "../../api/api";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import BackPage from "../../components/backPage";
import { useNavigate } from "react-router-dom";

function Inpayment() {
  const navigate = useNavigate();
  const [selectedPermits, setSelectedPermits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [tableData, setTableData] = useState([]);
  const [mailData, setMailData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState({});
  const [permitFilter, setPermitFilter] = useState(
    localStorage.getItem("permitFilter") || "",
  );
  const dropdownRef = useRef(null);

  const columns = [
    { header: "", accessor: "checkbox" },
    { header: "DELETE", accessor: "delete" },
    { header: "EDIT", accessor: "edit" },
    { header: "VIEW", accessor: "view" },
    { header: "JOB ID", accessor: "JobId" },
    { header: "MSG ID", accessor: "MSGId" },
    { header: "DECDATE", accessor: "DECDATE" },
    { header: "DECTYPE", accessor: "DECTYPE" },
    { header: "CREATE", accessor: "CREATE_USER" },
    { header: "DECID", accessor: "DECID" },
    { header: "ETA", accessor: "ETA" },
    { header: "PERMITNO", accessor: "PERMITNO" },
    { header: "IMPORTER", accessor: "IMPORTER" },
    { header: "HAWB", accessor: "HAWB" },
    { header: "MAWB/OBL", accessor: "MAWBOBL" },
    { header: "POL", accessor: "POL" },
    { header: "MSGTYPE", accessor: "MSGTYPE" },
    { header: "TPT", accessor: "TPT" },
    { header: "PREPMT", accessor: "PREPMT" },
    { header: "XREF", accessor: "XREF" },
    { header: "INTREM", accessor: "INTREM" },
    { header: "GSTAMT", accessor: "GSTAMT" },
    { header: "STATUS", accessor: "Status" },
  ];

  const defaultHiddenColumns = [
    "JobId",
    "Refid",
    "MessageType",
    "InwardTransportMode",
    "TotalAmtPay",
    "TransmitId",
  ];

  const actionColumns = ["checkbox", "delete", "edit", "view"];

  const showColumnsOptions = columns
    .filter((col) => !actionColumns.includes(col.accessor))
    .map((col) => ({ accessor: col.accessor, header: col.header }));

  useEffect(() => {
    const savedColumns = JSON.parse(localStorage.getItem("visibleColumns"));
    if (savedColumns && Array.isArray(savedColumns)) {
      setVisibleColumns(savedColumns);
    } else {
      setVisibleColumns(
        columns
          .filter(
            (col) =>
              !actionColumns.includes(col.accessor) &&
              !defaultHiddenColumns.includes(col.accessor),
          )
          .map((col) => col.accessor),
      );
    }
  }, []);

  useEffect(() => {
    fetchTableData();
    fetchMailData();
  }, []);

  const fetchTableData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const Username = userData?.username;
      console.log("Fetching inpayment list for user:", Username);
      const response = await API.get("inpaymentList/", {
        params: { user: Username },
      });
      setTableData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setLoading(false);
    }
  };

  const editPermit = async (permitId) => {
    try {
      const response = await API.get("/getCommonHeaderByPermitId/", {
        params: { PermitId: permitId },
      });
      navigate(`/inpayment/edit/${permitId}`, {
        state: { permitData: response.data },
      });
    } catch (error) {
      console.error("Error fetching permit data:", error);
    }
  };

  const fetchMailData = async () => {
    try {
      const response = await API.get("/getManageUserMail/");
      setMailData(response.data);
    } catch (error) {
      console.error("Error fetching mailbox data:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleColumnFilterChange = (e, accessor) => {
    setColumnFilters((prev) => ({
      ...prev,
      [accessor]: e.target.value,
    }));
  };

  const handleDelete = async (permitId) => {
    try {
      await API.get("/deletePermit/", {
        params: { PermitId: permitId },
      });
      fetchTableData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredData = tableData.filter((row) => {
    let statusPass = true;
    const filterValue = statusFilter.toUpperCase();
    const status = row.Status?.toUpperCase() || "";

    if (filterValue === "") {
      statusPass = status !== "DEL";
    } else if (filterValue === "DEL") {
      statusPass = status === "DEL";
    } else {
      statusPass = status.includes(filterValue);
    }

    let columnsPass = true;
    Object.entries(columnFilters).forEach(([accessor, value]) => {
      if (value) {
        const cell = row[accessor]?.toString().toUpperCase() || "";
        if (!cell.includes(value.toUpperCase())) columnsPass = false;
      }
    });

    let permitPass = true;
    if (permitFilter) {
      permitPass = row.Status === permitFilter;
    }

    return statusPass && columnsPass && permitPass;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, columnFilters, permitFilter]);

  const toggleColumn = (accessor) => {
    setVisibleColumns((prev) => {
      const updated = prev.includes(accessor)
        ? prev.filter((col) => col !== accessor)
        : [...prev, accessor];
      localStorage.setItem("visibleColumns", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="InpaymentNewStyles mt-5 container px-4">
      <BackPage />
      <SgTime />
      <div className="row g-2 mt-1">
        <div className="col-12">
          {/* FIX: pass setSelectedPermits so COPY can reset selection */}
          <ListButtons
            newPath="/inpayment/new"
            selectedPermits={selectedPermits}
            setSelectedPermits={setSelectedPermits}
            refreshTable={fetchTableData}
          />
          <div className="col-12">
            <div size="10" md="10" className="p-2 declaration-filters">
              <ul className="filters">
                <li>NO OF ROWS</li>
                <li>
                  <select className="Dropdown">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="50000">ALL</option>
                  </select>
                </li>
                <li>
                  <select className="Dropdown" id="MailBoxCopyId">
                    {mailData.map((mail) => (
                      <option key={mail.MailBoxId} value={mail.MailBoxId}>
                        {mail.MailBoxId}
                      </option>
                    ))}
                  </select>
                </li>
                <li>
                  <button className="btn1">TransmitData</button>
                </li>
                <li>SEARCH</li>
                <li>
                  <input
                    type="text"
                    className="inputStyle"
                    id="searchInpaymentTableID"
                  />
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="g1Check"
                    className="inputStyleCheckBox"
                  />
                  <label htmlFor="g1Check">G1</label>
                </li>
                <li>
                  <input type="checkbox" id="InnonPaymentCheck" />
                  <label htmlFor="InnonPaymentCheck">INNON PAYMENT</label>
                </li>
                <li>FILTER PERMITS</li>
                <li>
                  <select
                    className="Dropdown p-2 declaration-filters"
                    style={{ width: "120px", marginLeft: "20px" }}
                    value={permitFilter}
                    onChange={(e) => {
                      setPermitFilter(e.target.value);
                      localStorage.setItem("permitFilter", e.target.value);
                    }}
                  >
                    <option value="">ALL</option>
                    <option value="NEW">NEW</option>
                    <option value="DRF">DRF</option>
                    <option value="APR">APR</option>
                    <option value="AME">AME</option>
                    <option value="CNL">CNL</option>
                    <option value="QRY">QRY</option>
                    <option value="PEN">PEN</option>
                    <option value="REJ">REJ</option>
                    <option value="ERR">ERR</option>
                    <option value="DEL">DEL</option>
                  </select>
                </li>
                <li ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    className="btn1"
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    ShowColumns
                  </button>
                  {dropdownOpen && (
                    <div
                      className="dropdown-panel"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        border: "1px solid #ccc",
                        background: "#fff",
                        zIndex: 100,
                        width: "250px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        padding: "5px",
                      }}
                    >
                      {showColumnsOptions.map((col) => (
                        <label
                          key={col.accessor}
                          style={{ display: "block", margin: "3px 0" }}
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(col.accessor)}
                            onChange={() => toggleColumn(col.accessor)}
                          />{" "}
                          {col.header}
                        </label>
                      ))}
                    </div>
                  )}
                </li>
              </ul>

              <div
                className="row innon-payment"
                id="OnclickInnonPayMent"
                style={{ display: "none" }}
              >
                <div className="row g-2">
                  <div className="col-12 col-md-3">
                    <select className="Dropdown" id="InNonMailBoxCopyId">
                      {mailData.map((mail) => (
                        <option key={mail.MailBoxId} value={mail.MailBoxId}>
                          {mail.MailBoxId}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-2">
                    <button className="btn1" type="button">
                      TransmitData
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table id="inpaymentTable">
                  <thead>
                    <tr>
                      {columns
                        .filter(
                          (col) =>
                            actionColumns.includes(col.accessor) ||
                            visibleColumns.includes(col.accessor),
                        )
                        .map((col) => (
                          <th key={col.accessor}>{col.header}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={columns.length}>Loading...</td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length}>No records found</td>
                      </tr>
                    ) : (
                      currentRows.map((row) => (
                        // FIX: use row.ID (matches SQL alias "t1.Id AS ID")
                        <tr key={row.ID}>
                          {columns
                            .filter(
                              (col) =>
                                actionColumns.includes(col.accessor) ||
                                visibleColumns.includes(col.accessor),
                            )
                            .map((col) => {
                              switch (col.accessor) {
                                case "checkbox":
                                  return (
                                    <td key={col.accessor}>
                                      <input
                                        type="checkbox"
                                        checked={selectedPermits.includes(
                                          row.PermitId,
                                        )}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedPermits([
                                              ...selectedPermits,
                                              row.PermitId,
                                            ]);
                                          } else {
                                            setSelectedPermits(
                                              selectedPermits.filter(
                                                (id) => id !== row.PermitId,
                                              ),
                                            );
                                          }
                                        }}
                                      />
                                    </td>
                                  );
                                case "delete":
                                  return (
                                    <td key={col.accessor}>
                                      <FaTrash
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          handleDelete(row.PermitId)
                                        }
                                      />
                                    </td>
                                  );
                                case "edit":
                                  return (
                                    <td key={col.accessor}>
                                      <FaEdit
                                        style={{ cursor: "pointer" }}
                                        onClick={() => editPermit(row.PermitId)}
                                      />
                                    </td>
                                  );
                                case "view":
                                  return (
                                    <td key={col.accessor}>
                                      <FaEye style={{ cursor: "pointer" }} />
                                    </td>
                                  );
                                default:
                                  return (
                                    <td key={col.accessor}>
                                      {row[col.accessor]}
                                    </td>
                                  );
                              }
                            })}
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      {columns
                        .filter(
                          (col) =>
                            actionColumns.includes(col.accessor) ||
                            visibleColumns.includes(col.accessor),
                        )
                        .map((col) => (
                          <th key={col.accessor}>
                            <input
                              type="text"
                              className="inputStyle"
                              value={
                                col.accessor === "Status"
                                  ? statusFilter
                                  : columnFilters[col.accessor] || ""
                              }
                              onChange={(e) =>
                                col.accessor === "Status"
                                  ? handleStatusFilterChange(e)
                                  : handleColumnFilterChange(e, col.accessor)
                              }
                            />
                          </th>
                        ))}
                    </tr>
                  </tfoot>
                </table>

                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Prev
                  </button>
                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inpayment;
