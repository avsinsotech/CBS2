import { useState } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.db-wrapper {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.db-card {
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.db-header {
  background: linear-gradient(90deg, #273449, #5b8dee);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  padding: 12px 18px;
  letter-spacing: 0.4px;
}

.db-body {
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  margin: 16px;
  border-radius: 4px;
}

.db-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.db-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  min-width: 200px;
  white-space: nowrap;
}

.req {
  color: #ef4444;
}

.db-input {
  height: 34px;
  border: 1.5px solid #d1d5db;
  border-radius: 4px;
  padding: 0 12px;
  font-size: 12.5px;
  font-family: 'Poppins', sans-serif;
  color: #374151;
  background: #ffffff;
  outline: none;
  width: 180px;
  transition: border-color 0.2s ease;
}

.db-input:focus {
  border-color: #273449;
  box-shadow: 0 0 0 3px rgba(39, 52, 73, 0.12);
}

.db-input::placeholder {
  color: #9ca3af;
}

.db-input-shaded {
  background: #fff5f5;
  border-color: #fca5a5;
}

.db-input-wide {
  width: 280px;
}

.db-input-name {
  width: 360px;
}

.db-inline-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.db-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f8f9fb;
  flex-wrap: wrap;
}

.db-btn {
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 4px;
  background: #273449;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
}

.db-btn:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

.db-btn:active {
  transform: translateY(0);
}

.db-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.db-btn-teal {
  background: #0d9488;
}

.db-btn-blue {
  background: #2563eb;
}

.db-btn-exit {
  background: #6b7280;
}

.db-error {
  color: #c0392b;
  font-size: 0.82rem;
  margin: 0 0 10px 0;
  padding: 8px 12px;
  background: #fee2e2;
  border-left: 3px solid #c0392b;
  border-radius: 2px;
}

.db-loading {
  color: #2980b9;
  font-size: 0.82rem;
  margin: 0 0 10px 0;
  padding: 8px 12px;
  background: #dbeafe;
  border-left: 3px solid #2980b9;
  border-radius: 2px;
}

.db-table-wrapper {
  margin-top: 24px;
  overflow-x: auto;
}

.db-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
}

.db-table th,
.db-table td {
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  text-align: left;
  white-space: nowrap;
  color: #374151;
}

.db-table thead tr {
  background: linear-gradient(90deg, #273449, #5b8dee);
}

.db-table thead tr th {
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.db-table tbody tr:nth-child(even) {
  background-color: #f4f6f8;
}

.db-table tbody tr:hover {
  background-color: #dce9f5;
}

.db-record-count {
  margin-top: 8px;
  font-size: 0.78rem;
  color: #6b7280;
  text-align: right;
}

.print-only { display: none; }

.db-print-header {
  text-align: center;
  margin-bottom: 16px;
}

.db-print-header h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #273449;
  margin: 0 0 4px 0;
}

.db-print-header p {
  font-family: 'Poppins', sans-serif;
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0;
}

@media print {
  .navbar, .sidebar, .no-print { display: none !important; }
  .print-only { display: block !important; }
  .db-wrapper { padding: 0; background: #ffffff; }
  .db-table thead tr {
    background: #273449 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .db-record-count { display: none; }
}
`;

const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";

function UnpassEntriesRegister() {
  const [form, setForm] = useState({
    asOnDate: "26/07/2025",
    fromBranchCode: "1",
    fromBranchName: "HEAD OFFICE",
    toBranchCode: "1",
    toBranchName: "HEAD OFFICE",
    textReportName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [printMode, setPrintMode] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFetched(false);
  };

  const parseDate = (raw) => {
    const parts = raw.trim().split("/");
    if (parts.length !== 3) return null;
    let [d, m, y] = parts;
    if (y.length === 2) y = "20" + y;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const validate = () => {
    if (!form.asOnDate.trim()) return "As On Date is required.";
    if (!parseDate(form.asOnDate)) return "As On Date must be DD/MM/YYYY.";
    if (!form.fromBranchCode.trim()) return "From Branch Code is required.";
    if (!form.toBranchCode.trim()) return "To Branch Code is required.";
    if (!form.textReportName.trim()) return "Text report name is required.";
    return null;
  };

  const buildQuery = () =>
    new URLSearchParams({
      asOnDate: form.asOnDate,
      fromBranchCode: form.fromBranchCode,
      toBranchCode: form.toBranchCode,
      textReportName: form.textReportName,
    }).toString();

  const fetchData = async (mode) => {
    const err = validate();
    if (err) { setError(err); return null; }

    setLoading(true);
    setError("");
    setPrintMode(mode);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/unpass-entries?${buildQuery()}`
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || body.message || `Server error: ${response.status}`);
      }
      const result = await response.json();
      const data = Array.isArray(result) ? result : result.data || [];
      setReportData(data);
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setFetched(true);
      return data;
    } catch (e) {
      setError(e.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => fetchData("report");

  const handleTextView = () => fetchData("textview");

  const handleDownload = async () => {
    const data = fetched ? reportData : await fetchData("download");
    if (!data || data.length === 0) return;
    const cols = Object.keys(data[0]);
    const csv = [cols.join(","), ...data.map(row => cols.map(c => `"${row[c] ?? ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `UnpassEntries_${form.asOnDate.replace(/\//g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = async () => {
    const data = fetched ? reportData : await fetchData("print");
    if (data && data.length > 0) setTimeout(() => window.print(), 300);
  };

  const handleClearAll = () => {
    setForm({
      asOnDate: "26/07/2025",
      fromBranchCode: "1",
      fromBranchName: "HEAD OFFICE",
      toBranchCode: "1",
      toBranchName: "HEAD OFFICE",
      textReportName: "",
    });
    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="db-wrapper">
        <div className="db-card no-print">

          {/* HEADER */}
          <div className="db-header">Unpass Entries Register</div>

          {/* BODY */}
          <div className="db-body">

            {/* AS ON DATE */}
            <div className="db-row">
              <label className="db-label">As OnDate <span className="req">*</span></label>
              <input
                className="db-input"
                type="text"
                name="asOnDate"
                value={form.asOnDate}
                onChange={handleChange}
                placeholder="DD/MM/YYYY"
              />
            </div>

            {/* FROM BRCD */}
            <div className="db-row">
              <label className="db-label">BRCD <span className="req">*</span></label>
              <div className="db-inline-group">
                <input
                  className="db-input db-input-shaded"
                  style={{ width: 100 }}
                  type="text"
                  name="fromBranchCode"
                  value={form.fromBranchCode}
                  onChange={handleChange}
                />
                <input
                  className="db-input db-input-shaded db-input-wide"
                  type="text"
                  name="fromBranchName"
                  value={form.fromBranchName}
                  onChange={handleChange}
                  placeholder="Branch Name"
                />
              </div>

              {/* TO BRCD */}
              <label className="db-label" style={{ minWidth: 80 }}>BRCD <span className="req">*</span></label>
              <div className="db-inline-group">
                <input
                  className="db-input db-input-shaded"
                  style={{ width: 100 }}
                  type="text"
                  name="toBranchCode"
                  value={form.toBranchCode}
                  onChange={handleChange}
                />
                <input
                  className="db-input db-input-shaded db-input-wide"
                  type="text"
                  name="toBranchName"
                  value={form.toBranchName}
                  onChange={handleChange}
                  placeholder="Branch Name"
                />
              </div>
            </div>

            {/* TEXT REPORT NAME */}
            <div className="db-row">
              <label className="db-label">
                Please enter text report name <span className="req">*</span>
              </label>
              <input
                className="db-input db-input-name"
                type="text"
                name="textReportName"
                value={form.textReportName}
                onChange={handleChange}
                placeholder="Please enter text report name"
              />
            </div>

            {error && <p className="db-error">{error}</p>}
            {loading && <p className="db-loading">Loading... this may take up to 60 seconds.</p>}
          </div>

          {/* FOOTER */}
          <div className="db-footer">
            <button className="db-btn db-btn-teal" onClick={handleReport} disabled={loading}>
              {loading && printMode === "report" ? "Loading..." : "Report"}
            </button>
            <button className="db-btn db-btn-blue" onClick={handleTextView} disabled={loading}>
              {loading && printMode === "textview" ? "Loading..." : "Text View"}
            </button>
            <button className="db-btn db-btn-blue" onClick={handleDownload} disabled={loading}>
              Download
            </button>
            <button className="db-btn db-btn-teal" onClick={handlePrint} disabled={loading}>
              {loading && printMode === "print" ? "Loading..." : "Print"}
            </button>
            <button className="db-btn db-btn-blue" onClick={handleClearAll}>
              Clear All
            </button>
            <button className="db-btn db-btn-exit" onClick={handleClearAll}>
              Exit
            </button>
          </div>
        </div>

        {/* TABLE */}
        {fetched && reportData.length > 0 && (
          <div className="db-table-wrapper">
            <div className="print-only db-print-header">
              <h2>Unpass Entries Register</h2>
              <p>
                Branch: {form.fromBranchCode}–{form.toBranchCode} &nbsp;|&nbsp;
                As On Date: {form.asOnDate} &nbsp;|&nbsp;
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
                    {columns.map((col) => <td key={col}>{row[col] ?? ""}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="db-record-count no-print">Total Records: {reportData.length}</p>
          </div>
        )}

        {fetched && reportData.length === 0 && !loading && (
          <p className="db-error no-print">No records found for the given criteria.</p>
        )}
      </div>
    </>
  );
}

export default UnpassEntriesRegister;