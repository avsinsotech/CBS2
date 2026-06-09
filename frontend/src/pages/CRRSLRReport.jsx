import { useState } from "react";
import "./CRRSLRReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

function formatDate(dateVal) {
  if (!dateVal) return "";
  const dateStr = typeof dateVal === "string" ? dateVal.split("T")[0] : dateVal;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  }
  return dateStr;
}

function formatAmount(amt) {
  if (amt === null || amt === undefined) return "0.00";
  const num = parseFloat(amt);
  return isNaN(num) ? "0.00" : num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CRRSLRReport() {
  const [language, setLanguage] = useState("English");
  const [branchCode, setBranchCode] = useState("1");
  const [branchName, setBranchName] = useState("HEAD OFFICE");
  const [asOnDate, setAsOnDate] = useState("2026-03-30");
  const [toDate, setToDate] = useState("2026-05-25");

  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState("CRR"); // CRR, CRR1, SLR
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClear = () => {
    setLanguage("English");
    setBranchCode("1");
    setBranchName("HEAD OFFICE");
    setAsOnDate("2026-03-30");
    setToDate("2026-05-25");
    setReportData([]);
    setError("");
    setFetched(false);
  };

  const handleFetchReport = async (type) => {
    if (!branchCode.trim()) {
      setError("Branch Code is required.");
      return;
    }
    if (!asOnDate) {
      setError("As On Date is required.");
      return;
    }
    if (!toDate) {
      setError("To Date is required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);
    setReportType(type);

    try {
      const bodyParams = {
        reportType: type,
        branchCode: branchCode.trim(),
        asOnDate: asOnDate,
        toDate: toDate,
      };

      const res = await fetch(`${API_BASE_URL}/api/crr-slr-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyParams)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }

      const responseData = await res.json();
      setReportData(responseData.data || []);
      setFetched(true);
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextReportView = () => {
    if (!branchCode.trim() || !asOnDate || !toDate) {
      setError("Branch Code, As On Date, and To Date are required.");
      return;
    }

    const p = new URLSearchParams({
      reportType: reportType,
      branchCode: branchCode.trim(),
      asOnDate: asOnDate,
      toDate: toDate
    });
    window.open(`${API_BASE_URL}/api/crr-slr-report/text-report-view?${p}`, "_blank");
  };

  const handleDownloadCsv = () => {
    if (!reportData || reportData.length === 0) return;

    const csvRows = [];
    csvRows.push(`"SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI"`);
    csvRows.push(`"Report Name - ${reportType.toUpperCase()} Report"`);
    csvRows.push(`"Branch Code:","${branchCode}","Branch Name:","${branchName}"`);
    csvRows.push(`"Period:","${formatDate(asOnDate)} to ${formatDate(toDate)}","Print Date:","${new Date().toLocaleDateString('en-GB')}"`);
    csvRows.push("");

    if (reportType === "SLR") {
      csvRows.push(`"Sr No","Branch Name","Date","SLR Investment","Total Deposit","Required SLR (25%)","Surplus/Deficit","SLR %","Actual Maintaining %"`);
      reportData.forEach((row, idx) => {
        csvRows.push([
          idx + 1,
          `"${(row.Branchname || '').trim()}"`,
          `"${formatDate(row.ENTRYDATE)}"`,
          parseFloat(row.AMOUNT || 0).toFixed(2),
          parseFloat(row.DP || 0).toFixed(2),
          parseFloat(row.DP1 || 0).toFixed(2),
          parseFloat(row.AMT1 || 0).toFixed(2),
          `"${row.PERCENTAGE || ''}"`,
          `"${row.ACTAMT || ''}%"`
        ].join(','));
      });
    } else {
      // CRR or CRR1
      csvRows.push(`"Sr No","Branch Name","Date","Cash Balance","Bal with Other Bank","CRR FD","Total CRR","Total Deposits","Required CRR","Surplus/Deficit","CRR %","Actual Maintained %","Remark"`);
      reportData.forEach((row, idx) => {
        csvRows.push([
          idx + 1,
          `"${(row.Branchname || '').trim()}"`,
          `"${formatDate(row.ENTRYDATE)}"`,
          parseFloat(row.AMOUNT || 0).toFixed(2),
          parseFloat(row.CBB || 0).toFixed(2),
          parseFloat(row.CRRFD || 0).toFixed(2),
          parseFloat(row.TotalCRR || 0).toFixed(2),
          parseFloat(row.DP || 0).toFixed(2),
          parseFloat(row.DP1 || 0).toFixed(2),
          parseFloat(row.AMT2 || 0).toFixed(2),
          `"${row.PERCENTAGE || ''}"`,
          `"${row.ACTAMT || ''}%"`,
          `"${row.REMARK || ''}"`
        ].join(','));
      });
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType.toLowerCase()}_report_${asOnDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const isCrr = reportType === "CRR" || reportType === "CRR1";

  return (
    <div className="crrslr-wrapper">
      <div className="crrslr-card no-print">
        {/* Header */}
        <div className="crrslr-header">
          CRR / SLR Report Query Panel
        </div>

        {/* Form Body */}
        <div className="crrslr-form-section">
          {/* Row 1: Language radio buttons */}
          <div className="crrslr-radio-group">
            <label className="crrslr-radio-label">
              <input
                type="radio"
                name="language"
                value="Marathi"
                checked={language === "Marathi"}
                onChange={() => setLanguage("Marathi")}
                className="crrslr-radio"
              />
              Marathi
            </label>
            <label className="crrslr-radio-label">
              <input
                type="radio"
                name="language"
                value="English"
                checked={language === "English"}
                onChange={() => setLanguage("English")}
                className="crrslr-radio"
              />
              English
            </label>
          </div>

          {/* Row 2: Branch Code & Branch Name */}
          <div className="crrslr-row">
            <label className="crrslr-label">Branch Code</label>
            <input
              className="crrslr-input"
              style={{ width: 140 }}
              type="text"
              placeholder="Code"
              value={branchCode}
              onChange={(e) => {
                const val = e.target.value;
                setBranchCode(val);
                setBranchName(val === "1" ? "HEAD OFFICE" : `BRANCH ${val}`);
              }}
            />
            <input
              className="crrslr-input"
              style={{ width: 340, background: "#f8fafc", color: "#64748b", border: "1px dashed #cbd5e1" }}
              type="text"
              placeholder="Branch Name"
              value={branchName}
              readOnly
            />
          </div>

          {/* Row 3: From Date & To Date */}
          <div className="crrslr-row">
            <label className="crrslr-label">As On Date</label>
            <input
              className="crrslr-input"
              style={{ width: 200 }}
              type="date"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
            <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", margin: "0 8px" }}>To Date</label>
            <input
              className="crrslr-input"
              style={{ width: 200 }}
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Errors */}
          {error && <p className="crrslr-error">⚠️ {error}</p>}
        </div>

        {/* Buttons Row */}
        <div className="crrslr-btn-row">
          <button 
            className="crrslr-btn crrslr-btn-blue" 
            disabled={loading}
            onClick={() => handleFetchReport("CRR1")}
          >
            CRR1 Report
          </button>
          <button 
            className="crrslr-btn crrslr-btn-blue" 
            disabled={loading}
            onClick={() => handleFetchReport("CRR")}
          >
            CRR Report
          </button>
          <button 
            className="crrslr-btn crrslr-btn-blue" 
            disabled={loading}
            onClick={() => handleFetchReport("SLR")}
          >
            SLR Report
          </button>
          <button 
            className="crrslr-btn crrslr-btn-secondary" 
            onClick={handleClear}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="crrslr-loading-bar no-print">
          <div className="crrslr-loading-fill"></div>
        </div>
      )}

      {/* Results view */}
      {fetched && reportData.length > 0 && (
        <>
          {/* Action toolbar */}
          <div className="crrslr-preview-toolbar no-print">
            <div className="crrslr-preview-title">
              📋 {reportType.toUpperCase()} Report Preview
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="crrslr-btn crrslr-btn-excel" onClick={handleDownloadCsv}>
                Export CSV
              </button>
              <button className="crrslr-btn crrslr-btn-blue" onClick={handleTextReportView}>
                Text Report View
              </button>
              <button className="crrslr-btn-print" onClick={handlePrint}>
                🖨️ Print Report
              </button>
            </div>
          </div>

          {/* Render formatted table */}
          <div className="crrslr-formatted-report">
            <div className="crrslr-fmt-org-name">
              SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, textAlign: "center", color: "#000000", marginBottom: 12 }}>
              {reportType.toUpperCase()} REPORT
            </div>

            <div className="crrslr-fmt-meta-grid">
              <div className="crrslr-fmt-meta-left">
                <div className="crrslr-fmt-meta-row">
                  <span className="crrslr-fmt-meta-key">Branch Code</span>
                  <span className="crrslr-fmt-meta-sep">:</span>
                  <span className="crrslr-fmt-meta-val">{branchCode} ({branchName})</span>
                </div>
                <div className="crrslr-fmt-meta-row">
                  <span className="crrslr-fmt-meta-key">Period</span>
                  <span className="crrslr-fmt-meta-sep">:</span>
                  <span className="crrslr-fmt-meta-val">{formatDate(asOnDate)} To {formatDate(toDate)}</span>
                </div>
              </div>
              <div className="crrslr-fmt-meta-right">
                <div className="crrslr-fmt-meta-row">
                  <span className="crrslr-fmt-meta-key">Print Date</span>
                  <span className="crrslr-fmt-meta-sep">:</span>
                  <span className="crrslr-fmt-meta-val">{new Date().toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="crrslr-fmt-table">
              <thead>
                {isCrr ? (
                  <tr>
                    <th className="crrslr-fmt-th" style={{ width: 50 }}>Sr No</th>
                    <th className="crrslr-fmt-th">Branch Name</th>
                    <th className="crrslr-fmt-th">Date</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Cash Balance</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Bal with Bank</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>CRR FD</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Total CRR</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Total Deposits</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Required CRR</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Surplus/Deficit</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "center" }}>CRR %</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Actual %</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "center" }}>Remark</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="crrslr-fmt-th" style={{ width: 50 }}>Sr No</th>
                    <th className="crrslr-fmt-th">Branch Name</th>
                    <th className="crrslr-fmt-th">Date</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>SLR Investment</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Total Deposit</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Required SLR</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Surplus/Deficit</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "center" }}>SLR %</th>
                    <th className="crrslr-fmt-th" style={{ textAlign: "right" }}>Actual %</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {isCrr ? (
                  reportData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="crrslr-fmt-td">{idx + 1}</td>
                      <td className="crrslr-fmt-td">{row.Branchname}</td>
                      <td className="crrslr-fmt-td">{formatDate(row.ENTRYDATE)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.AMOUNT)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.CBB)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.CRRFD)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.TotalCRR)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.DP)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.DP1)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.AMT2)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "center" }}>{row.PERCENTAGE}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{row.ACTAMT ? `${row.ACTAMT}%` : "0.00%"}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "center", fontWeight: "600" }}>{row.REMARK}</td>
                    </tr>
                  ))
                ) : (
                  reportData.map((row, idx) => (
                    <tr key={idx}>
                      <td className="crrslr-fmt-td">{idx + 1}</td>
                      <td className="crrslr-fmt-td">{row.Branchname}</td>
                      <td className="crrslr-fmt-td">{formatDate(row.ENTRYDATE)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.AMOUNT)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.DP)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.DP1)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.AMT1)}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "center" }}>{row.PERCENTAGE}</td>
                      <td className="crrslr-fmt-td" style={{ textAlign: "right" }}>{row.ACTAMT ? `${row.ACTAMT}%` : "0.00%"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {fetched && reportData.length === 0 && (
        <div className="crrslr-card" style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
          No records found for the selected parameters.
        </div>
      )}
    </div>
  );
}