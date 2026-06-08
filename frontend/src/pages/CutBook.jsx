import { useState } from "react";
import { fetchCuteBookDetails } from "../api/api";
import "./CutBook.css";

function formatDateToDMY(dateStr) {
  if (!dateStr) return "";
  // If ISO datetime string
  if (dateStr.includes("T")) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  }
  return dateStr;
}

function getCurrentTimeFormatted() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; 
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

export default function CutBook() {
  const [reportType, setReportType] = useState("asOnDate");
  const [productType, setProductType] = useState("");
  const [productName, setProductName] = useState("");
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2026-03-30");
  const [customerType, setCustomerType] = useState("0");
  const [accountType, setAccountType] = useState("0");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeFlag, setActiveFlag] = useState("ALL");
  const [fetched, setFetched] = useState(false);

  const brcd = "1";

  const callAPI = async (flag) => {
    if (!fromDate || !toDate) {
      setError("Please fill From Date and To Date.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    setFetched(false);
    setActiveFlag(flag);
    try {
      const data = await fetchCuteBookDetails({
        brcd,
        subglcode: productType,
        fromDate,
        toDate,
        custtype: customerType,
        acctype: accountType,
        flag,
        amount,
      });
      setResults(data);
      setFetched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setReportType("asOnDate");
    setProductType("");
    setProductName("");
    setFromDate("2025-04-01");
    setToDate("2026-03-30");
    setCustomerType("0");
    setAccountType("0");
    setAmount("");
    setResults(null);
    setError(null);
    setFetched(false);
  };

  const handleTextReportView = () => {
    if (!fromDate || !toDate) {
      setError("Please fill From Date and To Date.");
      return;
    }
    const params = new URLSearchParams({
      brcd,
      subglcode: productType,
      fromDate,
      toDate,
      custtype: customerType,
      acctype: accountType,
      flag: "TEXT",
      amount,
    });
    const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";
    window.open(`${API_BASE_URL}/api/cute-book-details/text-report-view?${params}`, "_blank");
  };

  const handleDownloadCsv = () => {
    if (!results || !results.data || !results.data.length) return;
    
    const headers = [
      "Sr No", "GL Code", "Sub GL", "Branch", "Account No", "Old Acc No", 
      "Customer Name", "Opening Balance", "Receipt (Cr)", "Payment (Dr)", "Closing Balance", 
      "Status", "Opening Date", "Last Trx Date"
    ].join(',');

    const rows = results.data.map((row, index) => {
      return [
        index + 1,
        `"${row.GLCODE ?? ''}"`,
        `"${row.SUBGLCODE ?? ''}"`,
        `"${row.BrCD ?? ''}"`,
        `"${row.ACCno ?? ''}"`,
        `"${row.DACCNO ?? ''}"`,
        `"${row.CUSTNAME ?? ''}"`,
        parseFloat(row.Opening || 0).toFixed(2),
        parseFloat(row.CrAmount || 0).toFixed(2),
        parseFloat(row.DrAmount || 0).toFixed(2),
        parseFloat(row.Closing || 0).toFixed(2),
        `"${row.ACC_STATUS ?? ''}"`,
        `"${formatDateToDMY(row.OpeningDate)}"`,
        `"${formatDateToDMY(row.LASTTRXDATE)}"`
      ].join(',');
    });

    const { openingTotal, crTotal, drTotal, closingTotal } = calculateTotals();
    rows.push([
      "Total",
      "",
      "",
      "",
      "",
      "",
      "",
      openingTotal.toFixed(2),
      crTotal.toFixed(2),
      drTotal.toFixed(2),
      closingTotal.toFixed(2),
      "",
      "",
      ""
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cut_book_report_${fromDate}_to_${toDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateTotals = () => {
    let openingTotal = 0;
    let crTotal = 0;
    let drTotal = 0;
    let closingTotal = 0;
    if (results && results.data) {
      results.data.forEach((row) => {
        openingTotal += parseFloat(row.Opening || 0);
        crTotal += parseFloat(row.CrAmount || 0);
        drTotal += parseFloat(row.DrAmount || 0);
        closingTotal += parseFloat(row.Closing || 0);
      });
    }
    return { openingTotal, crTotal, drTotal, closingTotal };
  };

  const getReportFlagLabel = (flag) => {
    switch (flag) {
      case "ALL": return "Cut Book";
      case "REPORT": return "Cut Book Report";
      case "BALANCE": return "Balance Book with Op Bal.";
      case "ACWISE": return "Cut Book A/C Wise";
      default: return "Cut Book Report";
    }
  };

  const { openingTotal, crTotal, drTotal, closingTotal } = calculateTotals();

  return (
    <div className="cutbook-wrapper">
      <div className="cutbook-card no-print">
        <div className="cutbook-header">
          <span>Cut Book Report</span>
        </div>

        <div className="cutbook-form-section">
          {/* Radio Row */}
          <div className="cutbook-row">
            <label className="cutbook-label">Report Type</label>
            <div style={{ display: "flex", gap: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151" }}>
                <input type="radio" name="reportType" value="asOnDate" checked={reportType === "asOnDate"} onChange={() => setReportType("asOnDate")} />
                As On Date
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151" }}>
                <input type="radio" name="reportType" value="dateWise" checked={reportType === "dateWise"} onChange={() => setReportType("dateWise")} />
                Date Wise
              </label>
            </div>
          </div>

          {/* Product Type Row */}
          <div className="cutbook-row">
            <label className="cutbook-label">Product Type</label>
            <input className="cutbook-input" style={{ width: 160 }} type="text" placeholder="Product Type" value={productType} onChange={(e) => setProductType(e.target.value)} />
            <input className="cutbook-input" style={{ width: 340 }} type="text" placeholder="PRODUCT NAME" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>

          {/* From / To Date Row */}
          <div className="cutbook-row">
            <label className="cutbook-label">From Date</label>
            <input className="cutbook-input" style={{ width: 160 }} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <span className="cutbook-inline-label" style={{ minWidth: 80, textAlign: "right", marginRight: 8 }}>To Date</span>
            <input className="cutbook-input" style={{ width: 160 }} type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          {/* Customer Type / Amount Row */}
          <div className="cutbook-row">
            <label className="cutbook-label">Customer Type</label>
            <select className="cutbook-select" style={{ width: 160 }} value={customerType} onChange={(e) => setCustomerType(e.target.value)}>
              <option value="0">--Select--</option>
              <option value="1">Individual</option>
              <option value="3">Corporate</option>
              <option value="2">Joint</option>
            </select>
            <span className="cutbook-inline-label" style={{ minWidth: 80, textAlign: "right", marginRight: 8 }}>Amount</span>
            <input className="cutbook-input" style={{ width: 160 }} type="number" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          {/* Account Category Row */}
          <div className="cutbook-row">
            <label className="cutbook-label">Account Category</label>
            <select className="cutbook-select" style={{ width: 200 }} value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <option value="0">--Select--</option>
              <option value="1">Normal</option>
              <option value="2">Senior Citizen</option>
              <option value="3">Staff</option>
            </select>
          </div>
        </div>

        {error && <p className="cutbook-error" style={{ margin: "0 20px 10px 20px" }}>⚠️ {error}</p>}

        {loading && (
          <div className="cutbook-loading-bar" style={{ margin: "0 20px 10px 20px", width: "calc(100% - 40px)" }}>
            <div className="cutbook-loading-fill" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="cutbook-btn-row">
          <button className="cutbook-btn cutbook-btn-outline" onClick={() => callAPI("ALL")} disabled={loading}>Cut Book</button>
          <button className="cutbook-btn cutbook-btn-blue" onClick={() => callAPI("REPORT")} disabled={loading}>Cut Book Report</button>
          <button className="cutbook-btn cutbook-btn-blue" onClick={handleTextReportView} disabled={loading}>Download Text Report</button>
          <button className="cutbook-btn cutbook-btn-blue" onClick={() => callAPI("BALANCE")} disabled={loading}>Balance Book with Op Bal.</button>
          <button className="cutbook-btn cutbook-btn-blue" onClick={() => callAPI("ACWISE")} disabled={loading}>Cut Book A/C Wise</button>
          <button className="cutbook-btn cutbook-btn-secondary" onClick={handleClearAll} disabled={loading}>Clear All</button>
        </div>
      </div>

      {/* Output Results Section */}
      {fetched && results && results.data && results.data.length > 0 && (
        <>
          {/* Action Toolbar */}
          <div className="cutbook-preview-toolbar no-print">
            <span className="cutbook-preview-title">Cut Book Report — Preview</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="cutbook-btn cutbook-btn-excel" onClick={handleDownloadCsv}>Export CSV</button>
              <button className="cutbook-btn-print" onClick={() => window.print()}>🖨️ Print</button>
            </div>
          </div>

          {/* Formatted Report Document */}
          <div className="cutbook-formatted-report">
            {/* Org Title */}
            <div className="cutbook-fmt-org-name">
              SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI
            </div>

            {/* Meta Info Grid */}
            <div className="cutbook-fmt-meta-grid">
              <div className="cutbook-fmt-meta-left">
                <div className="cutbook-fmt-meta-row">
                  <span className="cutbook-fmt-meta-key">BANK NAME</span>
                  <span className="cutbook-fmt-meta-sep">:</span>
                  <span className="cutbook-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
                </div>
                <div className="cutbook-fmt-meta-row">
                  <span className="cutbook-fmt-meta-key">BRANCH NAME</span>
                  <span className="cutbook-fmt-meta-sep">:</span>
                  <span className="cutbook-fmt-meta-val">HEAD OFFICE</span>
                </div>
                <div className="cutbook-fmt-meta-row">
                  <span className="cutbook-fmt-meta-key">From Date</span>
                  <span className="cutbook-fmt-meta-sep">:</span>
                  <span className="cutbook-fmt-meta-val">{formatDateToDMY(fromDate)}</span>
                </div>
                <div className="cutbook-fmt-meta-row">
                  <span className="cutbook-fmt-meta-key">To Date</span>
                  <span className="cutbook-fmt-meta-sep">:</span>
                  <span className="cutbook-fmt-meta-val">{formatDateToDMY(toDate)}</span>
                </div>
              </div>

              <div className="cutbook-fmt-meta-right">
                <div className="cutbook-fmt-meta-row">
                  <span className="cutbook-fmt-meta-key">Print Date</span>
                  <span className="cutbook-fmt-meta-sep">:</span>
                  <span className="cutbook-fmt-meta-val">{formatDateToDMY(new Date().toISOString().split('T')[0])}</span>
                </div>
                <div className="cutbook-fmt-meta-row">
                  <span className="cutbook-fmt-meta-key">User Name</span>
                  <span className="cutbook-fmt-meta-sep">:</span>
                  <span className="cutbook-fmt-meta-val">Rohini</span>
                </div>
                <div className="cutbook-fmt-meta-row">
                  <span className="cutbook-fmt-meta-key">Generated Time</span>
                  <span className="cutbook-fmt-meta-sep">:</span>
                  <span className="cutbook-fmt-meta-val">{getCurrentTimeFormatted()}</span>
                </div>
              </div>
            </div>

            <hr className="cutbook-fmt-divider" />

            {/* Green Banner */}
            <div className="cutbook-fmt-banner">
              Report Name - {getReportFlagLabel(activeFlag)}
            </div>

            {/* Table */}
            <table className="cutbook-fmt-table">
              <thead>
                <tr>
                  <th className="cutbook-fmt-th cutbook-text-center">Sr No</th>
                  <th className="cutbook-fmt-th cutbook-text-center">GL Code</th>
                  <th className="cutbook-fmt-th cutbook-text-center">Sub GL</th>
                  <th className="cutbook-fmt-th cutbook-text-center">Account No</th>
                  <th className="cutbook-fmt-th cutbook-text-center">Old Acc No</th>
                  <th className="cutbook-fmt-th">Customer Name</th>
                  <th className="cutbook-fmt-th cutbook-text-right">Opening Balance</th>
                  <th className="cutbook-fmt-th cutbook-text-right">Receipt (Cr)</th>
                  <th className="cutbook-fmt-th cutbook-text-right">Payment (Dr)</th>
                  <th className="cutbook-fmt-th cutbook-text-right">Closing Balance</th>
                  <th className="cutbook-fmt-th cutbook-text-center">Status</th>
                  <th className="cutbook-fmt-th cutbook-text-center">Opening Date</th>
                  <th className="cutbook-fmt-th cutbook-text-center">Last Trx Date</th>
                </tr>
              </thead>
              <tbody>
                {results.data.map((row, i) => (
                  <tr key={i}>
                    <td className="cutbook-fmt-td cutbook-text-center">{i + 1}</td>
                    <td className="cutbook-fmt-td cutbook-text-center">{row.GLCODE ?? "-"}</td>
                    <td className="cutbook-fmt-td cutbook-text-center">{row.SUBGLCODE ?? "-"}</td>
                    <td className="cutbook-fmt-td cutbook-text-center">{row.ACCno ?? "-"}</td>
                    <td className="cutbook-fmt-td cutbook-text-center">{row.DACCNO ?? "-"}</td>
                    <td className="cutbook-fmt-td">{row.CUSTNAME ?? "-"}</td>
                    <td className="cutbook-fmt-td cutbook-text-right">
                      {parseFloat(row.Opening || 0).toFixed(2)}
                    </td>
                    <td className="cutbook-fmt-td cutbook-text-right">
                      {parseFloat(row.CrAmount || 0).toFixed(2)}
                    </td>
                    <td className="cutbook-fmt-td cutbook-text-right">
                      {parseFloat(row.DrAmount || 0).toFixed(2)}
                    </td>
                    <td className="cutbook-fmt-td cutbook-text-right">
                      {parseFloat(row.Closing || 0).toFixed(2)}
                    </td>
                    <td className="cutbook-fmt-td cutbook-text-center">{row.ACC_STATUS ?? "-"}</td>
                    <td className="cutbook-fmt-td cutbook-text-center">{formatDateToDMY(row.OpeningDate)}</td>
                    <td className="cutbook-fmt-td cutbook-text-center">{formatDateToDMY(row.LASTTRXDATE)}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="cutbook-total-row">
                  <td className="cutbook-fmt-td cutbook-text-center" colSpan={6}>Total</td>
                  <td className="cutbook-fmt-td cutbook-text-right">{openingTotal.toFixed(2)}</td>
                  <td className="cutbook-fmt-td cutbook-text-right">{crTotal.toFixed(2)}</td>
                  <td className="cutbook-fmt-td cutbook-text-right">{drTotal.toFixed(2)}</td>
                  <td className="cutbook-fmt-td cutbook-text-right">{closingTotal.toFixed(2)}</td>
                  <td className="cutbook-fmt-td" colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {fetched && results && results.data && results.data.length === 0 && (
        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "14px", fontSize: 13, textAlign: "center" }}>
          No records found for the selected criteria.
        </div>
      )}
    </div>
  );
}