import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SgTime from "../../components/sgTime";
import BackPage from "../../components/backPage";
import Header from "./header/header";
import Party from "./party/party";
import Cargo from "./cargo/cargo";
import Item from "./item/item";
import Cpc from "./cpc/cpc";
import Amend from "./amend/amend";
import Refund from "./reFund/reFund";
import Cancel from "./cancel/cancel";
import Summary from "./summary/summary";
import API from "../../api/api";

import { TranshipmentProvider } from "./context/transhipmentContext";
import TranshipmentEditLoader from "./transhipmentEditLoader";
import { useTranshipment } from "./context/transhipmentContext";

// ── Inner component has access to both location AND context ──────────────────
function TranshipmentNewInner({ permitId, isEditMode, isViewMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { permitDetails } = useTranshipment();

  const [activeTab, setActiveTab] = useState(
    location.state?.openTab || "HeaderTab",
  );

  useEffect(() => {
    if (location.state?.openTab) {
      setActiveTab(location.state.openTab);
    }
  }, [permitDetails?.prmtStatus]);

  const isAmd = permitDetails?.prmtStatus === "AMD";
  const isRfd = permitDetails?.prmtStatus === "RFD";
  const isCnl = permitDetails?.prmtStatus === "CNL";

  const tabs = [
    { id: "HeaderTab", label: "HEADER" },
    { id: "PartyTab", label: "PARTY" },
    { id: "CargoTab", label: "CARGO" },
    { id: "ItemTab", label: "ITEM" },
    { id: "CpcTab", label: "CPC" },
    { id: "SummaryTab", label: "SUMMARY" },
    { id: "RefundTab", label: "REFUND", hidden: !isRfd },
    { id: "AmendTab", label: "AMEND", hidden: !isAmd },
    { id: "CancelTab", label: "CANCEL", hidden: !isCnl },
  ];

  const buttons_std = [
    { id: "ExitForm", label: "EXITFORM" },
    { id: "ExchangeRate", label: "EXCHANGE RATE" },
    { id: "AproveHsCodeFinder", label: "APRHSCODEFINDER" },
    { id: "HsCodeFinder", label: "HSCODEFINDER" },
  ];

  // ===================== EXCHANGE RATE MODAL =====================
  const [showExchangeRateModal, setShowExchangeRateModal] = useState(false);
  const [exchangeRateDate, setExchangeRateDate] = useState("");
  const [exchangeRates, setExchangeRates] = useState([]);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(false);
  const [exchangeRateError, setExchangeRateError] = useState("");

  const handleOpenExchangeRateModal = () => {
    setExchangeRateDate("");
    setExchangeRates([]);
    setExchangeRateError("");
    setShowExchangeRateModal(true);
  };

  const handleCloseExchangeRateModal = () => {
    setShowExchangeRateModal(false);
    setExchangeRateDate("");
    setExchangeRates([]);
    setExchangeRateError("");
  };

  const handleExchangeRateDateChange = async (e) => {
    const value = e.target.value;
    setExchangeRateDate(value);
    setExchangeRates([]);
    setExchangeRateError("");

    if (!value) return;

    setExchangeRateLoading(true);
    try {
      const response = await API.get(`/getExchangeRateByDate/?date=${value}`);
      const records = response?.data?.Records || [];

      if (!records.length) {
        setExchangeRateError("No exchange rate data found for this date.");
        return;
      }

      setExchangeRates(records);
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
      const backendMessage = err?.response?.data?.error;
      setExchangeRateError(
        backendMessage || "Failed to fetch exchange rate for this date.",
      );
    } finally {
      setExchangeRateLoading(false);
    }
  };

  return (
    <>
      <TranshipmentEditLoader
        permitId={permitId}
        isEditMode={isEditMode || isViewMode}
      />
      <div className="InpaymentNewStyles mt-5 container px-4">
        {/* <BackPage /> */}
        <SgTime />
        <div className="top-level-tab-row g-0">
          <section
            className="NewBtnsContainer"
            style={{ backgroundColor: "white", padding: "10px" }}
          >
            <div className="d-flex gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  id={tab.id}
                  className={`NewBtns ${activeTab === tab.id ? "HeadTabStyleChange" : ""} ${tab.hidden ? "hidden" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="d-flex gap-2 flex-wrap ms-auto">
              {isViewMode ? (
                <button
                  type="button"
                  className="StdBtns"
                  onClick={() => window.close()}
                >
                  CLOSE
                </button>
              ) : (
                buttons_std.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    id={tab.id}
                    className={`StdBtns ${activeTab === tab.id ? "StdBtnActive" : ""} ${tab.hidden ? "hidden" : ""}`}
                    onClick={() => {
                      if (tab.id === "ExitForm") {
                        navigate(-1);
                      } else if (tab.id === "ExchangeRate") {
                        handleOpenExchangeRateModal();
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                  >
                    {tab.label}
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        <div className={`tab-content ${isViewMode ? "view-mode" : ""}`}>
          {activeTab === "HeaderTab" && (
            <Header
              setActiveTab={setActiveTab}
              isViewMode={isViewMode}
              isEditMode={isEditMode}
            />
          )}
          {activeTab === "PartyTab" && (
            <Party setActiveTab={setActiveTab} isViewMode={isViewMode} />
          )}
          {activeTab === "CargoTab" && (
            <Cargo setActiveTab={setActiveTab} isViewMode={isViewMode} />
          )}
          {activeTab === "ItemTab" && (
            <Item setActiveTab={setActiveTab} isViewMode={isViewMode} />
          )}
          {activeTab === "CpcTab" && (
            <Cpc setActiveTab={setActiveTab} isViewMode={isViewMode} />
          )}
          {activeTab === "SummaryTab" && (
            <Summary setActiveTab={setActiveTab} isViewMode={isViewMode} />
          )}
          {activeTab === "AmendTab" && (
            <Amend setActiveTab={setActiveTab} isViewMode={isViewMode} />
          )}
          {activeTab === "RefundTab" && (
            <Refund setActiveTab={setActiveTab} isViewMode={isViewMode} />
          )}
          {activeTab === "CancelTab" && (
            <Cancel setActiveTab={setActiveTab} isViewMode={isViewMode} />
          )}
        </div>
        {/* ===================== EXCHANGE RATE MODAL ===================== */}
        {showExchangeRateModal && (
          <>
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
              onClick={handleCloseExchangeRateModal}
            />
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
                width: "480px",
                maxHeight: "80vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
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
                  flexShrink: 0,
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                  EXCHANGE RATE
                </span>
                <span
                  style={{
                    cursor: "pointer",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                  onClick={handleCloseExchangeRateModal}
                >
                  ✕
                </span>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: "20px 24px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                <label
                  style={{
                    fontWeight: "600",
                    fontSize: "13px",
                    marginBottom: "6px",
                    display: "block",
                    color: "#333",
                  }}
                >
                  SELECT DATE
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={exchangeRateDate}
                  onChange={handleExchangeRateDateChange}
                  style={{ marginBottom: "16px" }}
                />

                {exchangeRateLoading && (
                  <div style={{ fontSize: "13px", color: "#555" }}>
                    Loading exchange rates...
                  </div>
                )}

                {!exchangeRateLoading && exchangeRateError && (
                  <div style={{ fontSize: "13px", color: "red" }}>
                    {exchangeRateError}
                  </div>
                )}

                {!exchangeRateLoading && exchangeRates.length > 0 && (
                  <table
                    className="table table-bordered table-sm"
                    style={{ fontSize: "0.8rem", marginTop: "10px" }}
                  >
                    <thead>
                      <tr>
                        <th>CURRENCY</th>
                        <th>RATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchangeRates.map((rate, idx) => (
                        <tr key={idx}>
                          <td>{rate.Currency}</td>
                          <td>{rate.Rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "12px 24px 20px 24px",
                  display: "flex",
                  justifyContent: "flex-end",
                  flexShrink: 0,
                }}
              >
                <button
                  className="NextpageBtns"
                  onClick={handleCloseExchangeRateModal}
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
                  CLOSE
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── Outer wrapper provides the context ───────────────────────────────────────
function TranshipmentNew() {
  const { permitId } = useParams();
  const location = useLocation();
  const isViewMode = location.pathname.includes("/transhipment/view/");
  const isEditMode = Boolean(permitId) && !isViewMode;

  return (
    <TranshipmentProvider key={permitId || "new"}>
      <TranshipmentNewInner
        permitId={permitId}
        isEditMode={isEditMode}
        isViewMode={isViewMode}
      />
    </TranshipmentProvider>
  );
}

export default TranshipmentNew;
