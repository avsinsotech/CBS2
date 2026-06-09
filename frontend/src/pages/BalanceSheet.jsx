import { useState, useRef } from "react";
import "./BalanceSheet.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ─── helpers ────────────────────────────────────────────────
function parseDate(raw) {
  if (!raw) return null;
  if (raw.includes("-")) return raw; // already ISO format
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function splitDate(raw) {
  // returns { PFDATE, PFMONTH, PFYEAR } from DD/MM/YYYY
  const iso = parseDate(raw);
  if (!iso) return null;
  const dt = new Date(iso);
  return {
    PFDATE: iso,
    PFMONTH: String(dt.getMonth() + 1).padStart(2, "0"),
    PFYEAR: String(dt.getFullYear()),
  };
}

function splitDateEnd(raw) {
  const iso = parseDate(raw);
  if (!iso) return null;
  const dt = new Date(iso);
  return {
    PEDATE: iso,
    PEMONTH: String(dt.getMonth() + 1).padStart(2, "0"),
    PEYEAR: String(dt.getFullYear()),
  };
}

// ─── API endpoint map ────────────────────────────────────────
// [reportType][action] → { path, needsRange }
const ENDPOINT_MAP = {
  "As On Date": {
    Show:                    { path: "/api/balance-sheet/asondate/show",                needsRange: true  },
    "Balance Sheet Report":  { path: "/api/balance-sheet/asondate/balancesheetreport",  needsRange: false },
    "Report with Working Day":{ path: "/api/balance-sheet/asondate/reportwithworkingday",needsRange: false },
    "Text Report View":      { path: "/api/balance-sheet/asondate/balancesheetreport",  needsRange: false },
    "Balancesheet Summary":  { path: "/api/balance-sheet/asondate/balancesheetsummary", needsRange: false },
  },
  "N-Format": {
    Show:                    { path: "/api/balance-sheet/nformat/show",               needsRange: true },
    "Balance Sheet Report":  { path: "/api/balance-sheet/nformat/balancesheetreport", needsRange: true },
    "Text Report View":      { path: "/api/balance-sheet/nformat/balancesheetreport", needsRange: true },
  },
  "Marathi BS": {
    Show:                    { path: "/api/balance-sheet/marathibs/show",               needsRange: true  },
    "Balance Sheet Report":  { path: "/api/balance-sheet/marathibs/balancesheetreport", needsRange: false },
    "Working Day":           { path: "/api/balance-sheet/marathibs/workingday",         needsRange: false },
    "Text Report View":      { path: "/api/balance-sheet/marathibs/balancesheetreport", needsRange: false },
    "Balancesheet Summary":  { path: "/api/balance-sheet/marathibs/workingday",         needsRange: false },
  },
  "N-Format Marathi BS": {
    Show:                    { path: "/api/balance-sheet/nformatmarathi/show",               needsRange: true },
    "Balance Sheet Report":  { path: "/api/balance-sheet/nformatmarathi/balancesheetreport", needsRange: true },
    "Text Report View":      { path: "/api/balance-sheet/nformatmarathi/balancesheetreport", needsRange: true },
  },
};

// Format to 4 decimal places without commas
const fmt4 = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toFixed(4);
};

// ─── custom formatted table ──────────────────────────────────────────────
// ─── custom formatted table ──────────────────────────────────────────────
function BSReportFormatted({ data, bankName, branchName, userId, printDate, asOnDateText, activeAction }) {
  if (!data || data.length === 0) return null;

  const liabilityGroups = [];
  const liabilityGroupMap = {};

  data.forEach((row) => {
    const item = row.CRGLN?.trim();
    const bal = parseFloat(row.CRBAL) || 0;
    const desc = row.LDesc?.trim() || (item ? " " : "");

    if (!desc) return;

    if (!liabilityGroupMap[desc]) {
      const newGroup = { name: desc, items: [], outerBal: 0 };
      liabilityGroupMap[desc] = newGroup;
      liabilityGroups.push(newGroup);
    }

    if (item && item !== "0" && item !== "" && item !== ".") {
      liabilityGroupMap[desc].items.push({ name: item, innerBal: bal });
      liabilityGroupMap[desc].outerBal += bal;
    }
  });

  // Inject AUTHORIZED SHARES CAPITAL at the top if it doesn't exist AND we are not in 'Report with Working Day'
  if (!liabilityGroupMap["AUTHORIZED SHARES CAPITAL"] && activeAction !== "Report with Working Day") {
    liabilityGroups.unshift({ name: "AUTHORIZED SHARES CAPITAL", items: [], outerBal: 0 });
  }

  const liabilityRows = [];
  liabilityGroups.forEach((group) => {
    // Only render group header if it's not our placeholder blank group and not a dot
    if (group.name !== " " && group.name !== ".") {
      liabilityRows.push({ isGroup: true, name: group.name, outerBal: group.outerBal });
    }
    group.items.forEach((item) => {
      liabilityRows.push({ isGroup: false, name: item.name, innerBal: item.innerBal });
    });
  });

  const assetGroups = [];
  const assetGroupMap = {};

  data.forEach((row) => {
    const item = row.DRGLN?.trim();
    const bal = parseFloat(row.DRBAL) || 0;
    const desc = row.ADesc?.trim() || (item ? " " : "");

    if (!desc) return;

    if (!assetGroupMap[desc]) {
      const newGroup = { name: desc, items: [], outerBal: 0 };
      assetGroupMap[desc] = newGroup;
      assetGroups.push(newGroup);
    }

    if (item && item !== "0" && item !== "" && item !== ".") {
      assetGroupMap[desc].items.push({ name: item, innerBal: bal });
      assetGroupMap[desc].outerBal += bal;
    }
  });

  const assetRows = [];
  assetGroups.forEach((group) => {
    if (group.name !== " " && group.name !== ".") {
      assetRows.push({ isGroup: true, name: group.name, outerBal: group.outerBal });
    }
    group.items.forEach((item) => {
      assetRows.push({ isGroup: false, name: item.name, innerBal: item.innerBal });
    });
  });

  const maxRows = Math.max(liabilityRows.length, assetRows.length);
  const zippedRows = [];
  
  let totalL = 0;
  let totalA = 0;
  
  liabilityGroups.forEach(g => totalL += g.outerBal);
  assetGroups.forEach(g => totalA += g.outerBal);

  for (let i = 0; i < maxRows; i++) {
    const l = liabilityRows[i] || null;
    const a = assetRows[i] || null;
    zippedRows.push({ l, a });
  }

  return (
    <div className="bs-formatted-report">
      {/* Meta Header */}
      <div className="bs-fmt-meta-grid">
        <div className="bs-fmt-meta-left">
          <div className="bs-fmt-meta-row">
            <span className="bs-fmt-meta-key">Bank Name</span>
            <span className="bs-fmt-meta-sep">:</span>
            <span className="bs-fmt-meta-val">{bankName || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI"}</span>
          </div>
          <div className="bs-fmt-meta-row">
            <span className="bs-fmt-meta-key">Branch Name</span>
            <span className="bs-fmt-meta-sep">:</span>
            <span className="bs-fmt-meta-val">{branchName || "HEAD OFFICE"}</span>
          </div>
        </div>
        <div className="bs-fmt-meta-center">
            <div style={{ height: "16px" }}></div> {/* Spacer to align with second row */}
            <h3 className="bs-fmt-title">Balance Sheet As On : {asOnDateText}</h3>
        </div>
        <div className="bs-fmt-meta-right">
          <div className="bs-fmt-meta-row">
            <span className="bs-fmt-meta-key">Print Date</span>
            <span className="bs-fmt-meta-sep">:</span>
            <span className="bs-fmt-meta-val">{printDate || ""}</span>
          </div>
          <div className="bs-fmt-meta-row">
            <span className="bs-fmt-meta-key">Print UserID</span>
            <span className="bs-fmt-meta-sep">:</span>
            <span className="bs-fmt-meta-val">{userId || ""}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="bs-fmt-table">
        <thead>
          <tr className="bs-fmt-col-head-row">
            <th className="bs-fmt-col-name">Capital & Laibility</th>
            <th className="bs-fmt-col-bal">Balance</th>
            <th className="bs-fmt-col-outer"></th>
            <th className="bs-fmt-col-name">Asset & Property</th>
            <th className="bs-fmt-col-bal">Balance</th>
            <th className="bs-fmt-col-outer"></th>
          </tr>
        </thead>
        <tbody>
          {zippedRows.map((row, i) => (
            <tr key={i}>
              {/* LIABILITY */}
              {row.l ? (
                row.l.isGroup ? (
                  <>
                    <td className="bs-fmt-td bs-fmt-group">{row.l.name}</td>
                    <td className="bs-fmt-td"></td>
                    <td className="bs-fmt-td bs-fmt-num bs-fmt-outer-val">{fmt(row.l.outerBal)}</td>
                  </>
                ) : (
                  <>
                    <td className="bs-fmt-td bs-fmt-item">{row.l.name}</td>
                    <td className="bs-fmt-td bs-fmt-num">{fmt(row.l.innerBal)}</td>
                    <td className="bs-fmt-td"></td>
                  </>
                )
              ) : (
                <><td className="bs-fmt-td"></td><td className="bs-fmt-td"></td><td className="bs-fmt-td"></td></>
              )}

              {/* ASSET */}
              {row.a ? (
                row.a.isGroup ? (
                  <>
                    <td className="bs-fmt-td bs-fmt-group">{row.a.name}</td>
                    <td className="bs-fmt-td"></td>
                    <td className="bs-fmt-td bs-fmt-num bs-fmt-outer-val">{fmt(row.a.outerBal)}</td>
                  </>
                ) : (
                  <>
                    <td className="bs-fmt-td bs-fmt-item">{row.a.name}</td>
                    <td className="bs-fmt-td bs-fmt-num">{fmt(row.a.innerBal)}</td>
                    <td className="bs-fmt-td"></td>
                  </>
                )
              ) : (
                <><td className="bs-fmt-td"></td><td className="bs-fmt-td"></td><td className="bs-fmt-td"></td></>
              )}
            </tr>
          ))}
          {/* TOTAL ROW */}
          <tr className="bs-fmt-total-row">
            <td className="bs-fmt-td" style={{ textAlign: "right", fontWeight: "bold" }}>Total</td>
            <td className="bs-fmt-td"></td>
            <td className="bs-fmt-td bs-fmt-num bs-fmt-outer-val">{fmt(totalL)}</td>
            <td className="bs-fmt-td" style={{ textAlign: "right", fontWeight: "bold" }}>Total</td>
            <td className="bs-fmt-td"></td>
            <td className="bs-fmt-td bs-fmt-num bs-fmt-outer-val">{fmt(totalA)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── component ───────────────────────────────────────────────
function BalanceSheet() {
  const [form, setForm] = useState({
    reportType: "As On Date",
    branchCode: "1",
    asOnDate: "2026-03-30",
    fromDate: "2025-04-01",
    toDate: "2026-03-30",
    skipBranchAdj: false,
    textReportName: "",
  });

  const [reportData, setReportData] = useState([]);
  const [columns, setColumns]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [fetched, setFetched]       = useState(false);
  const [activeAction, setActiveAction] = useState("");

  const [bankInfo, setBankInfo] = useState({ bankName: "", branchName: "", printDate: "", printUserID: "" });

  const isSingleDate =
    form.reportType === "As On Date" || form.reportType === "Marathi BS";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setFetched(false);
    setError("");
  };

  // ── validate & build URL ──────────────────────────────────
  function buildURL(action) {
    const ep = ENDPOINT_MAP[form.reportType]?.[action];
    if (!ep) return { error: "Endpoint not configured for this action." };

    const PBRCD = form.branchCode.trim();
    if (!PBRCD) return { error: "Branch Code is required." };

    const params = new URLSearchParams({ PBRCD });

    if (ep.needsRange) {
      // from + to dates
      const from = splitDate(form.fromDate);
      const to   = splitDateEnd(form.toDate);
      if (!from) return { error: "From Date must be in DD/MM/YYYY format." };
      if (!to)   return { error: "To Date must be in DD/MM/YYYY format." };
      params.set("PFDATE",  from.PFDATE);
      params.set("PFMONTH", from.PFMONTH);
      params.set("PFYEAR",  from.PFYEAR);
      params.set("PEDATE",  to.PEDATE);
      params.set("PEMONTH", to.PEMONTH);
      params.set("PEYEAR",  to.PEYEAR);
    } else {
      // single date
      const dateStr = isSingleDate ? form.asOnDate : form.fromDate;
      const d = splitDate(dateStr);
      if (!d) return { error: "Date must be in DD/MM/YYYY format." };
      params.set("PFDATE",  d.PFDATE);
      params.set("PFMONTH", d.PFMONTH);
      params.set("PFYEAR",  d.PFYEAR);
    }

    return { url: `${API_BASE_URL}${ep.path}?${params}` };
  }

  // ── fetch ─────────────────────────────────────────────────
  const callAPI = async (action) => {
    const { url, error: buildErr } = buildURL(action);
    if (buildErr) { setError(buildErr); return; }

    setLoading(true);
    setError("");
    setFetched(false);
    setActiveAction(action);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      if (data.length > 0) {
        setColumns(Object.keys(data[0]));
      } else {
        setColumns([]);
      }
      setReportData(data);
      setFetched(true);

      // Fetch bank/branch info
      try {
        const loginCode = import.meta.env.VITE_LOGIN_CODE || localStorage.getItem('loginCode') || '';
        const infoRes = await fetch(`${API_BASE_URL}/api/bank-info?BRCD=${form.branchCode.trim()}&LoginCode=${loginCode}`);
        if (infoRes.ok) {
          const info = await infoRes.json();
          setBankInfo(info);
        }
      } catch (e) { /* ignore */ }
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
    } finally {
      setLoading(false);
    }
  };

  const reportRef = useRef(null);

  const handlePrint = async () => {
    if (!fetched) {
      await callAPI("Balance Sheet Report");
    }
    setTimeout(() => {
      if (!reportRef.current) return;
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Balance Sheet Report</title>
            <style>
              @page { size: landscape; margin: 8mm; }
              body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; margin: 0; color: #000; }
              .bs-formatted-report { padding: 0; }
              .bs-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .bs-fmt-meta-left, .bs-fmt-meta-right { display: flex; flex-direction: column; gap: 5px; }
              .bs-fmt-meta-center { text-align: center; }
              .bs-fmt-meta-row { display: flex; gap: 8px; font-size: 11px; color: #000; }
              .bs-fmt-meta-key { font-weight: 600; min-width: 90px; }
              .bs-fmt-title { text-align: center; font-weight: 700; font-size: 13px; margin: 0; color: #c00000; }
              table { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1.5px solid #000; }
              th, td { border: 1px solid #000; padding: 4px 6px; text-align: left; font-size: 10.5px; color: #000; }
              .bs-fmt-col-head-row th { background: #ffffff; font-weight: 700; border-bottom: 1.5px solid #000; text-align: center; }
              .bs-fmt-group { font-weight: 700; font-style: italic; text-decoration: underline; color: #c00000; }
              .bs-fmt-outer-val { font-weight: 700; color: #c00000; }
              .bs-fmt-num { text-align: right !important; }
              .bs-fmt-col-name { width: 35%; }
              .bs-fmt-col-bal { width: 15%; }
              .bs-fmt-col-outer { width: 15%; }
            </style>
          </head>
          <body>${reportRef.current.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }, 400);
  };

  // ── buttons per report type ───────────────────────────────
  const buttons = {
    "As On Date": [
      { label: "Show",                    action: "Show" },
      { label: "Balance Sheet Report",    action: "Balance Sheet Report" },
      { label: "Report with Working Day", action: "Report with Working Day" },
      { label: "Text Report View",        action: "Text Report View" },
      { label: "Balancesheet Summary",    action: "Balancesheet Summary" },
    ],
    "N-Format": [
      { label: "Show",                 action: "Show" },
      { label: "Balance Sheet Report", action: "Balance Sheet Report" },
      { label: "Text Report View",     action: "Text Report View" },
    ],
    "Marathi BS": [
      { label: "Show",                    action: "Show" },
      { label: "Balance Sheet Report",    action: "Balance Sheet Report" },
      { label: "Working Day",             action: "Working Day" },
      { label: "Text Report View",        action: "Text Report View" },
      { label: "Balancesheet Summary",    action: "Balancesheet Summary" },
    ],
    "N-Format Marathi BS": [
      { label: "Show",                 action: "Show" },
      { label: "Balance Sheet Report", action: "Balance Sheet Report" },
      { label: "Text Report View",     action: "Text Report View" },
    ],
  };

  const reportOptions = ["As On Date", "N-Format", "Marathi BS", "N-Format Marathi BS"];

  // Format the date for the display
  const displayDate = isSingleDate ? parseDate(form.asOnDate) : `${parseDate(form.fromDate)} To ${parseDate(form.toDate)}`;
  const displayDateFormatted = displayDate ? displayDate.split('-').reverse().join('/') : "";

  return (
    <div className="bs-wrapper">
      <div className="bs-card no-print">

        <div className="bs-header">BalanceSheet</div>

        <div className="bs-form-section">

          {/* Branch Code */}
          <div className="bs-row">
            <label className="bs-label">Branch Code</label>
            <input className="bs-input" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* Radio */}
          <div className="bs-radio-row">
            {reportOptions.map((opt) => (
              <label key={opt} className="bs-radio-label">
                <input type="radio" name="reportType" value={opt}
                  checked={form.reportType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>

          {/* Date fields */}
          {isSingleDate ? (
            <div className="bs-row">
              <label className="bs-label">As On Date</label>
              <input type="date" className="bs-input" name="asOnDate"
                value={form.asOnDate} onChange={handleChange} />
            </div>
          ) : (
            <div className="bs-row">
              <label className="bs-label">From Date</label>
              <input type="date" className="bs-input" name="fromDate"
                value={form.fromDate} onChange={handleChange} />
              <label className="bs-inline-label">To Date</label>
              <input type="date" className="bs-input" name="toDate"
                value={form.toDate} onChange={handleChange} />
            </div>
          )}

          {/* Skip Branch Adj */}
          <div className="bs-row">
            <label className="bs-checkbox-label">
              <input type="checkbox" name="skipBranchAdj"
                checked={form.skipBranchAdj} onChange={handleChange} />
              SKIP_Branch ADJ
            </label>
          </div>

          {/* Text Report Name */}
          <div className="bs-row">
            <label className="bs-label">Enter Text Report Name</label>
            <input className="bs-input bs-input-wide" name="textReportName"
              placeholder="Enter Text Report Name"
              value={form.textReportName} onChange={handleChange} />
          </div>

          {/* Error / Loading */}
          {error   && <p className="bs-error">{error}</p>}
          {loading && (
            <div className="bs-loading-bar">
              <div className="bs-loading-fill" />
            </div>
          )}

          {/* Buttons */}
          <div className="bs-btn-row">
            {(buttons[form.reportType] || []).map(({ label, action }) => (
              <button
                key={action}
                className={`bs-btn${activeAction === action && fetched ? " bs-btn-active" : ""}`}
                onClick={() => callAPI(action)}
                disabled={loading}
              >
                {loading && activeAction === action ? "Loading…" : label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── Table Area ── */}
      {fetched && reportData.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          {(activeAction === "Balance Sheet Report" || activeAction === "Report with Working Day") && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <button className="bs-btn bs-btn-print" onClick={handlePrint} disabled={loading}>
                Print PDF
              </button>
            </div>
          )}
          <div className="bs-table-wrapper" ref={reportRef}>
            <BSReportFormatted 
              data={reportData} 
              bankName={bankInfo.bankName} 
              branchName={bankInfo.branchName} 
              userId={bankInfo.printUserID} 
              printDate={bankInfo.printDate} 
              asOnDateText={displayDateFormatted} 
              activeAction={activeAction}
            />
          </div>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="bs-error no-print" style={{ margin: "16px" }}>
          No records found for the given criteria.
        </p>
      )}
    </div>
  );
}

export default BalanceSheet;