const express = require('express');
const router = express.Router();
const controller = require('../controllers/goldLoanSanctionController');

router.get('/', controller.getGoldLoanSanctionReport);

module.exports = router;
