

import { useState } from "react";
import "./TrialBalance.css";

const API_BASE = "https://cbsapi.avsinsotech.com:8596/api/trial-balance";

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Helper: convert dd/mm/yyyy → yyyy-mm-dd for the backend
function toISO(ddmmyyyy) {
  if (!ddmmyyyy) return "";
  if (ddmmyyyy.includes("-")) return ddmmyyyy; // already ISO format
  const parts = ddmmyyyy.split("/");
  if (parts.length !== 3) return ddmmyyyy;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function TrialBalance() {
  const [form, setForm] = useState({
    reportType: "Details Wise",
    branchCode: "1",
    toDate: "2026-03-30",
    fromDate: "2025-04-01",
    sortType: "Code Wise",
    textReportName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFromTo = form.reportType === "FromTo";

  // ── Submit: call backend ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");
    setTableData([]);

    // Validation
    if (!form.branchCode || !form.toDate) {
      setError("Branch Code and To Date are required.");
      return;
    }
    if (isFromTo && !form.fromDate) {
      setError("From Date is required for FromTo report.");
      return;
    }

    // For non-FromTo report types, use toDate as both fromDate and toDate
    const fromDateISO = isFromTo ? toISO(form.fromDate) : toISO(form.toDate);
    const toDateISO = toISO(form.toDate);
    const codeOrName = form.sortType === "Code Wise" ? "C" : "N";

    const params = new URLSearchParams({
      branchCode: form.branchCode,
      fromDate: fromDateISO,
      toDate: toDateISO,
      codeOrName,
    });

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/report?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setTableData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Table columns derived from first row ─────────────────────────────────
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="tb-wrapper">
      <div className="tb-card">

        {/* HEADER */}
        <div className="tb-header">Trial Balance Report</div>

        {/* TOP RADIO SECTION */}
        <div className="tb-radio-section">
          <div className="tb-radio-row">
            {["Details Wise", "Summary Wise", "AsOnDate", "FromTo"].map((opt) => (
              <label key={opt} className="tb-radio-label">
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

        {/* FIELDS SECTION */}
        <div className="tb-fields-section">

          <div className="tb-fields-row">
            <div className="tb-field">
              <label>Branch Code <span className="req">*</span></label>
              <input
                className="tb-input"
                name="branchCode"
                value={form.branchCode}
                onChange={handleChange}
              />
            </div>
            <div className="tb-field">
              <label>To Date <span className="req">*</span></label>
              <input
                type="date"
                className="tb-input"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
              />
            </div>
            {isFromTo && (
              <div className="tb-field">
                <label>From Date <span className="req">*</span></label>
                <input
                  type="date"
                  className="tb-input"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* SORT TYPE RADIOS */}
          <div className="tb-inline-radio-row">
            {["Code Wise", "Name Wise"].map((opt) => (
              <label key={opt} className="tb-radio-label">
                <input
                  type="radio"
                  name="sortType"
                  value={opt}
                  checked={form.sortType === opt}
                  onChange={handleChange}
                />
                {opt}
              </label>
            ))}
          </div>

          {/* TEXT REPORT NAME */}
          <div className="tb-field tb-field-full">
            <label>Please enter text report name <span className="req">*</span></label>
            <input
              className="tb-input tb-input-wide"
              name="textReportName"
              placeholder="Please enter text report name"
              value={form.textReportName}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="tb-error">{error}</div>
        )}

        {/* FOOTER BUTTONS */}
        <div className="tb-footer">
          <button
            className="tb-btn tb-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading…" : "Submit"}
          </button>
          {["Lazer", "Text", "Text Report View", "TB Format1"].map((btn) => (
            <button key={btn} className="tb-btn" onClick={() => alert(btn)}>
              {btn}
            </button>
          ))}
        </div>

        {/* RESULTS TABLE */}
        {tableData.length > 0 && (
          <div className="tb-table-wrapper">
            <table className="tb-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                    <td key={col}>{typeof row[col] === 'number' ? fmt(row[col]) : (row[col] ?? "")}</td>
                  ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && tableData.length === 0 && !error && (
          <div className="tb-empty">No data. Submit the form to load the report.</div>
        )}

      </div>
    </div>
  );
}

export default TrialBalance;