// const { getPool, sql } = require("../config/db");

// // ─── Date helper ─────────────────────────────────────────────
// function parseDate(dateStr) {
//   if (!dateStr) return null;
//   if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
//   if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
//     const [d, m, y] = dateStr.split("/");
//     return `${y}-${m}-${d}`;
//   }
//   return null;
// }

// // ─────────────────────────────────────────────────────────────
// // GET /api/debit-entry-report/gl-name
// // Query Params: subglcode, brcd
// //
// // Runs:
// //   SELECT GLNAME FROM GLMAST
// //   WHERE SUBGLCODE = @subglcode AND BRCD = @brcd
// //
// // Used by the frontend to resolve a typed SUBGLCODE → GLNAME label
// // ─────────────────────────────────────────────────────────────
// const getGLName = async (req, res) => {
//   try {
//     const { subglcode, brcd = "1" } = req.query;

//     if (!subglcode) {
//       return res.status(400).json({ success: false, message: "subglcode is required." });
//     }

//     const pool = await getPool();

//     const result = await pool
//       .request()
//       .input("subglcode", sql.VarChar(50), subglcode)
//       .input("brcd",      sql.VarChar(10), brcd)
//       .query(
//         `SELECT GLNAME FROM GLMAST
//          WHERE SUBGLCODE = @subglcode
//            AND BRCD      = @brcd`
//       );

//     const rows = result.recordset || [];

//     return res.status(200).json({
//       success:   true,
//       subglcode,
//       brcd,
//       glname:    rows.length > 0 ? rows[0].GLNAME : null,
//       data:      rows,
//     });
//   } catch (err) {
//     console.error("getGLName error:", err);
//     return res.status(500).json({ success: false, message: "Internal server error.", error: err.message });
//   }
// };

// // ─────────────────────────────────────────────────────────────
// // GET /api/debit-entry-report/gl-list
// // Query Params: brcd
// //
// // Fetches all GL entries for a branch — used to populate the
// // Product Name dropdown
// // ─────────────────────────────────────────────────────────────
// const getGLList = async (req, res) => {
//   try {
//     const { brcd = "1" } = req.query;

//     const pool = await getPool();

//     const result = await pool
//       .request()
//       .input("brcd", sql.VarChar(10), brcd)
//       .query(
//         `SELECT SUBGLCODE, GLNAME
//          FROM GLMAST
//          WHERE BRCD = @brcd
//          ORDER BY GLNAME`
//       );

//     const rows = result.recordset || [];

//     return res.status(200).json({
//       success:      true,
//       brcd,
//       totalRecords: rows.length,
//       data:         rows,
//     });
//   } catch (err) {
//     console.error("getGLList error:", err);
//     return res.status(500).json({ success: false, message: "Internal server error.", error: err.message });
//   }
// };

// // ─────────────────────────────────────────────────────────────
// // Core helper — runs the GLMAST query that backs all report
// // endpoints. Replace / extend the WHERE clause once you share
// // the actual debit-entry stored procedure.
// // ─────────────────────────────────────────────────────────────
// async function runDebitReport({ branchCode, fromDate, subGlCode, productType, productName }) {
//   const fdt = parseDate(fromDate);
//   if (!fdt) throw new Error("Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD.");

//   const pool = await getPool();

//   // ── Core query ──────────────────────────────────────────
//   // Currently maps directly to the confirmed SP:
//   //   SELECT GLNAME FROM GLMAST
//   //   WHERE SUBGLCODE = @subglcode AND BRCD = @brcd
//   //
//   // Once you share the full debit-entry SP, replace this block
//   // with:  .execute("YOUR_SP_NAME")  and add the extra inputs.
//   // ────────────────────────────────────────────────────────
//   const result = await pool
//     .request()
//     .input("subglcode",   sql.VarChar(50),  subGlCode   || "1")
//     .input("brcd",        sql.VarChar(10),  branchCode  || "1")
//     .input("fromDate",    sql.VarChar(20),  fdt)
//     .input("productType", sql.VarChar(100), productType || "")
//     .input("productName", sql.VarChar(100), productName || "")
//     .query(
//       `SELECT GLNAME
//        FROM GLMAST
//        WHERE SUBGLCODE = @subglcode
//          AND BRCD      = @brcd`
//     );

//   return { data: result.recordset || [], fdt };
// }

// // ─────────────────────────────────────────────────────────────
// // GET /api/debit-entry-report
// // Query Params: branchCode, fromDate, subGlCode, productType,
// //               productName, reportName, action
// // ─────────────────────────────────────────────────────────────
// const getDebitEntryReport = async (req, res) => {
//   try {
//     const {
//       branchCode  = "1",
//       fromDate,
//       subGlCode   = "1",
//       productType = "",
//       productName = "",
//       reportName,
//     } = req.query;

//     if (!fromDate) {
//       return res.status(400).json({ success: false, message: "fromDate is required." });
//     }

//     const { data, fdt } = await runDebitReport({ branchCode, fromDate, subGlCode, productType, productName });

//     return res.status(200).json({
//       success:      true,
//       reportName:   reportName || "DebitEntryReport",
//       fromDate:     fdt,
//       branchCode,
//       subGlCode,
//       productType,
//       productName,
//       totalRecords: data.length,
//       data,
//     });
//   } catch (err) {
//     console.error("getDebitEntryReport error:", err);
//     const status = err.message.includes("Invalid date") ? 400 : 500;
//     return res.status(status).json({ success: false, message: err.message });
//   }
// };

// // ─────────────────────────────────────────────────────────────
// // POST /api/debit-entry-report/download
// // Body: { branchCode, fromDate, subGlCode, productType,
// //         productName, reportName, format }
// // ─────────────────────────────────────────────────────────────
// const downloadDebitEntryReport = async (req, res) => {
//   try {
//     const {
//       branchCode  = "1",
//       fromDate,
//       subGlCode   = "1",
//       productType = "",
//       productName = "",
//       reportName,
//       format      = "excel",
//     } = req.body;

//     if (!fromDate) {
//       return res.status(400).json({ success: false, message: "fromDate is required." });
//     }

//     const { data, fdt } = await runDebitReport({ branchCode, fromDate, subGlCode, productType, productName });

//     return res.status(200).json({
//       success:      true,
//       reportName:   reportName || "DebitEntryReport",
//       fromDate:     fdt,
//       branchCode,
//       subGlCode,
//       productType,
//       productName,
//       format,
//       totalRecords: data.length,
//       data,
//     });
//   } catch (err) {
//     console.error("downloadDebitEntryReport error:", err);
//     const status = err.message.includes("Invalid date") ? 400 : 500;
//     return res.status(status).json({ success: false, message: err.message });
//   }
// };

// // ─────────────────────────────────────────────────────────────
// // POST /api/debit-entry-report/print
// // Body: same as download — client triggers window.print()
// // ─────────────────────────────────────────────────────────────
// const printDebitEntryReport = async (req, res) => {
//   return downloadDebitEntryReport(req, res);
// };

// module.exports = {
//   getGLName,
//   getGLList,
//   getDebitEntryReport,
//   downloadDebitEntryReport,
//   printDebitEntryReport,
// };

const { getPool, sql } = require("../config/db");

// ─── Date helper ─────────────────────────────────────────────
function parseDate(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split("/");
    return `${y}-${m}-${d}`;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// GET /api/debit-entry-report/gl-name
// Query Params: subglcode, brcd
//
// Runs:
//   SELECT GLNAME FROM GLMAST
//   WHERE SUBGLCODE = @subglcode AND BRCD = @brcd
//
// Used by the frontend to resolve a typed SUBGLCODE → GLNAME label
// ─────────────────────────────────────────────────────────────
const getGLName = async (req, res) => {
  try {
    const { subglcode, brcd = "1" } = req.query;

    if (!subglcode) {
      return res.status(400).json({ success: false, message: "subglcode is required." });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("subglcode", sql.VarChar(50), subglcode)
      .input("brcd",      sql.VarChar(10), brcd)
      .query(
        `SELECT GLNAME FROM GLMAST
         WHERE SUBGLCODE = @subglcode
           AND BRCD      = @brcd`
      );

    const rows = result.recordset || [];

    return res.status(200).json({
      success:   true,
      subglcode,
      brcd,
      glname:    rows.length > 0 ? rows[0].GLNAME : null,
      data:      rows,
    });
  } catch (err) {
    console.error("getGLName error:", err);
    return res.status(500).json({ success: false, message: "Internal server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/debit-entry-report/gl-list
// Query Params: brcd
//
// Fetches all GL entries for a branch — used to populate the
// Product Name dropdown
// ─────────────────────────────────────────────────────────────
const getGLList = async (req, res) => {
  try {
    const { brcd = "1" } = req.query;

    const pool = await getPool();

    const result = await pool
      .request()
      .input("brcd", sql.VarChar(10), brcd)
      .query(
        `SELECT SUBGLCODE, GLNAME
         FROM GLMAST
         WHERE BRCD = @brcd
         ORDER BY GLNAME`
      );

    const rows = result.recordset || [];

    return res.status(200).json({
      success:      true,
      brcd,
      totalRecords: rows.length,
      data:         rows,
    });
  } catch (err) {
    console.error("getGLList error:", err);
    return res.status(500).json({ success: false, message: "Internal server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// Core helper — runs the debit entry report query
// Returns: SubGlcode, GlName, Acc No, Cust Name, Opening, Credit, Debit, Closing
// ─────────────────────────────────────────────────────────────
async function runDebitReport({ branchCode, fromDate, subGlCode, productType, productName }) {
  const fdt = parseDate(fromDate);
  if (!fdt) throw new Error("Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD.");

  const pool = await getPool();

  // ── IMPORTANT: Adjust table names and field mappings based on your actual database schema ──
  // 
  // Expected columns to return:
  //   SubGlcode, GlName, AccNo, CustName, Opening, Credit, Debit, Closing
  //
  // This query assumes your database has:
  //   1. GLMAST table with: SUBGLCODE, GLNAME, BRCD
  //   2. Account/Ledger table with account details and transactions
  //
  // REPLACE the table names and JOIN conditions to match your actual schema
  // ─────────────────────────────────────────────────────────────────────

  const result = await pool
    .request()
    .input("subglcode",   sql.VarChar(50),  subGlCode   || "1")
    .input("brcd",        sql.VarChar(10),  branchCode  || "1")
    .input("fromDate",    sql.VarChar(20),  fdt)
    .query(
      `
      -- *** CUSTOMIZE THIS QUERY FOR YOUR DATABASE ***
      -- This is a template. Adjust table names, column names, and joins to match your schema.
      
      SELECT 
        g.SUBGLCODE AS SubGlcode,
        g.GLNAME AS GlName,
        a.ACCNO AS AccNo,
        a.CUSTNAME AS CustName,
        ISNULL(a.OPENING, 0) AS Opening,
        ISNULL(SUM(CASE WHEN t.TRNTYPE = 'C' THEN t.AMOUNT ELSE 0 END), 0) AS Credit,
        ISNULL(SUM(CASE WHEN t.TRNTYPE = 'D' THEN t.AMOUNT ELSE 0 END), 0) AS Debit,
        (ISNULL(a.OPENING, 0) + 
         ISNULL(SUM(CASE WHEN t.TRNTYPE = 'C' THEN t.AMOUNT ELSE 0 END), 0) -
         ISNULL(SUM(CASE WHEN t.TRNTYPE = 'D' THEN t.AMOUNT ELSE 0 END), 0)) AS Closing
      FROM GLMAST g
      LEFT JOIN ACCOUNTS a ON g.SUBGLCODE = a.SUBGLCODE AND g.BRCD = a.BRCD
      LEFT JOIN TRANSACTIONS t ON a.ACCNO = t.ACCNO AND t.TRNDATE >= @fromDate
      WHERE g.SUBGLCODE = @subglcode
        AND g.BRCD = @brcd
      GROUP BY g.SUBGLCODE, g.GLNAME, a.ACCNO, a.CUSTNAME, a.OPENING
      ORDER BY a.ACCNO
      `
    );

  return { data: result.recordset || [], fdt };
}

// ─────────────────────────────────────────────────────────────
// GET /api/debit-entry-report
// Query Params: branchCode, fromDate, subGlCode, productType,
//               productName, reportName, action
// ─────────────────────────────────────────────────────────────
const getDebitEntryReport = async (req, res) => {
  try {
    const {
      branchCode  = "1",
      fromDate,
      subGlCode   = "1",
      productType = "",
      productName = "",
      reportName,
    } = req.query;

    if (!fromDate) {
      return res.status(400).json({ success: false, message: "fromDate is required." });
    }

    const { data, fdt } = await runDebitReport({ branchCode, fromDate, subGlCode, productType, productName });

    return res.status(200).json({
      success:      true,
      reportName:   reportName || "DebitEntryReport",
      fromDate:     fdt,
      branchCode,
      subGlCode,
      productType,
      productName,
      totalRecords: data.length,
      data,
    });
  } catch (err) {
    console.error("getDebitEntryReport error:", err);
    const status = err.message.includes("Invalid date") ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/debit-entry-report/download
// Body: { branchCode, fromDate, subGlCode, productType,
//         productName, reportName, format }
// ─────────────────────────────────────────────────────────────
const downloadDebitEntryReport = async (req, res) => {
  try {
    const {
      branchCode  = "1",
      fromDate,
      subGlCode   = "1",
      productType = "",
      productName = "",
      reportName,
      format      = "excel",
    } = req.body;

    if (!fromDate) {
      return res.status(400).json({ success: false, message: "fromDate is required." });
    }

    const { data, fdt } = await runDebitReport({ branchCode, fromDate, subGlCode, productType, productName });

    return res.status(200).json({
      success:      true,
      reportName:   reportName || "DebitEntryReport",
      fromDate:     fdt,
      branchCode,
      subGlCode,
      productType,
      productName,
      format,
      totalRecords: data.length,
      data,
    });
  } catch (err) {
    console.error("downloadDebitEntryReport error:", err);
    const status = err.message.includes("Invalid date") ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/debit-entry-report/print
// Body: same as download — client triggers window.print()
// ─────────────────────────────────────────────────────────────
const printDebitEntryReport = async (req, res) => {
  return downloadDebitEntryReport(req, res);
};

module.exports = {
  getGLName,
  getGLList,
  getDebitEntryReport,
  downloadDebitEntryReport,
  printDebitEntryReport,
};