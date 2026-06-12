import "./styles/index.css";
import { UserProvider } from "./userContex/userContex";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/loginPage";
import Index from "./pages/indexpage";
import Inpayment from "./pages/Inpayment/inPaymentList";
import InpaymentNew from "./pages/Inpayment/inpaymentNew";
import Innonpayment from "./pages/Innonpayment/innonPayment";
import InnonpaymentNew from "./pages/Innonpayment/innonpaymentNew";
import Out from "./pages/Out/outList";
import OutNew from "./pages/Out/outNew";
import Transhipment from "./pages/Transhipment/transhipmentList";
import TranshipmentNew from "./pages/Transhipment/transhipmentNew";
import Coo from "./pages/Coo/cooList";
import CooNew from "./pages/Coo/CooNew";
import { InpaymentProvider } from "./pages/Inpayment/context/inpaymentContext";
import { InnonpaymentProvider } from "./pages/Innonpayment/context/innonpaymentContext";
import { OutProvider } from "./pages/Out/context/outContext";
import { TranshipmentProvider } from "./pages/Transhipment/context/transhipmentContext";
import { CooProvider } from "./pages/Coo/context/cooContext";
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/index" element={<Index />} />

          {/* Inpayment */}
          <Route
            path="/inpayment"
            element={
              <InpaymentProvider>
                <Inpayment />
              </InpaymentProvider>
            }
          />
          <Route
            path="/inpayment/new"
            element={
              <InpaymentProvider>
                <InpaymentNew />
              </InpaymentProvider>
            }
          />
          <Route
            path="/inpayment/edit/:permitId"
            element={
              <InpaymentProvider>
                <InpaymentNew />
              </InpaymentProvider>
            }
          />
          <Route path="/inpayment/view/:permitId" element={<InpaymentNew />} />
          {/* --Inpayment-- */}

          {/* Innonpayment */}
          <Route
            path="/innonpayment"
            element={
              <InnonpaymentProvider>
                <Innonpayment />
              </InnonpaymentProvider>
            }
          />
          <Route
            path="/innonpayment/new"
            element={
              <InnonpaymentProvider>
                <InnonpaymentNew />
              </InnonpaymentProvider>
            }
          />
          <Route
            path="/innonpayment/edit/:permitId"
            element={
              <InnonpaymentProvider>
                <InnonpaymentNew />
              </InnonpaymentProvider>
            }
          />
          <Route
            path="/innonpayment/view/:permitId"
            element={<InnonpaymentNew />}
          />
          {/* --Innonpayment-- */}

          {/* Out */}
          <Route
            path="/out"
            element={
              <OutProvider>
                <Out />
              </OutProvider>
            }
          />

          <Route
            path="/out/new"
            element={
              <OutProvider>
                <OutNew />
              </OutProvider>
            }
          />

          <Route
            path="/out/edit/:permitId"
            element={
              <OutProvider>
                <OutNew />
              </OutProvider>
            }
          />

          <Route path="/out/view/:permitId" element={<OutNew />} />
          {/* --Out-- */}

          {/* Transhipment */}
          <Route
            path="/transhipment"
            element={
              <TranshipmentProvider>
                <Transhipment />
              </TranshipmentProvider>
            }
          />
          <Route
            path="/transhipment/new"
            element={
              <TranshipmentProvider>
                <TranshipmentNew />
              </TranshipmentProvider>
            }
          />
          <Route
            path="/transhipment/edit/:permitId"
            element={
              <TranshipmentProvider>
                <TranshipmentNew />
              </TranshipmentProvider>
            }
          />
          <Route
            path="/transhipment/view/:permitId"
            element={<TranshipmentNew />}
          />
          {/* --Transhipment-- */}
          {/* Coo */}
          <Route
            path="/coo"
            element={
              <CooProvider>
                <Coo />
              </CooProvider>
            }
          />
          <Route
            path="/coo/new"
            element={
              <CooProvider>
                <CooNew />
              </CooProvider>
            }
          />

          <Route
            path="/coo/edit/:permitId"
            element={
              <CooProvider>
                <CooNew />
              </CooProvider>
            }
          />
          <Route path="/coo/view/:permitId" element={<CooNew />} />
          {/* --Coo-- */}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
