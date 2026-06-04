// import { useState } from "react";
// import "./GLReport.css";

// function GLReport() {
//   const [reportName, setReportName] = useState("");

//   const handlePrint = () => {
//     if (!reportName.trim()) {
//       alert("Please enter a report name.");
//       return;
//     }
//     window.print();
//   };

//   const handleTextReportView = () => {
//     if (!reportName.trim()) {
//       alert("Please enter a report name.");
//       return;
//     }
//     alert(`Viewing text report: ${reportName}`);
//   };

//   return (
//     <div className="gl-report-wrapper">

//       {/* CARD */}
//       <div className="gl-report-card">

//         {/* HEADER */}
//         <div className="gl-report-header">
//           <span>PRINT GL-REPORT</span>
//         </div>

//         {/* BODY */}
//         <div className="gl-report-body">

//           <div className="gl-report-row">
//             <label className="gl-report-label">Please Enter Report Name</label>
//             <input
//               type="text"
//               className="gl-report-input"
//               placeholder="ReportName"
//               value={reportName}
//               onChange={(e) => setReportName(e.target.value)}
//             />
//           </div>

//           {/* FOOTER BUTTONS */}
//           <div className="gl-report-footer">
//             <button className="gl-btn gl-btn-print" onClick={handlePrint}>
//               Print
//             </button>
//             <button className="gl-btn gl-btn-view" onClick={handleTextReportView}>
//               Text Report View
//             </button>
//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default GLReport;
import { useState } from "react";
import "./GLReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function GLReport() {
  const [reportName, setReportName] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const fetchGLData = async () => {
    if (!reportName.trim()) {
      alert("Please enter a report name.");
      return null;
    }
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

  const handlePrint = async () => {
    const data = fetched ? reportData : await fetchGLData();
    if (data && data.length > 0) {
      setTimeout(() => window.print(), 300);
    }
  };

  const handleTextReportView = async () => {
    await fetchGLData();
  };

  return (
    <div className="gl-report-wrapper">

      {/* CARD — hidden during print */}
      <div className="gl-report-card no-print">
        <div className="gl-report-header">
          <span>PRINT GL-REPORT</span>
        </div>

        <div className="gl-report-body">
          <div className="gl-report-row">
            <label className="gl-report-label">Please Enter Report Name</label>
            <input
              type="text"
              className="gl-report-input"
              placeholder="ReportName"
              value={reportName}
              onChange={(e) => {
                setReportName(e.target.value);
                setFetched(false); // re-fetch if name changes
              }}
            />
          </div>

          {error && <p className="gl-report-error">{error}</p>}
          {loading && <p className="gl-report-loading">Loading...</p>}

          <div className="gl-report-footer">
            <button
              className="gl-btn gl-btn-print"
              onClick={handlePrint}
              disabled={loading}
            >
              {loading ? "Loading..." : "Print"}
            </button>
            <button
              className="gl-btn gl-btn-view"
              onClick={handleTextReportView}
              disabled={loading}
            >
              {loading ? "Loading..." : "Text Report View"}
            </button>
          </div>
        </div>
      </div>

      {/* REPORT TABLE — visible always once fetched, and during print */}
      {fetched && reportData.length > 0 && (
        <div className="gl-report-table-wrapper">

          {/* Print header (only shows during print) */}
          <div className="print-only gl-print-header">
            <h2>{reportName}</h2>
            <p>GL Report &nbsp;|&nbsp; Date: {new Date().toLocaleDateString()}</p>
          </div>

          <table className="gl-table">
            <thead>
              <tr>
                <th>GL Code</th>
                <th>Sub GL Code</th>
                <th>GL Group</th>
                <th>GL Name</th>
                <th>Last No</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  <td>{row.GLCODE}</td>
                  <td>{row.SUBGLCODE}</td>
                  <td>{row.GLGROUP}</td>
                  <td>{row.GLNAME}</td>
                  <td>{row.LASTNO}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="gl-record-count no-print">
            Total Records: {reportData.length}
          </p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="gl-report-error no-print">No records found.</p>
      )}
    </div>
  );
}

export default GLReport;