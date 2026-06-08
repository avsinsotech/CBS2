

// // import { useState } from "react";
// // import "./ReciptPaymentReport.css";

// // const API_BASE_URL = "http://localhost:5000";

// // function toISO(raw) {
// //   const parts = raw.trim().split("/");
// //   if (parts.length !== 3) return null;
// //   let [d, m, y] = parts;
// //   if (y.length === 2) y = "20" + y;
// //   return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
// // }

// // function isValidDate(raw) {
// //   const parts = raw.trim().split("/");
// //   if (parts.length !== 3) return false;
// //   const [d, m] = parts.map(Number);
// //   return d >= 1 && d <= 31 && m >= 1 && m <= 12;
// // }

// // function ReciptPaymentReport() {
// //   const [form, setForm] = useState({
// //     branchCode: "1",
// //     fromDate: "01/04/2025",
// //     toDate: "30/03/2026",
// //   });

// //   const [reportData, setReportData] = useState([]);
// //   const [columns,    setColumns]    = useState([]);
// //   const [loading,    setLoading]    = useState(false);
// //   const [error,      setError]      = useState("");
// //   const [fetched,    setFetched]    = useState(false);

// //   const handleChange = (e) => {
// //     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
// //     setFetched(false);
// //     setError("");
// //   };

// //   const validate = () => {
// //     if (!form.branchCode.trim())     return "Branch Code is required.";
// //     if (!isValidDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
// //     if (!isValidDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
// //     return null;
// //   };

// //   const fetchData = async () => {
// //     const err = validate();
// //     if (err) { setError(err); return null; }

// //     const PFDT = toISO(form.fromDate);
// //     const PTDT = toISO(form.toDate);

// //     const params = new URLSearchParams({
// //       BRCD: form.branchCode.trim(),
// //       PFDT,
// //       PTDT,
// //     });

// //     const url = `${API_BASE_URL}/api/receipt-payment/report?${params}`;

// //     setLoading(true);
// //     setError("");
// //     setFetched(false);

// //     try {
// //       const res = await fetch(url);
// //       if (!res.ok) {
// //         const body = await res.json().catch(() => ({}));
// //         throw new Error(body.error || `Server error: ${res.status}`);
// //       }
// //       const data = await res.json();
// //       setColumns(data.length > 0 ? Object.keys(data[0]) : []);
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

// //   const handlePrint = async () => {
// //     const data = fetched ? reportData : await fetchData();
// //     if (data && data.length > 0) setTimeout(() => window.print(), 400);
// //   };

// //   return (
// //     <div className="rpr-wrapper">
// //       <div className="rpr-card no-print">
// //         <div className="rpr-header">Receipt &amp; Payment Report</div>

// //         <div className="rpr-form-section">

// //           {/* Branch Code */}
// //           <div className="rpr-row">
// //             <label className="rpr-label">Branch Code</label>
// //             <input className="rpr-input rpr-input-shaded" name="branchCode"
// //               value={form.branchCode} onChange={handleChange} />
// //           </div>

// //           {/* From / To Date */}
// //           <div className="rpr-row">
// //             <label className="rpr-label">From Date</label>
// //             <input className="rpr-input" name="fromDate"
// //               value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
// //             <label className="rpr-inline-label">To Date</label>
// //             <input className="rpr-input" name="toDate"
// //               value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
// //           </div>

// //           {/* Error */}
// //           {error && <p className="rpr-error">{error}</p>}

// //           {/* Loading bar */}
// //           {loading && (
// //             <div className="rpr-loading-bar">
// //               <div className="rpr-loading-fill" />
// //             </div>
// //           )}

// //         </div>

// //         {/* Footer */}
// //         <div className="rpr-footer">
// //           <button className="rpr-btn" onClick={fetchData} disabled={loading}>
// //             {loading ? "Loading…" : "View Report"}
// //           </button>
// //           <button className="rpr-btn rpr-btn-print" onClick={handlePrint} disabled={loading}>
// //             Print Report
// //           </button>
// //         </div>
// //       </div>

// //       {/* Results table */}
// //       {fetched && reportData.length > 0 && (
// //         <div className="rpr-table-wrapper">
// //           <div className="print-only rpr-print-header">
// //             <h2>Receipt &amp; Payment Report</h2>
// //             <p>
// //               Branch: {form.branchCode} &nbsp;|&nbsp;
// //               From: {form.fromDate} &nbsp;|&nbsp;
// //               To: {form.toDate} &nbsp;|&nbsp;
// //               Date Printed: {new Date().toLocaleDateString()}
// //             </p>
// //           </div>

// //           <table className="rpr-table">
// //             <thead>
// //               <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
// //             </thead>
// //             <tbody>
// //               {reportData.map((row, i) => (
// //                 <tr key={i}>
// //                   {columns.map((col) => <td key={col}>{row[col] ?? ""}</td>)}
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>

// //           <p className="rpr-record-count no-print">Total Records: {reportData.length}</p>
// //         </div>
// //       )}

// //       {fetched && reportData.length === 0 && !loading && (
// //         <p className="rpr-error no-print" style={{ margin: "16px" }}>
// //           No records found for the given criteria.
// //         </p>
// //       )}
// //     </div>
// //   );
// // }

// // export default ReciptPaymentReport;

// import { useState, useRef } from "react";
// import "./ReciptPaymentReport.css";

// // const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";
// const API_BASE_URL = "http://localhost:5000";
// function toISO(raw) {
//   const parts = raw.trim().split("/");
//   if (parts.length !== 3) return null;
//   let [d, m, y] = parts;
//   if (y.length === 2) y = "20" + y;
//   return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
// }

// function isValidDate(raw) {
//   const parts = raw.trim().split("/");
//   if (parts.length !== 3) return false;
//   const [d, m] = parts.map(Number);
//   return d >= 1 && d <= 31 && m >= 1 && m <= 12;
// }

// // ── Number formatter ──────────────────────────────────────────────────────────
// const fmt = (v) => {
//   const n = parseFloat(v);
//   if (isNaN(n) || v === null || v === undefined || v === "") return "";
//   return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// };

// // ── Formatted Report Component (matches the picture) ─────────────────────────
// function RPRReportFormatted({ data, fromDate, toDate }) {
//   const printDate = new Date().toLocaleDateString("en-GB");

//   // Detect column names from first row
//   const keys = data.length > 0 ? Object.keys(data[0]) : [];
//   const productCol     = keys.find(k => /^product$|^prod$|^subgl|^glcode/i.test(k)) || keys[0] || "";
//   const productNameCol = keys.find(k => /name|glname|prodname|description/i.test(k)) || keys[1] || "";
//   const crBalCol       = keys.find(k => /cr.*bal|credit.*bal|crbal|crbalance/i.test(k)) || keys[2] || "";
//   const drBalCol       = keys.find(k => /dr.*bal|debit.*bal|drbal|drbalance/i.test(k)) || keys[3] || "";

//   return (
//     <div className="rpr-formatted-report">

//       {/* ── Meta Header ── */}
//       <div className="rpr-fmt-meta-grid">
//         <div className="rpr-fmt-meta-left">
//           <div className="rpr-fmt-meta-row">
//             <span className="rpr-fmt-meta-key">Name</span>
//             <span className="rpr-fmt-meta-sep">:</span>
//             <span className="rpr-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
//           </div>
//           <div className="rpr-fmt-meta-row">
//             <span className="rpr-fmt-meta-key">Branch Name</span>
//             <span className="rpr-fmt-meta-sep">:</span>
//             <span className="rpr-fmt-meta-val">HEAD OFFICE</span>
//           </div>
//         </div>
//         <div className="rpr-fmt-meta-right">
//           <div className="rpr-fmt-meta-row">
//             <span className="rpr-fmt-meta-key">Print Date</span>
//             <span className="rpr-fmt-meta-sep">:</span>
//             <span className="rpr-fmt-meta-val">{printDate}</span>
//           </div>
//           <div className="rpr-fmt-meta-row">
//             <span className="rpr-fmt-meta-key">Print UserID</span>
//             <span className="rpr-fmt-meta-sep">:</span>
//             <span className="rpr-fmt-meta-val">Rohini</span>
//           </div>
//         </div>
//       </div>

//       {/* ── Report Table ── */}
//       <table className="rpr-fmt-table">
//         <thead>
//           {/* Title row */}
//           <tr>
//             <th colSpan="5" className="rpr-fmt-title-row">
//               Recipt &amp; Payment From {fromDate} To {toDate}
//             </th>
//           </tr>
//           {/* Column headers */}
//           <tr className="rpr-fmt-col-head-row">
//             <th className="rpr-fmt-th rpr-fmt-col-srno">Sr No</th>
//             <th className="rpr-fmt-th rpr-fmt-col-product">Product</th>
//             <th className="rpr-fmt-th rpr-fmt-col-prodname">Product Name</th>
//             <th className="rpr-fmt-th rpr-fmt-col-bal">Cr Balance</th>
//             <th className="rpr-fmt-th rpr-fmt-col-bal">Dr Balance</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* Empty shaded row like in the picture */}
//           <tr className="rpr-fmt-row-shaded">
//             <td colSpan="5" className="rpr-fmt-td rpr-fmt-spacer-row">&nbsp;</td>
//           </tr>
//           {data.map((row, index) => (
//             <tr key={index} className={index % 2 === 0 ? "" : "rpr-fmt-row-alt"}>
//               <td className="rpr-fmt-td rpr-fmt-col-srno">{index + 1}</td>
//               <td className="rpr-fmt-td rpr-fmt-col-product">{row[productCol] ?? ""}</td>
//               <td className="rpr-fmt-td rpr-fmt-col-prodname">{row[productNameCol] ?? ""}</td>
//               <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num">{fmt(row[crBalCol])}</td>
//               <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num">{fmt(row[drBalCol])}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // ── Main Component ────────────────────────────────────────────────────────────
// function ReciptPaymentReport() {
//   const [form, setForm] = useState({
//     branchCode: "1",
//     fromDate: "01/04/2025",
//     toDate: "30/03/2026",
//   });

//   const [reportData, setReportData] = useState([]);
//   const [columns,    setColumns]    = useState([]);
//   const [loading,    setLoading]    = useState(false);
//   const [error,      setError]      = useState("");
//   const [fetched,    setFetched]    = useState(false);
//   const [activeButton, setActiveButton] = useState("");
//   const reportRef = useRef(null);

//   const handleChange = (e) => {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//     setFetched(false);
//     setError("");
//   };

//   const validate = () => {
//     if (!form.branchCode.trim())     return "Branch Code is required.";
//     if (!isValidDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
//     if (!isValidDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
//     return null;
//   };

//   const fetchData = async () => {
//     const err = validate();
//     if (err) { setError(err); return null; }

//     const params = new URLSearchParams({
//       BRCD: form.branchCode.trim(),
//       PFDT: toISO(form.fromDate),
//       PTDT: toISO(form.toDate),
//     });

//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/receipt-payment/report?${params}`);
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

//   // ── View Report (grid) ────────────────────────────────────────────────────
//   const handleViewReport = async () => {
//     setActiveButton("view");
//     await fetchData();
//   };

//   // ── Print Report (formatted) ──────────────────────────────────────────────
//   const handlePrintReport = async () => {
//     setActiveButton("print");
//     const data = fetched ? reportData : await fetchData();
//     if (!data || data.length === 0) return;
//   };

//   // ── Open print window ─────────────────────────────────────────────────────
//   const handlePrintWindow = () => {
//     if (!reportRef.current) return;
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Recipt &amp; Payment Report</title>
//           <style>
//             @page { size: A4 portrait; margin: 10mm; }
//             body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; margin: 0; }
//             .rpr-formatted-report { padding: 0; }
//             .rpr-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 8px; }
//             .rpr-fmt-meta-left, .rpr-fmt-meta-right { display: flex; flex-direction: column; gap: 4px; }
//             .rpr-fmt-meta-row { display: flex; gap: 6px; font-size: 9px; }
//             .rpr-fmt-meta-key { font-weight: 600; min-width: 80px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 4px; }
//             th, td { border: 1px solid #999; padding: 3px 6px; text-align: left; font-size: 9px; }
//             .rpr-fmt-title-row { text-align: center; font-weight: 700; background: #fff; font-size: 11px; padding: 6px; }
//             .rpr-fmt-col-head-row th { background: #fff; font-weight: 700; }
//             .rpr-fmt-num { text-align: right; }
//             .rpr-fmt-col-srno    { width: 6%; text-align: center; }
//             .rpr-fmt-col-product { width: 10%; }
//             .rpr-fmt-col-prodname { width: 54%; }
//             .rpr-fmt-col-bal     { width: 15%; text-align: right; }
//             .rpr-fmt-row-alt { background: #f9f9f9; }
//             .rpr-fmt-spacer-row { background: #d0d8e8; height: 12px; }
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
//     <div className="rpr-wrapper">

//       {/* ── Card ── */}
//       <div className="rpr-card">
//         <div className="rpr-header">Receipt &amp; Payment Report</div>

//         <div className="rpr-form-section">

//           {/* Branch Code */}
//           <div className="rpr-row">
//             <label className="rpr-label">Branch Code</label>
//             <input className="rpr-input rpr-input-shaded" name="branchCode"
//               value={form.branchCode} onChange={handleChange} />
//           </div>

//           {/* From / To Date */}
//           <div className="rpr-row">
//             <label className="rpr-label">From Date</label>
//             <input className="rpr-input" name="fromDate"
//               value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
//             <label className="rpr-inline-label">To Date</label>
//             <input className="rpr-input" name="toDate"
//               value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
//           </div>

//           {/* Error */}
//           {error && <p className="rpr-error">{error}</p>}

//           {/* Loading bar */}
//           {loading && (
//             <div className="rpr-loading-bar">
//               <div className="rpr-loading-fill" />
//             </div>
//           )}

//         </div>

//         {/* ── Footer Buttons ── */}
//         <div className="rpr-footer">
//           <button className="rpr-btn" onClick={handleViewReport} disabled={loading}>
//             {loading && activeButton === "view" ? "Loading…" : "View Report"}
//           </button>
//           <button className="rpr-btn rpr-btn-print" onClick={handlePrintReport} disabled={loading}>
//             {loading && activeButton === "print" ? "Loading…" : "Print Report"}
//           </button>
//         </div>

//         {/* ── Preview Panel ── */}
//         <div className="rpr-preview">
//           {loading && <span className="rpr-preview-empty">Loading...</span>}

//           {!loading && !fetched && (
//             <span className="rpr-preview-empty">Preview area</span>
//           )}

//           {!loading && fetched && reportData.length === 0 && (
//             <span className="rpr-preview-empty">No records found for the given criteria.</span>
//           )}

//           {/* Formatted Report (Print Report button) */}
//           {!loading && showFormattedReport && (
//             <div className="rpr-report-wrapper">
//               <div className="rpr-report-toolbar">
//                 <button className="rpr-btn rpr-btn-sm" onClick={handlePrintWindow}>
//                   🖨️ Print Report
//                 </button>
//               </div>
//               <div ref={reportRef}>
//                 <RPRReportFormatted
//                   data={reportData}
//                   fromDate={form.fromDate}
//                   toDate={form.toDate}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Grid View (View Report button) */}
//           {!loading && showGridReport && (
//             <div className="rpr-table-wrapper">
//               <table className="rpr-table">
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
//               <p className="rpr-record-count">Total Records: {reportData.length}</p>
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default ReciptPaymentReport;


import { useState, useRef } from "react";
import "./ReciptPaymentReport.css";

const API_BASE_URL = "http://localhost:5000";

function toISO(raw) {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function isValidDate(raw) {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return false;
  const [d, m] = parts.map(Number);
  return d >= 1 && d <= 31 && m >= 1 && m <= 12;
}

// ── Number formatter ──────────────────────────────────────────────────────────
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n) || v === null || v === undefined || v === "") return "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ── Build grouped structure from flat rows ────────────────────────────────────
// Returns: [ { plGrp, glGroups: [ { glGrp, rows: [...] } ] } ]
function buildGroups(data) {
  const plMap = new Map();   // PLGrp → Map(GLGrp → rows[])

  data.forEach((row) => {
    const pl = row.PLGrp || "—";
    const gl = row.GLGrp || "—";

    if (!plMap.has(pl)) plMap.set(pl, new Map());
    const glMap = plMap.get(pl);

    if (!glMap.has(gl)) glMap.set(gl, []);
    glMap.get(gl).push(row);
  });

  return Array.from(plMap.entries()).map(([plGrp, glMap]) => ({
    plGrp,
    glGroups: Array.from(glMap.entries()).map(([glGrp, rows]) => ({ glGrp, rows })),
  }));
}

// ── Formatted Report Component ────────────────────────────────────────────────
function RPRReportFormatted({ data, fromDate, toDate }) {
  const printDate = new Date().toLocaleDateString("en-GB");
  const groups    = buildGroups(data);

  // grand totals
  const grandCr = data.reduce((s, r) => s + (parseFloat(r.CREDIT) || 0), 0);
  const grandDr = data.reduce((s, r) => s + (parseFloat(r.DEBIT)  || 0), 0);

  let srNo = 0;

  return (
    <div className="rpr-formatted-report">

      {/* ── Meta Header ── */}
      <div className="rpr-fmt-meta-grid">
        <div className="rpr-fmt-meta-left">
          <div className="rpr-fmt-meta-row">
            <span className="rpr-fmt-meta-key">Name</span>
            <span className="rpr-fmt-meta-sep">:</span>
            <span className="rpr-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
          </div>
          <div className="rpr-fmt-meta-row">
            <span className="rpr-fmt-meta-key">Branch Name</span>
            <span className="rpr-fmt-meta-sep">:</span>
            <span className="rpr-fmt-meta-val">HEAD OFFICE</span>
          </div>
        </div>
        <div className="rpr-fmt-meta-right">
          <div className="rpr-fmt-meta-row">
            <span className="rpr-fmt-meta-key">Print Date</span>
            <span className="rpr-fmt-meta-sep">:</span>
            <span className="rpr-fmt-meta-val">{printDate}</span>
          </div>
          <div className="rpr-fmt-meta-row">
            <span className="rpr-fmt-meta-key">Print UserID</span>
            <span className="rpr-fmt-meta-sep">:</span>
            <span className="rpr-fmt-meta-val">Rohini</span>
          </div>
        </div>
      </div>

      {/* ── Report Table ── */}
      <table className="rpr-fmt-table">
        <thead>
          <tr>
            <th colSpan="5" className="rpr-fmt-title-row">
              Recipt &amp; Payment From {fromDate} To {toDate}
            </th>
          </tr>
          <tr className="rpr-fmt-col-head-row">
            <th className="rpr-fmt-th rpr-fmt-col-srno">Sr No</th>
            <th className="rpr-fmt-th rpr-fmt-col-product">Product</th>
            <th className="rpr-fmt-th rpr-fmt-col-prodname">Product Name</th>
            <th className="rpr-fmt-th rpr-fmt-col-bal">Cr Balance</th>
            <th className="rpr-fmt-th rpr-fmt-col-bal">Dr Balance</th>
          </tr>
        </thead>

        <tbody>
          {groups.map(({ plGrp, glGroups }) => {
            // PL group totals
            const plCr = glGroups.reduce((s, g) => s + g.rows.reduce((a, r) => a + (parseFloat(r.CREDIT) || 0), 0), 0);
            const plDr = glGroups.reduce((s, g) => s + g.rows.reduce((a, r) => a + (parseFloat(r.DEBIT)  || 0), 0), 0);

            return (
              <>
                {/* ── PLGrp header row (blue band, like "Administration Expenses 2") ── */}
                <tr key={`pl-${plGrp}`} className="rpr-fmt-row-plgrp">
                  <td colSpan="5" className="rpr-fmt-td rpr-fmt-plgrp-cell">{plGrp}</td>
                </tr>

                {glGroups.map(({ glGrp, rows }) => {
                  const glCr = rows.reduce((s, r) => s + (parseFloat(r.CREDIT) || 0), 0);
                  const glDr = rows.reduce((s, r) => s + (parseFloat(r.DEBIT)  || 0), 0);

                  return (
                    <>
                      {/* ── GLGrp header (bold, like "DEPOSITS", "LOANS") ── */}
                      <tr key={`gl-${glGrp}`} className="rpr-fmt-row-glgrp">
                        <td colSpan="5" className="rpr-fmt-td rpr-fmt-glgrp-cell">{glGrp}</td>
                      </tr>

                      {/* ── Spacer row (blue-grey shaded, like in screenshot) ── */}
                      <tr className="rpr-fmt-row-shaded">
                        <td colSpan="5" className="rpr-fmt-td rpr-fmt-spacer-row">&nbsp;</td>
                      </tr>

                      {/* ── Data rows ── */}
                      {rows.map((row, idx) => {
                        srNo += 1;
                        return (
                          <tr key={`row-${srNo}`} className={idx % 2 === 0 ? "" : "rpr-fmt-row-alt"}>
                            <td className="rpr-fmt-td rpr-fmt-col-srno">{srNo}</td>
                            <td className="rpr-fmt-td rpr-fmt-col-product">{row.SUBGLCODE ?? ""}</td>
                            <td className="rpr-fmt-td rpr-fmt-col-prodname">{row.Glname ?? ""}</td>
                            <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num">{fmt(row.CREDIT)}</td>
                            <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num">{fmt(row.DEBIT)}</td>
                          </tr>
                        );
                      })}

                      {/* ── Group Wise Total ── */}
                      <tr className="rpr-fmt-row-gwtotal">
                        <td colSpan="3" className="rpr-fmt-td rpr-fmt-total-label">Group Wise Total :</td>
                        <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num rpr-fmt-total-val">{fmt(glCr)}</td>
                        <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num rpr-fmt-total-val">{fmt(glDr)}</td>
                      </tr>
                    </>
                  );
                })}

                {/* ── Group Total (PLGrp total) ── */}
                <tr className="rpr-fmt-row-grouptotal">
                  <td colSpan="3" className="rpr-fmt-td rpr-fmt-total-label">Group Total :</td>
                  <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num rpr-fmt-total-val">{fmt(plCr)}</td>
                  <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num rpr-fmt-total-val">{fmt(plDr)}</td>
                </tr>
              </>
            );
          })}

          {/* ── Grand Total ── */}
          <tr className="rpr-fmt-row-grandtotal">
            <td colSpan="3" className="rpr-fmt-td rpr-fmt-total-label">Total :</td>
            <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num rpr-fmt-total-val">{fmt(grandCr)}</td>
            <td className="rpr-fmt-td rpr-fmt-col-bal rpr-fmt-num rpr-fmt-total-val">{fmt(grandDr)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function ReciptPaymentReport() {
  const [form, setForm] = useState({
    branchCode: "1",
    fromDate: "01/04/2025",
    toDate: "30/03/2026",
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

  const validate = () => {
    if (!form.branchCode.trim())     return "Branch Code is required.";
    if (!isValidDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
    if (!isValidDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
    return null;
  };

  const fetchData = async () => {
    const err = validate();
    if (err) { setError(err); return null; }

    const params = new URLSearchParams({
      BRCD: form.branchCode.trim(),
      PFDT: toISO(form.fromDate),
      PTDT: toISO(form.toDate),
    });

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/receipt-payment/report?${params}`);
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

  const handleViewReport = async () => {
    setActiveButton("view");
    await fetchData();
  };

  const handlePrintReport = async () => {
    setActiveButton("print");
    const data = fetched ? reportData : await fetchData();
    if (!data || data.length === 0) return;
  };

  const handlePrintWindow = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Recipt &amp; Payment Report</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 8px; margin: 0; }
            .rpr-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .rpr-fmt-meta-left, .rpr-fmt-meta-right { display: flex; flex-direction: column; gap: 4px; }
            .rpr-fmt-meta-row { display: flex; gap: 6px; font-size: 9px; }
            .rpr-fmt-meta-key { font-weight: 600; min-width: 80px; }
            table { width: 100%; border-collapse: collapse; margin-top: 4px; }
            th, td { border: 1px solid #999; padding: 2px 5px; text-align: left; font-size: 8px; }
            .rpr-fmt-title-row { text-align: center; font-weight: 700; background: #fff; font-size: 10px; padding: 5px; }
            .rpr-fmt-col-head-row th { background: #fff; font-weight: 700; }
            .rpr-fmt-num { text-align: right; }
            .rpr-fmt-col-srno    { width: 5%;  text-align: center; }
            .rpr-fmt-col-product { width: 8%; }
            .rpr-fmt-col-prodname { width: 52%; }
            .rpr-fmt-col-bal     { width: 17%; text-align: right; }
            .rpr-fmt-row-alt { background: #f9f9f9; }
            .rpr-fmt-spacer-row  { background: #d0d8e8; height: 8px; padding: 0; border: none; }
            .rpr-fmt-plgrp-cell  { background: #c8d8f0; font-weight: 700; font-size: 9px; padding: 3px 6px; border: none; }
            .rpr-fmt-glgrp-cell  { background: #ffffff; font-weight: 700; font-size: 9px; padding: 4px 6px; border: none; }
            .rpr-fmt-row-gwtotal td   { font-weight: 600; border-top: 1px solid #666; }
            .rpr-fmt-row-grouptotal td { font-weight: 700; border-top: 1.5px solid #333; background: #f0f0f0; }
            .rpr-fmt-row-grandtotal td { font-weight: 700; border-top: 2px solid #000; background: #e8edf3; font-size: 9px; }
            .rpr-fmt-total-label { text-align: right; }
            .rpr-fmt-total-val   { text-align: right; font-variant-numeric: tabular-nums; }
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
    <div className="rpr-wrapper">
      <div className="rpr-card">
        <div className="rpr-header">Receipt &amp; Payment Report</div>

        <div className="rpr-form-section">

          <div className="rpr-row">
            <label className="rpr-label">Branch Code</label>
            <input className="rpr-input rpr-input-shaded" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          <div className="rpr-row">
            <label className="rpr-label">From Date</label>
            <input className="rpr-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
            <label className="rpr-inline-label">To Date</label>
            <input className="rpr-input" name="toDate"
              value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
          </div>

          {error && <p className="rpr-error">{error}</p>}

          {loading && (
            <div className="rpr-loading-bar">
              <div className="rpr-loading-fill" />
            </div>
          )}
        </div>

        <div className="rpr-footer">
          <button className="rpr-btn" onClick={handleViewReport} disabled={loading}>
            {loading && activeButton === "view" ? "Loading…" : "View Report"}
          </button>
          <button className="rpr-btn rpr-btn-print" onClick={handlePrintReport} disabled={loading}>
            {loading && activeButton === "print" ? "Loading…" : "Print Report"}
          </button>
        </div>

        <div className="rpr-preview">
          {loading && <span className="rpr-preview-empty">Loading...</span>}

          {!loading && !fetched && (
            <span className="rpr-preview-empty">Preview area</span>
          )}

          {!loading && fetched && reportData.length === 0 && (
            <span className="rpr-preview-empty">No records found for the given criteria.</span>
          )}

          {!loading && showFormattedReport && (
            <div className="rpr-report-wrapper">
              <div className="rpr-report-toolbar">
                <button className="rpr-btn rpr-btn-sm" onClick={handlePrintWindow}>
                  🖨️ Print Report
                </button>
              </div>
              <div ref={reportRef}>
                <RPRReportFormatted
                  data={reportData}
                  fromDate={form.fromDate}
                  toDate={form.toDate}
                />
              </div>
            </div>
          )}

          {!loading && showGridReport && (
            <div className="rpr-table-wrapper">
              <table className="rpr-table">
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
              <p className="rpr-record-count">Total Records: {reportData.length}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ReciptPaymentReport;