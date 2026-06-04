import { useState } from "react";
import "./BranchwiseGLReport.css";

function BranchwiseGLReport() {
  const [form, setForm] = useState({
    reportType: "",
    branchCode: "1",
    productType: "",
    productName: "",
    fromDate: "01/04/2025",
    toDate: "30/03/2026"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bgl-wrapper">
      <div className="bgl-card">

        {/* HEADER */}
        <div className="bgl-header">BranchWise GL Report</div>

        {/* FORM SECTION */}
        <div className="bgl-form-section">

          {/* REPORT TYPE RADIOS */}
          <div className="bgl-radio-row">
            {["Details", "DateWise", "Summary"].map((opt) => (
              <label key={opt} className="bgl-radio-label">
                <input type="radio" name="reportType" value={opt}
                  checked={form.reportType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>

          {/* BRANCH CODE */}
          <div className="bgl-row">
            <label className="bgl-label">Branch Code : <span className="req">*</span></label>
            <input className="bgl-input bgl-input-shaded" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* PRODUCT TYPE + PRODUCT NAME */}
          <div className="bgl-row">
            <label className="bgl-label">Product Type : <span className="req">*</span></label>
            <input className="bgl-input" name="productType"
              placeholder="Product Type" value={form.productType} onChange={handleChange} />
            <input className="bgl-input bgl-input-wide" name="productName"
              placeholder="Product Name" value={form.productName} onChange={handleChange} />
          </div>

          {/* FROM DATE + TO DATE */}
          <div className="bgl-row">
            <label className="bgl-label">From Date : <span className="req">*</span></label>
            <input className="bgl-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} />
            <label className="bgl-inline-label">To Date : <span className="req">*</span></label>
            <input className="bgl-input" name="toDate"
              value={form.toDate} onChange={handleChange} />
          </div>

        </div>

        {/* FOOTER */}
        <div className="bgl-footer">
          <button className="bgl-btn" onClick={() => window.print()}>Report Print</button>
          {form.reportType === "Details" && (
            <button className="bgl-btn" onClick={() => alert("Opening Closing Details")}>
              Opening Closing Details
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default BranchwiseGLReport;