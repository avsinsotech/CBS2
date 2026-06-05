

import { useState } from "react";
import "./ACBalanceRegister.css";

const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function ACBalanceRegister() {
  const [form, setForm] = useState({
    branchCode: "1",
    glCode: "",
    subGLCode: "",
    asOnDate: "2025-04-01",
    textReportName: ""
  });

  const [reportData, setReportData]   = useState([]);
  const [columns, setColumns]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [fetched, setFetched]         = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFetched(false);
  };

  // Convert DD/MM/YYYY  or  DD/MM/YY  →  YYYY-MM-DD for the API
  const parseDate = (raw) => {
    if (!raw) return null;
    if (raw.includes("-")) return raw; // already ISO format
    const parts = raw.trim().split("/");
    if (parts.length !== 3) return null;
    let [d, m, y] = parts;
    if (y.length === 2) y = "20" + y;
    if (d.length < 2) d = d.padStart(2, "0");
    if (m.length < 2) m = m.padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const validate = () => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (!form.glCode.trim())     return "GL Code is required.";
    if (!form.asOnDate.trim())   return "As On Date is required.";
    const isoDate = parseDate(form.asOnDate);
    if (!isoDate)                return "As On Date must be in DD/MM/YYYY format.";
    return null;
  };

  const fetchData = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const isoDate = parseDate(form.asOnDate);
      const params  = new URLSearchParams({
        branchCode: form.branchCode.trim(),
        glCode:     form.glCode.trim(),
        asOnDate:   isoDate
      });

      const res = await fetch(`${API_BASE_URL}/api/balance-register?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.length > 0) {
        setColumns(Object.keys(data[0]));
      } else {
        setColumns([]);
      }

      setReportData(data);
      setFetched(true);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    const data = fetched ? reportData : await fetchData();
    if (data && data.length > 0) {
      setTimeout(() => window.print(), 300);
    }
  };

  const handleTextReportView = async () => {
    await fetchData();
  };

  return (
    <div className="acb-wrapper">
      <div className="acb-card no-print">

        <div className="acb-header">
          <span>Account Bal Report</span>
        </div>

        <div className="acb-body">

          {/* ROW 1 */}
          <div className="acb-row">
            <div className="acb-field">
              <label>Branch Code</label>
              <input name="branchCode" value={form.branchCode} onChange={handleChange} />
            </div>
            <div className="acb-field">
              <label>GL Code</label>
              <input name="glCode" value={form.glCode} onChange={handleChange} placeholder="e.g. 1" />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="acb-row">
            <div className="acb-field">
              <label>Sub GL Code</label>
              <input name="subGLCode" value={form.subGLCode} onChange={handleChange} placeholder="Optional" />
            </div>
            <div className="acb-field">
              <label>As On Date</label>
              <input type="date" name="asOnDate" value={form.asOnDate} onChange={handleChange} />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="acb-row">
            <div className="acb-field">
              <label>Text Report Name</label>
              <input name="textReportName" value={form.textReportName} onChange={handleChange} />
            </div>
          </div>

          {/* ERROR / LOADING */}
          {error   && <p className="acb-error">{error}</p>}
          {loading && <p className="acb-loading">Loading...</p>}

          {/* BUTTONS */}
          <div className="acb-footer">
            <button
              className="acb-btn acb-btn-print"
              onClick={handlePrint}
              disabled={loading}
            >
              {loading ? "Loading..." : "Print"}
            </button>
            <button
              className="acb-btn acb-btn-view"
              onClick={handleTextReportView}
              disabled={loading}
            >
              {loading ? "Loading..." : "Text Report View"}
            </button>
          </div>

        </div>
      </div>

      {/* REPORT TABLE */}
      {fetched && reportData.length > 0 && (
        <div className="acb-table-wrapper">

          {/* Print header — only visible on print */}
          <div className="print-only acb-print-header">
            <h2>{form.textReportName || "Account Balance Register"}</h2>
            <p>
              Branch: {form.branchCode} &nbsp;|&nbsp;
              GL Code: {form.glCode} &nbsp;|&nbsp;
              As On Date: {form.asOnDate} &nbsp;|&nbsp;
              Date Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="acb-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col}>{typeof row[col] === 'number' ? fmt(row[col]) : (row[col] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="acb-record-count no-print">
            Total Records: {reportData.length}
          </p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="acb-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default ACBalanceRegister;