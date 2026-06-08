const express = require('express');
const router = express.Router();
const branchWiseGLController = require('../controllers/branchWiseGLController');

/**
 * @swagger
 * tags:
 *   name: BranchWise GL Report
 *   description: BranchWise GL Report Management
 */

// ==================== DETAILS ====================

/**
 * @swagger
 * /api/branch-wise-gl/details:
 *   get:
 *     summary: Details / Report Print (RptOfficeGLDetails)
 *     tags: [BranchWise GL Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: pat
 *         required: true
 *         schema: { type: string }
 *         description: Product Type
 *       - in: query
 *         name: PFDT
 *         required: true
 *         schema: { type: string }
 *         description: From Date (YYYY-MM-DD)
 *       - in: query
 *         name: PTDT
 *         required: true
 *         schema: { type: string }
 *         description: To Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/details', branchWiseGLController.details);

// ==================== DETAILS / OPENING-CLOSING ====================

/**
 * @swagger
 * /api/branch-wise-gl/details-opening-closing:
 *   get:
 *     summary: Details / Opening-Closing Details (RptOfficeGLDetails_B)
 *     tags: [BranchWise GL Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: pat
 *         required: true
 *         schema: { type: string }
 *         description: Product Type
 *       - in: query
 *         name: PFDT
 *         required: true
 *         schema: { type: string }
 *         description: From Date (YYYY-MM-DD)
 *       - in: query
 *         name: PTDT
 *         required: true
 *         schema: { type: string }
 *         description: To Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/details-opening-closing', branchWiseGLController.detailsOpeningClosing);

// ==================== DATEWISE ====================

/**
 * @swagger
 * /api/branch-wise-gl/datewise:
 *   get:
 *     summary: DateWise Report (RptBrWiseGLDetails)
 *     tags: [BranchWise GL Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: SubGlCode
 *         required: true
 *         schema: { type: string }
 *         description: Sub GL Code
 *       - in: query
 *         name: FromDate
 *         required: true
 *         schema: { type: string }
 *         description: From Date (YYYY-MM-DD)
 *       - in: query
 *         name: ToDate
 *         required: true
 *         schema: { type: string }
 *         description: To Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/datewise', branchWiseGLController.dateWise);

// ==================== SUMMARY ====================

/**
 * @swagger
 * /api/branch-wise-gl/summary:
 *   get:
 *     summary: Summary Report (Isp_AVS0010)
 *     tags: [BranchWise GL Report]
 *     parameters:
 *       - in: query
 *         name: Brcd
 *         required: true
 *         schema: { type: string }
 *         description: Branch Code
 *       - in: query
 *         name: SubGlCode
 *         required: true
 *         schema: { type: string }
 *         description: Sub GL Code
 *       - in: query
 *         name: FromDate
 *         required: true
 *         schema: { type: string }
 *         description: From Date (YYYY-MM-DD)
 *       - in: query
 *         name: ToDate
 *         required: true
 *         schema: { type: string }
 *         description: To Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Server error
 */
router.get('/summary', branchWiseGLController.summary);

module.exports = router;
