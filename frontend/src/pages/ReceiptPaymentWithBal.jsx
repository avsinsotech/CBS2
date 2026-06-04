import { useState } from "react";
import "./ReceiptPaymentWithBal.css";

function ReceiptPaymentWithBal() {
  const [form, setForm] = useState({
    selectType: "Skip Data",
    branchCode: "1",
    fromDate: "01/04/2025",
    toDate: "30/03/2026"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="rpb-wrapper">
      <div className="rpb-card">

        {/* HEADER */}
        <div className="rpb-header">Receipt &amp; Payment With Balance Report</div>

        {/* FORM SECTION */}
        <div className="rpb-form-section">

          {/* SELECT TYPE */}
          <div className="rpb-row">
            <label className="rpb-label">Select Type : <span className="req">*</span></label>
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

          {/* BRANCH CODE */}
          <div className="rpb-row">
            <label className="rpb-label">Branch Code</label>
            <input className="rpb-input" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* FROM DATE + TO DATE */}
          <div className="rpb-row">
            <label className="rpb-label">From Date</label>
            <input className="rpb-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} />
            <label className="rpb-inline-label">To Date</label>
            <input className="rpb-input" name="toDate"
              value={form.toDate} onChange={handleChange} />
          </div>

        </div>

        {/* FOOTER */}
        <div className="rpb-footer">
          <button className="rpb-btn" onClick={() => window.print()}>Print Report</button>
        </div>

      </div>
    </div>
  );
}

export default ReceiptPaymentWithBal;