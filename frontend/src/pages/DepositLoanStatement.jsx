import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BTN_COLOR = "#374151";

export default function DepositLoanStatement() {
  const [branchCode,    setBranchCode]    = useState("1");
  const [fromDate,      setFromDate]      = useState("2025-04-01");
  const [toDate,        setToDate]        = useState("2026-03-30");
  const [textFileName,  setTextFileName]  = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [results,       setResults]       = useState(null);

  const validate = () => {
    if (!branchCode.trim()) return "Please enter Branch Code.";
    if (!fromDate)          return "Please select From Date.";
    if (!toDate)            return "Please select To Date.";
    return null;
  };

  const handleDepositLoansReport = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError(null); setResults(null);
    try {
      const params   = new URLSearchParams({ branchCode, fromDate, toDate, mode: "json" });
      const response = await fetch(`${BASE_URL}/api/deposit-loan-statement?${params}`);
      const ct       = response.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const txt = await response.text();
        throw new Error(`Server error (HTTP ${response.status}): ${txt.substring(0, 200)}`);
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API request failed");
      setResults(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextReportView = () => {
    const err = validate();
    if (err) { setError(err); return; }
    const params = new URLSearchParams({ branchCode, fromDate, toDate, textFileName, mode: "text" });
    window.open(`${BASE_URL}/api/deposit-loan-statement?${params}`, "_blank");
  };

  return (
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Trail Balance From Date And To Date</h2>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>

        <div style={styles.innerBox}>

          {/* Branch Code */}
          <div style={styles.formRow}>
            <label style={styles.label}>Branch Code</label>
            <input
              style={styles.input}
              type="text"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
            />
          </div>

          {/* From Date / To Date */}
          <div style={styles.formRow}>
            <label style={styles.label}>From Date</label>
            <input
              style={styles.inputWide}
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label style={{ ...styles.label, marginLeft: 16 }}>To Date</label>
            <input
              style={styles.inputWide}
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Text File Name */}
          <div style={styles.formRow}>
            <label style={styles.label}>Enter text file name</label>
            <input
              style={styles.inputWide}
              type="text"
              value={textFileName}
              onChange={(e) => setTextFileName(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={handleDepositLoansReport} disabled={loading}>
              {loading ? "Loading..." : "Deposit & Loans Report"}
            </button>
            <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>
              Text Repot View
            </button>
          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.loadingBox}>⏳ Fetching Deposit & Loan Statement...</div>
        )}

        {/* Results Table */}
        {results && results.data && results.data.length > 0 && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              {results.rowCount} record(s) | Branch: {results.parameters?.branchCode} | {results.parameters?.fromDate} → {results.parameters?.toDate}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>{Object.keys(results.data[0]).map((col) => <th key={col} style={styles.th}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {results.data.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      {Object.values(row).map((val, j) => <td key={j} style={styles.td}>{val ?? "-"}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results && results.data && results.data.length === 0 && (
          <div style={styles.noDataBox}>No records found for the selected criteria.</div>
        )}

      </div>
    </div>
  );
}

const styles = {
  card:         { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "'Poppins', sans-serif", border: "1px solid #e2e8f0" },
  cardHeader:   { background: BTN_COLOR, padding: "12px 20px" },
  cardTitle:    { color: "white", margin: 0, fontSize: 15, fontWeight: 600 },
  cardBody:     { padding: "20px 24px 24px" },
  innerBox:     { border: "1px solid #d1d5db", borderRadius: 8, padding: "20px 24px", background: "white" },
  formRow:      { display: "flex", alignItems: "center", marginBottom: 14, gap: 10, flexWrap: "wrap" },
  label:        { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, whiteSpace: "nowrap", width: 140 },
  input:        { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" },
  inputWide:    { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 340, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", cursor: "pointer" },
  errorBox:     { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginBottom: 14 },
  btnRow:       { display: "flex", gap: 8, marginTop: 4 },
  btnPrimary:   { height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", color: "white", background: BTN_COLOR, fontFamily: "'Poppins',sans-serif" },
  loadingBox:   { background: "#eff6ff", border: "1px solid #93c5fd", color: "#1d4ed8", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 14 },
  noDataBox:    { background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 14, textAlign: "center" },
  tableWrapper: { marginTop: 20, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" },
  tableHeader:  { background: BTN_COLOR, color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600 },
  table:        { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th:           { background: "#f1f5f9", color: "#374151", padding: "8px 10px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" },
  td:           { padding: "7px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" },
  trEven:       { background: "white" },
  trOdd:        { background: "#f8fafc" },
};