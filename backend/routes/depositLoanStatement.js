const express = require('express');
const router = express.Router();
const controller = require('../controllers/depositLoanStatementController');

router.get('/', controller.getDepositLoanStatement);

module.exports = router;
