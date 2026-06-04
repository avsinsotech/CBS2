import { useState } from "react";
import { fetchAccountOpenCloseReport } from "../api/api";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AccountOpenCloseReport() {
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2025-07-26");
  const [fromBrcd, setFromBrcd] = useState("1");
  const [fromBrcdName, setFromBrcdName] = useState("HEAD OFFICE");
  const [toBrcd, setToBrcd] = useState("1");
  const [toBrcdName, setToBrcdName] = useState("HEAD OFFICE");
  const [prodCode, setProdCode] = useState("1");
  const [prodName, setProdName] = useState("SAVING BANK A/C");
  const [toProdCode, setToProdCode] = useState("1");
  const [toProdName, setToProdName] = useState("SAVING BANK A/C");
  const [type, setType] = useState("Open");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleClear = () => {
    setFromDate("2025-04-01");
    setToDate("2025-07-26");
    setFromBrcd("1");
    setFromBrcdName("HEAD OFFICE");
    setToBrcd("1");
    setToBrcdName("HEAD OFFICE");
    setProdCode("1");
    setProdName("SAVING BANK A/C");
    setToProdCode("1");
    setToProdName("SAVING BANK A/C");
    setType("Open");
    setError(null);
    setSuccessMessage(null);
    setResultData(null);
  };

  const handleReport = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    if (!fromDate || !toDate || !fromBrcd || !toBrcd) {
      setError("Please fill in all required fields (Dates and Branch Codes).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchAccountOpenCloseReport({
        flag: type.toUpperCase(),
        fbrcd: fromBrcd,
        tbrcd: toBrcd,
        fromDate,
        toDate,
        subgl: prodCode || "1",
        tsubgl: toProdCode || "1",
      });

      if (response.success) {
        setSuccessMessage(response.message || "Account Open/Close Report retrieved successfully.");
        setResultData(response.data);
      } else {
        setError(response.error || "Failed to retrieve Report.");
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

    if (!fromDate || !toDate || !fromBrcd || !toBrcd) {
      setError("Please fill in all required fields.");
      return;
    }

    const params = new URLSearchParams({
      flag: type.toUpperCase(),
      fbrcd: fromBrcd,
      tbrcd: toBrcd,
      fromDate,
      toDate,
      subgl: prodCode || "1",
      tsubgl: toProdCode || "1",
    });

    window.open(`${BASE_URL}/api/account-open-close/text-report-view?${params}`, '_blank');
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Account Open Close Report</h2>
      </div>

      <div style={styles.cardBody}>

        <div style={styles.gridRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>From Date : <span style={styles.req}>*</span></label>
            <input
              style={styles.inputDate}
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>To Date : <span style={styles.req}>*</span></label>
            <input
              style={styles.inputDate}
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.gridRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>From BRCD : <span style={styles.req}>*</span></label>
            <div style={styles.inputGroup}>
              <input
                style={{ ...styles.input, ...styles.inputYellow, width: 80 }}
                type="text"
                value={fromBrcd}
                onChange={(e) => setFromBrcd(e.target.value)}
              />
              <input
                style={{ ...styles.input, width: 200 }}
                type="text"
                value={fromBrcdName}
                readOnly
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>To BRCD : <span style={styles.req}>*</span></label>
            <div style={styles.inputGroup}>
              <input
                style={{ ...styles.input, ...styles.inputYellow, width: 80 }}
                type="text"
                value={toBrcd}
                onChange={(e) => setToBrcd(e.target.value)}
              />
              <input
                style={{ ...styles.input, width: 200 }}
                type="text"
                value={toBrcdName}
                readOnly
              />
            </div>
          </div>
        </div>

        <div style={styles.gridRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Prod Code : <span style={styles.req}>*</span></label>
            <div style={styles.inputGroup}>
              <input
                style={{ ...styles.input, ...styles.inputYellow, width: 110 }}
                type="text"
                placeholder="Prod Code"
                value={prodCode}
                onChange={(e) => setProdCode(e.target.value)}
              />
              <input
                style={{ ...styles.input, width: 170 }}
                type="text"
                value={prodName}
                readOnly
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>To Prod Code : <span style={styles.req}>*</span></label>
            <div style={styles.inputGroup}>
              <input
                style={{ ...styles.input, ...styles.inputYellow, width: 110 }}
                type="text"
                placeholder="Prod Code"
                value={toProdCode}
                onChange={(e) => setToProdCode(e.target.value)}
              />
              <input
                style={{ ...styles.input, width: 170 }}
                type="text"
                value={toProdName}
                readOnly
              />
            </div>
          </div>
        </div>

        <div style={styles.radioRow}>
          <label style={styles.label}>Type : <span style={styles.req}>*</span></label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="type"
              value="Open"
              checked={type === "Open"}
              onChange={() => setType("Open")}
              style={styles.radio}
            />
            Open
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="type"
              value="Close"
              checked={type === "Close"}
              onChange={() => setType("Close")}
              style={styles.radio}
            />
            Close
          </label>
        </div>

        {loading && <div style={styles.infoBox}>Processing request... Please wait.</div>}
        {error && <div style={styles.errorBox}>{error}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        <hr style={styles.divider} />

        <div style={styles.btnRow}>
          <button style={loading ? styles.btnPrimaryDisabled : styles.btnPrimary} onClick={handleReport} disabled={loading}>
            {loading ? "Loading..." : "Report"}
          </button>
          <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>
            Text Report
          </button>
          <button style={styles.btnOutline} onClick={handleClear}>Clear</button>
        </div>

        {resultData && resultData.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={styles.resultTitle}>Results ({resultData.length} records found)</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Brcd</th>
                    <th style={styles.th}>Cust No</th>
                    <th style={styles.th}>SubGL</th>
                    <th style={styles.th}>Account No</th>
                    <th style={styles.th}>Customer Name</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Maker</th>
                    <th style={styles.th}>Checker</th>
                    <th style={styles.th}>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={styles.td}>{row.ID}</td>
                      <td style={styles.td}>{row.BRCD}</td>
                      <td style={styles.td}>{row.CUSTNO}</td>
                      <td style={styles.td}>{row.SUBGLCODE}</td>
                      <td style={styles.td}>{row.ACCNO}</td>
                      <td style={styles.td}>{row.CUSTNAME}</td>
                      <td style={styles.td}>{row.ADATE}</td>
                      <td style={styles.td}>{row.ACC_STATUS}</td>
                      <td style={styles.td}>{row.MAKER}</td>
                      <td style={styles.td}>{row.CHECKER || "-"}</td>
                      <td style={styles.td}>{row.CREDIT}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resultData && resultData.length === 0 && (
          <div style={styles.infoBox}>No records found for the selected criteria.</div>
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
  },
  cardHeader: {
    background: "linear-gradient(90deg, #334155, #334155)",
    padding: "12px 20px",
  },
  cardTitle: {
    color: "white",
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  cardBody: {
    padding: "24px 28px",
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 14,
  },
  formGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  inputGroup: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    whiteSpace: "nowrap",
    minWidth: 90,
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
    width: 160,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "white",
  },
  inputYellow: {
    background: "#fefce8",
    borderColor: "#fbbf24",
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
  radioRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#374151",
    cursor: "pointer",
  },
  radio: {
    accentColor: "#0d9488",
    width: 14,
    height: 14,
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "20px 0",
  },
  btnRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  btnPrimary: {
    height: 32,
    padding: "0 18px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "#334155",
    border: "none",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  btnPrimaryDisabled: {
    height: 32,
    padding: "0 18px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "not-allowed",
    background: "#e5e7eb",
    border: "none",
    color: "#9ca3af",
    fontFamily: "'Poppins', sans-serif",
  },
  btnOutline: {
    height: 32,
    padding: "0 18px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "white",
    border: "1px solid #9ca3af",
    color: "#374151",
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