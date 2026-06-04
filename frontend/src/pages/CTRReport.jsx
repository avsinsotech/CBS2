import { useState } from "react";
import { updateCtrRiskCategory, fetchCtrLimitReport, fetchCtrGeneralReport } from "../api/api";



export default function CTRReport() {
  const [fromBrcd, setFromBrcd] = useState("1");
  const [toBrcd, setToBrcd] = useState("2");
  const [fromProductCode, setFromProductCode] = useState("");
  const [fromProductDesc, setFromProductDesc] = useState("");
  const [toProductCode, setToProductCode] = useState("");
  const [toProductDesc, setToProductDesc] = useState("");
  const [cashLimit, setCashLimit] = useState("233");
  const [fromDate, setFromDate] = useState("01/04/2025");
  const [toDate, setToDate] = useState("26/07/2025");

  // API Call States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resultData, setResultData] = useState(null);

  // Date Parser (DD/MM/YYYY -> YYYY-MM-DD)
  const parseDate = (raw) => {
    if (!raw) return null;
    const parts = raw.trim().split("/");
    if (parts.length !== 3) return null;
    let [d, m, y] = parts;
    if (y.length === 2) y = "20" + y;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const handleRiskCategoryAction = async (flagValue) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    // Basic Validation
    if (!fromBrcd || !toBrcd || !fromDate || !toDate || !cashLimit) {
      setError("Please fill in all required fields (From/To Brcd, From/To Date, Cash Limit).");
      setLoading(false);
      return;
    }

    const formattedFromDate = parseDate(fromDate);
    const formattedToDate = parseDate(toDate);

    if (!formattedFromDate || !formattedToDate) {
      setError("Invalid date format. Please use DD/MM/YYYY (e.g. 01/04/2025).");
      setLoading(false);
      return;
    }

    try {
      const response = await updateCtrRiskCategory({
        fromBrcd,
        toBrcd,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        fromAmount: cashLimit,
        flag: flagValue,
        mid: "2",
      });

      if (response.success) {
        setSuccessMessage(response.message || "Action completed successfully.");
        setResultData(response.data);
      } else {
        setError(response.error || "Action failed.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLimitReport = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    // Basic Validation
    if (!fromBrcd || !toBrcd || !fromDate || !toDate || !cashLimit) {
      setError("Please fill in all required fields (From/To Brcd, From/To Date, Cash Limit).");
      setLoading(false);
      return;
    }

    const formattedFromDate = parseDate(fromDate);
    const formattedToDate = parseDate(toDate);

    if (!formattedFromDate || !formattedToDate) {
      setError("Invalid date format. Please use DD/MM/YYYY (e.g. 01/04/2025).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchCtrLimitReport({
        fromBrcd,
        toBrcd,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        fromAmount: cashLimit,
      });

      if (response.success) {
        setSuccessMessage(response.message || "CTR Limit Report retrieved successfully.");
        setResultData(response.data);
      } else {
        setError(response.error || "Failed to retrieve CTR Limit Report.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneralReport = async (flagValue) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    // Basic Validation
    if (!fromBrcd || !fromDate || !toDate || !cashLimit) {
      setError("Please fill in From Brcd, From/To Date, and Cash Limit.");
      setLoading(false);
      return;
    }

    const formattedFromDate = parseDate(fromDate);
    const formattedToDate = parseDate(toDate);

    if (!formattedFromDate || !formattedToDate) {
      setError("Invalid date format. Please use DD/MM/YYYY (e.g. 01/04/2025).");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchCtrGeneralReport({
        brcd: fromBrcd,
        flag: flagValue,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        fsgl: fromProductCode || '1',
        tsgl: toProductCode || '1',
        ctrLimit: cashLimit,
      });

      if (response.success) {
        setSuccessMessage(response.message || `CTR ${flagValue === 'CREDIT' ? 'Credit' : 'Debit'} Report retrieved successfully.`);
        setResultData(response.data);
      } else {
        setError(response.error || `Failed to retrieve CTR ${flagValue === 'CREDIT' ? 'Credit' : 'Debit'} Report.`);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (


    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>CTR Report</h2>
      </div>

      <div style={styles.cardBody}>

        {/* From Brcd / To Brcd */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            From Brcd <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={fromBrcd}
            onChange={(e) => setFromBrcd(e.target.value)}
          />
          <label style={{ ...styles.label, marginLeft: 40 }}>
            To Brcd <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={toBrcd}
            onChange={(e) => setToBrcd(e.target.value)}
          />
        </div>

        {/* From Product Code */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            From Product Code <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={fromProductCode}
            onChange={(e) => setFromProductCode(e.target.value)}
          />
          <input
            style={{ ...styles.input, marginLeft: 8, width: 320 }}
            type="text"
            value={fromProductDesc}
            onChange={(e) => setFromProductDesc(e.target.value)}
          />
        </div>

        {/* To Product Code */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            To Product Code <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={toProductCode}
            onChange={(e) => setToProductCode(e.target.value)}
          />
          <input
            style={{ ...styles.input, marginLeft: 8, width: 320 }}
            type="text"
            value={toProductDesc}
            onChange={(e) => setToProductDesc(e.target.value)}
          />
        </div>

        {/* Cash Limit */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            Cash Limit <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={cashLimit}
            onChange={(e) => setCashLimit(e.target.value)}
          />
        </div>

        {/* From Date / To Date */}
        <div style={styles.formRow}>
          <label style={styles.label}>
            From Date <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label style={{ ...styles.label, marginLeft: 40 }}>
            To Date <span style={styles.req}>*</span>
          </label>
          <input
            style={styles.input}
            type="text"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <hr style={styles.divider} />

        {/* Buttons Row 1 */}
        <div style={styles.btnRow}>
          <button
            style={loading ? styles.btnTealDisabled : styles.btnTeal}
            onClick={() => handleGeneralReport("CREDIT")}
            disabled={loading}
          >
            {loading ? "Loading..." : "CTR Credit Report"}
          </button>
          <button
            style={loading ? styles.btnTealDisabled : styles.btnTeal}
            onClick={() => handleGeneralReport("DEBIT")}
            disabled={loading}
          >
            {loading ? "Loading..." : "CTR Debit Report"}
          </button>

          <button
            style={loading ? styles.btnTealDisabled : styles.btnTeal}
            onClick={handleLimitReport}
            disabled={loading}
          >
            {loading ? "Loading..." : "CTR Limit Report"}
          </button>

        </div>

        {/* Buttons Row 2 */}
        <div style={{ ...styles.btnRow, marginTop: 10 }}>
          <button
            style={loading ? styles.btnTealDisabled : styles.btnTeal}
            onClick={() => handleRiskCategoryAction("D")}
            disabled={loading}
          >
            {loading ? "Loading..." : "Transaction Risk Category"}
          </button>

          <button
            style={loading ? styles.btnTealDisabled : styles.btnTeal}
            onClick={() => handleRiskCategoryAction("S")}
            disabled={loading}
          >
            {loading ? "Loading..." : "Risk Category Summary"}
          </button>

          <button
            style={loading ? styles.btnTealDisabled : styles.btnTeal}
            onClick={() => handleRiskCategoryAction("KYCSummary")}
            disabled={loading}
          >
            {loading ? "Loading..." : "Summary match With KYC"}
          </button>
          <button
            style={loading ? styles.btnTealDisabled : styles.btnTeal}
            onClick={() => handleRiskCategoryAction("UPDATE")}
            disabled={loading}
          >
            {loading ? "Updating..." : "Risk Category Update"}
          </button>
        </div>

        {/* Feedback Section */}
        {loading && <div style={styles.infoBox}>Processing request... Please wait.</div>}
        {error && <div style={styles.errorBox}>{error}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        {/* Results Data Table */}
        {resultData && resultData.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={styles.resultTitle}>Results</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    {Object.keys(resultData[0]).map((key) => (
                      <th key={key} style={styles.th}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      {Object.values(row).map((val, idx) => (
                        <td key={idx} style={styles.td}>{val !== null && val !== undefined ? String(val) : ""}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
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
    minWidth: 130,
    textAlign: "right",
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
  },
  divider: { border: "none", borderTop: "1px solid #e5e7eb", margin: "18px 0" },
  btnRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  btnTeal: {
    height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "pointer", border: "none", color: "white",
    background: "#334155", fontFamily: "'Poppins', sans-serif",
    transition: "background 0.2s ease",
  },
  btnTealDisabled: {
    height: 32, padding: "0 16px", borderRadius: 5, fontSize: 12,
    fontWeight: 500, cursor: "not-allowed", border: "none", color: "#9ca3af",
    background: "#e5e7eb", fontFamily: "'Poppins', sans-serif",
  },
  infoBox: {
    padding: "12px",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    color: "#1e3a8a",
    fontSize: "12px",
    marginTop: "16px",
  },
  errorBox: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    color: "#991b1b",
    fontSize: "12px",
    marginTop: "16px",
  },
  successBox: {
    padding: "12px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    color: "#166534",
    fontSize: "12px",
    marginTop: "16px",
  },
  resultTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "10px",
  },
  tableContainer: {
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "11px",
    textAlign: "left",
  },
  thRow: {
    backgroundColor: "#f3f4f6",
    borderBottom: "2px solid #e5e7eb",
  },
  th: {
    padding: "10px 12px",
    fontWeight: 600,
    color: "#374151",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
  },
  trEven: {
    backgroundColor: "white",
  },
  trOdd: {
    backgroundColor: "#f9fafb",
  },
};