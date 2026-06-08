import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || 'https://cbsapi.avsinsotech.com:8596';

export default function TDSReport() {
  const [customerType,   setCustomerType]   = useState("All");
  const [branchCode,     setBranchCode]     = useState("0000");
  const [fromDate,       setFromDate]       = useState("2025-04-01");
  const [toDate,         setToDate]         = useState("2026-03-30");
  const [fromCustomerID, setFromCustomerID] = useState("1");
  const [toCustomerID,   setToCustomerID]   = useState("999999999");
  const [customerID,     setCustomerID]     = useState("");
  const [amount,         setAmount]         = useState("0");
  const [flag,           setFlag]           = useState("");

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [results,  setResults]  = useState(null);
  const [columns,  setColumns]  = useState([]);
  const [activeBtn,setActiveBtn]= useState(null); // "tds" | "15gh"

  const handleClear = () => {
    setBranchCode("0000");
    setFromDate("2025-04-01");
    setToDate("2026-03-30");
    setCustomerType("All");
    setFromCustomerID("1");
    setToCustomerID("999999999");
    setCustomerID("");
    setAmount("0");
    setFlag("");
    setResults(null);
    setColumns([]);
    setError(null);
    setActiveBtn(null);
  };

  const getCustomerRange = () => ({
    fromCustNo: customerType === "Specific" ? customerID.trim() : fromCustomerID.trim(),
    toCustNo:   customerType === "Specific" ? customerID.trim() : toCustomerID.trim(),
  });

  // ── TDS Details Report (JSON) ────────────────────────────────────────────────
  const handleTdsReport = async () => {
    if (!fromDate || !toDate) { setError("Please fill From Date and To Date."); return; }
    if (customerType === "Specific" && !customerID.trim()) { setError("Please enter a Customer ID."); return; }

    setLoading(true); setError(null); setResults(null); setColumns([]); setActiveBtn("tds");

    try {
      const { fromCustNo, toCustNo } = getCustomerRange();
      const body = {
        fromDate,
        toDate,
        branchCode,
        fromCustNo,
        toCustNo,
        amount,
        flag
      };

      const response = await fetch(`${BASE_URL}/api/tds-report/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "TDS Details Report failed");

      const data = resData.data || [];
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── TDS Details Text View ────────────────────────────────────────────────────
  const handleTdsTextView = () => {
    if (!fromDate || !toDate) { setError("Please fill From Date and To Date."); return; }
    const { fromCustNo, toCustNo } = getCustomerRange();
    const params = new URLSearchParams({
      fromDate,
      toDate,
      branchCode,
      fromCustNo,
      toCustNo,
      amount,
      flag
    });
    window.open(`${BASE_URL}/api/tds-report/text-report-view?${params}`, "_blank");
  };

  // ── 15-G-H Submit Report (JSON) ──────────────────────────────────────────────
  const handle15GHReport = async () => {
    if (!fromDate || !toDate) { setError("Please fill From Date and To Date."); return; }
    if (customerType === "Specific" && !customerID.trim()) { setError("Please enter a Customer ID."); return; }

    setLoading(true); setError(null); setResults(null); setColumns([]); setActiveBtn("15gh");

    try {
      const { fromCustNo, toCustNo } = getCustomerRange();
      const params = new URLSearchParams({
        fromDate, toDate, fromCustNo, toCustNo,
        brcd: branchCode,
        mode: "json",
      });
      const response = await fetch(`${BASE_URL}/api/15gh-submit-report?${params}`);
      const data     = await response.json();
      if (!response.ok) throw new Error(data.error || data.details || "15-G/H API failed");
      
      const rows = data.data || [];
      setColumns(rows.length > 0 ? Object.keys(rows[0]) : []);
      setResults(rows);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── 15-G-H Text View ─────────────────────────────────────────────────────────
  const handle15GHTextView = () => {
    if (!fromDate || !toDate) { setError("Please fill From Date and To Date."); return; }
    const { fromCustNo, toCustNo } = getCustomerRange();
    const params = new URLSearchParams({
      fromDate, toDate, fromCustNo, toCustNo,
      brcd: branchCode,
      mode: "text",
    });
    window.open(`${BASE_URL}/api/15gh-submit-report?${params}`, "_blank");
  };

  // ── Download CSV ─────────────────────────────────────────────────────────────
  const handleDownloadCsv = () => {
    if (!results || !results.length) return;
    const headers = columns.join(',');
    const rows = results.map(row => 
      columns.map(col => {
        let str = String(row[col] ?? '');
        str = str.replace(/"/g, '""');
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
          str = `"${str}"`;
        }
        return str;
      }).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeBtn === "tds" ? "tds_details" : "15gh_submit"}_${fromDate}_to_${toDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>TDS & 15-G/H Submit Reports</h2>
        </div>

        {/* Body */}
        <div style={styles.cardBody}>

          {/* Branch Code & Amount */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>Branch Code</label>
            <input style={styles.inputPink} type="text" value={branchCode} onChange={(e) => setBranchCode(e.target.value)} />
            
            <label style={{ ...styles.fieldLabel, width: "auto", marginLeft: 24, marginRight: 10 }}>Min Amount</label>
            <input style={styles.input} type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          {/* From Date / To Date */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>From Date</label>
            <input style={styles.input} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <label style={{ ...styles.fieldLabel, width: "auto", marginLeft: 24, marginRight: 10 }}>To Date</label>
            <input style={styles.input} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          {/* Flag (optional filter) */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>TDS Flag</label>
            <input style={styles.input} type="text" value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="e.g. TDS/Interest" />
          </div>

          {/* Radio: All / Specific */}
          <div style={{ ...styles.formRow, paddingLeft: 170 }}>
            <label style={styles.radioLabel}>
              <input type="radio" name="customerType" value="All" checked={customerType === "All"} onChange={() => setCustomerType("All")} style={styles.radio} />
              All Customer
            </label>
            <label style={styles.radioLabel}>
              <input type="radio" name="customerType" value="Specific" checked={customerType === "Specific"} onChange={() => setCustomerType("Specific")} style={styles.radio} />
              Specific Customer
            </label>
          </div>

          {/* All: From / To Customer ID */}
          {customerType === "All" && (
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>From Customer ID</label>
              <input style={styles.input} type="text" value={fromCustomerID} onChange={(e) => setFromCustomerID(e.target.value)} />
              <label style={{ ...styles.fieldLabel, width: "auto", marginLeft: 24, marginRight: 10 }}>TO Customer ID</label>
              <input style={styles.input} type="text" value={toCustomerID} onChange={(e) => setToCustomerID(e.target.value)} />
            </div>
          )}

          {/* Specific: Single Customer ID */}
          {customerType === "Specific" && (
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>Customer ID</label>
              <input style={styles.input} type="text" value={customerID} onChange={(e) => setCustomerID(e.target.value)} placeholder="Enter Customer ID" />
            </div>
          )}

          {/* Error */}
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          {/* Buttons */}
          <div style={styles.btnRow}>
            <div style={styles.btnGroupLeft}>
              <button style={styles.btnTeal} onClick={handleTdsReport} disabled={loading}>TDS Report</button>
              <button style={styles.btnOutline} onClick={handleTdsTextView} disabled={loading}>TDS Text View</button>
              <button style={styles.btnOutline} onClick={handleClear}>Clear</button>
            </div>
            <div style={styles.btnGroupRight}>
              <button style={styles.btnTeal} onClick={handle15GHReport} disabled={loading}>15-G-H Submit Report</button>
              <button style={{ ...styles.btnTeal, background: "linear-gradient(90deg, #6366f1, #818cf8)" }} onClick={handle15GHTextView}>
                15-G-H Text View
              </button>
              {results && results.length > 0 && (
                <button style={styles.btnExcel} onClick={handleDownloadCsv}>Export CSV</button>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={styles.loadingBox}>⏳ Fetching report data from server...</div>
          )}

        </div>
      </div>

      {/* Results Table */}
      {results && results.length > 0 && (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <span>
              {activeBtn === "tds" ? "TDS Details" : "15-G/H Submit"} Report — {results.length} record(s) found
            </span>
          </div>
          <div style={{ overflowX: "auto", maxHeight: "400px" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} style={styles.th}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    {columns.map((col, j) => (
                      <td key={j} style={styles.td}>{String(row[col] ?? "-")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {results && results.length === 0 && (
        <div style={styles.noDataBox}>No records found for the selected criteria.</div>
      )}
    </div>
  );
}

const styles = {
  container:     { display: "flex", flexDirection: "column", gap: 20, width: "100%" },
  card:          { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "'Poppins', sans-serif", border: "1px solid #cbd5e1" },
  cardHeader:    { background: "linear-gradient(90deg, #334155, #334155)", padding: "12px 20px" },
  cardTitle:     { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody:      { padding: "20px 24px" },
  formRow:       { display: "flex", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 6 },
  fieldLabel:    { width: 160, fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0 },
  input:         { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box" },
  inputPink:     { height: 32, border: "1px solid #fbcfe8", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", background: "#fdf2f8" },
  radioLabel:    { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer", marginRight: 16, userSelect: "none" },
  radio:         { accentColor: "#334155", width: 14, height: 14, cursor: "pointer" },
  errorBox:      { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 6, padding: "10px 14px", fontSize: 12, margin: "10px 0" },
  loadingBox:    { background: "#eff6ff", border: "1px solid #93c5fd", color: "#1d4ed8", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12 },
  noDataBox:     { background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12, textAlign: "center" },
  btnRow:        { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginTop: 6 },
  btnGroupLeft:  { display: "flex", gap: 8 },
  btnGroupRight: { display: "flex", gap: 8, flexWrap: "wrap" },
  btnTeal:       { height: 32, padding: "0 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #334155, #334155)", border: "none", color: "white", fontFamily: "'Poppins',sans-serif" },
  btnOutline:    { height: 32, padding: "0 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "white", border: "1px solid #9ca3af", color: "#374151", fontFamily: "'Poppins',sans-serif" },
  btnExcel:      { height: 32, padding: "0 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #10b981, #059669)", border: "none", color: "white", fontFamily: "'Poppins',sans-serif" },
  tableWrapper:  { marginTop: 20, borderRadius: 8, overflow: "hidden", border: "1px solid #cbd5e1" },
  tableHeader:   { background: "#475569", color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600 },
  table:         { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th:            { background: "#f1f5f9", color: "#374151", padding: "8px 10px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" },
  td:            { padding: "7px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" },
  trEven:        { background: "white" },
  trOdd:         { background: "#f8fafc" },
};