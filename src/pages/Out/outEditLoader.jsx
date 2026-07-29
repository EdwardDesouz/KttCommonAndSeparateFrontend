import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useOut } from "./context/outContext";
import API from "../../api/api";

function OutEditLoader({ permitId, isEditMode }) {
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
    setCoType,

    setDeclFor,
    setBgInd,
    setSupplyInd,
    setRefDocs,
    setShowCertificateOfOrgin,
    setShowItemTexttile,
    setUploadedFiles,
    setLicence1,
    setLicence2,
    setLicence3,
    setLicence4,
    setLicence5,
    setRecipients1,
    setRecipients2,
    setRecipients3,
    setCertficateType1,
    setCertficateType2,
    setCurrencyCode,
    setCertficateCopy1,
    setCertficateCopy2,
    setAdditionalCertificateDetails1,
    setAdditionalCertificateDetails2,
    setAdditionalCertificateDetails3,
    setAdditionalCertificateDetails4,
    setAdditionalCertificateDetails5,
    setTransportDetails1,
    setTransportDetails2,
    setTransportDetails3,
    setTransportDetails4,
    setTransportDetails5,
    // Party
    setImporterCode,
    setImporterCruei,
    setImporterName,
    setImporterName1,

    setExporterCode,
    setExporterCruei,
    setExporterName,
    setExporterName1,
    setExporterAddress,
    setExporterAddress1,
    setExporterCity,
    setExporterSubCode,
    setExporterSubDivision,
    setExporterPostal,
    setExporterCountryCode,

    setInwardCode,
    setInwardCruei,
    setInwardName,
    setInwardName1,

    setOutwardCode,
    setOutwardCruei,
    setOutwardName,
    setOutwardName1,

    setFreightForwarderCode,
    setFreightForwarderCruei,
    setFreightForwarderName,
    setFreightForwarderName1,

    setClaimantCode,
    setClaimantCruei,
    setClaimantName,
    setClaimantName1,

    setCongineeCode,
    setCongineeCruei,
    setCongineeName,
    setCongineeName1,
    setCongineeAddress,
    setCongineeAddress1,
    setCongineeCity,
    setCongineeSubCode,
    setCongineeSubDivision,
    setCongineePostel,
    setCongineeCountryCode,

    setEndUserCheck,
    setShowPartyEndUser,
    setEndUserCode,
    setEndUserCruei,
    setEndUserName,
    setEndUserName1,
    setEndUserAddress,
    setEndUserAddress1,
    setEndUserCity,
    setEndUserSubCode,
    setEndUserSubDivision,
    setEndUserPostal,
    setEndUserCountryCode,

    setManufacturerCode,
    setManufacturerCruei,
    setManufacturerName,
    setManufacturerName1,
    setManufacturerAddress,
    setManufacturerAddress1,
    setManufacturerCity,
    setManufacturerSub,
    setManufacturerSubDivi,
    setManufacturerPostal,
    setManufacturerCountry,

    // Cargo
    setContainers,
    setInwardTransport,

    setCargoHawb,
    setCargoHawbList,
    setOutCargoHawb,
    setOutCargoHawbList,
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
    setStorageCode,
    setStorageLocationDescription,
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
    setShowOutItemHawbHbl,
    setShowExhibitionStartDate,
    setShowExhibitionEndDate,
    setShowExhibition,
    setShowInwardMode,
    setShowOutwardTransport,
    setShowCongineeShow,
    setShowExporter,
    setShowOutwardCarrier,
    setShowStorageLocation,
    setShowInHawbInward,
    setShowInWardDetails,
    setShowPartyImporter,
    setShowInwardCarrier,
    setShowOutWardDetails,
    setShowLoadingPort,
    setShowOutVoyage,
    setShowOutVesselName,
    setShowOutObl,
    setShowOutHblHawb,
    setShowOutFlightNumber,
    setShowOutAircraftReg,
    setShowOutMawb,
    setShowOutConveyanceNumber,
    setShowOutTransportDetails,
    setShowVesselType,
    setShowVesselNetRegister,
    setShowVesselNationality,
    setShowTowingVesselId,
    setShowTowingVesselName,
    setShowNextPort,
    setShowLastPort,
    setOutHblHawbLabel,
    setOutVoyageNumber,
    setOutVesselName,
    setOutObl,
    setOutHblHawb,
    setOutConveyanceNumber,
    setOutTransportDetails,
    setOutFlightNumber,
    setOutAircraftRegNumber,
    setOutMawbNumber,
    setOutSeaStore,
    setDischargePortCode,
    setDischargePortName,
    setFinalDestinationCountry,
    setDepartureDate,
    setVesselType,
    setVesselNetRegisterTonnage,
    setVesselNationality,
    setTowingVesselId,
    setTowingVesselName,
    setNextPortCode,
    setNextPortName,
    setLastPortCode,
    setLastPortName,
    setExhibitionStartDate,
    setExhibitionEndDate,
    setOutTransportMode,
    setCargoOutwardTransportMode,
    setSummaryImporterCruei,
    setSummaryImporterName,

    // Summary
    setSummaryCrossReference,
    setSummaryRemarks,
    setSummaryInternalRemarks,
    setDeclarationChecked,
    setSummaryDeclaringFor,
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
    // CPC Page
    setShowAeo,
    setShowCwc,
    setShowSeaStoreCpc,
    setShowScheme,
    setCnBChecked,
    setShowSts,
    setStsRows,
    setShowStsCwc,
    setStsCwcRows,
    setShowDeferredPrinting,
    setDeferredPrintingRows,
    setShowInternationalPermitExchange,
    setAeoRows,
    setCwcRows,
    setSeaStoreRows,
    setSchemeRows,
    setInternationalPermitExchangeRows,
  } = useOut();

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
        DeclarantName: d.DeclarantName || "",
        DeclarantCode: d.DeclarantCompanyCode || "",
        DeclarantTel: d.DeclarantTel || "",
        CRUEI: d.CRUEI || "",
        Code: d.Code || "",
        name: d.name || "",
        name1: d.name1 || "",
        PermitNumber: d.PermitNumber || "",
        prmtStatus: d.prmtStatus || "NEW",
        SeqPool: d.SeqPool || "",
        StartSequence: d.StartSequence || "",
        AccountId: d.AccountId || "",
        TradeNetMailboxID: d.TradeNetMailboxID || "",
      });

      // const touchUser = d.TouchUser || "";
      // if (touchUser) {
      //   try {
      //     const declarantRes = await API.get(
      //       `/innonpaymentnew/?user=${touchUser}`,
      //     );
      //     const dec = declarantRes.data;

      //     updatePermitDetails({
      //       PermitId: permitId,
      //       JobId: d.JobId || "",
      //       MsgId: d.MSGId || "",
      //       RefId: d.Refid || "",
      //       MailBoxId: dec.MailBoxId || d.TradeNetMailboxID || "",
      //       TradeNetMailboxID:
      //         dec.TradeNetMailboxID || d.TradeNetMailboxID || "",
      //       DeclarantName: dec.DeclarantName || "",
      //       DeclarantCode: dec.DeclarantCode || d.DeclarantCompanyCode || "",
      //       DeclarantTel: dec.DeclarantTel || "",
      //       CRUEI: dec.CRUEI || "",
      //       Code: dec.Code || "",
      //       name: dec.name || "",
      //       name1: dec.name1 || "",
      //       PermitNumber: d.PermitNumber || "",
      //       prmtStatus: d.prmtStatus || "NEW",
      //       SeqPool: dec.SeqPool || "",
      //       StartSequence: dec.StartSequence || "",
      //       AccountId: dec.AccountId || "",
      //     });
      //   } catch (err) {
      //     console.error("Failed to fetch declarant details in edit mode:", err);
      //   }
      // }
const mailboxId = d.TradeNetMailboxID || "";
if (mailboxId) {
  try {
    const declarantRes = await API.get(
      `/getDeclarantByMailbox/?MailboxId=${mailboxId}`,
    );
    const dec = declarantRes.data;
    updatePermitDetails({
      PermitId: permitId,
      JobId: d.JobId || "",
      MsgId: d.MSGId || "",
      RefId: d.Refid || "",
      MailBoxId: mailboxId,
      TradeNetMailboxID: mailboxId,
      DeclarantName: dec.DeclarantName || "",
      DeclarantCode: dec.DeclarantCode || d.DeclarantCompanyCode || "",
      DeclarantTel: dec.DeclarantTel || "",
      CRUEI: dec.CRUEI || "",
      Code: dec.Code || "",
      name: dec.Name || "",
      name1: dec.Name1 || "",
      PermitNumber: d.PermitNumber || "",
      prmtStatus: d.prmtStatus || "NEW",
    });
  } catch (err) {
    console.error("Failed to fetch declarant details in edit mode:", err);
  }
}


      // ── Header Tab ──────────────────────────────────────────────
      const decTypeValue = d.DeclarationType || "";
      setDecType(decTypeValue);
      console.log("declaration type from API:", d.DeclarationType);
      // RESET all declaration-driven visibility first
      setShowOutItemHawbHbl(false);
      setShowExhibitionStartDate(false);
      setShowLoadingPort(true);
      setShowExhibition(false);
      setShowExhibitionEndDate(false);
      setShowInwardMode(false);
      setShowInwardTransport(true);
      setShowOutwardTransport(false);
      setShowClaimantPartyShow(false);
      setShowCongineeShow(true);
      setShowExporter(false);
      setShowOutwardCarrier(false);
      setShowStorageLocation(true);
      setShowInHawbInward(false);

      if (
        decTypeValue ===
        "BKT : BLANKET [INCLUDING BLANKET GST RELIEF (& DUTY EXEMPTION)]"
      ) {
        setShowLoadingPort(false);
        setShowExhibitionStartDate(true);
        setShowInHawbInward(false);
        setShowExhibition(true);
        setShowInwardTransport(false);
        setShowCongineeShow(false);
        setShowClaimantPartyShow(true);
      } else if (decTypeValue === "DES : DESTRUCTION") {
        setShowInHawbInward(true);
      } else if (decTypeValue === "APS : APPROVED PREMISES/SCHEMES") {
        // no extra toggles
      } else if (
        decTypeValue === "TCI : TEMPORARY EXPORT / RE-IMPORTED GOODS"
      ) {
        setShowOutwardTransport(false);
      } else if (
        decTypeValue ===
          "TCE : TEMPORARY IMPORT FOR EXHIBITION/AUCTIONS WITHOUT SALES" ||
        decTypeValue === "TCO : TEMPORARY IMPORT FOR OTHER PURPOSES" ||
        decTypeValue === "TCR : TEMPORARY IMPORT FOR REPAIRS" ||
        decTypeValue ===
          "TCS : TEMPORARY IMPORT FOR EXHIBITION/AUCTIONS WITH SALES"
      ) {
        setShowCongineeShow(false);
        setShowInwardMode(true);
        setShowExhibition(true);
        setShowExhibitionStartDate(true);
        setShowExhibitionEndDate(true);
      } else if (decTypeValue === "REX : FOR RE-EXPORT") {
        setShowOutItemHawbHbl(true);
        setShowOutwardTransport(true);
        setShowExporter(true);
        setShowOutwardCarrier(true);
        setShowInwardMode(true);
        setShowInHawbInward(true);
      } else if (decTypeValue === "SFZ : STORAGE IN FTZ") {
        setShowOutItemHawbHbl(true);
        setShowOutwardTransport(true);
        setShowOutwardCarrier(true);
        setShowInwardMode(true);
      } else {
        setShowCongineeShow(false);
        setShowInHawbInward(true);
        if (decTypeValue === "GTR : GST RELIEF (& DUTY EXEMPTION)") {
          setShowClaimantPartyShow(true);
          setShowInwardMode(true);
        } else if (decTypeValue === "TCR : TEMPORARY IMPORT FOR REPAIRS") {
          setShowExhibition(true);
          setShowExhibitionStartDate(true);
          setShowExhibitionEndDate(true);
        } else if (decTypeValue === "SHO : SHUT-OUT") {
          setShowInwardMode(true);
          setShowStorageLocation(false);
        } else {
          setShowCongineeShow(true);
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
        ``;
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

      // ── INWARD TRANSPORT MODE ───────────────────────────────────
      const transportValue = d.InwardTransportMode || "";
      setTransportMode(transportValue);
      setInwardTransport(transportValue);

      // RESET inward visibility
      setShowVoyageNumber(false);
      setShowVesselName(false);
      setShowOblNumber(false);
      setShowconveyanceNumber(false);
      setShowTransportDetails(false);
      setShowFlightNumber(false);
      setShowAirCraftRegNumber(false);
      setShowMawbNumber(false);
      setShowNotRequired(true);
      setShowInWardDetails(true);
      setShowInwardTransport(true);
      setShowPartyImporter(false);
      setShowInwardCarrier(false);

      if (transportValue === "" || transportValue === "--Select--") {
        setShowPartyImporter(false);
        setShowInWardDetails(false);
      } else {
        setShowPartyImporter(true);
      }

      if (transportValue === "1 : Sea") {
        setShowVoyageNumber(true);
        setShowVesselName(true);
        setShowOblNumber(true);
        setShowInwardMode(true);
        setShowInHawbInward(true);
        setShowInwardCarrier(true);
        setShowInWardDetails(true);
      } else if (transportValue === "2 : Rail") {
        setShowInwardMode(true);
        setShowconveyanceNumber(true);
        setShowTransportDetails(true);
        setShowInWardDetails(true);
      } else if (transportValue === "3 : Road") {
        setShowconveyanceNumber(true);
        setShowTransportDetails(true);
        setShowInWardDetails(true);
      } else if (transportValue === "4 : Air") {
        setShowFlightNumber(true);
        setShowAirCraftRegNumber(true);
        setShowMawbNumber(true);
        setShowInWardDetails(true);
        setShowInwardCarrier(true);
      } else if (
        transportValue === "5 : Mail" ||
        transportValue === "6 : Multi-model(Not in use)" ||
        transportValue === "7 : Pipeline"
      ) {
        setShowconveyanceNumber(true);
        setShowTransportDetails(true);
        setShowInWardDetails(true);
      } else if (transportValue === "N : Not Required") {
        setShowInWardDetails(false);
        setShowNotRequired(false);
      }

      // ── OUTWARD TRANSPORT MODE ──────────────────────────────────
      const outTransportValue = d.OutwardTransportMode || "";
      setOutTransportMode(outTransportValue);
      setCargoOutwardTransportMode(outTransportValue);

      // RESET outward visibility
      setShowOutWardDetails(true);
      setShowOutwardCarrier(false);
      setShowOutVoyage(false);
      setShowOutVesselName(false);
      setShowOutObl(false);
      setShowOutHblHawb(false);
      setShowOutFlightNumber(false);
      setShowOutAircraftReg(false);
      setShowOutMawb(false);
      setShowOutConveyanceNumber(false);
      setShowOutTransportDetails(false);
      setShowVesselType(false);
      setShowVesselNetRegister(false);
      setShowVesselNationality(false);
      setShowTowingVesselId(false);
      setShowTowingVesselName(false);
      setShowNextPort(false);
      setShowLastPort(false);
      setOutHblHawbLabel("HAWB/HBL");

      if (
        outTransportValue &&
        outTransportValue !== "--Select--" &&
        outTransportValue !== "N : Not Required"
      ) {
        setShowOutWardDetails(true);

        if (outTransportValue === "1 : Sea") {
          setShowOutVoyage(true);
          setShowOutVesselName(true);
          setShowOutObl(true);
          setShowOutHblHawb(true);
          setShowVesselType(true);
          setShowVesselNetRegister(true);
          setShowVesselNationality(true);
          setShowTowingVesselId(true);
          setShowTowingVesselName(true);
          setShowNextPort(true);
          setShowLastPort(true);
          setOutHblHawbLabel("HBL");
          setShowOutwardCarrier(true);
        } else if (
          outTransportValue === "2 : Rail" ||
          outTransportValue === "3 : Road" ||
          outTransportValue === "5 : Mail" ||
          outTransportValue === "7 : Pipeline" ||
          outTransportValue === "6 : Multi-model(Not in use)"
        ) {
          setShowOutHblHawb(true);
          setShowOutConveyanceNumber(true);
          setShowOutTransportDetails(true);
          setOutHblHawbLabel("HBL");
        } else if (outTransportValue === "4 : Air") {
          setShowOutHblHawb(true);
          setShowOutFlightNumber(true);
          setShowOutAircraftReg(true);
          setShowOutMawb(true);
          setOutHblHawbLabel("HAWB");
          setShowOutwardCarrier(true);
        }
      } else if (outTransportValue === "N : Not Required") {
        setShowOutWardDetails(false);
      }
      setCoType(d.COType || "");
      const coTypeValue = d.COType || "";
      setShowCertificateOfOrgin(false);
      setShowItemTexttile(false);

      if (coTypeValue !== "") {
        setShowCertificateOfOrgin(true);
        if (coTypeValue === "TX : Application for textile products") {
          setShowItemTexttile(true);
        } else {
          setShowItemTexttile(false);
        }
      }
      setDeclFor(d.DeclarningFor || d.DeclaringFor || "");
      setBgInd(d.BGIndicator || "");
      setSupplyInd(d.SupplyIndicator === "Y");
      setRefDocs(d.ReferenceDocuments === "Y");

      if (d.ReferenceDocuments === "Y") {
        try {
          const filesRes = await API.get(
            `/getCommonFileByEditPermitId/?PermitId=${permitId}`,
          );
          setUploadedFiles(Array.isArray(filesRes.data) ? filesRes.data : []);
        } catch (err) {
          console.error("Failed to fetch uploaded files:", err);
          setUploadedFiles([]);
        }
      }

      const licences = (d.License || "").split(",");
      setLicence1(licences[0] || "");
      setLicence2(licences[1] || "");
      setLicence3(licences[2] || "");
      setLicence4(licences[3] || "");
      setLicence5(licences[4] || "");

      const recipients = (d.Recipient || "").split(",");
      setRecipients1(recipients[0] || "");
      setRecipients2(recipients[1] || "");
      setRecipients3(recipients[2] || "");

      setCertficateType1(d.CerDetailtype1 || "");
      setCertficateType2(d.CerDetailtype2 || "");
      setCurrencyCode(d.CurrencyCode || "");
      setCertficateCopy1(d.CerDetailCopies1 || "");
      setCertficateCopy2(d.CerDetailCopies2 || "");
      const additionalcerficats = (d.AddCerDtl || "").split(",");
      setAdditionalCertificateDetails1(additionalcerficats[0] || "");
      setAdditionalCertificateDetails2(additionalcerficats[1] || "");
      setAdditionalCertificateDetails3(additionalcerficats[2] || "");
      setAdditionalCertificateDetails4(additionalcerficats[3] || "");
      setAdditionalCertificateDetails5(additionalcerficats[4] || "");
      const transDetail = (d.TransDtl || "").split(",");
      setTransportDetails1(transDetail[0] || "");
      setTransportDetails2(transDetail[1] || "");
      setTransportDetails3(transDetail[2] || "");
      setTransportDetails4(transDetail[3] || "");
      setTransportDetails5(transDetail[4] || "");

      // ── PARTY TAB ───────────────────────────────────────────────
      const importerCode = d.ImporterCompanyCode || "";
      const inwardCode = d.Inwardcarriercode || d.InwardCarrierAgentCode || "";
      const freightCode = d.FreightForwarderCode || "";
      const claimantCode = d.ClaimantPartyCode || "";
      const exporterCodeVal = d.ExporterCompanyCode || "";
      const outwardCodeVal = d.OutwardCarrierAgentCode || "";
      const congineeCodeVal = d.ConsigneeCode || d.CONSIGNEECode || "";
      const endUserCodeVal = d.EndUserCode || "";
      const manufacturerCodeVal = d.Manufacturer || "";

      setImporterCode(importerCode);
      setInwardCode(inwardCode);
      setFreightForwarderCode(freightCode);
      setClaimantCode(claimantCode);
      setExporterCode(exporterCodeVal);
      setOutwardCode(outwardCodeVal);
      setCongineeCode(congineeCodeVal);
      setEndUserCode(endUserCodeVal);
      setManufacturerCode(manufacturerCodeVal);

      // Fetch Importer
      if (importerCode) {
        try {
          const importerRes = await API.get("/getCommonImporterTableInfo/");
          const matched = importerRes.data.find(
            (i) => i.Code?.toLowerCase() === importerCode.toLowerCase(),
          );
          if (matched) {
            setImporterCruei(matched.CRUEI || "");
            setImporterName(matched.Name || "");
            setImporterName1(matched.Name1 || "");
            setSummaryImporterCruei(matched.CRUEI || "");
            setSummaryImporterName(matched.Name || "");
          }
        } catch (err) {
          console.error("Failed to fetch importer details:", err);
        }
      }

      // Fetch Inward Carrier
      if (inwardCode) {
        try {
          const inwardRes = await API.get(
            "/getCommonInwardCarrierAgentTableInfo/",
          );
          const matched = inwardRes.data.find(
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

      // Fetch Freight Forwarder
      if (freightCode) {
        try {
          const freightRes = await API.get("/getCommonFreightForwarderTable/");
          const matched = freightRes.data.find(
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

      // Fetch Claimant
      if (claimantCode) {
        try {
          const claimantRes = await API.get("/getCommonClaimantPartyTable/");
          const matched = claimantRes.data.find(
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

      // Fetch Exporter
      if (exporterCodeVal) {
        try {
          const exporterRes = await API.get("/getCommonExporterTableInfo/");
          const matched = exporterRes.data.find(
            (i) => i.Code?.toLowerCase() === exporterCodeVal.toLowerCase(),
          );
          if (matched) {
            setExporterCruei(matched.CRUEI || "");
            setExporterName(matched.Name || "");
            setExporterName1(matched.Name1 || "");
            setExporterAddress(matched.Address || "");
            setExporterAddress1(matched.Address1 || "");
            setExporterCity(matched.City || "");
            setExporterSubCode(matched.SubCode || "");
            setExporterSubDivision(matched.Sub || "");
            setExporterPostal(matched.Postal || "");
            setExporterCountryCode(matched.Country || "");
          }
        } catch (err) {
          console.error("Failed to fetch exporter details:", err);
        }
      }

      // Fetch Outward Carrier
      if (outwardCodeVal) {
        try {
          const outwardRes = await API.get(
            "/getCommonOutwardCarrierAgentTableInfo/",
          );
          const matched = outwardRes.data.find(
            (i) => i.Code?.toLowerCase() === outwardCodeVal.toLowerCase(),
          );
          if (matched) {
            setOutwardCruei(matched.CRUEI || "");
            setOutwardName(matched.Name || "");
            setOutwardName1(matched.Name1 || "");
          }
        } catch (err) {
          console.error("Failed to fetch outward carrier details:", err);
        }
      }

      // Fetch Consignee
      if (congineeCodeVal) {
        try {
          const congineeRes = await API.get("/getCommonConsigneeTableInfo/");
          const matched = congineeRes.data.find(
            (i) =>
              i.ConsigneeCode?.toLowerCase() === congineeCodeVal.toLowerCase(),
          );
          if (matched) {
            setCongineeCruei(matched.ConsigneeCRUEI || "");
            setCongineeName(matched.ConsigneeName || "");
            setCongineeName1(matched.ConsigneeName1 || "");
            setCongineeAddress(matched.ConsigneeAddress || "");
            setCongineeAddress1(matched.ConsigneeAddress1 || "");
            setCongineeCity(matched.ConsigneeCity || "");
            setCongineeSubCode(matched.ConsigneeSub || "");
            setCongineeSubDivision(matched.ConsigneeSubDivi || "");
            setCongineePostel(matched.ConsigneePostal || "");
            setCongineeCountryCode(matched.ConsigneeCountry || "");
          }
        } catch (err) {
          console.error("Failed to fetch consignee details:", err);
        }
      }

      // Fetch End User
      if (endUserCodeVal) {
        setEndUserCheck(true);
        setShowPartyEndUser(true);
        try {
          const endUserRes = await API.get("/getCommonEndUserTableInfo/");
          const matched = endUserRes.data.find(
            (i) =>
              i.EndUserCode?.toLowerCase() === endUserCodeVal.toLowerCase(),
          );
          if (matched) {
            setEndUserCruei(matched.EndUserCRUEI || "");
            setEndUserName(matched.EndUserName || "");
            setEndUserName1(matched.EndUserName1 || "");
            setEndUserAddress(matched.EndUserAddress || "");
            setEndUserAddress1(matched.EndUserAddress1 || "");
            setEndUserCity(matched.EndUserCity || "");
            setEndUserSubCode(matched.EndUserSubCode || "");
            setEndUserSubDivision(matched.EndUserSubDivi || "");
            setEndUserPostal(matched.EndUserPostal || "");
            setEndUserCountryCode(matched.EndUserCountry || "");
          }
        } catch (err) {
          console.error("Failed to fetch end user details:", err);
        }
      } else {
        setEndUserCheck(false);
        setShowPartyEndUser(false);
      }

      if (manufacturerCodeVal) {
        try {
          const manufacturerRes = await API.get(
            "/getCommonManufacturerTableInfo/",
          );
          const matched = manufacturerRes.data.find(
            (i) =>
              i.ManufacturerCode?.toLowerCase() ===
              manufacturerCodeVal.toLowerCase(),
          );
          if (matched) {
            setManufacturerCruei(matched.ManufacturerCRUEI || "");
            setManufacturerName(matched.ManufacturerName || "");
            setManufacturerName1(matched.ManufacturerName1 || "");
            setManufacturerAddress(matched.ManufacturerAddress || "");
            setManufacturerAddress1(matched.ManufacturerAddress1 || "");
            setManufacturerCity(matched.ManufacturerCity || "");
            setManufacturerSub(matched.ManufacturerSub || "");
            setManufacturerSubDivi(matched.ManufacturerSubDivi || "");
            setManufacturerPostal(matched.ManufacturerPostal || "");
            setManufacturerCountryCode(matched.ManufacturerCountryCode || "");
          }
        } catch (err) {
          console.error("Failed to fetch manufacturer details:", err);
        }
      }

      // ── CARGO TAB ───────────────────────────────────────────────
      const hawbValue = d.HBL || d.INHAWB || "";
      setCargoHawb(hawbValue);
      setCargoHawbList(
        hawbValue
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i !== ""),
      );

      setOutCargoHawb(d.outHAWB || "");
      setOutCargoHawbList(
        (d.outHAWB || "")
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i !== ""),
      );

      setArrivalDate(formatApiDate(d.ArrivalDate));
      setDepartureDate(formatApiDate(d.DepartureDate));

      const loadingPortCode = d.LoadingPortCode || "";
      setLoadingPortCode(loadingPortCode);
      if (loadingPortCode) {
        try {
          const portRes = await API.get("/getLoadingPort/");
          const matched = portRes.data.find(
            (p) =>
              p.PortCode?.trim().toLowerCase() ===
              loadingPortCode.trim().toLowerCase(),
          );
          if (matched) setLoadingPortName(matched.PortName || "");
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
      // setTotalGrossWeight(d.TotalGrossWeight || "");
      // setGrossUOM(d.TotalGrossWeightUOM || "--Select--");
      const savedGrossWeight = d.TotalGrossWeight || "";
const savedGrossUOM = d.TotalGrossWeightUOM || "--Select--";

let displayGrossWeight = savedGrossWeight;
if (savedGrossUOM === "TNE" && savedGrossWeight !== "") {
  const num = Number(savedGrossWeight);
  if (!isNaN(num)) {
    displayGrossWeight = String(num * 1000);
  }
}

setTotalGrossWeight(displayGrossWeight);
setGrossUOM(savedGrossUOM);
      setBlanketStartDate(formatApiDate(d.BlanketStartDate));
      setExhibitionStartDate(formatApiDate(d.ExhibitionSDate));
      setExhibitionEndDate(formatApiDate(d.ExhibitionEDate));

      // ── OUTWARD CARGO FIELDS ───────────────────────────────────
      setOutVoyageNumber(d.OutVoyageNumber || "");
      setOutVesselName(d.OutVesselName || "");
      setOutObl(d.OutOceanBillofLadingNo || "");
      setOutHblHawb(d.outHAWB || "");
      setOutConveyanceNumber(d.OutConveyanceRefNo || "");
      setOutTransportDetails(d.OutTransportId || "");
      setOutFlightNumber(d.OutFlightNO || "");
      setOutAircraftRegNumber(d.OutAircraftRegNo || "");
      setOutMawbNumber(d.OutMasterAirwayBill || "");
      setOutSeaStore(d.seastore === "Y");

      // ── DISCHARGE PORT ─────────────────────────────────────────
      const dischargCode = d.DischargePort || "";
      setDischargePortCode(dischargCode);
      if (dischargCode) {
        try {
          const portRes = await API.get("/getLoadingPort/");
          const matched = portRes.data.find(
            (p) =>
              p.PortCode?.trim().toLowerCase() ===
              dischargCode.trim().toLowerCase(),
          );
          if (matched) setDischargePortName(matched.PortName || "");
        } catch (err) {
          console.error("Failed to fetch discharge port details:", err);
        }
      }

      setFinalDestinationCountry(d.FinalDestinationCountry || "");

      // ── VESSEL DETAILS ─────────────────────────────────────────
      setVesselType(d.VesselType || "");
      setVesselNetRegisterTonnage(d.VesselNetRegTon || "");
      setVesselNationality(d.VesselNationality || "");
      setTowingVesselId(d.TowingVesselID || "");
      setTowingVesselName(d.TowingVesselName || "");

      // ── NEXT PORT ──────────────────────────────────────────────
      const nextPortCodeVal = d.NextPort || "";
      setNextPortCode(nextPortCodeVal);
      if (nextPortCodeVal) {
        try {
          const portRes = await API.get("/getLoadingPort/");
          const matched = portRes.data.find(
            (p) =>
              p.PortCode?.trim().toLowerCase() ===
              nextPortCodeVal.trim().toLowerCase(),
          );
          if (matched) setNextPortName(matched.PortName || "");
        } catch (err) {
          console.error("Failed to fetch next port details:", err);
        }
      }

      // ── LAST PORT ──────────────────────────────────────────────
      const lastPortCodeVal = d.LastPort || "";
      setLastPortCode(lastPortCodeVal);
      if (lastPortCodeVal) {
        try {
          const portRes = await API.get("/getLoadingPort/");
          const matched = portRes.data.find(
            (p) =>
              p.PortCode?.trim().toLowerCase() ===
              lastPortCodeVal.trim().toLowerCase(),
          );
          if (matched) setLastPortName(matched.PortName || "");
        } catch (err) {
          console.error("Failed to fetch last port details:", err);
        }
      }

      // ── STORAGE LOCATION ───────────────────────────────────────
      const storageCodeVal = d.StorageLocation || "";
      setStorageCode(storageCodeVal);
      if (storageCodeVal) {
        try {
          const storageRes = await API.get("/getStorageLocation/");
          const matched = storageRes.data.find(
            (s) =>
              s.StorageCode?.trim().toLowerCase() ===
              storageCodeVal.trim().toLowerCase(),
          );
          if (matched) setStorageLocationDescription(matched.Description || "");
        } catch (err) {
          console.error("Failed to fetch storage location details:", err);
        }
      }
      // ── SUMMARY TAB ─────────────────────────────────────────────
      setSummaryCrossReference(d.GrossReference || "");
      setSummaryRemarks(d.TradeRemarks || "");
      setSummaryInternalRemarks(d.InternalRemarks || "");
      setDeclarationChecked(d.DeclareIndicator === "Y");
      setSummaryDeclaringFor(d.DeclarningFor || "");
      setSummaryDate(formatApiDate(d.MRDate));
      setSummaryTime(d.MRTime || "");
      setCnBChecked(d.Cnb === "Y");

      // Fetch Invoice
      try {
        const invoiceRes = await API.get(
          `/getInvoiceByEditPermitId/?PermitId=${permitId}`,
        );
        setInvoiceTable(Array.isArray(invoiceRes.data) ? invoiceRes.data : []);
      } catch (err) {
        console.error("Failed to fetch invoice data:", err);
        setInvoiceTable([]);
      }

      // Fetch Item
      try {
        const itemRes = await API.get(
          `/getItemByEditPermitId/?PermitId=${permitId}`,
        );
        setItemTable(Array.isArray(itemRes.data) ? itemRes.data : []);
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
      // const schemeData = cpcData.filter((r) => r.CPCType === "SCHEME");
      const cnbData = cpcData.filter((r) => r.CPCType === "CNB");
      const seaStoreData = cpcData.filter((r) => r.CPCType === "SEASTORE");
      const ipeData = cpcData.filter((r) => r.CPCType === "IPE");
      const stsData = cpcData.filter((r) => r.CPCType === "STS");
      const stsCwcData = cpcData.filter((r) => r.CPCType === "STSCWC");
      const deferredData = cpcData.filter((r) => r.CPCType === "DEFERREDCO");

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
      // if (schemeData.length > 0) {
      //   setShowScheme(true);
      //   setSchemeRows(toRows(schemeData));
      // }

      if (seaStoreData.length > 0) {
        setShowSeaStoreCpc(true);
        setSeaStoreRows(toRows(seaStoreData));
      }
      if (ipeData.length > 0) {
        setShowInternationalPermitExchange(true);
        setInternationalPermitExchangeRows(toRows(ipeData));
      }
      if (cnbData.length > 0) {
        setCnBChecked(true);
      }
      if (stsData.length > 0) {
        setShowSts(true);
        setStsRows(toRows(stsData));
      }
      if (stsCwcData.length > 0) {
        setShowStsCwc(true);
        setStsCwcRows(toRows(stsCwcData));
      }
      if (deferredData.length > 0) {
        setShowDeferredPrinting(true);
        setDeferredPrintingRows(toRows(deferredData));
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

export default OutEditLoader;
