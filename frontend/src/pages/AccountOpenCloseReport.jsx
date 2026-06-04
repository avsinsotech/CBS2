import { useState } from "react";

export default function AccountOpenCloseReport() {
  const [fromDate, setFromDate] = useState("01/04/2025");
  const [toDate, setToDate] = useState("30/03/2026");
  const [fromBrcd, setFromBrcd] = useState("1");
  const [fromBrcdName, setFromBrcdName] = useState("HEAD OFFICE");
  const [toBrcd, setToBrcd] = useState("1");
  const [toBrcdName, setToBrcdName] = useState("HEAD OFFICE");
  const [prodCode, setProdCode] = useState("");
  const [prodName, setProdName] = useState("");
  const [toProdCode, setToProdCode] = useState("");
  const [toProdName, setToProdName] = useState("");
  const [type, setType] = useState("Close");

  const handleClear = () => {
    setFromDate("01/04/2025");
    setToDate("30/03/2026");
    setFromBrcd("1");
    setFromBrcdName("HEAD OFFICE");
    setToBrcd("1");
    setToBrcdName("HEAD OFFICE");
    setProdCode("");
    setProdName("");
    setToProdCode("");
    setToProdName("");
    setType("Close");
  };

  return (
    <div style={styles.card}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Account Open Close Report</h2>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>

        {/* Row 1: From Date & To Date */}
        <div style={styles.gridRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>From Date : <span style={styles.req}>*</span></label>
            <input
              style={styles.input}
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>To Date : <span style={styles.req}>*</span></label>
            <input
              style={styles.input}
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: From BRCD & To BRCD */}
        <div style={styles.gridRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>BRCD : <span style={styles.req}>*</span></label>
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
                onChange={(e) => setFromBrcdName(e.target.value)}
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>BRCD : <span style={styles.req}>*</span></label>
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
                onChange={(e) => setToBrcdName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Row 3: Prod Code & To Prod Code */}
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
                onChange={(e) => setProdName(e.target.value)}
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
                onChange={(e) => setToProdName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Row 4: Type Radio */}
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

        <hr style={styles.divider} />

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnPrimary}>Report</button>
          <button style={styles.btnPrimary}>Loan Close Accounts</button>
          <button style={styles.btnOutline} onClick={handleClear}>Clear</button>
          <button style={styles.btnClose}>Exit</button>
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
    background: "linear-gradient(90deg, #334155, #334155)",
    border: "none",
    color: "white",
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
  btnClose: {
    height: 32,
    padding: "0 18px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "white",
    border: "1px solid #d1d5db",
    color: "#6b7280",
    fontFamily: "'Poppins', sans-serif",
  },
};