<div className="col-12">
  {/* TERM TYPE */}
  <div className="row align-items-center compact-row">
    <div className="col-sm-2 col-form-label">TERM TYPE</div>
    <div className="col-sm-3">
      <select
        className="Dropdown HighLight mandatory"
        value={termTypeSelected}
        onChange={(e) => handleTermChange(e.target.value)}
      >
        <option value="">--Select--</option>
        {termType.map((ttype) => (
          <option key={ttype.Name} value={ttype.Name}>
            {ttype.Name}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* INVOICE CALCULATION TABLE */}
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
                className="Dropdown HighLight"
                style={{ width: "70%" }}
                value={invoiceCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value, "invoice")}
              >
                <option value="">--Select--</option>
                {currency.map((cur) => (
                  <option key={cur.Currency} value={cur.Currency}>
                    {cur.Currency}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="number"
                value={invoiceExRate}
                className="inputStyle"
                disabled
              />
            </td>
            <td>
              <input
                type="number"
                value={invoiceAmount}
                className="inputStyle"
                onChange={(e) => handleAmountChange(e.target.value, "invoice")}
                placeholder="0.00"
              />
            </td>
            <td>
              <input
                type="number"
                value={invoiceDollar}
                className="inputStyle"
                disabled
              />
            </td>
          </tr>

          {/* OTHER VALUE */}
          <tr>
            <td>OTHER VALUE</td>
            <td>
              <input type="number" className="inputStyle" placeholder="0.00" disabled />
            </td>
            <td>
              <select
                className="Dropdown"
                style={{ width: "70%" }}
                value={otherValueCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value, "other")}
              >
                <option value="">--Select--</option>
                {currency.map((cur) => (
                  <option key={cur.Currency} value={cur.Currency}>
                    {cur.Currency}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="number"
                value={otherValueExRate}
                className="inputStyle"
                disabled
                placeholder="0.00"
              />
            </td>
            <td>
              <input
                type="number"
                value={otherValueAmount}
                className="inputStyle"
                onChange={(e) => handleAmountChange(e.target.value, "other")}
                placeholder="0.00"
              />
            </td>
            <td>
              <input
                type="number"
                value={otherValueDollar}
                className="inputStyle"
                disabled
                placeholder="0.00"
              />
            </td>
          </tr>

          {/* FREIGHT VALUE */}
          <tr>
            <td>
              FREIGHT VALUE (INCL. OTHER VALUE)
              <input type="checkbox" className="ms-2 form-check-input" />
            </td>
            <td>
              <input type="number" className="inputStyle" placeholder="0.00" />
            </td>
            <td>
              <select
                className="Dropdown"
                style={{ width: "70%" }}
                value={freightValueCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value, "freight")}
              >
                <option value="">--Select--</option>
                {currency.map((cur) => (
                  <option key={cur.Currency} value={cur.Currency}>
                    {cur.Currency}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="number"
                value={freightValueExRate}
                className="inputStyle"
                disabled
                placeholder="0.00"
              />
            </td>
            <td>
              <input
                type="number"
                value={freightValueAmount}
                className="inputStyle"
                onChange={(e) => handleAmountChange(e.target.value, "freight")}
                placeholder="0.00"
              />
            </td>
            <td>
              <input
                type="number"
                value={freightValueDollar}
                className="inputStyle"
                disabled
                placeholder="0.00"
              />
            </td>
          </tr>

          {/* INSURANCE VALUE */}
          <tr>
            <td>
              INSURANCE VALUE (INCL. OTHER VALUE)
              <input type="checkbox" className="ms-2 form-check-input" />
            </td>
            <td>
              <input type="number" className="inputStyle" placeholder="0.00" />
            </td>
            <td>
              <select
                className="Dropdown"
                style={{ width: "70%" }}
                value={insuranceValueCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value, "insurance")}
              >
                <option value="">--Select--</option>
                {currency.map((cur) => (
                  <option key={cur.Currency} value={cur.Currency}>
                    {cur.Currency}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="number"
                value={insuranceValueExRate}
                className="inputStyle"
                disabled
                placeholder="0.00"
              />
            </td>
            <td>
              <input
                type="number"
                value={insuranceValueAmount}
                className="inputStyle"
                onChange={(e) => handleAmountChange(e.target.value, "insurance")}
                placeholder="0.00"
              />
            </td>
            <td>
              <input
                type="number"
                value={insuranceValueDollar}
                className="inputStyle"
                disabled
                placeholder="0.00"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>










<tbody>
  {/* INVOICE VALUE */}
  <tr>
    <td>INVOICE VALUE</td>
    <td></td>
    <td>
      <select
        className="Dropdown HighLight"
        style={{ width: "70%" }}
        value={invoiceCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value, "invoice")}
      >
        <option value="">--Select--</option>
        {currency.map((cur) => (
          <option key={cur.Currency} value={cur.Currency}>
            {cur.Currency}
          </option>
        ))}
      </select>
    </td>
    <td>
      <input type="number" value={invoiceExRate} disabled className="inputStyle" />
    </td>
    <td>
      <input
        type="number"
        value={invoiceAmount}
        onChange={(e) => handleAmountChange(e.target.value, "invoice")}
        className="inputStyle"
        placeholder="0.00"
      />
    </td>
    <td>
      <input type="number" value={invoiceDollar} disabled className="inputStyle" />
    </td>
  </tr>

  {/* OTHER VALUE */}
  <tr>
    <td>OTHER VALUE</td>
    <td>
      <input type="number" className="inputStyle" disabled placeholder="0.00" />
    </td>
    <td>
      <select
        className="Dropdown"
        style={{ width: "70%" }}
        value={otherValueCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value, "other")}
      >
        <option value="">--Select--</option>
        {currency.map((cur) => (
          <option key={cur.Currency} value={cur.Currency}>
            {cur.Currency}
          </option>
        ))}
      </select>
    </td>
    <td>
      <input type="number" value={otherValueExRate} disabled className="inputStyle" />
    </td>
    <td>
      <input
        type="number"
        value={otherValueAmount}
        onChange={(e) => handleAmountChange(e.target.value, "other")}
        className="inputStyle"
        placeholder="0.00"
      />
    </td>
    <td>
      <input type="number" value={otherValueDollar} disabled className="inputStyle" />
    </td>
  </tr>

  {/* FREIGHT VALUE */}
  {showFreightRow && (
    <tr>
      <td>FREIGHT VALUE (INCL. OTHER VALUE)</td>
      <td>
        <input type="number" defaultValue="0.00" className="inputStyle" />
      </td>
      <td>
        <select
          className="Dropdown"
          style={{ width: "70%" }}
          value={freightValueCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value, "freight")}
        >
          <option value="">--Select--</option>
          {currency.map((cur) => (
            <option key={cur.Currency} value={cur.Currency}>
              {cur.Currency}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input type="number" value={freightValueExRate} disabled className="inputStyle" />
      </td>
      <td>
        <input
          type="number"
          value={freightValueAmount}
          onChange={(e) => handleAmountChange(e.target.value, "freight")}
          className="inputStyle"
          placeholder="0.00"
        />
      </td>
      <td>
        <input type="number" value={freightValueDollar} disabled className="inputStyle" />
      </td>
    </tr>
  )}

  {/* INSURANCE VALUE */}
  {showInsuranceRow && (
    <tr>
      <td>INSURANCE VALUE (INCL. OTHER VALUE)</td>
      <td>
        <input type="number" defaultValue="0.00" className="inputStyle" />
      </td>
      <td>
        <select
          className="Dropdown"
          style={{ width: "70%" }}
          value={insuranceValueCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value, "insurance")}
        >
          <option value="">--Select--</option>
          {currency.map((cur) => (
            <option key={cur.Currency} value={cur.Currency}>
              {cur.Currency}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input type="number" value={insuranceValueExRate} disabled className="inputStyle" />
      </td>
      <td>
        <input
          type="number"
          value={insuranceValueAmount}
          onChange={(e) => handleAmountChange(e.target.value, "insurance")}
          className="inputStyle"
          placeholder="0.00"
        />
      </td>
      <td>
        <input type="number" value={insuranceValueDollar} disabled className="inputStyle" />
      </td>
    </tr>
  )}

  {/* CIF TOTAL */}
  <tr className="InvoiceTotalRow">
    <td>COST, INSURANCE & FREIGHT</td>
    <td colSpan="4"></td>
    <td>
      <input type="number" defaultValue="0.00" className="inputStyle" />
    </td>
  </tr>

  {/* GST */}
  <tr>
    <td>GST</td>
    <td>
      <input type="number" value={gstCharge} className="inputStyle" />
    </td>
    <td colSpan="3"></td>
    <td>
      <input type="number" defaultValue="0.00" className="inputStyle" />
    </td>
  </tr>
</tbody>
















<div className="row align-items-center compact-row">
  <div className="col-sm-2 col-form-label">TERM TYPE</div>
  <div className="col-sm-3">
    <select
      className="Dropdown HighLight mandatory"
      value={termTypeSelected}
      onChange={(e) => handleTermChange(e.target.value)}
      tabIndex="1"
    >
      <option value="">--Select--</option>
      {termType.map((ttype) => (
        <option key={ttype.Name} value={ttype.Name}>
          {ttype.Name}
        </option>
      ))}
    </select>
  </div>

  <div className="col-sm-2 col-form-label">SUPPLIER IMPORTER RELATIONSHIP</div>
  <div className="col-sm-2">
    <select className="form-control">
      <option>--Select--</option>
      {supplierImporterRelationship.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
</div>

{/* FREIGHT ROW */}
{showFreightRow && (
  <div className="row align-items-center compact-row">
    <div className="col-sm-2 col-form-label">FREIGHT VALUE</div>
    <div className="col-sm-2">
      <input
        type="number"
        value={freightValueAmount}
        className="form-control"
        onChange={(e) => handleAmountChange(e.target.value, "freight")}
        placeholder="0.00"
      />
    </div>
    <div className="col-sm-2">
      <select
        className="form-control"
        value={freightValueCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value, "freight")}
      >
        <option value="">--Select--</option>
        {currency.map((cur) => (
          <option key={cur.Currency} value={cur.Currency}>
            {cur.Currency}
          </option>
        ))}
      </select>
    </div>
    <div className="col-sm-2">
      <input
        type="number"
        value={freightValueExRate}
        className="form-control"
        disabled
        placeholder="0.00"
      />
    </div>
    <div className="col-sm-2">
      <input
        type="number"
        value={freightValueDollar}
        className="form-control"
        disabled
        placeholder="0.00"
      />
    </div>
  </div>
)}

{/* INSURANCE ROW */}
{showInsuranceRow && (
  <div className="row align-items-center compact-row">
    <div className="col-sm-2 col-form-label">INSURANCE VALUE</div>
    <div className="col-sm-2">
      <input
        type="number"
        value={insuranceValueAmount}
        className="form-control"
        onChange={(e) => handleAmountChange(e.target.value, "insurance")}
        placeholder="0.00"
      />
    </div>
    <div className="col-sm-2">
      <select
        className="form-control"
        value={insuranceValueCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value, "insurance")}
      >
        <option value="">--Select--</option>
        {currency.map((cur) => (
          <option key={cur.Currency} value={cur.Currency}>
            {cur.Currency}
          </option>
        ))}
      </select>
    </div>
    <div className="col-sm-2">
      <input
        type="number"
        value={insuranceValueExRate}
        className="form-control"
        disabled
        placeholder="0.00"
      />
    </div>
    <div className="col-sm-2">
      <input
        type="number"
        value={insuranceValueDollar}
        className="form-control"
        disabled
        placeholder="0.00"
      />
    </div>
  </div>
)}












const handleTermChange = (val) => {
  setTermTypeSelected(val);

  // Reset all amounts & currencies
  setInvoiceAmount("");
  setInvoiceDollar("");
  setOtherValueAmount("");
  setOtherValueDollar("");
  setFreightValueAmount("");
  setFreightValueDollar("");
  setInsuranceValueAmount("");
  setInsuranceValueDollar("");

  setInvoiceCurrency("");
  setOtherValueCurrency("");
  setFreightValueCurrency("");
  setInsuranceValueCurrency("");

  setInvoiceExRate("");
  setOtherValueExRate("");
  setFreightValueExRate("");
  setInsuranceValueExRate("");

  setGstCharge(9);

  // Default visibility
  setShowFreightRow(true);
  setShowInsuranceRow(true);

  // ---------------- TERM TYPE LOGIC ----------------
  if (val === "CFR : Cost and Frieght ( also known as C & F )") {
    // Seller pays for freight, buyer handles insurance
    setShowFreightRow(false);          // Hide Freight row (included in invoice)
    setInsuranceCharges("1.00");       // Default insurance values
    setInsuranceCurrency("SGD");
    setInsuranceValueExRate("1.000000");
  } else if (val === "CIF : Cost,Insurance and Frieght") {
    // Seller pays for both freight and insurance
    setShowFreightRow(false);          // Hide Freight row
    setShowInsuranceRow(false);        // Hide Insurance row
  } else if (val === "CNI : Cost and Insurance (also Known as C & I )") {
    // Seller pays for insurance only
    setShowInsuranceRow(false);        // Hide Insurance row
  } else if (
    val === "EXW : Exw Works (also known as Ex-Factory)" ||
    val === "FAS : Free Alongside Ship" ||
    val === "FOB : Free On Board"
  ) {
    // Buyer bears most costs; seller minimal responsibility
    setInsuranceCharges("1.00");       // Default insurance values
    setInsuranceCurrency("SGD");
    setInsuranceValueExRate("1.000000");
  } else {
    // Other term types (default)
    setShowFreightRow(true);
    setShowInsuranceRow(true);
    setInsuranceCharges("1.00");
    setInsuranceCurrency("SGD");
    setInsuranceValueExRate("1.000000");
  }
};





<tbody>
  {/* INVOICE VALUE */}
  <tr>
    <td>INVOICE VALUE</td>
    <td></td>
    <td>
      <select
        className="Dropdown HighLight"
        style={{ width: "70%" }}
        value={invoiceCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value, "invoice")}
      >
        <option value="">--Select--</option>
        {currency.map((cur) => (
          <option key={cur.Currency} value={cur.Currency}>{cur.Currency}</option>
        ))}
      </select>
    </td>
    <td><input type="number" value={invoiceExRate} disabled className="inputStyle" /></td>
    <td>
      <input type="number" value={invoiceAmount} className="inputStyle"
             onChange={(e) => handleAmountChange(e.target.value, "invoice")} />
    </td>
    <td><input type="number" value={invoiceDollar} disabled className="inputStyle" /></td>
  </tr>

  {/* OTHER VALUE */}
  <tr>
    <td>OTHER VALUE</td>
    <td><input type="number" className="inputStyle" disabled /></td>
    <td>
      <select className="Dropdown" style={{ width: "70%" }}
              value={otherValueCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value, "other")}>
        <option value="">--Select--</option>
        {currency.map((cur) => (
          <option key={cur.Currency} value={cur.Currency}>{cur.Currency}</option>
        ))}
      </select>
    </td>
    <td><input type="number" value={otherValueExRate} disabled className="inputStyle" /></td>
    <td>
      <input type="number" value={otherValueAmount} className="inputStyle"
             onChange={(e) => handleAmountChange(e.target.value, "other")} />
    </td>
    <td><input type="number" value={otherValueDollar} disabled className="inputStyle" /></td>
  </tr>

  {/* FREIGHT VALUE */}
  {showFreightRow && (
    <tr>
      <td>FREIGHT VALUE (INCL. OTHER VALUE)</td>
      <td><input type="number" className="inputStyle" value={freightValueAmount}
                 onChange={(e) => handleAmountChange(e.target.value, "freight")} /></td>
      <td>
        <select className="Dropdown" style={{ width: "70%" }}
                value={freightValueCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value, "freight")}>
          <option value="">--Select--</option>
          {currency.map((cur) => (
            <option key={cur.Currency} value={cur.Currency}>{cur.Currency}</option>
          ))}
        </select>
      </td>
      <td><input type="number" value={freightValueExRate} disabled className="inputStyle" /></td>
      <td>
        <input type="number" value={freightValueAmount} className="inputStyle"
               onChange={(e) => handleAmountChange(e.target.value, "freight")} />
      </td>
      <td><input type="number" value={freightValueDollar} disabled className="inputStyle" /></td>
    </tr>
  )}

  {/* INSURANCE VALUE */}
  {showInsuranceRow && (
    <tr>
      <td>INSURANCE VALUE (INCL. OTHER VALUE)</td>
      <td><input type="number" className="inputStyle" value={insuranceCharges}
                 onChange={(e) => setInsuranceCharges(e.target.value)} /></td>
      <td>
        <select className="Dropdown" style={{ width: "70%" }}
                value={insuranceValueCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value, "insurance")}>
          <option value="">--Select--</option>
          {currency.map((cur) => (
            <option key={cur.Currency} value={cur.Currency}>{cur.Currency}</option>
          ))}
        </select>
      </td>
      <td><input type="number" value={insuranceValueExRate} disabled className="inputStyle" /></td>
      <td>
        <input type="number" value={insuranceValueAmount} className="inputStyle"
               onChange={(e) => handleAmountChange(e.target.value, "insurance")} />
      </td>
      <td><input type="number" value={insuranceValueDollar} disabled className="inputStyle" /></td>
    </tr>
  )}

  {/* CIF TOTAL */}
  <tr>
    <td>COST, INSURANCE & FREIGHT</td>
    <td colSpan="4"></td>
    <td>
      <input type="number"
             value={(
               (parseFloat(invoiceDollar) || 0) +
               (parseFloat(otherValueDollar) || 0) +
               (parseFloat(showFreightRow ? freightValueDollar : 0) || 0) +
               (parseFloat(showInsuranceRow ? insuranceValueDollar : 0) || 0)
             ).toFixed(2)}
             disabled className="inputStyle" />
    </td>
  </tr>

  {/* GST */}
  <tr>
    <td>GST</td>
    <td><input type="number" value={gstCharge} onChange={(e) => setGstCharge(e.target.value)} className="inputStyle" /></td>
    <td colSpan="3"></td>
    <td>
      <input type="number"
             value={(
               ((parseFloat(invoiceDollar) || 0) +
               (parseFloat(otherValueDollar) || 0) +
               (parseFloat(showFreightRow ? freightValueDollar : 0) || 0) +
               (parseFloat(showInsuranceRow ? insuranceValueDollar : 0) || 0))
               * (parseFloat(gstCharge)/100)
             ).toFixed(2)}
             disabled className="inputStyle" />
    </td>
  </tr>
</tbody>



const payload = {
  PermitId: "PERMIT103",
  SNo: serialNumber,

  InvoiceNo: invoiceNumber,
  InvoiceDate: invoiceDate,
  TermType: termTypeSelected,

  AdValoremIndicator: adValoremIndicator || "No",
  PreDutyRateIndicator: preDutyRateIndicator || "No",
  SupplierImporterRelationship: supplierRelationship || "--Select--",
  SupplierCode: supplierCode || "",
  PartyCode: importerCode || "",

  TICurrency: invoiceCurrency,
  TIExRate: Number(invoiceExRate) || 0,
  TIAmount: Number(invoiceAmount) || 0,
  TISAmount: Number(invoiceDollar) || 0,

  OTCCharge: Number(otherValueCharges) || 0,
  OTCCurrency: otherValueCurrency || "--Select--",
  OTCExRate: Number(otherValueExRate) || 0,
  OTCAmount: Number(otherValueAmount) || 0,
  OTCSAmount: Number(otherValueDollar) || 0,

  FCCharge: Number(freightValueCharges) || 0,
  FCCurrency: freightValueCurrency || "--Select--",
  FCExRate: Number(freightValueExRate) || 0,
  FCAmount: Number(freightValueAmount) || 0,
  FCSAmount: Number(freightValueDollar) || 0,

  ICCharge: Number(insuranceCharges) || 0,
  ICCurrency: insuranceValueCurrency || "SGD",
  ICExRate: Number(insuranceValueExRate) || 1,
  ICAmount: Number(insuranceValueAmount) || 0,
  ICSAmount: Number(insuranceValueDollar) || 0,

  CIFSUMAmount: Number(cifTotal) || 0,

  GSTPercentage: Number(gstCharge) || 0,
  GSTSUMAmount: Number(gstTotal) || 0,

  MessageType: "IPTDEC",

  TouchUser: user.username,
  TouchTime: new Date().toISOString(),

  ChkOtherInv: invoiceInsurance || "No"
};











function itemDutiCalculation(op, inp, inner, inmost, dutiab) {
  var pckqty = 1;
  let dutiAb1 = $("itemDuitableQty").val();
  var typeId = $("#itemDutyIDDummy").val();
  var kgmvisible = $("#kgmvisibleDummy").val();
  let exiceDutyRate = $("#itemExciseDutyInput1").val(); //T1
  let cifob = $("#iteminvoiceCIFFOB").val(); //T2
  let uom = $("#itemHsQuantity").val();
  let hsCode = $("#ItemHsCode").val();

  if (0 < op) {
    pckqty = op;
  }
  if (0 < inp) {
    pckqty = pckqty * inp;
  }
  if (0 < inner) {
    pckqty = pckqty * inner;
  }
  if (0 < inmost) {
    pckqty = inmost * pckqty;
  }
  if (dutiAb1 != "") {
    if (uom == "LTR") {
      $("#ItemTotalDutiableQtyInput").val(
        (Number(pckqty) * Number(dutiab)).toFixed(2),
      );
      $("#ItemHsQtyInput").val((Number(pckqty) * Number(dutiab)).toFixed(2));
    } else if (uom == "KGM" && kgmvisible == "MULTIPLE") {
      $("#ItemTotalDutiableQtyInput").val(
        (Number(pckqty) * Number(dutiab)).toFixed(2),
      );
      if (!hsCode.startsWith("87")) {
        $("#TxtSumExciseDuty").val(
          Number(pckqty) * Number(dutiab) * exiceDutyRate,
        );
      }
      let exciseinput3 = $("#TxtSumExciseDuty").val();
      if (
        $("#declarationType").val() != "GST : GST (Including Duty Exemption)"
      ) {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = exiceDutyRate * gstperval + exciseinput3 * gstperval;
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      } else {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = Number(cifob) * Number(gstperval);
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      }
    } else if (uom == "KGM" && kgmvisible == "DIVIDE") {
      $("#ItemTotalDutiableQtyInput").val(
        ((Number(pckqty) * Number(dutiab)) / 1000).toFixed(2),
      );
      if (!hsCode.startsWith("87")) {
        $("#TxtSumExciseDuty").val(
          ((Number(pckqty) * Number(dutiab)) / 1000) * exiceDutyRate,
        );
      }
      let T3 = $("#TxtSumExciseDuty").val();
      if (
        $("#declarationType").val() != "GST : GST (Including Duty Exemption)"
      ) {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 =
          Number(cifob) * Number(gstperval) + Number(T4) * Number(gstperval);
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      } else {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = Number(cifob) * Number(gstperval);
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      }
    } else if (uom == "STK") {
      $("#ItemTotalDutiableQtyInput").val(pckqty.toFixed(2));
      $("#ItemHsQtyInput").val(((pckqty * dutiab) / 1000).toFixed(2));
      if (!hsCode.startsWith("87")) {
        $("#TxtSumExciseDuty").val(pckqty * exiceDutyRate);
      }
      let T3 = $("#TxtSumExciseDuty").val();
      if (
        $("#declarationType").val() != "GST : GST (Including Duty Exemption)"
      ) {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = cifob * gstperval + T3 * gstperval;
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      } else {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = Number(cifob) * Number(gstperval);
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      }
    } else if (uom == "KGM" && typeId == 62) {
      $("#ItemTotalDutiableQtyInput").val(
        (Number(pckqty) * Number(dutiab)).toFixed(2),
      );
      if (!hsCode.startsWith("87")) {
        $("#TxtSumExciseDuty").val(
          Number(pckqty) * Number(dutiab) * exiceDutyRate,
        );
      }
      let T3 = $("#TxtSumExciseDuty").val();
      if (
        $("#declarationType").val() != "GST : GST (Including Duty Exemption)"
      ) {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = cifob * gstperval + T3 * gstperval;
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      } else {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = Number(cifob) * Number(gstperval);
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      }
    } else if (uom == "TNE" && typeId == 62) {
      $("#ItemTotalDutiableQtyInput").val(
        (Number(pckqty) * Number(dutiab)).toFixed(2),
      );
      if (!hsCode.startsWith("87")) {
        $("#TxtSumExciseDuty").val(
          Number(pckqty) * Number(dutiab) * exiceDutyRate,
        );
      }
      let T3 = $("#TxtSumExciseDuty").val();
      if (
        $("#declarationType").val() != "GST : GST (Including Duty Exemption)"
      ) {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = cifob * gstperval + T3 * gstperval;
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      } else {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = Number(cifob) * Number(gstperval);
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      }
    } else if (uom == "KGM" && typeId == 61) {
      $("#ItemTotalDutiableQtyInput").val(
        (Number(pckqty) * Number(dutiab)).toFixed(2),
      );
      if (!hsCode.startsWith("87")) {
        $("#TxtSumExciseDuty").val(
          (Number(pckqty) * Number(dutiab)).toFixed(2) * exiceDutyRate,
        );
      }
      let T3 = $("#TxtSumExciseDuty").val();
      if (
        $("#declarationType").val() != "GST : GST (Including Duty Exemption)"
      ) {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = cifob * gstperval + T3 * gstperval;
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      } else {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = Number(cifob) * Number(gstperval);
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      }
    } else if (uom == "DAL") {
      $("#ItemTotalDutiableQtyInput").val(
        (Number(pckqty) * Number(dutiab)).toFixed(2),
      );
      if (!hsCode.startsWith("87")) {
        $("#TxtSumExciseDuty").val(
          Number(pckqty) * Number(dutiab) * exiceDutyRate,
        );
      }
      let T3 = $("#TxtSumExciseDuty").val();
      if (
        $("#declarationType").val() != "GST : GST (Including Duty Exemption)"
      ) {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = cifob * gstperval + T3 * gstperval;
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      } else {
        let gstperval = Number($("#invoiceGSTInput1").val()) / 100;
        let T4 = Number(cifob) * Number(gstperval);
        $("#TxtItemSumGST").val(T4.toFixed(2));
        if (T4 >= 10000) {
          $("#marquee1").val("Total GST Amount Greater than 10000");
        } else {
          if ($("#marquee1").val() == "") {
            $("#marquee1").val("");
          }
        }
      }
    }
  }
}
