import { useState } from "react";

const HEADER_COLOR = "#334155";

export default function TrialBalanceReport() {
  const [reportWise, setReportWise] = useState("SummaryWise"); // "DetailsWise" | "SummaryWise"
  const [dateMode, setDateMode] = useState("FromTo");           // "AsOnDate" | "FromTo"
  const [branchCode, setBranchCode] = useState("1");
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2026-03-30");
  const [sortWise, setSortWise] = useState("NameWise");         // "CodeWise" | "NameWise"
  const [textReportName, setTextReportName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const callAPI = async (flag) => {
    setError(null);
    setResults(null);
    setLoading(true);
    try {
      // Replace with actual API call e.g.:
      // const data = await fetchTrialBalance({ flag, reportWise, dateMode, branchCode, fromDate, toDate, sortWise, textReportName });
      // setResults(data);
      await new Promise((r) => setTimeout(r, 800));
      setResults({ data: [], rowCount: 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setReportWise("SummaryWise");
    setDateMode("FromTo");
    setBranchCode("1");
    setFromDate("2025-04-01");
    setToDate("2026-03-30");
    setSortWise("NameWise");
    setTextReportName("");
    setResults(null);
    setError(null);
  };

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>Trail Balance Report</span>
      </div>

      <div style={s.body}>

        {/* Top bordered radio section */}
        <div style={s.outerBorder}>
          {/* Row 1 — Details Wise / Summary Wise */}
          <div style={s.radioRow}>
            {[
              { val: "DetailsWise", label: "Details Wise" },
              { val: "SummaryWise", label: "Summary Wise" },
            ].map((opt) => (
              <label key={opt.val} style={s.radioLabel}>
                <input
                  type="radio"
                  name="reportWise"
                  value={opt.val}
                  checked={reportWise === opt.val}
                  onChange={() => setReportWise(opt.val)}
                  style={s.radio}
                />
                {opt.label}
              </label>
            ))}
          </div>

          {/* Row 2 — AsOnDate / FromTo */}
          <div style={s.radioRow}>
            {[
              { val: "AsOnDate", label: "AsOnDate" },
              { val: "FromTo",   label: "FromTo"   },
            ].map((opt) => (
              <label key={opt.val} style={s.radioLabel}>
                <input
                  type="radio"
                  name="dateMode"
                  value={opt.val}
                  checked={dateMode === opt.val}
                  onChange={() => setDateMode(opt.val)}
                  style={s.radio}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Branch Code + Date fields */}
        <div style={s.formRow}>
          <label style={s.label}>Branch Code <span style={s.req}>*</span></label>
          <input
            style={s.input}
            value={branchCode}
            onChange={(e) => setBranchCode(e.target.value)}
          />

          {dateMode === "AsOnDate" ? (
            <>
              <label style={{ ...s.label, marginLeft: 20 }}>To Date <span style={s.req}>*</span></label>
              <input
                style={s.input}
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </>
          ) : (
            <>
              <label style={{ ...s.label, marginLeft: 20 }}>From Date <span style={s.req}>*</span></label>
              <input
                style={s.input}
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label style={{ ...s.label, marginLeft: 20 }}>To Date <span style={s.req}>*</span></label>
              <input
                style={s.input}
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Code Wise / Name Wise */}
        <div style={{ ...s.formRow, marginTop: 12 }}>
          {[
            { val: "CodeWise", label: "Code Wise" },
            { val: "NameWise", label: "Name Wise" },
          ].map((opt) => (
            <label key={opt.val} style={{ ...s.radioLabel, marginLeft: opt.val === "CodeWise" ? 166 : 32 }}>
              <input
                type="radio"
                name="sortWise"
                value={opt.val}
                checked={sortWise === opt.val}
                onChange={() => setSortWise(opt.val)}
                style={s.radio}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {/* Text Report Name */}
        <div style={{ ...s.formRow, marginTop: 12 }}>
          <label style={s.label}>Please enter text report name <span style={s.req}>*</span></label>
          <input
            style={{ ...s.input, width: 300 }}
            placeholder="Please enter text report name"
            value={textReportName}
            onChange={(e) => setTextReportName(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && <div style={s.errorBox}>⚠️ {error}</div>}

        {/* Divider */}
        <hr style={s.divider} />

        {/* Buttons */}
        <div style={s.btnRow}>
          <button style={s.btn} onClick={() => callAPI("SUBMIT")} disabled={loading}>Submit</button>
          <button style={s.btn} onClick={() => callAPI("LAZER")} disabled={loading}>Lazer</button>
          <button style={s.btn} onClick={() => callAPI("TEXT")} disabled={loading}>Text</button>
          <button style={s.btn} onClick={() => callAPI("TEXT_VIEW")} disabled={loading}>Text Report View</button>
          <button style={s.btn} onClick={() => callAPI("TB_FORMAT1")} disabled={loading}>TB Format1</button>
          <button style={s.btnClear} onClick={handleClear}>Clear</button>
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
    padding: "12px 20px",
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  radioRow: {
    display: "flex",
    gap: 48,
    alignItems: "center",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 12,
    color: "#374151",
    cursor: "pointer",
  },
  radio: {
    accentColor: HEADER_COLOR,
    cursor: "pointer",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  label: {
    width: 160,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  req: {
    color: "#ef4444",
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
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "16px 0 12px",
  },
  btnRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  btn: {
    height: 32,
    padding: "0 20px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: HEADER_COLOR,
    border: "none",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
  },
  btnClear: {
    height: 32,
    padding: "0 20px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: "#6b7280",
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