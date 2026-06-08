import { useState } from "react";
import "./SMSReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

const buildSMSParams = ({ fromDate, toDate, fromBrcd, toBrcd, mobileType, mobileNo }) => {
  return new URLSearchParams({
    fdate:  fromDate,
    tdate:  toDate,
    fbrcd:  fromBrcd,
    tbrcd:  toBrcd,
    mobile: mobileType === 'all' ? '0' : mobileNo.trim(),
  });
};

export default function SMSReport() {
  const [fromDate, setFromDate] = useState("2026-04-01");
  const [toDate, setToDate] = useState("2026-05-22");
  const [fromBrcd, setFromBrcd] = useState("1");
  const [fromBranchName] = useState("HEAD OFFICE");
  const [toBrcd, setToBrcd] = useState("1");
  const [toBranchName] = useState("HEAD OFFICE");
  const [mobileType, setMobileType] = useState("all");
  const [mobileNo, setMobileNo] = useState("");
  const [textReportName, setTextReportName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const validate = () => {
    if (!fromDate || !toDate) return "Please fill From Date and To Date.";
    if (!fromBrcd || !toBrcd) return "Please fill both BRCD fields.";
    if (mobileType === "specific" && !mobileNo.trim()) return "Please enter a mobile number or select 'All'.";
    return null;
  };

  const handleReport = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const params = buildSMSParams({ fromDate, toDate, fromBrcd, toBrcd, mobileType, mobileNo });
      const response = await fetch(`${API_BASE_URL}/api/sms-report/report?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.details || "API request failed");
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextReportView = () => {
    const err = validate();
    if (err) { setError(err); return; }

    const params = buildSMSParams({ fromDate, toDate, fromBrcd, toBrcd, mobileType, mobileNo });
    window.open(`${API_BASE_URL}/api/sms-report/text-report-view?${params}`, '_blank');
  };

  const handleClearAll = () => {
    setFromDate("2026-04-01"); 
    setToDate("2026-05-22"); 
    setFromBrcd("1"); 
    setToBrcd("1");
    setMobileType("all"); 
    setMobileNo(""); 
    setTextReportName("");
    setResults(null); 
    setError(null);
  };

  const handleDownloadCsv = () => {
    if (!results || !results.data || !results.data.length) return;
    const reportData = results.data;
    
    const headers = [
      "SrNo.", "Brcd", "Cust No.", "Mobile No.", "Date", "Description", "Response Code", "Status", "Sent Time"
    ].join(",");

    const rows = reportData.map((row, index) => {
      const fields = [
        index + 1,
        row.BRCD ?? row.brcd ?? "",
        row.CUSTNO ?? "",
        row.MOBILE ?? row.mobile ?? "",
        row.SMS_DATE ?? row.date ?? "",
        row.SMS_DESCRIPTION ?? row.description ?? "",
        row.response ?? "",
        row.SMS_STATUS ?? row.status ?? "",
        row.times ?? row.time ?? ""
      ];

      return fields.map(val => {
        let str = String(val ?? "");
        str = str.replace(/"/g, '""');
        if (str.includes(",") || str.includes("\n") || str.includes('"')) {
          str = `"${str}"`;
        }
        return str;
      }).join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sms_report_${fromDate}_${toDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFormattedPrintDate = () => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, "0");
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const y = now.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const formatDateDMY = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    return `${d}-${m}-${y}`;
  };

  return (
    <div className="sms-wrapper">
      <div className="sms-card no-print">
        <div className="sms-header">
          <h2>SMS MASTER REPORT</h2>
        </div>

        <div className="sms-card-body">
          <div className="sms-form-section">
            {/* Row 1: From Date / To Date */}
            <div className="sms-row">
              <span className="sms-label">From Date :</span>
              <input
                className="sms-input"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <span className="sms-label" style={{ minWidth: 100 }}>To Date :</span>
              <input
                className="sms-input"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Row 2: From BRCD / To BRCD */}
            <div className="sms-row">
              <span className="sms-label">From Branch :</span>
              <input
                className="sms-input sms-input-brcd"
                type="text"
                value={fromBrcd}
                onChange={(e) => setFromBrcd(e.target.value)}
              />
              <input
                className="sms-input sms-input-brcd-name"
                type="text"
                value={fromBranchName}
                readOnly
              />

              <span className="sms-label" style={{ minWidth: 100 }}>To Branch :</span>
              <input
                className="sms-input sms-input-brcd"
                type="text"
                value={toBrcd}
                onChange={(e) => setToBrcd(e.target.value)}
              />
              <input
                className="sms-input sms-input-brcd-name"
                type="text"
                value={toBranchName}
                readOnly
              />
            </div>

            {/* Row 3: Mobile Options */}
            <div className="sms-row">
              <span className="sms-label">Mobile Filter :</span>
              <div className="sms-radio-group">
                <label className="sms-radio-label">
                  <input
                    type="radio"
                    name="mobileType"
                    className="sms-radio"
                    value="all"
                    checked={mobileType === "all"}
                    onChange={() => setMobileType("all")}
                  />
                  All Customers
                </label>
                <label className="sms-radio-label">
                  <input
                    type="radio"
                    name="mobileType"
                    className="sms-radio"
                    value="specific"
                    checked={mobileType === "specific"}
                    onChange={() => setMobileType("specific")}
                  />
                  Specific Mobile
                </label>
                {mobileType === "specific" && (
                  <input
                    className="sms-input"
                    type="text"
                    placeholder="Enter mobile no"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    maxLength={10}
                    style={{ width: 150 }}
                  />
                )}
              </div>
            </div>

            {/* Row 4: Text Report Name */}
            <div className="sms-row">
              <span className="sms-label">Text Report Name :</span>
              <input
                className="sms-input"
                type="text"
                placeholder="Enter report name"
                value={textReportName}
                onChange={(e) => setTextReportName(e.target.value)}
                style={{ width: 320 }}
              />
            </div>

            {error && <div className="sms-error">⚠️ {error}</div>}
          </div>

          {loading && (
            <div className="sms-loading-bar" style={{ margin: "0 16px 12px 16px" }}>
              <div className="sms-loading-fill" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="sms-btn-row">
            <button className="sms-btn sms-btn-blue" onClick={handleReport} disabled={loading}>
              Report
            </button>
            <button className="sms-btn sms-btn-blue" onClick={handleTextReportView} disabled={loading}>
              Text Report View
            </button>
            <button className="sms-btn sms-btn-secondary" onClick={handleClearAll} disabled={loading}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Preview Toolbar */}
      {results && results.data && results.data.length > 0 && (
        <div className="sms-preview-toolbar no-print">
          <span className="sms-preview-title">Report Preview ({results.data.length} records found)</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="sms-btn sms-btn-excel" onClick={handleDownloadCsv}>Export CSV</button>
            <button className="sms-btn-print" onClick={() => window.print()}>🖨️ Print Report</button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && results.data && results.data.length > 0 && (
        <div className="sms-formatted-report">
          {/* Metadata banner headers */}
          <div className="sms-fmt-meta-grid">
            <div className="sms-fmt-meta-left">
              <div className="sms-fmt-meta-row">
                <span className="sms-fmt-meta-key">Name</span>
                <span className="sms-fmt-meta-sep">:</span>
                <span className="sms-fmt-meta-val" style={{ fontWeight: "700" }}>
                  SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI
                </span>
              </div>
              <div className="sms-fmt-meta-row">
                <span className="sms-fmt-meta-key">Branch Name</span>
                <span className="sms-fmt-meta-sep">:</span>
                <span className="sms-fmt-meta-val">HEAD OFFICE</span>
              </div>
            </div>
            <div className="sms-fmt-meta-right">
              <div className="sms-fmt-meta-row">
                <span className="sms-fmt-meta-key">User Id</span>
                <span className="sms-fmt-meta-sep">:</span>
                <span className="sms-fmt-meta-val">Rohini</span>
              </div>
              <div className="sms-fmt-meta-row">
                <span className="sms-fmt-meta-key">Print Date</span>
                <span className="sms-fmt-meta-sep">:</span>
                <span className="sms-fmt-meta-val">{getFormattedPrintDate()}</span>
              </div>
            </div>
          </div>

          {/* Centered SMS Report Title Banner */}
          <div className="sms-fmt-banner">
            SMS Report From {formatDateDMY(fromDate)} To {formatDateDMY(toDate)}
          </div>

          {/* Grid Table */}
          <table className="sms-fmt-table">
            <thead>
              <tr>
                <th className="sms-fmt-th sms-text-center" style={{ width: "6%" }}>SrNo.</th>
                <th className="sms-fmt-th sms-text-center" style={{ width: "6%" }}>Brcd</th>
                <th className="sms-fmt-th sms-text-center" style={{ width: "12%" }}>Cust No.</th>
                <th className="sms-fmt-th sms-text-center" style={{ width: "12%" }}>Mobile No.</th>
                <th className="sms-fmt-th sms-text-center" style={{ width: "12%" }}>Date</th>
                <th className="sms-fmt-th" style={{ width: "35%" }}>Description</th>
                <th className="sms-fmt-th sms-text-center" style={{ width: "7%" }}>Response Code</th>
                <th className="sms-fmt-th sms-text-center" style={{ width: "8%" }}>Status</th>
                <th className="sms-fmt-th sms-text-center" style={{ width: "10%" }}>Sent Time</th>
              </tr>
            </thead>
            <tbody>
              {results.data.map((row, i) => (
                <tr key={i}>
                  <td className="sms-fmt-td sms-text-center">{i + 1}</td>
                  <td className="sms-fmt-td sms-text-center">{row.BRCD ?? row.brcd}</td>
                  <td className="sms-fmt-td sms-text-center">{row.CUSTNO}</td>
                  <td className="sms-fmt-td sms-text-center">{row.MOBILE}</td>
                  <td className="sms-fmt-td sms-text-center">{row.SMS_DATE}</td>
                  <td className="sms-fmt-td">{row.SMS_DESCRIPTION}</td>
                  <td className="sms-fmt-td sms-text-center">{row.response || ""}</td>
                  <td className="sms-fmt-td sms-text-center">{row.SMS_STATUS || ""}</td>
                  <td className="sms-fmt-td sms-text-center">{row.times}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results && results.data && results.data.length === 0 && (
        <div style={{ background: "#ffffff", border: "1.5px solid #d1d5db", color: "#6b7280", borderRadius: 6, padding: "20px", fontSize: 13, textAlign: "center" }}>
          No SMS records found for the selected criteria.
        </div>
      )}
    </div>
  );
}