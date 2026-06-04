const express = require('express');
const router = express.Router();
const controller = require('../controllers/tdsReportController');

router.post('/report', controller.getTdsReport);
router.get('/text-report-view', controller.getTdsTextReport);

module.exports = router;
