const express = require("express");
const router = express.Router();
const {
  getCashBook,
  downloadCashBook,
  printCashBook,
  getCashBookReport,
} = require("../controllers/cashbookController");

/**
 * @route   GET /api/cashbook
 * @desc    Show Cash Book data (Details or Summary)
 * @access  Private
 * @query   fromDate, toDate, branchCode, reportType, reportName
 *
 * Maps to: Show button
 */
router.get("/", getCashBook);

/**
 * @route   GET /api/cashbook/report
 * @desc    Cash Book Report view
 * @access  Private
 * @query   fromDate, toDate, branchCode, reportType, reportName
 *
 * Maps to: Cash Book Report button
 */
router.get("/report", getCashBookReport);

/**
 * @route   POST /api/cashbook/download
 * @desc    Download Cash Book as Excel/PDF/CSV
 * @access  Private
 * @body    { fromDate, toDate, branchCode, reportType, reportName, format }
 *
 * Maps to: Download button
 */
router.post("/download", downloadCashBook);

/**
 * @route   POST /api/cashbook/print
 * @desc    Fetch data for print preview
 * @access  Private
 * @body    { fromDate, toDate, branchCode, reportType, reportName }
 *
 * Maps to: Print button
 */
router.post("/print", printCashBook);

module.exports = router;