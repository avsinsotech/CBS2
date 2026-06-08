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

export default function DailyBalLessThanClg() {
  const [branchID, setBranchID] = useState("1");
  const [asOnDate, setAsOnDate] = useState("11/01/2026");
  const [productCode, setProductCode] = useState("1");
  const [productName, setProductName] = useState("");
  const [periodMM, setPeriodMM] = useState("01");
  const [textReportName, setTextReportName] = useState("");

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClear = () => {
    setBranchID("1");
    setAsOnDate("11/01/2026");
    setProductCode("1");
    setProductName("");
    setPeriodMM("01");
    setTextReportName("");
    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  const handleFetchReport = async () => {
    if (!branchID.trim()) {
      setError("Branch ID is required.");
      return;
    }
    if (!asOnDate) {
      setError("As On Date is required.");
      return;
    }
    if (!periodMM.trim()) {
      setError("Period (MM) is required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      const body = {
        asOnDate: toISO(asOnDate),
        branchID: branchID.trim(),
        productCode: productCode.trim() || "1",
        periodMM: periodMM.trim()
      };

      const res = await fetch(`${API_BASE_URL}/api/daily-balance-less-than-clg/report`, {
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
      setError(err.message || "Failed to fetch report.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextReportView = () => {
    if (!branchID.trim()) {
      setError("Branch ID is required.");
      return;
    }
    if (!asOnDate) {
      setError("As On Date is required.");
      return;
    }
    if (!periodMM.trim()) {
      setError("Period (MM) is required.");
      return;
    }

    const params = new URLSearchParams({
      asOnDate: toISO(asOnDate),
      branchID: branchID.trim(),
      productCode: productCode.trim() || "1",
      periodMM: periodMM.trim()
    });
    window.open(`${API_BASE_URL}/api/daily-balance-less-than-clg/text-report-view?${params}`, "_blank");
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
    link.setAttribute('download', `daily_bal_less_than_clg_${asOnDate}.csv`);
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
          <h2 style={styles.cardTitle}>Daily Balance Less Than Closing Bal Report</h2>
        </div>

        {/* Card Body */}
        <div style={styles.cardBody}>

          {/* Inner bordered box */}
          <div style={styles.innerBox}>

            {/* BranchID */}
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>BranchID</label>
              <input
                style={styles.input}
                type="text"
                value={branchID}
                onChange={(e) => setBranchID(e.target.value)}
              />
            </div>

            {/* AsOnDate */}
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>AsOnDate</label>
              <input
                style={styles.input}
                type="text"
                placeholder="DD/MM/YYYY"
                value={asOnDate}
                onChange={(e) => setAsOnDate(e.target.value)}
              />
            </div>

            {/* ProductCode */}
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>ProductCode</label>
              <input
                style={{ ...styles.input, width: 110 }}
                type="text"
                placeholder="Code"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />
              <input
                style={{ ...styles.input, width: 260, marginLeft: 6 }}
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            {/* Period (MM) */}
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

            {/* Text Report Name */}
            <div style={{ ...styles.formRow, marginBottom: 0 }}>
              <label style={styles.fieldLabel}>
                Please enter text report name <span style={styles.req}>*</span>
              </label>
              <input
                style={{ ...styles.input, width: 320 }}
                type="text"
                placeholder="Please enter text report name"
                value={textReportName}
                onChange={(e) => setTextReportName(e.target.value)}
              />
            </div>

          </div>{/* /innerBox */}

          {error && <p style={styles.errorText}>⚠️ {error}</p>}

          {loading && (
            <div style={styles.loadingBar}>
              <div style={styles.loadingFill} />
            </div>
          )}

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={handleFetchReport} disabled={loading}>Submit</button>
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
              Daily Balance Report — {reportData.length} records found
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
  cardBody: { padding: "20px 24px" },
  innerBox: { border: "1px solid #bfdbfe", borderRadius: 8, padding: "18px 20px", marginBottom: 20, background: "#fff" },
  formRow: { display: "flex", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 6 },
  fieldLabel: { width: 220, fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0 },
  req: { color: "#ef4444" },
  input: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 220, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", background: "white" },
  btnRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  btnPrimary: { height: 32, padding: "0 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #334155, #334155)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
  btnOutline: { height: 32, padding: "0 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "white", border: "1px solid #9ca3af", color: "#374151", fontFamily: "'Poppins', sans-serif" },
  btnExcel: { height: 32, padding: "0 18px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #10b981, #059669)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
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