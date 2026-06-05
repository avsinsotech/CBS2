

import { useState } from "react";
import "./BranchAdjustment.css";

// const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
function BranchAdjustment() {
  const [form, setForm] = useState({
    branchCode: "1",
    fromDate: "01/04/2025",
    toDate: "30/03/2026",
    textReportName: ""
  });

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [fetched, setFetched]       = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFetched(false);
  };

  // Convert DD/MM/YYYY or DD/MM/YY → YYYY-MM-DD for the API
  const parseDate = (raw) => {
    const parts = raw.trim().split("/");
    if (parts.length !== 3) return null;
    let [d, m, y] = parts;
    if (y.length === 2) y = "20" + y;
    if (d.length < 2) d = d.padStart(2, "0");
    if (m.length < 2) m = m.padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Extract month (MM) and year (YYYY) from a parsed YYYY-MM-DD string
  const extractMonthYear = (isoDate) => {
    const [year, month] = isoDate.split("-");
    return { month, year };
  };

  const validate = () => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (!form.fromDate.trim())   return "From Date is required.";
    if (!form.toDate.trim())     return "To Date is required.";
    if (!parseDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
    if (!parseDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
    return null;
  };

  const fetchData = async (endpoint) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const isoFrom = parseDate(form.fromDate);
      const isoTo   = parseDate(form.toDate);
      const { month: PFMONTH, year: PFYEAR } = extractMonthYear(isoFrom);
      const { month: ptmonth, year: ptyear } = extractMonthYear(isoTo);

      const params = new URLSearchParams({
        Brcd:    form.branchCode.trim(),
        PFMONTH,
        ptmonth,
        PFDT:    isoFrom,
        PTDT:    isoTo,
        PFYEAR,
        ptyear
      });

      const res = await fetch(`${API_BASE_URL}/api/branch-adjustment/${endpoint}?${params}`);
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

  const handleReportPrint = async () => {
    const data = fetched ? reportData : await fetchData("report-print");
    if (data && data.length > 0) {
      setTimeout(() => window.print(), 300);
    }
  };

  const handleTextReportView = async () => {
    await fetchData("text-report-view");
  };

  return (
    <div className="ba-wrapper">
      <div className="ba-card no-print">

        <div className="ba-header">
          <span>Branch Adjustment Report</span>
        </div>

        <div className="ba-body">

          {/* ROW 1 */}
          <div className="ba-row">
            <div className="ba-field">
              <label>Branch Code <span className="req">*</span></label>
              <input name="branchCode" value={form.branchCode} onChange={handleChange} />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="ba-row">
            <div className="ba-field">
              <label>From Date <span className="req">*</span></label>
              <input name="fromDate" value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
            </div>
            <div className="ba-field">
              <label>To Date <span className="req">*</span></label>
              <input name="toDate" value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="ba-row">
            <div className="ba-field ba-field-wide">
              <label>Text Report Name</label>
              <input
                name="textReportName"
                value={form.textReportName}
                onChange={handleChange}
                placeholder="Enter Text Report Name"
              />
            </div>
          </div>

          {/* ERROR / LOADING */}
          {error   && <p className="ba-error">{error}</p>}
          {loading && <p className="ba-loading">Loading...</p>}

          {/* BUTTONS */}
          <div className="ba-footer">
            <button
              className="ba-btn ba-btn-print"
              onClick={handleReportPrint}
              disabled={loading}
            >
              {loading ? "Loading..." : "Report Print"}
            </button>
            <button
              className="ba-btn ba-btn-view"
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
        <div className="ba-table-wrapper">

          {/* Print header — only visible on print */}
          <div className="print-only ba-print-header">
            <h2>{form.textReportName || "Branch Adjustment Report"}</h2>
            <p>
              Branch: {form.branchCode} &nbsp;|&nbsp;
              From Date: {form.fromDate} &nbsp;|&nbsp;
              To Date: {form.toDate} &nbsp;|&nbsp;
              Date Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="ba-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>{row[col] ?? ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="ba-record-count no-print">
            Total Records: {reportData.length}
          </p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="ba-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default BranchAdjustment;