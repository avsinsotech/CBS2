


import { useState, useEffect, useRef } from "react";
import "./BranchwiseGLReport.css";

const API_BASE_URL = "http://localhost:5000";

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ─── date helper ─────────────────────────────────────────────
// DD/MM/YYYY → YYYY-MM-DD  (what this backend expects per swagger)
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
  if (raw.includes("-")) return true; // Browser date input guarantees valid date
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return false;
  const [d, m] = parts.map(Number);
  return d >= 1 && d <= 31 && m >= 1 && m <= 12;
}

// ─── component ───────────────────────────────────────────────
function BranchwiseGLReport() {
  const [form, setForm] = useState({
    reportType:  "Details",
    branchCode:  "1",
    productType: "",
    productName: "",
    subGLCode:   "",
    fromDate:    "2025-04-01",
    toDate:      "2026-03-30",
  });

  const [reportData,   setReportData]   = useState([]);
  const [columns,      setColumns]      = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [fetched,      setFetched]      = useState(false);
  const [activeAction, setActiveAction] = useState("");
  const debounceRef = useRef(null);

  // Auto-fetch product name when productType changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const code = form.productType.trim();
    const brcd = form.branchCode.trim();
    if (!code || !brcd) {
      setForm(f => ({ ...f, productName: "" }));
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/gl-report/product-name?subglcode=${encodeURIComponent(code)}&brcd=${encodeURIComponent(brcd)}`);
        if (res.ok) {
          const data = await res.json();
          setForm(f => ({ ...f, productName: data.GLNAME || "" }));
        }
      } catch (e) {
        // silently fail
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [form.productType, form.branchCode]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFetched(false);
    setError("");
  };

  // ── validate ──────────────────────────────────────────────
  function validate(action) {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (!isValidDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
    if (!isValidDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";

    if (action === "Report Print" || action === "Opening Closing Details") {
      if (!form.productType.trim()) return "Product Type is required for Details report.";
    }
    if (action === "DateWise" || action === "Summary") {
      if (!form.subGLCode.trim()) return "Sub GL Code is required for DateWise / Summary.";
    }
    return null;
  }

  // ── build URL ─────────────────────────────────────────────
  function buildURL(action) {
    const fromISO = toISO(form.fromDate);
    const toISO_  = toISO(form.toDate);

    if (action === "Report Print") {
      const p = new URLSearchParams({
        Brcd: form.branchCode.trim(),
        pat:  form.productType.trim(),
        PFDT: fromISO,
        PTDT: toISO_,
      });
      return `${API_BASE_URL}/api/branch-wise-gl/details?${p}`;
    }

    if (action === "Opening Closing Details") {
      const p = new URLSearchParams({
        Brcd: form.branchCode.trim(),
        pat:  form.productType.trim(),
        PFDT: fromISO,
        PTDT: toISO_,
      });
      return `${API_BASE_URL}/api/branch-wise-gl/details-opening-closing?${p}`;
    }

    if (action === "DateWise") {
      const p = new URLSearchParams({
        Brcd:      form.branchCode.trim(),
        SubGlCode: form.subGLCode.trim(),
        FromDate:  fromISO,
        ToDate:    toISO_,
      });
      return `${API_BASE_URL}/api/branch-wise-gl/datewise?${p}`;
    }

    if (action === "Summary") {
      const p = new URLSearchParams({
        Brcd:      form.branchCode.trim(),
        SubGlCode: form.subGLCode.trim(),
        FromDate:  fromISO,
        ToDate:    toISO_,
      });
      return `${API_BASE_URL}/api/branch-wise-gl/summary?${p}`;
    }

    return null;
  }

  // ── fetch ─────────────────────────────────────────────────
  const callAPI = async (action) => {
    const validErr = validate(action);
    if (validErr) { setError(validErr); return null; }

    const url = buildURL(action);
    if (!url) { setError("Unknown action."); return null; }

    setLoading(true);
    setError("");
    setFetched(false);
    setActiveAction(action);

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
    const action = form.reportType === "Details" ? "Report Print"
                 : form.reportType === "DateWise" ? "DateWise"
                 : "Summary";
    const data = fetched ? reportData : await callAPI(action);
    if (data && data.length > 0) setTimeout(() => window.print(), 400);
  };

  // ── which fields to show ──────────────────────────────────
  const showProductFields = form.reportType === "Details";
  const showSubGLField    = form.reportType === "DateWise" || form.reportType === "Summary";

  return (
    <div className="bgl-wrapper">
      <div className="bgl-card no-print">
        <div className="bgl-header">BranchWise GL Report</div>

        <div className="bgl-form-section">

          {/* Report type radios */}
          <div className="bgl-radio-row">
            {["Details", "DateWise", "Summary"].map((opt) => (
              <label key={opt} className="bgl-radio-label">
                <input type="radio" name="reportType" value={opt}
                  checked={form.reportType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>

          {/* Branch Code */}
          <div className="bgl-row">
            <label className="bgl-label">Branch Code <span className="req">*</span></label>
            <input className="bgl-input bgl-input-shaded" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* Product Type + Name — Details only */}
          {showProductFields && (
            <div className="bgl-row">
              <label className="bgl-label">Product Type <span className="req">*</span></label>
              <input className="bgl-input" name="productType"
                placeholder="e.g. S" value={form.productType} onChange={handleChange} />
              <input className="bgl-input bgl-input-wide" name="productName"
                placeholder="Product Name (display only)" value={form.productName} readOnly />
            </div>
          )}

          {/* Sub GL Code — DateWise / Summary only */}
          {showSubGLField && (
            <div className="bgl-row">
              <label className="bgl-label">Sub GL Code <span className="req">*</span></label>
              <input className="bgl-input" name="subGLCode"
                placeholder="e.g. 101" value={form.subGLCode} onChange={handleChange} />
            </div>
          )}

          {/* From / To Date */}
          <div className="bgl-row">
            <label className="bgl-label">From Date <span className="req">*</span></label>
            <input type="date" className="bgl-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} />
            <label className="bgl-inline-label">To Date <span className="req">*</span></label>
            <input type="date" className="bgl-input" name="toDate"
              value={form.toDate} onChange={handleChange} />
          </div>

          {/* Error */}
          {error && <p className="bgl-error">{error}</p>}

          {/* Loading bar */}
          {loading && (
            <div className="bgl-loading-bar">
              <div className="bgl-loading-fill" />
            </div>
          )}

        </div>

        {/* Footer buttons */}
        <div className="bgl-footer">
          {form.reportType === "Details" && (
            <>
              <button className={`bgl-btn${activeAction === "Report Print" && fetched ? " bgl-btn-active" : ""}`}
                onClick={() => callAPI("Report Print")} disabled={loading}>
                {loading && activeAction === "Report Print" ? "Loading…" : "Report Print"}
              </button>
              <button className={`bgl-btn${activeAction === "Opening Closing Details" && fetched ? " bgl-btn-active" : ""}`}
                onClick={() => callAPI("Opening Closing Details")} disabled={loading}>
                {loading && activeAction === "Opening Closing Details" ? "Loading…" : "Opening Closing Details"}
              </button>
            </>
          )}
          {form.reportType === "DateWise" && (
            <button className={`bgl-btn${activeAction === "DateWise" && fetched ? " bgl-btn-active" : ""}`}
              onClick={() => callAPI("DateWise")} disabled={loading}>
              {loading && activeAction === "DateWise" ? "Loading…" : "DateWise Report"}
            </button>
          )}
          {form.reportType === "Summary" && (
            <button className={`bgl-btn${activeAction === "Summary" && fetched ? " bgl-btn-active" : ""}`}
              onClick={() => callAPI("Summary")} disabled={loading}>
              {loading && activeAction === "Summary" ? "Loading…" : "Summary Report"}
            </button>
          )}
          <button className="bgl-btn bgl-btn-print" onClick={handlePrint} disabled={loading}>
            Print
          </button>
        </div>
      </div>

      {/* Results table */}
      {fetched && reportData.length > 0 && (
        <div className="bgl-table-wrapper">
          <div className="print-only bgl-print-header">
            <h2>BranchWise GL Report — {form.reportType}</h2>
            <p>
              Branch: {form.branchCode} &nbsp;|&nbsp;
              From: {form.fromDate} &nbsp;|&nbsp;
              To: {form.toDate} &nbsp;|&nbsp;
              Date Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="bgl-table">
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

          <p className="bgl-record-count no-print">Total Records: {reportData.length}</p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="bgl-error no-print" style={{ margin: "16px" }}>
          No records found for the given criteria.
        </p>
      )}
    </div>
  );
}

export default BranchwiseGLReport;