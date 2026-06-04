import { useState } from "react";
import { fetchKycReport } from "../api/api";

export default function KYCReport() {
  const [kycType, setKycType] = useState("All");
  const [exportReport, setExportReport] = useState("");
  const [asOnDate, setAsOnDate] = useState("2026-03-28");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleKycReport = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    if (!asOnDate) {
      setError("Please select As On Date.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchKycReport({
        flag: kycType || "All",
        tDate: asOnDate,
        fDate: "1900-01-01",
        fBrcd: "1",
        tBrcd: "9999",
      });

      if (response.success) {
        setSuccessMessage(response.message || "KYC Report retrieved successfully.");
        setResultData(response.data);
      } else {
        setError(response.error || "Failed to retrieve KYC Report.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDumpKycReport = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    if (!asOnDate) {
      setError("Please select As On Date.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchKycReport({
        flag: "Dump",
        tDate: asOnDate,
        fDate: "1900-01-01",
        fBrcd: "1",
        tBrcd: "9999",
      });

      if (response.success) {
        setSuccessMessage(response.message || "Dump KYC Report retrieved successfully.");
        setResultData(response.data);
      } else {
        setError(response.error || "Failed to retrieve Dump KYC Report.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>KYC Reports</h2>
      </div>

      <div style={styles.cardBody}>

        {/* Row 1: KYC Type / Export Report */}
        <div style={styles.formRow}>
          <label style={styles.label}>Kyc Type</label>
          <select style={styles.select} value={kycType} onChange={(e) => setKycType(e.target.value)}>
            <option value="All">All</option>
            <option value="Complete">Completed</option>
            <option value="Pending">Incompleted</option>
          </select>

          <label style={{ ...styles.label, marginLeft: 40 }}>Export Report</label>
          <select style={styles.select} value={exportReport} onChange={(e) => setExportReport(e.target.value)}>
            <option value="">--Select--</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        {/* Row 2: As On Date */}
        <div style={styles.formRow}>
          <label style={styles.label}>As On Date</label>
          <input
            style={styles.input}
            type="date"
            value={asOnDate}
            onChange={(e) => setAsOnDate(e.target.value)}
          />
        </div>

        <hr style={styles.divider} />

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button
            style={loading ? styles.btnTealDisabled : styles.btnTeal}
            onClick={handleKycReport}
            disabled={loading}
          >
            {loading ? "Loading..." : "KYC Report"}
          </button>
          <button
            style={loading ? styles.btnTealDisabled : styles.btnTeal}
            onClick={handleDumpKycReport}
            disabled={loading}
          >
            {loading ? "Loading..." : "Dump KYC Report"}
          </button>
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
  label: { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, minWidth: 90 },
  input: {
    height: 36, border: "1px solid #d1d5db", borderRadius: 6,
    padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none",
    width: 220, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
    cursor: "pointer",
  },
  select: {
    height: 36, border: "1px solid #d1d5db", borderRadius: 6,
    padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none",
    width: 220, fontFamily: "'Poppins', sans-serif", background: "white", cursor: "pointer",
  },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "18px 0" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btnTeal: {
    height: 34, padding: "0 20px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", border: "none", color: "white",
    background: "#334155", fontFamily: "'Poppins', sans-serif",
    transition: "background 0.2s ease",
  },
  btnTealDisabled: {
    height: 34, padding: "0 20px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "not-allowed", border: "none", color: "#9ca3af",
    background: "#e5e7eb", fontFamily: "'Poppins', sans-serif",
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