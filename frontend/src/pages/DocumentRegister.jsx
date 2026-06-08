import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

function toISO(raw) {
  if (!raw) return null;
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return raw;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export default function DocumentRegister() {
  const [fromUploadDate, setFromUploadDate] = useState("01/04/2025");
  const [toUploadDate, setToUploadDate] = useState("30/03/2026");
  const [fromDocCode, setFromDocCode] = useState("");
  const [toDocCode, setToDocCode] = useState("");
  const [textReportName, setTextReportName] = useState("");

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClear = () => {
    setFromUploadDate("01/04/2025");
    setToUploadDate("30/03/2026");
    setFromDocCode("");
    setToDocCode("");
    setTextReportName("");
    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  const handleFetchReport = async () => {
    if (!textReportName.trim()) {
      setError("Text report name is required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      const bodyParams = {
        fromUploadDate: toISO(fromUploadDate),
        toUploadDate: toISO(toUploadDate),
        fromDocCode: fromDocCode.trim(),
        toDocCode: toDocCode.trim()
      };

      const res = await fetch(`${API_BASE_URL}/api/document-register`, {
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
    const p = new URLSearchParams({
      fromUploadDate: toISO(fromUploadDate),
      toUploadDate: toISO(toUploadDate),
      fromDocCode: fromDocCode.trim(),
      toDocCode: toDocCode.trim()
    });
    window.open(`${API_BASE_URL}/api/document-register/text-report-view?${p}`, "_blank");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Document Register</h2>
        </div>

        <div style={styles.cardBody}>

          {/* Row 1: From Upload date / To Upload date */}
          <div style={styles.formRow}>
            <label style={styles.label}>From Upload date</label>
            <input
              style={styles.input}
              type="text"
              value={fromUploadDate}
              onChange={(e) => setFromUploadDate(e.target.value)}
            />
            <label style={{ ...styles.label, marginLeft: 40 }}>To Upload date</label>
            <input
              style={styles.input}
              type="text"
              value={toUploadDate}
              onChange={(e) => setToUploadDate(e.target.value)}
            />
          </div>

          {/* Row 2: From Document type / To Document type */}
          <div style={styles.formRow}>
            <label style={styles.label}>From Document type</label>
            <input
              style={{ ...styles.input, width: 160 }}
              type="text"
              placeholder="From Doc code"
              value={fromDocCode}
              onChange={(e) => setFromDocCode(e.target.value)}
            />
            <label style={{ ...styles.label, marginLeft: 16 }}>To Document type</label>
            <input
              style={{ ...styles.input, width: 160 }}
              type="text"
              placeholder="To Doc code"
              value={toDocCode}
              onChange={(e) => setToDocCode(e.target.value)}
            />
          </div>

          {/* Row 3: Text report name */}
          <div style={styles.formRow}>
            <label style={styles.label}>
              Please enter text report name <span style={styles.req}>*</span>
            </label>
            <input
              style={{ ...styles.input, width: 300 }}
              type="text"
              placeholder="Please enter text report name"
              value={textReportName}
              onChange={(e) => setTextReportName(e.target.value)}
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          {loading && (
            <div style={styles.loadingBar}>
              <div style={styles.loadingFill} />
            </div>
          )}

          <hr style={styles.divider} />

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={handleFetchReport} disabled={loading}>
              {loading ? "Loading…" : "Text Report View"}
            </button>
            {fetched && (
              <button style={styles.btnTeal} onClick={handleDownloadText}>
                Download Text Report
              </button>
            )}
            <button style={styles.btnTeal} onClick={handleClear}>
              Clear
            </button>
          </div>

        </div>
      </div>

      {/* Results Section */}
      {fetched && reportData.length > 0 && (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <h3 style={{ margin: 0, fontSize: 14, color: "#1e293b" }}>Document Details</h3>
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
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    width: "100%",
  },
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
  cardTitle: { color: "white", margin: 0, fontSize: 16, fontWeight: 600 },
  cardBody: { padding: "24px 20px" },
  formRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
    marginRight: 8,
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
    width: 200,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "white",
  },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "18px 0" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btnTeal: {
    height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", border: "none", color: "white",
    background: "#334155", fontFamily: "'Poppins', sans-serif",
  },
  btnPrimary: {
    height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", border: "none", color: "white",
    background: "linear-gradient(90deg, #334155, #334155)",
    fontFamily: "'Poppins', sans-serif",
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