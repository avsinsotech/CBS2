const { getPool, sql } = require("../config/db");

/**
 * Helper: parse DD/MM/YYYY or YYYY-MM-DD → YYYY-MM-DD
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split("/");
    return `${y}-${m}-${d}`;
  }
  return null;
}

/**
 * Extract month from YYYY-MM-DD → "MM" (zero-padded)
 */
function getMonth(dateStr) {
  return dateStr.split("-")[1]; // e.g. "04"
}

/**
 * Extract year from YYYY-MM-DD → "YYYY"
 */
function getYear(dateStr) {
  return dateStr.split("-")[0]; // e.g. "2026"
}

/**
 * Core helper that executes TRANSREPORT SP
 * @param {object} params
 * @param {string} sflag - 'SUMMARY' | 'DETAILS' | 'TEXT'
 */
async function executeTransReport(params, sflag) {
  const {
    fromDate,
    toDate,
    branchCode = "1",
    subGlCode = "",
    amount = "0.00",
    accNo = "",
    type = "",
    activity = 0,
    flag = "0",
  } = params;

  const fdt = parseDate(fromDate);
  const tdt = parseDate(toDate);

  if (!fdt || !tdt) {
    throw new Error("Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD.");
  }

  if (new Date(fdt) > new Date(tdt)) {
    throw new Error("fromDate cannot be greater than toDate.");
  }

  const pfmonth = getMonth(fdt);   // "04"
  const ptmonth = getMonth(tdt);   // "05"
  const pfyear  = getYear(fdt);    // "2026"
  const ptyear  = getYear(tdt);    // "2026"

  const pool = await getPool();

  const result = await pool
    .request()
    .input("pfmonth",  sql.VarChar(2),   pfmonth)
    .input("ptmonth",  sql.VarChar(2),   ptmonth)
    .input("PFDT",     sql.VarChar(20),  fdt)
    .input("PTDT",     sql.VarChar(20),  tdt)
    .input("pfyear",   sql.VarChar(4),   pfyear)
    .input("ptyear",   sql.VarChar(4),   ptyear)
    .input("SUBGLCODE",sql.VarChar(50),  subGlCode)
    .input("BRCD",     sql.VarChar(10),  branchCode === "all" ? "1" : branchCode)
    .input("AMOUNT",   sql.VarChar(20),  amount === "all" ? "0.00" : amount)
    .input("ACCNO",    sql.VarChar(50),  accNo === "all" ? "" : accNo)
    .input("TYPE",     sql.VarChar(50),  type === "all" ? "" : type)
    .input("Activity", sql.Int,          parseInt(activity) || 0)
    .input("FLAG",     sql.VarChar(5),   flag)
    .input("SFLAG",    sql.VarChar(20),  sflag)
    .execute("TRANSREPORT");

  return { result, fdt, tdt, pfmonth, ptmonth, pfyear, ptyear };
}

// ─────────────────────────────────────────────────────────────
// GET /api/scrollprinting/details
// Query Params: fromDate, toDate, branchCode, subGlCode,
//               amount, accNo, type, activity, flag
// ─────────────────────────────────────────────────────────────
const getScrollDetails = async (req, res) => {
  try {
    const { result, fdt, tdt } = await executeTransReport(req.query, "DETAILS");

    const recordsets = result.recordsets;
    const data    = recordsets[0] || [];
    const summary = recordsets[1] || null;

    return res.status(200).json({
      success: true,
      sflag: "DETAILS",
      fromDate: fdt,
      toDate: tdt,
      branchCode: req.query.branchCode || "1",
      totalRecords: data.length,
      data,
      ...(summary ? { summary } : {}),
    });
  } catch (err) {
    console.error("getScrollDetails error:", err);
    const status = err.message.includes("Invalid date") || err.message.includes("cannot be greater") ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/scrollprinting/summary
// ─────────────────────────────────────────────────────────────
const getScrollSummary = async (req, res) => {
  try {
    const { result, fdt, tdt } = await executeTransReport(req.query, "SUMMARY");

    const data = result.recordsets[0] || [];

    return res.status(200).json({
      success: true,
      sflag: "SUMMARY",
      fromDate: fdt,
      toDate: tdt,
      branchCode: req.query.branchCode || "1",
      totalRecords: data.length,
      data,
    });
  } catch (err) {
    console.error("getScrollSummary error:", err);
    const status = err.message.includes("Invalid date") || err.message.includes("cannot be greater") ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/scrollprinting/text-view
// ─────────────────────────────────────────────────────────────
const getScrollTextView = async (req, res) => {
  try {
    const { result, fdt, tdt } = await executeTransReport(req.query, "DETAILS");

    const data = result.recordsets[0] || [];

    return res.status(200).json({
      success: true,
      sflag: "TEXT-VIEW",
      fromDate: fdt,
      toDate: tdt,
      branchCode: req.query.branchCode || "1",
      totalRecords: data.length,
      data,
    });
  } catch (err) {
    console.error("getScrollTextView error:", err);
    const status = err.message.includes("Invalid date") || err.message.includes("cannot be greater") ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/scrollprinting/text-print
// Body: { fromDate, toDate, branchCode, subGlCode,
//         amount, accNo, type, activity, flag }
// ─────────────────────────────────────────────────────────────
const postScrollTextPrint = async (req, res) => {
  try {
    const { result, fdt, tdt } = await executeTransReport(req.body, "DETAILS");

    const data = result.recordsets[0] || [];

    return res.status(200).json({
      success: true,
      sflag: "TEXT-PRINT",
      fromDate: fdt,
      toDate: tdt,
      branchCode: req.body.branchCode || "1",
      totalRecords: data.length,
      data,
    });
  } catch (err) {
    console.error("postScrollTextPrint error:", err);
    const status = err.message.includes("Invalid date") || err.message.includes("cannot be greater") ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/scrollprinting/download
// Body: { fromDate, toDate, branchCode, sflag, ...filters }
// sflag: 'SUMMARY' | 'DETAILS'
// ─────────────────────────────────────────────────────────────
const downloadScrollPrinting = async (req, res) => {
  try {
    const { sflag = "DETAILS", format = "excel", ...rest } = req.body;

    if (!rest.fromDate || !rest.toDate) {
      return res.status(400).json({ success: false, message: "fromDate and toDate are required." });
    }

    const { result, fdt, tdt } = await executeTransReport(rest, sflag.toUpperCase());

    const data = result.recordsets[0] || [];

    return res.status(200).json({
      success: true,
      sflag: sflag.toUpperCase(),
      format,
      fromDate: fdt,
      toDate: tdt,
      branchCode: rest.branchCode || "1",
      totalRecords: data.length,
      data,
    });
  } catch (err) {
    console.error("downloadScrollPrinting error:", err);
    const status = err.message.includes("Invalid date") || err.message.includes("cannot be greater") ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

module.exports = {
  getScrollDetails,
  getScrollSummary,
  getScrollTextView,
  postScrollTextPrint,
  downloadScrollPrinting,
};