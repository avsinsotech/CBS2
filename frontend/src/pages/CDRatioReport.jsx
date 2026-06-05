import { useState } from "react";

export default function CDRatioReport() {
  const [reportType, setReportType] = useState("summary");
  const [branchCode, setBranchCode] = useState("1");
  const [branchName, setBranchName] = useState("HEAD OFFICE");
  const [asOnDate, setAsOnDate] = useState("2026-03-30");
  const [textReportName, setTextReportName] = useState("");

  const handleClearAll = () => {
    setReportType("summary");
    setBranchCode("");
    setBranchName("");
    setAsOnDate("");
    setTextReportName("");
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>CD Ratio</h2>
      </div>

      <div style={styles.cardBody}>

        {/* Report Type Radio */}
        <div style={styles.formRow}>
          <label style={styles.label}>Report Type</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio" name="reportType" value="summary"
                checked={reportType === "summary"}
                onChange={() => setReportType("summary")}
                style={styles.radioInput}
              />
              Summary
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio" name="reportType" value="details"
                checked={reportType === "details"}
                onChange={() => setReportType("details")}
                style={styles.radioInput}
              />
              Details
            </label>
          </div>
        </div>

        {/* Branch Code */}
        <div style={styles.formRow}>
          <label style={styles.label}>Branch Code</label>
          <input
            style={{ ...styles.input, ...styles.inputYellow, width: 200 }}
            type="text"
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
          />
          <input
            style={{ ...styles.input, ...styles.inputPink, width: 320, marginLeft: 8 }}
            type="text"
            value={branchName}
            readOnly
          />
        </div>

        {/* As On Date */}
        <div style={styles.formRow}>
          <label style={styles.label}>As On Date</label>
          <input
            style={{ ...styles.input, width: 200 }}
            type="date"
            value={asOnDate}
            onChange={(e) => setAsOnDate(e.target.value)}
          />
        </div>

        {/* Enter Text Report Name */}
        <div style={styles.formRow}>
          <label style={styles.label}>Enter Text Report Name</label>
          <input
            style={{ ...styles.input, width: 340 }}
            type="text"
            placeholder="Enter Text Report Name"
            value={textReportName}
            onChange={(e) => setTextReportName(e.target.value)}
          />
        </div>

        {/* Footer Buttons */}
        <div style={styles.footer}>
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary}>Report</button>
            <button style={styles.btnPrimary}>Text Report View</button>
            <button style={styles.btnPrimary}>Clear All</button>
            <button style={styles.btnOutline} onClick={handleClearAll}>Exit</button>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white", borderRadius: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    overflow: "hidden", fontFamily: "'Poppins', sans-serif",
  },
  cardHeader: { background: "linear-gradient(90deg, #334155, #334155)", padding: "12px 20px" },
  cardTitle: { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody: { padding: "24px 20px" },
  formRow: {
    display: "flex", alignItems: "center",
    marginBottom: 16, flexWrap: "wrap", gap: 8,
  },
  label: {
    fontSize: 12, fontWeight: 500, color: "#374151",
    flexShrink: 0, width: 160,
  },
  input: {
    height: 34, border: "1px solid #d1d5db", borderRadius: 6,
    padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none",
    fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
    cursor: "pointer",
  },
  inputYellow: { background: "#fefce8", borderColor: "#fbbf24" },
  inputPink: { background: "#fff1f2", borderColor: "#fda4af", color: "#9f1239" },
  radioGroup: { display: "flex", alignItems: "center", gap: 28 },
  radioLabel: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer",
  },
  radioInput: { width: 15, height: 15, accentColor: "#2563eb", cursor: "pointer" },
  footer: {
    background: "#f8fafc",
    margin: "20px -20px -20px",
    padding: "14px 20px",
    borderTop: "1px solid #e5e7eb",
  },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  btnPrimary: {
    height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", border: "none", color: "white",
    background: "linear-gradient(90deg, #334155, #334155)",
    fontFamily: "'Poppins', sans-serif",
  },
  btnOutline: {
    height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", color: "#374151",
    background: "white", border: "1px solid #9ca3af",
    fontFamily: "'Poppins', sans-serif",
  },
};