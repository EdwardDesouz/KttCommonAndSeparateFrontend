// import { useNavigate } from "react-router-dom";
// import API from "../api/api";
// import { useInpayment } from "../pages/Inpayment/context/inpaymentContext";

// function ListButtons({
//   newPath,
//   selectedPermits = [],
//   setSelectedPermits,
//   refreshTable,
// }) {
//   const navigate = useNavigate();
//   const { permitDetails, updatePermitDetails } = useInpayment();

//   const handleClick = async (label) => {
//     try {
//       if (label === "NEW") {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         const currentUsername = userData?.username;

//         if (!currentUsername) {
//           alert("Session Error: Please login again.");
//           return;
//         }

//         const res = await API.get(`inpaymentnew/?user=${currentUsername}`);

//         if (res.data?.PermitId) {
//           console.log("API RESPONSE:", res.data);
//           const newPermit = {
//             PermitId: res.data.PermitId,
//             JobId: res.data.JobId,
//             MsgId: res.data.MsgId,
//             RefId: res.data.RefId,
//             AccountId: res.data.AccountId,
//             LoginStatus: res.data.LoginStatus,
//             DateLastUpdated: res.data.DateLastUpdated,
//             MailBoxId: res.data.MailBoxId,
//             SeqPool: res.data.SeqPool,
//             StartSequence: res.data.StartSequence,
//             TradeNetMailboxID: res.data.TradeNetMailboxID,
//             DeclarantName: res.data.DeclarantName,
//             DeclarantCode: res.data.DeclarantCode,
//             DeclarantTel: res.data.DeclarantTel,
//             CRUEI: res.data.CRUEI,
//             Code: res.data.Code,
//             name: res.data.name,
//             name1: res.data.name1,
//             PermitNumber: res.data.PermitNumber,
//             prmtStatus: res.data.prmtStatus,
//             CurrentDate: res.data.CurrentDate,
//             prmtStatus: "NEW",
//           };
//           updatePermitDetails(newPermit);
//           sessionStorage.setItem("currentPermit", JSON.stringify(newPermit));
//           navigate(newPath);
//         }
//       }

//       if (label === "COPY") {
//         const userData = JSON.parse(localStorage.getItem("user"));
//         const currentUsername = userData?.username;

//         if (!currentUsername) {
//           alert("Session Error: Please login again.");
//           return;
//         }

//         if (!selectedPermits.length) {
//           alert("Select at least one permit to copy.");
//           return;
//         }

//         const res = await API.post("copyInpayment/", {
//           permits: selectedPermits,
//           user: currentUsername,
//         });

//         if (res.data?.SUCCESS) {
//           if (setSelectedPermits) setSelectedPermits([]);
//           const copiedPermits = res.data.copiedPermits || [];

//           if (copiedPermits.length === 1) {
//             try {
//               // Clear stale session before navigating
//               sessionStorage.removeItem("currentPermit");

//               const headerRes = await API.get("/getCommonHeaderByPermitId/", {
//                 params: { PermitId: copiedPermits[0] },
//               });

//               // Navigate to the COPIED permit's edit page
//               navigate(`/inpayment/edit/${copiedPermits[0]}`, {
//                 state: { permitData: headerRes.data },
//               });
//             } catch (err) {
//               console.error("Failed to load copied permit:", err);
//               if (refreshTable) refreshTable();
//             }
//           } else {
//             alert(`${copiedPermits.length} permit(s) copied successfully`);
//             if (refreshTable) refreshTable();
//           }
//         } else {
//           alert(res.data?.error || "Copy failed");
//         }
//       }
//     } catch (error) {
//       console.error("Permit creation failed:", error);
//       alert("Database Error: Could not generate Permit ID");
//     }
//   };

//   // Row 1 — primary actions
//   const row1 = [
//     "NEW",
//     "SUBMIT",
//     "COPY",
//     "REFUND",
//     "AMEND",
//     "CANCEL",
//     "DELETE ALL",
//     "MERGE",
//     "UNMERGE",
//     "ALLLIST",
//     "PRINT CCP",
//     "PRINTGST",
//     "PRINTREFUND",
//   ];

//   // Row 2 — print/download/status actions
//   const row2 = [
//     "PRINTSTATUS",
//     "DOWNLOAD CCP",
//     "DOWNLOAD DATA",
//     "GST STAUS",
//     "PRINT STATUS",
//     "OUT STATUS",
//     "PRINT GST ALL",
//     "GST EXCEL",
//     "VDP GST",
//   ];
//   return (
//     <nav className="navbar">
//       <ul className="navbar-buttons">
//         {row1.map((label) => (
//           <li key={label}>
//             <button className="navbar-btn" onClick={() => handleClick(label)}>
//               {label}
//             </button>
//           </li>
//         ))}
//       </ul>
//       <ul className="navbar-buttons">
//         {row2.map((label) => (
//           <li key={label}>
//             <button className="navbar-btn" onClick={() => handleClick(label)}>
//               {label}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// }

// export default ListButtons;

import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useInpayment } from "../pages/Inpayment/context/inpaymentContext";

const styles = `
  .navbar {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 12px;
    background: #f4f4f2;
    border-bottom: 1px solid #e0dfd8;
    width: 100%;
    box-sizing: border-box;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  }

  .navbar-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
  }

  .navbar-row-divider {
    height: 1px;
    background: #dddcd4;
    margin: 2px 0;
  }

  .navbar-btn {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 3px 10px;
    height: 26px;
    white-space: nowrap;
    cursor: pointer;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s ease, border-color 0.1s ease, transform 0.08s ease;
    user-select: none;
    background: #ffffff;
    color: #3a3a3a;
    border: 1px solid #c8c7c0;
  }

  .navbar-btn:hover { background: #eeecea; border-color: #aaa9a2; }
  .navbar-btn:active { transform: scale(0.96); background: #e4e3e0; }
  .navbar-btn:focus-visible { outline: 2px solid #5a8fc4; outline-offset: 1px; }

  .navbar-btn.btn-primary { background: #1a5fa8; color: #ffffff; border-color: #134d8e; }
  .navbar-btn.btn-primary:hover { background: #155492; border-color: #0f3f72; }
  .navbar-btn.btn-primary:active { background: #124980; }

  .navbar-btn.btn-danger { background: #c0392b; color: #ffffff; border-color: #a93226; }
  .navbar-btn.btn-danger:hover { background: #a93226; border-color: #922b21; }
  .navbar-btn.btn-danger:active { background: #922b21; }

  .navbar-btn.btn-secondary { background: #eaf2fb; color: #1a5fa8; border-color: #b3cfe8; }
  .navbar-btn.btn-secondary:hover { background: #d6e9f7; border-color: #7aaed4; }
  .navbar-btn.btn-secondary:active { background: #c2deee; }

  .navbar-btn.btn-warning { background: #fef6e4; color: #7d5a00; border-color: #e8c96a; }
  .navbar-btn.btn-warning:hover { background: #fdefc4; border-color: #c9a53d; }
  .navbar-btn.btn-warning:active { background: #f5e2a0; }

  .navbar-btn.btn-print { background: #f0f4ee; color: #3a6b30; border-color: #b2cead; }
  .navbar-btn.btn-print:hover { background: #dff0d8; border-color: #7aad6a; }
  .navbar-btn.btn-print:active { background: #cce4c4; }

  .navbar-btn.btn-download { background: #f3f0fb; color: #4a2fa0; border-color: #c2b3e8; }
  .navbar-btn.btn-download:hover { background: #e4dcf6; border-color: #9278cc; }
  .navbar-btn.btn-download:active { background: #d6caf0; }

  @media (prefers-color-scheme: dark) {
    .navbar { background: #1e1e1c; border-bottom-color: #2e2e2c; }
    .navbar-row-divider { background: #2e2e2c; }
    .navbar-btn { background: #2a2a28; color: #d4d4cc; border-color: #444440; }
    .navbar-btn:hover { background: #333330; border-color: #666660; }
    .navbar-btn:active { background: #3c3c38; }
    .navbar-btn.btn-primary { background: #1a5fa8; color: #e8f0fa; border-color: #2a7ad4; }
    .navbar-btn.btn-primary:hover { background: #1e6ec0; }
    .navbar-btn.btn-danger { background: #8b1e1e; color: #fce8e8; border-color: #c0392b; }
    .navbar-btn.btn-danger:hover { background: #a32828; }
    .navbar-btn.btn-secondary { background: #1a2f44; color: #7ab8e8; border-color: #2a4f72; }
    .navbar-btn.btn-secondary:hover { background: #1e3a54; }
    .navbar-btn.btn-warning { background: #3a2e00; color: #f0c040; border-color: #806400; }
    .navbar-btn.btn-warning:hover { background: #4a3a00; }
    .navbar-btn.btn-print { background: #1a2e18; color: #7ac870; border-color: #2e5228; }
    .navbar-btn.btn-print:hover { background: #203c1c; }
    .navbar-btn.btn-download { background: #1e1838; color: #a88ee8; border-color: #3a2c70; }
    .navbar-btn.btn-download:hover { background: #282048; }
  }
`;

function ListButtons({ newPath, selectedPermits = [], setSelectedPermits, refreshTable }) {
  const navigate = useNavigate();
  const { updatePermitDetails } = useInpayment();

  const handleClick = async (label) => {
    try {
      if (label === "NEW") {
        const userData = JSON.parse(localStorage.getItem("user"));
        const currentUsername = userData?.username;

        if (!currentUsername) {
          alert("Session Error: Please login again.");
          return;
        }

        const res = await API.get(`inpaymentnew/?user=${currentUsername}`);

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
            prmtStatus: "NEW",
            CurrentDate: res.data.CurrentDate,
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

        const res = await API.post("copyInpayment/", {
          permits: selectedPermits,
          user: currentUsername,
        });

        if (res.data?.SUCCESS) {
          if (setSelectedPermits) setSelectedPermits([]);
          const copiedPermits = res.data.copiedPermits || [];

          if (copiedPermits.length === 1) {
            try {
              sessionStorage.removeItem("currentPermit");
              const headerRes = await API.get("/getCommonHeaderByPermitId/", {
                params: { PermitId: copiedPermits[0] },
              });
              navigate(`/inpayment/edit/${copiedPermits[0]}`, {
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
    } catch (error) {
      console.error("Permit creation failed:", error);
      alert("Database Error: Could not generate Permit ID");
    }
  };

  const getBtnClass = (label) => {
    if (["NEW", "SUBMIT"].includes(label))           return "navbar-btn btn-primary";
    if (label === "DELETE ALL")                       return "navbar-btn btn-danger";
    if (["COPY", "AMEND"].includes(label))            return "navbar-btn btn-secondary";
    if (["CANCEL", "REFUND"].includes(label))         return "navbar-btn btn-warning";
    if (["PRINT CCP", "PRINTGST", "PRINTREFUND",
         "PRINTSTATUS", "PRINT STATUS",
         "PRINT GST ALL"].includes(label))            return "navbar-btn btn-print";
    if (["DOWNLOAD CCP", "DOWNLOAD DATA",
         "GST EXCEL"].includes(label))                return "navbar-btn btn-download";
    return "navbar-btn";
  };

  const row1 = [
    "NEW", "SUBMIT", "COPY", "REFUND", "AMEND", "CANCEL",
    "DELETE ALL", "MERGE", "UNMERGE", "ALLLIST",
    "PRINT CCP", "PRINTGST", "PRINTREFUND",
  ];

  const row2 = [
    "PRINTSTATUS", "DOWNLOAD CCP", "DOWNLOAD DATA", "GST STAUS",
    "PRINT STATUS", "OUT STATUS", "PRINT GST ALL", "GST EXCEL", "VDP GST",
  ];

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">
        <ul className="navbar-buttons">
          {row1.map((label) => (
            <li key={label}>
              <button className={getBtnClass(label)} onClick={() => handleClick(label)}>
                {label}
              </button>
            </li>
          ))}
        </ul>
        <div className="navbar-row-divider" />
        <ul className="navbar-buttons">
          {row2.map((label) => (
            <li key={label}>
              <button className={getBtnClass(label)} onClick={() => handleClick(label)}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default ListButtons;
