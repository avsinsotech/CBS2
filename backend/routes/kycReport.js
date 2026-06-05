const express = require('express');
const router = express.Router();
const kycReportController = require('../controllers/kycReportController');

/**
 * @swagger
 * /api/kyc-report:
 *   post:
 *     tags: [KYC Report]
 *     summary: Retrieve KYC Report or Dump
 *     description: Executes ISP_AVS0140 stored procedure.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flag:
 *                 type: string
 *                 example: "Dump"
 *               tDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-28"
 *               fDate:
 *                 type: string
 *                 format: date
 *                 example: "1900-01-01"
 *               fBrcd:
 *                 type: string
 *                 example: "1"
 *               tBrcd:
 *                 type: string
 *                 example: "9999"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/', kycReportController.getKycReport);

module.exports = router;
