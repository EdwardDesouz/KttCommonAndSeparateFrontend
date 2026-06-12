import { useEffect, useState, useRef } from "react";
import ListButtons from "../../components/innonListSlideButtons";
import SgTime from "../../components/sgTime";
import API from "../../api/api";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import BackPage from "../../components/backPage";
import { useNavigate } from "react-router-dom";

function Inpayment() {
  const navigate = useNavigate();
  const [selectedPermits, setSelectedPermits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [mailData, setMailData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState({});
  const [permitFilter, setPermitFilter] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [showInTransmitData, setShowInTransmitData] = useState(false);
  const [inDecType, setInDecType] = useState([]);
  const [inDecTypeSelected, setInDecTypeSelected] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const tableDataRef = useRef([]);

  //   //=========Button Visible State===========================

  const [btnState, setBtnState] = useState({
    SUBMIT: false,
    PRINTGST: false,
    PRINTREFUND: false,
    COPY: false,
    REFUND: false,
    AMEND: false,
    CANCEL: false,
    PRINTSTATUS: false,
    DOWNLOADCCP: false,
    DOWNLOADDATA: false,
    PRINTCCP: false,
    GSTSTATUS: false,
    PRINTGSTALL: false,
    GSTEXCEL: false,
  });

  const updateButtonStates = (selectedIds, allData) => {
    const enabled = {
      SUBMIT: true,
      PRINTGST: true,
      PRINTREFUND: true,
      COPY: true,
      REFUND: true,
      AMEND: true,
      CANCEL: true,
      PRINTSTATUS: true,
      DOWNLOADCCP: true,
      DOWNLOADDATA: true,
      PRINTCCP: true,
      GSTSTATUS: true,
      PRINTGSTALL: true,
      GSTEXCEL: true,
    };

    if (selectedIds.length === 0) {
      // all disabled when nothing selected
      Object.keys(enabled).forEach((k) => (enabled[k] = false));
      setBtnState({ ...enabled });
      return;
    }

    const selectedRows = allData.filter((row) =>
      selectedIds.includes(row.PermitId),
    );
    const statuses = selectedRows.map((r) => r.Status?.toUpperCase() || "");

    if (selectedIds.length === 1) {
      const status = statuses[0];

      if (status === "APR" || status === "AME") {
        enabled.SUBMIT = false;
        enabled.PRINTREFUND = false;
        enabled.PRINTSTATUS = false;
      }

      if (status === "DEL") {
        enabled.SUBMIT = false;
        enabled.PRINTGST = false;
        enabled.PRINTREFUND = false;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.PRINTSTATUS = false;
        enabled.DOWNLOADCCP = false;
        enabled.DOWNLOADDATA = false;
        enabled.PRINTCCP = false;
        enabled.GSTSTATUS = false;
        enabled.PRINTGSTALL = false;
        enabled.GSTEXCEL = false;
      }

      if (status === "ERR") {
        enabled.SUBMIT = false;
        enabled.PRINTGST = false;
        enabled.PRINTREFUND = false;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.PRINTSTATUS = false;
        enabled.DOWNLOADCCP = false;
        enabled.DOWNLOADDATA = false;
        enabled.PRINTCCP = false;
        enabled.GSTSTATUS = false;
        enabled.PRINTGSTALL = false;
        enabled.GSTEXCEL = true;
      }

      if (status === "NEW") {
        enabled.PRINTREFUND = false;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.PRINTSTATUS = false;
        enabled.GSTSTATUS = false;
        enabled.PRINTGSTALL = false;
        enabled.DOWNLOADCCP = true;
        enabled.PRINTCCP = true;
      }
      if (status === "DRF") {
        enabled.PRINTREFUND = false;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.PRINTSTATUS = false;
        enabled.GSTSTATUS = true;
        enabled.PRINTGSTALL = true;
        enabled.DOWNLOADCCP = true;
        enabled.PRINTCCP = true;
        enabled.SUBMIT = false;
      }
      if (
        status === "SAVEASDRF" ||
        status === "DISCONNECT" ||
        status === "PEN"
      ) {
        enabled.SUBMIT = false;
      }

      if (status === "CNL") {
        enabled.SUBMIT = false;
        enabled.PRINTGST = false;
        enabled.PRINTREFUND = false;
        enabled.COPY = false;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.DOWNLOADCCP = false;
        enabled.DOWNLOADDATA = false;
        enabled.PRINTCCP = false;
        enabled.GSTSTATUS = false;
        enabled.PRINTGSTALL = false;
        enabled.GSTEXCEL = true;
      }

      if (status === "CNP") {
        enabled.SUBMIT = false;
        enabled.PRINTGST = true;
        enabled.PRINTREFUND = false;
        enabled.COPY = true;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.DOWNLOADCCP = false;
        enabled.DOWNLOADDATA = true;
        enabled.PRINTCCP = false;
        enabled.GSTSTATUS = false;
        enabled.PRINTGSTALL = true;
        enabled.GSTEXCEL = true;
      }

      if (status === "QRY") {
        enabled.SUBMIT = false;
        enabled.PRINTGST = true;
        enabled.PRINTREFUND = false;
        enabled.COPY = true;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.DOWNLOADCCP = true;
        enabled.DOWNLOADDATA = true;
        enabled.PRINTCCP = true;
        enabled.GSTSTATUS = false;
        enabled.PRINTGSTALL = true;
        enabled.GSTEXCEL = true;
      }

      if (status === "RFD") {
        enabled.SUBMIT = false;
        enabled.PRINTGST = false;
        enabled.COPY = false;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.DOWNLOADCCP = false;
        enabled.DOWNLOADDATA = false;
        enabled.PRINTCCP = false;
        enabled.PRINTSTATUS = false;
        enabled.GSTSTATUS = false;
        enabled.PRINTGSTALL = false;
        enabled.GSTEXCEL = true;
      }
      if (status === "WFA") {
        enabled.SUBMIT = false;
        enabled.PRINTGST = true;
        enabled.COPY = true;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.DOWNLOADCCP = true;
        enabled.DOWNLOADDATA = true;
        enabled.PRINTCCP = true;
        enabled.PRINTSTATUS = true;
        enabled.GSTSTATUS = true;
        enabled.PRINTGSTALL = false;
        enabled.GSTEXCEL = true;
      }

      if (status === "REJ") {
        enabled.SUBMIT = false;
        enabled.PRINTGST = false;
        enabled.PRINTREFUND = false;
        enabled.REFUND = false;
        enabled.AMEND = false;
        enabled.CANCEL = false;
        enabled.DOWNLOADCCP = false;
        enabled.DOWNLOADDATA = false;
        enabled.PRINTCCP = false;
        enabled.GSTSTATUS = false;
        enabled.PRINTGSTALL = false;
        enabled.GSTEXCEL = false;
        enabled.PRINTSTATUS = true;
      }
    }

    if (selectedIds.length > 1) {
      enabled.SUBMIT = false;
      enabled.PRINTGST = false;
      enabled.PRINTREFUND = false;
      enabled.COPY = false;
      enabled.REFUND = false;
      enabled.AMEND = false;
      enabled.CANCEL = false;
      enabled.PRINTSTATUS = false;
      enabled.GSTSTATUS = false;
      enabled.DOWNLOADCCP = false;
      enabled.DOWNLOADDATA = false;
      enabled.PRINTCCP = false;
      enabled.PRINTGSTALL = false;
      enabled.GSTEXCEL = false;

      // check if all same status
      const allSame = statuses.every((s) => s === statuses[0]);
      const commonStatus = statuses[0];

      if (allSame) {
        if (commonStatus === "APR") {
          enabled.DOWNLOADCCP = true;
          enabled.DOWNLOADDATA = true;
          enabled.PRINTCCP = true;
          enabled.PRINTGSTALL = true;
          enabled.GSTEXCEL = true;
        } else if (commonStatus === "NEW") {
          enabled.DOWNLOADDATA = true;
          enabled.PRINTCCP = true;
          enabled.DOWNLOADCCP = false;
          enabled.PRINTGSTALL=true;
        } else if (commonStatus === "DRF" || commonStatus === "SAVEASDRF") {
          enabled.DOWNLOADDATA = true;
          enabled.PRINTCCP = false;
          enabled.DOWNLOADCCP = false;
          enabled.PRINTGSTALL = true;
        } else if (commonStatus === "AME") {
          enabled.DOWNLOADCCP = true;
          enabled.PRINTCCP = true;
        } else if (
          commonStatus === "CNL" ||
          commonStatus === "RFD" ||
          commonStatus === "QRY" ||
          commonStatus === "REJ" ||
          commonStatus === "ERR" ||
          commonStatus === "DEL"
        ) {
          enabled.DOWNLOADCCP = false;
          enabled.DOWNLOADDATA = false;
          enabled.PRINTCCP = false;
          enabled.PRINTGSTALL = false;
          enabled.GSTEXCEL = true;
        }
      }
    }
    setBtnState({ ...enabled });
  };

  const handleCheckboxChange = (permitId, checked) => {
    const updated = checked
      ? [...selectedPermits, permitId]
      : selectedPermits.filter((id) => id !== permitId);
    setSelectedPermits(updated);
    updateButtonStates(updated, tableDataRef.current);
  };

  const handleSelectAll = (checked) => {
    const updated = checked ? currentRows.map((r) => r.PermitId) : [];
    setSelectedPermits(updated);
    updateButtonStates(updated, tableDataRef.current);
  };

  const clearSelection = () => {
    setSelectedPermits([]);
    updateButtonStates([], tableDataRef.current);
  };

  useEffect(() => {
    localStorage.removeItem("permitFilter");
  }, []);

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
    { header: "MESSAGE", accessor: "MSG" },
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
    fetchTableData(false);
    fetchMailData();
    fetchInpaymentDeclarationTypeDate();
  }, []);

  const fetchTableData = async (all = false) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const Username = userData?.username;
      console.log("Fetching inpayment list for user:", Username);
      const response = await API.get("innonpaymentList/", {
        params: { user: Username, all: all ? "true" : "false" },
      });
      setTableData(response.data);
      tableDataRef.current = response.data;
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
      navigate(`/innonpayment/edit/${permitId}`, {
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

  const fetchInpaymentDeclarationTypeDate = async () => {
    try {
      const response = await API.get(
        "/getDeclarationTypeFromCommonMasterForInpayment/",
      );
      setInDecType(response.data);
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
      fetchTableData(showAll);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleInTransmit = async () => {
    if (!selectedPermits.length || !inDecTypeSelected) return;

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const username = userData?.username;
      const touchTime = new Date().toISOString().slice(0, 19).replace("T", " ");

      const response = await API.post("/transmitInnonpayment/", {
        permitIds: selectedPermits,
        declarationType: inDecTypeSelected,
        user: username,
        touchTime: touchTime,
      });

      alert(response.data.message || "Transmit successful");
      setSelectedPermits([]);
      setInDecTypeSelected("");
      setShowInTransmitData(false);
      fetchTableData(showAll);
    } catch (error) {
      console.error("Inpayment Transmit failed:", error);
      alert(error.response?.data?.error || "Transmit failed");
    }
  };

  const isInTransmitReady =
    selectedPermits.length > 0 && inDecTypeSelected !== "";

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
    let searchPass = true;
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toUpperCase();
      searchPass = columns
        .filter((col) => !actionColumns.includes(col.accessor))
        .some((col) => {
          const cell = row[col.accessor]?.toString().toUpperCase() || "";
          return cell.includes(query);
        });
    }
    return statusPass && columnsPass && permitPass && searchPass;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, columnFilters, permitFilter, searchQuery, rowsPerPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <ListButtons
            newPath="/innonpayment/new"
            selectedPermits={selectedPermits}
            setSelectedPermits={setSelectedPermits}
            refreshTable={() => fetchTableData(showAll)}
            btnState={btnState}
            clearSelection={clearSelection}
          />
          <div>
            <ul className="filters">
              <li>
                <button
                  className="btn2"
                  disabled={!btnState.DOWNLOADCCP}
                  style={{
                    opacity: btnState.DOWNLOADCCP ? 1 : 0.4,
                    cursor: btnState.DOWNLOADCCP ? "pointer" : "not-allowed",
                  }}
                  onClick={async () => {
                    if (!selectedPermits.length) {
                      alert("Please select at least one permit.");
                      return;
                    }
                    const data = selectedPermits.join(",");
                    window.location.assign(
                      `${API.defaults.baseURL}downloadCcp/?data=${data}`,
                    );
                    clearSelection();
                  }}
                >
                  DOWNLOAD CCP
                </button>
              </li>
              <li>
                <button
                  className="btn2"
                  disabled={!btnState.DOWNLOADDATA}
                  style={{
                    opacity: btnState.DOWNLOADDATA ? 1 : 0.4,
                    cursor: btnState.DOWNLOADDATA ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (!selectedPermits.length) {
                      alert("Please select at least one permit.");
                      return;
                    }
                    const data = selectedPermits.join(",");
                    window.location.assign(
                      `${API.defaults.baseURL}downloadData/?data=${data}`,
                    );
                  }}
                >
                  DOWNLOAD DATA
                </button>
              </li>
              <li>
                <button
                  className="btn2"
                  disabled={!btnState.GSTSTATUS}
                  style={{
                    opacity: btnState.GSTSTATUS ? 1 : 0.4,
                    cursor: btnState.GSTSTATUS ? "pointer" : "not-allowed",
                  }}
                  onClick={async () => {
                    if (!selectedPermits.length) {
                      alert("Please select at least one permit.");
                      return;
                    }
                    const permitId = selectedPermits[0];
                    try {
                      const response = await API.get("/gstStatus/", {
                        params: { PermitId: permitId },
                      });
                      alert(response.data.message);
                      fetchTableData(showAll);
                    } catch (error) {
                      const errMsg =
                        error.response?.data?.error ||
                        "Failed to update GST status.";
                      alert(errMsg);
                    }
                  }}
                >
                  GST STATUS
                </button>
              </li>
              <li>
                <button
                  className="btn2"
                  disabled={!btnState.PRINTGSTALL}
                  style={{
                    opacity: btnState.PRINTGSTALL ? 1 : 0.4,
                    cursor: btnState.PRINTGSTALL ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (!selectedPermits.length) {
                      alert("Please select at least one permit.");
                      return;
                    }
                    const data = selectedPermits.join(",");
                    window.location.assign(
                      `${API.defaults.baseURL}printGstAll/?data=${data}`,
                    );
                  }}
                >
                  PRINT GST ALL
                </button>
              </li>
              <li>
                <button
                  className="btn2"
                  disabled={!btnState.PRINTCCP}
                  style={{
                    opacity: btnState.PRINTCCP ? 1 : 0.4,
                    cursor: btnState.PRINTCCP ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (!selectedPermits.length) {
                      alert("Please select at least one permit.");
                      return;
                    }
                    selectedPermits.forEach((permitId) => {
                      window.open(
                        `${API.defaults.baseURL}printCcp/${permitId}/`,
                        "_blank",
                      );
                    });
                  }}
                >
                  PRINT CCP
                </button>
              </li>
              <li>
                <button
                  className="btn2"
                  disabled={!btnState.PRINTSTATUS}
                  style={{
                    opacity: btnState.PRINTSTATUS ? 1 : 0.4,
                    cursor: btnState.PRINTSTATUS ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (!selectedPermits.length) {
                      alert("Please select at least one permit.");
                      return;
                    }
                    const permitId = selectedPermits[0];
                    window.location.assign(
                      `${API.defaults.baseURL}printStatus/${permitId}/`,
                    );
                  }}
                >
                  PRINT STATUS
                </button>
              </li>
              <li>
                <button
                  className="btn2"
                  disabled={!btnState.GSTEXCEL}
                  style={{
                    opacity: btnState.GSTEXCEL ? 1 : 0.4,
                    cursor: btnState.GSTEXCEL ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (!selectedPermits.length) {
                      alert("Please select at least one permit.");
                      return;
                    }
                    const data = selectedPermits.join(",");
                    window.location.assign(
                      `${API.defaults.baseURL}gstExcel/?data=${data}`,
                    );
                  }}
                >
                  GST EXCEL
                </button>
              </li>
              <li>
                <button className="btn2">VDP GST</button>
              </li>
              <li>
                <button
                  className="btn2"
                  onClick={() => {
                    const next = !showAll;
                    setShowAll(next);
                    fetchTableData(next);
                  }}
                >
                  {showAll ? "3 MONTHS" : "ALL LIST"}
                </button>
              </li>
            </ul>
          </div>
          <div className="col-12">
            <div size="10" md="12" className="p-1 declaration-filters">
              <ul className="filters">
                <li>NO OF ROWS</li>
                <li>
                  <select
                    className="Dropdown"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={50000}>ALL</option>
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
                  <button
                    className="btn1"
                    onClick={async () => {
                      if (!selectedPermits.length) {
                        alert("Please select at least one permit.");
                        return;
                      }
                      const mailboxId =
                        document.getElementById("MailBoxCopyId").value;
                      if (!mailboxId) {
                        alert("Please select a mailbox.");
                        return;
                      }
                      try {
                        const userData = JSON.parse(
                          localStorage.getItem("user"),
                        );
                        const username = userData?.username;
                        const touchTime = new Date()
                          .toISOString()
                          .slice(0, 19)
                          .replace("T", " ");
                        const response = await API.post(
                          "/mailboxTransmitData/",
                          {
                            permitIds: selectedPermits,
                            mailboxId: mailboxId,
                            user: username,
                            touchTime: touchTime,
                          },
                        );
                        alert(response.data.message || "Transmit successful");
                        setSelectedPermits([]);
                        fetchTableData(showAll);
                      } catch (error) {
                        console.error("TransmitData failed:", error);
                        alert(error.response?.data?.error || "Transmit failed");
                      }
                    }}
                  >
                    TransmitData
                  </button>
                </li>
                <li>SEARCH</li>
                <li>
                  <input
                    type="text"
                    className="inputStyle"
                    id="searchInpaymentTableID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  <input
                    type="checkbox"
                    id="g7Check"
                    className="inputStyleCheckBox"
                  />
                  <label htmlFor="g7Check">G7</label>
                </li>
                <li>
                  <input
                    type="checkbox"
                    id="InPaymentCheck"
                    checked={showInTransmitData}
                    onChange={(e) => {
                      setShowInTransmitData(e.target.checked);
                      if (!e.target.checked) setInDecTypeSelected("");
                    }}
                  />
                  <label htmlFor="InPaymentCheck">INPAYMENT</label>
                </li>
                <li>
                  <select
                    className="Dropdown p-2 declaration-filters"
                    style={{ width: "150px", marginLeft: "20px" }}
                    value={permitFilter}
                    onChange={(e) => {
                      setPermitFilter(e.target.value);
                      localStorage.setItem("permitFilter", e.target.value);
                    }}
                  >
                    <option value="">FILTER PERMITS</option>
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
              {showInTransmitData && (
                <ul className="filters">
                  <li>
                    <select
                      className="Dropdown"
                      defaultValue=""
                      value={inDecTypeSelected}
                      onChange={(e) => setInDecTypeSelected(e.target.value)}
                    >
                      <option value="" disabled>
                        --Select--
                      </option>
                      {inDecType.map((name) => (
                        <option key={name.Name} value={name.Name}>
                          {name.Name}
                        </option>
                      ))}
                    </select>
                  </li>
                  <li>
                    <button
                      className="btn1"
                      disabled={!isInTransmitReady}
                      onClick={handleInTransmit}
                    >
                      Transmit
                    </button>
                  </li>
                  {!isInTransmitReady && (
                    <li style={{ color: "#888", fontSize: "12px" }}>
                      {!selectedPermits.length && !inDecTypeSelected
                        ? "Select a permit row and declaration type"
                        : !selectedPermits.length
                          ? "Select at least one permit row"
                          : "Select a declaration type"}
                    </li>
                  )}
                </ul>
              )}
              <div className="table-responsive">
                <table id="inpaymentTable">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          checked={
                            currentRows.length > 0 &&
                            currentRows.every((r) =>
                              selectedPermits.includes(r.PermitId),
                            )
                          }
                        />
                      </th>
                      {columns
                        .filter(
                          (col) =>
                            col.accessor !== "checkbox" &&
                            (actionColumns.includes(col.accessor) ||
                              visibleColumns.includes(col.accessor)),
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
                        <tr key={row.ID}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedPermits.includes(row.PermitId)}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  row.PermitId,
                                  e.target.checked,
                                )
                              }
                            />
                          </td>
                          {columns
                            .filter(
                              (col) =>
                                col.accessor !== "checkbox" &&
                                (actionColumns.includes(col.accessor) ||
                                  visibleColumns.includes(col.accessor)),
                            )
                            .map((col) => {
                              switch (col.accessor) {
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
                                      <FaEye
                                        style={{ cursor: "pointer" }}
                                        onClick={async () => {
                                          try {
                                            await API.get(
                                              "/getCommonHeaderByPermitId/",
                                              {
                                                params: {
                                                  PermitId: row.PermitId,
                                                },
                                              },
                                            );
                                            window.open(
                                              `/innonpayment/view/${row.PermitId}`,
                                              "_blank",
                                            );
                                          } catch (error) {
                                            console.error(
                                              "Error fetching permit data:",
                                              error,
                                            );
                                          }
                                        }}
                                      />
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
                      <th></th>
                      {columns
                        .filter(
                          (col) =>
                            col.accessor !== "checkbox" &&
                            (actionColumns.includes(col.accessor) ||
                              visibleColumns.includes(col.accessor)),
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
