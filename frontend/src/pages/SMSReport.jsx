import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Shared: build query params for SMS SP
const buildSMSParams = ({ fromDate, toDate, fromBrcd, toBrcd, mobileType, mobileNo }) => {
  return new URLSearchParams({
    fdate:  fromDate,
    tdate:  toDate,
    fbrcd:  fromBrcd,
    tbrcd:  toBrcd,
    mobile: mobileType === 'all' ? '0' : mobileNo.trim(),
  });
};

export default function SMSReport() {
  const [fromDate,      setFromDate]      = useState("2025-04-01");
  const [toDate,        setToDate]        = useState("2026-03-30");
  const [fromBrcd,      setFromBrcd]      = useState("1");
  const [fromBranchName]                  = useState("HEAD OFFICE");
  const [toBrcd,        setToBrcd]        = useState("1");
  const [toBranchName]                    = useState("HEAD OFFICE");
  const [mobileType,    setMobileType]    = useState("all");
  const [mobileNo,      setMobileNo]      = useState("");
  const [textReportName,setTextReportName]= useState("");

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [results,  setResults]  = useState(null);

  // Validate fields before any API call
  const validate = () => {
    if (!fromDate || !toDate)                              return "Please fill From Date and To Date.";
    if (!fromBrcd || !toBrcd)                             return "Please fill both BRCD fields.";
    if (mobileType === "specific" && !mobileNo.trim())    return "Please enter a mobile number or select 'All'.";
    return null;
  };

  // ── Report button → JSON response → table in page ──────────────────────────
  const handleReport = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const params   = buildSMSParams({ fromDate, toDate, fromBrcd, toBrcd, mobileType, mobileNo });
      const response = await fetch(`${BASE_URL}/api/sms-report/report?${params}`);
      const data     = await response.json();
      if (!response.ok) throw new Error(data.error || data.details || "API request failed");
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Text Report View button → plain-text → opens in new browser tab ─────────
  const handleTextReportView = () => {
    const err = validate();
    if (err) { setError(err); return; }

    const params = buildSMSParams({ fromDate, toDate, fromBrcd, toBrcd, mobileType, mobileNo });
    // Opens the plain-text endpoint directly in a new tab
    window.open(`${BASE_URL}/api/sms-report/text-report-view?${params}`, '_blank');
  };

  const handleClearAll = () => {
    setFromDate(""); setToDate(""); setFromBrcd(""); setToBrcd("");
    setMobileType("all"); setMobileNo(""); setTextReportName("");
    setResults(null); setError(null);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>SMS MASTER REPORT</h2>
      </div>

      <div style={styles.cardBody}>

        {/* Row 1: From Date / To Date */}
        <div style={styles.formRow}>
          <div style={styles.colLeft}>
            <label style={styles.label}>From Date: <span style={styles.req}>*</span></label>
            <input style={styles.inputDate} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div style={styles.colRight}>
            <label style={styles.label}>To Date: <span style={styles.req}>*</span></label>
            <input style={styles.inputDate} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>

        {/* Row 2: From BRCD / To BRCD */}
        <div style={styles.formRow}>
          <div style={styles.colLeft}>
            <label style={styles.label}>BRCD: <span style={styles.req}>*</span></label>
            <div style={styles.brcdGroup}>
              <input style={styles.inputBrcd} type="text" value={fromBrcd} onChange={(e) => setFromBrcd(e.target.value)} />
              <input style={styles.inputBrcdName} type="text" value={fromBranchName} readOnly />
            </div>
          </div>
          <div style={styles.colRight}>
            <label style={styles.label}>BRCD: <span style={styles.req}>*</span></label>
            <div style={styles.brcdGroup}>
              <input style={styles.inputBrcd} type="text" value={toBrcd} onChange={(e) => setToBrcd(e.target.value)} />
              <input style={styles.inputBrcdName} type="text" value={toBranchName} readOnly />
            </div>
          </div>
        </div>

        {/* Row 3: Mobile */}
        <div style={styles.formRow}>
          <div style={{ ...styles.colLeft, alignItems: "center" }}>
            <label style={styles.label}>Mobile: <span style={styles.req}>*</span></label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input type="radio" name="mobileType" value="specific" checked={mobileType === "specific"} onChange={() => setMobileType("specific")} style={styles.radioInput} />
                Specific
              </label>
              <label style={styles.radioLabel}>
                <input type="radio" name="mobileType" value="all" checked={mobileType === "all"} onChange={() => setMobileType("all")} style={styles.radioInput} />
                All
              </label>
              {mobileType === "specific" && (
                <input style={styles.inputMobile} type="text" placeholder="mobile no" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} maxLength={10} />
              )}
            </div>
          </div>
        </div>

        {/* Row 4: Text Report Name */}
        <div style={styles.formRow}>
          <div style={styles.colLeft}>
            <label style={styles.label}>Please enter text report name <span style={styles.req}>*</span></label>
            <input style={styles.inputText} type="text" placeholder="Please enter text report name" value={textReportName} onChange={(e) => setTextReportName(e.target.value)} />
          </div>
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        {/* Buttons */}
        <div style={styles.btnRow}>
          {/* Report → JSON table */}
          <button style={styles.btnPrimary} onClick={handleReport} disabled={loading}>
            {loading ? "Loading..." : "Report"}
          </button>

          {/* Trial SMS — no API yet */}
          <button style={styles.btnPrimary} disabled={loading}>Trial SMS</button>

          <button style={styles.btnOutline} onClick={handleClearAll}>Clear All</button>
          <button style={styles.btnOutline}>Exit</button>

          {/* Text Report View → opens plain text in new tab */}
          <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>
            Text Report View
          </button>
        </div>

        {/* Loading */}
        {loading && <div style={styles.loadingBox}>⏳ Fetching SMS report data...</div>}

        {/* Results Table */}
        {results && results.data && results.data.length > 0 && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              {results.rowCount} record(s) &nbsp;|&nbsp;
              {results.parameters.fdate} → {results.parameters.tdate} &nbsp;|&nbsp;
              BRCD: {results.parameters.fbrcd}→{results.parameters.tbrcd} &nbsp;|&nbsp;
              {results.parameters.mobile === "0" ? "All Customers" : `Mobile: ${results.parameters.mobile}`}
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
          <div style={styles.noDataBox}>No SMS records found for the selected criteria.</div>
        )}

      </div>
    </div>
  );
}

const styles = {
  card:          { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "'Poppins', sans-serif", border: "1px solid #e2e8f0" },
  cardHeader:    { background: "linear-gradient(90deg, #0d9488, #14b8a6)", padding: "12px 20px" },
  cardTitle:     { color: "white", margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: 0.5 },
  cardBody:      { padding: "20px 24px 24px" },
  formRow:       { display: "flex", alignItems: "flex-start", marginBottom: 14, gap: 16, flexWrap: "wrap" },
  colLeft:       { display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 300 },
  colRight:      { display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 300 },
  label:         { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, whiteSpace: "nowrap" },
  req:           { color: "#ef4444" },
  inputDate:     { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 180, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", cursor: "pointer" },
  brcdGroup:     { display: "flex", alignItems: "center", gap: 6, flex: 1 },
  inputBrcd:     { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 80, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" },
  inputBrcdName: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#374151", outline: "none", flex: 1, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", background: "#f8fafc" },
  radioGroup:    { display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" },
  radioLabel:    { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer" },
  radioInput:    { width: 14, height: 14, accentColor: "#2563eb", cursor: "pointer" },
  inputMobile:   { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 180, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" },
  inputText:     { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 340, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" },
  errorBox:      { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 6, padding: "10px 14px", fontSize: 12, margin: "10px 0" },
  loadingBox:    { background: "#f0fdfa", border: "1px solid #99f6e4", color: "#0f766e", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12 },
  noDataBox:     { background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12, textAlign: "center" },
  btnRow:        { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 },
  btnPrimary:    { height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", color: "white", background: "linear-gradient(90deg, #0d9488, #14b8a6)", fontFamily: "'Poppins',sans-serif" },
  btnOutline:    { height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "white", border: "1px solid #9ca3af", color: "#374151", fontFamily: "'Poppins',sans-serif" },
  tableWrapper:  { marginTop: 20, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" },
  tableHeader:   { background: "linear-gradient(90deg, #0d9488, #14b8a6)", color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600 },
  table:         { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th:            { background: "#f0fdfa", color: "#134e4a", padding: "8px 10px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #ccfbf1", whiteSpace: "nowrap" },
  td:            { padding: "7px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" },
  trEven:        { background: "white" },
  trOdd:         { background: "#f0fdfa" },
};