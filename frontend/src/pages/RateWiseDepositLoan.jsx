import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const HEADER_COLOR = "#334155";

export default function RateWiseDepositLoan() {
  const [reportType, setReportType] = useState("Details");
  const [fromBrcd, setFromBrcd] = useState("");
  const [toBrcd, setToBrcd] = useState("");
  const [productCodeFrom, setProductCodeFrom] = useState("");
  const [productCodeTo, setProductCodeTo] = useState("");
  const [asOnDate, setAsOnDate] = useState("2026-03-30");
  const [fromIntRate, setFromIntRate] = useState("");
  const [toIntRate, setToIntRate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleReportPrint = async () => {
    setError(null);
    setResults(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        fromBr: fromBrcd || '1',
        toBr: toBrcd || '2',
        productCode: productCodeFrom || '1',
        asOnDate: asOnDate || '2026-05-22',
        fromIntRate: fromIntRate || '0',
        toIntRate: toIntRate || '999999',
        mode: 'json'
      });
      const response = await fetch(`${BASE_URL}/api/rate-wise-deposit-loan?${params}`);
      const ct = response.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const txt = await response.text();
        throw new Error(`Server error (HTTP ${response.status}): ${txt.substring(0, 200)}`);
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "API request failed");
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    const params = new URLSearchParams({
      fromBr: fromBrcd || '1',
      toBr: toBrcd || '2',
      productCode: productCodeFrom || '1',
      asOnDate: asOnDate || '2026-05-22',
      fromIntRate: fromIntRate || '0',
      toIntRate: toIntRate || '999999',
      mode: 'text'
    });
    window.open(`${BASE_URL}/api/rate-wise-deposit-loan?${params}`, "_blank");
  };

  const handleClear = () => {
    setReportType("Details");
    setFromBrcd("");
    setToBrcd("");
    setProductCodeFrom("");
    setProductCodeTo("");
    setAsOnDate("2026-03-30");
    setFromIntRate("");
    setToIntRate("");
    setResults(null);
    setError(null);
  };

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>Int Deposit and Loan</span>
      </div>

      <div style={s.body}>
        {/* Outer bordered section */}
        <div style={s.outerBorder}>

          {/* Details / Summary radio row */}
          <div style={s.radioRow}>
            {["Details", "Summary"].map((t) => (
              <label key={t} style={s.radioLabel}>
                <input
                  type="radio"
                  name="reportType"
                  value={t}
                  checked={reportType === t}
                  onChange={() => setReportType(t)}
                  style={s.radio}
                />
                {t}
              </label>
            ))}
          </div>

          {/* Form fields */}
          <div style={s.formGrid}>

            {/* Row 1 - From BRCD / To BRCD */}
            <div style={s.formRow}>
              <label style={s.label}>From BRCD</label>
              <input
                style={s.input}
                value={fromBrcd}
                onChange={(e) => setFromBrcd(e.target.value)}
              />
              <label style={{ ...s.label, marginLeft: 20 }}>TO BRCD</label>
              <input
                style={s.input}
                value={toBrcd}
                onChange={(e) => setToBrcd(e.target.value)}
              />
            </div>

            {/* Row 2 - ProductCode (from + to in same row, no "To" label) */}
            <div style={s.formRow}>
              <label style={s.label}>ProductCode</label>
              <input
                style={s.input}
                value={productCodeFrom}
                onChange={(e) => setProductCodeFrom(e.target.value)}
              />
              <input
                style={{ ...s.input, marginLeft: 8 }}
                value={productCodeTo}
                onChange={(e) => setProductCodeTo(e.target.value)}
              />
            </div>

            {/* Row 3 - AsOnDate */}
            <div style={s.formRow}>
              <label style={s.label}>AsOnDate</label>
              <input
                style={s.input}
                type="date"
                value={asOnDate}
                onChange={(e) => setAsOnDate(e.target.value)}
              />
            </div>

            {/* Row 4 - From Int Rate / To Int Rate — only shown for Details */}
            {reportType === "Details" && (
              <div style={s.formRow}>
                <label style={s.label}>From Int Rate</label>
                <input
                  style={s.input}
                  value={fromIntRate}
                  onChange={(e) => setFromIntRate(e.target.value)}
                />
                <label style={{ ...s.label, marginLeft: 20 }}>To Int Rate</label>
                <input
                  style={s.input}
                  value={toIntRate}
                  onChange={(e) => setToIntRate(e.target.value)}
                />
              </div>
            )}

          </div>
        </div>

        {/* Error */}
        {error && <div style={s.errorBox}>⚠️ {error}</div>}

        {/* Buttons */}
        <div style={s.btnRow}>
          <button style={s.btn} onClick={handleReportPrint} disabled={loading}>
            {loading ? "Loading..." : "Report View"}
          </button>
          <button style={s.btn} onClick={handlePrintReport} disabled={loading}>
            Report Print
          </button>
          <button style={s.btnSecondary} onClick={handleClear}>Clear</button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={s.loadingBox}>⏳ Fetching data from server...</div>
        )}

        {/* Results Table */}
        {results && results.data && results.data.length > 0 && (
          <div style={s.tableWrapper}>
            <div style={s.tableHeader}>
              Results — {results.rowCount} record(s) found
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {Object.keys(results.data[0]).map((col) => (
                      <th key={col} style={s.th}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.data.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={s.td}>{val ?? "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results && results.data && results.data.length === 0 && (
          <div style={s.noDataBox}>No records found for the selected criteria.</div>
        )}
      </div>
    </div>
  );
}

const s = {
  card: {
    background: "white",
    borderRadius: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    background: HEADER_COLOR,
    padding: "12px 20px",
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: 600,
  },
  body: {
    padding: "16px 20px",
  },
  outerBorder: {
    border: "1px solid #93c5fd",
    borderRadius: 6,
    padding: "14px 16px",
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  radioRow: {
    display: "flex",
    gap: 32,
    alignItems: "center",
    marginBottom: 4,
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
    accentColor: HEADER_COLOR,
    cursor: "pointer",
  },
  formGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  label: {
    width: 130,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
  },
  input: {
    height: 30,
    border: "1px solid #d1d5db",
    borderRadius: 5,
    padding: "0 10px",
    fontSize: 12,
    color: "#1e293b",
    outline: "none",
    width: 200,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "white",
  },
  btnRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginTop: 4,
    flexWrap: "wrap",
  },
  btn: {
    height: 32,
    padding: "0 24px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: HEADER_COLOR,
    border: "none",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  btnSecondary: {
    height: 32,
    padding: "0 24px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: HEADER_COLOR,
    border: "none",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    color: "#dc2626",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 12,
    marginBottom: 12,
  },
  loadingBox: {
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    color: "#334155",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 12,
    marginTop: 12,
  },
  noDataBox: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    color: "#6b7280",
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },
  tableWrapper: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  tableHeader: {
    background: HEADER_COLOR,
    color: "white",
    padding: "8px 14px",
    fontSize: 12,
    fontWeight: 600,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 11,
  },
  th: {
    background: "#f1f5f9",
    color: "#374151",
    padding: "8px 10px",
    textAlign: "left",
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "7px 10px",
    color: "#1e293b",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
  },
  trEven: { background: "white" },
  trOdd: { background: "#f8fafc" },
};