const express = require('express');
const router = express.Router();
const crrSlrReportController = require('../controllers/crrSlrReportController');

/**
 * @swagger
 * /api/crr-slr-report:
 *   post:
 *     tags: [CRR SLR Report]
 *     summary: Retrieve CRR/SLR/CRR1 Report
 *     description: Executes ISP_CRR, ISP_SLR, or ISP_CRR1 stored procedures.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportType:
 *                 type: string
 *                 example: "CRR"
 *               branchCode:
 *                 type: string
 *                 example: "1"
 *               asOnDate:
 *                 type: string
 *                 example: "2025-04-01"
 *               toDate:
 *                 type: string
 *                 example: "2025-04-30"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/', crrSlrReportController.getCrrSlrReport);
router.get('/text-report-view', crrSlrReportController.getCrrSlrTextReport);

module.exports = router;
