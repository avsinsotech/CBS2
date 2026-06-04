import { useState } from "react";
import "./ReciptPaymentReport.css";

function ReciptPaymentReport() {
  const [form, setForm] = useState({
    branchCode: "1",
    fromDate: "01/04/2025",
    toDate: "30/03/2026"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="rpr-wrapper">
      <div className="rpr-card">

        {/* HEADER */}
        <div className="rpr-header">Recepit &amp; Payment Report</div>

        {/* FORM SECTION */}
        <div className="rpr-form-section">

          {/* BRANCH CODE */}
          <div className="rpr-row">
            <label className="rpr-label">Branch Code</label>
            <input className="rpr-input rpr-input-shaded" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* FROM DATE + TO DATE */}
          <div className="rpr-row">
            <label className="rpr-label">From Date</label>
            <input className="rpr-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} />
            <label className="rpr-inline-label">To Date</label>
            <input className="rpr-input" name="toDate"
              value={form.toDate} onChange={handleChange} />
          </div>

        </div>

        {/* FOOTER */}
        <div className="rpr-footer">
          <button className="rpr-btn" onClick={() => window.print()}>Print Report</button>
        </div>

      </div>
    </div>
  );
}

export default ReciptPaymentReport;