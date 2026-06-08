import { useState } from "react";
import "./CDRatioReport.css";

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

const CATEGORY_ORDER = {
  'DP': 1,
  'INV': 2,
  'LNV': 3,
  'PL': 4,
  'REF': 5,
  'SHR': 6
};

export default function CDRatioReport() {
  const [reportType, setReportType] = useState("summary"); // "summary" | "details"
  const [branchCode, setBranchCode] = useState("1");
  const [branchName, setBranchName] = useState("HEAD OFFICE");
  const [asOnDate, setAsOnDate] = useState("2025-07-26");
  const [textReportName, setTextReportName] = useState("");

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClearAll = () => {
    setReportType("summary");
    setBranchCode("1");
    setBranchName("HEAD OFFICE");
    setAsOnDate("2025-07-26");
    setTextReportName("");
    setReportData([]);
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
      // Always call the SP with empty flag1 to get the 6 rows
      const body = {
        flag: "CDR",
        brcd: branchCode.trim(),
        onDate: asOnDate,
        flag1: "" 
      };

      const res = await fetch(`${API_BASE_URL}/api/cd-ratio-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Server returned ${res.status}`);
      }

      const resData = await res.json();
      const data = resData.data || [];
      
      // Sort rows precisely in mockup order: DP, INV, LNV, PL, REF, SHR
      const sortedRows = [...data].sort((a, b) => {
        const orderA = CATEGORY_ORDER[a.Glg?.trim()] || 99;
        const orderB = CATEGORY_ORDER[b.Glg?.trim()] || 99;
        return orderA - orderB;
      });

      setReportData(sortedRows);
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

    const flag1Value = reportType === "summary" ? "CD" : "";
    const params = new URLSearchParams({
      flag: "CDR",
      brcd: branchCode.trim(),
      onDate: asOnDate,
      flag1: flag1Value
    });
    window.open(`${API_BASE_URL}/api/cd-ratio-report/text-report-view?${params}`, "_blank");
  };

  const handleDownloadCsv = () => {
    if (!reportData || !reportData.length) return;
    
    // Custom CSV columns matching mockup table
    const headers = ["Sr No", "Group", "Gl Name", "Amount", "DrCr"].join(',');
    
    const rows = reportData.map((row, index) => {
      const glg = row.Glg?.trim() || "";
      const glname = row.Glname?.trim() || "";
      const amount = Math.abs(parseFloat(row.CBal || 0)).toFixed(2);
      return [index + 1, `"${glg}"`, `"${glname}"`, amount, ""].join(',');
    });

    // Append CD Ratio Row to CSV
    const { formattedCdRatio } = calculateCdRatio();
    rows.push([
      `"[((Shares+REF+PL+PLA-FAF-INV)-Loan)/Deposit*100] = CD RATIO"`,
      "",
      "",
      "",
      ""
    ].join(','));
    rows.push([
      "",
      "",
      `"CD RATIO"`,
      `"${formattedCdRatio} %"`,
      ""
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cd_ratio_report_${asOnDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic CD Ratio Calculation matching DB logic exactly
  const calculateCdRatio = () => {
    const getCBal = (glg) => {
      const row = reportData.find(r => r.Glg?.trim() === glg);
      return row ? Math.abs(parseFloat(row.CBal || 0)) : 0;
    };
    const getRawCBal = (glg) => {
      const row = reportData.find(r => r.Glg?.trim() === glg);
      return row ? parseFloat(row.CBal || 0) : 0;
    };

    const shares = getCBal("SHR");
    const ref = getCBal("REF");
    const pl = getRawCBal("PL");
    const pla = getRawCBal("PLA");
    const faf = getCBal("FAF");
    const inv = getCBal("INV");
    const loan = getCBal("LNV");
    const deposit = getCBal("DP");

    let ratioVal = 0;
    if (deposit > 0) {
      ratioVal = Math.abs((((shares + ref + pl + pla - faf - inv) - loan) / deposit) * 100);
    }
    
    return {
      formattedCdRatio: ratioVal.toFixed(2)
    };
  };

  const { formattedCdRatio } = reportData.length > 0 ? calculateCdRatio() : { formattedCdRatio: "0.00" };

  return (
    <div className="cdr-wrapper">
      <div className="cdr-card no-print">
        <div className="cdr-header">
          <span>CD Ratio Report</span>
        </div>

        <div className="cdr-form-section">
          {/* Report Type Radio */}
          <div className="cdr-row">
            <label className="cdr-label">Report Type</label>
            <div className="cdr-radio-group">
              <label className="cdr-radio-label">
                <input
                  type="radio" name="reportType" value="summary"
                  checked={reportType === "summary"}
                  onChange={() => setReportType("summary")}
                  className="cdr-radio-input"
                />
                Summary
              </label>
              <label className="cdr-radio-label">
                <input
                  type="radio" name="reportType" value="details"
                  checked={reportType === "details"}
                  onChange={() => setReportType("details")}
                  className="cdr-radio-input"
                />
                Details
              </label>
            </div>
          </div>

          {/* Branch Code */}
          <div className="cdr-row">
            <label className="cdr-label">Branch Code</label>
            <input
              className="cdr-input"
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
              className="cdr-input"
              style={{ background: "#fff1f2", borderColor: "#fda4af", color: "#9f1239", width: 320, marginLeft: 8 }}
              type="text"
              value={branchName}
              readOnly
            />
          </div>

          {/* As On Date */}
          <div className="cdr-row">
            <label className="cdr-label">As On Date</label>
            <input
              className="cdr-input"
              style={{ width: 200 }}
              type="date"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
            />
          </div>

          {/* Enter Text Report Name */}
          <div className="cdr-row">
            <label className="cdr-label">Enter Text Report Name</label>
            <input
              className="cdr-input"
              style={{ width: 340 }}
              type="text"
              placeholder="Enter Text Report Name"
              value={textReportName}
              onChange={(e) => setTextReportName(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="cdr-error" style={{ margin: "0 20px 10px 20px" }}>⚠️ {error}</p>}

        {loading && (
          <div className="cdr-loading-bar" style={{ margin: "0 20px 10px 20px", width: "calc(100% - 40px)" }}>
            <div className="cdr-loading-fill" />
          </div>
        )}

        {/* Footer Buttons */}
        <div className="cdr-btn-row">
          <button className="cdr-btn cdr-btn-blue" onClick={handleFetchReport} disabled={loading}>Report</button>
          <button className="cdr-btn cdr-btn-blue" onClick={handleTextReportView} disabled={loading}>Text Report View</button>
          <button className="cdr-btn cdr-btn-secondary" onClick={handleClearAll} disabled={loading}>Clear All</button>
          {reportData.length > 0 && (
            <button className="cdr-btn cdr-btn-excel" onClick={handleDownloadCsv} disabled={loading}>Export CSV</button>
          )}
        </div>
      </div>

      {/* Results Section / Preview Layout */}
      {fetched && reportData.length > 0 && (
        <>
          {/* Preview Toolbar */}
          <div className="cdr-preview-toolbar no-print">
            <span className="cdr-preview-title">CD Ratio Report — Preview</span>
            <button className="cdr-btn-print" onClick={() => window.print()}>
              🖨️ Print
            </button>
          </div>

          {/* Formatted Report Document */}
          <div className="cdr-formatted-report">
            {/* Org Header */}
            <div className="cdr-fmt-org-name">
              SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI
            </div>

            {/* Meta Grid */}
            <div className="cdr-fmt-meta-grid">
              <div className="cdr-fmt-meta-left">
                <div className="cdr-fmt-meta-row">
                  <span className="cdr-fmt-meta-key">BANK NAME</span>
                  <span className="cdr-fmt-meta-sep">:</span>
                  <span className="cdr-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
                </div>
                <div className="cdr-fmt-meta-row">
                  <span className="cdr-fmt-meta-key">BRANCH NAME</span>
                  <span className="cdr-fmt-meta-sep">:</span>
                  <span className="cdr-fmt-meta-val">{branchName}</span>
                </div>
                <div className="cdr-fmt-meta-row">
                  <span className="cdr-fmt-meta-key">AS On Date</span>
                  <span className="cdr-fmt-meta-sep">:</span>
                  <span className="cdr-fmt-meta-val">{formatDateToDMY(asOnDate)}</span>
                </div>
              </div>
              <div className="cdr-fmt-meta-right">
                <div className="cdr-fmt-meta-row">
                  <span className="cdr-fmt-meta-key">Print Date</span>
                  <span className="cdr-fmt-meta-sep">:</span>
                  <span className="cdr-fmt-meta-val">
                    {new Date().toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <div className="cdr-fmt-meta-row">
                  <span className="cdr-fmt-meta-key">User Name</span>
                  <span className="cdr-fmt-meta-sep">:</span>
                  <span className="cdr-fmt-meta-val">Rohini</span>
                </div>
                <div className="cdr-fmt-meta-row">
                  <span className="cdr-fmt-meta-key">Generated Time</span>
                  <span className="cdr-fmt-meta-sep">:</span>
                  <span className="cdr-fmt-meta-val">{getCurrentTimeFormatted()}</span>
                </div>
              </div>
            </div>

            {/* Banner Row */}
            <div className="cdr-fmt-banner">
              Report Name - CD Ratio Report
            </div>

            <table className="cdr-fmt-table">
              <thead>
                <tr>
                  <th className="cdr-fmt-th" style={{ width: "8%" }}>Sr No</th>
                  <th className="cdr-fmt-th" style={{ width: "12%" }}>Group</th>
                  <th className="cdr-fmt-th" style={{ width: "50%" }}>Gl Name</th>
                  <th className="cdr-fmt-th" style={{ width: "20%", textAlign: "right" }}>Amount</th>
                  <th className="cdr-fmt-th" style={{ width: "10%" }}>DrCr</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => {
                  const glg = row.Glg?.trim() || "";
                  const glname = row.Glname?.trim() || "";
                  const val = parseFloat(row.CBal || 0);
                  const amount = Math.abs(val).toFixed(2);
                  
                  return (
                    <tr key={index}>
                      <td className="cdr-fmt-td">{index + 1}</td>
                      <td className="cdr-fmt-td">{glg}</td>
                      <td className="cdr-fmt-td">{glname}</td>
                      <td className="cdr-fmt-td" style={{ textAlign: "right" }}>{amount}</td>
                      <td className="cdr-fmt-td"></td>
                    </tr>
                  );
                })}
                
                {/* Formula row */}
                <tr>
                  <td className="cdr-fmt-td cdr-formula-text" colSpan="3">
                    [((Shares+REF+PL+PLA-FAF-INV)-Loan)/Deposit*100] = CD RATIO
                  </td>
                  <td className="cdr-fmt-td"></td>
                  <td className="cdr-fmt-td"></td>
                </tr>

                {/* CD Ratio value row */}
                <tr>
                  <td className="cdr-fmt-td"></td>
                  <td className="cdr-fmt-td"></td>
                  <td className="cdr-fmt-td cdr-total-label">CD RATIO</td>
                  <td className="cdr-fmt-td" style={{ textAlign: "right", fontWeight: 700 }}>
                    {formattedCdRatio} %
                  </td>
                  <td className="cdr-fmt-td"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {fetched && reportData.length === 0 && (
        <p style={{ textAlign: "center", fontSize: 12, color: "#6b7280", margin: "20px 0" }}>
          No records found for the given criteria.
        </p>
      )}
    </div>
  );
}