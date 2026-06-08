const express = require('express');
const router = express.Router();
const glReportController = require('../controllers/glReportController');

/**
 * @swagger
 * /api/gl-report/print:
 *   get:
 *     summary: Retrieve GL Report for printing
 *     description: Fetches GLCODE, SUBGLCODE, GLGROUP, GLNAME, LASTNO from GLMAST where BRCD = '1'
 *     responses:
 *       200:
 *         description: A list of GL Report entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   GLCODE:
 *                     type: string
 *                   SUBGLCODE:
 *                     type: string
 *                   GLGROUP:
 *                     type: string
 *                   GLNAME:
 *                     type: string
 *                   LASTNO:
 *                     type: integer
 *       500:
 *         description: Server error
 */
// Endpoint to get product name by code
router.get('/product-name', glReportController.getProductNameByCode);

// Endpoint for the print button
router.get('/print', glReportController.getGlReportForPrint);

module.exports = router;
