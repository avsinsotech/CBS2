const express = require('express');
const router = express.Router();
const branchAdjustmentController = require('../controllers/branchAdjustmentController');

/**
 * @swagger
 * tags:
 *   name: Branch Adjustment Report
 *   description: Branch Adjustment Report Management
 */

// ==================== REPORT PRINT ====================

/**
 * @swagger
 * /api/branch-adjustment/report-print:
 *   get:
 *     summary: Report Print (SP_OFFICEACCSTATUS_BrAdj)
 *     tags: [Branch Adjustment Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: PFMONTH
 *         required: true
 *         schema: { type: string }
 *         description: From Month (MM)
 *       - in: query
 *         name: PEMONTH
 *         required: true
 *         schema: { type: string }
 *         description: To Month (MM)
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
 *       - in: query
 *         name: PFYEAR
 *         required: true
 *         schema: { type: string }
 *         description: From Year (YYYY)
 *       - in: query
 *         name: PEYEAR
 *         required: true
 *         schema: { type: string }
 *         description: To Year (YYYY)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/report-print', branchAdjustmentController.reportPrint);

// ==================== TEXT REPORT VIEW ====================

/**
 * @swagger
 * /api/branch-adjustment/text-report-view:
 *   get:
 *     summary: Text Report View (SP_OFFICEACCSTATUS_BrAdj)
 *     tags: [Branch Adjustment Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: PFMONTH
 *         required: true
 *         schema: { type: string }
 *         description: From Month (MM)
 *       - in: query
 *         name: PEMONTH
 *         required: true
 *         schema: { type: string }
 *         description: To Month (MM)
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
 *       - in: query
 *         name: PFYEAR
 *         required: true
 *         schema: { type: string }
 *         description: From Year (YYYY)
 *       - in: query
 *         name: PEYEAR
 *         required: true
 *         schema: { type: string }
 *         description: To Year (YYYY)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/text-report-view', branchAdjustmentController.textReportView);

module.exports = router;
