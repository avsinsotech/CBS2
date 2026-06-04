const { getPool, sql } = require("../config/db");

/**
 * Helper: normalize date to YYYY-MM-DD
 * Accepts DD/MM/YYYY or YYYY-MM-DD
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
 * Helper: convert to 'Y' or 'N'
 */
function toYN(val) {
  if (val === true || val === "true" || val === "Y" || val === "1") return "Y";
  return "N";
}

/**
 * GET /api/daybook
 *
 * Query Params:
 *   asOnDate        - DD/MM/YYYY or YYYY-MM-DD  (required)
 *   branchCode      - string, default '1'
 *   reportType      - 'details' | 'summary' | 'setwisedetails' | 'productwise' | 'alldetails'
 *   skipDailyAc     - Y/N  (maps to @SKIP_DAILY)
 *   skipIntAc       - Y/N  (maps to @SKIP_INT)
 *   skipPayable     - Y/N  (maps to @SKIP_Payable)
 *   skipReceiveable - Y/N  (maps to @SKIP_Receivable)
 *
 * SP Signatures (from actual DB):
 *   RptDayBookRegisterDetails      (@BranchID, @SKIP_DAILY, @SKIP_INT, @AsonDate, @SKIP_Payable='N', @SKIP_Receivable='N')
 *   RptDayBookRegister             (@BranchID, @SKIP_DAILY, @SKIP_INT, @AsonDate, @SKIP_Payable='N', @SKIP_Receivable='N')
 *   RptDayBookRegistrerDetailsSetWise (@BranchID, @SKIP_DAILY, @SKIP_INT, @AsonDate, @SKIP_Payable='N', @SKIP_Receivable='N')
 *   RptCashPostionReport_Day       (@BranchCode, @Type='OP', @AsonDate)  ← different!
 *   RptDayBookDetailsCrDr          (@BranchID, @SKIP_DAILY, @SKIP_INT, @AsonDate, @SKIP_Payable='N', @SKIP_Receivable='N')
 */
const getDayBook = async (req, res) => {
  try {
    const {
      asOnDate,
      branchCode   = "1",
      reportType   = "details",
      skipDailyAc  = "N",
      skipIntAc    = "N",
      skipPayable  = "N",
      skipReceiveable = "N",
    } = req.query;

    // ── Validation ────────────────────────────────────────────────
    if (!asOnDate) {
      return res.status(400).json({ success: false, message: "asOnDate is required." });
    }

    const dt = parseDate(asOnDate);
    if (!dt) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use DD/MM/YYYY or YYYY-MM-DD.",
      });
    }

    const SKIP_DAILY = toYN(skipDailyAc);
    const SKIP_INT   = toYN(skipIntAc);
    const SKIP_PAY   = toYN(skipPayable);
    const SKIP_REC   = toYN(skipReceiveable);

    const pool = await getPool();
    let result;

    switch (reportType.toLowerCase()) {

      /**
       * Details
       * Exec RptDayBookRegisterDetails '1','N','N','2026-03-30','N','N'
       * Params: @BranchID, @SKIP_DAILY, @SKIP_INT, @AsonDate, @SKIP_Payable, @SKIP_Receivable
       */
      case "details":
        result = await pool.request()
          .input("BranchID",        sql.VarChar(6),  branchCode)
          .input("SKIP_DAILY",      sql.VarChar(6),  SKIP_DAILY)
          .input("SKIP_INT",        sql.VarChar(6),  SKIP_INT)
          .input("AsonDate",        sql.DateTime,    new Date(dt))
          .input("SKIP_Payable",    sql.VarChar(6),  SKIP_PAY)
          .input("SKIP_Receivable", sql.VarChar(6),  SKIP_REC)
          .execute("RptDayBookRegisterDetails");
        break;

      /**
       * Summary
       * Exec RptDayBookRegister '1','N','N','2026-03-30','N','N'
       * Params: @BranchID, @SKIP_DAILY, @SKIP_INT, @AsonDate, @SKIP_Payable, @SKIP_Receivable
       */
      case "summary":
        result = await pool.request()
          .input("BranchID",        sql.VarChar(6),  branchCode)
          .input("SKIP_DAILY",      sql.VarChar(6),  SKIP_DAILY)
          .input("SKIP_INT",        sql.VarChar(6),  SKIP_INT)
          .input("AsonDate",        sql.DateTime,    new Date(dt))
          .input("SKIP_Payable",    sql.VarChar(6),  SKIP_PAY)
          .input("SKIP_Receivable", sql.VarChar(6),  SKIP_REC)
          .execute("RptDayBookRegister");
        break;

      /**
       * SetWise Details
       * Exec RptDayBookRegistrerDetailsSetWise '1','N','N','2026-03-30','N','N'
       * Params: @BranchID, @SKIP_DAILY, @SKIP_INT, @AsonDate, @SKIP_Payable, @SKIP_Receivable
       */
      case "setwisedetails":
        result = await pool.request()
          .input("BranchID",        sql.VarChar(6),  branchCode)
          .input("SKIP_DAILY",      sql.VarChar(6),  SKIP_DAILY)
          .input("SKIP_INT",        sql.VarChar(6),  SKIP_INT)
          .input("AsonDate",        sql.DateTime,    new Date(dt))
          .input("SKIP_Payable",    sql.VarChar(6),  SKIP_PAY)
          .input("SKIP_Receivable", sql.VarChar(6),  SKIP_REC)
          .execute("RptDayBookRegistrerDetailsSetWise");
        break;

      /**
       * ProductWise
       * Exec RptCashPostionReport_Day '1','OP','2026-03-30'
       * Params: @BranchCode, @Type, @AsonDate
       * NOTE: No skip params — completely different SP signature
       */
      case "productwise":
        result = await pool.request()
          .input("BranchCode", sql.VarChar(6),  branchCode)
          .input("Type",       sql.VarChar(6),  "OP")
          .input("AsonDate",   sql.DateTime,    new Date(dt))
          .execute("RptCashPostionReport_Day");
        break;

      /**
       * ALL Details (Cr/Dr)
       * Exec RptDayBookDetailsCrDr '1','N','N','2026-03-30','N','N'
       * Params: @BranchID, @SKIP_DAILY, @SKIP_INT, @AsonDate, @SKIP_Payable, @SKIP_Receivable
       */
      case "alldetails":
        result = await pool.request()
          .input("BranchID",        sql.VarChar(6),  branchCode)
          .input("SKIP_DAILY",      sql.VarChar(6),  SKIP_DAILY)
          .input("SKIP_INT",        sql.VarChar(6),  SKIP_INT)
          .input("AsonDate",        sql.DateTime,    new Date(dt))
          .input("SKIP_Payable",    sql.VarChar(6),  SKIP_PAY)
          .input("SKIP_Receivable", sql.VarChar(6),  SKIP_REC)
          .execute("RptDayBookDetailsCrDr");
        break;

      default:
        return res.status(400).json({
          success: false,
          message: `Invalid reportType '${reportType}'. Valid values: details | summary | setwisedetails | productwise | alldetails`,
        });
    }

    const data = result.recordsets[0] || [];

    return res.status(200).json({
      success: true,
      reportType,
      branchCode,
      asOnDate: dt,
      skipDailyAc: SKIP_DAILY,
      skipIntAc:   SKIP_INT,
      skipPayable: SKIP_PAY,
      skipReceiveable: SKIP_REC,
      totalRecords: data.length,
      data,
    });

  } catch (err) {
    console.error("getDayBook error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

module.exports = { getDayBook };