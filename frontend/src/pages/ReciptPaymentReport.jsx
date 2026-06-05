

import { useState } from "react";
import "./ReciptPaymentReport.css";

const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function toISO(raw) {
  if (!raw) return null;
  if (raw.includes("-")) return raw; // already ISO format
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function isValidDate(raw) {
  if (!raw) return false;
  if (raw.includes("-")) return true; // browser date input
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return false;
  const [d, m] = parts.map(Number);
  return d >= 1 && d <= 31 && m >= 1 && m <= 12;
}

function ReciptPaymentReport() {
  const [form, setForm] = useState({
    branchCode: "1",
    fromDate: "2025-04-01",
    toDate: "2026-03-30",
  });

  const [reportData, setReportData] = useState([]);
  const [columns,    setColumns]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [fetched,    setFetched]    = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFetched(false);
    setError("");
  };

  const validate = () => {
    if (!form.branchCode.trim())     return "Branch Code is required.";
    if (!isValidDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
    if (!isValidDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
    return null;
  };

  const fetchData = async () => {
    const err = validate();
    if (err) { setError(err); return null; }

    const PFDT = toISO(form.fromDate);
    const PTDT = toISO(form.toDate);

    const params = new URLSearchParams({
      BRCD: form.branchCode.trim(),
      PFDT,
      PTDT,
    });

    const url = `${API_BASE_URL}/api/receipt-payment/report?${params}`;

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
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
    if (data && data.length > 0) setTimeout(() => window.print(), 400);
  };

  return (
    <div className="rpr-wrapper">
      <div className="rpr-card no-print">
        <div className="rpr-header">Receipt &amp; Payment Report</div>

        <div className="rpr-form-section">

          {/* Branch Code */}
          <div className="rpr-row">
            <label className="rpr-label">Branch Code</label>
            <input className="rpr-input rpr-input-shaded" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* From / To Date */}
          <div className="rpr-row">
            <label className="rpr-label">From Date</label>
            <input type="date" className="rpr-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} />
            <label className="rpr-inline-label">To Date</label>
            <input type="date" className="rpr-input" name="toDate"
              value={form.toDate} onChange={handleChange} />
          </div>

          {/* Error */}
          {error && <p className="rpr-error">{error}</p>}

          {/* Loading bar */}
          {loading && (
            <div className="rpr-loading-bar">
              <div className="rpr-loading-fill" />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="rpr-footer">
          <button className="rpr-btn" onClick={fetchData} disabled={loading}>
            {loading ? "Loading…" : "View Report"}
          </button>
          <button className="rpr-btn rpr-btn-print" onClick={handlePrint} disabled={loading}>
            Print Report
          </button>
        </div>
      </div>

      {/* Results table */}
      {fetched && reportData.length > 0 && (
        <div className="rpr-table-wrapper">
          <div className="print-only rpr-print-header">
            <h2>Receipt &amp; Payment Report</h2>
            <p>
              Branch: {form.branchCode} &nbsp;|&nbsp;
              From: {form.fromDate} &nbsp;|&nbsp;
              To: {form.toDate} &nbsp;|&nbsp;
              Date Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="rpr-table">
            <thead>
              <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => <td key={col}>{typeof row[col] === 'number' ? fmt(row[col]) : (row[col] ?? "")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="rpr-record-count no-print">Total Records: {reportData.length}</p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="rpr-error no-print" style={{ margin: "16px" }}>
          No records found for the given criteria.
        </p>
      )}
    </div>
  );
}

export default ReciptPaymentReport;