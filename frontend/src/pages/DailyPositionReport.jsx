import { useState } from "react";
import "./DailyPositionReport.css";

const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";

const parseDate = (raw) => {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

function DailyPositionReport() {
  const [form, setForm] = useState({
    amountUnit:     "In Thousand",
    fromDate:       "26/07/2025",
    textReportName: "",
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
    if (!form.fromDate.trim())       return "From Date is required.";
    if (!parseDate(form.fromDate))   return "From Date must be DD/MM/YYYY.";
    if (!form.textReportName.trim()) return "Text report name is required.";
    return null;
  };

  const buildQuery = () =>
    new URLSearchParams({
      amountUnit:     form.amountUnit,
      fromDate:       form.fromDate,
      textReportName: form.textReportName,
    }).toString();

  const fetchData = async (mode) => {
    const validationError = validate();
    if (validationError) { setError(validationError); return null; }

    setLoading(true);
    setError("");
    setPrintMode(mode);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/daily-position-report?${buildQuery()}`
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

  const handleShow        = () => fetchData("show");
  const handleReportPrint = () => fetchData("reportprint");

  const handleTextDownload = async () => {
    const data = fetched ? reportData : await fetchData("textdownload");
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${form.textReportName || "daily-position-report"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = async () => {
    const data =
      fetched && printMode === "print"
        ? reportData
        : await fetchData("print");
    if (data && data.length > 0) setTimeout(() => window.print(), 300);
  };

  const handleBack = () => {
    setForm({
      amountUnit:     "In Thousand",
      fromDate:       "26/07/2025",
      textReportName: "",
    });
    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  return (
    <div className="db-wrapper">
      <div className="db-card no-print">

        {/* HEADER */}
        <div className="db-header">
          <span>Daily Position Report</span>
        </div>

        {/* BODY */}
        <div className="db-body">

          {/* AMOUNT UNIT */}
          <div className="db-row">
            <div className="db-radio-group">
              {["In Thousand", "In Lacs", "In Crore"].map((opt) => (
                <label key={opt} className="db-radio-label dpr-radio-label">
                  <input
                    type="radio"
                    name="amountUnit"
                    value={opt}
                    checked={form.amountUnit === opt}
                    onChange={handleChange}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* FROM DATE */}
          <div className="db-row">
            <label className="db-label">
              From Date <span className="req">*</span>
            </label>
            <input
              className="db-input db-input-short"
              type="text"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* TEXT REPORT NAME */}
          <div className="db-row">
            <label className="db-label">
              Please enter text report name <span className="req">*</span>
            </label>
            <input
              className="db-input dpr-input-wide"
              type="text"
              name="textReportName"
              value={form.textReportName}
              onChange={handleChange}
              placeholder="Please enter text report name"
            />
          </div>

          {/* ERROR / LOADING */}
          {error   && <p className="db-error">{error}</p>}
          {loading && (
            <p className="db-loading">
              Loading... this may take up to 60 seconds.
            </p>
          )}

        </div>

        {/* FOOTER BUTTONS */}
        <div className="db-footer">
          <button className="db-btn" onClick={handleShow} disabled={loading}>
            {loading && printMode === "show" ? "Loading..." : "Show"}
          </button>
          <button className="db-btn" onClick={handleReportPrint} disabled={loading}>
            {loading && printMode === "reportprint" ? "Loading..." : "Report Print"}
          </button>
          <button className="db-btn" onClick={handleTextDownload} disabled={loading}>
            Text Download
          </button>
          <button className="db-btn" onClick={handlePrint} disabled={loading}>
            {loading && printMode === "print" ? "Loading..." : "Print"}
          </button>
          <button className="db-btn db-btn-exit" onClick={handleBack}>
            Back
          </button>
        </div>

      </div>

      {/* RESULT SECTION */}
      {fetched && (
        <div className="dpr-result-wrapper">

          <div className="dpr-result-label">Daily Position Report</div>

          {/* Print header */}
          <div className="print-only db-print-header">
            <h2>Daily Position Report</h2>
            <p>
              Unit: {form.amountUnit} &nbsp;|&nbsp;
              From Date: {form.fromDate} &nbsp;|&nbsp;
              Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          {reportData.length > 0 ? (
            <>
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
            </>
          ) : (
            !loading && (
              <p className="db-error no-print">
                No records found for the given criteria.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default DailyPositionReport;