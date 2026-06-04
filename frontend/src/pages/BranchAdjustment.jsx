import { useState } from "react";
import "./BranchAdjustment.css";

function BranchAdjustment() {
  const [form, setForm] = useState({
    branchCode: "1",
    fromDate: "01/04/2025",
    toDate: "30/03/2026",
    textReportName: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="ba-wrapper">
      <div className="ba-card">

        {/* HEADER */}
        <div className="ba-header">Branch Adjusment Report</div>

        {/* FORM SECTION */}
        <div className="ba-form-section">

          {/* BRANCH CODE */}
          <div className="ba-row">
            <label className="ba-label">Branch Code : <span className="req">*</span></label>
            <input className="ba-input" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* FROM DATE + TO DATE */}
          <div className="ba-row">
            <label className="ba-label">From Date : <span className="req">*</span></label>
            <input className="ba-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} />
            <label className="ba-inline-label">To Date : <span className="req">*</span></label>
            <input className="ba-input" name="toDate"
              value={form.toDate} onChange={handleChange} />
          </div>

          {/* TEXT REPORT NAME */}
          <div className="ba-row">
            <label className="ba-label">Enter Text Report Name : <span className="req">*</span></label>
            <input className="ba-input ba-input-wide" name="textReportName"
              placeholder="Enter Text Report Name"
              value={form.textReportName} onChange={handleChange} />
          </div>

        </div>

        {/* FOOTER */}
        <div className="ba-footer">
          <button className="ba-btn" onClick={() => window.print()}>Report Print</button>
          <button className="ba-btn" onClick={() => alert(`Text Report: ${form.textReportName}`)}>Text Report View</button>
        </div>

      </div>
    </div>
  );
}

export default BranchAdjustment;