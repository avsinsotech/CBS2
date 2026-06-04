import { useState } from "react";
import { fetchSiReport } from "../api/api";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SIReport() {
  const [siType, setSiType] = useState("ddsToLoan");
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2026-03-31");
  const [branchCode, setBranchCode] = useState("1");
  const [branchName, setBranchName] = useState("HEAD OFFICE");
  const [reportName, setReportName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleClearAll = () => {
    setFromDate("2025-04-01");
    setToDate("2026-03-31");
    setBranchCode("1");
    setBranchName("HEAD OFFICE");
    setReportName("");
    setError(null);
    setSuccessMessage(null);
    setResultData(null);
  };

  const handleReport = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    if (!fromDate || !toDate || !branchCode) {
      setError("Please fill in Branch Code, From Date, and To Date.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchSiReport({
        flag: "Report1",
        brcd: branchCode,
        fromDate,
        toDate,
      });

      if (response.success) {
        setSuccessMessage(response.message || "Standing Instruction Report retrieved successfully.");
        setResultData(response.data);
      } else {
        setError(response.error || "Failed to retrieve Standing Instruction Report.");
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

    if (!fromDate || !toDate || !branchCode) {
      setError("Please fill in Branch Code, From Date, and To Date.");
      return;
    }

    const params = new URLSearchParams({
      flag: "Report1",
      brcd: branchCode,
      fromDate,
      toDate,
    });

    window.open(`${BASE_URL}/api/si-report/text-report-view?${params}`, '_blank');
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Standing Instruction Report</h2>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>

        {/* Inner bordered box */}
        <div style={styles.innerBox}>

          {/* Radio - DDS To Loan */}
          <div style={styles.radioRow}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="siType"
                value="ddsToLoan"
                checked={siType === "ddsToLoan"}
                onChange={() => setSiType("ddsToLoan")}
                style={styles.radioInput}
              />
              DDS To Loan
            </label>
          </div>

          {/* Branch Code */}
          <div style={styles.formRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Branch Code</label>
              <input
                style={{ ...styles.inputYellow, width: 80 }}
                type="text"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
              />
              <input
                style={{ ...styles.inputPink, width: 200 }}
                type="text"
                value={branchName}
                readOnly
              />
            </div>
          </div>

          {/* From Date / To Date */}
          <div style={styles.formRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>From Date</label>
              <input
                style={styles.inputDate}
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>To Date</label>
              <input
                style={styles.inputDate}
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Enter Report Name */}
          <div style={styles.formRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Enter Report Name <span style={styles.req}>*</span>
              </label>
              <input
                style={styles.inputText}
                type="text"
                placeholder="Enter Report Name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Feedback Section */}
        {loading && <div style={styles.infoBox}>Processing request... Please wait.</div>}
        {error && <div style={styles.errorBox}>{error}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={loading ? styles.btnPrimaryDisabled : styles.btnPrimary} onClick={handleReport} disabled={loading}>
            {loading ? "Loading..." : "Report"}
          </button>
          <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>
            Text Report
          </button>
          <button style={styles.btnOutline} onClick={handleClearAll}>
            Clear All
          </button>
        </div>

        {/* Results Table */}
        {resultData && resultData.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={styles.resultTitle}>Results ({resultData.length} records found)</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>SI No</th>
                    <th style={styles.th}>Debit GL</th>
                    <th style={styles.th}>Debit AccNo</th>
                    <th style={styles.th}>Debit Name</th>
                    <th style={styles.th}>Credit GL</th>
                    <th style={styles.th}>Credit AccNo</th>
                    <th style={styles.th}>Credit Name</th>
                    <th style={styles.th}>Installment</th>
                    <th style={styles.th}>DAmt</th>
                    <th style={styles.th}>CAmt</th>
                    <th style={styles.th}>Loan Bal</th>
                    <th style={styles.th}>DDS Bal</th>
                    <th style={styles.th}>Ded Pri</th>
                    <th style={styles.th}>Ded Int</th>
                    <th style={styles.th}>Comm.</th>
                    <th style={styles.th}>Charges</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>{row.Sino}</td>
                      <td style={styles.td}>{row.DSc} ({row.DGLname})</td>
                      <td style={styles.td}>{row.DAn}</td>
                      <td style={styles.td}>{row.DCustname}</td>
                      <td style={styles.td}>{row.CSc} ({row.CGlname})</td>
                      <td style={styles.td}>{row.CAn}</td>
                      <td style={styles.td}>{row.CCustName}</td>
                      <td style={styles.td}>{row.Installment}</td>
                      <td style={styles.td}>{row.DAmt}</td>
                      <td style={styles.td}>{row.CAmt}</td>
                      <td style={styles.td}>{row.LoanBal}</td>
                      <td style={styles.td}>{row.DDSBal}</td>
                      <td style={styles.td}>{row.Ded_Pri}</td>
                      <td style={styles.td}>{row.Ded_Int}</td>
                      <td style={styles.td}>{row.Commission}</td>
                      <td style={styles.td}>{row.Charges}</td>
                      <td style={styles.td}>{row.Flag_Exe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resultData && resultData.length === 0 && (
          <div style={styles.infoBox}>No standing instruction records found for the selected criteria.</div>
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
    background: "linear-gradient(90deg, #334155, #334155)",
    padding: "12px 20px",
  },
  cardTitle: {
    color: "white", margin: 0, fontSize: 15, fontWeight: 600,
  },
  cardBody: { padding: "20px 24px 24px" },

  innerBox: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "16px 20px 20px",
    marginBottom: 24,
    background: "#fafafa",
  },

  radioRow: {
    marginBottom: 16,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
  },
  radioInput: {
    width: 15, height: 15,
    accentColor: "#2563eb",
    cursor: "pointer",
  },

  formRow: {
    display: "flex",
    alignItems: "center",
    gap: 40,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  fieldGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  req: { color: "#ef4444" },

  inputYellow: {
    height: 32,
    border: "1px solid #fbbf24",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 12,
    color: "#1e293b",
    outline: "none",
    background: "#fefce8",
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
  },
  inputPink: {
    height: 32,
    border: "1px solid #fda4af",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 12,
    color: "#9f1239",
    outline: "none",
    background: "#fff1f2",
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
  },
  inputDate: {
    height: 32,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 12,
    color: "#1e293b",
    outline: "none",
    width: 180,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    cursor: "pointer",
    background: "white",
  },
  inputText: {
    height: 32,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 12,
    color: "#1e293b",
    outline: "none",
    width: 300,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "white",
  },

  btnRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  btnPrimary: {
    height: 34,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
    color: "white",
    background: "#334155",
    fontFamily: "'Poppins', sans-serif",
  },
  btnPrimaryDisabled: {
    height: 34,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "not-allowed",
    border: "none",
    color: "#9ca3af",
    background: "#e5e7eb",
    fontFamily: "'Poppins', sans-serif",
  },
  btnOutline: {
    height: 34,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    color: "#374151",
    background: "white",
    border: "1px solid #9ca3af",
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
    marginBottom: "16px",
  },
  errorBox: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    color: "#991b1b",
    fontSize: "12px",
    marginTop: "16px",
    marginBottom: "16px",
  },
  successBox: {
    padding: "12px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    color: "#166534",
    fontSize: "12px",
    marginTop: "16px",
    marginBottom: "16px",
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