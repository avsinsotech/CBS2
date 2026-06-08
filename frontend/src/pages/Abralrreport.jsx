// import { useState, useRef } from "react";
// import "./AbrAlrReport.css";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// function toISO(raw) {
//   const parts = raw.trim().split("/");
//   if (parts.length !== 3) return null;
//   let [d, m, y] = parts;
//   if (y.length === 2) y = "20" + y;
//   return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
// }

// function isValidDate(raw) {
//   if (!raw || !raw.trim()) return false;
//   const parts = raw.trim().split("/");
//   if (parts.length !== 3) return false;
//   const [d, m] = parts.map(Number);
//   return d >= 1 && d <= 31 && m >= 1 && m <= 12;
// }

// const fmt = (v) => {
//   if (v === null || v === undefined || v === "") return "";
//   const n = parseFloat(v);
//   if (isNaN(n)) return v;
//   return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// // ── Formatted ABR/ALR Report (matches pictures exactly) ──────────────────────
// function AbrAlrFormatted({ data, asOnDate }) {
//   const printDate = new Date().toLocaleDateString("en-GB").split("/").join("-");

//   if (!data || data.length === 0) return null;

//   // Detect column keys from first row
//   const keys = Object.keys(data[0]);
//   const monthDateCol  = keys.find(k => /month|monthdate|mdate/i.test(k))   || keys[0] || "";
//   const depositCol    = keys.find(k => /deposit$/i.test(k))                || keys[1] || "";
//   const loansCol      = keys.find(k => /loan/i.test(k))                    || keys[2] || "";
//   const depositRecCol = keys.find(k => /rec/i.test(k))                     || keys[3] || "";
//   const intRecCol     = keys.find(k => /int.*rec|intrecv|interest.*rec/i.test(k)) || keys[4] || "";

//   // Summary rows — detect from data (rows where MonthDate is null/empty or has label text)
//   // Split data rows vs summary rows
//   const dataRows    = data.filter(r => r[monthDateCol] && !isNaN(new Date(r[monthDateCol]).getTime()) || (String(r[monthDateCol] || "").match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i)));
//   const summaryRows = data.filter(r => !dataRows.includes(r));

//   // If SP returns all in one flat array, use all as data rows
//   const mainRows = dataRows.length > 0 ? dataRows : data;

//   // Compute totals
//   const totalDeposit    = mainRows.reduce((s, r) => s + (parseFloat(r[depositCol])    || 0), 0);
//   const totalLoans      = mainRows.reduce((s, r) => s + (parseFloat(r[loansCol])      || 0), 0);
//   const totalDepositRec = mainRows.reduce((s, r) => s + (parseFloat(r[depositRecCol]) || 0), 0);
//   const totalIntRec     = mainRows.reduce((s, r) => s + (parseFloat(r[intRecCol])     || 0), 0);

//   const avgDeposit = mainRows.length > 0 ? totalDeposit / mainRows.length : 0;
//   const avgLoans   = mainRows.length > 0 ? totalLoans   / mainRows.length : 0;

//   const avgBorrowingRate = totalDeposit  > 0 ? (totalDepositRec / totalDeposit)  * 100 : 0;
//   const avgLendingRate   = totalLoans    > 0 ? (totalIntRec     / totalLoans)    * 100 : 0;
//   const spread           = avgLendingRate - avgBorrowingRate;

//   // Format AsOnDate for title display
//   const titleDate = asOnDate
//     ? (() => {
//         const parts = asOnDate.trim().split("/");
//         if (parts.length === 3) {
//           const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//           return `${parseInt(parts[0])} ${months[parseInt(parts[1])-1]} ${parts[2]}`;
//         }
//         return asOnDate;
//       })()
//     : "";

//   return (
//     <div className="abr-fmt-report">

//       {/* ── Meta Header ── */}
//       <div className="abr-fmt-meta-grid">
//         <div className="abr-fmt-meta-left">
//           <div className="abr-fmt-meta-row">
//             <span className="abr-fmt-meta-key">Bank Name</span>
//             <span className="abr-fmt-meta-sep">:</span>
//             <span className="abr-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
//           </div>
//           <div className="abr-fmt-meta-row">
//             <span className="abr-fmt-meta-key">Branch Name</span>
//             <span className="abr-fmt-meta-sep">:</span>
//             <span className="abr-fmt-meta-val">HEAD OFFICE</span>
//           </div>
//         </div>
//         <div className="abr-fmt-meta-right">
//           <div className="abr-fmt-meta-row">
//             <span className="abr-fmt-meta-key">User ID</span>
//             <span className="abr-fmt-meta-sep">:</span>
//             <span className="abr-fmt-meta-val">Rohini</span>
//           </div>
//           <div className="abr-fmt-meta-row">
//             <span className="abr-fmt-meta-key">Print Date</span>
//             <span className="abr-fmt-meta-sep">:</span>
//             <span className="abr-fmt-meta-val">{printDate}</span>
//           </div>
//         </div>
//       </div>

//       {/* ── Main Table ── */}
//       <table className="abr-fmt-table">
//         <thead>
//           <tr>
//             <th colSpan="6" className="abr-fmt-title-row">
//               ABR / ALR Report As On {titleDate}
//             </th>
//           </tr>
//           <tr className="abr-fmt-col-head-row">
//             <th className="abr-fmt-th abr-fmt-col-srno">Sr No</th>
//             <th className="abr-fmt-th abr-fmt-col-month">Month Date</th>
//             <th className="abr-fmt-th abr-fmt-col-num">Deposit</th>
//             <th className="abr-fmt-th abr-fmt-col-num">Loans</th>
//             <th className="abr-fmt-th abr-fmt-col-num">Deposit Rec</th>
//             <th className="abr-fmt-th abr-fmt-col-num">Int Recived</th>
//           </tr>
//         </thead>
//         <tbody>
//           {mainRows.map((row, i) => (
//             <tr key={i}>
//               <td className="abr-fmt-td abr-fmt-col-srno">{i + 1}</td>
//               <td className="abr-fmt-td abr-fmt-col-month">{row[monthDateCol] ?? ""}</td>
//               <td className="abr-fmt-td abr-fmt-col-num abr-fmt-right">{fmt(row[depositCol])}</td>
//               <td className="abr-fmt-td abr-fmt-col-num abr-fmt-right">{fmt(row[loansCol])}</td>
//               <td className="abr-fmt-td abr-fmt-col-num abr-fmt-right">{fmt(row[depositRecCol])}</td>
//               <td className="abr-fmt-td abr-fmt-col-num abr-fmt-right">{fmt(row[intRecCol])}</td>
//             </tr>
//           ))}

//           {/* Total row */}
//           <tr className="abr-fmt-summary-row">
//             <td className="abr-fmt-td" colSpan="2"><b>Total :</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalDeposit)}</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalLoans)}</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalDepositRec)}</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalIntRec)}</b></td>
//           </tr>

//           {/* AVE. Deposit & Loan */}
//           <tr className="abr-fmt-summary-row">
//             <td className="abr-fmt-td" colSpan="2"><b>AVE. Deposit &amp; Loan</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{fmt(avgDeposit)}</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{fmt(avgLoans)}</b></td>
//             <td className="abr-fmt-td" colSpan="2"></td>
//           </tr>

//           {/* Int & Commission */}
//           <tr className="abr-fmt-summary-row">
//             <td className="abr-fmt-td" colSpan="2"><b>Int &amp; Commision</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalDepositRec)}</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalIntRec)}</b></td>
//             <td className="abr-fmt-td" colSpan="2"></td>
//           </tr>

//           {/* Ave. Int */}
//           <tr className="abr-fmt-summary-row">
//             <td className="abr-fmt-td" colSpan="2"><b>Ave. Int</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{avgBorrowingRate.toFixed(2)}</b></td>
//             <td className="abr-fmt-td abr-fmt-right"><b>{avgLendingRate.toFixed(2)}</b></td>
//             <td className="abr-fmt-td" colSpan="2"></td>
//           </tr>
//         </tbody>
//       </table>

//       {/* ── Formula Section ── */}
//       <table className="abr-fmt-formula-table">
//         <tbody>
//           <tr>
//             <td className="abr-fmt-formula-td">
//               Average Borrowing Rate = {fmt(totalDepositRec)} *100 / {fmt(totalDeposit)}
//             </td>
//           </tr>
//           <tr>
//             <td className="abr-fmt-formula-td abr-fmt-formula-result">
//               = {avgBorrowingRate.toFixed(2)}
//             </td>
//           </tr>
//           <tr><td className="abr-fmt-formula-gap"></td></tr>
//           <tr>
//             <td className="abr-fmt-formula-td">
//               Average Lending Rate = {fmt(totalIntRec)} *100 / {fmt(totalLoans)}
//             </td>
//           </tr>
//           <tr>
//             <td className="abr-fmt-formula-td abr-fmt-formula-result">
//               = {avgLendingRate.toFixed(2)}
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       {/* ── ALR / ABR / SPRED Table ── */}
//       <table className="abr-fmt-spread-table">
//         <thead>
//           <tr>
//             <th className="abr-fmt-spread-th">ALR</th>
//             <th className="abr-fmt-spread-sep">-</th>
//             <th className="abr-fmt-spread-th">ABR</th>
//             <th className="abr-fmt-spread-sep">=</th>
//             <th className="abr-fmt-spread-th">SPRED</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td className="abr-fmt-spread-td">{avgLendingRate.toFixed(2)}</td>
//             <td className="abr-fmt-spread-sep"></td>
//             <td className="abr-fmt-spread-td">{avgBorrowingRate.toFixed(2)}</td>
//             <td className="abr-fmt-spread-sep"></td>
//             <td className="abr-fmt-spread-td">{spread.toFixed(2)}</td>
//           </tr>
//         </tbody>
//       </table>

//     </div>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// function AbrAlrReport() {
//   const [reportType, setReportType] = useState("ABR_ALR");

//   const [form, setForm] = useState({
//     branchCode:     "1",
//     asOnDate:       "22/05/2026",
//     fromDate:       "",
//     toDate:         "",
//     textReportName: "",
//   });

//   const [reportData,   setReportData]   = useState([]);
//   const [columns,      setColumns]      = useState([]);
//   const [loading,      setLoading]      = useState(false);
//   const [error,        setError]        = useState("");
//   const [fetched,      setFetched]      = useState(false);
//   const [activeButton, setActiveButton] = useState("");
//   const reportRef = useRef(null);

//   const handleChange = (e) => {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//     setFetched(false);
//     setError("");
//   };

//   const handleTypeChange = (e) => {
//     setReportType(e.target.value);
//     setFetched(false);
//     setError("");
//     setReportData([]);
//     setColumns([]);
//   };

//   const validate = (btnKey) => {
//     if (!form.branchCode.trim()) return "Branch Code is required.";
//     if (reportType === "ABR_ALR" || btnKey !== "mis") {
//       if (!form.asOnDate.trim())       return "AsOnDate is required.";
//       if (!isValidDate(form.asOnDate)) return "AsOnDate must be in DD/MM/YYYY format.";
//     }
//     if (btnKey === "mis") {
//       if (!isValidDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
//       if (!isValidDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
//     }
//     return null;
//   };

//   const fetchData = async (endpoint, params) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/abr-alr/${endpoint}?${params}`);
//       if (!res.ok) {
//         const body = await res.json().catch(() => ({}));
//         throw new Error(body.error || `Server error: ${res.status}`);
//       }
//       const data = await res.json();
//       const flat = Array.isArray(data) ? data : (data.recordsets ? data.recordsets.flat() : []);
//       setColumns(flat.length > 0 ? Object.keys(flat[0]) : []);
//       setReportData(flat);
//       setFetched(true);
//       return flat;
//     } catch (err) {
//       setError(err.message || "Failed to fetch report.");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Print → formatted report view ────────────────────────────────────────
//   const handlePrint = async () => {
//     const err = validate("print");
//     if (err) { setError(err); return; }
//     setActiveButton("print");
//     const isoDate = toISO(form.asOnDate);
//     const endpoint = reportType === "ABR_ALR" ? "abr-alr/print" : "mis-report/print";
//     const params = new URLSearchParams({ Brcd: form.branchCode.trim(), FisicalYear: isoDate });
//     await fetchData(endpoint, params);
//   };

//   // ── Text Report View → grid ───────────────────────────────────────────────
//   const handleTextReportView = async () => {
//     const err = validate("view");
//     if (err) { setError(err); return; }
//     setActiveButton("view");
//     const isoDate = toISO(form.asOnDate);
//     const endpoint = reportType === "ABR_ALR" ? "abr-alr/text-report-view" : "mis-report/text-report-view";
//     const params = new URLSearchParams({ Brcd: form.branchCode.trim(), FisicalYear: isoDate });
//     await fetchData(endpoint, params);
//   };

//   // ── MIS Report → grid ─────────────────────────────────────────────────────
//   const handleMisReport = async () => {
//     const err = validate("mis");
//     if (err) { setError(err); return; }
//     setActiveButton("mis");
//     const isoFrom = toISO(form.fromDate);
//     const isoTo   = toISO(form.toDate);
//     const [fy, fm] = isoFrom.split("-");
//     const [ty, tm] = isoTo.split("-");
//     const params = new URLSearchParams({
//       Brcd: form.branchCode.trim(),
//       PFMONTH: fm, PFYEAR: fy, PFDATE: isoFrom,
//       PEMONTH: tm, PEYEAR: ty, PEDATE: isoTo,
//     });
//     await fetchData("mis-report/mis-report", params);
//   };

//   // ── Print popup ───────────────────────────────────────────────────────────
//   const handlePrintWindow = () => {
//     if (!reportRef.current) return;
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>ABR/ALR Report</title>
//           <style>
//             @page { size: A4 portrait; margin: 10mm; }
//             body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; margin: 0; }
//             .abr-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 8px; }
//             .abr-fmt-meta-left, .abr-fmt-meta-right { display: flex; flex-direction: column; gap: 3px; }
//             .abr-fmt-meta-row { display: flex; gap: 6px; font-size: 9px; }
//             .abr-fmt-meta-key { font-weight: 600; min-width: 75px; }
//             table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
//             th, td { border: 1px solid #999; padding: 3px 6px; font-size: 8.5px; }
//             .abr-fmt-title-row { text-align: center; font-weight: 700; font-size: 11px; padding: 6px; background: #fff; }
//             .abr-fmt-col-head-row th { background: #fff; font-weight: 700; text-align: left; }
//             .abr-fmt-col-num { text-align: right; }
//             .abr-fmt-right { text-align: right; }
//             .abr-fmt-col-srno { width: 5%; text-align: center; }
//             .abr-fmt-col-month { width: 15%; }
//             .abr-fmt-summary-row td { background: #f8f8f8; }
//             .abr-fmt-formula-table { border: 1px solid #999; width: 60%; margin: 0 auto 10px; }
//             .abr-fmt-formula-td { padding: 4px 10px; font-size: 9px; border-bottom: 1px solid #eee; }
//             .abr-fmt-formula-result { padding-left: 20px; }
//             .abr-fmt-formula-gap { height: 6px; }
//             .abr-fmt-spread-table { width: 60%; margin: 0 auto; border-collapse: collapse; }
//             .abr-fmt-spread-th { border: 1px solid #999; padding: 4px 12px; text-align: center; font-weight: 700; background: #f0f0f0; }
//             .abr-fmt-spread-td { border: 1px solid #999; padding: 4px 12px; text-align: center; }
//             .abr-fmt-spread-sep { padding: 4px 6px; text-align: center; font-weight: 700; border: none; }
//           </style>
//         </head>
//         <body>${reportRef.current.innerHTML}</body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const showFormattedReport = activeButton === "print" && fetched && reportData.length > 0;
//   const showGridReport      = (activeButton === "view" || activeButton === "mis") && fetched && reportData.length > 0;
//   const isAbrAlr = reportType === "ABR_ALR";

//   return (
//     <div className="abr-wrapper">
//       <div className="abr-card">

//         <div className="abr-header">ABR/ALR Report</div>

//         <div className="abr-form-section">

//           {/* Radio Row */}
//           <div className="abr-radio-row">
//             <label className="abr-radio-label">
//               <input type="radio" name="reportType" value="ABR_ALR"
//                 checked={reportType === "ABR_ALR"} onChange={handleTypeChange} />
//               ABR_ALR
//             </label>
//             <label className="abr-radio-label">
//               <input type="radio" name="reportType" value="MIS"
//                 checked={reportType === "MIS"} onChange={handleTypeChange} />
//               MIS Report
//             </label>
//           </div>

//           {/* Branch Code */}
//           <div className="abr-row">
//             <label className="abr-label">Branch Code</label>
//             <input className="abr-input" name="branchCode"
//               value={form.branchCode} onChange={handleChange} />
//           </div>

//           {/* ABR_ALR fields */}
//           {isAbrAlr && (
//             <>
//               <div className="abr-row">
//                 <label className="abr-label">AsOnDate</label>
//                 <input className="abr-input" name="asOnDate"
//                   value={form.asOnDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
//               </div>
//               <div className="abr-row">
//                 <label className="abr-label abr-label-req">
//                   Please enter text report name <span className="req">*</span>
//                 </label>
//                 <input className="abr-input abr-input-wide" name="textReportName"
//                   value={form.textReportName} onChange={handleChange}
//                   placeholder="Please enter text report name" />
//               </div>
//             </>
//           )}

//           {/* MIS Report fields */}
//           {!isAbrAlr && (
//             <>
//               <div className="abr-row">
//                 <label className="abr-label">From Date</label>
//                 <input className="abr-input" name="fromDate"
//                   value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
//               </div>
//               <div className="abr-row">
//                 <label className="abr-label">To Date</label>
//                 <input className="abr-input" name="toDate"
//                   value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
//               </div>
//             </>
//           )}

//           {error && <p className="abr-error">{error}</p>}
//           {loading && <div className="abr-loading-bar"><div className="abr-loading-fill" /></div>}

//         </div>

//         {/* Buttons */}
//         <div className="abr-footer">
//           <button className="abr-btn" onClick={handlePrint} disabled={loading}>
//             {loading && activeButton === "print" ? "Loading…" : "Print"}
//           </button>
//           <button className="abr-btn" onClick={handleTextReportView} disabled={loading}>
//             {loading && activeButton === "view" ? "Loading…" : "Text Report View"}
//           </button>
//           <button className="abr-btn" onClick={handleMisReport} disabled={loading}>
//             {loading && activeButton === "mis" ? "Loading…" : "MIS Report"}
//           </button>
//         </div>

//         {/* Preview Panel */}
//         <div className="abr-preview">
//           {loading && <span className="abr-preview-empty">Loading...</span>}
//           {!loading && !fetched && <span className="abr-preview-empty">Preview area</span>}
//           {!loading && fetched && reportData.length === 0 && <span className="abr-preview-empty">No records found.</span>}

//           {/* Formatted Report (Print button) */}
//           {!loading && showFormattedReport && (
//             <div className="abr-report-wrapper">
//               <div className="abr-report-toolbar">
//                 <button className="abr-btn abr-btn-sm" onClick={handlePrintWindow}>
//                   🖨️ Print Report
//                 </button>
//               </div>
//               <div ref={reportRef}>
//                 <AbrAlrFormatted data={reportData} asOnDate={form.asOnDate} />
//               </div>
//             </div>
//           )}

//           {/* Grid View (Text Report View / MIS Report buttons) */}
//           {!loading && showGridReport && (
//             <div className="abr-table-wrapper">
//               <table className="abr-table">
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
//               <p className="abr-record-count">Total Records: {reportData.length}</p>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default AbrAlrReport;


import { useState, useRef } from "react";
import "./AbrAlrReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function toISO(raw) {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function isValidDate(raw) {
  if (!raw || !raw.trim()) return false;
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return false;
  const [d, m] = parts.map(Number);
  return d >= 1 && d <= 31 && m >= 1 && m <= 12;
}

// Plain 2-decimal, no Indian grouping — matches picture exactly
const fmt = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const n = parseFloat(v);
  if (isNaN(n)) return "";
  return n.toFixed(2);
};

// Format Monthend datetime → "Jun - 2025"
const fmtMonth = (v) => {
  if (!v) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return `${months[d.getMonth()]} - ${d.getFullYear()}`;
};

// ── Formatted ABR/ALR Report ──────────────────────────────────────────────────
function AbrAlrFormatted({ data, asOnDate }) {
  const printDate = new Date().toLocaleDateString("en-GB").split("/").join("-");

  if (!data || data.length === 0) return null;

  // SP columns: ID, Monthend, Deposit, Loans, INV, DepositRec, LoansRec, INVRec
  // Use SP values directly — no recomputation
  const rows = data;

  const totalDeposit    = rows.reduce((s, r) => s + (parseFloat(r.Deposit)    || 0), 0);
  const totalLoans      = rows.reduce((s, r) => s + (parseFloat(r.Loans)      || 0), 0);
  const totalDepositRec = rows.reduce((s, r) => s + (parseFloat(r.DepositRec) || 0), 0);
  const totalLoansRec   = rows.reduce((s, r) => s + (parseFloat(r.LoansRec)   || 0), 0);
  const totalINVRec     = rows.reduce((s, r) => s + (parseFloat(r.INVRec)     || 0), 0);
  // Int Recived shown in table = LoansRec + INVRec (matches the correct report)
  const totalIntRecived = totalLoansRec + totalINVRec;

  const n = rows.length;
  const avgDeposit = n > 0 ? totalDeposit / n : 0;
  const avgLoans   = n > 0 ? totalLoans   / n : 0;

  // ABR = DepositRec * 100 / Deposit
  const avgBorrowingRate = totalDeposit > 0 ? (totalDepositRec  * 100) / totalDeposit : 0;
  // ALR = (LoansRec + INVRec) * 100 / Loans
  const avgLendingRate   = totalLoans   > 0 ? (totalIntRecived  * 100) / totalLoans   : 0;
  const spread           = avgLendingRate - avgBorrowingRate;

  // Title date: DD/MM/YYYY → "22 May 2026"
  const titleDate = (() => {
    if (!asOnDate) return "";
    const parts = asOnDate.trim().split("/");
    if (parts.length === 3) {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${parseInt(parts[0])} ${months[parseInt(parts[1])-1]} ${parts[2]}`;
    }
    return asOnDate;
  })();

  return (
    <div className="abr-fmt-report">

      {/* ── Meta Header ── */}
      <div className="abr-fmt-meta-grid">
        <div className="abr-fmt-meta-left">
          <div className="abr-fmt-meta-row">
            <span className="abr-fmt-meta-key">Bank Name</span>
            <span className="abr-fmt-meta-sep">:</span>
            <span className="abr-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
          </div>
          <div className="abr-fmt-meta-row">
            <span className="abr-fmt-meta-key">Branch Name</span>
            <span className="abr-fmt-meta-sep">:</span>
            <span className="abr-fmt-meta-val">HEAD OFFICE</span>
          </div>
        </div>
        <div className="abr-fmt-meta-right">
          <div className="abr-fmt-meta-row">
            <span className="abr-fmt-meta-key">User ID</span>
            <span className="abr-fmt-meta-sep">:</span>
            <span className="abr-fmt-meta-val">Rohini</span>
          </div>
          <div className="abr-fmt-meta-row">
            <span className="abr-fmt-meta-key">Print Date</span>
            <span className="abr-fmt-meta-sep">:</span>
            <span className="abr-fmt-meta-val">{printDate}</span>
          </div>
        </div>
      </div>

      {/* ── Main Table ── */}
      <table className="abr-fmt-table">
        <thead>
          <tr>
            <th colSpan="6" className="abr-fmt-title-row">
              ABR / ALR Report As On {titleDate}
            </th>
          </tr>
          <tr className="abr-fmt-col-head-row">
            <th className="abr-fmt-th abr-fmt-col-srno">Sr No</th>
            <th className="abr-fmt-th abr-fmt-col-month">Month Date</th>
            <th className="abr-fmt-th abr-fmt-col-num">Deposit</th>
            <th className="abr-fmt-th abr-fmt-col-num">Loans</th>
            <th className="abr-fmt-th abr-fmt-col-num">Deposit Rec</th>
            <th className="abr-fmt-th abr-fmt-col-num">Int Recived</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 !== 0 ? "abr-fmt-row-alt" : ""}>
              <td className="abr-fmt-td abr-fmt-col-srno">{i + 1}</td>
              <td className="abr-fmt-td abr-fmt-col-month">{fmtMonth(row.Monthend)}</td>
              <td className="abr-fmt-td abr-fmt-right">{fmt(row.Deposit)}</td>
              <td className="abr-fmt-td abr-fmt-right">{fmt(row.Loans)}</td>
              <td className="abr-fmt-td abr-fmt-right">{fmt(row.DepositRec)}</td>
              <td className="abr-fmt-td abr-fmt-right">{fmt((parseFloat(row.LoansRec)||0)+(parseFloat(row.INVRec)||0))}</td>
            </tr>
          ))}

          {/* Total */}
          <tr className="abr-fmt-summary-row">
            <td className="abr-fmt-td" colSpan="2"><b>Total :</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalDeposit)}</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalLoans)}</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalDepositRec)}</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalIntRecived)}</b></td>
          </tr>

          {/* AVE. Deposit & Loan */}
          <tr className="abr-fmt-summary-row">
            <td className="abr-fmt-td" colSpan="2"><b>AVE. Deposit &amp; Loan</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{fmt(avgDeposit)}</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{fmt(avgLoans)}</b></td>
            <td className="abr-fmt-td" colSpan="2"></td>
          </tr>

          {/* Int & Commission — DepositRec for Deposit col, LoansRec+INVRec for Loans col */}
          <tr className="abr-fmt-summary-row">
            <td className="abr-fmt-td" colSpan="2"><b>Int &amp; Commision</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalDepositRec)}</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{fmt(totalIntRecived)}</b></td>
            <td className="abr-fmt-td" colSpan="2"></td>
          </tr>

          {/* Ave. Int — ABR under Deposit col, ALR under Loans col */}
          <tr className="abr-fmt-summary-row">
            <td className="abr-fmt-td" colSpan="2"><b>Ave. Int</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{avgBorrowingRate.toFixed(2)}</b></td>
            <td className="abr-fmt-td abr-fmt-right"><b>{avgLendingRate.toFixed(2)}</b></td>
            <td className="abr-fmt-td" colSpan="2"></td>
          </tr>
        </tbody>
      </table>

      {/* ── Formula Section ── */}
      <table className="abr-fmt-formula-table">
        <tbody>
          <tr>
            <td className="abr-fmt-formula-td">
              Average Borrowing Rate = {fmt(totalDepositRec)} *100 / {fmt(totalDeposit)}
            </td>
          </tr>
          <tr>
            <td className="abr-fmt-formula-td abr-fmt-formula-result">
              = {avgBorrowingRate.toFixed(2)}
            </td>
          </tr>
          <tr><td className="abr-fmt-formula-gap"></td></tr>
          <tr>
            <td className="abr-fmt-formula-td">
              Average Lending Rate = {fmt(totalIntRecived)} *100 / {fmt(totalLoans)}
            </td>
          </tr>
          <tr>
            <td className="abr-fmt-formula-td abr-fmt-formula-result">
              = {avgLendingRate.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── ALR / ABR / SPRED Table ── */}
      <table className="abr-fmt-spread-table">
        <thead>
          <tr>
            <th className="abr-fmt-spread-th">ALR</th>
            <th className="abr-fmt-spread-sep">-</th>
            <th className="abr-fmt-spread-th">ABR</th>
            <th className="abr-fmt-spread-sep">=</th>
            <th className="abr-fmt-spread-th">SPRED</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="abr-fmt-spread-td">{avgLendingRate.toFixed(2)}</td>
            <td className="abr-fmt-spread-sep"></td>
            <td className="abr-fmt-spread-td">{avgBorrowingRate.toFixed(2)}</td>
            <td className="abr-fmt-spread-sep"></td>
            <td className="abr-fmt-spread-td">{spread.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function AbrAlrReport() {
  const [reportType, setReportType] = useState("ABR_ALR");

  const [form, setForm] = useState({
    branchCode:     "1",
    asOnDate:       "22/05/2026",
    fromDate:       "",
    toDate:         "",
    textReportName: "",
  });

  const [reportData,   setReportData]   = useState([]);
  const [columns,      setColumns]      = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [fetched,      setFetched]      = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const reportRef = useRef(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFetched(false);
    setError("");
  };

  const handleTypeChange = (e) => {
    setReportType(e.target.value);
    setFetched(false);
    setError("");
    setReportData([]);
    setColumns([]);
  };

  const validate = (btnKey) => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (btnKey !== "mis") {
      if (!form.asOnDate.trim())       return "AsOnDate is required.";
      if (!isValidDate(form.asOnDate)) return "AsOnDate must be in DD/MM/YYYY format.";
    }
    if (btnKey === "mis") {
      if (!isValidDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
      if (!isValidDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
    }
    return null;
  };

  const fetchData = async (endpoint, params) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/abr-alr/${endpoint}?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      const flat = Array.isArray(data) ? data : (data.recordsets ? data.recordsets.flat() : []);
      setColumns(flat.length > 0 ? Object.keys(flat[0]) : []);
      setReportData(flat);
      setFetched(true);
      return flat;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    const err = validate("print");
    if (err) { setError(err); return; }
    setActiveButton("print");
    const isoDate = toISO(form.asOnDate);
    const endpoint = reportType === "ABR_ALR" ? "abr-alr/print" : "mis-report/print";
    const params = new URLSearchParams({ Brcd: form.branchCode.trim(), FisicalYear: isoDate });
    await fetchData(endpoint, params);
  };

  const handleTextReportView = async () => {
    const err = validate("view");
    if (err) { setError(err); return; }
    setActiveButton("view");
    const isoDate = toISO(form.asOnDate);
    const endpoint = reportType === "ABR_ALR" ? "abr-alr/text-report-view" : "mis-report/text-report-view";
    const params = new URLSearchParams({ Brcd: form.branchCode.trim(), FisicalYear: isoDate });
    await fetchData(endpoint, params);
  };

  const handleMisReport = async () => {
    const err = validate("mis");
    if (err) { setError(err); return; }
    setActiveButton("mis");
    const isoFrom = toISO(form.fromDate);
    const isoTo   = toISO(form.toDate);
    const [fy, fm] = isoFrom.split("-");
    const [ty, tm] = isoTo.split("-");
    const params = new URLSearchParams({
      Brcd: form.branchCode.trim(),
      PFMONTH: fm, PFYEAR: fy, PFDATE: isoFrom,
      PEMONTH: tm, PEYEAR: ty, PEDATE: isoTo,
    });
    await fetchData("mis-report/mis-report", params);
  };

  const handlePrintWindow = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>ABR/ALR Report</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; margin: 0; }
            .abr-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .abr-fmt-meta-left, .abr-fmt-meta-right { display: flex; flex-direction: column; gap: 3px; }
            .abr-fmt-meta-row { display: flex; gap: 6px; font-size: 9px; }
            .abr-fmt-meta-key { font-weight: 600; min-width: 75px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th, td { border: 1px solid #999; padding: 3px 6px; font-size: 8.5px; }
            .abr-fmt-title-row { text-align: center; font-weight: 700; font-size: 11px; padding: 6px; }
            .abr-fmt-col-head-row th { background: #fff; font-weight: 700; text-align: left; }
            .abr-fmt-right { text-align: right; }
            .abr-fmt-col-srno { width: 5%; text-align: center; }
            .abr-fmt-col-month { width: 15%; }
            .abr-fmt-col-num { text-align: right; }
            .abr-fmt-summary-row td { background: #f8f8f8; }
            .abr-fmt-row-alt { background: #f9f9f9; }
            .abr-fmt-formula-table { border: 1px solid #999; width: 70%; margin: 0 auto 10px; border-collapse: collapse; }
            .abr-fmt-formula-td { padding: 4px 10px; font-size: 9px; }
            .abr-fmt-formula-result { padding-left: 20px; font-weight: 600; }
            .abr-fmt-formula-gap { height: 6px; }
            .abr-fmt-spread-table { width: 60%; margin: 0 auto; border-collapse: collapse; }
            .abr-fmt-spread-th { border: 1px solid #999; padding: 5px 16px; text-align: center; font-weight: 700; background: #f0f0f0; }
            .abr-fmt-spread-td { border: 1px solid #999; padding: 5px 16px; text-align: center; font-weight: 600; }
            .abr-fmt-spread-sep { padding: 5px 6px; text-align: center; font-weight: 700; border: none; }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const showFormattedReport = activeButton === "print" && fetched && reportData.length > 0;
  const showGridReport      = (activeButton === "view" || activeButton === "mis") && fetched && reportData.length > 0;
  const isAbrAlr            = reportType === "ABR_ALR";

  return (
    <div className="abr-wrapper">
      <div className="abr-card">

        <div className="abr-header">ABR/ALR Report</div>

        <div className="abr-form-section">

          <div className="abr-radio-row">
            <label className="abr-radio-label">
              <input type="radio" name="reportType" value="ABR_ALR"
                checked={reportType === "ABR_ALR"} onChange={handleTypeChange} />
              ABR_ALR
            </label>
            <label className="abr-radio-label">
              <input type="radio" name="reportType" value="MIS"
                checked={reportType === "MIS"} onChange={handleTypeChange} />
              MIS Report
            </label>
          </div>

          <div className="abr-row">
            <label className="abr-label">Branch Code</label>
            <input className="abr-input" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {isAbrAlr && (
            <>
              <div className="abr-row">
                <label className="abr-label">AsOnDate</label>
                <input className="abr-input" name="asOnDate"
                  value={form.asOnDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
              </div>
              <div className="abr-row">
                <label className="abr-label abr-label-req">
                  Please enter text report name <span className="req">*</span>
                </label>
                <input className="abr-input abr-input-wide" name="textReportName"
                  value={form.textReportName} onChange={handleChange}
                  placeholder="Please enter text report name" />
              </div>
            </>
          )}

          {!isAbrAlr && (
            <>
              <div className="abr-row">
                <label className="abr-label">From Date</label>
                <input className="abr-input" name="fromDate"
                  value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
              </div>
              <div className="abr-row">
                <label className="abr-label">To Date</label>
                <input className="abr-input" name="toDate"
                  value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
              </div>
            </>
          )}

          {error && <p className="abr-error">{error}</p>}
          {loading && <div className="abr-loading-bar"><div className="abr-loading-fill" /></div>}

        </div>

        <div className="abr-footer">
          <button className="abr-btn" onClick={handlePrint} disabled={loading}>
            {loading && activeButton === "print" ? "Loading…" : "Print"}
          </button>
          <button className="abr-btn" onClick={handleTextReportView} disabled={loading}>
            {loading && activeButton === "view" ? "Loading…" : "Text Report View"}
          </button>
          <button className="abr-btn" onClick={handleMisReport} disabled={loading}>
            {loading && activeButton === "mis" ? "Loading…" : "MIS Report"}
          </button>
        </div>

        <div className="abr-preview">
          {loading && <span className="abr-preview-empty">Loading...</span>}
          {!loading && !fetched && <span className="abr-preview-empty">Preview area</span>}
          {!loading && fetched && reportData.length === 0 && <span className="abr-preview-empty">No records found.</span>}

          {!loading && showFormattedReport && (
            <div className="abr-report-wrapper">
              <div className="abr-report-toolbar">
                <button className="abr-btn abr-btn-sm" onClick={handlePrintWindow}>
                  🖨️ Print Report
                </button>
              </div>
              <div ref={reportRef}>
                <AbrAlrFormatted data={reportData} asOnDate={form.asOnDate} />
              </div>
            </div>
          )}

          {!loading && showGridReport && (
            <div className="abr-table-wrapper">
              <table className="abr-table">
                <thead>
                  <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => <td key={col}>{row[col] ?? ""}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="abr-record-count">Total Records: {reportData.length}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AbrAlrReport;