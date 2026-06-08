const express = require('express');
const router = express.Router();
const crarReportController = require('../controllers/crarReportController');

/**
 * @swagger
 * /api/crar-report:
 *   post:
 *     tags: [CRAR Report]
 *     summary: Retrieve CRAR Report
 *     description: Executes ISP_CRAR stored procedure.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branchCode:
 *                 type: string
 *                 example: "1"
 *               asOnDate:
 *                 type: string
 *                 example: "2025-07-26"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/', crarReportController.getCrarReport);
router.get('/text-report-view', crarReportController.getCrarTextReport);

module.exports = router;
