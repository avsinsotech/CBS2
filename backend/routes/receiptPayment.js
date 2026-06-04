const express = require('express');
const router = express.Router();
const receiptPaymentController = require('../controllers/receiptPaymentController');

/**
 * @swagger
 * tags:
 *   name: Receipt & Payment Report
 *   description: Receipt & Payment Report Management
 */

/**
 * @swagger
 * /api/receipt-payment/report:
 *   get:
 *     summary: Receipt & Payment Report (RptPLExpensesReport)
 *     tags: [Receipt & Payment Report]
 *     parameters:
 *       - in: query
 *         name: BRCD
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: PFDT
 *         required: true
 *         schema: { type: string }
 *         description: From Date (YYYY-MM-DD)
 *       - in: query
 *         name: PTDT
 *         required: true
 *         schema: { type: string }
 *         description: To Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/report', receiptPaymentController.receiptPaymentReport);

module.exports = router;
