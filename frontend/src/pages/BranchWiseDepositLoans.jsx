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

export default function BranchWiseDepositLoans() {
  const [unit, setUnit] = useState("InCrore");
  const [productType, setProductType] = useState("LoanDetails");
  const [branchCode, setBranchCode] = useState("1");
  const [asOnDate, setAsOnDate] = useState("30/03/2026");
  const [withPrevMonth, setWithPrevMonth] = useState(false);

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClear = () => {
    setUnit("InCrore");
    setProductType("LoanDetails");
    setBranchCode("1");
    setAsOnDate("30/03/2026");
    setWithPrevMonth(false);
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
      const body = {
        productType: productType,
        unit: unit,
        branchCode: branchCode.trim(),
        asOnDate: toISO(asOnDate)
      };

      const res = await fetch(`${API_BASE_URL}/api/branchwise-deposit-loans/report`, {
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
      setError(err.message || "Failed to fetch branchwise report.");
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

    const params = new URLSearchParams({
      productType: productType,
      unit: unit,
      branchCode: branchCode.trim(),
      asOnDate: toISO(asOnDate)
    });
    window.open(`${API_BASE_URL}/api/branchwise-deposit-loans/text-report-view?${params}`, "_blank");
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
    link.setAttribute('download', `branchwise_${productType.toLowerCase()}_${asOnDate}.csv`);
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
          <h2 style={styles.cardTitle}>Branch Wise Deposit / Loans List</h2>
        </div>

        {/* Card Body */}
        <div style={styles.cardBody}>

          {/* Row 1: Unit radios */}
          <div style={styles.formRow}>
            <div style={styles.labelCol}>Unit :</div>
            <div style={styles.radioGroup}>
              {[
                { value: "InThousand", label: "In Thousand" },
                { value: "InLacs",     label: "In Lacs"     },
                { value: "InCrore",    label: "In Crore"    },
              ].map((opt) => (
                <label key={opt.value} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="unit"
                    value={opt.value}
                    checked={unit === opt.value}
                    onChange={() => setUnit(opt.value)}
                    style={styles.radio}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Row 2: Product Type radios */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>
              Product Type : <span style={styles.req}>*</span>
            </label>
            <div style={styles.radioGroup}>
              {[
                { value: "Deposit",        label: "Deposit Summary" },
                { value: "DepositDetails",  label: "Deposit Details" },
                { value: "Loan",           label: "Loan Summary"    },
                { value: "LoanDetails",    label: "Loan Details"    },
              ].map((opt) => (
                <label key={opt.value} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="productType"
                    value={opt.value}
                    checked={productType === opt.value}
                    onChange={() => setProductType(opt.value)}
                    style={styles.radio}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Row 3: Branch Code */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>
              Branch Code <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.input}
              type="text"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
            />
          </div>

          {/* Row 4: As On Date */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>
              As On Date : <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.input}
              type="text"
              placeholder="DD/MM/YYYY"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
          </div>

          {/* Row 5: With Prev Month checkbox */}
          <div style={{ ...styles.formRow, marginBottom: 24 }}>
            <div style={styles.labelCol} />
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={withPrevMonth}
                onChange={(e) => setWithPrevMonth(e.target.checked)}
                style={styles.checkbox}
              />
              With Prev Month
            </label>
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
            <button style={styles.btnPrimary} onClick={handleTextReportView} disabled={loading}>Text Report View</button>
            <button style={styles.btnSecondary} onClick={handleClear} disabled={loading}>Clear</button>
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
              {productType} Report ({unit}) — {reportData.length} records found
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
  formRow: { display: "flex", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 },
  labelCol: { width: 130, flexShrink: 0, fontSize: 12, fontWeight: 500, color: "#374151" },
  fieldLabel: { width: 130, fontSize: 12, fontWeight: 500, color: "#374151", flexShrink: 0 },
  req: { color: "#ef4444" },
  radioGroup: { display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" },
  radioLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#374151", cursor: "pointer", userSelect: "none" },
  radio: { accentColor: "#334155", width: 14, height: 14, cursor: "pointer" },
  input: { height: 32, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 12, color: "#1e293b", outline: "none", width: 220, fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", background: "white" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#374151", cursor: "pointer", userSelect: "none" },
  checkbox: { accentColor: "#334155", width: 14, height: 14, cursor: "pointer" },
  btnRow: { display: "flex", gap: 10, paddingLeft: 138, flexWrap: "wrap" },
  btnPrimary: { height: 34, padding: "0 24px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "linear-gradient(90deg, #334155, #334155)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
  btnSecondary: { height: 34, padding: "0 24px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "#f1f5f9", border: "1px solid #cbd5e1", color: "#334155", fontFamily: "'Poppins', sans-serif" },
  btnExcel: { height: 34, padding: "0 24px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", background: "linear-gradient(90deg, #10b981, #059669)", border: "none", color: "white", fontFamily: "'Poppins', sans-serif" },
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