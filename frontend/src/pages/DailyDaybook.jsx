// import { useState } from "react";
// import "./DailyDaybook.css";

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000";

// function DailyDaybook() {
//   const [form, setForm] = useState({
//     reportType: "Details",
//     skipIntAc: false,
//     skipDailyAc: false,
//     branchCode: "1",
//     asOnDate: "26/07/2025",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [reportData, setReportData] = useState([]);
//   const [columns, setColumns] = useState([]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const buildQuery = () => {
//     return new URLSearchParams({
//       asOnDate: form.asOnDate,
//       branchCode: form.branchCode,
//       reportType: form.reportType
//         .replace(/\s/g, "")
//         .toLowerCase(),
//       skipDailyAc: form.skipDailyAc ? "Y" : "N",
//       skipIntAc: form.skipIntAc ? "Y" : "N",
//     }).toString();
//   };

//   const handleDayBookReport = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_BASE_URL}/api/daybook?${buildQuery()}`
//       );

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message);
//       }

//       setReportData(result.data || []);

//       if (result.data?.length > 0) {
//         setColumns(Object.keys(result.data[0]));
//       } else {
//         setColumns([]);
//       }
//     } catch (err) {
//       setError(err.message);
//       setReportData([]);
//       setColumns([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExit = () => {
//     setForm({
//       reportType: "Details",
//       skipIntAc: false,
//       skipDailyAc: false,
//       branchCode: "1",
//       asOnDate: "26/07/2025",
//     });

//     setReportData([]);
//     setColumns([]);
//     setError("");
//   };

//   return (
//     <div className="daybook-wrapper">
//       <div className="daybook-card">

//         <div className="daybook-header">
//           Day Book
//         </div>

//         <div className="daybook-body">

//           <div className="daybook-row">
//             <div className="daybook-radio-group">

//               <label className="daybook-radio">
//                 <input
//                   type="radio"
//                   name="reportType"
//                   value="Details"
//                   checked={form.reportType === "Details"}
//                   onChange={handleChange}
//                 />
//                 Details
//               </label>

//               <label className="daybook-radio">
//                 <input
//                   type="radio"
//                   name="reportType"
//                   value="Summary"
//                   checked={form.reportType === "Summary"}
//                   onChange={handleChange}
//                 />
//                 Summary
//               </label>

//               <label className="daybook-radio">
//                 <input
//                   type="radio"
//                   name="reportType"
//                   value="SetWiseDetails"
//                   checked={form.reportType === "SetWiseDetails"}
//                   onChange={handleChange}
//                 />
//                 SetWiseDetails
//               </label>

//               <label className="daybook-radio">
//                 <input
//                   type="radio"
//                   name="reportType"
//                   value="ProductWise"
//                   checked={form.reportType === "ProductWise"}
//                   onChange={handleChange}
//                 />
//                 ProductWise
//               </label>

//               <label className="daybook-radio">
//                 <input
//                   type="radio"
//                   name="reportType"
//                   value="ALL Details"
//                   checked={form.reportType === "ALL Details"}
//                   onChange={handleChange}
//                 />
//                 ALL Details
//               </label>

//             </div>
//           </div>

//           <div className="daybook-row">

//             <label className="daybook-checkbox">
//               <input
//                 type="checkbox"
//                 name="skipIntAc"
//                 checked={form.skipIntAc}
//                 onChange={handleChange}
//               />
//               SKIP_INT AC
//             </label>

//             <label className="daybook-checkbox">
//               <input
//                 type="checkbox"
//                 name="skipDailyAc"
//                 checked={form.skipDailyAc}
//                 onChange={handleChange}
//               />
//               SKIP_DAILY AC
//             </label>

//           </div>

//           <div className="daybook-row">
//             <label className="daybook-label">
//               Branch Code
//             </label>

//             <input
//               type="text"
//               className="daybook-input"
//               name="branchCode"
//               value={form.branchCode}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="daybook-row">
//             <label className="daybook-label">
//               As On Date
//             </label>

//             <input
//               type="text"
//               className="daybook-input"
//               name="asOnDate"
//               value={form.asOnDate}
//               onChange={handleChange}
//             />
//           </div>

//           {error && (
//             <div className="cashbook-error">
//               {error}
//             </div>
//           )}

//           <div className="daybook-btn-container">

//             <button
//               className="daybook-btn"
//               onClick={handleDayBookReport}
//               disabled={loading}
//             >
//               {loading ? "Loading..." : "Day Book Report"}
//             </button>

//             <button
//               className="daybook-btn"
//               onClick={handleExit}
//             >
//               Exit
//             </button>

//           </div>

//         </div>

//         <div className="daybook-result">

//           {reportData.length > 0 && (
//             <table className="glw-table">
//               <thead>
//                 <tr>
//                   {columns.map((column) => (
//                     <th key={column}>{column}</th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {reportData.map((row, index) => (
//                   <tr key={index}>
//                     {columns.map((column) => (
//                       <td key={column}>
//                         {row[column]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//         </div>

//       </div>
//     </div>
//   );
// }

// export default DailyDaybook;

import { useState } from "react";
import "./DailyDaybook.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// DD/MM/YYYY → YYYY-MM-DD
const parseDate = (raw) => {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

function DailyDaybook() {
  const [form, setForm] = useState({
    reportType: "Details",
    skipIntAc: false,
    skipDailyAc: false,
    branchCode: "1",
    asOnDate: "26/07/2025",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [printMode, setPrintMode] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFetched(false);
  };

  const validate = () => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (!form.asOnDate.trim()) return "As On Date is required.";
    if (!parseDate(form.asOnDate)) return "As On Date must be DD/MM/YYYY.";
    return null;
  };

  const buildQuery = () => {
    return new URLSearchParams({
      asOnDate: form.asOnDate,
      branchCode: form.branchCode,
      reportType: form.reportType
        .replace(/\s/g, "")
        .toLowerCase(),
      skipDailyAc: form.skipDailyAc ? "Y" : "N",
      skipIntAc: form.skipIntAc ? "Y" : "N",
    }).toString();
  };

  const fetchData = async (mode) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return null;
    }

    setLoading(true);
    setError("");
    setPrintMode(mode);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/daybook?${buildQuery()}`
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || body.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      const data = Array.isArray(result) ? result : result.data || [];

      setReportData(data);
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setFetched(true);

      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleDayBookReport = async () => {
    await fetchData("report");
  };

  const handlePrint = async () => {
    const data = (fetched && printMode === "print") ? reportData : await fetchData("print");
    if (data && data.length > 0) {
      setTimeout(() => window.print(), 300);
    }
  };

  const handleExit = () => {
    setForm({
      reportType: "Details",
      skipIntAc: false,
      skipDailyAc: false,
      branchCode: "1",
      asOnDate: "26/07/2025",
    });

    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  return (
    <div className="db-wrapper">
      <div className="db-card no-print">

        {/* HEADER */}
        <div className="db-header">
          <span>Day Book Report</span>
        </div>

        {/* BODY */}
        <div className="db-body">

          {/* REPORT TYPE */}
          <div className="db-row">
            <label className="db-label">Report Type : <span className="req">*</span></label>
            <div className="db-radio-group">
              {["Details", "Summary", "SetWiseDetails", "ProductWise", "ALL Details"].map((opt) => (
                <label key={opt} className="db-radio-label">
                  <input
                    type="radio"
                    name="reportType"
                    value={opt}
                    checked={form.reportType === opt}
                    onChange={handleChange}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* CHECKBOXES */}
          <div className="db-row">
            <label className="db-label">Options :</label>
            <div className="db-checkbox-group">
              <label className="db-checkbox-label">
                <input
                  type="checkbox"
                  name="skipIntAc"
                  checked={form.skipIntAc}
                  onChange={handleChange}
                />
                Skip Interest Account
              </label>

              <label className="db-checkbox-label">
                <input
                  type="checkbox"
                  name="skipDailyAc"
                  checked={form.skipDailyAc}
                  onChange={handleChange}
                />
                Skip Daily Account
              </label>
            </div>
          </div>

          {/* BRANCH CODE */}
          <div className="db-row">
            <label className="db-label">Branch Code : <span className="req">*</span></label>
            <input
              className="db-input db-input-short db-input-shaded"
              type="text"
              name="branchCode"
              value={form.branchCode}
              onChange={handleChange}
            />
          </div>

          {/* AS ON DATE */}
          <div className="db-row">
            <label className="db-label">As On Date : <span className="req">*</span></label>
            <input
              className="db-input db-input-short"
              type="text"
              name="asOnDate"
              value={form.asOnDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* ERROR / LOADING */}
          {error && <p className="db-error">{error}</p>}
          {loading && <p className="db-loading">Loading... this may take up to 60 seconds.</p>}

        </div>

        {/* FOOTER BUTTONS */}
        <div className="db-footer">
          <button className="db-btn" onClick={handleDayBookReport} disabled={loading}>
            {loading && printMode === "report" ? "Loading..." : "Day Book Report"}
          </button>
          <button className="db-btn" onClick={handlePrint} disabled={loading}>
            {loading && printMode === "print" ? "Loading..." : "Print"}
          </button>
          <button className="db-btn db-btn-exit" onClick={handleExit}>
            Exit
          </button>
        </div>

      </div>

      {/* REPORT TABLE */}
      {fetched && reportData.length > 0 && (
        <div className="db-table-wrapper">

          {/* Print header */}
          <div className="print-only db-print-header">
            <h2>
              Day Book Report — {form.reportType}
            </h2>
            <p>
              Branch: {form.branchCode} &nbsp;|&nbsp;
              As On Date: {form.asOnDate} &nbsp;|&nbsp;
              Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="db-table">
            <thead>
              <tr>
                {columns.map((col) => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>{row[col] ?? ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="db-record-count no-print">
            Total Records: {reportData.length}
          </p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="db-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default DailyDaybook;