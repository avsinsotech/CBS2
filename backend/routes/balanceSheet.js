const express = require('express');
const router = express.Router();
const balanceSheetController = require('../controllers/balanceSheetController');

/**
 * @swagger
 * tags:
 *   name: Balance Sheet
 *   description: Balance Sheet Management
 */

// ==================== AS ON DATE ====================

/**
 * @swagger
 * /api/balance-sheet/asondate/show:
 *   get:
 *     summary: As On Date - Show (SP_BALANCESNEW_201704_1 FLAG=N)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *       - in: query
 *         name: PEMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PEYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PEDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/asondate/show', balanceSheetController.asOnDateShow);

/**
 * @swagger
 * /api/balance-sheet/asondate/balancesheetreport:
 *   get:
 *     summary: As On Date - Balance Sheet Report (SP_BALANCESNEW FLAG=N)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/asondate/balancesheetreport', balanceSheetController.asOnDateBalanceSheetReport);

/**
 * @swagger
 * /api/balance-sheet/asondate/reportwithworkingday:
 *   get:
 *     summary: As On Date - Report with Working Day (SP_BALANCESNEW_WORKINGDAY FLAG=N)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/asondate/reportwithworkingday', balanceSheetController.asOnDateReportWithWorkingDay);

/**
 * @swagger
 * /api/balance-sheet/asondate/balancesheetsummary:
 *   get:
 *     summary: As On Date - Balance Sheet Summary (SP_BALANCESNEW_SUM FLAG=N)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/asondate/balancesheetsummary', balanceSheetController.asOnDateBalanceSheetSummary);

// ==================== N-FORMAT ====================

/**
 * @swagger
 * /api/balance-sheet/nformat/show:
 *   get:
 *     summary: N-Format - Show (SP_NFormBS FLAG=Y)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *       - in: query
 *         name: PEMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PEYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PEDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/nformat/show', balanceSheetController.nFormatShow);

/**
 * @swagger
 * /api/balance-sheet/nformat/balancesheetreport:
 *   get:
 *     summary: N-Format - Balance Sheet Report (SP_BALANCESNEW_201704_1 FLAG=N)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *       - in: query
 *         name: PEMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PEYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PEDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/nformat/balancesheetreport', balanceSheetController.nFormatBalanceSheetReport);

// ==================== MARATHI BS ====================

/**
 * @swagger
 * /api/balance-sheet/marathibs/show:
 *   get:
 *     summary: Marathi BS - Show (SP_BALANCESNEW_201704_1 FLAG=Y)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *       - in: query
 *         name: PEMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PEYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PEDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/marathibs/show', balanceSheetController.marathiBSShow);

/**
 * @swagger
 * /api/balance-sheet/marathibs/balancesheetreport:
 *   get:
 *     summary: Marathi BS - Balance Sheet Report (SP_BALANCES_Marathi FLAG=Y)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/marathibs/balancesheetreport', balanceSheetController.marathiBSBalanceSheetReport);

/**
 * @swagger
 * /api/balance-sheet/marathibs/workingday:
 *   get:
 *     summary: Marathi BS - Working Day (SP_BALANCESNEW_WORKINGDAY FLAG=Y)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/marathibs/workingday', balanceSheetController.marathiBSWorkingDay);

// ==================== N-FORMAT MARATHI BS ====================

/**
 * @swagger
 * /api/balance-sheet/nformatmarathi/show:
 *   get:
 *     summary: N-Format Marathi BS - Show (SP_NFormBS FLAG=Y)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *       - in: query
 *         name: PEMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PEYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PEDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/nformatmarathi/show', balanceSheetController.nFormatMarathiShow);

/**
 * @swagger
 * /api/balance-sheet/nformatmarathi/balancesheetreport:
 *   get:
 *     summary: N-Format Marathi BS - Balance Sheet Report (SP_NFormBS FLAG=Y)
 *     tags: [Balance Sheet]
 *     parameters:
 *       - in: query
 *         name: PBRCD
 *         schema: { type: string }
 *       - in: query
 *         name: PFMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PFYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PFDATE
 *         schema: { type: string }
 *       - in: query
 *         name: PEMONTH
 *         schema: { type: string }
 *       - in: query
 *         name: PEYEAR
 *         schema: { type: string }
 *       - in: query
 *         name: PEDATE
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/nformatmarathi/balancesheetreport', balanceSheetController.nFormatMarathiBalanceSheetReport);

module.exports = router;
