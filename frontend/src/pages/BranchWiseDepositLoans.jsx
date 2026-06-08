import { useState } from "react";

export default function BranchWiseDepositLoans() {
  const [unit, setUnit] = useState("InCrore");
  const [productType, setProductType] = useState("LoanDetails");
  const [branchCode, setBranchCode] = useState("1");
  const [asOnDate, setAsOnDate] = useState("30/03/2026");
  const [withPrevMonth, setWithPrevMonth] = useState(false);

  const handleClear = () => {
    setUnit("InCrore");
    setProductType("LoanDetails");
    setBranchCode("1");
    setAsOnDate("30/03/2026");
    setWithPrevMonth(false);
  };

  return (
    <div style={styles.card}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Branch Wise Deposit / Loans List</h2>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>

        {/* Row 1: Unit radios (In Thousand / In Lacs / In Crore) */}
        <div style={styles.formRow}>
          <div style={styles.labelCol} />
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

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button style={styles.btnPrint}>Print Report</button>
        </div>

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
  cardTitle: {
    color: "white",
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },
  cardBody: {
    padding: "24px 28px",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 8,
  },
  labelCol: {
    width: 130,
    flexShrink: 0,
  },
  fieldLabel: {
    width: 130,
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    flexShrink: 0,
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
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#374151",
    cursor: "pointer",
    userSelect: "none",
  },
  checkbox: {
    accentColor: "#2563eb",
    width: 14,
    height: 14,
    cursor: "pointer",
  },
  btnRow: {
    display: "flex",
    gap: 10,
    paddingLeft: 138,
    flexWrap: "wrap",
  },
  btnPrint: {
    height: 34,
    padding: "0 24px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(90deg, #334155, #334155)",
    border: "none",
    color: "white",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "0 2px 6px rgba(239,68,68,0.35)",
  },
};