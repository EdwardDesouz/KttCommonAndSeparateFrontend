import { useState } from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import SgTime from "../components/sgTime";
import BackPage from "../components/backPage";

function Index() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    if (!value) return;
    navigate(`/${value}`);
  };

  return (
    <div className="InpaymentNewStyles mt-5 container px-4">
      <BackPage />
      <SgTime />
       <div className="index-container">
        <div className="index-card">
          <h2 className="index-title">Select Declaration Type</h2>
          <select
            className="custom-dropdown"
            value={selected}
            onChange={handleChange}
          >
            <option value="">--CHOOSE OPTION--</option>
            <option value="inpayment">INPAYMENT</option>
            <option value="innonpayment">INNONPAYMENT</option>
            <option value="out">OUT</option>
            <option value="transhipment">TRANSHIPMENT</option>
            <option value="coo">COO</option>
          </select>
          {selected && (
            <div className="selected-info">
              You selected: <strong>{selected}</strong>
            </div>
          )}
        </div>
      </div>
   </div>
  );
}

export default Index;
