
const express = require('express');
const router  = express.Router();
const { getBrWiseDepositLoan } = require('../controllers/brWiseDepositLoanController');

/**
 * @swagger
 * /api/br-wise-deposit-loan:
 *   get:
 *     summary: Branch-Wise Deposit & Loan List
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: asOnDate
 *         required: true
 *         schema: { type: string, example: "26/07/2025" }
 *       - in: query
 *         name: amountUnit
 *         required: true
 *         schema: { type: string, enum: [In Thousand, In Lacs, In Crore] }
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema: { type: string, example: "001" }
 *     responses:
 *       200:
 *         description: Array of branch-wise rows
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Database error
 */
router.get('/', getBrWiseDepositLoan);

module.exports = router;