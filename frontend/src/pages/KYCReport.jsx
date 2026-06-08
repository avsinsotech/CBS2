import { useState } from "react";
import "./KYCReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

export default function KYCReport() {
  const [kycType, setKycType] = useState("All"); // "All", "Complete", "Pending"
  const [fromDate, setFromDate] = useState("1900-01-01");
  const [toDate, setToDate] = useState("2026-03-28");
  const [fromBrcd, setFromBrcd] = useState("1");
  const [toBrcd, setToBrcd] = useState("9999");

  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);
  const [activeReportType, setActiveReportType] = useState("Kyc Document Details");

  const handleClear = () => {
    setKycType("All");
    setFromDate("1900-01-01");
    setToDate("2026-03-28");
    setFromBrcd("1");
    setToBrcd("9999");
    setReportData([]);
    setFilteredData([]);
    setError("");
    setFetched(false);
  };

  const fetchKYCReport = async (runClientFilterOnly = false) => {
    if (!toDate) {
      setError("As On Date (To Date) is required.");
      return;
    }

    setLoading(true);
    setError("");
    setFetched(false);

    try {
      // Always call the "Dump" flag to retrieve the complete 25-column dataset
      const bodyParams = {
        flag: "Dump",
        tDate: toDate,
        fDate: fromDate || "1900-01-01",
        fBrcd: fromBrcd || "1",
        tBrcd: toBrcd || "9999"
      };

      const res = await fetch(`${API_BASE_URL}/api/kyc-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyParams)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error: ${res.status}`);
      }

      const responseData = await res.json();
      const rawData = responseData.data || [];
      setReportData(rawData);

      // Perform local client-side filters to match "All", "Complete", "Pending", or "Dump" requirements
      let result = [...rawData];

      // 1. Filter by branch range
      const minBrc = parseInt(fromBrcd || 1, 10);
      const maxBrc = parseInt(toBrcd || 9999, 10);
      result = result.filter(row => {
        const br = parseInt(row.BRCD ?? row.brcd ?? 0, 10);
        return br >= minBrc && br <= maxBrc;
      });

      // 2. Filter by date range (parsed from first_accOpen which is DD/MM/YYYY)
      const parseDMY = (str) => {
        if (!str || !str.trim()) return null;
        const parts = str.trim().split("/");
        if (parts.length !== 3) return null;
        const [d, m, y] = parts.map(Number);
        return new Date(y, m - 1, d);
      };

      const fromDateObj = fromDate ? new Date(fromDate) : null;
      const toDateObj = toDate ? new Date(toDate) : null;

      result = result.filter(row => {
        const openDate = parseDMY(row.first_accOpen);
        if (openDate) {
          if (fromDateObj && openDate < fromDateObj) return false;
          if (toDateObj && openDate > toDateObj) return false;
        } else {
          // If empty and user set a custom starting date other than default 1900, exclude it
          if (fromDate && fromDate !== "1900-01-01") return false;
        }
        return true;
      });

      // 3. Filter by KYC Completion Status if this was triggered via standard "KYC Report" button
      if (runClientFilterOnly) {
        result = result.filter(row => {
          const hasDocNo = !!(row.DOC_NO && String(row.DOC_NO).trim());
          const hasAdocNo = !!(row.adocno && String(row.adocno).trim());
          const hasIdProof = !!(row.Identityproof && String(row.Identityproof).trim());
          const hasAddrProof = !!(row.AddressProof && String(row.AddressProof).trim());
          const isComplete = hasDocNo || hasAdocNo || hasIdProof || hasAddrProof || row.KYCStatus === "Y";

          if (kycType === "Complete") return isComplete;
          if (kycType === "Pending") return !isComplete;
          return true; // All Customers
        });
        setActiveReportType(`Kyc Status: ${kycType}`);
      } else {
        setActiveReportType("Kyc Document Details");
      }

      setFilteredData(result);
      setFetched(true);
    } catch (err) {
      setError(err.message || "Failed to fetch KYC report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!filteredData || !filteredData.length) return;
    const headers = [
      "CUSTNO", "CKYCNo", "BRCD", "BRCD Name", "CUSTNAME", "Cust Type", "DOC NO",
      "DOB", "Risk Cate.", "Date riskreview", "Risk cate BReview", "Mem Type",
      "SBCOunt", "CACOunt", "TDACOunt", "Dormant", "Freeze", "OVDType", "OVDNO",
      "Address Proof", "Adoc No", "First Acc. Open", "KYC DATE", "Kyc Due Date", "KYC Status"
    ].join(",");

    const rows = filteredData.map(row => {
      const fields = [
        row.CUSTNO,
        row.CKYCNo ?? "",
        row.brcd ?? row.BRCD ?? "",
        row.branchname ?? "",
        row.CUSTNAME ?? "",
        row.custtype ?? "",
        row.DOC_NO ?? "",
        row.dob ?? "",
        row.RiskCategory ?? "",
        row.Date_riskreview ?? "",
        row.riskcategory_BReview ?? "",
        row.membertype ?? "",
        row.SBCOunt ?? "",
        row.CACOunt ?? "",
        row.TDACOunt ?? "",
        row.dormant ?? "",
        row.freeze ?? "",
        row.OVDType ?? "",
        row.OVDNO ?? "",
        row.AddressProof ?? "",
        row.adocno ?? "",
        row.first_accOpen ?? "",
        row.KYCDATE ?? "",
        row.KycDueDate ?? "",
        row.KYCStatus ?? ""
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
    link.setAttribute("download", `kyc_report_${kycType.toLowerCase()}_${toDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFormattedTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="kyc-wrapper">
      <div className="kyc-card no-print">
        {/* Card Header */}
        <div className="kyc-header">
          <h2>KYC Status Reports</h2>
        </div>

        {/* Card Body */}
        <div className="kyc-card-body">
          <div className="kyc-form-section">
            {/* Row 1: KYC Type */}
            <div className="kyc-row">
              <span className="kyc-label">KYC Status Type :</span>
              <select
                className="kyc-select"
                value={kycType}
                onChange={(e) => setKycType(e.target.value)}
              >
                <option value="All">All Customers</option>
                <option value="Complete">Completed KYC</option>
                <option value="Pending">Pending/Incompleted KYC</option>
              </select>
            </div>

            {/* Row 2: Date Filters */}
            <div className="kyc-row">
              <span className="kyc-label">From Date :</span>
              <input
                className="kyc-input"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <span className="kyc-inline-label" style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginLeft: 20 }}>As On Date :</span>
              <input
                className="kyc-input"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Row 3: Branch range */}
            <div className="kyc-row">
              <span className="kyc-label">From Branch :</span>
              <input
                className="kyc-input"
                type="text"
                value={fromBrcd}
                onChange={(e) => setFromBrcd(e.target.value)}
              />

              <span className="kyc-inline-label" style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginLeft: 20 }}>To Branch :</span>
              <input
                className="kyc-input"
                type="text"
                value={toBrcd}
                onChange={(e) => setToBrcd(e.target.value)}
              />
            </div>
          </div>

          {error && <div style={{ color: "#ef4444", fontSize: 13, margin: "10px 20px" }}>⚠️ {error}</div>}

          {loading && (
            <div className="kyc-loading-bar" style={{ margin: "10px 20px" }}>
              <div className="kyc-loading-fill" />
            </div>
          )}

          {/* Buttons */}
          <div className="kyc-btn-row">
            <button className="kyc-btn kyc-btn-blue" onClick={() => fetchKYCReport(true)} disabled={loading}>
              KYC Report
            </button>
            <button className="kyc-btn kyc-btn-blue" onClick={() => fetchKYCReport(false)} disabled={loading}>
              Dump KYC Report
            </button>
            <button className="kyc-btn kyc-btn-secondary" onClick={handleClear} disabled={loading}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Preview Toolbar */}
      {fetched && filteredData.length > 0 && (
        <div className="kyc-preview-toolbar no-print">
          <span className="kyc-preview-title">Report Preview ({filteredData.length} records found)</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="kyc-btn kyc-btn-excel" onClick={handleDownloadCsv}>Export CSV</button>
            <button className="kyc-btn-print" onClick={() => window.print()}>🖨️ Print Report</button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {fetched && filteredData.length > 0 && (
        <div className="kyc-formatted-report">
          {/* Org details & Meta Info Grid */}
          <div className="kyc-fmt-meta-grid">
            <div className="kyc-fmt-meta-left">
              <div className="kyc-fmt-meta-row">
                <span className="kyc-fmt-meta-key">Name</span>
                <span className="kyc-fmt-meta-sep">:</span>
                <span className="kyc-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
              </div>
              <div className="kyc-fmt-meta-row">
                <span className="kyc-fmt-meta-key">Branch Name</span>
                <span className="kyc-fmt-meta-sep">:</span>
                <span className="kyc-fmt-meta-val">
                  {fromBrcd === "1" ? "HEAD OFFICE" : `BRANCH ${fromBrcd}`}
                </span>
              </div>
              <div className="kyc-fmt-meta-row">
                <span className="kyc-fmt-meta-key">Report Name</span>
                <span className="kyc-fmt-meta-sep">:</span>
                <span className="kyc-fmt-meta-val" style={{ fontWeight: 600 }}>{activeReportType}</span>
              </div>
            </div>
            <div className="kyc-fmt-meta-right">
              <div className="kyc-fmt-meta-row">
                <span className="kyc-fmt-meta-key">Generated Date</span>
                <span className="kyc-fmt-meta-sep">:</span>
                <span className="kyc-fmt-meta-val">{new Date().toLocaleDateString("en-GB")}</span>
              </div>
              <div className="kyc-fmt-meta-row">
                <span className="kyc-fmt-meta-key">Generated By</span>
                <span className="kyc-fmt-meta-sep">:</span>
                <span className="kyc-fmt-meta-val">Rohini</span>
              </div>
              <div className="kyc-fmt-meta-row">
                <span className="kyc-fmt-meta-key">Generated Time</span>
                <span className="kyc-fmt-meta-sep">:</span>
                <span className="kyc-fmt-meta-val">{getFormattedTime()}</span>
              </div>
            </div>
          </div>

          <hr className="kyc-fmt-divider" />

          {/* Table Container for Horizontal Scroll */}
          <div className="kyc-table-scroll-container">
            <table className="kyc-fmt-table">
              <thead>
                <tr>
                  <th className="kyc-fmt-th">CUSTNO</th>
                  <th className="kyc-fmt-th">CKYCNo</th>
                  <th className="kyc-fmt-th">BRCD</th>
                  <th className="kyc-fmt-th">BRCD Name</th>
                  <th className="kyc-fmt-th">CUSTNAME</th>
                  <th className="kyc-fmt-th">Cust Type</th>
                  <th className="kyc-fmt-th">DOC NO</th>
                  <th className="kyc-fmt-th">DOB</th>
                  <th className="kyc-fmt-th">Risk Cate.</th>
                  <th className="kyc-fmt-th">Date riskreview</th>
                  <th className="kyc-fmt-th">Risk cate BReview</th>
                  <th className="kyc-fmt-th">Mem Type</th>
                  <th className="kyc-fmt-th kyc-text-right">SBCOunt</th>
                  <th className="kyc-fmt-th kyc-text-right">CACOunt</th>
                  <th className="kyc-fmt-th kyc-text-right">TDACOunt</th>
                  <th className="kyc-fmt-th">Dormant</th>
                  <th className="kyc-fmt-th">Freeze</th>
                  <th className="kyc-fmt-th">OVDType</th>
                  <th className="kyc-fmt-th">OVDNO</th>
                  <th className="kyc-fmt-th">Address Proof</th>
                  <th className="kyc-fmt-th">Adoc No</th>
                  <th className="kyc-fmt-th">First Acc. Open</th>
                  <th className="kyc-fmt-th">KYC DATE</th>
                  <th className="kyc-fmt-th">Kyc Due Date</th>
                  <th className="kyc-fmt-th">KYC Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, i) => (
                  <tr key={i}>
                    <td className="kyc-fmt-td">{row.CUSTNO}</td>
                    <td className="kyc-fmt-td">{row.CKYCNo || ""}</td>
                    <td className="kyc-fmt-td">{row.brcd ?? row.BRCD ?? ""}</td>
                    <td className="kyc-fmt-td">{row.branchname ?? ""}</td>
                    <td className="kyc-fmt-td">{row.CUSTNAME}</td>
                    <td className="kyc-fmt-td">{row.custtype || ""}</td>
                    <td className="kyc-fmt-td">{row.DOC_NO || ""}</td>
                    <td className="kyc-fmt-td">{row.dob || ""}</td>
                    <td className="kyc-fmt-td">{row.RiskCategory || ""}</td>
                    <td className="kyc-fmt-td">{row.Date_riskreview || ""}</td>
                    <td className="kyc-fmt-td">{row.riskcategory_BReview || ""}</td>
                    <td className="kyc-fmt-td">{row.membertype || ""}</td>
                    <td className="kyc-fmt-td kyc-text-right">{row.SBCOunt || ""}</td>
                    <td className="kyc-fmt-td kyc-text-right">{row.CACOunt || ""}</td>
                    <td className="kyc-fmt-td kyc-text-right">{row.TDACOunt || ""}</td>
                    <td className="kyc-fmt-td">{row.dormant || ""}</td>
                    <td className="kyc-fmt-td">{row.freeze || ""}</td>
                    <td className="kyc-fmt-td">{row.OVDType || ""}</td>
                    <td className="kyc-fmt-td">{row.OVDNO || ""}</td>
                    <td className="kyc-fmt-td">{row.AddressProof || ""}</td>
                    <td className="kyc-fmt-td">{row.adocno || ""}</td>
                    <td className="kyc-fmt-td">{row.first_accOpen || ""}</td>
                    <td className="kyc-fmt-td">{row.KYCDATE || ""}</td>
                    <td className="kyc-fmt-td">{row.KycDueDate || ""}</td>
                    <td className="kyc-fmt-td">{row.KYCStatus || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {fetched && filteredData.length === 0 && (
        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "14px", fontSize: 13, textAlign: "center" }}>
          No records found for the selected criteria.
        </div>
      )}
    </div>
  );
}