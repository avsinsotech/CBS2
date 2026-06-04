import { useState } from "react";

export default function CTRReport() {
  const [fromBrcd, setFromBrcd] = useState("");
  const [toBrcd, setToBrcd] = useState("");
  const [fromProductCode, setFromProductCode] = useState("");
  const [fromProductDesc, setFromProductDesc] = useState("");
  const [toProductCode, setToProductCode] = useState("");
  const [toProductDesc, setToProductDesc] = useState("");
  const [cashLimit, setCashLimit] = useState("");
  const [fromDate, setFromDate] = useState("01/04/2025");
  const [toDate, setToDate] = useState("30/03/2026");

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>CTR Report</h2>
      </div>

      <div style={styles.cardBody}>

        {/* From Brcd / To Brcd */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            From Brcd <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={fromBrcd}
            onChange={(e) => setFromBrcd(e.target.value)}
          />
          <label style={{ ...styles.label, marginLeft: 40 }}>
            To Brcd <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={toBrcd}
            onChange={(e) => setToBrcd(e.target.value)}
          />
        </div>

        {/* From Product Code */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            From Product Code <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={fromProductCode}
            onChange={(e) => setFromProductCode(e.target.value)}
          />
          <input
            style={{ ...styles.input, marginLeft: 8, width: 320 }}
            type="text"
            value={fromProductDesc}
            onChange={(e) => setFromProductDesc(e.target.value)}
          />
        </div>

        {/* To Product Code */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            To Product Code <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={toProductCode}
            onChange={(e) => setToProductCode(e.target.value)}
          />
          <input
            style={{ ...styles.input, marginLeft: 8, width: 320 }}
            type="text"
            value={toProductDesc}
            onChange={(e) => setToProductDesc(e.target.value)}
          />
        </div>

        {/* Cash Limit */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            Cash Limit <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={cashLimit}
            onChange={(e) => setCashLimit(e.target.value)}
          />
        </div>

        {/* From Date / To Date */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            From Date <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label style={{ ...styles.label, marginLeft: 40 }}>
            To Date <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <hr style={styles.divider} />

        {/* Buttons Row 1 */}
        <div style={styles.btnRow}>
          <button style={styles.btnTeal}>CTR Credit Report</button>
          <button style={styles.btnTeal}>CTR Debit Report</button>
          <button style={styles.btnTeal}>CTR Limit Report</button>
        </div>

        {/* Buttons Row 2 */}
        <div style={{ ...styles.btnRow, marginTop: 10 }}>
          <button style={styles.btnTeal}>Transaction Risk Category</button>
          <button style={styles.btnTeal}>Risk Category Summary</button>
          <button style={styles.btnTeal}>Summary match With KYC</button>
          <button style={styles.btnTeal}>Risk Category Update</button>
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
    minWidth: 130,
    textAlign: "right",
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
};