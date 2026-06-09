import { useState, useRef } from "react";
import "./ProfitAndLoss.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
  if (isNaN(n)) return "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ── Detect data shape ──────────────────────────────────────────────
const detectShape = (data) => {
  if (!data || data.length === 0) return "unknown";
  const keys = Object.keys(data[0]);
  if (keys.includes("PEAMOUNT") && keys.includes("PIAMOUNT")) return "nform";
  if (keys.includes("EAMOUNT") && keys.includes("IAMOUNT")) return "horizontal";
  if (keys.includes("DEBIT") && keys.includes("CREDIT")) return "flat_dr_cr";
  return "unknown";
};

// ── Extract Grouping Logic ────────────────────────────────────────────────────
const preparePLData = (data, shape) => {
  let leftGroups = [];
  let rightGroups = [];
  let grandTotalLeft = 0;
  let grandTotalRight = 0;
  let pGrandTotalLeft = 0;
  let pGrandTotalRight = 0;

  if (shape === "horizontal" || shape === "nform") {
    let currLeft = null;
    let currRight = null;

    data.forEach(row => {
      if (row.EGLNM || row.EAMOUNT) {
        const eAmt = parseFloat(row.EAMOUNT || 0);
        const pAmt = shape === "nform" ? parseFloat(row.PEAMOUNT || 0) : null;
        grandTotalLeft += eAmt;
        if (pAmt) pGrandTotalLeft += pAmt;
        
        const rawGrp = row.DESCE || row.EGLGROUP || "";
        const displayGrp = rawGrp === "GL" ? "" : rawGrp;
        if (!currLeft || currLeft.rawGrp !== rawGrp) {
          currLeft = { name: displayGrp, rawGrp, items: [], total: 0, pTotal: 0 };
          leftGroups.push(currLeft);
        }
        currLeft.items.push({ code: row.ESUBGL, desc: row.EGLNM, bal: eAmt, pBal: pAmt });
        currLeft.total += eAmt;
        if (pAmt) currLeft.pTotal += pAmt;
      }
      if (row.IGLNM || row.IAMOUNT) {
        const iAmt = parseFloat(row.IAMOUNT || 0);
        const pAmt = shape === "nform" ? parseFloat(row.PIAMOUNT || 0) : null;
        grandTotalRight += iAmt;
        if (pAmt) pGrandTotalRight += pAmt;

        const rawGrp = row.DESCP || row.IGLGROUP || "";
        const displayGrp = rawGrp === "GL" ? "" : rawGrp;
        if (!currRight || currRight.rawGrp !== rawGrp) {
          currRight = { name: displayGrp, rawGrp, items: [], total: 0, pTotal: 0 };
          rightGroups.push(currRight);
        }
        currRight.items.push({ code: row.ISUBGL, desc: row.IGLNM, bal: iAmt, pBal: pAmt });
        currRight.total += iAmt;
        if (pAmt) currRight.pTotal += pAmt;
      }
    });
  } else if (shape === "flat_dr_cr") {
    let currGroup = null;
    let singleGroups = [];
    let grandTotalDr = 0;
    let grandTotalCr = 0;

    data.forEach(row => {
      const dr = parseFloat(row.DEBIT || 0);
      const cr = parseFloat(row.CREDIT || 0);
      const rawGrp = row.GLGrp || row.PLGrp || "";
      const displayGrp = rawGrp === "GL" ? "" : rawGrp;
      
      grandTotalDr += dr;
      grandTotalCr += cr;

      if (!currGroup || currGroup.rawGrp !== rawGrp) {
        currGroup = { name: displayGrp, rawGrp, items: [], totalDr: 0, totalCr: 0 };
        singleGroups.push(currGroup);
      }
      currGroup.items.push({ code: row.SUBGLCODE, desc: row.Glname, dr, cr });
      currGroup.totalDr += dr;
      currGroup.totalCr += cr;
    });

    const singleVisualRows = [];
    let srNo = 1;
    singleGroups.forEach(grp => {
      if (grp.name) singleVisualRows.push({ isHeader: true, desc: grp.name });
      grp.items.forEach(item => {
        singleVisualRows.push({ isHeader: false, srNo: srNo++, code: item.code, desc: item.desc, dr: item.dr, cr: item.cr });
      });
      singleVisualRows.push({ isSubTotal: true, totalDr: grp.totalDr, totalCr: grp.totalCr });
    });

    return { singleVisualRows, grandTotalDr, grandTotalCr };
  }

  const leftVisualRows = [];
  leftGroups.forEach(grp => {
    if (grp.name) leftVisualRows.push({ isHeader: true, desc: grp.name });
    grp.items.forEach((item, idx) => leftVisualRows.push({ 
      isHeader: false, code: item.code, desc: item.desc, bal: item.bal, pBal: item.pBal, 
      grpTotal: (shape !== "nform" && idx === 0) ? grp.total : null
    }));
    if (shape === "nform") {
      leftVisualRows.push({ isSubTotal: true, pBal: grp.pTotal, bal: grp.total });
    }
  });

  const rightVisualRows = [];
  rightGroups.forEach(grp => {
    if (grp.name) rightVisualRows.push({ isHeader: true, desc: grp.name });
    grp.items.forEach((item, idx) => rightVisualRows.push({ 
      isHeader: false, code: item.code, desc: item.desc, bal: item.bal, pBal: item.pBal, 
      grpTotal: (shape !== "nform" && idx === 0) ? grp.total : null
    }));
    if (shape === "nform") {
      rightVisualRows.push({ isSubTotal: true, pBal: grp.pTotal, bal: grp.total });
    }
  });

  const isProfit = grandTotalRight >= grandTotalLeft;
  const plDiff = Math.abs(grandTotalRight - grandTotalLeft);
  const finalTotal = Math.max(grandTotalLeft, grandTotalRight);

  const pIsProfit = pGrandTotalRight >= pGrandTotalLeft;
  const pPlDiff = Math.abs(pGrandTotalRight - pGrandTotalLeft);
  const pFinalTotal = Math.max(pGrandTotalLeft, pGrandTotalRight);

  if (shape !== "flat_dr_cr") {
    if (plDiff > 0.01 || (shape === "nform" && pPlDiff > 0.01)) {
      if (isProfit) {
        leftVisualRows.push({ isHeader: true, desc: "Profit And Loss", isProfit: true });
        leftVisualRows.push({ isHeader: false, code: "99999", desc: "PROFIT", bal: plDiff, pBal: shape === "nform" ? pPlDiff : null, grpTotal: plDiff, pGrpTotal: shape === "nform" ? pPlDiff : null, isProfit: true });
      } else {
        rightVisualRows.push({ isHeader: true, desc: "Profit And Loss", isLoss: true });
        rightVisualRows.push({ isHeader: false, code: "99999", desc: "LOSS", bal: plDiff, pBal: shape === "nform" ? pPlDiff : null, grpTotal: plDiff, pGrpTotal: shape === "nform" ? pPlDiff : null, isLoss: true });
      }
    }
  }

  return { leftVisualRows, rightVisualRows, finalTotal, pFinalTotal };
};

// ── Formatted PL Report Component ───────────────────────────────────────────
const PLReport = ({ data, shape, branchCode, asOnDate, fromDateRaw, toDateRaw, activeButton, reportType }) => {
  const displayDate = asOnDate || new Date().toLocaleDateString("en-GB");
  const bankName = data[0]?.BANKNAME || data[0]?.BankName || data[0]?.Bankname || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI";
  const branchName = data[0]?.MIDNAME || data[0]?.MidName || data[0]?.Midname || "HEAD OFFICE";
  const userId = "Rohini";
  const printDate = new Date().toLocaleDateString("en-GB");
  const isMarathi = reportType === "PL Marathi" || reportType === "N Form PL Marathi";

  const { leftVisualRows, rightVisualRows, singleVisualRows, finalTotal, pFinalTotal, grandTotalDr, grandTotalCr } = preparePLData(data, shape);
  const maxRows = shape === "flat_dr_cr" ? (singleVisualRows?.length || 0) : Math.max(leftVisualRows?.length || 0, rightVisualRows?.length || 0);

  const fromDateStr = fromDateRaw ? fromDateRaw.split('-').reverse().join('/') : "";
  const toDateStr = toDateRaw ? toDateRaw.split('-').reverse().join('/') : "";

  return (
    <div className="pl-report">
      <div className="pl-report-header">
        <div className="pl-report-header-row">
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "5px" }}><b>Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {bankName}</div>
            <div><b>Branch Name :</b> {branchName}</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ marginBottom: "5px" }}><b>Print Date &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {printDate}</div>
            <div><b>Print By &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {userId}</div>
          </div>
        </div>
        {shape !== "flat_dr_cr" && (
          <div className="pl-report-title">
            {isMarathi ? `नफा व तोटा : ${displayDate} अखेर` : `Profit & Loss As On : ${displayDate}`}
          </div>
        )}
      </div>

      <table className="pl-report-table">
        <colgroup>
          {shape === "nform" ? (
            <>
              <col className="pl-col-bal" />
              <col className="pl-col-desc" />
              <col className="pl-col-bal" />
              <col className="pl-col-bal" />
              <col className="pl-col-desc" />
              <col className="pl-col-bal" />
            </>
          ) : shape === "flat_dr_cr" ? (
            <>
              <col style={{ width: "60px" }} />
              <col style={{ width: "80px" }} />
              <col />
              <col style={{ width: "120px", textAlign: "right" }} />
              <col style={{ width: "120px", textAlign: "right" }} />
            </>
          ) : (
            <>
              <col className="pl-col-desc" />
              <col className="pl-col-bal" />
              <col className="pl-col-grp" />
              <col className="pl-col-desc" />
              <col className="pl-col-bal" />
              <col className="pl-col-grp" />
            </>
          )}
        </colgroup>
        <thead>
          {shape === "nform" ? (
            <tr>
              <th className="pl-rpt-col-bal" style={{ textAlign: "center" }}>{fromDateStr}</th>
              <th className="pl-rpt-col-desc">Expenses Description</th>
              <th className="pl-rpt-col-bal" style={{ textAlign: "center" }}>{toDateStr}</th>
              <th className="pl-rpt-col-bal" style={{ textAlign: "center" }}>{fromDateStr}</th>
              <th className="pl-rpt-col-desc">Income Description</th>
              <th className="pl-rpt-col-bal" style={{ textAlign: "center" }}>{toDateStr}</th>
            </tr>
          ) : shape === "flat_dr_cr" ? (
            <>
              <tr>
                <th colSpan="5" style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}>
                  {activeButton === "intPaidReport" 
                    ? `Int Paid Report From ${fromDateStr} To ${toDateStr}`
                    : `Income & Expenses Report From ${fromDateStr} To ${toDateStr}`}
                </th>
              </tr>
              <tr>
                <th>Sr No</th>
                <th>Product</th>
                <th>Gl Name</th>
                <th style={{ textAlign: "right" }}>Cr Amount</th>
                <th style={{ textAlign: "right" }}>Dr Amount</th>
              </tr>
            </>
          ) : (
            <tr>
              <th className="pl-rpt-col-desc">{isMarathi ? "खर्च तपशील" : "Expenses Description"}</th>
              <th className="pl-rpt-col-bal" colSpan="2" style={{ textAlign: "center" }}>{isMarathi ? "शिल्लक" : "Balance"}</th>
              <th className="pl-rpt-col-desc">{isMarathi ? "उत्पन्नाचा तपशील" : "Income Description"}</th>
              <th className="pl-rpt-col-bal" colSpan="2" style={{ textAlign: "center" }}>{isMarathi ? "शिल्लक" : "Balance"}</th>
            </tr>
          )}
        </thead>
        <tbody>
          {shape === "flat_dr_cr" ? (
            singleVisualRows.map((row, i) => (
              <tr key={i}>
                {row.isHeader ? (
                  <td colSpan="5" className="pl-rpt-head"><b>{row.desc}</b></td>
                ) : row.isSubTotal ? (
                  <>
                    <td colSpan="3" style={{ textAlign: "right" }}><b>Group Wise Total :</b></td>
                    <td style={{ textAlign: "right" }}><b>{fmt(row.totalCr)}</b></td>
                    <td style={{ textAlign: "right" }}><b>{fmt(row.totalDr)}</b></td>
                  </>
                ) : (
                  <>
                    <td style={{ textAlign: "right" }}>{row.srNo}</td>
                    <td style={{ textAlign: "right" }}>{row.code}</td>
                    <td>{row.desc.replace(row.code || "", "").trim()}</td>
                    <td style={{ textAlign: "right" }}>{fmt(row.cr)}</td>
                    <td style={{ textAlign: "right" }}>{fmt(row.dr)}</td>
                  </>
                )}
              </tr>
            ))
          ) : Array.from({ length: maxRows }).map((_, i) => {
            const L = leftVisualRows[i];
            const R = rightVisualRows[i];

            return (
              <tr key={i}>
                {/* LEFT SIDE */}
                {L ? (
                  L.isHeader ? (
                    shape === "nform" ? (
                      <>
                        <td></td>
                        <td className={`pl-rpt-head ${L.isProfit ? 'pl-rpt-profit' : ''}`}><i>{L.desc}</i></td>
                        <td></td>
                      </>
                    ) : (
                      <>
                        <td className={`pl-rpt-head ${L.isProfit ? 'pl-rpt-profit' : ''}`} colSpan="2"><i>{L.desc}</i></td>
                        <td className="pl-rpt-grp-bal"></td>
                      </>
                    )
                  ) : L.isSubTotal ? (
                    <>
                      <td className="pl-rpt-grp-bal">{fmt(L.pBal)}</td>
                      <td></td>
                      <td className="pl-rpt-grp-bal">{fmt(L.bal)}</td>
                    </>
                  ) : (
                    shape === "nform" ? (
                      <>
                        <td className={`pl-rpt-bal ${L.isProfit ? 'pl-rpt-profit' : ''}`}>{L.pBal != null ? fmt(L.pBal) : ""}</td>
                        <td className={`pl-rpt-item ${L.isProfit ? 'pl-rpt-profit' : ''}`}>
                          {L.code ? <span className="pl-rpt-code">{L.code}</span> : null}
                          {L.desc ? L.desc.replace(L.code || "", "").trim() : ""}
                        </td>
                        <td className={`pl-rpt-bal ${L.isProfit ? 'pl-rpt-profit' : ''}`}>{fmt(L.bal)}</td>
                      </>
                    ) : (
                      <>
                        <td className={`pl-rpt-item ${L.isProfit ? 'pl-rpt-profit' : ''}`}>
                          {L.code ? <span className="pl-rpt-code">{L.code}</span> : null}
                          {L.desc ? L.desc.replace(L.code || "", "").trim() : ""}
                        </td>
                        <td className={`pl-rpt-bal ${L.isProfit ? 'pl-rpt-profit' : ''}`}>{fmt(L.bal)}</td>
                        <td className={`pl-rpt-grp-bal ${L.isProfit ? 'pl-rpt-profit' : ''}`}>{L.grpTotal ? fmt(L.grpTotal) : ""}</td>
                      </>
                    )
                  )
                ) : (
                  <><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td></>
                )}

                {/* RIGHT SIDE */}
                {R ? (
                  R.isHeader ? (
                    shape === "nform" ? (
                      <>
                        <td></td>
                        <td className={`pl-rpt-head ${R.isLoss ? 'pl-rpt-loss' : ''}`}><i>{R.desc}</i></td>
                        <td></td>
                      </>
                    ) : (
                      <>
                        <td className={`pl-rpt-head ${R.isLoss ? 'pl-rpt-loss' : ''}`} colSpan="2"><i>{R.desc}</i></td>
                        <td className="pl-rpt-grp-bal"></td>
                      </>
                    )
                  ) : R.isSubTotal ? (
                    <>
                      <td className="pl-rpt-grp-bal">{fmt(R.pBal)}</td>
                      <td></td>
                      <td className="pl-rpt-grp-bal">{fmt(R.bal)}</td>
                    </>
                  ) : (
                    shape === "nform" ? (
                      <>
                        <td className={`pl-rpt-bal ${R.isLoss ? 'pl-rpt-loss' : ''}`}>{R.pBal != null ? fmt(R.pBal) : ""}</td>
                        <td className={`pl-rpt-item ${R.isLoss ? 'pl-rpt-loss' : ''}`}>
                          {R.code ? <span className="pl-rpt-code">{R.code}</span> : null}
                          {R.desc ? R.desc.replace(R.code || "", "").trim() : ""}
                        </td>
                        <td className={`pl-rpt-bal ${R.isLoss ? 'pl-rpt-loss' : ''}`}>{fmt(R.bal)}</td>
                      </>
                    ) : (
                      <>
                        <td className={`pl-rpt-item ${R.isLoss ? 'pl-rpt-loss' : ''}`}>
                          {R.code ? <span className="pl-rpt-code">{R.code}</span> : null}
                          {R.desc ? R.desc.replace(R.code || "", "").trim() : ""}
                        </td>
                        <td className={`pl-rpt-bal ${R.isLoss ? 'pl-rpt-loss' : ''}`}>{fmt(R.bal)}</td>
                        <td className={`pl-rpt-grp-bal ${R.isLoss ? 'pl-rpt-loss' : ''}`}>{R.grpTotal ? fmt(R.grpTotal) : ""}</td>
                      </>
                    )
                  )
                ) : (
                  <><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td><td style={{ borderBottom: "none" }}></td></>
                )}
              </tr>
            );
          })}
          
          {shape === "flat_dr_cr" ? (
            <tr className="pl-rpt-grand-total">
              <td colSpan="3" style={{ textAlign: "right" }}><b>Grand Total :</b></td>
              <td style={{ textAlign: "right", color: "#000" }}><b>{fmt(grandTotalCr)}</b></td>
              <td style={{ textAlign: "right", color: "#000" }}><b>{fmt(grandTotalDr)}</b></td>
            </tr>
          ) : shape === "nform" ? (
            <tr className="pl-rpt-grand-total">
              <td className="pl-rpt-grp-bal"><b>{fmt(pFinalTotal)}</b></td>
              <td colSpan="2"></td>
              <td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
              <td className="pl-rpt-grp-bal"><b>{fmt(pFinalTotal)}</b></td>
              <td colSpan="2"></td>
              <td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
            </tr>
          ) : (
            <tr className="pl-rpt-grand-total">
              <td colSpan="2"></td>
              <td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
              <td colSpan="2"></td>
              <td className="pl-rpt-grp-bal"><b>{fmt(finalTotal)}</b></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Plain Text Report Logic ───────────────────────────────────────────────────
const generateTextReport = (data, asOnDate, fromDateRaw, toDateRaw, reportType) => {
  const shape = detectShape(data);
  if (shape === "unknown") return "No data available.";

  const isMarathi = reportType === "PL Marathi" || reportType === "N Form PL Marathi";
  const displayDate = asOnDate || new Date().toLocaleDateString("en-GB");
  const bankName = data[0]?.BANKNAME || data[0]?.BankName || data[0]?.Bankname || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI";
  const branchName = data[0]?.MIDNAME || data[0]?.MidName || data[0]?.Midname || "HEAD OFFICE";
  const userId = "Rohini";
  const printDate = new Date().toLocaleDateString("en-GB");

  const { leftVisualRows, rightVisualRows, singleVisualRows, finalTotal, pFinalTotal, grandTotalDr, grandTotalCr } = preparePLData(data, shape);
  const maxRows = shape === "flat_dr_cr" ? (singleVisualRows?.length || 0) : Math.max(leftVisualRows?.length || 0, rightVisualRows?.length || 0);

  const P = (str, len, pad = ' ', r = false) => {
    let s = String(str || "").substring(0, len);
    return r ? s.padStart(len, pad) : s.padEnd(len, pad);
  };
  const F = (v) => v === "" || v == null ? "" : parseFloat(v).toFixed(2);

  const fromDateStr = fromDateRaw ? fromDateRaw.split('-').reverse().join('/') : "";
  const toDateStr = toDateRaw ? toDateRaw.split('-').reverse().join('/') : "";

  const wDesc = 45;
  const wBal = 15;
  const wGrp = 15;
  const wSr = 6;
  const wCode = 10;
  
  let lw = shape === "nform" ? (wBal + wDesc + wBal + 2) : (wDesc + wBal + wGrp + 2);
  let fullWidth = lw * 2 + 1;
  if (shape === "flat_dr_cr") {
     lw = wSr + wCode + wDesc + wBal + wBal + 4;
     fullWidth = lw;
  }

  let text = "";
  const hr = " " + "-".repeat(fullWidth) + " \n";
  const mhr = (shape === "flat_dr_cr") 
     ? "|" + "-".repeat(fullWidth) + "|\n"
     : "|" + "-".repeat(lw) + "|" + "-".repeat(lw) + "|\n";

  text += hr;
  if (shape === "flat_dr_cr") {
     text += "|" + P(" Name         : " + bankName, fullWidth - 36) + P(" Print Date : " + printDate, 36) + "|\n";
     text += "|" + P(" Branch Name  : " + branchName, fullWidth - 36) + P(" Print By   : " + userId, 36) + "|\n";
  } else {
     text += "|" + P(" Name         : " + bankName, lw) + "|" + P(" Print Date    : " + printDate, lw) + "|\n";
     text += "|" + P(" Branch Name  : " + branchName, lw) + "|" + P(" Print By      : " + userId, lw) + "|\n";
  }
  text += mhr;
  
  let reportTitle = "";
  if (shape === "flat_dr_cr") {
    reportTitle = `Income & Expenses Report From ${fromDateStr} To ${toDateStr}`;
  } else {
    reportTitle = isMarathi ? `नफा व तोटा : ${displayDate} अखेर` : `Profit & Loss As On :  ${displayDate}`;
  }
  text += "|" + P(reportTitle, fullWidth, ' ', false).padStart(Math.floor((fullWidth + reportTitle.length) / 2)).padEnd(fullWidth) + "|\n";
  text += mhr;

  if (shape === "nform") {
    text += `|${P(fromDateStr, wBal, ' ', true)}|${P(" Expenses Description", wDesc)}|${P(toDateStr, wBal, ' ', true)}|${P(fromDateStr, wBal, ' ', true)}|${P(" Income Description", wDesc)}|${P(toDateStr, wBal, ' ', true)}|\n`;
    text += `|${"-".repeat(wBal)}|${"-".repeat(wDesc)}|${"-".repeat(wBal)}|${"-".repeat(wBal)}|${"-".repeat(wDesc)}|${"-".repeat(wBal)}|\n`;
  } else if (shape === "flat_dr_cr") {
    text += `|${P("Sr No", wSr)}|${P("Product", wCode)}|${P("Gl Name", wDesc)}|${P("Cr Amount", wBal, ' ', true)}|${P("Dr Amount", wBal, ' ', true)}|\n`;
    text += `|${"-".repeat(wSr)}|${"-".repeat(wCode)}|${"-".repeat(wDesc)}|${"-".repeat(wBal)}|${"-".repeat(wBal)}|\n`;
  } else {
    text += `|${P(isMarathi ? "             खर्च तपशील" : "             Expenses  Description", wDesc)}|${P(isMarathi ? "    शिल्लक" : "    Balance", wBal)}|${P("", wGrp)}|${P(isMarathi ? "             उत्पन्नाचा तपशील" : "             Income Description", wDesc)}|${P(isMarathi ? "    शिल्लक" : "    Balance", wBal)}|${P("", wGrp)}|\n`;
    text += `|${"-".repeat(wDesc)}|${"-".repeat(wBal)}|${"-".repeat(wGrp)}|${"-".repeat(wDesc)}|${"-".repeat(wBal)}|${"-".repeat(wGrp)}|\n`;
  }

  if (shape === "flat_dr_cr") {
    for (let i = 0; i < maxRows; i++) {
      const row = singleVisualRows[i];
      if (row.isHeader) {
        text += `|${P(row.desc, fullWidth)}|\n`;
      } else if (row.isSubTotal) {
        const subLabel = P("Group Wise Total :", wSr + wCode + wDesc + 2, ' ', true);
        text += `|${subLabel}|${P(F(row.totalCr), wBal, ' ', true)}|${P(F(row.totalDr), wBal, ' ', true)}|\n`;
      } else {
        const descStr = row.desc.replace(row.code || "", "").trim();
        text += `|${P(row.srNo, wSr, ' ', true)}|${P(row.code, wCode)}|${P(descStr, wDesc)}|${P(F(row.cr), wBal, ' ', true)}|${P(F(row.dr), wBal, ' ', true)}|\n`;
      }
    }
  } else {
    for (let i = 0; i < maxRows; i++) {
    const L = leftVisualRows[i];
    const R = rightVisualRows[i];

    let l1, l2, l3, r1, r2, r3;

    if (shape === "nform") {
      l1 = P("", wBal); l2 = P("", wDesc); l3 = P("", wBal);
      r1 = P("", wBal); r2 = P("", wDesc); r3 = P("", wBal);

      if (L) {
        if (L.isHeader) {
          l1 = P("", wBal); l2 = P(L.desc, wDesc); l3 = P("", wBal);
        } else if (L.isSubTotal) {
          l1 = P(F(L.pBal), wBal, ' ', true); l2 = P("", wDesc); l3 = P(F(L.bal), wBal, ' ', true);
        } else {
          const descStr = L.code ? `${L.code} ${L.desc.replace(L.code || "", "").trim()}` : L.desc;
          l1 = P(F(L.pBal), wBal, ' ', true); l2 = P(descStr, wDesc); l3 = P(F(L.bal), wBal, ' ', true);
        }
      }

      if (R) {
        if (R.isHeader) {
          r1 = P("", wBal); r2 = P(R.desc, wDesc); r3 = P("", wBal);
        } else if (R.isSubTotal) {
          r1 = P(F(R.pBal), wBal, ' ', true); r2 = P("", wDesc); r3 = P(F(R.bal), wBal, ' ', true);
        } else {
          const descStr = R.code ? `${R.code} ${R.desc.replace(R.code || "", "").trim()}` : R.desc;
          r1 = P(F(R.pBal), wBal, ' ', true); r2 = P(descStr, wDesc); r3 = P(F(R.bal), wBal, ' ', true);
        }
      }

      text += `|${l1}|${l2}|${l3}|${r1}|${r2}|${r3}|\n`;

    } else {
      let lCol = P("", wDesc), lBal = P("", wBal), lGrp = P("", wGrp);
      let rCol = P("", wDesc), rBal = P("", wBal), rGrp = P("", wGrp);

      if (L) {
        if (L.isHeader) {
          lCol = P(L.desc, wDesc); lBal = P("-".repeat(wBal), wBal); lGrp = P("", wGrp);
        } else if (L.isSubTotal) {
          // not typically present in horizontal, but just in case
          lCol = P("", wDesc); lBal = P(F(L.bal), wBal, ' ', true); lGrp = P(F(L.grpTotal), wGrp, ' ', true);
        } else {
          const descStr = L.code ? `${L.code} ${L.desc.replace(L.code || "", "").trim()}` : L.desc;
          lCol = P(descStr, wDesc); lBal = P(F(L.bal), wBal, ' ', true);
          if (L.grpTotal) lGrp = P(F(L.grpTotal), wGrp, ' ', true);
        }
      }

      if (R) {
        if (R.isHeader) {
          rCol = P(R.desc, wDesc); rBal = P("-".repeat(wBal), wBal); rGrp = P("", wGrp);
        } else if (R.isSubTotal) {
          rCol = P("", wDesc); rBal = P(F(R.bal), wBal, ' ', true); rGrp = P(F(R.grpTotal), wGrp, ' ', true);
        } else {
          const descStr = R.code ? `${R.code} ${R.desc.replace(R.code || "", "").trim()}` : R.desc;
          rCol = P(descStr, wDesc); rBal = P(F(R.bal), wBal, ' ', true);
          if (R.grpTotal) rGrp = P(F(R.grpTotal), wGrp, ' ', true);
        }
      }

      text += `|${lCol}|${lBal}|${lGrp}|${rCol}|${rBal}|${rGrp}|\n`;
    }
  }
}

  text += mhr;
  if (shape === "flat_dr_cr") {
    const subLabel = P("Grand Total :", wSr + wCode + wDesc + 2, ' ', true);
    text += `|${subLabel}|${P(F(grandTotalCr), wBal, ' ', true)}|${P(F(grandTotalDr), wBal, ' ', true)}|\n`;
  } else if (shape === "nform") {
    text += `|${P(F(pFinalTotal), wBal, ' ', true)}|${P(" Grand Total:", wDesc)}|${P(F(finalTotal), wBal, ' ', true)}|${P(F(pFinalTotal), wBal, ' ', true)}|${P(" Grand Total:", wDesc)}|${P(F(finalTotal), wBal, ' ', true)}|\n`;
  } else {
    text += `|${P(" Grand Total:", wDesc)}|${P(F(finalTotal), wBal, ' ', true)}|${P("", wGrp)}|${P(" Grand Total:", wDesc)}|${P(F(finalTotal), wBal, ' ', true)}|${P("", wGrp)}|\n`;
  }
  text += mhr;
  if (shape !== "flat_dr_cr") {
    text += `|${P("Profit & Loss Tally", fullWidth)}|\n`;
    text += hr;
  } else {
    // Just close the table for single list
    text += hr;
  }

  return text;
};

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
      
      let flatData = data;
      if (data && data.recordsets) {
        flatData = data.recordsets.flat();
      }
      if (!Array.isArray(flatData)) flatData = [];

      if (btnKey === "textReportView") {
        const asOnDateStr = isAsOnDate ? form.asOnDate : `${form.fromDate} - ${form.toDate}`;
        const textContent = generateTextReport(flatData, asOnDateStr, form.fromDate, form.toDate, form.reportType);
        const newTab = window.open();
        newTab.document.write(`<pre style="font-family: monospace; font-size: 12px; white-space: pre;">${textContent}</pre>`);
        newTab.document.close();
      } else {
        handleResult(data);
      }
    });
  };

  // Determine if we should show the formatted report view
  const isReportButton = activeButton === "profitLossReport" || activeButton === "reportWithWorkingDay" || activeButton === "intPaidReport";
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
            @page { size: landscape; margin: 10mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9px; margin: 0; }
            table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
            th, td { border-left: 1px solid #000; border-right: 1px solid #000; padding: 2px 4px; }
            th { background: #e0e0e0; font-weight: 600; border-top: 1px solid #000; border-bottom: 1px solid #000; color: #b71c1c; text-align: left; padding: 4px; }
            col.pl-col-desc { width: 35%; }
            col.pl-col-bal  { width: 8%; }
            col.pl-col-grp  { width: 7%; }
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
                    shape={shape}
                    branchCode={form.branchCode}
                    asOnDate={isAsOnDate ? form.asOnDate : `${form.fromDate} - ${form.toDate}`}
                    fromDateRaw={form.fromDate}
                    toDateRaw={form.toDate}
                    activeButton={activeButton}
                    reportType={form.reportType}
                  />
              </div>
            </div>
          )}

          {/* GRID VIEW for Show / other buttons */}
          {!loading && fetched && reportData.length > 0 && !showFormattedReport && (
            <div className="pl-table-wrapper">
              {shape === "horizontal" || shape === "nform" ? (
                <table className="pl-table" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>ID</th>
                      {shape === "nform" && <th style={{ textAlign: 'right' }}>Prv Amount</th>}
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      {shape === "nform" && <th style={{ textAlign: 'right' }}>Prv Amount</th>}
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        {shape === "nform" && <td style={{ textAlign: 'right' }}>{fmt(row.PEAMOUNT)}</td>}
                        <td>{row.ESUBGL || ""}</td>
                        <td>{row.EGLNM || ""}</td>
                        <td style={{ textAlign: 'right' }}>{fmt(row.EAMOUNT)}</td>
                        {shape === "nform" && <td style={{ textAlign: 'right' }}>{fmt(row.PIAMOUNT)}</td>}
                        <td>{row.ISUBGL || ""}</td>
                        <td>{row.IGLNM || ""}</td>
                        <td style={{ textAlign: 'right' }}>{fmt(row.IAMOUNT)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : shape === "flat_dr_cr" ? (
                <table className="pl-table" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>ID</th>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th style={{ textAlign: 'right' }}>Debit</th>
                      <th style={{ textAlign: 'right' }}>Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{row.SUBGLCODE || ""}</td>
                        <td>{row.Glname || ""}</td>
                        <td style={{ textAlign: 'right' }}>{fmt(row.DEBIT || 0)}</td>
                        <td style={{ textAlign: 'right' }}>{fmt(row.CREDIT || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
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
              )}
              <p className="pl-record-count">Total Records: {reportData.length}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfitAndLoss;