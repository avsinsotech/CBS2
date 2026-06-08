import { useState } from "react";
import "./ScrollPrinting.css";

const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";

const parseDate = (raw) => {
  const parts = raw.trim().split("/");
  if (parts.length !== 3) return null;
  let [d, m, y] = parts;
  if (y.length === 2) y = "20" + y;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

function ScrollPrinting() {
  const [form, setForm] = useState({
    fromDate: "01/04/2025",
    toDate: "26/07/2025",
    branchCode: "all",
    branchCodeType: "all",
    productCode: "all",
    productCodeType: "all",
    trxActivity: "all",
    trxActivityType: "all",
    trxType: "all",
    trxTypeType: "all",
    amount: "all",
    amountType: "all",
    userCode: "all",
    userCodeType: "all",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [printMode, setPrintMode] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setFetched(false);
  };

  const validate = () => {
    if (!form.fromDate.trim()) return "From Date is required.";
    if (!form.toDate.trim()) return "To Date is required.";
    if (!parseDate(form.fromDate)) return "From Date must be DD/MM/YYYY.";
    if (!parseDate(form.toDate)) return "To Date must be DD/MM/YYYY.";
    return null;
  };

  const buildQuery = () => {
    const params = new URLSearchParams({
      fromDate: form.fromDate,
      toDate: form.toDate,
      branchCode: form.branchCodeType === "specific" ? form.branchCode : "all",
      productCode: form.productCodeType === "specific" ? form.productCode : "all",
      trxActivity: form.trxActivityType === "specific" ? form.trxActivity : "all",
      trxType: form.trxTypeType === "specific" ? form.trxType : "all",
      amount: form.amountType === "specific" ? form.amount : "all",
      userCode: form.userCodeType === "specific" ? form.userCode : "all",
    });

    return params.toString();
  };

  const fetchData = async (action) => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return null;
    }

    setLoading(true);
    setError("");
    setPrintMode(action);

    try {
      let url = "";

      if (action === "details") {
        url = `/api/scrollprinting/details?${buildQuery()}`;
      } else if (action === "summary") {
        url = `/api/scrollprinting/summary?${buildQuery()}`;
      } else if (action === "text-view") {
        url = `/api/scrollprinting/text-view?${buildQuery()}`;
      } else if (action === "text-print") {
        url = `/api/scrollprinting/text-print`;
      }

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: action === "text-print" ? "POST" : "GET",
        headers: action === "text-print" ? { "Content-Type": "application/json" } : {},
        body: action === "text-print" ? JSON.stringify({
          fromDate: form.fromDate,
          toDate: form.toDate,
          branchCode: form.branchCodeType === "specific" ? form.branchCode : "all",
          productCode: form.productCodeType === "specific" ? form.productCode : "all",
          trxActivity: form.trxActivityType === "specific" ? form.trxActivity : "all",
          trxType: form.trxTypeType === "specific" ? form.trxType : "all",
          amount: form.amountType === "specific" ? form.amount : "all",
          userCode: form.userCodeType === "specific" ? form.userCode : "all",
        }) : undefined,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || body.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      const data = Array.isArray(result) ? result : result.data || [];

      setReportData(data);
      setColumns(data.length > 0 ? Object.keys(data[0]) : []);
      setFetched(true);

      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch report.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = async () => {
    await fetchData("details");
  };

  const handleShowSummary = async () => {
    await fetchData("summary");
  };

  const handleTextView = async () => {
    await fetchData("text-view");
  };

  const handleTextPrint = async () => {
    const data = await fetchData("text-print");
    if (data && data.length > 0) {
      setTimeout(() => window.print(), 300);
    }
  };

  const handleExit = () => {
    setForm({
      fromDate: "01/04/2025",
      toDate: "26/07/2025",
      branchCode: "all",
      branchCodeType: "all",
      productCode: "all",
      productCodeType: "all",
      trxActivity: "all",
      trxActivityType: "all",
      trxType: "all",
      trxTypeType: "all",
      amount: "all",
      amountType: "all",
      userCode: "all",
      userCodeType: "all",
    });

    setReportData([]);
    setColumns([]);
    setError("");
    setFetched(false);
  };

  const renderFilterRow = (label, fieldName, inputFieldName) => (
    <div className="sp-row">
      <label className="sp-label">
        {label} <span className="sp-req">*</span>
      </label>
      <div className="sp-radio-group">
        <label className="sp-radio-label">
          <input
            type="radio"
            name={fieldName}
            value="specific"
            checked={form[fieldName] === "specific"}
            onChange={handleChange}
          />
          Specific
        </label>
        <label className="sp-radio-label">
          <input
            type="radio"
            name={fieldName}
            value="all"
            checked={form[fieldName] === "all"}
            onChange={handleChange}
          />
          All
        </label>
      </div>
      {form[fieldName] === "specific" && (
        <input
          className="sp-input sp-input-specific"
          name={inputFieldName}
          value={form[inputFieldName]}
          onChange={handleChange}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );

  return (
    <div className="sp-wrapper">
      <div className="sp-card no-print">
        {/* HEADER */}
        <div className="sp-header">
          <span>Scroll Printing</span>
        </div>

        {/* BODY */}
        <div className="sp-body">
          {/* DATE FIELDS */}
          <div className="sp-row">
            <label className="sp-label">
              From Date: <span className="sp-req">*</span>
            </label>
            <input
              className="sp-input"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
            <label className="sp-label sp-label-inline">
              To Date: <span className="sp-req">*</span>
            </label>
            <input
              className="sp-input"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* FILTER ROWS */}
          {renderFilterRow("Branch Code :", "branchCodeType", "branchCode")}
          {renderFilterRow("Product Code :", "productCodeType", "productCode")}
          {renderFilterRow("Trx Activity :", "trxActivityType", "trxActivity")}
          {renderFilterRow("Trx Type :", "trxTypeType", "trxType")}
          {renderFilterRow("Amount :", "amountType", "amount")}
          {renderFilterRow("User Code :", "userCodeType", "userCode")}

          {/* ERROR / LOADING */}
          {error && <p className="sp-error">{error}</p>}
          {loading && <p className="sp-loading">Loading... this may take up to 60 seconds.</p>}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="sp-footer">
          <button className="sp-btn" onClick={handleShowDetails} disabled={loading}>
            {loading && printMode === "details" ? "Loading..." : "Show Report Details"}
          </button>
          <button className="sp-btn" onClick={handleShowSummary} disabled={loading}>
            {loading && printMode === "summary" ? "Loading..." : "Show Report Summary"}
          </button>
          <button className="sp-btn sp-btn-blue" onClick={handleTextView} disabled={loading}>
            {loading && printMode === "text-view" ? "Loading..." : "Text Report View"}
          </button>
          <button className="sp-btn sp-btn-blue" onClick={handleTextPrint} disabled={loading}>
            {loading && printMode === "text-print" ? "Loading..." : "Text Report Print"}
          </button>
          <button className="sp-btn sp-btn-exit" onClick={handleExit}>
            Exit
          </button>
        </div>
      </div>

      {/* REPORT TABLE */}
      {fetched && reportData.length > 0 && (
        <div className="sp-table-wrapper">
          <table className="sp-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>{row[col] ?? ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="sp-record-count no-print">Total Records: {reportData.length}</p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="sp-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default ScrollPrinting;