import { useState } from "react";

export default function DailyBalLessThanClg() {
  const [branchID, setBranchID] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [periodMM, setPeriodMM] = useState("");
  const [textReportName, setTextReportName] = useState("");

  const handleClear = () => {
    setBranchID("");
    setAsOnDate("");
    setProductCode("");
    setProductName("");
    setPeriodMM("");
    setTextReportName("");
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
            <label style={styles.fieldLabel}>BranchID</label>
            <input
              style={styles.input}
              type="text"
              value={branchID}
              onChange={(e) => setBranchID(e.target.value)}
            />
          </div>

          {/* AsOnDate */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>AsOnDate</label>
            <input
              style={styles.input}
              type="text"
              placeholder="DD/MM/YYYY"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
          </div>

          {/* ProductCode */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>ProductCode</label>
            <input
              style={{ ...styles.input, width: 110 }}
              type="text"
              placeholder="Code"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
            />
            <input
              style={{ ...styles.input, width: 260, marginLeft: 6 }}
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* Period (MM) */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>
              Period (MM) : <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.input}
              type="text"
              value={periodMM}
              onChange={(e) => setPeriodMM(e.target.value)}
            />
          </div>

          {/* Text Report Name */}
          <div style={{ ...styles.formRow, marginBottom: 0 }}>
            <label style={styles.fieldLabel}>
              Please enter text report name <span style={styles.req}>*</span>
            </label>
            <input
              style={{ ...styles.input, width: 320 }}
              type="text"
              placeholder="Please enter text report name"
              value={textReportName}
              onChange={(e) => setTextReportName(e.target.value)}
            />
          </div>

        </div>{/* /innerBox */}

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnPrimary}>Submit</button>
          <button style={styles.btnClose}>Exit</button>
          <button style={styles.btnPrimary}>Text Report View</button>
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
    padding: "20px 24px",
  },
  innerBox: {
    border: "1px solid #bfdbfe",
    borderRadius: 8,
    padding: "18px 20px",
    marginBottom: 20,
    background: "#fff",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 6,
  },
  fieldLabel: {
    width: 220,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
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
    width: 220,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "white",
  },
  btnRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  btnPrimary: {
    height: 32,
    padding: "0 18px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "linear-gradient(90deg, #334155, #334155)",
    border: "none",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  btnClose: {
    height: 32,
    padding: "0 18px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "white",
    border: "1px solid #d1d5db",
    color: "#6b7280",
    fontFamily: "'Poppins', sans-serif",
  },
};