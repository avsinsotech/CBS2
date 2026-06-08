const express = require('express');
const router = express.Router();
const trialBalanceController = require('../controllers/trialBalanceController');

/**
 * @swagger
 * /api/trial-balance/report:
 *   get:
 *     tags: [Trial Balance]
 *     summary: Trial Balance Report
 *     description: Executes SP_TRAILBALANCE_1 for Trial Balance report (Code Wise or Name Wise).
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: false
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
 *           example: "2025-04-01"
 *         description: From date in YYYY-MM-DD format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-07-25"
 *         description: To date in YYYY-MM-DD format
 *       - in: query
 *         name: codeOrName
 *         required: false
 *         schema:
 *           type: string
 *           enum: [C, N]
 *           example: "C"
 *         description: Code Wise (C) or Name Wise (N)
 *     responses:
 *       200:
 *         description: Trial Balance report data
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
router.get('/report', trialBalanceController.getTrialBalanceReport);

module.exports = router;
