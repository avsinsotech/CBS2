

// // import { useState } from "react";
// // import "./BranchAdjustment.css";

// // // const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";
// // const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// // function BranchAdjustment() {
// //   const [form, setForm] = useState({
// //     branchCode: "1",
// //     fromDate: "01/04/2025",
// //     toDate: "30/03/2026",
// //     textReportName: ""
// //   });

// //   const [reportData, setReportData] = useState([]);
// //   const [columns, setColumns]       = useState([]);
// //   const [loading, setLoading]       = useState(false);
// //   const [error, setError]           = useState("");
// //   const [fetched, setFetched]       = useState(false);

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //     setFetched(false);
// //   };

// //   // Convert DD/MM/YYYY or DD/MM/YY → YYYY-MM-DD for the API
// //   const parseDate = (raw) => {
// //     const parts = raw.trim().split("/");
// //     if (parts.length !== 3) return null;
// //     let [d, m, y] = parts;
// //     if (y.length === 2) y = "20" + y;
// //     if (d.length < 2) d = d.padStart(2, "0");
// //     if (m.length < 2) m = m.padStart(2, "0");
// //     return `${y}-${m}-${d}`;
// //   };

// //   // Extract month (MM) and year (YYYY) from a parsed YYYY-MM-DD string
// //   const extractMonthYear = (isoDate) => {
// //     const [year, month] = isoDate.split("-");
// //     return { month, year };
// //   };

// //   const validate = () => {
// //     if (!form.branchCode.trim()) return "Branch Code is required.";
// //     if (!form.fromDate.trim())   return "From Date is required.";
// //     if (!form.toDate.trim())     return "To Date is required.";
// //     if (!parseDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
// //     if (!parseDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
// //     return null;
// //   };

// //   const fetchData = async (endpoint) => {
// //     const validationError = validate();
// //     if (validationError) {
// //       setError(validationError);
// //       return null;
// //     }

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const isoFrom = parseDate(form.fromDate);
// //       const isoTo   = parseDate(form.toDate);
// //       const { month: PFMONTH, year: PFYEAR } = extractMonthYear(isoFrom);
// //       const { month: ptmonth, year: ptyear } = extractMonthYear(isoTo);

// //       const params = new URLSearchParams({
// //         Brcd:    form.branchCode.trim(),
// //         PFMONTH,
// //         ptmonth,
// //         PFDT:    isoFrom,
// //         PTDT:    isoTo,
// //         PFYEAR,
// //         ptyear
// //       });

// //       const res = await fetch(`${API_BASE_URL}/api/branch-adjustment/${endpoint}?${params}`);
// //       if (!res.ok) {
// //         const body = await res.json().catch(() => ({}));
// //         throw new Error(body.error || `Server error: ${res.status}`);
// //       }

// //       const data = await res.json();

// //       if (data.length > 0) {
// //         setColumns(Object.keys(data[0]));
// //       } else {
// //         setColumns([]);
// //       }

// //       setReportData(data);
// //       setFetched(true);
// //       return data;
// //     } catch (err) {
// //       setError(err.message || "Failed to fetch report.");
// //       return null;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleReportPrint = async () => {
// //     const data = fetched ? reportData : await fetchData("report-print");
// //     if (data && data.length > 0) {
// //       setTimeout(() => window.print(), 300);
// //     }
// //   };

// //   const handleTextReportView = async () => {
// //     await fetchData("text-report-view");
// //   };

// //   return (
// //     <div className="ba-wrapper">
// //       <div className="ba-card no-print">

// //         <div className="ba-header">
// //           <span>Branch Adjustment Report</span>
// //         </div>

// //         <div className="ba-body">

// //           {/* ROW 1 */}
// //           <div className="ba-row">
// //             <div className="ba-field">
// //               <label>Branch Code <span className="req">*</span></label>
// //               <input name="branchCode" value={form.branchCode} onChange={handleChange} />
// //             </div>
// //           </div>

// //           {/* ROW 2 */}
// //           <div className="ba-row">
// //             <div className="ba-field">
// //               <label>From Date <span className="req">*</span></label>
// //               <input name="fromDate" value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
// //             </div>
// //             <div className="ba-field">
// //               <label>To Date <span className="req">*</span></label>
// //               <input name="toDate" value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
// //             </div>
// //           </div>

// //           {/* ROW 3 */}
// //           <div className="ba-row">
// //             <div className="ba-field ba-field-wide">
// //               <label>Text Report Name</label>
// //               <input
// //                 name="textReportName"
// //                 value={form.textReportName}
// //                 onChange={handleChange}
// //                 placeholder="Enter Text Report Name"
// //               />
// //             </div>
// //           </div>

// //           {/* ERROR / LOADING */}
// //           {error   && <p className="ba-error">{error}</p>}
// //           {loading && <p className="ba-loading">Loading...</p>}

// //           {/* BUTTONS */}
// //           <div className="ba-footer">
// //             <button
// //               className="ba-btn ba-btn-print"
// //               onClick={handleReportPrint}
// //               disabled={loading}
// //             >
// //               {loading ? "Loading..." : "Report Print"}
// //             </button>
// //             <button
// //               className="ba-btn ba-btn-view"
// //               onClick={handleTextReportView}
// //               disabled={loading}
// //             >
// //               {loading ? "Loading..." : "Text Report View"}
// //             </button>
// //           </div>

// //         </div>
// //       </div>

// //       {/* REPORT TABLE */}
// //       {fetched && reportData.length > 0 && (
// //         <div className="ba-table-wrapper">

// //           {/* Print header — only visible on print */}
// //           <div className="print-only ba-print-header">
// //             <h2>{form.textReportName || "Branch Adjustment Report"}</h2>
// //             <p>
// //               Branch: {form.branchCode} &nbsp;|&nbsp;
// //               From Date: {form.fromDate} &nbsp;|&nbsp;
// //               To Date: {form.toDate} &nbsp;|&nbsp;
// //               Date Printed: {new Date().toLocaleDateString()}
// //             </p>
// //           </div>

// //           <table className="ba-table">
// //             <thead>
// //               <tr>
// //                 {columns.map((col) => (
// //                   <th key={col}>{col}</th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {reportData.map((row, i) => (
// //                 <tr key={i}>
// //                   {columns.map((col) => (
// //                     <td key={col}>{row[col] ?? ""}</td>
// //                   ))}
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>

// //           <p className="ba-record-count no-print">
// //             Total Records: {reportData.length}
// //           </p>
// //         </div>
// //       )}

// //       {fetched && reportData.length === 0 && !loading && (
// //         <p className="ba-error no-print">No records found for the given criteria.</p>
// //       )}
// //     </div>
// //   );
// // }

// // export default BranchAdjustment;

// import { useState, useRef } from "react";
// import "./BranchAdjustment.css";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// // ── Number formatter ──────────────────────────────────────────────────────────
// const fmt = (v) => {
//   if (v === null || v === undefined || v === "") return "";
//   const n = parseFloat(v);
//   if (isNaN(n)) return v;
//   return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// const fmtInt = (v) => {
//   if (v === null || v === undefined || v === "") return "";
//   const n = parseFloat(v);
//   if (isNaN(n)) return v;
//   return n.toLocaleString("en-IN");
// };

// // ── Formatted Report Component ────────────────────────────────────────────────
// function BAReportFormatted({ data, fromDate, toDate }) {
//   const printDate = new Date().toLocaleDateString("en-GB").split("/").join("-");

//   // Detect column keys from first row
//   const keys = data.length > 0 ? Object.keys(data[0]) : [];

//   // Left panel (Branch Level To Ho Balance)
//   const lProductId  = keys.find(k => /^product.?id$|^prod.?id$|^glcode$|^subgl/i.test(k))   || keys[0]  || "";
//   const lEntryDate  = keys.find(k => /entry.?date|tdate|trans.?date/i.test(k))               || keys[1]  || "";
//   const lSetNo      = keys.find(k => /set.?no|setno/i.test(k))                               || keys[2]  || "";
//   const lNarration  = keys.find(k => /narr|description|remark/i.test(k))                     || keys[3]  || "";
//   const lCrAmount   = keys.find(k => /cr.?amt|credit.?amt|cramount/i.test(k))                || keys[4]  || "";
//   const lDrAmount   = keys.find(k => /dr.?amt|debit.?amt|dramount/i.test(k))                 || keys[5]  || "";
//   const lBalance    = keys.find(k => /^bal$|^balance$/i.test(k))                             || keys[6]  || "";

//   // Right panel (Branch Balance At Ho)
//   const rProductId  = keys.find(k => /r.?product|ho.?prod|prod.?id.?2|product.?id.?2/i.test(k)) || "";
//   const rEntryDate  = keys.find(k => /r.?entry|ho.?entry|entry.?date.?2/i.test(k))              || "";
//   const rSetNo      = keys.find(k => /r.?set|ho.?set|set.?no.?2/i.test(k))                      || "";
//   const rNarration  = keys.find(k => /r.?narr|ho.?narr|narr.?2/i.test(k))                       || "";
//   const rCrAmount   = keys.find(k => /r.?cr|ho.?cr|cr.?amt.?2/i.test(k))                        || "";
//   const rDrAmount   = keys.find(k => /r.?dr|ho.?dr|dr.?amt.?2/i.test(k))                        || "";
//   const rBalance    = keys.find(k => /r.?bal|ho.?bal|bal.?2/i.test(k))                          || "";
//   const diffAmt     = keys.find(k => /diff/i.test(k))                                           || "";

//   // Totals
//   const totalLCr  = data.reduce((s, r) => s + (parseFloat(r[lCrAmount])  || 0), 0);
//   const totalLDr  = data.reduce((s, r) => s + (parseFloat(r[lDrAmount])  || 0), 0);
//   const totalLBal = data.reduce((s, r) => s + (parseFloat(r[lBalance])   || 0), 0);
//   const totalRCr  = data.reduce((s, r) => s + (parseFloat(r[rCrAmount])  || 0), 0);
//   const totalRDr  = data.reduce((s, r) => s + (parseFloat(r[rDrAmount])  || 0), 0);
//   const totalRBal = data.reduce((s, r) => s + (parseFloat(r[rBalance])   || 0), 0);

//   return (
//     <div className="ba-formatted-report">

//       {/* ── Meta Header ── */}
//       <div className="ba-fmt-meta-grid">
//         <div className="ba-fmt-meta-left">
//           <div className="ba-fmt-meta-row">
//             <span className="ba-fmt-meta-key">Bank Name</span>
//             <span className="ba-fmt-meta-sep">:</span>
//             <span className="ba-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
//           </div>
//           <div className="ba-fmt-meta-row">
//             <span className="ba-fmt-meta-key">Branch Name</span>
//             <span className="ba-fmt-meta-sep">:</span>
//             <span className="ba-fmt-meta-val">HEAD OFFICE</span>
//           </div>
//         </div>
//         <div className="ba-fmt-meta-right">
//           <div className="ba-fmt-meta-row">
//             <span className="ba-fmt-meta-key">User ID</span>
//             <span className="ba-fmt-meta-sep">:</span>
//             <span className="ba-fmt-meta-val">Rohini</span>
//           </div>
//           <div className="ba-fmt-meta-row">
//             <span className="ba-fmt-meta-key">Print Date</span>
//             <span className="ba-fmt-meta-sep">:</span>
//             <span className="ba-fmt-meta-val">{printDate}</span>
//           </div>
//         </div>
//       </div>

//       {/* ── Report Table ── */}
//       <table className="ba-fmt-table">
//         <thead>
//           {/* Title row */}
//           <tr>
//             <th colSpan="16" className="ba-fmt-title-row">
//               Genral Ledger {fromDate} To {toDate}
//             </th>
//           </tr>

//           {/* Panel headers */}
//           <tr>
//             <th colSpan="8" className="ba-fmt-panel-head">Branch Level To Ho Balance</th>
//             <th colSpan="8" className="ba-fmt-panel-head">Branch Balance At Ho</th>
//           </tr>

//           {/* Column headers */}
//           <tr className="ba-fmt-col-head-row">
//             {/* Left */}
//             <th className="ba-fmt-th ba-fmt-col-srno">Sr no</th>
//             <th className="ba-fmt-th ba-fmt-col-prodid">Product ID</th>
//             <th className="ba-fmt-th ba-fmt-col-date">Entry Date</th>
//             <th className="ba-fmt-th ba-fmt-col-setno">SetNo</th>
//             <th className="ba-fmt-th ba-fmt-col-narr">Narration</th>
//             <th className="ba-fmt-th ba-fmt-col-amt">Cr Amount</th>
//             <th className="ba-fmt-th ba-fmt-col-amt">Dr Amount</th>
//             <th className="ba-fmt-th ba-fmt-col-amt">Balance</th>
//             {/* Right */}
//             <th className="ba-fmt-th ba-fmt-col-prodid">Product ID</th>
//             <th className="ba-fmt-th ba-fmt-col-date">Entry Date</th>
//             <th className="ba-fmt-th ba-fmt-col-setno">SetNo</th>
//             <th className="ba-fmt-th ba-fmt-col-narr">Narration</th>
//             <th className="ba-fmt-th ba-fmt-col-amt">Cr Amount</th>
//             <th className="ba-fmt-th ba-fmt-col-amt">Dr Amount</th>
//             <th className="ba-fmt-th ba-fmt-col-amt">Balance</th>
//             <th className="ba-fmt-th ba-fmt-col-amt">Diff Amt</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index} className={index % 2 === 0 ? "" : "ba-fmt-row-alt"}>
//               {/* Left panel */}
//               <td className="ba-fmt-td ba-fmt-col-srno">{index + 1}</td>
//               <td className="ba-fmt-td ba-fmt-col-prodid">{fmtInt(row[lProductId])}</td>
//               <td className="ba-fmt-td ba-fmt-col-date">{row[lEntryDate] ? String(row[lEntryDate]).split("T")[0] : ""}</td>
//               <td className="ba-fmt-td ba-fmt-col-setno">{row[lSetNo] ?? ""}</td>
//               <td className="ba-fmt-td ba-fmt-col-narr">{row[lNarration] ?? ""}</td>
//               <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[lCrAmount])}</td>
//               <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[lDrAmount])}</td>
//               <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[lBalance])}</td>
//               {/* Right panel */}
//               <td className="ba-fmt-td ba-fmt-col-prodid">{fmtInt(row[rProductId] ?? row[lProductId])}</td>
//               <td className="ba-fmt-td ba-fmt-col-date">{row[rEntryDate] ? String(row[rEntryDate]).split("T")[0] : (row[lEntryDate] ? String(row[lEntryDate]).split("T")[0] : "")}</td>
//               <td className="ba-fmt-td ba-fmt-col-setno">{row[rSetNo] ?? row[lSetNo] ?? ""}</td>
//               <td className="ba-fmt-td ba-fmt-col-narr">{row[rNarration] ?? row[lNarration] ?? ""}</td>
//               <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[rCrAmount] ?? "")}</td>
//               <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[rDrAmount] ?? "")}</td>
//               <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[rBalance] ?? "")}</td>
//               <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[diffAmt] ?? "")}</td>
//             </tr>
//           ))}

//           {/* Totals row */}
//           <tr className="ba-fmt-totals-row">
//             <td colSpan="5" className="ba-fmt-td ba-fmt-total-label"></td>
//             <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalLCr)}</td>
//             <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalLDr)}</td>
//             <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalLBal)}</td>
//             <td colSpan="4" className="ba-fmt-td ba-fmt-total-label"></td>
//             <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalRCr)}</td>
//             <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalRDr)}</td>
//             <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalRBal)}</td>
//             <td className="ba-fmt-td"></td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// function BranchAdjustment() {
//   const [form, setForm] = useState({
//     branchCode: "1",
//     fromDate: "01/04/2025",
//     toDate: "30/03/2026",
//     textReportName: ""
//   });

//   const [reportData, setReportData] = useState([]);
//   const [columns,    setColumns]    = useState([]);
//   const [loading,    setLoading]    = useState(false);
//   const [error,      setError]      = useState("");
//   const [fetched,    setFetched]    = useState(false);
//   const [activeButton, setActiveButton] = useState("");
//   const reportRef = useRef(null);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setFetched(false);
//     setError("");
//   };

//   const parseDate = (raw) => {
//     const parts = raw.trim().split("/");
//     if (parts.length !== 3) return null;
//     let [d, m, y] = parts;
//     if (y.length === 2) y = "20" + y;
//     return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
//   };

//   const extractMonthYear = (isoDate) => {
//     const [year, month] = isoDate.split("-");
//     return { month, year };
//   };

//   const validate = () => {
//     if (!form.branchCode.trim()) return "Branch Code is required.";
//     if (!form.fromDate.trim())   return "From Date is required.";
//     if (!form.toDate.trim())     return "To Date is required.";
//     if (!parseDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
//     if (!parseDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
//     return null;
//   };

//   const fetchData = async (endpoint) => {
//     const validationError = validate();
//     if (validationError) { setError(validationError); return null; }

//     setLoading(true);
//     setError("");

//     try {
//       const isoFrom = parseDate(form.fromDate);
//       const isoTo   = parseDate(form.toDate);
//       const { month: PFMONTH, year: PFYEAR } = extractMonthYear(isoFrom);
//       const { month: ptmonth, year: ptyear } = extractMonthYear(isoTo);

//       const params = new URLSearchParams({
//         Brcd: form.branchCode.trim(),
//         PFMONTH, ptmonth,
//         PFDT: isoFrom, PTDT: isoTo,
//         PFYEAR, ptyear
//       });

//       const res = await fetch(`${API_BASE_URL}/api/branch-adjustment/${endpoint}?${params}`);
//       if (!res.ok) {
//         const body = await res.json().catch(() => ({}));
//         throw new Error(body.error || `Server error: ${res.status}`);
//       }

//       const data = await res.json();
//       setColumns(data.length > 0 ? Object.keys(data[0]) : []);
//       setReportData(data);
//       setFetched(true);
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to fetch report.");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Report Print → formatted view ────────────────────────────────────────
//   const handleReportPrint = async () => {
//     setActiveButton("print");
//     await fetchData("report-print");
//   };

//   // ── Text Report View → grid view ─────────────────────────────────────────
//   const handleTextReportView = async () => {
//     setActiveButton("view");
//     await fetchData("text-report-view");
//   };

//   // ── Open print popup window ───────────────────────────────────────────────
//   const handlePrintWindow = () => {
//     if (!reportRef.current) return;
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Branch Adjustment Report</title>
//           <style>
//             @page { size: landscape; margin: 6mm; }
//             body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 8px; margin: 0; }
//             .ba-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 6px; }
//             .ba-fmt-meta-left, .ba-fmt-meta-right { display: flex; flex-direction: column; gap: 3px; }
//             .ba-fmt-meta-row { display: flex; gap: 5px; font-size: 8px; }
//             .ba-fmt-meta-key { font-weight: 600; min-width: 75px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 4px; }
//             th, td { border: 1px solid #999; padding: 2px 4px; text-align: left; font-size: 7.5px; }
//             .ba-fmt-title-row { text-align: center; font-weight: 700; font-size: 10px; padding: 5px; background: #fff; }
//             .ba-fmt-panel-head { text-align: center; font-weight: 700; background: #e8edf3; font-size: 8.5px; padding: 4px; }
//             .ba-fmt-col-head-row th { background: #fff; font-weight: 700; text-align: left; }
//             .ba-fmt-num { text-align: right; }
//             .ba-fmt-col-srno   { width: 3%; text-align: center; }
//             .ba-fmt-col-prodid { width: 4%; }
//             .ba-fmt-col-date   { width: 7%; white-space: nowrap; }
//             .ba-fmt-col-setno  { width: 3%; }
//             .ba-fmt-col-narr   { width: 16%; word-break: break-word; white-space: normal; }
//             .ba-fmt-col-amt    { width: 5%; text-align: right; }
//             .ba-fmt-row-alt { background: #f9f9f9; }
//             .ba-fmt-totals-row td { border-top: 2px solid #333; font-weight: 700; }
//             .ba-fmt-total-val { text-align: right; }
//           </style>
//         </head>
//         <body>${reportRef.current.innerHTML}</body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   const showFormattedReport = activeButton === "print" && fetched && reportData.length > 0;
//   const showGridReport      = activeButton === "view"  && fetched && reportData.length > 0;

//   return (
//     <div className="ba-wrapper">
//       <div className="ba-card">

//         <div className="ba-header">Branch Adjustment Report</div>

//         <div className="ba-body">

//           {/* ROW 1 */}
//           <div className="ba-row">
//             <div className="ba-field">
//               <label>Branch Code <span className="req">*</span></label>
//               <input name="branchCode" value={form.branchCode} onChange={handleChange} />
//             </div>
//           </div>

//           {/* ROW 2 */}
//           <div className="ba-row">
//             <div className="ba-field">
//               <label>From Date <span className="req">*</span></label>
//               <input name="fromDate" value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
//             </div>
//             <div className="ba-field">
//               <label>To Date <span className="req">*</span></label>
//               <input name="toDate" value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
//             </div>
//           </div>

//           {/* ROW 3 */}
//           <div className="ba-row">
//             <div className="ba-field ba-field-wide">
//               <label>Text Report Name</label>
//               <input
//                 name="textReportName"
//                 value={form.textReportName}
//                 onChange={handleChange}
//                 placeholder="Enter Text Report Name"
//               />
//             </div>
//           </div>

//           {error   && <p className="ba-error">{error}</p>}
//           {loading && <p className="ba-loading">Loading...</p>}

//           {/* BUTTONS */}
//           <div className="ba-footer">
//             <button className="ba-btn ba-btn-print" onClick={handleReportPrint} disabled={loading}>
//               {loading && activeButton === "print" ? "Loading..." : "Report Print"}
//             </button>
//             <button className="ba-btn ba-btn-view" onClick={handleTextReportView} disabled={loading}>
//               {loading && activeButton === "view" ? "Loading..." : "Text Report View"}
//             </button>
//           </div>
//         </div>

//         {/* ── Preview Panel ── */}
//         <div className="ba-preview">
//           {loading && <span className="ba-preview-empty">Loading...</span>}

//           {!loading && !fetched && (
//             <span className="ba-preview-empty">Preview area</span>
//           )}

//           {!loading && fetched && reportData.length === 0 && (
//             <span className="ba-preview-empty">No records found for the given criteria.</span>
//           )}

//           {/* Formatted Report */}
//           {!loading && showFormattedReport && (
//             <div className="ba-report-wrapper">
//               <div className="ba-report-toolbar">
//                 <button className="ba-btn ba-btn-sm" onClick={handlePrintWindow}>
//                   🖨️ Print Report
//                 </button>
//               </div>
//               <div ref={reportRef}>
//                 <BAReportFormatted
//                   data={reportData}
//                   fromDate={form.fromDate}
//                   toDate={form.toDate}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Grid View */}
//           {!loading && showGridReport && (
//             <div className="ba-table-wrapper">
//               <table className="ba-table">
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
//               <p className="ba-record-count">Total Records: {reportData.length}</p>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default BranchAdjustment;


import { useState, useRef } from "react";
import "./BranchAdjustment.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Number formatter ──────────────────────────────────────────────────────────
const fmt = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtInt = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  return n.toLocaleString("en-IN");
};

// ── Format date: strips time part and converts YYYY-MM-DD → DD-MM-YYYY ────────
const fmtDate = (v) => {
  if (!v) return "";
  const s = String(v).split("T")[0]; // strip time
  // If already DD-MM-YYYY or DD/MM/YYYY, return as-is (with dashes)
  if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(s)) return s.replace(/\//g, "-");
  // Convert YYYY-MM-DD → DD-MM-YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-");
    return `${d}-${m}-${y}`;
  }
  return s;
};


// ── Formatted Report Component ────────────────────────────────────────────────
function BAReportFormatted({ data, fromDate, toDate }) {
  const printDate = new Date().toLocaleDateString("en-GB").split("/").join("-");

  if (!data || data.length === 0) return null;

  // ── LEFT PANEL — Branch (_Br) columns ──
  const lProductId = "SUBGLCODE_Br";
  const lEntryDate = "EDATE_Br";
  const lSetNo     = "SETNO_Br";
  const lNarration = "PARTI_Br";
  const lCrAmount  = "CREDIT_Br";
  const lDrAmount  = "DEBIT_Br";
  const lBalance   = "BALANCE_Br";

  // ── RIGHT PANEL — Head Office (_Ho) columns ──
  const rProductId = "SUBGLCODE_Ho";
  const rEntryDate = "EDATE_Ho";
  const rSetNo     = "SETNO_Ho";
  const rNarration = "PARTI_Ho";
  const rCrAmount  = "CREDIT_Ho";
  const rDrAmount  = "DEBIT_Ho";
  const rBalance   = "BALANCE_Ho";
  const diffAmt    = "diff";

  // ── Totals ──
  const sum = (col) => data.reduce((s, r) => s + (parseFloat(r[col]) || 0), 0);
  const totalLCr  = lCrAmount  ? sum(lCrAmount)  : 0;
  const totalLDr  = lDrAmount  ? sum(lDrAmount)  : 0;
  const totalLBal = lBalance   ? sum(lBalance)   : 0;
  const totalRCr  = rCrAmount  ? sum(rCrAmount)  : 0;
  const totalRDr  = rDrAmount  ? sum(rDrAmount)  : 0;
  const totalRBal = rBalance   ? sum(rBalance)   : 0;

  return (
    <div className="ba-formatted-report">

      {/* ── Meta Header ── */}
      <div className="ba-fmt-meta-grid">
        <div className="ba-fmt-meta-left">
          <div className="ba-fmt-meta-row">
            <span className="ba-fmt-meta-key">Bank Name</span>
            <span className="ba-fmt-meta-sep">:</span>
            <span className="ba-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
          </div>
          <div className="ba-fmt-meta-row">
            <span className="ba-fmt-meta-key">Branch Name</span>
            <span className="ba-fmt-meta-sep">:</span>
            <span className="ba-fmt-meta-val">HEAD OFFICE</span>
          </div>
        </div>
        <div className="ba-fmt-meta-right">
          <div className="ba-fmt-meta-row">
            <span className="ba-fmt-meta-key">User ID</span>
            <span className="ba-fmt-meta-sep">:</span>
            <span className="ba-fmt-meta-val">Rohini</span>
          </div>
          <div className="ba-fmt-meta-row">
            <span className="ba-fmt-meta-key">Print Date</span>
            <span className="ba-fmt-meta-sep">:</span>
            <span className="ba-fmt-meta-val">{printDate}</span>
          </div>
        </div>
      </div>

      {/* ── Report Table ── */}
      <table className="ba-fmt-table">
        <thead>
          <tr>
            <th colSpan="16" className="ba-fmt-title-row">
              Genral Ledger {fromDate} To {toDate}
            </th>
          </tr>
          <tr>
            <th colSpan="8" className="ba-fmt-panel-head">Branch Level To Ho Balance</th>
            <th colSpan="8" className="ba-fmt-panel-head">Branch Balance At Ho</th>
          </tr>
          <tr className="ba-fmt-col-head-row">
            <th className="ba-fmt-th ba-fmt-col-srno">Sr no</th>
            <th className="ba-fmt-th ba-fmt-col-prodid">Product ID</th>
            <th className="ba-fmt-th ba-fmt-col-date">Entry Date</th>
            <th className="ba-fmt-th ba-fmt-col-setno">SetNo</th>
            <th className="ba-fmt-th ba-fmt-col-narr">Narration</th>
            <th className="ba-fmt-th ba-fmt-col-amt">Cr Amount</th>
            <th className="ba-fmt-th ba-fmt-col-amt">Dr Amount</th>
            <th className="ba-fmt-th ba-fmt-col-amt">Balance</th>
            <th className="ba-fmt-th ba-fmt-col-prodid">Product ID</th>
            <th className="ba-fmt-th ba-fmt-col-date">Entry Date</th>
            <th className="ba-fmt-th ba-fmt-col-setno">SetNo</th>
            <th className="ba-fmt-th ba-fmt-col-narr">Narration</th>
            <th className="ba-fmt-th ba-fmt-col-amt">Cr Amount</th>
            <th className="ba-fmt-th ba-fmt-col-amt">Dr Amount</th>
            <th className="ba-fmt-th ba-fmt-col-amt">Balance</th>
            <th className="ba-fmt-th ba-fmt-col-amt">Diff Amt</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "" : "ba-fmt-row-alt"}>
              {/* Left panel */}
              <td className="ba-fmt-td ba-fmt-col-srno">{index + 1}</td>
              <td className="ba-fmt-td ba-fmt-col-prodid">{row[lProductId] ?? ""}</td>
              <td className="ba-fmt-td ba-fmt-col-date">{fmtDate(row[lEntryDate])}</td>
              <td className="ba-fmt-td ba-fmt-col-setno">{row[lSetNo] ?? ""}</td>
              <td className="ba-fmt-td ba-fmt-col-narr">{row[lNarration] ?? ""}</td>
              <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[lCrAmount])}</td>
              <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[lDrAmount])}</td>
              <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{fmt(row[lBalance])}</td>
              {/* Right panel */}
              <td className="ba-fmt-td ba-fmt-col-prodid">{row[rProductId] ?? ""}</td>
              <td className="ba-fmt-td ba-fmt-col-date">{fmtDate(row[rEntryDate])}</td>
              <td className="ba-fmt-td ba-fmt-col-setno">{row[rSetNo] ?? ""}</td>
              <td className="ba-fmt-td ba-fmt-col-narr">{row[rNarration] ?? ""}</td>
              <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{rCrAmount ? fmt(row[rCrAmount]) : ""}</td>
              <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{rDrAmount ? fmt(row[rDrAmount]) : ""}</td>
              <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{rBalance  ? fmt(row[rBalance])  : ""}</td>
              <td className="ba-fmt-td ba-fmt-col-amt ba-fmt-num">{diffAmt   ? fmt(row[diffAmt])   : ""}</td>
            </tr>
          ))}

          {/* Totals row */}
          <tr className="ba-fmt-totals-row">
            <td colSpan="5" className="ba-fmt-td ba-fmt-total-label"></td>
            <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalLCr)}</td>
            <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalLDr)}</td>
            <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalLBal)}</td>
            <td colSpan="4" className="ba-fmt-td ba-fmt-total-label"></td>
            <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalRCr)}</td>
            <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalRDr)}</td>
            <td className="ba-fmt-td ba-fmt-num ba-fmt-total-val">{fmtInt(totalRBal)}</td>
            <td className="ba-fmt-td"></td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function BranchAdjustment() {
  const [form, setForm] = useState({
    branchCode: "1",
    fromDate: "01/04/2025",
    toDate: "30/03/2026",
    textReportName: ""
  });

  const [reportData, setReportData] = useState([]);
  const [columns,    setColumns]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [fetched,    setFetched]    = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const reportRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFetched(false);
    setError("");
  };

  const parseDate = (raw) => {
    const parts = raw.trim().split("/");
    if (parts.length !== 3) return null;
    let [d, m, y] = parts;
    if (y.length === 2) y = "20" + y;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const extractMonthYear = (isoDate) => {
    const [year, month] = isoDate.split("-");
    return { month, year };
  };

  const validate = () => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (!form.fromDate.trim())   return "From Date is required.";
    if (!form.toDate.trim())     return "To Date is required.";
    if (!parseDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
    if (!parseDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
    return null;
  };

  const fetchData = async (endpoint) => {
    const validationError = validate();
    if (validationError) { setError(validationError); return null; }

    setLoading(true);
    setError("");

    try {
      const isoFrom = parseDate(form.fromDate);
      const isoTo   = parseDate(form.toDate);
      const { month: PFMONTH, year: PFYEAR } = extractMonthYear(isoFrom);
      const { month: ptmonth, year: ptyear } = extractMonthYear(isoTo);

      const params = new URLSearchParams({
        Brcd: form.branchCode.trim(),
        PFMONTH, ptmonth,
        PFDT: isoFrom, PTDT: isoTo,
        PFYEAR, ptyear
      });

      const res = await fetch(`${API_BASE_URL}/api/branch-adjustment/${endpoint}?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setReportData(data);
      setFetched(true);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleReportPrint = async () => {
    setActiveButton("print");
    await fetchData("report-print");
  };

  const handleTextReportView = async () => {
    setActiveButton("view");
    await fetchData("text-report-view");
  };

  const handlePrintWindow = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Branch Adjustment Report</title>
          <style>
            @page { size: landscape; margin: 6mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 8px; margin: 0; }
            .ba-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .ba-fmt-meta-left, .ba-fmt-meta-right { display: flex; flex-direction: column; gap: 3px; }
            .ba-fmt-meta-row { display: flex; gap: 5px; font-size: 8px; }
            .ba-fmt-meta-key { font-weight: 600; min-width: 75px; }
            table { width: 100%; border-collapse: collapse; margin-top: 4px; }
            th, td { border: 1px solid #999; padding: 2px 4px; text-align: left; font-size: 7.5px; }
            .ba-fmt-title-row { text-align: center; font-weight: 700; font-size: 10px; padding: 5px; background: #fff; }
            .ba-fmt-panel-head { text-align: center; font-weight: 700; background: #e8edf3; font-size: 8.5px; padding: 4px; }
            .ba-fmt-col-head-row th { background: #fff; font-weight: 700; text-align: left; }
            .ba-fmt-num { text-align: right; }
            .ba-fmt-col-srno   { width: 3%; text-align: center; }
            .ba-fmt-col-prodid { width: 4%; }
            .ba-fmt-col-date   { width: 7%; white-space: nowrap; }
            .ba-fmt-col-setno  { width: 3%; }
            .ba-fmt-col-narr   { width: 16%; word-break: break-word; white-space: normal; }
            .ba-fmt-col-amt    { width: 5%; text-align: right; }
            .ba-fmt-row-alt { background: #f9f9f9; }
            .ba-fmt-totals-row td { border-top: 2px solid #333; font-weight: 700; }
            .ba-fmt-total-val { text-align: right; }
            details { display: none; }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const showFormattedReport = activeButton === "print" && fetched && reportData.length > 0;
  const showGridReport      = activeButton === "view"  && fetched && reportData.length > 0;

  return (
    <div className="ba-wrapper">
      <div className="ba-card">

        <div className="ba-header">Branch Adjustment Report</div>

        <div className="ba-body">

          <div className="ba-row">
            <div className="ba-field">
              <label>Branch Code <span className="req">*</span></label>
              <input name="branchCode" value={form.branchCode} onChange={handleChange} />
            </div>
          </div>

          <div className="ba-row">
            <div className="ba-field">
              <label>From Date <span className="req">*</span></label>
              <input name="fromDate" value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
            </div>
            <div className="ba-field">
              <label>To Date <span className="req">*</span></label>
              <input name="toDate" value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
            </div>
          </div>

          <div className="ba-row">
            <div className="ba-field ba-field-wide">
              <label>Text Report Name</label>
              <input
                name="textReportName"
                value={form.textReportName}
                onChange={handleChange}
                placeholder="Enter Text Report Name"
              />
            </div>
          </div>

          {error   && <p className="ba-error">{error}</p>}
          {loading && <p className="ba-loading">Loading...</p>}

          <div className="ba-footer">
            <button className="ba-btn ba-btn-print" onClick={handleReportPrint} disabled={loading}>
              {loading && activeButton === "print" ? "Loading..." : "Report Print"}
            </button>
            <button className="ba-btn ba-btn-view" onClick={handleTextReportView} disabled={loading}>
              {loading && activeButton === "view" ? "Loading..." : "Text Report View"}
            </button>
          </div>
        </div>

        {/* ── Preview Panel ── */}
        <div className="ba-preview">
          {loading && <span className="ba-preview-empty">Loading...</span>}

          {!loading && !fetched && (
            <span className="ba-preview-empty">Preview area</span>
          )}

          {!loading && fetched && reportData.length === 0 && (
            <span className="ba-preview-empty">No records found for the given criteria.</span>
          )}

          {!loading && showFormattedReport && (
            <div className="ba-report-wrapper">
              <div className="ba-report-toolbar">
                <button className="ba-btn ba-btn-sm" onClick={handlePrintWindow}>
                  🖨️ Print Report
                </button>
              </div>
              <div ref={reportRef}>
                <BAReportFormatted
                  data={reportData}
                  fromDate={form.fromDate}
                  toDate={form.toDate}
                />
              </div>
            </div>
          )}

          {!loading && showGridReport && (
            <div className="ba-table-wrapper">
              <table className="ba-table">
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
              <p className="ba-record-count">Total Records: {reportData.length}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default BranchAdjustment;