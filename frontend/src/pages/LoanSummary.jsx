import { useState } from "react";

const BASE_URL = "https://cbsapi.avsinsotech.com:8596";
const TEAL = "#0d9488";

export default function LoanSummary() {
  const [acType,          setAcType]          = useState("normal");
  const [fromBranch,      setFromBranch]      = useState("");
  const [toBranch,        setToBranch]        = useState("");
  const [asOnDate,        setAsOnDate]        = useState("2026-03-30");
  const [fromProductCode, setFromProductCode] = useState("");
  const [fromProductName, setFromProductName] = useState("");
  const [toProductCode,   setToProductCode]   = useState("");
  const [toProductName,   setToProductName]   = useState("");
  const [fromAccNo,       setFromAccNo]       = useState("");
  const [fromAccName,     setFromAccName]     = useState("");
  const [toAccNo,         setToAccNo]         = useState("");
  const [toAccName,       setToAccName]       = useState("");
  const [textReportName,  setTextReportName]  = useState("");
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState(null);
  const [results,         setResults]         = useState(null);

  const validate = () => {
    if (!asOnDate) return "Please select AsOnDate.";
    return null;
  };

  const handleReport = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError(null); setResults(null);
    try {
      const params = new URLSearchParams({
        acType, fromBranch, toBranch, asOnDate,
        fromProductCode, toProductCode,
        fromAccNo, toAccNo, mode: "json",
      });
      const response = await fetch(`${BASE_URL}/api/loan-summary?${params}`);
      const ct = response.headers.get("content-type") || "";
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
    const params = new URLSearchParams({
      acType, fromBranch, toBranch, asOnDate,
      fromProductCode, toProductCode,
      fromAccNo, toAccNo, textReportName, mode: "text",
    });
    window.open(`${BASE_URL}/api/loan-summary?${params}`, "_blank");
  };

  const handleClear = () => {
    setAcType("normal");
    setFromBranch(""); setToBranch(""); setAsOnDate("2026-03-30");
    setFromProductCode(""); setFromProductName("");
    setToProductCode(""); setToProductName("");
    setFromAccNo(""); setFromAccName("");
    setToAccNo(""); setToAccName("");
    setTextReportName("");
    setResults(null); setError(null);
  };

  return (
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Loan Overdue List</h2>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>

        {/* A/C Type radios */}
        <div style={styles.formRow}>
          <label style={styles.label}>A/C Type</label>
          <div style={styles.radioGroup}>
            {[
              { val: "normal",     label: "Normal A/c"      },
              { val: "court",      label: "Court Files A/C" },
              { val: "all",        label: "All A/C's"       },
            ].map(({ val, label }) => (
              <label key={val} style={styles.radioLabel}>
                <input
                  type="radio" name="acType" value={val}
                  checked={acType === val}
                  onChange={() => setAcType(val)}
                  style={styles.radioInput}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* From Branch / To Branch / AsOnDate */}
        <div style={styles.formRow}>
          <label style={styles.label}>From Branch</label>
          <input style={styles.inputSm} type="text" value={fromBranch} onChange={(e) => setFromBranch(e.target.value)} placeholder="1" />
          <label style={styles.inlineLabel}>To Branch</label>
          <input style={styles.inputMd} type="text" value={toBranch} onChange={(e) => setToBranch(e.target.value)} />
          <label style={styles.inlineLabel}>AsOnDate</label>
          <input style={styles.inputMd} type="date" value={asOnDate} onChange={(e) => setAsOnDate(e.target.value)} />
        </div>

        {/* From ProductCode / To ProductCode */}
        <div style={styles.formRow}>
          <label style={styles.label}>From ProductCode</label>
          <input style={styles.inputSm} type="text" placeholder="Code" value={fromProductCode} onChange={(e) => setFromProductCode(e.target.value)} />
          <input style={styles.inputMd} type="text" placeholder="Product Name" value={fromProductName} onChange={(e) => setFromProductName(e.target.value)} />
          <label style={styles.inlineLabel}>To ProductCode</label>
          <input style={styles.inputSm} type="text" placeholder="Code" value={toProductCode} onChange={(e) => setToProductCode(e.target.value)} />
          <input style={styles.inputMd} type="text" placeholder="Product Name" value={toProductName} onChange={(e) => setToProductName(e.target.value)} />
        </div>

        {/* From Account / To Account */}
        <div style={styles.formRow}>
          <label style={styles.label}>From Account</label>
          <input style={styles.inputSm} type="text" placeholder="No" value={fromAccNo} onChange={(e) => setFromAccNo(e.target.value)} />
          <input style={styles.inputMd} type="text" placeholder="Account Name" value={fromAccName} onChange={(e) => setFromAccName(e.target.value)} />
          <label style={styles.inlineLabel}>To Account</label>
          <input style={styles.inputSm} type="text" placeholder="No" value={toAccNo} onChange={(e) => setToAccNo(e.target.value)} />
          <input style={styles.inputMd} type="text" placeholder="Account Name" value={toAccName} onChange={(e) => setToAccName(e.target.value)} />
        </div>

        {/* Text Report Name */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            Please enter text report name <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.inputLg}
            type="text"
            placeholder="Please enter text report name"
            value={textReportName}
            onChange={(e) => setTextReportName(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnPrimary} onClick={handleReport} disabled={loading}>
            {loading ? "Loading..." : "Report"}
          </button>
          <button style={styles.btnPrimary} onClick={handleClear}>Clear</button>
          <button style={styles.btnPrimary} onClick={handleClear}>Exit</button>
          <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>
            Text Report View
          </button>
        </div>

        {/* Loading */}
        {loading && <div style={styles.loadingBox}>⏳ Fetching Loan Summary...</div>}

        {/* Results Table */}
        {results && results.data && results.data.length > 0 && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              {results.rowCount} record(s) | As On: {results.parameters?.asOnDate}
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
  cardHeader:   { background: "#334155" , padding: "12px 20px" },
  cardTitle:    { color: "white", margin: 0, fontSize: 15, fontWeight: 600 },
  cardBody:     { padding: "20px 24px 24px" },
  formRow:      { display: "flex", alignItems: "center", marginBottom: 14, gap: 8, flexWrap: "wrap" },
  label:        { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, whiteSpace: "nowrap", width: 160 },
  inlineLabel:  { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, whiteSpace: "nowrap", marginLeft: 8 },
  req:          { color: "#ef4444" },
  radioGroup:   { display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" },
  radioLabel:   { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer" },
  radioInput:   { width: 14, height: 14, accentColor: TEAL, cursor: "pointer" },
  inputSm:      { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 8px", fontSize: 12, color: "#1e293b", outline: "none", width: 90, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" },
  inputMd:      { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", cursor: "pointer" },
  inputLg:      { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 320, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" },
  errorBox:     { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginBottom: 14 },
  btnRow:       { display: "flex", gap: 8, marginTop: 4 },
  btnPrimary:   { height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", color: "white", background: "#334155", fontFamily: "'Poppins',sans-serif" },
  loadingBox:   { background: "#f0fdfa", border: "1px solid #99f6e4", color: "#0f766e", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 14 },
  noDataBox:    { background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 14, textAlign: "center" },
  tableWrapper: { marginTop: 20, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" },
  tableHeader:  { background: TEAL, color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600 },
  table:        { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th:           { background: "#f0fdfa", color: "#134e4a", padding: "8px 10px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #ccfbf1", whiteSpace: "nowrap" },
  td:           { padding: "7px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" },
  trEven:       { background: "white" },
  trOdd:        { background: "#f0fdfa" },
};