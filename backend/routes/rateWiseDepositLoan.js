const express = require('express');
const router = express.Router();
const controller = require('../controllers/rateWiseDepositLoanController');

router.get('/', controller.getRateWiseDepositLoanReport);

module.exports = router;
