import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

function toISO(raw) {
  if (!raw) return null;
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return raw; // fallback if already YYYY-MM-DD
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export default function InOperativeAccList() {
  const [mode, setMode] = useState("Period"); // "Period" | "DueDate"
  const [branchCode, setBranchCode] = useState("1");
  const [productType, setProductType] = useState("");
  const [productName, setProductName] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [periodMM, setPeriodMM] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [amountLessThan, setAmountLessThan] = useState("");

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClear = () => {
    setMode("Period");
    setBranchCode("1");
    setProductType("");
    setProductName("");
    setAsOnDate("");
    setPeriodMM("");
    setDueDate("");
    setAmountLessThan("");
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
    if (!asOnDate.trim()) {
      setError("As On Date is required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      const bodyParams = {
        branchCode: branchCode.trim(),
        productType: productType.trim(),
        mode,
        asOnDate: toISO(asOnDate),
        periodMM: periodMM.trim(),
        dueDate: toISO(dueDate)
      };

      const res = await fetch(`${API_BASE_URL}/api/inoperative-acc-list`, {
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
      setError(err.message || "Failed to fetch report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadText = () => {
    const fromISO = toISO(asOnDate);
    const p = new URLSearchParams({
      branchCode: branchCode.trim(),
      productType: productType.trim(),
      mode,
      asOnDate: fromISO,
      periodMM: periodMM.trim(),
      dueDate: toISO(dueDate)
    });
    window.open(`${API_BASE_URL}/api/inoperative-acc-list/text-report-view?${p}`, "_blank");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Card Header */}
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>InOperative Acc List</h2>
        </div>

        {/* Card Body */}
        <div style={styles.cardBody}>

          {/* Inner bordered box */}
          <div style={styles.innerBox}>

            {/* Row 1: Period / DueDate radio */}
            <div style={{ ...styles.formRow, marginBottom: 16 }}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="mode"
                  value="Period"
                  checked={mode === "Period"}
                  onChange={() => setMode("Period")}
                  style={styles.radio}
                />
                Period
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="mode"
                  value="DueDate"
                  checked={mode === "DueDate"}
                  onChange={() => setMode("DueDate")}
                  style={styles.radio}
                />
                DueDate
              </label>
            </div>

            {/* Row 2: Branch Code */}
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>
                Branch Code : <span style={styles.req}>*</span>
              </label>
              <input
                style={styles.input}
                type="text"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
              />
            </div>

            {/* Row 3: Product Type */}
            <div style={styles.formRow}>
              <label style={styles.fieldLabel}>
                Product Type : <span style={styles.req}>*</span>
              </label>
              <input
                style={{ ...styles.input, width: 160 }}
                type="text"
                placeholder="Product Type"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
              />
              <input
                style={{ ...styles.input, width: 260, marginLeft: 6 }}
                type="text"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
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

            {/* Row 5: Period (MM) — only when mode === "Period" */}
            {mode === "Period" && (
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
            )}

            {/* Row 5 alt: Due Date — only when mode === "DueDate" */}
            {mode === "DueDate" && (
              <div style={styles.formRow}>
                <label style={styles.fieldLabel}>
                  Due Date : <span style={styles.req}>*</span>
                </label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            )}

            {/* Row 6: Amount Less Than */}
            <div style={{ ...styles.formRow, marginBottom: 0 }}>
              <label style={styles.fieldLabel}>
                Amount Less Than: <span style={styles.req}>*</span>
              </label>
              <input
                style={styles.input}
                type="text"
                value={amountLessThan}
                onChange={(e) => setAmountLessThan(e.target.value)}
              />
            </div>

          </div>{/* /innerBox */}

          {/* Error Message */}
          {error && <p style={styles.errorText}>{error}</p>}

          {/* Loading Bar */}
          {loading && (
            <div style={styles.loadingBar}>
              <div style={styles.loadingFill} />
            </div>
          )}

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={handleFetchReport} disabled={loading}>
              {loading ? "Loading…" : "Report Print"}
            </button>
            <button style={styles.btnSecondary} onClick={handleDownloadText} disabled={loading}>
              Text Report View
            </button>
            <button style={styles.btnSecondary} onClick={handleClear}>
              Clear
            </button>
          </div>

        </div>
      </div>

      {/* Results Section */}
      {fetched && reportData.length > 0 && (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <h3 style={{ margin: 0, fontSize: 14, color: "#1e293b" }}>Report Results</h3>
            <span style={{ fontSize: 12, color: "#64748b" }}>Total Records: {reportData.length}</span>
          </div>
          <div style={{ overflowX: "auto" }}>
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
                      <td key={col} style={styles.td}>{row[col] ?? ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p style={{ ...styles.errorText, marginTop: 20 }}>
          No records found for the given criteria.
        </p>
      )}
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
  cardTitle: {
    color: "white",
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  cardBody: {
    padding: "20px 24px",
  },
  innerBox: {
    border: "1px solid #bfdbfe",
    borderRadius: 8,
    padding: "18px 20px",
    marginBottom: 20,
    background: "#fff",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 6,
  },
  fieldLabel: {
    width: 160,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
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
    width: 220,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "white",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    marginRight: 10,
    userSelect: "none",
  },
  radio: {
    accentColor: "#2563eb",
    width: 14,
    height: 14,
    cursor: "pointer",
  },
  btnRow: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
  },
  btnPrimary: {
    height: 32,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "linear-gradient(90deg, #334155, #334155)",
    border: "none",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  btnSecondary: {
    height: 32,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    color: "#334155",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    width: "100%",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    margin: "10px 0",
    fontWeight: 500,
  },
  loadingBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 16,
  },
  loadingFill: {
    width: "50%",
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  tableWrapper: {
    background: "white",
    borderRadius: 10,
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    padding: 20,
    fontFamily: "'Poppins', sans-serif",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 10,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 12,
    textAlign: "left",
  },
  thRow: {
    backgroundColor: "#f8fafc",
    borderBottom: "2px solid #e2e8f0",
  },
  th: {
    padding: "10px 12px",
    fontWeight: 600,
    color: "#475569",
  },
  td: {
    padding: "10px 12px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
  },
  trEven: {
    backgroundColor: "#ffffff",
  },
  trOdd: {
    backgroundColor: "#f8fafc",
  },
};