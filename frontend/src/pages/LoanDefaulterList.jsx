import { useState } from "react";

const HEADER_COLOR = "#334155";

const DEFAULT_ALL_VALUES = {
  fromBranch: "1",
  toBranch: "8",
  fromProduct: "201",
  toProduct: "212",
  fromAccount: "1",
  toAccount: "9999999",
  asOnDate: "2026-03-29",
};

export default function LoanDefaulterList() {
  const [acType, setAcType] = useState("OnlyCourtFile");
  const [reportType, setReportType] = useState("Details");
  const [rangeType, setRangeType] = useState("Specific"); // "Specific" or "ALL"

  const [fromBranch, setFromBranch] = useState("");
  const [toBranch, setToBranch] = useState("");
  const [fromProduct, setFromProduct] = useState("");
  const [toProduct, setToProduct] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [asOnDate, setAsOnDate] = useState("");
  const [areaCity, setAreaCity] = useState("Official");
  const [city, setCity] = useState("");
  const [reference, setReference] = useState("");
  const [selectType1, setSelectType1] = useState("");
  const [selectType2, setSelectType2] = useState("");
  const [odAmount, setOdAmount] = useState("");
  const [odInstallment, setOdInstallment] = useState("");
  const [fromSanction, setFromSanction] = useState("");
  const [toSanction, setToSanction] = useState("");
  const [sanctionFromDate, setSanctionFromDate] = useState("");
  const [sanctionToDate, setSanctionToDate] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [surname, setSurname] = useState("");
  const [secType, setSecType] = useState("");
  const [withAddress, setWithAddress] = useState(false);
  const [topODAccount, setTopODAccount] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  // When rangeType changes, auto-fill or clear range fields
  const handleRangeTypeChange = (val) => {
    setRangeType(val);
    if (val === "ALL") {
      setFromBranch(DEFAULT_ALL_VALUES.fromBranch);
      setToBranch(DEFAULT_ALL_VALUES.toBranch);
      setFromProduct(DEFAULT_ALL_VALUES.fromProduct);
      setToProduct(DEFAULT_ALL_VALUES.toProduct);
      setFromAccount(DEFAULT_ALL_VALUES.fromAccount);
      setToAccount(DEFAULT_ALL_VALUES.toAccount);
      setAsOnDate(DEFAULT_ALL_VALUES.asOnDate);
    } else {
      setFromBranch("");
      setToBranch("");
      setFromProduct("");
      setToProduct("");
      setFromAccount("");
      setToAccount("");
      setAsOnDate("");
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setResults(null);
    setLoading(true);
    try {
      // Replace with actual API call
      // const data = await fetchLoanDefaulterList({ acType, reportType, rangeType, fromBranch, toBranch, ... });
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
    setAcType("OnlyCourtFile");
    setReportType("Details");
    setRangeType("Specific");
    setFromBranch(""); setToBranch("");
    setFromProduct(""); setToProduct("");
    setFromAccount(""); setToAccount("");
    setAsOnDate("");
    setAreaCity("Official"); setCity("");
    setReference("");
    setSelectType1(""); setSelectType2("");
    setOdAmount(""); setOdInstallment("");
    setFromSanction(""); setToSanction("");
    setSanctionFromDate(""); setSanctionToDate("");
    setAccountStatus(""); setSurname(""); setSecType("");
    setWithAddress(false); setTopODAccount(false);
    setResults(null); setError(null);
  };

  const isReadOnly = rangeType === "ALL";

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerTitle}>OverDue Account List</span>
      </div>

      <div style={s.body}>
        {/* A/C Type Row */}
        <div style={s.acTypeRow}>
          <span style={s.acTypeLabel}>A/C Type</span>
          {[
            { val: "OnlyCourtFile", label: "Only Court File" },
            { val: "NormalAC", label: "Normal A/C" },
            { val: "AllAC", label: "All A/C's" },
            { val: "WeakAC", label: "Weak A/C's" },
          ].map((opt) => (
            <label key={opt.val} style={s.radioLabel}>
              <input
                type="radio"
                name="acType"
                value={opt.val}
                checked={acType === opt.val}
                onChange={() => setAcType(opt.val)}
                style={s.radio}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {/* Report Type + Range Row */}
        <div style={s.outerBorder}>
          {/* Report type radios (left side) */}
          <div style={s.reportRangeRow}>
            <div style={s.reportTypeGroup}>
              {["Details", "Summary", "Ref_AgentWise", "Ref_CustWise"].map((t) => (
                <label key={t} style={s.radioLabel}>
                  <input
                    type="radio"
                    name="reportType"
                    value={t}
                    checked={reportType === t}
                    onChange={() => setReportType(t)}
                    style={s.radio}
                  />
                  {t}
                </label>
              ))}
            </div>

            {/* Divider */}
            <div style={s.verticalDivider} />

            {/* Specific / ALL (right side) */}
            <div style={s.rangeGroup}>
              {["Specific", "ALL"].map((t) => (
                <label key={t} style={s.radioLabel}>
                  <input
                    type="radio"
                    name="rangeType"
                    value={t}
                    checked={rangeType === t}
                    onChange={() => handleRangeTypeChange(t)}
                    style={s.radio}
                  />
                  {t}
                </label>
              ))}
            </div>
          </div>

          {/* Main form fields */}
          <div style={s.formGrid}>
            {/* Row 1 */}
            <div style={s.formRow}>
              <label style={s.label}>From Branch <span style={s.req}>*</span></label>
              <input style={s.input} value={fromBranch} readOnly={isReadOnly}
                onChange={(e) => setFromBranch(e.target.value)} />
              <label style={s.label}>To Branch <span style={s.req}>*</span></label>
              <input style={s.input} value={toBranch} readOnly={isReadOnly}
                onChange={(e) => setToBranch(e.target.value)} />
            </div>

            {/* Row 2 */}
            <div style={s.formRow}>
              <label style={s.label}>From Product <span style={s.req}>*</span></label>
              <input style={s.input} value={fromProduct} readOnly={isReadOnly}
                onChange={(e) => setFromProduct(e.target.value)} />
              <label style={s.label}>To Product <span style={s.req}>*</span></label>
              <input style={s.input} value={toProduct} readOnly={isReadOnly}
                onChange={(e) => setToProduct(e.target.value)} />
            </div>

            {/* Row 3 */}
            <div style={s.formRow}>
              <label style={s.label}>From Account <span style={s.req}>*</span></label>
              <input style={s.input} value={fromAccount} readOnly={isReadOnly}
                onChange={(e) => setFromAccount(e.target.value)} />
              <label style={s.label}>To Account <span style={s.req}>*</span></label>
              <input style={s.input} value={toAccount} readOnly={isReadOnly}
                onChange={(e) => setToAccount(e.target.value)} />
            </div>

            {/* Row 4 - AsOnDate + Area/City */}
            <div style={s.formRow}>
              <label style={s.label}>AsOnDate</label>
              <input
                style={s.input}
                type="date"
                value={asOnDate}
                readOnly={isReadOnly}
                onChange={(e) => setAsOnDate(e.target.value)}
              />
              <label style={s.label}>Area/City</label>
              <div style={s.radioGroup}>
                {["Present", "Permanent", "Official"].map((a) => (
                  <label key={a} style={s.radioLabel}>
                    <input
                      type="radio"
                      name="areaCity"
                      value={a}
                      checked={areaCity === a}
                      onChange={() => setAreaCity(a)}
                      style={s.radio}
                    />
                    {a}
                  </label>
                ))}
              </div>
              <label style={{ ...s.label, marginLeft: 12 }}>City</label>
              <input
                style={{ ...s.input, width: 160 }}
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* Row 5 - Reference */}
            <div style={s.formRow}>
              <label style={s.label}>Reference / Recomm</label>
              <input style={s.input} value={reference}
                onChange={(e) => setReference(e.target.value)} />
            </div>

            {/* Row 6 - Select Type 1 + OD Amount */}
            <div style={s.formRow}>
              <label style={s.label}>Select Type</label>
              <select style={s.select} value={selectType1}
                onChange={(e) => setSelectType1(e.target.value)}>
                <option value="">--Select--</option>
                <option value="1">Type 1</option>
                <option value="2">Type 2</option>
              </select>
              <label style={s.label}>OD Amount</label>
              <input style={s.input} value={odAmount}
                onChange={(e) => setOdAmount(e.target.value)} />
            </div>

            {/* Row 7 - Select Type 2 + OD Installment */}
            <div style={s.formRow}>
              <label style={s.label}>Select Type</label>
              <select style={s.select} value={selectType2}
                onChange={(e) => setSelectType2(e.target.value)}>
                <option value="">--Select--</option>
                <option value="1">Type 1</option>
                <option value="2">Type 2</option>
              </select>
              <label style={s.label}>OD Installment</label>
              <input style={s.input} value={odInstallment}
                onChange={(e) => setOdInstallment(e.target.value)} />
            </div>

            {/* Row 8 - From/To Sanction */}
            <div style={s.formRow}>
              <label style={s.label}>From Sanction</label>
              <input style={s.input} value={fromSanction}
                onChange={(e) => setFromSanction(e.target.value)} />
              <label style={s.label}>To Sanction</label>
              <input style={s.input} value={toSanction}
                onChange={(e) => setToSanction(e.target.value)} />
            </div>

            {/* Row 9 - Sanction Dates */}
            <div style={s.formRow}>
              <label style={s.label}>Sanction From Date <span style={s.req}>*</span></label>
              <input style={s.input} type="date" value={sanctionFromDate}
                onChange={(e) => setSanctionFromDate(e.target.value)} />
              <label style={s.label}>Sanction To Date <span style={s.req}>*</span></label>
              <input style={s.input} type="date" value={sanctionToDate}
                onChange={(e) => setSanctionToDate(e.target.value)} />
            </div>

            {/* Row 10 - Account Status + Surname */}
            <div style={s.formRow}>
              <label style={s.label}>Account Status <span style={s.req}>*</span></label>
              <select style={s.select} value={accountStatus}
                onChange={(e) => setAccountStatus(e.target.value)}>
                <option value="">--Select--</option>
                <option value="A">Active</option>
                <option value="C">Closed</option>
                <option value="D">Dormant</option>
              </select>
              <label style={s.label}>Surname <span style={s.req}>*</span></label>
              <input style={s.input} placeholder="Enter surname..."
                value={surname} onChange={(e) => setSurname(e.target.value)} />
            </div>

            {/* Row 11 - Sec/UnSecure Type */}
            <div style={s.formRow}>
              <label style={s.label}>Sec/UnSecure Type <span style={s.req}>*</span></label>
              <select style={s.select} value={secType}
                onChange={(e) => setSecType(e.target.value)}>
                <option value="">--Select--</option>
                <option value="S">Secured</option>
                <option value="U">Unsecured</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div style={s.checkRow}>
              <label style={s.checkLabel}>
                <input type="checkbox" checked={withAddress}
                  onChange={(e) => setWithAddress(e.target.checked)}
                  style={{ marginRight: 6 }} />
                With_Address
              </label>
            </div>
            <div style={s.checkRow}>
              <label style={s.checkLabel}>
                <input type="checkbox" checked={topODAccount}
                  onChange={(e) => setTopODAccount(e.target.checked)}
                  style={{ marginRight: 6 }} />
                Top OD Account
              </label>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div style={s.errorBox}>⚠️ {error}</div>}

        {/* Buttons */}
        <div style={s.btnRow}>
          <button style={s.btn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
          <button style={s.btn} disabled={loading}>Excel Download</button>
          <button style={s.btnClear} onClick={handleClear}>Clear</button>
          <button style={s.btnClear} onClick={handleClear}>Exit</button>
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
  acTypeRow: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    marginBottom: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  acTypeLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "#334155",
  },
  outerBorder: {
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 16,
  },
  reportRangeRow: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #cbd5e1",
    padding: "8px 12px",
    gap: 0,
  },
  reportTypeGroup: {
    display: "flex",
    gap: 20,
    flex: 1,
    flexWrap: "wrap",
  },
  verticalDivider: {
    width: 1,
    background: "#cbd5e1",
    alignSelf: "stretch",
    margin: "0 16px",
  },
  rangeGroup: {
    display: "flex",
    gap: 20,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    color: "#374151",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  radio: {
    accentColor: HEADER_COLOR,
    cursor: "pointer",
  },
  radioGroup: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  formGrid: {
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
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
    width: 180,
    fontFamily: "'Poppins', sans-serif",
    boxSizing: "border-box",
    background: "white",
  },
  select: {
    height: 30,
    border: "1px solid #d1d5db",
    borderRadius: 5,
    padding: "0 8px",
    fontSize: 12,
    color: "#1e293b",
    outline: "none",
    width: 180,
    fontFamily: "'Poppins', sans-serif",
    background: "white",
    cursor: "pointer",
  },
  checkRow: {
    paddingTop: 2,
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    color: "#374151",
    cursor: "pointer",
  },
  btnRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginTop: 20,
    flexWrap: "wrap",
  },
  btn: {
    height: 32,
    padding: "0 22px",
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
    padding: "0 22px",
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    background: HEADER_COLOR,
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