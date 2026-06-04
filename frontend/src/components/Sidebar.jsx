// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";

// import {
//   FaTachometerAlt,
//   FaDatabase,
//   FaExchangeAlt,
//   FaPiggyBank,
//   FaCogs,
//   FaFileAlt,
//   FaUniversity,
//   FaSearch,
//   FaMoneyCheckAlt,
//   FaFileInvoice,
//   FaArchive,
//   FaTools,
//   FaUserShield
// } from "react-icons/fa";

// import "../styles/sidebar.css";

// // ── Tabler icon map ───────────────────────────────────────────────────────────
// const subItemIconMap = {
//   // General Ledger
//   "GL-Report":                  "ti-report-analytics",
//   "A/C Balance Register":       "ti-receipt",
//   "Genral Ledger Wise":         "ti-list-details",
//   "Profit And Loss":            "ti-trending-up",
//   "General Ledger":             "ti-book",
//   "Trial Balance":              "ti-scale",
//   "Balance sheet":              "ti-building-bank",
//   "Branchwise GL Report":       "ti-git-branch",
//   "Recipt Payment Report":      "ti-file-invoice",
//   "Receipt & Payment With Bal": "ti-coins",
//   "Branch Adjustment":          "ti-adjustments-horizontal",
//   // Daily
//   "Cashbook":                   "ti-bookmarks",
//   "Daybook":                    "ti-calendar",
//   "vouchersub bOOK":            "ti-file-invoice",
//   "Voucher Printing":           "ti-printer",
//   "Daily Position Report":      "ti-report",
//   "scroll printing":            "ti-scroll",
//   "debit entry report":         "ti-file-minus",
//   "unpass entires":             "ti-file-x",
//   "supplementary report":       "ti-file-plus",
//   "Audit trial report":         "ti-shield-check",
//   "AML Alert":                  "ti-alert-triangle",
//   // Monthly
//   "Loan & Deposit Register":    "ti-report-analytics",
//   "Cut Book":                   "ti-scissors",
//   "Document Register":          "ti-files",
//   "CTR Reports":                "ti-file-description",
//   "KYC Reports":                "ti-id-badge",
//   "CD Ratio Report":            "ti-chart-bar",
//   "SMS Report":                 "ti-message",
//   "SI Report":                  "ti-repeat",
//   "Acc Open Close Report":      "ti-door",
//   "Monthly Deposit/Loans":      "ti-building-bank",
//   "InOperative Acc List":       "ti-list",
//   "Daily Bal Less Than Clg":    "ti-trending-down",
//   "TDS Report":                 "ti-receipt-tax",
//   "CRR / SLR Report":           "ti-percentage",
//   "CRARReport":                 "ti-chart-pie",
// };

// // ── Route map ─────────────────────────────────────────────────────────────────
// const subRouteMap = {
//   // General Ledger
//   "General_Ledger__GL-Report":                  "/reports/general-ledger/gl-report",
//   "General_Ledger__A/C Balance Register":       "/reports/general-ledger/ac-balance-register",
//   "General_Ledger__Genral Ledger Wise":         "/reports/general-ledger/ledger-wise",
//   "General_Ledger__Profit And Loss":            "/reports/general-ledger/profit-and-loss",
//   "General_Ledger__General Ledger":             "/reports/general-ledger/general-ledger",
//   "General_Ledger__Trial Balance":              "/reports/general-ledger/trial-balance",
//   "General_Ledger__Balance sheet":              "/reports/general-ledger/balance-sheet",
//   "General_Ledger__Branchwise GL Report":       "/reports/general-ledger/branchwise-gl-report",
//   "General_Ledger__Recipt Payment Report":      "/reports/general-ledger/receipt-payment-report",
//   "General_Ledger__Receipt & Payment With Bal": "/reports/general-ledger/receipt-payment-with-bal",
//   "General_Ledger__Branch Adjustment":          "/reports/general-ledger/branch-adjustment",
//   // Daily
//   "Daily__Cashbook":            "/reports/daily/cashbook",
//   "Daily__Daybook":             "/reports/daily/daybook",
//   "Daily__vouchersub bOOK":     "/reports/daily/vouchersub-book",
//   "Daily__Voucher Printing":  "/reports/daily/voucher-printing",
//   "Daily__Daily Position Report":  "/reports/daily/daily-position-report",
//   // Monthly — no leading slash so navigate() stays inside Layout
//   "Monthly__Loan & Deposit Register": "loan-deposit-register",
//   "Monthly__Cut Book":                "cut-book",
//   "Monthly__Document Register":       "document-register",
//   "Monthly__CTR Reports":             "ctr-report",
//   "Monthly__KYC Reports":             "kyc-report",
//   "Monthly__CD Ratio Report":         "cd-ratio-report",
//   "Monthly__SMS Report":              "sms-report",
//   "Monthly__SI Report":               "si-report",
//   "Monthly__Acc Open Close Report":   "reports/account-open-close",
//   "Monthly__Monthly Deposit/Loans":   "reports/branch-wise-deposit-loans",
//   "Monthly__InOperative Acc List":    "inoperative-acc-list",
//   "Monthly__Daily Bal Less Than Clg": "daily-bal-less-than-clg",
//   "Monthly__TDS Report":              "tds-report",
//   "Monthly__CRR / SLR Report":        "crr-slr-report",
//   "Monthly__CRARReport":              "crar-report",
// };

// // ── Menu data ─────────────────────────────────────────────────────────────────
// const menuItems = [
//   {
//     title: "DASHBOARD",
//     icon: <FaTachometerAlt />,
//     path: "/"
//   },
//   {
//     title: "MASTER",
//     icon: <FaDatabase />,
//     submenu: [
//       { label: "Customer Master" },
//       { label: "Employee Master" },
//       { label: "Branch Master" },
//       { label: "Agent Master" }
//     ]
//   },
//   {
//     title: "OTHER MASTER",
//     icon: <FaDatabase />,
//     submenu: [
//       { label: "Area Master" },
//       { label: "City Master" },
//       { label: "Document Master" }
//     ]
//   },
//   {
//     title: "TRANSACTION",
//     icon: <FaExchangeAlt />,
//     submenu: [
//       { label: "Cash Deposit" },
//       { label: "Cash Withdraw" },
//       { label: "Fund Transfer" }
//     ]
//   },
//   {
//     title: "DDS - PIGMY",
//     icon: <FaPiggyBank />,
//     submenu: [
//       { label: "Daily Collection" },
//       { label: "Agent Entry" },
//       { label: "Passbook Print" }
//     ]
//   },
//   {
//     title: "PROCESS",
//     icon: <FaCogs />,
//     submenu: [
//       { label: "Day Begin" },
//       { label: "Day End" },
//       { label: "Interest Process" }
//     ]
//   },
//   {
//     title: "REPORTS",
//     icon: <FaFileAlt />,
//     submenu: [
//       { label: "Customer_Reports",     children: [] },
//       {
//         label: "Daily",
//         children: [
//           "Cashbook",
//           "Daybook",
//           "vouchersub bOOK",
//           "Voucher Printing",
//           "Daily Position Report",
//           "scroll printing",
//           "debit entry report",
//           "unpass entires",
//           "supplementary report",
//           "Audit trial report",
//           "AML Alert",
//         ]
//       },
//       { label: "Cash",                 children: [] },
//       { label: "Share_Reports",        children: [] },
//       { label: "Term_Deposit",         children: [] },
//       { label: "Term_Loan",            children: [] },
//       { label: "Clearing_Reports",     children: [] },
//       { label: "Lockers",              children: [] },
//       { label: "Yearly",               children: [] },
//       {
//         label: "Monthly",
//         children: [
//           "Loan & Deposit Register",
//           "Cut Book",
//           "Document Register",
//           "CTR Reports",
//           "KYC Reports",
//           "CD Ratio Report",
//           "SMS Report",
//           "SI Report",
//           "Acc Open Close Report",
//           "Monthly Deposit/Loans",
//           "InOperative Acc List",
//           "Daily Bal Less Than Clg",
//           "TDS Report",
//           "CRR / SLR Report",
//           "CRARReport",
//         ]
//       },
//       { label: "Standing Instruction", children: [] },
//       {
//         label: "General_Ledger",
//         children: [
//           "GL-Report",
//           "A/C Balance Register",
//           "Genral Ledger Wise",
//           "Profit And Loss",
//           "General Ledger",
//           "Trial Balance",
//           "Balance sheet",
//           "Branchwise GL Report",
//           "Recipt Payment Report",
//           "Receipt & Payment With Bal",
//           "Branch Adjustment",
//         ]
//       },
//       { label: "Saving",               children: [] },
//       { label: "Monthly_Reporting",    children: [] },
//       { label: "Certificate",          children: [] },
//       { label: "GOI Security",         children: [] },
//     ]
//   },
//   {
//     title: "CLEARING",
//     icon: <FaUniversity />,
//     submenu: [
//       { label: "Cheque Entry" },
//       { label: "Cheque Return" },
//       { label: "Cheque Status" }
//     ]
//   },
//   {
//     title: "ENQUIRY",
//     icon: <FaSearch />,
//     submenu: [
//       { label: "Balance Enquiry" },
//       { label: "Customer Search" },
//       { label: "Statement" }
//     ]
//   },
//   {
//     title: "ACC HEAD",
//     icon: <FaMoneyCheckAlt />,
//     submenu: [
//       { label: "Account Head" },
//       { label: "Sub Head" },
//       { label: "GL Mapping" }
//     ]
//   },
//   {
//     title: "PARAMETER",
//     icon: <FaTools />,
//     submenu: [
//       { label: "System Config" },
//       { label: "SMS Config" },
//       { label: "Email Config" }
//     ]
//   },
//   {
//     title: "ADMIN",
//     icon: <FaUserShield />,
//     submenu: [
//       { label: "User Creation" },
//       { label: "Role Management" },
//       { label: "Permissions" }
//     ]
//   },
//   {
//     title: "TERM DEPOSIT",
//     icon: <FaFileInvoice />,
//     submenu: [
//       { label: "FD Opening" },
//       { label: "FD Renewal" },
//       { label: "FD Closure" }
//     ]
//   },
//   {
//     title: "LOAN & ADVANCES",
//     icon: <FaFileInvoice />,
//     submenu: [
//       { label: "Loan Entry" },
//       { label: "EMI Collection" },
//       { label: "Loan Closure" }
//     ]
//   },
//   {
//     title: "INVESTMENT",
//     icon: <FaMoneyCheckAlt />,
//     submenu: [
//       { label: "Investment Entry" },
//       { label: "Investment Reports" }
//     ]
//   },
//   {
//     title: "FD PRINTING",
//     icon: <FaFileInvoice />,
//     submenu: [
//       { label: "FD Certificate" },
//       { label: "Receipt Printing" }
//     ]
//   },
//   {
//     title: "DEAD STOCK",
//     icon: <FaArchive />,
//     submenu: [
//       { label: "Asset Entry" },
//       { label: "Asset Reports" }
//     ]
//   },
//   {
//     title: "UTILITY",
//     icon: <FaTools />,
//     submenu: [
//       { label: "SMS Utility" },
//       { label: "Backup Utility" },
//       { label: "Logs" }
//     ]
//   }
// ];

// // ── Component ─────────────────────────────────────────────────────────────────
// function Sidebar() {
//   const [openMenu, setOpenMenu]       = useState("MASTER");
//   const [openSubMenu, setOpenSubMenu] = useState(null);
//   const [activeChild, setActiveChild] = useState(null);
//   const navigate = useNavigate();

//   const toggleMenu = (menu) => {
//     setOpenMenu(openMenu === menu ? null : menu);
//     setOpenSubMenu(null);
//   };

//   const toggleSubMenu = (e, subKey) => {
//     e.stopPropagation();
//     setOpenSubMenu(openSubMenu === subKey ? null : subKey);
//   };

//   const handleChildClick = (parentLabel, childLabel) => {
//     const key  = `${parentLabel}__${childLabel}`;
//     const path = subRouteMap[key];
//     setActiveChild(key);
//     if (path) navigate(path);
//   };

//   return (
//     <div className="sidebar">

//       {/* SEARCH */}
//       <div className="search-box">
//         <input type="text" placeholder="Search menu..." />
//       </div>

//       {/* MENU */}
//       <ul className="menu-list">
//         {menuItems.map((item, index) => (
//           <li key={index}>

//             {item.path ? (
//               <NavLink to={item.path}>
//                 <div className="menu-left">
//                   {item.icon}
//                   <span>{item.title}</span>
//                 </div>
//               </NavLink>
//             ) : (
//               <>
//                 {/* MAIN MENU */}
//                 <div
//                   className={`menu-title ${openMenu === item.title ? "active-menu" : ""}`}
//                   onClick={() => toggleMenu(item.title)}
//                 >
//                   <div className="menu-left">
//                     {item.icon}
//                     <span>{item.title}</span>
//                   </div>
//                   <div className="plus-icon">
//                     {openMenu === item.title ? "−" : "+"}
//                   </div>
//                 </div>

//                 {/* SUBMENU */}
//                 {openMenu === item.title && (
//                   <ul className="submenu">
//                     {item.submenu.map((sub, i) => {
//                       const hasChildren = sub.children && sub.children.length > 0;
//                       const subKey      = `${item.title}__${sub.label}`;
//                       const isSubOpen   = openSubMenu === subKey;

//                       return (
//                         <li key={i}>
//                           {/* SUBMENU ITEM */}
//                           <div
//                             className={`submenu-item ${hasChildren ? "has-children" : ""}`}
//                             onClick={hasChildren ? (e) => toggleSubMenu(e, subKey) : undefined}
//                           >
//                             <span>{sub.label}</span>
//                             {hasChildren && (
//                               <div className="sub-plus-icon">
//                                 {isSubOpen ? "▲" : "▼"}
//                               </div>
//                             )}
//                           </div>

//                           {/* SUB-SUBMENU */}
//                           {hasChildren && isSubOpen && (
//                             <ul className="sub-submenu">
//                               {sub.children.map((child, j) => {
//                                 const childKey  = `${sub.label}__${child}`;
//                                 const iconClass = subItemIconMap[child] || "ti-file-text";
//                                 const isActive  = activeChild === childKey;
//                                 const hasRoute  = !!subRouteMap[childKey];

//                                 return (
//                                   <li
//                                     key={j}
//                                     className={`sub-submenu-item ${isActive ? "active-sub" : ""}`}
//                                     onClick={() => handleChildClick(sub.label, child)}
//                                     style={{
//                                       cursor:  hasRoute ? "pointer" : "default",
//                                       opacity: hasRoute ? 1 : 0.6,
//                                     }}
//                                   >
//                                     <i className={`ti ${iconClass} ssm-icon`} aria-hidden="true" />
//                                     <span>{child}</span>
//                                     <i className="ti ti-chevron-right ssm-arrow" aria-hidden="true" />
//                                   </li>
//                                 );
//                               })}
//                             </ul>
//                           )}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 )}
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;

// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";

// import {
//   FaTachometerAlt,
//   FaDatabase,
//   FaExchangeAlt,
//   FaPiggyBank,
//   FaCogs,
//   FaFileAlt,
//   FaUniversity,
//   FaSearch,
//   FaMoneyCheckAlt,
//   FaFileInvoice,
//   FaArchive,
//   FaTools,
//   FaUserShield
// } from "react-icons/fa";

// import "../styles/sidebar.css";

// // ── Tabler icon map ───────────────────────────────────────────────────────────
// const subItemIconMap = {
//   // General Ledger
//   "GL-Report":                  "ti-report-analytics",
//   "A/C Balance Register":       "ti-receipt",
//   "Genral Ledger Wise":         "ti-list-details",
//   "Profit And Loss":            "ti-trending-up",
//   "General Ledger":             "ti-book",
//   "Trial Balance":              "ti-scale",
//   "Balance sheet":              "ti-building-bank",
//   "Branchwise GL Report":       "ti-git-branch",
//   "Recipt Payment Report":      "ti-file-invoice",
//   "Receipt & Payment With Bal": "ti-coins",
//   "Branch Adjustment":          "ti-adjustments-horizontal",
//   // Daily
//   "Cashbook":                   "ti-bookmarks",
//   "Daybook":                    "ti-calendar",
//   "vouchersub bOOK":            "ti-file-invoice",
//   "Voucher Printing":           "ti-printer",
//   "Daily Position Report":      "ti-report",
//   "scroll printing":            "ti-scroll",
//   "debit entry report":         "ti-file-minus",
//   "unpass entires":             "ti-file-x",
//   "supplementary report":       "ti-file-plus",
//   "Audit trial report":         "ti-shield-check",
//   "AML Alert":                  "ti-alert-triangle",
//   // Monthly
//   "Loan & Deposit Register":    "ti-report-analytics",
//   "Cut Book":                   "ti-scissors",
//   "Document Register":          "ti-files",
//   "CTR Reports":                "ti-file-description",
//   "KYC Reports":                "ti-id-badge",
//   "CD Ratio Report":            "ti-chart-bar",
//   "SMS Report":                 "ti-message",
//   "SI Report":                  "ti-repeat",
//   "Acc Open Close Report":      "ti-door",
//   "Monthly Deposit/Loans":      "ti-building-bank",
//   "InOperative Acc List":       "ti-list",
//   "Daily Bal Less Than Clg":    "ti-trending-down",
//   "TDS Report":                 "ti-receipt-tax",
//   "CRR / SLR Report":           "ti-percentage",
//   "CRARReport":                 "ti-chart-pie",
// };

// // ── Route map ─────────────────────────────────────────────────────────────────
// const subRouteMap = {
//   // General Ledger
//   "General_Ledger__GL-Report":                  "/reports/general-ledger/gl-report",
//   "General_Ledger__A/C Balance Register":       "/reports/general-ledger/ac-balance-register",
//   "General_Ledger__Genral Ledger Wise":         "/reports/general-ledger/ledger-wise",
//   "General_Ledger__Profit And Loss":            "/reports/general-ledger/profit-and-loss",
//   "General_Ledger__General Ledger":             "/reports/general-ledger/general-ledger",
//   "General_Ledger__Trial Balance":              "/reports/general-ledger/trial-balance",
//   "General_Ledger__Balance sheet":              "/reports/general-ledger/balance-sheet",
//   "General_Ledger__Branchwise GL Report":       "/reports/general-ledger/branchwise-gl-report",
//   "General_Ledger__Recipt Payment Report":      "/reports/general-ledger/receipt-payment-report",
//   "General_Ledger__Receipt & Payment With Bal": "/reports/general-ledger/receipt-payment-with-bal",
//   "General_Ledger__Branch Adjustment":          "/reports/general-ledger/branch-adjustment",
//   // Daily
//   "Daily__Cashbook":            "/reports/daily/cashbook",
//   "Daily__Daybook":             "/reports/daily/daybook",
//   "Daily__vouchersub bOOK":     "/reports/daily/vouchersub-book",
//   "Daily__Voucher Printing":  "/reports/daily/voucher-printing",
//   "Daily__Daily Position Report":  "/reports/daily/daily-position-report",
//   // Monthly — no leading slash so navigate() stays inside Layout
//   "Monthly__Loan & Deposit Register": "loan-deposit-register",
//   "Monthly__Cut Book":                "cut-book",
//   "Monthly__Document Register":       "document-register",
//   "Monthly__CTR Reports":             "ctr-report",
//   "Monthly__KYC Reports":             "kyc-report",
//   "Monthly__CD Ratio Report":         "cd-ratio-report",
//   "Monthly__SMS Report":              "sms-report",
//   "Monthly__SI Report":               "si-report",
//   "Monthly__Acc Open Close Report":   "reports/account-open-close",
//   "Monthly__Monthly Deposit/Loans":   "reports/branch-wise-deposit-loans",
//   "Monthly__InOperative Acc List":    "inoperative-acc-list",
//   "Monthly__Daily Bal Less Than Clg": "daily-bal-less-than-clg",
//   "Monthly__TDS Report":              "tds-report",
//   "Monthly__CRR / SLR Report":        "crr-slr-report",
//   "Monthly__CRARReport":              "crar-report",
// };

// // ── Menu data ─────────────────────────────────────────────────────────────────
// const menuItems = [
//   {
//     title: "DASHBOARD",
//     icon: <FaTachometerAlt />,
//     path: "/"
//   },
//   {
//     title: "MASTER",
//     icon: <FaDatabase />,
//     submenu: [
//       { label: "Customer Master" },
//       { label: "Employee Master" },
//       { label: "Branch Master" },
//       { label: "Agent Master" }
//     ]
//   },
//   {
//     title: "OTHER MASTER",
//     icon: <FaDatabase />,
//     submenu: [
//       { label: "Area Master" },
//       { label: "City Master" },
//       { label: "Document Master" }
//     ]
//   },
//   {
//     title: "TRANSACTION",
//     icon: <FaExchangeAlt />,
//     submenu: [
//       { label: "Cash Deposit" },
//       { label: "Cash Withdraw" },
//       { label: "Fund Transfer" }
//     ]
//   },
//   {
//     title: "DDS - PIGMY",
//     icon: <FaPiggyBank />,
//     submenu: [
//       { label: "Daily Collection" },
//       { label: "Agent Entry" },
//       { label: "Passbook Print" }
//     ]
//   },
//   {
//     title: "PROCESS",
//     icon: <FaCogs />,
//     submenu: [
//       { label: "Day Begin" },
//       { label: "Day End" },
//       { label: "Interest Process" }
//     ]
//   },
//   {
//     title: "REPORTS",
//     icon: <FaFileAlt />,
//     submenu: [
//       { label: "Customer_Reports",     children: [] },
//       {
//         label: "Daily",
//         children: [
//           "Cashbook",
//           "Daybook",
//           "vouchersub bOOK",
//           "Voucher Printing",
//           "Daily Position Report",
//           "scroll printing",
//           "debit entry report",
//           "unpass entires",
//           "supplementary report",
//           "Audit trial report",
//           "AML Alert",
//         ]
//       },
//       { label: "Cash",                 children: [] },
//       { label: "Share_Reports",        children: [] },
//       { label: "Term_Deposit",         children: [] },
//       { label: "Term_Loan",            children: [] },
//       { label: "Clearing_Reports",     children: [] },
//       { label: "Lockers",              children: [] },
//       { label: "Yearly",               children: [] },
//       {
//         label: "Monthly",
//         children: [
//           "Loan & Deposit Register",
//           "Cut Book",
//           "Document Register",
//           "CTR Reports",
//           "KYC Reports",
//           "CD Ratio Report",
//           "SMS Report",
//           "SI Report",
//           "Acc Open Close Report",
//           "Monthly Deposit/Loans",
//           "InOperative Acc List",
//           "Daily Bal Less Than Clg",
//           "TDS Report",
//           "CRR / SLR Report",
//           "CRARReport",
//         ]
//       },
//       { label: "Standing Instruction", children: [] },
//       {
//         label: "General_Ledger",
//         children: [
//           "GL-Report",
//           "A/C Balance Register",
//           "Genral Ledger Wise",
//           "Profit And Loss",
//           "General Ledger",
//           "Trial Balance",
//           "Balance sheet",
//           "Branchwise GL Report",
//           "Recipt Payment Report",
//           "Receipt & Payment With Bal",
//           "Branch Adjustment",
//         ]
//       },
//       { label: "Saving",               children: [] },
//       { label: "Monthly_Reporting",    children: [] },
//       { label: "Certificate",          children: [] },
//       { label: "GOI Security",         children: [] },
//     ]
//   },
//   {
//     title: "CLEARING",
//     icon: <FaUniversity />,
//     submenu: [
//       { label: "Cheque Entry" },
//       { label: "Cheque Return" },
//       { label: "Cheque Status" }
//     ]
//   },
//   {
//     title: "ENQUIRY",
//     icon: <FaSearch />,
//     submenu: [
//       { label: "Balance Enquiry" },
//       { label: "Customer Search" },
//       { label: "Statement" }
//     ]
//   },
//   {
//     title: "ACC HEAD",
//     icon: <FaMoneyCheckAlt />,
//     submenu: [
//       { label: "Account Head" },
//       { label: "Sub Head" },
//       { label: "GL Mapping" }
//     ]
//   },
//   {
//     title: "PARAMETER",
//     icon: <FaTools />,
//     submenu: [
//       { label: "System Config" },
//       { label: "SMS Config" },
//       { label: "Email Config" }
//     ]
//   },
//   {
//     title: "ADMIN",
//     icon: <FaUserShield />,
//     submenu: [
//       { label: "User Creation" },
//       { label: "Role Management" },
//       { label: "Permissions" }
//     ]
//   },
//   {
//     title: "TERM DEPOSIT",
//     icon: <FaFileInvoice />,
//     submenu: [
//       { label: "FD Opening" },
//       { label: "FD Renewal" },
//       { label: "FD Closure" }
//     ]
//   },
//   {
//     title: "LOAN & ADVANCES",
//     icon: <FaFileInvoice />,
//     submenu: [
//       { label: "Loan Entry" },
//       { label: "EMI Collection" },
//       { label: "Loan Closure" }
//     ]
//   },
//   {
//     title: "INVESTMENT",
//     icon: <FaMoneyCheckAlt />,
//     submenu: [
//       { label: "Investment Entry" },
//       { label: "Investment Reports" }
//     ]
//   },
//   {
//     title: "FD PRINTING",
//     icon: <FaFileInvoice />,
//     submenu: [
//       { label: "FD Certificate" },
//       { label: "Receipt Printing" }
//     ]
//   },
//   {
//     title: "DEAD STOCK",
//     icon: <FaArchive />,
//     submenu: [
//       { label: "Asset Entry" },
//       { label: "Asset Reports" }
//     ]
//   },
//   {
//     title: "UTILITY",
//     icon: <FaTools />,
//     submenu: [
//       { label: "SMS Utility" },
//       { label: "Backup Utility" },
//       { label: "Logs" }
//     ]
//   }
// ];

// // ── Component ─────────────────────────────────────────────────────────────────
// function Sidebar() {
//   const [openMenu, setOpenMenu]       = useState("MASTER");
//   const [openSubMenu, setOpenSubMenu] = useState(null);
//   const [activeChild, setActiveChild] = useState(null);
//   const navigate = useNavigate();

//   const toggleMenu = (menu) => {
//     setOpenMenu(openMenu === menu ? null : menu);
//     setOpenSubMenu(null);
//   };

//   const toggleSubMenu = (e, subKey) => {
//     e.stopPropagation();
//     setOpenSubMenu(openSubMenu === subKey ? null : subKey);
//   };

//   const handleChildClick = (parentLabel, childLabel) => {
//     const key  = `${parentLabel}__${childLabel}`;
//     const path = subRouteMap[key];
//     setActiveChild(key);
//     if (path) navigate(path);
//   };

//   return (
//     <div className="sidebar">

//       {/* SEARCH */}
//       <div className="search-box">
//         <input type="text" placeholder="Search menu..." />
//       </div>

//       {/* MENU */}
//       <ul className="menu-list">
//         {menuItems.map((item, index) => (
//           <li key={index}>

//             {item.path ? (
//               <NavLink to={item.path}>
//                 <div className="menu-left">
//                   {item.icon}
//                   <span>{item.title}</span>
//                 </div>
//               </NavLink>
//             ) : (
//               <>
//                 {/* MAIN MENU */}
//                 <div
//                   className={`menu-title ${openMenu === item.title ? "active-menu" : ""}`}
//                   onClick={() => toggleMenu(item.title)}
//                 >
//                   <div className="menu-left">
//                     {item.icon}
//                     <span>{item.title}</span>
//                   </div>
//                   <div className="plus-icon">
//                     {openMenu === item.title ? "−" : "+"}
//                   </div>
//                 </div>

//                 {/* SUBMENU */}
//                 {openMenu === item.title && (
//                   <ul className="submenu">
//                     {item.submenu.map((sub, i) => {
//                       const hasChildren = sub.children && sub.children.length > 0;
//                       const subKey      = `${item.title}__${sub.label}`;
//                       const isSubOpen   = openSubMenu === subKey;

//                       return (
//                         <li key={i}>
//                           {/* SUBMENU ITEM */}
//                           <div
//                             className={`submenu-item ${hasChildren ? "has-children" : ""}`}
//                             onClick={hasChildren ? (e) => toggleSubMenu(e, subKey) : undefined}
//                           >
//                             <span>{sub.label}</span>
//                             {hasChildren && (
//                               <div className="sub-plus-icon">
//                                 {isSubOpen ? "▲" : "▼"}
//                               </div>
//                             )}
//                           </div>

//                           {/* SUB-SUBMENU */}
//                           {hasChildren && isSubOpen && (
//                             <ul className="sub-submenu">
//                               {sub.children.map((child, j) => {
//                                 const childKey  = `${sub.label}__${child}`;
//                                 const iconClass = subItemIconMap[child] || "ti-file-text";
//                                 const isActive  = activeChild === childKey;
//                                 const hasRoute  = !!subRouteMap[childKey];

//                                 return (
//                                   <li
//                                     key={j}
//                                     className={`sub-submenu-item ${isActive ? "active-sub" : ""}`}
//                                     onClick={() => handleChildClick(sub.label, child)}
//                                     style={{
//                                       cursor:  hasRoute ? "pointer" : "default",
//                                       opacity: hasRoute ? 1 : 0.6,
//                                     }}
//                                   >
//                                     <i className={`ti ${iconClass} ssm-icon`} aria-hidden="true" />
//                                     <span>{child}</span>
//                                     <i className="ti ti-chevron-right ssm-arrow" aria-hidden="true" />
//                                   </li>
//                                 );
//                               })}
//                             </ul>
//                           )}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 )}
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaDatabase,
  FaExchangeAlt,
  FaPiggyBank,
  FaCogs,
  FaFileAlt,
  FaUniversity,
  FaSearch,
  FaMoneyCheckAlt,
  FaFileInvoice,
  FaArchive,
  FaTools,
  FaUserShield
} from "react-icons/fa";

import "../styles/sidebar.css";

// ── Tabler icon map ───────────────────────────────────────────────────────────
const subItemIconMap = {
  // General Ledger
  "GL-Report":                  "ti-report-analytics",
  "A/C Balance Register":       "ti-receipt",
  "Genral Ledger Wise":         "ti-list-details",
  "Profit And Loss":            "ti-trending-up",
  "General Ledger":             "ti-book",
  "Trial Balance":              "ti-scale",
  "Balance sheet":              "ti-building-bank",
  "Branchwise GL Report":       "ti-git-branch",
  "Recipt Payment Report":      "ti-file-invoice",
  "Receipt & Payment With Bal": "ti-coins",
  "Branch Adjustment":          "ti-adjustments-horizontal",
  // Daily
  "Cashbook":                   "ti-bookmarks",
  "Daybook":                    "ti-calendar",
  "vouchersub bOOK":            "ti-file-invoice",
  "Voucher Printing":           "ti-printer",
  "Daily Position Report":      "ti-report",
  "scroll printing":            "ti-scroll",
  "debit entry report":         "ti-file-minus",
  "unpass entires":             "ti-file-x",
  "supplementary report":       "ti-file-plus",
  "Audit trial report":         "ti-shield-check",
  "AML Alert":                  "ti-alert-triangle",
  // Monthly
  "Loan & Deposit Register":    "ti-report-analytics",
  "Cut Book":                   "ti-scissors",
  "Document Register":          "ti-files",
  "CTR Reports":                "ti-file-description",
  "KYC Reports":                "ti-id-badge",
  "CD Ratio Report":            "ti-chart-bar",
  "SMS Report":                 "ti-message",
  "SI Report":                  "ti-repeat",
  "Acc Open Close Report":      "ti-door",
  "Monthly Deposit/Loans":      "ti-building-bank",
  "InOperative Acc List":       "ti-list",
  "Daily Bal Less Than Clg":    "ti-trending-down",
  "TDS Report":                 "ti-receipt-tax",
  "CRR / SLR Report":           "ti-percentage",
  "CRARReport":                 "ti-chart-pie",
};

// ── Route map ─────────────────────────────────────────────────────────────────
const subRouteMap = {
  // General Ledger
  "General_Ledger__GL-Report":                  "/reports/general-ledger/gl-report",
  "General_Ledger__A/C Balance Register":       "/reports/general-ledger/ac-balance-register",
  "General_Ledger__Genral Ledger Wise":         "/reports/general-ledger/ledger-wise",
  "General_Ledger__Profit And Loss":            "/reports/general-ledger/profit-and-loss",
  "General_Ledger__General Ledger":             "/reports/general-ledger/general-ledger",
  "General_Ledger__Trial Balance":              "/reports/general-ledger/trial-balance",
  "General_Ledger__Balance sheet":              "/reports/general-ledger/balance-sheet",
  "General_Ledger__Branchwise GL Report":       "/reports/general-ledger/branchwise-gl-report",
  "General_Ledger__Recipt Payment Report":      "/reports/general-ledger/receipt-payment-report",
  "General_Ledger__Receipt & Payment With Bal": "/reports/general-ledger/receipt-payment-with-bal",
  "General_Ledger__Branch Adjustment":          "/reports/general-ledger/branch-adjustment",
  // Daily
  "Daily__Cashbook":            "/reports/daily/cashbook",
  "Daily__Daybook":             "/reports/daily/daybook",
  "Daily__vouchersub bOOK":     "/reports/daily/vouchersub-book",
  "Daily__Voucher Printing":    "/reports/daily/voucher-printing",
  "Daily__scroll printing":     "/reports/daily/scroll-printing",
  "Daily__debit entry report":  "/reports/daily/debit-entry-report",
  "Daily__Daily Position Report": "/reports/daily/daily-position-report",
  "Daily__unpass entires": "/reports/daily/unpass-entries",
  "Daily__supplementary report": "/reports/daily/supplementary-printing",
  "Daily__Audit trial report": "/reports/daily/audit-trial-report",


  // Monthly — no leading slash so navigate() stays inside Layout
  "Monthly__Loan & Deposit Register": "loan-deposit-register",
  "Monthly__Cut Book":                "cut-book",
  "Monthly__Document Register":       "document-register",
  "Monthly__CTR Reports":             "ctr-report",
  "Monthly__KYC Reports":             "kyc-report",
  "Monthly__CD Ratio Report":         "cd-ratio-report",
  "Monthly__SMS Report":              "sms-report",
  "Monthly__SI Report":               "si-report",
  "Monthly__Acc Open Close Report":   "reports/account-open-close",
  "Monthly__Monthly Deposit/Loans":   "reports/branch-wise-deposit-loans",
  "Monthly__InOperative Acc List":    "inoperative-acc-list",
  "Monthly__Daily Bal Less Than Clg": "daily-bal-less-than-clg",
  "Monthly__TDS Report":              "tds-report",
  "Monthly__CRR / SLR Report":        "crr-slr-report",
  "Monthly__CRARReport":              "crar-report",
};

// ── Menu data ─────────────────────────────────────────────────────────────────
const menuItems = [
  {
    title: "DASHBOARD",
    icon: <FaTachometerAlt />,
    path: "/"
  },
  {
    title: "MASTER",
    icon: <FaDatabase />,
    submenu: [
      { label: "Customer Master" },
      { label: "Employee Master" },
      { label: "Branch Master" },
      { label: "Agent Master" }
    ]
  },
  {
    title: "OTHER MASTER",
    icon: <FaDatabase />,
    submenu: [
      { label: "Area Master" },
      { label: "City Master" },
      { label: "Document Master" }
    ]
  },
  {
    title: "TRANSACTION",
    icon: <FaExchangeAlt />,
    submenu: [
      { label: "Cash Deposit" },
      { label: "Cash Withdraw" },
      { label: "Fund Transfer" }
    ]
  },
  {
    title: "DDS - PIGMY",
    icon: <FaPiggyBank />,
    submenu: [
      { label: "Daily Collection" },
      { label: "Agent Entry" },
      { label: "Passbook Print" }
    ]
  },
  {
    title: "PROCESS",
    icon: <FaCogs />,
    submenu: [
      { label: "Day Begin" },
      { label: "Day End" },
      { label: "Interest Process" }
    ]
  },
  {
    title: "REPORTS",
    icon: <FaFileAlt />,
    submenu: [
      { label: "Customer_Reports",     children: [] },
      {
        label: "Daily",
        children: [
          "Cashbook",
          "Daybook",
          "vouchersub bOOK",
          "Voucher Printing",
          "Daily Position Report",
          "scroll printing",
          "debit entry report",
          "unpass entires",
          "supplementary report",
          "Audit trial report",
          "AML Alert",
        ]
      },
      { label: "Cash",                 children: [] },
      { label: "Share_Reports",        children: [] },
      { label: "Term_Deposit",         children: [] },
      { label: "Term_Loan",            children: [] },
      { label: "Clearing_Reports",     children: [] },
      { label: "Lockers",              children: [] },
      { label: "Yearly",               children: [] },
      {
        label: "Monthly",
        children: [
          "Loan & Deposit Register",
          "Cut Book",
          "Document Register",
          "CTR Reports",
          "KYC Reports",
          "CD Ratio Report",
          "SMS Report",
          "SI Report",
          "Acc Open Close Report",
          "Monthly Deposit/Loans",
          "InOperative Acc List",
          "Daily Bal Less Than Clg",
          "TDS Report",
          "CRR / SLR Report",
          "CRARReport",
        ]
      },
      { label: "Standing Instruction", children: [] },
      {
        label: "General_Ledger",
        children: [
          "GL-Report",
          "A/C Balance Register",
          "Genral Ledger Wise",
          "Profit And Loss",
          "General Ledger",
          "Trial Balance",
          "Balance sheet",
          "Branchwise GL Report",
          "Recipt Payment Report",
          "Receipt & Payment With Bal",
          "Branch Adjustment",
        ]
      },
      { label: "Saving",               children: [] },
      { label: "Monthly_Reporting",    children: [] },
      { label: "Certificate",          children: [] },
      { label: "GOI Security",         children: [] },
    ]
  },
  {
    title: "CLEARING",
    icon: <FaUniversity />,
    submenu: [
      { label: "Cheque Entry" },
      { label: "Cheque Return" },
      { label: "Cheque Status" }
    ]
  },
  {
    title: "ENQUIRY",
    icon: <FaSearch />,
    submenu: [
      { label: "Balance Enquiry" },
      { label: "Customer Search" },
      { label: "Statement" }
    ]
  },
  {
    title: "ACC HEAD",
    icon: <FaMoneyCheckAlt />,
    submenu: [
      { label: "Account Head" },
      { label: "Sub Head" },
      { label: "GL Mapping" }
    ]
  },
  {
    title: "PARAMETER",
    icon: <FaTools />,
    submenu: [
      { label: "System Config" },
      { label: "SMS Config" },
      { label: "Email Config" }
    ]
  },
  {
    title: "ADMIN",
    icon: <FaUserShield />,
    submenu: [
      { label: "User Creation" },
      { label: "Role Management" },
      { label: "Permissions" }
    ]
  },
  {
    title: "TERM DEPOSIT",
    icon: <FaFileInvoice />,
    submenu: [
      { label: "FD Opening" },
      { label: "FD Renewal" },
      { label: "FD Closure" }
    ]
  },
  {
    title: "LOAN & ADVANCES",
    icon: <FaFileInvoice />,
    submenu: [
      { label: "Loan Entry" },
      { label: "EMI Collection" },
      { label: "Loan Closure" }
    ]
  },
  {
    title: "INVESTMENT",
    icon: <FaMoneyCheckAlt />,
    submenu: [
      { label: "Investment Entry" },
      { label: "Investment Reports" }
    ]
  },
  {
    title: "FD PRINTING",
    icon: <FaFileInvoice />,
    submenu: [
      { label: "FD Certificate" },
      { label: "Receipt Printing" }
    ]
  },
  {
    title: "DEAD STOCK",
    icon: <FaArchive />,
    submenu: [
      { label: "Asset Entry" },
      { label: "Asset Reports" }
    ]
  },
  {
    title: "UTILITY",
    icon: <FaTools />,
    submenu: [
      { label: "SMS Utility" },
      { label: "Backup Utility" },
      { label: "Logs" }
    ]
  }
];

// ── Component ─────────────────────────────────────────────────────────────────
function Sidebar() {
  const [openMenu, setOpenMenu]       = useState("MASTER");
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setOpenSubMenu(null);
  };

  const toggleSubMenu = (e, subKey) => {
    e.stopPropagation();
    setOpenSubMenu(openSubMenu === subKey ? null : subKey);
  };

  const handleChildClick = (parentLabel, childLabel) => {
    const key  = `${parentLabel}__${childLabel}`;
    const path = subRouteMap[key];
    setActiveChild(key);
    if (path) navigate(path);
  };

  return (
    <div className="sidebar">

      {/* SEARCH */}
      <div className="search-box">
        <input type="text" placeholder="Search menu..." />
      </div>

      {/* MENU */}
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li key={index}>

            {item.path ? (
              <NavLink to={item.path}>
                <div className="menu-left">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              </NavLink>
            ) : (
              <>
                {/* MAIN MENU */}
                <div
                  className={`menu-title ${openMenu === item.title ? "active-menu" : ""}`}
                  onClick={() => toggleMenu(item.title)}
                >
                  <div className="menu-left">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <div className="plus-icon">
                    {openMenu === item.title ? "−" : "+"}
                  </div>
                </div>

                {/* SUBMENU */}
                {openMenu === item.title && (
                  <ul className="submenu">
                    {item.submenu.map((sub, i) => {
                      const hasChildren = sub.children && sub.children.length > 0;
                      const subKey      = `${item.title}__${sub.label}`;
                      const isSubOpen   = openSubMenu === subKey;

                      return (
                        <li key={i}>
                          {/* SUBMENU ITEM */}
                          <div
                            className={`submenu-item ${hasChildren ? "has-children" : ""}`}
                            onClick={hasChildren ? (e) => toggleSubMenu(e, subKey) : undefined}
                          >
                            <span>{sub.label}</span>
                            {hasChildren && (
                              <div className="sub-plus-icon">
                                {isSubOpen ? "▲" : "▼"}
                              </div>
                            )}
                          </div>

                          {/* SUB-SUBMENU */}
                          {hasChildren && isSubOpen && (
                            <ul className="sub-submenu">
                              {sub.children.map((child, j) => {
                                const childKey  = `${sub.label}__${child}`;
                                const iconClass = subItemIconMap[child] || "ti-file-text";
                                const isActive  = activeChild === childKey;
                                const hasRoute  = !!subRouteMap[childKey];

                                return (
                                  <li
                                    key={j}
                                    className={`sub-submenu-item ${isActive ? "active-sub" : ""}`}
                                    onClick={() => handleChildClick(sub.label, child)}
                                    style={{
                                      cursor:  hasRoute ? "pointer" : "default",
                                      opacity: hasRoute ? 1 : 0.6,
                                    }}
                                  >
                                    <i className={`ti ${iconClass} ssm-icon`} aria-hidden="true" />
                                    <span>{child}</span>
                                    <i className="ti ti-chevron-right ssm-arrow" aria-hidden="true" />
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;