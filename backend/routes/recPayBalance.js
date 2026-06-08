const express = require('express');
const router = express.Router();
const recPayBalanceController = require('../controllers/recPayBalanceController');

/**
 * @swagger
 * tags:
 *   name: Receipt & Payment With Balance Report
 *   description: Receipt & Payment With Balance Report Management
 */

// ==================== ENGLISH ====================

/**
 * @swagger
 * /api/rec-pay-balance/english:
 *   get:
 *     summary: English - Print Report (RptRecPayCLBal)
 *     tags: [Receipt & Payment With Balance Report]
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
router.get('/english', recPayBalanceController.english);

// ==================== MARATHI ====================

/**
 * @swagger
 * /api/rec-pay-balance/marathi:
 *   get:
 *     summary: Marathi - Print Report (RptRecPayCLBal_Marathi)
 *     tags: [Receipt & Payment With Balance Report]
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
router.get('/marathi', recPayBalanceController.marathi);

// ==================== SKIP DATA ====================

/**
 * @swagger
 * /api/rec-pay-balance/skip-data:
 *   get:
 *     summary: Skip Data - Print Report (RptRecPayCLBal_SkipData)
 *     tags: [Receipt & Payment With Balance Report]
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
router.get('/skip-data', recPayBalanceController.skipData);

module.exports = router;
