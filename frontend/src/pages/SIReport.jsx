import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

export default function SIReport() {
  const [siType, setSiType] = useState("ddsToLoan");
  const [branchCode, setBranchCode] = useState("1");
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2026-03-30");
  const [reportName, setReportName] = useState("");

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClearAll = () => {
    setSiType("ddsToLoan");
    setBranchCode("1");
    setFromDate("2025-04-01");
    setToDate("2026-03-30");
    setReportName("");
    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  const handleFetchReport = async () => {
    if (!branchCode.trim()) {
      setError("Branch Code is required.");
      return;
    }
    if (!fromDate || !toDate) {
      setError("From Date and To Date are required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      const body = {
        flag: "Report1", // default SP flag
        brcd: branchCode.trim(),
        fromDate: fromDate,
        toDate: toDate
      };

      const res = await fetch(`${API_BASE_URL}/api/si-report`, {
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
      setError(err.message || "Failed to fetch SI report.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextReportView = () => {
    if (!branchCode.trim()) {
      setError("Branch Code is required.");
      return;
    }
    if (!fromDate || !toDate) {
      setError("From Date and To Date are required.");
      return;
    }

    const params = new URLSearchParams({
      flag: "Report1",
      brcd: branchCode.trim(),
      fromDate: fromDate,
      toDate: toDate
    });
    window.open(`${API_BASE_URL}/api/si-report/text-report-view?${params}`, "_blank");
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
    link.setAttribute('download', `si_report_${fromDate}_to_${toDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Standing Instruction Report</h2>
        </div>

        {/* Body */}
        <div style={styles.cardBody}>
          {/* Inner bordered box */}
          <div style={styles.innerBox}>
            {/* Radio - DDS To Loan */}
            <div style={styles.radioRow}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="siType"
                  value="ddsToLoan"
                  checked={siType === "ddsToLoan"}
                  onChange={() => setSiType("ddsToLoan")}
                  style={styles.radioInput}
                />
                DDS To Loan
              </label>
            </div>

            {/* Branch Code */}
            <div style={styles.formRow}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Branch Code</label>
                <input
                  style={{ ...styles.inputText, width: 180 }}
                  type="text"
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                />
              </div>
            </div>

            {/* From Date / To Date */}
            <div style={styles.formRow}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>From Date</label>
                <input
                  style={styles.inputDate}
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>To Date</label>
                <input
                  style={styles.inputDate}
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            {/* Enter Report Name */}
            <div style={styles.formRow}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Enter Report Name <span style={styles.req}>*</span>
                </label>
                <input
                  style={styles.inputText}
                  type="text"
                  placeholder="Enter Report Name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <p style={styles.errorText}>⚠️ {error}</p>}

          {loading && (
            <div style={styles.loadingBar}>
              <div style={styles.loadingFill} />
            </div>
          )}

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={handleFetchReport} disabled={loading}>Report</button>
            <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>Text Report</button>
            <button style={styles.btnSecondary} onClick={handleClearAll} disabled={loading}>Clear All</button>
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
              SI DDS to Loan Report — {reportData.length} records found
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
  cardTitle: { color: "white", margin: 0, fontSize: 15, fontWeight: 600 },
  cardBody: { padding: "20px 24px 24px" },
  innerBox: { border: "1px solid #d1d5db", borderRadius: 8, padding: "16px 20px 20px", marginBottom: 24, background: "#fafafa" },
  radioRow: { marginBottom: 16 },
  radioLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer" },
  radioInput: { width: 15, height: 15, accentColor: "#2563eb", cursor: "pointer" },
  formRow: { display: "flex", alignItems: "center", gap: 40, marginBottom: 14, flexWrap: "wrap" },
  fieldGroup: { display: "flex", alignItems: "center", gap: 10 },
  label: { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, whiteSpace: "nowrap" },
  req: { color: "#ef4444" },
  inputDate: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 180, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", cursor: "pointer", background: "white" },
  inputText: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 300, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", background: "white" },
  btnRow: { display: "flex", gap: 10, justifyContent: "center" },
  btnPrimary: { height: 34, padding: "0 24px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", color: "white", background: "linear-gradient(90deg, #334155, #334155)", fontFamily: "'Poppins', sans-serif" },
  btnSecondary: { height: 34, padding: "0 24px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", fontFamily: "'Poppins', sans-serif" },
  btnExcel: { height: 34, padding: "0 24px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #10b981, #059669)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
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