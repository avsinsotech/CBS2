

import { useState, useEffect, useRef } from "react";
import "./GeneralLedgerWise.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Format numbers with 2 decimal places and Indian locale
const fmt = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return v ?? "";
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// DD/MM/YYYY → YYYY-MM-DD
const parseDate = (raw) => {
  if (!raw) return null;
  if (raw.includes("-")) return raw; // already YYYY-MM-DD format
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`;
};

function SummaryFormattedTable({ data, fromDate, toDate, form }) {
  if (!data || data.length === 0) return null;

  const first = data[0];
  const bankName = first.BANKNAME || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI";
  const userId = "Rohini";
  const printDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  
  const subGlCode = form.productTypeInput || "";
  const glName = form.productName || "";
  const formattedFromDate = fromDate ? fromDate.split('-').reverse().join('/') : "";
  const formattedToDate = toDate ? toDate.split('-').reverse().join('/') : "";
  const title = `${subGlCode} - ${glName} Office Account Statement report From ${formattedFromDate} To ${formattedToDate}`;

  let totalPayment = 0;
  let totalReceipt = 0;

  const items = data.map((row, index) => {
    const edate = row.EDATE || (row.ENTRYDATE ? new Date(row.ENTRYDATE).toLocaleDateString('en-GB').replace(/\//g, '-') : "");
    const setno = row.SETNO || "";
    let parti = row.PARTI || "";
    if (row.PARTI1) parti += " " + row.PARTI1;
    if (row.Activity && parti === "") parti = row.Activity;
    
    const credit = parseFloat(row.Credit || row.CREDIT) || 0;
    const debit = parseFloat(row.Debit || row.DEBIT) || 0;
    const closing = parseFloat(row.Closing || row.ClosingBal || row.BALANCE) || 0;

    totalPayment += debit;
    totalReceipt += credit;

    return {
      index: index + 1,
      edate,
      setno,
      parti,
      payment: debit,
      receipt: credit,
      closing,
      type: closing >= 0 ? "CR" : "DR"
    };
  });

  return (
    <div className="oc-table-wrapper summary-border-override">
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
      
      <table className="oc-table">
        <thead>
          <tr>
            <th colSpan="8" className="title-row">{title}</th>
          </tr>
          <tr>
            <th style={{textAlign: "center"}}>Sr no</th>
            <th style={{textAlign: "center", width: "90px"}}>Voucher DT</th>
            <th style={{textAlign: "center", width: "60px"}}>Set No</th>
            <th>Narration</th>
            <th className="num">CREDIT</th>
            <th className="num">DEBIT</th>
            <th className="num">BALANCE</th>
            <th style={{textAlign: "center"}}>DR/CR</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{textAlign: "center"}}>{item.index}</td>
              <td style={{textAlign: "center"}}>{item.edate}</td>
              <td style={{textAlign: "center"}}>{item.setno}</td>
              <td style={{maxWidth: "300px", whiteSpace: "normal"}}>{item.parti}</td>
              <td className="num">{item.receipt > 0 ? fmt(item.receipt) : ""}</td>
              <td className="num">{item.payment > 0 ? fmt(item.payment) : ""}</td>
              <td className="num">{fmt(Math.abs(item.closing))}</td>
              <td style={{textAlign: "center"}}>{item.type}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", color: "#000", background: "#fff" }}>
            <td colSpan="4" style={{ textAlign: "right", paddingRight: "10px" }}>Total :</td>
            <td className="num">{fmt(totalReceipt)}</td>
            <td className="num">{fmt(totalPayment)}</td>
            <td colSpan="2"></td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}

function DetailsFormattedTable({ data, fromDate, toDate, form }) {
  if (!data || data.length === 0) return null;

  const first = data[0];
  const bankName = first.BANKNAME || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI";
  const userId = "Rohini";
  const printDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  
  const subGlCode = form.productTypeInput || "";
  const glName = form.productName || "";
  const formattedFromDate = fromDate ? fromDate.split('-').reverse().join('/') : "";
  const formattedToDate = toDate ? toDate.split('-').reverse().join('/') : "";
  const title = `${subGlCode} - ${glName} Office Account Statement report From ${formattedFromDate} To ${formattedToDate}`;

  let totalPayment = 0;
  let totalReceipt = 0;

  const items = data.map((row, index) => {
    const edate = row.EDATE || (row.ENTRYDATE ? new Date(row.ENTRYDATE).toLocaleDateString('en-GB').replace(/\//g, '-') : "");
    const custno = row.CUSTNO || row.CustNo || (row.ACCNO ? "0" : "");
    const accno = row.ACCNO || "";
    const custname = row.CUSTNAME || "";
    const setno = row.SETNO || "";
    let parti = row.PARTI || "";
    if (row.PARTI1) parti += " " + row.PARTI1;
    const paymentMode = row.Activity || "";
    const chequeNo = row.INSTNO || (row.ACCNO ? "000000" : "");
    const bankNameRow = row.BankName || "";
    
    const credit = parseFloat(row.Credit || row.CREDIT) || 0;
    const debit = parseFloat(row.Debit || row.DEBIT) || 0;
    const closing = parseFloat(row.Closing || row.ClosingBal || row.BALANCE) || 0;

    totalPayment += debit;
    totalReceipt += credit;

    return {
      index: index + 1,
      edate,
      custno,
      accno,
      custname,
      setno,
      parti,
      paymentMode,
      chequeNo,
      bankNameRow,
      payment: debit,
      receipt: credit,
      closing,
      type: closing >= 0 ? "CR" : "DR"
    };
  });

  return (
    <div className="oc-table-wrapper summary-border-override">
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
      
      <table className="oc-table details-table">
        <thead>
          <tr>
            <th colSpan="14" className="title-row">{title}</th>
          </tr>
          <tr>
            <th style={{textAlign: "center"}}>ID</th>
            <th style={{textAlign: "center", width: "75px"}}>DATE</th>
            <th>Cust No</th>
            <th>ACC NO</th>
            <th>CUST NAME</th>
            <th style={{textAlign: "center"}}>SETNO</th>
            <th>Particulars</th>
            <th>Payment Mode</th>
            <th>Cheque NO</th>
            <th>Bank Name</th>
            <th className="num">DEBIT</th>
            <th className="num">CREDIT</th>
            <th className="num">BALANCE</th>
            <th style={{textAlign: "center"}}>DRCR</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{textAlign: "center"}}>{item.index}</td>
              <td style={{textAlign: "center"}}>{item.edate}</td>
              <td>{item.custno}</td>
              <td>{item.accno}</td>
              <td style={{whiteSpace: "nowrap"}}>{item.custname}</td>
              <td style={{textAlign: "center"}}>{item.setno}</td>
              <td style={{maxWidth: "200px", whiteSpace: "normal"}}>{item.parti}</td>
              <td>{item.paymentMode}</td>
              <td>{item.chequeNo}</td>
              <td>{item.bankNameRow}</td>
              <td className="num">{item.payment.toFixed(2)}</td>
              <td className="num">{item.receipt.toFixed(2)}</td>
              <td className="num">{fmt(Math.abs(item.closing))}</td>
              <td style={{textAlign: "center"}}>{item.type}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", color: "#000", background: "#fff" }}>
            <td colSpan="10" style={{ textAlign: "right", paddingRight: "10px" }}>Total :</td>
            <td className="num">{totalPayment.toFixed(2)}</td>
            <td className="num">{totalReceipt.toFixed(2)}</td>
            <td colSpan="2"></td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}

function DayWiseFormattedTable({ data, fromDate, toDate, form }) {
  if (!data || data.length === 0) return null;

  const first = data[0];
  const bankName = first.BANKNAME || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI";
  const userId = "Rohini";
  const printDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  
  const subGlCode = form.productTypeInput || "";
  const glName = form.productName || "";
  const title = `${subGlCode} - ${glName} Product Summary From ${fromDate} To ${toDate}`;

  let totalPayment = 0;
  let totalReceipt = 0;

  const items = data.map((row, index) => {
    const edate = row.ENTRYDATE ? new Date(row.ENTRYDATE).toLocaleDateString('en-GB').replace(/\//g, '-') : "";
    const opening = parseFloat(row.Opening || row.OpeningBal) || 0;
    const credit = parseFloat(row.Credit || row.CREDIT) || 0;
    const debit = parseFloat(row.Debit || row.DEBIT) || 0;
    const closing = parseFloat(row.Closing || row.ClosingBal || row.BALANCE) || 0;

    totalPayment += debit;
    totalReceipt += credit;

    return {
      index: index + 1,
      edate,
      opening,
      payment: debit,
      receipt: credit,
      closing,
      type: closing >= 0 ? "CR" : "DR"
    };
  });

  const groupName = `${subGlCode} - ${glName}`;

  return (
    <div className="oc-table-wrapper">
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
      
      <table className="oc-table">
        <thead>
          <tr>
            <th colSpan="7" className="title-row">{title}</th>
          </tr>
          <tr>
            <th style={{textAlign: "center"}}>Sr No</th>
            <th>Effect Date</th>
            <th className="num">Opening Balance</th>
            <th className="num">Payment</th>
            <th className="num">Receipt</th>
            <th className="num">Closing Balance</th>
            <th style={{textAlign: "center"}}>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr className="group-row">
            <td colSpan="7" style={{fontStyle: 'italic', textDecoration: 'underline', color: '#000'}}>{groupName}</td>
          </tr>
          {items.map((item, i) => (
            <tr key={i}>
              <td style={{textAlign: "center"}}>{item.index}</td>
              <td>{item.edate}</td>
              <td className="num">{fmt(item.opening)}</td>
              <td className="num">{fmt(item.payment)}</td>
              <td className="num">{fmt(item.receipt)}</td>
              <td className="num">{fmt(Math.abs(item.closing))}</td>
              <td style={{textAlign: "center"}}>{item.type}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", color: "#000", background: "#fff" }}>
            <td colSpan="3" style={{ textAlign: "right", paddingRight: "10px" }}>Total :</td>
            <td className="num">{fmt(totalPayment)}</td>
            <td className="num">{fmt(totalReceipt)}</td>
            <td colSpan="2"></td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}

function MonthWiseFormattedTable({ data, fromDate, toDate, form }) {
  if (!data || data.length === 0) return null;

  const first = data[0];
  const bankName = first.BANKNAME || "SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI";
  const userId = "Rohini";
  const printDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  
  const formattedFromDate = fromDate ? fromDate.split('-').reverse().join('/') : "";
  const formattedToDate = toDate ? toDate.split('-').reverse().join('/') : "";
  const title = `Product Summary From ${formattedFromDate} To ${formattedToDate}`;

  let totalOpening = 0;
  let totalCredit = 0;
  let totalDebit = 0;
  let totalClosing = 0;

  const items = data.map((row, index) => {
    const dateVal = row.Date || row.ENTRYDATE || row.Month || row.month || "";
    const opening = parseFloat(row.Opening || row.OpeningBal || row["Opening Bal"] || row.OPENING) || 0;
    const credit = parseFloat(row.Credit || row.CREDIT || row.Receipt || row.RECEIPT) || 0;
    const debit = parseFloat(row.Debit || row.DEBIT || row.Payment || row.PAYMENT) || 0;
    const closing = parseFloat(row.Closing || row.ClosingBal || row["Closing Bal"] || row.BALANCE) || 0;

    totalOpening += opening;
    totalCredit += credit;  
    totalDebit += debit;
    totalClosing += closing;

    return {
      index: index + 1,
      dateVal,
      opening,
      credit,
      debit,
      closing
    };
  });

  return (
    <div className="oc-table-wrapper summary-border-override">
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
      
      <table className="oc-table">
        <thead>
          <tr>
            <th colSpan="6" className="title-row">{title}</th>
          </tr>
          <tr>
            <th style={{textAlign: "center"}}>Sr No</th>
            <th>Date</th>
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
              <td>{item.dateVal}</td>
              <td className="num">{fmt(item.opening)}</td>
              <td className="num">{fmt(item.credit)}</td>
              <td className="num">{fmt(item.debit)}</td>
              <td className="num">{fmt(item.closing)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", color: "#000", background: "#fff" }}>
            <td colSpan="2" style={{ textAlign: "right", paddingRight: "10px" }}></td>
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

function GeneralLedgerWise() {
  const [form, setForm] = useState({
    reportType:       "Details",
    productType:      "Sub Type",
    branchCode:       "1",
    productTypeInput: "",
    productName:      "",
    fromDate:         "2025-04-01",
    toDate:           "2026-03-30"
  });

  const [reportData, setReportData] = useState([]);
  const [columns,    setColumns]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [fetched,    setFetched]    = useState(false);
  const [printMode,  setPrintMode]  = useState(""); // "report" | "summary"
  const debounceRef = useRef(null);

  // Auto-fetch product name when productTypeInput changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const code = form.productTypeInput.trim();
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
  }, [form.productTypeInput, form.branchCode]);

  // Dynamically manage print orientation style to override any other loaded stylesheets
  useEffect(() => {
    const existing = document.getElementById("print-page-style-override");
    if (existing) {
      existing.remove();
    }

    const style = document.createElement("style");
    style.id = "print-page-style-override";
    
    const size = form.reportType === "Details" ? "legal landscape" : "A4 portrait";
    const margin = form.reportType === "Details" ? "5mm" : "10mm";
    
    style.innerHTML = `
      @media print {
        @page {
          size: ${size};
          margin: ${margin};
        }
      }
    `;
    document.body.appendChild(style);

    return () => {
      const el = document.getElementById("print-page-style-override");
      if (el) {
        el.remove();
      }
    };
  }, [form.reportType, printMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFetched(false);
  };

  const validate = () => {
    if (!form.branchCode.trim())       return "Branch Code is required.";
    if (!form.productTypeInput.trim()) return "Product Type is required.";
    if (!form.fromDate.trim())         return "From Date is required.";
    if (!form.toDate.trim())           return "To Date is required.";
    if (!parseDate(form.fromDate))     return "From Date must be DD/MM/YYYY.";
    if (!parseDate(form.toDate))       return "To Date must be DD/MM/YYYY.";
    return null;
  };

  // Build query params based on which SP is needed
  const buildParams = (mode) => {
    const PFDT   = parseDate(form.fromDate);
    const PTDT   = parseDate(form.toDate);
    const isMain = form.productType === "Main Type" ? "Y" : "N";

    // SP_OFFICEACCSTATUS_R params (Details for both Report & Summary,
    // plus Day Wise & Month Wise for Summary)
    const officeParams = new URLSearchParams({
      pfmonth:    PFDT.slice(5, 7),
      ptmonth:    PTDT.slice(5, 7),
      PFDT,
      PTDT,
      pfyear:     PFDT.slice(0, 4),
      ptyear:     PTDT.slice(0, 4),
      pat:        form.productTypeInput.trim(),
      BRCD:       form.branchCode.trim(),
      isMainType: isMain
    });

    // RptGLWiseTransDetails / RptGLWiseTransMonthWise params
    const glWiseParams = new URLSearchParams({
      Brcd:       form.branchCode.trim(),
      SubGlCode:  form.productTypeInput.trim(),
      FromDate:   PFDT,
      ToDate:     PTDT,
      isMainType: isMain
    });

    if (mode === "report") {
      if (form.reportType === "Details")    return { url: "/api/product-wise-summary/report/details",    params: officeParams };
      if (form.reportType === "Day Wise")   return { url: "/api/product-wise-summary/report/day-wise",   params: glWiseParams };
      if (form.reportType === "Month Wise") return { url: "/api/product-wise-summary/report/month-wise", params: glWiseParams };
    } else {
      if (form.reportType === "Details")    return { url: "/api/product-wise-summary/summary/details",    params: officeParams };
      if (form.reportType === "Day Wise")   return { url: "/api/product-wise-summary/summary/day-wise",   params: officeParams };
      if (form.reportType === "Month Wise") return { url: "/api/product-wise-summary/summary/month-wise", params: officeParams };
    }
  };

  const fetchData = async (mode) => {
    const validationError = validate();
    if (validationError) { setError(validationError); return null; }

    setLoading(true);
    setError("");
    setPrintMode(mode);

    try {
      const { url, params } = buildParams(mode);
      const res  = await fetch(`${API_BASE_URL}${url}?${params}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }

      const json = await res.json();
      // Both response shapes: { total, data: [...] }  or  plain array
      const rows = Array.isArray(json) ? json : (json.data || []);

      setColumns(rows.length > 0 ? Object.keys(rows[0]) : []);
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

  const handleReportPrint = async () => {
    const data = (fetched && printMode === "report") ? reportData : await fetchData("report");
    if (data && data.length > 0) setTimeout(() => window.print(), 300);
  };

  const handleSummaryPrint = async () => {
    const data = (fetched && printMode === "summary") ? reportData : await fetchData("summary");
    if (data && data.length > 0) setTimeout(() => window.print(), 300);
  };

  return (
    <div className="glw-wrapper">
      <style type="text/css">
        {`
          @media print {
            body, html, #root, .glw-wrapper, .layout-body, .main-content { background: #fff !important; }
            
            .oc-table-wrapper { width: 100% !important; margin: 0 !important; }
            .oc-table { font-size: 12px !important; width: 100% !important; }
            .oc-table th, .oc-table td { 
              padding: 4px 6px !important; 
              border: 1px solid #000 !important; 
              font-size: 12px !important;
            }
            .summary-border-override .oc-table th, .summary-border-override .oc-table td {
              border: 1px solid #ccc !important;
            }
            .details-table th, .details-table td {
              font-size: 10px !important;
              padding: 3px 4px !important;
              border: 1px solid #ccc !important;
            }
            .oc-table th.title-row { 
              border-top: 2px solid #000 !important; 
              border-bottom: 2px solid #000 !important; 
              border-left: none !important; 
              border-right: none !important; 
              font-size: 14px !important; 
              padding: 6px 6px !important;
            }
            .oc-meta-grid { font-size: 12px !important; margin-bottom: 10px !important; }
          }
        `}
      </style>
      <div className="glw-card no-print">

        {/* HEADER */}
        <div className="glw-header">
          <span>Product Wise Summary</span>
        </div>

        {/* BODY */}
        <div className="glw-body">

          {/* REPORT TYPE */}
          <div className="glw-row">
            <label className="glw-label">Report Type : <span className="req">*</span></label>
            <div className="glw-radio-group">
              {["Details", "Day Wise", "Month Wise"].map((opt) => (
                <label key={opt} className="glw-radio-label">
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

          {/* PRODUCT TYPE RADIO */}
          <div className="glw-row">
            <label className="glw-label">Product Type : <span className="req">*</span></label>
            <div className="glw-radio-group">
              {["Main Type", "Sub Type"].map((opt) => (
                <label key={opt} className="glw-radio-label">
                  <input
                    type="radio"
                    name="productType"
                    value={opt}
                    checked={form.productType === opt}
                    onChange={handleChange}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* BRANCH CODE */}
          <div className="glw-row">
            <label className="glw-label">Branch Code : <span className="req">*</span></label>
            <input
              className="glw-input glw-input-short glw-input-shaded"
              name="branchCode"
              value={form.branchCode}
              onChange={handleChange}
            />
          </div>

          {/* PRODUCT TYPE INPUT + PRODUCT NAME */}
          <div className="glw-row">
            <label className="glw-label">Product Type : <span className="req">*</span></label>
            <div className="glw-inline-pair">
              <input
                className="glw-input"
                name="productTypeInput"
                placeholder="Product Type"
                value={form.productTypeInput}
                onChange={handleChange}
              />
              <input
                className="glw-input glw-input-wide"
                name="productName"
                placeholder="Product Name"
                value={form.productName}
                readOnly
              />
            </div>
          </div>

          {/* FROM DATE + TO DATE */}
          <div className="glw-row">
            <label className="glw-label">From Date : <span className="req">*</span></label>
            <div className="glw-inline-pair">
              <input
                type="date"
                className="glw-input"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
              />
              <label className="glw-inline-label">To Date : <span className="req">*</span></label>
              <input
                type="date"
                className="glw-input"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ERROR / LOADING */}
          {error   && <p className="glw-error">{error}</p>}
          {loading && <p className="glw-loading">Loading... this may take up to 60 seconds.</p>}

        </div>

        {/* FOOTER BUTTONS */}
        <div className="glw-footer">
          <button className="glw-btn" onClick={handleReportPrint}  disabled={loading}>
            {loading && printMode === "report"  ? "Loading..." : "Report Print"}
          </button>
          <button className="glw-btn" onClick={handleSummaryPrint} disabled={loading}>
            {loading && printMode === "summary" ? "Loading..." : "Summary Report Print"}
          </button>
        </div>

      </div>

      {/* REPORT TABLE */}
      {fetched && reportData.length > 0 && (
        printMode === "summary" ? (
          <SummaryFormattedTable data={reportData} fromDate={form.fromDate} toDate={form.toDate} form={form} />
        ) : form.reportType === "Day Wise" && printMode === "report" ? (
          <DayWiseFormattedTable data={reportData} fromDate={form.fromDate} toDate={form.toDate} form={form} />
        ) : form.reportType === "Details" && printMode === "report" ? (
          <DetailsFormattedTable data={reportData} fromDate={form.fromDate} toDate={form.toDate} form={form} />
        ) : form.reportType === "Month Wise" && printMode === "report" ? (
          <MonthWiseFormattedTable data={reportData} fromDate={form.fromDate} toDate={form.toDate} form={form} />
        ) : (
          <div className="glw-table-wrapper">

            {/* Print header */}
            <div className="print-only glw-print-header">
              <h2>
                {printMode === "summary" ? "Summary Report" : "Report"} —{" "}
                {form.reportType}
              </h2>
              <p>
                Branch: {form.branchCode} &nbsp;|&nbsp;
                Product Type: {form.productTypeInput} ({form.productType}) &nbsp;|&nbsp;
                {form.fromDate} to {form.toDate} &nbsp;|&nbsp;
                Printed: {new Date().toLocaleDateString()}
              </p>
            </div>

            <table className="glw-table">
              <thead>
                <tr>
                  {columns.map((col) => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col}>{typeof row[col] === 'number' ? fmt(row[col]) : (row[col] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="glw-record-count no-print">
              Total Records: {reportData.length}
            </p>
          </div>
        )
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="glw-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default GeneralLedgerWise;