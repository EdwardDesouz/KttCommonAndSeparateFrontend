import "./styles/index.css";
import { UserProvider } from "./userContex/userContex";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/loginPage";
import Index from "./pages/indexpage";
import Inpayment from "./pages/Inpayment/inPaymentList";
import InpaymentNew from "./pages/Inpayment/inpaymentNew";
import Innonpayment from "./pages/Innonpayment/innonPayment";
import Out from "./pages/Out/outPage";
import Transhipment from "./pages/Transhipment/transhipmentPage";
import Coo from "./pages/Coo/cooPage";




function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/index" element={<Index />} />
          <Route path="/inpayment" element={<Inpayment />} />
          <Route path="/inpayment/new" element={<InpaymentNew />} />
          <Route path="/innonpayment" element={<Innonpayment />} />
          <Route path="/out" element={<Out />} />
          <Route path="/transhipment" element={<Transhipment />} />
          <Route path="/coo" element={<Coo />} />
          
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
