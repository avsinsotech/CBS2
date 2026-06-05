import { useState, useRef } from "react";
import "./ProfitAndLoss.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Per report-type config ────────────────────────────────────────────────────
const REPORT_CONFIG = {
  "As On Date": {
    dateMode: "asOnDate",
    buttons: ["show", "profitLossReport", "textReportView", "reportWithWorkingDay"]
  },
  "N Form PL": {
    dateMode: "range",
    buttons: ["show", "profitLossReport", "textReportView"]
  },
  "Income / Expenditure": {
    dateMode: "range",
    buttons: ["show", "profitLossReport", "textReportView", "intPaidReport"]
  },
  "Admin Expenses": {
    dateMode: "range",
    buttons: ["show", "profitLossReport", "textReportView"]
  },
  "PL Marathi": {
    dateMode: "asOnDate",
    buttons: ["show", "profitLossReport", "textReportView"]
  },
  "N Form PL Marathi": {
    dateMode: "range",
    buttons: ["show", "profitLossReport", "textReportView"]
  }
};

const BUTTON_LABELS = {
  show:                 "Show",
  profitLossReport:     "Profit Loss Report",
  textReportView:       "Text Report View",
  reportWithWorkingDay: "Report With Working Day",
  intPaidReport:        "Int Paid Report"
};

// ── Format number with 2 decimals ─────────────────────────────────────────────
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n) || n === 0) return "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ── Detect data shape ──────────────────────────────────────────────
const detectShape = (data) => {
  if (!data || data.length === 0) return "unknown";
  const keys = Object.keys(data[0]);
  if (keys.includes("EAMOUNT") && keys.includes("IAMOUNT")) return "horizontal";
  if (keys.includes("DEBIT") && keys.includes("CREDIT")) return "flat_dr_cr";
  return "unknown";
};

// ── Render the formatted P&L report ───────────────────────────────────────────
function PLReport({ data, branchCode, asOnDate }) {
  const shape = detectShape(data);

  if (shape === "unknown") {
    return null; // Fallback to grid view handled by parent
  }

  const displayDate = asOnDate || new Date().toLocaleDateString("en-GB");

  let leftGroups = [];
  let rightGroups = [];
  let grandTotalLeft = 0;
  let grandTotalRight = 0;

  // 1. Normalize data into Groups
  if (shape === "horizontal") {
    let currLeft = null;
    let currRight = null;

    data.forEach(row => {
      // Left
      if (row.EGLNM || row.EAMOUNT) {
        const eAmt = parseFloat(row.EAMOUNT || 0);
        grandTotalLeft += eAmt;
        const rawGrp = row.DESCE || row.EGLGROUP || "";
        const displayGrp = rawGrp === "GL" ? "" : rawGrp;

        if (!currLeft || currLeft.rawGrp !== rawGrp) {
          currLeft = { name: displayGrp, rawGrp, items: [], total: 0 };
          leftGroups.push(currLeft);
        }
        currLeft.items.push({ code: row.ESUBGL, desc: row.EGLNM, bal: eAmt });
        currLeft.total += eAmt;
      }
      
      // Right
      if (row.IGLNM || row.IAMOUNT) {
        const iAmt = parseFloat(row.IAMOUNT || 0);
        grandTotalRight += iAmt;
        const rawGrp = row.DESCP || row.IGLGROUP || "";
        const displayGrp = rawGrp === "GL" ? "" : rawGrp;

        if (!currRight || currRight.rawGrp !== rawGrp) {
          currRight = { name: displayGrp, rawGrp, items: [], total: 0 };
          rightGroups.push(currRight);
        }
        currRight.items.push({ code: row.ISUBGL, desc: row.IGLNM, bal: iAmt });
        currRight.total += iAmt;
      }
    });
  } else if (shape === "flat_dr_cr") {
    let currLeft = null;
    let currRight = null;
    
    data.forEach(row => {
      const dr = parseFloat(row.DEBIT || 0);
      const cr = parseFloat(row.CREDIT || 0);
      const rawGrp = row.GLGrp || row.PLGrp || "";
      const displayGrp = rawGrp === "GL" ? "" : rawGrp;
      
      if (dr !== 0) {
        grandTotalLeft += dr;
        if (!currLeft || currLeft.rawGrp !== rawGrp) {
          currLeft = { name: displayGrp, rawGrp, items: [], total: 0 };
          leftGroups.push(currLeft);
        }
        currLeft.items.push({ code: row.SUBGLCODE, desc: row.Glname, bal: dr });
        currLeft.total += dr;
      }
      
      if (cr !== 0) {
        grandTotalRight += cr;
        if (!currRight || currRight.rawGrp !== rawGrp) {
          currRight = { name: displayGrp, rawGrp, items: [], total: 0 };
          rightGroups.push(currRight);
        }
        currRight.items.push({ code: row.SUBGLCODE, desc: row.Glname, bal: cr });
        currRight.total += cr;
      }
    });
  }

  // 2. Build Visual Rows
  const leftVisualRows = [];
  leftGroups.forEach(grp => {
    leftVisualRows.push({ isHeader: true, desc: grp.name, grpTotal: grp.total });
    grp.items.forEach(item => {
      leftVisualRows.push({ isHeader: false, code: item.code, desc: item.desc, bal: item.bal });
    });
  });

  const rightVisualRows = [];
  rightGroups.forEach(grp => {
    rightVisualRows.push({ isHeader: true, desc: grp.name, grpTotal: grp.total });
    grp.items.forEach(item => {
      rightVisualRows.push({ isHeader: false, code: item.code, desc: item.desc, bal: item.bal });
    });
  });

  // 3. Add Profit/Loss
  const isProfit = grandTotalRight >= grandTotalLeft;
  const plDiff = Math.abs(grandTotalRight - grandTotalLeft);
  const finalTotal = Math.max(grandTotalLeft, grandTotalRight);

  if (plDiff > 0.01) {
    if (isProfit) {
      leftVisualRows.push({ isHeader: true, desc: "Profit And Loss", grpTotal: plDiff, isProfit: true });
      leftVisualRows.push({ isHeader: false, code: "99999", desc: "PROFIT", bal: plDiff, isProfit: true });
    } else {
      rightVisualRows.push({ isHeader: true, desc: "Profit And Loss", grpTotal: plDiff, isLoss: true });
      rightVisualRows.push({ isHeader: false, code: "99999", desc: "LOSS", bal: plDiff, isLoss: true });
    }
  }

  const maxRows = Math.max(leftVisualRows.length, rightVisualRows.length);

  return (
    <div className="pl-report">
      <div className="pl-report-header">
        <div className="pl-report-header-row">
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "5px" }}><b>Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> DEMO BANK</div>
            <div><b>Branch Name :</b> HEAD OFFICE</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ marginBottom: "5px" }}><b>Print Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {new Date().toLocaleDateString("en-GB")}</div>
            <div><b>Print By &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> AVS</div>
          </div>
        </div>
        <div className="pl-report-title">
          Profit & Loss As On : {displayDate}
        </div>
      </div>

      <table className="pl-report-table">
        <thead>
          <tr>
            <th className="pl-rpt-col-desc">Expenses Description</th>
            <th className="pl-rpt-col-bal">Balance</th>
            <th className="pl-rpt-col-desc">Income Description</th>
            <th className="pl-rpt-col-bal">Balance</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows }).map((_, i) => {
            const L = leftVisualRows[i];
            const R = rightVisualRows[i];

            return (
              <tr key={i}>
                {L ? (
                  L.isHeader ? (
                    <>
                      <td className={`pl-rpt-head ${L.isProfit ? 'pl-rpt-profit' : ''}`}><i>{L.desc}</i></td>
                      <td className="pl-rpt-grp-bal">{fmt(L.grpTotal)}</td>
                    </>
                  ) : (
                    <>
                      <td className={`pl-rpt-item ${L.isProfit ? 'pl-rpt-profit' : ''}`}>
                        {L.code ? <span className="pl-rpt-code">{L.code}</span> : null}
                        {L.desc ? L.desc.replace(L.code || "", "").trim() : ""}
                      </td>
                      <td className={`pl-rpt-bal ${L.isProfit ? 'pl-rpt-profit' : ''}`}>{fmt(L.bal)}</td>
                    </>
                  )
                ) : (
                  <><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td></>
                )}

                {R ? (
                  R.isHeader ? (
                    <>
                      <td className={`pl-rpt-head ${R.isLoss ? 'pl-rpt-loss' : ''}`}><i>{R.desc}</i></td>
                      <td className="pl-rpt-grp-bal">{fmt(R.grpTotal)}</td>
                    </>
                  ) : (
                    <>
                      <td className={`pl-rpt-item ${R.isLoss ? 'pl-rpt-loss' : ''}`}>
                        {R.code ? <span className="pl-rpt-code">{R.code}</span> : null}
                        {R.desc ? R.desc.replace(R.code || "", "").trim() : ""}
                      </td>
                      <td className={`pl-rpt-bal ${R.isLoss ? 'pl-rpt-loss' : ''}`}>{fmt(R.bal)}</td>
                    </>
                  )
                ) : (
                  <><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td></>
                )}
              </tr>
            );
          })}
          
          <tr className="pl-rpt-grand-total">
            <td><b>Grand Total :</b></td>
            <td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
            <td><b>Grand Total :</b></td>
            <td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
          </tr>
          <tr className="pl-rpt-tally">
            <td colSpan="4"><b>Profit & Loss Tally</b></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ProfitAndLoss() {
  const [form, setForm] = useState({
    reportType: "As On Date",
    branchCode: "",
    asOnDate: "2026-03-30",
    fromDate: "2025-04-01",
    toDate: "2026-03-30",
    textReportName: ""
  });

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [fetched, setFetched]       = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const reportRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFetched(false);
    setError("");
  };

  const reportOptions = Object.keys(REPORT_CONFIG);

  const config   = REPORT_CONFIG[form.reportType];
  const isAsOnDate = config.dateMode === "asOnDate";

  // Convert DD/MM/YYYY → YYYY-MM-DD
  const parseDate = (raw) => {
    if (!raw) return null;
    if (raw.includes("-")) return raw; // already ISO format
    const parts = raw.trim().split("/");
    if (parts.length !== 3) return null;
    let [d, m, y] = parts;
    if (y.length === 2) y = "20" + y;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const validate = () => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (isAsOnDate) {
      if (!form.asOnDate.trim())    return "As On Date is required.";
      if (!parseDate(form.asOnDate)) return "As On Date must be in DD/MM/YYYY format.";
    } else {
      if (!form.fromDate.trim())     return "From Date is required.";
      if (!form.toDate.trim())       return "To Date is required.";
      if (!parseDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
      if (!parseDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";
    }
    return null;
  };

  const callApi = async (endpoint, params) => {
    const res = await fetch(
      `${API_BASE_URL}/api/profit-and-loss/${endpoint}?${new URLSearchParams(params)}`
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Server error: ${res.status}`);
    }
    return res.json();
  };

  const handleResult = (data) => {
    // Handle multi-recordset response
    let flatData = data;
    if (data && data.recordsets) {
      // Merge all recordsets into one array
      flatData = data.recordsets.flat();
    }
    if (!Array.isArray(flatData)) flatData = [];

    setColumns(flatData.length > 0 ? Object.keys(flatData[0]) : []);
    setReportData(flatData);
    setFetched(true);
  };

  const withLoading = async (fn) => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");
    try { await fn(); }
    catch (e) { setError(e.message || "Failed to fetch report."); }
    finally { setLoading(false); }
  };

  // ── Shared param builders ─────────────────────────────────────────────────
  const asOnParams  = () => ({ branchCode: form.branchCode.trim(), asOnDate: parseDate(form.asOnDate) });
  const rangeParams = () => ({ branchCode: form.branchCode.trim(), fromDate: parseDate(form.fromDate), toDate: parseDate(form.toDate) });

  // ── Endpoint resolver per button ──────────────────────────────────────────
  const resolveEndpoint = (btnKey) => {
    const rt = form.reportType;
    switch (btnKey) {
      case "show":
        if (rt === "As On Date" || rt === "PL Marathi")              return ["show", asOnParams()];
        if (rt === "N Form PL" || rt === "N Form PL Marathi")        return ["nform-profit-loss-report", rangeParams()];
        if (rt === "Income / Expenditure")                           return ["income-exp-profit-loss-report", rangeParams()];
        if (rt === "Admin Expenses")                                 return ["admin-exp-profit-loss-report", rangeParams()];
        break;
      case "profitLossReport":
        if (rt === "As On Date" || rt === "PL Marathi")              return ["profit-loss-report", asOnParams()];
        if (rt === "N Form PL" || rt === "N Form PL Marathi")        return ["nform-profit-loss-report", rangeParams()];
        if (rt === "Income / Expenditure")                           return ["income-exp-profit-loss-report", rangeParams()];
        if (rt === "Admin Expenses")                                 return ["admin-exp-profit-loss-report", rangeParams()];
        break;
      case "textReportView":
        if (rt === "As On Date" || rt === "PL Marathi")              return ["text-report-view", asOnParams()];
        if (rt === "N Form PL" || rt === "N Form PL Marathi")        return ["nform-text-report-view", rangeParams()];
        if (rt === "Income / Expenditure")                           return ["income-exp-text-report-view", rangeParams()];
        if (rt === "Admin Expenses")                                 return ["admin-exp-text-report-view", rangeParams()];
        break;
      case "reportWithWorkingDay":
        return ["report-with-working-day", asOnParams()];
      case "intPaidReport":
        return ["income-exp-int-paid-report", rangeParams()];
      default:
        break;
    }
    return null;
  };

  const handleButton = (btnKey) => {
    setActiveButton(btnKey);
    return withLoading(async () => {
      const resolved = resolveEndpoint(btnKey);
      if (!resolved) throw new Error("No endpoint configured for this action.");
      const [endpoint, params] = resolved;
      const data = await callApi(endpoint, params);
      handleResult(data);
    });
  };

  // Determine if we should show the formatted report view
  const isReportButton = activeButton === "profitLossReport" || activeButton === "reportWithWorkingDay";
  const shape = detectShape(reportData);
  const showFormattedReport = isReportButton && shape !== "unknown" && reportData.length > 0;

  // Print function
  const handlePrint = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Profit & Loss Report</title>
          <style>
            @page { margin: 10mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; margin: 0; }
            table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
            th, td { border-left: 1px solid #000; border-right: 1px solid #000; padding: 2px 4px; }
            th { background: #e0e0e0; font-weight: 600; border-top: 1px solid #000; border-bottom: 1px solid #000; color: #b71c1c; text-align: left; padding: 4px; }
            .pl-rpt-col-bal { text-align: right; }
            .pl-rpt-head { font-weight: 600; color: #b71c1c; font-style: italic; }
            .pl-rpt-item { padding-left: 10px; }
            .pl-rpt-code { margin-right: 4px; }
            .pl-rpt-bal, .pl-rpt-grp-bal { text-align: right; }
            .pl-rpt-grp-bal { color: #b71c1c; font-weight: 600; }
            .pl-rpt-grand-total td { border-top: 1px solid #000; border-bottom: 1px solid #000; font-weight: 700; background: #fff; padding: 4px; }
            .pl-rpt-tally td { background: #add8e6; font-weight: 700; border-bottom: 1px solid #000; padding: 4px; }
            .pl-rpt-profit { color: #b71c1c; font-weight: 600; font-style: italic; }
            .pl-rpt-loss { color: #b71c1c; font-weight: 600; font-style: italic; }
            .pl-report-header { border: 1px solid #000; margin-bottom: 6px; }
            .pl-report-header-row { display: flex; justify-content: space-between; padding: 4px 8px; }
            .pl-report-title { text-align: center; font-weight: bold; font-size: 11px; border-top: 1px solid #000; padding: 4px; }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="pl-wrapper">
      <div className="pl-card">

        {/* HEADER */}
        <div className="pl-header">Profit And Loss</div>

        {/* FORM SECTION */}
        <div className="pl-form-section">

          {/* BRANCH CODE */}
          <div className="pl-row">
            <label className="pl-label">Branch Code</label>
            <input className="pl-input" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* RADIO OPTIONS */}
          <div className="pl-radio-row">
            {reportOptions.map((opt) => (
              <label key={opt} className="pl-radio-label">
                <input type="radio" name="reportType" value={opt}
                  checked={form.reportType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>

          {/* DATE FIELDS */}
          {isAsOnDate ? (
            <div className="pl-row">
              <label className="pl-label">As On Date</label>
              <input type="date" className="pl-input" name="asOnDate"
                value={form.asOnDate} onChange={handleChange} />
            </div>
          ) : (
            <div className="pl-row">
              <label className="pl-label">From Date</label>
              <input type="date" className="pl-input" name="fromDate"
                value={form.fromDate} onChange={handleChange} />
              <label className="pl-inline-label">To Date</label>
              <input type="date" className="pl-input" name="toDate"
                value={form.toDate} onChange={handleChange} />
            </div>
          )}

          {/* TEXT REPORT NAME */}
          <div className="pl-row">
            <label className="pl-label">Enter Text Report Name</label>
            <input className="pl-input pl-input-wide" name="textReportName"
              placeholder="Enter Text Report Name"
              value={form.textReportName} onChange={handleChange} />
          </div>

          {/* BUTTONS — driven by config */}
          <div className="pl-btn-row">
            {config.buttons.map((btnKey) => (
              <button
                key={btnKey}
                className="pl-btn pl-btn-blue"
                onClick={() => handleButton(btnKey)}
                disabled={loading}
              >
                {loading ? "Loading…" : BUTTON_LABELS[btnKey]}
              </button>
            ))}
          </div>

          {/* ERROR */}
          {error && <p className="pl-error">{error}</p>}

        </div>

        {/* PREVIEW PANEL */}
        <div className="pl-preview">
          {loading && <span className="pl-preview-empty">Loading...</span>}

          {!loading && !fetched && (
            <span className="pl-preview-empty">Preview area</span>
          )}

          {!loading && fetched && reportData.length === 0 && (
            <span className="pl-preview-empty">No records found.</span>
          )}

          {/* FORMATTED REPORT VIEW for Profit Loss Report button */}
          {!loading && fetched && showFormattedReport && (
            <div className="pl-report-wrapper">
              <div className="pl-report-toolbar">
                <button className="pl-btn pl-btn-blue pl-btn-sm" onClick={handlePrint}>
                  🖨️ Print Report
                </button>
              </div>
              <div ref={reportRef}>
                <PLReport
                  data={reportData}
                  branchCode={form.branchCode}
                  asOnDate={isAsOnDate ? form.asOnDate : `${form.fromDate} - ${form.toDate}`}
                />
              </div>
            </div>
          )}

          {/* GRID VIEW for Show / other buttons */}
          {!loading && fetched && reportData.length > 0 && !showFormattedReport && (
            <div className="pl-table-wrapper">
              <table className="pl-table">
                <thead>
                  <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => <td key={col}>{row[col] ?? ""}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="pl-record-count">Total Records: {reportData.length}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfitAndLoss;