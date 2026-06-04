import { useState } from "react";
import "./TrialBalance.css";

const BASE_URL = "http://localhost:5000";

function TrialBalance() {
  const [reportWise, setReportWise] = useState("DetailsWise"); // "DetailsWise" | "SummaryWise"
  const [dateMode, setDateMode] = useState("AsOnDate");           // "AsOnDate" | "FromTo"
  const [branchCode, setBranchCode] = useState("1");
  const [fromDate, setFromDate] = useState("2026-05-21");
  const [toDate, setToDate] = useState("2026-05-21");
  const [sortWise, setSortWise] = useState("CodeWise");         // "CodeWise" | "NameWise"
  const [textReportName, setTextReportName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleClear = () => {
    setReportWise("DetailsWise");
    setDateMode("AsOnDate");
    setBranchCode("1");
    setFromDate("2026-05-21");
    setToDate("2026-05-21");
    setSortWise("CodeWise");
    setTextReportName("");
    setResults(null);
    setError(null);
  };

  const handleFetchReport = async () => {
    setError(null);
    setResults(null);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        toDate: dateMode === "AsOnDate" ? toDate : toDate,
        branchCode,
        sortWise
      });

      const response = await fetch(`${BASE_URL}/api/trial-balance?${params}`);
      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to fetch trial balance report.");
      }

      setResults(resData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = (mode) => {
    const params = new URLSearchParams({
      toDate: dateMode === "AsOnDate" ? toDate : toDate,
      branchCode,
      sortWise
    });
    window.open(`${BASE_URL}/api/trial-balance/text?${params}`, "_blank");
  };

  return (
    <div className="tb-wrapper">
      <div className="tb-card">
        {/* HEADER */}
        <div className="tb-header">Trail Balance Report</div>

        {/* TOP RADIO SECTION */}
        <div className="tb-radio-section">
          <div className="tb-radio-row">
            {/* Report Wise selection */}
            {[
              { val: "DetailsWise", label: "Details Wise" },
              { val: "SummaryWise", label: "Summary Wise" },
            ].map((opt) => (
              <label key={opt.val} className="tb-radio-label">
                <input
                  type="radio"
                  name="reportWise"
                  value={opt.val}
                  checked={reportWise === opt.val}
                  onChange={() => setReportWise(opt.val)}
                />
                {opt.label}
              </label>
            ))}

            <div className="tb-radio-divider" />

            {/* Date Mode selection */}
            {[
              { val: "AsOnDate", label: "AsOnDate" },
              { val: "FromTo", label: "FromTo" },
            ].map((opt) => (
              <label key={opt.val} className="tb-radio-label">
                <input
                  type="radio"
                  name="dateMode"
                  value={opt.val}
                  checked={dateMode === opt.val}
                  onChange={() => setDateMode(opt.val)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* FIELDS SECTION */}
        <div className="tb-fields-section">
          <div className="tb-fields-row">
            <div className="tb-field">
              <label>Branch Code <span className="req">*</span></label>
              <input
                className="tb-input"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
              />
            </div>

            {dateMode === "AsOnDate" ? (
              <div className="tb-field">
                <label>To Date <span className="req">*</span></label>
                <input
                  className="tb-input"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="tb-field">
                  <label>From Date <span className="req">*</span></label>
                  <input
                    className="tb-input"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="tb-field">
                  <label>To Date <span className="req">*</span></label>
                  <input
                    className="tb-input"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Sort Wise Radios */}
          <div className="tb-inline-radio-row">
            {[
              { val: "CodeWise", label: "Code Wise" },
              { val: "NameWise", label: "Name Wise" },
            ].map((opt) => (
              <label key={opt.val} className="tb-radio-label">
                <input
                  type="radio"
                  name="sortWise"
                  value={opt.val}
                  checked={sortWise === opt.val}
                  onChange={() => setSortWise(opt.val)}
                />
                {opt.label}
              </label>
            ))}
          </div>

          {/* Text Report Name input */}
          <div className="tb-field tb-field-full">
            <label>Please enter text report name <span className="req">*</span></label>
            <input
              className="tb-input tb-input-wide"
              placeholder="Please enter text report name"
              value={textReportName}
              onChange={(e) => setTextReportName(e.target.value)}
            />
          </div>
        </div>

        {/* Error message */}
        {error && <div className="tb-error-box">⚠️ {error}</div>}

        {/* FOOTER BUTTONS */}
        <div className="tb-footer">
          <button className="tb-btn" onClick={handleFetchReport} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
          <button className="tb-btn" onClick={() => handlePrintReport("LAZER")} disabled={loading}>
            Lazer
          </button>
          <button className="tb-btn" onClick={() => handlePrintReport("TEXT")} disabled={loading}>
            Text
          </button>
          <button className="tb-btn" onClick={() => handlePrintReport("TEXT_VIEW")} disabled={loading}>
            Text Report View
          </button>
          <button className="tb-btn" onClick={() => handlePrintReport("FORMAT1")} disabled={loading}>
            TB Format1
          </button>
          <button className="tb-btn" style={{ backgroundColor: "#6b7280" }} onClick={handleClear}>
            Clear
          </button>
        </div>

        {/* Loading Spinner / text */}
        {loading && (
          <div className="tb-loading-box">⏳ Fetching data from server...</div>
        )}

        {/* RESULTS TABLE */}
        {results && results.data && results.data.length > 0 && (
          <div className="tb-table-wrapper">
            <div className="tb-table-header">
              Results — {results.rowCount} record(s) found
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="tb-table">
                <thead>
                  <tr>
                    <th className="tb-th">GL Code</th>
                    <th className="tb-th">Sub GL Code</th>
                    <th className="tb-th">GL Name</th>
                    <th className="tb-th">OP Bal</th>
                    <th className="tb-th">CR</th>
                    <th className="tb-th">DR</th>
                    <th className="tb-th">Credit</th>
                    <th className="tb-th">Debit</th>
                    <th className="tb-th">GL Group</th>
                  </tr>
                </thead>
                <tbody>
                  {results.data.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "tb-tr-even" : "tb-tr-odd"}>
                      <td className="tb-td">{row.GLCode}</td>
                      <td className="tb-td">{row.SubGlCode}</td>
                      <td className="tb-td">{row.GlName}</td>
                      <td className="tb-td" style={{ textAlign: "right" }}>{row.OPBAL?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="tb-td" style={{ textAlign: "right" }}>{row.CR?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="tb-td" style={{ textAlign: "right" }}>{row.DR?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="tb-td" style={{ textAlign: "right" }}>{row.credit?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="tb-td" style={{ textAlign: "right" }}>{row.debit?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="tb-td">{row.GLGROUP}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results && results.data && results.data.length === 0 && (
          <div className="tb-no-data-box">No records found for the selected criteria.</div>
        )}
      </div>
    </div>
  );
}

export default TrialBalance;