const express = require('express');
const router = express.Router();
const trialBalanceController = require('../controllers/trialBalanceController');

router.get('/', trialBalanceController.getTrialBalance);
router.post('/', trialBalanceController.getTrialBalance);
router.get('/text', trialBalanceController.getTrialBalanceText);

module.exports = router;
