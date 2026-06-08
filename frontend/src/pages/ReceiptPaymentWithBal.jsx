import { useState, useRef } from "react";
import "./ReceiptPaymentWithBal.css";

// const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";
const API_BASE_URL = "http://localhost:5000";
function toISO(raw) {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function isValidDate(raw) {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return false;
  const [d, m] = parts.map(Number);
  return d >= 1 && d <= 31 && m >= 1 && m <= 12;
}

const ENDPOINT_MAP = {
  "English":   "/api/rec-pay-balance/english",
  "Marathi":   "/api/rec-pay-balance/marathi",
  "Skip Data": "/api/rec-pay-balance/skip-data",
};

// ── Number formatter ──────────────────────────────────────────────────────────
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n) || v === null || v === undefined || v === "") return "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ── Formatted Report Component (matches the picture exactly) ─────────────────
function RPBReportFormatted({ data, fromDate, toDate, bankName, branchName, userId }) {
  const printDate = new Date().toLocaleDateString("en-GB");

  // ── Build GL display name: "GL - GLName" (e.g. "01 - CASH Opening") ──
  const fmtGlName = (glCode, glName) => {
    if (!glCode && !glName) return "";
    if (!glName) return glCode || "";
    if (!glCode) return glName;
    return `${glCode} - ${glName}`;
  };

  // ── Determine DrCr from payment balance ──
  const getDrCr = (row) => {
    const payBal = parseFloat(row.PayClBal);
    if (isNaN(payBal) || payBal === 0) return "CR";
    return "CR";
  };

  // ── Compute totals ──
  const totalRecAmt   = data.reduce((sum, r) => sum + (parseFloat(r.RecAmt) || 0), 0);
  const totalRecBal   = data.reduce((sum, r) => sum + (parseFloat(r.RecClBal) || 0), 0);
  const totalPayAmt   = data.reduce((sum, r) => sum + (parseFloat(r.PayAmt) || 0), 0);
  const totalPayBal   = data.reduce((sum, r) => sum + (parseFloat(r.PayClBal) || 0), 0);

  return (
    <div className="rpb-formatted-report">

      {/* ── Meta Header ── */}
      <div className="rpb-fmt-meta-grid">
        <div className="rpb-fmt-meta-left">
          <div className="rpb-fmt-meta-row">
            <span className="rpb-fmt-meta-key">Name</span>
            <span className="rpb-fmt-meta-sep">:</span>
            <span className="rpb-fmt-meta-val">{bankName || ""}</span>
          </div>
          <div className="rpb-fmt-meta-row">
            <span className="rpb-fmt-meta-key">Branch Name</span>
            <span className="rpb-fmt-meta-sep">:</span>
            <span className="rpb-fmt-meta-val">{branchName || ""}</span>
          </div>
        </div>
        <div className="rpb-fmt-meta-right">
          <div className="rpb-fmt-meta-row">
            <span className="rpb-fmt-meta-key">Print Date</span>
            <span className="rpb-fmt-meta-sep">:</span>
            <span className="rpb-fmt-meta-val">{printDate}</span>
          </div>
          <div className="rpb-fmt-meta-row">
            <span className="rpb-fmt-meta-key">Print UserID</span>
            <span className="rpb-fmt-meta-sep">:</span>
            <span className="rpb-fmt-meta-val">{userId || ""}</span>
          </div>
        </div>
      </div>

      {/* ── Report Table ── */}
      <table className="rpb-fmt-table">
        <thead>
          {/* Title row */}
          <tr>
            <th colSpan="8" className="rpb-fmt-title-row">
              Receipt &amp; Payment With Balance {fromDate} And {toDate}
            </th>
          </tr>
          {/* Section headers */}
          <tr>
            <th colSpan="4" className="rpb-fmt-section-head rpb-fmt-section-receipt">Receipt</th>
            <th colSpan="4" className="rpb-fmt-section-head rpb-fmt-section-payment">Payment</th>
          </tr>
          {/* Column headers */}
          <tr className="rpb-fmt-col-head-row">
            <th className="rpb-fmt-th rpb-fmt-col-srno">Sr No</th>
            <th className="rpb-fmt-th rpb-fmt-col-glname">GL Name</th>
            <th className="rpb-fmt-th rpb-fmt-col-amt">Credit Amt</th>
            <th className="rpb-fmt-th rpb-fmt-col-bal">Balance</th>
            <th className="rpb-fmt-th rpb-fmt-col-glname">GL Name</th>
            <th className="rpb-fmt-th rpb-fmt-col-amt">Debit Amt</th>
            <th className="rpb-fmt-th rpb-fmt-col-bal">Balance</th>
            <th className="rpb-fmt-th rpb-fmt-col-drcr">DrCr</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "" : "rpb-fmt-row-alt"}>
              <td className="rpb-fmt-td rpb-fmt-col-srno">{index + 1}</td>
              {/* Receipt side */}
              <td className="rpb-fmt-td rpb-fmt-col-glname">
                {fmtGlName(row.RecGl, row.RecGlName)}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-amt rpb-fmt-num">
                {fmt(row.RecAmt)}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-bal rpb-fmt-num">
                {fmt(row.RecClBal)}
              </td>
              {/* Payment side */}
              <td className="rpb-fmt-td rpb-fmt-col-glname">
                {fmtGlName(row.PayGl, row.PayGlName)}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-amt rpb-fmt-num">
                {fmt(row.PayAmt)}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-bal rpb-fmt-num">
                {fmt(row.PayClBal)}
              </td>
              <td className="rpb-fmt-td rpb-fmt-col-drcr">
                {getDrCr(row)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="rpb-fmt-total-row">
            <td colSpan="2" className="rpb-fmt-td rpb-fmt-total-label">Toatl Receipt :</td>
            <td className="rpb-fmt-td rpb-fmt-col-amt rpb-fmt-num rpb-fmt-total-val">{fmt(totalRecAmt)}</td>
            <td className="rpb-fmt-td rpb-fmt-col-bal rpb-fmt-num rpb-fmt-total-val">{fmt(totalRecBal)}</td>
            <td colSpan="2" className="rpb-fmt-td rpb-fmt-total-label" style={{textAlign: "right"}}>Total Payment :</td>
            <td className="rpb-fmt-td rpb-fmt-col-bal rpb-fmt-num rpb-fmt-total-val">{fmt(totalPayAmt)}</td>
            <td className="rpb-fmt-td rpb-fmt-col-drcr rpb-fmt-num rpb-fmt-total-val">{fmt(totalPayBal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function ReceiptPaymentWithBal() {
  const [form, setForm] = useState({
    selectType: "Skip Data",
    branchCode: "1",
    fromDate:   "01/04/2025",
    toDate:     "30/03/2026",
  });

  const [reportData, setReportData] = useState([]);
  const [columns,    setColumns]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [fetched,    setFetched]    = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [bankInfo,   setBankInfo]   = useState({ bankName: "", branchName: "" });
  const reportRef = useRef(null);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFetched(false);
    setError("");
  };

  const validate = () => {
    if (!form.branchCode.trim())     return "Branch Code is required.";
    if (!isValidDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
    if (!isValidDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
    return null;
  };

  const fetchData = async () => {
    const err = validate();
    if (err) { setError(err); return null; }

    const path = ENDPOINT_MAP[form.selectType];
    const params = new URLSearchParams({
      BRCD: form.branchCode.trim(),
      PFDT: toISO(form.fromDate),
      PTDT: toISO(form.toDate),
    });

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}${path}?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setReportData(data);
      setFetched(true);

      // Fetch bank/branch info
      try {
        const infoRes = await fetch(`${API_BASE_URL}/api/bank-info?BRCD=${form.branchCode.trim()}`);
        if (infoRes.ok) {
          const info = await infoRes.json();
          setBankInfo(info);
        }
      } catch (e) { /* ignore */ }
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── View Report (formatted report in preview) ──────────────────────────────
  const handleViewReport = async () => {
    setActiveButton("view");
    await fetchData();
  };

  // ── Print Report (open print window directly) ─────────────────────────────
  const handlePrintReport = async () => {
    setActiveButton("print");
    const data = fetched ? reportData : await fetchData();
    if (!data || data.length === 0) return;
    // Wait for next render so reportRef has the formatted content
    setTimeout(() => {
      handlePrintWindow();
    }, 300);
  };

  // ── Open print window ─────────────────────────────────────────────────────
  const handlePrintWindow = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt &amp; Payment With Balance Report</title>
          <style>
            @page { size: landscape; margin: 8mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; margin: 0; }
            .rpb-formatted-report { padding: 0; }
            .rpb-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .rpb-fmt-meta-left, .rpb-fmt-meta-right { display: flex; flex-direction: column; gap: 3px; }
            .rpb-fmt-meta-row { display: flex; gap: 6px; font-size: 9px; }
            .rpb-fmt-meta-key { font-weight: 600; min-width: 80px; }
            table { width: 100%; border-collapse: collapse; margin-top: 6px; }
            th, td { border: 1px solid #999; padding: 3px 6px; text-align: left; font-size: 8px; }
            .rpb-fmt-title-row { text-align: center; font-weight: 700; background: #fff; font-size: 10px; }
            .rpb-fmt-section-receipt { text-align: center; color: #c00000; font-weight: 700; background: #f0f0f0; }
            .rpb-fmt-section-payment { text-align: center; color: #c00000; font-weight: 700; background: #f0f0f0; }
            .rpb-fmt-col-head-row th { background: #fff; font-weight: 700; }
            .rpb-fmt-num { text-align: right; }
            .rpb-fmt-col-srno { width: 4%; text-align: center; }
            .rpb-fmt-col-glname { width: 22%; }
            .rpb-fmt-col-amt { width: 10%; text-align: right; }
            .rpb-fmt-col-bal { width: 10%; text-align: right; }
            .rpb-fmt-col-drcr { width: 4%; text-align: center; }
            .rpb-fmt-row-alt { background: #f9f9f9; }
            .rpb-fmt-total-row { background: #f0f0f0; }
            .rpb-fmt-total-label { font-weight: 700; font-size: 9px; text-align: right; }
            .rpb-fmt-total-val { font-weight: 700; font-size: 9px; }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const showReport = fetched && reportData.length > 0;

  return (
    <div className="rpb-wrapper">

      {/* ── Card ── */}
      <div className="rpb-card">
        <div className="rpb-header">Receipt &amp; Payment With Balance Report</div>

        <div className="rpb-form-section">

          {/* Select Type */}
          <div className="rpb-row">
            <label className="rpb-label">Select Type <span className="req">*</span></label>
            <div className="rpb-radio-group">
              {["English", "Marathi", "Skip Data"].map((opt) => (
                <label key={opt} className="rpb-radio-label">
                  <input type="radio" name="selectType" value={opt}
                    checked={form.selectType === opt} onChange={handleChange} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Branch Code */}
          <div className="rpb-row">
            <label className="rpb-label">Branch Code</label>
            <input className="rpb-input rpb-input-shaded" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* From / To Date */}
          <div className="rpb-row">
            <label className="rpb-label">From Date</label>
            <input className="rpb-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
            <label className="rpb-inline-label">To Date</label>
            <input className="rpb-input" name="toDate"
              value={form.toDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
          </div>

          {/* Error */}
          {error && <p className="rpb-error">{error}</p>}

          {/* Loading bar */}
          {loading && (
            <div className="rpb-loading-bar">
              <div className="rpb-loading-fill" />
            </div>
          )}

        </div>

        {/* ── Footer Buttons ── */}
        <div className="rpb-footer">
          <button className="rpb-btn" onClick={handleViewReport} disabled={loading}>
            {loading && activeButton === "view" ? "Loading…" : "View Report"}
          </button>
          <button className="rpb-btn rpb-btn-print" onClick={handlePrintReport} disabled={loading}>
            {loading && activeButton === "print" ? "Loading…" : "Print Report"}
          </button>
        </div>

        {/* ── Preview Panel ── */}
        <div className="rpb-preview">
          {loading && <span className="rpb-preview-empty">Loading...</span>}

          {!loading && !fetched && (
            <span className="rpb-preview-empty">Preview area</span>
          )}

          {!loading && fetched && reportData.length === 0 && (
            <span className="rpb-preview-empty">No records found for the given criteria.</span>
          )}

          {/* Formatted Report (always rendered when data exists, for both view and print) */}
          {!loading && showReport && (
            <div className="rpb-report-wrapper">
              <div ref={reportRef}>
                <RPBReportFormatted
                  data={reportData}
                  fromDate={form.fromDate}
                  toDate={form.toDate}
                  bankName={bankInfo.bankName}
                  branchName={bankInfo.branchName}
                  userId={"AVS"}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ReceiptPaymentWithBal;