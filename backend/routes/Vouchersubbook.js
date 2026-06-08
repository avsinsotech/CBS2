const express = require('express');
const router = express.Router();
const { getVoucherSubBook } = require('../controllers/voucherSubBookController');

/**
 * @swagger
 * /api/voucher-subbook:
 *   get:
 *     summary: Get Voucher SubBook Report
 *     description: Retrieves voucher details filtered by branch, date range, and activity type
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
 *         description: From Date in DD/MM/YYYY format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *         description: To Date in DD/MM/YYYY format
 *       - in: query
 *         name: activityType
 *         required: true
 *         schema:
 *           type: string
 *           enum: ['1', '2', '3', '4']
 *         description: |
 *           Activity Type:
 *           - '1' = Receipt
 *           - '2' = Payment
 *           - '3' = Transfer
 *           - '4' = All Activity
 *     responses:
 *       200:
 *         description: Voucher SubBook report data
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
router.get('/', getVoucherSubBook);

module.exports = router;