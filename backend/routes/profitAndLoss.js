const express = require('express');
const router = express.Router();
const profitAndLossController = require('../controllers/profitAndLossController');

/**
 * @swagger
 * /api/profit-and-loss/show:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: Show Profit & Loss report (As On Date)
 *     description: Executes SP_ProfitAndLoss for the given branch and as-on date.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: asOnDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: As on date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Profit & Loss report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/show', profitAndLossController.show);

/**
 * @swagger
 * /api/profit-and-loss/profit-loss-report:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: Profit Loss Report (As On Date) with log entry
 *     description: Inserts a log entry via SP_LOGDETAILS and then executes SP_ProfitAndLoss.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: asOnDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: As on date in YYYY-MM-DD format
 *       - in: query
 *         name: vid
 *         schema:
 *           type: string
 *           default: "2"
 *           example: "2"
 *         description: VID parameter for log
 *       - in: query
 *         name: mid
 *         schema:
 *           type: string
 *           default: "2"
 *           example: "2"
 *         description: MID parameter for log
 *     responses:
 *       200:
 *         description: Profit & Loss report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/profit-loss-report', profitAndLossController.profitLossReport);

/**
 * @swagger
 * /api/profit-and-loss/text-report-view:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: Text Report View (As On Date)
 *     description: Executes SP_ProfitAndLoss for text report viewing.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: asOnDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: As on date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Profit & Loss text report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/text-report-view', profitAndLossController.textReportView);

/**
 * @swagger
 * /api/profit-and-loss/report-with-working-day:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: Report With Working Day (As On Date)
 *     description: Executes SP_ProfitAndLoss_day for working-day based report.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: asOnDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: As on date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Profit & Loss working day report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/report-with-working-day', profitAndLossController.reportWithWorkingDay);

// ==================== N FORM PL ====================

/**
 * @swagger
 * /api/profit-and-loss/nform-profit-loss-report:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: N Form PL - Profit Loss Report
 *     description: Executes RptPNProfitAndLoss for N Form Profit & Loss report.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: From date in YYYY-MM-DD format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-19"
 *         description: To date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: N Form Profit & Loss report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/nform-profit-loss-report', profitAndLossController.nFormProfitLossReport);

/**
 * @swagger
 * /api/profit-and-loss/nform-text-report-view:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: N Form PL - Text Report View
 *     description: Executes RptPNProfitAndLoss for N Form text report viewing.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: From date in YYYY-MM-DD format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-19"
 *         description: To date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: N Form Profit & Loss text report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/nform-text-report-view', profitAndLossController.nFormTextReportView);

// ==================== INCOME / EXPENDITURE ====================

/**
 * @swagger
 * /api/profit-and-loss/income-exp-profit-loss-report:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: Income/Expenditure - Profit Loss Report
 *     description: Executes RptIncomeExpReport for Income/Expenditure profit loss report.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: From date in YYYY-MM-DD format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-25"
 *         description: To date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Income/Expenditure report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/income-exp-profit-loss-report', profitAndLossController.incomeExpProfitLossReport);

/**
 * @swagger
 * /api/profit-and-loss/income-exp-text-report-view:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: Income/Expenditure - Text Report View
 *     description: Executes RptIncomeExpReport for Income/Expenditure text report viewing.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: From date in YYYY-MM-DD format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-25"
 *         description: To date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Income/Expenditure text report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/income-exp-text-report-view', profitAndLossController.incomeExpTextReportView);

/**
 * @swagger
 * /api/profit-and-loss/income-exp-int-paid-report:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: Income/Expenditure - Int Paid Report
 *     description: Executes RptIncomeExpReport_IntHead for Interest Paid report.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: From date in YYYY-MM-DD format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-25"
 *         description: To date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Interest Paid report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/income-exp-int-paid-report', profitAndLossController.incomeExpIntPaidReport);

// ==================== ADMIN EXPENSES ====================

/**
 * @swagger
 * /api/profit-and-loss/admin-exp-profit-loss-report:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: Admin Expenses - Profit Loss Report
 *     description: Executes ISP_AVS0106 for Admin Expenses profit loss report.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: From date in YYYY-MM-DD format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-25"
 *         description: To date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Admin Expenses report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/admin-exp-profit-loss-report', profitAndLossController.adminExpProfitLossReport);

/**
 * @swagger
 * /api/profit-and-loss/admin-exp-text-report-view:
 *   get:
 *     tags: [Profit and Loss]
 *     summary: Admin Expenses - Text Report View
 *     description: Executes ISP_AVS0106 for Admin Expenses text report viewing.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: From date in YYYY-MM-DD format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-25"
 *         description: To date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Admin Expenses text report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/admin-exp-text-report-view', profitAndLossController.adminExpTextReportView);

module.exports = router;