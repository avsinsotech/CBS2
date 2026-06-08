const express = require('express');
const router = express.Router();
const ctrReportController = require('../controllers/ctrReportController');

/**
 * @swagger
 * /api/ctr-report/risk-category-update:
 *   post:
 *     tags: [CTR Report]
 *     summary: Update CTR Customer Risk Category
 *     description: Executes USP_CTR_CUSTOMER_RiskCategory stored procedure.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromBrcd:
 *                 type: string
 *                 example: "1"
 *               toBrcd:
 *                 type: string
 *                 example: "2"
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-01"
 *               toDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-26"
 *               fromAmount:
 *                 type: string
 *                 example: "233"
 *               flag:
 *                 type: string
 *                 example: "UPDATE"
 *               mid:
 *                 type: string
 *                 example: "2"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/risk-category-update', ctrReportController.updateRiskCategory);

/**
 * @swagger
 * /api/ctr-report/limit-report:
 *   post:
 *     tags: [CTR Report]
 *     summary: Retrieve CTR Limit Report
 *     description: Executes USP_CTR_CUSTOMER_REPORT stored procedure.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromBrcd:
 *                 type: string
 *                 example: "1"
 *               toBrcd:
 *                 type: string
 *                 example: "2"
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-01"
 *               toDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-26"
 *               fromAmount:
 *                 type: string
 *                 example: "233"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/limit-report', ctrReportController.getCtrLimitReport);

/**
 * @swagger
 * /api/ctr-report/general-report:
 *   post:
 *     tags: [CTR Report]
 *     summary: Retrieve CTR Credit or Debit Report
 *     description: Executes SP_CTRReport stored procedure.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brcd:
 *                 type: string
 *                 example: "1"
 *               flag:
 *                 type: string
 *                 example: "DEBIT"
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-01"
 *               toDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-26"
 *               fsgl:
 *                 type: string
 *                 example: "1"
 *               tsgl:
 *                 type: string
 *                 example: "1"
 *               ctrLimit:
 *                 type: string
 *                 example: "233"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/general-report', ctrReportController.getCtrGeneralReport);

module.exports = router;


