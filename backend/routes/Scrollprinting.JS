const express = require("express");
const router = express.Router();

const {
  getScrollDetails,
  getScrollSummary,
  getScrollTextView,
  postScrollTextPrint,
  downloadScrollPrinting,
} = require("../controllers/scrollPrintingController");

/**
 * @swagger
 * tags:
 *   name: ScrollPrinting
 *   description: Scroll Printing (TRANSREPORT) endpoints
 */

/**
 * @swagger
 * /api/scrollprinting/details:
 *   get:
 *     summary: Get scroll printing details report
 *     tags: [ScrollPrinting]
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *         description: Start date DD/MM/YYYY or YYYY-MM-DD
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *         description: End date DD/MM/YYYY or YYYY-MM-DD
 *       - in: query
 *         name: branchCode
 *         schema:
 *           type: string
 *           default: "1"
 *       - in: query
 *         name: subGlCode
 *         schema:
 *           type: string
 *           default: ""
 *       - in: query
 *         name: amount
 *         schema:
 *           type: string
 *           default: "0.00"
 *       - in: query
 *         name: accNo
 *         schema:
 *           type: string
 *           default: ""
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           default: ""
 *       - in: query
 *         name: activity
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: flag
 *         schema:
 *           type: string
 *           default: "0"
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.get("/details", getScrollDetails);

/**
 * @swagger
 * /api/scrollprinting/summary:
 *   get:
 *     summary: Get scroll printing summary report
 *     tags: [ScrollPrinting]
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: branchCode
 *         schema:
 *           type: string
 *           default: "1"
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/summary", getScrollSummary);

/**
 * @swagger
 * /api/scrollprinting/text-view:
 *   get:
 *     summary: Get scroll printing text view report
 *     tags: [ScrollPrinting]
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: branchCode
 *         schema:
 *           type: string
 *           default: "1"
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/text-view", getScrollTextView);

/**
 * @swagger
 * /api/scrollprinting/text-print:
 *   post:
 *     summary: Fetch data for text print
 *     tags: [ScrollPrinting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromDate
 *               - toDate
 *             properties:
 *               fromDate:
 *                 type: string
 *               toDate:
 *                 type: string
 *               branchCode:
 *                 type: string
 *               subGlCode:
 *                 type: string
 *               amount:
 *                 type: string
 *               accNo:
 *                 type: string
 *               type:
 *                 type: string
 *               activity:
 *                 type: integer
 *               flag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/text-print", postScrollTextPrint);

/**
 * @swagger
 * /api/scrollprinting/download:
 *   post:
 *     summary: Download scroll printing report data
 *     tags: [ScrollPrinting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromDate
 *               - toDate
 *             properties:
 *               fromDate:
 *                 type: string
 *               toDate:
 *                 type: string
 *               branchCode:
 *                 type: string
 *               sflag:
 *                 type: string
 *                 enum: [SUMMARY, DETAILS]
 *                 default: DETAILS
 *               format:
 *                 type: string
 *                 enum: [excel, pdf, csv]
 *                 default: excel
 *     responses:
 *       200:
 *         description: Success
 */
router.post("/download", downloadScrollPrinting);

module.exports = router;