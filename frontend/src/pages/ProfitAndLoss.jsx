// import { useState, useRef } from "react";
// import "./ProfitAndLoss.css";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// // ── Per report-type config ────────────────────────────────────────────────────
// const REPORT_CONFIG = {
//   "As On Date": {
//     dateMode: "asOnDate",
//     buttons: ["show", "profitLossReport", "textReportView", "reportWithWorkingDay"]
//   },
//   "N Form PL": {
//     dateMode: "range",
//     buttons: ["show", "profitLossReport", "textReportView"]
//   },
//   "Income / Expenditure": {
//     dateMode: "range",
//     buttons: ["show", "profitLossReport", "textReportView", "intPaidReport"]
//   },
//   "Admin Expenses": {
//     dateMode: "range",
//     buttons: ["show", "profitLossReport", "textReportView"]
//   },
//   "PL Marathi": {
//     dateMode: "asOnDate",
//     buttons: ["show", "profitLossReport", "textReportView"]
//   },
//   "N Form PL Marathi": {
//     dateMode: "range",
//     buttons: ["show", "profitLossReport", "textReportView"]
//   }
// };

// const BUTTON_LABELS = {
//   show:                 "Show",
//   profitLossReport:     "Profit Loss Report",
//   textReportView:       "Text Report View",
//   reportWithWorkingDay: "Report With Working Day",
//   intPaidReport:        "Int Paid Report"
// };

// // ── Format number with 2 decimals ─────────────────────────────────────────────
// const fmt = (v) => {
//   const n = parseFloat(v);
//   if (isNaN(n) || n === 0) return "";
//   return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// // ── Detect data shape ──────────────────────────────────────────────
// const detectShape = (data) => {
//   if (!data || data.length === 0) return "unknown";
//   const keys = Object.keys(data[0]);
//   if (keys.includes("EAMOUNT") && keys.includes("IAMOUNT")) return "horizontal";
//   if (keys.includes("DEBIT") && keys.includes("CREDIT")) return "flat_dr_cr";
//   return "unknown";
// };

// // ── Render the formatted P&L report ───────────────────────────────────────────
// function PLReport({ data, branchCode, asOnDate }) {
//   const shape = detectShape(data);

//   if (shape === "unknown") {
//     return null; // Fallback to grid view handled by parent
//   }

//   const displayDate = asOnDate || new Date().toLocaleDateString("en-GB");

//   let leftGroups = [];
//   let rightGroups = [];
//   let grandTotalLeft = 0;
//   let grandTotalRight = 0;

//   // 1. Normalize data into Groups
//   if (shape === "horizontal") {
//     let currLeft = null;
//     let currRight = null;

//     data.forEach(row => {
//       // Left
//       if (row.EGLNM || row.EAMOUNT) {
//         const eAmt = parseFloat(row.EAMOUNT || 0);
//         grandTotalLeft += eAmt;
//         const rawGrp = row.DESCE || row.EGLGROUP || "";
//         const displayGrp = rawGrp === "GL" ? "" : rawGrp;

//         if (!currLeft || currLeft.rawGrp !== rawGrp) {
//           currLeft = { name: displayGrp, rawGrp, items: [], total: 0 };
//           leftGroups.push(currLeft);
//         }
//         currLeft.items.push({ code: row.ESUBGL, desc: row.EGLNM, bal: eAmt });
//         currLeft.total += eAmt;
//       }
      
//       // Right
//       if (row.IGLNM || row.IAMOUNT) {
//         const iAmt = parseFloat(row.IAMOUNT || 0);
//         grandTotalRight += iAmt;
//         const rawGrp = row.DESCP || row.IGLGROUP || "";
//         const displayGrp = rawGrp === "GL" ? "" : rawGrp;

//         if (!currRight || currRight.rawGrp !== rawGrp) {
//           currRight = { name: displayGrp, rawGrp, items: [], total: 0 };
//           rightGroups.push(currRight);
//         }
//         currRight.items.push({ code: row.ISUBGL, desc: row.IGLNM, bal: iAmt });
//         currRight.total += iAmt;
//       }
//     });
//   } else if (shape === "flat_dr_cr") {
//     let currLeft = null;
//     let currRight = null;
    
//     data.forEach(row => {
//       const dr = parseFloat(row.DEBIT || 0);
//       const cr = parseFloat(row.CREDIT || 0);
//       const rawGrp = row.GLGrp || row.PLGrp || "";
//       const displayGrp = rawGrp === "GL" ? "" : rawGrp;
      
//       if (dr !== 0) {
//         grandTotalLeft += dr;
//         if (!currLeft || currLeft.rawGrp !== rawGrp) {
//           currLeft = { name: displayGrp, rawGrp, items: [], total: 0 };
//           leftGroups.push(currLeft);
//         }
//         currLeft.items.push({ code: row.SUBGLCODE, desc: row.Glname, bal: dr });
//         currLeft.total += dr;
//       }
      
//       if (cr !== 0) {
//         grandTotalRight += cr;
//         if (!currRight || currRight.rawGrp !== rawGrp) {
//           currRight = { name: displayGrp, rawGrp, items: [], total: 0 };
//           rightGroups.push(currRight);
//         }
//         currRight.items.push({ code: row.SUBGLCODE, desc: row.Glname, bal: cr });
//         currRight.total += cr;
//       }
//     });
//   }

//   // 2. Build Visual Rows
//   const leftVisualRows = [];
//   leftGroups.forEach(grp => {
//     leftVisualRows.push({ isHeader: true, desc: grp.name, grpTotal: grp.total });
//     grp.items.forEach(item => {
//       leftVisualRows.push({ isHeader: false, code: item.code, desc: item.desc, bal: item.bal });
//     });
//   });

//   const rightVisualRows = [];
//   rightGroups.forEach(grp => {
//     rightVisualRows.push({ isHeader: true, desc: grp.name, grpTotal: grp.total });
//     grp.items.forEach(item => {
//       rightVisualRows.push({ isHeader: false, code: item.code, desc: item.desc, bal: item.bal });
//     });
//   });

//   // 3. Add Profit/Loss
//   const isProfit = grandTotalRight >= grandTotalLeft;
//   const plDiff = Math.abs(grandTotalRight - grandTotalLeft);
//   const finalTotal = Math.max(grandTotalLeft, grandTotalRight);

//   if (plDiff > 0.01) {
//     if (isProfit) {
//       leftVisualRows.push({ isHeader: true, desc: "Profit And Loss", grpTotal: plDiff, isProfit: true });
//       leftVisualRows.push({ isHeader: false, code: "99999", desc: "PROFIT", bal: plDiff, isProfit: true });
//     } else {
//       rightVisualRows.push({ isHeader: true, desc: "Profit And Loss", grpTotal: plDiff, isLoss: true });
//       rightVisualRows.push({ isHeader: false, code: "99999", desc: "LOSS", bal: plDiff, isLoss: true });
//     }
//   }

//   const maxRows = Math.max(leftVisualRows.length, rightVisualRows.length);

//   return (
//     <div className="pl-report">
//       <div className="pl-report-header">
//         <div className="pl-report-header-row">
//           <div style={{ flex: 1 }}>
//             <div style={{ marginBottom: "5px" }}><b>Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> DEMO BANK</div>
//             <div><b>Branch Name :</b> HEAD OFFICE</div>
//           </div>
//           <div style={{ flex: 1, textAlign: "right" }}>
//             <div style={{ marginBottom: "5px" }}><b>Print Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {new Date().toLocaleDateString("en-GB")}</div>
//             <div><b>Print By &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> AVS</div>
//           </div>
//         </div>
//         <div className="pl-report-title">
//           Profit & Loss As On : {displayDate}
//         </div>
//       </div>

//       <table className="pl-report-table">
//         <thead>
//           <tr>
//             <th className="pl-rpt-col-desc">Expenses Description</th>
//             <th className="pl-rpt-col-bal">Balance</th>
//             <th className="pl-rpt-col-desc">Income Description</th>
//             <th className="pl-rpt-col-bal">Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.from({ length: maxRows }).map((_, i) => {
//             const L = leftVisualRows[i];
//             const R = rightVisualRows[i];

//             return (
//               <tr key={i}>
//                 {L ? (
//                   L.isHeader ? (
//                     <>
//                       <td className={`pl-rpt-head ${L.isProfit ? 'pl-rpt-profit' : ''}`}><i>{L.desc}</i></td>
//                       <td className="pl-rpt-grp-bal">{fmt(L.grpTotal)}</td>
//                     </>
//                   ) : (
//                     <>
//                       <td className={`pl-rpt-item ${L.isProfit ? 'pl-rpt-profit' : ''}`}>
//                         {L.code ? <span className="pl-rpt-code">{L.code}</span> : null}
//                         {L.desc ? L.desc.replace(L.code || "", "").trim() : ""}
//                       </td>
//                       <td className={`pl-rpt-bal ${L.isProfit ? 'pl-rpt-profit' : ''}`}>{fmt(L.bal)}</td>
//                     </>
//                   )
//                 ) : (
//                   <><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td></>
//                 )}

//                 {R ? (
//                   R.isHeader ? (
//                     <>
//                       <td className={`pl-rpt-head ${R.isLoss ? 'pl-rpt-loss' : ''}`}><i>{R.desc}</i></td>
//                       <td className="pl-rpt-grp-bal">{fmt(R.grpTotal)}</td>
//                     </>
//                   ) : (
//                     <>
//                       <td className={`pl-rpt-item ${R.isLoss ? 'pl-rpt-loss' : ''}`}>
//                         {R.code ? <span className="pl-rpt-code">{R.code}</span> : null}
//                         {R.desc ? R.desc.replace(R.code || "", "").trim() : ""}
//                       </td>
//                       <td className={`pl-rpt-bal ${R.isLoss ? 'pl-rpt-loss' : ''}`}>{fmt(R.bal)}</td>
//                     </>
//                   )
//                 ) : (
//                   <><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td></>
//                 )}
//               </tr>
//             );
//           })}
          
//           <tr className="pl-rpt-grand-total">
//             <td><b>Grand Total :</b></td>
//             <td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
//             <td><b>Grand Total :</b></td>
//             <td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
//           </tr>
//           <tr className="pl-rpt-tally">
//             <td colSpan="4"><b>Profit & Loss Tally</b></td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function ProfitAndLoss() {
//   const [form, setForm] = useState({
//     reportType: "As On Date",
//     branchCode: "",
//     asOnDate: "",
//     fromDate: "",
//     toDate: "",
//     textReportName: ""
//   });

//   const [reportData, setReportData] = useState([]);
//   const [columns, setColumns]       = useState([]);
//   const [loading, setLoading]       = useState(false);
//   const [error, setError]           = useState("");
//   const [fetched, setFetched]       = useState(false);
//   const [activeButton, setActiveButton] = useState("");
//   const reportRef = useRef(null);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setFetched(false);
//     setError("");
//   };

//   const reportOptions = Object.keys(REPORT_CONFIG);

//   const config   = REPORT_CONFIG[form.reportType];
//   const isAsOnDate = config.dateMode === "asOnDate";

//   // Convert DD/MM/YYYY → YYYY-MM-DD
//   const parseDate = (raw) => {
//     const parts = raw.trim().split("/");
//     if (parts.length !== 3) return null;
//     let [d, m, y] = parts;
//     if (y.length === 2) y = "20" + y;
//     return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
//   };

//   const validate = () => {
//     if (!form.branchCode.trim()) return "Branch Code is required.";
//     if (isAsOnDate) {
//       if (!form.asOnDate.trim())    return "As On Date is required.";
//       if (!parseDate(form.asOnDate)) return "As On Date must be in DD/MM/YYYY format.";
//     } else {
//       if (!form.fromDate.trim())     return "From Date is required.";
//       if (!form.toDate.trim())       return "To Date is required.";
//       if (!parseDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
//       if (!parseDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
//     }
//     return null;
//   };

//   const callApi = async (endpoint, params) => {
//     const res = await fetch(
//       `${API_BASE_URL}/api/profit-and-loss/${endpoint}?${new URLSearchParams(params)}`
//     );
//     if (!res.ok) {
//       const body = await res.json().catch(() => ({}));
//       throw new Error(body.error || `Server error: ${res.status}`);
//     }
//     return res.json();
//   };

//   const handleResult = (data) => {
//     // Handle multi-recordset response
//     let flatData = data;
//     if (data && data.recordsets) {
//       // Merge all recordsets into one array
//       flatData = data.recordsets.flat();
//     }
//     if (!Array.isArray(flatData)) flatData = [];

//     setColumns(flatData.length > 0 ? Object.keys(flatData[0]) : []);
//     setReportData(flatData);
//     setFetched(true);
//   };

//   const withLoading = async (fn) => {
//     const err = validate();
//     if (err) { setError(err); return; }
//     setLoading(true);
//     setError("");
//     try { await fn(); }
//     catch (e) { setError(e.message || "Failed to fetch report."); }
//     finally { setLoading(false); }
//   };

//   // ── Shared param builders ─────────────────────────────────────────────────
//   const asOnParams  = () => ({ branchCode: form.branchCode.trim(), asOnDate: parseDate(form.asOnDate) });
//   const rangeParams = () => ({ branchCode: form.branchCode.trim(), fromDate: parseDate(form.fromDate), toDate: parseDate(form.toDate) });

//   // ── Endpoint resolver per button ──────────────────────────────────────────
//   const resolveEndpoint = (btnKey) => {
//     const rt = form.reportType;
//     switch (btnKey) {
//       case "show":
//         if (rt === "As On Date" || rt === "PL Marathi")              return ["show", asOnParams()];
//         if (rt === "N Form PL" || rt === "N Form PL Marathi")        return ["nform-profit-loss-report", rangeParams()];
//         if (rt === "Income / Expenditure")                           return ["income-exp-profit-loss-report", rangeParams()];
//         if (rt === "Admin Expenses")                                 return ["admin-exp-profit-loss-report", rangeParams()];
//         break;
//       case "profitLossReport":
//         if (rt === "As On Date" || rt === "PL Marathi")              return ["profit-loss-report", asOnParams()];
//         if (rt === "N Form PL" || rt === "N Form PL Marathi")        return ["nform-profit-loss-report", rangeParams()];
//         if (rt === "Income / Expenditure")                           return ["income-exp-profit-loss-report", rangeParams()];
//         if (rt === "Admin Expenses")                                 return ["admin-exp-profit-loss-report", rangeParams()];
//         break;
//       case "textReportView":
//         if (rt === "As On Date" || rt === "PL Marathi")              return ["text-report-view", asOnParams()];
//         if (rt === "N Form PL" || rt === "N Form PL Marathi")        return ["nform-text-report-view", rangeParams()];
//         if (rt === "Income / Expenditure")                           return ["income-exp-text-report-view", rangeParams()];
//         if (rt === "Admin Expenses")                                 return ["admin-exp-text-report-view", rangeParams()];
//         break;
//       case "reportWithWorkingDay":
//         return ["report-with-working-day", asOnParams()];
//       case "intPaidReport":
//         return ["income-exp-int-paid-report", rangeParams()];
//       default:
//         break;
//     }
//     return null;
//   };

//   const handleButton = (btnKey) => {
//     setActiveButton(btnKey);
//     return withLoading(async () => {
//       const resolved = resolveEndpoint(btnKey);
//       if (!resolved) throw new Error("No endpoint configured for this action.");
//       const [endpoint, params] = resolved;
//       const data = await callApi(endpoint, params);
//       handleResult(data);
//     });
//   };

//   // Determine if we should show the formatted report view
//   const isReportButton = activeButton === "profitLossReport" || activeButton === "reportWithWorkingDay";
//   const shape = detectShape(reportData);
//   const showFormattedReport = isReportButton && shape !== "unknown" && reportData.length > 0;

//   // Print function
//   const handlePrint = () => {
//     if (!reportRef.current) return;
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Profit & Loss Report</title>
//           <style>
//             @page { margin: 10mm; }
//             body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; margin: 0; }
//             table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
//             th, td { border-left: 1px solid #000; border-right: 1px solid #000; padding: 2px 4px; }
//             th { background: #e0e0e0; font-weight: 600; border-top: 1px solid #000; border-bottom: 1px solid #000; color: #b71c1c; text-align: left; padding: 4px; }
//             .pl-rpt-col-bal { text-align: right; }
//             .pl-rpt-head { font-weight: 600; color: #b71c1c; font-style: italic; }
//             .pl-rpt-item { padding-left: 10px; }
//             .pl-rpt-code { margin-right: 4px; }
//             .pl-rpt-bal, .pl-rpt-grp-bal { text-align: right; }
//             .pl-rpt-grp-bal { color: #b71c1c; font-weight: 600; }
//             .pl-rpt-grand-total td { border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 700; background: #fff; padding: 4px; }
//             .pl-rpt-tally td { background: #add8e6; font-weight: 700; border-bottom: 1px solid #000; padding: 4px; }
//             .pl-rpt-profit { color: #b71c1c; font-weight: 600; font-style: italic; }
//             .pl-rpt-loss { color: #b71c1c; font-weight: 600; font-style: italic; }
//             .pl-report-header { border: 1px solid #000; margin-bottom: 6px; }
//             .pl-report-header-row { display: flex; justify-content: space-between; padding: 4px 8px; }
//             .pl-report-title { text-align: center; font-weight: bold; font-size: 11px; border-top: 1px solid #000; padding: 4px; }
//           </style>
//         </head>
//         <body>${reportRef.current.innerHTML}</body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   return (
//     <div className="pl-wrapper">
//       <div className="pl-card">

//         {/* HEADER */}
//         <div className="pl-header">Profit And Loss</div>

//         {/* FORM SECTION */}
//         <div className="pl-form-section">

//           {/* BRANCH CODE */}
//           <div className="pl-row">
//             <label className="pl-label">Branch Code</label>
//             <input className="pl-input" name="branchCode"
//               value={form.branchCode} onChange={handleChange} />
//           </div>

//           {/* RADIO OPTIONS */}
//           <div className="pl-radio-row">
//             {reportOptions.map((opt) => (
//               <label key={opt} className="pl-radio-label">
//                 <input type="radio" name="reportType" value={opt}
//                   checked={form.reportType === opt} onChange={handleChange} />
//                 {opt}
//               </label>
//             ))}
//           </div>

//           {/* DATE FIELDS */}
//           {isAsOnDate ? (
//             <div className="pl-row">
//               <label className="pl-label">As On Date</label>
//               <input className="pl-input" name="asOnDate"
//                 placeholder="DD/MM/YYYY"
//                 value={form.asOnDate} onChange={handleChange} />
//             </div>
//           ) : (
//             <div className="pl-row">
//               <label className="pl-label">From Date</label>
//               <input className="pl-input" name="fromDate"
//                 placeholder="DD/MM/YYYY"
//                 value={form.fromDate} onChange={handleChange} />
//               <label className="pl-inline-label">To Date</label>
//               <input className="pl-input" name="toDate"
//                 placeholder="DD/MM/YYYY"
//                 value={form.toDate} onChange={handleChange} />
//             </div>
//           )}

//           {/* TEXT REPORT NAME */}
//           <div className="pl-row">
//             <label className="pl-label">Enter Text Report Name</label>
//             <input className="pl-input pl-input-wide" name="textReportName"
//               placeholder="Enter Text Report Name"
//               value={form.textReportName} onChange={handleChange} />
//           </div>

//           {/* BUTTONS — driven by config */}
//           <div className="pl-btn-row">
//             {config.buttons.map((btnKey) => (
//               <button
//                 key={btnKey}
//                 className="pl-btn pl-btn-blue"
//                 onClick={() => handleButton(btnKey)}
//                 disabled={loading}
//               >
//                 {loading ? "Loading…" : BUTTON_LABELS[btnKey]}
//               </button>
//             ))}
//           </div>

//           {/* ERROR */}
//           {error && <p className="pl-error">{error}</p>}

//         </div>

//         {/* PREVIEW PANEL */}
//         <div className="pl-preview">
//           {loading && <span className="pl-preview-empty">Loading...</span>}

//           {!loading && !fetched && (
//             <span className="pl-preview-empty">Preview area</span>
//           )}

//           {!loading && fetched && reportData.length === 0 && (
//             <span className="pl-preview-empty">No records found.</span>
//           )}

//           {/* FORMATTED REPORT VIEW for Profit Loss Report button */}
//           {!loading && fetched && showFormattedReport && (
//             <div className="pl-report-wrapper">
//               <div className="pl-report-toolbar">
//                 <button className="pl-btn pl-btn-blue pl-btn-sm" onClick={handlePrint}>
//                   🖨️ Print Report
//                 </button>
//               </div>
//               <div ref={reportRef}>
//                 <PLReport
//                   data={reportData}
//                   branchCode={form.branchCode}
//                   asOnDate={isAsOnDate ? form.asOnDate : `${form.fromDate} - ${form.toDate}`}
//                 />
//               </div>
//             </div>
//           )}

//           {/* GRID VIEW for Show / other buttons */}
//           {!loading && fetched && reportData.length > 0 && !showFormattedReport && (
//             <div className="pl-table-wrapper">
//               <table className="pl-table">
//                 <thead>
//                   <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((row, i) => (
//                     <tr key={i}>
//                       {columns.map((col) => <td key={col}>{row[col] ?? ""}</td>)}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <p className="pl-record-count">Total Records: {reportData.length}</p>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default ProfitAndLoss;

import { useState, useRef } from "react";
import "./ProfitAndLoss.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const REPORT_CONFIG = {
  "As On Date": { dateMode: "asOnDate", buttons: ["show", "profitLossReport", "textReportView", "reportWithWorkingDay"] },
  "N Form PL": { dateMode: "range", buttons: ["show", "profitLossReport", "textReportView"] },
  "Income / Expenditure": { dateMode: "range", buttons: ["show", "profitLossReport", "textReportView", "intPaidReport"] },
  "Admin Expenses": { dateMode: "range", buttons: ["show", "profitLossReport", "textReportView"] },
  "PL Marathi": { dateMode: "asOnDate", buttons: ["show", "profitLossReport", "textReportView"] },
  "N Form PL Marathi": { dateMode: "range", buttons: ["show", "profitLossReport", "textReportView"] }
};

const BUTTON_LABELS = {
  show: "Show",
  profitLossReport: "Profit Loss Report",
  textReportView: "Text Report View",
  reportWithWorkingDay: "Report With Working Day",
  intPaidReport: "Int Paid Report"
};

const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n) || n === 0) return "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtAlways = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return "0.00";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const detectShape = (data) => {
  if (!data || data.length === 0) return "unknown";
  const keys = Object.keys(data[0]);
  if (keys.includes("EAMOUNT") && keys.includes("IAMOUNT")) return "horizontal";
  if (keys.includes("DEBIT") && keys.includes("CREDIT")) return "flat_dr_cr";
  return "unknown";
};

function IntPaidReportFormatted({ data, fromDate, toDate }) {
  const printDate = new Date().toLocaleDateString("en-GB");
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);
  const productCol = keys.find(k => /^product$|^prod$|^subgl|^subglcode/i.test(k)) || keys[0] || "";
  const glNameCol  = keys.find(k => /gl.*name|glname|name/i.test(k))               || keys[1] || "";
  const crAmtCol   = keys.find(k => /cr.*amt|credit.*amt|cramount|cr_amt/i.test(k)) || keys[2] || "";
  const drAmtCol   = keys.find(k => /dr.*amt|debit.*amt|dramount|dr_amt/i.test(k))  || keys[3] || "";

  const grandCr = data.reduce((s, r) => s + (parseFloat(r[crAmtCol]) || 0), 0);
  const grandDr = data.reduce((s, r) => s + (parseFloat(r[drAmtCol]) || 0), 0);

  return (
    <div className="ipr-report">
      <div className="ipr-meta-grid">
        <div className="ipr-meta-left">
          <div className="ipr-meta-row">
            <span className="ipr-meta-key">Name</span>
            <span className="ipr-meta-sep">:</span>
            <span className="ipr-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
          </div>
          <div className="ipr-meta-row">
            <span className="ipr-meta-key">Branch Name</span>
            <span className="ipr-meta-sep">:</span>
            <span className="ipr-meta-val">HEAD OFFICE</span>
          </div>
        </div>
        <div className="ipr-meta-right">
          <div className="ipr-meta-row">
            <span className="ipr-meta-key">Print Date</span>
            <span className="ipr-meta-sep">:</span>
            <span className="ipr-meta-val">{printDate}</span>
          </div>
          <div className="ipr-meta-row">
            <span className="ipr-meta-key">Print By</span>
            <span className="ipr-meta-sep">:</span>
            <span className="ipr-meta-val">Rohini</span>
          </div>
        </div>
      </div>

      <table className="ipr-table">
        <thead>
          <tr>
            <th colSpan="5" className="ipr-title-row">
              Int Paid Report From {fromDate} To {toDate}
            </th>
          </tr>
          <tr className="ipr-col-head-row">
            <th className="ipr-th ipr-col-srno">Sr No</th>
            <th className="ipr-th ipr-col-product">Product</th>
            <th className="ipr-th ipr-col-glname">Gl Name</th>
            <th className="ipr-th ipr-col-amt">Cr Amount</th>
            <th className="ipr-th ipr-col-amt">Dr Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="ipr-spacer-row"><td colSpan="5">&nbsp;</td></tr>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="ipr-td ipr-col-srno">{i + 1}</td>
              <td className="ipr-td ipr-col-product">{row[productCol] ?? ""}</td>
              <td className="ipr-td ipr-col-glname">{row[glNameCol] ?? ""}</td>
              <td className="ipr-td ipr-col-amt ipr-right">{fmtAlways(row[crAmtCol])}</td>
              <td className="ipr-td ipr-col-amt ipr-right">{fmtAlways(row[drAmtCol])}</td>
            </tr>
          ))}
          <tr className="ipr-group-total-row">
            <td colSpan="3" className="ipr-td ipr-right"><b>Group Wise Total :</b></td>
            <td className="ipr-td ipr-right"><b>{fmtAlways(grandCr)}</b></td>
            <td className="ipr-td ipr-right"><b>{fmtAlways(grandDr)}</b></td>
          </tr>
          <tr className="ipr-grand-total-row">
            <td colSpan="3" className="ipr-td ipr-right"><b>Grand Total :</b></td>
            <td className="ipr-td ipr-right"><b>{fmtAlways(grandCr)}</b></td>
            <td className="ipr-td ipr-right"><b>{fmtAlways(grandDr)}</b></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PLReport({ data, branchCode, asOnDate }) {
  const shape = detectShape(data);
  if (shape === "unknown") return null;
  const displayDate = asOnDate || new Date().toLocaleDateString("en-GB");
  let leftGroups = [], rightGroups = [], grandTotalLeft = 0, grandTotalRight = 0;

  if (shape === "horizontal") {
    let currLeft = null, currRight = null;
    data.forEach(row => {
      if (row.EGLNM || row.EAMOUNT) {
        const eAmt = parseFloat(row.EAMOUNT || 0);
        grandTotalLeft += eAmt;
        const rawGrp = row.DESCE || row.EGLGROUP || "";
        const displayGrp = rawGrp === "GL" ? "" : rawGrp;
        if (!currLeft || currLeft.rawGrp !== rawGrp) { currLeft = { name: displayGrp, rawGrp, items: [], total: 0 }; leftGroups.push(currLeft); }
        currLeft.items.push({ code: row.ESUBGL, desc: row.EGLNM, bal: eAmt });
        currLeft.total += eAmt;
      }
      if (row.IGLNM || row.IAMOUNT) {
        const iAmt = parseFloat(row.IAMOUNT || 0);
        grandTotalRight += iAmt;
        const rawGrp = row.DESCP || row.IGLGROUP || "";
        const displayGrp = rawGrp === "GL" ? "" : rawGrp;
        if (!currRight || currRight.rawGrp !== rawGrp) { currRight = { name: displayGrp, rawGrp, items: [], total: 0 }; rightGroups.push(currRight); }
        currRight.items.push({ code: row.ISUBGL, desc: row.IGLNM, bal: iAmt });
        currRight.total += iAmt;
      }
    });
  } else if (shape === "flat_dr_cr") {
    let currLeft = null, currRight = null;
    data.forEach(row => {
      const dr = parseFloat(row.DEBIT || 0);
      const cr = parseFloat(row.CREDIT || 0);
      const rawGrp = row.GLGrp || row.PLGrp || "";
      const displayGrp = rawGrp === "GL" ? "" : rawGrp;
      if (dr !== 0) {
        grandTotalLeft += dr;
        if (!currLeft || currLeft.rawGrp !== rawGrp) { currLeft = { name: displayGrp, rawGrp, items: [], total: 0 }; leftGroups.push(currLeft); }
        currLeft.items.push({ code: row.SUBGLCODE, desc: row.Glname, bal: dr });
        currLeft.total += dr;
      }
      if (cr !== 0) {
        grandTotalRight += cr;
        if (!currRight || currRight.rawGrp !== rawGrp) { currRight = { name: displayGrp, rawGrp, items: [], total: 0 }; rightGroups.push(currRight); }
        currRight.items.push({ code: row.SUBGLCODE, desc: row.Glname, bal: cr });
        currRight.total += cr;
      }
    });
  }

  const leftVisualRows = [];
  leftGroups.forEach(grp => {
    leftVisualRows.push({ isHeader: true, desc: grp.name, grpTotal: grp.total });
    grp.items.forEach(item => leftVisualRows.push({ isHeader: false, code: item.code, desc: item.desc, bal: item.bal }));
  });
  const rightVisualRows = [];
  rightGroups.forEach(grp => {
    rightVisualRows.push({ isHeader: true, desc: grp.name, grpTotal: grp.total });
    grp.items.forEach(item => rightVisualRows.push({ isHeader: false, code: item.code, desc: item.desc, bal: item.bal }));
  });

  const isProfit = grandTotalRight >= grandTotalLeft;
  const plDiff = Math.abs(grandTotalRight - grandTotalLeft);
  const finalTotal = Math.max(grandTotalLeft, grandTotalRight);
  if (plDiff > 0.01) {
    if (isProfit) { leftVisualRows.push({ isHeader: true, desc: "Profit And Loss", grpTotal: plDiff, isProfit: true }); leftVisualRows.push({ isHeader: false, code: "99999", desc: "PROFIT", bal: plDiff, isProfit: true }); }
    else { rightVisualRows.push({ isHeader: true, desc: "Profit And Loss", grpTotal: plDiff, isLoss: true }); rightVisualRows.push({ isHeader: false, code: "99999", desc: "LOSS", bal: plDiff, isLoss: true }); }
  }

  const maxRows = Math.max(leftVisualRows.length, rightVisualRows.length);
  return (
    <div className="pl-report">
      <div className="pl-report-header">
        <div className="pl-report-header-row">
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "5px" }}><b>Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> DEMO BANK</div>
            <div><b>Branch Name :</b> HEAD OFFICE</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ marginBottom: "5px" }}><b>Print Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {new Date().toLocaleDateString("en-GB")}</div>
            <div><b>Print By &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> AVS</div>
          </div>
        </div>
        <div className="pl-report-title">Profit &amp; Loss As On : {displayDate}</div>
      </div>
      <table className="pl-report-table">
        <thead>
          <tr>
            <th className="pl-rpt-col-desc">Expenses Description</th>
            <th className="pl-rpt-col-bal">Balance</th>
            <th className="pl-rpt-col-desc">Income Description</th>
            <th className="pl-rpt-col-bal">Balance</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, i) => {
            const L = leftVisualRows[i];
            const R = rightVisualRows[i];
            return (
              <tr key={i}>
                {L ? (L.isHeader ? (<><td className={`pl-rpt-head ${L.isProfit ? 'pl-rpt-profit' : ''}`}><i>{L.desc}</i></td><td className="pl-rpt-grp-bal">{fmt(L.grpTotal)}</td></>) : (<><td className={`pl-rpt-item ${L.isProfit ? 'pl-rpt-profit' : ''}`}>{L.code ? <span className="pl-rpt-code">{L.code}</span> : null}{L.desc ? L.desc.replace(L.code || "", "").trim() : ""}</td><td className={`pl-rpt-bal ${L.isProfit ? 'pl-rpt-profit' : ''}`}>{fmt(L.bal)}</td></>)) : (<><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td></>)}
                {R ? (R.isHeader ? (<><td className={`pl-rpt-head ${R.isLoss ? 'pl-rpt-loss' : ''}`}><i>{R.desc}</i></td><td className="pl-rpt-grp-bal">{fmt(R.grpTotal)}</td></>) : (<><td className={`pl-rpt-item ${R.isLoss ? 'pl-rpt-loss' : ''}`}>{R.code ? <span className="pl-rpt-code">{R.code}</span> : null}{R.desc ? R.desc.replace(R.code || "", "").trim() : ""}</td><td className={`pl-rpt-bal ${R.isLoss ? 'pl-rpt-loss' : ''}`}>{fmt(R.bal)}</td></>)) : (<><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td></>)}
              </tr>
            );
          })}
          <tr className="pl-rpt-grand-total">
            <td><b>Grand Total :</b></td><td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
            <td><b>Grand Total :</b></td><td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
          </tr>
          <tr className="pl-rpt-tally"><td colSpan="4"><b>Profit &amp; Loss Tally</b></td></tr>
        </tbody>
      </table>
    </div>
  );
}

function ProfitAndLoss() {
  const [form, setForm] = useState({ reportType: "As On Date", branchCode: "", asOnDate: "", fromDate: "", toDate: "", textReportName: "" });
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [fetched, setFetched]       = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const reportRef  = useRef(null);
  const intPaidRef = useRef(null);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setFetched(false); setError(""); };
  const reportOptions = Object.keys(REPORT_CONFIG);
  const config = REPORT_CONFIG[form.reportType];
  const isAsOnDate = config.dateMode === "asOnDate";

  const parseDate = (raw) => {
    const parts = raw.trim().split("/");
    if (parts.length !== 3) return null;
    let [d, m, y] = parts;
    if (y.length === 2) y = "20" + y;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const validate = () => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (isAsOnDate) {
      if (!form.asOnDate.trim()) return "As On Date is required.";
      if (!parseDate(form.asOnDate)) return "As On Date must be in DD/MM/YYYY format.";
    } else {
      if (!form.fromDate.trim()) return "From Date is required.";
      if (!form.toDate.trim()) return "To Date is required.";
      if (!parseDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
      if (!parseDate(form.toDate)) return "To Date must be in DD/MM/YYYY format.";
    }
    return null;
  };

  const callApi = async (endpoint, params) => {
    const res = await fetch(`${API_BASE_URL}/api/profit-and-loss/${endpoint}?${new URLSearchParams(params)}`);
    if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || `Server error: ${res.status}`); }
    return res.json();
  };

  const handleResult = (data) => {
    let flatData = data;
    if (data && data.recordsets) flatData = data.recordsets.flat();
    if (!Array.isArray(flatData)) flatData = [];
    setColumns(flatData.length > 0 ? Object.keys(flatData[0]) : []);
    setReportData(flatData);
    setFetched(true);
  };

  const withLoading = async (fn) => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError("");
    try { await fn(); } catch (e) { setError(e.message || "Failed to fetch report."); } finally { setLoading(false); }
  };

  const asOnParams  = () => ({ branchCode: form.branchCode.trim(), asOnDate: parseDate(form.asOnDate) });
  const rangeParams = () => ({ branchCode: form.branchCode.trim(), fromDate: parseDate(form.fromDate), toDate: parseDate(form.toDate) });

  const resolveEndpoint = (btnKey) => {
    const rt = form.reportType;
    switch (btnKey) {
      case "show":
        if (rt === "As On Date" || rt === "PL Marathi")       return ["show", asOnParams()];
        if (rt === "N Form PL" || rt === "N Form PL Marathi") return ["nform-profit-loss-report", rangeParams()];
        if (rt === "Income / Expenditure")                    return ["income-exp-profit-loss-report", rangeParams()];
        if (rt === "Admin Expenses")                          return ["admin-exp-profit-loss-report", rangeParams()];
        break;
      case "profitLossReport":
        if (rt === "As On Date" || rt === "PL Marathi")       return ["profit-loss-report", asOnParams()];
        if (rt === "N Form PL" || rt === "N Form PL Marathi") return ["nform-profit-loss-report", rangeParams()];
        if (rt === "Income / Expenditure")                    return ["income-exp-profit-loss-report", rangeParams()];
        if (rt === "Admin Expenses")                          return ["admin-exp-profit-loss-report", rangeParams()];
        break;
      case "textReportView":
        if (rt === "As On Date" || rt === "PL Marathi")       return ["text-report-view", asOnParams()];
        if (rt === "N Form PL" || rt === "N Form PL Marathi") return ["nform-text-report-view", rangeParams()];
        if (rt === "Income / Expenditure")                    return ["income-exp-text-report-view", rangeParams()];
        if (rt === "Admin Expenses")                          return ["admin-exp-text-report-view", rangeParams()];
        break;
      case "reportWithWorkingDay": return ["report-with-working-day", asOnParams()];
      case "intPaidReport":        return ["income-exp-int-paid-report", rangeParams()];
      default: break;
    }
    return null;
  };

  const handleButton = (btnKey) => {
    setActiveButton(btnKey);
    return withLoading(async () => {
      const resolved = resolveEndpoint(btnKey);
      if (!resolved) throw new Error("No endpoint configured for this action.");
      const [endpoint, params] = resolved;
      const data = await callApi(endpoint, params);
      handleResult(data);
    });
  };

  const handleIntPaidPrint = () => {
    if (!intPaidRef.current) return;
    const pw = window.open("", "_blank");
    pw.document.write(`<html><head><title>Int Paid Report</title><style>
      @page{size:A4 portrait;margin:10mm}body{font-family:'Segoe UI',Arial,sans-serif;font-size:9px;margin:0}
      .ipr-meta-grid{display:flex;justify-content:space-between;margin-bottom:8px}
      .ipr-meta-left,.ipr-meta-right{display:flex;flex-direction:column;gap:4px}
      .ipr-meta-row{display:flex;gap:6px;font-size:9px}.ipr-meta-key{font-weight:600;min-width:80px}
      table{width:100%;border-collapse:collapse;margin-top:4px}
      th,td{border:1px solid #999;padding:3px 7px;font-size:8.5px;text-align:left}
      .ipr-title-row{text-align:center;font-weight:700;font-size:11px;padding:6px}
      .ipr-col-head-row th{background:#fff;font-weight:700}
      .ipr-right{text-align:right}.ipr-col-srno{width:5%;text-align:center}
      .ipr-col-product{width:8%}.ipr-col-glname{width:52%}.ipr-col-amt{width:16%;text-align:right}
      .ipr-spacer-row td{background:#d0d8e8;height:10px}
      .ipr-group-total-row td{background:#f8f8f8;border-top:1px solid #333}
      .ipr-grand-total-row td{background:#f0f0f0;border-top:2px solid #333;font-weight:700}
    </style></head><body>${intPaidRef.current.innerHTML}</body></html>`);
    pw.document.close(); pw.print();
  };

  const handlePLPrint = () => {
    if (!reportRef.current) return;
    const pw = window.open("", "_blank");
    pw.document.write(`<html><head><title>Profit & Loss Report</title><style>
      @page{margin:10mm}body{font-family:'Segoe UI',Arial,sans-serif;font-size:9px;margin:0}
      table{width:100%;border-collapse:collapse;border:1px solid #000}
      th,td{border-left:1px solid #000;border-right:1px solid #000;padding:2px 4px}
      th{background:#e0e0e0;font-weight:600;border-top:1px solid #000;border-bottom:1px solid #000;color:#b71c1c;text-align:left;padding:4px}
      .pl-rpt-col-bal{text-align:right}.pl-rpt-head{font-weight:600;color:#b71c1c;font-style:italic}
      .pl-rpt-item{padding-left:10px}.pl-rpt-code{margin-right:4px}
      .pl-rpt-bal,.pl-rpt-grp-bal{text-align:right}.pl-rpt-grp-bal{color:#b71c1c;font-weight:600}
      .pl-rpt-grand-total td{border-top:1px solid #000;border-bottom:1px solid #000;font-weight:700;background:#fff;padding:4px}
      .pl-rpt-tally td{background:#add8e6;font-weight:700;border-bottom:1px solid #000;padding:4px}
      .pl-rpt-profit,.pl-rpt-loss{color:#b71c1c;font-weight:600;font-style:italic}
      .pl-report-header{border:1px solid #000;margin-bottom:6px}
      .pl-report-header-row{display:flex;justify-content:space-between;padding:4px 8px}
      .pl-report-title{text-align:center;font-weight:bold;font-size:11px;border-top:1px solid #000;padding:4px}
    </style></head><body>${reportRef.current.innerHTML}</body></html>`);
    pw.document.close(); pw.print();
  };

  const isReportButton    = activeButton === "profitLossReport" || activeButton === "reportWithWorkingDay";
  const isIntPaidButton   = activeButton === "intPaidReport";
  const shape             = detectShape(reportData);
  const showFormattedPL   = isReportButton && shape !== "unknown" && reportData.length > 0;
  const showIntPaidReport = isIntPaidButton && reportData.length > 0;
  const showGrid          = fetched && reportData.length > 0 && !showFormattedPL && !showIntPaidReport;

  return (
    <div className="pl-wrapper">
      <div className="pl-card">
        <div className="pl-header">Profit And Loss</div>
        <div className="pl-form-section">
          <div className="pl-row">
            <label className="pl-label">Branch Code</label>
            <input className="pl-input" name="branchCode" value={form.branchCode} onChange={handleChange} />
          </div>
          <div className="pl-radio-row">
            {reportOptions.map((opt) => (
              <label key={opt} className="pl-radio-label">
                <input type="radio" name="reportType" value={opt} checked={form.reportType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>
          {isAsOnDate ? (
            <div className="pl-row">
              <label className="pl-label">As On Date</label>
              <input className="pl-input" name="asOnDate" placeholder="DD/MM/YYYY" value={form.asOnDate} onChange={handleChange} />
            </div>
          ) : (
            <div className="pl-row">
              <label className="pl-label">From Date</label>
              <input className="pl-input" name="fromDate" placeholder="DD/MM/YYYY" value={form.fromDate} onChange={handleChange} />
              <label className="pl-inline-label">To Date</label>
              <input className="pl-input" name="toDate" placeholder="DD/MM/YYYY" value={form.toDate} onChange={handleChange} />
            </div>
          )}
          <div className="pl-row">
            <label className="pl-label">Enter Text Report Name</label>
            <input className="pl-input pl-input-wide" name="textReportName" placeholder="Enter Text Report Name" value={form.textReportName} onChange={handleChange} />
          </div>
          <div className="pl-btn-row">
            {config.buttons.map((btnKey) => (
              <button key={btnKey} className="pl-btn pl-btn-blue" onClick={() => handleButton(btnKey)} disabled={loading}>
                {loading ? "Loading…" : BUTTON_LABELS[btnKey]}
              </button>
            ))}
          </div>
          {error && <p className="pl-error">{error}</p>}
        </div>

        <div className="pl-preview">
          {loading && <span className="pl-preview-empty">Loading...</span>}
          {!loading && !fetched && <span className="pl-preview-empty">Preview area</span>}
          {!loading && fetched && reportData.length === 0 && <span className="pl-preview-empty">No records found.</span>}

          {/* Int Paid Report formatted */}
          {!loading && showIntPaidReport && (
            <div className="pl-report-wrapper">
              <div className="pl-report-toolbar">
                <button className="pl-btn pl-btn-blue pl-btn-sm" onClick={handleIntPaidPrint}>
                  🖨️ Print Report
                </button>
              </div>
              <div ref={intPaidRef}>
                <IntPaidReportFormatted data={reportData} fromDate={form.fromDate} toDate={form.toDate} />
              </div>
            </div>
          )}

          {/* P&L Formatted Report */}
          {!loading && showFormattedPL && (
            <div className="pl-report-wrapper">
              <div className="pl-report-toolbar">
                <button className="pl-btn pl-btn-blue pl-btn-sm" onClick={handlePLPrint}>
                  🖨️ Print Report
                </button>
              </div>
              <div ref={reportRef}>
                <PLReport data={reportData} branchCode={form.branchCode}
                  asOnDate={isAsOnDate ? form.asOnDate : `${form.fromDate} - ${form.toDate}`} />
              </div>
            </div>
          )}

          {/* Grid View */}
          {!loading && showGrid && (
            <div className="pl-table-wrapper">
              <table className="pl-table">
                <thead>
                  <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i}>{columns.map((col) => <td key={col}>{row[col] ?? ""}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              <p className="pl-record-count">Total Records: {reportData.length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLoss;