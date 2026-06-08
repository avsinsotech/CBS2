import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

export default function CDRatioReport() {
  const [reportType, setReportType] = useState("summary"); // "summary" | "details"
  const [branchCode, setBranchCode] = useState("1");
  const [branchName, setBranchName] = useState("HEAD OFFICE");
  const [asOnDate, setAsOnDate] = useState("2026-03-30");
  const [textReportName, setTextReportName] = useState("");

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClearAll = () => {
    setReportType("summary");
    setBranchCode("1");
    setBranchName("HEAD OFFICE");
    setAsOnDate("2026-03-30");
    setTextReportName("");
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
    if (!asOnDate) {
      setError("As On Date is required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      const flag1Value = reportType === "summary" ? "CD" : "";
      const body = {
        flag: "CDR",
        brcd: branchCode.trim(),
        onDate: asOnDate,
        flag1: flag1Value
      };

      const res = await fetch(`${API_BASE_URL}/api/cd-ratio-report`, {
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
    if (!branchCode.trim()) {
      setError("Branch Code is required.");
      return;
    }
    if (!asOnDate) {
      setError("As On Date is required.");
      return;
    }

    const flag1Value = reportType === "summary" ? "CD" : "";
    const params = new URLSearchParams({
      flag: "CDR",
      brcd: branchCode.trim(),
      onDate: asOnDate,
      flag1: flag1Value
    });
    window.open(`${API_BASE_URL}/api/cd-ratio-report/text-report-view?${params}`, "_blank");
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
    link.setAttribute('download', `cd_ratio_${reportType}_${asOnDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>CD Ratio</h2>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.innerBox}>
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
          </div>

          {error && <p style={styles.errorText}>⚠️ {error}</p>}

          {loading && (
            <div style={styles.loadingBar}>
              <div style={styles.loadingFill} />
            </div>
          )}

          {/* Footer Buttons */}
          <div style={styles.footer}>
            <div style={styles.btnRow}>
              <button style={styles.btnPrimary} onClick={handleFetchReport} disabled={loading}>Report</button>
              <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>Text Report View</button>
              <button style={styles.btnSecondary} onClick={handleClearAll} disabled={loading}>Clear All</button>
              {reportData.length > 0 && (
                <button style={styles.btnExcel} onClick={handleDownloadCsv}>Export CSV</button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Results Section */}
      {fetched && reportData.length > 0 && (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
              CD Ratio {reportType === "summary" ? "Summary" : "Details"} Report — {reportData.length} records found
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
  formRow: { display: "flex", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 },
  label: { fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0, width: 160 },
  input: { height: 34, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box" },
  inputYellow: { background: "#fefce8", borderColor: "#fbbf24" },
  inputPink: { background: "#fff1f2", borderColor: "#fda4af", color: "#9f1239" },
  radioGroup: { display: "flex", alignItems: "center", gap: 28 },
  radioLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer" },
  radioInput: { width: 15, height: 15, accentColor: "#2563eb", cursor: "pointer" },
  footer: { background: "#f8fafc", margin: "20px -20px -20px", padding: "14px 20px", borderTop: "1px solid #e5e7eb" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  btnPrimary: { height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", color: "white", background: "linear-gradient(90deg, #334155, #334155)", fontFamily: "'Poppins', sans-serif" },
  btnSecondary: { height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", fontFamily: "'Poppins', sans-serif" },
  btnExcel: { height: 32, padding: "0 20px", borderRadius: 5, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #10b981, #059669)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
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