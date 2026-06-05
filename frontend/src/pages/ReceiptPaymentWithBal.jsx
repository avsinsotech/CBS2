

// import { useState } from "react";
// import "./ReceiptPaymentWithBal.css";

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

// const ENDPOINT_MAP = {
//   "English":   "/api/rec-pay-balance/english",
//   "Marathi":   "/api/rec-pay-balance/marathi",
//   "Skip Data": "/api/rec-pay-balance/skip-data",
// };

// function ReceiptPaymentWithBal() {
//   const [form, setForm] = useState({
//     selectType: "Skip Data",
//     branchCode: "1",
//     fromDate:   "01/04/2025",
//     toDate:     "30/03/2026",
//   });

//   const [reportData, setReportData] = useState([]);
//   const [columns,    setColumns]    = useState([]);
//   const [loading,    setLoading]    = useState(false);
//   const [error,      setError]      = useState("");
//   const [fetched,    setFetched]    = useState(false);

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

//     const path = ENDPOINT_MAP[form.selectType];
//     const params = new URLSearchParams({
//       BRCD: form.branchCode.trim(),
//       PFDT: toISO(form.fromDate),
//       PTDT: toISO(form.toDate),
//     });

//     const url = `${API_BASE_URL}${path}?${params}`;

//     setLoading(true);
//     setError("");
//     setFetched(false);

//     try {
//       const res = await fetch(url);
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

//   const handlePrint = async () => {
//     const data = fetched ? reportData : await fetchData();
//     if (data && data.length > 0) setTimeout(() => window.print(), 400);
//   };

//   return (
//     <div className="rpb-wrapper">
//       <div className="rpb-card no-print">
//         <div className="rpb-header">Receipt &amp; Payment With Balance Report</div>

//         <div className="rpb-form-section">

//           {/* Select Type */}
//           <div className="rpb-row">
//             <label className="rpb-label">Select Type <span className="req">*</span></label>
//             <div className="rpb-radio-group">
//               {["English", "Marathi", "Skip Data"].map((opt) => (
//                 <label key={opt} className="rpb-radio-label">
//                   <input type="radio" name="selectType" value={opt}
//                     checked={form.selectType === opt} onChange={handleChange} />
//                   {opt}
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Branch Code */}
//           <div className="rpb-row">
//             <label className="rpb-label">Branch Code</label>
//             <input className="rpb-input rpb-input-shaded" name="branchCode"
//               value={form.branchCode} onChange={handleChange} />
//           </div>

//           {/* From / To Date */}
//           <div className="rpb-row">
//             <label className="rpb-label">From Date</label>
//             <input className="rpb-input" name="fromDate"
//               value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
//             <label className="rpb-inline-label">To Date</label>
//             <input className="rpb-input" name="toDate"
//               value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
//           </div>

//           {/* Error */}
//           {error && <p className="rpb-error">{error}</p>}

//           {/* Loading bar */}
//           {loading && (
//             <div className="rpb-loading-bar">
//               <div className="rpb-loading-fill" />
//             </div>
//           )}

//         </div>

//         {/* Footer */}
//         <div className="rpb-footer">
//           <button className="rpb-btn" onClick={fetchData} disabled={loading}>
//             {loading ? "Loading…" : "View Report"}
//           </button>
//           <button className="rpb-btn rpb-btn-print" onClick={handlePrint} disabled={loading}>
//             Print Report
//           </button>
//         </div>
//       </div>

//       {/* Results table */}
//       {fetched && reportData.length > 0 && (
//         <div className="rpb-table-wrapper">
//           <div className="print-only rpb-print-header">
//             <h2>Receipt &amp; Payment With Balance Report</h2>
//             <p>
//               Type: {form.selectType} &nbsp;|&nbsp;
//               Branch: {form.branchCode} &nbsp;|&nbsp;
//               From: {form.fromDate} &nbsp;|&nbsp;
//               To: {form.toDate} &nbsp;|&nbsp;
//               Date Printed: {new Date().toLocaleDateString()}
//             </p>
//           </div>

//           <table className="rpb-table">
//             <thead>
//               <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
//             </thead>
//             <tbody>
//               {reportData.map((row, i) => (
//                 <tr key={i}>
//                   {columns.map((col) => <td key={col}>{row[col] ?? ""}</td>)}
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <p className="rpb-record-count no-print">Total Records: {reportData.length}</p>
//         </div>
//       )}

//       {fetched && reportData.length === 0 && !loading && (
//         <p className="rpb-error no-print" style={{ margin: "16px" }}>
//           No records found for the given criteria.
//         </p>
//       )}
//     </div>
//   );
// }

// export default ReceiptPaymentWithBal;

import { useState, useRef } from "react";
import "./ReceiptPaymentWithBal.css";

// const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
function toISO(raw) {
  if (!raw) return null;
  if (raw.includes("-")) return raw; // already ISO format
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function isValidDate(raw) {
  if (!raw) return false;
  if (raw.includes("-")) return true; // browser date input
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return false;
  const [d, m] = parts.map(Number);
  return d >= 1 && d <= 31 && m >= 1 && m <= 12;
}

const ENDPOINT_MAP = {
  "English":   "/api/rec-pay-balance/english",
  "Marathi":   "/api/rec-pay-balance/marathi",
  "Skip Data": "/api/rec-pay-balance/skip-data",
};

// ── Number formatter ──────────────────────────────────────────────────────────
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n) || v === null || v === undefined || v === "") return "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ── Formatted Report Component (matches the picture exactly) ─────────────────
function RPBReportFormatted({ data, fromDate, toDate }) {
  const printDate = new Date().toLocaleDateString("en-GB");

  // Detect column names from first row
  const keys = data.length > 0 ? Object.keys(data[0]) : [];

  // Try to detect Receipt vs Payment columns from data shape
  // Common patterns from SP: REC_GLNAME / PAY_GLNAME or GLNAME + CREDIT/DEBIT
  // We'll render dynamically but map to the 8-column layout shown in picture:
  // Receipt: SrNo | GL Name | Credit Amt | Balance
  // Payment: GL Name | Debit Amt | Balance | DrCr

  // Detect key names (handle different SP naming conventions)
  const recGlName   = keys.find(k => /rec.*gl|gl.*rec|r_gl|rglname/i.test(k)) || keys[0] || "";
  const recCredit   = keys.find(k => /credit/i.test(k)) || "";
  const recBalance  = keys.find(k => /rec.*bal|r_bal|rbalance/i.test(k)) || keys.find(k => /balance/i.test(k)) || "";
  const payGlName   = keys.find(k => /pay.*gl|gl.*pay|p_gl|pglname/i.test(k)) || "";
  const payDebit    = keys.find(k => /debit/i.test(k)) || "";
  const payBalance  = keys.find(k => /pay.*bal|p_bal|pbalance/i.test(k)) || (recBalance !== keys.find(k => /balance/i.test(k)) ? keys.find(k => /balance/i.test(k)) : "");
  const drCr        = keys.find(k => /drcr|dr_cr|drorcr/i.test(k)) || "";

  // Fallback: if SP returns all columns in one row (horizontal layout like PL report)
  // Map positionally if named detection fails
  const hasRecPay = recGlName && payGlName;

  return (
    <div className="rpb-formatted-report">

      {/* ── Meta Header ── */}
      <div className="rpb-fmt-meta-grid">
        <div className="rpb-fmt-meta-left">
          <div className="rpb-fmt-meta-row">
            <span className="rpb-fmt-meta-key">Name</span>
            <span className="rpb-fmt-meta-sep">:</span>
            <span className="rpb-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
          </div>
          <div className="rpb-fmt-meta-row">
            <span className="rpb-fmt-meta-key">Branch Name</span>
            <span className="rpb-fmt-meta-sep">:</span>
            <span className="rpb-fmt-meta-val">HEAD OFFICE</span>
          </div>
        </div>
        <div className="rpb-fmt-meta-right">
          <div className="rpb-fmt-meta-row">
            <span className="rpb-fmt-meta-key">Print Date</span>
            <span className="rpb-fmt-meta-sep">:</span>
            <span className="rpb-fmt-meta-val">{printDate}</span>
          </div>
          <div className="rpb-fmt-meta-row">
            <span className="rpb-fmt-meta-key">Print UserID</span>
            <span className="rpb-fmt-meta-sep">:</span>
            <span className="rpb-fmt-meta-val">Rohini</span>
          </div>
        </div>
      </div>

      {/* ── Report Table ── */}
      <table className="rpb-fmt-table">
        <thead>
          {/* Title row */}
          <tr>
            <th colSpan="8" className="rpb-fmt-title-row">
              Receipt &amp; Payment With Balance {fromDate} And {toDate}
            </th>
          </tr>
          {/* Section headers */}
          <tr>
            <th colSpan="4" className="rpb-fmt-section-head rpb-fmt-section-receipt">Receipt</th>
            <th colSpan="4" className="rpb-fmt-section-head rpb-fmt-section-payment">Payment</th>
          </tr>
          {/* Column headers */}
          <tr className="rpb-fmt-col-head-row">
            <th className="rpb-fmt-th rpb-fmt-col-srno">Sr No</th>
            <th className="rpb-fmt-th rpb-fmt-col-glname">GL Name</th>
            <th className="rpb-fmt-th rpb-fmt-col-amt">Credit Amt</th>
            <th className="rpb-fmt-th rpb-fmt-col-bal">Balance</th>
            <th className="rpb-fmt-th rpb-fmt-col-glname">GL Name</th>
            <th className="rpb-fmt-th rpb-fmt-col-amt">Debit Amt</th>
            <th className="rpb-fmt-th rpb-fmt-col-bal">Balance</th>
            <th className="rpb-fmt-th rpb-fmt-col-drcr">DrCr</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "" : "rpb-fmt-row-alt"}>
              <td className="rpb-fmt-td rpb-fmt-col-srno">{index + 1}</td>
              {/* Receipt side */}
              <td className="rpb-fmt-td rpb-fmt-col-glname">
                {hasRecPay ? row[recGlName] : row[keys[0]] ?? ""}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-amt rpb-fmt-num">
                {fmt(hasRecPay ? row[recCredit] : row[keys[1]])}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-bal rpb-fmt-num">
                {fmt(hasRecPay ? row[recBalance] : row[keys[2]])}
              </td>
              {/* Payment side */}
              <td className="rpb-fmt-td rpb-fmt-col-glname">
                {hasRecPay ? row[payGlName] : row[keys[3]] ?? ""}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-amt rpb-fmt-num">
                {fmt(hasRecPay ? row[payDebit] : row[keys[4]])}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-bal rpb-fmt-num">
                {fmt(hasRecPay ? row[payBalance] : row[keys[5]])}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-drcr">
                {hasRecPay ? row[drCr] : row[keys[6]] ?? ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function ReceiptPaymentWithBal() {
  const [form, setForm] = useState({
    selectType: "Skip Data",
    branchCode: "1",
    fromDate:   "2025-04-01",
    toDate:     "2026-03-30",
  });

  const [reportData, setReportData] = useState([]);
  const [columns,    setColumns]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [fetched,    setFetched]    = useState(false);
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

    const path = ENDPOINT_MAP[form.selectType];
    const params = new URLSearchParams({
      BRCD: form.branchCode.trim(),
      PFDT: toISO(form.fromDate),
      PTDT: toISO(form.toDate),
    });

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}${path}?${params}`);
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

  // ── View Report (grid) ────────────────────────────────────────────────────
  const handleViewReport = async () => {
    setActiveButton("view");
    await fetchData();
  };

  // ── Print Report (formatted) ──────────────────────────────────────────────
  const handlePrintReport = async () => {
    setActiveButton("print");
    const data = fetched ? reportData : await fetchData();
    if (!data || data.length === 0) return;
  };

  // ── Open print window ─────────────────────────────────────────────────────
  const handlePrintWindow = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt &amp; Payment With Balance Report</title>
          <style>
            @page { size: landscape; margin: 8mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; margin: 0; }
            .rpb-formatted-report { padding: 0; }
            .rpb-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .rpb-fmt-meta-left, .rpb-fmt-meta-right { display: flex; flex-direction: column; gap: 3px; }
            .rpb-fmt-meta-row { display: flex; gap: 6px; font-size: 9px; }
            .rpb-fmt-meta-key { font-weight: 600; min-width: 80px; }
            table { width: 100%; border-collapse: collapse; margin-top: 6px; }
            th, td { border: 1px solid #999; padding: 3px 6px; text-align: left; font-size: 8px; }
            .rpb-fmt-title-row { text-align: center; font-weight: 700; background: #fff; font-size: 10px; }
            .rpb-fmt-section-receipt { text-align: center; color: #c00000; font-weight: 700; background: #f0f0f0; }
            .rpb-fmt-section-payment { text-align: center; color: #c00000; font-weight: 700; background: #f0f0f0; }
            .rpb-fmt-col-head-row th { background: #fff; font-weight: 700; }
            .rpb-fmt-num { text-align: right; }
            .rpb-fmt-col-srno { width: 4%; text-align: center; }
            .rpb-fmt-col-glname { width: 22%; }
            .rpb-fmt-col-amt { width: 10%; text-align: right; }
            .rpb-fmt-col-bal { width: 10%; text-align: right; }
            .rpb-fmt-col-drcr { width: 4%; text-align: center; }
            .rpb-fmt-row-alt { background: #f9f9f9; }
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
    <div className="rpb-wrapper">

      {/* ── Card ── */}
      <div className="rpb-card">
        <div className="rpb-header">Receipt &amp; Payment With Balance Report</div>

        <div className="rpb-form-section">

          {/* Select Type */}
          <div className="rpb-row">
            <label className="rpb-label">Select Type <span className="req">*</span></label>
            <div className="rpb-radio-group">
              {["English", "Marathi", "Skip Data"].map((opt) => (
                <label key={opt} className="rpb-radio-label">
                  <input type="radio" name="selectType" value={opt}
                    checked={form.selectType === opt} onChange={handleChange} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Branch Code */}
          <div className="rpb-row">
            <label className="rpb-label">Branch Code</label>
            <input className="rpb-input rpb-input-shaded" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* From / To Date */}
          <div className="rpb-row">
            <label className="rpb-label">From Date</label>
            <input type="date" className="rpb-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} />
            <label className="rpb-inline-label">To Date</label>
            <input type="date" className="rpb-input" name="toDate"
              value={form.toDate} onChange={handleChange} />
          </div>

          {/* Error */}
          {error && <p className="rpb-error">{error}</p>}

          {/* Loading bar */}
          {loading && (
            <div className="rpb-loading-bar">
              <div className="rpb-loading-fill" />
            </div>
          )}

        </div>

        {/* ── Footer Buttons ── */}
        <div className="rpb-footer">
          <button className="rpb-btn" onClick={handleViewReport} disabled={loading}>
            {loading && activeButton === "view" ? "Loading…" : "View Report"}
          </button>
          <button className="rpb-btn rpb-btn-print" onClick={handlePrintReport} disabled={loading}>
            {loading && activeButton === "print" ? "Loading…" : "Print Report"}
          </button>
        </div>

        {/* ── Preview Panel ── */}
        <div className="rpb-preview">
          {loading && <span className="rpb-preview-empty">Loading...</span>}

          {!loading && !fetched && (
            <span className="rpb-preview-empty">Preview area</span>
          )}

          {!loading && fetched && reportData.length === 0 && (
            <span className="rpb-preview-empty">No records found for the given criteria.</span>
          )}

          {/* Formatted Report (Print Report button) */}
          {!loading && showFormattedReport && (
            <div className="rpb-report-wrapper">
              <div className="rpb-report-toolbar">
                <button className="rpb-btn rpb-btn-sm" onClick={handlePrintWindow}>
                  🖨️ Print Report
                </button>
              </div>
              <div ref={reportRef}>
                <RPBReportFormatted
                  data={reportData}
                  fromDate={form.fromDate}
                  toDate={form.toDate}
                />
              </div>
            </div>
          )}

          {/* Grid View (View Report button) */}
          {!loading && showGridReport && (
            <div className="rpb-table-wrapper">
              <table className="rpb-table">
                <thead>
                  <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => <td key={col}>{typeof row[col] === 'number' ? fmt(row[col]) : (row[col] ?? "")}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="rpb-record-count">Total Records: {reportData.length}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ReceiptPaymentWithBal;