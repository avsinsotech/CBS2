import { useState } from "react";

const BASE_URL = "https://cbsapi.avsinsotech.com:8596";

export default function ChairmanReport() {
  const [branchCode,    setBranchCode]    = useState("1");
  const [asOnDate,      setAsOnDate]      = useState("2026-03-30");
  const [textFileName,  setTextFileName]  = useState("");

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [results,  setResults]  = useState(null);
  const [activeBtn,setActiveBtn]= useState(null);

  const validate = () => {
    if (!branchCode.trim()) return "Please enter Branch Code.";
    if (!asOnDate)          return "Please select As On Date.";
    return null;
  };

  // ── Print → JSON table ──────────────────────────────────────────────────────
  const handlePrint = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError(null); setResults(null); setActiveBtn("print");
    try {
      const params   = new URLSearchParams({ branchCode, asOnDate, mode: "json" });
      const response = await fetch(`${BASE_URL}/api/chairman-report?${params}`);
      const ct       = response.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const txt = await response.text();
        throw new Error(`Server returned non-JSON (HTTP ${response.status}). Raw: ${txt.substring(0, 200)}`);
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.details || "API request failed");
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Text Report View → new tab ───────────────────────────────────────────────
  const handleTextReportView = () => {
    const err = validate();
    if (err) { setError(err); return; }
    const params = new URLSearchParams({ branchCode, asOnDate, textFileName, mode: "text" });
    window.open(`${BASE_URL}/api/chairman-report?${params}`, "_blank");
  };

  // ── MIS-Reg. Office → new tab ───────────────────────────────────────────────
  const handleMISRegOffice = () => {
    const err = validate();
    if (err) { setError(err); return; }
    const params = new URLSearchParams({ branchCode, asOnDate, textFileName, mode: "mis" });
    window.open(`${BASE_URL}/api/chairman-report?${params}`, "_blank");
  };

  const handleClear = () => {
    setBranchCode("1");
    setAsOnDate("2026-03-30");
    setTextFileName("");
    setResults(null);
    setError(null);
    setActiveBtn(null);
  };

  return (
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Chairman Report</h2>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>

        {/* Inner bordered box */}
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

          {/* As On Date */}
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
              placeholder=""
              value={textFileName}
              onChange={(e) => setTextFileName(e.target.value)}
            />
          </div>

        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button
            style={styles.btnPrimary}
            onClick={handlePrint}
            disabled={loading}
          >
            {loading && activeBtn === "print" ? "Loading..." : "Print"}
          </button>
          <button
            style={styles.btnPrimary}
            onClick={handleTextReportView}
            disabled={loading}
          >
            Text Repot View
          </button>
          <button
            style={styles.btnPrimary}
            onClick={handleMISRegOffice}
            disabled={loading}
          >
            MIS-Reg. office
          </button>
        </div>

        {/* Loading */}
        {loading && activeBtn === "print" && (
          <div style={styles.loadingBox}>⏳ Fetching Chairman Report...</div>
        )}

        {/* Results Table */}
        {results && results.data && results.data.length > 0 && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              Chairman Report — {results.rowCount} record(s) &nbsp;|&nbsp;
              Branch: {results.parameters?.branchCode} &nbsp;|&nbsp;
              As On: {results.parameters?.asOnDate}
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

const styles = {
  card: {
    background: "white",
    borderRadius: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    background: "linear-gradient(90deg, #374151, #374151)",
    padding: "12px 20px",
  },
  cardTitle: { color: "white", margin: 0, fontSize: 15, fontWeight: 600 },

  cardBody: { padding: "20px 24px 24px" },

  innerBox: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "20px 24px",
    marginBottom: 20,
    background: "#fafafa",
  },

  formRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
    flexWrap: "wrap",
  },
  label: {
    width: 160,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
    textAlign: "right",
  },
  input: {
    height: 32,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 12,
    color: "#1e293b",
    outline: "none",
    width: 220,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "white",
    cursor: "pointer",
  },

  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    color: "#dc2626",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 12,
    marginBottom: 14,
  },

  btnRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  btnPrimary: {
    height: 32,
    padding: "0 22px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
    color: "white",
    background: "linear-gradient(90deg, #374151, #374151)",
    fontFamily: "'Poppins', sans-serif",
  },

  loadingBox: {
    background: "#eff6ff",
    border: "1px solid #93c5fd",
    color: "#1d4ed8",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 12,
    marginTop: 14,
  },
  noDataBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 12,
    marginTop: 14,
    textAlign: "center",
  },
  tableWrapper: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  tableHeader: {
    background: "linear-gradient(90deg, #374151, #374151)",
    color: "white",
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 600,
  },
  table:   { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th:      { background: "#f1f5f9", color: "#374151", padding: "8px 10px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" },
  td:      { padding: "7px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" },
  trEven:  { background: "white" },
  trOdd:   { background: "#f8fafc" },
};