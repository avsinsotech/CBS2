// import { useState } from "react";
// import "./BalanceSheet.css";

// function BalanceSheet() {
//   const [branchCode, setBranchCode] = useState("1");
//   const [reportType, setReportType] = useState("");

//   const reportOptions = ["As On Date", "N-Format", "Marathi BS", "N-Format Marathi BS"];

//   return (
//     <div className="bs-wrapper">
//       <div className="bs-card">

//         {/* HEADER */}
//         <div className="bs-header">BalanceSheet</div>

//         {/* FORM SECTION */}
//         <div className="bs-form-section">

//           {/* BRANCH CODE */}
//           <div className="bs-row">
//             <label className="bs-label">Branch Code</label>
//             <input
//               className="bs-input"
//               value={branchCode}
//               onChange={(e) => setBranchCode(e.target.value)}
//             />
//           </div>

//           {/* REPORT TYPE RADIOS — single row */}
//           <div className="bs-radio-row">
//             {reportOptions.map((opt) => (
//               <label key={opt} className="bs-radio-label">
//                 <input
//                   type="radio"
//                   name="reportType"
//                   value={opt}
//                   checked={reportType === opt}
//                   onChange={(e) => setReportType(e.target.value)}
//                 />
//                 {opt}
//               </label>
//             ))}
//           </div>

//         </div>

//         {/* PREVIEW PANEL */}
//         <div className="bs-preview">
//           <div className="bs-preview-empty">
//             {reportType ? `Preview: ${reportType}` : "Select a report type to preview"}
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="bs-footer">
//           <button className="bs-btn" onClick={() => window.print()}>Print</button>
//           <button className="bs-btn" onClick={() => alert(`View: ${reportType}`)}>View Report</button>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default BalanceSheet;

import { useState } from "react";
import "./BalanceSheet.css";

function BalanceSheet() {
  const [form, setForm] = useState({
    reportType: "As On Date",
    branchCode: "1",
    asOnDate: "30/03/2026",
    fromDate: "01/04/2025",
    toDate: "30/03/2026",
    skipBranchAdj: false,
    textReportName: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const reportOptions = ["As On Date", "N-Format", "Marathi BS", "N-Format Marathi BS"];

  // As On Date & Marathi BS → single date + 5 buttons
  // N-Format & N-Format Marathi BS → from/to date + 3 buttons
  const isSingleDate = form.reportType === "As On Date" || form.reportType === "Marathi BS";

  return (
    <div className="bs-wrapper">
      <div className="bs-card">

        {/* HEADER */}
        <div className="bs-header">BalanceSheet</div>

        {/* FORM SECTION */}
        <div className="bs-form-section">

          {/* BRANCH CODE */}
          <div className="bs-row">
            <label className="bs-label">Branch Code</label>
            <input className="bs-input" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* RADIO OPTIONS */}
          <div className="bs-radio-row">
            {reportOptions.map((opt) => (
              <label key={opt} className="bs-radio-label">
                <input type="radio" name="reportType" value={opt}
                  checked={form.reportType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>

          {/* CONDITIONAL DATE FIELDS */}
          {isSingleDate ? (
            <div className="bs-row">
              <label className="bs-label">As On Date</label>
              <input className="bs-input" name="asOnDate"
                value={form.asOnDate} onChange={handleChange} />
            </div>
          ) : (
            <div className="bs-row">
              <label className="bs-label">From Date</label>
              <input className="bs-input" name="fromDate"
                value={form.fromDate} onChange={handleChange} />
              <label className="bs-inline-label">To Date</label>
              <input className="bs-input" name="toDate"
                value={form.toDate} onChange={handleChange} />
            </div>
          )}

          {/* SKIP BRANCH ADJ CHECKBOX */}
          <div className="bs-row">
            <label className="bs-checkbox-label">
              <input type="checkbox" name="skipBranchAdj"
                checked={form.skipBranchAdj} onChange={handleChange} />
              SKIP_Branch ADJ
            </label>
          </div>

          {/* TEXT REPORT NAME */}
          <div className="bs-row">
            <label className="bs-label">Enter Text Report Name</label>
            <input className="bs-input bs-input-wide" name="textReportName"
              placeholder="Enter Text Report Name"
              value={form.textReportName} onChange={handleChange} />
          </div>

          {/* CONDITIONAL BUTTONS */}
          <div className="bs-btn-row">
            <button className="bs-btn" onClick={() => alert("Show")}>Show</button>
            <button className="bs-btn" onClick={() => alert("Balance Sheet Report")}>Balance Sheet Report</button>
            {isSingleDate && (
              <button className="bs-btn" onClick={() => alert("Report with Working Day")}>Report with Working Day</button>
            )}
            <button className="bs-btn" onClick={() => alert("Text Report View")}>Text Report View</button>
            {isSingleDate && (
              <button className="bs-btn" onClick={() => alert("Balancesheet Summary")}>Balancesheet Summary</button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default BalanceSheet;