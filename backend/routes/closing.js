const express = require('express');
const router = express.Router();
const closingController = require('../controllers/closingController');

/**
 * @swagger
 * /api/closing:
 *   get:
 *     tags: [Closing]
 *     summary: Execute SP_Closing
 *     parameters:
 *       - in: query
 *         name: brcd
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: Branch code
 *       - in: query
 *         name: gl
 *         required: true
 *         schema:
 *           type: string
 *           example: "1"
 *         description: GL code
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
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.get('/', closingController.getClosing);

module.exports = router;
