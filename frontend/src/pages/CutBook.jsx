



import { useState } from "react";
import { fetchCuteBookDetails } from "../api/api";

export default function CutBook() {
  const [reportType, setReportType] = useState("asOnDate");
  const [productType, setProductType] = useState("");
  const [productName, setProductName] = useState("");
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2026-03-30");
  const [customerType, setCustomerType] = useState("0");
  const [accountType, setAccountType] = useState("0");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const brcd = "1";

  const callAPI = async (flag) => {
    if (!fromDate || !toDate) {
      setError("Please fill From Date and To Date.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await fetchCuteBookDetails({
        brcd,
        subglcode: productType,
        fromDate,
        toDate,
        custtype: customerType,
        acctype: accountType,
        flag,
        amount,
      });
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Cut Book Report</h2>
      </div>

      <div style={styles.cardBody}>

        {/* Radio */}
        <div style={styles.radioRow}>
          <label style={styles.radioLabel}>
            <input type="radio" name="reportType" value="asOnDate" checked={reportType === "asOnDate"} onChange={() => setReportType("asOnDate")} style={styles.radioInput} />
            As On Date
          </label>
          <label style={styles.radioLabel}>
            <input type="radio" name="reportType" value="dateWise" checked={reportType === "dateWise"} onChange={() => setReportType("dateWise")} style={styles.radioInput} />
            Date Wise
          </label>
        </div>

        <hr style={styles.divider} />

        {/* Product Type */}
        <div style={styles.formRow}>
          <label style={styles.label}>Product Type</label>
          <input style={{ ...styles.input, width: 160 }} type="text" placeholder="Product Type" value={productType} onChange={(e) => setProductType(e.target.value)} />
          <input style={{ ...styles.input, width: 320, marginLeft: 8 }} type="text" placeholder="PRODUCT NAME" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </div>

        {/* From / To Date */}
        <div style={styles.formRow}>
          <label style={styles.label}>From Date</label>
          <input style={{ ...styles.input, width: 160 }} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <label style={{ ...styles.label, width: 80, marginLeft: 20 }}>To Date</label>
          <input style={{ ...styles.input, width: 160 }} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        {/* Customer Type / Amount */}
        <div style={styles.formRow}>
          <label style={styles.label}>Customer Type:</label>
          <select style={styles.select} value={customerType} onChange={(e) => setCustomerType(e.target.value)}>
            <option value="0">--Select--</option>
            <option value="1">Individual</option>
            <option value="3">Corporate</option>
            <option value="2">Joint</option>
          </select>
          <label style={{ ...styles.label, width: 80, marginLeft: 20 }}>Amount</label>
          <input style={{ ...styles.input, width: 200 }} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        {/* Account Type */}
        <div style={styles.formRow}>
          <label style={styles.label}>Account Category:</label>
          <select style={styles.select} value={accountType} onChange={(e) => setAccountType(e.target.value)}>
            <option value="0">--Select--</option>
            <option value="1">Normal</option>
            <option value="2">Senior Citizen</option>
            <option value="3">Staff</option>
          </select>
        </div>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        <hr style={styles.divider} />

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnOutline} onClick={() => callAPI("ALL")} disabled={loading}>Cut Book</button>
          <button style={styles.btnPrimary} onClick={() => callAPI("REPORT")} disabled={loading}>Cut Book Report</button>
          <button style={styles.btnPrimary} onClick={() => callAPI("TEXT")} disabled={loading}>Download Text Report</button>
          <button style={styles.btnPrimary} onClick={() => callAPI("BALANCE")} disabled={loading}>Balance Book with Op Bal.</button>
          <button style={styles.btnPrimary} onClick={() => callAPI("ACWISE")} disabled={loading}>Cut Book A/C Wise</button>
        </div>

        {loading && <div style={styles.loadingBox}>⏳ Fetching data from server...</div>}

        {results && results.data && results.data.length > 0 && (
          <div style={styles.tableWrapper}>
            <div style={styles.tableHeader}>Results — {results.rowCount} record(s) found</div>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>{Object.keys(results.data[0]).map((col) => <th key={col} style={styles.th}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {results.data.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      {Object.values(row).map((val, j) => <td key={j} style={styles.td}>{val ?? "-"}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results && results.data && results.data.length === 0 && (
          <div style={styles.noDataBox}>No records found for the selected criteria.</div>
        )}

      </div>
    </div>
  );
}

const styles = {
  card: { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "'Poppins', sans-serif" },
  cardHeader: { background: "linear-gradient(90deg, #334155, #334155)", padding: "12px 20px" },
  cardTitle: { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody: { padding: "20px" },
  radioRow: { display: "flex", alignItems: "center", gap: 40, padding: "10px 0" },
  radioLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer" },
  radioInput: { width: 15, height: 15, accentColor: "#2563eb", cursor: "pointer" },
  formRow: { display: "flex", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 4 },
  label: { width: 120, fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0 },
  input: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", cursor: "pointer" },
  select: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", fontFamily: "'Poppins', sans-serif", background: "white", width: 190, cursor: "pointer" },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "16px 0" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" },
  btnOutline: { height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "white", border: "1px solid #2563eb", color: "#2563eb", fontFamily: "'Poppins', sans-serif" },
  btnPrimary: { height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #334155, #334155)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
  errorBox: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", borderRadius: 6, padding: "10px 14px", fontSize: 12, margin: "12px 0" },
  loadingBox: { background: "#eff6ff", border: "1px solid #93c5fd", color: "#1d4ed8", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12 },
  noDataBox: { background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "10px 14px", fontSize: 12, marginTop: 12, textAlign: "center" },
  tableWrapper: { marginTop: 20, borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" },
  tableHeader: { background: "linear-gradient(90deg, #334155, #334155)", color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 600 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 11 },
  th: { background: "#f1f5f9", color: "#374151", padding: "8px 10px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap" },
  td: { padding: "7px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" },
  trEven: { background: "white" },
  trOdd: { background: "#f8fafc" },
};