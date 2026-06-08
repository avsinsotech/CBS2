const express = require('express');
const router = express.Router();
const siReportController = require('../controllers/siReportController');

router.post('/', siReportController.getSiReport);
router.post('/report', siReportController.getSiReport);
router.get('/text-report-view', siReportController.getSiTextReportView);

module.exports = router;
