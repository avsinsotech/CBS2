import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function TDSReport() {
  const [customerType,   setCustomerType]   = useState("All");
  const [branchCode,     setBranchCode]     = useState("0000");
  const [fromDate,       setFromDate]       = useState("2025-04-01");
  const [toDate,         setToDate]         = useState("2026-03-30");
  const [fromCustomerID, setFromCustomerID] = useState("1");
  const [toCustomerID,   setToCustomerID]   = useState("999999999");
  const [customerID,     setCustomerID]     = useState("");

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [results,  setResults]  = useState(null);
  const [activeBtn,setActiveBtn]= useState(null);

  const handleClear = () => {
    setBranchCode("0000");
    setFromDate("2025-04-01");
    setToDate("2026-03-30");
    setCustomerType("All");
    setFromCustomerID("1");
    setToCustomerID("999999999");
    setCustomerID("");
    setResults(null);
    setError(null);
    setActiveBtn(null);
  };

  // Resolve customer range based on radio selection
  const getCustomerRange = () => ({
    fromCustNo: customerType === "Specific" ? customerID : fromCustomerID,
    toCustNo:   customerType === "Specific" ? customerID : toCustomerID,
  });

  // ── 15-G-H Submit Report → JSON table ──────────────────────────────────────
  const handle15GHReport = async () => {
    if (!fromDate || !toDate) { setError("Please fill From Date and To Date."); return; }
    if (customerType === "Specific" && !customerID.trim()) { setError("Please enter a Customer ID."); return; }

    setLoading(true); setError(null); setResults(null); setActiveBtn("15gh");

    try {
      const { fromCustNo, toCustNo } = getCustomerRange();
      const params = new URLSearchParams({
        fromDate, toDate, fromCustNo, toCustNo,
        brcd: branchCode,
        mode: "json",
      });
      const response = await fetch(`${BASE_URL}/api/15gh-submit-report?${params}`);
      const data     = await response.json();
      if (!response.ok) throw new Error(data.error || data.details || "API request failed");
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── 15-G-H Submit Report → Text view in new tab ─────────────────────────────
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

  return (
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>TDS Details</h2>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>

        {/* Branch Code */}
        <div style={styles.formRow}>
          <label style={styles.fieldLabel}>Branch Code</label>
          <input style={styles.inputPink} type="text" value={branchCode} onChange={(e) => setBranchCode(e.target.value)} />
        </div>

        {/* From Date / To Date */}
        <div style={styles.formRow}>
          <label style={styles.fieldLabel}>From Date</label>
          <input style={styles.input} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <label style={{ ...styles.fieldLabel, width: "auto", marginLeft: 24, marginRight: 10 }}>To Date</label>
          <input style={styles.input} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
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
            <button style={styles.btnTeal} disabled={loading}>Report</button>
            <button style={styles.btnTeal} onClick={handleClear}>Clear</button>
            <button style={styles.btnOutline}>Exit</button>
          </div>
          <div style={styles.btnGroupRight}>
            <button style={styles.btnTeal} disabled={loading}>Deposit Enquiry</button>
            {/* 15-G-H: click = JSON table, right-click/shift-click opens text view */}
            <button
              style={styles.btnTeal}
              onClick={handle15GHReport}
              onAuxClick={handle15GHTextView}   /* middle-click → text tab */
              title="Click for table view | Middle-click for text report in new tab"
              disabled={loading}
            >
              {loading && activeBtn === "15gh" ? "Loading..." : "15-G-H Submit Report"}
            </button>
            <button
              style={{ ...styles.btnTeal, background: "linear-gradient(90deg, #6366f1, #818cf8)" }}
              onClick={handle15GHTextView}
              title="Open 15-G-H report as plain text in new tab"
            >
              15-G-H Text View
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && activeBtn === "15gh" && (
          <div style={styles.loadingBox}>⏳ Fetching 15-G-H Submit Report...</div>
        )}

        {/* Results Table */}
        {results && results.data && results.data.length > 0 && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              15-G/H Submit Report — {results.rowCount} record(s) &nbsp;|&nbsp;
              {results.parameters.fromDate} → {results.parameters.toDate} &nbsp;|&nbsp;
              Customer: {results.parameters.fromCustNo}→{results.parameters.toCustNo}
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
          <div style={styles.noDataBox}>No 15-G/H records found for the selected criteria.</div>
        )}

      </div>
    </div>
  );
}

const styles = {
  card:          { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "'Poppins', sans-serif", border: "1px solid #99f6e4" },
  cardHeader:    { background: "linear-gradient(90deg, #2563eb, #38bdf8)", padding: "12px 20px" },
  cardTitle:     { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody:      { padding: "20px 24px" },
  formRow:       { display: "flex", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 6 },
  fieldLabel:    { width: 160, fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0 },
  input:         { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", cursor: "pointer" },
  inputPink:     { height: 32, border: "1px solid #fca5a5", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins',sans-serif", boxSizing: "border-box", background: "#fff1f2" },
  radioLabel:    { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer", marginRight: 16, userSelect: "none" },
  radio:         { accentColor: "#0d9488", width: 14, height: 14, cursor: "pointer" },
  errorBox:      { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 6, padding: "10px 14px", fontSize: 12, margin: "10px 0" },
  loadingBox:    { background: "#eff6ff", border: "1px solid #93c5fd", color: "#1d4ed8", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12 },
  noDataBox:     { background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12, textAlign: "center" },
  btnRow:        { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginTop: 6 },
  btnGroupLeft:  { display: "flex", gap: 8 },
  btnGroupRight: { display: "flex", gap: 8, flexWrap: "wrap" },
  btnTeal:       { height: 32, padding: "0 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #0d9488, #14b8a6)", border: "none", color: "white", fontFamily: "'Poppins',sans-serif" },
  btnOutline:    { height: 32, padding: "0 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "white", border: "1px solid #9ca3af", color: "#374151", fontFamily: "'Poppins',sans-serif" },
  tableWrapper:  { marginTop: 20, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" },
  tableHeader:   { background: "linear-gradient(90deg, #2563eb, #38bdf8)", color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600 },
  table:         { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th:            { background: "#f1f5f9", color: "#374151", padding: "8px 10px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" },
  td:            { padding: "7px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" },
  trEven:        { background: "white" },
  trOdd:         { background: "#f8fafc" },
};