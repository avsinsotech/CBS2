const express = require('express');
const router = express.Router();
const controller = require('../controllers/branchWiseDepositLoansController');

router.post('/report', controller.getBranchWiseDepositLoansReport);
router.get('/text-report-view', controller.getBranchWiseDepositLoansTextReport);

module.exports = router;
