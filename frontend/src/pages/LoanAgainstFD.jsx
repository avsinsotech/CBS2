import { useState } from "react";

const BASE_URL = "https://cbsapi.avsinsotech.com:8596";

export default function LoanAgainstFD() {
  const [reportType,      setReportType]      = useState("summary");
  const [fromBrcd,        setFromBrcd]        = useState("1");
  const [fromBranchName]                      = useState("HEAD OFFICE");
  const [toBrcd,          setToBrcd]          = useState("1");
  const [toBranchName]                        = useState("HEAD OFFICE");
  const [fromDate,        setFromDate]        = useState("2026-03-30");
  const [toDate,          setToDate]          = useState("2026-03-30");
  const [textReportName,  setTextReportName]  = useState("");
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);
  const [results,         setResults]         = useState(null);

  const validate = () => {
    if (!fromBrcd.trim()) return "Please enter From BRCD.";
    if (!toBrcd.trim())   return "Please enter To BRCD.";
    if (!fromDate)        return "Please select From Date.";
    if (!toDate)          return "Please select To Date.";
    return null;
  };

  const handleReport = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError(null); setResults(null);
    try {
      const params   = new URLSearchParams({ reportType, fromBrcd, toBrcd, fromDate, toDate, mode: "json" });
      const response = await fetch(`${BASE_URL}/api/loan-against-fd?${params}`);
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
    const params = new URLSearchParams({ reportType, fromBrcd, toBrcd, fromDate, toDate, textReportName, mode: "text" });
    window.open(`${BASE_URL}/api/loan-against-fd?${params}`, "_blank");
  };

  const handleExit = () => {
    setReportType("summary");
    setFromBrcd("1"); setToBrcd("1");
    setFromDate("2026-03-30"); setToDate("2026-03-30");
    setTextReportName("");
    setResults(null); setError(null);
  };

  return (
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Deposit Loan Details</h2>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>

        <div style={styles.innerBox}>

          {/* Report Type */}
          <div style={styles.formRow}>
            <label style={styles.label}>Report Type</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio" name="reportType" value="summary"
                  checked={reportType === "summary"}
                  onChange={() => setReportType("summary")}
                  style={styles.radioInput}
                />
                Summary
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio" name="reportType" value="details"
                  checked={reportType === "details"}
                  onChange={() => setReportType("details")}
                  style={styles.radioInput}
                />
                Details
              </label>
            </div>
          </div>

          {/* From BRCD / To BRCD */}
          <div style={styles.formRow}>
            <label style={styles.label}>
              BRCD <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.inputSmall}
              type="text"
              value={fromBrcd}
              onChange={(e) => setFromBrcd(e.target.value)}
            />
            <input
              style={styles.inputWide}
              type="text"
              value={fromBranchName}
              readOnly
            />
            <label style={{ ...styles.label, marginLeft: 24 }}>
              BRCD <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.inputSmall}
              type="text"
              value={toBrcd}
              onChange={(e) => setToBrcd(e.target.value)}
            />
            <input
              style={styles.inputWide}
              type="text"
              value={toBranchName}
              readOnly
            />
          </div>

          {/* From Date / To Date */}
          <div style={styles.formRow}>
            <label style={styles.label}>
              From Date <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.inputMed}
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <label style={{ ...styles.label, marginLeft: 16 }}>
              To Date <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.inputMed}
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Text Report Name */}
          <div style={styles.formRow}>
            <label style={styles.label}>
              Please enter text report name <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.inputText}
              type="text"
              placeholder="Please enter text report name"
              value={textReportName}
              onChange={(e) => setTextReportName(e.target.value)}
            />
          </div>

        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        {/* Footer Buttons */}
        <div style={styles.footer}>
          <button style={styles.btnTeal} onClick={handleReport} disabled={loading}>
            {loading ? "Loading..." : "Report"}
          </button>
          <button style={styles.btnTeal} onClick={handleExit}>Exit</button>
          <button style={styles.btnText} onClick={handleTextReportView} disabled={loading}>
            Text Report View
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={styles.loadingBox}>⏳ Fetching Deposit Loan Details...</div>
        )}

        {/* Results Table */}
        {results && results.data && results.data.length > 0 && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              {results.rowCount} record(s) | {results.parameters?.fromDate} → {results.parameters?.toDate} | BRCD: {results.parameters?.fromBrcd} → {results.parameters?.toBrcd}
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {Object.keys(results.data[0]).map((col) => (
                      <th key={col} style={styles.th}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.data.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={styles.td}>{val ?? "-"}</td>
                      ))}
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

const BTN_COLOR = "#374151";

const styles = {
  card:         { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "'Poppins', sans-serif", border: "1px solid #e2e8f0" },
  cardHeader:   { background: BTN_COLOR, padding: "12px 20px" },
  cardTitle:    { color: "white", margin: 0, fontSize: 15, fontWeight: 600 },
  cardBody:     { padding: "20px 24px 0" },
  innerBox:     { border: "1px solid #d1d5db", borderRadius: 8, padding: "18px 20px", marginBottom: 0, background: "white" },
  formRow:      { display: "flex", alignItems: "center", marginBottom: 14, gap: 8, flexWrap: "wrap" },
  label:        { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, whiteSpace: "nowrap" },
  req:          { color: "#ef4444" },
  radioGroup:   { display: "flex", alignItems: "center", gap: 24 },
  radioLabel:   { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer" },
  radioInput:   { width: 14, height: 14, accentColor: "#2563eb", cursor: "pointer" },
  inputSmall:   { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 80, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" },
  inputWide:    { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#374151", outline: "none", width: 220, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", background: "#f8fafc" },
  inputMed:     { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 160, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", cursor: "pointer" },
  inputText:    { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 320, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" },
  errorBox:     { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 6, padding: "10px 14px", fontSize: 12, margin: "12px 0" },
  footer:       { background: "#f8fafc", borderTop: "1px solid #e5e7eb", padding: "12px 20px", display: "flex", gap: 10, justifyContent: "center", margin: "0 -24px" },
  btnTeal:      { height: 32, padding: "0 22px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", color: "white", background: BTN_COLOR, fontFamily: "'Poppins',sans-serif" },
  btnText:      { height: 32, padding: "0 22px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "white", border: `1px solid ${BTN_COLOR}`, color: BTN_COLOR, fontFamily: "'Poppins',sans-serif" },
  loadingBox:   { background: "#eff6ff", border: "1px solid #93c5fd", color: "#1d4ed8", borderRadius: 6, padding: "10px 14px", fontSize: 12, margin: "12px 24px" },
  noDataBox:    { background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "10px 14px", fontSize: 12, margin: "12px 24px", textAlign: "center" },
  tableWrapper: { margin: "16px 0 0", borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" },
  tableHeader:  { background: BTN_COLOR, color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600 },
  table:        { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th:           { background: "#f1f5f9", color: "#374151", padding: "8px 10px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" },
  td:           { padding: "7px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" },
  trEven:       { background: "white" },
  trOdd:        { background: "#f8fafc" },
};