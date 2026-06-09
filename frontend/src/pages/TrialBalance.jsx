import React, { useState, useRef } from "react";
import "./TrialBalance.css";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/trial-balance`;

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Helper: convert dd/mm/yyyy → yyyy-mm-dd for the backend
function toISO(ddmmyyyy) {
  if (!ddmmyyyy) return "";
  if (ddmmyyyy.includes("-")) return ddmmyyyy; // already ISO format
  const parts = ddmmyyyy.split("/");
  if (parts.length !== 3) return ddmmyyyy;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// ── Lazer Report Formatted Table Component ──────────────────────────────────
function LazerReport({ data, bankInfo, toDate, reportType }) {
  if (!data || data.length === 0) return null;

  const isSummary = reportType === "Summary Wise";
  const displayDate = toDate ? toDate.split("-").reverse().join("/") : "";
  const bankName = bankInfo.bankName || "";
  const branchName = bankInfo.branchName || "";
  const userId = bankInfo.printUserID || "";
  const printDate = bankInfo.printDate || "";

  // Group the data by GLGROUP + GLGrp
  const groupsMap = {};
  data.forEach((row) => {
    const grpCode = (row.GLGROUP || "").trim();
    const grpName = (row.GLGrp || "").trim();
    const key = grpCode && grpName ? `${grpCode} - ${grpName}` : (grpCode || grpName || "Other");
    
    if (!groupsMap[key]) {
      groupsMap[key] = {
        code: grpCode,
        name: grpName,
        key,
        rows: []
      };
    }
    groupsMap[key].rows.push(row);
  });

  // Sort the group keys alphabetically by grpCode
  const sortedGroupKeys = Object.keys(groupsMap).sort((a, b) => {
    const codeA = groupsMap[a].code || "";
    const codeB = groupsMap[b].code || "";
    return codeA.localeCompare(codeB);
  });

  // For each group, sort its rows by SubGlCode numerically/alphabetically
  sortedGroupKeys.forEach((key) => {
    groupsMap[key].rows.sort((a, b) => {
      const numA = parseInt(a.SubGlCode, 10);
      const numB = parseInt(b.SubGlCode, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return String(a.SubGlCode || "").localeCompare(String(b.SubGlCode || ""));
    });
  });

  const fmtOpening = (v) => {
    const n = parseFloat(v);
    if (isNaN(n)) return "0.00";
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const fmtVal = (v) => {
    const n = parseFloat(v);
    if (isNaN(n) || n === 0) return "";
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const fmtTotalReceiptPayment = (v) => {
    const n = Math.round(parseFloat(v));
    if (isNaN(n) || n === 0) return "0";
    return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };

  const fmtTotalClosing = (v) => {
    const n = parseFloat(v);
    if (isNaN(n) || n === 0) return "0.00";
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  let grandOpening = 0;
  let grandReceipt = 0;
  let grandPayment = 0;
  let grandClosingCredit = 0;
  let grandClosingDebit = 0;

  let globalSrNo = 1;

  return (
    <div className="tb-lazer-report">
      <div className="tb-lazer-header">
        <div className="tb-lazer-header-row">
          <div style={{ flex: 1.5 }}>
            <div><b>Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {bankName}</div>
            <div><b>Branch Name :</b> {branchName}</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div><b>Print Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {printDate}</div>
            <div><b>Print By &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {userId}</div>
          </div>
        </div>
        <div className="tb-lazer-title">
          {isSummary ? `Trial Balance Summary : ${displayDate}` : `Trial Balance Details : ${displayDate}`}
        </div>
      </div>

      <table className="tb-lazer-table">
        {isSummary ? (
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "50%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
        ) : (
          <colgroup>
            <col style={{ width: "4%" }} />
            <col style={{ width: "6%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
        )}
        <thead>
          {isSummary ? (
            <>
              <tr>
                <th rowSpan="2" className="tb-lazer-align-center">Srno</th>
                <th rowSpan="2" className="tb-lazer-align-center">subGL</th>
                <th rowSpan="2">Description</th>
                <th colSpan="2" className="center-header">Closing Balance</th>
              </tr>
              <tr>
                <th className="tb-lazer-align-right" style={{ borderTop: "1.5px solid #000000" }}>Credit</th>
                <th className="tb-lazer-align-right" style={{ borderTop: "1.5px solid #000000" }}>Debit</th>
              </tr>
            </>
          ) : (
            <>
              <tr>
                <th rowSpan="2" className="tb-lazer-align-center">Srno</th>
                <th rowSpan="2" className="tb-lazer-align-center">subGL</th>
                <th rowSpan="2">Description</th>
                <th rowSpan="2" className="tb-lazer-align-right">Opening</th>
                <th rowSpan="2" className="tb-lazer-align-right">Receipt</th>
                <th rowSpan="2" className="tb-lazer-align-right">Payment</th>
                <th colSpan="2" className="center-header">Closing Balance</th>
              </tr>
              <tr>
                <th className="tb-lazer-align-right" style={{ borderTop: "1.5px solid #000000" }}>Credit</th>
                <th className="tb-lazer-align-right" style={{ borderTop: "1.5px solid #000000" }}>Debit</th>
              </tr>
            </>
          )}
        </thead>
        <tbody>
          {sortedGroupKeys.map((grpKey) => {
            const grp = groupsMap[grpKey];
            let grpOpening = 0;
            let grpReceipt = 0;
            let grpPayment = 0;
            let grpClosingCredit = 0;
            let grpClosingDebit = 0;

            grp.rows.forEach((row) => {
              grpOpening += Math.abs(row.OPBAL || 0);
              grpReceipt += row.CR || 0;
              grpPayment += row.DR || 0;
              grpClosingCredit += row.credit || 0;
              grpClosingDebit += Math.abs(row.debit || 0);
            });

            grandOpening += grpOpening;
            grandReceipt += grpReceipt;
            grandPayment += grpPayment;
            grandClosingCredit += grpClosingCredit;
            grandClosingDebit += grpClosingDebit;

            return (
              <React.Fragment key={grpKey}>
                <tr className="tb-lazer-grp-header">
                  <td colSpan={isSummary ? "5" : "8"}><u>{grp.key}</u></td>
                </tr>

                {grp.rows.map((row) => {
                  const srNo = globalSrNo++;
                  const openingVal = Math.abs(row.OPBAL || 0);
                  const receiptVal = row.CR || 0;
                  const paymentVal = row.DR || 0;
                  const closingCreditVal = row.credit || 0;
                  const closingDebitVal = Math.abs(row.debit || 0);

                  return (
                    <tr key={row.ID || row.SubGlCode}>
                      <td className="tb-lazer-align-center">{srNo}</td>
                      <td className="tb-lazer-align-center">{row.SubGlCode}</td>
                      <td>{row.GlName}</td>
                      {!isSummary && <td className="tb-lazer-align-right">{fmtOpening(openingVal)}</td>}
                      {!isSummary && <td className="tb-lazer-align-right">{fmtVal(receiptVal)}</td>}
                      {!isSummary && <td className="tb-lazer-align-right">{fmtVal(paymentVal)}</td>}
                      <td className="tb-lazer-align-right">{fmtVal(closingCreditVal)}</td>
                      <td className="tb-lazer-align-right">{fmtVal(closingDebitVal)}</td>
                    </tr>
                  );
                })}

                {!isSummary && (
                  <tr className="tb-lazer-grp-total">
                    <td className="tb-lazer-align-center"></td>
                    <td className="tb-lazer-align-center"></td>
                    <td className="tb-lazer-align-right">Total :</td>
                    <td className="tb-lazer-align-right">{fmtOpening(grpOpening)}</td>
                    <td className="tb-lazer-align-right">{fmtTotalReceiptPayment(grpReceipt)}</td>
                    <td className="tb-lazer-align-right">{fmtTotalReceiptPayment(grpPayment)}</td>
                    <td className="tb-lazer-align-right">{fmtTotalClosing(grpClosingCredit)}</td>
                    <td className="tb-lazer-align-right">{fmtTotalClosing(grpClosingDebit)}</td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}

          <tr className="tb-lazer-grand-total">
            <td className="tb-lazer-align-center"></td>
            <td className="tb-lazer-align-center"></td>
            <td className="tb-lazer-align-right">Grand Total :</td>
            {!isSummary && <td className="tb-lazer-align-right">{fmtOpening(grandOpening)}</td>}
            {!isSummary && <td className="tb-lazer-align-right">{fmtTotalReceiptPayment(grandReceipt)}</td>}
            {!isSummary && <td className="tb-lazer-align-right">{fmtTotalReceiptPayment(grandPayment)}</td>}
            <td className="tb-lazer-align-right">{fmtTotalClosing(grandClosingCredit)}</td>
            <td className="tb-lazer-align-right">{fmtTotalClosing(grandClosingDebit)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function TrialBalance() {
  const [form, setForm] = useState({
    reportType: "Details Wise",
    branchCode: "1",
    toDate: "2026-03-30",
    fromDate: "2025-04-01",
    sortType: "Code Wise",
    textReportName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const [activeReport, setActiveReport] = useState("");
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    branchName: "",
    printDate: "",
    printUserID: ""
  });
  const reportRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFromTo = form.reportType === "FromTo";

  // ── Submit: call backend ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    setActiveReport("Submit");
    setError("");
    setTableData([]);

    // Validation
    if (!form.branchCode || !form.toDate) {
      setError("Branch Code and To Date are required.");
      return;
    }
    if (isFromTo && !form.fromDate) {
      setError("From Date is required for FromTo report.");
      return;
    }

    // For non-FromTo report types, use toDate as both fromDate and toDate
    const fromDateISO = isFromTo ? toISO(form.fromDate) : toISO(form.toDate);
    const toDateISO = toISO(form.toDate);
    const codeOrName = form.sortType === "Code Wise" ? "C" : "N";

    const params = new URLSearchParams({
      branchCode: form.branchCode,
      fromDate: fromDateISO,
      toDate: toDateISO,
      codeOrName,
    });

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/report?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setTableData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Lazer Report: call backend ─────────────────────────────────────────────
  const handleLazerReport = async () => {
    setActiveReport("Lazer");
    setError("");
    setTableData([]);

    if (!form.branchCode || !form.toDate) {
      setError("Branch Code and To Date are required.");
      return;
    }

    const toDateISO = toISO(form.toDate);
    const codeOrName = form.sortType === "Code Wise" ? "C" : "N";

    const params = new URLSearchParams({
      branchCode: form.branchCode,
      toDate: toDateISO,
      codeOrName,
    });

    try {
      setLoading(true);
      
      // Proactively fetch bank information
      try {
        const loginCode = import.meta.env.VITE_LOGIN_CODE || localStorage.getItem('loginCode') || '';
        const infoRes = await fetch(`${API_BASE.replace('/trial-balance', '')}/bank-info?BRCD=${form.branchCode.trim()}&LoginCode=${loginCode}`);
        if (infoRes.ok) {
          const infoData = await infoRes.json();
          setBankInfo(infoData);
        }
      } catch (e) {
        console.error("Failed to fetch bank info:", e);
      }

      const res = await fetch(`${API_BASE}/lazer?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setTableData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Print Function ─────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    const toDateISO = toISO(form.toDate);
    const displayDate = toDateISO ? toDateISO.split("-").reverse().join("/") : "";
    printWindow.document.write(`
      <html>
        <head>
          <title>Trial Balance Details Report</title>
          <style>
            @page { size: portrait; margin: 10mm; }
            body { font-family: 'Poppins', Arial, sans-serif; font-size: 10px; margin: 0; }
            table { width: 100%; border-collapse: collapse; border: 1.5px solid #000000; font-size: 10px; }
            th, td { border-left: 1.5px solid #000000; border-right: 1.5px solid #000000; padding: 4px 6px; }
            td { border-bottom: 1px dotted #cccccc; }
            th { background: #f1f5f9; font-weight: 600; border-top: 1.5px solid #000000; border-bottom: 1.5px solid #000000; text-align: left; padding: 5px; }
            th.center-header { text-align: center; }
            .tb-lazer-header { border: 1px solid #000000; margin-bottom: 8px; padding: 6px 12px; }
            .tb-lazer-header-row { display: flex; justify-content: space-between; }
            .tb-lazer-title { text-align: center; font-weight: 700; font-size: 12px; margin-top: 6px; border-top: 1.5px solid #000000; padding-top: 6px; }
            .tb-lazer-align-center { text-align: center; }
            .tb-lazer-align-right { text-align: right; }
            .tb-lazer-align-left { text-align: left; }
            .tb-lazer-grp-header td { font-weight: bold; font-style: italic; border-top: 1.5px dashed #000000; border-bottom: 1.5px dashed #000000; padding: 5px 6px; border-left: 1.5px solid #000000; border-right: 1.5px solid #000000; }
            .tb-lazer-grp-total td { border-top: 1.5px solid #000000; border-bottom: 1.5px solid #000000; font-weight: bold; border-left: 1.5px solid #000000; border-right: 1.5px solid #000000; }
            .tb-lazer-grand-total td { border-top: 1.5px solid #000000; border-bottom: 1.5px double #000000; font-weight: bold; border-left: 1.5px solid #000000; border-right: 1.5px solid #000000; }
            u { text-decoration: underline; }
          </style>
        </head>
        <body>${reportRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };


  // ── Table columns derived from first row ─────────────────────────────────
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="tb-wrapper">
      <div className="tb-card">

        {/* HEADER */}
        <div className="tb-header">Trial Balance Report</div>

        {/* TOP RADIO SECTION */}
        <div className="tb-radio-section">
          <div className="tb-radio-row">
            {["Details Wise", "Summary Wise", "AsOnDate", "FromTo"].map((opt) => (
              <label key={opt} className="tb-radio-label">
                <input
                  type="radio"
                  name="reportType"
                  value={opt}
                  checked={form.reportType === opt}
                  onChange={handleChange}
                />
                {opt}
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
                name="branchCode"
                value={form.branchCode}
                onChange={handleChange}
              />
            </div>
            <div className="tb-field">
              <label>To Date <span className="req">*</span></label>
              <input
                type="date"
                className="tb-input"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
              />
            </div>
            {isFromTo && (
              <div className="tb-field">
                <label>From Date <span className="req">*</span></label>
                <input
                  type="date"
                  className="tb-input"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* SORT TYPE RADIOS */}
          <div className="tb-inline-radio-row">
            {["Code Wise", "Name Wise"].map((opt) => (
              <label key={opt} className="tb-radio-label">
                <input
                  type="radio"
                  name="sortType"
                  value={opt}
                  checked={form.sortType === opt}
                  onChange={handleChange}
                />
                {opt}
              </label>
            ))}
          </div>

          {/* TEXT REPORT NAME */}
          <div className="tb-field tb-field-full">
            <label>Please enter text report name <span className="req">*</span></label>
            <input
              className="tb-input tb-input-wide"
              name="textReportName"
              placeholder="Please enter text report name"
              value={form.textReportName}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="tb-error">{error}</div>
        )}

        {/* FOOTER BUTTONS */}
        <div className="tb-footer">
          <button
            className="tb-btn tb-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading…" : "Submit"}
          </button>
          {["Lazer", "Text", "Text Report View", "TB Format1"].map((btn) => (
            <button
              key={btn}
              className="tb-btn"
              onClick={btn === "Lazer" ? handleLazerReport : () => alert(btn)}
              disabled={loading}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* RESULTS TABLE / FORMATTED VIEW */}
        {!loading && tableData.length > 0 && activeReport === "Lazer" && (
          <div className="tb-report-wrapper">
            <div className="tb-report-toolbar">
              <button className="tb-btn-sm" onClick={handlePrint}>
                🖨️ Print Report
              </button>
            </div>
            <div ref={reportRef}>
             <LazerReport
                data={tableData}
                bankInfo={bankInfo}
                toDate={form.toDate}
                reportType={form.reportType}
              />
            </div>
          </div>
        )}

        {!loading && tableData.length > 0 && activeReport !== "Lazer" && (
          <div className="tb-table-wrapper">
            <table className="tb-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col}>{typeof row[col] === 'number' ? fmt(row[col]) : (row[col] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && tableData.length === 0 && !error && (
          <div className="tb-empty">No data. Submit the form to load the report.</div>
        )}

      </div>
    </div>
  );
}

export default TrialBalance;