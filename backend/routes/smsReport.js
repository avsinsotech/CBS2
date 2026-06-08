const express = require('express');
const router = express.Router();
const smsReportController = require('../controllers/smsReportController');

/**
 * @swagger
 * /api/sms-report/report:
 *   get:
 *     tags: [SMS Report]
 *     summary: Execute SP_SMSMSTREPORT — JSON response (Report button)
 *     description: Returns structured JSON data from SP_SMSMSTREPORT.
 *     parameters:
 *       - in: query
 *         name: fdate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-04-01"
 *         description: From date
 *       - in: query
 *         name: tdate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-07-26"
 *         description: To date
 *       - in: query
 *         name: fbrcd
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: From branch code
 *       - in: query
 *         name: tbrcd
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: To branch code
 *       - in: query
 *         name: mobile
 *         required: false
 *         schema:
 *           type: string
 *           example: "0"
 *         description: "0 = All, actual number = Specific"
 *     responses:
 *       200:
 *         description: JSON report data
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.get('/report', smsReportController.getSmsMasterReport);

/**
 * @swagger
 * /api/sms-report/text-report-view:
 *   get:
 *     tags: [SMS Report]
 *     summary: Execute SP_SMSMSTREPORT — Plain-text response (Text Report View button)
 *     description: Returns SP_SMSMSTREPORT data formatted as a plain-text fixed-width report.
 *     parameters:
 *       - in: query
 *         name: fdate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-04-01"
 *         description: From date
 *       - in: query
 *         name: tdate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-07-26"
 *         description: To date
 *       - in: query
 *         name: fbrcd
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: From branch code
 *       - in: query
 *         name: tbrcd
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: To branch code
 *       - in: query
 *         name: mobile
 *         required: false
 *         schema:
 *           type: string
 *           example: "0"
 *         description: "0 = All, actual number = Specific"
 *     responses:
 *       200:
 *         description: Plain-text formatted report
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.get('/text-report-view', smsReportController.getSmsTextReportView);

module.exports = router;
