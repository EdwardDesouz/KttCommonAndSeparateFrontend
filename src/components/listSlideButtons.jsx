// import { useNavigate } from "react-router-dom";

// function ListButtons({ newPath }) {
//   const navigate = useNavigate();

//   const handleClick = (label) => {
//     if (label === "NEW") {
//       navigate(newPath);
//     }
//   };

//   const buttons = [
//     "NEW",
//     "TRANSMIT",
//     "COPY",
//     "DOWNLOAD DATA",
//     "MERGE",
//     "UNMERGE",
//   ];

//   return (
//     <div className="sidebar">
//       <div className="sidebar-buttons">
//         {buttons.map((label) => (
//           <button
//             key={label}
//             className="sidebar-btn"
//             onClick={() => handleClick(label)}
//           >
//             {label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ListButtons;

import { useNavigate } from "react-router-dom";

function ListButtons({ newPath }) {
  const navigate = useNavigate();

  const handleClick = (label) => {
    if (label === "NEW") {
      navigate(newPath);
    }
  };

  const buttons = [
    "NEW",
    "SUBMIT",
    "PRINTGST",
    "PRINTREFUND",
    "COPY",
    "REFUND",
    "AMEND",
    "CANCEL",
    "PRINTSTATUS",
    // "DOWNLOAD CCP",
    // "DOWNLOAD DATA",
    // "DELETE ALL",
    // "GST STAUS",
    // "PRINT STATUS",
    // "OUT STATUS",
    // "PRINT GST ALL",
  ];

  return (
    <nav className="navbar">
      <ul className="navbar-buttons">
        {buttons.map((label) => (
          <li key={label}>
            <button className="navbar-btn" onClick={() => handleClick(label)}>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ListButtons;
