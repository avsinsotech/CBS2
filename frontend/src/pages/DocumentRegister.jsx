import { useState } from "react";

export default function DocumentRegister() {
  const [fromUploadDate, setFromUploadDate] = useState("01/04/2025");
  const [toUploadDate, setToUploadDate] = useState("30/03/2026");
  const [fromDocCode, setFromDocCode] = useState("");
  const [toDocCode, setToDocCode] = useState("");
  const [textReportName, setTextReportName] = useState("");

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Document Register</h2>
      </div>

      <div style={styles.cardBody}>

        {/* Row 1: From Upload date / To Upload date */}
        <div style={styles.formRow}>
          <label style={styles.label}>From Upload date</label>
          <input
            style={styles.input}
            type="text"
            value={fromUploadDate}
            onChange={(e) => setFromUploadDate(e.target.value)}
          />
          <label style={{ ...styles.label, marginLeft: 40 }}>To Upload date</label>
          <input
            style={styles.input}
            type="text"
            value={toUploadDate}
            onChange={(e) => setToUploadDate(e.target.value)}
          />
        </div>

        {/* Row 2: From Document type / To Document type */}
        <div style={styles.formRow}>
          <label style={styles.label}>From Document type</label>
          <input
            style={{ ...styles.input, width: 160 }}
            type="text"
            placeholder="From Doc code"
            value={fromDocCode}
            onChange={(e) => setFromDocCode(e.target.value)}
          />
          <label style={{ ...styles.label, marginLeft: 16 }}>To Document type</label>
          <input
            style={{ ...styles.input, width: 160 }}
            type="text"
            placeholder="To Doc code"
            value={toDocCode}
            onChange={(e) => setToDocCode(e.target.value)}
          />
        </div>

        {/* Row 3: Text report name */}
        <div style={styles.formRow}>
          <label style={styles.label}>
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

        <hr style={styles.divider} />

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnTeal}>Download PDF</button>
          <button style={styles.btnPrimary}>Download Text Report</button>
          <button style={styles.btnTeal}>Exit</button>
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
  cardTitle: { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody: { padding: "24px 20px" },
  formRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
    marginRight: 8,
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
    width: 200,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
  },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "18px 0" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btnTeal: {
    height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", border: "none", color: "white",
    background: "#334155", fontFamily: "'Poppins', sans-serif",
  },
  btnPrimary: {
    height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", border: "none", color: "white",
    background: "linear-gradient(90deg, #334155, #334155)",
    fontFamily: "'Poppins', sans-serif",
  },
};