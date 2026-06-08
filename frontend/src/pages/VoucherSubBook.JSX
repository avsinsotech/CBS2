
import { useState } from "react";
import "./VoucherSubBook.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

const parseDate = (raw) => {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

// Activity types mapped to SP Type parameter values
const ACTIVITY_TYPES = [
  { label: "--Select--", value: "--Select--" },
  { label: "Receipt", value: "1" },
  { label: "Payment", value: "2" },
  { label: "Transfer", value: "3" },
  { label: "All Activity", value: "4" },
];

function VoucherSubBook() {
  const [form, setForm] = useState({
    reportType:      "Details",
    branchCode:      "1",
    fromDate:        "01/04/2025",
    toDate:          "26/07/2025",
    activityType:    "--Select--",
    textReportName:  "",
  });

  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [reportData, setReportData] = useState([]);
  const [columns,    setColumns]    = useState([]);
  const [fetched,    setFetched]    = useState(false);
  const [printMode,  setPrintMode]  = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFetched(false);
  };

  const validate = () => {
    if (!form.branchCode.trim())     return "Branch Code is required.";
    if (!form.fromDate.trim())       return "From Date is required.";
    if (!parseDate(form.fromDate))   return "From Date must be DD/MM/YYYY.";
    if (!form.toDate.trim())         return "To Date is required.";
    if (!parseDate(form.toDate))     return "To Date must be DD/MM/YYYY.";
    if (form.activityType === "--Select--") return "Please select an Activity Type.";
    if (!form.textReportName.trim()) return "Text report name is required.";
    return null;
  };

  const buildQuery = () =>
    new URLSearchParams({
      branchCode:    form.branchCode,
      fromDate:      form.fromDate,
      toDate:        form.toDate,
      activityType:  form.activityType, // Sends '1', '2', '3', or '4'
    }).toString();

  const fetchData = async (mode) => {
    const validationError = validate();
    if (validationError) { setError(validationError); return null; }

    setLoading(true);
    setError("");
    setPrintMode(mode);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/voucher-subbook?${buildQuery()}`
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || body.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      const data   = Array.isArray(result) ? result : result.data || [];

      setReportData(data);
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setFetched(true);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleView     = () => fetchData("view");
  const handleTextView = () => fetchData("textview");

  const handleDownload = async () => {
    const data = fetched ? reportData : await fetchData("download");
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${form.textReportName || "voucher-subbook"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = async () => {
    const data = (fetched && printMode === "print") ? reportData : await fetchData("print");
    if (data && data.length > 0) setTimeout(() => window.print(), 300);
  };

  const handleExit = () => {
    setForm({
      reportType:     "Details",
      branchCode:     "1",
      fromDate:       "01/04/2025",
      toDate:         "26/07/2025",
      activityType:   "--Select--",
      textReportName: "",
    });
    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  // Get the label for the selected activity type
  const getActivityTypeLabel = (value) => {
    const activity = ACTIVITY_TYPES.find(a => a.value === value);
    return activity ? activity.label : value;
  };

  return (
    <div className="db-wrapper">
      <div className="db-card no-print">

        {/* HEADER */}
        <div className="db-header">
          <span>Voucher Book Summary</span>
        </div>

        {/* BODY */}
        <div className="db-body">

          {/* REPORT TYPE */}
          <div className="db-row">
            <div className="db-radio-group">
              {["Details", "Summary", "ABB Vouchar"].map((opt) => (
                <label key={opt} className="db-radio-label">
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

          {/* BRANCH CODE */}
          <div className="db-row">
            <label className="db-label">Branch Code</label>
            <input
              className="db-input db-input-short db-input-shaded"
              type="text"
              name="branchCode"
              value={form.branchCode}
              onChange={handleChange}
            />
          </div>

          {/* FROM DATE + TO DATE on same row */}
          <div className="db-row">
            <label className="db-label">From Date</label>
            <input
              className="db-input db-input-short"
              type="text"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
            <label className="db-label db-label-inline">To Date</label>
            <input
              className="db-input db-input-short"
              type="text"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* ACTIVITY TYPE */}
          <div className="db-row">
            <label className="db-label">Activity Type</label>
            <select
              className="db-input db-select"
              name="activityType"
              value={form.activityType}
              onChange={handleChange}
            >
              {ACTIVITY_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* TEXT REPORT NAME */}
          <div className="db-row">
            <label className="db-label">
              Enter text report name <span className="req">*</span>
            </label>
            <input
              className="db-input vsb-input-wide"
              type="text"
              name="textReportName"
              value={form.textReportName}
              onChange={handleChange}
              placeholder="Please enter text report name"
            />
          </div>

          {/* ERROR / LOADING */}
          {error   && <p className="db-error">{error}</p>}
          {loading && <p className="db-loading">Loading... this may take up to 60 seconds.</p>}

        </div>

        {/* FOOTER BUTTONS */}
        <div className="db-footer">
          <button className="db-btn" onClick={handleView} disabled={loading}>
            {loading && printMode === "view" ? "Loading..." : "View"}
          </button>
          <button className="db-btn" onClick={handleTextView} disabled={loading}>
            {loading && printMode === "textview" ? "Loading..." : "Text View"}
          </button>
          <button className="db-btn" onClick={handleDownload} disabled={loading}>
            Download
          </button>
          <button className="db-btn" onClick={handlePrint} disabled={loading}>
            {loading && printMode === "print" ? "Loading..." : "Print"}
          </button>
          <button className="db-btn db-btn-exit" onClick={handleExit}>
            Exit
          </button>
        </div>

      </div>

      {/* REPORT TABLE */}
      {fetched && reportData.length > 0 && (
        <div className="db-table-wrapper">

          {/* Print header */}
          <div className="print-only db-print-header">
            <h2>Voucher Book Summary — {form.reportType}</h2>
            <p>
              Branch: {form.branchCode} &nbsp;|&nbsp;
              From: {form.fromDate} &nbsp;|&nbsp;
              To: {form.toDate} &nbsp;|&nbsp;
              Activity: {getActivityTypeLabel(form.activityType)} &nbsp;|&nbsp;
              Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="db-table">
            <thead>
              <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
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

          <p className="db-record-count no-print">
            Total Records: {reportData.length}
          </p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="db-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default VoucherSubBook;