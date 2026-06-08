

import { useState, useRef } from "react";
import "./ACBalanceRegister.css";

const API_BASE_URL = "http://localhost:5000";

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Formatted Date
const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-GB").replace(/\//g, "-");
};

// ── Formatted Report Component (matches the picture exactly) ─────────────────
function ACBReportFormatted({ data, bankName, branchName, userId, printDate }) {
  if (!data || data.length === 0) return null;

  // Assume the first row has the GL info we want to show in the group header.
  // The API returns GLCODE, GLNAME, SUBGLCODE.
  const firstRow = data[0];
  const glCodeStr = firstRow.GLCODE || firstRow.SUBGLCODE || "";
  const glNameStr = firstRow.GLNAME || "";
  const groupHeaderTitle = glCodeStr && glNameStr ? `${glCodeStr} - ${glNameStr}` : (glNameStr || glCodeStr);

  const totalAmount = data.reduce((sum, row) => sum + (parseFloat(row.Amount) || 0), 0);

  return (
    <div className="acb-formatted-report">
      {/* ── Meta Info Header ── */}
      <div className="acb-fmt-meta-grid">
        <div className="acb-fmt-meta-left">
          <div className="acb-fmt-meta-row">
            <span className="acb-fmt-meta-key">Bank Name</span>
            <span className="acb-fmt-meta-sep">:</span>
            <span className="acb-fmt-meta-val">{bankName || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI"}</span>
          </div>
          <div className="acb-fmt-meta-row">
            <span className="acb-fmt-meta-key">Branch Name</span>
            <span className="acb-fmt-meta-sep">:</span>
            <span className="acb-fmt-meta-val">{branchName || "HEAD OFFICE"}</span>
          </div>
        </div>
        <div className="acb-fmt-meta-right">
          <div className="acb-fmt-meta-row">
            <span className="acb-fmt-meta-key">User ID</span>
            <span className="acb-fmt-meta-sep">:</span>
            <span className="acb-fmt-meta-val">{userId || ""}</span>
          </div>
          <div className="acb-fmt-meta-row">
            <span className="acb-fmt-meta-key">Print Date</span>
            <span className="acb-fmt-meta-sep">:</span>
            <span className="acb-fmt-meta-val">{printDate || ""}</span>
          </div>
        </div>
      </div>

      <hr className="acb-fmt-divider" />

      {/* ── Title ── */}
      <div className="acb-fmt-title-row">
        Account Balance Register List
      </div>

      {/* ── Table ── */}
      <table className="acb-fmt-table">
        <thead>
          <tr className="acb-fmt-col-head-row">
            <th className="acb-fmt-col-srno">Sr No</th>
            <th className="acb-fmt-col-acno">Ac NO</th>
            <th className="acb-fmt-col-name">Customer Name</th>
            <th className="acb-fmt-col-custid">Customer ID</th>
            <th className="acb-fmt-col-date">Opening Date</th>
            <th className="acb-fmt-col-amt">Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* Group Header Row */}
          {groupHeaderTitle && (
            <tr className="acb-fmt-group-row">
              <td colSpan="6">{groupHeaderTitle}</td>
            </tr>
          )}

          {/* Data Rows */}
          {data.map((row, i) => (
            <tr key={i}>
              <td className="acb-fmt-td acb-fmt-col-srno">{i + 1}</td>
              <td className="acb-fmt-td acb-fmt-col-acno">{row.ACCNO ?? ""}</td>
              <td className="acb-fmt-td acb-fmt-col-name">{row.CUSTNAME ?? ""}</td>
              <td className="acb-fmt-td acb-fmt-col-custid">{row.CUSTNO ?? ""}</td>
              <td className="acb-fmt-td acb-fmt-col-date">{fmtDate(row.OPENINGDATE)}</td>
              <td className="acb-fmt-td acb-fmt-col-amt acb-fmt-num">{fmt(row.Amount)}</td>
            </tr>
          ))}

          {/* Total Rows */}
          <tr className="acb-fmt-total-row">
            <td colSpan="4" style={{ border: 'none' }}></td>
            <td className="acb-fmt-td" style={{ fontWeight: 'bold', textAlign: 'left', borderLeft: 'none' }}>Total :</td>
            <td className="acb-fmt-td acb-fmt-num" style={{ fontWeight: 'bold' }}>{fmt(totalAmount)}</td>
          </tr>
          <tr className="acb-fmt-total-row">
            <td colSpan="4" style={{ border: 'none' }}></td>
            <td className="acb-fmt-td" style={{ fontWeight: 'bold', textAlign: 'left', borderLeft: 'none' }}>Grand total</td>
            <td className="acb-fmt-td acb-fmt-num" style={{ fontWeight: 'bold' }}>{fmt(totalAmount)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ACBalanceRegister() {
  const [form, setForm] = useState({
    branchCode: "1",
    glCode: "",
    subGLCode: "",
    asOnDate: "2025-04-01",
    textReportName: ""
  });

  const [reportData, setReportData]   = useState([]);
  const [columns, setColumns]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [fetched, setFetched]         = useState(false);

  const [bankInfo,   setBankInfo]   = useState({ bankName: "", branchName: "" });
  const [activeButton, setActiveButton] = useState("");
  const reportRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFetched(false);
  };

  // Convert DD/MM/YYYY  or  DD/MM/YY  →  YYYY-MM-DD for the API
  const parseDate = (raw) => {
    if (!raw) return null;
    if (raw.includes("-")) return raw; // already ISO format
    const parts = raw.trim().split("/");
    if (parts.length !== 3) return null;
    let [d, m, y] = parts;
    if (y.length === 2) y = "20" + y;
    if (d.length < 2) d = d.padStart(2, "0");
    if (m.length < 2) m = m.padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const validate = () => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (!form.glCode.trim())     return "GL Code is required.";
    if (!form.asOnDate.trim())   return "As On Date is required.";
    const isoDate = parseDate(form.asOnDate);
    if (!isoDate)                return "As On Date must be in DD/MM/YYYY format.";
    return null;
  };

  const fetchData = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const isoDate = parseDate(form.asOnDate);
      const params  = new URLSearchParams({
        branchCode: form.branchCode.trim(),
        glCode:     form.glCode.trim(),
        subGLCode:  form.subGLCode.trim(),
        asOnDate:   isoDate
      });

      const res = await fetch(`${API_BASE_URL}/api/balance-register?${params}`);
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

  const handleTextReportView = async () => {
    setActiveButton("view");
    await fetchData();
  };

  const handlePrint = async () => {
    setActiveButton("print");
    const data = fetched ? reportData : await fetchData();
    if (data && data.length > 0) {
      setTimeout(() => {
        handlePrintWindow();
      }, 300);
    }
  };

  const handlePrintWindow = () => {
    if (!reportRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Account Balance Register</title>
          <style>
            @page { size: portrait; margin: 8mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; margin: 0; color: #000; }
            .acb-formatted-report { padding: 0; }
            .acb-fmt-meta-grid { display: flex; justify-content: space-between; margin-bottom: 12px; }
            .acb-fmt-meta-left, .acb-fmt-meta-right { display: flex; flex-direction: column; gap: 5px; }
            .acb-fmt-meta-row { display: flex; gap: 8px; font-size: 11px; color: #000; }
            .acb-fmt-meta-key { font-weight: 600; min-width: 90px; }
            .acb-fmt-divider { border: 0; border-top: 1.5px solid #000; margin: 10px 0 0 0; }
            .acb-fmt-title-row { text-align: center; font-weight: 700; font-size: 13px; padding: 8px 10px; margin: 0; border-bottom: 1.5px solid #000; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; border-left: 1px solid #000; border-right: 1px solid #000; border-bottom: 1px solid #000; }
            th, td { border-bottom: 1px solid #999; border-right: 1px solid #999; padding: 4px 6px; text-align: left; font-size: 10.5px; color: #000; }
            th:last-child, td:last-child { border-right: none; }
            .acb-fmt-col-head-row th { background: #ffffff; font-weight: 700; border-bottom: 1px solid #000; }
            .acb-fmt-group-row td { background: #ffffff; font-weight: 700; font-style: italic; text-decoration: underline; }
            .acb-fmt-num { text-align: right !important; }
            .acb-fmt-center { text-align: center !important; }
            .acb-fmt-col-srno   { width: 5%; text-align: center !important; }
            .acb-fmt-col-acno   { width: 8%; text-align: center !important; }
            .acb-fmt-col-name   { width: 35%; }
            .acb-fmt-col-custid { width: 15%; }
            .acb-fmt-col-date   { width: 12%; }
            .acb-fmt-col-amt    { width: 15%; text-align: right !important; }
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
    <div className="acb-wrapper">
      <div className="acb-card no-print">

        <div className="acb-header">
          <span>Account Bal Report</span>
        </div>

        <div className="acb-body">

          {/* ROW 1 */}
          <div className="acb-row">
            <div className="acb-field">
              <label>Branch Code</label>
              <input name="branchCode" value={form.branchCode} onChange={handleChange} />
            </div>
            <div className="acb-field">
              <label>GL Code</label>
              <input name="glCode" value={form.glCode} onChange={handleChange} placeholder="e.g. 1" />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="acb-row">
            <div className="acb-field">
              <label>Sub GL Code</label>
              <input name="subGLCode" value={form.subGLCode} onChange={handleChange} placeholder="Optional" />
            </div>
            <div className="acb-field">
              <label>As On Date</label>
              <input type="date" name="asOnDate" value={form.asOnDate} onChange={handleChange} />
            </div>
          </div>

          {/* ROW 3 */}
          <div className="acb-row">
            <div className="acb-field">
              <label>Text Report Name</label>
              <input name="textReportName" value={form.textReportName} onChange={handleChange} />
            </div>
          </div>

          {/* ERROR / LOADING */}
          {error   && <p className="acb-error">{error}</p>}
          {loading && <p className="acb-loading">Loading...</p>}

          {/* BUTTONS */}
          <div className="acb-footer">
            <button
              className="acb-btn acb-btn-view"
              onClick={handleTextReportView}
              disabled={loading}
            >
              {loading && activeButton === "view" ? "Loading..." : "View Report"}
            </button>
            <button
              className="acb-btn acb-btn-print"
              onClick={handlePrint}
              disabled={loading}
            >
              {loading && activeButton === "print" ? "Loading..." : "Print Report"}
            </button>
          </div>

        </div>
      </div>

      {/* REPORT DISPLAY */}
      {showReport && (
        <div className="acb-table-wrapper" ref={reportRef}>
          <ACBReportFormatted
            data={reportData}
            bankName={bankInfo.bankName}
            branchName={bankInfo.branchName}
            userId={"Rohini"}
            printDate={new Date().toLocaleDateString("en-GB")}
          />
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="acb-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default ACBalanceRegister;