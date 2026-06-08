const express = require('express');
const router  = express.Router();
const { getDailyPositionReport } = require('../controllers/dailyPositionReportController');

/**
 * @swagger
 * /api/daily-position-report:
 *   get:
 *     summary: Daily Position Report
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema: { type: string, example: "26/07/2025" }
 *         description: Report date in DD/MM/YYYY format
 *       - in: query
 *         name: amountUnit
 *         required: true
 *         schema: { type: string, enum: [In Thousand, In Lacs, In Crore] }
 *       - in: query
 *         name: textReportName
 *         required: false
 *         schema: { type: string }
 *         description: Label used for file download name (not passed to SP)
 *     responses:
 *       200:
 *         description: Array of daily position rows
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Database error
 */
router.get('/', getDailyPositionReport);

module.exports = router;