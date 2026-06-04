import { useState } from "react";

export default function InOperativeAccList() {
  const [mode, setMode] = useState("Period"); // "Period" | "DueDate"
  const [branchCode, setBranchCode] = useState("1");
  const [productType, setProductType] = useState("");
  const [productName, setProductName] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [periodMM, setPeriodMM] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [amountLessThan, setAmountLessThan] = useState("");

  const handleClear = () => {
    setMode("Period");
    setBranchCode("1");
    setProductType("");
    setProductName("");
    setAsOnDate("");
    setPeriodMM("");
    setDueDate("");
    setAmountLessThan("");
  };

  return (
    <div style={styles.card}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>InOperative Acc List</h2>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>

        {/* Inner bordered box */}
        <div style={styles.innerBox}>

          {/* Row 1: Period / DueDate radio */}
          <div style={{ ...styles.formRow, marginBottom: 16 }}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="mode"
                value="Period"
                checked={mode === "Period"}
                onChange={() => setMode("Period")}
                style={styles.radio}
              />
              Period
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="mode"
                value="DueDate"
                checked={mode === "DueDate"}
                onChange={() => setMode("DueDate")}
                style={styles.radio}
              />
              DueDate
            </label>
          </div>

          {/* Row 2: Branch Code */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>
              Branch Code : <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.input}
              type="text"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
            />
          </div>

          {/* Row 3: Product Type */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>
              Product Type : <span style={styles.req}>*</span>
            </label>
            <input
              style={{ ...styles.input, width: 160 }}
              type="text"
              placeholder="Product Type"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            />
            <input
              style={{ ...styles.input, width: 260, marginLeft: 6 }}
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* Row 4: As On Date */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>
              As On Date : <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.input}
              type="text"
              placeholder="DD/MM/YYYY"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
          </div>

          {/* Row 5: Period (MM) — only when mode === "Period" */}
          {mode === "Period" && (
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
          )}

          {/* Row 5 alt: Due Date — only when mode === "DueDate" */}
          {mode === "DueDate" && (
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>
                Due Date : <span style={styles.req}>*</span>
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="DD/MM/YYYY"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          )}

          {/* Row 6: Amount Less Than */}
          <div style={{ ...styles.formRow, marginBottom: 0 }}>
            <label style={styles.fieldLabel}>
              Amount Less Than: <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.input}
              type="text"
              value={amountLessThan}
              onChange={(e) => setAmountLessThan(e.target.value)}
            />
          </div>

        </div>{/* /innerBox */}

        {/* Button */}
        <div style={styles.btnRow}>
          <button style={styles.btnPrimary}>Report Print</button>
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
    width: 160,
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
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    marginRight: 10,
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
    gap: 10,
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