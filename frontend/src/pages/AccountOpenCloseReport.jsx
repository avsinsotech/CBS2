import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

function toISO(raw) {
  if (!raw) return null;
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return raw; // already YYYY-MM-DD
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export default function AccountOpenCloseReport() {
  const [fromDate, setFromDate] = useState("01/04/2025");
  const [toDate, setToDate] = useState("30/03/2026");
  const [fromBrcd, setFromBrcd] = useState("1");
  const [fromBrcdName] = useState("HEAD OFFICE");
  const [toBrcd, setToBrcd] = useState("9999");
  const [toBrcdName] = useState("ALL BRANCHES");
  const [prodCode, setProdCode] = useState("1");
  const [prodName, setProdName] = useState("");
  const [toProdCode, setToProdCode] = useState("9999");
  const [toProdName, setToProdName] = useState("");
  const [type, setType] = useState("Close"); // "Open" | "Close"

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClear = () => {
    setFromDate("01/04/2025");
    setToDate("30/03/2026");
    setFromBrcd("1");
    setToBrcd("9999");
    setProdCode("1");
    setProdName("");
    setToProdCode("9999");
    setToProdName("");
    setType("Close");
    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  const handleFetchReport = async (customFlag = null) => {
    if (!fromDate || !toDate) {
      setError("From Date and To Date are required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      const flagValue = customFlag || type.toUpperCase();
      const body = {
        flag: flagValue,
        fbrcd: fromBrcd.trim() || "1",
        tbrcd: toBrcd.trim() || "9999",
        fromDate: toISO(fromDate),
        toDate: toISO(toDate),
        subgl: prodCode.trim() || "1",
        tsubgl: toProdCode.trim() || "9999"
      };

      const res = await fetch(`${API_BASE_URL}/api/account-open-close/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Server returned ${res.status}`);
      }

      const resData = await res.json();
      const data = resData.data || [];
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setReportData(data);
      setFetched(true);
    } catch (err) {
      setError(err.message || "Failed to fetch open/close report.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextReportView = () => {
    if (!fromDate || !toDate) {
      setError("From Date and To Date are required.");
      return;
    }

    const params = new URLSearchParams({
      flag: type.toUpperCase(),
      fbrcd: fromBrcd.trim() || "1",
      tbrcd: toBrcd.trim() || "9999",
      fromDate: toISO(fromDate),
      toDate: toISO(toDate),
      subgl: prodCode.trim() || "1",
      tsubgl: toProdCode.trim() || "9999"
    });
    window.open(`${API_BASE_URL}/api/account-open-close/text-report-view?${params}`, "_blank");
  };

  const handleDownloadCsv = () => {
    if (!reportData || !reportData.length) return;
    const headers = Object.keys(reportData[0]).join(',');
    const rows = reportData.map(row => 
      Object.values(row).map(val => {
        let str = String(val ?? '');
        str = str.replace(/"/g, '""');
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
          str = `"${str}"`;
        }
        return str;
      }).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `account_open_close_${type.toLowerCase()}_${fromDate}_to_${toDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
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
                placeholder="DD/MM/YYYY"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>To Date : <span style={styles.req}>*</span></label>
              <input
                style={styles.input}
                type="text"
                placeholder="DD/MM/YYYY"
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
                  readOnly
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
                  readOnly
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
                  placeholder="Product Name"
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
                  placeholder="To Product Name"
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

          {error && <p style={styles.errorText}>⚠️ {error}</p>}

          {loading && (
            <div style={styles.loadingBar}>
              <div style={styles.loadingFill} />
            </div>
          )}

          <hr style={styles.divider} />

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => handleFetchReport(null)} disabled={loading}>Report</button>
            <button style={styles.btnPrimary} onClick={() => handleFetchReport("CLOSE")} disabled={loading}>Loan Close Accounts</button>
            <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>Text Report View</button>
            <button style={styles.btnOutline} onClick={handleClear} disabled={loading}>Clear</button>
            {reportData.length > 0 && (
              <button style={styles.btnExcel} onClick={handleDownloadCsv}>Export CSV</button>
            )}
          </div>

        </div>
      </div>

      {/* Results Section */}
      {fetched && reportData.length > 0 && (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
              Account {type} Report — {reportData.length} records found
            </span>
          </div>
          <div style={{ overflowX: "auto", maxHeight: "400px" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  {columns.map((col) => (
                    <th key={col} style={styles.th}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, i) => (
                  <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                    {columns.map((col) => (
                      <td key={col} style={styles.td}>{String(row[col] ?? "-")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {fetched && reportData.length === 0 && (
        <p style={{ textAlign: "center", fontSize: 12, color: "#6b7280", margin: "20px 0" }}>
          No records found for the given criteria.
        </p>
      )}
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: 20, width: "100%" },
  card: { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "'Poppins', sans-serif", border: "1px solid #e2e8f0" },
  cardHeader: { background: "linear-gradient(90deg, #334155, #334155)", padding: "12px 20px" },
  cardTitle: { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody: { padding: "24px 28px" },
  gridRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 },
  formGroup: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  inputGroup: { display: "flex", gap: 6, flexWrap: "wrap" },
  label: { fontSize: 12, fontWeight: 500, color: "#374151", whiteSpace: "nowrap", minWidth: 90 },
  req: { color: "#ef4444" },
  input: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 160, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", background: "white" },
  inputYellow: { background: "#fefce8", borderColor: "#fbbf24" },
  radioRow: { display: "flex", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap" },
  radioLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151", cursor: "pointer" },
  radio: { accentColor: "#334155", width: 14, height: 14 },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "20px 0" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  btnPrimary: { height: 32, padding: "0 18px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #334155, #334155)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
  btnOutline: { height: 32, padding: "0 18px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "white", border: "1px solid #9ca3af", color: "#374151", fontFamily: "'Poppins', sans-serif" },
  btnExcel: { height: 32, padding: "0 18px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #10b981, #059669)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
  errorText: { color: "#ef4444", fontSize: 12, margin: "10px 0", fontWeight: 500 },
  loadingBar: { width: "100%", height: 4, backgroundColor: "#e2e8f0", borderRadius: 2, overflow: "hidden", marginBottom: 16 },
  loadingFill: { width: "50%", height: "100%", backgroundColor: "#3b82f6" },
  tableWrapper: { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: 20, fontFamily: "'Poppins', sans-serif" },
  tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: "1px solid #e2e8f0", paddingBottom: 10 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" },
  thRow: { backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" },
  th: { padding: "10px 12px", fontWeight: 600, color: "#475569" },
  td: { padding: "10px 12px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#f8fafc" },
};