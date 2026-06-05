import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BTN_COLOR = "#374151";

export default function AllOkReport() {
  const [fromBranchID,  setFromBranchID]  = useState("");
  const [toBranchID,    setToBranchID]    = useState("");
  const [asOnDate,      setAsOnDate]      = useState("2026-03-30");
  const [textFileName,  setTextFileName]  = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [results,       setResults]       = useState(null);

  const validate = () => {
    if (!fromBranchID.trim()) return "Please enter From BranchID.";
    if (!toBranchID.trim())   return "Please enter To BranchID.";
    if (!asOnDate)            return "Please select AsOnDate.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError(null); setResults(null);
    try {
      const params   = new URLSearchParams({ fromBranchID, toBranchID, asOnDate, mode: "json" });
      const response = await fetch(`${BASE_URL}/api/all-ok-report?${params}`);
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
    const params = new URLSearchParams({ fromBranchID, toBranchID, asOnDate, textFileName, mode: "text" });
    window.open(`${BASE_URL}/api/all-ok-report?${params}`, "_blank");
  };

  const handleExit = () => {
    setFromBranchID(""); setToBranchID("");
    setAsOnDate("2026-03-30"); setTextFileName("");
    setResults(null); setError(null);
  };

  return (
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>All Ok Report</h2>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>

        <div style={styles.innerBox}>

          {/* From BranchID / To BranchID */}
          <div style={styles.formRow}>
            <label style={styles.label}>From BranchID</label>
            <input
              style={styles.input}
              type="text"
              value={fromBranchID}
              onChange={(e) => setFromBranchID(e.target.value)}
            />
            <label style={{ ...styles.label, marginLeft: 40 }}>To BranchID</label>
            <input
              style={styles.input}
              type="text"
              value={toBranchID}
              onChange={(e) => setToBranchID(e.target.value)}
            />
          </div>

          {/* AsOnDate */}
          <div style={styles.formRow}>
            <label style={styles.label}>AsOnDate</label>
            <input
              style={styles.input}
              type="date"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
          </div>

          {/* Text File Name */}
          <div style={styles.formRow}>
            <label style={styles.label}>Enter text file name</label>
            <input
              style={styles.input}
              type="text"
              value={textFileName}
              onChange={(e) => setTextFileName(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </button>
            <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>
              Text Repot View
            </button>
            <button style={styles.btnPrimary} onClick={handleExit}>Exit</button>
          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.loadingBox}>⏳ Fetching All Ok Report...</div>
        )}

        {/* Results Table */}
        {results && results.data && results.data.length > 0 && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              {results.rowCount} record(s) | As On: {results.parameters?.asOnDate} | Branch: {results.parameters?.fromBranchID} → {results.parameters?.toBranchID}
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
  input:        { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", cursor: "pointer" },
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