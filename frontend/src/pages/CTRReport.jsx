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

export default function CTRReport() {
  const [fromBrcd, setFromBrcd] = useState("1");
  const [toBrcd, setToBrcd] = useState("9999");
  const [fromProductCode, setFromProductCode] = useState("1");
  const [fromProductDesc, setFromProductDesc] = useState("");
  const [toProductCode, setToProductCode] = useState("9999");
  const [toProductDesc, setToProductDesc] = useState("");
  const [cashLimit, setCashLimit] = useState("100000");
  const [fromDate, setFromDate] = useState("01/04/2025");
  const [toDate, setToDate] = useState("30/03/2026");

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);
  const [activeReport, setActiveReport] = useState("");

  const handleClear = () => {
    setFromBrcd("1");
    setToBrcd("9999");
    setFromProductCode("1");
    setFromProductDesc("");
    setToProductCode("9999");
    setToProductDesc("");
    setCashLimit("100000");
    setFromDate("01/04/2025");
    setToDate("30/03/2026");
    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
    setActiveReport("");
  };

  const executeGeneralReport = async (flagValue) => {
    setLoading(true);
    setError("");
    setFetched(false);
    setActiveReport(flagValue === "CREDIT" ? "CTR Credit Report" : "CTR Debit Report");

    try {
      const body = {
        brcd: fromBrcd.trim(),
        flag: flagValue,
        fromDate: toISO(fromDate),
        toDate: toISO(toDate),
        fsgl: fromProductCode.trim(),
        tsgl: toProductCode.trim(),
        ctrLimit: cashLimit.trim()
      };

      const res = await fetch(`${API_BASE_URL}/api/ctr-report/general-report`, {
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
      setError(err.message || "Failed to fetch general report.");
    } finally {
      setLoading(false);
    }
  };

  const executeLimitReport = async () => {
    setLoading(true);
    setError("");
    setFetched(false);
    setActiveReport("CTR Limit Report");

    try {
      const body = {
        fromBrcd: fromBrcd.trim(),
        toBrcd: toBrcd.trim(),
        fromDate: toISO(fromDate),
        toDate: toISO(toDate),
        fromAmount: cashLimit.trim()
      };

      const res = await fetch(`${API_BASE_URL}/api/ctr-report/limit-report`, {
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
      setError(err.message || "Failed to fetch limit report.");
    } finally {
      setLoading(false);
    }
  };

  const executeRiskCategoryUpdate = async (flagValue, label) => {
    setLoading(true);
    setError("");
    setFetched(false);
    setActiveReport(label);

    try {
      const body = {
        fromBrcd: fromBrcd.trim(),
        toBrcd: toBrcd.trim(),
        fromDate: toISO(fromDate),
        toDate: toISO(toDate),
        fromAmount: cashLimit.trim(),
        flag: flagValue,
        mid: "2"
      };

      const res = await fetch(`${API_BASE_URL}/api/ctr-report/risk-category-update`, {
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
      setError(err.message || `Failed to run ${label}.`);
    } finally {
      setLoading(false);
    }
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
    link.setAttribute('download', `ctr_report_${activeReport.toLowerCase().replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>CTR Report & Risk Update Menu</h2>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.innerBox}>
            {/* From Brcd / To Brcd */}
            <div style={styles.formRow}>
              <label style={styles.label}>From Brcd <span style={styles.req}>*</span></label>
              <input style={styles.input} type="text" value={fromBrcd} onChange={(e) => setFromBrcd(e.target.value)} />
              <label style={{ ...styles.label, marginLeft: 40 }}>To Brcd <span style={styles.req}>*</span></label>
              <input style={styles.input} type="text" value={toBrcd} onChange={(e) => setToBrcd(e.target.value)} />
            </div>

            {/* From Product Code */}
            <div style={styles.formRow}>
              <label style={styles.label}>From Product Code <span style={styles.req}>*</span></label>
              <input style={styles.input} type="text" value={fromProductCode} onChange={(e) => setFromProductCode(e.target.value)} />
              <input style={{ ...styles.input, marginLeft: 8, width: 320 }} type="text" placeholder="From Product Name" value={fromProductDesc} onChange={(e) => setFromProductDesc(e.target.value)} />
            </div>

            {/* To Product Code */}
            <div style={styles.formRow}>
              <label style={styles.label}>To Product Code <span style={styles.req}>*</span></label>
              <input style={styles.input} type="text" value={toProductCode} onChange={(e) => setToProductCode(e.target.value)} />
              <input style={{ ...styles.input, marginLeft: 8, width: 320 }} type="text" placeholder="To Product Name" value={toProductDesc} onChange={(e) => setToProductDesc(e.target.value)} />
            </div>

            {/* Cash Limit */}
            <div style={styles.formRow}>
              <label style={styles.label}>Cash Limit <span style={styles.req}>*</span></label>
              <input style={styles.input} type="text" value={cashLimit} onChange={(e) => setCashLimit(e.target.value)} />
            </div>

            {/* From Date / To Date */}
            <div style={styles.formRow}>
              <label style={styles.label}>From Date <span style={styles.req}>*</span></label>
              <input style={styles.input} type="text" placeholder="DD/MM/YYYY" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              <label style={{ ...styles.label, marginLeft: 40 }}>To Date <span style={styles.req}>*</span></label>
              <input style={styles.input} type="text" placeholder="DD/MM/YYYY" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>

          {error && <p style={styles.errorText}>⚠️ {error}</p>}

          {loading && (
            <div style={styles.loadingBar}>
              <div style={styles.loadingFill} />
            </div>
          )}

          {/* Buttons Row 1 */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => executeGeneralReport("CREDIT")} disabled={loading}>CTR Credit Report</button>
            <button style={styles.btnPrimary} onClick={() => executeGeneralReport("DEBIT")} disabled={loading}>CTR Debit Report</button>
            <button style={styles.btnPrimary} onClick={executeLimitReport} disabled={loading}>CTR Limit Report</button>
            <button style={styles.btnSecondary} onClick={handleClear} disabled={loading}>Clear</button>
          </div>

          {/* Buttons Row 2 */}
          <div style={{ ...styles.btnRow, marginTop: 10 }}>
            <button style={styles.btnOrange} onClick={() => executeRiskCategoryUpdate("D", "Transaction Risk Category")} disabled={loading}>Transaction Risk Category</button>
            <button style={styles.btnOrange} onClick={() => executeRiskCategoryUpdate("S", "Risk Category Summary")} disabled={loading}>Risk Category Summary</button>
            <button style={styles.btnOrange} onClick={() => executeRiskCategoryUpdate("KYCSUMMARY", "Summary match With KYC")} disabled={loading}>Summary match With KYC</button>
            <button style={styles.btnOrange} onClick={() => executeRiskCategoryUpdate("UPDATE", "Risk Category Update")} disabled={loading}>Risk Category Update</button>
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
              {activeReport} — {reportData.length} records found
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
  card: { background: "white", borderRadius: 10, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", fontFamily: "'Poppins', sans-serif" },
  cardHeader: { background: "linear-gradient(90deg, #334155, #334155)", padding: "12px 20px" },
  cardTitle: { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody: { padding: "24px 20px" },
  innerBox: { border: "1px solid #bfdbfe", borderRadius: 8, padding: "18px 20px", marginBottom: 20, background: "#fff" },
  formRow: { display: "flex", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 6 },
  label: { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, marginRight: 8, minWidth: 130, textAlign: "right" },
  req: { color: "#ef4444" },
  input: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btnPrimary: { height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", color: "white", background: "#334155", fontFamily: "'Poppins', sans-serif" },
  btnOrange: { height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", color: "white", background: "#f97316", fontFamily: "'Poppins', sans-serif" },
  btnSecondary: { height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", fontFamily: "'Poppins', sans-serif" },
  btnExcel: { height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #10b981, #059669)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
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