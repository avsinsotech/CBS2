import { useState } from "react";
import "./BranchWiseDepositLoans.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://cbsapi.avsinsotech.com:8596";

function toISO(raw) {
  if (!raw) return null;
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return raw; // already YYYY-MM-DD
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export default function BranchWiseDepositLoans() {
  const [unit, setUnit] = useState("InCrore");
  const [productType, setProductType] = useState("LoanDetails");
  const [branchCode, setBranchCode] = useState("1");
  const [asOnDate, setAsOnDate] = useState("30/03/2026");
  const [withPrevMonth, setWithPrevMonth] = useState(false);

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const handleClear = () => {
    setUnit("InCrore");
    setProductType("LoanDetails");
    setBranchCode("1");
    setAsOnDate("30/03/2026");
    setWithPrevMonth(false);
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
      const body = {
        productType: productType,
        unit: unit,
        branchCode: branchCode.trim(),
        asOnDate: toISO(asOnDate)
      };

      const res = await fetch(`${API_BASE_URL}/api/branchwise-deposit-loans/report`, {
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
      setError(err.message || "Failed to fetch branchwise report.");
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

    const params = new URLSearchParams({
      productType: productType,
      unit: unit,
      branchCode: branchCode.trim(),
      asOnDate: toISO(asOnDate)
    });
    window.open(`${API_BASE_URL}/api/branchwise-deposit-loans/text-report-view?${params}`, "_blank");
  };

  const getRowData = (row) => {
    const subgl = row.SUBGLCODE ?? "";
    const glname = row.GLNAME ?? "";
    const name = subgl && glname ? `${subgl} - ${glname}` : (subgl || glname || "-");
    const noOfAc = row.ACCNO ?? row.NofoAcc_Curr ?? 0;
    const amount = row.AMOUNT ?? row.LoansAmt_Curr ?? row.DPAmt_Curr ?? 0;
    return {
      name,
      noOfAc: parseInt(noOfAc || 0, 10),
      amount: parseFloat(amount || 0)
    };
  };

  const handleDownloadCsv = () => {
    if (!reportData || !reportData.length) return;
    const isLoan = productType.toLowerCase().includes("loan");
    const amountHeader = isLoan ? "Loans Amount" : "Deposits Amount";
    const headers = ["Sr No", "DEPOSITS Name", "No Of A/C", amountHeader].join(",");

    const rows = reportData.map((row, i) => {
      const mapped = getRowData(row);
      let nameStr = String(mapped.name).replace(/"/g, '""');
      if (nameStr.includes(",") || nameStr.includes("\n") || nameStr.includes('"')) {
        nameStr = `"${nameStr}"`;
      }
      return [
        i + 1,
        nameStr,
        mapped.noOfAc,
        mapped.amount.toFixed(2)
      ].join(",");
    });

    const totalAccounts = reportData.reduce((sum, row) => sum + getRowData(row).noOfAc, 0);
    const totalAmount = reportData.reduce((sum, row) => sum + getRowData(row).amount, 0);
    const totalRow = ["Total :", "", totalAccounts, totalAmount.toFixed(2)].join(",");

    const csvContent = [headers, ...rows, totalRow].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `branchwise_${productType.toLowerCase()}_${asOnDate.replace(/\//g, "-")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoanProduct = productType.toLowerCase().includes("loan");
  const tableAmountHeader = isLoanProduct ? "Loans Amount" : "Deposits Amount";
  const subheaderTitle = isLoanProduct
    ? `Branch Wise Loans As On ${asOnDate}`
    : `Branch Wise Deposits As On ${asOnDate}`;

  // Totals calculations
  const totalAccounts = reportData.reduce((sum, row) => sum + getRowData(row).noOfAc, 0);
  const totalAmount = reportData.reduce((sum, row) => sum + getRowData(row).amount, 0);

  return (
    <div className="bwdl-wrapper">
      <div className="bwdl-card no-print">
        {/* Card Header */}
        <div className="bwdl-header">
          <h2>Branch Wise Deposit / Loans List</h2>
        </div>

        {/* Card Body */}
        <div className="bwdl-card-body">
          <div className="bwdl-form-section">
            {/* Row 1: Unit radios */}
            <div className="bwdl-row">
              <span className="bwdl-label">Unit :</span>
              <div className="bwdl-radio-group">
                {[
                  { value: "InThousand", label: "In Thousand" },
                  { value: "InLacs",     label: "In Lacs"     },
                  { value: "InCrore",    label: "In Crore"    },
                ].map((opt) => (
                  <label key={opt.value} className="bwdl-radio-label">
                    <input
                      type="radio"
                      name="unit"
                      value={opt.value}
                      checked={unit === opt.value}
                      onChange={() => setUnit(opt.value)}
                      className="bwdl-radio"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Row 2: Product Type radios */}
            <div className="bwdl-row">
              <span className="bwdl-label">Product Type : <span style={{ color: "#ef4444" }}>*</span></span>
              <div className="bwdl-radio-group">
                {[
                  { value: "Deposit",        label: "Deposit Summary" },
                  { value: "DepositDetails",  label: "Deposit Details" },
                  { value: "Loan",           label: "Loan Summary"    },
                  { value: "LoanDetails",    label: "Loan Details"    },
                ].map((opt) => (
                  <label key={opt.value} className="bwdl-radio-label">
                    <input
                      type="radio"
                      name="productType"
                      value={opt.value}
                      checked={productType === opt.value}
                      onChange={() => setProductType(opt.value)}
                      className="bwdl-radio"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Row 3: Branch Code & As On Date */}
            <div className="bwdl-row">
              <span className="bwdl-label">Branch Code : <span style={{ color: "#ef4444" }}>*</span></span>
              <input
                className="bwdl-input"
                type="text"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
              />

              <span className="bwdl-inline-label" style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginLeft: 20 }}>As On Date : <span style={{ color: "#ef4444" }}>*</span></span>
              <input
                className="bwdl-input"
                type="text"
                placeholder="DD/MM/YYYY"
                value={asOnDate}
                onChange={(e) => setAsOnDate(e.target.value)}
              />
            </div>

            {/* Row 4: With Prev Month checkbox */}
            <div className="bwdl-row">
              <span className="bwdl-label"></span>
              <label className="bwdl-checkbox-label">
                <input
                  type="checkbox"
                  checked={withPrevMonth}
                  onChange={(e) => setWithPrevMonth(e.target.checked)}
                  className="bwdl-checkbox"
                />
                With Prev Month
              </label>
            </div>
          </div>

          {error && <div style={{ color: "#ef4444", fontSize: 13, margin: "10px 20px" }}>⚠️ {error}</div>}

          {loading && (
            <div className="bwdl-loading-bar" style={{ margin: "10px 20px" }}>
              <div className="bwdl-loading-fill" />
            </div>
          )}

          {/* Buttons */}
          <div className="bwdl-btn-row">
            <button className="bwdl-btn bwdl-btn-blue" onClick={handleFetchReport} disabled={loading}>Report</button>
            <button className="bwdl-btn bwdl-btn-outline" onClick={handleTextReportView} disabled={loading}>Text Report View</button>
            <button className="bwdl-btn bwdl-btn-secondary" onClick={handleClear} disabled={loading}>Clear</button>
          </div>
        </div>
      </div>

      {/* Preview Toolbar */}
      {fetched && reportData.length > 0 && (
        <div className="bwdl-preview-toolbar no-print">
          <span className="bwdl-preview-title">Report Preview ({reportData.length} records found)</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="bwdl-btn bwdl-btn-excel" onClick={handleDownloadCsv}>Export CSV</button>
            <button className="bwdl-btn-print" onClick={() => window.print()}>🖨️ Print Report</button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {fetched && reportData.length > 0 && (
        <div className="bwdl-formatted-report">
          {/* Organization details */}
          <div className="bwdl-fmt-org-name">
            SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI
          </div>

          {/* Meta Info Grid */}
          <div className="bwdl-fmt-meta-grid">
            <div className="bwdl-fmt-meta-left">
              <div className="bwdl-fmt-meta-row">
                <span className="bwdl-fmt-meta-key">Bank Name</span>
                <span className="bwdl-fmt-meta-sep">:</span>
                <span className="bwdl-fmt-meta-val">SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI</span>
              </div>
              <div className="bwdl-fmt-meta-row">
                <span className="bwdl-fmt-meta-key">Branch Name</span>
                <span className="bwdl-fmt-meta-sep">:</span>
                <span className="bwdl-fmt-meta-val">{branchCode === "1" ? "HEAD OFFICE" : `BRANCH ${branchCode}`}</span>
              </div>
            </div>
            <div className="bwdl-fmt-meta-right">
              <div className="bwdl-fmt-meta-row">
                <span className="bwdl-fmt-meta-key">Print Date</span>
                <span className="bwdl-fmt-meta-sep">:</span>
                <span className="bwdl-fmt-meta-val">{new Date().toLocaleDateString("en-GB")}</span>
              </div>
              <div className="bwdl-fmt-meta-row">
                <span className="bwdl-fmt-meta-key">Print UserID</span>
                <span className="bwdl-fmt-meta-sep">:</span>
                <span className="bwdl-fmt-meta-val">Rohini</span>
              </div>
            </div>
          </div>

          <hr className="bwdl-fmt-divider" />

          {/* Gray banner */}
          <div className="bwdl-fmt-banner">
            {subheaderTitle}
          </div>

          {/* Table */}
          <table className="bwdl-fmt-table">
            <thead>
              <tr>
                <th className="bwdl-fmt-th bwdl-text-center" style={{ width: "60px" }}>Sr No</th>
                <th className="bwdl-fmt-th">DEPOSITS Name</th>
                <th className="bwdl-fmt-th bwdl-text-right" style={{ width: "120px" }}>No Of A/C</th>
                <th className="bwdl-fmt-th bwdl-text-right" style={{ width: "160px" }}>{tableAmountHeader}</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => {
                const mapped = getRowData(row);
                return (
                  <tr key={i}>
                    <td className="bwdl-fmt-td bwdl-text-center">{i + 1}</td>
                    <td className="bwdl-fmt-td">{mapped.name}</td>
                    <td className="bwdl-fmt-td bwdl-text-right">{mapped.noOfAc}</td>
                    <td className="bwdl-fmt-td bwdl-text-right">{mapped.amount.toFixed(2)}</td>
                  </tr>
                );
              })}
              {/* Totals Row */}
              <tr className="bwdl-total-row">
                <td className="bwdl-fmt-td bwdl-text-center" style={{ borderRight: "none" }}></td>
                <td className="bwdl-fmt-td" style={{ borderLeft: "none", fontWeight: 700 }}>Total :</td>
                <td className="bwdl-fmt-td bwdl-text-right" style={{ fontWeight: 700 }}>{totalAccounts}</td>
                <td className="bwdl-fmt-td bwdl-text-right" style={{ fontWeight: 700 }}>{totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {fetched && reportData.length === 0 && (
        <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", color: "#6b7280", borderRadius: 6, padding: "14px", fontSize: 13, textAlign: "center" }}>
          No records found for the selected criteria.
        </div>
      )}
    </div>
  );
}