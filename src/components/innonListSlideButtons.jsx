import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useInnonpayment } from "../pages/Innonpayment/context/innonpaymentContext";

function ListButtons({
  newPath,
  selectedPermits = [],
  setSelectedPermits,
  refreshTable,
  btnState,
  clearSelection,
}) {
  const navigate = useNavigate();
  const { permitDetails, updatePermitDetails } = useInnonpayment();

  const handleClick = async (label) => {
    try {
      if (label === "NEW") {
        const userData = JSON.parse(localStorage.getItem("user"));
        const currentUsername = userData?.username;

        if (!currentUsername) {
          alert("Session Error: Please login again.");
          return;
        }

        const res = await API.get(`innonpaymentNew/?user=${currentUsername}`);

        if (res.data?.PermitId) {
          console.log("API RESPONSE:", res.data);
          const newPermit = {
            PermitId: res.data.PermitId,
            JobId: res.data.JobId,
            MsgId: res.data.MsgId,
            RefId: res.data.RefId,
            AccountId: res.data.AccountId,
            LoginStatus: res.data.LoginStatus,
            DateLastUpdated: res.data.DateLastUpdated,
            MailBoxId: res.data.MailBoxId,
            SeqPool: res.data.SeqPool,
            StartSequence: res.data.StartSequence,
            TradeNetMailboxID: res.data.TradeNetMailboxID,
            DeclarantName: res.data.DeclarantName,
            DeclarantCode: res.data.DeclarantCode,
            DeclarantTel: res.data.DeclarantTel,
            CRUEI: res.data.CRUEI,
            Code: res.data.Code,
            name: res.data.name,
            name1: res.data.name1,
            PermitNumber: res.data.PermitNumber,
            prmtStatus: res.data.prmtStatus,
            CurrentDate: res.data.CurrentDate,
            prmtStatus: "NEW",
          };
          updatePermitDetails(newPermit);
          sessionStorage.setItem("currentPermit", JSON.stringify(newPermit));
          navigate(newPath);
        }
      }
      if (label === "COPY") {
        const userData = JSON.parse(localStorage.getItem("user"));
        const currentUsername = userData?.username;
        if (!currentUsername) {
          alert("Session Error: Please login again.");
          return;
        }
        if (!selectedPermits.length) {
          alert("Select at least one permit to copy.");
          return;
        }
        const res = await API.post("copyInnonpayment/", {
          permits: selectedPermits,
          user: currentUsername,
        });
        if (res.data?.SUCCESS) {
          if (clearSelection) clearSelection();
          if (setSelectedPermits) setSelectedPermits([]);
          const copiedPermits = res.data.copiedPermits || [];
          if (copiedPermits.length === 1) {
            try {
              sessionStorage.removeItem("currentPermit");
              const headerRes = await API.get("/getCommonHeaderByPermitId/", {
                params: { PermitId: copiedPermits[0] },
              });
              navigate(`/innonpayment/edit/${copiedPermits[0]}`, {
                state: { permitData: headerRes.data },
              });
            } catch (err) {
              console.error("Failed to load copied permit:", err);
              if (refreshTable) refreshTable();
            }
          } else {
            alert(`${copiedPermits.length} permit(s) copied successfully`);
            if (refreshTable) refreshTable();
          }
        } else {
          alert(res.data?.error || "Copy failed");
        }
      }

      if (label === "PRINTGST") {
        if (!selectedPermits.length) {
          alert("Please select at least one permit to print GST.");
          return;
        }
        for (const permitId of selectedPermits) {
          try {
            const response = await API.get(`PrintGst/${permitId}/`, {
              responseType: "blob",
            });

            const contentDisposition = response.headers["content-disposition"];
            let filename = `${permitId}_GST.pdf`;
            if (contentDisposition) {
              const match = contentDisposition.match(/filename="?([^"]+)"?/);
              if (match) filename = match[1];
            }
            const blob = new Blob([response.data], {
              type: "application/pdf",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          } catch (err) {
            console.error(`Failed to print GST for PermitId ${permitId}:`, err);
            alert(`Failed to download GST PDF for Permit: ${permitId}`);
          }
        }
        if (clearSelection) clearSelection();
        if (refreshTable) refreshTable();
      }

      if (label === "SUBMIT") {
        if (!selectedPermits.length) {
          alert("Please select at least one permit to submit.");
          return;
        }

        const userData = JSON.parse(localStorage.getItem("user"));
        const currentUsername = userData?.username;

        try {
          const response = await API.get("XmlSubmit/", {
            params: {
              PermitNumber: JSON.stringify(selectedPermits),
              user: currentUsername,
            },
          });

          if (response.data?.SUCCESS) {
            // alert(response.data.message);
            console.log(response.data.message);
            if (clearSelection) clearSelection();
            if (refreshTable) refreshTable();
          } else {
            alert(response.data?.error || "Submission failed");
          }
        } catch (error) {
          console.error("Submit error:", error);
          alert(
            error.response?.data?.error ||
              "Failed to submit permit(s). Please try again.",
          );
        }
      }
      if (label === "AMEND") {
        if (!selectedPermits.length) {
          alert("Please select a permit to amend.");
          return;
        }
        if (selectedPermits.length > 1) {
          alert("Please select only one permit at a time to amend.");
          return;
        }

        const permitId = selectedPermits[0];
        const userData = JSON.parse(localStorage.getItem("user"));
        const currentUsername = userData?.username;
        if (!currentUsername) {
          alert("Session Error: Please login again.");
          return;
        }

        try {
          const headerRes = await API.get("/getCommonHeaderByPermitId/", {
            params: { PermitId: permitId },
          });
          const headerData = headerRes.data;

          if (headerData.Status !== "APR") {
            alert(
              `Only APPROVED permits can be amended.\nCurrent status: ${headerData.Status || headerData.prmtStatus}`,
            );
            return;
          }

          const res = await API.post("copyInnonAmend/", {
            permits: [permitId],
            user: currentUsername,
          });

          if (res.data?.SUCCESS) {
            if (clearSelection) clearSelection();
            if (setSelectedPermits) setSelectedPermits([]);
            const copiedPermits = res.data.copiedPermits || [];

            if (copiedPermits.length === 1) {
              sessionStorage.removeItem("currentPermit");
              const newHeaderRes = await API.get(
                "/getCommonHeaderByPermitId/",
                {
                  params: { PermitId: copiedPermits[0] },
                },
              );
              navigate(`/innonpayment/edit/${copiedPermits[0]}`, {
                state: {
                  permitData: newHeaderRes.data,
                  openTab: "AmendTab",
                },
              });
            } else {
              alert(
                `${copiedPermits.length} permit(s) copied for amend successfully`,
              );
              if (refreshTable) refreshTable();
            }
          } else {
            alert(res.data?.error || "Amend copy failed");
          }
        } catch (err) {
          console.error("Amend copy/navigation error:", err);
          alert("Failed to copy permit for amending. Please try again.");
        }
      }

      if (label === "CANCEL") {
        if (!selectedPermits.length) {
          alert("Please select a permit to cancel.");
          return;
        }
        if (selectedPermits.length > 1) {
          alert("Please select only one permit at a time to cancel.");
          return;
        }

        const permitId = selectedPermits[0];
        const userData = JSON.parse(localStorage.getItem("user"));
        const currentUsername = userData?.username;
        if (!currentUsername) {
          alert("Session Error: Please login again.");
          return;
        }

        try {
          const headerRes = await API.get("/getCommonHeaderByPermitId/", {
            params: { PermitId: permitId },
          });
          const headerData = headerRes.data;

          if (headerData.Status !== "APR") {
            alert(
              `Only APPROVED permits can be canceled.\nCurrent status: ${headerData.Status || headerData.prmtStatus}`,
            );
            return;
          }

          const res = await API.post("copyInnonpaymentCancel/", {
            permits: [permitId],
            user: currentUsername,
          });

          if (res.data?.SUCCESS) {
            if (clearSelection) clearSelection();
            if (setSelectedPermits) setSelectedPermits([]);
            const copiedPermits = res.data.copiedPermits || [];

            if (copiedPermits.length === 1) {
              sessionStorage.removeItem("currentPermit");
              const newHeaderRes = await API.get(
                "/getCommonHeaderByPermitId/",
                {
                  params: { PermitId: copiedPermits[0] },
                },
              );
              navigate(`/innonpayment/edit/${copiedPermits[0]}`, {
                state: {
                  permitData: newHeaderRes.data,
                  openTab: "CancelTab",
                },
              });
            } else {
              alert(
                `${copiedPermits.length} permit(s) copied for cancel successfully`,
              );
              if (refreshTable) refreshTable();
            }
          } else {
            alert(res.data?.error || "Cancel copy failed");
          }
        } catch (err) {
          console.error("Cancel copy/navigation error:", err);
          alert("Failed to copy permit for canceling. Please try again.");
        }
      }


    } catch (error) {
      console.error("Permit creation failed:", error);
      const msg =
        error.response?.data?.error ||
        "Database Error: Could not generate Permit ID";
      alert(msg);
    }
  };

  const buttons = [
    "NEW",
    "SUBMIT",
    "PRINTGST",
    "PRINTREFUND",
    "COPY",
    "AMEND",
    "CANCEL",
  ];

  return (
    <nav className="navbar">
      <ul className="navbar-buttons">
        {buttons.map((label) => (
          <li key={label}>
            <button
              className={`navbar-btn ${label === "SUBMIT" ? "navbar-btn-submit" : ""}`}
              onClick={() => handleClick(label)}
              disabled={label !== "NEW" && btnState && !btnState[label]} 
              style={{
                backgroundColor:
                  label === "SUBMIT"
                    ? label !== "NEW" && btnState && !btnState[label]
                      ? "#8fbf8f" 
                      : "#2f01fd" 
                    : undefined,
                color: label === "SUBMIT" ? "#fff" : undefined,
                fontWeight: "bold",
                opacity:
                  label !== "NEW" && btnState && !btnState[label] ? 0.4 : 1, 
                cursor:
                  label !== "NEW" && btnState && !btnState[label]
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ListButtons;
