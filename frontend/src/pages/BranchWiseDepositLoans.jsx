import { useState } from "react";
import "./BranchWiseDepositLoans.css";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL ="https://cbsapi.avsinsotech.com:8596";
/* ── helpers ──────────────────────────────────────────────── */
const parseDate = (raw) => {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

const numericCols = new Set([
  "Deposit","Loans","CASH","BANK","DAILY","CDRatio",
  "Deposit_FY","Loans_FY","CDRatio_FY",
  "Deposit_Prev","Loans_Prev","CASH_Prev","BANK_Prev","DAILY_Prev","CDRatio_Prev",
  "Saving","PigmyDp",
]);

/* ── Column groups for the two-row header ─────────────────── */
const COL_GROUPS = [
  { label: "",                    cols: ["SrNo","BranchCode","BranchName"] },
  { label: "As On Date",          cols: ["Deposit","Loans","CASH","BANK","DAILY","CDRatio"] },
  { label: "Financial Year",      cols: ["Deposit_FY","Loans_FY","CDRatio_FY","FinicialYR"] },
  { label: "Previous Date",       cols: ["Deposit_Prev","Loans_Prev","CASH_Prev","BANK_Prev","DAILY_Prev","CDRatio_Prev","PrevDate"] },
  { label: "Others",              cols: ["Saving","PigmyDp"] },
];

const HEADER_LABELS = {
  SrNo:"Sr.No", BranchCode:"Br.Code", BranchName:"Branch Name",
  Deposit:"Deposit", Loans:"Loans", CASH:"Cash", BANK:"Bank",
  DAILY:"Daily", CDRatio:"C/D%",
  Deposit_FY:"Deposit", Loans_FY:"Loans", CDRatio_FY:"C/D%", FinicialYR:"Fin. YR",
  Deposit_Prev:"Deposit", Loans_Prev:"Loans", CASH_Prev:"Cash",
  BANK_Prev:"Bank", DAILY_Prev:"Daily", CDRatio_Prev:"C/D%", PrevDate:"Date",
  Saving:"Saving", PigmyDp:"Pigmy Dp",
};

/* All columns in display order */
const ALL_COLS = COL_GROUPS.flatMap((g) => g.cols);

/* ── Component ────────────────────────────────────────────── */
function BranchWiseDepositLoans() {
  const today = new Date();
  const todayStr =
    String(today.getDate()).padStart(2, "0") + "/" +
    String(today.getMonth() + 1).padStart(2, "0") + "/" +
    today.getFullYear();

  const [form, setForm] = useState({
    amountUnit:  "In Lacs",
    asOnDate:    todayStr,
    branchCode:  "",
  });

  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [reportData, setReportData] = useState([]);
  const [fetched,    setFetched]    = useState(false);
  const [printMode,  setPrintMode]  = useState("");

  /* ── Handlers ─────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFetched(false);
  };

  const validate = () => {
    if (!form.asOnDate.trim())          return "As On Date is required.";
    if (!parseDate(form.asOnDate))      return "As On Date must be DD/MM/YYYY.";
    if (!form.branchCode.trim())        return "Branch Code is required.";
    return null;
  };

  const buildQuery = () =>
    new URLSearchParams({
      asOnDate:   form.asOnDate,
      amountUnit: form.amountUnit,
      branchCode: form.branchCode,
    }).toString();

  const fetchData = async (mode) => {
    const err = validate();
    if (err) { setError(err); return null; }

    setLoading(true);
    setError("");
    setPrintMode(mode);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/br-wise-deposit-loan?${buildQuery()}`
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || body.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.data || [];

      setReportData(rows);
      setFetched(true);
      return rows;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleShow        = () => fetchData("show");
  const handleReportPrint = () => fetchData("reportprint");

  const handleTextDownload = async () => {
    const data = fetched ? reportData : await fetchData("textdownload");
    if (!data || data.length === 0) return;

    const headers = ALL_COLS.filter((c) => data[0] && c in data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => `"${(row[h] ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `BranchWiseDepositLoans_${form.asOnDate.replace(/\//g,"-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = async () => {
    const data =
      fetched && printMode === "print"
        ? reportData
        : await fetchData("print");
    if (data && data.length > 0) setTimeout(() => window.print(), 300);
  };

  const handleBack = () => {
    setForm({ amountUnit: "In Lacs", asOnDate: todayStr, branchCode: "" });
    setReportData([]);
    setError("");
    setFetched(false);
  };

  /* ── Render ───────────────────────────────────────────── */
  /* Determine which column groups actually have data */
  const visibleGroups = fetched && reportData.length > 0
    ? COL_GROUPS.map((g) => ({
        ...g,
        cols: g.cols.filter((c) => c in reportData[0]),
      })).filter((g) => g.cols.length > 0)
    : [];

  const visibleCols = visibleGroups.flatMap((g) => g.cols);

  return (
    <div className="bwdl-wrapper">
      <div className="bwdl-card no-print">

        {/* HEADER */}
        <div className="bwdl-header">Branch Wise Deposit &amp; Loan List</div>

        {/* BODY */}
        <div className="bwdl-body">

          {/* Amount Unit */}
          <div className="bwdl-row">
            <div className="bwdl-radio-group">
              {["In Thousand", "In Lacs", "In Crore"].map((opt) => (
                <label key={opt} className="bwdl-radio-label">
                  <input
                    type="radio"
                    name="amountUnit"
                    value={opt}
                    checked={form.amountUnit === opt}
                    onChange={handleChange}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* As On Date */}
          <div className="bwdl-row">
            <label className="bwdl-label">
              As On Date <span className="req">*</span>
            </label>
            <input
              className="bwdl-input bwdl-input-short"
              type="text"
              name="asOnDate"
              value={form.asOnDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* Branch Code */}
          <div className="bwdl-row">
            <label className="bwdl-label">
              Branch Code <span className="req">*</span>
            </label>
            <input
              className="bwdl-input bwdl-input-mid"
              type="text"
              name="branchCode"
              value={form.branchCode}
              onChange={handleChange}
              placeholder="e.g. 001 (or HO code for all)"
            />
          </div>

          {/* Error / Loading */}
          {error   && <p className="bwdl-error">{error}</p>}
          {loading && (
            <p className="bwdl-loading">
              Loading… this may take up to 60 seconds.
            </p>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="bwdl-footer">
          <button className="bwdl-btn" onClick={handleShow} disabled={loading}>
            {loading && printMode === "show" ? "Loading…" : "Show"}
          </button>
          <button className="bwdl-btn" onClick={handleReportPrint} disabled={loading}>
            {loading && printMode === "reportprint" ? "Loading…" : "Report Print"}
          </button>
          <button className="bwdl-btn" onClick={handleTextDownload} disabled={loading}>
            Text Download
          </button>
          <button className="bwdl-btn" onClick={handlePrint} disabled={loading}>
            {loading && printMode === "print" ? "Loading…" : "Print"}
          </button>
          <button className="bwdl-btn bwdl-btn-exit" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>

      {/* RESULT TABLE */}
      {fetched && (
        <div className="bwdl-result-wrapper">

          <div className="bwdl-result-label">Branch Wise Deposit &amp; Loan List</div>

          {/* Print-only header */}
          <div className="print-only db-print-header">
            <h2>Branch Wise Deposit &amp; Loan List</h2>
            <p>
              Unit: {form.amountUnit} &nbsp;|&nbsp;
              As On: {form.asOnDate} &nbsp;|&nbsp;
              Branch: {form.branchCode} &nbsp;|&nbsp;
              Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          {reportData.length > 0 ? (
            <>
              <table className="bwdl-table">
                <thead>
                  {/* ── Row 1: group labels ── */}
                  <tr>
                    {visibleGroups.map((g) => (
                      <th
                        key={g.label || "base"}
                        colSpan={g.cols.length}
                        style={{ textAlign: "center", borderBottom: "1px solid #2d3f6e" }}
                      >
                        {g.label}
                      </th>
                    ))}
                  </tr>
                  {/* ── Row 2: column names ── */}
                  <tr className="sub-header">
                    {visibleCols.map((col) => (
                      <th key={col}>{HEADER_LABELS[col] || col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i}>
                      {visibleCols.map((col) => (
                        <td
                          key={col}
                          className={numericCols.has(col) ? "num" : ""}
                        >
                          {row[col] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="bwdl-record-count no-print">
                Total Records: {reportData.length}
              </p>
            </>
          ) : (
            !loading && (
              <p className="bwdl-error no-print">
                No records found for the given criteria.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default BranchWiseDepositLoans;