const express = require('express');
const router = express.Router();
const cuteBookDetailsController = require('../controllers/cuteBookDetailsController');

/**
 * @swagger
 * /api/cute-book-details:
 *   get:
 *     tags: [Cute Book Details]
 *     summary: Execute RptCuteBookDetails_SUM
 *     parameters:
 *       - in: query
 *         name: brcd
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: subglcode
 *         required: false
 *         schema:
 *           type: string
 *           example: ""
 *         description: Sub GL Code
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         description: From date in YYYY-MM-DD format
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-25"
 *         description: To date in YYYY-MM-DD format
 *       - in: query
 *         name: custtype
 *         required: false
 *         schema:
 *           type: string
 *           example: "0"
 *         description: Customer type (default 0)
 *       - in: query
 *         name: acctype
 *         required: false
 *         schema:
 *           type: string
 *           example: "0"
 *         description: Account type (default 0)
 *       - in: query
 *         name: flag
 *         required: false
 *         schema:
 *           type: string
 *           example: ""
 *         description: Flag parameter
 *       - in: query
 *         name: amount
 *         required: false
 *         schema:
 *           type: number
 *           example: 0
 *         description: Amount filter
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.get('/', cuteBookDetailsController.getCuteBookDetails);
router.get('/text-report-view', cuteBookDetailsController.getCuteBookTextReportView);

module.exports = router;
