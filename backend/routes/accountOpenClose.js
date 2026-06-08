const express = require('express');
const router = express.Router();
const accountOpenCloseController = require('../controllers/accountOpenCloseController');

router.post('/report', accountOpenCloseController.getAccountOpenCloseReport);
router.get('/text-report-view', accountOpenCloseController.getAccountOpenCloseTextReportView);

module.exports = router;
