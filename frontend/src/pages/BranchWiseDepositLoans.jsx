import { useState } from "react";
import { fetchBranchWiseDepositLoans } from "../api/api";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BranchWiseDepositLoans() {
  const [unit, setUnit] = useState("InThousand");
  const [productType, setProductType] = useState("Deposit");
  const [branchCode, setBranchCode] = useState("1");
  const [asOnDate, setAsOnDate] = useState("2025-07-26");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleClear = () => {
    setUnit("InThousand");
    setProductType("Deposit");
    setBranchCode("1");
    setAsOnDate("2025-07-26");
    setError(null);
    setSuccessMessage(null);
    setResultData(null);
  };

  const handleShowReport = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResultData(null);

    if (!branchCode || !asOnDate) {
      setError("Please fill in Branch Code and As On Date.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchBranchWiseDepositLoans({
        productType,
        unit,
        branchCode,
        asOnDate,
      });

      if (response.success) {
        setSuccessMessage(response.message || "Branch Wise Deposit/Loans Report retrieved successfully.");
        setResultData(response.data);
      } else {
        setError(response.error || "Failed to retrieve Branch Wise Deposit/Loans Report.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    setError(null);
    setSuccessMessage(null);

    if (!branchCode || !asOnDate) {
      setError("Please fill in Branch Code and As On Date.");
      return;
    }

    const params = new URLSearchParams({
      productType,
      unit,
      branchCode,
      asOnDate,
    });

    window.open(`${BASE_URL}/api/branchwise-deposit-loans/text-report-view?${params}`, '_blank');
  };

  const getHeaders = () => {
    if (!resultData || resultData.length === 0) return [];
    return Object.keys(resultData[0]);
  };

  return (
    <div style={styles.card}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Branch Wise Deposit / Loans List</h2>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>

        {/* Inner bordered box */}
        <div style={styles.innerBox}>
          
          {/* Row 1: Unit radios (In Thousand / In Lacs / In Crore) */}
          <div style={styles.formRow}>
            <label style={styles.fieldLabel}>Select Unit :</label>
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
                { value: "Deposit",     label: "Deposit"      },
                { value: "Loan",        label: "Loan"         },
                { value: "LoanDetails", label: "Loan Details" },
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

          {/* Row 3 & 4 in one row: Branch Code & As On Date */}
          <div style={styles.formRow}>
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>
                Branch Code <span style={styles.req}>*</span>
              </label>
              <input
                style={styles.inputYellow}
                type="text"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
              />
            </div>
            
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>
                As On Date : <span style={styles.req}>*</span>
              </label>
              <input
                style={styles.inputDate}
                type="date"
                value={asOnDate}
                onChange={(e) => setAsOnDate(e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Feedback Section */}
        {loading && <div style={styles.infoBox}>Processing request... Please wait.</div>}
        {error && <div style={styles.errorBox}>{error}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={loading ? styles.btnPrimaryDisabled : styles.btnPrimary} onClick={handleShowReport} disabled={loading}>
            {loading ? "Loading..." : "Show Report"}
          </button>
          <button style={styles.btnPrimary} onClick={handlePrintReport} disabled={loading}>
            Print Report
          </button>
          <button style={styles.btnOutline} onClick={handleClear}>
            Clear
          </button>
        </div>

        {/* Results Table */}
        {resultData && resultData.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={styles.resultTitle}>Results ({resultData.length} records found)</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    {getHeaders().map((header) => (
                      <th key={header} style={styles.th}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resultData.map((row, i) => (
                    <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                      {getHeaders().map((header) => (
                        <td key={header} style={styles.td}>
                          {String(row[header] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resultData && resultData.length === 0 && (
          <div style={styles.infoBox}>No records found for the selected criteria.</div>
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
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    background: "linear-gradient(90deg, #334155, #334155)",
    padding: "12px 20px",
  },
  cardTitle: {
    color: "white",
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
  },
  cardBody: {
    padding: "20px 24px 24px",
  },
  innerBox: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "16px 20px 20px",
    marginBottom: 24,
    background: "#fafafa",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 40,
  },
  fieldGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    whiteSpace: "nowrap",
  },
  req: { color: "#ef4444" },
  radioGroup: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    alignItems: "center",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#374151",
    cursor: "pointer",
    userSelect: "none",
  },
  radio: {
    accentColor: "#2563eb",
    width: 14,
    height: 14,
    cursor: "pointer",
  },
  inputYellow: {
    height: 32,
    border: "1px solid #fbbf24",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 12,
    color: "#1e293b",
    outline: "none",
    background: "#fefce8",
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    width: 100,
  },
  inputDate: {
    height: 32,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 12,
    color: "#1e293b",
    outline: "none",
    width: 180,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    cursor: "pointer",
    background: "white",
  },
  btnRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  btnPrimary: {
    height: 34,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
    color: "white",
    background: "#334155",
    fontFamily: "'Poppins', sans-serif",
  },
  btnPrimaryDisabled: {
    height: 34,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "not-allowed",
    border: "none",
    color: "#9ca3af",
    background: "#e5e7eb",
    fontFamily: "'Poppins', sans-serif",
  },
  btnOutline: {
    height: 34,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    color: "#374151",
    background: "white",
    border: "1px solid #9ca3af",
    fontFamily: "'Poppins', sans-serif",
  },
  infoBox: {
    padding: "12px",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    color: "#1e3a8a",
    fontSize: "12px",
    marginTop: "16px",
    marginBottom: "16px",
  },
  errorBox: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    color: "#991b1b",
    fontSize: "12px",
    marginTop: "16px",
    marginBottom: "16px",
  },
  successBox: {
    padding: "12px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    color: "#166534",
    fontSize: "12px",
    marginTop: "16px",
    marginBottom: "16px",
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
    marginTop: "12px",
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
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
    whiteSpace: "nowrap",
  },
  trEven: {
    backgroundColor: "white",
  },
  trOdd: {
    backgroundColor: "#f9fafb",
  },
};