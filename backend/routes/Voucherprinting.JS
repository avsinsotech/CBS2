const express = require('express');
const router = express.Router();
const { getVoucherPrinting } = require('../controllers/voucherPrintingController');

/**
 * @swagger
 * /api/voucher-printing:
 *   get:
 *     summary: Get Voucher Printing Report
 *     description: Retrieves voucher printing details filtered by branch, date, and optional set number
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch Code (e.g., '1')
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *         description: Date in DD/MM/YYYY format
 *       - in: query
 *         name: setNo
 *         required: false
 *         schema:
 *           type: string
 *         description: Set Number (optional filter)
 *       - in: query
 *         name: reportType
 *         required: true
 *         schema:
 *           type: string
 *           enum: ['dr', 'transfer']
 *         description: |
 *           Report Type:
 *           - 'dr' = DR (RptVoucherPrinting)
 *           - 'transfer' = Transfer (RptVoucherPrintingCrDr)
 *     responses:
 *       200:
 *         description: Voucher Printing report data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad request - missing or invalid parameters
 *       500:
 *         description: Internal server error
 */
router.get('/', getVoucherPrinting);

module.exports = router;