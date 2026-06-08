import { useState } from "react";
import "./CTRReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

function toISO(raw) {
  if (!raw) return null;
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return raw; // already YYYY-MM-DD
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

const CTR_COLUMNS = [
  { key: "srNo", label: "SrNo", width: "3%" },
  { key: "brcd", label: "Brcd", width: "4%" },
  { key: "prdCode", label: "Prd Code", width: "6%" },
  { key: "accNo", label: "AccNo", width: "6%" },
  { key: "custNo", label: "CustNo", width: "6%" },
  { key: "custName", label: "Cust Name", width: "22%" },
  { key: "entryDate", label: "Entry Date", width: "8%" },
  { key: "setNo", label: "SetNo", width: "4%" },
  { key: "amount", label: "Amount", width: "8%", align: "right" },
  { key: "totalAmount", label: "Total Amount", width: "8%", align: "right" },
  { key: "typeOfPayment", label: "Type Of Payment", width: "8%" },
  { key: "customerType", label: "CustomerType", width: "8%" },
  { key: "oldCategory", label: "Old Category", width: "6%" },
  { key: "category", label: "Category", width: "6%" },
  { key: "limit", label: "Limit", width: "5%" }
];

const getValueInsensitive = (obj, key) => {
  if (!obj) return "";
  const keys = Object.keys(obj);
  const foundKey = keys.find(k => k.toLowerCase() === key.toLowerCase());
  return foundKey ? obj[foundKey] : "";
};

const mapRowToStandard = (row, index) => {
  const getVal = (key) => getValueInsensitive(row, key);

  let entryDate = getVal("entrydate") || getVal("ENTRYDATE") || "";
  if (entryDate && String(entryDate).includes("T")) {
    const d = new Date(entryDate);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      entryDate = `${day}/${month}/${year}`;
    }
  }

  const formatAmt = (val) => {
    if (val === undefined || val === null || val === "") return "";
    const num = parseFloat(val);
    return isNaN(num) ? String(val) : num.toFixed(2);
  };

  return {
    srNo: index + 1,
    brcd: getVal("brcd") || getVal("BRCD") || "",
    prdCode: getVal("subglcode") || getVal("SUBGLCODE") || getVal("glcode") || getVal("GLCODE") || "",
    accNo: getVal("accno") || getVal("ACCNO") || "",
    custNo: getVal("custno") || getVal("CUSTNO") || "",
    custName: getVal("custname") || getVal("CUSTNAME") || "",
    entryDate: entryDate,
    setNo: getVal("setno") || getVal("SETNO") || "",
    amount: formatAmt(getVal("amount") || getVal("AMOUNT")),
    totalAmount: formatAmt(getVal("totalwithdraw") || getVal("TOTALWITHDRAW") || getVal("totalamount") || getVal("TOTALAMOUNT") || getVal("crbal") || getVal("CRBAL") || getVal("drbal") || getVal("DRBAL")),
    typeOfPayment: getVal("trxtype") || getVal("TRXTYPE") || getVal("Type") || getVal("typeofpayment") || "",
    customerType: getVal("custtype") || getVal("CustType") || getVal("customertype") || getVal("CustomerType") || "",
    oldCategory: getVal("oldcategory") || getVal("OldCategory") || getVal("custcategory") || getVal("CUSTCATEGORY") || "",
    category: getVal("category") || getVal("Category") || "",
    limit: getVal("limit") || getVal("Limit") || ""
  };
};

export default function CTRReport() {
  const [fromBrcd, setFromBrcd] = useState("1");
  const [toBrcd, setToBrcd] = useState("9999");
  const [fromProductCode, setFromProductCode] = useState("1");
  const [fromProductDesc, setFromProductDesc] = useState("");
  const [toProductCode, setToProductCode] = useState("9999");
  const [toProductDesc, setToProductDesc] = useState("");
  const [cashLimit, setCashLimit] = useState("100000");
  const [fromDate, setFromDate] = useState("01/04/2025");
  const [toDate, setToDate] = useState("30/03/2026");

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);
  const [activeReport, setActiveReport] = useState("");

  const handleClear = () => {
    setFromBrcd("1");
    setToBrcd("9999");
    setFromProductCode("1");
    setFromProductDesc("");
    setToProductCode("9999");
    setToProductDesc("");
    setCashLimit("100000");
    setFromDate("01/04/2025");
    setToDate("30/03/2026");
    setReportData([]);
    setError("");
    setFetched(false);
    setActiveReport("");
  };

  const executeGeneralReport = async (flagValue) => {
    setLoading(true);
    setError("");
    setFetched(false);
    setActiveReport(flagValue === "CREDIT" ? "CTR Credit Report" : "CTR Debit Report");

    try {
      const body = {
        brcd: fromBrcd.trim(),
        flag: flagValue,
        fromDate: toISO(fromDate),
        toDate: toISO(toDate),
        fsgl: fromProductCode.trim(),
        tsgl: toProductCode.trim(),
        ctrLimit: cashLimit.trim()
      };

      const res = await fetch(`${API_BASE_URL}/api/ctr-report/general-report`, {
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
      setReportData(data);
      setFetched(true);
    } catch (err) {
      setError(err.message || "Failed to fetch general report.");
    } finally {
      setLoading(false);
    }
  };

  const executeLimitReport = async () => {
    setLoading(true);
    setError("");
    setFetched(false);
    setActiveReport("CTR Limit Report");

    try {
      const body = {
        fromBrcd: fromBrcd.trim(),
        toBrcd: toBrcd.trim(),
        fromDate: toISO(fromDate),
        toDate: toISO(toDate),
        fromAmount: cashLimit.trim()
      };

      const res = await fetch(`${API_BASE_URL}/api/ctr-report/limit-report`, {
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
      setReportData(data);
      setFetched(true);
    } catch (err) {
      setError(err.message || "Failed to fetch limit report.");
    } finally {
      setLoading(false);
    }
  };

  const executeRiskCategoryUpdate = async (flagValue, label) => {
    setLoading(true);
    setError("");
    setFetched(false);
    setActiveReport(label);

    try {
      const body = {
        fromBrcd: fromBrcd.trim(),
        toBrcd: toBrcd.trim(),
        fromDate: toISO(fromDate),
        toDate: toISO(toDate),
        fromAmount: cashLimit.trim(),
        flag: flagValue,
        mid: "2"
      };

      const res = await fetch(`${API_BASE_URL}/api/ctr-report/risk-category-update`, {
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
      setReportData(data);
      setFetched(true);
    } catch (err) {
      setError(err.message || `Failed to run ${label}.`);
    } finally {
      setLoading(false);
    }
  };

  const standardRows = reportData.map((row, idx) => mapRowToStandard(row, idx));

  // Determine if grouping is active for this dataset
  const hasGrouping = standardRows.some(
    (row) => row.customerType || row.category || row.oldCategory
  );

  // Group data by customerType and category
  const groupedData = {};
  if (hasGrouping) {
    standardRows.forEach((row) => {
      const custType = row.customerType || "Others";
      const cat = row.category || row.oldCategory || "General";
      if (!groupedData[custType]) {
        groupedData[custType] = {};
      }
      if (!groupedData[custType][cat]) {
        groupedData[custType][cat] = [];
      }
      groupedData[custType][cat].push(row);
    });
  }

  const handleDownloadCsv = () => {
    if (!standardRows || !standardRows.length) return;
    const headers = CTR_COLUMNS.map(col => col.label).join(',');
    const rows = standardRows.map(row =>
      CTR_COLUMNS.map(col => {
        let str = String(row[col.key] ?? '');
        str = str.replace(/"/g, '""');
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
          str = `"${str}"`;
        }
        return str;
      }).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ctr_report_${activeReport.toLowerCase().replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="ctr-wrapper">
      <div className="ctr-card no-print">
        <div className="ctr-header">CTR Report &amp; Risk Update Menu</div>

        <div className="ctr-form-section">
          {/* From Brcd / To Brcd */}
          <div className="ctr-row">
            <label className="ctr-label">From Brcd <span style={{ color: "#ef4444" }}>*</span></label>
            <input className="ctr-input" type="text" value={fromBrcd} onChange={(e) => setFromBrcd(e.target.value)} />
            <label className="ctr-inline-label">To Brcd <span style={{ color: "#ef4444" }}>*</span></label>
            <input className="ctr-input" type="text" value={toBrcd} onChange={(e) => setToBrcd(e.target.value)} />
          </div>

          {/* From Product Code */}
          <div className="ctr-row">
            <label className="ctr-label">From Product Code <span style={{ color: "#ef4444" }}>*</span></label>
            <input className="ctr-input" type="text" value={fromProductCode} onChange={(e) => setFromProductCode(e.target.value)} />
            <input className="ctr-input" style={{ marginLeft: 8, width: 320 }} type="text" placeholder="From Product Name" value={fromProductDesc} onChange={(e) => setFromProductDesc(e.target.value)} />
          </div>

          {/* To Product Code */}
          <div className="ctr-row">
            <label className="ctr-label">To Product Code <span style={{ color: "#ef4444" }}>*</span></label>
            <input className="ctr-input" type="text" value={toProductCode} onChange={(e) => setToProductCode(e.target.value)} />
            <input className="ctr-input" style={{ marginLeft: 8, width: 320 }} type="text" placeholder="To Product Name" value={toProductDesc} onChange={(e) => setToProductDesc(e.target.value)} />
          </div>

          {/* Cash Limit */}
          <div className="ctr-row">
            <label className="ctr-label">Cash Limit <span style={{ color: "#ef4444" }}>*</span></label>
            <input className="ctr-input" type="text" value={cashLimit} onChange={(e) => setCashLimit(e.target.value)} />
          </div>

          {/* From Date / To Date */}
          <div className="ctr-row">
            <label className="ctr-label">From Date <span style={{ color: "#ef4444" }}>*</span></label>
            <input className="ctr-input" type="text" placeholder="DD/MM/YYYY" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <label className="ctr-inline-label">To Date <span style={{ color: "#ef4444" }}>*</span></label>
            <input className="ctr-input" type="text" placeholder="DD/MM/YYYY" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>

        {error && <p className="ctr-error" style={{ margin: "0 20px 10px 20px" }}>⚠️ {error}</p>}

        {loading && (
          <div className="ctr-loading-bar" style={{ margin: "0 20px 10px 20px", width: "calc(100% - 40px)" }}>
            <div className="ctr-loading-fill" />
          </div>
        )}

        {/* Buttons Row 1 */}
        <div className="ctr-btn-row">
          <button className="ctr-btn ctr-btn-blue" onClick={() => executeGeneralReport("CREDIT")} disabled={loading}>CTR Credit Report</button>
          <button className="ctr-btn ctr-btn-blue" onClick={() => executeGeneralReport("DEBIT")} disabled={loading}>CTR Debit Report</button>
          <button className="ctr-btn ctr-btn-blue" onClick={executeLimitReport} disabled={loading}>CTR Limit Report</button>
          <button className="ctr-btn ctr-btn-secondary" onClick={handleClear} disabled={loading}>Clear</button>
        </div>

        {/* Buttons Row 2 */}
        <div className="ctr-btn-row" style={{ marginTop: -8 }}>
          <button className="ctr-btn ctr-btn-orange" onClick={() => executeRiskCategoryUpdate("D", "Transaction Risk Category")} disabled={loading}>Transaction Risk Category</button>
          <button className="ctr-btn ctr-btn-orange" onClick={() => executeRiskCategoryUpdate("S", "Risk Category Summary")} disabled={loading}>Risk Category Summary</button>
          <button className="ctr-btn ctr-btn-orange" onClick={() => executeRiskCategoryUpdate("KYCSUMMARY", "Summary match With KYC")} disabled={loading}>Summary match With KYC</button>
          <button className="ctr-btn ctr-btn-orange" onClick={() => executeRiskCategoryUpdate("UPDATE", "Risk Category Update")} disabled={loading}>Risk Category Update</button>
          {reportData.length > 0 && (
            <button className="ctr-btn ctr-btn-excel" onClick={handleDownloadCsv}>Export CSV</button>
          )}
        </div>
      </div>

      {/* Results Section / Preview Layout */}
      {fetched && reportData.length > 0 && (
        <>
          {/* Preview Toolbar */}
          <div className="ctr-preview-toolbar no-print">
            <span className="ctr-preview-title">{activeReport} — Preview</span>
            <button className="ctr-btn-print" onClick={() => window.print()}>
              🖨️ Print
            </button>
          </div>

          {/* Formatted Report Document */}
          <div className="ctr-formatted-report">
            {/* Org Header */}
            <div className="ctr-fmt-org-name">
              SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI
            </div>

            {/* Meta Grid */}
            <div className="ctr-fmt-meta-grid">
              <div className="ctr-fmt-meta-left">
                <div className="ctr-fmt-meta-row">
                  <span className="ctr-fmt-meta-key">Name</span>
                  <span className="ctr-fmt-meta-sep">:</span>
                  <span className="ctr-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
                </div>
                <div className="ctr-fmt-meta-row">
                  <span className="ctr-fmt-meta-key">Branch Name</span>
                  <span className="ctr-fmt-meta-sep">:</span>
                  <span className="ctr-fmt-meta-val">{fromBrcd === "1" ? "HEAD OFFICE" : `BRANCH ${fromBrcd}`}</span>
                </div>
              </div>
              <div className="ctr-fmt-meta-right">
                <div className="ctr-fmt-meta-row">
                  <span className="ctr-fmt-meta-key">Print Date</span>
                  <span className="ctr-fmt-meta-sep">:</span>
                  <span className="ctr-fmt-meta-val">
                    {new Date().toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <div className="ctr-fmt-meta-row">
                  <span className="ctr-fmt-meta-key">User ID</span>
                  <span className="ctr-fmt-meta-sep">:</span>
                  <span className="ctr-fmt-meta-val">Rohini</span>
                </div>
              </div>
            </div>

            <div className="ctr-fmt-divider" />

            {/* Render tables based on grouping presence */}
            {hasGrouping ? (
              Object.entries(groupedData).map(([custType, categories]) => (
                <div key={custType} className="ctr-group-section">
                  <h3 className="ctr-group-header-1">{custType}</h3>
                  {Object.entries(categories).map(([category, rows]) => (
                    <div key={category} className="ctr-subgroup-section">
                      <h4 className="ctr-group-header-2">{category}</h4>
                      <table className="ctr-fmt-table">
                        <thead>
                          <tr>
                            {CTR_COLUMNS.map((col) => (
                              <th key={col.key} className="ctr-fmt-th" style={{ width: col.width }}>
                                {col.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row) => (
                            <tr key={row.srNo}>
                              {CTR_COLUMNS.map((col) => (
                                <td
                                  key={col.key}
                                  className="ctr-fmt-td"
                                  style={{ textAlign: col.align || "left" }}
                                >
                                  {row[col.key]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <table className="ctr-fmt-table">
                <thead>
                  <tr>
                    {CTR_COLUMNS.map((col) => (
                      <th key={col.key} className="ctr-fmt-th" style={{ width: col.width }}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standardRows.map((row) => (
                    <tr key={row.srNo}>
                      {CTR_COLUMNS.map((col) => (
                        <td
                          key={col.key}
                          className="ctr-fmt-td"
                          style={{ textAlign: col.align || "left" }}
                        >
                          {row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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