
import { useState } from "react";
import "./BalanceSheet.css";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
function BSReportFormatted({ data, columns }) {
  const hasSplit = data.length > 0 && ('CRGL' in data[0] || 'DRGL' in data[0]);

  if (!hasSplit) {
    return (
      <table className="bs-table bs-classic-table">
        <thead>
          <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => <td key={col}>{typeof row[col] === 'number' ? fmt(row[col]) : (row[col] ?? "")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Compute rowSpans for grouping Glcode
  const crglSpans = new Array(data.length).fill(0);
  const drglSpans = new Array(data.length).fill(0);

  let i = 0;
  while (i < data.length) {
    let j = i + 1;
    while (j < data.length && data[j].CRGL === data[i].CRGL && data[i].CRGL !== "" && data[i].CRGL !== "0") {
      j++;
    }
    crglSpans[i] = j - i;
    i = j;
  }

  i = 0;
  while (i < data.length) {
    let j = i + 1;
    while (j < data.length && data[j].DRGL === data[i].DRGL && data[i].DRGL !== "" && data[i].DRGL !== "0") {
      j++;
    }
    drglSpans[i] = j - i;
    i = j;
  }

  return (
    <table className="bs-table bs-classic-table">
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>LABILITY</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th style={{ textAlign: "left" }}>ASSET</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          {/* LIABILITY */}
          <th>Glcode</th>
          <th>Product Code</th>
          <th>Product Name</th>
          <th>ID</th>
          <th>Group</th>
          <th>Balance</th>
          {/* ASSET */}
          <th>Glcode</th>
          <th>Product Code</th>
          <th>Product Name</th>
          <th>ID</th>
          <th>Group</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => {
          return (
            <tr key={idx}>
              {/* LIABILITY */}
              {crglSpans[idx] > 0 && (
                <td rowSpan={crglSpans[idx]} style={{ verticalAlign: "middle" }}>
                  {row.CRGL === "0" ? "" : row.CRGL}
                </td>
              )}
              {crglSpans[idx] === 0 && row.CRGL === data[idx - 1]?.CRGL && row.CRGL !== "0" && row.CRGL !== "" ? null : (
                crglSpans[idx] === 0 && (<td>{row.CRGL === "0" ? "" : row.CRGL}</td>)
              )}

              <td>{row.CRGLN || ""}</td>
              <td>{row.CRSGL || ""}</td>
              <td>{row.CRGLRID || ""}</td>
              <td>{row.CRGLTP || ""}</td>
              <td style={{ textAlign: "right" }}>{row.CRBAL || row.CRBAL === 0 ? fmt4(row.CRBAL) : ""}</td>

              {/* ASSET */}
              {drglSpans[idx] > 0 && (
                <td rowSpan={drglSpans[idx]} style={{ verticalAlign: "middle" }}>
                  {row.DRGL === "0" ? "" : row.DRGL}
                </td>
              )}
              {drglSpans[idx] === 0 && row.DRGL === data[idx - 1]?.DRGL && row.DRGL !== "0" && row.DRGL !== "" ? null : (
                drglSpans[idx] === 0 && (<td>{row.DRGL === "0" ? "" : row.DRGL}</td>)
              )}

              <td>{row.DRSGL || ""}</td>
              <td>{row.DRGLN || ""}</td>
              <td></td>
              <td>{row.DRGLRID || ""}</td>
              <td style={{ textAlign: "right" }}>{(row.DRGLTP || "") + (row.DRBAL || row.DRBAL === 0 ? fmt4(row.DRBAL) : "")}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
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
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!fetched) await callAPI("Balance Sheet Report");
    setTimeout(() => window.print(), 400);
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
            <button className="bs-btn bs-btn-print" onClick={handlePrint} disabled={loading}>
              Print
            </button>
          </div>

        </div>
      </div>

      {/* ── Print header ── */}
      {fetched && reportData.length > 0 && (
        <div className="bs-table-wrapper">
          <div className="print-only bs-print-header">
            <h2>{form.textReportName || "Balance Sheet Report"}</h2>
            <p>
              Branch: {form.branchCode} &nbsp;|&nbsp;
              Report: {form.reportType} &nbsp;|&nbsp;
              Action: {activeAction} &nbsp;|&nbsp;
              Date Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <BSReportFormatted data={reportData} columns={columns} />

          <p className="bs-record-count no-print">
            Total Records: {reportData.length}
          </p>
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