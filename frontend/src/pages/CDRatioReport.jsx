import { useState } from "react";
import { fetchCdRatioReport } from "../api/api";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export default function CDRatioReport() {
  const [reportType, setReportType] = useState("summary");
  const [branchCode, setBranchCode] = useState("1");
  const [branchName, setBranchName] = useState("HEAD OFFICE");
  const [asOnDate, setAsOnDate] = useState("2025-07-26");
  const [textReportName, setTextReportName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleClearAll = () => {
    setReportType("summary");
    setBranchCode("1");
    setBranchName("HEAD OFFICE");
    setAsOnDate("2025-07-26");
    setTextReportName("");
    setError(null);
    setSuccessMessage(null);
    setResultData(null);
  };

  const handleReport = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    if (!branchCode || !asOnDate) {
      setError("Please fill in Branch Code and As On Date.");
      setLoading(false);
      return;
    }

    try {
      // Map reportType to Flag1
      // If summary -> "CD" (returns cdratio)
      // If details -> "" (returns detail rows)
      const flag1Val = reportType === "summary" ? "CD" : "";

      const response = await fetchCdRatioReport({
        flag: "CDR",
        brcd: branchCode,
        onDate: asOnDate,
        flag1: flag1Val,
      });

      if (response.success) {
        setSuccessMessage(response.message || "CD Ratio Report retrieved successfully.");
        setResultData(response.data);
      } else {
        setError(response.error || "Failed to retrieve CD Ratio Report.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextReportView = () => {
    setError(null);
    setSuccessMessage(null);

    if (!branchCode || !asOnDate) {
      setError("Please fill in Branch Code and As On Date.");
      return;
    }

    const flag1Val = reportType === "summary" ? "CD" : "";
    const params = new URLSearchParams({
      flag: "CDR",
      brcd: branchCode,
      onDate: asOnDate,
      flag1: flag1Val,
    });

    window.open(`${BASE_URL}/api/cd-ratio-report/text-report-view?${params}`, '_blank');
  };


  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>CD Ratio Report</h2>
      </div>

      <div style={styles.cardBody}>

        {/* Report Type Radio */}
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

        {/* Branch Code */}
        <div style={styles.formRow}>
          <label style={styles.label}>Branch Code</label>
          <input
            style={{ ...styles.input, ...styles.inputYellow, width: 200 }}
            type="text"
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
          />
          <input
            style={{ ...styles.input, ...styles.inputPink, width: 320, marginLeft: 8 }}
            type="text"
            value={branchName}
            readOnly
          />
        </div>

        {/* As On Date */}
        <div style={styles.formRow}>
          <label style={styles.label}>As On Date</label>
          <input
            style={{ ...styles.input, width: 200 }}
            type="date"
            value={asOnDate}
            onChange={(e) => setAsOnDate(e.target.value)}
          />
        </div>

        {/* Enter Text Report Name */}
        <div style={styles.formRow}>
          <label style={styles.label}>Enter Text Report Name</label>
          <input
            style={{ ...styles.input, width: 340 }}
            type="text"
            placeholder="Enter Text Report Name"
            value={textReportName}
            onChange={(e) => setTextReportName(e.target.value)}
          />
        </div>

        {/* Footer Buttons */}
        <div style={styles.footer}>
          <div style={styles.btnRow}>
            <button
              style={loading ? styles.btnPrimaryDisabled : styles.btnPrimary}
              onClick={handleReport}
              disabled={loading}
            >
              {loading ? "Loading..." : "Report"}
            </button>
            <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>
              Text Report View
            </button>

            <button style={styles.btnPrimary} onClick={handleClearAll}>Clear All</button>
            <button style={styles.btnOutline} onClick={handleClearAll}>Exit</button>
          </div>
        </div>

        {/* Feedback Section */}
        {loading && <div style={styles.infoBox}>Processing request... Please wait.</div>}
        {error && <div style={styles.errorBox}>{error}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        {/* Results Data Table */}
        {resultData && resultData.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={styles.resultTitle}>Results ({resultData.length} records found)</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    {Object.keys(resultData[0]).map((key) => (
                      <th key={key} style={styles.th}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      {Object.values(row).map((val, idx) => (
                        <td key={idx} style={styles.td}>
                          {val !== null && val !== undefined ? String(val) : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white", borderRadius: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    overflow: "hidden", fontFamily: "'Poppins', sans-serif",
  },
  cardHeader: { background: "linear-gradient(90deg, #334155, #334155)", padding: "12px 20px" },
  cardTitle: { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody: { padding: "24px 20px" },
  formRow: {
    display: "flex", alignItems: "center",
    marginBottom: 16, flexWrap: "wrap", gap: 8,
  },
  label: {
    fontSize: 12, fontWeight: 500, color: "#374151",
    flexShrink: 0, width: 160,
  },
  input: {
    height: 34, border: "1px solid #d1d5db", borderRadius: 6,
    padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none",
    fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
    cursor: "pointer",
  },
  inputYellow: { background: "#fefce8", borderColor: "#fbbf24" },
  inputPink: { background: "#fff1f2", borderColor: "#fda4af", color: "#9f1239" },
  radioGroup: { display: "flex", alignItems: "center", gap: 28 },
  radioLabel: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer",
  },
  radioInput: { width: 15, height: 15, accentColor: "#2563eb", cursor: "pointer" },
  footer: {
    background: "#f8fafc",
    margin: "20px -20px -20px",
    padding: "14px 20px",
    borderTop: "1px solid #e5e7eb",
  },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  btnPrimary: {
    height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", border: "none", color: "white",
    background: "#334155",
    fontFamily: "'Poppins', sans-serif",
    transition: "background 0.2s ease",
  },
  btnPrimaryDisabled: {
    height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "not-allowed", border: "none", color: "#9ca3af",
    background: "#e5e7eb", fontFamily: "'Poppins', sans-serif",
  },
  btnOutline: {
    height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", color: "#374151",
    background: "white", border: "1px solid #9ca3af",
    fontFamily: "'Poppins', sans-serif",
  },
  infoBox: {
    padding: "12px",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    color: "#1e3a8a",
    fontSize: "12px",
    marginTop: "16px",
  },
  errorBox: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    color: "#991b1b",
    fontSize: "12px",
    marginTop: "16px",
  },
  successBox: {
    padding: "12px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    color: "#166534",
    fontSize: "12px",
    marginTop: "16px",
  },
  resultTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "10px",
  },
  tableContainer: {
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    marginTop: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "11px",
    textAlign: "left",
  },
  thRow: {
    backgroundColor: "#f3f4f6",
    borderBottom: "2px solid #e5e7eb",
  },
  th: {
    padding: "10px 12px",
    fontWeight: 600,
    color: "#374151",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
    whiteSpace: "nowrap",
  },
  trEven: {
    backgroundColor: "white",
  },
  trOdd: {
    backgroundColor: "#f9fafb",
  },
};