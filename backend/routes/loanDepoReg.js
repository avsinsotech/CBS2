const express = require('express');
const router = express.Router();
const loanDepoRegController = require('../controllers/loanDepoRegController');

/**
 * @swagger
 * /api/loan-depo-reg:
 *   get:
 *     tags: [Loan Depo Reg]
 *     summary: Execute SP_LOANDEPOREG
 *     parameters:
 *       - in: query
 *         name: flag
 *         required: true
 *         schema:
 *           type: string
 *           example: "LOAN"
 *         description: Flag parameter
 *       - in: query
 *         name: subglcode
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Sub GL Code
 *       - in: query
 *         name: brcd
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: tdate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.get('/', loanDepoRegController.getLoanDepoReg);

module.exports = router;
