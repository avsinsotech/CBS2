import { useState } from "react";

export default function CRARReport() {
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [asOnDate, setAsOnDate] = useState("");

  const handleClear = () => {
    setBranchCode("");
    setBranchName("");
    setAsOnDate("");
  };

  return (
    <div style={styles.card}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>CRAR_P</h2>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>

        {/* Inner bordered box */}
        <div style={styles.innerBox}>

          {/* Row 1: Branch Code + Branch Name (two-column layout) */}
          <div style={styles.gridRow}>
            <div style={styles.formGroup}>
              <label style={styles.fieldLabel}>Branch Code</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Branch Code"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.fieldLabel}>Branch Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Branch Name"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: As On Date */}
          <div style={{ ...styles.formGroup, marginBottom: 0 }}>
            <label style={styles.fieldLabel}>As On Date</label>
            <input
              style={styles.input}
              type="text"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
          </div>

        </div>{/* /innerBox */}

        {/* Button */}
        <div style={styles.btnRow}>
          <button style={styles.btnPrimary}>Print Report</button>
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
  fieldLabel: {
    width: 100,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
  },
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
  btnRow: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimary: {
    height: 32,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "linear-gradient(90deg, #334155, #334155)",
    border: "none",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
};