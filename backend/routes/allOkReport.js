const express = require('express');
const router = express.Router();
const allOkReportController = require('../controllers/allOkReportController');

router.get('/', (req, res) => {
    const mode = req.query.mode || 'json';
    if (mode === 'text') {
        return allOkReportController.getAllOkTextReportView(req, res);
    } else {
        return allOkReportController.getAllOkReport(req, res);
    }
});

module.exports = router;
