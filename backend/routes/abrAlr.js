const express = require('express');
const router = express.Router();
const abrAlrController = require('../controllers/abrAlrController');

/**
 * @swagger
 * tags:
 *   name: ABR/ALR Report
 *   description: ABR/ALR & MIS Report Management
 */

// ==================== ABR_ALR ====================

/**
 * @swagger
 * /api/abr-alr/abr-alr/print:
 *   get:
 *     summary: ABR_ALR - Print (Isp_AVS0029)
 *     tags: [ABR/ALR Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: FisicalYear
 *         required: true
 *         schema: { type: string }
 *         description: Fiscal Year Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/abr-alr/print', abrAlrController.abrAlrPrint);

/**
 * @swagger
 * /api/abr-alr/abr-alr/text-report-view:
 *   get:
 *     summary: ABR_ALR - Text Report View (Isp_AVS0029)
 *     tags: [ABR/ALR Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: FisicalYear
 *         required: true
 *         schema: { type: string }
 *         description: Fiscal Year Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/abr-alr/text-report-view', abrAlrController.abrAlrTextReportView);

// ==================== MIS REPORT ====================

/**
 * @swagger
 * /api/abr-alr/mis-report/print:
 *   get:
 *     summary: MIS Report - Print (Isp_AVS0029)
 *     tags: [ABR/ALR Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: FisicalYear
 *         required: true
 *         schema: { type: string }
 *         description: Fiscal Year Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/mis-report/print', abrAlrController.misReportPrint);

/**
 * @swagger
 * /api/abr-alr/mis-report/text-report-view:
 *   get:
 *     summary: MIS Report - Text Report View (Isp_AVS0029)
 *     tags: [ABR/ALR Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: FisicalYear
 *         required: true
 *         schema: { type: string }
 *         description: Fiscal Year Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/mis-report/text-report-view', abrAlrController.misReportTextReportView);

/**
 * @swagger
 * /api/abr-alr/mis-report/mis-report:
 *   get:
 *     summary: MIS Report - MIS Report (AVS_MISReport)
 *     tags: [ABR/ALR Report]
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
 *         name: PFYEAR
 *         required: true
 *         schema: { type: string }
 *         description: From Year (YYYY)
 *       - in: query
 *         name: PFDATE
 *         required: true
 *         schema: { type: string }
 *         description: From Date (YYYY-MM-DD)
 *       - in: query
 *         name: PEMONTH
 *         required: true
 *         schema: { type: string }
 *         description: To Month (MM)
 *       - in: query
 *         name: PEYEAR
 *         required: true
 *         schema: { type: string }
 *         description: To Year (YYYY)
 *       - in: query
 *         name: PEDATE
 *         required: true
 *         schema: { type: string }
 *         description: To Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/mis-report/mis-report', abrAlrController.misReport);

module.exports = router;
