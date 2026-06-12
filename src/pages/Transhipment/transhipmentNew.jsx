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
    { id: "AproveHsCodeFinder", label: "APRHSCODEFINDER" },
    { id: "HsCodeFinder", label: "HSCODEFINDER" },
  ];

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
            <Header setActiveTab={setActiveTab} isViewMode={isViewMode} />
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
