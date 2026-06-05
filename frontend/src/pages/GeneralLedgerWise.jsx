

import { useState, useEffect, useRef } from "react";
import "./GeneralLedgerWise.css";

const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// DD/MM/YYYY → YYYY-MM-DD
const parseDate = (raw) => {
  if (!raw) return null;
  if (raw.includes("-")) return raw; // already YYYY-MM-DD format
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`;
};

function GeneralLedgerWise() {
  const [form, setForm] = useState({
    reportType:       "Details",
    productType:      "Sub Type",
    branchCode:       "1",
    productTypeInput: "",
    productName:      "",
    fromDate:         "2025-04-01",
    toDate:           "2026-03-30"
  });

  const [reportData, setReportData] = useState([]);
  const [columns,    setColumns]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [fetched,    setFetched]    = useState(false);
  const [printMode,  setPrintMode]  = useState(""); // "report" | "summary"
  const debounceRef = useRef(null);

  // Auto-fetch product name when productTypeInput changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const code = form.productTypeInput.trim();
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
  }, [form.productTypeInput, form.branchCode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFetched(false);
  };

  const validate = () => {
    if (!form.branchCode.trim())       return "Branch Code is required.";
    if (!form.productTypeInput.trim()) return "Product Type is required.";
    if (!form.fromDate.trim())         return "From Date is required.";
    if (!form.toDate.trim())           return "To Date is required.";
    if (!parseDate(form.fromDate))     return "From Date must be DD/MM/YYYY.";
    if (!parseDate(form.toDate))       return "To Date must be DD/MM/YYYY.";
    return null;
  };

  // Build query params based on which SP is needed
  const buildParams = (mode) => {
    const PFDT   = parseDate(form.fromDate);
    const PTDT   = parseDate(form.toDate);
    const isMain = form.productType === "Main Type" ? "Y" : "N";

    // SP_OFFICEACCSTATUS_R params (Details for both Report & Summary,
    // plus Day Wise & Month Wise for Summary)
    const officeParams = new URLSearchParams({
      pfmonth:    PFDT.slice(5, 7),
      ptmonth:    PTDT.slice(5, 7),
      PFDT,
      PTDT,
      pfyear:     PFDT.slice(0, 4),
      ptyear:     PTDT.slice(0, 4),
      pat:        form.productTypeInput.trim(),
      BRCD:       form.branchCode.trim(),
      isMainType: isMain
    });

    // RptGLWiseTransDetails / RptGLWiseTransMonthWise params
    const glWiseParams = new URLSearchParams({
      Brcd:       form.branchCode.trim(),
      SubGlCode:  form.productTypeInput.trim(),
      FromDate:   PFDT,
      ToDate:     PTDT,
      isMainType: isMain
    });

    if (mode === "report") {
      if (form.reportType === "Details")    return { url: "/api/product-wise-summary/report/details",    params: officeParams };
      if (form.reportType === "Day Wise")   return { url: "/api/product-wise-summary/report/day-wise",   params: glWiseParams };
      if (form.reportType === "Month Wise") return { url: "/api/product-wise-summary/report/month-wise", params: glWiseParams };
    } else {
      if (form.reportType === "Details")    return { url: "/api/product-wise-summary/summary/details",    params: officeParams };
      if (form.reportType === "Day Wise")   return { url: "/api/product-wise-summary/summary/day-wise",   params: officeParams };
      if (form.reportType === "Month Wise") return { url: "/api/product-wise-summary/summary/month-wise", params: officeParams };
    }
  };

  const fetchData = async (mode) => {
    const validationError = validate();
    if (validationError) { setError(validationError); return null; }

    setLoading(true);
    setError("");
    setPrintMode(mode);

    try {
      const { url, params } = buildParams(mode);
      const res  = await fetch(`${API_BASE_URL}${url}?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }

      const json = await res.json();
      // Both response shapes: { total, data: [...] }  or  plain array
      const rows = Array.isArray(json) ? json : (json.data || []);

      setColumns(rows.length > 0 ? Object.keys(rows[0]) : []);
      setReportData(rows);
      setFetched(true);
      return rows;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleReportPrint = async () => {
    const data = (fetched && printMode === "report") ? reportData : await fetchData("report");
    if (data && data.length > 0) setTimeout(() => window.print(), 300);
  };

  const handleSummaryPrint = async () => {
    const data = (fetched && printMode === "summary") ? reportData : await fetchData("summary");
    if (data && data.length > 0) setTimeout(() => window.print(), 300);
  };

  return (
    <div className="glw-wrapper">
      <div className="glw-card no-print">

        {/* HEADER */}
        <div className="glw-header">
          <span>Product Wise Summary</span>
        </div>

        {/* BODY */}
        <div className="glw-body">

          {/* REPORT TYPE */}
          <div className="glw-row">
            <label className="glw-label">Report Type : <span className="req">*</span></label>
            <div className="glw-radio-group">
              {["Details", "Day Wise", "Month Wise"].map((opt) => (
                <label key={opt} className="glw-radio-label">
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

          {/* PRODUCT TYPE RADIO */}
          <div className="glw-row">
            <label className="glw-label">Product Type : <span className="req">*</span></label>
            <div className="glw-radio-group">
              {["Main Type", "Sub Type"].map((opt) => (
                <label key={opt} className="glw-radio-label">
                  <input
                    type="radio"
                    name="productType"
                    value={opt}
                    checked={form.productType === opt}
                    onChange={handleChange}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* BRANCH CODE */}
          <div className="glw-row">
            <label className="glw-label">Branch Code : <span className="req">*</span></label>
            <input
              className="glw-input glw-input-short glw-input-shaded"
              name="branchCode"
              value={form.branchCode}
              onChange={handleChange}
            />
          </div>

          {/* PRODUCT TYPE INPUT + PRODUCT NAME */}
          <div className="glw-row">
            <label className="glw-label">Product Type : <span className="req">*</span></label>
            <div className="glw-inline-pair">
              <input
                className="glw-input"
                name="productTypeInput"
                placeholder="Product Type"
                value={form.productTypeInput}
                onChange={handleChange}
              />
              <input
                className="glw-input glw-input-wide"
                name="productName"
                placeholder="Product Name"
                value={form.productName}
                readOnly
              />
            </div>
          </div>

          {/* FROM DATE + TO DATE */}
          <div className="glw-row">
            <label className="glw-label">From Date : <span className="req">*</span></label>
            <div className="glw-inline-pair">
              <input
                type="date"
                className="glw-input"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
              />
              <label className="glw-inline-label">To Date : <span className="req">*</span></label>
              <input
                type="date"
                className="glw-input"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ERROR / LOADING */}
          {error   && <p className="glw-error">{error}</p>}
          {loading && <p className="glw-loading">Loading... this may take up to 60 seconds.</p>}

        </div>

        {/* FOOTER BUTTONS */}
        <div className="glw-footer">
          <button className="glw-btn" onClick={handleReportPrint}  disabled={loading}>
            {loading && printMode === "report"  ? "Loading..." : "Report Print"}
          </button>
          <button className="glw-btn" onClick={handleSummaryPrint} disabled={loading}>
            {loading && printMode === "summary" ? "Loading..." : "Summary Report Print"}
          </button>
        </div>

      </div>

      {/* REPORT TABLE */}
      {fetched && reportData.length > 0 && (
        <div className="glw-table-wrapper">

          {/* Print header */}
          <div className="print-only glw-print-header">
            <h2>
              {printMode === "summary" ? "Summary Report" : "Report"} —{" "}
              {form.reportType}
            </h2>
            <p>
              Branch: {form.branchCode} &nbsp;|&nbsp;
              Product Type: {form.productTypeInput} ({form.productType}) &nbsp;|&nbsp;
              {form.fromDate} to {form.toDate} &nbsp;|&nbsp;
              Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="glw-table">
            <thead>
              <tr>
                {columns.map((col) => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>{typeof row[col] === 'number' ? fmt(row[col]) : (row[col] ?? "")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="glw-record-count no-print">
            Total Records: {reportData.length}
          </p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="glw-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default GeneralLedgerWise;