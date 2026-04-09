import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SgTime from "../../components/sgTime";
import BackPage from "../../components/backPage";
import Header from "./header/header";
import Party from "./party/party";
import Cargo from "./cargo/cargo";
import Invoice from "./invoice/invoice";
import Item from "./item/item";
import Cpc from "./cpc/cpc";
import Summary from "./summary/summary";
import { InpaymentProvider } from "./context/inpaymentContext";



function InpaymentNew() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("HeaderTab");
  const tabs = [
    { id: "HeaderTab", label: "HEADER" },
    { id: "PartyTab", label: "PARTY" },
    { id: "CargoTab", label: "CARGO" },
    { id: "InvoiceTab", label: "INVOICE" },
    { id: "ItemTab", label: "ITEM" },
    { id: "CpcTab", label: "CPC" },
    { id: "SummaryTab", label: "SUMMARY" },
    { id: "RefundTab", label: "AMEND", hidden: true },
    { id: "AmendTab", label: "CANCEL", hidden: true },
    { id: "CancelTab", label: "REFUND", hidden: true },
  ];

  const buttons_std = [
    { id: "ExitForm", label: "EXITFORM" },
    { id: "AproveHsCodeFinder", label: "APRHSCODEFINDER" },
    { id: "HsCodeFinder", label: "HSCODEFINDER" },
  ];

  return (
     <InpaymentProvider>
    <div className="InpaymentNewStyles mt-5 container px-4">
      <BackPage />
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
            {buttons_std.map((tab) => (
              <button
                key={tab.id}
                type="button"
                id={tab.id}
                className={`StdBtns  ${activeTab === tab.id ? "StdBtnActive" : ""} ${tab.hidden ? "hidden" : ""}`}
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
            ))}
          </div>
          
        </section>
      </div>
      <div className="tab-content">
        {activeTab === "HeaderTab" && <Header setActiveTab={setActiveTab} />}
        {activeTab === "PartyTab" && <Party setActiveTab={setActiveTab} />}
        {activeTab === "CargoTab" && <Cargo setActiveTab={setActiveTab} />}
        {activeTab === "InvoiceTab" && <Invoice setActiveTab={setActiveTab} />}
        {activeTab === "ItemTab" && <Item setActiveTab={setActiveTab} />}
        {activeTab === "CpcTab" && <Cpc setActiveTab={setActiveTab} />}
        {activeTab === "SummaryTab" && <Summary setActiveTab={setActiveTab} />}

        {activeTab === "RefundTab" && (
          <div>
            <h3>Amend</h3>
            <p>Refund/Amend details go here.</p>
          </div>
        )}
        {activeTab === "AmendTab" && (
          <div>
            <h3>Cancel</h3>
            <p>Cancel details go here.</p>
          </div>
        )}
        {activeTab === "CancelTab" && (
          <div>
            <h3>Refund</h3>
            <p>Refund details go here.</p>
          </div>
        )}


      </div>
    </div>
    </InpaymentProvider>
  );
}

export default InpaymentNew;
