import { useState } from "react";

export default function SIReport() {
  const [siType, setSiType] = useState("ddsToLoan");
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2026-03-30");
  const [reportName, setReportName] = useState("");

  const handleClearAll = () => {
    setFromDate("");
    setToDate("");
    setReportName("");
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

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnPrimary}>Report</button>
          <button style={styles.btnPrimary} onClick={handleClearAll}>Exit</button>
          <button style={styles.btnPrimary}>Text Report</button>
        </div>

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
    background: "linear-gradient(90deg, #334155, #334155)",
    fontFamily: "'Poppins', sans-serif",
  },
};