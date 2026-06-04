const express = require('express');
const router = express.Router();
const balanceRegisterController = require('../controllers/balanceRegisterController');

/**
 * @swagger
 * /api/balance-register:
 *   get:
 *     summary: Retrieve Balance Register Report
 *     description: Executes the RptBalanceRegisterReport stored procedure.
 *     parameters:
 *       - in: query
 *         name: branchCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: The branch code (e.g., '1')
 *       - in: query
 *         name: glCode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: The GL code (e.g., '1')
 *       - in: query
 *         name: asOnDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-03-30"
 *         description: As on date (e.g., '2026-03-30')
 *     responses:
 *       200:
 *         description: A list of balance register records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/', balanceRegisterController.getBalanceRegisterReport);

module.exports = router;
