const express = require('express');
const router = express.Router();
const documentRegisterController = require('../controllers/documentRegisterController');

/**
 * @swagger
 * /api/document-register:
 *   post:
 *     tags: [Document Register]
 *     summary: Retrieve Document Register
 *     description: Queries IDENTITY_PROOF table.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromUploadDate:
 *                 type: string
 *                 example: "01/04/2025"
 *               toUploadDate:
 *                 type: string
 *                 example: "30/03/2026"
 *               fromDocCode:
 *                 type: string
 *                 example: ""
 *               toDocCode:
 *                 type: string
 *                 example: ""
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server Error
 */
router.post('/', documentRegisterController.getDocumentRegister);
router.get('/text-report-view', documentRegisterController.getDocumentRegisterText);

module.exports = router;
