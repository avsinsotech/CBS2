import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

export default function KYCReport() {
  const [kycType, setKycType] = useState("All"); // "All", "Complete", "Pending"
  const [fromDate, setFromDate] = useState("1900-01-01");
  const [toDate, setToDate] = useState("2026-03-28");
  const [fromBrcd, setFromBrcd] = useState("1");
  const [toBrcd, setToBrcd] = useState("9999");
  
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClear = () => {
    setKycType("All");
    setFromDate("1900-01-01");
    setToDate("2026-03-28");
    setFromBrcd("1");
    setToBrcd("9999");
    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  const fetchKYCReport = async (flagValue) => {
    if (!toDate) {
      setError("As On Date (To Date) is required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      const bodyParams = {
        flag: flagValue || kycType,
        tDate: toDate,
        fDate: fromDate || "1900-01-01",
        fBrcd: fromBrcd || "1",
        tBrcd: toBrcd || "9999"
      };

      const res = await fetch(`${API_BASE_URL}/api/kyc-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }

      const responseData = await res.json();
      const data = responseData.data || [];
      
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setReportData(data);
      setFetched(true);
    } catch (err) {
      setError(err.message || "Failed to fetch KYC report.");
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
    link.setAttribute('download', `kyc_report_${kycType}_${toDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>KYC Status Reports</h2>
        </div>

        <div style={styles.cardBody}>
          <div style={styles.innerBox}>
            {/* Row 1: KYC Type */}
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>KYC Status Type :</label>
              <select style={styles.select} value={kycType} onChange={(e) => setKycType(e.target.value)}>
                <option value="All">All Customers</option>
                <option value="Complete">Completed KYC</option>
                <option value="Pending">Pending/Incompleted KYC</option>
              </select>
            </div>

            {/* Row 2: Date Filters */}
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>From Date :</label>
              <input style={styles.input} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              
              <label style={{ ...styles.fieldLabel, width: "auto", marginLeft: 20, marginRight: 10 }}>As On Date :</label>
              <input style={styles.input} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>

            {/* Row 3: Branch range */}
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>From Branch :</label>
              <input style={styles.input} type="text" value={fromBrcd} onChange={(e) => setFromBrcd(e.target.value)} />

              <label style={{ ...styles.fieldLabel, width: "auto", marginLeft: 20, marginRight: 10 }}>To Branch :</label>
              <input style={styles.input} type="text" value={toBrcd} onChange={(e) => setToBrcd(e.target.value)} />
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
            <button style={styles.btnPrimary} onClick={() => fetchKYCReport(kycType)} disabled={loading}>
              KYC Report
            </button>
            <button style={styles.btnPrimary} onClick={() => fetchKYCReport("Dump")} disabled={loading}>
              Dump KYC Report
            </button>
            {reportData.length > 0 && (
              <button style={styles.btnExcel} onClick={handleDownloadCsv}>
                Export to CSV/Excel
              </button>
            )}
            <button style={styles.btnSecondary} onClick={handleClear} disabled={loading}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {fetched && reportData.length > 0 && (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
              KYC Report Results — {reportData.length} records found
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
  cardBody: { padding: "20px 24px" },
  innerBox: { border: "1px solid #bfdbfe", borderRadius: 8, padding: "18px 20px", marginBottom: 20, background: "#fff" },
  formRow: { display: "flex", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 6 },
  fieldLabel: { width: 140, fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0 },
  input: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", background: "white" },
  select: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 200, fontFamily: "'Poppins', sans-serif", background: "white", cursor: "pointer" },
  btnRow: { display: "flex", gap: 10 },
  btnPrimary: { height: 32, padding: "0 20px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #334155, #334155)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
  btnExcel: { height: 32, padding: "0 20px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "linear-gradient(90deg, #10b981, #059669)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
  btnSecondary: { height: 32, padding: "0 20px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", fontFamily: "'Poppins', sans-serif" },
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