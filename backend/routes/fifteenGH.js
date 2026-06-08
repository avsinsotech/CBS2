const express = require('express');
const router = express.Router();
const fifteenGHController = require('../controllers/fifteenGHController');

/**
 * @swagger
 * /api/15gh-submit-report:
 *   get:
 *     tags: [15-GH Submit Report]
 *     summary: 15-G/H Submit Report (AVS5092 direct query)
 *     description: |
 *       Fetches 15-G/H submission records from AVS5092 joined with UserMaster and Master tables.
 *       Pass mode=text to get a plain-text fixed-width report.
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-04-01"
 *         description: Submit date range start (YYYY-MM-DD)
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-07-26"
 *         description: Submit date range end (YYYY-MM-DD)
 *       - in: query
 *         name: fromCustNo
 *         required: false
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Starting customer number (default 1)
 *       - in: query
 *         name: toCustNo
 *         required: false
 *         schema:
 *           type: string
 *           example: "999999999"
 *         description: Ending customer number (default 999999999)
 *       - in: query
 *         name: brcd
 *         required: false
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code filter (omit or use 0000 for all branches)
 *       - in: query
 *         name: mode
 *         required: false
 *         schema:
 *           type: string
 *           enum: [json, text]
 *           example: "json"
 *         description: Response mode — json (default) or text (plain-text report)
 *     responses:
 *       200:
 *         description: Report data (JSON or plain-text depending on mode)
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Database error
 */
router.get('/', fifteenGHController.get15GHSubmitReport);

module.exports = router;
