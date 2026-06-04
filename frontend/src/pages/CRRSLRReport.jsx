import { useState } from "react";

export default function CRRSLRReport() {
  const [language, setLanguage] = useState("English");
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleClear = () => {
    setLanguage("English");
    setBranchCode("");
    setBranchName("");
    setAsOnDate("");
    setToDate("");
  };

  return (
    <div style={styles.card}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>CRR_Report</h2>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>

        {/* Inner bordered box */}
        <div style={styles.innerBox}>

          {/* Row 1: Language radios */}
          <div style={{ ...styles.formRow, paddingLeft: 160, marginBottom: 16 }}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="language"
                value="Marathi"
                checked={language === "Marathi"}
                onChange={() => setLanguage("Marathi")}
                style={styles.radio}
              />
              Marathi
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="language"
                value="English"
                checked={language === "English"}
                onChange={() => setLanguage("English")}
                style={styles.radio}
              />
              English
            </label>
          </div>

          {/* Row 2: Branch Code + Branch Name */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>Branch Code</label>
            <input
              style={{ ...styles.input, width: 160 }}
              type="text"
              placeholder="Branch Code"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
            />
            <input
              style={{ ...styles.input, width: 280, marginLeft: 6 }}
              type="text"
              placeholder="Branch Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            />
          </div>

          {/* Row 3: As On Date + To Date */}
          <div style={{ ...styles.formRow, marginBottom: 0 }}>
            <label style={styles.fieldLabel}>As On Date</label>
            <input
              style={{ ...styles.input, width: 160 }}
              type="text"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
            <label style={{ fontSize: 12, fontWeight: 500, color: "#374151", marginLeft: 20, marginRight: 8 }}>
              To Date
            </label>
            <input
              style={{ ...styles.input, width: 160 }}
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

        </div>{/* /innerBox */}

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnPrimary}>CRR1 Report</button>
          <button style={styles.btnPrimary}>CRR Report</button>
          <button style={styles.btnPrimary}>SLR Report</button>
          <button style={styles.btnPrimary}>Exit</button>
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
    width: 110,
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
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "white",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    marginRight: 16,
    userSelect: "none",
  },
  radio: {
    accentColor: "#2563eb",
    width: 14,
    height: 14,
    cursor: "pointer",
  },
  btnRow: {
    display: "flex",
    justifyContent: "center",
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
};