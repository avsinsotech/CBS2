


import { useState } from "react";
import { fetchLoanDepoReg } from "../api/api";

export default function LoanDepositRegister() {
  const [asOnDate, setAsOnDate] = useState("");
  const [subGLCode, setSubGLCode] = useState("");
  const [subGLDesc, setSubGLDesc] = useState("");
  const [textReportName, setTextReportName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const brcd = "1"; // default branch code

  const callAPI = async (flag) => {
    if (!asOnDate || !subGLCode) {
      setError("Please fill As On Date and Sub GL Code.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await fetchLoanDepoReg({
        flag,
        subglcode: subGLCode,
        brcd,
        tdate: asOnDate,
      });
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAsOnDate("");
    setSubGLCode("");
    setSubGLDesc("");
    setTextReportName("");
    setResults(null);
    setError(null);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Loan &amp; Deposit Register</h2>
      </div>

      <div style={styles.cardBody}>

        {/* As On Date */}
        <div style={styles.formRow}>
          <label style={styles.label}>As On Date : <span style={styles.req}>*</span></label>
          <input
            style={styles.input}
            type="date"
            value={asOnDate}
            onChange={(e) => setAsOnDate(e.target.value)}
          />
        </div>

        {/* Sub GL Code */}
        <div style={styles.formRow}>
          <label style={styles.label}>Sub GLCode : <span style={styles.req}>*</span></label>
          <input
            style={{ ...styles.input, ...styles.inputYellow, width: 130 }}
            type="text"
            value={subGLCode}
            onChange={(e) => setSubGLCode(e.target.value)}
          />
          <input
            style={{ ...styles.input, width: 260, marginLeft: 8 }}
            type="text"
            placeholder="Description"
            value={subGLDesc}
            onChange={(e) => setSubGLDesc(e.target.value)}
          />
        </div>

        {/* Text Report Name */}
        <div style={styles.formRow}>
          <label style={styles.label}>Please enter text report name <span style={styles.req}>*</span></label>
          <input
            style={{ ...styles.input, width: 320 }}
            type="text"
            placeholder="Please enter text report name"
            value={textReportName}
            onChange={(e) => setTextReportName(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        <hr style={styles.divider} />

        {/* Buttons Row 1 - View (outline) */}
        <div style={styles.btnRow}>
          <button style={styles.btnOutline} onClick={() => callAPI("DDS")} disabled={loading}>DDS Report</button>
          <button style={styles.btnOutline} onClick={() => callAPI("DEPOSIT")} disabled={loading}>Deposit Report</button>
          <button style={styles.btnOutline} onClick={() => callAPI("LOAN")} disabled={loading}>Loan Report</button>
          <button style={styles.btnClose} onClick={handleClose}>Close</button>
          <button style={styles.btnPrimary} onClick={() => callAPI("LOAN")} disabled={loading}>Loan Report</button>
          <button style={styles.btnPrimary} onClick={() => callAPI("DEPOSIT")} disabled={loading}>Deposit Report</button>
          <button style={styles.btnPrimary} onClick={() => callAPI("DDS")} disabled={loading}>DDS Report</button>
          <button style={styles.btnPrimary} onClick={() => callAPI("LOAN_TEXT")} disabled={loading}>Loan Text Report View</button>
        </div>

        {/* Buttons Row 2 */}
        <div style={{ ...styles.btnRow, marginTop: 10 }}>
          <button style={styles.btnPrimary} onClick={() => callAPI("DDS_TEXT")} disabled={loading}>DDS Text Report View</button>
          <button style={styles.btnPrimary} onClick={() => callAPI("DEPOSIT_TEXT")} disabled={loading}>Deposit Text Report View</button>
        </div>

        {/* Loading */}
        {loading && <div style={styles.loadingBox}>⏳ Fetching data from server...</div>}

        {/* Results Table */}
        {results && results.data && results.data.length > 0 && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>
              Results — {results.rowCount} record(s) found
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
  card: { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "'Poppins', sans-serif" },
  cardHeader: { background: "linear-gradient(90deg, #334155, #334155)", padding: "12px 20px" },
  cardTitle: { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody: { padding: "24px 20px" },
  formRow: { display: "flex", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 4 },
  label: { width: 230, fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0 },
  req: { color: "#ef4444" },
  input: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", cursor: "pointer" },
  inputYellow: { background: "#fefce8", borderColor: "#fbbf24" },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "20px 0" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" },
  btnOutline: { height: 30, padding: "0 14px", borderRadius: 5, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: "white", border: "1px solid #9ca3af", color: "#374151", fontFamily: "'Poppins', sans-serif" },
  btnPrimary: { height: 30, padding: "0 14px", borderRadius: 5, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #334155, #334155)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
  btnClose: { height: 30, padding: "0 14px", borderRadius: 5, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: "white", border: "1px solid #d1d5db", color: "#6b7280", fontFamily: "'Poppins', sans-serif" },
  errorBox: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginBottom: 12 },
  loadingBox: { background: "#eff6ff", border: "1px solid #93c5fd", color: "#1d4ed8", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12 },
  noDataBox: { background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12, textAlign: "center" },
  tableWrapper: { marginTop: 20, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" },
  tableHeader: { background: "linear-gradient(90deg, #334155, #334155)", color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th: { background: "#f1f5f9", color: "#374151", padding: "8px 10px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" },
  td: { padding: "7px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" },
  trEven: { background: "white" },
  trOdd: { background: "#f8fafc" },
};