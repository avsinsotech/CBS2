
// import { useState } from "react";
// import "./GLReport.css";

// // const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";
// function GLReport() {
//   const [reportName, setReportName] = useState("");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);  
//   const [error, setError] = useState("");
//   const [fetched, setFetched] = useState(false);

//   const fetchGLData = async () => {
//     if (!reportName.trim()) {
//       alert("Please enter a report name.");
//       return null;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/gl-report/print`);
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       const data = await res.json();
//       setReportData(data);
//       setFetched(true);
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to fetch GL Report.");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = async () => {
//     const data = fetched ? reportData : await fetchGLData();
//     if (data && data.length > 0) {
//       setTimeout(() => window.print(), 300);
//     }
//   };

//   const handleTextReportView = async () => {
//     await fetchGLData();
//   };

//   return (
//     <div className="gl-report-wrapper">

//       {/* CARD — hidden during print */}
//       <div className="gl-report-card no-print">
//         <div className="gl-report-header">
//           <span>PRINT GL-REPORT</span>
//         </div>

//         <div className="gl-report-body">
//           <div className="gl-report-row">
//             <label className="gl-report-label">Please Enter Report Name</label>
//             <input
//               type="text"
//               className="gl-report-input"
//               placeholder="ReportName"
//               value={reportName}
//               onChange={(e) => {
//                 setReportName(e.target.value);
//                 setFetched(false); // re-fetch if name changes
//               }}
//             />
//           </div>

//           {error && <p className="gl-report-error">{error}</p>}
//           {loading && <p className="gl-report-loading">Loading...</p>}

//           <div className="gl-report-footer">
//             <button
//               className="gl-btn gl-btn-print"
//               onClick={handlePrint}
//               disabled={loading}
//             >
//               {loading ? "Loading..." : "Print"}
//             </button>
//             <button
//               className="gl-btn gl-btn-view"
//               onClick={handleTextReportView}
//               disabled={loading}
//             >
//               {loading ? "Loading..." : "Text Report View"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* REPORT TABLE — visible always once fetched, and during print */}
//       {fetched && reportData.length > 0 && (
//         <div className="gl-report-table-wrapper">

//           {/* Print header (only shows during print) */}
//           <div className="print-only gl-print-header">
//             <h2>{reportName}</h2>
//             <p>GL Report &nbsp;|&nbsp; Date: {new Date().toLocaleDateString()}</p>
//           </div>

//           <table className="gl-table">
//             <thead>
//               <tr>
//                 <th>GL Code</th>
//                 <th>Sub GL Code</th>
//                 <th>GL Group</th>
//                 <th>GL Name</th>
//                 <th>Last No</th>
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.GLCODE}</td>
//                   <td>{row.SUBGLCODE}</td>
//                   <td>{row.GLGROUP}</td>
//                   <td>{row.GLNAME}</td>
//                   <td>{row.LASTNO}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <p className="gl-record-count no-print">
//             Total Records: {reportData.length}
//           </p>
//         </div>
//       )}

//       {fetched && reportData.length === 0 && !loading && (
//         <p className="gl-report-error no-print">No records found.</p>
//       )}
//     </div>
//   );
// }

// export default GLReport;

import { useState, useRef } from "react";
import "./GLReport.css";

const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";

// ── Format number ─────────────────────────────────────────────────────────────
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN");
};

// ── Formatted GL Report (matches the picture layout) ─────────────────────────
function GLReportFormatted({ data, reportName }) {
  const printDate = new Date().toLocaleDateString("en-GB").replace(/\//g, "/");

  return (
    <div className="gl-formatted-report">
      {/* ── Report Header ── */}
      <div className="gl-fmt-org-name">
        SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI
      </div>

      <div className="gl-fmt-meta-grid">
        <div className="gl-fmt-meta-left">
          <div className="gl-fmt-meta-row">
            <span className="gl-fmt-meta-key">Branch Name</span>
            <span className="gl-fmt-meta-sep">:</span>
            <span className="gl-fmt-meta-val">HEAD OFFICE</span>
          </div>
          <div className="gl-fmt-meta-row">
            <span className="gl-fmt-meta-key">Report Name</span>
            <span className="gl-fmt-meta-sep">:</span>
            <span className="gl-fmt-meta-val">{reportName || "Product Details List"}</span>
          </div>
        </div>
        <div className="gl-fmt-meta-right">
          <div className="gl-fmt-meta-row">
            <span className="gl-fmt-meta-key">Print Date</span>
            <span className="gl-fmt-meta-sep">:</span>
            <span className="gl-fmt-meta-val">{printDate}</span>
          </div>
          <div className="gl-fmt-meta-row">
            <span className="gl-fmt-meta-key">User Id</span>
            <span className="gl-fmt-meta-sep">:</span>
            <span className="gl-fmt-meta-val">Rohini</span>
          </div>
          <div className="gl-fmt-meta-row">
            <span className="gl-fmt-meta-key">Page No</span>
            <span className="gl-fmt-meta-sep">:</span>
            <span className="gl-fmt-meta-val">Page 1 of 1</span>
          </div>
        </div>
      </div>

      <div className="gl-fmt-divider" />

      {/* ── Report Table ── */}
      <table className="gl-fmt-table">
        <thead>
          <tr>
            <th className="gl-fmt-th gl-fmt-col-srno">SrNo</th>
            <th className="gl-fmt-th gl-fmt-col-glcode">Gl Code</th>
            <th className="gl-fmt-th gl-fmt-col-prodcode">Product Code</th>
            <th className="gl-fmt-th gl-fmt-col-glgroup">Gl Group</th>
            <th className="gl-fmt-th gl-fmt-col-prodname">Product Name</th>
            <th className="gl-fmt-th gl-fmt-col-lastno">Last No</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "" : "gl-fmt-row-alt"}>
              <td className="gl-fmt-td gl-fmt-col-srno">{index + 1}</td>
              <td className="gl-fmt-td gl-fmt-col-glcode">{row.GLCODE}</td>
              <td className="gl-fmt-td gl-fmt-col-prodcode">{row.SUBGLCODE}</td>
              <td className="gl-fmt-td gl-fmt-col-glgroup">{row.GLGROUP}</td>
              <td className="gl-fmt-td gl-fmt-col-prodname">{row.GLNAME}</td>
              <td className="gl-fmt-td gl-fmt-col-lastno">{fmt(row.LASTNO)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function GLReport() {
  const [reportName, setReportName] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [fetched, setFetched]       = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const reportRef = useRef(null);

  const fetchGLData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/gl-report/print`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setReportData(data);
      setFetched(true);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch GL Report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Print via popup window (same approach as ProfitAndLoss) ──────────────
  const handlePrint = async () => {
    if (!reportName.trim()) {
      setError("Please enter a report name.");
      return;
    }
    setActiveButton("print");
    let data = fetched ? reportData : await fetchGLData();
    if (!data || data.length === 0) return;

    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportName}</title>
          <style>
            @page { margin: 10mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10px; margin: 0; }
            .gl-formatted-report { padding: 0; }
            .gl-fmt-org-name {
              font-size: 13px; font-weight: 700; text-align: center;
              margin-bottom: 10px; color: #000;
            }
            .gl-fmt-meta-grid {
              display: flex; justify-content: space-between;
              margin-bottom: 6px; font-size: 10px;
            }
            .gl-fmt-meta-left, .gl-fmt-meta-right { display: flex; flex-direction: column; gap: 4px; }
            .gl-fmt-meta-row { display: flex; gap: 6px; }
            .gl-fmt-meta-key { font-weight: 600; min-width: 90px; }
            .gl-fmt-meta-sep { font-weight: 600; }
            .gl-fmt-meta-val { color: #000; }
            .gl-fmt-divider { border-top: 1px solid #000; margin: 8px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #999; padding: 4px 8px; text-align: left; }
            th { background: #f0f0f0; font-weight: 600; }
            .gl-fmt-col-srno { width: 5%; }
            .gl-fmt-col-glcode { width: 8%; }
            .gl-fmt-col-prodcode { width: 12%; }
            .gl-fmt-col-glgroup { width: 9%; }
            .gl-fmt-col-prodname { width: 52%; }
            .gl-fmt-col-lastno { width: 10%; text-align: right; }
            .gl-fmt-row-alt { background: #f9f9f9; }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // ── Text Report View (grid table, like PL "Show") ─────────────────────────
  const handleTextReportView = async () => {
    if (!reportName.trim()) {
      setError("Please enter a report name.");
      return;
    }
    setError("");
    setActiveButton("textView");
    await fetchGLData();
  };

  const showFormattedReport = activeButton === "print" && fetched && reportData.length > 0;
  const showGridReport      = activeButton === "textView" && fetched && reportData.length > 0;

  return (
    <div className="gl-wrapper">

      {/* ── Card ── */}
      <div className="gl-card">
        <div className="gl-header">
          <span>PRINT GL-REPORT</span>
        </div>

        <div className="gl-form-section">
          {/* Report Name Input */}
          <div className="gl-row">
            <label className="gl-label">Please Enter Report Name</label>
            <input
              type="text"
              className="gl-input"
              placeholder="Report Name"
              value={reportName}
              onChange={(e) => {
                setReportName(e.target.value);
                setFetched(false);
                setError("");
              }}
            />
          </div>

          {error  && <p className="gl-error">{error}</p>}
          {loading && <p className="gl-loading">Loading...</p>}

          {/* Buttons */}
          <div className="gl-btn-row">
            <button
              className="gl-btn gl-btn-blue"
              onClick={handlePrint}
              disabled={loading}
            >
              {loading && activeButton === "print" ? "Loading…" : "Print"}
            </button>
            <button
              className="gl-btn gl-btn-blue"
              onClick={handleTextReportView}
              disabled={loading}
            >
              {loading && activeButton === "textView" ? "Loading…" : "Text Report View"}
            </button>
          </div>
        </div>

        {/* ── Preview Panel ── */}
        <div className="gl-preview">
          {loading && <span className="gl-preview-empty">Loading...</span>}

          {!loading && !fetched && (
            <span className="gl-preview-empty">Preview area</span>
          )}

          {!loading && fetched && reportData.length === 0 && (
            <span className="gl-preview-empty">No records found.</span>
          )}

          {/* Formatted Report (Print button) */}
          {!loading && showFormattedReport && (
            <div className="gl-report-wrapper">
              <div className="gl-report-toolbar">
                <button className="gl-btn gl-btn-blue gl-btn-sm" onClick={() => {
                  if (reportRef.current) {
                    const printWindow = window.open("", "_blank");
                    printWindow.document.write(`
                      <html><head><title>${reportName}</title>
                      <style>
                        @page { margin: 10mm; }
                        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10px; margin: 0; }
                        .gl-fmt-org-name { font-size: 13px; font-weight: 700; text-align: center; margin-bottom: 10px; }
                        .gl-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 6px; }
                        .gl-fmt-meta-left, .gl-fmt-meta-right { display: flex; flex-direction: column; gap: 4px; }
                        .gl-fmt-meta-row { display: flex; gap: 6px; }
                        .gl-fmt-meta-key { font-weight: 600; min-width: 90px; }
                        .gl-fmt-divider { border-top: 1px solid #000; margin: 8px 0; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #999; padding: 4px 8px; text-align: left; }
                        th { background: #f0f0f0; font-weight: 600; }
                        .gl-fmt-col-lastno { text-align: right; }
                        .gl-fmt-row-alt { background: #f9f9f9; }
                      </style></head>
                      <body>${reportRef.current.innerHTML}</body></html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}>
                  🖨️ Print Report
                </button>
              </div>
              <div ref={reportRef}>
                <GLReportFormatted data={reportData} reportName={reportName} />
              </div>
            </div>
          )}

          {/* Grid / Text View */}
          {!loading && showGridReport && (
            <div className="gl-table-wrapper">
              <table className="gl-table">
                <thead>
                  <tr>
                    <th>SrNo</th>
                    <th>GL Code</th>
                    <th>Product Code</th>
                    <th>GL Group</th>
                    <th>Product Name</th>
                    <th>Last No</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{row.GLCODE}</td>
                      <td>{row.SUBGLCODE}</td>
                      <td>{row.GLGROUP}</td>
                      <td>{row.GLNAME}</td>
                      <td>{fmt(row.LASTNO)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="gl-record-count">Total Records: {reportData.length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GLReport;