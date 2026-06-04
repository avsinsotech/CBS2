const express = require('express');
const router = express.Router();
const cdRatioReportController = require('../controllers/cdRatioReportController');

/**
 * @swagger
 * /api/cd-ratio-report:
 *   post:
 *     tags: [CD Ratio Report]
 *     summary: Retrieve CD Ratio Report
 *     description: Executes ISP_AVS0104 stored procedure.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flag:
 *                 type: string
 *                 example: "CDR"
 *               brcd:
 *                 type: string
 *                 example: "1"
 *               onDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-26"
 *               flag1:
 *                 type: string
 *                 example: ""
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/', cdRatioReportController.getCdRatioReport);
router.get('/text-report-view', cdRatioReportController.getCdRatioTextReportView);

module.exports = router;

