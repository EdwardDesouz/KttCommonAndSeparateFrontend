import React, { useState, useEffect } from "react";
import API from "../../../api/api";

export default function InvoiceCalculator() {
  // Term Type
  const [termType, setTermType] = useState([]);
  const [termTypeSelected, setTermTypeSelected] = useState("");
  const [showFreightRow, setShowFreightRow] = useState(true);
  const [showInsuranceRow, setShowInsuranceRow] = useState(true);
  const [gstCharge, setGstCharge] = useState(9);

  // Currency
  const [currency, setCurrency] = useState([]);

  // ========================= Invoice States =========================
  const [invoiceCurrency, setInvoiceCurrency] = useState("");
  const [invoiceExRate, setInvoiceExRate] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState(""); // user input
  const [invoiceDollar, setInvoiceDollar] = useState("");

  const [otherValueInput, setOtherValueInput] = useState(""); // user input %
  const [otherValueCurrency, setOtherValueCurrency] = useState("");
  const [otherValueExRate, setOtherValueExRate] = useState("");
  const [otherValueAmount, setOtherValueAmount] = useState(""); // calculated
  const [otherValueDollar, setOtherValueDollar] = useState("");

  const [freightValueInput, setFreightValueInput] = useState(""); // user input %
  const [freightValueCurrency, setFreightValueCurrency] = useState("");
  const [freightValueExRate, setFreightValueExRate] = useState("");
  const [freightValueAmount, setFreightValueAmount] = useState(""); // calculated
  const [freightValueDollar, setFreightValueDollar] = useState("");

  const [insuranceChargesInput, setInsuranceChargesInput] = useState(""); // user input %
  const [insuranceValueCurrency, setInsuranceValueCurrency] = useState("");
  const [insuranceValueExRate, setInsuranceValueExRate] = useState("");
  const [insuranceValueAmount, setInsuranceValueAmount] = useState(""); // calculated
  const [insuranceValueDollar, setInsuranceValueDollar] = useState("");

  const [cifTotal, setCifTotal] = useState("0.00");
  const [gstTotal, setGstTotal] = useState("0.00");

  // ========================= Fetch Term Type =========================
  useEffect(() => {
    API.get("/getTermTypeFromCommonMaster/")
      .then((res) => setTermType(res.data))
      .catch((err) => console.error("Failed to fetch term type", err));
  }, []);

  // ========================= Fetch Currency =========================
  useEffect(() => {
    API.get("/getCommonCurrencyTableInfo/")
      .then((res) => setCurrency(res.data))
      .catch((err) => console.error("Failed to fetch currency", err));
  }, []);

  // ========================= Term Type Change =========================
  const handleTermChange = (val) => {
    setTermTypeSelected(val);

    // Reset all user inputs and calculated amounts
    setInvoiceAmount(""); setInvoiceDollar("");
    setOtherValueInput(""); setOtherValueAmount(""); setOtherValueDollar("");
    setFreightValueInput(""); setFreightValueAmount(""); setFreightValueDollar("");
    setInsuranceChargesInput(""); setInsuranceValueAmount(""); setInsuranceValueDollar("");

    setInvoiceCurrency(""); setOtherValueCurrency(""); setFreightValueCurrency(""); setInsuranceValueCurrency("");
    setInvoiceExRate(""); setOtherValueExRate(""); setFreightValueExRate(""); setInsuranceValueExRate("");

    setGstCharge(9);
    setShowFreightRow(true); setShowInsuranceRow(true);

    // Default insurance/freight based on term
    if (val === "CFR : Cost and Frieght ( also known as C & F )") {
      setShowFreightRow(false);
      setInsuranceChargesInput("1.00");
      setInsuranceValueCurrency("SGD");
      setInsuranceValueExRate("1.0");
    } else if (val === "CIF : Cost,Insurance and Frieght") {
      setShowFreightRow(false);
      setShowInsuranceRow(false);
    } else if (val === "CNI : Cost and Insurance (also Known as C & I )") {
      setShowInsuranceRow(false);
    } else if (
      val === "EXW : Exw Works (also known as Ex-Factory)" ||
      val === "FAS : Free Alongside Ship" ||
      val === "FOB : Free On Board"
    ) {
      setInsuranceChargesInput("1.00");
      setInsuranceValueCurrency("SGD");
      setInsuranceValueExRate("1.0");
    }
  };

  // ========================= Currency Change =========================
  const handleCurrencyChange = (currencyName, row) => {
    const selected = currency.find((item) => item.Currency === currencyName);
    const rate = selected ? parseFloat(selected.CurrencyRate) : 0;

    if (row === "invoice") setInvoiceCurrency(currencyName), setInvoiceExRate(rate);
    else if (row === "other") setOtherValueCurrency(currencyName), setOtherValueExRate(rate);
    else if (row === "freight") setFreightValueCurrency(currencyName), setFreightValueExRate(rate);
    else if (row === "insurance") setInsuranceValueCurrency(currencyName), setInsuranceValueExRate(rate);

    calculateAllAmounts();
  };

  // ========================= Input Change =========================
  const handleInputChange = (value, row) => {
    if (row === "invoice") setInvoiceAmount(value);
    else if (row === "other") setOtherValueInput(value);
    else if (row === "freight") setFreightValueInput(value);
    else if (row === "insurance") setInsuranceChargesInput(value);

    calculateAllAmounts();
  };

  // ========================= Calculation =========================
  const calculateAllAmounts = () => {
    const invAmount = parseFloat(invoiceAmount) || 0;
    const invEx = parseFloat(invoiceExRate) || 0;
    const invDollar = invAmount * invEx;
    setInvoiceDollar(invDollar.toFixed(2));

    const othInput = parseFloat(otherValueInput) || 0;
    const othAmount = invDollar * (othInput / 100);
    const othEx = parseFloat(otherValueExRate) || 0;
    setOtherValueAmount(othAmount.toFixed(2));
    const othDollar = othAmount * othEx;
    setOtherValueDollar(othDollar.toFixed(2));

    const frInput = parseFloat(freightValueInput) || 0;
    const frAmount = othDollar * (frInput / 100);
    const frEx = parseFloat(freightValueExRate) || 0;
    setFreightValueAmount(frAmount.toFixed(2));
    const frDollar = frAmount * frEx;
    setFreightValueDollar(frDollar.toFixed(2));

    const insInput = parseFloat(insuranceChargesInput) || 0;
    const insAmount = (invDollar + othDollar + frDollar) * (insInput / 100);
    const insEx = parseFloat(insuranceValueExRate) || 0;
    setInsuranceValueAmount(insAmount.toFixed(2));
    const insDollar = insAmount * insEx;
    setInsuranceValueDollar(insDollar.toFixed(2));

    const totalCIF = invDollar + othDollar + frDollar + insDollar;
    setCifTotal(totalCIF.toFixed(2));

    const gstPercent = parseFloat(gstCharge) || 0;
    setGstTotal((totalCIF * gstPercent / 100).toFixed(2));
  };

  // ========================= Table JSX =========================
  return (
    <div className="col-12 mt-3">
      <div className="table-responsive">
        <table id="InvoiceCalculationTable">
          <thead>
            <tr>
              <th>ITEM</th>
              <th>CHARGES (%)</th>
              <th>CURRENCY</th>
              <th>EX.RATE</th>
              <th>AMOUNT</th>
              <th>AMOUNT ($)</th>
            </tr>
          </thead>
          <tbody>
            {/* INVOICE VALUE */}
            <tr>
              <td>INVOICE VALUE</td>
              <td></td>
              <td>
                <select
                  value={invoiceCurrency}
                  onChange={(e) => handleCurrencyChange(e.target.value, "invoice")}
                  className="Dropdown HighLight"
                  style={{ width: "70%" }}
                >
                  <option value="">--Select--</option>
                  {currency.map((cur) => (
                    <option key={cur.Currency} value={cur.Currency}>{cur.Currency}</option>
                  ))}
                </select>
              </td>
              <td><input type="number" value={invoiceExRate} disabled className="inputStyle" /></td>
              <td><input type="number" value={invoiceAmount} onChange={(e) => handleInputChange(e.target.value, "invoice")} className="inputStyle" /></td>
              <td><input type="number" value={invoiceDollar} disabled className="inputStyle" /></td>
            </tr>

            {/* OTHER VALUE */}
            <tr>
              <td>OTHER VALUE</td>
              <td><input type="number" value={otherValueInput} onChange={(e) => handleInputChange(e.target.value, "other")} className="inputStyle" /></td>
              <td>
                <select value={otherValueCurrency} onChange={(e) => handleCurrencyChange(e.target.value, "other")} className="Dropdown" style={{ width: "70%" }}>
                  <option value="">--Select--</option>
                  {currency.map((cur) => <option key={cur.Currency} value={cur.Currency}>{cur.Currency}</option>)}
                </select>
              </td>
              <td><input type="number" value={otherValueExRate} disabled className="inputStyle" /></td>
              <td><input type="number" value={otherValueAmount} className="inputStyle" /></td>
              <td><input type="number" value={otherValueDollar} disabled className="inputStyle" /></td>
            </tr>

            {/* FREIGHT VALUE */}
            {showFreightRow && (
              <tr>
                <td>FREIGHT VALUE (INCL. OTHER VALUE)</td>
                <td><input type="number" value={freightValueInput} onChange={(e) => handleInputChange(e.target.value, "freight")} className="inputStyle" /></td>
                <td>
                  <select value={freightValueCurrency} onChange={(e) => handleCurrencyChange(e.target.value, "freight")} className="Dropdown" style={{ width: "70%" }}>
                    <option value="">--Select--</option>
                    {currency.map((cur) => <option key={cur.Currency} value={cur.Currency}>{cur.Currency}</option>)}
                  </select>
                </td>
                <td><input type="number" value={freightValueExRate} disabled className="inputStyle" /></td>
                <td><input type="number" value={freightValueAmount} disabled className="inputStyle" /></td>
                <td><input type="number" value={freightValueDollar} disabled className="inputStyle" /></td>
              </tr>
            )}

            {/* INSURANCE VALUE */}
            {showInsuranceRow && (
              <tr>
                <td>INSURANCE VALUE (INCL. OTHER VALUE)</td>
                <td><input type="number" value={insuranceChargesInput} onChange={(e) => handleInputChange(e.target.value, "insurance")} className="inputStyle" /></td>
                <td>
                  <select value={insuranceValueCurrency} onChange={(e) => handleCurrencyChange(e.target.value, "insurance")} className="Dropdown" style={{ width: "70%" }}>
                    <option value="">--Select--</option>
                    {currency.map((cur) => <option key={cur.Currency} value={cur.Currency}>{cur.Currency}</option>)}
                  </select>
                </td>
                <td><input type="number" value={insuranceValueExRate} disabled className="inputStyle" /></td>
                <td><input type="number" value={insuranceValueAmount} disabled className="inputStyle" /></td>
                <td><input type="number" value={insuranceValueDollar} disabled className="inputStyle" /></td>
              </tr>
            )}

            {/* CIF Total */}
            <tr>
              <td>COST, INSURANCE & FREIGHT</td>
              <td colSpan="4"></td>
              <td><input type="number" value={cifTotal} disabled className="inputStyle" /></td>
            </tr>

            {/* GST */}
            <tr>
              <td>GST</td>
              <td><input type="number" value={gstCharge} onChange={(e) => { setGstCharge(e.target.value); calculateAllAmounts(); }} className="inputStyle" /></td>
              <td colSpan="3"></td>
              <td><input type="number" value={gstTotal} disabled className="inputStyle" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}