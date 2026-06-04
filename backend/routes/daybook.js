const express = require("express");
const router = express.Router();
const { getDayBook } = require("../controllers/daybookController");

/**
 * @route   GET /api/daybook
 * @desc    Day Book Report — executes SP based on reportType
 * @access  Private
 *
 * reportType → SP mapping:
 *   details        → RptDayBookRegisterDetails
 *   summary        → RptDayBookRegister
 *   setwisedetails → RptDayBookRegistrerDetailsSetWise
 *   productwise    → RptCashPostionReport_Day
 *   alldetails     → RptDayBookDetailsCrDr
 */
router.get("/", getDayBook);

module.exports = router;