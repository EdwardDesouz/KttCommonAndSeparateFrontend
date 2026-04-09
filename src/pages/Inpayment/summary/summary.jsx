import { useState, useEffect } from "react";
import { useInpayment } from "../context/inpaymentContext";
import { DateField } from "../cargo/cargo";
function Summary({ setActiveTab }) {
  const {
    invoiceTable,
    itemTable,
    prevPermitNo,
    setPrevPermitNo,
    showPermit,
    setShowPermit,
    summaryImporterCruei,
    setSummaryImporterCruei,
    summaryImporterName,
    setSummaryImporterName,
    cargoHawb,
    setCargoHawb,
    obl,
    setObl,
    totalGrossWeight,
    setTotalGrossWeight,
    grossUOM,
    setGrossUOM,
    totalOuterPackValue,
    setTotalOuterPackValue,
    totalOuterPackName,
    setTotalOuterPackName,
    decType,
    totalAmountPayable,
    setTotalAmountPayable,
    showCifMatchingError,
    setShowCifMatchingError,
    summaryRemarks,
    setSummaryRemarks,
    formatRemark,
    setFormatRemark,
    summaryCrossReference,
    setSummaryCrossReference,
    summaryInternalReamarks,
    setSummaryInternalRemarks,
    summaryDate,
    setSummaryDate,
    summaryTime,
    setSummaryTime,
  } = useInpayment();

  const totalItemValue = itemTable.reduce((sum, item) => {
    return sum + (parseFloat(item.TotalLineAmount) || 0);
  }, 0);

  const totalInvoiceCifValue = invoiceTable.reduce((sum, inv) => {
    return sum + (parseFloat(inv.CIFSUMAmount) || 0);
  }, 0);

  const totalItemCifValue = itemTable.reduce((sum, item) => {
    return sum + (parseFloat(item.CIFFOB) || 0);
  }, 0);

  const totalItemGstAmount = itemTable.reduce((sum, item) => {
    return sum + (parseFloat(item.GSTAmount) || 0);
  }, 0);

  const sumOfExciseDutyAmount = itemTable.reduce((sum, item) => {
    return sum + (parseFloat(item.ExciseDutyAmount) || 0);
  }, 0);

  const sumOfCustomsDutyAmount = itemTable.reduce((sum, item) => {
    return sum + (parseFloat(item.CustomsDutyAmount) || 0);
  }, 0);

  const sumOfOtherTaxAmount = itemTable.reduce((sum, item) => {
    return sum + (parseFloat(item.OtherTaxAmount) || 0);
  }, 0);

  useEffect(() => {
    if (decType === "DNG : Duty & GST") {
      setTotalAmountPayable(
        Number(sumOfOtherTaxAmount || 0) +
          Number(sumOfExciseDutyAmount || 0) +
          Number(totalItemGstAmount || 0) +
          Number(sumOfCustomsDutyAmount || 0),
      );
    } else {
      setTotalAmountPayable(Number(totalItemGstAmount || 0));
    }
  }, [
    decType,
    sumOfOtherTaxAmount,
    sumOfExciseDutyAmount,
    totalItemGstAmount,
    sumOfCustomsDutyAmount,
  ]);

  // cif match
  useEffect(() => {
    const invoiceValue = Number(totalInvoiceCifValue.toFixed(2));
    const itemValue = Number(totalItemCifValue.toFixed(2));
    if (invoiceValue !== itemValue) {
      setShowCifMatchingError(true);
    } else {
      setShowCifMatchingError(false);
    }
  }, [totalInvoiceCifValue, totalItemCifValue]);

  // Sum of invoices
  const groupedInvoices = {};
  invoiceTable.forEach((inv) => {
    const currency = inv.TICurrency || "";
    const amount = Number(inv.TIAmount || 0);
    if (groupedInvoices[currency]) {
      groupedInvoices[currency] += amount;
    } else {
      groupedInvoices[currency] = amount;
    }
  });
  const result = Object.keys(groupedInvoices).map((key) => ({
    TICurrency: key,
    TIAmount: groupedInvoices[key],
  }));

  // Sum of Items
  const groupedItems = {};
  itemTable.forEach((item) => {
    const itemCurrency = item.UnitPriceCurrency || "";
    const itemTotalLineAmount = item.TotalLineAmount || 0;
    if (groupedItems[itemCurrency]) {
      groupedItems[itemCurrency] += itemTotalLineAmount;
    } else {
      groupedItems[itemCurrency] = itemTotalLineAmount;
    }
  });
  const itemResult = Object.keys(groupedItems).map((key) => ({
    UnitPriceCurrency: key,
    TotalLineAmount: groupedItems[key],
  }));

  // Previous Permit Number Show
  const showPermitFunction = () => {
    if (prevPermitNo && prevPermitNo.trim() !== "") {
      setShowPermit(true);
      setSummaryRemarks(`PREVIOUS PERMIT NO : ${prevPermitNo}`);
    } else {
      setSummaryRemarks("PREVIOUS PERMIT NO :");
    }
  };
  // Exchange Rate Show
  const showExRate = () => {
    const grouped = {};
    invoiceTable.forEach((inv) => {
      const currency = inv.TICurrency || "";
      const rate = Number(inv.TIExRate || 0);
      grouped[currency] = (grouped[currency] || 0) + rate;
    });
    const exRateText = Object.keys(grouped)
      .map(
        (cur) =>
          `CURRENCY : ${cur} , EXCHANGE RATE : ${grouped[cur].toFixed(6)}`,
      )
      .join("\n");
    setSummaryRemarks((prev) => prev + (prev ? "\n" : "") + exRateText);
  };

  // foramt
  const summaryConfigBtnFunction = () => {
    setFormatRemark("");
    setSummaryRemarks((prev) => prev.replaceAll("\n", formatRemark));
  };

  // TIME FUNCTION
  const handleTimeBlur = (val) => {
    if (val.length === 6 || val.length === 7 || val.length === 8) {
      const regex1 = /^\d{2}(AM|PM)$/i;
      const regex2 = /^\d{4} (AM|PM)$/i;
      const regex3 = /^\d{2}:\d{2} (AM|PM)$/i;
      const regex4 = /^\d{4}(AM|PM)$/i;
      const regex5 = /^\d{2}:\d{2}(AM|PM)$/i;
      if (regex1.test(val)) {
        setSummaryTime(`${val[0]}${val[1]}:00 ${val.slice(2).toUpperCase()}`);
      } else if (regex2.test(val)) {
        setSummaryTime(
          `${val[0]}${val[1]}:${val[2]}${val[3]} ${val.slice(5).toUpperCase()}`,
        );
      } else if (regex3.test(val)) {
        setSummaryTime(val.toUpperCase());
      } else if (regex4.test(val)) {
        setSummaryTime(
          `${val[0]}${val[1]}:${val[2]}${val[3]} ${val.slice(4).toUpperCase()}`,
        );
      } else if (regex5.test(val)) {
        setSummaryTime(`${val.slice(0, 5)} ${val.slice(5).toUpperCase()}`);
      } else {
        setSummaryTime("");
      }
    } else {
      setSummaryTime("");
    }
  };
  return (
    <div className="row g-2">
      <div className="col-12">
        {/* NO OF INVOICES */}
        <div className="row align-items-center compact-row">
          <div className="col-1">NO OF INVOICES</div>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={invoiceTable.length}
              readOnly
            />
          </div>
          <label className="col-sm-1 col-form-label">NO OF ITEMS</label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={itemTable.length}
              readOnly
            />
          </div>
          <label className="col-sm-1 col-form-label">SUM OF ITEM VALUE</label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={totalItemValue.toFixed(2)}
              readOnly
            />
          </div>
          <label className="col-sm-1 col-form-label">
            TOTAL INVOICE CIF VALUE
          </label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={totalInvoiceCifValue.toFixed(2)}
              readOnly
            />
          </div>
        </div>

        {/* TOTAL CIF/FOB VALUE */}
        <div className="row align-items-center compact-row">
          <div className="col-1">TOTAL CIF/FOB VALUE</div>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={totalItemCifValue.toFixed(2)}
              readOnly
            />
          </div>
          <label className="col-sm-1 col-form-label">TOTAL GST VALUE</label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={totalItemGstAmount.toFixed(2)}
              readOnly
            />
          </div>
          <label className="col-sm-1 col-form-label">EXCISE DUTY</label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={sumOfExciseDutyAmount.toFixed(2)}
              readOnly
            />
          </div>
          <label className="col-sm-1 col-form-label">CUSTOMS DUTY</label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={sumOfCustomsDutyAmount.toFixed(2)}
              readOnly
            />
          </div>
        </div>

        {/* OTHER TAX */}
        <div className="row align-items-center compact-row">
          <div className="col-1">OTHER TAX</div>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={sumOfOtherTaxAmount.toFixed(2)}
              readOnly
            />
          </div>
          <label className="col-sm-1 col-form-label">
            TOTAL AMOUNT PAYABLE
          </label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={totalAmountPayable}
              readOnly
            />
          </div>
          <label className="col-sm-1 col-form-label">
            SUM OF INVOICE AMOUNT
          </label>
          <div className="col-sm-2">
            {(result.length > 0 ? result : [{}]).map((inv, index) => (
              <div className="row mb-1" key={index}>
                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    value={inv.TICurrency || ""}
                    readOnly
                  />
                </div>

                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    value={inv.TIAmount || ""}
                    readOnly
                  />
                </div>
              </div>
            ))}
          </div>
          <label className="col-sm-1 col-form-label">SUM OF ITEM AMOUNT</label>
          <div className="col-sm-2">
            {(itemResult.length > 0 ? itemResult : [{}]).map((item, index) => (
              <div className="row mb-1" key={index}>
                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    value={item.UnitPriceCurrency || ""}
                    readOnly
                  />
                </div>
                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    value={item.TotalLineAmount || ""}
                    readOnly
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="row align-items-center compact-row">
          <div className="col-3"></div>
          <div className="col-6">
            {showCifMatchingError && (
              <span style={{ color: "red", fontWeight: "bold" }}>
                THE TOTAL ITEM CIF/FOB VALUE DOES NOT EQUAL WITH TOTAL INVOICE
                CIF VALUE
              </span>
            )}
          </div>
          <div className="col-3"></div>
        </div>

        {/* TRADER REMARKS */}
        <div className="row align-items-center compact-row mt-1">
          <div className="col-1">TRADER REMARKS</div>
          <div className="col-sm-2">
            <button
              type="button"
              className="ButtonClick SaveContainer"
              onClick={showPermitFunction}
            >
              PREV PERMIT NUMBER
            </button>
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              className="ButtonClick SaveContainer"
              onClick={showExRate}
            >
              EX. RATE
            </button>
          </div>

          <label className="col-sm-1 col-form-label">FORMAT REMARKS</label>
          <div className="col-sm-2">
            <input
              type="text"
              className="form-control"
              value={formatRemark}
              onChange={(e) => setFormatRemark(e.target.value)}
            />
          </div>

          <div className="col-sm-1">
            <button
              type="button"
              className="ButtonClick SaveContainer"
              onClick={summaryConfigBtnFunction}
            >
              CONFIG
            </button>
          </div>
          <label className="col-sm-1 col-form-label">CROSS REFERENCE</label>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              value={summaryCrossReference}
              onChange={(e) => setSummaryCrossReference(e.target.value)}
            />
          </div>
        </div>

        <div className="row align-items-center compact-row">
          <div className="col-sm-11">
            <textarea
              className="form-control"
              value={summaryRemarks}
              onChange={(e) => setSummaryRemarks(e.target.value)}
            />
          </div>
        </div>

        <div className="row align-items-center compact-row">
          <div className="col-sm-6">INTERNAL REMARKS</div>
          <div className="col-sm-3">MRD</div>
          <div className="col-sm-3">TIME</div>
        </div>

        <div className="row align-items-center compact-row">
          <div className="col-sm-6">
            <input
              type="text"
              className="form-control"
              value={summaryInternalReamarks}
              onChange={(e) => setSummaryInternalRemarks(e.target.value)}
            />
          </div>
          <div className="col-sm-3">
            <DateField value={summaryDate} setValue={setSummaryDate} />
          </div>
          <div className="col-sm-3">
            <input
              type="text"
              className="form-control"
              placeholder="TIME"
              value={summaryTime}
              onChange={(e) => setSummaryTime(e.target.value)}
              onBlur={(e) => handleTimeBlur(e.target.value)}
            />
          </div>
        </div>

        <div className="row align-items-center compact-row mt-1">
          <div className="col-sm-8 border-bottom pb-1 full-width-title">
            DECLARATION SUMMARY
          </div>
        </div>

        <div className="col-12">
          <div className="row mt-1">
            <div className="col-6">
              <div className="row">
                <div className="col-6">IMPORTER</div>
                <div className="col-6">
                  {summaryImporterCruei}-{summaryImporterName}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-6">HAWB/HBL</div>
                <div className="col-6">{cargoHawb}</div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="col-6">MAWB/OBL</div>
                <div className="col-6">{obl}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-6">GROSS WEIGHT</div>
                <div className="col-6">
                  {totalGrossWeight}-{grossUOM}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="col-6">NO OF PACKING</div>
                <div className="col-6">
                  {totalOuterPackValue}-{totalOuterPackName}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-6">TOTAL ITEM GST</div>
                <div className="col-6">{totalItemGstAmount}</div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div className="row">
                <div className="col-6">INVOICE AMOUNT</div>
                <div className="col-6">
                  {result.map((inv, index) => (
                    <div key={index}>
                      {inv.TICurrency} : {inv.TIAmount}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-6">TOTAL INVOICE GST</div>
                <div className="col-6">{totalItemGstAmount}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="summarycheck row mt">
              <div className="col-1 form-check">
                <input type="checkbox" className="form-check-input" />
              </div>
              <div className="col-8">
                I/WE DECLARE THAT ALL PARTICULARS IN THIS APPLICATION ARE TRUE
                AND CORRECT
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="mt-3 d-flex justify-content-center gap-3">
        <button className="NextpageBtns" onClick={() => setActiveTab("CpcTab")}>
          PREVIOUS
        </button>
        <button className="NextpageBtns">SUBMIT</button>
      </div>
    </div>
  );
}
export default Summary;
