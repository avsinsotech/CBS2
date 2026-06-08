

import { useState } from "react";
import "./TrialBalance.css";

const API_BASE = (import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596") + "/api/trial-balance";
// Helper: convert dd/mm/yyyy → yyyy-mm-dd for the backend
function toISO(ddmmyyyy) {
  if (!ddmmyyyy) return "";
  const parts = ddmmyyyy.split("/");
  if (parts.length !== 3) return ddmmyyyy;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function TrialBalance() {
  const [form, setForm] = useState({
    reportType: "Details Wise",
    branchCode: "1",
    toDate: "30/03/2026",
    fromDate: "",
    sortType: "Code Wise",
    textReportName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const [currentFlag, setCurrentFlag] = useState("SUBMIT");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFromTo = form.reportType === "FromTo";

  // ── Submit: call backend ──────────────────────────────────────────────────
  const handleSubmit = async (flag = "SUBMIT") => {
    setError("");
    setTableData([]);
    setCurrentFlag(flag);

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
      flag,
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

  // ── Text Format handlers ──────────────────────────────────────────────────
  const handleTextDownload = () => {
    if (!form.branchCode || !form.toDate) {
      setError("Branch Code and To Date are required for text generation.");
      return;
    }
    if (isFromTo && !form.fromDate) {
      setError("From Date is required for FromTo report.");
      return;
    }
    const fromDateISO = isFromTo ? toISO(form.fromDate) : toISO(form.toDate);
    const toDateISO = toISO(form.toDate);
    const codeOrName = form.sortType === "Code Wise" ? "C" : "N";

    const params = new URLSearchParams({
      branchCode: form.branchCode,
      fromDate: fromDateISO,
      toDate: toDateISO,
      codeOrName,
      flag: currentFlag,
      mode: "download",
      textReportName: form.textReportName || "trial_balance",
    });
    window.open(`${API_BASE}/report?${params.toString()}`, "_blank");
  };

  const handleTextReportView = () => {
    if (!form.branchCode || !form.toDate) {
      setError("Branch Code and To Date are required for text generation.");
      return;
    }
    if (isFromTo && !form.fromDate) {
      setError("From Date is required for FromTo report.");
      return;
    }
    const fromDateISO = isFromTo ? toISO(form.fromDate) : toISO(form.toDate);
    const toDateISO = toISO(form.toDate);
    const codeOrName = form.sortType === "Code Wise" ? "C" : "N";

    const params = new URLSearchParams({
      branchCode: form.branchCode,
      fromDate: fromDateISO,
      toDate: toDateISO,
      codeOrName,
      flag: currentFlag,
      mode: "text",
      textReportName: form.textReportName || "trial_balance",
    });
    window.open(`${API_BASE}/report?${params.toString()}`, "_blank");
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
                className="tb-input"
                name="toDate"
                placeholder="dd/mm/yyyy"
                value={form.toDate}
                onChange={handleChange}
              />
            </div>
            {isFromTo && (
              <div className="tb-field">
                <label>From Date <span className="req">*</span></label>
                <input
                  className="tb-input"
                  name="fromDate"
                  placeholder="dd/mm/yyyy"
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
            onClick={() => handleSubmit("SUBMIT")}
            disabled={loading}
          >
            {loading && currentFlag === "SUBMIT" ? "Loading…" : "Submit"}
          </button>
          <button
            className="tb-btn"
            onClick={() => handleSubmit("LAZER")}
            disabled={loading}
          >
            {loading && currentFlag === "LAZER" ? "Loading…" : "Lazer"}
          </button>
          <button
            className="tb-btn"
            onClick={handleTextDownload}
            disabled={loading}
          >
            Text
          </button>
          <button
            className="tb-btn"
            onClick={handleTextReportView}
            disabled={loading}
          >
            Text Report View
          </button>
          <button
            className="tb-btn"
            onClick={() => handleSubmit("TB_FORMAT1")}
            disabled={loading}
          >
            {loading && currentFlag === "TB_FORMAT1" ? "Loading…" : "TB Format1"}
          </button>
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
                      <td key={col}>{row[col] ?? ""}</td>
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