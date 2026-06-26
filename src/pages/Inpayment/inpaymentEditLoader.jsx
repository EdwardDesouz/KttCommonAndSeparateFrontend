import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useInpayment } from "./context/inpaymentContext";
import API from "../../api/api";

function InpaymentEditLoader({ permitId, isEditMode }) {
  const { state } = useLocation();
  const {
    updatePermitDetails,
    // Header
    setDecType,
    setShowInwardTransport,
    setShowClaimantPartyShow,
    setPrevPermitNo,
    setCargo,
    setShowCargoType,
    setTransportMode,
    setDeclFor,
    setBgInd,
    setSupplyInd,
    setRefDocs,
    setUploadedFiles,
    setLicence1,
    setLicence2,
    setLicence3,
    setLicence4,
    setLicence5,
    setRecipients1,
    setRecipients2,
    setRecipients3,
    // Party
    setImporterCode,
    setImporterCruei,
    setImporterName,
    setImporterName1,

    setInwardCode,
    setInwardCruei,
    setInwardName,
    setInwardName1,

    setFreightForwarderCode,
    setFreightForwarderCruei,
    setFreightForwarderName,
    setFreightForwarderName1,

    setClaimantCode,
    setClaimantCruei,
    setClaimantName,
    setClaimantName1,
    // Cargo
    setContainers,
    setInwardTransport,
    setCargoHawb,
    setCargoHawbList,
    setArrivalDate,
    setLoadingPortCode,
    setLoadingPortName,
    setVoyageNumber,
    setVesselName,
    setObl,
    setConveyanceNumber,
    setTransportDetails,
    setFlightNumber,
    setAirCraftRegNumber,
    setMawbNumber,
    setReleaseCode,
    setReleaseLocationDescription,
    setReceiptCode,
    setReceiptLocationDescription,
    setTotalOuterPackValue,
    setTotalOuterPackName,
    setTotalGrossWeight,
    setPermitGrossWeight,
    setGrossUOM,
    setBlanketStartDate,
    setShowVoyageNumber,
    setShowVesselName,
    setShowOblNumber,
    setShowconveyanceNumber,
    setShowTransportDetails,
    setShowFlightNumber,
    setShowAirCraftRegNumber,
    setShowMawbNumber,
    setShowNotRequired,

    // Summary
    setSummaryCrossReference,
    setSummaryRemarks,
    setSummaryInternalRemarks,
    setDeclarationChecked,
    setSummaryDeclaringFor,
    setSummaryApprovedBy,
    setSummaryCustomerRemarks,
    setSummaryDate,
    setSummaryTime,
    setInvoiceTable,
    setItemTable,
    setEditingSNo,
    setInvoiceNumber,
    setInvoiceDate,
    setTermTypeSelected,
    setAdValoremIndicator,
    setPreDutyRateIndicator,
    setSupplierRelationship,
    setInvoiceInsurance,
    setInvoiceImporterCode,
    setInvoiceImporterCruei,
    setInvoiceImporterName,
    setInvoiceImporterName1,
    setSupplierManuFacturerCode,
    setSupplierManuFacturerCruei,
    setSupplierManuFacturerName,
    setSupplierManuFacturerName1,
    setSupplierManuFacturer,
    setInvoiceCurrency,
    setInvoiceExRate,
    setInvoiceAmount,
    setInvoiceDollar,
    setOtherValueCharges,
    setOtherValueCurrency,
    setOtherValueExRate,
    setOtherValueAmount,
    setOtherValueDollar,
    setFreightValueCharges,
    setFreightValueCurrency,
    setFreightValueExRate,
    setFreightValueAmount,
    setFreightValueDollar,
    setInsuranceCharges,
    setInsuranceValueCurrency,
    setInsuranceValueExRate,
    setInsuranceValueAmount,
    setInsuranceValueDollar,
    setCifTotal,
    setGstCharge,
    setGstTotal,
    setShowAeo,
    setShowCwc,
    setShowScheme,
    setCnBChecked,
    setAeoRows,
    setCwcRows,
    setSchemeRows,
  } = useInpayment();

  const formatApiDate = (rawDate) => {
    if (!rawDate) return "";
    const datePart = rawDate.split("T")[0];
    if (datePart === "1900-01-01" || datePart === "0001-01-01") return "";
    return datePart.split("-").reverse().join("/");
  };

  useEffect(() => {
    if (isEditMode && permitId) {
      if (state?.permitData) {
        populateFields(state.permitData, permitId);
      } else {
        fetchEditData(permitId);
      }
    }
  }, [permitId, isEditMode]);

  const populateFields = async (d, permitId) => {
    try {
      // ── Step 1: Set basic permit details from header data ───────
      updatePermitDetails({
        PermitId: permitId,
        JobId: d.JobId || "",
        MsgId: d.MSGId || "",
        RefId: d.Refid || "",
        MailBoxId: d.TradeNetMailboxID || "",
        DeclarantName: "",
        DeclarantCode: d.DeclarantCompanyCode || "",
        DeclarantTel: "",
        CRUEI: "",
        Code: "",
        name: "",
        name1: "",
        PermitNumber: d.PermitNumber || "",
        prmtStatus: d.prmtStatus || "NEW",
        SeqPool: "",
        StartSequence: "",
        AccountId: "",
        TradeNetMailboxID: d.TradeNetMailboxID || "",
      });

      // ── Step 2: Fetch declarant company details using TouchUser ─
      // TouchUser is the username who created/last touched the permit.
      // We reuse the inpaymentnew/ endpoint because it runs the JOIN
      // query across ManageUser + SequencePool + DeclarantCompany,
      // which gives us MailBoxId, DeclarantName, DeclarantTel, CRUEI etc.
      const touchUser = d.TouchUser || "";
      if (touchUser) {
        try {
          const declarantRes = await API.get(
            `/inpaymentnew/?user=${touchUser}`,
          );
          const dec = declarantRes.data;
          // We update ONLY the declarant fields.
          // PermitId, JobId, MsgId, RefId stay from Step 1 — we do NOT
          // overwrite them with the new permit IDs that inpaymentnew/ generates.
          updatePermitDetails({
            PermitId: permitId,
            JobId: d.JobId || "",
            MsgId: d.MSGId || "",
            RefId: d.Refid || "",
            MailBoxId: dec.MailBoxId || d.TradeNetMailboxID || "",
            TradeNetMailboxID:
              dec.TradeNetMailboxID || d.TradeNetMailboxID || "",
            DeclarantName: dec.DeclarantName || "",
            DeclarantCode: dec.DeclarantCode || d.DeclarantCompanyCode || "",
            DeclarantTel: dec.DeclarantTel || "",
            CRUEI: dec.CRUEI || "",
            Code: dec.Code || "",
            name: dec.name || "",
            name1: dec.name1 || "",
            PermitNumber: d.PermitNumber || "",
            prmtStatus: d.prmtStatus || "NEW",
            SeqPool: dec.SeqPool || "",
            StartSequence: dec.StartSequence || "",
            AccountId: dec.AccountId || "",
          });
        } catch (err) {
          console.error("Failed to fetch declarant details in edit mode:", err);
        }
      }

      // ── Header Tab ──────────────────────────────────────────────
      const decTypeValue = d.DeclarationType || "";
      setDecType(decTypeValue);
      console.log("declaration type from API:", d.DeclarationType);
      setShowInwardTransport(true);
      setShowClaimantPartyShow(false);
      if (
        decTypeValue === "BKT : Blanket" ||
        decTypeValue === "GST : GST (Including Duty Exemption)"
      ) {
        setShowClaimantPartyShow(true);
        if (decTypeValue === "BKT : Blanket") {
          setShowInwardTransport(false);
          setTransportMode("");
        }
      }

      // Previous Permit No
      setPrevPermitNo(d.PreviousPermit || "");

      // Cargo Pack Type
      const cargoValue = d.CargoPackType || "";
      setCargo(cargoValue);
      if (cargoValue === "9: Containerized") {
        setShowCargoType(true);
        const containersRes = await API.get(
          `/getContainerByEditPermitId/?PermitId=${permitId}`,
        );
        const containersData = containersRes.data;
        const formattedContainers = containersData.map((c, index) => ({
          id: index + 1,
          number: c.ContainerNo || "",
          sizeType: c.Size || "",
          weight: c.Weight || "",
          seal: c.SealNo || "",
          isSaved: true,
          isChecked: false,
        }));
        setContainers(
          formattedContainers.length
            ? formattedContainers
            : [
                {
                  id: 1,
                  number: "",
                  sizeType: "",
                  weight: "",
                  seal: "",
                  isSaved: false,
                  isChecked: false,
                },
              ],
        );
      } else {
        setShowCargoType(false);
      }

      // Inward Transport Mode
      const transportValue = d.InwardTransportMode || "";
      setTransportMode(transportValue);
      setInwardTransport(transportValue);
      console.log("transport mode from API:", d.InwardTransportMode);
      setShowVoyageNumber(false);
      setShowVesselName(false);
      setShowOblNumber(false);
      setShowconveyanceNumber(false);
      setShowTransportDetails(false);
      setShowFlightNumber(false);
      setShowAirCraftRegNumber(false);
      setShowMawbNumber(false);
      setShowNotRequired(true);
      if (transportValue === "1 : Sea") {
        setShowVoyageNumber(true);
        setShowVesselName(true);
        setShowOblNumber(true);
      } else if (
        [
          "2 : Rail",
          "3 : Road",
          "5 : Mail",
          "6 : Multi-model(Not in use)",
          "7 : Pipeline",
        ].includes(transportValue)
      ) {
        setShowconveyanceNumber(true);
        setShowTransportDetails(true);
      } else if (transportValue === "4 : Air") {
        setShowFlightNumber(true);
        setShowAirCraftRegNumber(true);
        setShowMawbNumber(true);
      } else if (transportValue === "N : Not Required") {
        setShowNotRequired(false);
      }

      setDeclFor(d.DeclarningFor || d.DeclaringFor || "");
      setBgInd(d.BGIndicator || "");
      setSupplyInd(d.SupplyIndicator === "Y");
      setRefDocs(d.ReferenceDocuments === "Y");

      // Reference Documents / Uploaded Files
      if (d.ReferenceDocuments === "Y") {
        try {
          const filesRes = await API.get(
            `/getCommonFileByEditPermitId/?PermitId=${permitId}`,
          );
          const filesData = filesRes.data;
          setUploadedFiles(Array.isArray(filesData) ? filesData : []);
        } catch (err) {
          console.error("Failed to fetch uploaded files:", err);
          setUploadedFiles([]);
        }
      }

      // Licences (comma separated)
      const licences = (d.License || "").split(",");
      setLicence1(licences[0] || "");
      setLicence2(licences[1] || "");
      setLicence3(licences[2] || "");
      setLicence4(licences[3] || "");
      setLicence5(licences[4] || "");

      // Recipients (comma separated)
      const recipients = (d.Recipient || "").split(",");
      setRecipients1(recipients[0] || "");
      setRecipients2(recipients[1] || "");
      setRecipients3(recipients[2] || "");

      // ── Party Tab ───────────────────────────────────────────────
      const importerCode = d.ImporterCompanyCode || "";
      const inwardCode = d.Inwardcarriercode || d.InwardCarrierAgentCode || "";
      const freightCode = d.FreightForwarderCode || "";
      const claimantCode = d.ClaimantPartyCode || "";

      setImporterCode(importerCode);
      setInwardCode(inwardCode);
      setFreightForwarderCode(freightCode);
      setClaimantCode(claimantCode);

      // Fetch Importer full details
      if (importerCode) {
        try {
          const importerRes = await API.get("/getCommonImporterTableInfo/");
          const importerList = importerRes.data;
          const matched = importerList.find(
            (i) => i.Code?.toLowerCase() === importerCode.toLowerCase(),
          );
          if (matched) {
            setImporterCruei(matched.CRUEI || "");
            setImporterName(matched.Name || "");
            setImporterName1(matched.Name1 || "");
          }
        } catch (err) {
          console.error("Failed to fetch importer details:", err);
        }
      }

      // Fetch Inward Carrier Agent full details
      if (inwardCode) {
        try {
          const inwardRes = await API.get(
            "/getCommonInwardCarrierAgentTableInfo/",
          );
          const inwardList = inwardRes.data;
          const matched = inwardList.find(
            (i) => i.Code?.toLowerCase() === inwardCode.toLowerCase(),
          );
          if (matched) {
            setInwardCruei(matched.CRUEI || "");
            setInwardName(matched.Name || "");
            setInwardName1(matched.Name1 || "");
          }
        } catch (err) {
          console.error("Failed to fetch inward details:", err);
        }
      }

      // Fetch Freight Forwarder full details
      if (freightCode) {
        try {
          const freightRes = await API.get("/getCommonFreightForwarderTable/");
          const freightList = freightRes.data;
          const matched = freightList.find(
            (i) => i.Code?.toLowerCase() === freightCode.toLowerCase(),
          );
          if (matched) {
            setFreightForwarderCruei(matched.CRUEI || "");
            setFreightForwarderName(matched.Name || "");
            setFreightForwarderName1(matched.Name1 || "");
          }
        } catch (err) {
          console.error("Failed to fetch freight forwarder details:", err);
        }
      }

      // Fetch Claimant Party full details
      if (claimantCode) {
        try {
          const claimantRes = await API.get("/getCommonClaimantPartyTable/");
          const claimantList = claimantRes.data;
          const matched = claimantList.find(
            (i) => i.ClaimantCode?.toLowerCase() === claimantCode.toLowerCase(),
          );
          if (matched) {
            setClaimantCruei(matched.CRUEI || "");
            setClaimantName(matched.Name || "");
            setClaimantName1(matched.Name1 || "");
          }
        } catch (err) {
          console.error("Failed to fetch claimant details:", err);
        }
      }

      // ── Cargo Tab ───────────────────────────────────────────────
      const hawbValue = d.HBL || "";
      setCargoHawb(hawbValue);
      const hawbArray = hawbValue
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");
      setCargoHawbList(hawbArray);

      // Arrival Date — convert from YYYY-MM-DDT... to DD/MM/YYYY
      const rawDate = d.ArrivalDate || "";
      const arrivalDate = rawDate
        ? rawDate.split("T")[0].split("-").reverse().join("/")
        : "";
      console.log("Formatted Arrival Date:", arrivalDate);
      setArrivalDate(formatApiDate(d.ArrivalDate));

      const loadingPortCode = d.LoadingPortCode || "";
      setLoadingPortCode(loadingPortCode);

      if (loadingPortCode) {
        try {
          const portRes = await API.get(`/getLoadingPort/`);
          const portList = portRes.data;
          const matched = portList.find(
            (p) =>
              p.PortCode?.trim().toLowerCase() ===
              loadingPortCode?.trim().toLowerCase(),
          );
          if (matched) {
            setLoadingPortName(matched.PortName || "");
          }
        } catch (err) {
          console.error("Failed to fetch loading port details:", err);
        }
      }

      setVoyageNumber(d.VoyageNumber || "");
      setVesselName(d.VesselName || "");
      setObl(d.OceanBillofLadingNo || "");
      setConveyanceNumber(d.ConveyanceRefNo || "");
      setTransportDetails(d.TransportId || "");
      setFlightNumber(d.FlightNO || "");
      setAirCraftRegNumber(d.AircraftRegNo || "");
      setMawbNumber(d.MasterAirwayBill || "");
      setReleaseCode(d.ReleaseLocation || "");
      setReleaseLocationDescription(d.ResLoaName || "");
      setReceiptCode(d.RecepitLocation || "");
      setReceiptLocationDescription(d.RecepitLocName || "");
      setTotalOuterPackValue(d.TotalOuterPack || "");
      setTotalOuterPackName(d.TotalOuterPackUOM || "");
      setTotalGrossWeight(d.TotalGrossWeight || "");
      setGrossUOM(d.TotalGrossWeightUOM || "--Select--");

      // Blanket Date — convert from YYYY-MM-DDT... to DD/MM/YYYY
      const rawBlanketDate = d.BlanketStartDate || "";
      const blanketDate = rawBlanketDate
        ? rawBlanketDate.split("T")[0].split("-").reverse().join("/")
        : "";
      console.log("Formatted Blanket Date:", blanketDate);
      setBlanketStartDate(formatApiDate(d.BlanketStartDate));

      // ── Summary Tab ─────────────────────────────────────────────
      setSummaryCrossReference(d.GrossReference || "");
      setSummaryRemarks(d.TradeRemarks || "");
      setSummaryInternalRemarks(d.InternalRemarks || "");
      setDeclarationChecked(d.DeclareIndicator === "Y");
      setSummaryDeclaringFor(d.DeclarningFor || "");
      setSummaryDate(d.MRDate || "");
      setSummaryTime(d.MRTime || "");
      setCnBChecked(d.Cnb === "Y");
      setSummaryApprovedBy(d.gstVerified||"");
      setSummaryCustomerRemarks(d.CustomerRemarks||"");

      // Fetch Invoice data by PermitId
      try {
        const invoiceRes = await API.get(
          `/getInvoiceByEditPermitId/?PermitId=${permitId}`,
        );
        const invoiceArray = Array.isArray(invoiceRes.data)
          ? invoiceRes.data
          : [];
        setInvoiceTable(invoiceArray);
      } catch (err) {
        console.error("Failed to fetch invoice data:", err);
        setInvoiceTable([]);
      }

      // Fetch Item data by PermitId
      try {
        const itemRes = await API.get(
          `/getItemByEditPermitId/?PermitId=${permitId}`,
        );
        const itemArray = Array.isArray(itemRes.data) ? itemRes.data : [];
        setItemTable(itemArray);
      } catch (err) {
        console.error("Failed to fetch item data:", err);
        setItemTable([]);
      }
    } catch (error) {
      console.error("Error loading edit data:", error);
      alert("Failed to load permit data for editing.");
    }

    // ── CPC Tab ─────────────────────────────────────────────────
    // This is outside the main try/catch intentionally so CPC
    // failures don't block the rest of the form from loading.
    try {
      const cpcRes = await API.get(
        `/getCpcByEditPermitId/?PermitId=${permitId}`,
      );
      const cpcData = Array.isArray(cpcRes.data) ? cpcRes.data : [];
      const aeoData = cpcData.filter((r) => r.CPCType === "AEO");
      const cwcData = cpcData.filter((r) => r.CPCType === "CWC");
      const schemeData = cpcData.filter((r) => r.CPCType === "SCHEME");
      const cnbData = cpcData.filter((r) => r.CPCType === "CNB");
      const emptyRow = {
        ProcessingCode1: "",
        ProcessingCode2: "",
        ProcessingCode3: "",
      };
      const toRows = (data) =>
        data.length > 0
          ? data.map((r) => ({
              ProcessingCode1: r.ProcessingCode1 || "",
              ProcessingCode2: r.ProcessingCode2 || "",
              ProcessingCode3: r.ProcessingCode3 || "",
            }))
          : [emptyRow];

      if (aeoData.length > 0) {
        setShowAeo(true);
        setAeoRows(toRows(aeoData));
      }
      if (cwcData.length > 0) {
        setShowCwc(true);
        setCwcRows(toRows(cwcData));
      }
      if (schemeData.length > 0) {
        setShowScheme(true);
        setSchemeRows(toRows(schemeData));
      }
      if (cnbData.length > 0) {
        setCnBChecked(true);
      }
    } catch (err) {
      console.error("Failed to fetch CPC data:", err);
    }
  };

  // Fallback fetch for direct URL access (no navigation state available)
  const fetchEditData = async (permitId) => {
    try {
      const response = await API.get(
        `/getCommonHeaderByPermitId/?PermitId=${permitId}`,
      );
      populateFields(response.data, permitId);
    } catch (error) {
      console.error("Error loading edit data:", error);
      alert("Failed to load permit data for editing.");
    }
  };

  return null;
}

export default InpaymentEditLoader;
