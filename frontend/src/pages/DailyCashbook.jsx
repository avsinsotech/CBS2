// // import { useState } from "react";
// // import "./CashBook.css";

// // function CashBook() {
// //   const [form, setForm] = useState({
// //     reportType: "Details",
// //     fromDate: "01/04/2025",
// //     toDate: "26/07/2025",
// //     reportName: ""
// //   });

// //   const handleChange = (e) => {
// //     setForm({
// //       ...form,
// //       [e.target.name]: e.target.value
// //     });
// //   };

// //   return (
// //     <div className="cashbook-wrapper">
// //       <div className="cashbook-card">

// //         <div className="cashbook-header">
// //           Cash Book
// //         </div>

// //         <div className="cashbook-body">

// //           {/* Details / Summary */}
// //           <div className="cashbook-row">
// //             <div className="cashbook-radio-group">

// //               <label className="cashbook-radio">
// //                 <input
// //                   type="radio"
// //                   name="reportType"
// //                   value="Details"
// //                   checked={form.reportType === "Details"}
// //                   onChange={handleChange}
// //                 />
// //                 Details
// //               </label>

// //               <label className="cashbook-radio">
// //                 <input
// //                   type="radio"
// //                   name="reportType"
// //                   value="Summary"
// //                   checked={form.reportType === "Summary"}
// //                   onChange={handleChange}
// //                 />
// //                 Summary
// //               </label>

// //             </div>
// //           </div>

// //           {/* Dates */}
// //           <div className="cashbook-row">

// //             <label className="cashbook-label">
// //               From Date
// //             </label>

// //             <div className="cashbook-date-group">
// //               <input
// //                 className="cashbook-input"
// //                 name="fromDate"
// //                 value={form.fromDate}
// //                 onChange={handleChange}
// //               />

// //               <label className="cashbook-label">
// //                 To Date
// //               </label>

// //               <input
// //                 className="cashbook-input"
// //                 name="toDate"
// //                 value={form.toDate}
// //                 onChange={handleChange}
// //               />
// //             </div>

// //           </div>

// //           {/* Report Name */}
// //           <div className="cashbook-row">

// //             <label className="cashbook-label">
// //               Report Name <span style={{color:"red"}}>*</span>
// //             </label>

// //             <input
// //               className="cashbook-input cashbook-input-wide"
// //               name="reportName"
// //               placeholder="Please enter text report name"
// //               value={form.reportName}
// //               onChange={handleChange}
// //             />

// //           </div>

// //           {/* Buttons */}
// //           <div className="cashbook-actions">
// //             <button className="cashbook-btn">Show</button>
// //             <button className="cashbook-btn">Cash Book Report</button>
// //             <button className="cashbook-btn">Download</button>
// //             <button className="cashbook-btn">Print</button>
// //             <button className="cashbook-btn">Exit</button>
// //           </div>

// //         </div>

// //         {/* Result Area */}
// //         <div className="cashbook-result">
// //           {/* Table / Report Grid Here */}
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// // export default CashBook;

// import { useState } from "react";
// import "./CashBook.css";

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000";

// function CashBook() {
//   const [form, setForm] = useState({
//     reportType: "Details",
//     fromDate: "01/04/2025",
//     toDate: "26/07/2025",
//     reportName: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [reportData, setReportData] = useState([]);
//   const [columns, setColumns] = useState([]);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const buildQuery = () => {
//     const params = new URLSearchParams({
//       fromDate: form.fromDate,
//       toDate: form.toDate,
//       branchCode: "1",
//       reportType: form.reportType.toLowerCase(),
//       reportName: form.reportName,
//     });

//     return params.toString();
//   };

//   const handleShow = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_BASE_URL}/api/cashbook?${buildQuery()}`
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

//   const handleCashBookReport = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_BASE_URL}/api/cashbook/report?${buildQuery()}`
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

//   const handleDownload = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_BASE_URL}/api/cashbook/download`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             fromDate: form.fromDate,
//             toDate: form.toDate,
//             branchCode: "1",
//             reportType: form.reportType.toLowerCase(),
//             reportName: form.reportName,
//             format: "excel",
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message);
//       }

//       const rows = result.data || [];

//       if (rows.length === 0) {
//         alert("No records found.");
//         return;
//       }

//       const headers = Object.keys(rows[0]);

//       let csvContent =
//         headers.join(",") +
//         "\n" +
//         rows
//           .map((row) =>
//             headers
//               .map((header) =>
//                 `"${row[header] !== null ? row[header] : ""}"`
//               )
//               .join(",")
//           )
//           .join("\n");

//       const blob = new Blob([csvContent], {
//         type: "text/csv;charset=utf-8;",
//       });

//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download =
//         (form.reportName || "CashBook") + ".csv";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_BASE_URL}/api/cashbook/print`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             fromDate: form.fromDate,
//             toDate: form.toDate,
//             branchCode: "1",
//             reportType: form.reportType.toLowerCase(),
//             reportName: form.reportName,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message);
//       }

//       setReportData(result.data || []);

//       if (result.data?.length > 0) {
//         setColumns(Object.keys(result.data[0]));
//       }

//       setTimeout(() => {
//         window.print();
//       }, 300);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExit = () => {
//     setForm({
//       reportType: "Details",
//       fromDate: "01/04/2025",
//       toDate: "26/07/2025",
//       reportName: "",
//     });

//     setReportData([]);
//     setColumns([]);
//     setError("");
//   };

//   return (
//     <div className="cashbook-wrapper">
//       <div className="cashbook-card">

//         <div className="cashbook-header">
//           Cash Book
//         </div>

//         <div className="cashbook-body">

//           <div className="cashbook-row">
//             <div className="cashbook-radio-group">

//               <label className="cashbook-radio">
//                 <input
//                   type="radio"
//                   name="reportType"
//                   value="Details"
//                   checked={form.reportType === "Details"}
//                   onChange={handleChange}
//                 />
//                 Details
//               </label>

//               <label className="cashbook-radio">
//                 <input
//                   type="radio"
//                   name="reportType"
//                   value="Summary"
//                   checked={form.reportType === "Summary"}
//                   onChange={handleChange}
//                 />
//                 Summary
//               </label>

//             </div>
//           </div>

//           <div className="cashbook-row">

//             <label className="cashbook-label">
//               From Date
//             </label>

//             <input
//               className="cashbook-input"
//               name="fromDate"
//               value={form.fromDate}
//               onChange={handleChange}
//             />

//             <label className="cashbook-label">
//               To Date
//             </label>

//             <input
//               className="cashbook-input"
//               name="toDate"
//               value={form.toDate}
//               onChange={handleChange}
//             />

//           </div>

//           <div className="cashbook-row">

//             <label className="cashbook-label">
//               Report Name <span className="req">*</span>
//             </label>

//             <input
//               className="cashbook-input cashbook-input-wide"
//               name="reportName"
//               placeholder="Please enter text report name"
//               value={form.reportName}
//               onChange={handleChange}
//             />

//           </div>

//           {error && (
//             <div className="cashbook-error">
//               {error}
//             </div>
//           )}

//           {loading && (
//             <div className="cashbook-loading">
//               Loading...
//             </div>
//           )}

//           <div className="cashbook-actions">

//             <button
//               className="cashbook-btn"
//               onClick={handleShow}
//               disabled={loading}
//             >
//               Show
//             </button>

//             <button
//               className="cashbook-btn"
//               onClick={handleCashBookReport}
//               disabled={loading}
//             >
//               Cash Book Report
//             </button>

//             <button
//               className="cashbook-btn"
//               onClick={handleDownload}
//               disabled={loading}
//             >
//               Download
//             </button>

//             <button
//               className="cashbook-btn"
//               onClick={handlePrint}
//               disabled={loading}
//             >
//               Print
//             </button>

//             <button
//               className="cashbook-btn"
//               onClick={handleExit}
//             >
//               Exit
//             </button>

//           </div>
//         </div>

//         <div className="cashbook-result">

//           {reportData.length > 0 && (
//             <table className="glw-table">
//               <thead>
//                 <tr>
//                   {columns.map((column) => (
//                     <th key={column}>
//                       {column}
//                     </th>
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

// export default CashBook;

import { useState } from "react";
import "./CashBook.css";

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

function CashBook() {
  const [form, setForm] = useState({
    reportType: "Details",
    fromDate: "01/04/2025",
    toDate: "26/07/2025",
    reportName: "",
    branchCode: "1",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [printMode, setPrintMode] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFetched(false);
  };

  const validate = () => {
    if (!form.reportName.trim()) return "Report Name is required.";
    if (!form.fromDate.trim()) return "From Date is required.";
    if (!form.toDate.trim()) return "To Date is required.";
    if (!parseDate(form.fromDate)) return "From Date must be DD/MM/YYYY.";
    if (!parseDate(form.toDate)) return "To Date must be DD/MM/YYYY.";
    return null;
  };

  const buildQuery = () => {
    const params = new URLSearchParams({
      fromDate: form.fromDate,
      toDate: form.toDate,
      branchCode: form.branchCode,
      reportType: form.reportType.toLowerCase(),
      reportName: form.reportName,
    });

    return params.toString();
  };

  const fetchData = async (action) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return null;
    }

    setLoading(true);
    setError("");
    setPrintMode(action);

    try {
      let url = "";

      if (action === "show") {
        url = `/api/cashbook?${buildQuery()}`;
      } else if (action === "report") {
        url = `/api/cashbook/report?${buildQuery()}`;
      } else if (action === "print") {
        url = `/api/cashbook/print`;
      }

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: action === "print" ? "POST" : "GET",
        headers:
          action === "print"
            ? { "Content-Type": "application/json" }
            : {},
        body:
          action === "print"
            ? JSON.stringify({
                fromDate: form.fromDate,
                toDate: form.toDate,
                branchCode: form.branchCode,
                reportType: form.reportType.toLowerCase(),
                reportName: form.reportName,
              })
            : undefined,
      });

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

  const handleShow = async () => {
    await fetchData("show");
  };

  const handleCashBookReport = async () => {
    await fetchData("report");
  };

  const handleDownload = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/cashbook/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromDate: form.fromDate,
          toDate: form.toDate,
          branchCode: form.branchCode,
          reportType: form.reportType.toLowerCase(),
          reportName: form.reportName,
          format: "excel",
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || body.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      const rows = result.data || [];

      if (rows.length === 0) {
        setError("No records found to download.");
        return;
      }

      const headers = Object.keys(rows[0]);
      let csvContent =
        headers.join(",") +
        "\n" +
        rows
          .map((row) =>
            headers
              .map((header) =>
                `"${row[header] !== null ? row[header] : ""}"`
              )
              .join(",")
          )
          .join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = (form.reportName || "CashBook") + ".csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Failed to download report.");
    } finally {
      setLoading(false);
    }
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
      fromDate: "01/04/2025",
      toDate: "26/07/2025",
      reportName: "",
      branchCode: "1",
    });

    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  return (
    <div className="cb-wrapper">
      <div className="cb-card no-print">

        {/* HEADER */}
        <div className="cb-header">
          <span>Cash Book Report</span>
        </div>

        {/* BODY */}
        <div className="cb-body">

          {/* REPORT TYPE */}
          <div className="cb-row">
            <label className="cb-label">Report Type : <span className="req">*</span></label>
            <div className="cb-radio-group">
              {["Details", "Summary"].map((opt) => (
                <label key={opt} className="cb-radio-label">
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

          {/* BRANCH CODE */}
          <div className="cb-row">
            <label className="cb-label">Branch Code : <span className="req">*</span></label>
            <input
              className="cb-input cb-input-short cb-input-shaded"
              name="branchCode"
              value={form.branchCode}
              onChange={handleChange}
            />
          </div>

          {/* FROM DATE + TO DATE */}
          <div className="cb-row">
            <label className="cb-label">From Date : <span className="req">*</span></label>
            <div className="cb-inline-pair">
              <input
                className="cb-input"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
              />
              <label className="cb-inline-label">To Date : <span className="req">*</span></label>
              <input
                className="cb-input"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
              />
            </div>
          </div>

          {/* REPORT NAME */}
          <div className="cb-row">
            <label className="cb-label">Report Name : <span className="req">*</span></label>
            <input
              className="cb-input cb-input-wide"
              name="reportName"
              placeholder="Enter report name"
              value={form.reportName}
              onChange={handleChange}
            />
          </div>

          {/* ERROR / LOADING */}
          {error && <p className="cb-error">{error}</p>}
          {loading && <p className="cb-loading">Loading... this may take up to 60 seconds.</p>}

        </div>

        {/* FOOTER BUTTONS */}
        <div className="cb-footer">
          <button className="cb-btn" onClick={handleShow} disabled={loading}>
            {loading && printMode === "show" ? "Loading..." : "Show"}
          </button>
          <button className="cb-btn" onClick={handleCashBookReport} disabled={loading}>
            {loading && printMode === "report" ? "Loading..." : "Cash Book Report"}
          </button>
          <button className="cb-btn" onClick={handleDownload} disabled={loading}>
            {loading && printMode === "download" ? "Loading..." : "Download"}
          </button>
          <button className="cb-btn" onClick={handlePrint} disabled={loading}>
            {loading && printMode === "print" ? "Loading..." : "Print"}
          </button>
          <button className="cb-btn cb-btn-exit" onClick={handleExit}>
            Exit
          </button>
        </div>

      </div>

      {/* REPORT TABLE */}
      {fetched && reportData.length > 0 && (
        <div className="cb-table-wrapper">

          {/* Print header */}
          <div className="print-only cb-print-header">
            <h2>
              {form.reportName} — {form.reportType}
            </h2>
            <p>
              Branch: {form.branchCode} &nbsp;|&nbsp;
              {form.fromDate} to {form.toDate} &nbsp;|&nbsp;
              Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="cb-table">
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

          <p className="cb-record-count no-print">
            Total Records: {reportData.length}
          </p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="cb-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default CashBook;