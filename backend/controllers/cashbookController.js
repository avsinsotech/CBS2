const { getPool, sql } = require("../config/db");

/**
 * GET /api/cashbook
 * Query Params:
 *   fromDate  - string DD/MM/YYYY or YYYY-MM-DD
 *   toDate    - string DD/MM/YYYY or YYYY-MM-DD
 *   branchCode - string (branch code, default '1')
 *   reportType - 'details' | 'summary'
 *   reportName - string (optional label)
 */
const getCashBook = async (req, res) => {
  try {
    const { fromDate, toDate, branchCode = "1", reportType = "details", reportName } = req.query;

    // --- Validation ---
    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "fromDate and toDate are required.",
      });
    }

    const fdt = parseDate(fromDate);
    const tdt = parseDate(toDate);

    if (!fdt || !tdt) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD.",
      });
    }

    if (new Date(fdt) > new Date(tdt)) {
      return res.status(400).json({
        success: false,
        message: "fromDate cannot be greater than toDate.",
      });
    }

    const pool = await getPool();

    // Execute stored procedure: EXEC SP_CASHBOOK @P_FDT, @P_TDT, @BRCD
    const result = await pool
      .request()
      .input("P_FDT", sql.VarChar(20), fdt)
      .input("P_TDT", sql.VarChar(20), tdt)
      .input("BRCD", sql.VarChar(10), branchCode)
      .execute("SP_CASHBOOK");

    // SP may return multiple recordsets — handle both
    const recordsets = result.recordsets;
    const data = recordsets[0] || [];
    const summary = recordsets[1] || null; // if SP returns a summary recordset

    return res.status(200).json({
      success: true,
      reportType,
      reportName: reportName || null,
      fromDate: fdt,
      toDate: tdt,
      branchCode,
      totalRecords: data.length,
      data,
      ...(summary ? { summary } : {}),
    });
  } catch (err) {
    console.error("getCashBook error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

/**
 * POST /api/cashbook/download
 * Body: { fromDate, toDate, branchCode, reportType, reportName, format }
 * format: 'excel' | 'pdf' | 'csv'
 * Returns: file download (delegated to client — returns data + metadata)
 */
const downloadCashBook = async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      branchCode = "1",
      reportType = "details",
      reportName,
      format = "excel",
    } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({ success: false, message: "fromDate and toDate are required." });
    }

    const fdt = parseDate(fromDate);
    const tdt = parseDate(toDate);

    if (!fdt || !tdt) {
      return res.status(400).json({ success: false, message: "Invalid date format." });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("P_FDT", sql.VarChar(20), fdt)
      .input("P_TDT", sql.VarChar(20), tdt)
      .input("BRCD", sql.VarChar(10), branchCode)
      .execute("SP_CASHBOOK");

    const data = result.recordsets[0] || [];

    // Return raw data; frontend (or a separate export util) handles file generation
    return res.status(200).json({
      success: true,
      reportType,
      reportName: reportName || "CashBook",
      fromDate: fdt,
      toDate: tdt,
      branchCode,
      format,
      totalRecords: data.length,
      data,
    });
  } catch (err) {
    console.error("downloadCashBook error:", err);
    return res.status(500).json({ success: false, message: "Internal server error.", error: err.message });
  }
};

/**
 * POST /api/cashbook/print
 * Body: { fromDate, toDate, branchCode, reportType, reportName }
 * Returns same data payload — client triggers print dialog
 */
const printCashBook = async (req, res) => {
  try {
    const { fromDate, toDate, branchCode = "1", reportType = "details", reportName } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({ success: false, message: "fromDate and toDate are required." });
    }

    const fdt = parseDate(fromDate);
    const tdt = parseDate(toDate);

    if (!fdt || !tdt) {
      return res.status(400).json({ success: false, message: "Invalid date format." });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("P_FDT", sql.VarChar(20), fdt)
      .input("P_TDT", sql.VarChar(20), tdt)
      .input("BRCD", sql.VarChar(10), branchCode)
      .execute("SP_CASHBOOK");

    const data = result.recordsets[0] || [];

    return res.status(200).json({
      success: true,
      reportType,
      reportName: reportName || "CashBook",
      fromDate: fdt,
      toDate: tdt,
      branchCode,
      totalRecords: data.length,
      data,
    });
  } catch (err) {
    console.error("printCashBook error:", err);
    return res.status(500).json({ success: false, message: "Internal server error.", error: err.message });
  }
};

/**
 * GET /api/cashbook/report
 * Same as getCashBook but explicitly labelled as "Cash Book Report" view
 * Supports same query params: fromDate, toDate, branchCode, reportType, reportName
 */
const getCashBookReport = async (req, res) => {
  // Reuse getCashBook logic — treat as alias
  return getCashBook(req, res);
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Normalise date to YYYY-MM-DD for SQL Server
 * Accepts DD/MM/YYYY or YYYY-MM-DD
 */
function parseDate(dateStr) {
  if (!dateStr) return null;

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  // DD/MM/YYYY → YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split("/");
    return `${y}-${m}-${d}`;
  }

  return null;
}

module.exports = { getCashBook, downloadCashBook, printCashBook, getCashBookReport };