


import { useState, useEffect, useRef, Fragment } from "react";
import "./BranchwiseGLReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ─── date helper ─────────────────────────────────────────────
// DD/MM/YYYY → YYYY-MM-DD  (what this backend expects per swagger)
function toISO(raw) {
  if (!raw) return null;
  if (raw.includes("-")) return raw; // already ISO format
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function isValidDate(raw) {
  if (!raw) return false;
  if (raw.includes("-")) return true; // Browser date input guarantees valid date
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return false;
  const [d, m] = parts.map(Number);
  return d >= 1 && d <= 31 && m >= 1 && m <= 12;
}

// ─── component ───────────────────────────────────────────────
function OpeningClosingFormattedTable({ data, fromDate, toDate }) {
  if (!data || data.length === 0) return null;

  const first = data[0];
  const bankName = first.BANKNAME || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI";
  const userId = "Rohini";
  const printDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  
  const subGlCode = first.SUBGLCODE || "";
  const glName = first.GLNAME || "";
  const title = `${subGlCode} - ${glName} Branch Wise Gl List From ${fromDate} To ${toDate}`;

  // Group by BRCD
  const branches = {};
  data.forEach(row => {
    const brcd = Array.isArray(row.BRCD) ? row.BRCD[0] : row.BRCD;
    if (!branches[brcd]) {
      branches[brcd] = [];
    }
    branches[brcd].push(row);
  });

  // 1. Flatten into items
  const items = [];
  let globalIndex = 1;
  let grandOpening = 0;
  let grandCredit = 0;
  let grandDebit = 0;
  let grandClosing = 0;

  Object.keys(branches).forEach(brcd => {
    const branchRows = branches[brcd];
    const branchName = branchRows[0].MIDNAME || "HEAD OFFICE";
    const branchOpening = parseFloat(branchRows[0].Opening) || 0;
    const branchClosing = parseFloat(branchRows[0].ClosingBal) || 0;
    
    let sumCredit = 0;
    let sumDebit = 0;

    items.push({ type: "branchHeader", name: branchName });

    branchRows.forEach(row => {
      const credit = parseFloat(row.CREDIT) || 0;
      const debit = parseFloat(row.DEBIT) || 0;
      sumCredit += credit;
      sumDebit += debit;

      items.push({
        type: "data",
        index: globalIndex++,
        row, credit, debit, brcd,
        opening: row.Opening,
        balance: row.BALANCE,
        edate: row.EDATE ? new Date(row.EDATE).toLocaleDateString('en-GB').replace(/\//g, '-') : "",
        parti: row.PARTI || "",
        parti1: row.PARTI1 && row.PARTI1 !== row.PARTI && !row.PARTI?.includes(row.PARTI1) ? row.PARTI1 : "",
        setno: row.SETNO
      });
    });

    items.push({
      type: "branchTotal",
      opening: branchOpening,
      credit: sumCredit,
      debit: sumDebit,
      closing: branchClosing
    });

    grandOpening += branchOpening;
    grandCredit += sumCredit;
    grandDebit += sumDebit;
    grandClosing += branchClosing;
  });

  items.push({
    type: "grandTotal",
    opening: grandOpening,
    credit: grandCredit,
    debit: grandDebit,
    closing: grandClosing
  });

  // 2. Paginate items by exactly 33 DATA records per page
  const pages = [];
  let currentPage = [];
  let dataCount = 0;
  let lastBranchName = "";

  items.forEach(item => {
    if (item.type === "branchHeader") {
      lastBranchName = item.name;
    }

    if (dataCount >= 33) {
      if (item.type === "data" || item.type === "branchHeader") {
        pages.push(currentPage);
        currentPage = [];
        dataCount = 0;
        if (item.type === "data") {
          currentPage.push({ type: "branchHeader", name: lastBranchName });
        }
      }
    }

    currentPage.push(item);
    if (item.type === "data") {
      dataCount++;
    }
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return (
    <>
      {pages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="oc-table-wrapper page-break-container">
          <div className="oc-meta-grid">
            <div className="oc-meta-left">
              <div className="oc-meta-row">
                <span className="oc-meta-key">Bank Name</span>
                <span>: {bankName}</span>
              </div>
              <div className="oc-meta-row">
                <span className="oc-meta-key">Branch Name</span>
                <span>: {first.MIDNAME || "HEAD OFFICE"}</span>
              </div>
            </div>
            <div className="oc-meta-right">
              <div className="oc-meta-row">
                <span className="oc-meta-key">User ID</span>
                <span>: {userId}</span>
              </div>
              <div className="oc-meta-row">
                <span className="oc-meta-key">Print Date</span>
                <span>: {printDate}</span>
              </div>
            </div>
          </div>
          
          <div className="oc-title">{title}</div>
          
          <table className="oc-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>BRCD</th>
                <th>EntryDate</th>
                <th>SETNO</th>
                <th>Particulars</th>
                <th className="num">Opening Balance</th>
                <th className="num">CREDIT</th>
                <th className="num">DEBIT</th>
                <th className="num">Closing balance</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, i) => {
                if (item.type === "branchHeader") {
                  return (
                    <tr key={i} className="group-row">
                      <td colSpan="10">{item.name}</td>
                    </tr>
                  );
                }
                if (item.type === "data") {
                  return (
                    <tr key={i}>
                      <td>{item.index}</td>
                      <td>{item.brcd}</td>
                      <td>{item.edate}</td>
                      <td>{item.setno}</td>
                      <td>{item.parti}</td>
                      <td className="num">{item.opening != null ? fmt(item.opening) : ""}</td>
                      <td className="num">{fmt(item.credit)}</td>
                      <td className="num">{fmt(item.debit)}</td>
                      <td className="num">{fmt(item.balance)}</td>
                      <td>{item.parti1}</td>
                    </tr>
                  );
                }
                if (item.type === "branchTotal") {
                  return (
                    <tr key={i} style={{ fontWeight: "bold", color: "#000", background: "#fff" }}>
                      <td colSpan="5" style={{ textAlign: "right", paddingRight: "10px" }}>BRCD Wise Total</td>
                      <td className="num">{fmt(item.opening)}</td>
                      <td className="num">{fmt(item.credit)}</td>
                      <td className="num">{fmt(item.debit)}</td>
                      <td className="num">{fmt(item.closing)}</td>
                      <td></td>
                    </tr>
                  );
                }
                if (item.type === "grandTotal") {
                  return (
                    <tr key={i} style={{ fontWeight: "bold", color: "#000", background: "#fff" }}>
                      <td colSpan="5" style={{ textAlign: "right", paddingRight: "10px" }}>Grand Total :</td>
                      <td className="num">{fmt(item.opening)}</td>
                      <td className="num">{fmt(item.credit)}</td>
                      <td className="num">{fmt(item.debit)}</td>
                      <td className="num">{fmt(item.closing)}</td>
                      <td></td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

function DateWiseFormattedTable({ data, fromDate, toDate }) {
  if (!data || data.length === 0) return null;

  const first = data[0];
  const bankName = first.BANKNAME || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI";
  const userId = "Rohini";
  const printDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  
  const subGlCode = first.SUBGLCODE || first.Subglcode || "";
  const glName = first.GLNAME || first.GlName || "";
  const title = `${subGlCode} - ${glName} Branch Wise DateWise Product List From ${fromDate} To ${toDate}`;

  // Check if data has dates
  const hasDate = data.some(d => d.ENTRYDATE);

  // Group by BRCD
  const branches = {};
  data.forEach(row => {
    const brcd = Array.isArray(row.BrCD || row.BRCD) ? (row.BrCD || row.BRCD)[0] : (row.BrCD || row.BRCD);
    if (!branches[brcd]) {
      branches[brcd] = [];
    }
    branches[brcd].push(row);
  });

  const items = [];
  let globalIndex = 1;
  let grandCredit = 0;
  let grandDebit = 0;
  let grandClosing = 0;

  Object.keys(branches).forEach(brcd => {
    const branchRows = branches[brcd];
    const branchName = branchRows[0].MIDname || branchRows[0].MIDNAME || branchRows[0].MidName || "HEAD OFFICE";
    
    let sumCredit = 0;
    let sumDebit = 0;
    let branchClosing = 0;

    items.push({ type: "branchHeader", name: `${brcd} - ${branchName}` });

    branchRows.forEach(row => {
      const credit = parseFloat(row.Credit || row.CREDIT) || 0;
      const debit = parseFloat(row.Debit || row.DEBIT) || 0;
      const closing = parseFloat(row.Closing || row.ClosingBal || row.BALANCE) || 0;
      const opening = parseFloat(row.Opening || row.OpeningBal) || 0;
      
      sumCredit += credit;
      sumDebit += debit;
      branchClosing = closing; // the last row's closing is the branch closing

      items.push({
        type: "data",
        index: globalIndex++,
        edate: row.ENTRYDATE ? new Date(row.ENTRYDATE).toLocaleDateString('en-GB').replace(/\//g, '-') : "",
        opening: opening,
        credit: credit,
        debit: debit,
        closing: closing
      });
    });

    items.push({
      type: "branchTotal",
      credit: sumCredit,
      debit: sumDebit,
      closing: branchClosing
    });

    grandCredit += sumCredit;
    grandDebit += sumDebit;
    grandClosing += branchClosing;
  });

  items.push({
    type: "grandTotal",
    credit: grandCredit,
    debit: grandDebit,
    closing: grandClosing
  });

  // Paginate 37 records per page
  const pages = [];
  let currentPage = [];
  let dataCount = 0;
  let lastBranchName = "";

  items.forEach(item => {
    if (item.type === "branchHeader") {
      lastBranchName = item.name;
    }

    if (dataCount >= 37) {
      if (item.type === "data" || item.type === "branchHeader") {
        pages.push(currentPage);
        currentPage = [];
        dataCount = 0;
        if (item.type === "data") {
          currentPage.push({ type: "branchHeader", name: lastBranchName });
        }
      }
    }

    currentPage.push(item);
    if (item.type === "data") {
      dataCount++;
    }
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return (
    <>
      {pages.map((pageItems, pageIndex) => (
        <div key={pageIndex} className="oc-table-wrapper page-break-container">
          <div className="oc-meta-grid">
            <div className="oc-meta-left">
              <div className="oc-meta-row">
                <span className="oc-meta-key">Bank Name</span>
                <span>: {bankName}</span>
              </div>
              <div className="oc-meta-row">
                <span className="oc-meta-key">Branch Name</span>
                <span>: {first.MIDNAME || first.MidName || "HEAD OFFICE"}</span>
              </div>
            </div>
            <div className="oc-meta-right">
              <div className="oc-meta-row">
                <span className="oc-meta-key">User ID</span>
                <span>: {userId}</span>
              </div>
              <div className="oc-meta-row">
                <span className="oc-meta-key">Print Date</span>
                <span>: {printDate}</span>
              </div>
            </div>
          </div>
          
          <div className="oc-title" style={{textAlign: "left", fontSize: "12px"}}>{title}</div>
          
          <table className="oc-table">
            <thead>
              <tr>
                <th>Sr No</th>
                {hasDate && <th>Date</th>}
                <th className="num">Opening</th>
                <th className="num">Credit</th>
                <th className="num">Debit</th>
                <th className="num">Closing</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, i) => {
                if (item.type === "branchHeader") {
                  return (
                    <tr key={i} className="group-row">
                      <td colSpan={hasDate ? 6 : 5} style={{fontStyle: 'italic', textDecoration: 'underline'}}>{item.name}</td>
                    </tr>
                  );
                }
                if (item.type === "data") {
                  return (
                    <tr key={i}>
                      <td>{item.index}</td>
                      {hasDate && <td>{item.edate}</td>}
                      <td className="num">{fmt(item.opening)}</td>
                      <td className="num">{fmt(item.credit)}</td>
                      <td className="num">{fmt(item.debit)}</td>
                      <td className="num">{fmt(item.closing)}</td>
                    </tr>
                  );
                }
                if (item.type === "branchTotal") {
                  return (
                    <tr key={i} style={{ fontWeight: "bold", color: "#000", background: "#fff" }}>
                      <td colSpan={hasDate ? 3 : 2} style={{ textAlign: "right", paddingRight: "10px" }}>BranchWise Balance :</td>
                      <td className="num">{fmt(item.credit)}</td>
                      <td className="num">{fmt(item.debit)}</td>
                      <td className="num">{fmt(item.closing)}</td>
                    </tr>
                  );
                }
                if (item.type === "grandTotal") {
                  return (
                    <tr key={i} style={{ fontWeight: "bold", color: "#000", background: "#fff" }}>
                      <td colSpan={hasDate ? 3 : 2} style={{ textAlign: "right", paddingRight: "10px" }}>Grand Total :</td>
                      <td className="num">{fmt(item.credit)}</td>
                      <td className="num">{fmt(item.debit)}</td>
                      <td className="num">{fmt(item.closing)}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

function SummaryFormattedTable({ data, fromDate, toDate }) {
  if (!data || data.length === 0) return null;

  const first = data[0];
  const bankName = first.BANKNAME || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI";
  const userId = "Rohini";
  const printDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  
  const subGlCode = first.SUBGLCODE || first.Subglcode || "";
  const glName = first.GLNAME || first.GlName || "";
  const title = `${subGlCode} - ${glName} Branch Wise Gl List From ${fromDate} To ${toDate}`;

  let totalOpening = 0;
  let totalCredit = 0;
  let totalDebit = 0;
  let totalClosing = 0;

  const items = data.map((row, index) => {
    const opening = parseFloat(row.Opening || row.OpeningBal) || 0;
    const credit = parseFloat(row.Credit || row.CREDIT) || 0;
    const debit = parseFloat(row.Debit || row.DEBIT) || 0;
    const closing = parseFloat(row.Closing || row.ClosingBal || row.BALANCE) || 0;

    totalOpening += opening;
    totalCredit += credit;
    totalDebit += debit;
    totalClosing += closing;

    const brcd = Array.isArray(row.BrCD || row.BRCD) ? (row.BrCD || row.BRCD)[0] : (row.BrCD || row.BRCD);
    const branchName = row.MIDname || row.MIDNAME || row.MidName || "HEAD OFFICE";

    return {
      index: index + 1,
      brCdStr: `${brcd} - ${branchName}`,
      opening,
      credit,
      debit,
      closing
    };
  });

  return (
    <div className="oc-table-wrapper page-break-container">
      <div className="oc-meta-grid">
        <div className="oc-meta-left">
          <div className="oc-meta-row">
            <span className="oc-meta-key">Bank Name</span>
            <span>: {bankName}</span>
          </div>
          <div className="oc-meta-row">
            <span className="oc-meta-key">Branch Name</span>
            <span>: {first.MIDNAME || first.MidName || "HEAD OFFICE"}</span>
          </div>
        </div>
        <div className="oc-meta-right">
          <div className="oc-meta-row">
            <span className="oc-meta-key">User ID</span>
            <span>: {userId}</span>
          </div>
          <div className="oc-meta-row">
            <span className="oc-meta-key">Print Date</span>
            <span>: {printDate}</span>
          </div>
        </div>
      </div>
      
      <table className="oc-table" style={{marginTop: "10px"}}>
        <thead>
          <tr>
            <th colSpan="6" style={{textAlign: "center", fontSize: "13px", background: "#fff"}}>{title}</th>
          </tr>
          <tr>
            <th style={{textAlign: "center"}}>Sr No</th>
            <th>Br CD</th>
            <th className="num">Opening Bal</th>
            <th className="num">Credit</th>
            <th className="num">Debit</th>
            <th className="num">Closing Bal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{textAlign: "center"}}>{item.index}</td>
              <td>{item.brCdStr}</td>
              <td className="num">{fmt(item.opening)}</td>
              <td className="num">{fmt(item.credit)}</td>
              <td className="num">{fmt(item.debit)}</td>
              <td className="num">{fmt(item.closing)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", color: "#000", background: "#fff" }}>
            <td colSpan="2" style={{ textAlign: "right", paddingRight: "10px" }}>Total :</td>
            <td className="num">{fmt(totalOpening)}</td>
            <td className="num">{fmt(totalCredit)}</td>
            <td className="num">{fmt(totalDebit)}</td>
            <td className="num">{fmt(totalClosing)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BranchwiseGLReport() {
  const [form, setForm] = useState({
    reportType:  "Details",
    branchCode:  "1",
    productType: "",
    productName: "",
    subGLCode:   "",
    fromDate:    "2025-04-01",
    toDate:      "2026-03-30",
  });

  const [reportData,   setReportData]   = useState([]);
  const [columns,      setColumns]      = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [fetched,      setFetched]      = useState(false);
  const [activeAction, setActiveAction] = useState("");
  const debounceRef = useRef(null);

  // Auto-fetch product name when productType changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const code = form.productType.trim();
    const brcd = form.branchCode.trim();
    if (!code || !brcd) {
      setForm(f => ({ ...f, productName: "" }));
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/gl-report/product-name?subglcode=${encodeURIComponent(code)}&brcd=${encodeURIComponent(brcd)}`);
        if (res.ok) {
          const data = await res.json();
          setForm(f => ({ ...f, productName: data.GLNAME || "" }));
        }
      } catch (e) {
        // silently fail
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [form.productType, form.branchCode]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFetched(false);
    setError("");
  };

  // ── validate ──────────────────────────────────────────────
  function validate(action) {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (!isValidDate(form.fromDate)) return "From Date must be in DD/MM/YYYY format.";
    if (!isValidDate(form.toDate))   return "To Date must be in DD/MM/YYYY format.";

    if (!form.productType.trim()) return "Product Type is required.";
    return null;
  }

  // ── build URL ─────────────────────────────────────────────
  function buildURL(action) {
    const fromISO = toISO(form.fromDate);
    const toISO_  = toISO(form.toDate);

    if (action === "Report Print") {
      const p = new URLSearchParams({
        Brcd: form.branchCode.trim(),
        pat:  form.productType.trim(),
        PFDT: fromISO,
        PTDT: toISO_,
      });
      return `${API_BASE_URL}/api/branch-wise-gl/details?${p}`;
    }

    if (action === "Opening Closing Details") {
      const p = new URLSearchParams({
        Brcd: form.branchCode.trim(),
        pat:  form.productType.trim(),
        PFDT: fromISO,
        PTDT: toISO_,
      });
      return `${API_BASE_URL}/api/branch-wise-gl/details-opening-closing?${p}`;
    }

    if (action === "DateWise") {
      const p = new URLSearchParams({
        Brcd:      form.branchCode.trim(),
        SubGlCode: form.productType.trim(),
        FromDate:  fromISO,
        ToDate:    toISO_,
      });
      return `${API_BASE_URL}/api/branch-wise-gl/datewise?${p}`;
    }

    if (action === "Summary") {
      const p = new URLSearchParams({
        Brcd:      form.branchCode.trim(),
        SubGlCode: form.productType.trim(),
        FromDate:  fromISO,
        ToDate:    toISO_,
      });
      return `${API_BASE_URL}/api/branch-wise-gl/summary?${p}`;
    }

    return null;
  }

  // ── fetch ─────────────────────────────────────────────────
  const callAPI = async (action) => {
    const validErr = validate(action);
    if (validErr) { setError(validErr); return null; }

    const url = buildURL(action);
    if (!url) { setError("Unknown action."); return null; }

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
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setReportData(data);
      setFetched(true);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    const action = form.reportType === "Details" ? "Report Print"
                 : form.reportType === "DateWise" ? "DateWise"
                 : "Summary";
    const data = fetched ? reportData : await callAPI(action);
    if (data && data.length > 0) setTimeout(() => window.print(), 400);
  };

  return (
    <div className="bgl-wrapper">
      <div className="bgl-card no-print">
        <div className="bgl-header">BranchWise GL Report</div>

        <div className="bgl-form-section">

          {/* Report type radios */}
          <div className="bgl-radio-row">
            {["Details", "DateWise", "Summary"].map((opt) => (
              <label key={opt} className="bgl-radio-label">
                <input type="radio" name="reportType" value={opt}
                  checked={form.reportType === opt} onChange={handleChange} />
                {opt}
              </label>
            ))}
          </div>

          {/* Branch Code */}
          <div className="bgl-row">
            <label className="bgl-label">Branch Code <span className="req">*</span></label>
            <input className="bgl-input bgl-input-shaded" name="branchCode"
              value={form.branchCode} onChange={handleChange} />
          </div>

          {/* Product Type + Name */}
          <div className="bgl-row">
            <label className="bgl-label">Product Type <span className="req">*</span></label>
            <input className="bgl-input" name="productType"
              placeholder="e.g. S or 1" value={form.productType} onChange={handleChange} />
            <input className="bgl-input bgl-input-wide" name="productName"
              placeholder="Product Name (display only)" value={form.productName} readOnly />
          </div>

          {/* From / To Date */}
          <div className="bgl-row">
            <label className="bgl-label">From Date <span className="req">*</span></label>
            <input type="date" className="bgl-input" name="fromDate"
              value={form.fromDate} onChange={handleChange} />
            <label className="bgl-inline-label">To Date <span className="req">*</span></label>
            <input type="date" className="bgl-input" name="toDate"
              value={form.toDate} onChange={handleChange} />
          </div>

          {/* Error */}
          {error && <p className="bgl-error">{error}</p>}

          {/* Loading bar */}
          {loading && (
            <div className="bgl-loading-bar">
              <div className="bgl-loading-fill" />
            </div>
          )}

        </div>

        {/* Footer buttons */}
        <div className="bgl-footer">
          {form.reportType === "Details" && (
            <>
              <button className={`bgl-btn${activeAction === "Report Print" && fetched ? " bgl-btn-active" : ""}`}
                onClick={() => callAPI("Report Print")} disabled={loading}>
                {loading && activeAction === "Report Print" ? "Loading…" : "Report Print"}
              </button>
              <button className={`bgl-btn${activeAction === "Opening Closing Details" && fetched ? " bgl-btn-active" : ""}`}
                onClick={() => callAPI("Opening Closing Details")} disabled={loading}>
                {loading && activeAction === "Opening Closing Details" ? "Loading…" : "Opening Closing Details"}
              </button>
            </>
          )}
          {form.reportType === "DateWise" && (
            <button className={`bgl-btn${activeAction === "DateWise" && fetched ? " bgl-btn-active" : ""}`}
              onClick={() => callAPI("DateWise")} disabled={loading}>
              {loading && activeAction === "DateWise" ? "Loading…" : "DateWise Report"}
            </button>
          )}
          {form.reportType === "Summary" && (
            <button className={`bgl-btn${activeAction === "Summary" && fetched ? " bgl-btn-active" : ""}`}
              onClick={() => callAPI("Summary")} disabled={loading}>
              {loading && activeAction === "Summary" ? "Loading…" : "Summary Report"}
            </button>
          )}
          <button className="bgl-btn bgl-btn-print" onClick={handlePrint} disabled={loading}>
            Print
          </button>
        </div>
      </div>

      {/* Results table */}
      {fetched && reportData.length > 0 && (
        <div className="bgl-table-wrapper">
          {activeAction === "Opening Closing Details" ? (
            <OpeningClosingFormattedTable 
              data={reportData} 
              fromDate={form.fromDate} 
              toDate={form.toDate} 
            />
          ) : activeAction === "DateWise" ? (
            <DateWiseFormattedTable 
              data={reportData} 
              fromDate={form.fromDate} 
              toDate={form.toDate} 
            />
          ) : activeAction === "Summary" ? (
            <SummaryFormattedTable 
              data={reportData} 
              fromDate={form.fromDate} 
              toDate={form.toDate} 
            />
          ) : (
            <>
              <div className="print-only bgl-print-header">
                <h2>BranchWise GL Report — {form.reportType}</h2>
                <p>
                  Branch: {form.branchCode} &nbsp;|&nbsp;
                  From: {form.fromDate} &nbsp;|&nbsp;
                  To: {form.toDate} &nbsp;|&nbsp;
                  Date Printed: {new Date().toLocaleDateString()}
                </p>
              </div>

              <table className="bgl-table">
                <thead>
                  <tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {reportData.map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => <td key={col}>{typeof row[col] === 'number' ? fmt(row[col]) : (row[col] ?? "")}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <p className="bgl-record-count no-print">Total Records: {reportData.length}</p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="bgl-error no-print" style={{ margin: "16px" }}>
          No records found for the given criteria.
        </p>
      )}
    </div>
  );
}

export default BranchwiseGLReport;