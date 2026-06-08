import { useState } from "react";
import "./GeneralLedger.css";

function GeneralLedger() {
  const [form, setForm] = useState({
    glType: "",
    glCode: "",
    glName: "",
    subAccount: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert(`Submitted:\nGL Type: ${form.glType}\nGL Code: ${form.glCode}\nGL Name: ${form.glName}\nSub Account: ${form.subAccount}`);
  };

  return (
    <div className="gl-entry-wrapper">
      <div className="gl-entry-card">

        {/* HEADER */}
        <div className="gl-entry-header">
          <span>Genral Ledger Entry</span>
        </div>

        {/* BODY */}
        <div className="gl-entry-body">

          {/* ROW 1 — GL Type | GL Code */}
          <div className="gl-entry-grid">
            <div className="gl-entry-field">
              <label>GL Type</label>
              <select name="glType" value={form.glType} onChange={handleChange} className="gl-entry-select">
                <option value="">--Select--</option>
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>

            <div className="gl-entry-field">
              <label>GL Code</label>
              <input
                className="gl-entry-input"
                name="glCode"
                placeholder="GL Code"
                value={form.glCode}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ROW 2 — GL Name | Sub Account */}
          <div className="gl-entry-grid">
            <div className="gl-entry-field">
              <label>GL Name</label>
              <input
                className="gl-entry-input"
                name="glName"
                placeholder="GL Name"
                value={form.glName}
                onChange={handleChange}
              />
            </div>

            <div className="gl-entry-field">
              <label>Sub Account</label>
              <select name="subAccount" value={form.subAccount} onChange={handleChange} className="gl-entry-select">
                <option value="">--Select--</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="gl-entry-actions">
            <button className="gl-entry-btn" onClick={handleSubmit}>Submit</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default GeneralLedger;