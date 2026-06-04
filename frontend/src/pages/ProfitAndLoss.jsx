// // import { useState } from "react";
// // import "./ProfitAndLoss.css";

// // function ProfitAndLoss() {
// //   const [form, setForm] = useState({
// //     reportType: "As On Date",
// //     branchCode: "",
// //     asOnDate: "",
// //     fromDate: "",
// //     toDate: "",
// //     textReportName: ""
// //   });

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const reportOptions = [
// //     "As On Date",
// //     "N Form PL",
// //     "Income / Expenditure",
// //     "Admin Expenses",
// //     "PL Marathi",
// //     "N Form PL Marathi"
// //   ];

// //   const isAsOnDate = form.reportType === "As On Date";

// //   return (
// //     <div className="pl-wrapper">
// //       <div className="pl-card">

// //         {/* HEADER */}
// //         <div className="pl-header">Profit And Loss</div>

// //         {/* FORM SECTION */}
// //         <div className="pl-form-section">

// //           {/* BRANCH CODE */}
// //           <div className="pl-row">
// //             <label className="pl-label">Branch Code</label>
// //             <input className="pl-input" name="branchCode"
// //               value={form.branchCode} onChange={handleChange} />
// //           </div>

// //           {/* RADIO OPTIONS */}
// //           <div className="pl-radio-row">
// //             {reportOptions.map((opt) => (
// //               <label key={opt} className="pl-radio-label">
// //                 <input type="radio" name="reportType" value={opt}
// //                   checked={form.reportType === opt} onChange={handleChange} />
// //                 {opt}
// //               </label>
// //             ))}
// //           </div>

// //           {/* CONDITIONAL FIELDS */}
// //           {isAsOnDate ? (
// //             <>
// //               {/* AS ON DATE */}
// //               <div className="pl-row">
// //                 <label className="pl-label">As On Date</label>
// //                 <input className="pl-input" name="asOnDate"
// //                   placeholder="dd/mm/yyyy"
// //                   value={form.asOnDate} onChange={handleChange} />
// //               </div>

// //               {/* TEXT REPORT NAME */}
// //               <div className="pl-row">
// //                 <label className="pl-label">Enter Text Report Name</label>
// //                 <input className="pl-input pl-input-wide" name="textReportName"
// //                   placeholder="Enter Text Report Name"
// //                   value={form.textReportName} onChange={handleChange} />
// //               </div>

// //               {/* BUTTONS — As On Date */}
// //               <div className="pl-btn-row">
// //                 <button className="pl-btn pl-btn-blue" onClick={() => alert("Show")}>Show</button>
// //                 <button className="pl-btn pl-btn-blue" onClick={() => alert("Profit Loss Report")}>Profit Loss Report</button>
// //                 <button className="pl-btn pl-btn-blue" onClick={() => alert("Text Report View")}>Text Report View</button>
// //                 <button className="pl-btn pl-btn-blue" onClick={() => alert("Report With Working Day")}>Report With Working Day</button>
// //               </div>
// //             </>
// //           ) : (
// //             <>
// //               {/* FROM DATE + TO DATE */}
// //               <div className="pl-row">
// //                 <label className="pl-label">From Date</label>
// //                 <input className="pl-input" name="fromDate"
// //                   placeholder="DD/MM/YYYY"
// //                   value={form.fromDate} onChange={handleChange} />
// //                 <label className="pl-inline-label">To Date</label>
// //                 <input className="pl-input" name="toDate"
// //                   placeholder="DD/MM/YYYY"
// //                   value={form.toDate} onChange={handleChange} />
// //               </div>

// //               {/* TEXT REPORT NAME */}
// //               <div className="pl-row">
// //                 <label className="pl-label">Enter Text Report Name</label>
// //                 <input className="pl-input pl-input-wide" name="textReportName"
// //                   placeholder="Enter Text Report Name"
// //                   value={form.textReportName} onChange={handleChange} />
// //               </div>

// //               {/* BUTTONS — Other types */}
// //               <div className="pl-btn-row">
// //                 <button className="pl-btn pl-btn-blue" onClick={() => alert("Show")}>Show</button>
// //                 <button className="pl-btn pl-btn-red" onClick={() => alert("Profit Loss Report")}>Profit Loss Report</button>
// //                 <button className="pl-btn pl-btn-blue" onClick={() => alert("Text Report View")}>Text Report View</button>
// //               </div>
// //             </>
// //           )}

// //         </div>

// //         {/* PREVIEW PANEL */}
// //         <div className="pl-preview">
// //           <span className="pl-preview-empty">Preview area</span>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// // export default ProfitAndLoss;

// import { useState } from "react";
// import "./ProfitAndLoss.css";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setFetched(false);
//     setError("");
//   };

//   const reportOptions = [
//     "As On Date",
//     "N Form PL",
//     "Income / Expenditure",
//     "Admin Expenses",
//     "PL Marathi",
//     "N Form PL Marathi"
//   ];

//   const isAsOnDate = form.reportType === "As On Date";

//   // Convert DD/MM/YYYY → YYYY-MM-DD
//   const parseDate = (raw) => {
//     const parts = raw.trim().split("/");
//     if (parts.length !== 3) return null;
//     let [d, m, y] = parts;
//     if (y.length === 2) y = "20" + y;
//     return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
//   };

//   const validate = (requireRange = false) => {
//     if (!form.branchCode.trim()) return "Branch Code is required.";
//     if (isAsOnDate && !requireRange) {
//       if (!form.asOnDate.trim()) return "As On Date is required.";
//       if (!parseDate(form.asOnDate)) return "As On Date must be in DD/MM/YYYY format.";
//     } else {
//       if (!form.fromDate.trim()) return "From Date is required.";
//       if (!form.toDate.trim())   return "To Date is required.";
//       if (!parseDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
//       if (!parseDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
//     }
//     return null;
//   };

//   const callApi = async (endpoint, params) => {
//     const res = await fetch(`${API_BASE_URL}/api/profit-and-loss/${endpoint}?${new URLSearchParams(params)}`);
//     if (!res.ok) {
//       const body = await res.json().catch(() => ({}));
//       throw new Error(body.error || `Server error: ${res.status}`);
//     }
//     return res.json();
//   };

//   const handleResult = (data) => {
//     if (data && data.length > 0) {
//       setColumns(Object.keys(data[0]));
//     } else {
//       setColumns([]);
//     }
//     setReportData(data || []);
//     setFetched(true);
//   };

//   const withLoading = async (fn) => {
//     const err = validate();
//     if (err) { setError(err); return; }
//     setLoading(true);
//     setError("");
//     try {
//       await fn();
//     } catch (e) {
//       setError(e.message || "Failed to fetch report.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── AS ON DATE buttons ──────────────────────────────────────────────────────

//   const handleShow = () => withLoading(async () => {
//     const data = await callApi("show", {
//       branchCode: form.branchCode.trim(),
//       asOnDate:   parseDate(form.asOnDate)
//     });
//     handleResult(data);
//   });

//   const handleProfitLossReport = () => withLoading(async () => {
//     const endpoint = isAsOnDate ? "profit-loss-report" : (() => {
//       switch (form.reportType) {
//         case "N Form PL":            return "nform-profit-loss-report";
//         case "Income / Expenditure": return "income-exp-profit-loss-report";
//         case "Admin Expenses":       return "admin-exp-profit-loss-report";
//         default:                     return "profit-loss-report";
//       }
//     })();

//     const params = isAsOnDate
//       ? { branchCode: form.branchCode.trim(), asOnDate: parseDate(form.asOnDate) }
//       : { branchCode: form.branchCode.trim(), fromDate: parseDate(form.fromDate), toDate: parseDate(form.toDate) };

//     const data = await callApi(endpoint, params);
//     handleResult(data);
//   });

//   const handleTextReportView = () => withLoading(async () => {
//     const endpoint = isAsOnDate ? "text-report-view" : (() => {
//       switch (form.reportType) {
//         case "N Form PL":            return "nform-text-report-view";
//         case "Income / Expenditure": return "income-exp-text-report-view";
//         case "Admin Expenses":       return "admin-exp-text-report-view";
//         default:                     return "text-report-view";
//       }
//     })();

//     const params = isAsOnDate
//       ? { branchCode: form.branchCode.trim(), asOnDate: parseDate(form.asOnDate) }
//       : { branchCode: form.branchCode.trim(), fromDate: parseDate(form.fromDate), toDate: parseDate(form.toDate) };

//     const data = await callApi(endpoint, params);
//     handleResult(data);
//   });

//   const handleReportWithWorkingDay = () => withLoading(async () => {
//     const data = await callApi("report-with-working-day", {
//       branchCode: form.branchCode.trim(),
//       asOnDate:   parseDate(form.asOnDate)
//     });
//     handleResult(data);
//   });

//   // Income/Expenditure-only button
//   const handleIntPaidReport = () => withLoading(async () => {
//     const data = await callApi("income-exp-int-paid-report", {
//       branchCode: form.branchCode.trim(),
//       fromDate:   parseDate(form.fromDate),
//       toDate:     parseDate(form.toDate)
//     });
//     handleResult(data);
//   });

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

//           {/* CONDITIONAL FIELDS */}
//           {isAsOnDate ? (
//             <>
//               <div className="pl-row">
//                 <label className="pl-label">As On Date</label>
//                 <input className="pl-input" name="asOnDate"
//                   placeholder="DD/MM/YYYY"
//                   value={form.asOnDate} onChange={handleChange} />
//               </div>

//               <div className="pl-row">
//                 <label className="pl-label">Enter Text Report Name</label>
//                 <input className="pl-input pl-input-wide" name="textReportName"
//                   placeholder="Enter Text Report Name"
//                   value={form.textReportName} onChange={handleChange} />
//               </div>

//               <div className="pl-btn-row">
//                 <button className="pl-btn pl-btn-blue" onClick={handleShow} disabled={loading}>
//                   {loading ? "Loading…" : "Show"}
//                 </button>
//                 <button className="pl-btn pl-btn-blue" onClick={handleProfitLossReport} disabled={loading}>
//                   {loading ? "Loading…" : "Profit Loss Report"}
//                 </button>
//                 <button className="pl-btn pl-btn-blue" onClick={handleTextReportView} disabled={loading}>
//                   {loading ? "Loading…" : "Text Report View"}
//                 </button>
//                 <button className="pl-btn pl-btn-blue" onClick={handleReportWithWorkingDay} disabled={loading}>
//                   {loading ? "Loading…" : "Report With Working Day"}
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="pl-row">
//                 <label className="pl-label">From Date</label>
//                 <input className="pl-input" name="fromDate"
//                   placeholder="DD/MM/YYYY"
//                   value={form.fromDate} onChange={handleChange} />
//                 <label className="pl-inline-label">To Date</label>
//                 <input className="pl-input" name="toDate"
//                   placeholder="DD/MM/YYYY"
//                   value={form.toDate} onChange={handleChange} />
//               </div>

//               <div className="pl-row">
//                 <label className="pl-label">Enter Text Report Name</label>
//                 <input className="pl-input pl-input-wide" name="textReportName"
//                   placeholder="Enter Text Report Name"
//                   value={form.textReportName} onChange={handleChange} />
//               </div>

//               <div className="pl-btn-row">
//                 <button className="pl-btn pl-btn-blue" onClick={handleProfitLossReport} disabled={loading}>
//                   {loading ? "Loading…" : "Profit Loss Report"}
//                 </button>
//                 <button className="pl-btn pl-btn-red" onClick={handleTextReportView} disabled={loading}>
//                   {loading ? "Loading…" : "Text Report View"}
//                 </button>
//                 {form.reportType === "Income / Expenditure" && (
//                   <button className="pl-btn pl-btn-blue" onClick={handleIntPaidReport} disabled={loading}>
//                     {loading ? "Loading…" : "Int Paid Report"}
//                   </button>
//                 )}
//               </div>
//             </>
//           )}

//           {/* ERROR */}
//           {error && <p className="pl-error">{error}</p>}

//         </div>

//         {/* PREVIEW PANEL */}
//         <div className="pl-preview">
//           {loading && (
//             <span className="pl-preview-empty">Loading...</span>
//           )}

//           {!loading && !fetched && (
//             <span className="pl-preview-empty">Preview area</span>
//           )}

//           {!loading && fetched && reportData.length === 0 && (
//             <span className="pl-preview-empty">No records found.</span>
//           )}

//           {!loading && fetched && reportData.length > 0 && (
//             <div className="pl-table-wrapper">
//               <table className="pl-table">
//                 <thead>
//                   <tr>
//                     {columns.map((col) => (
//                       <th key={col}>{col}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reportData.map((row, i) => (
//                     <tr key={i}>
//                       {columns.map((col) => (
//                         <td key={col}>{row[col] ?? ""}</td>
//                       ))}
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

import { useState } from "react";
import "./ProfitAndLoss.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Per report-type config ────────────────────────────────────────────────────
// dateMode: "asOnDate" | "range"
// buttons:  array of { label, handler key }
const REPORT_CONFIG = {
  "As On Date": {
    dateMode: "asOnDate",
    buttons: ["show", "profitLossReport", "textReportView", "reportWithWorkingDay"]
  },
  "N Form PL": {
    dateMode: "range",
    buttons: ["show", "profitLossReport", "textReportView"]
  },
  "Income / Expenditure": {
    dateMode: "range",
    buttons: ["show", "profitLossReport", "textReportView", "intPaidReport"]
  },
  "Admin Expenses": {
    dateMode: "range",
    buttons: ["show", "profitLossReport", "textReportView"]
  },
  "PL Marathi": {
    dateMode: "asOnDate",
    buttons: ["show", "profitLossReport", "textReportView"]
  },
  "N Form PL Marathi": {
    dateMode: "range",
    buttons: ["show", "profitLossReport", "textReportView"]
  }
};

const BUTTON_LABELS = {
  show:                 "Show",
  profitLossReport:     "Profit Loss Report",
  textReportView:       "Text Report View",
  reportWithWorkingDay: "Report With Working Day",
  intPaidReport:        "Int Paid Report"
};

function ProfitAndLoss() {
  const [form, setForm] = useState({
    reportType: "As On Date",
    branchCode: "",
    asOnDate: "",
    fromDate: "",
    toDate: "",
    textReportName: ""
  });

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [fetched, setFetched]       = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFetched(false);
    setError("");
  };

  const reportOptions = Object.keys(REPORT_CONFIG);

  const config   = REPORT_CONFIG[form.reportType];
  const isAsOnDate = config.dateMode === "asOnDate";

  // Convert DD/MM/YYYY → YYYY-MM-DD
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
      if (!form.asOnDate.trim())    return "As On Date is required.";
      if (!parseDate(form.asOnDate)) return "As On Date must be in DD/MM/YYYY format.";
    } else {
      if (!form.fromDate.trim())     return "From Date is required.";
      if (!form.toDate.trim())       return "To Date is required.";
      if (!parseDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
      if (!parseDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
    }
    return null;
  };

  const callApi = async (endpoint, params) => {
    const res = await fetch(
      `${API_BASE_URL}/api/profit-and-loss/${endpoint}?${new URLSearchParams(params)}`
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Server error: ${res.status}`);
    }
    return res.json();
  };

  const handleResult = (data) => {
    setColumns(data?.length > 0 ? Object.keys(data[0]) : []);
    setReportData(data || []);
    setFetched(true);
  };

  const withLoading = async (fn) => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    try { await fn(); }
    catch (e) { setError(e.message || "Failed to fetch report."); }
    finally { setLoading(false); }
  };

  // ── Shared param builders ─────────────────────────────────────────────────
  const asOnParams  = () => ({ branchCode: form.branchCode.trim(), asOnDate: parseDate(form.asOnDate) });
  const rangeParams = () => ({ branchCode: form.branchCode.trim(), fromDate: parseDate(form.fromDate), toDate: parseDate(form.toDate) });

  // ── Endpoint resolver per button ──────────────────────────────────────────
  const resolveEndpoint = (btnKey) => {
    const rt = form.reportType;
    switch (btnKey) {
      case "show":
        // All types use SP_ProfitAndLoss for "Show" — map to closest available endpoint
        if (rt === "As On Date" || rt === "PL Marathi")              return ["show", asOnParams()];
        if (rt === "N Form PL" || rt === "N Form PL Marathi")        return ["nform-profit-loss-report", rangeParams()];
        if (rt === "Income / Expenditure")                           return ["income-exp-profit-loss-report", rangeParams()];
        if (rt === "Admin Expenses")                                 return ["admin-exp-profit-loss-report", rangeParams()];
        break;
      case "profitLossReport":
        if (rt === "As On Date" || rt === "PL Marathi")              return ["profit-loss-report", asOnParams()];
        if (rt === "N Form PL" || rt === "N Form PL Marathi")        return ["nform-profit-loss-report", rangeParams()];
        if (rt === "Income / Expenditure")                           return ["income-exp-profit-loss-report", rangeParams()];
        if (rt === "Admin Expenses")                                 return ["admin-exp-profit-loss-report", rangeParams()];
        break;
      case "textReportView":
        if (rt === "As On Date" || rt === "PL Marathi")              return ["text-report-view", asOnParams()];
        if (rt === "N Form PL" || rt === "N Form PL Marathi")        return ["nform-text-report-view", rangeParams()];
        if (rt === "Income / Expenditure")                           return ["income-exp-text-report-view", rangeParams()];
        if (rt === "Admin Expenses")                                 return ["admin-exp-text-report-view", rangeParams()];
        break;
      case "reportWithWorkingDay":
        return ["report-with-working-day", asOnParams()];
      case "intPaidReport":
        return ["income-exp-int-paid-report", rangeParams()];
      default:
        break;
    }
    return null;
  };

  const handleButton = (btnKey) => withLoading(async () => {
    const resolved = resolveEndpoint(btnKey);
    if (!resolved) throw new Error("No endpoint configured for this action.");
    const [endpoint, params] = resolved;
    const data = await callApi(endpoint, params);
    handleResult(data);
  });

  return (
    <div className="pl-wrapper">
      <div className="pl-card">

        {/* HEADER */}
        <div className="pl-header">Profit And Loss</div>

        {/* FORM SECTION */}
        <div className="pl-form-section">

          {/* BRANCH CODE */}
          <div className="pl-row">
            <label className="pl-label">Branch Code</label>
            <input className="pl-input" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* RADIO OPTIONS */}
          <div className="pl-radio-row">
            {reportOptions.map((opt) => (
              <label key={opt} className="pl-radio-label">
                <input type="radio" name="reportType" value={opt}
                  checked={form.reportType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>

          {/* DATE FIELDS */}
          {isAsOnDate ? (
            <div className="pl-row">
              <label className="pl-label">As On Date</label>
              <input className="pl-input" name="asOnDate"
                placeholder="DD/MM/YYYY"
                value={form.asOnDate} onChange={handleChange} />
            </div>
          ) : (
            <div className="pl-row">
              <label className="pl-label">From Date</label>
              <input className="pl-input" name="fromDate"
                placeholder="DD/MM/YYYY"
                value={form.fromDate} onChange={handleChange} />
              <label className="pl-inline-label">To Date</label>
              <input className="pl-input" name="toDate"
                placeholder="DD/MM/YYYY"
                value={form.toDate} onChange={handleChange} />
            </div>
          )}

          {/* TEXT REPORT NAME */}
          <div className="pl-row">
            <label className="pl-label">Enter Text Report Name</label>
            <input className="pl-input pl-input-wide" name="textReportName"
              placeholder="Enter Text Report Name"
              value={form.textReportName} onChange={handleChange} />
          </div>

          {/* BUTTONS — driven by config */}
          <div className="pl-btn-row">
            {config.buttons.map((btnKey) => (
              <button
                key={btnKey}
                className="pl-btn pl-btn-blue"
                onClick={() => handleButton(btnKey)}
                disabled={loading}
              >
                {loading ? "Loading…" : BUTTON_LABELS[btnKey]}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && <p className="pl-error">{error}</p>}

        </div>

        {/* PREVIEW PANEL */}
        <div className="pl-preview">
          {loading && <span className="pl-preview-empty">Loading...</span>}

          {!loading && !fetched && (
            <span className="pl-preview-empty">Preview area</span>
          )}

          {!loading && fetched && reportData.length === 0 && (
            <span className="pl-preview-empty">No records found.</span>
          )}

          {!loading && fetched && reportData.length > 0 && (
            <div className="pl-table-wrapper">
              <table className="pl-table">
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
              <p className="pl-record-count">Total Records: {reportData.length}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfitAndLoss;