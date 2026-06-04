import { useState } from "react";

export default function KYCReport() {
  const [kycType, setKycType] = useState("");
  const [exportReport, setExportReport] = useState("");
  const [asOnDate, setAsOnDate] = useState("");

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Account Statment</h2>
      </div>

      <div style={styles.cardBody}>

        {/* Row 1: KYC Type / Export Report */}
        <div style={styles.formRow}>
          <label style={styles.label}>Kyc Type</label>
          <select style={styles.select} value={kycType} onChange={(e) => setKycType(e.target.value)}>
            <option value="">--Select--</option>
            <option value="pan">All</option>
            <option value="aadhar">Completed</option>
            <option value="passport">Incompleted</option>
          </select>

          <label style={{ ...styles.label, marginLeft: 40 }}>Export Report</label>
          <select style={styles.select} value={exportReport} onChange={(e) => setExportReport(e.target.value)}>
            <option value="">--Select--</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        {/* Row 2: As On Date */}
        <div style={styles.formRow}>
          <label style={styles.label}>As On Date</label>
          <input
            style={styles.input}
            type="date"
            value={asOnDate}
            onChange={(e) => setAsOnDate(e.target.value)}
          />
        </div>

        <hr style={styles.divider} />

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnTeal}>KYC Report</button>
          <button style={styles.btnTeal}>Dump KYC Report</button>
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
  label: { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, minWidth: 90 },
  input: {
    height: 36, border: "1px solid #d1d5db", borderRadius: 6,
    padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none",
    width: 220, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box",
    cursor: "pointer",
  },
  select: {
    height: 36, border: "1px solid #d1d5db", borderRadius: 6,
    padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none",
    width: 220, fontFamily: "'Poppins', sans-serif", background: "white", cursor: "pointer",
  },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "18px 0" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btnTeal: {
    height: 34, padding: "0 20px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", border: "none", color: "white",
    background: "#334155", fontFamily: "'Poppins', sans-serif",
  },
};