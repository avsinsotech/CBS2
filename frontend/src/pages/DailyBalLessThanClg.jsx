import { useState } from "react";
import { fetchDailyBalLessThanClg } from "../api/api";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DailyBalLessThanClg() {
  const [branchID, setBranchID] = useState("1");
  const [asOnDate, setAsOnDate] = useState("2026-01-11");
  const [productCode, setProductCode] = useState("1");
  const [productName, setProductName] = useState("SAVINGS ACCOUNT");
  const [periodMM, setPeriodMM] = useState("01");
  const [textReportName, setTextReportName] = useState("DailyBalanceReport");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleClear = () => {
    setBranchID("1");
    setAsOnDate("2026-01-11");
    setProductCode("1");
    setProductName("SAVINGS ACCOUNT");
    setPeriodMM("01");
    setTextReportName("DailyBalanceReport");
    setError(null);
    setSuccessMessage(null);
    setResultData(null);
  };

  const handleShowReport = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    if (!branchID || !asOnDate || !productCode || !periodMM) {
      setError("Please fill in BranchID, AsOnDate, ProductCode, and Period.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchDailyBalLessThanClg({
        branchID,
        asOnDate,
        productCode,
        periodMM,
      });

      if (response.success) {
        setSuccessMessage(response.message || "Daily Balance Report retrieved successfully.");
        setResultData(response.data);
      } else {
        setError(response.error || "Failed to retrieve Daily Balance Report.");
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

    if (!branchID || !asOnDate || !productCode || !periodMM) {
      setError("Please fill in BranchID, AsOnDate, ProductCode, and Period.");
      return;
    }

    const params = new URLSearchParams({
      branchID,
      asOnDate,
      productCode,
      periodMM,
    });

    window.open(`${BASE_URL}/api/daily-balance-less-than-clg/text-report-view?${params}`, '_blank');
  };

  return (
    <div style={styles.card}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Daily Balance Less Than Closing Bal Report</h2>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>

        {/* Inner bordered box */}
        <div style={styles.innerBox}>

          {/* BranchID */}
          <div style={styles.formRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>BranchID <span style={styles.req}>*</span></label>
              <input
                style={styles.inputYellow}
                type="text"
                value={branchID}
                onChange={(e) => setBranchID(e.target.value)}
              />
            </div>

            {/* AsOnDate */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>AsOnDate <span style={styles.req}>*</span></label>
              <input
                style={styles.inputDate}
                type="date"
                value={asOnDate}
                onChange={(e) => setAsOnDate(e.target.value)}
              />
            </div>
          </div>

          {/* ProductCode & Name */}
          <div style={styles.formRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>ProductCode <span style={styles.req}>*</span></label>
              <input
                style={{ ...styles.input, width: 90 }}
                type="text"
                placeholder="Code"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              <input
                style={{ ...styles.inputReadOnly, width: 220 }}
                type="text"
                placeholder="Product Name"
                value={productName}
                readOnly
              />
            </div>
          </div>

          {/* Period (MM) */}
          <div style={styles.formRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>
                Period (MM) : <span style={styles.req}>*</span>
              </label>
              <input
                style={{ ...styles.input, width: 100 }}
                type="text"
                value={periodMM}
                onChange={(e) => setPeriodMM(e.target.value)}
              />
            </div>
          </div>

          {/* Text Report Name */}
          <div style={{ ...styles.formRow, marginBottom: 0 }}>
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>
                Please enter text report name <span style={styles.req}>*</span>
              </label>
              <input
                style={{ ...styles.input, width: 300 }}
                type="text"
                placeholder="Please enter text report name"
                value={textReportName}
                onChange={(e) => setTextReportName(e.target.value)}
              />
            </div>
          </div>

        </div>{/* /innerBox */}

        {/* Feedback Section */}
        {loading && <div style={styles.infoBox}>Processing request... Please wait.</div>}
        {error && <div style={styles.errorBox}>{error}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={loading ? styles.btnPrimaryDisabled : styles.btnPrimary} onClick={handleShowReport} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button style={styles.btnOutline} onClick={handleClear} disabled={loading}>
            Clear
          </button>
          <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>
            Text Report View
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
                    <th style={styles.th}>BRCD</th>
                    <th style={styles.th}>SUBGLCODE</th>
                    <th style={styles.th}>ACCNO</th>
                    <th style={styles.th}>CUSTNO</th>
                    <th style={styles.th}>Customer Name</th>
                    <th style={styles.th}>Opening Date</th>
                    <th style={styles.th}>D_Amount</th>
                    <th style={styles.th}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>{row.BRCD}</td>
                      <td style={styles.td}>{row.SUBGLCODE}</td>
                      <td style={styles.td}>{row.ACCNO}</td>
                      <td style={styles.td}>{row.CUSTNO}</td>
                      <td style={styles.td}>{row.Custname}</td>
                      <td style={styles.td}>{row.OPENINGDATE}</td>
                      <td style={styles.td}>{row.D_AMOUNT}</td>
                      <td style={styles.td}>{row.Balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resultData && resultData.length === 0 && (
          <div style={styles.infoBox}>No daily balance records found matching the criteria.</div>
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
    color: "white",
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
  },
  cardBody: {
    padding: "20px 24px 24px",
  },
  innerBox: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "16px 20px 20px",
    marginBottom: 24,
    background: "#fafafa",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 40,
  },
  fieldGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    whiteSpace: "nowrap",
    width: 180,
  },
  req: { color: "#ef4444" },
  input: {
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
    background: "white",
  },
  inputReadOnly: {
    height: 32,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 12,
    color: "#6b7280",
    outline: "none",
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "#f3f4f6",
  },
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
    width: 80,
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