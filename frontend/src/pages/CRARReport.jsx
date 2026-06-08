import { useState } from "react";
import "./CRARReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

function formatDateToDMY(dateStr) {
  if (!dateStr) return "";
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

export default function CRARReport() {
  const [branchCode, setBranchCode] = useState("1");
  const [branchName, setBranchName] = useState("HEAD OFFICE");
  const [asOnDate, setAsOnDate] = useState("2025-03-30");
  const [textReportName, setTextReportName] = useState("");

  const [reportData, setReportData] = useState({ capitalFunds: [], riskAssets: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClear = () => {
    setBranchCode("1");
    setBranchName("HEAD OFFICE");
    setAsOnDate("2025-03-30");
    setTextReportName("");
    setReportData({ capitalFunds: [], riskAssets: [] });
    setError("");
    setFetched(false);
  };

  const handleFetchReport = async () => {
    if (!branchCode.trim()) {
      setError("Branch Code is required.");
      return;
    }
    if (!asOnDate) {
      setError("As On Date is required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      const bodyParams = {
        branchCode: branchCode.trim(),
        asOnDate: asOnDate
      };

      const res = await fetch(`${API_BASE_URL}/api/crar-report`, {
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
      const data = responseData.data || { capitalFunds: [], riskAssets: [] };
      
      setReportData(data);
      setFetched(true);
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextReportView = () => {
    if (!branchCode.trim()) {
      setError("Branch Code is required.");
      return;
    }
    if (!asOnDate) {
      setError("As On Date is required.");
      return;
    }

    const p = new URLSearchParams({
      branchCode: branchCode.trim(),
      asOnDate: asOnDate
    });
    window.open(`${API_BASE_URL}/api/crar-report/text-report-view?${p}`, "_blank");
  };

  const handleDownloadCsv = () => {
    const capitalFunds = reportData.capitalFunds || [];
    const riskAssets = reportData.riskAssets || [];
    if (!capitalFunds.length && !riskAssets.length) return;

    const csvRows = [];
    csvRows.push(`"SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI"`);
    csvRows.push(`"Report Name - Capital to Risk-Weighted Assets Ratio (CRAR) Report"`);
    csvRows.push(`"Branch Code:","${branchCode}","Branch Name:","${branchName}"`);
    csvRows.push(`"As On Date:","${formatDateToDMY(asOnDate)}","Print Date:","${new Date().toLocaleDateString('en-GB')}"`);
    csvRows.push("");

    csvRows.push(`"A. CAPITAL FUNDS (Tier-I & Tier-II Capital)"`);
    csvRows.push(`"Sr No","Description","Amount"`);
    capitalFunds.forEach((row, i) => {
      csvRows.push(`"${i + 1}","${(row.description || '').trim()}","${parseFloat(row.amount || 0).toFixed(2)}"`);
    });
    csvRows.push(`"TOTAL CAPITAL FUNDS (A)","","${totalCapitalFunds.toFixed(2)}"`);
    csvRows.push("");

    csvRows.push(`"B. RISK-WEIGHTED ASSETS & EXPOSURE"`);
    csvRows.push(`"Sr No","Description","Amount","Provision","Net Amt","RiskWeight %","Adjusted Value"`);
    riskAssets.forEach((row, i) => {
      csvRows.push(`"${i + 1}","${(row.description || '').trim()}","${parseFloat(row.amount || 0).toFixed(2)}","${parseFloat(row.provision || 0).toFixed(2)}","${parseFloat(row.Amt || 0).toFixed(2)}","${row.RiskWeight ?? 0}","${parseFloat(row.Adjusted_Value || 0).toFixed(2)}"`);
    });
    csvRows.push(`"TOTAL RISK-WEIGHTED ASSETS (B)","","","","","","${totalRiskAssets.toFixed(2)}"`);
    csvRows.push("");

    csvRows.push(`"C. CRAR CALCULATION SUMMARY"`);
    csvRows.push(`"Total Capital Funds (A)","${totalCapitalFunds.toFixed(2)}"`);
    csvRows.push(`"Total Risk-Weighted Assets (B)","${totalRiskAssets.toFixed(2)}"`);
    csvRows.push(`"Capital to Risk-Weighted Assets Ratio (CRAR)","${crarPercentage.toFixed(2)} %"`);

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `crar_report_${asOnDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatAmount = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? "0.00" : num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const capitalFunds = reportData.capitalFunds || [];
  const riskAssets = reportData.riskAssets || [];

  const totalCapitalFunds = capitalFunds.length > 0 ? parseFloat(capitalFunds[0]?.ctotal || 0) : 0;
  const totalRiskAssets = riskAssets.length > 0 ? parseFloat(riskAssets[0]?.atotal || 0) : 0;
  const crarPercentage = totalRiskAssets > 0 ? (totalCapitalFunds / totalRiskAssets) * 100 : 0;

  return (
    <div className="crar-wrapper">
      <div className="crar-card no-print">
        <div className="crar-header">
          <span>CRAR Report</span>
        </div>

        <div className="crar-form-section">
          {/* Row 1: Branch Code + Branch Name */}
          <div className="crar-row">
            <label className="crar-label">Branch Code</label>
            <input
              className="crar-input"
              style={{ background: "#fefce8", borderColor: "#fbbf24", width: 200 }}
              type="text"
              value={branchCode}
              onChange={(e) => {
                const val = e.target.value;
                setBranchCode(val);
                setBranchName(val === "1" ? "HEAD OFFICE" : `BRANCH ${val}`);
              }}
            />
            <input
              className="crar-input"
              style={{ background: "#fff1f2", borderColor: "#fda4af", color: "#9f1239", width: 320 }}
              type="text"
              value={branchName}
              readOnly
            />
          </div>

          {/* Row 2: As On Date */}
          <div className="crar-row">
            <label className="crar-label">As On Date</label>
            <input
              className="crar-input"
              style={{ width: 200 }}
              type="date"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
          </div>

          {/* Row 3: Enter Text Report Name */}
          <div className="crar-row">
            <label className="crar-label">Enter Text Report Name</label>
            <input
              className="crar-input"
              style={{ width: 340 }}
              type="text"
              placeholder="Enter Text Report Name"
              value={textReportName}
              onChange={(e) => setTextReportName(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="crar-error" style={{ margin: "0 20px 10px 20px" }}>⚠️ {error}</p>}

        {loading && (
          <div className="crar-loading-bar" style={{ margin: "0 20px 10px 20px", width: "calc(100% - 40px)" }}>
            <div className="crar-loading-fill" />
          </div>
        )}

        {/* Buttons */}
        <div className="crar-btn-row">
          <button className="crar-btn crar-btn-blue" onClick={handleFetchReport} disabled={loading}>Report</button>
        </div>
      </div>

      {/* Results Section */}
      {fetched && (capitalFunds.length > 0 || riskAssets.length > 0) && (
        <>
          {/* Preview Toolbar */}
          <div className="crar-preview-toolbar no-print">
            <span className="crar-preview-title">CRAR Report — Preview</span>
            <button className="crar-btn-print" onClick={() => window.print()}>
              🖨️ Print
            </button>
          </div>

          {/* Formatted Report Document */}
          <div className="crar-formatted-report">
            <div className="crar-fmt-org-name">
              SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI
            </div>

            {/* Meta Info */}
            <div className="crar-fmt-meta-grid">
              <div className="crar-fmt-meta-left">
                <div className="crar-fmt-meta-row">
                  <span className="crar-fmt-meta-key">BANK NAME</span>
                  <span className="crar-fmt-meta-sep">:</span>
                  <span className="crar-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
                </div>
                <div className="crar-fmt-meta-row">
                  <span className="crar-fmt-meta-key">BRANCH NAME</span>
                  <span className="crar-fmt-meta-sep">:</span>
                  <span className="crar-fmt-meta-val">{branchName}</span>
                </div>
                <div className="crar-fmt-meta-row">
                  <span className="crar-fmt-meta-key">AS On Date</span>
                  <span className="crar-fmt-meta-sep">:</span>
                  <span className="crar-fmt-meta-val">{formatDateToDMY(asOnDate)}</span>
                </div>
              </div>
              <div className="crar-fmt-meta-right">
                <div className="crar-fmt-meta-row">
                  <span className="crar-fmt-meta-key">Print Date</span>
                  <span className="crar-fmt-meta-sep">:</span>
                  <span className="crar-fmt-meta-val">
                    {new Date().toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <div className="crar-fmt-meta-row">
                  <span className="crar-fmt-meta-key">User Name</span>
                  <span className="crar-fmt-meta-sep">:</span>
                  <span className="crar-fmt-meta-val">Rohini</span>
                </div>
                <div className="crar-fmt-meta-row">
                  <span className="crar-fmt-meta-key">Generated Time</span>
                  <span className="crar-fmt-meta-sep">:</span>
                  <span className="crar-fmt-meta-val">{getCurrentTimeFormatted()}</span>
                </div>
              </div>
            </div>

            {/* A. Capital Funds Table */}
            <div>
              <div className="crar-fmt-banner">
                A. CAPITAL FUNDS (Tier-I & Tier-II Capital)
              </div>
              <table className="crar-fmt-table">
                <thead>
                  <tr>
                    <th className="crar-fmt-th" style={{ width: "10%" }}>Sr No</th>
                    <th className="crar-fmt-th" style={{ width: "65%" }}>Description</th>
                    <th className="crar-fmt-th" style={{ width: "25%", textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {capitalFunds.map((row, index) => (
                    <tr key={index}>
                      <td className="crar-fmt-td">{index + 1}</td>
                      <td className="crar-fmt-td">{row.description || ""}</td>
                      <td className="crar-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.amount)}</td>
                    </tr>
                  ))}
                  <tr className="crar-total-row">
                    <td className="crar-fmt-td" colSpan="2">TOTAL CAPITAL FUNDS (A)</td>
                    <td className="crar-fmt-td" style={{ textAlign: "right" }}>{formatAmount(totalCapitalFunds)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* B. Risk-Weighted Assets Table */}
            <div>
              <div className="crar-fmt-banner">
                B. RISK-WEIGHTED ASSETS & EXPOSURE
              </div>
              <table className="crar-fmt-table">
                <thead>
                  <tr>
                    <th className="crar-fmt-th" style={{ width: "8%" }}>Sr</th>
                    <th className="crar-fmt-th" style={{ width: "32%" }}>Description</th>
                    <th className="crar-fmt-th" style={{ width: "15%", textAlign: "right" }}>Amount</th>
                    <th className="crar-fmt-th" style={{ width: "12%", textAlign: "right" }}>Provision</th>
                    <th className="crar-fmt-th" style={{ width: "15%", textAlign: "right" }}>Net Amt</th>
                    <th className="crar-fmt-th" style={{ width: "8%", textAlign: "center" }}>Risk %</th>
                    <th className="crar-fmt-th" style={{ width: "10%", textAlign: "right" }}>Adjusted Value</th>
                  </tr>
                </thead>
                <tbody>
                  {riskAssets.map((row, index) => (
                    <tr key={index}>
                      <td className="crar-fmt-td">{index + 1}</td>
                      <td className="crar-fmt-td">{row.description || ""}</td>
                      <td className="crar-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.amount)}</td>
                      <td className="crar-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.provision)}</td>
                      <td className="crar-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.Amt)}</td>
                      <td className="crar-fmt-td" style={{ textAlign: "center" }}>{row.RiskWeight ?? "0"}</td>
                      <td className="crar-fmt-td" style={{ textAlign: "right" }}>{formatAmount(row.Adjusted_Value)}</td>
                    </tr>
                  ))}
                  <tr className="crar-total-row">
                    <td className="crar-fmt-td" colSpan="6">TOTAL RISK-WEIGHTED ASSETS (B)</td>
                    <td className="crar-fmt-td" style={{ textAlign: "right" }}>{formatAmount(totalRiskAssets)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* C. CRAR Dashboard Cards */}
            <div>
              <div className="crar-fmt-banner">
                C. CRAR SUMMARY & RATIO CALCULATION
              </div>
              <div className="crar-summary-grid">
                <div className="crar-summary-card">
                  <span className="crar-summary-label">Total Capital Funds (A)</span>
                  <span className="crar-summary-value">₹ {formatAmount(totalCapitalFunds)}</span>
                </div>
                <div className="crar-summary-card">
                  <span className="crar-summary-label">Total Risk-Weighted Assets (B)</span>
                  <span className="crar-summary-value">₹ {formatAmount(totalRiskAssets)}</span>
                </div>
                <div className="crar-summary-card highlight">
                  <span className="crar-summary-label">Capital to Risk-Weighted Assets Ratio (CRAR)</span>
                  <span className="crar-summary-value">{crarPercentage.toFixed(2)} %</span>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {fetched && capitalFunds.length === 0 && riskAssets.length === 0 && !loading && (
        <p className="crar-error" style={{ textAlign: "center", marginTop: 20 }}>
          No records found for the given criteria.
        </p>
      )}
    </div>
  );
}