import { useState, useEffect } from "react";
import "./DebitEntryReport.css";

// const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";
const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";

// ─── Helpers ──────────────────────────────────────────────────
const isValidDDMMYYYY = (v) => /^\d{2}\/\d{2}\/\d{4}$/.test(v.trim());

// Define column order and formatting
const REPORT_COLUMNS = [
  { key: "SubGlcode", label: "SubGlcode", type: "numeric", width: "80px" },
  { key: "GlName", label: "GlName", type: "text", width: "200px" },
  { key: "AccNo", label: "Acc No", type: "numeric", width: "80px" },
  { key: "CustName", label: "Cust Name", type: "text", width: "200px" },
  { key: "Opening", label: "Opening", type: "currency", width: "120px" },
  { key: "Credit", label: "Credit", type: "currency", width: "120px" },
  { key: "Debit", label: "Debit", type: "currency", width: "120px" },
  { key: "Closing", label: "Closing", type: "currency", width: "120px" },
];

const INITIAL_FORM = {
  branchCode:   "1",
  branchName:   "HEAD OFFICE",
  productType:  "1",
  productName:  "SB (SAVING DEPOSITS)",
  fromDate:     "22/05/2026",
  reportName:   "",
};

// Format numeric values
const formatValue = (value, type) => {
  if (value === null || value === undefined || value === "") return "";
  
  if (type === "currency") {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  if (type === "numeric") {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString("en-IN");
  }
  
  return value;
};

function DebitEntryReport() {
  const [form,       setForm]       = useState(INITIAL_FORM);
  const [branchList, setBranchList] = useState([]);
  const [glList,     setGlList]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [reportData, setReportData] = useState([]);
  const [fetched,    setFetched]    = useState(false);

  // ── Load GL list (Product Type options) on mount & branch change ──
  useEffect(() => {
    const loadGLList = async () => {
      try {
        const res  = await fetch(
          `${API_BASE_URL}/api/debit-entry-report/gl-list?brcd=${form.branchCode}`
        );
        const json = await res.json();
        if (json.success) {
          setGlList(json.data || []);
        }
      } catch {
        // silently ignore — static fallback stays visible
      }
    };
    loadGLList();
  }, [form.branchCode]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFetched(false);
    setError("");
  };

  // Branch dropdown: sync code + name together
  const handleBranchChange = (e) => {
    const selected = branchList.find((b) => b.id === e.target.value);
    setForm((prev) => ({
      ...prev,
      branchCode: e.target.value,
      branchName: selected ? selected.name : e.target.value,
    }));
    setFetched(false);
    setError("");
  };

  // Product Type dropdown: sync code + name together
  const handleProductTypeChange = (e) => {
    const selectedCode = e.target.value;
    const match = glList.find((g) => String(g.SUBGLCODE) === selectedCode);
    setForm((prev) => ({
      ...prev,
      productType: selectedCode,
      productName: match ? match.GLNAME : selectedCode,
    }));
    setFetched(false);
    setError("");
  };

  // Product name text box — manual edit
  const handleProductNameChange = (e) => {
    setForm((prev) => ({ ...prev, productName: e.target.value }));
    setFetched(false);
  };

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (!form.fromDate.trim())   return "From Date is required.";
    if (!isValidDDMMYYYY(form.fromDate)) return "From Date must be DD/MM/YYYY.";
    return null;
  };

  // ── Core fetch ────────────────────────────────────────────────
  const fetchReport = async () => {
    const err = validate();
    if (err) { setError(err); return null; }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        branchCode:  form.branchCode,
        fromDate:    form.fromDate,
        subGlCode:   form.productType,
        productName: form.productName,
        reportName:  form.reportName,
      });

      const res = await fetch(`${API_BASE_URL}/api/debit-entry-report?${params}`);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || body.error || `Server error: ${res.status}`);
      }

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Request failed.");

      const data = Array.isArray(result.data) ? result.data : [];
      setReportData(data);
      setFetched(true);
      return data;
    } catch (e) {
      setError(e.message || "Failed to fetch report.");
      setFetched(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = () => fetchReport();

  // ── Download as CSV ───────────────────────────────────────────
  const handleDownload = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/debit-entry-report/download`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchCode:  form.branchCode,
          fromDate:    form.fromDate,
          subGlCode:   form.productType,
          productName: form.productName,
          reportName:  form.reportName,
          format:      "excel",
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || body.error || `Server error: ${res.status}`);
      }

      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Download failed.");

      const rows = result.data || [];
      if (rows.length === 0) { setError("No records found to download."); return; }

      // Use only the columns defined in REPORT_COLUMNS for CSV export
      const headers = REPORT_COLUMNS.map(col => col.label);
      const csv = [
        headers.join(","),
        ...rows.map((row) =>
          REPORT_COLUMNS.map((col) => `"${row[col.key] ?? ""}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = (form.reportName || "DebitEntryReport") + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message || "Failed to download.");
    } finally {
      setLoading(false);
    }
  };

  // ── Print ─────────────────────────────────────────────────────
  const handlePrint = async () => {
    const data = fetched ? reportData : await fetchReport();
    if (data && data.length > 0) {
      setTimeout(() => window.print(), 400);
    }
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="der-wrapper">
      <div className="der-card no-print">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="der-header">
          <span>Debit Entry Report</span>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="der-body">

          {/* ROW 1 — Brcd  |  Brcd name */}
          <div className="der-row">
            <label className="der-label">Brcd</label>
            <input
              className="der-input der-input-brcd"
              name="branchCode"
              value={form.branchCode}
              onChange={handleChange}
              placeholder="1"
            />
            <label className="der-label der-label-inline">Brcd name</label>
            {branchList.length > 0 ? (
              <select
                className="der-select"
                value={form.branchCode}
                onChange={handleBranchChange}
              >
                {branchList.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            ) : (
              /* Fallback editable text if branch API not wired yet */
              <input
                className="der-input der-input-brname"
                name="branchName"
                value={form.branchName}
                onChange={handleChange}
                placeholder="Branch Name"
              />
            )}
          </div>

          {/* ROW 2 — Product Type code  |  Product Name (from GL lookup) */}
          <div className="der-row">
            <label className="der-label">Product Type</label>
            {glList.length > 0 ? (
              <>
                <input
                  className="der-input der-input-brcd"
                  name="productType"
                  value={form.productType}
                  onChange={(e) => {
                    const code  = e.target.value;
                    const match = glList.find((g) => String(g.SUBGLCODE) === code);
                    setForm((prev) => ({
                      ...prev,
                      productType: code,
                      productName: match ? match.GLNAME : prev.productName,
                    }));
                    setFetched(false);
                  }}
                  placeholder="Code"
                />
                <select
                  className="der-select der-select-product"
                  value={form.productType}
                  onChange={handleProductTypeChange}
                >
                  <option value="">— Select —</option>
                  {glList.map((g) => (
                    <option key={g.SUBGLCODE} value={String(g.SUBGLCODE)}>
                      {g.SUBGLCODE} – {g.GLNAME}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <input
                  className="der-input der-input-brcd"
                  name="productType"
                  value={form.productType}
                  onChange={handleChange}
                  placeholder="Code"
                />
                <input
                  className="der-input der-input-productname"
                  name="productName"
                  value={form.productName}
                  onChange={handleProductNameChange}
                  placeholder="Product Name"
                />
              </>
            )}
          </div>

          {/* ROW 3 — From Date */}
          <div className="der-row">
            <label className="der-label">From Date</label>
            <input
              className="der-input der-input-date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* ROW 4 — Enter Text Report Name */}
          <div className="der-row">
            <label className="der-label der-label-wrap">Enter Text Report Name</label>
            <input
              className="der-input der-input-reportname"
              name="reportName"
              value={form.reportName}
              onChange={handleChange}
              placeholder=""
            />
          </div>

          {/* Status messages */}
          {error   && <p className="der-error">{error}</p>}
          {loading && <p className="der-loading">Loading… please wait.</p>}
        </div>

        {/* ── Footer buttons ──────────────────────────────────── */}
        <div className="der-footer">
          <button className="der-btn" onClick={handleSubmit}  disabled={loading}>
            {loading ? "Loading…" : "Submit"}
          </button>
          <button className="der-btn" onClick={handleDownload} disabled={loading}>
            {loading ? "Loading…" : "Download"}
          </button>
          <button className="der-btn" onClick={handlePrint}   disabled={loading}>
            {loading ? "Loading…" : "Print"}
          </button>
        </div>
      </div>

      {/* ── Report table ────────────────────────────────────────── */}
      {fetched && reportData.length > 0 && (
        <div className="der-table-wrapper">
          {/* Print-only header */}
          <div className="print-only der-print-header">
            <h2>Debit Entry Report</h2>
            <p>
              Branch: {form.branchName}&nbsp;|&nbsp;
              Product: {form.productName}&nbsp;|&nbsp;
              From: {form.fromDate}&nbsp;|&nbsp;
              Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="der-table">
            <thead>
              <tr>
                {REPORT_COLUMNS.map((col) => (
                  <th key={col.key} className={`der-th der-th-${col.type}`} style={{ width: col.width }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "der-row-even" : "der-row-odd"}>
                  {REPORT_COLUMNS.map((col) => (
                    <td key={col.key} className={`der-td der-td-${col.type}`}>
                      {formatValue(row[col.key], col.type)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="der-record-count no-print">
            Total Records: <strong>{reportData.length}</strong>
          </p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="der-no-data no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default DebitEntryReport;