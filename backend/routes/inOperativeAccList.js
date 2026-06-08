const express = require('express');
const router = express.Router();
const inOperativeAccListController = require('../controllers/inOperativeAccListController');

/**
 * @swagger
 * /api/inoperative-acc-list:
 *   post:
 *     tags: [InOperative Account List]
 *     summary: Retrieve InOperative Account List
 *     description: Executes SP_UNOPACCRPT stored procedure.
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
 *               productType:
 *                 type: string
 *                 example: "21"
 *               mode:
 *                 type: string
 *                 example: "Period"
 *               asOnDate:
 *                 type: string
 *                 example: "2025-07-26"
 *               periodMM:
 *                 type: string
 *                 example: "12"
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/', inOperativeAccListController.getInOperativeAccList);
router.get('/text-report-view', inOperativeAccListController.getInOperativeAccListText);

module.exports = router;
