const express = require("express");
const router  = express.Router();

const {
  getGLName,
  getGLList,
  getDebitEntryReport,
  downloadDebitEntryReport,
  printDebitEntryReport,
} = require("../controllers/debitEntryReportController");

/**
 * @swagger
 * tags:
 *   name: DebitEntryReport
 *   description: Debit Entry Report endpoints (GLMAST)
 */

/**
 * @swagger
 * /api/debit-entry-report/gl-name:
 *   get:
 *     summary: Resolve SUBGLCODE → GLNAME for a branch
 *     tags: [DebitEntryReport]
 *     parameters:
 *       - in: query
 *         name: subglcode
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: brcd
 *         schema: { type: string, default: "1" }
 *     responses:
 *       200:
 *         description: Returns glname string
 *       400:
 *         description: subglcode missing
 *       500:
 *         description: Server error
 */
router.get("/gl-name", getGLName);

/**
 * @swagger
 * /api/debit-entry-report/gl-list:
 *   get:
 *     summary: Get all GL entries for a branch (dropdown population)
 *     tags: [DebitEntryReport]
 *     parameters:
 *       - in: query
 *         name: brcd
 *         schema: { type: string, default: "1" }
 *     responses:
 *       200:
 *         description: Array of { SUBGLCODE, GLNAME }
 */
router.get("/gl-list", getGLList);

/**
 * @swagger
 * /api/debit-entry-report/download:
 *   post:
 *     summary: Download debit entry report data
 *     tags: [DebitEntryReport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromDate]
 *             properties:
 *               branchCode:  { type: string, default: "1" }
 *               fromDate:    { type: string, description: "DD/MM/YYYY or YYYY-MM-DD" }
 *               subGlCode:   { type: string, default: "1" }
 *               productType: { type: string }
 *               productName: { type: string }
 *               reportName:  { type: string }
 *               format:      { type: string, enum: [excel, pdf, csv], default: excel }
 *     responses:
 *       200: { description: Report data }
 *       400: { description: Validation error }
 *       500: { description: Server error }
 */
router.post("/download", downloadDebitEntryReport);

/**
 * @swagger
 * /api/debit-entry-report/print:
 *   post:
 *     summary: Fetch data for print view
 *     tags: [DebitEntryReport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromDate]
 *             properties:
 *               branchCode:  { type: string }
 *               fromDate:    { type: string }
 *               subGlCode:   { type: string }
 *               productType: { type: string }
 *               productName: { type: string }
 *               reportName:  { type: string }
 *     responses:
 *       200: { description: Report data for printing }
 */
router.post("/print", printDebitEntryReport);

/**
 * @swagger
 * /api/debit-entry-report:
 *   get:
 *     summary: Get debit entry report
 *     tags: [DebitEntryReport]
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema: { type: string }
 *         description: DD/MM/YYYY or YYYY-MM-DD
 *       - in: query
 *         name: branchCode
 *         schema: { type: string, default: "1" }
 *       - in: query
 *         name: subGlCode
 *         schema: { type: string, default: "1" }
 *       - in: query
 *         name: productType
 *         schema: { type: string }
 *       - in: query
 *         name: productName
 *         schema: { type: string }
 *       - in: query
 *         name: reportName
 *         schema: { type: string }
 *       - in: query
 *         name: action
 *         schema: { type: string, enum: [submit, print] }
 *     responses:
 *       200: { description: Report data }
 *       400: { description: Validation error }
 *       500: { description: Server error }
 */
router.get("/", getDebitEntryReport);

module.exports = router;