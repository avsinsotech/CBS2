import { useState } from "react";
import "./DebitEntryReport.css";

const API_BASE_URL = "https://cbsapi.avsinsotech.com:8596";

// Mock branch data - replace with actual API call
const BRANCH_OPTIONS = [
  { id: "1", name: "HEAD OFFICE" },
  { id: "2", name: "BRANCH 1" },
  { id: "3", name: "BRANCH 2" },
  { id: "4", name: "BRANCH 3" },
];

// Mock product type data
const PRODUCT_TYPE_OPTIONS = [
  "Savings Account",
  "Current Account",
  "Fixed Deposit",
  "Loan",
  "DDS",
];

function DebitEntryReport() {
  const [form, setForm] = useState({
    branchCode: "1",
    branchName: "HEAD OFFICE",
    productType: "",
    productName: "",
    fromDate: "26/07/2025",
    reportName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fetched, setFetched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setFetched(false);
  };

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    const branch = BRANCH_OPTIONS.find((b) => b.id === branchId);
    setForm({
      ...form,
      branchCode: branchId,
      branchName: branch ? branch.name : "",
    });
    setFetched(false);
  };

  const validate = () => {
    if (!form.branchCode.trim()) return "Branch Code is required.";
    if (!form.branchName.trim()) return "Branch Name is required.";
    if (!form.fromDate.trim()) return "From Date is required.";
    return null;
  };

  const buildQuery = () => {
    const params = new URLSearchParams({
      branchCode: form.branchCode,
      branchName: form.branchName,
      productType: form.productType,
      productName: form.productName,
      fromDate: form.fromDate,
      reportName: form.reportName,
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

    try {
      const url = `/api/debit-entry-report?${buildQuery()}&action=${action}`;

      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body.error || body.message || `Server error: ${response.status}`
        );
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

  const handleSubmit = async () => {
    await fetchData("submit");
  };

  const handleDownload = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/debit-entry-report/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branchCode: form.branchCode,
          branchName: form.branchName,
          productType: form.productType,
          productName: form.productName,
          fromDate: form.fromDate,
          reportName: form.reportName,
          format: "excel",
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body.error || body.message || `Server error: ${response.status}`
        );
      }

      const result = await response.json();
      const rows = result.data || [];

      if (rows.length === 0) {
        setError("No records found to download.");
        return;
      }

      const headers = Object.keys(rows[0]);
      let csvContent =
        headers.join(",") +
        "\n" +
        rows
          .map((row) =>
            headers
              .map((header) =>
                `"${row[header] !== null ? row[header] : ""}"`
              )
              .join(",")
          )
          .join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        (form.reportName || "DebitEntryReport") + ".csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Failed to download report.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    const data = (fetched) ? reportData : await fetchData("print");
    if (data && data.length > 0) {
      setTimeout(() => window.print(), 300);
    }
  };

  return (
    <div className="der-wrapper">
      <div className="der-card no-print">

        {/* HEADER */}
        <div className="der-header">
          <span>Debit Entry Report</span>
        </div>

        {/* BODY */}
        <div className="der-body">

          {/* ROW 1: Brcd + Brcd name */}
          <div className="der-row">
            <label className="der-label">Brcd</label>
            <input
              className="der-input der-input-small"
              name="branchCode"
              value={form.branchCode}
              onChange={handleChange}
              placeholder="Branch Code"
            />
            <label className="der-label der-label-inline">Brcd name</label>
            <select
              className="der-select"
              name="branchName"
              value={form.branchCode}
              onChange={handleBranchChange}
            >
              {BRANCH_OPTIONS.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* ROW 2: Product Type + Product Name */}
          <div className="der-row">
            <label className="der-label">Product Type</label>
            <select
              className="der-input der-input-medium"
              name="productType"
              value={form.productType}
              onChange={handleChange}
            >
              <option value="">Product Type</option>
              {PRODUCT_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              className="der-input der-input-large"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              placeholder="PRODUCT NAME"
            />
          </div>

          {/* ROW 3: From Date */}
          <div className="der-row">
            <label className="der-label">From Date</label>
            <input
              className="der-input der-input-medium"
              name="fromDate"
              type="text"
              value={form.fromDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* ROW 4: Report Name */}
          <div className="der-row">
            <label className="der-label">Enter Text Report Name</label>
            <input
              className="der-input der-input-medium"
              name="reportName"
              value={form.reportName}
              onChange={handleChange}
              placeholder="Report Name"
            />
          </div>

          {/* ERROR / LOADING */}
          {error && <p className="der-error">{error}</p>}
          {loading && <p className="der-loading">Loading... please wait.</p>}

        </div>

        {/* FOOTER BUTTONS */}
        <div className="der-footer">
          <button
            className="der-btn der-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Submit"}
          </button>
          <button
            className="der-btn der-btn-primary"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? "Loading..." : "Download"}
          </button>
          <button
            className="der-btn der-btn-primary"
            onClick={handlePrint}
            disabled={loading}
          >
            {loading ? "Loading..." : "Print"}
          </button>
        </div>

      </div>

      {/* REPORT TABLE */}
      {fetched && reportData.length > 0 && (
        <div className="der-table-wrapper">

          {/* Print header */}
          <div className="print-only der-print-header">
            <h2>Debit Entry Report</h2>
            <p>
              Branch: {form.branchName} &nbsp;|&nbsp;
              From: {form.fromDate} &nbsp;|&nbsp;
              Printed: {new Date().toLocaleDateString()}
            </p>
          </div>

          <table className="der-table">
            <thead>
              <tr>
                {columns.map((col) => <th key={col}>{col}</th>)}
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

          <p className="der-record-count no-print">
            Total Records: {reportData.length}
          </p>
        </div>
      )}

      {fetched && reportData.length === 0 && !loading && (
        <p className="der-error no-print">No records found for the given criteria.</p>
      )}
    </div>
  );
}

export default DebitEntryReport;