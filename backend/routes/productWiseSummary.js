const express = require('express');
const router = express.Router();
const controller = require('../controllers/productWiseSummaryController');

/**
 * @swagger
 * /api/product-wise-summary/report/details:
 *   get:
 *     summary: Report Print - Details
 *     tags: [Product Wise Summary]
 *     parameters:
 *       - in: query
 *         name: pfmonth
 *         schema: { type: string, example: "04" }
 *       - in: query
 *         name: ptmonth
 *         schema: { type: string, example: "03" }
 *       - in: query
 *         name: PFDT
 *         schema: { type: string, format: date, example: "2025-04-01" }
 *       - in: query
 *         name: PTDT
 *         schema: { type: string, format: date, example: "2026-03-30" }
 *       - in: query
 *         name: pfyear
 *         schema: { type: string, example: "2025" }
 *       - in: query
 *         name: ptyear
 *         schema: { type: string, example: "2026" }
 *       - in: query
 *         name: pat
 *         schema: { type: string, example: "1" }
 *       - in: query
 *         name: BRCD
 *         schema: { type: string, example: "1" }
 *       - in: query
 *         name: isMainType
 *         schema: { type: string, example: "N" }
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 100 }
 *         description: Rows per page (default 0 = all rows)
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/report/details', controller.getReportDetails);

/**
 * @swagger
 * /api/product-wise-summary/report/day-wise:
 *   get:
 *     summary: Report Print - Day Wise
 *     tags: [Product Wise Summary]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         schema: { type: string, example: "1" }
 *       - in: query
 *         name: SubGlCode
 *         schema: { type: string, example: "4" }
 *       - in: query
 *         name: FromDate
 *         schema: { type: string, format: date, example: "2025-04-01" }
 *       - in: query
 *         name: ToDate
 *         schema: { type: string, format: date, example: "2026-03-30" }
 *       - in: query
 *         name: isMainType
 *         schema: { type: string, example: "Y" }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/report/day-wise', controller.getReportDayWise);

/**
 * @swagger
 * /api/product-wise-summary/report/month-wise:
 *   get:
 *     summary: Report Print - Month Wise
 *     tags: [Product Wise Summary]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         schema: { type: string, example: "1" }
 *       - in: query
 *         name: SubGlCode
 *         schema: { type: string, example: "4" }
 *       - in: query
 *         name: FromDate
 *         schema: { type: string, format: date, example: "2025-04-01" }
 *       - in: query
 *         name: ToDate
 *         schema: { type: string, format: date, example: "2026-03-30" }
 *       - in: query
 *         name: isMainType
 *         schema: { type: string, example: "Y" }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/report/month-wise', controller.getReportMonthWise);

/**
 * @swagger
 * /api/product-wise-summary/summary/details:
 *   get:
 *     summary: Summary Report Print - Details
 *     tags: [Product Wise Summary]
 *     parameters:
 *       - in: query
 *         name: pfmonth
 *         schema: { type: string, example: "04" }
 *       - in: query
 *         name: ptmonth
 *         schema: { type: string, example: "03" }
 *       - in: query
 *         name: PFDT
 *         schema: { type: string, format: date, example: "2025-04-01" }
 *       - in: query
 *         name: PTDT
 *         schema: { type: string, format: date, example: "2026-03-30" }
 *       - in: query
 *         name: pfyear
 *         schema: { type: string, example: "2025" }
 *       - in: query
 *         name: ptyear
 *         schema: { type: string, example: "2026" }
 *       - in: query
 *         name: pat
 *         schema: { type: string, example: "4" }
 *       - in: query
 *         name: BRCD
 *         schema: { type: string, example: "1" }
 *       - in: query
 *         name: isMainType
 *         schema: { type: string, example: "N" }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/summary/details', controller.getSummaryDetails);

/**
 * @swagger
 * /api/product-wise-summary/summary/day-wise:
 *   get:
 *     summary: Summary Report Print - Day Wise
 *     tags: [Product Wise Summary]
 *     parameters:
 *       - in: query
 *         name: pfmonth
 *         schema: { type: string, example: "04" }
 *       - in: query
 *         name: ptmonth
 *         schema: { type: string, example: "03" }
 *       - in: query
 *         name: PFDT
 *         schema: { type: string, format: date, example: "2025-04-01" }
 *       - in: query
 *         name: PTDT
 *         schema: { type: string, format: date, example: "2026-03-30" }
 *       - in: query
 *         name: pfyear
 *         schema: { type: string, example: "2025" }
 *       - in: query
 *         name: ptyear
 *         schema: { type: string, example: "2026" }
 *       - in: query
 *         name: pat
 *         schema: { type: string, example: "4" }
 *       - in: query
 *         name: BRCD
 *         schema: { type: string, example: "1" }
 *       - in: query
 *         name: isMainType
 *         schema: { type: string, example: "N" }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/summary/day-wise', controller.getSummaryDayWise);

/**
 * @swagger
 * /api/product-wise-summary/summary/month-wise:
 *   get:
 *     summary: Summary Report Print - Month Wise
 *     tags: [Product Wise Summary]
 *     parameters:
 *       - in: query
 *         name: pfmonth
 *         schema: { type: string, example: "04" }
 *       - in: query
 *         name: ptmonth
 *         schema: { type: string, example: "03" }
 *       - in: query
 *         name: PFDT
 *         schema: { type: string, format: date, example: "2025-04-01" }
 *       - in: query
 *         name: PTDT
 *         schema: { type: string, format: date, example: "2026-03-30" }
 *       - in: query
 *         name: pfyear
 *         schema: { type: string, example: "2025" }
 *       - in: query
 *         name: ptyear
 *         schema: { type: string, example: "2026" }
 *       - in: query
 *         name: pat
 *         schema: { type: string, example: "4" }
 *       - in: query
 *         name: BRCD
 *         schema: { type: string, example: "1" }
 *       - in: query
 *         name: isMainType
 *         schema: { type: string, example: "N" }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/summary/month-wise', controller.getSummaryMonthWise);

module.exports = router;
